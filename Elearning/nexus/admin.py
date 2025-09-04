from django.contrib import admin
from .models import Lesson, Scene, ApiUsage

@admin.register(Lesson)
class LessonAdmin(admin.ModelAdmin):
    list_display = ('title', 'domain', 'audience', 'status', 'created_by', 'created_at')
    list_filter = ('domain', 'audience', 'status')
    search_fields = ('title', 'text')
    readonly_fields = ('created_at', 'updated_at')


@admin.register(Scene)
class SceneAdmin(admin.ModelAdmin):
    list_display = ('name', 'lesson', 'status', 'created_at')
    list_filter = ('status', )
    search_fields = ('name', 'description', 'prompt')
    readonly_fields = ('created_at', 'updated_at')


@admin.register(ApiUsage)
class ApiUsageAdmin(admin.ModelAdmin):
    list_display = ('api_name', 'endpoint', 'user', 'tokens_used', 'successful', 'created_at')
    list_filter = ('api_name', 'successful')
    search_fields = ('endpoint', 'error_message')
    readonly_fields = ('created_at',)
