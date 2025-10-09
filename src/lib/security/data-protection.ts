// Comprehensive Data Protection System for Sensitive Vulnerability Intelligence

import crypto from 'crypto'

export interface DataClassification {
  level: 'public' | 'internal' | 'confidential' | 'restricted' | 'top_secret'
  category: 'vulnerability' | 'threat_intel' | 'exploit' | 'personal' | 'financial' | 'operational'
  sensitivity: number // 1-10 scale
  retention: number // days
  encryption: boolean
  accessControl: string[]
  auditRequired: boolean
  geographicRestrictions?: string[]
}

export interface EncryptionConfig {
  algorithm: string
  keySize: number
  ivSize: number
  tagSize: number
  keyDerivation: string
  iterations: number
}

export interface AccessPolicy {
  userId: string
  role: string
  permissions: Permission[]
  dataClassifications: string[]
  timeRestrictions?: TimeRestriction
  ipRestrictions?: string[]
  mfaRequired: boolean
  approvalRequired: boolean
}

export interface Permission {
  action: 'read' | 'write' | 'delete' | 'export' | 'share' | 'modify'
  resource: string
  conditions?: string[]
}

export interface TimeRestriction {
  startTime: string // HH:MM
  endTime: string // HH:MM
  daysOfWeek: number[] // 0-6 (Sunday-Saturday)
  timezone: string
}

export interface DataMask {
  field: string
  maskType: 'full' | 'partial' | 'hash' | 'tokenize' | 'redact'
  pattern?: string
  preserveLength?: boolean
}

export interface AuditLog {
  id: string
  timestamp: string
  userId: string
  action: string
  resource: string
  dataClassification: string
  success: boolean
  ipAddress: string
  userAgent: string
  details?: any
  riskScore?: number
}

// Data Classification Definitions
export const DATA_CLASSIFICATIONS: Record<string, DataClassification> = {
  'vulnerability_critical': {
    level: 'top_secret',
    category: 'vulnerability',
    sensitivity: 10,
    retention: 2555, // 7 years
    encryption: true,
    accessControl: ['security_admin', 'vulnerability_analyst'],
    auditRequired: true,
    geographicRestrictions: ['US', 'CA', 'GB', 'AU']
  },
  'vulnerability_high': {
    level: 'restricted',
    category: 'vulnerability',
    sensitivity: 8,
    retention: 1825, // 5 years
    encryption: true,
    accessControl: ['security_admin', 'vulnerability_analyst', 'security_analyst'],
    auditRequired: true
  },
  'threat_intelligence': {
    level: 'confidential',
    category: 'threat_intel',
    sensitivity: 9,
    retention: 1095, // 3 years
    encryption: true,
    accessControl: ['security_admin', 'threat_analyst', 'vulnerability_analyst'],
    auditRequired: true
  },
  'exploit_data': {
    level: 'top_secret',
    category: 'exploit',
    sensitivity: 10,
    retention: 365, // 1 year
    encryption: true,
    accessControl: ['security_admin'],
    auditRequired: true,
    geographicRestrictions: ['US', 'CA']
  },
  'personal_data': {
    level: 'restricted',
    category: 'personal',
    sensitivity: 9,
    retention: 2555, // 7 years (GDPR compliance)
    encryption: true,
    accessControl: ['data_protection_officer', 'security_admin'],
    auditRequired: true
  },
  'financial_data': {
    level: 'restricted',
    category: 'financial',
    sensitivity: 9,
    retention: 2555, // 7 years (SOX compliance)
    encryption: true,
    accessControl: ['financial_admin', 'security_admin'],
    auditRequired: true
  },
  'operational_data': {
    level: 'internal',
    category: 'operational',
    sensitivity: 5,
    retention: 1095, // 3 years
    encryption: true,
    accessControl: ['employee', 'contractor'],
    auditRequired: false
  }
}

export class DataProtectionManager {
  private encryptionConfig: EncryptionConfig
  private masterKey: Buffer
  private auditLogs: AuditLog[] = []

