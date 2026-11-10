@echo off
title Pixel LIVE AI - local
cd /d "%~dp0"
echo ==========================================
echo       PIXEL LIVE AI - ANIME EDITION
echo ==========================================
where node >nul 2>nul
if errorlevel 1 (
  echo Node.js nao encontrado. Instale Node.js 22 LTS: https://nodejs.org/
  pause
  exit /b 1
)
where ollama >nul 2>nul
if errorlevel 1 (
  echo Ollama nao encontrado. Instale: https://ollama.com/download/windows
  pause
  exit /b 1
)
echo Verificando modelo local...
ollama list | findstr /i "qwen2.5:0.5b" >nul
if errorlevel 1 (
  echo Baixando modelo Qwen 0.5B. Esta etapa precisa de internet e ocorre apenas na primeira vez.
  ollama pull qwen2.5:0.5b
  if errorlevel 1 (
    echo Falha ao baixar modelo. Verifique a conexao e tente novamente.
    pause
    exit /b 1
  )
)
if not exist node_modules\ws (
  echo Instalando dependencia WebSocket...
  call npm install ws
  if errorlevel 1 (
    echo Falha no npm install. Confira Node.js e conexao.
    pause
    exit /b 1
  )
)
echo Iniciando ponte local...
node local-ai\bridge.mjs
pause
