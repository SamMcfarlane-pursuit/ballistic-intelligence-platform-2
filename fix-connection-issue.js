#!/usr/bin/env node

/**
 * Fix Connection Issue - Comprehensive solution for "localhost refused to connect"
 */

const { spawn, execSync } = require('child_process');
const http = require('http');
const fs = require('fs');

console.log('🔧 Fix Connection Issue - CS Intelligence Platform');
console.log('=' .repeat(50));

class ConnectionFixer {
  constructor() {
    this.server = null;
  }

  async fix() {
    console.log('🔍 Diagnosing connection issue...\n');
    
    // Step 1: Check system status
    await this.checkSystemStatus();
    
    // Step 2: Clean environment
    await this.cleanEnvironment();
    
    // Step 3: Fix dependencies if needed
    await this.checkDependencies();
    
    // Step 4: Start server with monitoring
    await this.startServerWithMonitoring();
  }

  async checkSystemStatus() {
    console.log('📊 Checking system status...');
    
    // Check Node.js
    try {
      const nodeVersion = execSync('node --version', { encoding: 'utf8' }).trim();
      console.log(`   ✅ Node.js: ${nodeVersion}`);
    } catch (error) {
      console.log('   ❌ Node.js not found');
      throw new Error('Node.js is required');
    }
    
    // Check npm
    try {
      const npmVersion = execSync('npm --version', { encoding: 'utf8' }).trim();
      console.log(`   ✅ npm: ${npmVersion}`);
    } catch (error) {
      console.log('   ❌ npm not found');
      throw new Error('npm is required');
    }
    
    // Check package.json
    if (fs.existsSync('package.json')) {
      console.log('   ✅ package.json exists');
    } else {
      console.log('   ❌ package.json missing');
      throw new Error('package.json not found');
    }
    
    console.log('');
  }

  async cleanEnvironment() {
    console.log('🧹 Cleaning environment...');
    
    // Kill any existing processes
    try {
      const processes = execSync('lsof -ti:3000', { encoding: 'utf8' }).trim();
      if (processes) {
        execSync(`kill -9 ${processes}`);
        console.log('   ✅ Killed existing processes on port 3000');
      } else {
        console.log('   ✅ Port 3000 is free');
      }
    } catch (error) {
      console.log('   ✅ Port 3000 is free');
    }
    
    // Clear Next.js cache
    try {
      if (fs.existsSync('.next')) {
        execSync('rm -rf .next', { stdio: 'pipe' });
        console.log('   ✅ Cleared .next cache');
      } else {
        console.log('   ✅ No .next cache to clear');
      }
    } catch (error) {
      console.log('   ⚠️  Could not clear .next cache');
    }
    
    console.log('');
  }

  async checkDependencies() {
    console.log('📦 Checking dependencies...');
    
    // Check node_modules
    if (!fs.existsSync('node_modules')) {
      console.log('   ❌ node_modules missing - installing...');
      try {
        execSync('npm install', { stdio: 'inherit' });
        console.log('   ✅ Dependencies installed');
      } catch (error) {
        console.log('   ❌ Failed to install dependencies');
        throw new Error('Dependency installation failed');
      }
    } else {
      console.log('   ✅ node_modules exists');
    }
    
    // Check critical dependencies
    const critical = ['next', 'react', 'react-dom'];
    for (const dep of critical) {
      if (fs.existsSync(`node_modules/${dep}`)) {
        console.log(`   ✅ ${dep} installed`);
      } else {
        console.log(`   ❌ ${dep} missing`);
        throw new Error(`Missing dependency: ${dep}`);
      }
    }
    
    console.log('');
  }

