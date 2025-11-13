/**
 * Comprehensive Null Prevention System
 * Ensures no null, undefined, or empty values in data
 */

export interface DataValidationResult {
  isValid: boolean
  errors: string[]
  warnings: string[]
  data: any
}

/**
 * Validate and sanitize company data
 */
export function validateCompanyData(company: any): DataValidationResult {
  const errors: string[] = []
  const warnings: string[] = []
  
  // Required fields
  const requiredFields = [
    'id', 'name', 'description', 'sector', 'location', 'region',
    'founded', 'fundingFrom', 'totalFunding', 'lastRound',
    'website', 'linkedin', 'employees'
  ]
  
  for (const field of requiredFields) {
    if (!company[field] || company[field] === null || company[field] === undefined || company[field] === '') {
      errors.push(`Missing required field: ${field}`)
    }
  }
  
  // Validate team structure
  if (!company.team) {
    errors.push('Missing team object')
  } else {
    const teamFields = ['ceo', 'cto', 'head']
    for (const field of teamFields) {
      if (!company.team[field] || company.team[field] === null || company.team[field] === undefined || company.team[field] === '') {
        errors.push(`Missing team field: ${field}`)
      }
    }
  }
  
  // Validate brightData structure
  if (!company.brightData) {
    warnings.push('Missing brightData object')
  }
  
  return {
    isValid: errors.length === 0,
    errors,
    warnings,
    data: company
  }
}

/**
 * Sanitize string values - remove null, undefined, empty
 */
export function sanitizeString(value: any, defaultValue: string = 'N/A'): string {
  if (value === null || value === undefined || value === '' || value === 'null' || value === 'undefined') {
    return defaultValue
  }
  return String(value).trim()
}

/**
 * Sanitize number values
 */
export function sanitizeNumber(value: any, defaultValue: number = 0): number {
  if (value === null || value === undefined || value === '' || isNaN(value)) {
    return defaultValue
  }
  const num = Number(value)
  return isNaN(num) ? defaultValue : num
}

/**
 * Sanitize object - ensure all fields exist
 */
export function sanitizeObject<T extends Record<string, any>>(
  obj: any,
  requiredFields: (keyof T)[],
  defaults: Partial<T>
): T {
  const sanitized: any = { ...obj }
  
  for (const field of requiredFields) {
    if (sanitized[field] === null || sanitized[field] === undefined || sanitized[field] === '') {
      sanitized[field] = defaults[field] || null
    }
  }
  
  return sanitized as T
}

/**
 * Ensure company has complete data
 */
export function ensureCompleteCompanyData(company: any): any {
  return {
    id: sanitizeString(company.id, `company-${Date.now()}`),
    name: sanitizeString(company.name, 'Unknown Company'),
    description: sanitizeString(company.description, 'Cybersecurity company providing innovative solutions'),
    sector: sanitizeString(company.sector, 'Cybersecurity'),
    location: sanitizeString(company.location, 'Unknown Location'),
    region: sanitizeString(company.region, 'North America'),
    founded: sanitizeNumber(company.founded, 2020),
    fundingFrom: sanitizeString(company.fundingFrom, 'Various Investors'),
    totalFunding: sanitizeNumber(company.totalFunding, 0),
    lastRound: sanitizeString(company.lastRound, 'Seed'),
    lastRoundAmount: sanitizeNumber(company.lastRoundAmount, 0),
    latestDateOfFunding: sanitizeString(company.latestDateOfFunding, 'Recent'),
    website: sanitizeString(company.website, 'https://example.com'),
    linkedin: sanitizeString(company.linkedin, 'https://linkedin.com/company/unknown'),
    employees: sanitizeString(company.employees, '1-10'),
    team: {
      ceo: sanitizeString(company.team?.ceo, 'CEO & Founder'),
      cto: sanitizeString(company.team?.cto, 'CTO & Co-Founder'),
      head: sanitizeString(company.team?.head, 'VP of Engineering')
    },
    brightData: company.brightData || {
      newsSentiment: 'neutral',
      recentMentions: 0,
      patents: 0,
      competitors: [],
      marketPosition: 'Unknown',
      growthIndicators: {
        hiring: 0,
        funding: 0,
        news: 0
      }
    }
  }
}

/**
 * Validate array of companies
 */
export function validateCompaniesArray(companies: any[]): DataValidationResult {
  const errors: string[] = []
  const warnings: string[] = []
  const validatedCompanies: any[] = []
  
  if (!Array.isArray(companies)) {
    errors.push('Companies data is not an array')
    return { isValid: false, errors, warnings, data: [] }
  }
  
  companies.forEach((company, index) => {
    const result = validateCompanyData(company)
    
    if (!result.isValid) {
      errors.push(`Company ${index + 1} (${company.name || 'Unknown'}): ${result.errors.join(', ')}`)
    }
    
    if (result.warnings.length > 0) {
      warnings.push(`Company ${index + 1} (${company.name || 'Unknown'}): ${result.warnings.join(', ')}`)
    }
    
    // Always add sanitized version
    validatedCompanies.push(ensureCompleteCompanyData(company))
  })
  
  return {
    isValid: errors.length === 0,
    errors,
    warnings,
    data: validatedCompanies
  }
}

/**
 * Check for null values in nested object
 */
export function findNullValues(obj: any, path: string = ''): string[] {
  const nullPaths: string[] = []
  
  if (obj === null || obj === undefined) {
    nullPaths.push(path || 'root')
    return nullPaths
  }
  
  if (typeof obj === 'object' && !Array.isArray(obj)) {
    for (const [key, value] of Object.entries(obj)) {
      const currentPath = path ? `${path}.${key}` : key
      
      if (value === null || value === undefined || value === '') {
        nullPaths.push(currentPath)
      } else if (typeof value === 'object') {
        nullPaths.push(...findNullValues(value, currentPath))
      }
    }
  } else if (Array.isArray(obj)) {
    obj.forEach((item, index) => {
      const currentPath = `${path}[${index}]`
      if (item === null || item === undefined) {
        nullPaths.push(currentPath)
      } else if (typeof item === 'object') {
        nullPaths.push(...findNullValues(item, currentPath))
      }
    })
  }
  
  return nullPaths
}

/**
 * Generate report of data quality
 */
export function generateDataQualityReport(companies: any[]): {
  totalCompanies: number
  validCompanies: number
  companiesWithIssues: number
  nullFields: string[]
  completeness: number
  issues: string[]
} {
  const result = validateCompaniesArray(companies)
  const nullFields = companies.flatMap((c, i) => 
    findNullValues(c).map(path => `Company ${i + 1}: ${path}`)
  )
  
  return {
    totalCompanies: companies.length,
    validCompanies: companies.length - result.errors.length,
    companiesWithIssues: result.errors.length,
    nullFields,
    completeness: companies.length > 0 
      ? ((companies.length - result.errors.length) / companies.length) * 100 
      : 0,
    issues: [...result.errors, ...result.warnings]
  }
}
