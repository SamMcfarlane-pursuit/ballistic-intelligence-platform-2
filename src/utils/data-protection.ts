/**
 * Data Protection & Privacy Utilities
 * 
 * Implements security best practices for handling sensitive information:
 * - Data masking and redaction
 * - PII (Personally Identifiable Information) protection
 * - Secure data display
 * - Access control helpers
 */

export interface DataProtectionConfig {
  maskEmails?: boolean
  maskPhones?: boolean
  maskFinancials?: boolean
  redactSensitiveInfo?: boolean
  accessLevel?: 'public' | 'internal' | 'confidential' | 'restricted'
}

/**
 * Mask email addresses for privacy
 * Example: john.doe@company.com -> j***@company.com
 */
export function maskEmail(email: string): string {
  if (!email || !email.includes('@')) return email
  
  const [username, domain] = email.split('@')
  if (username.length <= 2) return email
  
  const maskedUsername = username[0] + '***'
  return `${maskedUsername}@${domain}`
}

/**
 * Mask phone numbers
 * Example: +1-555-123-4567 -> +1-***-***-4567
 */
export function maskPhone(phone: string): string {
  if (!phone) return phone
  
  // Keep country code and last 4 digits
  const cleaned = phone.replace(/\D/g, '')
  if (cleaned.length < 4) return '***'
  
  const lastFour = cleaned.slice(-4)
  return `***-***-${lastFour}`
}

/**
 * Mask financial amounts for public display
 * Shows ranges instead of exact amounts
 */
export function maskFinancialAmount(amount: number, showRange: boolean = true): string {
  if (amount === 0) return 'Undisclosed'
  
  if (showRange) {
    if (amount >= 100000000) return '$100M+'
    if (amount >= 50000000) return '$50M-$100M'
    if (amount >= 25000000) return '$25M-$50M'
    if (amount >= 10000000) return '$10M-$25M'
    if (amount >= 5000000) return '$5M-$10M'
    if (amount >= 1000000) return '$1M-$5M'
    return 'Under $1M'
  }
  
  // Show approximate amount
  if (amount >= 1000000) {
    return `~$${Math.round(amount / 1000000)}M`
  }
  return `~$${Math.round(amount / 1000)}K`
}

/**
 * Redact sensitive information from text
 * Removes or masks: SSN, credit cards, API keys, etc.
 */
export function redactSensitiveInfo(text: string): string {
  if (!text) return text
  
  let redacted = text
  
  // Redact SSN patterns (XXX-XX-XXXX)
  redacted = redacted.replace(/\b\d{3}-\d{2}-\d{4}\b/g, '***-**-****')
  
  // Redact credit card patterns
  redacted = redacted.replace(/\b\d{4}[\s-]?\d{4}[\s-]?\d{4}[\s-]?\d{4}\b/g, '****-****-****-****')
  
  // Redact API keys (common patterns)
  redacted = redacted.replace(/\b[A-Za-z0-9]{32,}\b/g, '[REDACTED_KEY]')
  
  // Redact email addresses in text
  redacted = redacted.replace(/\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g, '[EMAIL_REDACTED]')
  
  return redacted
}

/**
 * Sanitize user input to prevent XSS and injection attacks
 */
export function sanitizeInput(input: string): string {
  if (!input) return input
  
  return input
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;')
}

/**
 * Check if user has access to sensitive data based on access level
 */
export function hasDataAccess(
  requiredLevel: 'public' | 'internal' | 'confidential' | 'restricted',
  userLevel: 'public' | 'internal' | 'confidential' | 'restricted' = 'public'
): boolean {
  const levels = {
    public: 0,
    internal: 1,
    confidential: 2,
    restricted: 3
  }
  
  return levels[userLevel] >= levels[requiredLevel]
}

/**
 * Mask company valuation for public display
 */
export function maskValuation(valuation: number): string {
  if (valuation === 0) return 'Not disclosed'
  
  if (valuation >= 1000000000) {
    const billions = Math.floor(valuation / 1000000000)
    return `$${billions}B+ valuation`
  }
  
  if (valuation >= 100000000) {
    return '$100M+ valuation'
  }
  
  return 'Undisclosed valuation'
}

/**
 * Protect investor information
 * Shows only public investors, masks private/confidential ones
 */
export function protectInvestorInfo(
  investors: string[],
  showAll: boolean = false
): string[] {
  if (showAll) return investors
  
  // Only show first 2 investors, mask others
  if (investors.length <= 2) return investors
  
  return [
    ...investors.slice(0, 2),
    `+${investors.length - 2} other investors`
  ]
}

