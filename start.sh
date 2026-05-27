#!/bin/bash

# Cores para o output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

# Diretório raiz do projeto (onde o script está)
ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

# ─── Detecta o SO ─────────────────────────────────────────────────────────
if [[ "$OSTYPE" == "msys" || "$OSTYPE" == "cygwin" || "$OSTYPE" == "win32" ]]; then
  IS_WINDOWS=true
  LOG_DIR="$ROOT_DIR/logs"
  VENV_ACTIVATE=".venv/Scripts/activate"
else
  IS_WINDOWS=false
  LOG_DIR="/tmp"
  VENV_ACTIVATE=".venv/bin/activate"
fi

# Cria pasta de logs se não existir
mkdir -p "$LOG_DIR"

SPRING_LOG="$LOG_DIR/spring-boot.log"
STREAMLIT_LOG="$LOG_DIR/streamlit.log"

echo -e "${BLUE}==============================${NC}"
echo -e "${BLUE}   Dev Livery - Start All     ${NC}"
echo -e "${BLUE}==============================${NC}"
if $IS_WINDOWS; then
  echo -e "${YELLOW}   Sistema: Windows${NC}"
else
  echo -e "${YELLOW}   Sistema: Linux/Mac${NC}"
fi

# ─── Função para matar tudo ao pressionar Ctrl+C ──────────────────────────
cleanup() {
  echo -e "\n${YELLOW}Encerrando serviços...${NC}"
  kill $SPRING_PID $STREAMLIT_PID 2>/dev/null
  echo -e "${RED}Serviços encerrados.${NC}"
  exit 0
}
trap cleanup SIGINT SIGTERM

# ─── 1. Spring Boot ───────────────────────────────────────────────────────
echo -e "\n${GREEN}[1/2] Subindo Spring Boot...${NC}"
cd "$ROOT_DIR"

./mvnw spring-boot:run > "$SPRING_LOG" 2>&1 &
SPRING_PID=$!
echo -e "     PID: ${SPRING_PID} | Log: ${SPRING_LOG}"

# ─── 2. Streamlit ─────────────────────────────────────────────────────────
echo -e "\n${GREEN}[2/2] Subindo Streamlit (dashboard)...${NC}"
cd "$ROOT_DIR/dashboard"

if [ -d ".venv" ]; then
  echo -e "     Ativando virtualenv..."
  source "$VENV_ACTIVATE"
fi

streamlit run app.py > "$STREAMLIT_LOG" 2>&1 &
STREAMLIT_PID=$!
echo -e "     PID: ${STREAMLIT_PID} | Log: ${STREAMLIT_LOG}"

# ─── Status ───────────────────────────────────────────────────────────────
echo -e "\n${BLUE}==============================${NC}"
echo -e "${GREEN}Ambos os serviços estão rodando!${NC}"
echo -e "  Spring Boot → ${YELLOW}http://localhost:8080${NC}"
echo -e "  Streamlit   → ${YELLOW}http://localhost:8501${NC}"
echo -e "${BLUE}==============================${NC}"
echo -e "${YELLOW}Pressione Ctrl+C para encerrar tudo.${NC}\n"

# Mantém o script vivo e mostra se algum processo morrer
while true; do
  if ! kill -0 $SPRING_PID 2>/dev/null; then
    echo -e "${RED}[ERRO] Spring Boot caiu! Veja o log: ${SPRING_LOG}${NC}"
  fi
  if ! kill -0 $STREAMLIT_PID 2>/dev/null; then
    echo -e "${RED}[ERRO] Streamlit caiu! Veja o log: ${STREAMLIT_LOG}${NC}"
  fi
  sleep 5
done