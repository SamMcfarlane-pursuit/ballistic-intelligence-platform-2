/**
 * BrightData Integration Test Script
 * 
 * This script demonstrates the capabilities of the BrightData integration
 * with the Ballistic Intelligence Platform.
 */

async function testBrightData() {
  console.log('🚀 Testing BrightData Integration...\n');
  
  // Test 1: Health Check
  console.log('1. Testing Health Check...');
  try {
    const healthResponse = await fetch('http://localhost:4000/api/brightdata?action=health');
    const healthData = await healthResponse.json();
    console.log(`   Status: ${healthData.status}`);
    console.log(`   Message: ${healthData.message}`);
    console.log(`   Success Rate: ${((healthData.metrics.successfulRequests / healthData.metrics.totalRequests) * 100).toFixed(1)}%`);
  } catch (error) {
    console.error('   ❌ Health check failed:', error.message);
  }
  
  // Test 2: Proxy Request
  console.log('\n2. Testing Proxy Request...');
  try {
    const proxyResponse = await fetch('http://localhost:4000/api/brightdata?action=proxy&url=https://httpbin.org/get');
    const proxyData = await proxyResponse.json();
    console.log(`   Status Code: ${proxyData.statusCode}`);
    console.log(`   Response Time: ${proxyData.responseTime}ms`);
    console.log(`   Proxy Used: ${proxyData.proxyUsed}`);
    console.log(`   Success: ${proxyData.success ? '✅' : '❌'}`);
  } catch (error) {
    console.error('   ❌ Proxy request failed:', error.message);
  }
  
  // Test 3: Web Unlocker
  console.log('\n3. Testing Web Unlocker...');
  try {
    const unlockerResponse = await fetch('http://localhost:4000/api/brightdata?action=unlocker&url=https://example.com&renderJs=true');
    const unlockerData = await unlockerResponse.json();
    console.log(`   Status Code: ${unlockerData.statusCode}`);
    console.log(`   Load Time: ${unlockerData.loadTime}ms`);
    console.log(`   Blocked: ${unlockerData.blocked ? '❌' : '✅'}`);
    console.log(`   CAPTCHA Solved: ${unlockerData.captchaSolved ? '✅' : '❌'}`);
    console.log(`   Success: ${unlockerData.success ? '✅' : '❌'}`);
  } catch (error) {
    console.error('   ❌ Web unlocker test failed:', error.message);
  }
  
  // Test 4: Dataset Collection
  console.log('\n4. Testing Dataset Collection...');
  try {
    const datasetResponse = await fetch('http://localhost:4000/api/brightdata?action=dataset&type=crunchbase&query=cybersecurity&limit=5');
    const datasetData = await datasetResponse.json();
    console.log(`   Records Found: ${datasetData.totalRecords}`);
    console.log(`   Pages Scraped: ${datasetData.pagesScraped}`);
    console.log(`   Execution Time: ${datasetData.executionTime}ms`);
    console.log(`   Data Quality: ${Math.round(datasetData.dataQuality.completeness * 100)}%`);
    console.log(`   Success: ${datasetData.success ? '✅' : '❌'}`);
  } catch (error) {
    console.error('   ❌ Dataset collection failed:', error.message);
  }
  
  // Test 5: Company Enrichment
  console.log('\n5. Testing Company Enrichment...');
  try {
    const enrichResponse = await fetch('http://localhost:4000/api/brightdata?action=enrich&company=SecureAI&sources=crunchbase,linkedin,news');
    const enrichData = await enrichResponse.json();
    console.log(`   Company: SecureAI`);
    console.log(`   Enrichment Success: ${enrichData.success ? '✅' : '❌'}`);
    if (enrichData.success && enrichData.data) {
      console.log(`   Basic Info: ${enrichData.data.basic.name}`);
      console.log(`   Industry: ${enrichData.data.basic.industry}`);
      console.log(`   Employees: ${enrichData.data.basic.employeeCount}`);
    }
  } catch (error) {
    console.error('   ❌ Company enrichment failed:', error.message);
  }
  
  // Test 6: Metrics
  console.log('\n6. Testing Metrics Collection...');
  try {
    const metricsResponse = await fetch('http://localhost:4000/api/brightdata?action=metrics');
    const metricsData = await metricsResponse.json();
    console.log(`   Total Requests: ${metricsData.data.totalRequests}`);
    console.log(`   Successful Requests: ${metricsData.data.successfulRequests}`);
    console.log(`   Failed Requests: ${metricsData.data.failedRequests}`);
    console.log(`   Average Response Time: ${Math.round(metricsData.data.averageResponseTime)}ms`);
    console.log(`   Top Endpoint: ${metricsData.data.topEndpoints[0]?.url || 'None'}`);
  } catch (error) {
    console.error('   ❌ Metrics collection failed:', error.message);
  }
  
  console.log('\n🎉 BrightData Integration Tests Complete!');
  console.log('\n📊 Next Steps:');
  console.log('   1. Visit http://localhost:4000/executive-dashboard');
  console.log('   2. Click on the "Data Intelligence" tab');
  console.log('   3. View real-time metrics and monitoring');
  console.log('   4. Start using BrightData-powered features!');
}

// Run the tests
testBrightData().catch(console.error);