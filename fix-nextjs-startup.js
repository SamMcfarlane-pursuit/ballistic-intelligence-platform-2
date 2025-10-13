#!/usr/bin/env node

/**
 * Comprehensive Next.js startup fix
 */

const { execSync, spawn } = require('child_process');
const fs = require('fs');

console.log('🔧 Next.js Startup Fix');
console.log('=' .repeat(40));

async function fixNextJSStartup() {
  // Step 1: Kill any existing processes
  console.log('🧹 Cleaning up processes...');
  try {
    const processes = execSync('lsof -ti:3000', { encoding: 'utf8' }).trim();
    if (processes) {
      execSync(`kill -9 ${processes}`);
      console.log('✅ Killed existing processes');
    }
  } catch (error) {
    console.log('✅ No processes to kill');
  }
  
  // Step 2: Clear Next.js cache completely
  console.log('\n🗑️  Clearing caches...');
  try {
    execSync('rm -rf .next', { stdio: 'inherit' });
    console.log('✅ Cleared .next directory');
  } catch (error) {
    console.log('⚠️  Could not clear .next directory');
  }
  
  // Step 3: Clear npm cache
  try {
    execSync('npm cache clean --force', { stdio: 'pipe' });
    console.log('✅ Cleared npm cache');
  } catch (error) {
    console.log('⚠️  Could not clear npm cache');
  }
  
  // Step 4: Check and fix package.json
  console.log('\n📦 Checking package.json...');
  try {
    const pkg = JSON.parse(fs.readFileSync('package.json', 'utf8'));
    if (pkg.scripts && pkg.scripts.dev) {
      console.log(`✅ Dev script: ${pkg.scripts.dev}`);
    } else {
      console.log('❌ Missing dev script');
      return false;
    }
  } catch (error) {
    console.log('❌ Error reading package.json:', error.message);
    return false;
  }
  
  // Step 5: Reinstall dependencies with clean install
  console.log('\n📚 Reinstalling dependencies...');
  try {
    // Remove node_modules for clean install
    execSync('rm -rf node_modules package-lock.json', { stdio: 'inherit' });
    console.log('✅ Removed old dependencies');
    
    // Clean install
    execSync('npm install', { stdio: 'inherit' });
    console.log('✅ Dependencies reinstalled');
  } catch (error) {
    console.log('❌ Failed to reinstall dependencies:', error.message);
    return false;
  }
  
  // Step 6: Build the project to check for errors
  console.log('\n🔨 Building project...');
  try {
    execSync('npm run build', { stdio: 'inherit' });
    console.log('✅ Build successful');
  } catch (error) {
    console.log('❌ Build failed. This indicates code issues.');
    console.log('💡 Check the error messages above');
    return false;
  }
  
  // Step 7: Start the development server with monitoring
  console.log('\n🚀 Starting development server...');
  console.log('📍 Port: 3000');
  console.log('🌐 URL: http://localhost:3000');
  console.log('⏳ Monitoring startup...\n');
  
  return new Promise((resolve) => {
    const server = spawn('npm', ['run', 'dev'], {
      stdio: 'pipe',
      shell: true
    });
    
    let hasStarted = false;
    let startupOutput = '';
    
    // Startup timeout
    const timeout = setTimeout(() => {
      if (!hasStarted) {
        console.log('\n⏰ Startup timeout (45 seconds)');
        console.log('📋 Startup output:');
        console.log(startupOutput);
        server.kill('SIGTERM');
        resolve(false);
      }
    }, 45000);
    
    server.stdout.on('data', (data) => {
      const output = data.toString();
      startupOutput += output;
      process.stdout.write(output);
      
      if (output.includes('Ready') || output.includes('started server on')) {
        hasStarted = true;
        clearTimeout(timeout);
        console.log('\n✅ Next.js server started successfully!');
        
        // Test the server
        setTimeout(() => {
          testServerHealth().then((healthy) => {
            if (healthy) {
              console.log('\n🎉 CS Intelligence Platform is ready!');
              console.log('🌐 Access: http://localhost:3000');
              console.log('📊 Data Management: http://localhost:3000/data-management');
              console.log('🧠 Intelligence Center: http://localhost:3000/intelligence-center');
              console.log('\n💡 Press Ctrl+C to stop the server');
            }
            resolve(healthy);
          });
        }, 3000);
      }
    });
    
    server.stderr.on('data', (data) => {
      const error = data.toString();
      process.stderr.write(error);
      
      if (error.includes('EADDRINUSE')) {
        console.log('\n🚨 Port 3000 is still in use!');
        server.kill('SIGTERM');
        resolve(false);
      }
    });
    
    server.on('error', (err) => {
      console.log('\n❌ Server process error:', err.message);
      clearTimeout(timeout);
      resolve(false);
    });
    
    server.on('close', (code) => {
      clearTimeout(timeout);
      console.log(`\n📊 Server process exited with code: ${code}`);
      resolve(code === 0);
    });
    
    // Handle Ctrl+C
    process.on('SIGINT', () => {
      console.log('\n🛑 Shutting down server...');
      server.kill('SIGINT');
    });
    
    process.on('SIGTERM', () => {
      console.log('\n🛑 Shutting down server...');
      server.kill('SIGTERM');
    });
  });
}

function testServerHealth() {
  return new Promise((resolve) => {
    console.log('\n🔍 Testing server health...');
    
    const http = require('http');
    const req = http.get('http://localhost:3000/api/health', (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        if (res.statusCode === 200) {
          console.log('✅ Health check passed!');
          console.log(`📄 Response: ${data}`);
          resolve(true);
        } else {
          console.log(`⚠️  Health check returned status: ${res.statusCode}`);
          resolve(false);
        }
      });
    });
    
    req.on('error', (err) => {
      console.log('❌ Health check failed:', err.message);
      resolve(false);
    });
    
    req.setTimeout(10000, () => {
      req.destroy();
      console.log('⏰ Health check timeout');
      resolve(false);
    });
  });
}

// Run the fix
fixNextJSStartup().then((success) => {
  if (!success) {
    console.log('\n❌ Next.js startup fix failed');
    console.log('💡 Try running the steps manually:');
    console.log('   1. lsof -ti:3000 | xargs kill -9');
    console.log('   2. rm -rf .next node_modules package-lock.json');
    console.log('   3. npm install');
    console.log('   4. npm run build');
    console.log('   5. npm run dev');
    process.exit(1);
  }
}).catch((error) => {
  console.error('❌ Fix script error:', error.message);
  process.exit(1);
});