  async startServerWithMonitoring() {
    console.log('🚀 Starting server with monitoring...');
    console.log('📍 Port: 3000');
    console.log('🌐 URL: http://localhost:3000');
    console.log('⏳ Please wait for "Ready" message...\n');
    
    return new Promise((resolve, reject) => {
      // Start the server
      this.server = spawn('npm', ['run', 'dev'], {
        stdio: 'pipe',
        shell: true
      });
      
      let hasStarted = false;
      let output = '';
      
      // Timeout for startup
      const timeout = setTimeout(() => {
        if (!hasStarted) {
          console.log('⏰ Server startup timeout (60 seconds)');
          console.log('📋 Output so far:');
          console.log(output);
          console.log('\n💡 Possible issues:');
          console.log('   • Port 3000 might be blocked by firewall');
          console.log('   • Next.js configuration issues');
          console.log('   • Missing dependencies');
          this.server.kill('SIGTERM');
          reject(new Error('Startup timeout'));
        }
      }, 60000);
      
      // Handle stdout
      this.server.stdout.on('data', (data) => {
        const text = data.toString();
        output += text;
        process.stdout.write(text);
        
        // Check for success indicators
        if (text.includes('Ready') || text.includes('started server on')) {
          hasStarted = true;
          clearTimeout(timeout);
          console.log('\n✅ Server started successfully!');
          
          // Test the server
          setTimeout(() => {
            this.testConnection().then((working) => {
              if (working) {
                console.log('\n🎉 CONNECTION FIXED!');
                console.log('🌐 Your CS Intelligence Platform is now accessible:');
                console.log('   • Home: http://localhost:3000');
                console.log('   • Data Management: http://localhost:3000/data-management');
                console.log('   • Intelligence Center: http://localhost:3000/intelligence-center');
                console.log('\n✨ Enhanced Features Available:');
                console.log('   • Batch Processing for multiple articles');
                console.log('   • Enhanced AI extraction with better accuracy');
                console.log('   • Fixed hydration errors for consistent experience');
                console.log('\n🛑 Press Ctrl+C to stop the server');
                resolve(true);
              } else {
                console.log('\n⚠️  Server started but connection test failed');
                console.log('💡 Try accessing http://localhost:3000 in your browser');
                resolve(false);
              }
            });
          }, 3000);
        }
      });
      
      // Handle stderr
      this.server.stderr.on('data', (data) => {
        const error = data.toString();
        process.stderr.write(error);
        
        if (error.includes('EADDRINUSE')) {
          console.log('\n🚨 Port 3000 is still in use!');
          console.log('💡 Try: lsof -ti:3000 | xargs kill -9');
          this.server.kill('SIGTERM');
          reject(new Error('Port in use'));
        }
      });
      
      // Handle process events
      this.server.on('error', (err) => {
        clearTimeout(timeout);
        console.log('\n❌ Server process error:', err.message);
        reject(err);
      });
      
      this.server.on('close', (code) => {
        clearTimeout(timeout);
        if (!hasStarted) {
          console.log(`\n❌ Server exited before starting (code: ${code})`);
          console.log('📋 Output:');
          console.log(output);
          reject(new Error(`Server exited with code ${code}`));
        }
      });
    });
  }

  async testConnection() {
    console.log('🧪 Testing connection...');
    
    return new Promise((resolve) => {
      const req = http.get('http://localhost:3000/api/health', (res) => {
        let data = '';
        res.on('data', chunk => data += chunk);
        res.on('end', () => {
          if (res.statusCode === 200) {
            console.log('✅ Connection test successful!');
            console.log(`📄 Response: ${data}`);
            resolve(true);
          } else {
            console.log(`⚠️  Connection test returned status: ${res.statusCode}`);
            resolve(false);
          }
        });
      });
      
      req.on('error', (err) => {
        console.log('❌ Connection test failed:', err.message);
        resolve(false);
      });
      
      req.setTimeout(10000, () => {
        req.destroy();
        console.log('⏰ Connection test timeout');
        resolve(false);
      });
    });
  }

  setupGracefulShutdown() {
    const shutdown = () => {
      console.log('\n🛑 Shutting down...');
      if (this.server) {
        this.server.kill('SIGINT');
      }
      process.exit(0);
    };
    
    process.on('SIGINT', shutdown);
    process.on('SIGTERM', shutdown);
  }
}

// Run the connection fixer
const fixer = new ConnectionFixer();
fixer.setupGracefulShutdown();

fixer.fix().then((success) => {
  if (!success) {
    console.log('\n💡 If the server started but connection failed:');
    console.log('   1. Try refreshing your browser');
    console.log('   2. Try http://localhost:3000 directly');
    console.log('   3. Check if firewall is blocking the connection');
  }
}).catch((error) => {
  console.error('\n❌ Connection fix failed:', error.message);
  console.log('\n🔧 Alternative solutions:');
  console.log('1. Try: npm run dev (simple start)');
  console.log('2. Try: node direct-start.js');
  console.log('3. Try: node emergency-fix.js');
  console.log('4. Check firewall settings');
  process.exit(1);
});