import React, { useState } from 'react';
import { projetosDetalhes, ProjetoDetalhes, Ambiente, Material } from '../../../data/mockData';
import { AmbienteSelect } from '../DashboardViews/AmbienteSelect';

interface DetalhesProjetoViewProps {
  onBack: () => void;
  projetoId: number;
}

const DetalhesProjetoView: React.FC<DetalhesProjetoViewProps> = ({ onBack, projetoId }) => {
  const [ambienteSelecionado, setAmbienteSelecionado] = useState<string>('');

  // Busca os dados do projeto específico no mockData
  const projetoData = projetosDetalhes.find((p: ProjetoDetalhes) => p.id === projetoId);

  if (!projetoData) {
    return (
      <div>
        <div className="content-header">
          <button className="btn btn-secondary me-3" onClick={onBack}>
            ↩ Voltar
          </button>
          <h1>Projeto não encontrado</h1>
        </div>
      </div>
    );
  }

  const ambienteAtualNome = ambienteSelecionado || projetoData.ambientes[0]?.nome || '';
  const ambienteAtual = projetoData.ambientes.find((a: Ambiente) => a.nome === ambienteAtualNome);

  const contarMateriaisPorStatus = (status: Material['status']): number => {
    if (!ambienteAtual) return 0;
    return ambienteAtual.materiais.filter((material: Material) => material.status === status).length;
  };

  return (
    <div>
      <div className="content-header mb-4 d-flex align-items-center justify-content-start text-start">
        <button className="btn btn-secondary me-3" onClick={onBack}>
          ↩ Voltar
        </button>
        <h1 className="mb-0 text-start">{projetoData.nome}</h1>
      </div>

      {/* Filtro de Ambientes com separação por área */}
      <div className="row mb-4">
        <div className="col-md-6">
          <label htmlFor="ambiente-filter" className="form-label">
            Selecione o Ambiente:
          </label>
          <AmbienteSelect
             value={ambienteAtualNome}
             onChange={(e) => setAmbienteSelecionado(e.target.value)}
             ambientesDisponiveis={projetoData.ambientes.map(a => a.nome)}
          />
        </div>

        {/* Estatísticas do Ambiente */}
        <div className="col-md-6">
          {ambienteAtual && (
            <div className="bg-light p-3 rounded">
              <h6 className="mb-2">Resumo do Ambiente</h6>
              <div className="row text-center">
                <div className="col-4">
                  <div className="text fw-bold">{contarMateriaisPorStatus('pendente')}</div>
                  <small className="text-muted">Pendentes</small>
                </div>
                <div className="col-4">
                  <div className="text fw-bold">{contarMateriaisPorStatus('aprovado')}</div>
                  <small className="text-muted">Aprovados</small>
                </div>
                <div className="col-4">
                  <div className="text fw-bold">{contarMateriaisPorStatus('reprovado')}</div>
                  <small className="text-muted">Reprovados</small>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Tabela de Materiais */}
      {ambienteAtual ? (
        <div className="projects-table-container">
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h4 className="mb-0">Itens do Ambiente: {ambienteAtual.nome}</h4>
            <span className="text-muted">{ambienteAtual.materiais.length} Item(ns) no total</span>
          </div>
          <table className="projects-table">
            <thead>
              <tr>
                <th>Item</th>
                <th>Material</th>
                <th>Status</th>
                <th>Motivo</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {ambienteAtual.materiais.map((material: Material) => (
                <tr key={material.id}>
                  <td>{material.nome}</td>
                  <td>{material.tipo}</td>
                  <td>
                    <span className={`status-badge ${material.status}`}>
                      {material.status.charAt(0).toUpperCase() + material.status.slice(1)}
                    </span>
                  </td>
                  <td>{material.motivo || '-'}</td>
                  <td>
                    <button className="btn btn-secondary btn-sm">Download</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="alert alert-info">Selecione um ambiente para visualizar os materiais.</div>
      )}
    </div>
  );
};

export default DetalhesProjetoView;
