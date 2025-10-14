#!/usr/bin/env node

/**
 * Clean Development Server Startup Script
 * Ensures no port conflicts and clean JSON parsing
 */

const { exec, spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚀 Starting Ballistic Intelligence Platform...\n');

// Step 1: Kill any existing processes on port 3000
console.log('1️⃣ Checking for existing processes on port 3000...');
exec('lsof -ti:3000', (error, stdout, stderr) => {
  if (stdout.trim()) {
    console.log(`   Found process ${stdout.trim()} on port 3000, terminating...`);
    exec(`kill ${stdout.trim()}`, () => {
      console.log('   ✅ Port 3000 cleared\n');
      startChecks();
    });
  } else {
    console.log('   ✅ Port 3000 is available\n');
    startChecks();
  }
});

function startChecks() {
  // Step 2: Validate JSON files
  console.log('2️⃣ Validating JSON configuration files...');
  
  const jsonFiles = ['package.json', 'tsconfig.json'];
  let jsonValid = true;
  
  jsonFiles.forEach(file => {
    try {
      if (fs.existsSync(file)) {
        JSON.parse(fs.readFileSync(file, 'utf8'));
        console.log(`   ✅ ${file} is valid`);
      }
    } catch (error) {
      console.log(`   ❌ ${file} has JSON syntax errors:`, error.message);
      jsonValid = false;
    }
  });
  
  if (!jsonValid) {
    console.log('\n❌ JSON validation failed. Please fix syntax errors before starting.');
    process.exit(1);
  }
  
  console.log('   ✅ All JSON files are valid\n');
  
  // Step 3: Check TypeScript compilation
  console.log('3️⃣ Checking TypeScript compilation...');
  exec('npx tsc --noEmit', (error, stdout, stderr) => {
    if (error) {
      console.log('   ⚠️ TypeScript warnings found (continuing anyway)');
      console.log('   ', stderr.split('\n')[0]);
    } else {
      console.log('   ✅ TypeScript compilation successful');
    }
    console.log('');
    
    // Step 4: Start development server
    startDevServer();
  });
}

function startDevServer() {
  console.log('4️⃣ Starting Next.js development server...\n');
  console.log('🌐 Server will be available at: http://localhost:3000');
  console.log('📊 Executive Dashboard: http://localhost:3000/executive');
  console.log('📈 News Signals: http://localhost:3000/news-signals\n');
  console.log('Press Ctrl+C to stop the server\n');
  console.log('=' .repeat(60));
  
  // Start the development server
  const devServer = spawn('npm', ['run', 'dev'], {
    stdio: 'inherit',
    shell: true
  });
  
  // Handle server shutdown
  process.on('SIGINT', () => {
    console.log('\n\n🛑 Shutting down development server...');
    devServer.kill('SIGINT');
    process.exit(0);
  });
  
  devServer.on('error', (error) => {
    console.error('❌ Failed to start development server:', error);
    process.exit(1);
  });
}