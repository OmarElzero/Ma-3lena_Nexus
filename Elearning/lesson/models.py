from django.db import models

# Create your models here.
class Lesson(models.Model):
    title = models.CharField(max_length=200)
    content = models.TextField()
    category = models.ForeignKey('category.Category', on_delete=models.CASCADE, related_name='lessons')
    
    def __str__(self):
        return self.title