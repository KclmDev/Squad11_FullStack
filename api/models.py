from django.db import models
# backend/api/models.py

from django.db import models
from django.contrib.auth.models import AbstractUser
from django.conf import settings

#Modelo de Usuário 
class Usuario(AbstractUser):
    CARGO_CHOICES = [
        ('cliente', 'Cliente'),
        ('gerente', 'Gerente'),
        ('admin', 'Admin'),
        ('superadmin', 'Super Admin'),
    ]
    email = models.EmailField(unique=True)
    cargo = models.CharField(max_length=20, choices=CARGO_CHOICES, default='cliente')

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['username']

    def __str__(self):
        return self.email

# modelo de Projeto / documento de criação / entidade central

class Projeto(models.Model):
    STATUS_CHOICES = [
        ('PENDENTE', 'Pendente'),
        ('APROVADO', 'Aprovado'),
        ('REPROVADO', 'Reprovado'),
    ]
    
    TIPO_PROJETO_CHOICES = [
        ('RESIDENCIAL', 'Residencial'),
        ('COMERCIAL', 'Comercial'),
    ]

    nome_do_projeto = models.CharField(max_length=255)
    tipo_do_projeto = models.CharField(max_length=50, choices=TIPO_PROJETO_CHOICES)
    data_entrega = models.DateField()
    descricao = models.TextField(blank=True, null=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='PENDENTE')
    responsavel = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True, related_name='projetos_criados')
    
    data_criacao = models.DateTimeField(auto_now_add=True)
    data_atualizacao = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = "Projeto"
        verbose_name_plural = "Projetos"

    def __str__(self):
        return self.nome_do_projeto

class Ambiente(models.Model):
    projeto = models.ForeignKey(Projeto, on_delete=models.CASCADE, related_name='ambientes')
    
    nome_do_ambiente = models.CharField(max_length=100) # Ex: "Cozinha", "Sala de Estar"
    guia_de_cores = models.CharField(max_length=255, blank=True)

    piso = models.TextField(blank=True)
    parede = models.TextField(blank=True)
    teto = models.TextField(blank=True)
    rodape = models.TextField(blank=True)
    soleira = models.TextField(blank=True)
    peitoril = models.TextField(blank=True)
    esquadria = models.TextField(blank=True)
    vidro = models.TextField(blank=True)
    porta = models.TextField(blank=True)
    ferragem = models.TextField(blank=True)
    inst_eletrica = models.TextField(blank=True, verbose_name="Instalação Elétrica")
    inst_comunicacao = models.TextField(blank=True, verbose_name="Instalação de Comunicação")

    class Meta:
        verbose_name = "Ambiente"
        verbose_name_plural = "Ambientes"

    def __str__(self):
        return f"{self.nome_do_ambiente} - {self.projeto.nome_do_projeto}"

class Log(models.Model):
    ACAO_CHOICES = [
        ('CRIACAO', 'Criação'),
        ('APROVACAO', 'Aprovação'),
        ('REPROVACAO', 'Reprovação'),
        ('EDICAO', 'Edição'),
        ('LOGIN', 'Login'),
    ]
    
    usuario = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True)
    
    acao = models.CharField(max_length=20, choices=ACAO_CHOICES)
    
    projeto = models.ForeignKey(Projeto, on_delete=models.SET_NULL, null=True, blank=True)
    
    motivo = models.TextField(blank=True, null=True) 
    data_hora = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name = "Log"
        verbose_name_plural = "Logs"

    def __str__(self):
        return f"{self.usuario.email} - {self.acao} em {self.data_hora.strftime('%d/%m/%Y %H:%M')}"

class ModeloDocumento(models.Model):
    nome = models.CharField(max_length=100)
    descricao = models.TextField()

    def __str__(self):
        return self.nome


