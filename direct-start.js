#!/usr/bin/env node

/**
 * Direct Start - Minimal approach to get server running
 */

const { spawn } = require('child_process');

console.log('🎯 Direct Start - CS Intelligence Platform');
console.log('=' .repeat(40));
console.log('🚀 Starting server directly...');
console.log('📍 Port: 3000');
console.log('🌐 URL: http://localhost:3000\n');

// Start server with minimal configuration
const server = spawn('npx', ['next', 'dev', '-p', '3000'], {
  stdio: 'inherit',
  shell: true
});

// Handle server events
server.on('error', (err) => {
  console.error('❌ Failed to start:', err.message);
  process.exit(1);
});

server.on('close', (code) => {
  console.log(`\n📊 Server exited with code: ${code}`);
  process.exit(code);
});

// Handle Ctrl+C
process.on('SIGINT', () => {
  console.log('\n🛑 Stopping server...');
  server.kill('SIGINT');
});

console.log('⏳ Starting Next.js development server...');
console.log('💡 Look for "Ready" message above');
console.log('🌐 Then try: http://localhost:3000');
console.log('🛑 Press Ctrl+C to stop');