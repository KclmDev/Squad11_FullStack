import React, { useState } from 'react';
import { areas, MaterialItem, ambientes, materiais, materialExamples } from '../../../data/mockData';
import { AmbienteSelect } from '../DashboardViews/AmbienteSelect';

interface CriarDocumentoViewProps {
  onViewDetails: () => void;
}

const CriarDocumentoView: React.FC<CriarDocumentoViewProps> = ({ onViewDetails }) => {
  const [formData, setFormData] = useState({
    nomeProjeto: '',
    tipoProjeto: '',
    descricao: '',
    dataEntrega: ''
  });

  const [ambienteFiltro, setAmbienteFiltro] = useState<string>(ambientes[0]);
  const [materiaisState, setMateriaisState] = useState<MaterialItem[]>(materiais);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleMaterialChange = (id: string, value: string) => {
    setMateriaisState(prev => prev.map(material => 
      material.id === id ? { ...material, tipo: value } : material
    ));
  };

  const handleAmbienteFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setAmbienteFiltro(e.target.value);
  };

  const materiaisFiltrados = materiaisState.filter(material => 
    material.ambiente.includes(ambienteFiltro)
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const materiaisIncompletos = materiaisState.filter(material => !material.tipo.trim());
    if (materiaisIncompletos.length > 0) {
      alert('Por favor, preencha todos os tipos de materiais.');
      return;
    }

    const projetoCompleto = {
      ...formData,
      materiais: materiaisState
    };

    console.log('Projeto criado:', projetoCompleto);
    alert('Projeto criado com sucesso!');
    onViewDetails();
  };

  const getMaterialExamples = (materialId: string): string => {
    return materialExamples[materialId] || '';
  };

  return (
    <div>
      <div className="content-header">
        <h1>Criar Novo Documento</h1>
      </div>
      
      <div className="form-container">
        <form onSubmit={handleSubmit}>
          {/* Informações Básicas do Projeto */}
          <div className="row mb-4">
            <div className="col-md-6">
              <div className="form-group">
                <label htmlFor="nomeProjeto">Nome do Projeto</label>
                <input
                  type="text"
                  id="nomeProjeto"
                  name="nomeProjeto"
                  value={formData.nomeProjeto}
                  onChange={handleInputChange}
                  className="form-control"
                  required
                />
              </div>
            </div>
            <div className="col-md-6">
              <div className="form-group">
                <label htmlFor="tipoProjeto">Tipo de Projeto</label>
                <select
                  id="tipoProjeto"
                  name="tipoProjeto"
                  value={formData.tipoProjeto}
                  onChange={handleInputChange}
                  className="form-control"
                  required
                >
                  <option value="">Selecione o tipo</option>
                  <option value="Residencial">Residencial</option>
                  <option value="Comercial">Comercial</option>
                  <option value="Industrial">Industrial</option>
                </select>
              </div>
            </div>
          </div>

          <div className="row mb-4">
            <div className="col-md-6">
              <div className="form-group">
                <label htmlFor="dataEntrega">Data de Entrega</label>
                <input
                  type="date"
                  id="dataEntrega"
                  name="dataEntrega"
                  value={formData.dataEntrega}
                  onChange={handleInputChange}
                  className="form-control"
                  required
                />
              </div>
            </div>
          </div>

          <div className="form-group mb-4">
            <label htmlFor="descricao">Descrição do Projeto</label>
            <textarea
              id="descricao"
              name="descricao"
              value={formData.descricao}
              onChange={handleInputChange}
              className="form-control"
              rows={3}
              placeholder="Descreva o objetivo e características do projeto..."
              required
            />
          </div>

          {/* Especificação de Materiais */}
          <div className="materiais-section">
            <h3 className="mb-4">Especificação de Materiais</h3>
            
          <div className="filter-section mb-4">
            <div className="row">
              <div className="col-md-12">
                <div className="form-group">
                  <label htmlFor="ambienteFiltro" className="form-label">
                    Selecione o Ambiente:
                  </label>
                  <select
                    id="ambienteFiltro"
                    value={ambienteFiltro}
                    onChange={handleAmbienteFilterChange}
                    className="form-control">
                    
                    {/* Área 1 - Unidades Privativas */}
                    <optgroup label="Un. Privativas">
                      {areas['Un. Privativas'].map((ambiente: string) => (
                        <option key={ambiente} value={ambiente}>
                          {ambiente}
                      </option>
                      ))}
                    </optgroup>
                    
                    {/* Área 2 - Área Comum */}
                    <optgroup label="Área Comum">
                      {areas['Área Comum'].map((ambiente: string) => (
                        <option key={ambiente} value={ambiente}>
                          {ambiente}
                        </option>
                      ))}
                    </optgroup>
                  </select>
                  <small className="form-text text-muted">
                    Filtre os materiais por ambiente específico do projeto
                 </small>
                </div>
              </div>
            </div>
          </div>
            
            {materiaisFiltrados.length === 0 ? (
              <div className="alert alert-info">
                Nenhum material encontrado para o ambiente selecionado.
              </div>
            ) : (
              <div className="row">
                {materiaisFiltrados.map((material) => (
                  <div key={material.id} className="col-md-6 mb-3">
                    <div className="form-group">
                      <label htmlFor={material.id} className="form-label">
                        {material.nome}:
                      </label>
                      <input
                        type="text"
                        id={material.id}
                        value={material.tipo}
                        onChange={(e) => handleMaterialChange(material.id, e.target.value)}
                        className="form-control"
                        placeholder={`Especifique o tipo de ${material.nome.toLowerCase()}...`}
                        required
                      />
                      <small className="form-text text-muted">
                        {getMaterialExamples(material.id)}
                      </small>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="d-flex justify-content-between mt-4">
            <button type="button" className="btn btn-secondary" onClick={() => window.history.back()}>
              Cancelar
            </button>
            <button type="submit" className="btn btn-primary">
              Criar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CriarDocumentoView;