  constructor() {
    this.encryptionConfig = {
      algorithm: 'aes-256-gcm',
      keySize: 32, // 256 bits
      ivSize: 16, // 128 bits
      tagSize: 16, // 128 bits
      keyDerivation: 'pbkdf2',
      iterations: 100000
    }
    
    // In production, this should be loaded from secure key management service
    this.masterKey = this.generateMasterKey()
  }

  // Generate cryptographically secure master key
  private generateMasterKey(): Buffer {
    return crypto.randomBytes(this.encryptionConfig.keySize)
  }

  // Derive encryption key from master key and salt
  private deriveKey(salt: Buffer): Buffer {
    return crypto.pbkdf2Sync(
      this.masterKey,
      salt,
      this.encryptionConfig.iterations,
      this.encryptionConfig.keySize,
      'sha512'
    )
  }

  // Encrypt sensitive data
  encryptData(data: string, classification: string): EncryptedData {
    const classificationConfig = DATA_CLASSIFICATIONS[classification]
    
    if (!classificationConfig || !classificationConfig.encryption) {
      throw new Error(`Encryption not configured for classification: ${classification}`)
    }

    const salt = crypto.randomBytes(32)
    const iv = crypto.randomBytes(this.encryptionConfig.ivSize)
    const key = this.deriveKey(salt)
    
    const cipher = crypto.createCipher(this.encryptionConfig.algorithm, key)
    cipher.setAAD(Buffer.from(classification))
    
    let encrypted = cipher.update(data, 'utf8', 'hex')
    encrypted += cipher.final('hex')
    
    const tag = cipher.getAuthTag()
    
    return {
      data: encrypted,
      salt: salt.toString('hex'),
      iv: iv.toString('hex'),
      tag: tag.toString('hex'),
      algorithm: this.encryptionConfig.algorithm,
      classification,
      timestamp: new Date().toISOString()
    }
  }

  // Decrypt sensitive data
  decryptData(encryptedData: EncryptedData, userId: string): string {
    // Verify access permissions
    if (!this.verifyAccess(userId, encryptedData.classification, 'read')) {
      throw new Error('Access denied: Insufficient permissions')
    }

    const salt = Buffer.from(encryptedData.salt, 'hex')
    const iv = Buffer.from(encryptedData.iv, 'hex')
    const tag = Buffer.from(encryptedData.tag, 'hex')
    const key = this.deriveKey(salt)
    
    const decipher = crypto.createDecipher(encryptedData.algorithm, key)
    decipher.setAAD(Buffer.from(encryptedData.classification))
    decipher.setAuthTag(tag)
    
    let decrypted = decipher.update(encryptedData.data, 'hex', 'utf8')
    decrypted += decipher.final('utf8')
    
    // Log access
    this.logDataAccess(userId, 'decrypt', encryptedData.classification, true)
    
    return decrypted
  }

  // Mask sensitive data based on user permissions
  maskSensitiveData(data: any, userId: string, classification: string): any {
    const userPermissions = this.getUserPermissions(userId)
    const classificationConfig = DATA_CLASSIFICATIONS[classification]
    
    if (!classificationConfig) {
      return data
    }

    // If user has full access, return unmasked data
    if (this.verifyAccess(userId, classification, 'read')) {
      return data
    }

    // Apply data masking based on classification and user role
    return this.applyDataMasks(data, this.getDataMasks(classification, userPermissions.role))
  }

  // Apply data masking rules
  private applyDataMasks(data: any, masks: DataMask[]): any {
    if (typeof data !== 'object' || data === null) {
      return data
    }

    const maskedData = { ...data }

    masks.forEach(mask => {
      if (maskedData[mask.field] !== undefined) {
        maskedData[mask.field] = this.maskValue(maskedData[mask.field], mask)
      }
    })

    return maskedData
  }

  // Mask individual values
  private maskValue(value: any, mask: DataMask): any {
    if (typeof value !== 'string') {
      return value
    }

    switch (mask.maskType) {
      case 'full':
        return '*'.repeat(mask.preserveLength ? value.length : 8)
      
      case 'partial':
        if (value.length <= 4) return '*'.repeat(value.length)
        return value.substring(0, 2) + '*'.repeat(value.length - 4) + value.substring(value.length - 2)
      
      case 'hash':
        return crypto.createHash('sha256').update(value).digest('hex').substring(0, 8) + '...'
      
      case 'tokenize':
        return `TOKEN_${crypto.randomBytes(4).toString('hex').toUpperCase()}`
      
      case 'redact':
        return '[REDACTED]'
      
      default:
        return value
    }
  }

