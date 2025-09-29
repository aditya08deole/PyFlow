@echo off
echo 🚀 Starting PyFlow Development Environment
echo ==========================================

REM Temporarily clear ESP-IDF environment variables for this session
set IDF_PATH=
set IDF_TOOLS_PATH=
set PATH=%PATH:C:\Espressif=%

REM Set PyFlow-specific environment
set PYTHONPATH=%cd%\backend
set PYFLOW_ENV=development

echo ✅ ESP-IDF environment variables cleared for this session
echo ✅ PyFlow environment configured

REM Activate Python virtual environment
if exist "venv\Scripts\activate.bat" (
    echo 🐍 Activating Python virtual environment...
    call venv\Scripts\activate.bat
) else (
    echo ⚠️  Virtual environment not found. Run setup-pyflow.bat first.
    pause
    exit /b 1
)

echo.
echo 🎯 Choose your development option:
echo 1. Start Full Stack (Docker Compose)
echo 2. Start Backend Only (FastAPI)
echo 3. Start Frontend Only (React)
echo 4. Open VS Code
echo 5. Run Tests
echo 6. Exit
echo.

set /p choice="Enter your choice (1-6): "

if "%choice%"=="1" goto fullstack
if "%choice%"=="2" goto backend
if "%choice%"=="3" goto frontend
if "%choice%"=="4" goto vscode
if "%choice%"=="5" goto tests
if "%choice%"=="6" goto exit
goto invalid

:fullstack
echo 🚀 Starting PyFlow with Docker Compose...
docker-compose up --build
goto end

:backend
echo 🐍 Starting FastAPI Backend...
cd backend
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
goto end

:frontend
echo ⚛️ Starting React Frontend...
cd frontend
npm start
goto end

:vscode
echo 💻 Opening VS Code...
code .
goto end

:tests
echo 🧪 Running Tests...
echo Running Python tests...
cd backend
python -m pytest tests/ -v
cd ../frontend
echo Running React tests...
npm test -- --watchAll=false
cd ..
goto end

:invalid
echo ❌ Invalid choice. Please enter 1-6.
pause
goto end

:exit
echo 👋 Goodbye!
goto end

:end
echo.
echo 📋 Access Points:
echo Frontend: http://localhost:3000
echo Backend: http://localhost:8000  
echo API Docs: http://localhost:8000/docs
echo.
pause