#!/usr/bin/env node

/**
 * CS Intelligence Platform - System Diagnostic Tool
 * Identifies and fixes common startup issues
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('🔍 CS Intelligence Platform - System Diagnostics');
console.log('=' .repeat(60));

// Check 1: Node.js and npm versions
console.log('\n📋 System Information:');
try {
  const nodeVersion = execSync('node --version', { encoding: 'utf8' }).trim();
  const npmVersion = execSync('npm --version', { encoding: 'utf8' }).trim();
  console.log(`✅ Node.js: ${nodeVersion}`);
  console.log(`✅ npm: ${npmVersion}`);
} catch (error) {
  console.log('❌ Node.js/npm check failed:', error.message);
}

// Check 2: Project structure
console.log('\n📁 Project Structure:');
const requiredFiles = [
  'package.json',
  'next.config.ts',
  'src/app/layout.tsx',
  'src/app/page.tsx',
  'src/app/globals.css'
];

requiredFiles.forEach(file => {
  if (fs.existsSync(file)) {
    console.log(`✅ ${file}`);
  } else {
    console.log(`❌ Missing: ${file}`);
  }
});

// Check 3: Dependencies
console.log('\n📦 Dependencies:');
try {
  const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
  const criticalDeps = ['next', 'react', 'react-dom'];
  
  criticalDeps.forEach(dep => {
    if (packageJson.dependencies[dep]) {
      console.log(`✅ ${dep}: ${packageJson.dependencies[dep]}`);
    } else {
      console.log(`❌ Missing: ${dep}`);
    }
  });
} catch (error) {
  console.log('❌ Package.json check failed:', error.message);
}

// Check 4: Port availability
console.log('\n🌐 Port Check:');
try {
  const portCheck = execSync('lsof -ti:3000', { encoding: 'utf8' }).trim();
  if (portCheck) {
    console.log(`⚠️  Port 3000 is in use by process: ${portCheck}`);
    console.log('💡 Run: kill -9 ' + portCheck);
  } else {
    console.log('✅ Port 3000 is available');
  }
} catch (error) {
  console.log('✅ Port 3000 is available');
}

// Check 5: Build status
console.log('\n🔨 Build Check:');
if (fs.existsSync('.next')) {
  console.log('✅ .next directory exists');
  try {
    const buildId = fs.readFileSync('.next/BUILD_ID', 'utf8').trim();
    console.log(`✅ Build ID: ${buildId}`);
  } catch (error) {
    console.log('⚠️  Build may be incomplete');
  }
} else {
  console.log('❌ No .next directory found');
  console.log('💡 Run: npm run build');
}

// Check 6: Environment
console.log('\n🌍 Environment:');
console.log(`✅ NODE_ENV: ${process.env.NODE_ENV || 'development'}`);
console.log(`✅ Working Directory: ${process.cwd()}`);

// Check 7: Critical API routes
console.log('\n🛣️  API Routes:');
const apiRoutes = [
  'src/app/api/health/route.ts',
  'src/app/api/data-management/route.ts',
  'src/app/api/intelligence-center/route.ts'
];

apiRoutes.forEach(route => {
  if (fs.existsSync(route)) {
    console.log(`✅ ${route}`);
  } else {
    console.log(`❌ Missing: ${route}`);
  }
});

// Check 8: TypeScript configuration
console.log('\n📝 TypeScript:');
if (fs.existsSync('tsconfig.json')) {
  console.log('✅ tsconfig.json exists');
} else {
  console.log('❌ Missing tsconfig.json');
}

// Recommendations
console.log('\n💡 Recommendations:');
console.log('1. Clear cache: rm -rf .next && npm run build');
console.log('2. Reinstall deps: rm -rf node_modules && npm install');
console.log('3. Start server: npm run dev');
console.log('4. Check logs: Look for error messages in terminal');

// Quick fix script
console.log('\n🔧 Quick Fix Commands:');
console.log('# Kill any processes on port 3000');
console.log('lsof -ti:3000 | xargs kill -9');
console.log('');
console.log('# Clear and rebuild');
console.log('rm -rf .next');
console.log('npm run build');
console.log('');
console.log('# Start development server');
console.log('npm run dev');

console.log('\n' + '=' .repeat(60));
console.log('🎯 Diagnostic complete!');
console.log('📋 If issues persist, check the recommendations above.');