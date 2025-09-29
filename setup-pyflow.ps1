# PyFlow Automated Setup Script
# Run this script in PowerShell as Administrator

param(
    [switch]$SkipTools,
    [switch]$SkipDeps,
    [switch]$QuickStart
)

Write-Host "🚀 PyFlow Setup Script" -ForegroundColor Cyan
Write-Host "=========================" -ForegroundColor Cyan

# Function to check if running as administrator
function Test-Administrator {
    $currentUser = [Security.Principal.WindowsIdentity]::GetCurrent()
    $principal = New-Object Security.Principal.WindowsPrincipal($currentUser)
    return $principal.IsInRole([Security.Principal.WindowsBuiltInRole]::Administrator)
}

# Function to install Chocolatey
function Install-Chocolatey {
    if (!(Get-Command choco -ErrorAction SilentlyContinue)) {
        Write-Host "📦 Installing Chocolatey..." -ForegroundColor Yellow
        Set-ExecutionPolicy Bypass -Scope Process -Force
        [System.Net.ServicePointManager]::SecurityProtocol = [System.Net.ServicePointManager]::SecurityProtocol -bor 3072
        iex ((New-Object System.Net.WebClient).DownloadString('https://community.chocolatey.org/install.ps1'))
        RefreshEnv
        Write-Host "✅ Chocolatey installed successfully!" -ForegroundColor Green
    } else {
        Write-Host "✅ Chocolatey already installed" -ForegroundColor Green
    }
}

# Function to install core tools
function Install-CoreTools {
    Write-Host "🔧 Installing Core Development Tools..." -ForegroundColor Yellow
    
    $tools = @('git', 'nodejs', 'python', 'docker-desktop')
    
    foreach ($tool in $tools) {
        try {
            Write-Host "Installing $tool..." -ForegroundColor Blue
            choco install $tool -y --no-progress
            Write-Host "✅ $tool installed successfully!" -ForegroundColor Green
        } catch {
            Write-Host "❌ Failed to install $tool : $_" -ForegroundColor Red
        }
    }
    
    # Refresh environment variables
    RefreshEnv
}

# Function to install Python packages
function Install-PythonPackages {
    Write-Host "🐍 Installing Python packages..." -ForegroundColor Yellow
    
    try {
        python -m pip install --upgrade pip
        pip install virtualenv black pylint flake8 isort pytest
        Write-Host "✅ Python packages installed!" -ForegroundColor Green
    } catch {
        Write-Host "❌ Failed to install Python packages: $_" -ForegroundColor Red
    }
}

# Function to install Node.js packages
function Install-NodePackages {
    Write-Host "📦 Installing Node.js global packages..." -ForegroundColor Yellow
    
    try {
        npm install -g prettier eslint typescript @types/node
        Write-Host "✅ Node.js packages installed!" -ForegroundColor Green
    } catch {
        Write-Host "❌ Failed to install Node.js packages: $_" -ForegroundColor Red
    }
}

# Function to setup project
function Setup-Project {
    Write-Host "🏗️ Setting up PyFlow project..." -ForegroundColor Yellow
    
    if (!(Test-Path "requirements.txt" -PathType Leaf) -and !(Test-Path "backend/requirements.txt" -PathType Leaf)) {
        Write-Host "❌ Not in PyFlow project directory or requirements.txt not found" -ForegroundColor Red
        return
    }
    
    # Create Python virtual environment
    Write-Host "Creating Python virtual environment..." -ForegroundColor Blue
    python -m venv venv
    
    # Activate virtual environment and install dependencies
    Write-Host "Installing backend dependencies..." -ForegroundColor Blue
    .\venv\Scripts\Activate.ps1
    if (Test-Path "backend/requirements.txt") {
        pip install -r backend/requirements.txt
    } else {
        pip install -r requirements.txt
    }
    
    # Install frontend dependencies
    if (Test-Path "frontend/package.json") {
        Write-Host "Installing frontend dependencies..." -ForegroundColor Blue
        Set-Location frontend
        npm install
        Set-Location ..
    }
    
    Write-Host "✅ Project setup completed!" -ForegroundColor Green
}

# Function to create environment files
function Create-EnvFiles {
    Write-Host "📝 Creating environment files..." -ForegroundColor Yellow
    
    # Backend .env
    $backendEnv = @"
DATABASE_URL=postgresql://postgres:password@localhost:5432/pyflow
REDIS_URL=redis://localhost:6379
OPENAI_API_KEY=your_openai_key_here
CORS_ORIGINS=http://localhost:3000,http://localhost:3001
ENVIRONMENT=development
"@
    
    if (!(Test-Path "backend/.env")) {
        $backendEnv | Out-File -FilePath "backend/.env" -Encoding UTF8
        Write-Host "✅ Backend .env created" -ForegroundColor Green
    }
    
    # Frontend .env
    $frontendEnv = @"
REACT_APP_API_URL=http://localhost:8000
REACT_APP_WS_URL=ws://localhost:8000
REACT_APP_ENVIRONMENT=development
"@
    
    if (!(Test-Path "frontend/.env")) {
        $frontendEnv | Out-File -FilePath "frontend/.env" -Encoding UTF8
        Write-Host "✅ Frontend .env created" -ForegroundColor Green
    }
}

