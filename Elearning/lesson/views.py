from django.shortcuts import render
from rest_framework import generics
from .models import Lesson
from .serializers import LessonSerializer

# Create your views here.
class LessonListCreateView(generics.ListCreateAPIView):
    queryset = Lesson.objects.all()
    serializer_class = LessonSerializer

class LessonDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Lesson.objects.all()
    serializer_class = LessonSerializer