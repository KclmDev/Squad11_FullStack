# CRIAR ENDPOINTS
from django.shortcuts import render
from rest_framework import viewsets, permissions
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from .models import Usuario, Projeto, Ambiente, Log, ModeloDocumento
from .serializers import UsuarioSerializer,ProjetoSerializer,AmbienteSerializer,LogSerializer,ModeloDocumentoSerializer, MyTokenObtainPairSerializer

class UsuarioViewSet(viewsets.ReadOnlyModelViewSet):
    """Endpoint da API que permite que usuários sejam visualizados."""
    queryset = Usuario.objects.all()
    serializer_class = UsuarioSerializer
    permission_classes = [permissions.IsAuthenticated] # Apenas usuários logados podem ver

class ProjetoViewSet(viewsets.ModelViewSet):
    """Endpoint da API para Projetos."""
    queryset = Projeto.objects.all().order_by('-data_criacao')
    serializer_class = ProjetoSerializer
    permission_classes = [permissions.IsAuthenticated]

    # Isto permite filtrar projetos por status na URL, como: /api/projetos/?status=APROVADO
    def get_queryset(self):
        queryset = Projeto.objects.all().order_by('-data_criacao')
        status = self.request.query_params.get('status')
        if status is not None:
            queryset = queryset.filter(status__iexact=status)
        return queryset

class AmbienteViewSet(viewsets.ModelViewSet):
    """Endpoint da API para Ambientes."""
    queryset = Ambiente.objects.all()
    serializer_class = AmbienteSerializer
    permission_classes = [permissions.IsAuthenticated]

class LogViewSet(viewsets.ReadOnlyModelViewSet):
    """Endpoint da API para Logs (somente leitura)."""
    queryset = Log.objects.all().order_by('-data_hora')
    serializer_class = LogSerializer
    permission_classes = [permissions.IsAuthenticated]

class ModeloDocumentoViewSet(viewsets.ModelViewSet):
    """Endpoint da API para Modelos de Documentos."""
    queryset = ModeloDocumento.objects.all()
    serializer_class = ModeloDocumentoSerializer
    permission_classes = [permissions.IsAuthenticated]

# View customizada para as estatísticas do Dashboard
@api_view(['GET'])
@permission_classes([permissions.IsAuthenticated])
def dashboard_stats(request):
    """Retorna as estatísticas para o dashboard inicial."""
    total_projetos = Projeto.objects.count()
    aprovados = Projeto.objects.filter(status='APROVADO').count()
    reprovados = Projeto.objects.filter(status='REPROVADO').count()
    pendentes = Projeto.objects.filter(status='PENDENTE').count()

    data = {
        'total_projetos': total_projetos,
        'projetos_aprovados': aprovados,
        'projetos_reprovados': reprovados,
        'projetos_pendentes': pendentes,
    }
    return Response(data)

class MyTokenObtainPairView(TokenObtainPairView):
    serializer_class = MyTokenObtainPairSerializer