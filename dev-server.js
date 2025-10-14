#!/usr/bin/env node

/**
 * Robust Development Server Startup
 * Handles port conflicts and ensures clean startup
 */

const { exec, spawn } = require('child_process');
const fs = require('fs');

console.log('🚀 Starting Ballistic Intelligence Platform Development Server...\n');

async function killPortProcesses(port) {
  return new Promise((resolve) => {
    exec(`lsof -ti:${port}`, (error, stdout) => {
      if (stdout.trim()) {
        const pids = stdout.trim().split('\n');
        console.log(`🔄 Killing existing processes on port ${port}: ${pids.join(', ')}`);
        
        pids.forEach(pid => {
          try {
            process.kill(parseInt(pid), 'SIGTERM');
          } catch (e) {
            // Process might already be dead
          }
        });
        
        // Wait a bit for processes to terminate
        setTimeout(() => {
          // Force kill if still running
          pids.forEach(pid => {
            try {
              process.kill(parseInt(pid), 'SIGKILL');
            } catch (e) {
              // Process is dead
            }
          });
          resolve();
        }, 2000);
      } else {
        resolve();
      }
    });
  });
}

async function startDevServer() {
  try {
    // Step 1: Kill any existing processes on port 3000
    await killPortProcesses(3000);
    
    // Step 2: Wait a moment for port to be fully released
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Step 3: Verify port is available
    await new Promise((resolve, reject) => {
      exec('lsof -ti:3000', (error, stdout) => {
        if (stdout.trim()) {
          reject(new Error(`Port 3000 is still in use by process ${stdout.trim()}`));
        } else {
          console.log('✅ Port 3000 is available');
          resolve();
        }
      });
    });
    
    // Step 4: Start Next.js development server
    console.log('🌐 Starting Next.js development server...\n');
    console.log('📍 Server will be available at: http://localhost:3000');
    console.log('📊 Executive Dashboard: http://localhost:3000/executive');
    console.log('📈 News Signals: http://localhost:3000/news-signals');
    console.log('🔧 Integrated Workflow: http://localhost:3000/integrated-workflow');
    console.log('\n' + '='.repeat(60) + '\n');
    
    const devServer = spawn('pnpm', ['dlx', 'next', 'dev', '-p', '3000'], {
      stdio: 'inherit',
      shell: true,
      env: {
        ...process.env,
        NODE_ENV: 'development',
        FORCE_COLOR: '1'
      }
    });
    
    // Handle server events
    devServer.on('error', (error) => {
      console.error('❌ Failed to start development server:', error.message);
      process.exit(1);
    });
    
    devServer.on('exit', (code, signal) => {
      if (code !== 0 && signal !== 'SIGINT') {
        console.error(`❌ Development server exited with code ${code}`);
        process.exit(code);
      }
    });
    
    // Handle graceful shutdown
    process.on('SIGINT', () => {
      console.log('\n\n🛑 Shutting down development server...');
      devServer.kill('SIGINT');
      setTimeout(() => {
        process.exit(0);
      }, 1000);
    });
    
    process.on('SIGTERM', () => {
      console.log('\n\n🛑 Received SIGTERM, shutting down...');
      devServer.kill('SIGTERM');
      setTimeout(() => {
        process.exit(0);
      }, 1000);
    });
    
  } catch (error) {
    console.error('❌ Error starting development server:', error.message);
    console.log('\n💡 Try running: npm run check');
    console.log('💡 Or manually kill processes: lsof -ti:3000 | xargs kill -9');
    process.exit(1);
  }
}

// Start the server
startDevServer();