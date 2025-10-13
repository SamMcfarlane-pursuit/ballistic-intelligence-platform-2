#!/usr/bin/env node

/**
 * Test port 3000 availability and basic server functionality
 */

const http = require('http');
const { exec } = require('child_process');

console.log('🌐 Port 3000 Test');
console.log('=' .repeat(30));

// Test 1: Check if port is in use
console.log('🔍 Checking port 3000...');
exec('lsof -ti:3000', (error, stdout, stderr) => {
  if (stdout.trim()) {
    console.log(`⚠️  Port 3000 is in use by process: ${stdout.trim()}`);
    console.log('🔧 Attempting to kill process...');
    
    exec(`kill -9 ${stdout.trim()}`, (killError) => {
      if (killError) {
        console.log('❌ Failed to kill process:', killError.message);
      } else {
        console.log('✅ Process killed, port should be free');
        testPortAvailability();
      }
    });
  } else {
    console.log('✅ Port 3000 is available');
    testPortAvailability();
  }
});

function testPortAvailability() {
  // Test 2: Try to create a simple server on port 3000
  console.log('\n🧪 Testing port availability...');
  
  const testServer = http.createServer((req, res) => {
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.end('Test server working!');
  });
  
  testServer.listen(3000, (err) => {
    if (err) {
      console.log('❌ Cannot bind to port 3000:', err.message);
      return;
    }
    
    console.log('✅ Successfully bound to port 3000');
    
    // Test the server
    const req = http.get('http://localhost:3000', (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        console.log('✅ Test server responds:', data.trim());
        testServer.close(() => {
          console.log('✅ Test server closed');
          console.log('\n🎯 Port 3000 is working correctly!');
          console.log('💡 The issue is likely with Next.js startup, not the port');
          console.log('\n🚀 Try starting the development server:');
          console.log('   npm run dev');
        });
      });
    });
    
    req.on('error', (err) => {
      console.log('❌ Test request failed:', err.message);
      testServer.close();
    });
  });
  
  testServer.on('error', (err) => {
    console.log('❌ Test server error:', err.message);
    if (err.code === 'EADDRINUSE') {
      console.log('🚨 Port 3000 is still in use!');
      console.log('💡 Try: lsof -ti:3000 | xargs kill -9');
    }
  });
}