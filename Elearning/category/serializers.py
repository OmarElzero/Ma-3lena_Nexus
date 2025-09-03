from rest_framework import serializers
from .models import Category
from lesson.serializers import LessonSerializer

class CategorySerializer(serializers.ModelSerializer):
    lessons = LessonSerializer(many=True, read_only=True)

    class Meta:
        model = Category
        fields = ["id", "name", "description", "lessons"]