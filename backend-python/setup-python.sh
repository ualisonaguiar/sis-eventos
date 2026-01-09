#!/bin/bash

echo "🐍 Configurando Backend Python/Flask - Sistema AEB"
echo "=================================================="

# Cores
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

# Verificar Python
echo -e "\n${BLUE}Verificando Python...${NC}"
if ! command -v python3 &> /dev/null; then
    echo -e "${RED}❌ Python 3 não encontrado${NC}"
    echo -e "${YELLOW}Instale Python 3.8+ primeiro${NC}"
    exit 1
fi
echo -e "${GREEN}✓ Python $(python3 --version)${NC}"

# Verificar pip
echo -e "\n${BLUE}Verificando pip...${NC}"
if ! command -v pip3 &> /dev/null; then
    echo -e "${RED}❌ pip não encontrado${NC}"
    exit 1
fi
echo -e "${GREEN}✓ pip $(pip3 --version)${NC}"

# Criar ambiente virtual (recomendado)
echo -e "\n${BLUE}Criando ambiente virtual...${NC}"
if [ ! -d "venv" ]; then
    python3 -m venv venv
    echo -e "${GREEN}✓ Ambiente virtual criado${NC}"
else
    echo -e "${YELLOW}⚠ Ambiente virtual já existe${NC}"
fi

# Ativar ambiente virtual
echo -e "\n${BLUE}Ativando ambiente virtual...${NC}"
source venv/bin/activate
echo -e "${GREEN}✓ Ambiente virtual ativado${NC}"

# Instalar dependências
echo -e "\n${BLUE}Instalando dependências...${NC}"
pip install -r requirements.txt

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✓ Dependências instaladas${NC}"
else
    echo -e "${RED}❌ Erro ao instalar dependências${NC}"
    exit 1
fi

# Criar pasta de uploads
echo -e "\n${BLUE}Criando pasta de uploads...${NC}"
mkdir -p uploads
echo -e "${GREEN}✓ Pasta uploads criada${NC}"

# Copiar .env.example para .env
if [ -f ".env.example" ]; then
    if [ ! -f ".env" ]; then
        cp .env.example .env
        echo -e "${GREEN}✓ Arquivo .env criado${NC}"
    fi
fi

echo -e "\n${GREEN}================================================${NC}"
echo -e "${GREEN}✓ Setup concluído com sucesso!${NC}"
echo -e "${GREEN}================================================${NC}"

echo -e "\n${BLUE}Para iniciar o servidor Flask:${NC}"
echo -e "${YELLOW}1. Ative o ambiente virtual:${NC}"
echo -e "   source venv/bin/activate"
echo -e "\n${YELLOW}2. Execute o servidor:${NC}"
echo -e "   python server.py"
echo -e "   ${GREEN}→ http://localhost:5000${NC}"

echo -e "\n${BLUE}Para desativar o ambiente virtual:${NC}"
echo -e "   deactivate"

echo -e "\n${YELLOW}Nota: O Flask usa a porta 5000 (diferente do Node.js que usa 3001)${NC}"
echo -e "${YELLOW}Atualize o frontend para usar http://localhost:5000/api${NC}\n"
