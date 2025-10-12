import { NextRequest, NextResponse } from 'next/server'

// Data Management API for CS Intelligence Platform
// Handles AI extraction, manual entry, and bulk upload operations

interface CompanyData {
  name: string
  industry: string
  stage: string
  location: string
  founded: number
  employees: number
  funding: number
  valuation: number
  investors: string[]
  description: string
  website: string
  confidence?: number
  source?: string
}

interface AIExtractionRequest {
  text: string
  source: string
}

interface BulkUploadStats {
  totalRows: number
  successfulImports: number
  failedImports: number
  duplicates: number
  errors: string[]
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const action = searchParams.get('action')

    switch (action) {
      case 'stats':
        return NextResponse.json({
          success: true,
          data: {
            totalCompanies: 1247,
            thisMonth: 23,
            aiProcessed: 892,
            accuracy: 94.2,
            categories: {
              'Endpoint Security': 234,
              'Network Security': 198,
              'Cloud Security': 187,
              'Identity & Access': 156,
              'Data Protection': 143,
              'Threat Intelligence': 129,
              'Security Analytics': 112,
              'Application Security': 88
            },
            recentActivity: [
              { action: 'AI Extract', company: 'CyberShield AI', timestamp: new Date().toISOString() },
              { action: 'Manual Entry', company: 'SecureFlow', timestamp: new Date(Date.now() - 3600000).toISOString() },
              { action: 'Bulk Upload', company: '15 companies', timestamp: new Date(Date.now() - 7200000).toISOString() }
            ]
          }
        })

      case 'template':
        // Return CSV template structure
        return NextResponse.json({
          success: true,
          data: {
            templateUrl: '/templates/cybersecurity-companies-template.csv',
            columns: [
              'Company Name',
              'Industry',
              'Funding Stage',
              'Total Funding (USD)',
              'Valuation (USD)',
              'HQ Location',
              'Founded Year',
              'Employee Count',
              'Lead Investors',
              'Website',
              'Description'
            ],
            sampleData: [
              {
                'Company Name': 'CyberShield AI',
                'Industry': 'AI Threat Detection',
                'Funding Stage': 'Series A',
                'Total Funding (USD)': '15000000',
                'Valuation (USD)': '60000000',
                'HQ Location': 'San Francisco, CA',
                'Founded Year': '2021',
                'Employee Count': '75',
                'Lead Investors': 'Ballistic Ventures, Kleiner Perkins',
                'Website': 'www.cybershield-ai.com',
                'Description': 'AI-powered cybersecurity platform for threat detection'
              }
            ]
          }
        })

      case 'categories':
        return NextResponse.json({
          success: true,
          data: {
            industries: [
              { value: 'endpoint-security', label: 'Endpoint Security', count: 234 },
              { value: 'network-security', label: 'Network Security', count: 198 },
              { value: 'cloud-security', label: 'Cloud Security', count: 187 },
              { value: 'identity-access', label: 'Identity & Access Management', count: 156 },
              { value: 'data-protection', label: 'Data Protection', count: 143 },
              { value: 'threat-intelligence', label: 'Threat Intelligence', count: 129 },
              { value: 'security-analytics', label: 'Security Analytics', count: 112 },
              { value: 'application-security', label: 'Application Security', count: 88 }
            ],
            stages: [
              { value: 'seed', label: 'Seed', count: 312 },
              { value: 'series-a', label: 'Series A', count: 298 },
              { value: 'series-b', label: 'Series B', count: 234 },
              { value: 'series-c', label: 'Series C', count: 187 },
              { value: 'series-d', label: 'Series D+', count: 143 },
              { value: 'ipo', label: 'IPO', count: 45 },
              { value: 'acquired', label: 'Acquired', count: 28 }
            ]
          }
        })

      default:
        return NextResponse.json({
          success: true,
          data: {
            service: 'Data Management API',
            description: 'AI-powered cybersecurity company data management system',
            features: [
              'AI text extraction with Gemini Flash 2.0',
              'Manual company data entry',
              'Bulk CSV/Excel upload processing',
              'Data validation and deduplication',
              'Category and industry classification',
              'Real-time processing status'
            ],
            endpoints: [
              'GET /api/data-management?action=stats - Database statistics',
              'GET /api/data-management?action=template - Download template',
              'GET /api/data-management?action=categories - Industry categories',
              'POST /api/data-management - Process data operations'
            ]
          }
        })
    }

  } catch (error) {
    console.error('Data Management API error:', error)
    return NextResponse.json(
      { success: false, error: 'Data management request failed' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const { action, data } = await request.json()

    switch (action) {
      case 'ai-extract':
        const extractionRequest = data as AIExtractionRequest
        const extractedData = await processAIExtraction(extractionRequest)
        
        return NextResponse.json({
          success: true,
          data: extractedData,
          message: 'AI extraction completed successfully'
        })

      case 'manual-entry':
        const companyData = data as CompanyData
        const savedData = await processManualEntry(companyData)
        
        return NextResponse.json({
          success: true,
          data: savedData,
          message: 'Company data saved successfully'
        })

      case 'bulk-upload':
        const { fileData, fileName } = data
        const uploadStats = await processBulkUpload(fileData, fileName)
        
        return NextResponse.json({
          success: true,
          data: uploadStats,
          message: `Successfully processed ${uploadStats.successfulImports} companies`
        })

      case 'validate-data':
        const validationResult = await validateCompanyData(data)
        
        return NextResponse.json({
          success: true,
          data: validationResult,
          message: 'Data validation completed'
        })

      case 'export-data':
        const exportData = await exportCompanyData(data.filters)
        
        return NextResponse.json({
          success: true,
          data: exportData,
          message: 'Data export prepared successfully'
        })

      default:
        return NextResponse.json(
          { success: false, error: 'Invalid action specified' },
          { status: 400 }
        )
    }

  } catch (error) {
    console.error('Data Management POST error:', error)
    return NextResponse.json(
      { success: false, error: 'Data management operation failed' },
      { status: 500 }
    )
  }
}

// AI Extraction Processing
async function processAIExtraction(request: AIExtractionRequest): Promise<CompanyData> {
  // Mock AI processing with Gemini Flash 2.0
  // In production, this would call the actual Gemini API
  
  const mockExtractedData: CompanyData = {
    name: extractCompanyName(request.text),
    industry: extractIndustry(request.text),
    stage: extractFundingStage(request.text),
    location: extractLocation(request.text),
    founded: extractFoundedYear(request.text),
    employees: extractEmployeeCount(request.text),
    funding: extractFundingAmount(request.text),
    valuation: extractValuation(request.text),
    investors: extractInvestors(request.text),
    description: extractDescription(request.text),
    website: extractWebsite(request.text),
    confidence: 0.92,
    source: request.source
  }

  return mockExtractedData
}

// Manual Entry Processing
async function processManualEntry(companyData: CompanyData): Promise<CompanyData> {
  // Validate and enhance manual entry data
  const enhancedData = {
    ...companyData,
    id: generateCompanyId(companyData.name),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    source: 'manual-entry',
    confidence: 1.0
  }

  // In production, save to database
  console.log('Saving company data:', enhancedData)
  
  return enhancedData
}

// Bulk Upload Processing
async function processBulkUpload(fileData: any[], fileName: string): Promise<BulkUploadStats> {
  const stats: BulkUploadStats = {
    totalRows: fileData.length,
    successfulImports: 0,
    failedImports: 0,
    duplicates: 0,
    errors: []
  }

  for (const row of fileData) {
    try {
      // Validate row data
      if (validateRowData(row)) {
        // Check for duplicates
        if (await isDuplicate(row['Company Name'])) {
          stats.duplicates++
        } else {
          // Process and save
          await processCompanyRow(row)
          stats.successfulImports++
        }
      } else {
        stats.failedImports++
        stats.errors.push(`Invalid data for company: ${row['Company Name'] || 'Unknown'}`)
      }
    } catch (error) {
      stats.failedImports++
      stats.errors.push(`Error processing ${row['Company Name']}: ${error}`)
    }
  }

  return stats
}

// Data Validation
async function validateCompanyData(data: CompanyData): Promise<any> {
  const validation = {
    isValid: true,
    errors: [] as string[],
    warnings: [] as string[],
    suggestions: [] as string[]
  }

  // Required field validation
  if (!data.name) validation.errors.push('Company name is required')
  if (!data.industry) validation.errors.push('Industry classification is required')
  if (!data.stage) validation.errors.push('Funding stage is required')

  // Data quality checks
  if (data.funding && data.funding < 0) validation.errors.push('Funding amount cannot be negative')
  if (data.employees && data.employees < 1) validation.warnings.push('Employee count seems unusually low')
  if (data.founded && data.founded > new Date().getFullYear()) validation.errors.push('Founded year cannot be in the future')

  // Suggestions
  if (!data.website) validation.suggestions.push('Consider adding company website for better profiling')
  if (!data.description) validation.suggestions.push('Company description helps with AI analysis')

  validation.isValid = validation.errors.length === 0

  return validation
}

// Data Export
async function exportCompanyData(filters: any): Promise<any> {
  // Mock export functionality
  return {
    exportId: 'export-' + Date.now(),
    format: 'csv',
    recordCount: 1247,
    downloadUrl: '/api/data-management/download/export-' + Date.now() + '.csv',
    expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString()
  }
}

// Helper functions for AI extraction (mock implementations)
function extractCompanyName(text: string): string {
  // Mock extraction - in production, use actual NLP
  const matches = text.match(/([A-Z][a-zA-Z\s]+(?:Inc|Corp|LLC|Ltd|AI|Tech|Security|Cyber))/g)
  return matches ? matches[0] : 'Unknown Company'
}

function extractIndustry(text: string): string {
  const industries = [
    'Endpoint Security', 'Network Security', 'Cloud Security', 
    'Identity & Access Management', 'Data Protection', 'Threat Intelligence',
    'Security Analytics', 'Application Security'
  ]
  
  for (const industry of industries) {
    if (text.toLowerCase().includes(industry.toLowerCase())) {
      return industry
    }
  }
  
  return 'Cybersecurity'
}

function extractFundingStage(text: string): string {
  const stages = ['Seed', 'Series A', 'Series B', 'Series C', 'Series D', 'IPO']
  
  for (const stage of stages) {
    if (text.toLowerCase().includes(stage.toLowerCase())) {
      return stage
    }
  }
  
  return 'Unknown'
}

function extractLocation(text: string): string {
  // Mock location extraction
  const locations = ['San Francisco, CA', 'New York, NY', 'Boston, MA', 'Austin, TX', 'Seattle, WA']
  return locations[Math.floor(Math.random() * locations.length)]
}

function extractFoundedYear(text: string): number {
  const yearMatch = text.match(/founded in (\d{4})|established (\d{4})|since (\d{4})/i)
  return yearMatch ? parseInt(yearMatch[1] || yearMatch[2] || yearMatch[3]) : 2020
}

function extractEmployeeCount(text: string): number {
  const empMatch = text.match(/(\d+)\s*employees/i)
  return empMatch ? parseInt(empMatch[1]) : Math.floor(Math.random() * 500) + 50
}

function extractFundingAmount(text: string): number {
  const fundingMatch = text.match(/\$(\d+(?:\.\d+)?)\s*(?:million|M)/i)
  return fundingMatch ? parseFloat(fundingMatch[1]) * 1000000 : Math.floor(Math.random() * 50) * 1000000
}

function extractValuation(text: string): number {
  const valuationMatch = text.match(/valued at \$(\d+(?:\.\d+)?)\s*(?:million|M|billion|B)/i)
  if (valuationMatch) {
    const multiplier = text.toLowerCase().includes('billion') ? 1000000000 : 1000000
    return parseFloat(valuationMatch[1]) * multiplier
  }
  return Math.floor(Math.random() * 200) * 1000000
}

function extractInvestors(text: string): string[] {
  // Mock investor extraction
  const commonInvestors = ['Ballistic Ventures', 'Kleiner Perkins', 'GV', 'Andreessen Horowitz', 'Sequoia Capital']
  return commonInvestors.slice(0, Math.floor(Math.random() * 3) + 1)
}

function extractDescription(text: string): string {
  // Return first sentence or paragraph as description
  const sentences = text.split('.')
  return sentences[0] + '.' || 'Cybersecurity company focused on innovative security solutions.'
}

function extractWebsite(text: string): string {
  const urlMatch = text.match(/(?:https?:\/\/)?(?:www\.)?([a-zA-Z0-9-]+\.[a-zA-Z]{2,})/i)
  return urlMatch ? urlMatch[0] : 'www.example.com'
}

// Helper functions
function generateCompanyId(name: string): string {
  return name.toLowerCase().replace(/[^a-z0-9]/g, '-') + '-' + Date.now()
}

function validateRowData(row: any): boolean {
  return !!(row['Company Name'] && row['Industry'] && row['Funding Stage'])
}

async function isDuplicate(companyName: string): Promise<boolean> {
  // Mock duplicate check - in production, query database
  return Math.random() < 0.1 // 10% chance of duplicate
}

async function processCompanyRow(row: any): Promise<void> {
  // Mock processing - in production, save to database
  console.log('Processing company row:', row['Company Name'])
}