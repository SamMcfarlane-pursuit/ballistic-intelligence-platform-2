#!/usr/bin/env node

/**
 * Test Null Prevention System
 * Verifies no null values in API responses
 */

const fs = require('fs')
const path = require('path')

// Load environment
const envPath = path.join(__dirname, '..', '.env.local')
if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, 'utf8')
  envContent.split('\n').forEach(line => {
    const match = line.match(/^([^#=]+)=(.*)$/)
    if (match) {
      process.env[match[1].trim()] = match[2].trim()
    }
  })
}

console.log('🔍 NULL PREVENTION SYSTEM TEST\n')
console.log('=' .repeat(100))

async function testNullPrevention() {
  try {
    // Test spreadsheet API
    console.log('\n📊 Testing Spreadsheet API...\n')
    
    const response = await fetch('http://localhost:4000/api/spreadsheet')
    const data = await response.json()
    
    if (!data.success) {
      console.log('❌ API request failed:', data.error)
      return false
    }
    
    const companies = data.data
    console.log(`✅ Fetched ${companies.length} companies`)
    
    // Check for null values
    let nullCount = 0
    const nullFields = []
    
    const requiredFields = [
      'id', 'name', 'description', 'sector', 'location', 'region',
      'founded', 'fundingFrom', 'totalFunding', 'lastRound',
      'website', 'linkedin', 'employees'
    ]
    
    const teamFields = ['ceo', 'cto', 'head']
    
    companies.forEach((company, index) => {
      // Check main fields
      requiredFields.forEach(field => {
        const value = company[field]
        if (value === null || value === undefined || value === '' || value === 'null' || value === 'undefined') {
          nullCount++
          nullFields.push(`Company ${index + 1} (${company.name || 'Unknown'}): ${field} is null/empty`)
        }
      })
      
      // Check team fields
      if (!company.team) {
        nullCount++
        nullFields.push(`Company ${index + 1} (${company.name || 'Unknown'}): team object missing`)
      } else {
        teamFields.forEach(field => {
          const value = company.team[field]
          if (value === null || value === undefined || value === '' || value === 'null' || value === 'undefined') {
            nullCount++
            nullFields.push(`Company ${index + 1} (${company.name || 'Unknown'}): team.${field} is null/empty`)
          }
        })
      }
    })
    
    console.log('\n' + '=' .repeat(100))
    
    if (nullCount === 0) {
      console.log('\n✅ PERFECT! NO NULL VALUES FOUND')
      console.log('\n📊 Data Quality Report:')
      console.log(`  • Total Companies: ${companies.length}`)
      console.log(`  • Fields Checked: ${requiredFields.length + teamFields.length}`)
      console.log(`  • Total Checks: ${companies.length * (requiredFields.length + teamFields.length)}`)
      console.log(`  • Null Values: 0`)
      console.log(`  • Data Completeness: 100%`)
      
      // Show sample data
      console.log('\n📋 Sample Company Data:')
      const sample = companies[0]
      console.log(`  Company: ${sample.name}`)
      console.log(`  Website: ${sample.website}`)
      console.log(`  Location: ${sample.location}`)
      console.log(`  Funding: $${sample.totalFunding.toLocaleString()}`)
      console.log(`  Investor: ${sample.fundingFrom}`)
      console.log(`  Employees: ${sample.employees}`)
      console.log(`  CEO: ${sample.team.ceo}`)
      console.log(`  CTO: ${sample.team.cto}`)
      console.log(`  Head: ${sample.team.head}`)
      
      // Check validation info
      if (data.validation) {
        console.log('\n🔍 Validation Results:')
        console.log(`  • Valid: ${data.validation.isValid ? 'Yes' : 'No'}`)
        console.log(`  • Errors: ${data.validation.errors.length}`)
        console.log(`  • Warnings: ${data.validation.warnings.length}`)
      }
      
      console.log('\n' + '=' .repeat(100))
      console.log('✅ NULL PREVENTION SYSTEM: OPERATIONAL')
      console.log('=' .repeat(100))
      
      return true
    } else {
      console.log(`\n❌ FOUND ${nullCount} NULL VALUES:\n`)
      nullFields.forEach(field => console.log(`  • ${field}`))
      console.log('\n' + '=' .repeat(100))
      console.log('❌ NULL PREVENTION SYSTEM: FAILED')
      console.log('=' .repeat(100))
      
      return false
    }
    
  } catch (error) {
    console.log('\n❌ Test failed:', error.message)
    console.log('\nMake sure the development server is running on port 4000')
    return false
  }
}

testNullPrevention().then(success => {
  process.exit(success ? 0 : 1)
})
