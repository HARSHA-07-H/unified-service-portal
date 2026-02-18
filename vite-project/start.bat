@echo off
setlocal enabledelayedexpansion

echo ========================================
echo Unified Service Portal
echo ========================================
echo.

:: Set working directory to script location
cd /d "%~dp0"

:: Check if Java is installed
echo [1/5] Checking Java installation...
java -version >nul 2>&1
if errorlevel 1 (
    echo ERROR: Java is not installed or not in PATH
    echo Please install Java 17 or higher and try again
    echo Download from: https://adoptium.net/
    pause
    exit /b 1
)
echo Java found!
echo.

:: Check if backend JAR exists
set BACKEND_JAR=backend\service.jar
echo [2/5] Checking backend JAR...
if not exist "%BACKEND_JAR%" (
    echo ERROR: Backend JAR not found at %BACKEND_JAR%
    pause
    exit /b 1
)
echo Backend JAR found!
echo.

:: Create necessary directories
echo [3/5] Creating directories...
if not exist "data" mkdir data
if not exist "logs" mkdir logs
echo Directories ready!
echo.

:: Start backend server in background
echo [4/5] Starting backend server...
start /b java -jar "%BACKEND_JAR%" --spring.profiles.active=production > logs\backend.log 2>&1
if errorlevel 1 (
    echo ERROR: Failed to start backend server
    pause
    exit /b 1
)

:: Wait for backend to be ready
echo Waiting for backend to be ready...
set MAX_ATTEMPTS=30
set ATTEMPT=0

:HEALTH_CHECK
set /a ATTEMPT+=1
timeout /t 2 /nobreak >nul
curl -s http://localhost:8081/api/health >nul 2>&1
if errorlevel 1 (
    if !ATTEMPT! GEQ %MAX_ATTEMPTS% (
        echo ERROR: Backend failed to start within 60 seconds
        echo Check logs\backend.log for details
        pause
        exit /b 1
    )
    goto HEALTH_CHECK
)

echo Backend is ready!
echo.

:: Launch Electron app
echo [5/5] Launching application...
start "" "UnifiedServicePortal.exe"

echo.
echo ========================================
echo Application started successfully!
echo Backend: http://localhost:8081
echo ========================================
echo.
echo Press any key to exit this launcher...
echo (The application will continue running)
pause >nul
