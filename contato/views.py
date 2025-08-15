# Arquivo: contato/views.py
from django.shortcuts import render

def contato(request):
    return render(request, "contato.html")

def lista_mensagens(request):
    return render(request, "lista_mensagens.html")

def detalhe_mensagem(request):
    return render(request, "detalhe_mensagem.html")