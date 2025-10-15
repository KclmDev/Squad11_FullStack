from django.db import models
# backend/api/models.py

from django.db import models
from django.contrib.auth.models import AbstractUser
from django.conf import settings

#Modelo de Usuário Customizado
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
    REQUIRED_FIELDS = ['username'] # 'username' ainda é necessário nos bastidores

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
        # Adicione outros tipos 
    ]

    nome_do_projeto = models.CharField(max_length=255)
    tipo_do_projeto = models.CharField(max_length=50, choices=TIPO_PROJETO_CHOICES)
    data_entrega = models.DateField()
    descricao = models.TextField(blank=True, null=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='PENDENTE')
    
    # Relacionamento: Quem é o responsável/criador do projeto?
    # on_delete=models.SET_NULL significa que se o usuário for deletado, o projeto não será,
    # mas o campo 'responsavel' ficará nulo.
    responsavel = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True, related_name='projetos_criados')
    
    # Campos de data automáticos
    data_criacao = models.DateTimeField(auto_now_add=True)
    data_atualizacao = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = "Projeto"
        verbose_name_plural = "Projetos"

    def __str__(self):
        return self.nome_do_projeto

# 3. Modelo de Ambiente e Especificações
# Cada projeto pode ter vários ambientes, e cada ambiente tem suas especificações.
class Ambiente(models.Model):
    # Relacionamento: A qual projeto este ambiente pertence?
    # on_delete=models.CASCADE significa que se o projeto for deletado, todos os ambientes
    # associados a ele também serão.
    projeto = models.ForeignKey(Projeto, on_delete=models.CASCADE, related_name='ambientes')
    
    nome_do_ambiente = models.CharField(max_length=100) # Ex: "Cozinha", "Sala de Estar"
    guia_de_cores = models.CharField(max_length=255, blank=True)

    # Campos de especificação (usando TextField para descrições mais longas)
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

# 4. Modelo de Logs
# Para registrar o histórico de ações no sistema.
class Log(models.Model):
    ACAO_CHOICES = [
        ('CRIACAO', 'Criação'),
        ('APROVACAO', 'Aprovação'),
        ('REPROVACAO', 'Reprovação'),
        ('EDICAO', 'Edição'),
        ('LOGIN', 'Login'),
    ]
    
    # Relacionamento: Quem realizou a ação?
    usuario = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True)
    
    acao = models.CharField(max_length=20, choices=ACAO_CHOICES)
    
    # Relacionamento: A ação foi sobre qual projeto? (Pode ser nulo para ações como login)
    projeto = models.ForeignKey(Projeto, on_delete=models.SET_NULL, null=True, blank=True)
    
    motivo = models.TextField(blank=True, null=True) # Ex: "Mármore importado não aprovado"
    data_hora = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name = "Log"
        verbose_name_plural = "Logs"

    def __str__(self):
        return f"{self.usuario.email} - {self.acao} em {self.data_hora.strftime('%d/%m/%Y %H:%M')}"

# 5. O que são os "Modelos"?
# Pela lógica, "Modelos" seriam templates pré-configurados para criar novos projetos rapidamente.
# Ex: "Modelo Apartamento 2 Quartos", que já vem com os ambientes "Sala", "Cozinha", "Quarto 1", etc.
# Esta é uma funcionalidade mais avançada, mas podemos deixar a base pronta.
class ModeloDocumento(models.Model):
    nome = models.CharField(max_length=100)
    descricao = models.TextField()

    def __str__(self):
        return self.nome
# Estrutura de banco de dados
# Cada classe que você cria aqui (herdando de models.Model) será transformada pelo Django em uma tabela no banco de dados. Os atributos da classe (como CharField, IntegerField) se tornam as colunas da tabela.

