#!/usr/bin/env node

/**
 * Emergency Fix - Get the server running immediately
 */

const { spawn, execSync } = require('child_process');
const http = require('http');
const fs = require('fs');

console.log('🚨 Emergency Fix - Getting CS Intelligence Platform Running');
console.log('=' .repeat(55));

async function emergencyFix() {
  console.log('🔧 Step 1: Cleaning up any issues...');
  
  try {
    // Kill any existing processes
    try {
      const processes = execSync('lsof -ti:3000', { encoding: 'utf8' }).trim();
      if (processes) {
        execSync(`kill -9 ${processes}`);
        console.log('✅ Killed existing processes');
      }
    } catch (error) {
      console.log('✅ No processes to kill');
    }
    
    // Clear Next.js cache
    try {
      execSync('rm -rf .next', { stdio: 'inherit' });
      console.log('✅ Cleared .next cache');
    } catch (error) {
      console.log('⚠️  Could not clear cache (not critical)');
    }
    
    console.log('\n🚀 Step 2: Starting development server...');
    console.log('📍 Port: 3000');
    console.log('🌐 URL: http://localhost:3000');
    console.log('⏳ Please wait...\n');
    
    // Start the server with detailed output
    const server = spawn('npm', ['run', 'dev'], {
      stdio: 'inherit',
      shell: true,
      env: { ...process.env, FORCE_COLOR: '1' }
    });
    
    // Monitor for startup
    let startupTimer = setTimeout(() => {
      console.log('\n⏰ Server should be starting...');
      console.log('💡 If you see "Ready" message above, try: http://localhost:3000');
      console.log('🔧 If not, press Ctrl+C and try: node fix-nextjs-startup.js');
    }, 15000);
    
    // Test server after delay
    setTimeout(async () => {
      const isWorking = await testServer();
      if (isWorking) {
        clearTimeout(startupTimer);
        console.log('\n🎉 SUCCESS! Server is running!');
        console.log('🌐 Access your platform:');
        console.log('   • Home: http://localhost:3000');
        console.log('   • Data Management: http://localhost:3000/data-management');
        console.log('   • Intelligence Center: http://localhost:3000/intelligence-center');
        console.log('\n✨ Enhanced Features:');
        console.log('   • Batch Processing in Data Management');
        console.log('   • Enhanced AI Extraction');
        console.log('   • Fixed Hydration Errors');
        console.log('\n🛑 Press Ctrl+C to stop the server');
      }
    }, 20000);
    
    // Handle server events
    server.on('error', (err) => {
      console.error('\n❌ Server failed to start:', err.message);
      console.log('🔧 Try running: node fix-nextjs-startup.js');
      process.exit(1);
    });
    
    server.on('close', (code) => {
      clearTimeout(startupTimer);
      console.log(`\n📊 Server process exited with code: ${code}`);
      if (code !== 0) {
        console.log('🔧 Try the comprehensive fix: node fix-nextjs-startup.js');
      }
      process.exit(code);
    });
    
    // Handle Ctrl+C
    process.on('SIGINT', () => {
      console.log('\n🛑 Shutting down server...');
      clearTimeout(startupTimer);
      server.kill('SIGINT');
    });
    
    process.on('SIGTERM', () => {
      console.log('\n🛑 Shutting down server...');
      clearTimeout(startupTimer);
      server.kill('SIGTERM');
    });
    
  } catch (error) {
    console.error('❌ Emergency fix failed:', error.message);
    console.log('\n🔧 Alternative solutions:');
    console.log('1. Try: npm install');
    console.log('2. Try: rm -rf node_modules && npm install');
    console.log('3. Try: node fix-nextjs-startup.js');
    process.exit(1);
  }
}

function testServer() {
  return new Promise((resolve) => {
    console.log('\n🧪 Testing server...');
    
    const req = http.get('http://localhost:3000/api/health', (res) => {
      if (res.statusCode === 200) {
        console.log('✅ Server health check passed!');
        resolve(true);
      } else {
        console.log(`⚠️  Server responding but with status: ${res.statusCode}`);
        resolve(false);
      }
    });
    
    req.on('error', (err) => {
      console.log('❌ Server not responding yet:', err.message);
      console.log('💡 This is normal if server is still starting up');
      resolve(false);
    });
    
    req.setTimeout(5000, () => {
      req.destroy();
      console.log('⏰ Server test timeout - may still be starting');
      resolve(false);
    });
  });
}

// Run the emergency fix
emergencyFix();