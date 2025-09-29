#!/bin/bash

# PyFlow Production Deployment Script
# Usage: ./deploy.sh [environment]

set -e

# Configuration
ENVIRONMENT=${1:-production}
PROJECT_NAME="pyflow"
DOMAIN=${DOMAIN:-"localhost"}
SSL_ENABLED=${SSL_ENABLED:-false}

echo "🚀 Starting PyFlow deployment to $ENVIRONMENT environment"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Utility functions
log_info() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

log_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

log_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check prerequisites
check_prerequisites() {
    log_info "Checking prerequisites..."
    
    command -v docker >/dev/null 2>&1 || { log_error "Docker is not installed. Aborting."; exit 1; }
    command -v docker-compose >/dev/null 2>&1 || { log_error "Docker Compose is not installed. Aborting."; exit 1; }
    
    log_success "Prerequisites check passed"
}

# Setup environment
setup_environment() {
    log_info "Setting up environment variables..."
    
    if [ ! -f ".env.${ENVIRONMENT}" ]; then
        log_warning "Environment file .env.${ENVIRONMENT} not found. Creating from template..."
        
        cat > ".env.${ENVIRONMENT}" << EOF
# PyFlow ${ENVIRONMENT} Configuration
ENVIRONMENT=${ENVIRONMENT}
SECRET_KEY=$(openssl rand -hex 32)
DATABASE_URL=postgresql://pyflow:$(openssl rand -hex 16)@postgres:5432/pyflow
REDIS_URL=redis://redis:6379
POSTGRES_DB=pyflow
POSTGRES_USER=pyflow
POSTGRES_PASSWORD=$(openssl rand -hex 16)
DOMAIN=${DOMAIN}
SSL_ENABLED=${SSL_ENABLED}
EOF
    fi
    
    # Load environment variables
    export $(grep -v '^#' ".env.${ENVIRONMENT}" | xargs)
    log_success "Environment setup completed"
}

# Build images
build_images() {
    log_info "Building Docker images..."
    
    # Build backend
    docker build -t ${PROJECT_NAME}-backend:${ENVIRONMENT} \
        --target ${ENVIRONMENT} \
        ./backend
    
    # Build frontend
    docker build -t ${PROJECT_NAME}-frontend:${ENVIRONMENT} \
        --target ${ENVIRONMENT} \
        ./frontend
    
    log_success "Docker images built successfully"
}

# Deploy services
deploy_services() {
    log_info "Deploying services..."
    
    if [ "$ENVIRONMENT" = "production" ]; then
        docker-compose -f docker-compose.prod.yml --env-file .env.${ENVIRONMENT} up -d
    else
        docker-compose --env-file .env.${ENVIRONMENT} up -d
    fi
    
    log_success "Services deployed successfully"
}

# Wait for services
wait_for_services() {
    log_info "Waiting for services to be ready..."
    
    local max_attempts=30
    local attempt=1
    
    while [ $attempt -le $max_attempts ]; do
        if curl -f http://localhost:8000/health >/dev/null 2>&1 && \
           curl -f http://localhost/health >/dev/null 2>&1; then
            log_success "All services are ready!"
            return 0
        fi
        
        log_info "Attempt $attempt/$max_attempts: Services not ready yet, waiting 10 seconds..."
        sleep 10
        ((attempt++))
    done
    
    log_error "Services failed to start within expected time"
    return 1
}

# Run health checks
run_health_checks() {
    log_info "Running comprehensive health checks..."
    
    # Backend health check
    if curl -f http://localhost:8000/health; then
        log_success "Backend is healthy"
    else
        log_error "Backend health check failed"
        return 1
    fi
    
    # Frontend health check
    if curl -f http://localhost/health; then
        log_success "Frontend is healthy"
    else
        log_error "Frontend health check failed"
        return 1
    fi
    
    # Database connection check
    if docker-compose exec -T postgres pg_isready -U ${POSTGRES_USER}; then
        log_success "Database is ready"
    else
        log_error "Database health check failed"
        return 1
    fi
    
    # Redis connection check
    if docker-compose exec -T redis redis-cli ping; then
        log_success "Redis is ready"
    else
        log_error "Redis health check failed"
        return 1
    fi
    
    log_success "All health checks passed!"
}

