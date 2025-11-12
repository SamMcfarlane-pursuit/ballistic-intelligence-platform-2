#!/usr/bin/env node

/**
 * Crunchbase API Integration Test Script
 * 
 * Tests all Crunchbase API endpoints to ensure proper data aggregation
 */

const API_BASE = 'http://localhost:4000/api/crunchbase'

const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m'
}

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`)
}

async function testEndpoint(name, url) {
  try {
    log(`\n${name}`, 'cyan')
    log(`URL: ${url}`, 'blue')
    
    const response = await fetch(url)
    const data = await response.json()
    
    if (data.success) {
      log('✓ Success', 'green')
      return data
    } else {
      log(`✗ Failed: ${data.error}`, 'red')
      return null
    }
  } catch (error) {
    log(`✗ Error: ${error.message}`, 'red')
    return null
  }
}

async function runTests() {
  log('='.repeat(60), 'cyan')
  log('Crunchbase API Integration Tests', 'cyan')
  log('='.repeat(60), 'cyan')

  // Test 1: Health Check
  const health = await testEndpoint(
    'Test 1: Health Check',
    `${API_BASE}?action=health`
  )
  if (health) {
    log(`  Status: ${health.data.status}`, 'yellow')
    log(`  Organizations: ${health.data.totalOrganizations}`, 'yellow')
  }

  // Test 2: Search All Companies
  const searchAll = await testEndpoint(
    'Test 2: Search All Cybersecurity Companies',
    `${API_BASE}?action=search&limit=10`
  )
  if (searchAll) {
    log(`  Found: ${searchAll.data.total_count} companies`, 'yellow')
    log(`  Returned: ${searchAll.data.organizations.length} companies`, 'yellow')
    if (searchAll.data.organizations.length > 0) {
      log(`  First company: ${searchAll.data.organizations[0].name}`, 'yellow')
    }
  }

  // Test 3: Search Specific Company - CrowdStrike
  const crowdstrike = await testEndpoint(
    'Test 3: Search for CrowdStrike',
    `${API_BASE}?action=search&query=CrowdStrike&limit=1`
  )
  if (crowdstrike && crowdstrike.data.organizations.length > 0) {
    const company = crowdstrike.data.organizations[0]
    log(`  Name: ${company.name}`, 'yellow')
    log(`  Founded: ${company.founded_on}`, 'yellow')
    log(`  Funding: $${(company.total_funding_usd / 1000000).toFixed(1)}M`, 'yellow')
    log(`  Employees: ${company.employee_count.value}`, 'yellow')
    log(`  Location: ${company.location_identifiers[0].name}`, 'yellow')
  }

  // Test 4: Search Specific Company - Snyk
  const snyk = await testEndpoint(
    'Test 4: Search for Snyk',
    `${API_BASE}?action=search&query=Snyk&limit=1`
  )
  if (snyk && snyk.data.organizations.length > 0) {
    const company = snyk.data.organizations[0]
    log(`  Name: ${company.name}`, 'yellow')
    log(`  Founded: ${company.founded_on}`, 'yellow')
    log(`  Funding: $${(company.total_funding_usd / 1000000).toFixed(1)}M`, 'yellow')
    log(`  Description: ${company.short_description}`, 'yellow')
  }

  // Test 5: Get Organization by UUID
  const orgByUuid = await testEndpoint(
    'Test 5: Get Organization by UUID (Wiz)',
    `${API_BASE}?action=organization&uuid=wiz`
  )
  if (orgByUuid && orgByUuid.data) {
    const company = orgByUuid.data
    log(`  Name: ${company.name}`, 'yellow')
    log(`  Website: ${company.website}`, 'yellow')
    log(`  Funding: $${(company.total_funding_usd / 1000000).toFixed(1)}M`, 'yellow')
    log(`  Categories: ${company.categories.map(c => c.name).join(', ')}`, 'yellow')
  }

  // Test 6: Get Funding Rounds
  const funding = await testEndpoint(
    'Test 6: Get Funding Rounds',
    `${API_BASE}?action=funding&uuid=crowdstrike`
  )
  if (funding && funding.data) {
    log(`  Funding rounds: ${funding.data.length}`, 'yellow')
    if (funding.data.length > 0) {
      log(`  Latest round: ${funding.data[0].series} - $${(funding.data[0].money_raised_usd / 1000000).toFixed(1)}M`, 'yellow')
    }
  }

  // Test 7: Get Investors
  const investors = await testEndpoint(
    'Test 7: Get Investors',
    `${API_BASE}?action=investors&uuid=crowdstrike`
  )
  if (investors && investors.data) {
    log(`  Investors: ${investors.data.length}`, 'yellow')
    if (investors.data.length > 0) {
      log(`  Top investor: ${investors.data[0].name}`, 'yellow')
    }
  }

  // Test 8: Funding Analysis
  const analysis = await testEndpoint(
    'Test 8: Cybersecurity Funding Analysis',
    `${API_BASE}?action=analysis&timeframe=6m`
  )
  if (analysis && analysis.data) {
    log(`  Total funding: $${(analysis.data.total_funding / 1000000000).toFixed(2)}B`, 'yellow')
    log(`  Total deals: ${analysis.data.total_deals}`, 'yellow')
    log(`  Avg deal size: $${(analysis.data.average_deal_size / 1000000).toFixed(1)}M`, 'yellow')
    if (analysis.data.top_sectors.length > 0) {
      log(`  Top sector: ${analysis.data.top_sectors[0].sector}`, 'yellow')
    }
  }

  // Test 9: Monitor Multiple Companies
  const monitor = await testEndpoint(
    'Test 9: Monitor Multiple Companies',
    `${API_BASE}?action=monitor&companies=CrowdStrike,Snyk,Wiz`
  )
  if (monitor && monitor.data) {
    log(`  Funding rounds found: ${monitor.data.length}`, 'yellow')
  }

  // Test 10: Search by Category
  const cloudSecurity = await testEndpoint(
    'Test 10: Search Cloud Security Companies',
    `${API_BASE}?action=search&query=cloud&limit=5`
  )
  if (cloudSecurity && cloudSecurity.data.organizations.length > 0) {
    log(`  Found: ${cloudSecurity.data.organizations.length} cloud security companies`, 'yellow')
    cloudSecurity.data.organizations.forEach(company => {
      log(`    - ${company.name}: ${company.short_description}`, 'yellow')
    })
  }

  log('\n' + '='.repeat(60), 'cyan')
  log('All Tests Completed!', 'green')
  log('='.repeat(60), 'cyan')
}

// Run tests
runTests().catch(error => {
  log(`\nFatal error: ${error.message}`, 'red')
  process.exit(1)
})
