#!/usr/bin/env node

/**
 * Test Localhost 3000 - Check what's happening with localhost:3000
 */

const http = require('http');
const { execSync } = require('child_process');

console.log('🔍 Testing Localhost:3000 - Diagnostic Check');
console.log('=' .repeat(45));

async function testLocalhost3000() {
  console.log('🧪 Running comprehensive localhost:3000 test...\n');
  
  // Test 1: Check if anything is running on port 3000
  console.log('1️⃣  Checking port 3000 status...');
  try {
    const processes = execSync('lsof -ti:3000', { encoding: 'utf8' }).trim();
    if (processes) {
      console.log(`   ⚠️  Process running on port 3000: ${processes}`);
      
      // Get more details
      try {
        const details = execSync(`lsof -i:3000`, { encoding: 'utf8' });
        console.log('   📋 Process details:');
        console.log(details);
      } catch (e) {
        console.log('   ❌ Could not get process details');
      }
    } else {
      console.log('   ❌ No process running on port 3000');
    }
  } catch (e) {
    console.log('   ❌ No process running on port 3000');
  }
  
  // Test 2: Try to connect to localhost:3000
  console.log('\n2️⃣  Testing connection to localhost:3000...');
  const connectionResult = await testConnection('http://localhost:3000');
  console.log(`   Result: ${connectionResult.status}`);
  if (connectionResult.error) {
    console.log(`   Error: ${connectionResult.error}`);
  }
  if (connectionResult.response) {
    console.log(`   Response: ${connectionResult.response.slice(0, 100)}...`);
  }
  
  // Test 3: Try alternative localhost formats
  console.log('\n3️⃣  Testing alternative localhost formats...');
  const alternatives = [
    'http://127.0.0.1:3000',
    'http://0.0.0.0:3000',
    'http://localhost:3000/api/health'
  ];
  
  for (const url of alternatives) {
    const result = await testConnection(url);
    console.log(`   ${url}: ${result.status}`);
  }
  
  // Test 4: Check system network
  console.log('\n4️⃣  Checking system network...');
  try {
    const netstat = execSync('netstat -an | grep 3000', { encoding: 'utf8' });
    if (netstat) {
      console.log('   📋 Network connections on port 3000:');
      console.log(netstat);
    } else {
      console.log('   ❌ No network connections on port 3000');
    }
  } catch (e) {
    console.log('   ❌ No network connections on port 3000');
  }
  
  // Test 5: Check if Next.js is configured correctly
  console.log('\n5️⃣  Checking Next.js configuration...');
  const fs = require('fs');
  
  if (fs.existsSync('package.json')) {
    const pkg = JSON.parse(fs.readFileSync('package.json', 'utf8'));
    if (pkg.scripts && pkg.scripts.dev) {
      console.log(`   ✅ Dev script: ${pkg.scripts.dev}`);
    } else {
      console.log('   ❌ No dev script found');
    }
  } else {
    console.log('   ❌ No package.json found');
  }
  
  // Test 6: Recommendations
  console.log('\n📋 DIAGNOSIS COMPLETE');
  console.log('=' .repeat(30));
  
  if (connectionResult.status === 'SUCCESS') {
    console.log('✅ Localhost:3000 is working!');
    console.log('🌐 You can access: http://localhost:3000');
  } else {
    console.log('❌ Localhost:3000 is not working');
    console.log('\n🔧 Recommended fixes:');
    console.log('1. Run: node get-localhost-working.js');
    console.log('2. Or manually: npm run dev');
    console.log('3. Check firewall settings');
    console.log('4. Try: http://127.0.0.1:3000');
  }
}

function testConnection(url) {
  return new Promise((resolve) => {
    console.log(`   🔄 Testing ${url}...`);
    
    const req = http.get(url, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        resolve({
          status: res.statusCode === 200 ? 'SUCCESS' : `HTTP ${res.statusCode}`,
          response: data
        });
      });
    });
    
    req.on('error', (err) => {
      resolve({
        status: 'CONNECTION FAILED',
        error: err.message
      });
    });
    
    req.setTimeout(5000, () => {
      req.destroy();
      resolve({
        status: 'TIMEOUT',
        error: 'Request timeout after 5 seconds'
      });
    });
  });
}

// Run the test
testLocalhost3000();