# Setup SSL (if enabled)
setup_ssl() {
    if [ "$SSL_ENABLED" = "true" ]; then
        log_info "Setting up SSL certificates..."
        
        mkdir -p nginx/ssl
        
        if [ ! -f "nginx/ssl/cert.pem" ]; then
            log_info "Generating self-signed SSL certificate..."
            openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
                -keyout nginx/ssl/key.pem \
                -out nginx/ssl/cert.pem \
                -subj "/C=US/ST=State/L=City/O=Organization/OU=OrgUnit/CN=${DOMAIN}"
        fi
        
        log_success "SSL certificates are ready"
    fi
}

# Cleanup old resources
cleanup() {
    log_info "Cleaning up old resources..."
    
    # Remove unused Docker images
    docker image prune -f
    
    # Remove unused volumes (with confirmation)
    if [ "$1" = "--clean-volumes" ]; then
        log_warning "Cleaning up volumes (this will delete all data!)"
        read -p "Are you sure? (y/N): " -n 1 -r
        echo
        if [[ $REPLY =~ ^[Yy]$ ]]; then
            docker volume prune -f
        fi
    fi
    
    log_success "Cleanup completed"
}

# Backup data
backup_data() {
    log_info "Creating backup..."
    
    local backup_dir="backups/$(date +%Y%m%d_%H%M%S)"
    mkdir -p "$backup_dir"
    
    # Backup database
    docker-compose exec -T postgres pg_dump -U ${POSTGRES_USER} ${POSTGRES_DB} > "$backup_dir/database.sql"
    
    # Backup uploaded files (if any)
    if [ -d "uploads" ]; then
        cp -r uploads "$backup_dir/"
    fi
    
    log_success "Backup created at $backup_dir"
}

# Show deployment info
show_deployment_info() {
    log_success "🎉 PyFlow deployment completed successfully!"
    echo
    echo "=== Deployment Information ==="
    echo "Environment: $ENVIRONMENT"
    echo "Frontend URL: http://localhost"
    echo "Backend API: http://localhost:8000"
    echo "API Documentation: http://localhost:8000/docs"
    echo "Health Check: http://localhost:8000/health"
    echo
    echo "=== Useful Commands ==="
    echo "View logs: docker-compose logs -f"
    echo "Stop services: docker-compose down"
    echo "Restart services: docker-compose restart"
    echo "Update deployment: ./deploy.sh $ENVIRONMENT"
    echo
    echo "=== Service Status ==="
    docker-compose ps
}

# Main deployment flow
main() {
    log_info "PyFlow Deployment Script v1.0"
    
    check_prerequisites
    setup_environment
    setup_ssl
    
    # Create backup for production deployments
    if [ "$ENVIRONMENT" = "production" ]; then
        backup_data
    fi
    
    build_images
    deploy_services
    wait_for_services
    run_health_checks
    
    # Cleanup old resources
    cleanup
    
    show_deployment_info
}

# Handle script arguments
case "${1:-help}" in
    "production"|"staging"|"development")
        main
        ;;
    "backup")
        setup_environment
        backup_data
        ;;
    "cleanup")
        cleanup $2
        ;;
    "logs")
        docker-compose logs -f
        ;;
    "stop")
        docker-compose down
        ;;
    "status")
        docker-compose ps
        ;;
    "help"|*)
        echo "PyFlow Deployment Script"
        echo
        echo "Usage: ./deploy.sh [command]"
        echo
        echo "Commands:"
        echo "  production    Deploy to production environment"
        echo "  staging       Deploy to staging environment" 
        echo "  development   Deploy to development environment"
        echo "  backup        Create backup of current deployment"
        echo "  cleanup       Clean up Docker resources"
        echo "  logs          View service logs"
        echo "  stop          Stop all services"
        echo "  status        Show service status"
        echo "  help          Show this help message"
        echo
        echo "Examples:"
        echo "  ./deploy.sh production"
        echo "  ./deploy.sh development"
        echo "  ./deploy.sh backup"
        echo "  ./deploy.sh cleanup --clean-volumes"
        ;;
esac