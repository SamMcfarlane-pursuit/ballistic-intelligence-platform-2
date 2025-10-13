#!/usr/bin/env node

/**
 * Minimal test to verify Next.js setup
 */

const fs = require('fs');
const path = require('path');

console.log('🧪 Minimal Next.js Setup Test');
console.log('=' .repeat(40));

// Test 1: Check package.json scripts
console.log('📦 Checking package.json...');
try {
  const pkg = JSON.parse(fs.readFileSync('package.json', 'utf8'));
  
  if (pkg.scripts && pkg.scripts.dev) {
    console.log(`✅ Dev script: ${pkg.scripts.dev}`);
  } else {
    console.log('❌ Missing dev script');
  }
  
  if (pkg.dependencies && pkg.dependencies.next) {
    console.log(`✅ Next.js version: ${pkg.dependencies.next}`);
  } else {
    console.log('❌ Next.js not found in dependencies');
  }
} catch (error) {
  console.log('❌ Error reading package.json:', error.message);
}

// Test 2: Check app directory structure
console.log('\n📁 Checking app directory...');
const appDir = 'src/app';
if (fs.existsSync(appDir)) {
  console.log('✅ src/app directory exists');
  
  const files = fs.readdirSync(appDir);
  console.log('📄 Files in src/app:', files.join(', '));
  
  // Check for required files
  const required = ['layout.tsx', 'page.tsx', 'globals.css'];
  required.forEach(file => {
    if (files.includes(file)) {
      console.log(`✅ ${file} exists`);
    } else {
      console.log(`❌ Missing ${file}`);
    }
  });
} else {
  console.log('❌ src/app directory not found');
}

// Test 3: Check for node_modules
console.log('\n📚 Checking dependencies...');
if (fs.existsSync('node_modules')) {
  console.log('✅ node_modules directory exists');
  
  // Check for Next.js
  if (fs.existsSync('node_modules/next')) {
    console.log('✅ Next.js installed');
  } else {
    console.log('❌ Next.js not installed');
  }
  
  // Check for React
  if (fs.existsSync('node_modules/react')) {
    console.log('✅ React installed');
  } else {
    console.log('❌ React not installed');
  }
} else {
  console.log('❌ node_modules not found - run npm install');
}

// Test 4: Check Next.js config
console.log('\n⚙️  Checking configuration...');
if (fs.existsSync('next.config.ts')) {
  console.log('✅ next.config.ts exists');
  try {
    const config = fs.readFileSync('next.config.ts', 'utf8');
    if (config.includes('NextConfig')) {
      console.log('✅ Config appears valid');
    } else {
      console.log('⚠️  Config may have issues');
    }
  } catch (error) {
    console.log('❌ Error reading config:', error.message);
  }
} else if (fs.existsSync('next.config.js')) {
  console.log('✅ next.config.js exists');
} else {
  console.log('⚠️  No Next.js config found (optional)');
}

// Test 5: Check TypeScript config
console.log('\n📝 Checking TypeScript...');
if (fs.existsSync('tsconfig.json')) {
  console.log('✅ tsconfig.json exists');
} else {
  console.log('❌ tsconfig.json missing');
}

// Test 6: Simple syntax check
console.log('\n🔍 Basic syntax check...');
try {
  const layoutContent = fs.readFileSync('src/app/layout.tsx', 'utf8');
  
  // Check for common issues
  if (layoutContent.includes('export default')) {
    console.log('✅ Layout has default export');
  } else {
    console.log('❌ Layout missing default export');
  }
  
  if (layoutContent.includes('RootLayout')) {
    console.log('✅ Layout function found');
  } else {
    console.log('❌ Layout function not found');
  }
  
  if (layoutContent.includes('children')) {
    console.log('✅ Children prop handled');
  } else {
    console.log('❌ Children prop missing');
  }
  
} catch (error) {
  console.log('❌ Error checking layout:', error.message);
}

console.log('\n🎯 Test complete!');
console.log('\n💡 If all checks pass, try:');
console.log('   npm run dev');
console.log('\n💡 If issues found, try:');
console.log('   npm install');
console.log('   rm -rf .next');
console.log('   npm run build');
console.log('   npm run dev');