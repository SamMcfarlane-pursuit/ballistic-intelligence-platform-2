#!/usr/bin/env node

/**
 * Test Next.js startup specifically
 */

const { spawn } = require('child_process');
const fs = require('fs');

console.log('🧪 Next.js Startup Test');
console.log('=' .repeat(40));

// Check Next.js installation
console.log('📦 Checking Next.js installation...');
if (fs.existsSync('node_modules/next')) {
  try {
    const nextPackage = JSON.parse(fs.readFileSync('node_modules/next/package.json', 'utf8'));
    console.log(`✅ Next.js version: ${nextPackage.version}`);
  } catch (error) {
    console.log('⚠️  Could not read Next.js version');
  }
} else {
  console.log('❌ Next.js not found in node_modules');
  process.exit(1);
}

// Check for conflicting processes
console.log('\n🔍 Checking for conflicting processes...');
const { exec } = require('child_process');
exec('lsof -ti:3000', (error, stdout) => {
  if (stdout.trim()) {
    console.log(`⚠️  Process running on port 3000: ${stdout.trim()}`);
    console.log('🔧 Killing process...');
    exec(`kill -9 ${stdout.trim()}`, () => {
      startNextJS();
    });
  } else {
    console.log('✅ Port 3000 is free');
    startNextJS();
  }
});

function startNextJS() {
  console.log('\n🚀 Starting Next.js development server...');
  console.log('⏳ Monitoring startup process...\n');
  
  const server = spawn('npx', ['next', 'dev', '-p', '3000'], {
    stdio: 'pipe',
    shell: true
  });
  
  let hasStarted = false;
  let startupOutput = '';
  
  // Set timeout for startup
  const timeout = setTimeout(() => {
    if (!hasStarted) {
      console.log('\n⏰ Startup timeout (30 seconds)');
      console.log('📋 Startup output so far:');
      console.log(startupOutput);
      console.log('\n💡 This indicates a Next.js configuration issue');
      server.kill('SIGTERM');
    }
  }, 30000);
  
  server.stdout.on('data', (data) => {
    const output = data.toString();
    startupOutput += output;
    
    // Log important messages
    if (output.includes('Ready') || output.includes('started server')) {
      console.log('✅ Next.js server started successfully!');
      console.log('📤 Output:', output.trim());
      hasStarted = true;
      clearTimeout(timeout);
      
      // Test the server
      setTimeout(() => {
        testServer();
      }, 2000);
    } else if (output.includes('Error') || output.includes('Failed')) {
      console.log('🚨 Error detected:');
      console.log('📤 Output:', output.trim());
    } else if (output.includes('Compiling') || output.includes('Building')) {
      console.log('🔄 Building:', output.trim());
    } else {
      // Log other output
      console.log('📤 Output:', output.trim());
    }
  });
  
  server.stderr.on('data', (data) => {
    const error = data.toString();
    console.log('🚨 Error:', error.trim());
    
    if (error.includes('EADDRINUSE')) {
      console.log('💡 Port 3000 is still in use');
    } else if (error.includes('MODULE_NOT_FOUND')) {
      console.log('💡 Missing dependency detected');
    } else if (error.includes('SyntaxError')) {
      console.log('💡 Syntax error in code');
    }
  });
  
  server.on('error', (err) => {
    console.log('❌ Process error:', err.message);
    clearTimeout(timeout);
  });
  
  server.on('close', (code) => {
    clearTimeout(timeout);
    console.log(`\n📊 Next.js process exited with code: ${code}`);
    
    if (code === 0) {
      console.log('✅ Clean exit');
    } else {
      console.log('❌ Error exit');
      console.log('📋 Full startup output:');
      console.log(startupOutput);
    }
  });
  
  // Handle Ctrl+C
  process.on('SIGINT', () => {
    console.log('\n🛑 Stopping test...');
    server.kill('SIGTERM');
  });
}

function testServer() {
  console.log('\n🧪 Testing server response...');
  
  const http = require('http');
  const req = http.get('http://localhost:3000/api/health', (res) => {
    let data = '';
    res.on('data', chunk => data += chunk);
    res.on('end', () => {
      console.log(`✅ Server responds with status: ${res.statusCode}`);
      console.log(`📄 Response: ${data}`);
      console.log('\n🎉 Next.js startup test successful!');
      console.log('🌐 Server is running at: http://localhost:3000');
      
      // Keep server running for manual testing
      console.log('\n💡 Server will keep running for manual testing');
      console.log('🛑 Press Ctrl+C to stop');
    });
  });
  
  req.on('error', (err) => {
    console.log('❌ Server test failed:', err.message);
    console.log('💡 Server may still be starting up');
  });
  
  req.setTimeout(5000, () => {
    req.destroy();
    console.log('⏰ Server test timeout');
  });
}