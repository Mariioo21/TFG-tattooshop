@echo off
setlocal ENABLEDELAYEDEXPANSION

REM Ir a la raiz
cd /d "%~dp0"

echo ======================
echo  Iniciando Tattooshop
echo ======================
echo.

REM Levantamos todos los servicios con docker
docker compose up --build -d

IF ERRORLEVEL 1 (
    echo Error al ejecutar "docker compose up --build -d"
    echo    - Asegurate de que Docker Desktop está abierto
    echo.
    pause
    exit /b 1
)

echo Contenedores levantados
echo.

REM Abrir en el navegador directamente el login 
start "" "http://localhost:3000/login"

echo.
echo =========================================
echo Tattooshop esta arrancando:
echo    - Frontend: http://localhost:3000/login
echo    - Backend:  http://localhost:8080
echo =========================================
echo.
endlocal

