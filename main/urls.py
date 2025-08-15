# Arquivo: main/urls.py

from django.urls import path
from . import views

urlpatterns = [
    path("", views.index, name="index"),
    path("localizacao/", views.localizacao, name="localizacao"),
]