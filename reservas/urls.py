# Arquivo: reservas/urls.py
from django.urls import path
from . import views

app_name = 'reservas'
urlpatterns = [
    path("", views.reservas, name="reservas"),
    path("minhas/", views.minhas_reservas, name="minhas_reservas"),
]