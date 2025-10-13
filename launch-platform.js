#!/usr/bin/env node

/**
 * CS Intelligence Platform - Launch Script
 * Comprehensive startup with health monitoring
 */

const { spawn } = require('child_process');
const http = require('http');
const fs = require('fs');

console.log('🚀 CS Intelligence Platform - Launch Sequence');
console.log('=' .repeat(60));

// Pre-flight checks
console.log('🔍 Pre-flight checks...');

// Check if port is available
function checkPort() {
  return new Promise((resolve) => {
    const { exec } = require('child_process');
    exec('lsof -ti:3000', (error, stdout) => {
      if (stdout.trim()) {
        console.log(`⚠️  Port 3000 is in use by process: ${stdout.trim()}`);
        console.log('🔧 Killing existing process...');
        exec(`kill -9 ${stdout.trim()}`, () => {
          console.log('✅ Port 3000 is now available');
          resolve();
        });
      } else {
        console.log('✅ Port 3000 is available');
        resolve();
      }
    });
  });
}

// Health check function
function healthCheck(retries = 0) {
  return new Promise((resolve, reject) => {
    const req = http.get('http://localhost:3000/api/health', (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        if (res.statusCode === 200) {
          console.log('✅ Health check passed!');
          console.log(`📊 Response: ${data}`);
          resolve(true);
        } else {
          console.log(`❌ Health check failed with status: ${res.statusCode}`);
          reject(false);
        }
      });
    });
    
    req.on('error', (err) => {
      if (retries < 3) {
        console.log(`⏳ Server not ready yet, retrying... (${retries + 1}/3)`);
        setTimeout(() => {
          healthCheck(retries + 1).then(resolve).catch(reject);
        }, 3000);
      } else {
        console.log('❌ Health check failed after 3 retries');
        console.log('💡 Server may still be starting up...');
        reject(false);
      }
    });
    
    req.setTimeout(5000, () => {
      req.destroy();
      if (retries < 3) {
        console.log(`⏳ Health check timeout, retrying... (${retries + 1}/3)`);
        setTimeout(() => {
          healthCheck(retries + 1).then(resolve).catch(reject);
        }, 3000);
      } else {
        reject(false);
      }
    });
  });
}

// Test all endpoints
async function testEndpoints() {
  console.log('\n🧪 Testing critical endpoints...');
  
  const endpoints = [
    '/api/health',
    '/api/data-management?action=stats',
    '/api/intelligence-center?action=status'
  ];
  
  for (const endpoint of endpoints) {
    try {
      await new Promise((resolve, reject) => {
        const req = http.get(`http://localhost:3000${endpoint}`, (res) => {
          if (res.statusCode === 200) {
            console.log(`✅ ${endpoint}`);
            resolve();
          } else {
            console.log(`❌ ${endpoint} - Status: ${res.statusCode}`);
            resolve(); // Don't fail the whole test
          }
        });
        
        req.on('error', () => {
          console.log(`❌ ${endpoint} - Connection failed`);
          resolve();
        });
        
        req.setTimeout(3000, () => {
          req.destroy();
          console.log(`⏳ ${endpoint} - Timeout`);
          resolve();
        });
      });
    } catch (error) {
      console.log(`❌ ${endpoint} - Error: ${error.message}`);
    }
  }
}

// Main launch sequence
async function launch() {
  try {
    // Step 1: Check port
    await checkPort();
    
    // Step 2: Clear cache if needed
    if (process.argv.includes('--fresh')) {
      console.log('🧹 Clearing cache...');
      const { execSync } = require('child_process');
      execSync('rm -rf .next', { stdio: 'inherit' });
      console.log('✅ Cache cleared');
    }
    
    // Step 3: Start server
    console.log('\n🚀 Starting development server...');
    console.log('📍 Port: 3000');
    console.log('🌐 URL: http://localhost:3000');
    console.log('⏳ Please wait for server to start...\n');
    
    const server = spawn('npm', ['run', 'dev'], {
      stdio: 'pipe',
      shell: true
    });
    
    // Handle server output
    server.stdout.on('data', (data) => {
      const output = data.toString();
      process.stdout.write(output);
      
      // Check if server is ready
      if (output.includes('Ready') || output.includes('started server on')) {
        setTimeout(async () => {
          try {
            await healthCheck();
            await testEndpoints();
            console.log('\n🎉 CS Intelligence Platform is ready!');
            console.log('🌐 Access: http://localhost:3000');
            console.log('📊 Data Management: http://localhost:3000/data-management');
            console.log('🧠 Intelligence Center: http://localhost:3000/intelligence-center');
            console.log('\n💡 Press Ctrl+C to stop the server');
          } catch (error) {
            console.log('\n⚠️  Server started but health checks failed');
            console.log('💡 Try accessing http://localhost:3000 manually');
          }
        }, 2000);
      }
    });
    
    server.stderr.on('data', (data) => {
      process.stderr.write(data);
    });
    
    server.on('error', (err) => {
      console.error('❌ Failed to start server:', err.message);
      process.exit(1);
    });
    
    server.on('close', (code) => {
      console.log(`\n📊 Server process exited with code ${code}`);
      process.exit(code);
    });
    
    // Handle process termination
    process.on('SIGINT', () => {
      console.log('\n🛑 Shutting down server...');
      server.kill('SIGINT');
    });
    
    process.on('SIGTERM', () => {
      console.log('\n🛑 Shutting down server...');
      server.kill('SIGTERM');
    });
    
  } catch (error) {
    console.error('❌ Launch failed:', error.message);
    process.exit(1);
  }
}

// Show usage
if (process.argv.includes('--help')) {
  console.log('Usage: node launch-platform.js [options]');
  console.log('Options:');
  console.log('  --fresh    Clear cache before starting');
  console.log('  --help     Show this help message');
  process.exit(0);
}

// Start the launch sequence
launch();