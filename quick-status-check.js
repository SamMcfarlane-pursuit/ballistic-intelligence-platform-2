#!/usr/bin/env node

/**
 * Quick Status Check - Verify Next.js and Port Functionality
 */

const { exec } = require('child_process');
const http = require('http');

console.log('⚡ Quick Status Check - CS Intelligence Platform');
console.log('=' .repeat(45));

async function quickCheck() {
  // Check 1: Port availability
  console.log('🌐 Checking port 3000...');
  const portStatus = await checkPort();
  
  // Check 2: Next.js server status
  console.log('⚛️  Checking Next.js server...');
  const serverStatus = await checkServer();
  
  // Check 3: API endpoints
  console.log('🔌 Checking API endpoints...');
  const apiStatus = await checkAPIs();
  
  // Summary
  console.log('\n📊 STATUS SUMMARY');
  console.log('-' .repeat(20));
  console.log(`🌐 Port 3000: ${portStatus ? '✅ Available' : '❌ In Use'}`);
  console.log(`⚛️  Next.js: ${serverStatus ? '✅ Running' : '❌ Not Running'}`);
  console.log(`🔌 APIs: ${apiStatus ? '✅ Working' : '❌ Not Working'}`);
  
  if (serverStatus && apiStatus) {
    console.log('\n🎉 SYSTEM STATUS: FULLY OPERATIONAL');
    console.log('🌐 Access: http://localhost:3000');
    console.log('📊 Data Management: http://localhost:3000/data-management');
  } else if (portStatus && !serverStatus) {
    console.log('\n⚠️  SYSTEM STATUS: READY TO START');
    console.log('💡 Run: node start-with-verification.js');
  } else {
    console.log('\n❌ SYSTEM STATUS: NEEDS ATTENTION');
    console.log('🔧 Run: node fix-nextjs-startup.js');
  }
}

function checkPort() {
  return new Promise((resolve) => {
    exec('lsof -ti:3000', (error, stdout) => {
      if (stdout.trim()) {
        console.log(`   ⚠️  Process running: ${stdout.trim()}`);
        resolve(false);
      } else {
        console.log('   ✅ Port available');
        resolve(true);
      }
    });
  });
}

function checkServer() {
  return new Promise((resolve) => {
    const req = http.get('http://localhost:3000', (res) => {
      console.log('   ✅ Server responding');
      resolve(true);
    });
    
    req.on('error', () => {
      console.log('   ❌ Server not responding');
      resolve(false);
    });
    
    req.setTimeout(3000, () => {
      req.destroy();
      console.log('   ❌ Server timeout');
      resolve(false);
    });
  });
}

function checkAPIs() {
  return new Promise((resolve) => {
    const req = http.get('http://localhost:3000/api/health', (res) => {
      if (res.statusCode === 200) {
        console.log('   ✅ Health API working');
        resolve(true);
      } else {
        console.log('   ❌ Health API failed');
        resolve(false);
      }
    });
    
    req.on('error', () => {
      console.log('   ❌ APIs not accessible');
      resolve(false);
    });
    
    req.setTimeout(3000, () => {
      req.destroy();
      console.log('   ❌ API timeout');
      resolve(false);
    });
  });
}

quickCheck().catch((error) => {
  console.error('❌ Status check error:', error.message);
});