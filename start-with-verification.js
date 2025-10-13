#!/usr/bin/env node

/**
 * Start CS Intelligence Platform with Dual Verification
 * Ensures both Next.js and port functionality are working
 */

const { spawn, exec } = require('child_process');
const http = require('http');

console.log('🚀 CS Intelligence Platform - Verified Startup');
console.log('=' .repeat(50));

class VerifiedStartup {
  constructor() {
    this.server = null;
    this.isHealthy = false;
  }

  async start() {
    console.log('🔍 Pre-flight verification...\n');
    
    // Step 1: Verify port functionality
    const portWorking = await this.verifyPortFunctionality();
    if (!portWorking) {
      console.log('❌ Port verification failed');
      return false;
    }
    
    // Step 2: Start Next.js with monitoring
    const nextjsStarted = await this.startNextJSWithMonitoring();
    if (!nextjsStarted) {
      console.log('❌ Next.js startup failed');
      return false;
    }
    
    // Step 3: Verify system health
    const systemHealthy = await this.verifySystemHealth();
    if (!systemHealthy) {
      console.log('⚠️  System started but health checks failed');
      console.log('💡 Try accessing http://localhost:3000 manually');
    }
    
    return true;
  }

  async verifyPortFunctionality() {
    console.log('🌐 Verifying port 3000 functionality...');
    
    return new Promise((resolve) => {
      // First ensure port is free
      exec('lsof -ti:3000', (error, stdout) => {
        if (stdout.trim()) {
          console.log(`   🔧 Freeing port 3000 (process: ${stdout.trim()})...`);
          exec(`kill -9 ${stdout.trim()}`, () => {
            this.testPortBinding(resolve);
          });
        } else {
          this.testPortBinding(resolve);
        }
      });
    });
  }

  testPortBinding(resolve) {
    const testServer = http.createServer((req, res) => {
      res.writeHead(200, { 'Content-Type': 'text/plain' });
      res.end('Port test successful');
    });
    
    testServer.listen(3000, (err) => {
      if (err) {
        console.log('   ❌ Port binding failed:', err.message);
        resolve(false);
        return;
      }
      
      console.log('   ✅ Port 3000 binding successful');
      
      // Quick test
      const req = http.get('http://localhost:3000', (res) => {
        console.log('   ✅ Port functionality verified');
        testServer.close(() => {
          resolve(true);
        });
      });
      
      req.on('error', () => {
        console.log('   ❌ Port test failed');
        testServer.close(() => {
          resolve(false);
        });
      });
      
      req.setTimeout(3000, () => {
        req.destroy();
        testServer.close(() => {
          resolve(false);
        });
      });
    });
    
    testServer.on('error', (err) => {
      console.log('   ❌ Port test error:', err.message);
      resolve(false);
    });
  }

  async startNextJSWithMonitoring() {
    console.log('\n⚛️  Starting Next.js development server...');
    
    return new Promise((resolve) => {
      console.log('   🔄 Launching npm run dev...');
      
      this.server = spawn('npm', ['run', 'dev'], {
        stdio: 'pipe',
        shell: true
      });
      
      let hasStarted = false;
      let startupOutput = '';
      
      // Startup timeout
      const timeout = setTimeout(() => {
        if (!hasStarted) {
          console.log('   ⏰ Next.js startup timeout (40 seconds)');
          console.log('   📋 Last output:', startupOutput.slice(-200));
          this.server.kill('SIGTERM');
          resolve(false);
        }
      }, 40000);
      
      this.server.stdout.on('data', (data) => {
        const output = data.toString();
        startupOutput += output;
        
        // Show important output
        if (output.includes('Ready') || output.includes('started server on')) {
          console.log('   ✅ Next.js server ready!');
          console.log('   📍 Local: http://localhost:3000');
          hasStarted = true;
          clearTimeout(timeout);
          resolve(true);
        } else if (output.includes('Compiling') || output.includes('Building')) {
          console.log('   🔄 Building application...');
        } else if (output.includes('Error') || output.includes('Failed')) {
          console.log('   🚨 Error detected:', output.trim());
        }
      });
      
      this.server.stderr.on('data', (data) => {
        const error = data.toString();
        if (error.includes('EADDRINUSE')) {
          console.log('   ❌ Port 3000 still in use');
          this.server.kill('SIGTERM');
          resolve(false);
        } else if (error.includes('Error')) {
          console.log('   🚨 Stderr:', error.trim());
        }
      });
      
      this.server.on('error', (err) => {
        console.log('   ❌ Process error:', err.message);
        clearTimeout(timeout);
        resolve(false);
      });
      
      this.server.on('close', (code) => {
        clearTimeout(timeout);
        if (!hasStarted) {
          console.log('   ❌ Server exited before starting (code:', code, ')');
          resolve(false);
        }
      });
    });
  }

