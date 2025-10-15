// src/components/dashboard/Dashboard.tsx
import React, { useState } from 'react';
import './Dashboard.css';
import InicioView from './DashboardViews/InicioView';
import CriarDocumentoView from './DashboardViews/CriarDocumentoView';
import AprovadosView from './DashboardViews/AprovadosView';
import ReprovadosView from './DashboardViews/ReprovadosView';
import PendentesView from './DashboardViews/PendentesView';
import ModelosView from './DashboardViews/ModelosView';
import LogsView from './DashboardViews/LogsView';
import DetalhesProjetoView from './DashboardViews/DetalhesProjetoView';
import AprovarProjetoView from './DashboardViews/AprovarProjetoView';
import { projetosDetalhes } from '../../data/mockData';

type DashboardView = 'inicio' | 'criar-documento' | 'aprovados' | 'reprovados' | 'pendentes' | 'modelos' | 'logs' | 'detalhes-projeto' | 'aprovar-projeto';

interface DashboardProps {
  onLogout: () => void;
}

const Dashboard: React.FC<DashboardProps> = ({ onLogout }) => {
  const [currentView, setCurrentView] = useState<DashboardView>('inicio');
  const [selectedProjetoId, setSelectedProjetoId] = useState<number>(1);
  const [viewHistory, setViewHistory] = useState<DashboardView[]>(['inicio']);
  const [projetosMenuOpen, setProjetosMenuOpen] = useState<boolean>(false);

  const userEmail = localStorage.getItem('userEmail') || 'Usuário';
  const userName = userEmail.split('@')[0];

  const handleNavigation = (view: DashboardView, projetoId?: number) => {
    if (projetoId) {
      setSelectedProjetoId(projetoId);
    }
    
    // Fecha o menu de projetos se estiver aberto
    if (view !== 'aprovados' && view !== 'reprovados' && view !== 'pendentes') {
      setProjetosMenuOpen(false);
    }
    
    // Atualiza o histórico
    setViewHistory(prev => [...prev, currentView]);
    setCurrentView(view);
  };

  const handleProjetosMenuClick = () => {
    setProjetosMenuOpen(!projetosMenuOpen);
    if (!projetosMenuOpen) {
      setCurrentView('aprovados');
    }

    
  };

  const handleSubMenuClick = (view: DashboardView) => {
    handleNavigation(view);
  };

  const handleBack = () => {
    if (viewHistory.length > 1) {
      const previousView = viewHistory[viewHistory.length - 1];
      setViewHistory(prev => prev.slice(0, -1));
      setCurrentView(previousView);
    } else {
      setCurrentView('inicio');
    }
  };

  // Filtros
  const approvedProjects = projetosDetalhes.filter(project => project.status === 'aprovado');
  const rejectedProjects = projetosDetalhes.filter(project => project.status === 'reprovado');
  const pendingProjects = projetosDetalhes.filter(project => project.status === 'pendente');

  const isProjetosViewActive = currentView === 'aprovados' || currentView === 'reprovados' || currentView === 'pendentes';

  const renderContent = () => {
    switch (currentView) {
      case 'inicio':
        return <InicioView onViewDetails={() => handleNavigation('aprovados')} />;
      case 'criar-documento':
        return <CriarDocumentoView onViewDetails={() => handleNavigation('pendentes')} />;
      case 'aprovados':
        return <AprovadosView 
                 projects={approvedProjects} 
                 onViewDetails={(projetoId) => handleNavigation('detalhes-projeto', projetoId)} 
               />;
      case 'reprovados':
        return <ReprovadosView 
                 projects={rejectedProjects} 
                 onViewDetails={(projetoId) => handleNavigation('detalhes-projeto', projetoId)} 
               />;
      case 'pendentes':
        return <PendentesView 
                 projects={pendingProjects} 
                 onViewDetails={(projetoId) => handleNavigation('detalhes-projeto', projetoId)}
                 onEditProject={(projetoId) => handleNavigation('aprovar-projeto', projetoId)} // ✅ CORRIGIDO
               />;
      case 'modelos':
        return <ModelosView />;
      case 'logs':
        return <LogsView />;
      case 'detalhes-projeto':
        return <DetalhesProjetoView 
                 onBack={handleBack}
                 projetoId={selectedProjetoId} 
               />;
      case 'aprovar-projeto':
        return <AprovarProjetoView 
                 projetoId={selectedProjetoId}
                 onBack={handleBack}
               />;
      default:
        return <InicioView onViewDetails={() => handleNavigation('aprovados')} />;
    }
  };

  return (
    <div className="dashboard-container">
      {/* Header */}
      <header className="dashboard-header">
        <div className="header-logo">
          <img 
            src="/logo_jnunes_normal.png" 
            alt="Logo Jotanunes" 
            className="header-logo-image"
            onError={(e) => {
              (e.target as HTMLImageElement).style.display = 'none';
            }}
          />
          <h3 className="header-logo-text">  </h3>
        </div>
        
        <div className="header-user">
          <div className="header-user-info">
            <span className="header-user-name">{userName}</span>
            <span className="header-user-email">{userEmail}</span>
          </div>
          <div className="header-avatar">
            {userName.charAt(0).toUpperCase()}
          </div>
        </div>
      </header>

      {/* Sidebar */}
      <div className="dashboard-sidebar">
        <nav className="sidebar-nav">
          <ul className="nav-menu">
            {[
              { key: 'inicio', label: 'Inicio' },
              { key: 'criar-documento', label: 'Criar Documento' }
            ].map((item) => (
              <li key={item.key} className={`nav-item ${currentView === item.key ? 'active' : ''}`}>
                <span className="nav-text" onClick={() => handleNavigation(item.key as DashboardView)}>
                  {item.label}
                </span>
              </li>
            ))}
            
            <li className={`nav-item ${isProjetosViewActive ? 'active' : ''}`}>
              <div className="nav-text nav-with-submenu" onClick={handleProjetosMenuClick}>
                <span>Projetos</span>
                <span className={`submenu-arrow ${projetosMenuOpen ? 'open' : ''}`}>
                  ▼
                </span>
              </div>
              
              {projetosMenuOpen && (
                <ul className="submenu">
                  <li 
                    className={`submenu-item ${currentView === 'aprovados' ? 'active' : ''}`}
                    onClick={() => handleSubMenuClick('aprovados')}
                  >
                    <span className="submenu-text">Aprovados</span>
                  </li>
                  <li 
                    className={`submenu-item ${currentView === 'reprovados' ? 'active' : ''}`}
                    onClick={() => handleSubMenuClick('reprovados')}
                  >
                    <span className="submenu-text">Reprovados</span>
                  </li>
                  <li 
                    className={`submenu-item ${currentView === 'pendentes' ? 'active' : ''}`}
                    onClick={() => handleSubMenuClick('pendentes')}
                  >
                    <span className="submenu-text">Pendentes</span>
                  </li>
                </ul>
              )}
            </li>

            {[
              { key: 'modelos', label: 'Modelos' },
              { key: 'logs', label: 'Logs' }
            ].map((item) => (
              <li key={item.key} className={`nav-item ${currentView === item.key ? 'active' : ''}`}>
                <span className="nav-text" onClick={() => handleNavigation(item.key as DashboardView)}>
                  {item.label}
                </span>
              </li>
            ))}
          </ul>
        </nav>

        <div className='sidebar-footer'>
          <nav className="sidebar-nav">
            <ul className="nav-menu nav-item">
              <div className="nav-text nav-with-submenu" onClick={onLogout}>
                <span>Sair</span>
              </div>
            </ul>
          </nav>
        </div>
      </div>

      {/* Área de Conteúdo */}
      <div className="dashboard-content">
        {renderContent()}
      </div>
    </div>
  );
};

export default Dashboard;