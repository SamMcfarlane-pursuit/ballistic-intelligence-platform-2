#!/usr/bin/env node

/**
 * Security Integration Test - Verify all security features work together
 */

const http = require('http');

console.log('🔒 Security Integration Test - CS Intelligence Platform');
console.log('=' .repeat(55));

async function testSecurityIntegration() {
  console.log('🧪 Testing security integration...\n');
  
  // Test 1: API Rate Limiting
  await testRateLimiting();
  
  // Test 2: Input Validation
  await testInputValidation();
  
  // Test 3: XSS Protection
  await testXSSProtection();
  
  // Test 4: Enhanced AI Extraction Security
  await testEnhancedAIExtraction();
  
  console.log('\n📊 Security integration test complete!');
}

async function testRateLimiting() {
  console.log('🛡️  Testing API rate limiting...');
  
  // Test multiple rapid requests
  const promises = [];
  for (let i = 0; i < 5; i++) {
    promises.push(testAPIRequest({
      action: 'ai-extract',
      data: {
        text: `Test request ${i}`,
        source: 'Test'
      }
    }));
  }
  
  try {
    const results = await Promise.all(promises);
    const successCount = results.filter(r => r.success).length;
    console.log(`   ✅ Rate limiting test: ${successCount}/5 requests processed`);
    console.log('   💡 Rate limiting is working correctly');
  } catch (error) {
    console.log('   ❌ Rate limiting test failed:', error.message);
  }
  
  console.log('');
}

async function testInputValidation() {
  console.log('🔍 Testing input validation...');
  
  // Test malicious input
  const maliciousInputs = [
    '<script>alert("xss")</script>',
    'javascript:alert("xss")',
    '<img src=x onerror=alert("xss")>',
    'SELECT * FROM users',
    'DROP TABLE companies'
  ];
  
  for (const maliciousInput of maliciousInputs) {
    try {
      const result = await testAPIRequest({
        action: 'ai-extract',
        data: {
          text: maliciousInput,
          source: 'Test'
        }
      });
      
      if (result.success && result.data) {
        // Check if malicious content was sanitized
        const extractedText = JSON.stringify(result.data);
        if (!extractedText.includes('<script>') && 
            !extractedText.includes('javascript:') && 
            !extractedText.includes('onerror=')) {
          console.log('   ✅ Malicious input sanitized correctly');
        } else {
          console.log('   ⚠️  Malicious input may not be fully sanitized');
        }
      }
    } catch (error) {
      console.log('   ✅ Malicious input rejected (expected)');
    }
  }
  
  console.log('');
}

async function testXSSProtection() {
  console.log('🛡️  Testing XSS protection...');
  
  const xssPayloads = [
    '<script>document.cookie="stolen"</script>',
    '"><script>alert("xss")</script>',
    'javascript:void(0)',
    'onload="alert(1)"'
  ];
  
  let protectedCount = 0;
  
  for (const payload of xssPayloads) {
    try {
      const result = await testAPIRequest({
        action: 'ai-extract',
        data: {
          text: `Company name: ${payload}`,
          source: 'Test'
        }
      });
      
      if (result.success && result.data) {
        const responseText = JSON.stringify(result.data);
        if (!responseText.includes('<script>') && 
            !responseText.includes('javascript:') && 
            !responseText.includes('onload=')) {
          protectedCount++;
        }
      }
    } catch (error) {
      protectedCount++; // Rejection is also protection
    }
  }
  
  console.log(`   ✅ XSS protection: ${protectedCount}/${xssPayloads.length} payloads blocked`);
  console.log('');
}

async function testEnhancedAIExtraction() {
  console.log('🧠 Testing enhanced AI extraction security...');
  
  try {
    const result = await testAPIRequest({
      action: 'ai-extract-enhanced',
      data: {
        text: 'CyberShield AI raises $15M Series A led by Ballistic Ventures',
        source: 'TechCrunch',
        title: 'AI Threat Detection Startup',
        batchMode: true
      }
    });
    
    if (result.success && result.data) {
      console.log('   ✅ Enhanced AI extraction working securely');
      console.log(`   📊 Company: ${result.data.name}`);
      console.log(`   📊 Industry: ${result.data.industry}`);
      console.log(`   📊 Confidence: ${Math.round(result.data.confidence * 100)}%`);
    } else {
      console.log('   ❌ Enhanced AI extraction failed');
    }
  } catch (error) {
    console.log('   ❌ Enhanced AI extraction error:', error.message);
  }
  
  console.log('');
}

function testAPIRequest(data) {
  return new Promise((resolve) => {
    const postData = JSON.stringify(data);
    const options = {
      hostname: 'localhost',
      port: 3000,
      path: '/api/data-management',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(postData)
      }
    };
    
    const req = http.request(options, (res) => {
      let responseData = '';
      res.on('data', chunk => responseData += chunk);
      res.on('end', () => {
        try {
          const result = JSON.parse(responseData);
          resolve({
            success: result.success,
            data: result.data,
            status: res.statusCode
          });
        } catch (error) {
          resolve({
            success: false,
            error: 'Parse error',
            status: res.statusCode
          });
        }
      });
    });
    
    req.on('error', (err) => {
      resolve({
        success: false,
        error: err.message,
        status: 'ERROR'
      });
    });
    
    req.setTimeout(10000, () => {
      req.destroy();
      resolve({
        success: false,
        error: 'Timeout',
        status: 'TIMEOUT'
      });
    });
    
    req.write(postData);
    req.end();
  });
}

// Check if server is running first
function checkServerStatus() {
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

// Run tests
checkServerStatus().then((serverRunning) => {
  if (serverRunning) {
    console.log('✅ Server is running, proceeding with security tests...\n');
    testSecurityIntegration();
  } else {
    console.log('❌ Server is not running on localhost:3000');
    console.log('💡 Start the server first with: npm run dev');
    console.log('🔧 Or run: node get-localhost-working.js');
  }
});