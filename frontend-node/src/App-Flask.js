import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useNavigate, useParams } from 'react-router-dom';
import './App.css';

// Configuração da API - ALTERADO PARA FLASK (porta 5000)
const API_URL = 'http://localhost:5000/api';

// Dashboard Component
const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetch(`${API_URL}/dashboard`)
      .then(res => res.json())
      .then(data => setStats(data))
      .catch(err => console.error('Erro ao carregar dashboard:', err));
  }, []);

  if (!stats) return <div className="loading">Carregando estatísticas...</div>;

  const YearCard = ({ year, data, label }) => (
    <div className="year-card" onClick={() => navigate(`/eventos?ano=${year}`)}>
      <div className="year-header">
        <div className="year-badge">{label}</div>
      </div>
      <div className="year-total">{data.total}</div>
      <div className="year-label">Eventos Cadastrados</div>
      
      <div className="status-list">
        <div className="status-title">Eventos por Status</div>
        {Object.entries(data.status).map(([status, count]) => (
          <div key={status} className="status-item">
            <span className={`status-badge status-${status.toLowerCase().replace(/ /g, '-')}`}>
              {status}
            </span>
            <span className="status-count">{count}</span>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h1>Painel de Controle</h1>
        <p>Visão geral dos eventos cadastrados no sistema</p>
      </div>
      
      <div className="year-cards">
        <YearCard year="2026" data={stats['2026']} label="2026" />
        <YearCard year="2025" data={stats['2025']} label="2025" />
        <YearCard year="sem-data" data={stats['sem-data']} label="Eventos sem data definida" />
      </div>
    </div>
  );
};

// Events List Component
const EventsList = () => {
  const [eventos, setEventos] = useState([]);
  const [filtros, setFiltros] = useState({
    ano: new URLSearchParams(window.location.search).get('ano') || '',
    status: '',
    identificacao: '',
    organizador: '',
    tipoEvento: '',
    ambito: '',
    pais: ''
  });
  const [showFiltros, setShowFiltros] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    carregarEventos();
  }, [filtros]);

  const carregarEventos = () => {
    const params = new URLSearchParams();
    Object.entries(filtros).forEach(([key, value]) => {
      if (value) params.append(key, value);
    });

    fetch(`${API_URL}/eventos?${params}`)
      .then(res => res.json())
      .then(data => setEventos(data))
      .catch(err => console.error('Erro ao carregar eventos:', err));
  };

  const handleFiltroChange = (campo, valor) => {
    setFiltros(prev => ({ ...prev, [campo]: valor }));
  };

  const limparFiltros = () => {
    setFiltros({
      ano: '',
      status: '',
      identificacao: '',
      organizador: '',
      tipoEvento: '',
      ambito: '',
      pais: ''
    });
  };

  const formatCurrency = (valor) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(valor);
  };

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    const [year, month, day] = dateString.split('-');
    return `${day}/${month}`;
  };

  const getStatusClass = (status) => {
    return `status-badge status-${status.toLowerCase().replace(/ /g, '-')}`;
  };

  const statusOptions = ['Em Aberto', 'Em Análise', 'Não Aprovado', 'Aprovado', 'Cancelado', 'Aprovado para ajustes'];
  const tipoEventoOptions = ['Reunião/Visita Técnica', 'Solenidade', 'Congresso/Seminário/Workshop/Feira'];
  const ambitoOptions = ['Nacional', 'Internacional'];

  return (
    <div className="eventos-list">
      <div className="eventos-header">
        <div>
          <h1>Solicitações Realizadas</h1>
          <p>Eventos solicitados no exercício de {filtros.ano || 'todos os anos'}</p>
        </div>
        <button className="btn-primary" onClick={() => navigate('/eventos/novo')}>
          + Novo Evento
        </button>
      </div>

      <div className="filtros-section">
        <button 
          className="btn-filtros"
          onClick={() => setShowFiltros(!showFiltros)}
        >
          Filtros {showFiltros ? '▲' : '▼'}
        </button>
        
        {showFiltros && (
          <div className="filtros-panel">
            <div className="filtros-grid">
              <input
                type="text"
                placeholder="Pesquise pelo título do evento"
                value={filtros.identificacao}
                onChange={(e) => handleFiltroChange('identificacao', e.target.value)}
              />
              
              <select
                value={filtros.status}
                onChange={(e) => handleFiltroChange('status', e.target.value)}
              >
                <option value="">Status</option>
                {statusOptions.map(s => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>

              <select
                value={filtros.tipoEvento}
                onChange={(e) => handleFiltroChange('tipoEvento', e.target.value)}
              >
                <option value="">Tipo de Evento</option>
                {tipoEventoOptions.map(t => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>

              <input
                type="text"
                placeholder="Organizador"
                value={filtros.organizador}
                onChange={(e) => handleFiltroChange('organizador', e.target.value)}
              />

              <select
                value={filtros.ambito}
                onChange={(e) => handleFiltroChange('ambito', e.target.value)}
              >
                <option value="">Âmbito</option>
                {ambitoOptions.map(a => (
                  <option key={a} value={a}>{a}</option>
                ))}
              </select>

              <input
                type="text"
                placeholder="País"
                value={filtros.pais}
                onChange={(e) => handleFiltroChange('pais', e.target.value)}
              />
            </div>
            
            <button className="btn-limpar" onClick={limparFiltros}>
              Limpar Filtros
            </button>
          </div>
        )}
      </div>

      <div className="status-tabs">
        {statusOptions.map(status => (
          <button
            key={status}
            className={`status-tab ${filtros.status === status ? 'active' : ''}`}
            onClick={() => handleFiltroChange('status', filtros.status === status ? '' : status)}
          >
            {status} ({eventos.filter(e => e.status === status).length})
          </button>
        ))}
      </div>

      <div className="eventos-table">
        <div className="table-header">
          <div className="col-data">Data</div>
          <div className="col-id">ID</div>
          <div className="col-valor">R$ Previsto</div>
          <div className="col-identificacao">Identificação</div>
          <div className="col-organizador">Organizador</div>
          <div className="col-tipo">Tipo de Evento</div>
          <div className="col-ambito">Âmbito</div>
          <div className="col-pais">País</div>
          <div className="col-cidade">Cidade</div>
          <div className="col-status">Status da solicitação</div>
        </div>

        <div className="table-body">
          {eventos.map(evento => (
            <div 
              key={evento.id} 
              className="table-row"
              onClick={() => navigate(`/eventos/${evento.id}`)}
            >
              <div className="col-data">
                <div className="data-badge">
                  {formatDate(evento.dataInicio)}
                </div>
              </div>
              <div className="col-id">{evento.id}</div>
              <div className="col-valor">{formatCurrency(evento.valorPrevisto)}</div>
              <div className="col-identificacao">{evento.identificacao}</div>
              <div className="col-organizador">{evento.organizador}</div>
              <div className="col-tipo">{evento.tipoEvento}</div>
              <div className="col-ambito">{evento.ambito}</div>
              <div className="col-pais">{evento.pais}</div>
              <div className="col-cidade">{evento.cidade}</div>
              <div className="col-status">
                <span className={getStatusClass(evento.status)}>
                  {evento.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// Event Form Component
const EventForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = !!id;

  const [formData, setFormData] = useState({
    identificacao: '',
    organizador: '',
    dataInicio: '',
    dataFim: '',
    tipoEvento: '',
    ambito: '',
    pais: '',
    uf: '',
    cidade: '',
    endereco: '',
    websiteEvento: '',
    statusData: '',
    statusProcesso: '',
    numeroProcesso: '',
    justificativa: '',
    observacoes: '',
    valorPrevisto: '',
    precisaEstande: false
  });

  const [anexos, setAnexos] = useState([]);

  useEffect(() => {
    if (isEdit) {
      fetch(`${API_URL}/eventos/${id}`)
        .then(res => res.json())
        .then(data => {
          setFormData(data);
          setAnexos(data.anexos || []);
        })
        .catch(err => console.error('Erro ao carregar evento:', err));
    }
  }, [id, isEdit]);

  const handleChange = (campo, valor) => {
    setFormData(prev => ({ ...prev, [campo]: valor }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const url = isEdit 
      ? `${API_URL}/eventos/${id}`
      : `${API_URL}/eventos`;
    
    const method = isEdit ? 'PUT' : 'POST';

    try {
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        alert(isEdit ? 'Evento atualizado com sucesso!' : 'Evento criado com sucesso!');
        navigate('/eventos');
      } else {
        alert('Erro ao salvar evento');
      }
    } catch (err) {
      console.error('Erro:', err);
      alert('Erro ao salvar evento');
    }
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formDataFile = new FormData();
    formDataFile.append('file', file);

    try {
      const response = await fetch(`${API_URL}/eventos/${id}/anexo`, {
        method: 'POST',
        body: formDataFile
      });

      if (response.ok) {
        const anexo = await response.json();
        setAnexos(prev => [...prev, anexo]);
      }
    } catch (err) {
      console.error('Erro ao fazer upload:', err);
    }
  };

  const handleDeleteAnexo = async (anexoId) => {
    try {
      const response = await fetch(`${API_URL}/eventos/${id}/anexo/${anexoId}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        setAnexos(prev => prev.filter(a => a.id !== anexoId));
      }
    } catch (err) {
      console.error('Erro ao deletar anexo:', err);
    }
  };

  return (
    <div className="event-form">
      <div className="form-header">
        <h1>{isEdit ? 'Editar Evento' : 'Novo Evento'}</h1>
        <button className="btn-salvar" onClick={handleSubmit}>
          Salvar
        </button>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="form-section">
          <h2>Informações Básicas</h2>
          
          <div className="form-row">
            <div className="form-group full">
              <label>Identificação (Obrigatório)</label>
              <input
                type="text"
                placeholder="Ex: Congresso Nacional, 25º Aniversário AEB"
                value={formData.identificacao}
                onChange={(e) => handleChange('identificacao', e.target.value)}
                required
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Organizador (Obrigatório)</label>
              <input
                type="text"
                placeholder="Ex: AEB, FIEMA"
                value={formData.organizador}
                onChange={(e) => handleChange('organizador', e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label>Data de Início</label>
              <input
                type="date"
                value={formData.dataInicio}
                onChange={(e) => handleChange('dataInicio', e.target.value)}
              />
            </div>

            <div className="form-group">
              <label>Data de Finalização</label>
              <input
                type="date"
                value={formData.dataFim}
                onChange={(e) => handleChange('dataFim', e.target.value)}
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Tipo de Evento (Obrigatório)</label>
              <select
                value={formData.tipoEvento}
                onChange={(e) => handleChange('tipoEvento', e.target.value)}
                required
              >
                <option value="">Localizar itens</option>
                <option value="Reunião/Visita Técnica">Reunião/Visita Técnica</option>
                <option value="Solenidade">Solenidade</option>
                <option value="Congresso/Seminário/Workshop/Feira">Congresso/Seminário/Workshop/Feira</option>
              </select>
            </div>
          </div>
        </div>

        <div className="form-section">
          <h2>Localização</h2>
          
          <div className="form-row">
            <div className="form-group">
              <label>Âmbito (Obrigatório)</label>
              <select
                value={formData.ambito}
                onChange={(e) => handleChange('ambito', e.target.value)}
                required
              >
                <option value="">Localizar itens</option>
                <option value="Nacional">Nacional</option>
                <option value="Internacional">Internacional</option>
              </select>
            </div>

            <div className="form-group">
              <label>País (Obrigatório)</label>
              <input
                type="text"
                placeholder="Localizar itens"
                value={formData.pais}
                onChange={(e) => handleChange('pais', e.target.value)}
                required
              />
            </div>

            {formData.ambito === 'Nacional' && (
              <div className="form-group">
                <label>UF</label>
                <input
                  type="text"
                  value={formData.uf}
                  onChange={(e) => handleChange('uf', e.target.value)}
                />
              </div>
            )}

            <div className="form-group">
              <label>Cidade</label>
              <input
                type="text"
                value={formData.cidade}
                onChange={(e) => handleChange('cidade', e.target.value)}
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group full">
              <label>Endereço</label>
              <input
                type="text"
                value={formData.endereco}
                onChange={(e) => handleChange('endereco', e.target.value)}
              />
            </div>
          </div>
        </div>

        <div className="form-section">
          <h2>Detalhes Adicionais</h2>
          
          <div className="form-row">
            <div className="form-group full">
              <label>Website do Evento</label>
              <input
                type="url"
                placeholder="URL"
                value={formData.websiteEvento}
                onChange={(e) => handleChange('websiteEvento', e.target.value)}
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Status da Data</label>
              <select
                value={formData.statusData}
                onChange={(e) => handleChange('statusData', e.target.value)}
              >
                <option value="">Localizar itens</option>
                <option value="Confirmado">Confirmado</option>
                <option value="Provisório">Provisório</option>
              </select>
            </div>

            <div className="form-group">
              <label>Status do número do processo</label>
              <select
                value={formData.statusProcesso}
                onChange={(e) => handleChange('statusProcesso', e.target.value)}
              >
                <option value="">Localizar itens</option>
                <option value="Emitido">Emitido</option>
                <option value="Pendente">Pendente</option>
              </select>
            </div>

            <div className="form-group">
              <label>Número do processo (Obrigatório)</label>
              <input
                type="text"
                value={formData.numeroProcesso}
                onChange={(e) => handleChange('numeroProcesso', e.target.value)}
                required
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Valor Previsto (R$)</label>
              <input
                type="number"
                step="0.01"
                value={formData.valorPrevisto}
                onChange={(e) => handleChange('valorPrevisto', e.target.value)}
              />
            </div>

            <div className="form-group checkbox-group">
              <label>
                <input
                  type="checkbox"
                  checked={formData.precisaEstande}
                  onChange={(e) => handleChange('precisaEstande', e.target.checked)}
                />
                Evento precisa de estande?
              </label>
            </div>
          </div>
        </div>

        <div className="form-section">
          <h2>Justificativa e Observações</h2>
          
          <div className="form-row">
            <div className="form-group full">
              <label>Justificativa: relevância da participação da AEB (Obrigatório)</label>
              <textarea
                rows="5"
                value={formData.justificativa}
                onChange={(e) => handleChange('justificativa', e.target.value)}
                required
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group full">
              <label>Observações</label>
              <textarea
                rows="5"
                value={formData.observacoes}
                onChange={(e) => handleChange('observacoes', e.target.value)}
              />
            </div>
          </div>
        </div>

        <div className="form-section">
          <h2>Anexos</h2>
          
          <div className="anexos-area">
            {anexos.length === 0 ? (
              <p className="no-anexos">Não há nada em anexo.</p>
            ) : (
              <div className="anexos-list">
                {anexos.map(anexo => (
                  <div key={anexo.id} className="anexo-item">
                    <span>{anexo.nome}</span>
                    <button 
                      type="button"
                      onClick={() => handleDeleteAnexo(anexo.id)}
                    >
                      Remover
                    </button>
                  </div>
                ))}
              </div>
            )}
            
            {isEdit && (
              <div className="anexo-upload">
                <input
                  type="file"
                  id="file-upload"
                  onChange={handleFileUpload}
                  style={{ display: 'none' }}
                />
                <label htmlFor="file-upload" className="btn-anexar">
                  📎 Anexar arquivo
                </label>
              </div>
            )}
          </div>
        </div>
      </form>
    </div>
  );
};

// Main App Component
function App() {
  return (
    <Router>
      <div className="app">
        <nav className="navbar">
          <div className="navbar-brand">
            <div className="logo">AEB</div>
            <h2>Sistema de Gestão de Eventos</h2>
          </div>
          <div className="navbar-menu">
            <Link to="/" className="nav-link">Dashboard</Link>
            <Link to="/eventos" className="nav-link">Solicitações</Link>
            <Link to="/eventos/novo" className="nav-link">Novo Evento</Link>
          </div>
        </nav>

        <main className="main-content">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/eventos" element={<EventsList />} />
            <Route path="/eventos/novo" element={<EventForm />} />
            <Route path="/eventos/:id" element={<EventForm />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
