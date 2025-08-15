# Arquivo: main/views.py

from django.shortcuts import render

def index(request):
    return render(request, "index.html")

def localizacao(request):
    return render(request, "localizacao.html")