# Function to create VS Code configuration
function Create-VSCodeConfig {
    Write-Host "⚙️ Creating VS Code configuration..." -ForegroundColor Yellow
    
    if (!(Test-Path ".vscode")) {
        New-Item -ItemType Directory -Path ".vscode"
    }
    
    # Settings
    $settings = @{
        "python.defaultInterpreterPath" = "./venv/Scripts/python.exe"
        "python.formatting.provider" = "black"
        "python.linting.enabled" = $true
        "python.linting.pylintEnabled" = $true
        "editor.formatOnSave" = $true
        "editor.codeActionsOnSave" = @{
            "source.organizeImports" = $true
            "source.fixAll.eslint" = $true
        }
        "typescript.preferences.importModuleSpecifier" = "relative"
    } | ConvertTo-Json -Depth 3
    
    $settings | Out-File -FilePath ".vscode/settings.json" -Encoding UTF8
    
    # Launch configuration
    $launch = @{
        version = "0.2.0"
        configurations = @(
            @{
                name = "Python: FastAPI"
                type = "python"
                request = "launch"
                program = "`${workspaceFolder}/backend/app/main.py"
                console = "integratedTerminal"
                cwd = "`${workspaceFolder}/backend"
            }
        )
    } | ConvertTo-Json -Depth 3
    
    $launch | Out-File -FilePath ".vscode/launch.json" -Encoding UTF8
    
    Write-Host "✅ VS Code configuration created!" -ForegroundColor Green
}

# Function to start services
function Start-Services {
    Write-Host "🚀 Starting PyFlow services..." -ForegroundColor Yellow
    
    if (Test-Path "docker-compose.yml") {
        Write-Host "Starting services with Docker Compose..." -ForegroundColor Blue
        docker-compose up --build -d
        
        Write-Host "🌐 Services started!" -ForegroundColor Green
        Write-Host "Frontend: http://localhost:3000" -ForegroundColor Cyan
        Write-Host "Backend API: http://localhost:8000" -ForegroundColor Cyan
        Write-Host "API Docs: http://localhost:8000/docs" -ForegroundColor Cyan
    } else {
        Write-Host "❌ docker-compose.yml not found. Please start services manually." -ForegroundColor Red
    }
}

# Function to verify setup
function Test-Setup {
    Write-Host "🔍 Verifying setup..." -ForegroundColor Yellow
    
    $errors = @()
    
    # Check Python
    if (!(Get-Command python -ErrorAction SilentlyContinue)) {
        $errors += "Python not found in PATH"
    }
    
    # Check Node.js
    if (!(Get-Command node -ErrorAction SilentlyContinue)) {
        $errors += "Node.js not found in PATH"
    }
    
    # Check Git
    if (!(Get-Command git -ErrorAction SilentlyContinue)) {
        $errors += "Git not found in PATH"
    }
    
    # Check Docker
    if (!(Get-Command docker -ErrorAction SilentlyContinue)) {
        $errors += "Docker not found in PATH"
    }
    
    # Check virtual environment
    if (!(Test-Path "venv/Scripts/python.exe")) {
        $errors += "Python virtual environment not created"
    }
    
    if ($errors.Count -eq 0) {
        Write-Host "✅ All checks passed! Setup completed successfully." -ForegroundColor Green
        Write-Host "" 
        Write-Host "🎉 PyFlow is ready for development!" -ForegroundColor Cyan
        Write-Host "Run 'docker-compose up' to start all services" -ForegroundColor Yellow
    } else {
        Write-Host "❌ Setup issues found:" -ForegroundColor Red
        foreach ($error in $errors) {
            Write-Host "   • $error" -ForegroundColor Red
        }
    }
}

# Main execution
try {
    Write-Host ""
    Write-Host "Starting PyFlow setup process..." -ForegroundColor Green
    Write-Host ""
    
    # Check if running as admin for tool installation
    if (!$SkipTools -and !(Test-Administrator)) {
        Write-Host "⚠️  Please run as Administrator to install system tools" -ForegroundColor Yellow
        Write-Host "Or use -SkipTools flag to skip tool installation" -ForegroundColor Yellow
        exit 1
    }
    
    # Install tools
    if (!$SkipTools) {
        Install-Chocolatey
        Install-CoreTools
        Install-PythonPackages
        Install-NodePackages
    }
    
    # Setup project
    if (!$SkipDeps) {
        Setup-Project
        Create-EnvFiles
        Create-VSCodeConfig
    }
    
    # Quick start
    if ($QuickStart) {
        Start-Services
    }
    
    # Verify setup
    Test-Setup
    
} catch {
    Write-Host "❌ Setup failed with error: $_" -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "🎊 PyFlow setup completed! Happy coding!" -ForegroundColor Cyan
Write-Host ""