@echo off
title Verificando Node.js y npm...
setlocal

echo ==============================
echo   Verificacion de Node y npm
echo ==============================

:: Verificar Node.js
where node >nul 2>&1
if %errorlevel% neq 0 (
    echo Node.js no esta instalado.
    echo Descargando instalador de Node.js LTS...

    set "NODE_INSTALLER=node-lts.msi"
    powershell -Command "Invoke-WebRequest -Uri https://nodejs.org/dist/latest-lts/win-x64/node-lts.msi -OutFile %NODE_INSTALLER%"

    echo Instalando Node.js...
    msiexec /i "%NODE_INSTALLER%" /quiet /norestart

    echo.
    echo ===================================================================
    echo Node.js ha sido instalado correctamente. 
    echo Por favor cierre y vuelva a ejecutar este script para actualizar el PATH.
    echo ===================================================================
    pause
    exit /b
)

for /f "delims=" %%v in ('node -v') do (
    set "NODE_VER=%%v"
)
call echo Node.js ya esta instalado. Version: %NODE_VER%

:: Verificar npm
where npm >nul 2>&1
if %errorlevel% neq 0 (
    echo npm no esta disponible, intentando reparar instalacion de Node.js...
    call npm install -g npm
)

for /f "delims=" %%v in ('npm -v') do (
    set "NPM_VER=%%v"
)
call echo npm ya esta instalado. Version: %NPM_VER%

echo.
echo ===================================
echo   Instalando dependencias de NPM
echo ===================================

:: Frontend
echo Instalando dependencias del frontend...
cd frontend
call npm install
if errorlevel 1 (
    echo ❌ Error al instalar dependencias del frontend.
    cd ..
    pause
    exit /b 1
)
cd ..

:: Backend
echo Instalando dependencias del backend...
cd backend
call npm install
if errorlevel 1 (
    echo ❌ Error al instalar dependencias del backend.
    cd ..
    pause
    exit /b 1
)
cd ..

echo.
echo ==========================================================================================
echo ***    Ambas dependencias han sido instaladas correctamente.   ***
echo ***    El proyecto esta listo para ser ejecutado utilizando el script 'run_project.bat'    ***
echo ==========================================================================================
pause
exit /b 0
