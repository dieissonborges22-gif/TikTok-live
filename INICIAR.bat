@echo off
setlocal
title Pixel LIVE Studio 2.0
cd /d "%~dp0"
echo.
echo ==========================================
echo       PIXEL LIVE STUDIO 2.0
echo ==========================================
echo.
where node >nul 2>nul
if errorlevel 1 (
  echo Node.js nao encontrado.
  echo Instale Node.js 22 LTS em https://nodejs.org/
  pause
  exit /b 1
)
node -e "if(Number(process.versions.node.split('.')[0])<22)process.exit(1)"
if errorlevel 1 (
  echo Esta versao precisa do Node.js 22 LTS ou superior.
  echo Atualize em https://nodejs.org/ e abra este arquivo novamente.
  pause
  exit /b 1
)
if not exist "node_modules\express\package.json" (
  echo Instalando dependencias. Aguarde...
  call npm install --no-audit --no-fund
  if errorlevel 1 (
    echo.
    echo A instalacao falhou. Feche OBS, VS Code e outros terminais.
    echo Se aparecer EPERM, reinicie o Windows e tente novamente.
    echo Se aparecer erro SSL, confira data/hora e teste outra rede.
    pause
    exit /b 1
  )
)
echo Verificando arquivos...
call npm run check
if errorlevel 1 (
  echo O codigo nao passou na verificacao local.
  pause
  exit /b 1
)
echo.
echo Abrindo Pixel LIVE Studio...
echo Painel: http://127.0.0.1:3000
echo OBS:    http://127.0.0.1:3000/overlay
echo.
call npm start
pause
