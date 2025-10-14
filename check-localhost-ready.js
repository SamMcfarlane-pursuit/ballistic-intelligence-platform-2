#!/usr/bin/env node

/**
 * Localhost Readiness Check
 * Validates all configurations before starting development server
 */

const fs = require('fs');
const { exec } = require('child_process');

console.log('🔍 Ballistic Intelligence Platform - Localhost Readiness Check\n');

let issues = [];

// Check 1: Port availability
console.log('1️⃣ Checking port 3000 availability...');
exec('lsof -ti:3000', (error, stdout) => {
  if (stdout.trim()) {
    console.log(`   ⚠️ Port 3000 is occupied by process ${stdout.trim()}`);
    console.log('   💡 Run: kill ' + stdout.trim() + ' to free the port');
  } else {
    console.log('   ✅ Port 3000 is available');
  }
});

// Check 2: JSON file validation
console.log('\n2️⃣ Validating JSON configuration files...');
const jsonFiles = [
  'package.json',
  'tsconfig.json'
];

jsonFiles.forEach(file => {
  try {
    if (fs.existsSync(file)) {
      const content = fs.readFileSync(file, 'utf8');
      JSON.parse(content);
      console.log(`   ✅ ${file} - Valid JSON`);
    } else {
      console.log(`   ⚠️ ${file} - File not found`);
    }
  } catch (error) {
    console.log(`   ❌ ${file} - JSON Syntax Error: ${error.message}`);
    issues.push(`${file} has JSON syntax errors`);
  }
});

// Check 3: Environment variables
console.log('\n3️⃣ Checking environment configuration...');
if (fs.existsSync('.env')) {
  const envContent = fs.readFileSync('.env', 'utf8');
  if (envContent.includes('NEXTAUTH_URL="http://localhost:3000"')) {
    console.log('   ✅ Environment configured for localhost:3000');
  } else {
    console.log('   ⚠️ NEXTAUTH_URL may not be set to localhost:3000');
  }
} else {
  console.log('   ⚠️ .env file not found');
}

// Check 4: Key dependencies
console.log('\n4️⃣ Checking key dependencies...');
try {
  const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
  const requiredDeps = ['next', 'react', 'react-dom', 'typescript'];
  
  requiredDeps.forEach(dep => {
    if (packageJson.dependencies[dep] || packageJson.devDependencies[dep]) {
      console.log(`   ✅ ${dep} - Installed`);
    } else {
      console.log(`   ❌ ${dep} - Missing`);
      issues.push(`Missing dependency: ${dep}`);
    }
  });
} catch (error) {
  console.log('   ❌ Could not read package.json');
  issues.push('package.json is not readable');
}

// Check 5: Critical files
console.log('\n5️⃣ Checking critical application files...');
const criticalFiles = [
  'src/components/executive/ExecutiveDashboard.tsx',
  'src/app/api/executive/route.ts',
  'src/components/news-signals/NewsSignalsDashboard.tsx'
];

criticalFiles.forEach(file => {
  if (fs.existsSync(file)) {
    console.log(`   ✅ ${file} - Exists`);
  } else {
    console.log(`   ❌ ${file} - Missing`);
    issues.push(`Missing critical file: ${file}`);
  }
});

// Summary
setTimeout(() => {
  console.log('\n' + '='.repeat(60));
  if (issues.length === 0) {
    console.log('🎉 All checks passed! Ready to start development server.');
    console.log('\n💡 To start the server:');
    console.log('   pnpm run dev');
    console.log('   OR');
    console.log('   pnpm run dev:simple');
    console.log('   OR');
    console.log('   node pnpm-dev.js');
    console.log('\n🌐 Access URLs:');
    console.log('   Main: http://localhost:3000');
    console.log('   Executive Dashboard: http://localhost:3000/executive');
    console.log('   News Signals: http://localhost:3000/news-signals');
  } else {
    console.log('❌ Issues found that need to be resolved:');
    issues.forEach((issue, index) => {
      console.log(`   ${index + 1}. ${issue}`);
    });
    console.log('\n💡 Please fix these issues before starting the development server.');
  }
  console.log('='.repeat(60));
}, 1000);