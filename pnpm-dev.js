#!/usr/bin/env node

/**
 * PNPM Development Server
 * Simple and reliable development server startup using pnpm
 */

const { exec, spawn } = require('child_process');

console.log('🚀 Starting Ballistic Intelligence Platform with PNPM...\n');

async function killPortProcesses(port) {
  return new Promise((resolve) => {
    exec(`lsof -ti:${port}`, (error, stdout) => {
      if (stdout.trim()) {
        const pids = stdout.trim().split('\n');
        console.log(`🔄 Killing existing processes on port ${port}: ${pids.join(', ')}`);
        
        pids.forEach(pid => {
          try {
            process.kill(parseInt(pid), 'SIGKILL');
          } catch (e) {
            // Process might already be dead
          }
        });
        
        setTimeout(resolve, 1000);
      } else {
        resolve();
      }
    });
  });
}

async function startServer() {
  try {
    // Kill any existing processes on port 4000
    await killPortProcesses(4000);
    
    console.log('✅ Port 4000 cleared');
    console.log('🌐 Starting Next.js development server with PNPM...\n');
    console.log('📍 Server will be available at: http://localhost:4000');
    console.log('📊 Executive Dashboard: http://localhost:4000/executive');
    console.log('📈 News Signals: http://localhost:4000/news-signals');
    console.log('🔍 Missed Opportunities: http://localhost:4000/missed-opportunities');
    console.log('🏢 Company Deep Dive: http://localhost:4000/company/[id]');
    console.log('\n' + '='.repeat(60) + '\n');
    
    // Start Next.js with pnpm
    const devServer = spawn('pnpm', ['dlx', 'next', 'dev', '-p', '4000'], {
      stdio: 'inherit',
      shell: true,
      env: {
        ...process.env,
        NODE_ENV: 'development',
        FORCE_COLOR: '1',
        DEBUG: 'next*'
      }
    });
    
    // Handle server events
    devServer.on('error', (error) => {
      console.error('❌ Failed to start development server:', error.message);
      process.exit(1);
    });
    
    // Handle graceful shutdown
    process.on('SIGINT', () => {
      console.log('\n\n🛑 Shutting down development server...');
      devServer.kill('SIGINT');
      setTimeout(() => process.exit(0), 1000);
    });
    
  } catch (error) {
    console.error('❌ Error starting development server:', error.message);
    console.log('\n💡 Try running: pnpm run check');
    console.log('💡 Or manually: pnpm dlx next dev -p 4000');
    process.exit(1);
  }
}

startServer();