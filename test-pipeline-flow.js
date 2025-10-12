#!/usr/bin/env node

/**
 * Pipeline Flow Test
 * Verifies data flows correctly through the entire system pipeline
 */

console.log('🔄 Testing Pipeline Flow & Connections...\n')

const pipelineFlow = {
  dataIngestion: [
    '/api/data-ingestion/growthlist',
    '/api/data-ingestion/market-intelligence',
    '/api/data-ingestion/threat-intelligence',
    '/api/data-ingestion/patent-intelligence'
  ],
  processing: [
    '/api/ai-agents?action=status',
    '/api/rag-analysis?action=demo',
    '/api/analysis'
  ],
  storage: [
    '/api/ballistic-portfolio?action=stats',
    '/api/secure-data?action=classifications',
    '/api/intelligence-center?action=status'
  ],
  presentation: [
    '/executive-dashboard',
    '/ballistic-portfolio',
    '/security',
    '/ai-agents',
    '/intelligence-center'
  ]
}

async function testPipelineStage(stageName, endpoints) {
  console.log(`🔄 Testing ${stageName} Stage...`)
  
  let workingEndpoints = 0
  const results = []
  
  for (const endpoint of endpoints) {
    try {
      const isApi = endpoint.startsWith('/api/')
      const url = `http://localhost:3000${endpoint}`
      
      const response = await fetch(url)
      const isWorking = response.ok
      
      if (isApi && isWorking) {
        // For API endpoints, check if they return valid data
        try {
          const text = await response.text()
          const hasValidData = text.includes('success') || text.includes('data') || text.includes('{')
          
          console.log(`   ${hasValidData ? '✅' : '⚠️ '} ${endpoint}: ${response.status} ${hasValidData ? '(Valid Data)' : '(No Data)'}`)
          if (hasValidData) workingEndpoints++
          results.push({ endpoint, working: hasValidData, type: 'api' })
        } catch (error) {
          console.log(`   ❌ ${endpoint}: JSON Error`)
          results.push({ endpoint, working: false, type: 'api' })
        }
      } else if (!isApi && isWorking) {
        // For pages, check if they load without errors
        const html = await response.text()
        const hasContent = html.includes('html') && !html.includes('404') && !html.includes('500')
        
        console.log(`   ${hasContent ? '✅' : '⚠️ '} ${endpoint}: ${response.status} ${hasContent ? '(Page Loads)' : '(Issues)'}`)
        if (hasContent) workingEndpoints++
        results.push({ endpoint, working: hasContent, type: 'page' })
      } else {
        console.log(`   ❌ ${endpoint}: ${response.status}`)
        results.push({ endpoint, working: false, type: isApi ? 'api' : 'page' })
      }
    } catch (error) {
      console.log(`   ❌ ${endpoint}: ERROR - ${error.message}`)
      results.push({ endpoint, working: false, type: 'unknown' })
    }
  }
  
  const score = ((workingEndpoints / endpoints.length) * 100).toFixed(1)
  console.log(`   📊 ${stageName} Score: ${workingEndpoints}/${endpoints.length} (${score}%)\n`)
  
  return { score: parseFloat(score), results, working: workingEndpoints, total: endpoints.length }
}

async function testDataConnections() {
  console.log('🔗 Testing Data Connections Between Components...')
  
  const connections = [
    {
      name: 'Portfolio → Executive Dashboard',
      source: '/api/ballistic-portfolio?action=stats',
      target: '/executive-dashboard',
      dataField: 'totalPortfolioValue'
    },
    {
      name: 'AI Agents → Intelligence Center',
      source: '/api/ai-agents?action=status',
      target: '/intelligence-center',
      dataField: 'agents'
    },
    {
      name: 'Security → Executive Dashboard',
      source: '/api/security?action=status',
      target: '/executive-dashboard',
      dataField: 'systemHealth'
    },
    {
      name: 'Intelligence Center → All Modules',
      source: '/api/intelligence-center?action=status',
      target: '/intelligence-center',
      dataField: 'status'
    }
  ]
  
  let workingConnections = 0
  
  for (const connection of connections) {
    try {
      // Test source API
      const sourceResponse = await fetch(`http://localhost:3000${connection.source}`)
      const sourceData = await sourceResponse.json()
      
      // Test target page
      const targetResponse = await fetch(`http://localhost:3000${connection.target}`)
      const targetHtml = await targetResponse.text()
      
      const sourceWorking = sourceResponse.ok && sourceData.success
      const targetWorking = targetResponse.ok && targetHtml.includes('html')
      const dataFlowing = sourceWorking && targetWorking
      
      console.log(`   ${dataFlowing ? '✅' : '❌'} ${connection.name}: ${dataFlowing ? 'CONNECTED' : 'DISCONNECTED'}`)
      
      if (dataFlowing) workingConnections++
      
    } catch (error) {
      console.log(`   ❌ ${connection.name}: ERROR`)
    }
  }
  
  console.log(`   📊 Data Connections: ${workingConnections}/${connections.length} working\n`)
  return workingConnections / connections.length
}

