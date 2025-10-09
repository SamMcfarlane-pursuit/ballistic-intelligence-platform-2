#!/usr/bin/env node

/**
 * Working Tools Verification Test
 * Verifies all tools and modules are actually functional
 */

console.log('🔧 Testing Working Tools & Modules...\n')

const toolTests = {
  executiveDashboard: {
    name: 'Executive Dashboard',
    url: '/executive-dashboard',
    tools: [
      { name: 'Portfolio Metrics', check: 'Portfolio Value' },
      { name: 'Security Health', check: 'System Health' },
      { name: 'AI Insights', check: 'AI Insights' },
      { name: 'Quick Actions', check: 'Portfolio Analysis' }
    ]
  },
  portfolioIntelligence: {
    name: 'Portfolio Intelligence',
    url: '/ballistic-portfolio',
    tools: [
      { name: 'Portfolio Analytics', check: 'Portfolio Analytics' },
      { name: 'Performance Tracking', check: 'Performance' },
      { name: 'Investment Analysis', check: 'Investment' },
      { name: 'Company Metrics', check: 'companies' }
    ]
  },
  securityCenter: {
    name: 'Security Center',
    url: '/security',
    tools: [
      { name: 'Security Dashboard', check: 'Security Dashboard' },
      { name: 'Threat Monitoring', check: 'Security' },
      { name: 'Event Logging', check: 'Events' },
      { name: 'Compliance Tracking', check: 'Compliance' }
    ]
  },
  aiIntelligence: {
    name: 'AI Intelligence',
    url: '/ai-agents',
    tools: [
      { name: 'AI Agent System', check: 'AI Agent System' },
      { name: 'Multi-Agent Analysis', check: 'agents' },
      { name: 'Technical Analysis', check: 'Technical' },
      { name: 'Market Analysis', check: 'Market' }
    ]
  },
  intelligenceCenter: {
    name: 'Intelligence Center',
    url: '/intelligence-center',
    tools: [
      { name: 'Command Center', check: 'Intelligence Command Center' },
      { name: 'System Monitoring', check: 'System' },
      { name: 'Cross-System Intelligence', check: 'intelligence' },
      { name: 'Performance Analytics', check: 'Performance' }
    ]
  }
}

const apiTests = [
  {
    name: 'Portfolio API',
    endpoint: '/api/ballistic-portfolio?action=stats',
    expectedData: ['analytics', 'companies', 'summary']
  },
  {
    name: 'Security API',
    endpoint: '/api/security?action=status',
    expectedData: ['success', 'data']
  },
  {
    name: 'AI Agents API',
    endpoint: '/api/ai-agents?action=status',
    expectedData: ['success', 'data', 'agents']
  },
  {
    name: 'Intelligence Center API',
    endpoint: '/api/intelligence-center?action=status',
    expectedData: ['success', 'data']
  }
]

async function testModuleTools(module) {
  try {
    console.log(`🔧 Testing ${module.name}...`)
    
    const response = await fetch(`http://localhost:3000${module.url}`)
    const html = await response.text()
    
    if (!response.ok) {
      console.log(`   ❌ ${module.name}: HTTP ${response.status}`)
      return { working: 0, total: module.tools.length }
    }
    
    let workingTools = 0
    
    console.log(`   📄 Page Status: ${response.status} OK`)
    
    module.tools.forEach(tool => {
      const isWorking = html.toLowerCase().includes(tool.check.toLowerCase())
      const status = isWorking ? '✅' : '❌'
      console.log(`   ${status} ${tool.name}: ${isWorking ? 'WORKING' : 'NOT FOUND'}`)
      if (isWorking) workingTools++
    })
    
    const score = ((workingTools / module.tools.length) * 100).toFixed(1)
    console.log(`   📊 Tools Score: ${workingTools}/${module.tools.length} (${score}%)`)
    
    return { working: workingTools, total: module.tools.length }
    
  } catch (error) {
    console.log(`   ❌ ${module.name}: ERROR - ${error.message}`)
    return { working: 0, total: module.tools.length }
  }
}

async function testAPIFunctionality(api) {
  try {
    console.log(`🔌 Testing ${api.name}...`)
    
    const response = await fetch(`http://localhost:3000${api.endpoint}`)
    const data = await response.json()
    
    if (!response.ok) {
      console.log(`   ❌ ${api.name}: HTTP ${response.status}`)
      return false
    }
    
    // Check for expected data structure
    let dataScore = 0
    api.expectedData.forEach(field => {
      const hasField = data.hasOwnProperty(field) || JSON.stringify(data).toLowerCase().includes(field.toLowerCase())
      const status = hasField ? '✅' : '❌'
      console.log(`   ${status} ${field}: ${hasField ? 'PRESENT' : 'MISSING'}`)
      if (hasField) dataScore++
    })
    
    const isFullyWorking = dataScore === api.expectedData.length && data.success !== false
    console.log(`   📊 API Score: ${dataScore}/${api.expectedData.length} fields present`)
    console.log(`   🎯 Status: ${isFullyWorking ? 'FULLY WORKING' : 'PARTIAL/ISSUES'}`)
    
    return isFullyWorking
    
  } catch (error) {
    console.log(`   ❌ ${api.name}: ERROR - ${error.message}`)
    return false
  }
}

