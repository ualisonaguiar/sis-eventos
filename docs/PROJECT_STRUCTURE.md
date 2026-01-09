# 📁 Estrutura do Projeto

```
aeb-eventos/
│
├── 📄 server.js                    # Servidor Express (Backend)
├── 📄 package.json                 # Dependências do backend
├── 📄 client-package.json          # Dependências do frontend (renomear para package.json)
│
├── 📁 uploads/                     # Diretório para arquivos enviados
│   └── .gitkeep                    # (criar manualmente ou via setup.sh)
│
├── 📁 src/                         # Código-fonte React
│   ├── 📄 App.js                  # Componente principal + rotas
│   ├── 📄 App.css                 # Estilos principais
│   └── 📄 index.js                # Entry point React
│
├── 📁 public/                      # Arquivos públicos
│   └── 📄 index.html              # HTML base
│
├── 📄 .env.example                 # Template de variáveis de ambiente
├── 📄 .gitignore                   # Arquivos ignorados pelo Git
│
├── 📄 README.md                    # Documentação principal
├── 📄 TECHNICAL.md                 # Documentação técnica
├── 📄 QUICKSTART.md                # Guia rápido
├── 📄 PROJECT_STRUCTURE.md         # Este arquivo
│
└── 📄 setup.sh                     # Script de instalação automática

```

## 🎯 Descrição dos Arquivos

### Backend (Node.js + Express)

#### `server.js`
Servidor principal que contém:
- Configuração do Express
- Middleware (CORS, JSON, uploads)
- Rotas da API
- Lógica de negócio
- Banco de dados em memória (array de eventos)

**Principais endpoints:**
- `GET /api/dashboard` - Estatísticas
- `GET /api/eventos` - Listar eventos com filtros
- `GET /api/eventos/:id` - Detalhes de um evento
- `POST /api/eventos` - Criar evento
- `PUT /api/eventos/:id` - Atualizar evento
- `DELETE /api/eventos/:id` - Deletar evento
- `POST /api/eventos/:id/anexo` - Upload de arquivo
- `DELETE /api/eventos/:id/anexo/:anexoId` - Deletar anexo

#### `package.json`
Dependências do backend:
- `express` - Framework web
- `cors` - Habilita CORS
- `multer` - Upload de arquivos

### Frontend (React)

#### `src/App.js`
Componente principal que contém:
- **Router** - Configuração de rotas
- **Dashboard** - Componente de estatísticas
- **EventsList** - Componente de listagem com filtros
- **EventForm** - Componente de formulário (criar/editar)
- **Navbar** - Barra de navegação

**Funcionalidades por componente:**

1. **Dashboard**
   - Busca estatísticas via API
   - Renderiza cards por ano (2026, 2025, sem data)
   - Mostra contadores por status
   - Navegação para eventos filtrados

2. **EventsList**
   - Listagem paginada de eventos
   - Filtros múltiplos (ano, status, busca, etc)
   - Tabs de status
   - Tabela responsiva com ordenação
   - Click para editar

3. **EventForm**
   - Formulário completo de evento
   - Validação de campos obrigatórios
   - Upload de anexos
   - Modo criação/edição
   - Campos dinâmicos (UF aparece se Nacional)

4. **Navbar**
   - Links de navegação
   - Logo AEB
   - Menu responsivo

#### `src/App.css`
Estilos modernos com:
- Variáveis CSS para cores e temas
- Sistema de design navy/cyan
- Tipografia Syne + IBM Plex Mono
- Animações e transições
- Layout responsivo
- Dark theme
- Componentes estilizados (cards, buttons, forms, table)

#### `src/index.js`
Entry point do React que:
- Importa React e ReactDOM
- Renderiza App.js no DOM
- Configura StrictMode

#### `public/index.html`
HTML base que:
- Define viewport e meta tags
- Carrega fontes do Google Fonts
- Container root para React

### Configuração

#### `.env.example`
Template de configuração:
```env
PORT=3001                           # Porta do backend
NODE_ENV=development                # Ambiente
REACT_APP_API_URL=http://localhost:3001/api  # URL da API
MAX_FILE_SIZE=10485760              # 10MB
UPLOAD_PATH=./uploads               # Pasta de uploads
ALLOWED_ORIGINS=http://localhost:3000  # CORS
```

#### `.gitignore`
Ignora:
- node_modules/
- uploads/
- .env
- build/
- Arquivos de IDE

### Documentação

#### `README.md`
- Visão geral do projeto
- Lista de funcionalidades
- Regras de negócio completas
- Guia de instalação
- Estrutura de pastas
- API endpoints
- Roadmap

#### `TECHNICAL.md`
- Arquitetura do sistema
- Fluxo de dados
- Modelo de dados
- Validações
- Performance
- Segurança
- Escalabilidade
- Deploy

#### `QUICKSTART.md`
- Guia de início rápido
- Setup em 5 minutos
- Comandos essenciais
- Troubleshooting

#### `PROJECT_STRUCTURE.md`
- Este arquivo
- Árvore de diretórios
- Descrição detalhada de cada arquivo

### Scripts

#### `setup.sh`
Script bash que:
- Verifica Node.js e npm
- Instala dependências do backend
- Cria diretório uploads/
- Copia .env.example para .env
- Prepara estrutura do frontend
- Instala dependências do frontend
- Exibe instruções de uso

## 🔄 Fluxo de Desenvolvimento

### 1. Instalação Inicial
```bash
./setup.sh
```

### 2. Desenvolvimento do Backend
```bash
# Terminal 1
npm start
# ou
npm run dev  # com nodemon (hot reload)
```

### 3. Desenvolvimento do Frontend
```bash
# Terminal 2
cd client
npm start
```

### 4. Build para Produção
```bash
# Frontend
cd client
npm run build

# Output em client/build/
# Servir com nginx ou servidor estático
```

## 📦 Dependências

### Backend
```json
{
  "express": "^4.18.2",      // Framework web
  "cors": "^2.8.5",           // CORS middleware
  "multer": "^1.4.5-lts.1",   // Upload de arquivos
  "nodemon": "^3.0.1"         // Dev: hot reload
}
```

### Frontend
```json
{
  "react": "^18.2.0",              // Biblioteca UI
  "react-dom": "^18.2.0",          // React DOM
  "react-router-dom": "^6.21.1",   // Roteamento
  "react-scripts": "5.0.1"         // Scripts CRA
}
```

## 🎨 Padrões de Código

### Backend
- **ES6+** com require/module.exports
- **RESTful API** seguindo convenções
- **Comentários** explicativos em lógica complexa
- **Error handling** com try/catch
- **Validação** de dados de entrada

### Frontend
- **Hooks** (useState, useEffect)
- **Functional Components**
- **Arrow functions**
- **Destructuring**
- **Template literals**
- **Async/await** para requisições

## 🔐 Boas Práticas Implementadas

✅ Separação de responsabilidades (backend/frontend)
✅ Componentes reutilizáveis
✅ Estado gerenciado eficientemente
✅ Validação client-side e server-side
✅ Tratamento de erros
✅ Feedback visual para usuário
✅ Design responsivo
✅ Código limpo e comentado
✅ Documentação completa

## 🚀 Próximos Passos

1. **Banco de dados**: Migrar de in-memory para PostgreSQL
2. **Autenticação**: Implementar JWT + roles
3. **Testes**: Unit tests + E2E com Jest/Cypress
4. **CI/CD**: GitHub Actions + deploy automático
5. **Docker**: Containerização da aplicação
6. **Monitoring**: Logs estruturados + APM

---

**Estrutura criada com atenção aos detalhes para facilitar desenvolvimento e manutenção** ✨
