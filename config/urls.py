# Arquivo: config/urls.py
from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path('admin/', admin.site.urls),
    path('', include('main.urls')),
    path('reservas/', include('reservas.urls', namespace='reservas')),
    path('contato/', include('contato.urls', namespace='contato')),
    path('usuarios/', include('usuarios.urls', namespace='usuarios')),
]