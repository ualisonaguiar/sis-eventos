#!/bin/bash

echo "🐍 Iniciando Backend Python/Flask - Sistema AEB"
echo "=============================================="

# Cores
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

# Verificar se está na pasta correta
if [ ! -f "server.py" ]; then
    echo -e "${RED}❌ Erro: server.py não encontrado${NC}"
    echo -e "${YELLOW}Execute este script da pasta raiz do projeto${NC}"
    exit 1
fi

# Verificar Python
if ! command -v python3 &> /dev/null; then
    echo -e "${RED}❌ Python 3 não encontrado${NC}"
    exit 1
fi

# Verificar se ambiente virtual existe
if [ ! -d "venv" ]; then
    echo -e "${YELLOW}⚠ Ambiente virtual não encontrado${NC}"
    echo -e "${BLUE}Executando setup...${NC}\n"
    
    if [ -f "setup-python.sh" ]; then
        ./setup-python.sh
    else
        echo -e "${RED}❌ setup-python.sh não encontrado${NC}"
        echo -e "${YELLOW}Crie manualmente o ambiente virtual:${NC}"
        echo -e "  python3 -m venv venv"
        echo -e "  source venv/bin/activate"
        echo -e "  pip install -r requirements.txt"
        exit 1
    fi
fi

# Ativar ambiente virtual
echo -e "${BLUE}Ativando ambiente virtual...${NC}"
source venv/bin/activate

# Verificar dependências
echo -e "${BLUE}Verificando dependências...${NC}"
python3 -c "import flask" 2>/dev/null
if [ $? -ne 0 ]; then
    echo -e "${YELLOW}⚠ Instalando dependências...${NC}"
    pip install -r requirements.txt
fi

# Criar pasta uploads se não existir
mkdir -p uploads

# Iniciar servidor
echo -e "\n${GREEN}============================================${NC}"
echo -e "${GREEN}🚀 Iniciando Servidor Flask...${NC}"
echo -e "${GREEN}============================================${NC}"
echo -e "\n${BLUE}Servidor disponível em:${NC}"
echo -e "${GREEN}→ http://localhost:5000${NC}"
echo -e "${GREEN}→ http://localhost:5000/api/dashboard${NC}"
echo -e "\n${YELLOW}Para parar o servidor, pressione Ctrl+C${NC}"
echo -e "${YELLOW}Para desativar o ambiente virtual: deactivate${NC}\n"

# Executar servidor
python3 server.py
