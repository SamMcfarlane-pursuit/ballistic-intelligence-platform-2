#!/usr/bin/env node

/**
 * CS Intelligence Platform - System Health Check
 * Tests all critical endpoints and functionality
 */

const http = require('http');

const BASE_URL = 'http://localhost:3000';

// Test endpoints
const endpoints = [
  { path: '/api/health', name: 'Health Check' },
  { path: '/api/data-management?action=stats', name: 'Data Management Stats' },
  { path: '/api/intelligence-center?action=status', name: 'Intelligence Center Status' },
  { path: '/api/ballistic-portfolio?action=stats', name: 'Portfolio Stats' },
  { path: '/api/ai-agents?action=status', name: 'AI Agents Status' }
];

// Page endpoints
const pages = [
  { path: '/', name: 'Home Page' },
  { path: '/data-management', name: 'Data Management' },
  { path: '/intelligence-center', name: 'Intelligence Center' },
  { path: '/executive-dashboard', name: 'Executive Dashboard' },
  { path: '/ai-agents', name: 'AI Agents' }
];

function testEndpoint(url, name) {
  return new Promise((resolve) => {
    const req = http.get(url, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        resolve({
          name,
          status: res.statusCode,
          success: res.statusCode === 200,
          response: data.length > 0 ? 'Data received' : 'No data'
        });
      });
    });
    
    req.on('error', (err) => {
      resolve({
        name,
        status: 'ERROR',
        success: false,
        response: err.message
      });
    });
    
    req.setTimeout(5000, () => {
      req.destroy();
      resolve({
        name,
        status: 'TIMEOUT',
        success: false,
        response: 'Request timeout'
      });
    });
  });
}

async function runHealthCheck() {
  console.log('🏥 CS Intelligence Platform - System Health Check');
  console.log('=' .repeat(60));
  
  // Test API endpoints
  console.log('\n📡 Testing API Endpoints:');
  for (const endpoint of endpoints) {
    const result = await testEndpoint(`${BASE_URL}${endpoint.path}`, endpoint.name);
    const status = result.success ? '✅' : '❌';
    console.log(`${status} ${result.name}: ${result.status} - ${result.response}`);
  }
  
  // Test pages
  console.log('\n🌐 Testing Pages:');
  for (const page of pages) {
    const result = await testEndpoint(`${BASE_URL}${page.path}`, page.name);
    const status = result.success ? '✅' : '❌';
    console.log(`${status} ${result.name}: ${result.status}`);
  }
  
  console.log('\n' + '=' .repeat(60));
  console.log('🎯 Health check complete!');
  console.log('\n📋 To start the server manually:');
  console.log('   npm run dev');
  console.log('\n🌐 Then access: http://localhost:3000');
}

// Test enhanced AI extraction
async function testEnhancedAI() {
  console.log('\n🧠 Testing Enhanced AI Extraction:');
  
  const testData = {
    action: 'ai-extract-enhanced',
    data: {
      text: 'CyberShield AI raises $15M Series A led by Ballistic Ventures for AI-powered threat detection',
      source: 'TechCrunch',
      title: 'AI Threat Detection Startup Funding',
      batchMode: true
    }
  };
  
  return new Promise((resolve) => {
    const postData = JSON.stringify(testData);
    const options = {
      hostname: 'localhost',
      port: 3000,
      path: '/api/data-management',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(postData)
      }
    };
    
    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const result = JSON.parse(data);
          console.log(`✅ Enhanced AI Extraction: ${result.success ? 'SUCCESS' : 'FAILED'}`);
          if (result.success && result.data) {
            console.log(`   Company: ${result.data.name}`);
            console.log(`   Industry: ${result.data.industry}`);
            console.log(`   Funding: $${(result.data.funding / 1000000).toFixed(1)}M`);
            console.log(`   Confidence: ${Math.round(result.data.confidence * 100)}%`);
          }
        } catch (e) {
          console.log(`❌ Enhanced AI Extraction: Parse error - ${e.message}`);
        }
        resolve();
      });
    });
    
    req.on('error', (err) => {
      console.log(`❌ Enhanced AI Extraction: ${err.message}`);
      resolve();
    });
    
    req.write(postData);
    req.end();
  });
}

// Run the health check
runHealthCheck().then(() => {
  // Test enhanced AI if server is running
  testEndpoint(`${BASE_URL}/api/health`, 'Server Check').then(result => {
    if (result.success) {
      testEnhancedAI();
    }
  });
});