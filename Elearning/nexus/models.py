from django.db import models
from django.contrib.auth.models import User

class Lesson(models.Model):
    """
    Model representing an educational lesson with content to be processed by AI
    """
    DOMAIN_CHOICES = [
        ('history', 'History'),
        ('biology', 'Biology'),
        ('physics', 'Physics'),
        ('chemistry', 'Chemistry'),
        ('mathematics', 'Mathematics'),
        ('literature', 'Literature'),
        ('other', 'Other'),
    ]
    
    AUDIENCE_CHOICES = [
        ('kids', 'Kids'),
        ('teens', 'Teens'),
        ('college', 'College'),
        ('professional', 'Professional'),
    ]
    
    STATUS_CHOICES = [
        ('draft', 'Draft'),
        ('processing', 'Processing'),
        ('completed', 'Completed'),
        ('error', 'Error'),
    ]
    
    title = models.CharField(max_length=255)
    text = models.TextField(help_text="The lesson content to be processed")
    domain = models.CharField(max_length=20, choices=DOMAIN_CHOICES)
    audience = models.CharField(max_length=20, choices=AUDIENCE_CHOICES)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='draft')
    created_by = models.ForeignKey(User, on_delete=models.CASCADE, related_name='lessons')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    def __str__(self):
        return self.title


class Scene(models.Model):
    """
    Model representing a 3D scene extracted from a lesson
    """
    STATUS_CHOICES = [
        ('queued', 'Queued for Processing'),
        ('extracting', 'Extracting Scene'),
        ('refining', 'Refining Prompt'),
        ('generating', 'Generating 3D Model'),
        ('completed', 'Completed'),
        ('error', 'Error'),
    ]
    
    lesson = models.ForeignKey(Lesson, on_delete=models.CASCADE, related_name='scenes')
    name = models.CharField(max_length=255)
    description = models.TextField()
    prompt = models.TextField(help_text="The refined prompt sent to the 3D generation API")
    model_url = models.URLField(blank=True, null=True, help_text="URL to the generated 3D model")
    storage_key = models.CharField(max_length=255, blank=True, null=True, help_text="Storage key for the 3D model file")
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='queued')
    error_message = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    def __str__(self):
        return f"{self.lesson.title} - {self.name}"


class ApiUsage(models.Model):
    """
    Model to track external API usage and costs
    """
    API_CHOICES = [
        ('gemini', 'Google Gemini API'),
        ('modelslab', 'ModelsLab API'),
    ]
    
    api_name = models.CharField(max_length=50, choices=API_CHOICES)
    endpoint = models.CharField(max_length=255)
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='api_usage')
    lesson = models.ForeignKey(Lesson, on_delete=models.CASCADE, related_name='api_calls', null=True, blank=True)
    scene = models.ForeignKey(Scene, on_delete=models.CASCADE, related_name='api_calls', null=True, blank=True)
    tokens_used = models.IntegerField(default=0)
    successful = models.BooleanField(default=True)
    error_message = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        indexes = [
            models.Index(fields=['api_name', 'created_at']),
            models.Index(fields=['user', 'created_at']),
        ]
    
    def __str__(self):
        return f"{self.api_name} - {self.created_at}"
