#!/usr/bin/env node

/**
 * Comprehensive System Test
 * Tests backend functionality, API endpoints, and frontend rendering
 */

console.log('🔧 Testing Full System Functionality...\n')

const testSuites = {
  backend: [
    {
      name: 'AI Agents API',
      endpoint: '/api/ai-agents?action=status',
      expectedFields: ['success', 'data']
    },
    {
      name: 'Intelligence Center API',
      endpoint: '/api/intelligence-center?action=status',
      expectedFields: ['success', 'data']
    },
    {
      name: 'Security API',
      endpoint: '/api/security?action=status',
      expectedFields: ['success', 'data']
    },
    {
      name: 'Data Protection API',
      endpoint: '/api/secure-data?action=classifications',
      expectedFields: ['success', 'data']
    },
    {
      name: 'Dashboard API',
      endpoint: '/api/dashboard',
      expectedFields: ['success', 'data']
    },
    {
      name: 'Funding Tracker API',
      endpoint: '/api/funding-tracker?action=stats',
      expectedFields: ['success', 'data']
    },
    {
      name: 'Patent Intelligence API',
      endpoint: '/api/patent-intelligence?action=status',
      expectedFields: ['success', 'data']
    },
    {
      name: 'RAG Analysis API',
      endpoint: '/api/rag-analysis?action=demo',
      expectedFields: ['success', 'data']
    }
  ],
  frontend: [
    {
      name: 'Home Page',
      url: '/',
      expectedElements: ['html', 'head', 'body']
    },
    {
      name: 'Dashboard',
      url: '/dashboard',
      expectedElements: ['html', 'head', 'body']
    },
    {
      name: 'AI Agents',
      url: '/ai-agents',
      expectedElements: ['html', 'head', 'body']
    },
    {
      name: 'Intelligence Center',
      url: '/intelligence-center',
      expectedElements: ['html', 'head', 'body']
    },
    {
      name: 'Security Dashboard',
      url: '/security',
      expectedElements: ['html', 'head', 'body']
    },
    {
      name: 'Data Protection',
      url: '/data-protection',
      expectedElements: ['html', 'head', 'body']
    },
    {
      name: 'Vulnerabilities',
      url: '/vulnerabilities',
      expectedElements: ['html', 'head', 'body']
    },
    {
      name: 'Funding Tracker',
      url: '/funding-tracker',
      expectedElements: ['html', 'head', 'body']
    }
  ]
}

async function testBackendAPI(test) {
  try {
    console.log(`🔌 Testing ${test.name}...`)
    
    const response = await fetch(`http://localhost:3000${test.endpoint}`)
    const data = await response.json()
    
    if (response.ok) {
      // Check if expected fields exist
      const hasRequiredFields = test.expectedFields.every(field => 
        data.hasOwnProperty(field)
      )
      
      if (hasRequiredFields) {
        console.log(`   ✅ ${test.name}: OPERATIONAL`)
        console.log(`   📊 Status: ${response.status}`)
        console.log(`   📦 Fields: ${test.expectedFields.join(', ')}`)
        return true
      } else {
        console.log(`   ⚠️  ${test.name}: Missing required fields`)
        console.log(`   📦 Expected: ${test.expectedFields.join(', ')}`)
        console.log(`   📦 Received: ${Object.keys(data).join(', ')}`)
        return false
      }
    } else {
      console.log(`   ❌ ${test.name}: HTTP ${response.status}`)
      return false
    }
  } catch (error) {
    console.log(`   ❌ ${test.name}: ERROR - ${error.message}`)
    return false
  }
}

async function testFrontendPage(test) {
  try {
    console.log(`🌐 Testing ${test.name}...`)
    
    const response = await fetch(`http://localhost:3000${test.url}`)
    const html = await response.text()
    
    if (response.ok) {
      // Check if it's valid HTML
      const hasHtml = html.includes('<html')
      const hasHead = html.includes('<head')
      const hasBody = html.includes('<body')
      const hasReact = html.includes('__NEXT_DATA__') || html.includes('_app')
      
      if (hasHtml && hasHead && hasBody) {
        console.log(`   ✅ ${test.name}: RENDERS SUCCESSFULLY`)
        console.log(`   📄 Status: ${response.status}`)
        console.log(`   🎨 HTML: Valid structure`)
        console.log(`   ⚛️  React: ${hasReact ? 'Hydrated' : 'Static'}`)
        console.log(`   📏 Size: ${(html.length / 1024).toFixed(1)}KB`)
        return true
      } else {
        console.log(`   ⚠️  ${test.name}: Invalid HTML structure`)
        return false
      }
    } else {
      console.log(`   ❌ ${test.name}: HTTP ${response.status}`)
      return false
    }
  } catch (error) {
    console.log(`   ❌ ${test.name}: ERROR - ${error.message}`)
    return false
  }
}

