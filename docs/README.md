# 🚀 Sistema de Gestão de Eventos AEB

Sistema completo de gerenciamento de eventos da Associação Brasileira de Engenharia (AEB) desenvolvido com React + Node.js.

## 📋 Funcionalidades

### Dashboard
- Visualização de estatísticas por ano (2026, 2025, eventos sem data definida)
- Contadores de eventos por status
- Cards interativos com navegação para listagem filtrada

### Gestão de Eventos
- **Listagem completa** com filtros avançados
- **Criação** de novos eventos
- **Edição** de eventos existentes
- **Upload de anexos**
- **Sistema de status** (Em Aberto, Em Análise, Não Aprovado, Aprovado, Cancelado, Aprovado para ajustes)

### Filtros Disponíveis
- Ano
- Status
- Identificação (busca textual)
- Organizador
- Tipo de Evento
- Âmbito (Nacional/Internacional)
- País

## 🎯 Regras de Negócio

### Campos Obrigatórios
1. **Identificação** - Descrição completa do evento
2. **Organizador** - Entidade responsável
3. **Tipo de Evento** - Reunião/Visita Técnica, Solenidade, ou Congresso/Seminário/Workshop/Feira
4. **Âmbito** - Nacional ou Internacional
5. **País** - Localização do evento
6. **Número do processo** - Identificação administrativa
7. **Justificativa** - Relevância da participação da AEB

### Status do Evento
- **Em Aberto** (19) - Evento criado, aguardando análise
- **Em Análise** (6) - Em processo de avaliação
- **Não Aprovado** (2) - Evento recusado
- **Aprovado** (126) - Evento confirmado
- **Cancelado** (5) - Evento cancelado após aprovação
- **Aprovado para ajustes** (4) - Aprovado com ressalvas

### Tipos de Evento
1. **Reunião/Visita Técnica** - Encontros técnicos e visitas institucionais
2. **Solenidade** - Cerimônias e eventos formais
3. **Congresso/Seminário/Workshop/Feira** - Eventos acadêmicos e comerciais

### Âmbito
- **Nacional** - Eventos dentro do Brasil (requer campo UF)
- **Internacional** - Eventos fora do Brasil

### Campos Adicionais
- **Data de início e fim** - Período do evento
- **Endereço** - Localização específica
- **Website do Evento** - Link para mais informações
- **Status da Data** - Confirmado ou Provisório
- **Status do processo** - Emitido ou Pendente
- **Valor Previsto** - Custo estimado em R$
- **Precisa de estande** - Checkbox para eventos comerciais
- **Observações** - Notas adicionais

### Sistema de Anexos
- Upload de documentos relacionados ao evento
- Exclusão de anexos (apenas em modo de edição)
- Armazenamento local no servidor

## 🛠️ Tecnologias Utilizadas

### Backend
- **Node.js** - Runtime JavaScript
- **Express** - Framework web
- **Multer** - Upload de arquivos
- **CORS** - Compartilhamento de recursos

### Frontend
- **React** - Biblioteca de interface
- **React Router** - Navegação SPA
- **CSS3** - Estilização customizada
- **Fetch API** - Requisições HTTP

## 🚀 Como Executar

### Pré-requisitos
- Node.js 16+ instalado
- npm ou yarn

### Backend

```bash
# Instalar dependências
npm install

# Executar servidor
npm start

# Servidor rodará em http://localhost:3001
```

### Frontend

```bash
# Navegar para a pasta do projeto
cd client

# Instalar dependências (renomear client-package.json para package.json)
mv ../client-package.json package.json
npm install

# Executar aplicação
npm start

# Aplicação rodará em http://localhost:3000
```

## 📁 Estrutura do Projeto

```
aeb-eventos/
├── server.js                 # Servidor Express
├── package.json              # Dependências backend
├── uploads/                  # Arquivos enviados
├── src/
│   ├── App.js               # Componente principal React
│   ├── App.css              # Estilos da aplicação
│   └── index.js             # Entry point React
├── public/
│   └── index.html           # HTML base
└── README.md                # Este arquivo
```

## 🎨 Design

O sistema utiliza um design moderno e único com:
- **Paleta de cores navy/cyan** - Profissional e sofisticada
- **Tipografia Syne + IBM Plex Mono** - Moderna e técnica
- **Animações sutis** - Transições suaves e micro-interações
- **Layout responsivo** - Adaptável a diferentes tamanhos de tela
- **Dark theme** - Reduz fadiga visual

### Características de Design
- Cards interativos com efeitos hover
- Gradientes e sombras para profundidade
- Badges coloridos por status
- Tabela responsiva com scroll
- Formulários bem espaçados e organizados

## 📊 API Endpoints

### Dashboard
```
GET /api/dashboard
Retorna estatísticas agrupadas por ano
```

### Eventos
```
GET /api/eventos?ano=2025&status=Aprovado
Lista eventos com filtros opcionais

GET /api/eventos/:id
Retorna um evento específico

POST /api/eventos
Cria novo evento

PUT /api/eventos/:id
Atualiza evento existente

DELETE /api/eventos/:id
Remove evento
```

### Anexos
```
POST /api/eventos/:id/anexo
Upload de arquivo (multipart/form-data)

DELETE /api/eventos/:id/anexo/:anexoId
Remove anexo
```

## 🔒 Segurança

- Validação de campos obrigatórios
- Sanitização de uploads
- CORS configurado
- Armazenamento local de arquivos

## 🚀 Próximas Melhorias

- [ ] Autenticação de usuários
- [ ] Banco de dados persistente (PostgreSQL/MongoDB)
- [ ] Exportação para PDF/Excel
- [ ] Sistema de notificações
- [ ] Histórico de alterações
- [ ] Dashboard com gráficos interativos
- [ ] Busca avançada com Elasticsearch
- [ ] Integração com calendário
- [ ] API de relatórios
- [ ] Testes automatizados

## 👥 Contribuindo

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/MinhaFeature`)
3. Commit suas mudanças (`git commit -m 'Adiciona MinhaFeature'`)
4. Push para a branch (`git push origin feature/MinhaFeature`)
5. Abra um Pull Request

## 📝 Licença

Este projeto foi desenvolvido para a Associação Brasileira de Engenharia (AEB).

## 📞 Suporte

Para dúvidas ou sugestões, entre em contato com a equipe de desenvolvimento.

---

**Desenvolvido com ❤️ para a AEB**
