from rest_framework import serializers
from .models import Lesson, Scene, ApiUsage


class SceneSerializer(serializers.ModelSerializer):
    class Meta:
        model = Scene
        fields = [
            'id', 'name', 'description', 'prompt', 'model_url', 
            'status', 'error_message', 'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']


class LessonSerializer(serializers.ModelSerializer):
    scenes = SceneSerializer(many=True, read_only=True)
    
    class Meta:
        model = Lesson
        fields = [
            'id', 'title', 'text', 'domain', 'audience', 
            'status', 'created_by', 'created_at', 'updated_at', 'scenes'
        ]
        read_only_fields = ['id', 'created_by', 'created_at', 'updated_at']
    
    def create(self, validated_data):
        """Ensure the current user is set as created_by"""
        validated_data['created_by'] = self.context['request'].user
        return super().create(validated_data)


class ApiUsageSerializer(serializers.ModelSerializer):
    class Meta:
        model = ApiUsage
        fields = '__all__'
        read_only_fields = ['id', 'created_at']


class LessonGenerateSerializer(serializers.Serializer):
    """Serializer for triggering the generation process"""
    lesson_id = serializers.IntegerField()
    
    def validate_lesson_id(self, value):
        """Check that the lesson exists and belongs to current user"""
        try:
            lesson = Lesson.objects.get(id=value)
            if lesson.created_by != self.context['request'].user:
                raise serializers.ValidationError("You don't have permission to generate this lesson")
            return value
        except Lesson.DoesNotExist:
            raise serializers.ValidationError("Lesson not found")