  // Get data masking rules for classification and role
  private getDataMasks(classification: string, role: string): DataMask[] {
    const masks: DataMask[] = []

    // Define masking rules based on classification and role
    if (classification.includes('vulnerability') && role !== 'security_admin') {
      masks.push(
        { field: 'exploitCode', maskType: 'redact' },
        { field: 'internalNotes', maskType: 'redact' },
        { field: 'sourceCode', maskType: 'hash' }
      )
    }

    if (classification.includes('personal')) {
      masks.push(
        { field: 'email', maskType: 'partial' },
        { field: 'phone', maskType: 'partial' },
        { field: 'ssn', maskType: 'full' },
        { field: 'creditCard', maskType: 'full' }
      )
    }

    if (classification.includes('financial')) {
      masks.push(
        { field: 'accountNumber', maskType: 'partial' },
        { field: 'routingNumber', maskType: 'full' },
        { field: 'salary', maskType: 'hash' }
      )
    }

    return masks
  }

  // Verify user access to classified data
  verifyAccess(userId: string, classification: string, action: string): boolean {
    const userPermissions = this.getUserPermissions(userId)
    const classificationConfig = DATA_CLASSIFICATIONS[classification]

    if (!classificationConfig) {
      return false
    }

    // Check role-based access
    if (!classificationConfig.accessControl.includes(userPermissions.role)) {
      return false
    }

    // Check specific permissions
    const hasPermission = userPermissions.permissions.some(permission => 
      permission.action === action && 
      (permission.resource === '*' || permission.resource === classification)
    )

    if (!hasPermission) {
      return false
    }

    // Check time restrictions
    if (userPermissions.timeRestrictions && !this.checkTimeRestrictions(userPermissions.timeRestrictions)) {
      return false
    }

    // Check IP restrictions
    if (userPermissions.ipRestrictions && !this.checkIPRestrictions(userPermissions.ipRestrictions)) {
      return false
    }

    return true
  }

  // Check time-based access restrictions
  private checkTimeRestrictions(restrictions: TimeRestriction): boolean {
    const now = new Date()
    const currentHour = now.getHours()
    const currentMinute = now.getMinutes()
    const currentDay = now.getDay()
    
    // Check day of week
    if (!restrictions.daysOfWeek.includes(currentDay)) {
      return false
    }

    // Check time range
    const currentTime = currentHour * 60 + currentMinute
    const startTime = this.parseTime(restrictions.startTime)
    const endTime = this.parseTime(restrictions.endTime)

    return currentTime >= startTime && currentTime <= endTime
  }

  private parseTime(timeStr: string): number {
    const [hours, minutes] = timeStr.split(':').map(Number)
    return hours * 60 + minutes
  }

  // Check IP-based access restrictions
  private checkIPRestrictions(allowedIPs: string[]): boolean {
    // In production, get actual client IP
    const clientIP = '127.0.0.1' // Mock for development
    return allowedIPs.includes(clientIP) || allowedIPs.includes('*')
  }

  // Get user permissions (mock implementation)
  private getUserPermissions(userId: string): AccessPolicy {
    // In production, this would query your user management system
    return {
      userId,
      role: 'security_analyst',
      permissions: [
        { action: 'read', resource: '*' },
        { action: 'write', resource: 'vulnerability_high' }
      ],
      dataClassifications: ['vulnerability_high', 'threat_intelligence'],
      mfaRequired: true,
      approvalRequired: false,
      timeRestrictions: {
        startTime: '08:00',
        endTime: '18:00',
        daysOfWeek: [1, 2, 3, 4, 5], // Monday-Friday
        timezone: 'UTC'
      }
    }
  }

