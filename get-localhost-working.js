#!/usr/bin/env node

/**
 * Get Localhost Working - Direct fix for localhost:3000 not working
 */

const { spawn, execSync } = require('child_process');
const fs = require('fs');
const http = require('http');

console.log('🔧 Get Localhost:3000 Working - Direct Fix');
console.log('=' .repeat(45));

async function getLocalhostWorking() {
  console.log('🎯 Diagnosing why localhost:3000 is not working...\n');
  
  try {
    // Step 1: Force clean everything
    await forceClean();
    
    // Step 2: Create minimal working setup
    await createMinimalSetup();
    
    // Step 3: Start server with direct monitoring
    await startWithDirectMonitoring();
    
  } catch (error) {
    console.error('❌ Direct fix failed:', error.message);
    await lastResortFix();
  }
}

async function forceClean() {
  console.log('🧹 Force cleaning everything...');
  
  // Kill ALL processes on port 3000
  try {
    execSync('lsof -ti:3000 | xargs kill -9', { stdio: 'pipe' });
    console.log('   ✅ Killed all processes on port 3000');
  } catch (e) {
    console.log('   ✅ No processes to kill on port 3000');
  }
  
  // Remove all cache and build files
  try {
    execSync('rm -rf .next node_modules/.cache', { stdio: 'pipe' });
    console.log('   ✅ Cleared all cache files');
  } catch (e) {
    console.log('   ⚠️  Some cache files could not be cleared');
  }
  
  // Verify node_modules
  if (!fs.existsSync('node_modules/next')) {
    console.log('   🔄 Reinstalling dependencies...');
    execSync('npm install', { stdio: 'inherit' });
    console.log('   ✅ Dependencies reinstalled');
  } else {
    console.log('   ✅ Dependencies verified');
  }
  
  console.log('');
}

async function createMinimalSetup() {
  console.log('⚙️  Creating minimal working setup...');
  
  // Ensure basic app structure exists
  const basicFiles = {
    'src/app/page.tsx': `export default function HomePage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          CS Intelligence Platform
        </h1>
        <p className="text-xl text-gray-600 mb-8">
          Cybersecurity Investment Intelligence
        </p>
        <div className="space-y-2">
          <a 
            href="/data-management" 
            className="block bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700"
          >
            Data Management
          </a>
          <a 
            href="/intelligence-center" 
            className="block bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700"
          >
            Intelligence Center
          </a>
        </div>
      </div>
    </div>
  );
}`,
    'src/app/api/health/route.ts': `import { NextResponse } from 