#!/usr/bin/env node

/**
 * Simple server startup script for CS Intelligence Platform
 */

const { spawn } = require('child_process');
const http = require('http');

console.log('🚀 Starting CS Intelligence Platform...');
console.log('📍 Port: 3000');
console.log('🌐 URL: http://localhost:3000');
console.log('=' .repeat(50));

// Start the Next.js development server
const server = spawn('npm', ['run', 'dev'], {
  stdio: 'inherit',
  shell: true
});

// Handle server events
server.on('error', (err) => {
  console.error('❌ Failed to start server:', err.message);
  process.exit(1);
});

server.on('close', (code) => {
  console.log(`\n📊 Server process exited with code ${code}`);
});

// Test server health after a delay
setTimeout(() => {
  console.log('\n🔍 Testing server health...');
  
  const req = http.get('http://localhost:3000/api/health', (res) => {
    console.log(`✅ Server is running! Status: ${res.statusCode}`);
    console.log('🎉 CS Intelligence Platform is ready!');
    console.log('🌐 Access: http://localhost:3000');
  });
  
  req.on('error', (err) => {
    console.log('⏳ Server still starting up...');
    console.log('💡 Please wait a moment and try: http://localhost:3000');
  });
  
  req.setTimeout(5000, () => {
    req.destroy();
    console.log('⏳ Server taking longer to start...');
    console.log('💡 Check terminal for any error messages');
  });
}, 10000); // Wait 10 seconds before testing

// Handle process termination
process.on('SIGINT', () => {
  console.log('\n🛑 Shutting down server...');
  server.kill('SIGINT');
  process.exit(0);
});

process.on('SIGTERM', () => {
  console.log('\n🛑 Shutting down server...');
  server.kill('SIGTERM');
  process.exit(0);
});