"""
Scene Manager for handling scene operations in Ma-3lena Nexus.
"""

import os
import uuid
import logging
import json
from datetime import datetime
from .storage import storage_manager, download_from_url, get_file_key_from_url
from .models import Scene, Lesson, ApiUsage
from django.db import transaction
from django.conf import settings
from django.core.files.base import ContentFile
from django.utils import timezone

logger = logging.getLogger(__name__)

class SceneManager:
    """
    Manager class for handling scene operations including:
    - Creating scenes
    - Storing 3D model files
    - Managing scene metadata
    - Tracking API usage
    """
    
    def __init__(self):
        """Initialize the scene manager."""
        self.storage = storage_manager
        
    def create_scene(self, lesson, title, description, model_file=None, model_url=None, 
                     metadata=None, is_generated=False, source_prompt=None):
        """
        Create a new scene for a lesson.
        
        Args:
            lesson: The Lesson instance this scene belongs to
            title: Scene title
            description: Scene description
            model_file: Optional model file content (bytes)
            model_url: Optional URL to download the model from
            metadata: Optional scene metadata dict
            is_generated: Whether this scene was AI-generated
            source_prompt: The prompt used to generate this scene
            
        Returns:
            The created Scene object
        """
        try:
            with transaction.atomic():
                # Create basic scene
                scene = Scene(
                    lesson=lesson,
                    name=title,
                    description=description,
                    prompt=source_prompt or "",
                    status='queued'
                )
                
                # Handle model file (either from direct upload or URL)
                if model_file:
                    file_key = f"scenes/{lesson.id}/{uuid.uuid4()}.glb"
                    url = self.storage.upload_file(
                        file_key, 
                        model_file, 
                        content_type='model/gltf-binary'
                    )
                    if url:
                        scene.model_url = url
                        scene.storage_key = file_key
                
                elif model_url:
                    # Download from URL
                    file_data, content_type = download_from_url(model_url)
                    if file_data:
                        file_key = f"scenes/{lesson.id}/{uuid.uuid4()}.glb"
                        url = self.storage.upload_file(
                            file_key,
                            file_data,
                            content_type=content_type or 'model/gltf-binary'
                        )
                        if url:
                            scene.model_url = url
                            scene.storage_key = file_key
                    else:
                        # If download fails, just store the URL
                        scene.model_url = model_url
                
                # Save the scene
                scene.save()
                
                # Track API usage if this was AI-generated
                if is_generated and source_prompt:
                    ApiUsage.objects.create(
                        user=lesson.created_by,
                        api_name='gemini',
                        endpoint='generate_scene',
                        tokens_used=len(source_prompt) // 4,  # Rough estimate
                        successful=True
                    )
                
                return scene
                
        except Exception as e:
            logger.error(f"Error creating scene: {str(e)}")
            raise
    
    def update_scene(self, scene, **kwargs):
        """
        Update an existing scene.
        
        Args:
            scene: The Scene instance to update
            **kwargs: Attributes to update
            
        Returns:
            The updated Scene object
        """
        try:
            with transaction.atomic():
                # Handle model file update if provided
                model_file = kwargs.pop('model_file', None)
                model_url = kwargs.pop('model_url', None)
                
                if model_file:
                    # Delete old file if exists
                    if scene.storage_key:
                        self.storage.delete_file(scene.storage_key)
                    
                    # Upload new file
                    file_key = f"scenes/{scene.lesson.id}/{uuid.uuid4()}.glb"
                    url = self.storage.upload_file(
                        file_key, 
                        model_file, 
                        content_type='model/gltf-binary'
                    )
                    if url:
                        scene.model_url = url
                        scene.storage_key = file_key
                        
                elif model_url and model_url != scene.model_url:
                    # Download from new URL
                    file_data, content_type = download_from_url(model_url)
                    if file_data:
                        # Delete old file if exists
                        if scene.storage_key:
                            self.storage.delete_file(scene.storage_key)
                            
                        file_key = f"scenes/{scene.lesson.id}/{uuid.uuid4()}.glb"
                        url = self.storage.upload_file(
                            file_key,
                            file_data,
                            content_type=content_type or 'model/gltf-binary'
                        )
                        if url:
                            scene.model_url = url
                            scene.storage_key = file_key
                    else:
                        # If download fails, just store the URL
                        scene.model_url = model_url
                
                # Update other fields
                for key, value in kwargs.items():
                    if hasattr(scene, key):
                        setattr(scene, key, value)
                
                scene.save()
                return scene
                
        except Exception as e:
            logger.error(f"Error updating scene: {str(e)}")
            raise
    
    def delete_scene(self, scene):
        """
        Delete a scene and its associated files.
        
        Args:
            scene: The Scene instance to delete
        """
        try:
            # Delete stored file if exists
            if scene.storage_key:
                self.storage.delete_file(scene.storage_key)
            
            # Delete the scene object
            scene.delete()
            
        except Exception as e:
            logger.error(f"Error deleting scene: {str(e)}")
            raise
            
    def get_download_url(self, scene, expiry_seconds=3600):
        """
        Get a temporary download URL for a scene's model file.
        
        Args:
            scene: The Scene instance
            expiry_seconds: How long the URL should be valid for
            
        Returns:
            A pre-signed download URL or None if not available
        """
        if not scene.storage_key:
            # Try to extract key from URL
            key = get_file_key_from_url(scene.model_url)
            if not key:
                return scene.model_url
            scene.storage_key = key
            scene.save(update_fields=['storage_key'])
            
        return self.storage.get_download_url(scene.storage_key, expiry_seconds)

# Initialize global scene manager
scene_manager = SceneManager()