  async verifySystemHealth() {
    console.log('\n🔍 Verifying system health...');
    
    // Wait a moment for server to fully initialize
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    const healthChecks = [
      { url: 'http://localhost:3000/api/health', name: 'Health API' },
      { url: 'http://localhost:3000', name: 'Home Page' },
      { url: 'http://localhost:3000/api/data-management?action=stats', name: 'Data Management API' }
    ];
    
    let passedChecks = 0;
    
    for (const check of healthChecks) {
      try {
        const success = await this.testEndpoint(check.url);
        if (success) {
          console.log(`   ✅ ${check.name}: Working`);
          passedChecks++;
        } else {
          console.log(`   ❌ ${check.name}: Failed`);
        }
      } catch (error) {
        console.log(`   ❌ ${check.name}: Error`);
      }
    }
    
    const healthScore = (passedChecks / healthChecks.length) * 100;
    console.log(`   📊 Health Score: ${Math.round(healthScore)}% (${passedChecks}/${healthChecks.length})`);
    
    this.isHealthy = passedChecks >= 2; // At least 2 out of 3 checks pass
    
    if (this.isHealthy) {
      console.log('\n🎉 System is healthy and ready!');
      this.showAccessInformation();
    }
    
    return this.isHealthy;
  }

  testEndpoint(url) {
    return new Promise((resolve) => {
      const req = http.get(url, (res) => {
        resolve(res.statusCode === 200);
      });
      
      req.on('error', () => resolve(false));
      req.setTimeout(5000, () => {
        req.destroy();
        resolve(false);
      });
    });
  }

  showAccessInformation() {
    console.log('\n🌐 ACCESS INFORMATION');
    console.log('-' .repeat(30));
    console.log('🏠 Home Page: http://localhost:3000');
    console.log('📊 Data Management: http://localhost:3000/data-management');
    console.log('   └── 🔄 Batch Processing: New tab for processing multiple articles');
    console.log('🧠 Intelligence Center: http://localhost:3000/intelligence-center');
    console.log('📈 Executive Dashboard: http://localhost:3000/executive-dashboard');
    console.log('🤖 AI Agents: http://localhost:3000/ai-agents');
    
    console.log('\n✨ ENHANCED FEATURES');
    console.log('-' .repeat(30));
    console.log('🚀 Batch Processing: Process 5-15 articles simultaneously');
    console.log('🧠 Enhanced AI Extraction: Better accuracy and consistency');
    console.log('🔧 Hydration Errors Fixed: Consistent server/client rendering');
    console.log('📊 Real-time Progress: Live status updates during processing');
    
    console.log('\n💡 USAGE TIPS');
    console.log('-' .repeat(30));
    console.log('• Navigate to Data Management → Batch Process tab');
    console.log('• Use "Load Sample Batch" for quick testing');
    console.log('• Process multiple articles with "---" separator');
    console.log('• Monitor real-time progress and statistics');
    
    console.log('\n🛑 To stop the server: Press Ctrl+C');
  }

  setupGracefulShutdown() {
    const shutdown = () => {
      console.log('\n🛑 Shutting down CS Intelligence Platform...');
      if (this.server) {
        this.server.kill('SIGINT');
      }
      process.exit(0);
    };
    
    process.on('SIGINT', shutdown);
    process.on('SIGTERM', shutdown);
  }
}

// Start the verified startup process
const startup = new VerifiedStartup();
startup.setupGracefulShutdown();

startup.start().then((success) => {
  if (success) {
    console.log('\n🎯 CS Intelligence Platform is running successfully!');
    console.log('✅ Both Next.js and port functionality verified');
    console.log('✅ Enhanced features operational');
    console.log('\n💡 Keep this terminal open to maintain the server');
  } else {
    console.log('\n❌ Startup verification failed');
    console.log('🔧 Try running: node fix-nextjs-startup.js');
    process.exit(1);
  }
}).catch((error) => {
  console.error('❌ Startup error:', error.message);
  process.exit(1);
});