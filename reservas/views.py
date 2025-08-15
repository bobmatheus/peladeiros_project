# Arquivo: reservas/views.py
from django.shortcuts import render

def reservas(request):
    return render(request, "reservas.html")

def minhas_reservas(request):
    return render(request, "minhas_reservas.html")