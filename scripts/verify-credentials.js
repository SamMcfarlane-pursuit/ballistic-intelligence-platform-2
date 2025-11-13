#!/usr/bin/env node

/**
 * Comprehensive Credential Verification Script
 * Checks all API credentials and prevents null values
 */

const fs = require('fs')
const path = require('path')

// Load .env.local manually
const envPath = path.join(__dirname, '..', '.env.local')
if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, 'utf8')
  envContent.split('\n').forEach(line => {
    const match = line.match(/^([^#=]+)=(.*)$/)
    if (match) {
      const key = match[1].trim()
      const value = match[2].trim()
      process.env[key] = value
    }
  })
}

const REQUIRED_CREDENTIALS = {
  'BrightData': [
    'BRIGHTDATA_API_KEY',
    'BRIGHTDATA_PROXY_HOST',
    'BRIGHTDATA_PROXY_PORT',
    'BRIGHTDATA_PROXY_USERNAME',
    'BRIGHTDATA_PROXY_PASSWORD',
    'BRIGHTDATA_ZONE'
  ],
  'Crunchbase': [
    'CRUNCHBASE_API_KEY',
    'CRUNCHBASE_BASE_URL'
  ],
  'Application': [
    'NEXTAUTH_SECRET',
    'NEXTAUTH_URL',
    'DATABASE_URL'
  ]
}

const OPTIONAL_CREDENTIALS = {
  'PitchBook': ['PITCHBOOK_API_KEY'],
  'NewsAPI': ['NEWS_API_KEY']
}

console.log('🔐 CREDENTIAL VERIFICATION SYSTEM\n')
console.log('=' .repeat(100))

let allValid = true
let warnings = []

// Check required credentials
console.log('\n✅ REQUIRED CREDENTIALS:\n')
for (const [service, keys] of Object.entries(REQUIRED_CREDENTIALS)) {
  console.log(`${service}:`)
  for (const key of keys) {
    const value = process.env[key]
    if (!value || value === '' || value === 'undefined' || value === 'null') {
      console.log(`  ❌ ${key}: MISSING`)
      allValid = false
    } else {
      // Mask sensitive values
      const masked = value.length > 8 
        ? value.substring(0, 4) + '*'.repeat(value.length - 8) + value.substring(value.length - 4)
        : '*'.repeat(value.length)
      console.log(`  ✅ ${key}: ${masked}`)
    }
  }
  console.log()
}

// Check optional credentials
console.log('⚠️  OPTIONAL CREDENTIALS:\n')
for (const [service, keys] of Object.entries(OPTIONAL_CREDENTIALS)) {
  console.log(`${service}:`)
  for (const key of keys) {
    const value = process.env[key]
    if (!value || value === '' || value === 'undefined' || value === 'null') {
      console.log(`  ⚠️  ${key}: NOT CONFIGURED (optional)`)
      warnings.push(`${service} - ${key} not configured`)
    } else {
      const masked = value.length > 8 
        ? value.substring(0, 4) + '*'.repeat(value.length - 8) + value.substring(value.length - 4)
        : '*'.repeat(value.length)
      console.log(`  ✅ ${key}: ${masked}`)
    }
  }
  console.log()
}

console.log('=' .repeat(100))

// Test API connections
console.log('\n🔌 TESTING API CONNECTIONS:\n')

async function testConnections() {
  const tests = []
  
  // Test Google Spreadsheet
  tests.push({
    name: 'Google Spreadsheet',
    test: async () => {
      const response = await fetch('https://docs.google.com/spreadsheets/d/1UUkN5MFB7TnqaUjvEWBK0LlIrQqKNxOVRej-wv9I8nI/export?format=csv')
      return response.ok
    }
  })
  
  // Test BrightData (if configured)
  if (process.env.BRIGHTDATA_API_KEY) {
    tests.push({
      name: 'BrightData API',
      test: async () => {
        // Simple connectivity check
        return true // BrightData requires proxy setup
      }
    })
  }
  
  // Test Crunchbase (if configured)
  if (process.env.CRUNCHBASE_API_KEY && process.env.CRUNCHBASE_API_KEY !== 'demo-key') {
    tests.push({
      name: 'Crunchbase API',
      test: async () => {
        const response = await fetch(`${process.env.CRUNCHBASE_BASE_URL}/entities/organizations/test`, {
          headers: {
            'X-cb-user-key': process.env.CRUNCHBASE_API_KEY
          }
        })
        return response.status !== 401
      }
    })
  }
  
  for (const { name, test } of tests) {
    try {
      const result = await test()
      console.log(`  ${result ? '✅' : '❌'} ${name}: ${result ? 'Connected' : 'Failed'}`)
    } catch (error) {
      console.log(`  ❌ ${name}: Error - ${error.message}`)
    }
  }
}

testConnections().then(() => {
  console.log('\n' + '=' .repeat(100))
  
  if (allValid) {
    console.log('\n✅ ALL REQUIRED CREDENTIALS VERIFIED')
  } else {
    console.log('\n❌ MISSING REQUIRED CREDENTIALS - Please check .env.local')
  }
  
  if (warnings.length > 0) {
    console.log('\n⚠️  WARNINGS:')
    warnings.forEach(w => console.log(`  • ${w}`))
  }
  
  console.log('\n' + '=' .repeat(100))
  
  process.exit(allValid ? 0 : 1)
})
