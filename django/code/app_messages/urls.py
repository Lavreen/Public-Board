from django.urls import path
from . import views

from django.urls import path, include
from rest_framework.routers import DefaultRouter

app_name = 'app_messages'

# Create a router and register our viewsets with it.
router = DefaultRouter()
router.register(r'actions', views.MessageViewModel, basename="Actions")


urlpatterns = [
    # ex: /app_messages/
    path('', include(router.urls))
]
