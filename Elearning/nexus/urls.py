from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import LessonViewSet, SceneViewSet, ApiUsageViewSet

router = DefaultRouter()
router.register(r'lessons', LessonViewSet, basename='lesson')
router.register(r'scenes', SceneViewSet, basename='scene')
router.register(r'usage', ApiUsageViewSet, basename='api-usage')

urlpatterns = [
    path('', include(router.urls)),
]
