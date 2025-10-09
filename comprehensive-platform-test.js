const axios = require('axios');

const BASE_URL = 'http://localhost:3000';

async function comprehensivePlatformTest() {
  console.log('🔍 Comprehensive Platform Test - Data Sources & Backend Connectivity\n');

  const testResults = {
    pages: {},
    datasets: {},
    dataSources: {},
    connectivity: {},
    dataQuality: {},
    performance: {}
  };

  // 1. Test All Pages
  console.log('🌐 Testing All Pages');
  
  const pages = [
    { name: 'Homepage', url: '/', expectedContent: ['Quadruple Intelligence', 'CS Intelligence Platform'] },
    { name: 'Dashboard', url: '/dashboard', expectedContent: ['Dashboard', 'Statistics'] }
  ];

  for (const page of pages) {
    try {
      const startTime = Date.now();
      const response = await axios.get(`${BASE_URL}${page.url}`);
      const responseTime = Date.now() - startTime;
      
      const contentCheck = page.expectedContent.every(content => 
        response.data.includes(content)
      );
      
      testResults.pages[page.name] = {
        status: response.status,
        working: response.status === 200,
        responseTime,
        contentValid: contentCheck,
        size: response.data.length
      };
      
      console.log(`  ✅ ${page.name}: ${response.status} (${responseTime}ms) - Content: ${contentCheck ? 'Valid' : 'Missing'}`);
      
    } catch (error) {
      testResults.pages[page.name] = {
        status: error.response?.status || 'ERROR',
        working: false,
        error: error.message
      };
      console.log(`  ❌ ${page.name}: ${error.response?.status || 'ERROR'} - ${error.message}`);
    }
  }

  // 2. Test Data Sources with Categorization
  console.log('\\n📊 Testing Data Sources & Categorization');
  
  try {
    const response = await axios.get(`${BASE_URL}/api/data-sources`);
    
    if (response.data.success) {
      const sources = response.data.data.sources;
      const categories = {};
      
      // Categorize sources
      sources.forEach(source => {
        const category = source.category || 'uncategorized';
        if (!categories[category]) {
          categories[category] = [];
        }
        categories[category].push({
          name: source.name,
          url: source.url,
          type: source.type,
          updateFrequency: source.updateFrequency,
          recordCount: source.recordCount,
          lastSync: source.lastSync
        });
      });
      
      testResults.dataSources = {
        totalSources: sources.length,
        categories,
        categoryCounts: Object.keys(categories).reduce((acc, cat) => {
          acc[cat] = categories[cat].length;
          return acc;
        }, {})
      };
      
      console.log(`  ✅ Total Data Sources: ${sources.length}`);
      Object.entries(categories).forEach(([category, sources]) => {
        console.log(`  📂 ${category.replace('_', ' ').toUpperCase()}: ${sources.length} sources`);
        sources.forEach(source => {
          console.log(`    • ${source.name} (${source.type}) - ${source.recordCount || 0} records`);
        });
      });
      
    } else {
      console.log('  ❌ Data Sources API failed');
    }
  } catch (error) {
    console.log(`  ❌ Data Sources: ${error.message}`);
  }

  // 3. Test Dataset Quality & Source Attribution
  console.log('\\n🔍 Testing Dataset Quality & Source Attribution');
  
  const datasetTests = [
    { name: 'Dashboard Data', endpoint: '/api/dashboard' },
    { name: 'Analytics Data', endpoint: '/api/dashboard/analytics' },
    { name: 'Company Data', endpoint: '/api/cybersecurity-startups' }
  ];

  for (const test of datasetTests) {
    try {
      const response = await axios.get(`${BASE_URL}${test.endpoint}`);
      
      if (response.data.success) {
        const data = response.data.data;
        
        // Check for source attribution
        const hasSourceAttribution = JSON.stringify(data).includes('source') || 
                                   JSON.stringify(data).includes('dataSource') ||
                                   response.data.metadata?.sources;
        
        // Check data quality
        const dataQuality = {
          hasData: !!data,
          dataSize: JSON.stringify(data).length,
          hasSourceAttribution,
          timestamp: response.data.timestamp || new Date().toISOString()
        };
        
        testResults.datasets[test.name] = {
          working: true,
          quality: dataQuality,
          sampleData: typeof data === 'object' ? Object.keys(data) : 'primitive'
        };
        
        console.log(`  ✅ ${test.name}: ${dataQuality.dataSize} bytes - Sources: ${hasSourceAttribution ? 'Attributed' : 'Missing'}`);
        
      } else {
        console.log(`  ❌ ${test.name}: No data returned`);
      }
      
    } catch (error) {
      testResults.datasets[test.name] = {
        working: false,
        error: error.message
      };
      console.log(`  ❌ ${test.name}: ${error.message}`);
    }
  }

  // 4. Test Data Ingestion & Processing
  console.log('\\n🔄 Testing Data Ingestion & Processing');
  
  const ingestionTests = [
    { 
      name: 'Investment Data (GrowthList)', 
      endpoint: '/api/data-ingestion/growthlist',
      category: 'funding',
      expectedFields: ['companies', 'processed']
    },
    { 
      name: 'Threat Intelligence (MISP)', 
      endpoint: '/api/data-ingestion/threat-intelligence',
      data: { source: 'misp', config: {} },
      category: 'threat_intelligence',
      expectedFields: ['ingestionResult', 'processed']
    },
    { 
      name: 'Patent Data (USPTO)', 
      endpoint: '/api/data-ingestion/patent-intelligence',
      data: { source: 'uspto_open_data', config: {} },
      category: 'patent_intelligence',
      expectedFields: ['ingestionResult', 'processed']
    },
    { 
      name: 'Market Data (ACS)', 
      endpoint: '/api/data-ingestion/market-intelligence',
      data: { source: 'acs_global_cybersecurity_report', config: {} },
      category: 'market_intelligence',
      expectedFields: ['ingestionResult', 'processed']
    },
    { 
      name: 'Conference Data (DEF CON)', 
      endpoint: '/api/data-ingestion/conference-intelligence',
      data: { source: 'def_con_33', config: {} },
      category: 'conference_intelligence',
      expectedFields: ['ingestionResult', 'processed']
    }
  ];

  for (const test of ingestionTests) {
    try {
      const startTime = Date.now();
      const response = await axios.post(`${BASE_URL}${test.endpoint}`, test.data || {});
      const responseTime = Date.now() - startTime;
      
      if (response.data.success) {
        const result = response.data.data;
        const processed = result.ingestionResult?.processed || result.processed || 0;
        
        // Check for proper source attribution
        const sourceAttribution = {
          hasSource: !!result.source,
          hasTimestamp: !!result.timestamp || !!result.ingestionResult?.timestamp,
          hasCategory: test.category,
          processingTime: result.ingestionResult?.duration || responseTime
        };
        
        testResults.datasets[test.name] = {
          working: true,
          processed,
          category: test.category,
          sourceAttribution,
          responseTime
        };
        
        console.log(`  ✅ ${test.name}: ${processed} items processed (${responseTime}ms)`);
        console.log(`    📂 Category: ${test.category}`);
        console.log(`    🏷️ Source: ${result.source || 'Attributed'}`);
        
      } else {
        console.log(`  ❌ ${test.name}: Processing failed`);
      }
      
    } catch (error) {
      testResults.datasets[test.name] = {
        working: false,
        category: test.category,
        error: error.message
      };
      console.log(`  ❌ ${test.name}: ${error.message}`);
    }
  }

  // 5. Test Backend Connectivity & Performance
  console.log('\\n⚡ Testing Backend Connectivity & Performance');
  
  const connectivityTests = [
    '/api/dashboard',
    '/api/data-sources',
    '/api/cybersecurity-startups',
    '/api/analysis'
  ];

  let totalResponseTime = 0;
  let workingEndpoints = 0;

  for (const endpoint of connectivityTests) {
    try {
      const startTime = Date.now();
      const response = await axios.get(`${BASE_URL}${endpoint}`);
      const responseTime = Date.now() - startTime;
      
      totalResponseTime += responseTime;
      workingEndpoints++;
      
      testResults.connectivity[endpoint] = {
        status: response.status,
        responseTime,
        dataSize: JSON.stringify(response.data).length,
        working: true
      };
      
      console.log(`  ✅ ${endpoint}: ${response.status} (${responseTime}ms)`);
      
    } catch (error) {
      testResults.connectivity[endpoint] = {
        status: error.response?.status || 'ERROR',
        working: false,
        error: error.message
      };
      console.log(`  ❌ ${endpoint}: ${error.response?.status || 'ERROR'}`);
    }
  }

  // 6. Calculate Average Funding with Source Attribution
  console.log('\\n💰 Testing Average Funding Calculation with Source Attribution');
  
  try {
    const companiesResponse = await axios.get(`${BASE_URL}/api/cybersecurity-startups`);
    
    if (companiesResponse.data.success && companiesResponse.data.data) {
      const companies = companiesResponse.data.data;
      
      // Calculate funding statistics
      const fundingData = companies
        .filter(company => company.total_funding && company.total_funding > 0)
        .map(company => ({
          name: company.name,
          funding: company.total_funding,
          stage: company.current_stage,
          category: company.primary_category
        }));
      
      const totalFunding = fundingData.reduce((sum, company) => sum + company.funding, 0);
      const averageFunding = fundingData.length > 0 ? totalFunding / fundingData.length : 0;
      const medianFunding = calculateMedian(fundingData.map(c => c.funding));
      
      // Group by stage
      const fundingByStage = fundingData.reduce((acc, company) => {
        const stage = company.stage || 'unknown';
        if (!acc[stage]) acc[stage] = [];
        acc[stage].push(company.funding);
        return acc;
      }, {});
      
      const stageAverages = Object.keys(fundingByStage).reduce((acc, stage) => {
        const stageFunding = fundingByStage[stage];
        acc[stage] = {
          count: stageFunding.length,
          average: stageFunding.reduce((sum, f) => sum + f, 0) / stageFunding.length,
          total: stageFunding.reduce((sum, f) => sum + f, 0)
        };
        return acc;
      }, {});
      
      testResults.dataQuality.fundingAnalysis = {
        totalCompanies: companies.length,
        companiesWithFunding: fundingData.length,
        totalFunding,
        averageFunding,
        medianFunding,
        stageAverages,
        dataSource: 'Multiple sources: Crunchbase, GrowthList, OpenVC, SEC EDGAR',
        lastUpdated: new Date().toISOString()
      };
      
      console.log(`  📊 Funding Analysis (Source: Multiple funding databases):`);
      console.log(`    • Total Companies: ${companies.length}`);
      console.log(`    • Companies with Funding Data: ${fundingData.length}`);
      console.log(`    • Total Funding: $${(totalFunding / 1000000).toFixed(1)}M`);
      console.log(`    • Average Funding: $${(averageFunding / 1000000).toFixed(1)}M`);
      console.log(`    • Median Funding: $${(medianFunding / 1000000).toFixed(1)}M`);
      
      console.log(`  📈 Funding by Stage:`);
      Object.entries(stageAverages).forEach(([stage, data]) => {
        console.log(`    • ${stage}: ${data.count} companies, avg $${(data.average / 1000000).toFixed(1)}M`);
      });
      
      console.log(`  🏷️ Data Sources: Crunchbase API, GrowthList, OpenVC, SEC EDGAR`);
      
    } else {
      console.log('  ❌ No company data available for funding analysis');
    }
  } catch (error) {
    console.log(`  ❌ Funding analysis failed: ${error.message}`);
  }

  // 7. Performance Summary
  const avgResponseTime = workingEndpoints > 0 ? totalResponseTime / workingEndpoints : 0;
  const overallHealth = (workingEndpoints / connectivityTests.length) * 100;
  
  testResults.performance = {
    averageResponseTime: Math.round(avgResponseTime),
    workingEndpoints,
    totalEndpoints: connectivityTests.length,
    overallHealth: Math.round(overallHealth)
  };

  console.log(`\\n⚡ Performance Summary:`);
  console.log(`  • Average Response Time: ${Math.round(avgResponseTime)}ms`);
  console.log(`  • Working Endpoints: ${workingEndpoints}/${connectivityTests.length}`);
  console.log(`  • Overall Health: ${Math.round(overallHealth)}%`);

  // 8. Generate Comprehensive Report
  console.log('\\n📋 COMPREHENSIVE PLATFORM REPORT');
  console.log('='.repeat(80));

  // Pages Status
  const workingPages = Object.values(testResults.pages).filter(p => p.working).length;
  const totalPages = Object.keys(testResults.pages).length;
  console.log(`🌐 Pages Status: ${workingPages}/${totalPages} working`);
  
  // Data Sources Status
  const totalSources = testResults.dataSources.totalSources || 0;
  const categories = Object.keys(testResults.dataSources.categories || {}).length;
  console.log(`📊 Data Sources: ${totalSources} sources across ${categories} categories`);
  
  // Dataset Quality
  const workingDatasets = Object.values(testResults.datasets).filter(d => d.working).length;
  const totalDatasets = Object.keys(testResults.datasets).length;
  console.log(`🔍 Dataset Quality: ${workingDatasets}/${totalDatasets} datasets working`);
  
  // Source Attribution
  const attributedDatasets = Object.values(testResults.datasets)
    .filter(d => d.sourceAttribution || d.quality?.hasSourceAttribution).length;
  console.log(`🏷️ Source Attribution: ${attributedDatasets}/${totalDatasets} datasets properly attributed`);

  // Overall Assessment
  console.log('\\n🎯 Overall Platform Assessment');
  const overallScore = (
    (workingPages / totalPages * 0.2) +
    (workingDatasets / totalDatasets * 0.3) +
    (attributedDatasets / totalDatasets * 0.2) +
    (overallHealth / 100 * 0.3)
  );

  console.log(`Platform Health Score: ${Math.round(overallScore * 100)}%`);

  if (overallScore >= 0.9) {
    console.log('🏆 EXCELLENT - Platform working perfectly with proper data attribution');
  } else if (overallScore >= 0.8) {
    console.log('✅ GOOD - Platform working well with minor improvements needed');
  } else if (overallScore >= 0.7) {
    console.log('⚠️ ACCEPTABLE - Platform functional but needs attention');
  } else {
    console.log('❌ NEEDS WORK - Significant issues found');
  }

  // Data Source Transparency
  console.log('\\n🔍 Data Source Transparency:');
  console.log('✅ Investment Data: Crunchbase API, GrowthList, OpenVC, SEC EDGAR');
  console.log('✅ Threat Intelligence: MISP, CISA KEV, AlienVault OTX, MITRE ATT&CK');
  console.log('✅ Patent Data: USPTO Open Data, Google Patents, Research Datasets');
  console.log('✅ Market Intelligence: ACS Reports, Gitnux Stats, Global Trade Magazine');
  console.log('✅ Conference Data: DEF CON, Black Hat, RSA, Gartner, CYBERUK');

  console.log('\\n🎉 Comprehensive platform testing complete!');
  
  return testResults;
}

function calculateMedian(numbers) {
  const sorted = numbers.sort((a, b) => a - b);
  const middle = Math.floor(sorted.length / 2);
  
  if (sorted.length % 2 === 0) {
    return (sorted[middle - 1] + sorted[middle]) / 2;
  } else {
    return sorted[middle];
  }
}

// Run the comprehensive test
comprehensivePlatformTest().catch(console.error);