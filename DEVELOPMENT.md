# PyFlow Development Guide

Complete setup and development guide for PyFlow - Visual Python Coding Assistant with enhanced Data Structure & Algorithm visualization.

## Development Progress Checklist
- [x] ✅ Project Requirements & Architecture
- [x] ✅ Complete Project Scaffolding 
- [x] ✅ Enhanced DS Visualization Components
- [x] ✅ Backend Services & API Endpoints
- [x] ✅ **Essential VS Code Extensions Installed**
- [x] ✅ **Automated Setup Scripts Created**
- [x] ✅ **Development Environment Configuration**
- [x] ✅ **Code Quality Tools (ESLint, Prettier, Pylint)**
- [x] ✅ **VS Code Tasks & Launch Configuration**
- [x] ✅ **CI/CD Pipeline with GitHub Actions**
- [ ] Project Compilation & Build Verification
- [ ] Full Stack Integration Testing
- [ ] Performance Optimization & Testing
- [ ] Documentation & User Guide Completion

## 🚀 Quick Setup Options

### Option 1: Automated Setup (Recommended)
```bash
# Double-click or run in PowerShell
./setup-pyflow.bat
```
*This will install all tools, dependencies, and configure your environment automatically.*

### Option 2: Docker Only (Fastest)
```bash
docker-compose up --build
```
*Requires Docker Desktop to be installed.*

### Option 3: Manual Setup
See detailed instructions in [**PYFLOW_SETUP_GUIDE.md**](./PYFLOW_SETUP_GUIDE.md)

## 🔧 Prerequisites (Auto-installed by setup script)

- **Node.js** (v18+) - JavaScript runtime
- **Python** (3.9+) - Backend language  
- **Docker Desktop** - Containerization
- **Git** - Version control
- **VS Code** - Code editor
- **PostgreSQL** - Database (optional, included in Docker)
- **Redis** - Caching (optional, included in Docker)

## 🎯 VS Code Extensions (✅ Installed)

Essential extensions for PyFlow development:

```vscode-extensions
ms-python.python,ms-python.vscode-pylance,github.copilot,github.copilot-chat,dsznajder.es7-react-js-snippets,esbenp.prettier-vscode,dbaeumer.vscode-eslint,ms-azuretools.vscode-docker,usernamehw.errorlens,rangav.vscode-thunder-client,hediet.vscode-drawio,eamodio.gitlens
```

## 🚀 Development Commands

### VS Code Tasks (Ctrl+Shift+P → "Tasks: Run Task")
- 🚀 **Start PyFlow (Full Stack)** - Complete development environment
- 🐍 **Start Backend Only** - FastAPI server on port 8000  
- ⚛️ **Start Frontend Only** - React dev server on port 3000
- 🧪 **Run All Tests** - Backend and frontend test suites
- ✨ **Format Code (All)** - Auto-format Python and TypeScript
- 🔍 **Lint All Code** - Check code quality across the project
- 📦 **Install All Dependencies** - Reinstall all packages
- 🔧 **Reset Environment** - Clean Docker environment

### Manual Commands
```bash
# Start full stack development
docker-compose up --build

# Individual services
cd backend && uvicorn app.main:app --reload    # Backend only
cd frontend && npm start                       # Frontend only

# Code quality
black backend/ && isort backend/              # Format Python
npm run lint:fix --prefix frontend            # Format TypeScript

# Testing  
python -m pytest backend/tests/ -v            # Backend tests
npm test --prefix frontend                     # Frontend tests
```

## 🌐 Access Points

| Service | URL | Description |
|---------|-----|-------------|
| 🎨 Frontend | http://localhost:3000 | React Application |
| 🔧 Backend API | http://localhost:8000 | FastAPI Server |
| 📚 API Docs | http://localhost:8000/docs | Interactive Swagger UI |
| 📖 Alt Docs | http://localhost:8000/redoc | Alternative API Documentation |
| 🗄️ Database | localhost:5432 | PostgreSQL Database |
| ⚡ Cache | localhost:6379 | Redis Cache Server |

## Individual Service Development

### Frontend Only
```bash
cd frontend
npm start
```
*Note: Backend API calls will fail unless backend is also running*

### Backend Only
```bash
cd backend
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

## Environment Configuration

### Frontend (.env)
Create `frontend/.env`:
```
REACT_APP_API_URL=http://localhost:8000
REACT_APP_ENABLE_DS_VISUALIZATION=true
REACT_APP_DEBUG_MODE=true
```

### Backend (.env)
Create `backend/.env`:
```
DATABASE_URL=postgresql://pyflow:pyflow@localhost:5432/pyflow
REDIS_URL=redis://localhost:6379/0
OPENAI_API_KEY=your_openai_key_here
DEBUG=true
```

## Development Workflow

1. **Code Changes**: Edit files in `frontend/src` or `backend/app`
2. **Hot Reload**: Both services support hot reloading
3. **API Testing**: Use http://localhost:8000/docs for interactive API testing
4. **DS Visualization**: Test with sample algorithms in the enhanced code editor

## Enhanced Features Testing

### Data Structure Visualization
Try this code in the editor:
```python
# Array operations
arr = [3, 1, 4, 1, 5, 9]
arr.append(2)
arr.insert(0, 8)

# Stack operations  
stack = []
stack.append(10)
stack.append(20)
popped = stack.pop()
```

### Algorithm Comparison
Use the compare mode to test different sorting algorithms:
```python
# Bubble Sort
def bubble_sort(arr):
    n = len(arr)
    for i in range(n):
        for j in range(0, n - i - 1):
            if arr[j] > arr[j + 1]:
                arr[j], arr[j + 1] = arr[j + 1], arr[j]
    return arr

# Quick Sort
def quick_sort(arr):
    if len(arr) <= 1:
        return arr
    pivot = arr[len(arr) // 2]
    left = [x for x in arr if x < pivot]
    middle = [x for x in arr if x == pivot]
    right = [x for x in arr if x > pivot]
    return quick_sort(left) + middle + quick_sort(right)
```

## Troubleshooting

### Common Issues

1. **Port Conflicts**
   - Frontend (3000): Check if another React app is running
   - Backend (8000): Check if another Python service is using port 8000
   - Database (5432): Check if PostgreSQL is already installed locally

2. **Docker Issues**
   ```bash
   # Reset Docker environment
   docker-compose down -v
   docker-compose up --build
   ```

3. **Node Modules Issues**
   ```bash
   cd frontend
   rm -rf node_modules package-lock.json
   npm install
   ```

4. **Python Dependencies**
   ```bash
   cd backend
   pip install --upgrade pip
   pip install -r requirements.txt
   ```

### Performance Tips

- **Development Mode**: Use individual services for faster iteration
- **Production Build**: Use Docker Compose for full integration testing
- **DS Visualization**: Large datasets may impact performance - limit to reasonable sizes during development

## Next Steps

1. **Install Extensions**: See next section in development guide
2. **Run Tests**: `npm test` (frontend) and `pytest` (backend)
3. **Build for Production**: `docker-compose -f docker-compose.prod.yml up`

Happy coding with PyFlow Enhanced! 🐍✨