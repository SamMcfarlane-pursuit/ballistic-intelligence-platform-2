#!/usr/bin/env node

/**
 * Startup Monitor - Track the verification process
 */

const { exec } = require('child_process');
const http = require('http');

console.log('👀 Startup Monitor - Tracking your verification process');
console.log('=' .repeat(50));

let checkCount = 0;
const maxChecks = 30; // Monitor for up to 5 minutes

async function monitorStartup() {
  console.log('🔍 Monitoring startup process...');
  console.log('💡 You should be running: node start-with-verification.js');
  console.log('⏳ Checking every 10 seconds...\n');
  
  const interval = setInterval(async () => {
    checkCount++;
    console.log(`📊 Check ${checkCount}/${maxChecks} - ${new Date().toLocaleTimeString()}`);
    
    // Check port status
    const portStatus = await checkPort();
    
    // Check server status
    const serverStatus = await checkServer();
    
    // Check API status
    const apiStatus = await checkAPI();
    
    console.log(`   🌐 Port: ${portStatus ? '✅ In Use' : '⚪ Available'}`);
    console.log(`   ⚛️  Server: ${serverStatus ? '✅ Running' : '❌ Not Running'}`);
    console.log(`   🔌 API: ${apiStatus ? '✅ Working' : '❌ Not Working'}`);
    
    if (serverStatus && apiStatus) {
      console.log('\n🎉 SUCCESS! System is fully operational!');
      console.log('🌐 Access your CS Intelligence Platform:');
      console.log('   • Home: http://localhost:3000');
      console.log('   • Data Management: http://localhost:3000/data-management');
      console.log('   • Intelligence Center: http://localhost:3000/intelligence-center');
      console.log('\n✨ Enhanced Features Available:');
      console.log('   • Batch Processing: Process multiple articles at once');
      console.log('   • Enhanced AI Extraction: Better accuracy and consistency');
      console.log('   • Real-time Progress: Live status updates');
      console.log('\n🛑 Press Ctrl+C to stop monitoring');
      clearInterval(interval);
      return;
    }
    
    if (checkCount >= maxChecks) {
      console.log('\n⏰ Monitoring timeout reached');
      console.log('💡 If startup is still in progress, that\'s normal');
      console.log('🔧 If there are issues, try: node fix-nextjs-startup.js');
      clearInterval(interval);
      return;
    }
    
    console.log(''); // Empty line for readability
  }, 10000); // Check every 10 seconds
}

function checkPort() {
  return new Promise((resolve) => {
    exec('lsof -ti:3000', (error, stdout) => {
      resolve(!!stdout.trim());
    });
  });
}

function checkServer() {
  return new Promise((resolve) => {
    const req = http.get('http://localhost:3000', (res) => {
      resolve(res.statusCode === 200);
    });
    
    req.on('error', () => resolve(false));
    req.setTimeout(3000, () => {
      req.destroy();
      resolve(false);
    });
  });
}

function checkAPI() {
  return new Promise((resolve) => {
    const req = http.get('http://localhost:3000/api/health', (res) => {
      resolve(res.statusCode === 200);
    });
    
    req.on('error', () => resolve(false));
    req.setTimeout(3000, () => {
      req.destroy();
      resolve(false);
    });
  });
}

// Handle Ctrl+C
process.on('SIGINT', () => {
  console.log('\n🛑 Monitoring stopped');
  process.exit(0);
});

monitorStartup();