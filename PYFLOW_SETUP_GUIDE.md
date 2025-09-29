# 🚀 PyFlow Development Setup Guide

## 📋 Overview
Complete setup guide for PyFlow - Visual Python Coding Assistant with React frontend, FastAPI backend, and advanced data structure visualization capabilities.

## 🔧 1. Essential VS Code Extensions (✅ Installed)

### Core Development Extensions
```vscode-extensions
ms-python.python,ms-python.vscode-pylance,ms-python.debugpy,ms-toolsai.jupyter,github.copilot,github.copilot-chat,dsznajder.es7-react-js-snippets,esbenp.prettier-vscode,dbaeumer.vscode-eslint,ms-azuretools.vscode-docker,usernamehw.errorlens,rangav.vscode-thunder-client,hediet.vscode-drawio,eamodio.gitlens
```

### Additional Recommended Extensions
```vscode-extensions
ms-vscode-remote.remote-containers,redhat.vscode-yaml,christian-kohler.npm-intellisense,ms-python.isort,visualstudioexptteam.vscodeintellicode,formulahendry.code-runner
```

## 💻 2. Required Tools Installation

### Windows PowerShell Commands
```powershell
# Install Chocolatey (if not installed)
Set-ExecutionPolicy Bypass -Scope Process -Force; [System.Net.ServicePointManager]::SecurityProtocol = [System.Net.ServicePointManager]::SecurityProtocol -bor 3072; iex ((New-Object System.Net.WebClient).DownloadString('https://community.chocolatey.org/install.ps1'))

# Install Core Development Tools
choco install git nodejs python docker-desktop postgresql redis -y

# Install Python Tools
pip install --upgrade pip virtualenv black pylint flake8 isort

# Install Global Node.js Tools  
npm install -g prettier eslint create-react-app typescript @types/node
```

### Alternative: Manual Installation
- **Git**: https://git-scm.com/downloads
- **Node.js**: https://nodejs.org/ (LTS version)
- **Python**: https://python.org/ (3.9+)
- **Docker Desktop**: https://docker.com/products/docker-desktop
- **PostgreSQL**: https://postgresql.org/download/
- **Redis**: https://github.com/microsoftarchive/redis/releases

## 🏗️ 3. Project Setup & Dependencies

### Clone and Setup Project
```powershell
# Clone the repository
git clone https://github.com/aditya08deole/PyFlow.git
cd PyFlow

# Create Python virtual environment
python -m venv venv
.\venv\Scripts\Activate.ps1

# Install Python dependencies
pip install -r backend/requirements.txt

# Install Node.js dependencies
cd frontend
npm install
cd ..
```

### Environment Configuration
```powershell
# Create .env files
echo "DATABASE_URL=postgresql://postgres:password@localhost:5432/pyflow
REDIS_URL=redis://localhost:6379
OPENAI_API_KEY=your_openai_key_here
CORS_ORIGINS=http://localhost:3000,http://localhost:3001" > backend/.env

echo "REACT_APP_API_URL=http://localhost:8000
REACT_APP_WS_URL=ws://localhost:8000" > frontend/.env
```

## 🐳 4. Docker Development Setup

### Using Docker Compose (Recommended)
```powershell
# Start all services with Docker
docker-compose up --build

# Or start in detached mode
docker-compose up -d --build

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

### Manual Service Startup
```powershell
# Terminal 1: Start Backend
cd backend
.\venv\Scripts\Activate.ps1
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000

# Terminal 2: Start Frontend
cd frontend
npm start

# Terminal 3: Start Database (if not using Docker)
pg_ctl -D "C:\Program Files\PostgreSQL\15\data" start
redis-server
```

## 🔍 5. GitHub Copilot Commands for PyFlow

### Code Quality & Error Fixing
```
/fix all errors in the workspace
/fix issues in Python files with type hints
/fix React TypeScript components
/explain the flowchart generation algorithm
/optimize the data structure visualization code
```

### Feature Development
```
/generate unit tests for ds_analyzer.py
/create API documentation for FastAPI endpoints
/explain the AST parsing logic in flowchart_generator.py
/suggest improvements for React component performance
```

## 🚀 6. Development Workflow

### Code Formatting & Linting
```powershell
# Python Code Formatting
black backend/
isort backend/
pylint backend/app/ --errors-only

# Frontend Formatting
cd frontend
npm run lint
npm run lint:fix
npx prettier --write src/

# Format All Files
cd backend && black . && isort . && cd ../frontend && npm run lint:fix
```

### Git Workflow with Auto-fix
```powershell
# Auto-fix and commit workflow
# 1. Format code
black backend/ ; isort backend/ ; cd frontend ; npm run lint:fix ; cd ..

