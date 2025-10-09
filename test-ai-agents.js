#!/usr/bin/env node

// Comprehensive AI Agent System Test
const baseUrl = 'http://localhost:3000'

async function testAIAgentSystem() {
  console.log('🤖 Testing AI Agent System...\n')

  // Test 1: System Status
  console.log('1. Testing System Status...')
  try {
    const response = await fetch(`${baseUrl}/api/ai-agents?action=status`)
    const data = await response.json()
    
    if (data.success && data.data.status === 'operational') {
      console.log('✅ System Status: OPERATIONAL')
      console.log(`   Active Agents: ${Object.keys(data.data.agents).length}`)
    } else {
      console.log('❌ System Status: FAILED')
    }
  } catch (error) {
    console.log('❌ System Status: ERROR -', error.message)
  }

  // Test 2: Demo Analysis
  console.log('\n2. Testing Demo Analysis...')
  try {
    const response = await fetch(`${baseUrl}/api/ai-agents?action=demo`)
    const data = await response.json()
    
    if (data.success && data.data.analysis) {
      console.log('✅ Demo Analysis: SUCCESS')
      console.log(`   Company: ${data.data.company.name}`)
      console.log(`   Overall Score: ${data.data.analysis.overallScore.toFixed(2)}`)
      console.log(`   Recommendation: ${data.data.analysis.synthesizedInsights.investmentRecommendation}`)
      console.log(`   Consensus Level: ${data.data.analysis.agentCoordination.consensusLevel.toFixed(2)}`)
    } else {
      console.log('❌ Demo Analysis: FAILED')
    }
  } catch (error) {
    console.log('❌ Demo Analysis: ERROR -', error.message)
  }

  // Test 3: Individual Company Analysis
  console.log('\n3. Testing Individual Company Analysis...')
  const testCompany = {
    id: 'test-001',
    name: 'SecureAI Technologies',
    focusArea: 'ai-security',
    investmentStage: 'seed',
    description: 'AI-powered endpoint security solution',
    technology: 'machine learning, cloud security, API integration',
    employees: 25,
    founded: 2022,
    revenueGrowth: 200,
    customerCount: 50,
    patentCount: 3
  }

  try {
    const response = await fetch(`${baseUrl}/api/ai-agents`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'analyze', company: testCompany })
    })
    const data = await response.json()
    
    if (data.success && data.data.analysis) {
      console.log('✅ Individual Analysis: SUCCESS')
      console.log(`   Execution Time: ${data.data.metadata.executionTime}`)
      console.log(`   Overall Score: ${data.data.analysis.overallScore.toFixed(2)}`)
      console.log(`   Technical Score: ${data.data.analysis.technicalAnalysis.confidence.toFixed(2)}`)
      console.log(`   Market Score: ${data.data.analysis.marketAnalysis.confidence.toFixed(2)}`)
      console.log(`   Threat Score: ${data.data.analysis.threatAnalysis.confidence.toFixed(2)}`)
    } else {
      console.log('❌ Individual Analysis: FAILED')
    }
  } catch (error) {
    console.log('❌ Individual Analysis: ERROR -', error.message)
  }

  // Test 4: Agent Coordination Test
  console.log('\n4. Testing Agent Coordination...')
  try {
    const response = await fetch(`${baseUrl}/api/ai-agents`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'coordination-test' })
    })
    const data = await response.json()
    
    if (data.success && data.data.coordinationTest) {
      console.log('✅ Agent Coordination: SUCCESS')
      console.log(`   Consensus Achieved: ${data.data.coordinationTest.consensusAchieved}`)
      console.log(`   Consensus Level: ${data.data.coordinationTest.consensusLevel.toFixed(2)}`)
      console.log(`   Strategy: ${data.data.coordinationTest.coordinatedStrategy}`)
    } else {
      console.log('❌ Agent Coordination: FAILED')
    }
  } catch (error) {
    console.log('❌ Agent Coordination: ERROR -', error.message)
  }

  // Test 5: Health Check
  console.log('\n5. Testing System Health...')
  try {
    const response = await fetch(`${baseUrl}/api/ai-agents?action=health`)
    const data = await response.json()
    
    if (data.success && data.data.systemHealth === 'healthy') {
      console.log('✅ System Health: HEALTHY')
      console.log(`   Uptime: ${data.data.uptime}`)
      const agents = Object.keys(data.data.checks)
      console.log(`   All ${agents.length} agents operational`)
    } else {
      console.log('❌ System Health: UNHEALTHY')
    }
  } catch (error) {
    console.log('❌ System Health: ERROR -', error.message)
  }

  console.log('\n🎯 AI Agent System Test Complete!')
}

// Run the test
testAIAgentSystem().catch(console.error)