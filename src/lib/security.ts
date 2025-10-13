/**
 * Security utilities for input validation and sanitization
 */

// Input validation patterns
export const VALIDATION_PATTERNS = {
  companyName: /^[a-zA-Z0-9\s\-\.\,\&\(\)]{2,100}$/,
  url: /^https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)$/,
  email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  amount: /^\d+(\.\d{1,2})?$/,
  year: /^(19|20)\d{2}$/,
  text: /^[\w\s\-\.\,\!\?\:\;\(\)\[\]\{\}\"\']{1,10000}$/
} as const

// Sanitize text input to prevent XSS and injection attacks
export function sanitizeText(input: string): string {
  if (typeof input !== 'string') {
    return ''
  }

  return input
    .trim()
    .replace(/[<>]/g, '') // Remove potential HTML tags
    .replace(/javascript:/gi, '') // Remove javascript: protocol
    .replace(/on\w+=/gi, '') // Remove event handlers
    .replace(/script/gi, '') // Remove script references
    .slice(0, 10000) // Limit length
}

// Sanitize URL input
export function sanitizeUrl(input: string): string {
  if (typeof input !== 'string') {
    return ''
  }

  const sanitized = input.trim().toLowerCase()
  
  // Only allow http and https protocols
  if (!sanitized.startsWith('http://') && !sanitized.startsWith('https://')) {
    return `https://${sanitized}`
  }

  // Validate against pattern
  if (!VALIDATION_PATTERNS.url.test(sanitized)) {
    return ''
  }

  return sanitized
}

// Validate and sanitize company data
export interface CompanyDataValidation {
  isValid: boolean
  errors: string[]
  sanitizedData: Record<string, any>
}

export function validateCompanyData(data: Record<string, any>): CompanyDataValidation {
  const errors: string[] = []
  const sanitizedData: Record<string, any> = {}

  // Validate company name
  if (data.name) {
    const sanitizedName = sanitizeText(data.name)
    if (!VALIDATION_PATTERNS.companyName.test(sanitizedName)) {
      errors.push('Company name contains invalid characters or is too long')
    } else {
      sanitizedData.name = sanitizedName
    }
  } else {
    errors.push('Company name is required')
  }

  // Validate industry
  if (data.industry) {
    sanitizedData.industry = sanitizeText(data.industry)
  }

  // Validate funding amount
  if (data.funding) {
    const fundingStr = String(data.funding).replace(/[^\d\.]/g, '')
    if (VALIDATION_PATTERNS.amount.test(fundingStr)) {
      const fundingNum = parseFloat(fundingStr)
      if (fundingNum >= 0 && fundingNum <= 10000000000) { // Max $10B
        sanitizedData.funding = fundingNum
      } else {
        errors.push('Funding amount must be between 0 and 10 billion')
      }
    } else {
      errors.push('Invalid funding amount format')
    }
  }

  // Validate founded year
  if (data.founded) {
    const yearStr = String(data.founded).replace(/\D/g, '')
    if (VALIDATION_PATTERNS.year.test(yearStr)) {
      const year = parseInt(yearStr)
      const currentYear = new Date().getFullYear()
      if (year >= 1900 && year <= currentYear) {
        sanitizedData.founded = year
      } else {
        errors.push('Founded year must be between 1900 and current year')
      }
    } else {
      errors.push('Invalid founded year format')
    }
  }

  // Validate employee count
  if (data.employees) {
    const employeeStr = String(data.employees).replace(/\D/g, '')
    const employeeNum = parseInt(employeeStr)
    if (employeeNum >= 0 && employeeNum <= 1000000) { // Max 1M employees
      sanitizedData.employees = employeeNum
    } else {
      errors.push('Employee count must be between 0 and 1,000,000')
    }
  }

  // Validate website URL
  if (data.website) {
    const sanitizedUrl = sanitizeUrl(data.website)
    if (sanitizedUrl) {
      sanitizedData.website = sanitizedUrl
    } else {
      errors.push('Invalid website URL format')
    }
  }

  // Validate description
  if (data.description) {
    const sanitizedDesc = sanitizeText(data.description)
    if (sanitizedDesc.length > 0 && sanitizedDesc.length <= 5000) {
      sanitizedData.description = sanitizedDesc
    } else {
      errors.push('Description must be between 1 and 5000 characters')
    }
  }

  // Validate location
  if (data.location) {
    sanitizedData.location = sanitizeText(data.location)
  }

  return {
    isValid: errors.length === 0,
    errors,
    sanitizedData
  }
}

