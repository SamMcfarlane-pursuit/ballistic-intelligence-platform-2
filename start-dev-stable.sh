#!/bin/bash

# Ballistic Intelligence Platform - Stable Development Server
# Uses webpack instead of Turbopack for reliable development

set -e

echo "🚀 Starting Ballistic Intelligence Platform (Stable Mode)"
echo "========================================================"

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

# Kill any existing processes on port 4000
print_status "Clearing port 4000..."
lsof -ti:4000 | xargs kill -9 2>/dev/null || true
sleep 2

# Clear Next.js cache to avoid issues
print_status "Clearing Next.js cache..."
rm -rf .next 2>/dev/null || true

# Start the development server without Turbopack
print_status "Starting development server (webpack mode)..."
print_warning "Note: Using webpack instead of Turbopack for stability"

echo ""
print_success "🌐 Server will be available at:"
echo "   • Main Dashboard:      http://localhost:4000"
echo "   • Executive Dashboard: http://localhost:4000/executive-dashboard"
echo "   • Health Check:        http://localhost:4000/api/health"
echo "   • BrightData API:      http://localhost:4000/api/brightdata?action=health"
echo "   • Technology Trends:   http://localhost:4000/api/technology-trends"
echo ""

# Start the server
NEXT_PRIVATE_DISABLE_TURBO=1 npx next dev -p 4000