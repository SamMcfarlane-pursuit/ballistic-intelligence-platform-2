#!/bin/bash

# CS Intelligence Platform - System Startup Script
# Prevents common issues and ensures smooth operation

echo "🚀 Starting CS Intelligence Platform..."
echo "========================================"

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js first."
    exit 1
fi

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo "❌ npm is not installed. Please install npm first."
    exit 1
fi

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ package.json not found. Please run this script from the project root."
    exit 1
fi

echo "✅ Environment checks passed"

# Install dependencies if node_modules doesn't exist
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install
    if [ $? -ne 0 ]; then
        echo "❌ Failed to install dependencies"
        exit 1
    fi
    echo "✅ Dependencies installed"
fi

# Build the project to check for errors
echo "🔧 Building project..."
npm run build
if [ $? -ne 0 ]; then
    echo "❌ Build failed. Please fix the errors before starting."
    exit 1
fi
echo "✅ Build successful"

# Check if port 3000 is available
if lsof -Pi :3000 -sTCP:LISTEN -t >/dev/null ; then
    echo "⚠️  Port 3000 is already in use"
    echo "   Please stop the existing process or use a different port"
    echo "   To kill existing process: lsof -ti:3000 | xargs kill -9"
    read -p "   Kill existing process and continue? (y/n): " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        lsof -ti:3000 | xargs kill -9 2>/dev/null || true
        sleep 2
        echo "✅ Port 3000 cleared"
    else
        echo "❌ Cannot start server on port 3000"
        exit 1
    fi
fi

echo ""
echo "🎯 CS Intelligence Platform Ready!"
echo "=================================="
echo ""
echo "📱 Executive Dashboard: http://localhost:3000/executive-dashboard"
echo "🏠 Home Page: http://localhost:3000/"
echo "💼 Portfolio: http://localhost:3000/ballistic-portfolio"
echo "🛡️  Security: http://localhost:3000/security"
echo "🧠 AI Agents: http://localhost:3000/ai-agents"
echo "🎯 Intelligence Center: http://localhost:3000/intelligence-center"
echo ""
echo "🚀 Starting development server..."
echo "   Press Ctrl+C to stop the server"
echo ""

# Start the development server
npm run dev