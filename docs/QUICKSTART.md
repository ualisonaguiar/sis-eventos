# 🚀 Guia Rápido de Início

## ⚡ Início Rápido (5 minutos)

### Pré-requisitos
- Node.js 16 ou superior
- npm ou yarn

### Passo 1: Setup Automático
```bash
chmod +x setup.sh
./setup.sh
```

### Passo 2: Iniciar Backend
```bash
npm start
```
✅ Backend rodando em http://localhost:3001

### Passo 3: Iniciar Frontend (novo terminal)
```bash
# Criar pasta do cliente
mkdir client
cd client

# Copiar arquivos
cp ../client-package.json package.json
mkdir -p src public
cp -r ../src/* src/
cp -r ../public/* public/

# Instalar e iniciar
npm install
npm start
```
✅ Frontend rodando em http://localhost:3000

## 📱 Como Usar

### 1️⃣ Dashboard
- Acesse http://localhost:3000
- Visualize estatísticas por ano
- Clique em um card para filtrar eventos

### 2️⃣ Criar Novo Evento
- Clique em "Novo Evento" no menu
- Preencha os campos obrigatórios:
  - Identificação
  - Organizador
  - Tipo de Evento
  - Âmbito
  - País
  - Número do processo
  - Justificativa
- Clique em "Salvar"

### 3️⃣ Listar Eventos
- Acesse "Solicitações" no menu
- Use filtros para buscar eventos específicos
- Clique em um evento para editar

### 4️⃣ Editar Evento
- Na listagem, clique em um evento
- Modifique os campos desejados
- Adicione anexos clicando em "Anexar arquivo"
- Clique em "Salvar"

## 🎯 Recursos Principais

### ✅ Dashboard Interativo
- Estatísticas em tempo real
- Filtros por ano
- Contadores por status

### ✅ Gestão Completa
- CRUD completo de eventos
- Upload de múltiplos arquivos
- Sistema de status workflow

### ✅ Filtros Avançados
- Busca por texto
- Filtros múltiplos combinados
- Ordenação por data

### ✅ Design Moderno
- Interface intuitiva
- Animações suaves
- Totalmente responsivo

## 🔧 Configuração Avançada

### Alterar Porta do Backend
Edite `.env`:
```
PORT=3002
```

### Configurar CORS
Edite `.env`:
```
ALLOWED_ORIGINS=http://localhost:3000,http://seu-dominio.com
```

### Aumentar Limite de Upload
Edite `.env`:
```
MAX_FILE_SIZE=20971520  # 20MB
```

## 📚 Documentação Completa

- **README.md** - Documentação geral e features
- **TECHNICAL.md** - Documentação técnica e arquitetura

## 🆘 Problemas Comuns

### Backend não inicia
```bash
# Verificar se a porta 3001 está livre
lsof -i :3001

# Instalar dependências novamente
npm install
```

### Frontend não conecta
```bash
# Verificar se backend está rodando
curl http://localhost:3001/api/dashboard

# Limpar cache do npm
npm cache clean --force
cd client && npm install
```

### CORS Error
- Verificar se backend está na porta 3001
- Verificar ALLOWED_ORIGINS em .env

## 📞 Suporte

Encontrou um bug ou tem uma sugestão?
- Abra uma issue no repositório
- Entre em contato com a equipe

---

**Desenvolvido para AEB** 🇧🇷
