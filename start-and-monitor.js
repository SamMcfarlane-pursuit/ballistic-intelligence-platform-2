#!/usr/bin/env node

/**
 * Start and Monitor - Simple server startup with monitoring
 */

const { spawn } = require('child_process');
const http = require('http');

console.log('🚀 Starting CS Intelligence Platform');
console.log('=' .repeat(40));
console.log('📍 Port: 3000');
console.log('🌐 URL: http://localhost:3000');
console.log('⏳ Starting server...\n');

// Start the development server
const server = spawn('npm', ['run', 'dev'], {
  stdio: 'inherit',
  shell: true
});

let testInterval;

// Test connection every 5 seconds after initial delay
setTimeout(() => {
  console.log('\n🔍 Starting connection tests...');
  
  testInterval = setInterval(async () => {
    const isWorking = await testConnection();
    if (isWorking) {
      console.log('\n🎉 SUCCESS! Your CS Intelligence Platform is running!');
      console.log('🌐 Access your platform:');
      console.log('   • Home: http://localhost:3000');
      console.log('   • Data Management: http://localhost:3000/data-management');
      console.log('   • Intelligence Center: http://localhost:3000/intelligence-center');
      console.log('\n✨ Enhanced Features Available:');
      console.log('   • Batch Processing: Process multiple articles at once');
      console.log('   • Enhanced AI Extraction: Better accuracy and consistency');
      console.log('   • Fixed Hydration Errors: Consistent server/client rendering');
      console.log('\n🛑 Press Ctrl+C to stop the server');
      
      clearInterval(testInterval);
    }
  }, 5000);
}, 10000);

function testConnection() {
  return new Promise((resolve) => {
    const req = http.get('http://localhost:3000/api/health', (res) => {
      if (res.statusCode === 200) {
        console.log('✅ Connection successful!');
        resolve(true);
      } else {
        console.log(`⚠️  Server responding with status: ${res.statusCode}`);
        resolve(false);
      }
    });
    
    req.on('error', (err) => {
      console.log('⏳ Server still starting up...');
      resolve(false);
    });
    
    req.setTimeout(3000, () => {
      req.destroy();
      resolve(false);
    });
  });
}

// Handle server events
server.on('error', (err) => {
  console.error('\n❌ Server failed to start:', err.message);
  if (testInterval) clearInterval(testInterval);
  process.exit(1);
});

server.on('close', (code) => {
  console.log(`\n📊 Server exited with code: ${code}`);
  if (testInterval) clearInterval(testInterval);
  process.exit(code);
});

// Handle Ctrl+C
process.on('SIGINT', () => {
  console.log('\n🛑 Shutting down server...');
  if (testInterval) clearInterval(testInterval);
  server.kill('SIGINT');
});

process.on('SIGTERM', () => {
  console.log('\n🛑 Shutting down server...');
  if (testInterval) clearInterval(testInterval);
  server.kill('SIGTERM');
});