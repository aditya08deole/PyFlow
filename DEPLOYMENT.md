# 🚀 PyFlow Deployment Guide

Complete deployment guide for PyFlow - Visual Python Coding Assistant with enhanced data structure visualization.

## 📋 Quick Start

### Prerequisites
- Docker & Docker Compose
- Git
- OpenSSL (for SSL certificates)

### One-Command Deployment
```bash
# Development
./deploy.sh development

# Production  
./deploy.sh production
```

## 🏗️ Deployment Options

### 1. Development Environment
Perfect for local development with hot reload:
```bash
./deploy.sh development
```
- Frontend: http://localhost:3000
- Backend: http://localhost:8000  
- Hot reload enabled
- Debug mode active

### 2. Production Environment
Optimized for production with security and performance:
```bash
./deploy.sh production
```
- Frontend: http://localhost (Nginx)
- Backend: http://localhost:8000
- SSL support
- Optimized builds
- Health monitoring

## 🔧 Configuration

### Environment Variables
Copy and customize the environment template:
```bash
cp .env.production.example .env.production
```

Key configurations:
- `SECRET_KEY`: Secure random key
- `DATABASE_URL`: PostgreSQL connection
- `REDIS_URL`: Redis connection  
- `DOMAIN`: Your domain name
- `SSL_ENABLED`: Enable HTTPS

### SSL Setup
For HTTPS support:
```bash
export SSL_ENABLED=true
export DOMAIN=your-domain.com
./deploy.sh production
```

## 📊 Monitoring & Health

### Health Checks
All services include comprehensive health monitoring:
- **Frontend**: http://localhost/health
- **Backend**: http://localhost:8000/health  
- **Database**: Automatic PostgreSQL checks
- **Redis**: Automatic Redis ping checks

### Service Status
```bash
./deploy.sh status
```

### View Logs
```bash
./deploy.sh logs
```

## 🔒 Security Features

### Docker Security
- ✅ Non-root user execution
- ✅ Minimal attack surface
- ✅ Security headers (CSP, XSS Protection)
- ✅ Dependency vulnerability scanning

### Network Security  
- ✅ Internal network isolation
- ✅ SSL/TLS encryption
- ✅ CORS configuration
- ✅ Secure cookie settings

## 🛠️ Management Commands

### Backup & Restore
```bash
# Create backup
./deploy.sh backup

# Restore from backup
docker-compose exec postgres psql -U pyflow -d pyflow < backups/YYYYMMDD_HHMMSS/database.sql
```

### Scaling Services
```bash
# Scale backend instances
docker-compose up -d --scale backend=3

# Scale frontend instances  
docker-compose up -d --scale frontend=2
```

### Updates & Maintenance
```bash
# Update deployment
git pull
./deploy.sh production

# Clean old resources
./deploy.sh cleanup

# Clean volumes (⚠️ deletes data)
./deploy.sh cleanup --clean-volumes
```

## 🧪 CI/CD Pipeline

### GitHub Actions Integration
The project includes comprehensive CI/CD pipeline:

#### ✅ Quality Checks
- **Backend**: Python linting (pylint), formatting (black), type checking
- **Frontend**: ESLint, Prettier, TypeScript compilation
- **Security**: Trivy vulnerability scanning
- **Performance**: Lighthouse CI testing

#### 🚀 Automated Deployment
- **Docker**: Multi-stage builds with caching
- **Testing**: Automated health checks
- **Deployment**: Production deployment on main branch

### Local Testing
Run the same checks locally:
```bash
# Backend quality checks
cd backend
python -m black --check .
python -m pylint app/ --errors-only
pytest tests/ -v

# Frontend quality checks  
cd frontend
npm run lint
npm run format:check
npm run type-check
npm test
```

## 🎯 Performance Optimization

### Frontend Optimizations
- ✅ Code splitting and lazy loading
- ✅ Static asset compression (gzip)
- ✅ CDN-ready caching headers
- ✅ Optimized bundle sizes

### Backend Optimizations
- ✅ Connection pooling (PostgreSQL, Redis)
- ✅ Async request handling
- ✅ Response compression
- ✅ Database query optimization

### Infrastructure Optimizations
- ✅ Multi-stage Docker builds
- ✅ Layer caching optimization
- ✅ Resource limits and health checks
- ✅ Load balancing with Nginx

## 🐛 Troubleshooting

### Common Issues

**Services won't start:**
```bash
# Check logs
./deploy.sh logs

# Check service status
./deploy.sh status

# Restart services
docker-compose restart
```

**Database connection issues:**
```bash
# Check PostgreSQL
docker-compose exec postgres pg_isready -U pyflow

# Check logs
docker-compose logs postgres
```

**Frontend not loading:**
```bash
# Check nginx configuration
docker-compose exec frontend nginx -t

# Check frontend logs
docker-compose logs frontend
```

**API requests failing:**
```bash
# Test backend health
curl http://localhost:8000/health

# Check CORS configuration
docker-compose logs backend
```

### Reset Environment
Complete environment reset:
```bash
./deploy.sh stop
docker-compose down -v
docker system prune -f
./deploy.sh production
```

## 📈 Monitoring & Analytics

### Application Metrics
- **Performance**: Response times, throughput
- **Errors**: Error rates, stack traces  
- **Usage**: Active users, feature adoption
- **Resources**: CPU, memory, disk usage

### Health Dashboards
- **Grafana**: Visual dashboards
- **Prometheus**: Metrics collection
- **AlertManager**: Alert notifications
- **Jaeger**: Distributed tracing

## 🔄 Backup Strategy

### Automated Backups
```bash
# Schedule daily backups
0 2 * * * /path/to/pyflow/deploy.sh backup
```

### Manual Backup
```bash
# Database backup
docker-compose exec postgres pg_dump -U pyflow pyflow > backup.sql

# Full application backup
tar -czf pyflow-backup-$(date +%Y%m%d).tar.gz . --exclude=node_modules --exclude=.git
```

## 🎉 Production Checklist

Before going live:
- [ ] Update all default passwords
- [ ] Configure proper SSL certificates
- [ ] Set up domain DNS records
- [ ] Configure environment variables
- [ ] Test all health checks
- [ ] Verify backup procedures
- [ ] Set up monitoring alerts
- [ ] Review security headers
- [ ] Load test the application
- [ ] Document rollback procedures

## 📞 Support

For deployment issues:
1. Check the troubleshooting section
2. Review service logs: `./deploy.sh logs`
3. Check GitHub Issues
4. Create new issue with deployment logs

---

## 🚀 Ready to Deploy!

Your PyFlow application is now ready for production deployment with:
- ✅ **Complete CI/CD pipeline**
- ✅ **Production-ready Docker infrastructure**  
- ✅ **Comprehensive monitoring & health checks**
- ✅ **Security best practices**
- ✅ **Performance optimizations**
- ✅ **Automated backup & recovery**

Happy deploying! 🎊