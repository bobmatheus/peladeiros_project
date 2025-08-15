# Arquivo: usuarios/urls.py
from django.urls import path
from . import views

app_name = 'usuarios'
urlpatterns = [
    path("entrar/", views.entrar, name="entrar"),
    path("criar-conta/", views.criar_conta, name="criar_conta"),
    path("minha-conta/", views.minha_conta, name="minha_conta"),
]