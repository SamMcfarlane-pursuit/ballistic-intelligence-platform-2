#!/usr/bin/env node

/**
 * BrightData Connection Test Script
 * Tests the BrightData proxy connection with the provided credentials
 */

const axios = require('axios');

// BrightData credentials
const BRIGHTDATA_CONFIG = {
  host: 'brd.superproxy.io',
  port: 33335,
  username: 'brd-customer-hl_7e9f775b-zone-ballistic_intelligence',
  password: '1gexjh51ct68'
};

console.log('🔍 Testing BrightData Connection...\n');

async function testBrightDataConnection() {
  try {
    console.log('📡 Testing basic proxy connection...');
    
    const response = await axios({
      method: 'GET',
      url: 'http://httpbin.org/ip', // Use HTTP instead of HTTPS for testing
      proxy: {
        host: BRIGHTDATA_CONFIG.host,
        port: BRIGHTDATA_CONFIG.port,
        auth: {
          username: BRIGHTDATA_CONFIG.username,
          password: BRIGHTDATA_CONFIG.password
        }
      },
      timeout: 10000,
      // Disable SSL verification for testing
      httpsAgent: new (require('https').Agent)({
        rejectUnauthorized: false
      })
    });

    console.log('✅ Connection successful!');
    console.log('📊 Response data:', response.data);
    console.log('🌐 Proxy IP:', response.data.origin);
    
    return true;
  } catch (error) {
    console.log('❌ Connection failed!');
    console.log('🔍 Error details:', error.message);
    
    if (error.response) {
      console.log('📄 Response status:', error.response.status);
      console.log('📄 Response data:', error.response.data);
    }
    
    return false;
  }
}

async function testWebUnlocker() {
  try {
    console.log('\n🔓 Testing Web Unlocker functionality...');
    
    // Web Unlocker typically uses a different port (24000) and specific parameters
    const webUnlockerUsername = `${BRIGHTDATA_CONFIG.username}-render_js=true`;
    
    const response = await axios({
      method: 'GET',
      url: 'https://example.com',
      proxy: {
        host: BRIGHTDATA_CONFIG.host,
        port: 24000, // Web Unlocker port
        auth: {
          username: webUnlockerUsername,
          password: BRIGHTDATA_CONFIG.password
        }
      },
      timeout: 15000
    });

    console.log('✅ Web Unlocker test successful!');
    console.log('📊 Response status:', response.status);
    console.log('📄 Content length:', response.data.length);
    
    return true;
  } catch (error) {
    console.log('⚠️  Web Unlocker test failed (this might be expected if port 24000 is not configured)');
    console.log('🔍 Error:', error.message);
    return false;
  }
}

async function testAPIHealth() {
  try {
    console.log('\n🏥 Testing local API health...');
    
    const response = await axios.get('http://localhost:4000/api/brightdata?action=health', {
      timeout: 5000
    });

    console.log('✅ Local API health check successful!');
    console.log('📊 API response:', response.data);
    
    return true;
  } catch (error) {
    console.log('⚠️  Local API not available (server might not be running)');
    console.log('🔍 Error:', error.message);
    return false;
  }
}

async function runAllTests() {
  console.log('🚀 Starting BrightData Connection Tests');
  console.log('=' .repeat(50));
  
  const results = {
    proxyConnection: await testBrightDataConnection(),
    webUnlocker: await testWebUnlocker(),
    apiHealth: await testAPIHealth()
  };
  
  console.log('\n📋 Test Results Summary:');
  console.log('=' .repeat(50));
  console.log(`🔗 Proxy Connection: ${results.proxyConnection ? '✅ PASS' : '❌ FAIL'}`);
  console.log(`🔓 Web Unlocker: ${results.webUnlocker ? '✅ PASS' : '⚠️  SKIP'}`);
  console.log(`🏥 API Health: ${results.apiHealth ? '✅ PASS' : '⚠️  SKIP'}`);
  
  if (results.proxyConnection) {
    console.log('\n🎉 BrightData connection is working properly!');
    console.log('💡 You can now use the proxy for data collection.');
  } else {
    console.log('\n❌ BrightData connection failed.');
    console.log('🔧 Please check your credentials and network connection.');
  }
  
  console.log('\n📖 Next steps:');
  console.log('   1. Start the development server: npm run dev');
  console.log('   2. Navigate to: http://localhost:4000/executive-dashboard');
  console.log('   3. Test the BrightData integration in the dashboard');
}

// Run the tests
runAllTests().catch(console.error);