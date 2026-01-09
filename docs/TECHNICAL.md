# 📚 Documentação Técnica - Sistema AEB

## Arquitetura do Sistema

### Visão Geral
```
┌─────────────────┐         ┌──────────────────┐
│                 │         │                  │
│  React Frontend │ ◄─────► │  Express Backend │
│  (Port 3000)    │  HTTP   │  (Port 3001)     │
│                 │         │                  │
└─────────────────┘         └──────────────────┘
                                     │
                                     ▼
                            ┌─────────────────┐
                            │   File System   │
                            │  (In-Memory DB) │
                            └─────────────────┘
```

## Fluxo de Dados

### 1. Dashboard
```
Usuario → Dashboard Component
    ↓
    GET /api/dashboard
    ↓
Backend processa eventos por ano
    ↓
Retorna estatísticas agrupadas
    ↓
Dashboard renderiza cards interativos
```

### 2. Listagem de Eventos
```
Usuario → EventsList Component
    ↓
Aplica filtros (ano, status, etc)
    ↓
GET /api/eventos?filtros...
    ↓
Backend filtra array de eventos
    ↓
Retorna eventos ordenados por data
    ↓
Renderiza tabela interativa
```

### 3. Criação/Edição de Evento
```
Usuario preenche formulário
    ↓
Validação client-side (campos obrigatórios)
    ↓
POST/PUT /api/eventos
    ↓
Backend valida e salva
    ↓
Retorna evento criado/atualizado
    ↓
Redireciona para listagem
```

### 4. Upload de Anexos
```
Usuario seleciona arquivo
    ↓
FormData com arquivo
    ↓
POST /api/eventos/:id/anexo
    ↓
Multer processa upload
    ↓
Arquivo salvo em ./uploads
    ↓
Retorna metadata do anexo
    ↓
Anexo aparece na lista
```

## Modelo de Dados

### Evento (Event)
```javascript
{
  id: Number,                    // Gerado automaticamente
  identificacao: String,         // OBRIGATÓRIO
  organizador: String,           // OBRIGATÓRIO
  dataInicio: String,            // YYYY-MM-DD
  dataFim: String,               // YYYY-MM-DD
  tipoEvento: String,            // OBRIGATÓRIO
  ambito: String,                // OBRIGATÓRIO (Nacional/Internacional)
  pais: String,                  // OBRIGATÓRIO
  uf: String,                    // Se ambito == Nacional
  cidade: String,
  endereco: String,
  websiteEvento: String,         // URL
  statusData: String,            // Confirmado/Provisório
  statusProcesso: String,        // Emitido/Pendente
  numeroProcesso: String,        // OBRIGATÓRIO
  valorPrevisto: Number,         // Float
  precisaEstande: Boolean,
  justificativa: String,         // OBRIGATÓRIO
  observacoes: String,
  status: String,                // Status do evento
  ultimaAtualizacao: String,     // YYYY-MM-DD
  anexos: Array<Anexo>           // Lista de anexos
}
```

### Anexo (Attachment)
```javascript
{
  id: Number,          // Timestamp
  nome: String,        // Nome original do arquivo
  path: String,        // Caminho no servidor
  url: String          // URL para acesso
}
```

## Regras de Validação

### Frontend (Client-Side)
```javascript
// Campos obrigatórios verificados no submit
const camposObrigatorios = [
  'identificacao',
  'organizador',
  'tipoEvento',
  'ambito',
  'pais',
  'numeroProcesso',
  'justificativa'
];

// Validação condicional
if (ambito === 'Nacional') {
  // UF se torna obrigatório
  camposObrigatorios.push('uf');
}
```

### Backend (Server-Side)
```javascript
// Validação básica implementada
// TODO: Adicionar validação mais robusta com biblioteca
// como Joi ou Yup

// Validações atuais:
- ID único automático
- Data de atualização automática
- Status padrão: "Em Aberto"
- Anexos inicializados como array vazio
```

## Estados do Sistema

### Status do Evento (Workflow)
```
     ┌─────────────┐
     │  Em Aberto  │
     └──────┬──────┘
            │
            ▼
     ┌─────────────┐
     │ Em Análise  │
     └──────┬──────┘
            │
      ┌─────┴─────┐
      │           │
      ▼           ▼
┌──────────┐  ┌──────────────────────┐
│Aprovado  │  │  Não Aprovado        │
└────┬─────┘  └──────────────────────┘
     │
  ┌──┴──┐
  │     │
  ▼     ▼
┌────────┐  ┌────────────────────────┐
│Cancel. │  │ Aprovado para ajustes  │
└────────┘  └────────────────────────┘
```

