#!/bin/bash

# Test Docker deployment for Ballistic Intelligence Platform

echo "🧪 Testing Docker deployment..."

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    echo "❌ Docker is not running. Please start Docker first."
    exit 1
fi

echo "✅ Docker is running"

# Check if docker-compose is available
if ! command -v docker-compose &> /dev/null; then
    echo "❌ docker-compose not found. Please install docker-compose."
    exit 1
fi

echo "✅ docker-compose is available"

# Build the application image
echo "🔨 Building application image..."
docker build -t ballistic-intel:test .

if [ $? -eq 0 ]; then
    echo "✅ Docker image built successfully"
else
    echo "❌ Docker image build failed"
    exit 1
fi

# Test the image
echo "🚀 Testing the Docker image..."
docker run -d --name ballistic-test -p 3001:3000 \
    -e NODE_ENV=production \
    -e BRIGHTDATA_API_KEY=test-key \
    -e CRUNCHBASE_API_KEY=test-key \
    ballistic-intel:test

# Wait for container to start
sleep 10

# Test health endpoint
echo "🏥 Testing health endpoint..."
HEALTH_STATUS=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:3001/api/health)

if [ "$HEALTH_STATUS" = "200" ]; then
    echo "✅ Health endpoint responding correctly"
else
    echo "❌ Health endpoint failed (Status: $HEALTH_STATUS)"
fi

# Test dashboard
echo "📊 Testing dashboard..."
DASHBOARD_STATUS=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:3001/executive-dashboard)

if [ "$DASHBOARD_STATUS" = "200" ]; then
    echo "✅ Dashboard responding correctly"
else
    echo "❌ Dashboard failed (Status: $DASHBOARD_STATUS)"
fi

# Cleanup
echo "🧹 Cleaning up test container..."
docker stop ballistic-test
docker rm ballistic-test

echo "🎉 Docker test completed!"
echo ""
echo "To deploy the full stack:"
echo "  ./docker-start.sh"
echo ""
echo "To access the platform:"
echo "  http://localhost:3000"