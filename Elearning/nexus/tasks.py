"""
Celery tasks for the Ma-3lena Nexus platform.

This module defines asynchronous tasks that can be queued for background processing.
"""

import logging
import os
from celery import shared_task
from django.conf import settings
from django.utils import timezone

from .models import Lesson, Scene, ApiUsage
from .scene_manager import scene_manager
from .ai_manager import ai_manager
from .storage import storage_manager

# Configure logging
logger = logging.getLogger(__name__)

@shared_task
def process_lesson_task(lesson_id):
    """
    Process a lesson to extract scenes and generate 3D models.
    
    Args:
        lesson_id: The ID of the lesson to process
    """
    logger.info(f"Starting lesson processing task for lesson ID {lesson_id}")
    
    try:
        # Get the lesson
        lesson = Lesson.objects.get(id=lesson_id)
        user_id = lesson.created_by_id
        
        # Update lesson status
        lesson.status = 'processing'
        lesson.save(update_fields=['status'])
        
        # Extract scenes from content
        scenes_data = ai_manager.extract_scenes(lesson.text, user_id)
        
        if not scenes_data:
            logger.error(f"Failed to extract scenes from lesson ID {lesson_id}")
            lesson.status = 'failed'
            lesson.save(update_fields=['status'])
            return False
            
        # Create scene objects
        created_scenes = []
        for scene_data in scenes_data:
            # Refine prompt
            prompt = ai_manager.refine_prompt(
                scene_data.get('description', ''),
                user_id
            )
            
            # Create scene
            scene = scene_manager.create_scene(
                lesson=lesson,
                title=scene_data.get('title', 'Untitled Scene'),
                description=scene_data.get('description', ''),
                source_prompt=prompt,
                metadata={'ai_extracted': True},
                is_generated=False,
                status='pending'
            )
            
            created_scenes.append(scene)
        
        # Queue individual scene generation tasks
        for scene in created_scenes:
            generate_scene_model_task.delay(scene.id)
            
        # Update lesson status
        lesson.status = 'scenes_extracted'
        lesson.save(update_fields=['status'])
        
        return True
        
    except Exception as e:
        logger.exception(f"Error processing lesson {lesson_id}: {str(e)}")
        
        # Update lesson status on error
        try:
            lesson = Lesson.objects.get(id=lesson_id)
            lesson.status = 'failed'
            lesson.save(update_fields=['status'])
        except Exception:
            pass
            
        return False


@shared_task
def generate_scene_model_task(scene_id):
    """
    Generate a 3D model for a scene.
    
    Args:
        scene_id: The ID of the scene to generate a model for
    """
    logger.info(f"Starting 3D model generation for scene ID {scene_id}")
    
    try:
        # Get the scene
        scene = Scene.objects.get(id=scene_id)
        user_id = scene.lesson.owner_id
        
        # Update scene status
        scene.status = 'processing'
        scene.save(update_fields=['status'])
        
        # Get or use refined prompt
        prompt = scene.source_prompt or scene.description
        
        # Generate 3D model
        model_url, metadata = ai_manager.generate_3d_model(prompt, user_id)
        
        if not model_url:
            logger.error(f"Failed to generate 3D model for scene ID {scene_id}")
            scene.status = 'failed'
            scene.save(update_fields=['status'])
            return False
            
        # Update scene with generated model
        scene_manager.update_scene(
            scene,
            model_url=model_url,
            metadata=metadata or scene.metadata,
            is_generated=True,
            status='complete',
            completed_at=timezone.now()
        )
        
        # Check if all scenes in this lesson are complete
        lesson = scene.lesson
        pending_scenes = Scene.objects.filter(
            lesson=lesson,
            status__in=['pending', 'processing']
        ).count()
        
        # If all scenes are complete, update lesson status
        if pending_scenes == 0:
            lesson.status = 'complete'
            lesson.completed_at = timezone.now()
            lesson.save(update_fields=['status', 'completed_at'])
            
        return True
        
    except Exception as e:
        logger.exception(f"Error generating 3D model for scene {scene_id}: {str(e)}")
        
        # Update scene status on error
        try:
            scene = Scene.objects.get(id=scene_id)
            scene.status = 'failed'
            scene.save(update_fields=['status'])
        except Exception:
            pass
            
        return False