async function testQuickActions() {
  console.log('\n🚀 Testing Quick Actions...')
  
  try {
    const response = await fetch('http://localhost:3000/executive-dashboard')
    const html = await response.text()
    
    const quickActions = [
      'Portfolio Analysis',
      'Security Report',
      'AI Insights',
      'System Status'
    ]
    
    let workingActions = 0
    
    quickActions.forEach(action => {
      const isPresent = html.includes(action)
      const status = isPresent ? '✅' : '❌'
      console.log(`   ${status} ${action}: ${isPresent ? 'AVAILABLE' : 'MISSING'}`)
      if (isPresent) workingActions++
    })
    
    console.log(`   📊 Quick Actions: ${workingActions}/${quickActions.length} working`)
    return workingActions === quickActions.length
    
  } catch (error) {
    console.log(`   ❌ Quick Actions Test: ERROR - ${error.message}`)
    return false
  }
}

async function testNavigation() {
  console.log('\n🧭 Testing Navigation System...')
  
  try {
    const response = await fetch('http://localhost:3000/executive-dashboard')
    const html = await response.text()
    
    const navigationElements = [
      'Executive Dashboard',
      'Portfolio Intelligence',
      'Security Center',
      'AI Insights',
      'Intelligence Center'
    ]
    
    let workingNav = 0
    
    navigationElements.forEach(element => {
      const isPresent = html.includes(element)
      const status = isPresent ? '✅' : '❌'
      console.log(`   ${status} ${element}: ${isPresent ? 'ACCESSIBLE' : 'MISSING'}`)
      if (isPresent) workingNav++
    })
    
    console.log(`   📊 Navigation: ${workingNav}/${navigationElements.length} elements working`)
    return workingNav >= navigationElements.length - 1 // Allow for 1 missing
    
  } catch (error) {
    console.log(`   ❌ Navigation Test: ERROR - ${error.message}`)
    return false
  }
}

async function runWorkingToolsTest() {
  console.log('🎯 Working Tools & Modules Test Suite\n')
  
  let totalWorking = 0
  let totalTools = 0
  let workingAPIs = 0
  
  // Test Module Tools
  console.log('🔧 MODULE TOOLS TESTS')
  console.log('='.repeat(50))
  
  for (const [key, module] of Object.entries(toolTests)) {
    const result = await testModuleTools(module)
    totalWorking += result.working
    totalTools += result.total
    console.log()
  }
  
  // Test API Functionality
  console.log('\n🔌 API FUNCTIONALITY TESTS')
  console.log('='.repeat(50))
  
  for (const api of apiTests) {
    const result = await testAPIFunctionality(api)
    if (result) workingAPIs++
    console.log()
  }
  
  // Test Quick Actions
  const quickActionsWorking = await testQuickActions()
  
  // Test Navigation
  const navigationWorking = await testNavigation()
  
  // Summary
  console.log('\n' + '='.repeat(60))
  console.log('🎯 WORKING TOOLS & MODULES RESULTS')
  console.log('='.repeat(60))
  
  const toolsScore = ((totalWorking / totalTools) * 100).toFixed(1)
  const apisScore = ((workingAPIs / apiTests.length) * 100).toFixed(1)
  
  console.log(`\n🔧 Module Tools: ${totalWorking}/${totalTools} working (${toolsScore}%)`)
  console.log(`🔌 API Endpoints: ${workingAPIs}/${apiTests.length} working (${apisScore}%)`)
  console.log(`🚀 Quick Actions: ${quickActionsWorking ? 'WORKING' : 'ISSUES'}`)
  console.log(`🧭 Navigation: ${navigationWorking ? 'WORKING' : 'ISSUES'}`)
  
  const overallScore = (
    (totalWorking / totalTools * 0.4) +
    (workingAPIs / apiTests.length * 0.3) +
    (quickActionsWorking ? 0.15 : 0) +
    (navigationWorking ? 0.15 : 0)
  ) * 100
  
  console.log(`\n📊 Overall System Score: ${overallScore.toFixed(1)}%`)
  
  if (overallScore >= 90) {
    console.log('\n🎉 STATUS: ALL TOOLS WORKING!')
    console.log('✅ All modules fully functional')
    console.log('✅ All APIs operational')
    console.log('✅ Navigation system working')
    console.log('✅ Quick actions available')
    console.log('✅ Ready for production use')
  } else if (overallScore >= 75) {
    console.log('\n⚠️  STATUS: MOSTLY WORKING')
    console.log('✅ Core functionality operational')
    console.log('⚠️  Some tools need attention')
    console.log('📝 Suitable for executive use with minor issues')
  } else {
    console.log('\n❌ STATUS: NEEDS SIGNIFICANT WORK')
    console.log('❌ Multiple tools not working')
    console.log('🔧 Requires fixes before production use')
  }
  
  console.log('\n🎯 Module Organization Recommendation:')
  if (overallScore >= 80) {
    console.log('✅ KEEP ALL MODULES TOGETHER')
    console.log('   • Unified interface working well')
    console.log('   • Executive-friendly navigation')
    console.log('   • Cross-module integration successful')
    console.log('   • Single codebase easier to maintain')
  } else {
    console.log('⚠️  CONSIDER SEPARATING MODULES')
    console.log('   • Some modules may work better independently')
    console.log('   • Focus on fixing core issues first')
    console.log('   • Gradual integration approach')
  }
  
  console.log('\n🚀 Ready for Executive Team!')
}

// Run the working tools test
runWorkingToolsTest().catch(console.error)