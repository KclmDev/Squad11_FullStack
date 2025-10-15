from rest_framework import serializers
from .models import Usuario, Projeto, Ambiente, Log, ModeloDocumento
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer

# modelo de Usuário
class UsuarioSerializer(serializers.ModelSerializer):
    class Meta:
        model = Usuario
        # inputs que aparecem na api
        fields = ['id', 'username', 'email', 'first_name', 'last_name', 'cargo']

# modelo de Ambiente
class AmbienteSerializer(serializers.ModelSerializer):
    class Meta:
        model = Ambiente
        fields = '__all__' 

#  modelo de Projeto 
class ProjetoSerializer(serializers.ModelSerializer):
    responsavel_nome = serializers.CharField(source='responsavel.get_full_name', read_only=True)
    
    ambientes = AmbienteSerializer(many=True, read_only=True)

    class Meta:
        model = Projeto
        fields = [
            'id', 
            'nome_do_projeto', 
            'tipo_do_projeto', 
            'data_entrega', 
            'descricao', 
            'status', 
            'responsavel', 
            'responsavel_nome', 
            'data_criacao', 
            'data_atualizacao',
            'ambientes', 
        ]
        read_only_fields = ['responsavel_nome', 'ambientes']

# Serializer para o modelo de Log
class LogSerializer(serializers.ModelSerializer):
    #email do usuário em vez do ID
    usuario_email = serializers.EmailField(source='usuario.email', read_only=True)
    #nome do projeto em vez do ID
    projeto_nome = serializers.CharField(source='projeto.nome_do_projeto', read_only=True)

    class Meta:
        model = Log
        fields = [
            'id',
            'usuario_email',
            'acao',
            'projeto_nome',
            'motivo',
            'data_hora'
        ]

# Serializer ModeloDocumento
class ModeloDocumentoSerializer(serializers.ModelSerializer):
    class Meta:
        model = ModeloDocumento
        fields = '__all__'

class MyTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)
        token['email'] = user.email
        token['cargo'] = user.cargo
        token['full_name'] = user.get_full_name()
        return token