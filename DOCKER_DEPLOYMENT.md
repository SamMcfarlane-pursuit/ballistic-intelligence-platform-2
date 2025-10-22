# Docker Deployment Guide

## Ballistic Intelligence Platform - Containerized Deployment

This guide covers deploying the Ballistic Intelligence Platform using Docker containers with full BrightData integration.

## Quick Start

### 1. Prerequisites
```bash
# Install Docker and Docker Compose
docker --version
docker-compose --version

# Clone the repository
git clone https://github.com/SamMcfarlane-pursuit/ballistic-intelligence-platform-2.git
cd ballistic-intelligence-platform-2
```

### 2. Environment Configuration
```bash
# Copy environment template
cp .env.local.example .env.local

# Edit with your API keys
nano .env.local
```

### 3. Start the Platform
```bash
# Make startup script executable
chmod +x docker-start.sh

# Start all services
./docker-start.sh
```

### 4. Access the Platform
- **Dashboard**: http://localhost:3000
- **Health Check**: http://localhost:3000/api/health
- **BrightData API**: http://localhost:3000/api/brightdata?action=health
- **Crunchbase API**: http://localhost:3000/api/crunchbase?action=health

## Services Architecture

### Core Services
- **ballistic-intel**: Main Next.js application (Port 3000)
- **postgres**: PostgreSQL database (Port 5432)
- **redis**: Redis cache (Port 6379)

### Optional Services
- **brightdata-proxy**: BrightData proxy manager (Port 22999)
- **nginx**: Reverse proxy with rate limiting (Port 80/443)

## Docker Commands

### Basic Operations
```bash
# Start all services
docker-compose up -d

# View logs
docker-compose logs -f ballistic-intel

# Stop all services
docker-compose down

# Rebuild and restart
docker-compose up -d --build

# View service status
docker-compose ps
```

### Development Commands
```bash
# Access application container
docker-compose exec ballistic-intel sh

# Access database
docker-compose exec postgres psql -U postgres -d ballistic_intel

# View Redis data
docker-compose exec redis redis-cli

# Restart specific service
docker-compose restart ballistic-intel
```

### Production Commands
```bash
# Start with production profile (includes nginx)
docker-compose --profile production up -d

# Start with BrightData proxy
docker-compose --profile brightdata up -d

# Full production deployment
docker-compose --profile production --profile brightdata up -d
```

## Environment Variables

### Required Configuration
```env
# BrightData Integration
BRIGHTDATA_API_KEY=your_actual_api_key
BRIGHTDATA_PROXY_HOST=brd.superproxy.io
BRIGHTDATA_PROXY_PORT=22225
BRIGHTDATA_PROXY_USERNAME=your_username
BRIGHTDATA_PROXY_PASSWORD=your_password

# Crunchbase Integration
CRUNCHBASE_API_KEY=your_actual_api_key
CRUNCHBASE_BASE_URL=https://api.crunchbase.com/api/v4

# Database
DATABASE_URL=postgresql://postgres:password@postgres:5432/ballistic_intel

# Security
NEXTAUTH_SECRET=your-secure-secret-key
NEXTAUTH_URL=http://localhost:3000
```

### Optional Configuration
```env
# Application
NODE_ENV=production
PORT=3000
NEXT_TELEMETRY_DISABLED=1

# BrightData Advanced
BRIGHTDATA_ZONE=static
ENABLE_BRIGHTDATA=true

# Monitoring
LOG_LEVEL=info
METRICS_ENABLED=true
```

## Health Monitoring

### Health Check Endpoints
```bash
# Application health
curl http://localhost:3000/api/health

# BrightData service
curl http://localhost:3000/api/brightdata?action=health

# Crunchbase service
curl http://localhost:3000/api/crunchbase?action=health
```

### Docker Health Checks
```bash
# Check container health
docker-compose ps

# View health check logs
docker inspect ballistic-intelligence-platform --format='{{.State.Health}}'
```

## Data Persistence

### Volumes
- **postgres_data**: PostgreSQL database files
- **redis_data**: Redis cache data
- **./data**: Application data directory

### Backup Commands
```bash
# Backup database
docker-compose exec postgres pg_dump -U postgres ballistic_intel > backup.sql

# Restore database
docker-compose exec -T postgres psql -U postgres ballistic_intel < backup.sql

# Backup Redis
docker-compose exec redis redis-cli BGSAVE
```

## Performance Optimization

### Resource Limits
```yaml
# Add to docker-compose.yml services
deploy:
  resources:
    limits:
      cpus: '2.0'
      memory: 4G
    reservations:
      cpus: '1.0'
      memory: 2G
```

### Scaling
```bash
# Scale application instances
docker-compose up -d --scale ballistic-intel=3

# Load balancer configuration required for multiple instances
```

## Troubleshooting

### Common Issues

1. **Port Already in Use**
```bash
# Check what's using port 3000
lsof -i :3000

# Kill process
kill -9 <PID>
```

2. **Database Connection Issues**
```bash
# Check database logs
docker-compose logs postgres

# Reset database
docker-compose down -v
docker-compose up -d
```

3. **BrightData API Issues**
```bash
# Check API key configuration
docker-compose exec ballistic-intel env | grep BRIGHTDATA

# Test API connectivity
curl "http://localhost:3000/api/brightdata?action=health"
```

4. **Memory Issues**
```bash
# Check container resource usage
docker stats

# Increase memory limits in docker-compose.yml
```

### Logs and Debugging
```bash
# View all logs
docker-compose logs

# Follow specific service logs
docker-compose logs -f ballistic-intel

# Debug mode
docker-compose -f docker-compose.yml -f docker-compose.debug.yml up
```

## Security Considerations

### Production Security
- Change default passwords
- Use proper SSL certificates
- Configure firewall rules
- Enable container security scanning
- Regular security updates

### Network Security
```bash
# Create custom network
docker network create ballistic-secure --driver bridge

# Use in docker-compose.yml
networks:
  default:
    external:
      name: ballistic-secure
```

## Monitoring and Logging

### Log Management
```bash
# Configure log rotation
docker-compose config | grep logging

# Centralized logging
# Add to docker-compose.yml:
logging:
  driver: "json-file"
  options:
    max-size: "10m"
    max-file: "3"
```

### Metrics Collection
- Container metrics via Docker stats
- Application metrics via /api/health
- Custom metrics via Prometheus (optional)

## Deployment Profiles

### Development
```bash
docker-compose up -d
```

### Production
```bash
docker-compose --profile production up -d
```

### Full Stack with BrightData
```bash
docker-compose --profile production --profile brightdata up -d
```

This deployment provides a robust, scalable platform with comprehensive data intelligence capabilities and BrightData integration.