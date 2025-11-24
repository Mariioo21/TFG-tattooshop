@echo off
setlocal ENABLEDELAYEDEXPANSION

REM Ir a la carpeta donde está esta el archivo .bat (raiz)
cd /d "%~dp0"

echo =====================================================
echo  Iniciando Tattooshop (backend + frontend + MySQL)
echo =====================================================
echo.

REM Levantar todos los servicios
docker compose up -d

IF ERRORLEVEL 1 (
    echo Error al ejecutar "docker compose up -d"
    echo    - Asegurate de que Docker Desktop está abierto
    echo.
    pause
    exit /b 1
)

echo Contenedores levantados
echo.

REM Abrir el navegador en el frontend
start "" "http://localhost:3000"

echo.
echo =========================================
echo Tattooshop esta arrancando:
echo    - Frontend: http://localhost:3000
echo    - Backend:  http://localhost:8080
echo =========================================
echo.
endlocal

