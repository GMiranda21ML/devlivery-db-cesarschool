@echo off
title Dev Livery - Start All

echo ==============================
echo    Dev Livery - Start All
echo ==============================

:: Diretorio raiz (onde este .bat esta salvo)
set ROOT=%~dp0

:: ─── 1. Spring Boot ───────────────────────────────────────────
echo.
echo [1/2] Subindo Spring Boot...
start "Spring Boot" cmd /k "cd /d %ROOT% && mvnw.cmd spring-boot:run"

:: ─── 2. Streamlit ─────────────────────────────────────────────
echo [2/2] Subindo Streamlit (dashboard)...
start "Streamlit" cmd /k "cd /d %ROOT%dashboard && .venv\Scripts\activate && streamlit run app.py"

:: ─── Info ─────────────────────────────────────────────────────
echo.
echo ==============================
echo  Servicos rodando:
echo   Spring Boot ^> http://localhost:8080
echo   Streamlit   ^> http://localhost:8501
echo ==============================
echo  Feche as janelas abertas para encerrar.
echo.
pause