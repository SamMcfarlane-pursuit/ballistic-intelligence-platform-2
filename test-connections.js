#!/usr/bin/env node

console.log('🔄 Testing All System Connections...\n')

const testEndpoints = [
  // Main Pages
  { name: 'Home Page', url: 'http://localhost:3000', expected: 200 },
  { name: 'Executive Dashboard', url: 'http://localhost:3000/executive-dashboard', expected: 200 },
  { name: 'Portfolio Dashboard', url: 'http://localhost:3000/ballistic-portfolio', expected: 200 },
  { name: 'AI Agents', url: 'http://localhost:3000/ai-agents', expected: 200 },
  { name: 'Security Center', url: 'http://localhost:3000/security', expected: 200 },
  { name: 'Intelligence Center', url: 'http://localhost:3000/intelligence-center', expected: 200 },
  
  // API Endpoints
  { name: 'Portfolio API', url: 'http://localhost:3000/api/ballistic-portfolio?action=stats', expected: 200 },
  { name: 'AI Agents API', url: 'http://localhost:3000/api/ai-agents?action=status', expected: 200 },
  { name: 'Security API', url: 'http://localhost:3000/api/security?action=status', expected: 200 },
  { name: 'Intelligence API', url: 'http://localhost:3000/api/intelligence-center?action=status', expected: 200 },
  { name: 'GrowthList API', url: 'http://localhost:3000/api/data-ingestion/growthlist', expected: 200 },
  { name: 'RAG Analysis API', url: 'http://localhost:3000/api/rag-analysis?action=demo', expected: 200 },
]

async function testConnection(endpoint) {
  try {
    const response = await fetch(endpoint.url)
    const status = response.status
    const success = status === endpoint.expected
    
    console.log(`${success ? '✅' : '❌'} ${endpoint.name}: ${status} ${success ? '(OK)' : '(FAILED)'}`)
    
    if (!success && status !== 404) {
      try {
        const text = await response.text()
        if (text.length < 200) {
          console.log(`   Response: ${text.substring(0, 100)}...`)
        }
      } catch (e) {
        // Ignore response parsing errors
      }
    }
    
    return success
  } catch (error) {
    console.log(`❌ ${endpoint.name}: ERROR - ${error.message}`)
    return false
  }
}

async function runTests() {
  console.log('🎯 CONNECTION TEST RESULTS')
  console.log('==================================================')
  
  let passed = 0
  let total = testEndpoints.length
  
  for (const endpoint of testEndpoints) {
    const success = await testConnection(endpoint)
    if (success) passed++
    await new Promise(resolve => setTimeout(resolve, 100)) // Small delay between requests
  }
  
  console.log('\n==================================================')
  console.log(`📊 SUMMARY: ${passed}/${total} connections working (${((passed/total)*100).toFixed(1)}%)`)
  
  if (passed === total) {
    console.log('🎉 ALL SYSTEMS OPERATIONAL!')
  } else if (passed >= total * 0.8) {
    console.log('⚠️  MOSTLY OPERATIONAL - Minor issues detected')
  } else {
    console.log('❌ SYSTEM ISSUES - Multiple connections failing')
  }
  
  console.log('\n🔗 System is ready for use at: http://localhost:3000')
  console.log('🎯 Executive Dashboard: http://localhost:3000/executive-dashboard')
}

runTests().catch(console.error)