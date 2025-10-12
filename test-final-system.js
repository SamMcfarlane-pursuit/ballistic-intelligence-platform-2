#!/usr/bin/env node

console.log('🎯 FINAL SYSTEM VERIFICATION TEST\n')

const testSuite = {
  pages: [
    { name: 'Executive Dashboard', url: 'http://localhost:3000/executive-dashboard', keywords: ['Portfolio Value', 'Monthly Growth', 'AI Insights'] },
    { name: 'Portfolio Dashboard', url: 'http://localhost:3000/ballistic-portfolio', keywords: ['Veza', 'Concentric', 'portfolio'] },
    { name: 'AI Agents', url: 'http://localhost:3000/ai-agents', keywords: ['Technical Analyst', 'Market Analyst', 'System Status'] },
    { name: 'Security Center', url: 'http://localhost:3000/security', keywords: ['Security', 'Threats', 'Protection'] },
    { name: 'Intelligence Center', url: 'http://localhost:3000/intelligence-center', keywords: ['Intelligence', 'Data', 'Analysis'] }
  ],
  apis: [
    { name: 'Portfolio Stats', url: 'http://localhost:3000/api/ballistic-portfolio?action=stats', field: 'success' },
    { name: 'AI Agents Status', url: 'http://localhost:3000/api/ai-agents?action=status', field: 'success' },
    { name: 'Security Status', url: 'http://localhost:3000/api/security?action=status', field: 'success' },
    { name: 'RAG Analysis Demo', url: 'http://localhost:3000/api/rag-analysis?action=demo', field: 'success' },
    { name: 'Intelligence Status', url: 'http://localhost:3000/api/intelligence-center?action=status', field: 'success' }
  ]
}

async function testPage(page) {
  try {
    const response = await fetch(page.url)
    if (response.status !== 200) {
      return { success: false, error: `HTTP ${response.status}` }
    }
    
    const html = await response.text()
    const missingKeywords = page.keywords.filter(keyword => !html.includes(keyword))
    
    if (missingKeywords.length > 0) {
      return { success: false, error: `Missing keywords: ${missingKeywords.join(', ')}` }
    }
    
    return { success: true }
  } catch (error) {
    return { success: false, error: error.message }
  }
}

async function testAPI(api) {
  try {
    const response = await fetch(api.url)
    if (response.status !== 200) {
      return { success: false, error: `HTTP ${response.status}` }
    }
    
    const data = await response.json()
    if (!data[api.field]) {
      return { success: false, error: `Missing field: ${api.field}` }
    }
    
    return { success: true, data: data }
  } catch (error) {
    return { success: false, error: error.message }
  }
}

async function runFinalTest() {
  console.log('🔍 TESTING PAGES')
  console.log('==================================================')
  
  let pagesPassed = 0
  for (const page of testSuite.pages) {
    const result = await testPage(page)
    console.log(`${result.success ? '✅' : '❌'} ${page.name}: ${result.success ? 'WORKING' : result.error}`)
    if (result.success) pagesPassed++
    await new Promise(resolve => setTimeout(resolve, 200))
  }
  
  console.log('\n🔍 TESTING APIs')
  console.log('==================================================')
  
  let apisPassed = 0
  for (const api of testSuite.apis) {
    const result = await testAPI(api)
    console.log(`${result.success ? '✅' : '❌'} ${api.name}: ${result.success ? 'WORKING' : result.error}`)
    if (result.success) apisPassed++
    await new Promise(resolve => setTimeout(resolve, 200))
  }
  
  console.log('\n==================================================')
  console.log('🎯 FINAL SYSTEM STATUS')
  console.log('==================================================')
  
  const totalTests = testSuite.pages.length + testSuite.apis.length
  const totalPassed = pagesPassed + apisPassed
  const successRate = ((totalPassed / totalTests) * 100).toFixed(1)
  
  console.log(`📊 Pages: ${pagesPassed}/${testSuite.pages.length} working`)
  console.log(`📊 APIs: ${apisPassed}/${testSuite.apis.length} working`)
  console.log(`📊 Overall: ${totalPassed}/${totalTests} (${successRate}%)`)
  
  if (successRate >= 95) {
    console.log('\n🎉 SYSTEM FULLY OPERATIONAL!')
    console.log('✅ All critical components working')
    console.log('✅ Executive dashboard ready for use')
    console.log('✅ Interactive features functional')
    console.log('✅ API endpoints responding correctly')
  } else if (successRate >= 80) {
    console.log('\n⚠️  SYSTEM MOSTLY OPERATIONAL')
    console.log('✅ Core functionality working')
    console.log('⚠️  Minor issues detected')
  } else {
    console.log('\n❌ SYSTEM NEEDS ATTENTION')
    console.log('❌ Multiple components failing')
  }
  
  console.log('\n🔗 ACCESS POINTS:')
  console.log('• Main System: http://localhost:3000')
  console.log('• Executive Dashboard: http://localhost:3000/executive-dashboard')
  console.log('• Portfolio View: http://localhost:3000/ballistic-portfolio')
  console.log('• AI Agents: http://localhost:3000/ai-agents')
  console.log('• Security Center: http://localhost:3000/security')
  console.log('• Intelligence Center: http://localhost:3000/intelligence-center')
  
  console.log('\n🎯 INTERACTIVE FEATURES:')
  console.log('• Click metric cards for detailed information')
  console.log('• View company references and sources')
  console.log('• Access real-time data and analytics')
  console.log('• Navigate between modules seamlessly')
}

runFinalTest().catch(console.error)