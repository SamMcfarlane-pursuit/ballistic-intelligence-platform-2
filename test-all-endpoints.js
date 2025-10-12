// Comprehensive endpoint testing for localhost:3000
console.log('🧪 Testing All CS Intelligence Platform Endpoints')
console.log('=' .repeat(60))

const baseUrl = 'http://localhost:3000'

const endpoints = [
  // Main pages
  { name: 'Home Page', url: `${baseUrl}/`, type: 'page' },
  { name: 'Executive Dashboard', url: `${baseUrl}/executive-dashboard`, type: 'page' },
  { name: 'AI Agents', url: `${baseUrl}/ai-agents`, type: 'page' },
  { name: 'Data Sources', url: `${baseUrl}/data-sources`, type: 'page' },
  { name: 'Portfolio', url: `${baseUrl}/ballistic-portfolio`, type: 'page' },
  { name: 'Intelligence Center', url: `${baseUrl}/intelligence-center`, type: 'page' },
  
  // API endpoints
  { name: 'Portfolio API', url: `${baseUrl}/api/ballistic-portfolio?action=stats`, type: 'api' },
  { name: 'AI Agents API', url: `${baseUrl}/api/ai-agents?action=status`, type: 'api' },
  { name: 'RAG Analysis API', url: `${baseUrl}/api/rag-analysis?action=demo`, type: 'api' },
  { name: 'Data Sources API', url: `${baseUrl}/api/data-sources/sync?action=status`, type: 'api' },
  { name: 'Funding Agent API', url: `${baseUrl}/api/funding-agent?action=demo`, type: 'api' },
  { name: 'Security API', url: `${baseUrl}/api/security?action=status`, type: 'api' },
  
  // Company analysis pages
  { name: 'Veza Analysis', url: `${baseUrl}/company-analysis/veza`, type: 'page' },
  { name: 'Concentric Analysis', url: `${baseUrl}/company-analysis/concentric`, type: 'page' },
  { name: 'Pangea Analysis', url: `${baseUrl}/company-analysis/pangea`, type: 'page' }
]

async function testEndpoint(endpoint) {
  try {
    console.log(`\n📡 Testing: ${endpoint.name}`)
    console.log(`   URL: ${endpoint.url}`)
    
    const response = await fetch(endpoint.url)
    const status = response.status
    
    if (endpoint.type === 'api') {
      try {
        const data = await response.json()
        if (status === 200) {
          console.log(`   ✅ Status: ${status} - API Response OK`)
          if (data.success !== undefined) {
            console.log(`   📊 Success: ${data.success}`)
          }
          if (data.data) {
            console.log(`   📋 Data Keys: ${Object.keys(data.data).join(', ')}`)
          }
        } else {
          console.log(`   ❌ Status: ${status} - API Error`)
          if (data.error) {
            console.log(`   🚨 Error: ${data.error}`)
          }
        }
      } catch (jsonError) {
        console.log(`   ⚠️  Status: ${status} - Non-JSON Response`)
      }
    } else {
      // Page endpoint
      if (status === 200) {
        const text = await response.text()
        if (text.includes('<!DOCTYPE html>')) {
          console.log(`   ✅ Status: ${status} - Page Loaded Successfully`)
          if (text.includes('CS Intelligence Platform') || text.includes('Ballistic')) {
            console.log(`   🎯 Content: Platform content detected`)
          }
        } else {
          console.log(`   ⚠️  Status: ${status} - Unexpected content`)
        }
      } else {
        console.log(`   ❌ Status: ${status} - Page Load Failed`)
      }
    }
    
    return { name: endpoint.name, status, success: status === 200 }
    
  } catch (error) {
    console.log(`   ❌ Connection Error: ${error.message}`)
    return { name: endpoint.name, status: 'ERROR', success: false, error: error.message }
  }
}

async function runAllTests() {
  console.log(`\n🚀 Starting comprehensive endpoint testing...`)
  console.log(`📍 Base URL: ${baseUrl}`)
  
  const results = []
  
  for (const endpoint of endpoints) {
    const result = await testEndpoint(endpoint)
    results.push(result)
    
    // Small delay between requests
    await new Promise(resolve => setTimeout(resolve, 500))
  }
  
  // Summary
  console.log('\n' + '=' .repeat(60))
  console.log('📊 TEST RESULTS SUMMARY')
  console.log('=' .repeat(60))
  
  const successful = results.filter(r => r.success)
  const failed = results.filter(r => !r.success)
  
  console.log(`✅ Successful: ${successful.length}/${results.length}`)
  console.log(`❌ Failed: ${failed.length}/${results.length}`)
  
  if (successful.length > 0) {
    console.log('\n✅ WORKING ENDPOINTS:')
    successful.forEach(r => {
      console.log(`   • ${r.name} (${r.status})`)
    })
  }
  
  if (failed.length > 0) {
    console.log('\n❌ FAILED ENDPOINTS:')
    failed.forEach(r => {
      console.log(`   • ${r.name} (${r.status}) ${r.error ? '- ' + r.error : ''}`)
    })
  }
  
  console.log('\n' + '=' .repeat(60))
  if (successful.length === results.length) {
    console.log('🎉 ALL ENDPOINTS WORKING PERFECTLY!')
    console.log('🚀 CS Intelligence Platform is fully operational!')
  } else if (successful.length > results.length * 0.8) {
    console.log('✅ SYSTEM MOSTLY OPERATIONAL')
    console.log(`📊 ${Math.round((successful.length/results.length)*100)}% success rate`)
  } else {
    console.log('⚠️  SYSTEM NEEDS ATTENTION')
    console.log('🔧 Some endpoints require fixing')
  }
  
  console.log('\n🌐 Access your application at:')
  console.log(`   Executive Dashboard: ${baseUrl}/executive-dashboard`)
  console.log(`   AI Agents: ${baseUrl}/ai-agents`)
  console.log(`   Data Sources: ${baseUrl}/data-sources`)
  console.log(`   Portfolio: ${baseUrl}/ballistic-portfolio`)
}

// Run the tests
runAllTests().catch(console.error)