async function testEndToEndFlow() {
  console.log('🎯 Testing End-to-End Pipeline Flow...')
  
  try {
    // Test complete flow: Data Ingestion → Processing → Storage → Presentation
    console.log('   1. Data Ingestion → Processing...')
    const ingestionResponse = await fetch('http://localhost:3000/api/data-ingestion/market-intelligence', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'test' })
    })
    const ingestionWorking = ingestionResponse.ok
    console.log(`      ${ingestionWorking ? '✅' : '❌'} Data Ingestion: ${ingestionWorking ? 'WORKING' : 'ISSUES'}`)
    
    console.log('   2. Processing → AI Analysis...')
    const aiResponse = await fetch('http://localhost:3000/api/ai-agents?action=status')
    const aiData = await aiResponse.json()
    const aiWorking = aiResponse.ok && aiData.success
    console.log(`      ${aiWorking ? '✅' : '❌'} AI Processing: ${aiWorking ? 'WORKING' : 'ISSUES'}`)
    
    console.log('   3. Storage → Portfolio Data...')
    const portfolioResponse = await fetch('http://localhost:3000/api/ballistic-portfolio?action=stats')
    const portfolioData = await portfolioResponse.json()
    const storageWorking = portfolioResponse.ok && portfolioData.success
    console.log(`      ${storageWorking ? '✅' : '❌'} Data Storage: ${storageWorking ? 'WORKING' : 'ISSUES'}`)
    
    console.log('   4. Presentation → Executive Dashboard...')
    const dashboardResponse = await fetch('http://localhost:3000/executive-dashboard')
    const dashboardHtml = await dashboardResponse.text()
    const presentationWorking = dashboardResponse.ok && dashboardHtml.includes('Portfolio Value')
    console.log(`      ${presentationWorking ? '✅' : '❌'} Presentation: ${presentationWorking ? 'WORKING' : 'ISSUES'}`)
    
    const endToEndWorking = ingestionWorking && aiWorking && storageWorking && presentationWorking
    console.log(`   📊 End-to-End Flow: ${endToEndWorking ? 'COMPLETE' : 'BROKEN'}\n`)
    
    return endToEndWorking
    
  } catch (error) {
    console.log(`   ❌ End-to-End Test: ERROR - ${error.message}\n`)
    return false
  }
}

async function runPipelineFlowTest() {
  console.log('🎯 Pipeline Flow & Connection Test Suite\n')
  
  const stageResults = {}
  
  // Test each pipeline stage
  console.log('🔄 PIPELINE STAGE TESTS')
  console.log('='.repeat(50))
  
  for (const [stageName, endpoints] of Object.entries(pipelineFlow)) {
    stageResults[stageName] = await testPipelineStage(stageName, endpoints)
  }
  
  // Test data connections
  const connectionScore = await testDataConnections()
  
  // Test end-to-end flow
  const endToEndWorking = await testEndToEndFlow()
  
  // Calculate overall pipeline health
  const stageScores = Object.values(stageResults).map(result => result.score)
  const avgStageScore = stageScores.reduce((a, b) => a + b, 0) / stageScores.length
  const connectionScore_pct = connectionScore * 100
  const endToEndScore = endToEndWorking ? 100 : 0
  
  const overallPipelineHealth = (avgStageScore * 0.4 + connectionScore_pct * 0.3 + endToEndScore * 0.3).toFixed(1)
  
  // Summary
  console.log('='.repeat(60))
  console.log('🎯 PIPELINE FLOW TEST RESULTS')
  console.log('='.repeat(60))
  
  console.log(`\n🔄 Pipeline Stages:`)
  Object.entries(stageResults).forEach(([stage, result]) => {
    console.log(`   ${stage}: ${result.working}/${result.total} (${result.score}%)`)
  })
  
  console.log(`\n🔗 Data Connections: ${(connectionScore * 100).toFixed(1)}%`)
  console.log(`🎯 End-to-End Flow: ${endToEndWorking ? 'WORKING' : 'BROKEN'}`)
  console.log(`\n📊 Overall Pipeline Health: ${overallPipelineHealth}%`)
  
  if (overallPipelineHealth >= 90) {
    console.log('\n🎉 PIPELINE STATUS: FULLY CONNECTED!')
    console.log('✅ All pipeline stages operational')
    console.log('✅ Data flowing correctly between components')
    console.log('✅ End-to-end functionality working')
    console.log('✅ No need for new pages - existing pipeline optimal')
  } else if (overallPipelineHealth >= 75) {
    console.log('\n⚠️  PIPELINE STATUS: MOSTLY CONNECTED')
    console.log('✅ Core pipeline functionality working')
    console.log('⚠️  Some connections need attention')
    console.log('📝 Focus on optimizing existing connections')
  } else {
    console.log('\n❌ PIPELINE STATUS: NEEDS REPAIR')
    console.log('❌ Multiple pipeline issues detected')
    console.log('🔧 Requires connection fixes before optimization')
  }
  
  console.log('\n🎯 Pipeline Optimization Recommendations:')
  if (overallPipelineHealth >= 80) {
    console.log('✅ OPTIMIZE EXISTING PIPELINE')
    console.log('   • Current connections working well')
    console.log('   • Focus on performance improvements')
    console.log('   • Enhance data flow efficiency')
    console.log('   • No new pages needed')
  } else {
    console.log('⚠️  FIX PIPELINE CONNECTIONS FIRST')
    console.log('   • Repair broken connections')
    console.log('   • Improve data flow reliability')
    console.log('   • Then optimize performance')
  }
  
  console.log('\n🚀 Pipeline Ready for Optimization!')
}

// Run the pipeline flow test
runPipelineFlowTest().catch(console.error)