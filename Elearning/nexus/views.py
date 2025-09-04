from rest_framework import viewsets, permissions, status, filters
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.parsers import MultiPartParser, FormParser, JSONParser
from django_filters.rest_framework import DjangoFilterBackend
from django.shortcuts import get_object_or_404
from django.utils import timezone

from .models import Lesson, Scene, ApiUsage
from .serializers import (
    LessonSerializer, 
    SceneSerializer, 
    ApiUsageSerializer,
    LessonGenerateSerializer
)
from .tasks import process_lesson_task
from .scene_manager import scene_manager
from .ai_manager import ai_manager
from .storage import storage_manager


class LessonViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows lessons to be viewed or edited.
    """
    serializer_class = LessonSerializer
    permission_classes = [permissions.IsAuthenticated]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['domain', 'audience', 'status']
    search_fields = ['title', 'content']
    ordering_fields = ['created_at', 'updated_at', 'title']
    
    def get_queryset(self):
        """Return only the current user's lessons"""
        return Lesson.objects.filter(created_by=self.request.user)
    
    def perform_create(self, serializer):
        """Set the created_by to the current user"""
        serializer.save(created_by=self.request.user)
    
    @action(detail=True, methods=['post'])
    def generate(self, request, pk=None):
        """
        Endpoint to trigger the 3D generation pipeline for a lesson
        """
        lesson = self.get_object()
        
        # Update lesson status
        lesson.status = 'processing'
        lesson.save()
        
        # Queue Celery task
        process_lesson_task.delay(lesson.id)
        
        return Response({
            'message': 'Generation process started',
            'lesson_id': lesson.id
        }, status=status.HTTP_202_ACCEPTED)
    
    @action(detail=True, methods=['post'])
    def extract_scenes(self, request, pk=None):
        """
        Extract scenes from lesson content using AI
        """
        lesson = self.get_object()
        
        if not lesson.text:
            return Response({
                'error': 'Lesson has no content to extract scenes from'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        # Extract scenes using AI manager
        scenes_data = ai_manager.extract_scenes(lesson.text, request.user.id)
        
        if not scenes_data:
            return Response({
                'error': 'Failed to extract scenes'
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
            
        # Create scene objects for each extracted scene
        created_scenes = []
        for scene_data in scenes_data:
            scene = scene_manager.create_scene(
                lesson=lesson,
                title=scene_data.get('name', 'Untitled Scene'),
                description=scene_data.get('description', ''),
                source_prompt=scene_data.get('description', ''),
                is_generated=False
            )
            created_scenes.append(SceneSerializer(scene).data)
        
        return Response({
            'scenes_count': len(created_scenes),
            'scenes': created_scenes
        })


class SceneViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows scenes to be viewed and managed.
    """
    serializer_class = SceneSerializer
    permission_classes = [permissions.IsAuthenticated]
    parser_classes = [MultiPartParser, FormParser, JSONParser]
    filter_backends = [DjangoFilterBackend, filters.OrderingFilter]
    filterset_fields = ['status', 'lesson']
    ordering_fields = ['created_at', 'title']
    
    def get_queryset(self):
        """Return only scenes from the current user's lessons"""
        return Scene.objects.filter(lesson__owner=self.request.user)
    
    def perform_create(self, serializer):
        """Create a new scene using the scene manager"""
        lesson_id = self.request.data.get('lesson')
        lesson = get_object_or_404(Lesson, id=lesson_id, owner=self.request.user)
        
        # Get model file if provided
        model_file = self.request.FILES.get('model_file')
        model_url = self.request.data.get('model_url')
        
        # Create scene using scene manager
        scene = scene_manager.create_scene(
            lesson=lesson,
            title=serializer.validated_data.get('title'),
            description=serializer.validated_data.get('description'),
            model_file=model_file.read() if model_file else None,
            model_url=model_url,
            metadata=serializer.validated_data.get('metadata', {}),
            is_generated=serializer.validated_data.get('is_generated', False),
            source_prompt=serializer.validated_data.get('source_prompt')
        )
        
        # Return the created scene
        return scene
    
    def perform_update(self, serializer):
        """Update a scene using the scene manager"""
        scene = self.get_object()
        
        # Get model file if provided
        model_file = self.request.FILES.get('model_file')
        model_url = self.request.data.get('model_url')
        
        # Update fields
        update_kwargs = {
            key: value for key, value in serializer.validated_data.items()
            if key not in ['model_file', 'model_url']
        }
        
        # Add model content if provided
        if model_file:
            update_kwargs['model_file'] = model_file.read()
        elif model_url:
            update_kwargs['model_url'] = model_url
            
        # Update scene
        updated_scene = scene_manager.update_scene(scene, **update_kwargs)
        return updated_scene
        
    def perform_destroy(self, instance):
        """Delete a scene using the scene manager"""
        scene_manager.delete_scene(instance)
    
    @action(detail=True, methods=['get'])
    def download_url(self, request, pk=None):
        """Get a temporary download URL for the scene model"""
        scene = self.get_object()
        expiry = int(request.query_params.get('expiry_seconds', 3600))
        
        download_url = scene_manager.get_download_url(scene, expiry)
        
        if download_url:
            return Response({
                'download_url': download_url,
                'expires_in': expiry
            })
        else:
            return Response({
                'error': 'Could not generate download URL'
            }, status=status.HTTP_400_BAD_REQUEST)
    
    @action(detail=True, methods=['post'])
    def generate(self, request, pk=None):
        """Generate a 3D model for this scene using AI"""
        scene = self.get_object()
        
        # Get or create prompt
        prompt = request.data.get('prompt') or scene.description
        
        if not prompt:
            return Response({
                'error': 'No prompt provided for generation'
            }, status=status.HTTP_400_BAD_REQUEST)
            
        # Refine prompt if requested
        if request.data.get('refine_prompt', True):
            prompt = ai_manager.refine_prompt(prompt, request.user.id)
            
        # Generate 3D model
        model_url, metadata = ai_manager.generate_3d_model(prompt, request.user.id)
        
        if not model_url:
            return Response({
                'error': 'Failed to generate 3D model'
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
            
        # Update scene with generated model
        scene_manager.update_scene(
            scene,
            model_url=model_url,
            metadata=metadata or scene.metadata,
            is_generated=True,
            source_prompt=prompt,
            status='complete',
            completed_at=timezone.now()
        )
        
        return Response({
            'model_url': model_url,
            'metadata': metadata
        })


class ApiUsageViewSet(viewsets.ReadOnlyModelViewSet):
    """
    API endpoint that allows API usage statistics to be viewed.
    """
    serializer_class = ApiUsageSerializer
    permission_classes = [permissions.IsAuthenticated]
    filter_backends = [DjangoFilterBackend, filters.OrderingFilter]
    filterset_fields = ['api_name', 'lesson', 'scene', 'successful']
    ordering_fields = ['created_at']
    
    def get_queryset(self):
        """Return only the current user's API usage"""
        return ApiUsage.objects.filter(user=self.request.user)
