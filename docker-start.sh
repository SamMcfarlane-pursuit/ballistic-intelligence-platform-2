#!/bin/bash

# Ballistic Intelligence Platform - Docker Startup Script

echo "🚀 Starting Ballistic Intelligence Platform..."

# Check if .env.local exists, if not create from template
if [ ! -f .env.local ]; then
    echo "📝 Creating .env.local from template..."
    cp .env.example .env.local 2>/dev/null || echo "No .env.example found, using defaults"
fi

# Build and start the containers
echo "🔨 Building Docker containers..."
docker-compose build

echo "🌐 Starting services..."
docker-compose up -d

# Wait for services to be ready
echo "⏳ Waiting for services to start..."
sleep 10

# Check health
echo "🏥 Checking service health..."
docker-compose ps

# Show logs
echo "📋 Service logs:"
docker-compose logs --tail=20

echo "✅ Ballistic Intelligence Platform is running!"
echo "🌐 Access the dashboard at: http://localhost:3000"
echo "📊 Health check: http://localhost:3000/api/health"
echo "🔧 BrightData API: http://localhost:3000/api/brightdata?action=health"
echo "💼 Crunchbase API: http://localhost:3000/api/crunchbase?action=health"

echo ""
echo "🛠️  Useful commands:"
echo "  docker-compose logs -f ballistic-intel    # View app logs"
echo "  docker-compose exec ballistic-intel sh    # Access container shell"
echo "  docker-compose down                       # Stop all services"
echo "  docker-compose up -d --build             # Rebuild and restart"