# 2. Run tests
cd backend && python -m pytest tests/ && cd ../frontend && npm test -- --watchAll=false && cd ..

# 3. Git operations
git add .
git commit -m "feat: implement enhanced DS visualization with auto-fixes"
git push origin main
```

## 🧪 7. Testing & Quality Assurance

### Backend Testing
```powershell
cd backend
python -m pytest tests/ -v
python -m pytest tests/test_ds_analyzer.py --cov=app.services
```

### Frontend Testing
```powershell
cd frontend
npm test
npm run test:coverage
npm run build  # Production build test
```

### API Testing with Thunder Client
1. Open Thunder Client in VS Code
2. Import `tests/api_collection.json`
3. Test endpoints:
   - `POST /api/flowchart/generate`
   - `POST /api/ds-analysis/analyze`
   - `GET /api/health`

## 📊 8. Database Setup

### PostgreSQL Setup
```powershell
# Create database
createdb pyflow

# Run migrations (when implemented)
# cd backend && alembic upgrade head
```

### Redis Setup
```powershell
# Start Redis (if installed manually)
redis-server

# Test Redis connection
redis-cli ping  # Should return PONG
```

## 🌐 9. Access Points

| Service | URL | Description |
|---------|-----|-------------|
| Frontend | http://localhost:3000 | React App |
| Backend API | http://localhost:8000 | FastAPI Docs |
| API Documentation | http://localhost:8000/docs | Swagger UI |
| Alternative Docs | http://localhost:8000/redoc | ReDoc UI |
| Database | localhost:5432 | PostgreSQL |
| Redis | localhost:6379 | Cache Server |

## 🔧 10. VS Code Configuration

### Workspace Settings
Create `.vscode/settings.json`:
```json
{
  "python.defaultInterpreterPath": "./venv/Scripts/python.exe",
  "python.formatting.provider": "black",
  "python.linting.enabled": true,
  "python.linting.pylintEnabled": true,
  "editor.formatOnSave": true,
  "editor.codeActionsOnSave": {
    "source.organizeImports": true,
    "source.fixAll.eslint": true
  },
  "typescript.preferences.importModuleSpecifier": "relative"
}
```

### Launch Configuration
Create `.vscode/launch.json`:
```json
{
  "version": "0.2.0",
  "configurations": [
    {
      "name": "Python: FastAPI",
      "type": "python",
      "request": "launch",
      "program": "${workspaceFolder}/backend/app/main.py",
      "console": "integratedTerminal",
      "cwd": "${workspaceFolder}/backend"
    },
    {
      "name": "Attach to React",
      "type": "node",
      "request": "attach",
      "port": 3000,
      "restart": true,
      "localRoot": "${workspaceFolder}/frontend/src",
      "remoteRoot": "/app/src"
    }
  ]
}
```

## 🚨 11. Troubleshooting

### Common Issues & Solutions

#### Python Import Errors
```powershell
# Activate virtual environment
.\venv\Scripts\Activate.ps1

# Reinstall packages
pip install -r requirements.txt

# Check Python path in VS Code
Ctrl+Shift+P → "Python: Select Interpreter"
```

#### Node.js Issues
```powershell
# Clear npm cache
npm cache clean --force

# Delete node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

#### Docker Issues
```powershell
# Reset Docker
docker-compose down -v
docker system prune -f
docker-compose up --build --force-recreate
```

## ✅ 12. Quick Verification Checklist

- [ ] VS Code extensions installed and active
- [ ] Python virtual environment activated
- [ ] Backend server running on port 8000
- [ ] Frontend server running on port 3000
- [ ] Database connections working
- [ ] Redis server running
- [ ] Git repository properly configured
- [ ] Environment variables set
- [ ] API endpoints responding
- [ ] Data structure visualization working

## 📝 13. Next Steps

1. **Development Phase**: Start implementing features using the installed extensions
2. **Testing Phase**: Use Thunder Client for API testing, Jest for frontend testing
3. **Deployment Phase**: Use Docker containers for production deployment
4. **Monitoring Phase**: Implement logging and monitoring for production

---

## 🎯 Quick Start Command
```powershell
# One-command setup (after tools installation)
git clone https://github.com/aditya08deole/PyFlow.git && cd PyFlow && python -m venv venv && .\venv\Scripts\Activate.ps1 && pip install -r backend/requirements.txt && cd frontend && npm install && cd .. && docker-compose up --build
```

Happy Coding! 🚀✨