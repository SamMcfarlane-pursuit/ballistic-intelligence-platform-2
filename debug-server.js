#!/usr/bin/env node

/**
 * Debug server startup issues
 */

const { spawn } = require('child_process');
const fs = require('fs');

console.log('🔍 Debug Server Startup');
console.log('=' .repeat(40));

// Check critical files
const criticalFiles = [
  'src/app/layout.tsx',
  'src/app/page.tsx',
  'src/app/globals.css',
  'next.config.ts',
  'package.json'
];

console.log('📁 Checking critical files:');
criticalFiles.forEach(file => {
  if (fs.existsSync(file)) {
    console.log(`✅ ${file}`);
  } else {
    console.log(`❌ MISSING: ${file}`);
  }
});

// Check for syntax errors in key files
console.log('\n🔍 Checking for syntax issues...');

try {
  // Try to require the layout file (this will catch syntax errors)
  const layoutPath = './src/app/layout.tsx';
  if (fs.existsSync(layoutPath)) {
    const content = fs.readFileSync(layoutPath, 'utf8');
    if (content.includes('export default')) {
      console.log('✅ Layout file has default export');
    } else {
      console.log('❌ Layout file missing default export');
    }
  }
} catch (error) {
  console.log('❌ Layout file syntax error:', error.message);
}

// Start server with detailed logging
console.log('\n🚀 Starting server with debug output...');

const server = spawn('npm', ['run', 'dev'], {
  stdio: 'pipe',
  shell: true,
  env: { ...process.env, DEBUG: '*' }
});

let hasStarted = false;
let startupTimeout;

// Set a timeout for startup
startupTimeout = setTimeout(() => {
  if (!hasStarted) {
    console.log('\n⏰ Server startup timeout (30 seconds)');
    console.log('💡 This might indicate a configuration issue');
    server.kill('SIGTERM');
  }
}, 30000);

server.stdout.on('data', (data) => {
  const output = data.toString();
  console.log('📤 STDOUT:', output.trim());
  
  if (output.includes('Ready') || output.includes('started server')) {
    hasStarted = true;
    clearTimeout(startupTimeout);
    console.log('\n✅ Server appears to be ready!');
    
    // Test health endpoint
    setTimeout(() => {
      const http = require('http');
      const req = http.get('http://localhost:3000/api/health', (res) => {
        console.log(`✅ Health check: ${res.statusCode}`);
        server.kill('SIGTERM');
      });
      
      req.on('error', (err) => {
        console.log(`❌ Health check failed: ${err.message}`);
        server.kill('SIGTERM');
      });
      
      req.setTimeout(5000, () => {
        req.destroy();
        console.log('⏰ Health check timeout');
        server.kill('SIGTERM');
      });
    }, 2000);
  }
  
  if (output.includes('Error') || output.includes('Failed')) {
    console.log('🚨 Potential error detected in output');
  }
});

server.stderr.on('data', (data) => {
  const error = data.toString();
  console.log('📥 STDERR:', error.trim());
  
  if (error.includes('EADDRINUSE')) {
    console.log('🚨 Port 3000 is already in use!');
    console.log('💡 Run: lsof -ti:3000 | xargs kill -9');
  }
  
  if (error.includes('MODULE_NOT_FOUND')) {
    console.log('🚨 Missing module detected!');
    console.log('💡 Run: npm install');
  }
});

server.on('error', (err) => {
  console.log('❌ Server process error:', err.message);
});

server.on('close', (code) => {
  clearTimeout(startupTimeout);
  console.log(`\n📊 Server process exited with code: ${code}`);
  
  if (code === 0) {
    console.log('✅ Clean exit');
  } else {
    console.log('❌ Error exit');
  }
  
  process.exit(code);
});

// Handle Ctrl+C
process.on('SIGINT', () => {
  console.log('\n🛑 Stopping debug session...');
  server.kill('SIGTERM');
});