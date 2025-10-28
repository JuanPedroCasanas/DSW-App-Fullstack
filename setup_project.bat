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
