from django.urls import path
from .views import home, getImage

urlpatterns = [
    path('', home, name='home'),
    path('getImage/', getImage, name='getImage')
]