// Rate limiting utility
interface RateLimitEntry {
  count: number
  resetTime: number
}

const rateLimitStore = new Map<string, RateLimitEntry>()

export function checkRateLimit(
  identifier: string, 
  maxRequests: number = 60, 
  windowMs: number = 60000
): { allowed: boolean; remaining: number } {
  const now = Date.now()
  const entry = rateLimitStore.get(identifier)

  if (!entry || now > entry.resetTime) {
    // Create new entry or reset expired entry
    rateLimitStore.set(identifier, {
      count: 1,
      resetTime: now + windowMs
    })
    return { allowed: true, remaining: maxRequests - 1 }
  }

  if (entry.count >= maxRequests) {
    return { allowed: false, remaining: 0 }
  }

  entry.count++
  return { allowed: true, remaining: maxRequests - entry.count }
}

// Clean up expired rate limit entries
export function cleanupRateLimit() {
  const now = Date.now()
  for (const [key, entry] of rateLimitStore.entries()) {
    if (now > entry.resetTime) {
      rateLimitStore.delete(key)
    }
  }
}

// Set up periodic cleanup
if (typeof window === 'undefined') {
  // Server-side cleanup
  setInterval(cleanupRateLimit, 300000) // Clean up every 5 minutes
}

// CSRF token generation and validation
export function generateCSRFToken(): string {
  const array = new Uint8Array(32)
  if (typeof window !== 'undefined' && window.crypto) {
    window.crypto.getRandomValues(array)
  } else {
    // Fallback for server-side
    for (let i = 0; i < array.length; i++) {
      array[i] = Math.floor(Math.random() * 256)
    }
  }
  return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('')
}

// Session management
export interface SessionData {
  id: string
  userId?: string
  createdAt: number
  lastActivity: number
  csrfToken: string
}

const sessionStore = new Map<string, SessionData>()

export function createSession(userId?: string): SessionData {
  const sessionId = generateCSRFToken()
  const now = Date.now()
  
  const session: SessionData = {
    id: sessionId,
    userId,
    createdAt: now,
    lastActivity: now,
    csrfToken: generateCSRFToken()
  }
  
  sessionStore.set(sessionId, session)
  return session
}

export function validateSession(sessionId: string, csrfToken?: string): SessionData | null {
  const session = sessionStore.get(sessionId)
  
  if (!session) {
    return null
  }
  
  const now = Date.now()
  const maxAge = 24 * 60 * 60 * 1000 // 24 hours
  
  // Check if session is expired
  if (now - session.lastActivity > maxAge) {
    sessionStore.delete(sessionId)
    return null
  }
  
  // Validate CSRF token if provided
  if (csrfToken && session.csrfToken !== csrfToken) {
    return null
  }
  
  // Update last activity
  session.lastActivity = now
  
  return session
}

// Content Security Policy helpers
export const CSP_DIRECTIVES = {
  'default-src': ["'self'"],
  'script-src': ["'self'", "'unsafe-inline'", "'unsafe-eval'"],
  'style-src': ["'self'", "'unsafe-inline'"],
  'img-src': ["'self'", "data:", "https:"],
  'font-src': ["'self'", "https:"],
  'connect-src': ["'self'", "https:"],
  'frame-ancestors': ["'none'"],
  'base-uri': ["'self'"],
  'form-action': ["'self'"]
} as const

export function generateCSPHeader(): string {
  return Object.entries(CSP_DIRECTIVES)
    .map(([directive, sources]) => `${directive} ${sources.join(' ')}`)
    .join('; ')
}