### Tipos de Evento
1. **Reunião/Visita Técnica**
   - Eventos corporativos
   - Visitas institucionais
   - Reuniões técnicas

2. **Solenidade**
   - Cerimônias oficiais
   - Eventos de premiação
   - Aniversários institucionais

3. **Congresso/Seminário/Workshop/Feira**
   - Eventos acadêmicos
   - Feiras comerciais
   - Workshops técnicos
   - Seminários e palestras

## Performance

### Otimizações Implementadas
- **Filtros no backend**: Reduz payload de resposta
- **Scroll virtual na tabela**: Melhor performance com muitos registros
- **Debounce em filtros**: Evita requisições excessivas
- **CSS animations**: Utiliza GPU para transições suaves
- **Lazy loading**: Componentes carregados sob demanda

### Métricas Esperadas
- Tempo de carregamento inicial: < 2s
- Filtros aplicados: < 300ms
- Upload de arquivo: < 1s (arquivo de 5MB)
- Renderização de 100 eventos: < 500ms

## Segurança

### Medidas Implementadas
1. **CORS**: Apenas origens permitidas
2. **Validação de upload**: Tipos de arquivo e tamanho
3. **Path traversal**: Prevenido em uploads
4. **XSS**: React escapa automaticamente HTML
5. **SQL Injection**: N/A (sem banco SQL)

### TODO - Melhorias de Segurança
- [ ] Autenticação JWT
- [ ] Rate limiting
- [ ] HTTPS obrigatório em produção
- [ ] Sanitização avançada de inputs
- [ ] Audit logs
- [ ] Criptografia de arquivos sensíveis

## Escalabilidade

### Limitações Atuais
- **In-memory storage**: Dados perdidos ao reiniciar servidor
- **Single instance**: Não suporta múltiplas instâncias
- **File storage local**: Não distribuído
- **No caching**: Todas requisições processam dados completos

### Roadmap para Escalabilidade
1. **Fase 1**: PostgreSQL + Redis
2. **Fase 2**: S3 para arquivos
3. **Fase 3**: Load balancer + múltiplas instâncias
4. **Fase 4**: Microserviços + message queue

## Testes

### Estrutura de Testes (TODO)
```
tests/
├── unit/
│   ├── backend/
│   │   ├── routes.test.js
│   │   └── validators.test.js
│   └── frontend/
│       ├── Dashboard.test.js
│       ├── EventsList.test.js
│       └── EventForm.test.js
├── integration/
│   ├── api.test.js
│   └── e2e.test.js
└── fixtures/
    └── eventos.json
```

### Cobertura Esperada
- Unit tests: > 80%
- Integration tests: > 70%
- E2E tests: Fluxos críticos

## Monitoramento

### Logs Recomendados
```javascript
// Backend
- Requisições HTTP (método, path, status, tempo)
- Erros e exceções
- Uploads de arquivo
- Operações CRUD

// Frontend
- Erros de renderização
- Tempo de carregamento de componentes
- Falhas de requisição
- User actions tracking
```

### Métricas Importantes
- Taxa de erro de API
- Tempo médio de resposta
- Usuários ativos
- Eventos criados/dia
- Taxa de aprovação de eventos

## Deploy

### Desenvolvimento
```bash
# Backend
npm start

# Frontend
cd client && npm start
```

### Produção
```bash
# Backend
NODE_ENV=production npm start

# Frontend
npm run build
# Servir ./build com nginx ou similar
```

### Docker (TODO)
```dockerfile
# Dockerfile para backend
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --production
COPY . .
EXPOSE 3001
CMD ["node", "server.js"]
```

## Troubleshooting

### Problemas Comuns

1. **CORS Error**
   - Verificar ALLOWED_ORIGINS em .env
   - Confirmar frontend rodando na porta correta

2. **Upload falha**
   - Verificar permissões da pasta uploads/
   - Confirmar MAX_FILE_SIZE

3. **Eventos não aparecem**
   - Verificar network tab no DevTools
   - Confirmar backend respondendo na porta 3001

4. **Estilos quebrados**
   - Limpar cache do navegador
   - Verificar App.css importado corretamente

## Contato da Equipe Técnica

Para dúvidas técnicas ou reportar bugs:
- Email: dev@aeb.org.br
- Issues: GitHub repository
- Slack: #dev-aeb-eventos

---

**Última atualização**: Janeiro 2026
