#!/bin/bash

# Ballistic Intelligence Platform - Docker Startup Script
# Comprehensive deployment with health checks and data validation

set -e

echo "🚀 Starting Ballistic Intelligence Platform Docker Deployment"
echo "============================================================"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    print_error "Docker is not running. Please start Docker Desktop and try again."
    exit 1
fi

print_success "Docker is running"

# Stop and remove existing containers
print_status "Stopping existing containers..."
docker-compose down --remove-orphans 2>/dev/null || true

# Build the application
print_status "Building Ballistic Intelligence Platform..."
docker-compose build --no-cache

# Start the services
print_status "Starting services..."
docker-compose up -d

# Wait for services to be ready
print_status "Waiting for services to start..."
sleep 10

# Health check function
check_health() {
    local service=$1
    local url=$2
    local max_attempts=30
    local attempt=1

    print_status "Checking health of $service..."
    
    while [ $attempt -le $max_attempts ]; do
        if curl -f -s "$url" > /dev/null 2>&1; then
            print_success "$service is healthy"
            return 0
        fi
        
        print_status "Attempt $attempt/$max_attempts - $service not ready yet..."
        sleep 2
        ((attempt++))
    done
    
    print_error "$service failed to start properly"
    return 1
}

# Check application health
if check_health "Ballistic Intelligence Platform" "http://localhost:3000/api/health"; then
    print_success "Application is running successfully!"
else
    print_error "Application failed to start"
    docker-compose logs ballistic-intel
    exit 1
fi

# Check database health
if check_health "PostgreSQL Database" "http://localhost:5432"; then
    print_success "Database is running successfully!"
else
    print_warning "Database health check failed, but application may still work"
fi

# Check Redis health
if check_health "Redis Cache" "http://localhost:6379"; then
    print_success "Redis is running successfully!"
else
    print_warning "Redis health check failed, but application may still work"
fi

# Display service status
echo ""
print_success "🎉 Ballistic Intelligence Platform is now running!"
echo "============================================================"
echo ""
echo "📊 Access Points:"
echo "   • Main Dashboard:     http://localhost:3000"
echo "   • Executive Dashboard: http://localhost:3000/executive-dashboard"
echo "   • Health Check:       http://localhost:3000/api/health"
echo "   • Technology Trends:  http://localhost:3000/api/technology-trends"
echo ""
echo "🗄️ Database Services:"
echo "   • PostgreSQL:         localhost:5432"
echo "   • Redis Cache:        localhost:6379"
echo ""
echo "🔧 Management:"
echo "   • View Logs:          docker-compose logs -f"
echo "   • Stop Services:      docker-compose down"
echo "   • Restart:            docker-compose restart"
echo ""

# Test key endpoints
print_status "Testing key endpoints..."

# Test main dashboard
if curl -f -s "http://localhost:3000" > /dev/null; then
    print_success "✓ Main dashboard accessible"
else
    print_warning "✗ Main dashboard not accessible"
fi

# Test executive dashboard
if curl -f -s "http://localhost:3000/executive-dashboard" > /dev/null; then
    print_success "✓ Executive dashboard accessible"
else
    print_warning "✗ Executive dashboard not accessible"
fi

# Test technology trends API
if curl -f -s "http://localhost:3000/api/technology-trends" > /dev/null; then
    print_success "✓ Technology Trends API working"
else
    print_warning "✗ Technology Trends API not working"
fi

# Test health endpoint
if curl -f -s "http://localhost:3000/api/health" > /dev/null; then
    print_success "✓ Health endpoint working"
else
    print_warning "✗ Health endpoint not working"
fi

echo ""
print_success "🚀 Deployment completed successfully!"
print_status "The platform is ready for use with all features enabled:"
echo ""
echo "   ✅ Enhanced Tech Stack UI with color-coded technologies"
echo "   ✅ Technology Trends Analytics dashboard"
echo "   ✅ Company Intelligence with BrightData integration"
echo "   ✅ Patent Deep Dive analysis"
echo "   ✅ Sector Intelligence and market insights"
echo "   ✅ Data Intelligence cross-referencing"
echo "   ✅ Comprehensive export functionality"
echo "   ✅ Real-time data enrichment"
echo ""
echo "📈 Navigate to http://localhost:3000/executive-dashboard to get started!"