/**
 * Mask executive compensation data
 */
export function maskCompensation(amount: number): string {
  if (amount === 0) return 'Not disclosed'
  return 'Confidential'
}

/**
 * Generate anonymized company ID for tracking without exposing real ID
 */
export function anonymizeCompanyId(companyId: string): string {
  // Simple hash-like transformation (in production, use proper hashing)
  const hash = companyId.split('').reduce((acc, char) => {
    return ((acc << 5) - acc) + char.charCodeAt(0)
  }, 0)
  
  return `anon_${Math.abs(hash).toString(36)}`
}

/**
 * Protect team member information
 * Shows only public roles, masks personal details
 */
export function protectTeamInfo(
  name: string,
  role: string,
  showFullName: boolean = false
): string {
  if (!name || name === 'Not disclosed') return 'Not disclosed'
  
  if (showFullName) return `${name} (${role})`
  
  // Show only first name and last initial
  const parts = name.split(' ')
  if (parts.length < 2) return `${name} (${role})`
  
  const firstName = parts[0]
  const lastInitial = parts[parts.length - 1][0]
  
  return `${firstName} ${lastInitial}. (${role})`
}

/**
 * Mask proprietary technology details
 */
export function maskTechDetails(description: string, showFull: boolean = false): string {
  if (showFull) return description
  
  // Replace specific technical details with generic terms
  let masked = description
    .replace(/\b[A-Z]{2,}\b/g, '[PROPRIETARY]') // Acronyms
    .replace(/\bversion \d+\.\d+\b/gi, 'version [X.X]')
    .replace(/\b\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}\b/g, '[IP_ADDRESS]') // IP addresses
  
  return masked
}

/**
 * Apply data protection based on configuration
 */
export function applyDataProtection<T extends Record<string, any>>(
  data: T,
  config: DataProtectionConfig = {}
): T {
  const {
    maskEmails = true,
    maskPhones = true,
    maskFinancials = true,
    redactSensitiveInfo: redact = true,
    accessLevel = 'public'
  } = config
  
  const protectedData: any = { ...data }
  
  // Apply email masking
  if (maskEmails && protectedData.email) {
    protectedData.email = maskEmail(protectedData.email)
  }
  
  // Apply phone masking
  if (maskPhones && protectedData.phone) {
    protectedData.phone = maskPhone(protectedData.phone)
  }
  
  // Apply financial masking
  if (maskFinancials) {
    if (protectedData.totalFunding) {
      protectedData.totalFunding = maskFinancialAmount(protectedData.totalFunding)
    }
    if (protectedData.valuation) {
      protectedData.valuation = maskValuation(protectedData.valuation)
    }
  }
  
  // Redact sensitive info from descriptions
  if (redact && protectedData.description) {
    protectedData.description = redactSensitiveInfo(protectedData.description)
  }
  
  return protectedData as T
}

/**
 * Log data access for audit trail (GDPR compliance)
 */
export function logDataAccess(
  userId: string,
  dataType: string,
  dataId: string,
  action: 'view' | 'export' | 'modify' | 'delete'
): void {
  // In production, send to audit logging service
  const logEntry = {
    timestamp: new Date().toISOString(),
    userId: anonymizeCompanyId(userId),
    dataType,
    dataId: anonymizeCompanyId(dataId),
    action,
    ip: '[MASKED]' // Mask IP in logs
  }
  
  console.log('[AUDIT]', logEntry)
}

/**
 * Check if data should be visible based on access control
 */
export function shouldShowData(
  dataClassification: 'public' | 'internal' | 'confidential' | 'restricted',
  userRole: 'viewer' | 'analyst' | 'admin' | 'owner' = 'viewer'
): boolean {
  const roleAccess = {
    viewer: ['public'],
    analyst: ['public', 'internal'],
    admin: ['public', 'internal', 'confidential'],
    owner: ['public', 'internal', 'confidential', 'restricted']
  }
  
  return roleAccess[userRole].includes(dataClassification)
}

/**
 * Encrypt sensitive data before storage (placeholder for actual encryption)
 */
export function encryptSensitiveData(data: string): string {
  // In production, use proper encryption (AES-256, etc.)
  // This is a placeholder
  return `[ENCRYPTED]${btoa(data)}`
}

/**
 * Decrypt sensitive data (placeholder for actual decryption)
 */
export function decryptSensitiveData(encryptedData: string): string {
  // In production, use proper decryption
  // This is a placeholder
  if (encryptedData.startsWith('[ENCRYPTED]')) {
    return atob(encryptedData.replace('[ENCRYPTED]', ''))
  }
  return encryptedData
}
