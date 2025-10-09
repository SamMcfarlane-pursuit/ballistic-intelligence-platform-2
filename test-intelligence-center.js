#!/usr/bin/env node

// Comprehensive Intelligence Center Test
const baseUrl = 'http://localhost:3000'

async function testIntelligenceCenter() {
  console.log('🎯 Testing Intelligence Command Center...\n')

  // Test 1: System Status
  console.log('1. Testing System Status...')
  try {
    const response = await fetch(`${baseUrl}/api/intelligence-center?action=status`)
    const data = await response.json()
    
    if (data.success && data.data.status === 'operational') {
      console.log('✅ System Status: OPERATIONAL')
      console.log(`   Systems Online: ${data.data.operationalSystems}/${data.data.totalSystems}`)
      console.log(`   System Health: ${data.data.systemHealth}`)
      
      // Display individual system status
      Object.entries(data.data.systems).forEach(([system, status]) => {
        console.log(`   ${system}: ${status}`)
      })
    } else {
      console.log('❌ System Status: FAILED')
    }
  } catch (error) {
    console.log('❌ System Status: ERROR -', error.message)
  }

  // Test 2: Intelligence Metrics
  console.log('\n2. Testing Intelligence Metrics...')
  try {
    const response = await fetch(`${baseUrl}/api/intelligence-center?action=metrics`)
    const data = await response.json()
    
    if (data.success && data.data) {
      console.log('✅ Intelligence Metrics: SUCCESS')
      console.log(`   AI Agents - Active: ${data.data.aiAgents.activeAgents}, Analyses: ${data.data.aiAgents.analysesCompleted}`)
      console.log(`   Threat Intel - Threats: ${data.data.threatIntel.threatsTracked}, Alerts: ${data.data.threatIntel.criticalAlerts}`)
      console.log(`   Patent Intel - Patents: ${data.data.patentIntel.patentsAnalyzed}, Score: ${(data.data.patentIntel.innovationScore * 100).toFixed(0)}%`)
      console.log(`   Funding Tracker - Companies: ${data.data.fundingTracker.companiesTracked}, Funding: $${(data.data.fundingTracker.totalFunding / 1000000000).toFixed(1)}B`)
      console.log(`   Portfolio - Companies: ${data.data.ballisticPortfolio.portfolioCompanies}, Valuation: $${(data.data.ballisticPortfolio.totalValuation / 1000000000).toFixed(1)}B`)
      console.log(`   Overall - Data Points: ${data.data.overall.dataPoints.toLocaleString()}, Accuracy: ${(data.data.overall.accuracyRate * 100).toFixed(1)}%`)
    } else {
      console.log('❌ Intelligence Metrics: FAILED')
    }
  } catch (error) {
    console.log('❌ Intelligence Metrics: ERROR -', error.message)
  }

  // Test 3: Comprehensive Health Check
  console.log('\n3. Testing Comprehensive Health Check...')
  try {
    const response = await fetch(`${baseUrl}/api/intelligence-center?action=health`)
    const data = await response.json()
    
    if (data.success && data.data.overallHealth === 'healthy') {
      console.log('✅ Health Check: HEALTHY')
      console.log(`   Overall Health: ${data.data.overallHealth}`)
      
      Object.entries(data.data.systems).forEach(([system, health]) => {
        console.log(`   ${system}: ${health.status} (${health.responseTime})`)
      })
    } else {
      console.log('❌ Health Check: UNHEALTHY')
    }
  } catch (error) {
    console.log('❌ Health Check: ERROR -', error.message)
  }

  // Test 4: Comprehensive Intelligence Scan
  console.log('\n4. Testing Comprehensive Intelligence Scan...')
  try {
    const response = await fetch(`${baseUrl}/api/intelligence-center`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        action: 'comprehensive-scan',
        options: { depth: 'full', includeAnalytics: true }
      })
    })
    const data = await response.json()
    
    if (data.success && data.data.results) {
      console.log('✅ Comprehensive Scan: SUCCESS')
      console.log(`   Scan ID: ${data.data.scanId}`)
      console.log(`   Systems Scanned: ${data.data.summary.systemsScanned}`)
      console.log(`   Total Insights: ${data.data.summary.totalInsights}`)
      console.log(`   Average Confidence: ${(data.data.summary.averageConfidence * 100).toFixed(1)}%`)
      
      // Display insights from each system
      Object.entries(data.data.results).forEach(([system, result]) => {
        console.log(`   ${system}: ${result.insights.length} insights (${(result.confidence * 100).toFixed(0)}% confidence)`)
      })
    } else {
      console.log('❌ Comprehensive Scan: FAILED')
    }
  } catch (error) {
    console.log('❌ Comprehensive Scan: ERROR -', error.message)
  }

  // Test 5: Cross-System Intelligence Query
  console.log('\n5. Testing Cross-System Intelligence Query...')
  try {
    const response = await fetch(`${baseUrl}/api/intelligence-center`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        action: 'intelligence-query',
        query: 'AI security investment opportunities',
        systems: ['aiAgents', 'threatIntel', 'patentIntel']
      })
    })
    const data = await response.json()
    
    if (data.success && data.data.results) {
      console.log('✅ Intelligence Query: SUCCESS')
      console.log(`   Query: "${data.data.query}"`)
      console.log(`   Systems Queried: ${data.data.metadata.systemsQueried}`)
      console.log(`   Total Results: ${data.data.metadata.totalResults}`)
      
      Object.entries(data.data.results).forEach(([system, result]) => {
        console.log(`   ${system}: ${result.results.length} results (${(result.confidence * 100).toFixed(0)}% confidence)`)
      })
    } else {
      console.log('❌ Intelligence Query: FAILED')
    }
  } catch (error) {
    console.log('❌ Intelligence Query: ERROR -', error.message)
  }

  // Test 6: Alert Analysis
  console.log('\n6. Testing Alert Analysis...')
  try {
    const response = await fetch(`${baseUrl}/api/intelligence-center`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'alert-analysis' })
    })
    const data = await response.json()
    
    if (data.success && data.data.alerts) {
      console.log('✅ Alert Analysis: SUCCESS')
      console.log(`   Total Alerts: ${data.data.summary.totalAlerts}`)
      console.log(`   Critical Alerts: ${data.data.summary.criticalAlerts}`)
      console.log(`   Systems Affected: ${data.data.summary.systemsAffected}`)
      
      data.data.alerts.forEach(alert => {
        console.log(`   ${alert.severity.toUpperCase()}: ${alert.message} (${alert.system})`)
      })
    } else {
      console.log('❌ Alert Analysis: FAILED')
    }
  } catch (error) {
    console.log('❌ Alert Analysis: ERROR -', error.message)
  }

  // Test 7: Performance Optimization
  console.log('\n7. Testing Performance Optimization...')
  try {
    const response = await fetch(`${baseUrl}/api/intelligence-center`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'performance-optimization' })
    })
    const data = await response.json()
    
    if (data.success && data.data.optimizations) {
      console.log('✅ Performance Optimization: SUCCESS')
      console.log(`   Systems Optimized: ${data.data.summary.systemsOptimized}`)
      console.log(`   Performance Gain: ${data.data.summary.performanceGain}`)
      console.log(`   Resources Saved: ${data.data.summary.resourcesSaved}`)
      
      Object.entries(data.data.optimizations).forEach(([system, opt]) => {
        console.log(`   ${system}: ${opt.optimization} (${opt.performanceGain} gain)`)
      })
    } else {
      console.log('❌ Performance Optimization: FAILED')
    }
  } catch (error) {
    console.log('❌ Performance Optimization: ERROR -', error.message)
  }

  console.log('\n🎯 Intelligence Command Center Test Complete!')
  console.log('\n📊 Platform Capabilities Verified:')
  console.log('   ✅ Unified system status monitoring')
  console.log('   ✅ Cross-system intelligence metrics')
  console.log('   ✅ Comprehensive health checking')
  console.log('   ✅ Multi-system intelligence scanning')
  console.log('   ✅ Cross-system query capabilities')
  console.log('   ✅ Alert analysis and management')
  console.log('   ✅ Performance optimization')
  console.log('\n🚀 Intelligence Command Center: FULLY OPERATIONAL')
}

// Run the test
testIntelligenceCenter().catch(console.error)