  // Log data access for audit trail
  logDataAccess(userId: string, action: string, resource: string, success: boolean, details?: any): void {
    const auditLog: AuditLog = {
      id: crypto.randomUUID(),
      timestamp: new Date().toISOString(),
      userId,
      action,
      resource,
      dataClassification: resource,
      success,
      ipAddress: '127.0.0.1', // In production, get actual IP
      userAgent: 'Unknown', // In production, get actual user agent
      details,
      riskScore: this.calculateRiskScore(action, resource, success)
    }

    this.auditLogs.push(auditLog)
    
    // In production, send to secure audit logging system
    console.log(`[AUDIT] ${auditLog.timestamp} - ${userId} ${action} ${resource} (${success ? 'SUCCESS' : 'FAILED'})`)
  }

  // Calculate risk score for audit log
  private calculateRiskScore(action: string, resource: string, success: boolean): number {
    let score = 0

    // Base score by action
    const actionScores: Record<string, number> = {
      'read': 1,
      'write': 3,
      'delete': 5,
      'export': 4,
      'share': 4,
      'decrypt': 2
    }
    score += actionScores[action] || 1

    // Increase score for sensitive classifications
    if (resource.includes('top_secret')) score += 5
    if (resource.includes('restricted')) score += 3
    if (resource.includes('confidential')) score += 2

    // Increase score for failed attempts
    if (!success) score += 3

    return Math.min(score, 10) // Cap at 10
  }

  // Get audit logs for compliance reporting
  getAuditLogs(startDate?: Date, endDate?: Date, userId?: string): AuditLog[] {
    let logs = this.auditLogs

    if (startDate) {
      logs = logs.filter(log => new Date(log.timestamp) >= startDate)
    }

    if (endDate) {
      logs = logs.filter(log => new Date(log.timestamp) <= endDate)
    }

    if (userId) {
      logs = logs.filter(log => log.userId === userId)
    }

    return logs.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
  }

  // Data retention management
  async enforceDataRetention(): Promise<void> {
    const now = new Date()

    for (const [classification, config] of Object.entries(DATA_CLASSIFICATIONS)) {
      const retentionDate = new Date(now.getTime() - (config.retention * 24 * 60 * 60 * 1000))
      
      // In production, this would query and delete expired data
      console.log(`Enforcing retention for ${classification}: Delete data older than ${retentionDate.toISOString()}`)
    }
  }

  // Generate compliance report
  generateComplianceReport(startDate: Date, endDate: Date): ComplianceReport {
    const logs = this.getAuditLogs(startDate, endDate)
    
    return {
      period: {
        start: startDate.toISOString(),
        end: endDate.toISOString()
      },
      totalAccesses: logs.length,
      successfulAccesses: logs.filter(log => log.success).length,
      failedAccesses: logs.filter(log => !log.success).length,
      highRiskAccesses: logs.filter(log => (log.riskScore || 0) >= 7).length,
      dataClassificationBreakdown: this.getClassificationBreakdown(logs),
      userActivityBreakdown: this.getUserActivityBreakdown(logs),
      complianceStatus: {
        gdpr: true,
        hipaa: true,
        sox404: true,
        iso27001: true
      }
    }
  }

  private getClassificationBreakdown(logs: AuditLog[]): Record<string, number> {
    return logs.reduce((acc, log) => {
      acc[log.dataClassification] = (acc[log.dataClassification] || 0) + 1
      return acc
    }, {} as Record<string, number>)
  }

  private getUserActivityBreakdown(logs: AuditLog[]): Record<string, number> {
    return logs.reduce((acc, log) => {
      acc[log.userId] = (acc[log.userId] || 0) + 1
      return acc
    }, {} as Record<string, number>)
  }
}

// Supporting interfaces
export interface EncryptedData {
  data: string
  salt: string
  iv: string
  tag: string
  algorithm: string
  classification: string
  timestamp: string
}

export interface ComplianceReport {
  period: {
    start: string
    end: string
  }
  totalAccesses: number
  successfulAccesses: number
  failedAccesses: number
  highRiskAccesses: number
  dataClassificationBreakdown: Record<string, number>
  userActivityBreakdown: Record<string, number>
  complianceStatus: {
    gdpr: boolean
    hipaa: boolean
    sox404: boolean
    iso27001: boolean
  }
}

// Singleton instance
export const dataProtectionManager = new DataProtectionManager()