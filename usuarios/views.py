# Arquivo: usuarios/views.py
from django.shortcuts import render

def entrar(request):
    return render(request, "entrar.html")

def criar_conta(request):
    return render(request, "criar-conta.html")

def minha_conta(request):
    return render(request, "minha_conta.html")