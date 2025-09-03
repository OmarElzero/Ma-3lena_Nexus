from django.contrib import admin
from django.urls import path
from .views import *
urlpatterns = [
    path('lessons/', LessonListCreateView.as_view(), name='Lesson-list-create'),
    path('lessons/<int:pk>/', LessonDetailView.as_view(), name='Lesson-detail'),
]
