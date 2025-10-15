from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views

router = DefaultRouter()
router.register(r'usuarios', views.UsuarioViewSet)
router.register(r'projetos', views.ProjetoViewSet)
router.register(r'ambientes', views.AmbienteViewSet)
router.register(r'logs', views.LogViewSet)
router.register(r'modelos-documento', views.ModeloDocumentoViewSet)

urlpatterns = [
    path('', include(router.urls)),
    path('dashboard-stats/', views.dashboard_stats, name='dashboard-stats'),
]