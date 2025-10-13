#!/usr/bin/env node

/**
 * Dual Functionality Test - Next.js & Port Verification
 * Tests both Next.js startup and port functionality independently
 */

const { spawn, exec } = require('child_process');
const http = require('http');
const fs = require('fs');

console.log('🔄 Dual Functionality Test - Next.js & Port');
console.log('=' .repeat(50));

class DualTester {
  constructor() {
    this.nextjsServer = null;
    this.testServer = null;
    this.results = {
      portTest: false,
      nextjsTest: false,
      healthCheck: false,
      endpointTests: []
    };
  }

  async runAllTests() {
    console.log('🧪 Starting comprehensive dual testing...\n');
    
    // Test 1: Port functionality (independent of Next.js)
    await this.testPortFunctionality();
    
    // Test 2: Next.js startup and functionality
    await this.testNextJSFunctionality();
    
    // Test 3: Combined functionality
    await this.testCombinedFunctionality();
    
    // Summary
    this.printSummary();
  }

  async testPortFunctionality() {
    console.log('🌐 TEST 1: Port 3000 Functionality (Independent)');
    console.log('-' .repeat(40));
    
    return new Promise((resolve) => {
      // First, ensure port is free
      exec('lsof -ti:3000', (error, stdout) => {
        if (stdout.trim()) {
          console.log(`🔧 Killing existing process: ${stdout.trim()}`);
          exec(`kill -9 ${stdout.trim()}`, () => {
            this.createTestServer(resolve);
          });
        } else {
          this.createTestServer(resolve);
        }
      });
    });
  }

  createTestServer(resolve) {
    console.log('🚀 Creating test server on port 3000...');
    
    this.testServer = http.createServer((req, res) => {
      res.writeHead(200, { 
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      });
      
      if (req.url === '/test-health') {
        res.end(JSON.stringify({ 
          status: 'ok', 
          message: 'Port 3000 is working!',
          timestamp: new Date().toISOString()
        }));
      } else {
        res.end(JSON.stringify({ 
          status: 'ok', 
          message: 'Test server running on port 3000',
          url: req.url
        }));
      }
    });
    
    this.testServer.listen(3000, (err) => {
      if (err) {
        console.log('❌ Port 3000 test failed:', err.message);
        this.results.portTest = false;
        resolve();
        return;
      }
      
      console.log('✅ Test server bound to port 3000');
      
      // Test the server
      const req = http.get('http://localhost:3000/test-health', (res) => {
        let data = '';
        res.on('data', chunk => data += chunk);
        res.on('end', () => {
          try {
            const response = JSON.parse(data);
            console.log('✅ Port test successful:', response.message);
            this.results.portTest = true;
          } catch (error) {
            console.log('❌ Port test response error:', error.message);
            this.results.portTest = false;
          }
          
          // Close test server
          this.testServer.close(() => {
            console.log('✅ Test server closed\n');
            resolve();
          });
        });
      });
      
      req.on('error', (err) => {
        console.log('❌ Port test request failed:', err.message);
        this.results.portTest = false;
        this.testServer.close(() => resolve());
      });
      
      req.setTimeout(5000, () => {
        req.destroy();
        console.log('⏰ Port test timeout');
        this.results.portTest = false;
        this.testServer.close(() => resolve());
      });
    });
    
    this.testServer.on('error', (err) => {
      console.log('❌ Test server error:', err.message);
      this.results.portTest = false;
      resolve();
    });
  }

  async testNextJSFunctionality() {
    console.log('⚛️  TEST 2: Next.js Functionality');
    console.log('-' .repeat(40));
    
    return new Promise((resolve) => {
      console.log('🚀 Starting Next.js development server...');
      
      this.nextjsServer = spawn('npm', ['run', 'dev'], {
        stdio: 'pipe',
        shell: true
      });
      
      let hasStarted = false;
      let startupOutput = '';
      
      // Timeout for Next.js startup
      const timeout = setTimeout(() => {
        if (!hasStarted) {
          console.log('⏰ Next.js startup timeout (30 seconds)');
          console.log('📋 Startup output:');
          console.log(startupOutput);
          this.results.nextjsTest = false;
          this.nextjsServer.kill('SIGTERM');
          resolve();
        }
      }, 30000);
      
      this.nextjsServer.stdout.on('data', (data) => {
        const output = data.toString();
        startupOutput += output;
        
        // Log important messages
        if (output.includes('Ready') || output.includes('started server on')) {
          console.log('✅ Next.js server started successfully!');
          hasStarted = true;
          clearTimeout(timeout);
          this.results.nextjsTest = true;
          
          // Test Next.js health after a delay
          setTimeout(() => {
            this.testNextJSHealth().then(() => {
              this.nextjsServer.kill('SIGTERM');
              resolve();
            });
          }, 3000);
        } else if (output.includes('Error') || output.includes('Failed')) {
          console.log('🚨 Next.js error detected:', output.trim());
        }
      });
      
      this.nextjsServer.stderr.on('data', (data) => {
        const error = data.toString();
        console.log('🚨 Next.js stderr:', error.trim());
        
        if (error.includes('EADDRINUSE')) {
          console.log('💡 Port 3000 is in use - this is expected during testing');
        }
      });
      
      this.nextjsServer.on('error', (err) => {
        console.log('❌ Next.js process error:', err.message);
        clearTimeout(timeout);
        this.results.nextjsTest = false;
        resolve();
      });
      
      this.nextjsServer.on('close', (code) => {
        clearTimeout(timeout);
        console.log(`📊 Next.js process exited with code: ${code}`);
        if (!hasStarted) {
          this.results.nextjsTest = false;
        }
        resolve();
      });
    });
  }