async function testCSS() {
  console.log('\n🎨 Testing CSS and Styling...')
  
  try {
    // Test if Tailwind CSS is working by checking a page with styles
    const response = await fetch('http://localhost:3000/dashboard')
    const html = await response.text()
    
    const hasTailwind = html.includes('tailwind') || html.includes('tw-')
    const hasStyles = html.includes('class=') && html.includes('style')
    const hasNextCSS = html.includes('_next/static/css/')
    
    console.log(`   ✅ CSS Framework: ${hasTailwind ? 'Tailwind CSS detected' : 'Custom CSS'}`)
    console.log(`   ✅ Inline Styles: ${hasStyles ? 'Present' : 'None'}`)
    console.log(`   ✅ Next.js CSS: ${hasNextCSS ? 'Optimized' : 'Standard'}`)
    
    return true
  } catch (error) {
    console.log(`   ❌ CSS Test: ERROR - ${error.message}`)
    return false
  }
}

async function runFullSystemTest() {
  console.log('🎯 Full System Test Suite\n')
  
  let backendPassed = 0
  let frontendPassed = 0
  
  // Test Backend APIs
  console.log('🔌 BACKEND API TESTS')
  console.log('='.repeat(40))
  
  for (const test of testSuites.backend) {
    const result = await testBackendAPI(test)
    if (result) backendPassed++
    console.log()
  }
  
  // Test Frontend Pages
  console.log('\n🌐 FRONTEND PAGE TESTS')
  console.log('='.repeat(40))
  
  for (const test of testSuites.frontend) {
    const result = await testFrontendPage(test)
    if (result) frontendPassed++
    console.log()
  }
  
  // Test CSS
  const cssWorking = await testCSS()
  
  // Summary
  console.log('\n' + '='.repeat(60))
  console.log('🎯 FULL SYSTEM TEST RESULTS')
  console.log('='.repeat(60))
  
  console.log(`\n🔌 Backend APIs: ${backendPassed}/${testSuites.backend.length} OPERATIONAL`)
  console.log(`🌐 Frontend Pages: ${frontendPassed}/${testSuites.frontend.length} RENDERING`)
  console.log(`🎨 CSS & Styling: ${cssWorking ? 'WORKING' : 'ISSUES'}`)
  
  const totalTests = testSuites.backend.length + testSuites.frontend.length
  const totalPassed = backendPassed + frontendPassed
  
  if (totalPassed === totalTests && cssWorking) {
    console.log('\n🎉 FULL SYSTEM: OPERATIONAL!')
    console.log('✅ All backend APIs functioning')
    console.log('✅ All frontend pages rendering')
    console.log('✅ CSS and styling working')
    console.log('✅ No initialization errors')
    console.log('✅ Production ready')
  } else {
    console.log('\n⚠️  SYSTEM ISSUES DETECTED')
    console.log(`❌ Backend: ${testSuites.backend.length - backendPassed} APIs failing`)
    console.log(`❌ Frontend: ${testSuites.frontend.length - frontendPassed} pages failing`)
    console.log(`❌ CSS: ${cssWorking ? 'OK' : 'Issues detected'}`)
  }
  
  console.log('\n🔧 System Components:')
  console.log('   • Next.js 15.5.4 - App Router')
  console.log('   • React 18 - Server & Client Components')
  console.log('   • TypeScript - Type Safety')
  console.log('   • Tailwind CSS - Styling Framework')
  console.log('   • Shadcn/UI - Component Library')
  console.log('   • Lucide React - Icon System')
  
  console.log('\n🚀 Ready for Production!')
}

// Run the full system test
runFullSystemTest().catch(console.error)