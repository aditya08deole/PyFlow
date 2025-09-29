@echo off
echo 🚀 PyFlow Quick Setup
echo ==================

REM Check if PowerShell is available
where powershell >nul 2>nul
if %ERRORLEVEL% neq 0 (
    echo ❌ PowerShell not found. Please install PowerShell.
    pause
    exit /b 1
)

REM Run the PowerShell setup script
echo Running PyFlow setup script...
echo.

REM Check for admin privileges
net session >nul 2>&1
if %ERRORLEVEL% equ 0 (
    echo ✅ Running with Administrator privileges
    powershell -ExecutionPolicy Bypass -File "%~dp0setup-pyflow.ps1" %*
) else (
    echo ⚠️  Not running as Administrator
    echo Choose an option:
    echo 1. Skip tool installation (continue without admin)
    echo 2. Exit and run as Administrator
    echo.
    set /p choice="Enter your choice (1 or 2): "
    
    if "%choice%"=="1" (
        powershell -ExecutionPolicy Bypass -File "%~dp0setup-pyflow.ps1" -SkipTools %*
    ) else (
        echo Please right-click this file and select "Run as administrator"
        pause
        exit /b 1
    )
)

echo.
echo ✅ Setup completed!
echo.
echo 📋 Next steps:
echo 1. Open the project in VS Code: code .
echo 2. Start services: docker-compose up
echo 3. Open frontend: http://localhost:3000
echo 4. Open API docs: http://localhost:8000/docs
echo.
pause