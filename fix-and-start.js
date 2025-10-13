#!/usr/bin/env node

/**
 * Comprehensive fix and start script for CS Intelligence Platform
 */

const { execSync, spawn } = require('child_process');
const fs = require('fs');
const http = require('http');

console.log('🔧 CS Intelligence Platform - Fix & Start');
console.log('=' .repeat(50));

async function runCommand(command, description) {
  console.log(`\n🔄 ${description}...`);
  try {
    const output = execSync(command, { 
      encoding: 'utf8', 
      stdio: 'pipe',
      timeout: 60000 // 60 second timeout
    });
    console.log(`✅ ${description} completed`);
    return true;
  } catch (error) {
    console.log(`❌ ${description} failed:`, error.message);
    return false;
  }
}

async function fixAndStart() {
  // Step 1: Kill any existing processes on port 3000
  console.log('🧹 Cleaning up existing processes...');
  try {
    const processes = execSync('lsof -ti:3000', { encoding: 'utf8' }).trim();
    if (processes) {
      execSync(`kill -9 ${processes}`);
      console.log('✅ Killed existing processes on port 3000');
    } else {
      console.log('✅ No processes running on port 3000');
    }
  } catch (error) {
    console.log('✅ No processes to kill');
  }
  
  // Step 2: Clear Next.js cache
  await runCommand('rm -rf .next', 'Clearing Next.js cache');
  
  // Step 3: Clear npm cache (optional)
  console.log('\n🧹 Clearing npm cache...');
  try {
    execSync('npm cache clean --force', { stdio: 'pipe' });
    console.log('✅ npm cache cleared');
  } catch (error) {
    console.log('⚠️  npm cache clean failed (not critical)');
  }
  
  // Step 4: Reinstall dependencies
  const reinstall = await runCommand('npm install', 'Reinstalling dependencies');
  if (!reinstall) {
    console.log('❌ Failed to install dependencies. Trying alternative...');
    await runCommand('npm ci', 'Clean install dependencies');
  }
  
  // Step 5: Build the project
  const buildSuccess = await runCommand('npm run build', 'Building project');
  if (!buildSuccess) {
    console.log('❌ Build failed. This might indicate code issues.');
    console.log('💡 Check the error messages above for specific issues.');
    return false;
  }
  
  // Step 6: Start the development server
  console.log('\n🚀 Starting development server...');
  console.log('📍 Port: 3000');
  console.log('🌐 URL: http://localhost:3000');
  console.log('⏳ Please wait for server to start...\n');
  
  const server = spawn('npm', ['run', 'dev'], {
    stdio: 'inherit',
    shell: true
  });
  
  // Monitor server startup
  let serverReady = false;
  const startupTimeout = setTimeout(() => {
    if (!serverReady) {
      console.log('\n⏰ Server startup timeout (60 seconds)');
      console.log('💡 Server may still be starting. Check for error messages above.');
      console.log('🌐 Try accessing: http://localhost:3000');
    }
  }, 60000);
  
  // Test server health after delay
  setTimeout(async () => {
    try {
      await testServerHealth();
      serverReady = true;
      clearTimeout(startupTimeout);
    } catch (error) {
      console.log('⚠️  Initial health check failed, server may still be starting...');
    }
  }, 15000);
  
  // Handle server events
  server.on('error', (err) => {
    console.error('❌ Failed to start server:', err.message);
    process.exit(1);
  });
  
  server.on('close', (code) => {
    clearTimeout(startupTimeout);
    console.log(`\n📊 Server process exited with code ${code}`);
    process.exit(code);
  });
  
  // Handle Ctrl+C
  process.on('SIGINT', () => {
    console.log('\n🛑 Shutting down server...');
    server.kill('SIGINT');
  });
  
  return true;
}

function testServerHealth() {
  return new Promise((resolve, reject) => {
    console.log('\n🔍 Testing server health...');
    
    const req = http.get('http://localhost:3000/api/health', (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        if (res.statusCode === 200) {
          console.log('✅ Server is healthy!');
          console.log('🎉 CS Intelligence Platform is ready!');
          console.log('🌐 Access: http://localhost:3000');
          console.log('📊 Data Management: http://localhost:3000/data-management');
          console.log('🧠 Intelligence Center: http://localhost:3000/intelligence-center');
          resolve();
        } else {
          console.log(`⚠️  Health check returned status: ${res.statusCode}`);
          reject(new Error(`Status ${res.statusCode}`));
        }
      });
    });
    
    req.on('error', (err) => {
      console.log('⚠️  Health check failed:', err.message);
      reject(err);
    });
    
    req.setTimeout(10000, () => {
      req.destroy();
      console.log('⏰ Health check timeout');
      reject(new Error('Timeout'));
    });
  });
}

// Run the fix and start process
fixAndStart().catch((error) => {
  console.error('❌ Fix and start failed:', error.message);
  process.exit(1);
});