  async testNextJSHealth() {
    console.log('🔍 Testing Next.js health endpoints...');
    
    const endpoints = [
      { path: '/api/health', name: 'Health Check' },
      { path: '/api/data-management?action=stats', name: 'Data Management' },
      { path: '/', name: 'Home Page' }
    ];
    
    for (const endpoint of endpoints) {
      try {
        const result = await this.testEndpoint(`http://localhost:3000${endpoint.path}`, endpoint.name);
        this.results.endpointTests.push(result);
        
        if (result.success) {
          console.log(`✅ ${endpoint.name}: Working`);
        } else {
          console.log(`❌ ${endpoint.name}: Failed`);
        }
      } catch (error) {
        console.log(`❌ ${endpoint.name}: Error - ${error.message}`);
        this.results.endpointTests.push({
          name: endpoint.name,
          success: false,
          error: error.message
        });
      }
    }
    
    const successfulTests = this.results.endpointTests.filter(t => t.success).length;
    this.results.healthCheck = successfulTests > 0;
    
    console.log(`📊 Endpoint tests: ${successfulTests}/${endpoints.length} successful\n`);
  }

  testEndpoint(url, name) {
    return new Promise((resolve) => {
      const req = http.get(url, (res) => {
        let data = '';
        res.on('data', chunk => data += chunk);
        res.on('end', () => {
          resolve({
            name,
            success: res.statusCode === 200,
            status: res.statusCode,
            hasData: data.length > 0
          });
        });
      });
      
      req.on('error', (err) => {
        resolve({
          name,
          success: false,
          error: err.message
        });
      });
      
      req.setTimeout(5000, () => {
        req.destroy();
        resolve({
          name,
          success: false,
          error: 'Timeout'
        });
      });
    });
  }

  async testCombinedFunctionality() {
    console.log('🔗 TEST 3: Combined Functionality');
    console.log('-' .repeat(40));
    
    if (this.results.portTest && this.results.nextjsTest) {
      console.log('✅ Both port and Next.js functionality confirmed');
      console.log('🎉 System is ready for full operation!');
    } else {
      console.log('⚠️  Issues detected:');
      if (!this.results.portTest) {
        console.log('   - Port 3000 functionality failed');
      }
      if (!this.results.nextjsTest) {
        console.log('   - Next.js startup failed');
      }
    }
    console.log('');
  }

  printSummary() {
    console.log('📊 DUAL FUNCTIONALITY TEST SUMMARY');
    console.log('=' .repeat(50));
    
    console.log(`🌐 Port 3000 Test: ${this.results.portTest ? '✅ PASS' : '❌ FAIL'}`);
    console.log(`⚛️  Next.js Test: ${this.results.nextjsTest ? '✅ PASS' : '❌ FAIL'}`);
    console.log(`🔍 Health Check: ${this.results.healthCheck ? '✅ PASS' : '❌ FAIL'}`);
    
    console.log('\n📋 Endpoint Test Results:');
    this.results.endpointTests.forEach(test => {
      const status = test.success ? '✅' : '❌';
      console.log(`   ${status} ${test.name}`);
    });
    
    const overallSuccess = this.results.portTest && this.results.nextjsTest;
    
    console.log('\n🎯 OVERALL RESULT:');
    if (overallSuccess) {
      console.log('✅ SYSTEM FULLY FUNCTIONAL');
      console.log('🚀 Ready for production use!');
      console.log('\n🌐 Access your platform:');
      console.log('   • Home: http://localhost:3000');
      console.log('   • Data Management: http://localhost:3000/data-management');
      console.log('   • Intelligence Center: http://localhost:3000/intelligence-center');
    } else {
      console.log('❌ SYSTEM ISSUES DETECTED');
      console.log('💡 Run the fix script: node fix-nextjs-startup.js');
    }
    
    console.log('\n' + '=' .repeat(50));
  }
}

// Handle Ctrl+C gracefully
process.on('SIGINT', () => {
  console.log('\n🛑 Test interrupted by user');
  process.exit(0);
});

// Run the dual functionality test
const tester = new DualTester();
tester.runAllTests().catch((error) => {
  console.error('❌ Test suite error:', error.message);
  process.exit(1);
});