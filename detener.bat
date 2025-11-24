@echo off
setlocal

cd /d "%~dp0"

echo =========================================
echo   Deteniendo contenedores Tattooshop
echo =========================================
echo.

docker compose down

IF ERRORLEVEL 1 (
    echo Error al ejecutar "docker compose down"
    echo.
    pause
    exit /b 1
)
echo =========================================
echo Todos los servicios han sido detenidos
echo =========================================
echo.
endlocal
