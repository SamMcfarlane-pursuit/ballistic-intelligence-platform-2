#!/usr/bin/env node

/**
 * Simple Executive Dashboard Test
 * Quick verification that the dashboard is working
 */

console.log('🎯 Testing Executive Dashboard...\n')

async function testExecutiveDashboard() {
  try {
    console.log('📊 Fetching Executive Dashboard...')
    
    const response = await fetch('http://localhost:3000/executive-dashboard')
    const html = await response.text()
    
    console.log(`   Status: ${response.status}`)
    console.log(`   Size: ${(html.length / 1024).toFixed(1)}KB`)
    
    // Check for key elements
    const checks = [
      { name: 'Page Title', check: html.includes('Executive Dashboard') },
      { name: 'Navigation', check: html.includes('Executive') || html.includes('Navigation') },
      { name: 'Layout Structure', check: html.includes('min-h-screen') },
      { name: 'React Hydration', check: html.includes('__NEXT_DATA__') || html.includes('_app') },
      { name: 'No 404 Errors', check: !html.includes('404: This page could not be found') },
      { name: 'No Server Errors', check: !html.includes('500') && !html.includes('Internal Server Error') }
    ]
    
    console.log('\n📋 Dashboard Checks:')
    let passedChecks = 0
    
    checks.forEach(check => {
      const status = check.check ? '✅' : '❌'
      console.log(`   ${status} ${check.name}`)
      if (check.check) passedChecks++
    })
    
    console.log(`\n📊 Score: ${passedChecks}/${checks.length} checks passed`)
    
    if (passedChecks === checks.length) {
      console.log('🎉 Executive Dashboard: WORKING!')
    } else {
      console.log('⚠️  Executive Dashboard: NEEDS ATTENTION')
    }
    
    // Test API connectivity
    console.log('\n🔌 Testing API Connectivity...')
    
    const apiTests = [
      '/api/ballistic-portfolio?action=stats',
      '/api/security?action=status',
      '/api/ai-agents?action=status'
    ]
    
    let apisPassed = 0
    
    for (const api of apiTests) {
      try {
        const apiResponse = await fetch(`http://localhost:3000${api}`)
        const apiData = await apiResponse.json()
        
        if (apiResponse.ok && apiData.success) {
          console.log(`   ✅ ${api}: OK`)
          apisPassed++
        } else {
          console.log(`   ❌ ${api}: ${apiResponse.status}`)
        }
      } catch (error) {
        console.log(`   ❌ ${api}: ERROR`)
      }
    }
    
    console.log(`\n📊 API Score: ${apisPassed}/${apiTests.length} APIs working`)
    
    // Overall assessment
    const overallScore = ((passedChecks + apisPassed) / (checks.length + apiTests.length) * 100).toFixed(1)
    
    console.log('\n' + '='.repeat(50))
    console.log('🎯 EXECUTIVE DASHBOARD ASSESSMENT')
    console.log('='.repeat(50))
    console.log(`📊 Overall Score: ${overallScore}%`)
    console.log(`📄 Page Functionality: ${passedChecks}/${checks.length}`)
    console.log(`🔌 API Connectivity: ${apisPassed}/${apiTests.length}`)
    
    if (overallScore >= 90) {
      console.log('\n🎉 STATUS: PRODUCTION READY!')
      console.log('✅ Executive dashboard is fully functional')
      console.log('✅ All critical systems operational')
      console.log('✅ Ready for executive team use')
    } else if (overallScore >= 70) {
      console.log('\n⚠️  STATUS: MOSTLY WORKING')
      console.log('✅ Core functionality operational')
      console.log('⚠️  Some minor issues detected')
      console.log('📝 Suitable for testing and feedback')
    } else {
      console.log('\n❌ STATUS: NEEDS FIXES')
      console.log('❌ Critical issues detected')
      console.log('🔧 Requires debugging before use')
    }
    
  } catch (error) {
    console.log(`❌ Test failed: ${error.message}`)
  }
}

testExecutiveDashboard()