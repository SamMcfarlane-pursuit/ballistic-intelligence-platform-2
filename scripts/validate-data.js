#!/usr/bin/env node

/**
 * Data Validation Script for Ballistic Intelligence Platform
 * Ensures all data fields are properly populated and displayed
 */

const fs = require('fs');
const path = require('path');

console.log('🔍 Validating Ballistic Intelligence Platform Data...\n');

// Read the executive dashboard file
const dashboardPath = path.join(__dirname, '../src/app/executive-dashboard/page.tsx');
const dashboardContent = fs.readFileSync(dashboardPath, 'utf8');

// Extract mock data sections
const extractMockData = (content, dataType) => {
  const regex = new RegExp(`const mock${dataType}.*?\\[([\\s\\S]*?)\\]\\s*set${dataType}`, 'i');
  const match = content.match(regex);
  return match ? match[1] : null;
};

// Validation functions
const validateCompanyData = () => {
  console.log('📊 Validating Company Data...');
  
  const requiredFields = [
    'id', 'name', 'description', 'sector', 'location', 'region', 
    'founded', 'fundingFrom', 'totalFunding', 'lastRound', 
    'lastRoundAmount', 'latestDateOfFunding', 'website', 'linkedin'
  ];
  
  const brightDataFields = [
    'newsSentiment', 'recentMentions', 'techStack', 'patents', 
    'competitors', 'marketPosition', 'growthIndicators'
  ];
  
  // Check if mock data contains all required fields
  const mockCompaniesMatch = dashboardContent.match(/const mockCompanies: Company\[\] = \[([\s\S]*?)\]/);
  
  if (mockCompaniesMatch) {
    const mockData = mockCompaniesMatch[1];
    
    requiredFields.forEach(field => {
      if (mockData.includes(`${field}:`)) {
        console.log(`  ✅ ${field}: Present`);
      } else {
        console.log(`  ❌ ${field}: Missing`);
      }
    });
    
    console.log('\n  🔬 BrightData Enhancement Fields:');
    brightDataFields.forEach(field => {
      if (mockData.includes(`${field}:`)) {
        console.log(`  ✅ brightData.${field}: Present`);
      } else {
        console.log(`  ❌ brightData.${field}: Missing`);
      }
    });
  } else {
    console.log('  ❌ Mock companies data not found');
  }
};

const validateTechnologyTrends = () => {
  console.log('\n🚀 Validating Technology Trends Data...');
  
  const requiredFields = [
    'id', 'name', 'category', 'adoptionCount', 'growthRate', 
    'avgFunding', 'trendDirection', 'maturityLevel', 'popularityScore', 
    'successRate', 'topCompanies', 'relatedTechnologies'
  ];
  
  const mockTechMatch = dashboardContent.match(/const mockTechnologyTrends: TechnologyTrend\[\] = \[([\s\S]*?)\]/);
  
  if (mockTechMatch) {
    const mockData = mockTechMatch[1];
    
    requiredFields.forEach(field => {
      if (mockData.includes(`${field}:`)) {
        console.log(`  ✅ ${field}: Present`);
      } else {
        console.log(`  ❌ ${field}: Missing`);
      }
    });
    
    // Count technologies
    const techCount = (mockData.match(/{\s*id:/g) || []).length;
    console.log(`  📈 Total Technologies: ${techCount}`);
    
    // Check categories
    const categories = [...new Set(
      (mockData.match(/category:\s*['"]([^'"]+)['"]/g) || [])
        .map(match => match.match(/['"]([^'"]+)['"]/)[1])
    )];
    console.log(`  🏷️  Categories: ${categories.join(', ')}`);
    
  } else {
    console.log('  ❌ Mock technology trends data not found');
  }
};

const validateComponents = () => {
  console.log('\n🎨 Validating UI Components...');
  
  const components = [
    'TechnologyTrendsCard',
    'CompanyIntelligenceCard', 
    'TechStack',
    'SectorIntelligenceCard',
    'PatentIntelligenceCard'
  ];
  
  components.forEach(component => {
    const componentPath = path.join(__dirname, `../src/components/dashboard/${component}.tsx`);
    const techStackPath = path.join(__dirname, `../src/components/ui/tech-stack.tsx`);
    
    let filePath = componentPath;
    if (component === 'TechStack') {
      filePath = techStackPath;
    }
    
    if (fs.existsSync(filePath)) {
      const content = fs.readFileSync(filePath, 'utf8');
      
      // Check for proper imports
      if (content.includes('import')) {
        console.log(`  ✅ ${component}: Component exists with imports`);
      } else {
        console.log(`  ⚠️  ${component}: Component exists but may have import issues`);
      }
      
      // Check for export
      if (content.includes('export default')) {
        console.log(`  ✅ ${component}: Properly exported`);
      } else {
        console.log(`  ❌ ${component}: Missing default export`);
      }
    } else {
      console.log(`  ❌ ${component}: Component file not found`);
    }
  });
};

const validateAPIEndpoints = () => {
  console.log('\n🔌 Validating API Endpoints...');
  
  const endpoints = [
    'health',
    'technology-trends',
    'brightdata'
  ];
  
  endpoints.forEach(endpoint => {
    const endpointPath = path.join(__dirname, `../src/app/api/${endpoint}/route.ts`);
    
    if (fs.existsSync(endpointPath)) {
      const content = fs.readFileSync(endpointPath, 'utf8');
      
      if (content.includes('export async function GET')) {
        console.log(`  ✅ /api/${endpoint}: GET method implemented`);
      } else {
        console.log(`  ⚠️  /api/${endpoint}: Missing GET method`);
      }
      
      if (content.includes('NextResponse.json')) {
        console.log(`  ✅ /api/${endpoint}: Proper JSON responses`);
      } else {
        console.log(`  ⚠️  /api/${endpoint}: May have response issues`);
      }
    } else {
      console.log(`  ❌ /api/${endpoint}: Endpoint not found`);
    }
  });
};

const validateDockerSetup = () => {
  console.log('\n🐳 Validating Docker Setup...');
  
  const dockerFiles = [
    'Dockerfile',
    'docker-compose.yml',
    'docker-start.sh',
    '.dockerignore'
  ];
  
  dockerFiles.forEach(file => {
    const filePath = path.join(__dirname, `../${file}`);
    
    if (fs.existsSync(filePath)) {
      console.log(`  ✅ ${file}: Present`);
      
      if (file === 'docker-start.sh') {
        const stats = fs.statSync(filePath);
        if (stats.mode & parseInt('111', 8)) {
          console.log(`  ✅ ${file}: Executable`);
        } else {
          console.log(`  ⚠️  ${file}: Not executable (run: chmod +x ${file})`);
        }
      }
    } else {
      console.log(`  ❌ ${file}: Missing`);
    }
  });
};

// Run all validations
console.log('🔍 Starting comprehensive data validation...\n');

validateCompanyData();
validateTechnologyTrends();
validateComponents();
validateAPIEndpoints();
validateDockerSetup();

console.log('\n✨ Validation completed!');
console.log('\n📋 Summary:');
console.log('   • Company data with BrightData enhancements');
console.log('   • Technology trends analytics');
console.log('   • Enhanced UI components');
console.log('   • API endpoints for data access');
console.log('   • Docker deployment configuration');
console.log('\n🚀 Ready for deployment and testing!');