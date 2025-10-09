// Advanced Security Configuration for Vulnerability Intelligence Platform

export interface SecurityConfig {
  https: HTTPSConfig
  headers: SecurityHeaders
  authentication: AuthConfig
  encryption: EncryptionConfig
  monitoring: SecurityMonitoring
  compliance: ComplianceConfig
}

export interface HTTPSConfig {
  enforceHTTPS: boolean
  hstsMaxAge: number
  includeSubdomains: boolean
  preload: boolean
  upgradeInsecureRequests: boolean
  certificateValidation: CertificateConfig
}

export interface CertificateConfig {
  validateChain: boolean
  checkRevocation: boolean
  allowSelfSigned: boolean
  minimumKeySize: number
  allowedCipherSuites: string[]
  tlsVersion: string
}

export interface SecurityHeaders {
  contentSecurityPolicy: CSPConfig
  strictTransportSecurity: boolean
  xFrameOptions: string
  xContentTypeOptions: boolean
  referrerPolicy: string
  permissionsPolicy: string[]
  crossOriginEmbedderPolicy: string
  crossOriginOpenerPolicy: string
}

export interface CSPConfig {
  defaultSrc: string[]
  scriptSrc: string[]
  styleSrc: string[]
  imgSrc: string[]
  connectSrc: string[]
  fontSrc: string[]
  objectSrc: string[]
  mediaSrc: string[]
  frameSrc: string[]
  reportUri?: string
  reportOnly: boolean
}

export interface AuthConfig {
  requireAuthentication: boolean
  sessionTimeout: number
  maxLoginAttempts: number
  lockoutDuration: number
  passwordPolicy: PasswordPolicy
  mfaRequired: boolean
  allowedOrigins: string[]
}

export interface PasswordPolicy {
  minLength: number
  requireUppercase: boolean
  requireLowercase: boolean
  requireNumbers: boolean
  requireSpecialChars: boolean
  preventReuse: number
  maxAge: number
}

export interface EncryptionConfig {
  dataAtRest: boolean
  dataInTransit: boolean
  keyRotationInterval: number
  encryptionAlgorithm: string
  keySize: number
  saltRounds: number
}

export interface SecurityMonitoring {
  logSecurityEvents: boolean
  detectAnomalies: boolean
  rateLimiting: RateLimitConfig
  ipWhitelist: string[]
  ipBlacklist: string[]
  geoBlocking: string[]
}

export interface RateLimitConfig {
  requestsPerMinute: number
  requestsPerHour: number
  requestsPerDay: number
  burstLimit: number
  windowSize: number
}

export interface ComplianceConfig {
  gdprCompliant: boolean
  hipaaCompliant: boolean
  sox404Compliant: boolean
  iso27001Compliant: boolean
  auditLogging: boolean
  dataRetentionPeriod: number
}

// Default Security Configuration
export const defaultSecurityConfig: SecurityConfig = {
  https: {
    enforceHTTPS: true,
    hstsMaxAge: 31536000, // 1 year
    includeSubdomains: true,
    preload: true,
    upgradeInsecureRequests: true,
    certificateValidation: {
      validateChain: true,
      checkRevocation: true,
      allowSelfSigned: false,
      minimumKeySize: 2048,
      allowedCipherSuites: [
        'TLS_AES_256_GCM_SHA384',
        'TLS_CHACHA20_POLY1305_SHA256',
        'TLS_AES_128_GCM_SHA256',
        'ECDHE-RSA-AES256-GCM-SHA384',
        'ECDHE-RSA-AES128-GCM-SHA256'
      ],
      tlsVersion: '1.3'
    }
  },
  headers: {
    contentSecurityPolicy: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-inline'", "'unsafe-eval'", "https://cdn.jsdelivr.net"],
      styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
      imgSrc: ["'self'", "data:", "https:"],
      connectSrc: ["'self'", "https://api.github.com", "https://api.nvd.nist.gov"],
      fontSrc: ["'self'", "https://fonts.gstatic.com"],
      objectSrc: ["'none'"],
      mediaSrc: ["'self'"],
      frameSrc: ["'none'"],
      reportUri: '/api/security/csp-report',
      reportOnly: false
    },
    strictTransportSecurity: true,
    xFrameOptions: 'DENY',
    xContentTypeOptions: true,
    referrerPolicy: 'strict-origin-when-cross-origin',
    permissionsPolicy: [
      'camera=()',
      'microphone=()',
      'geolocation=()',
      'payment=()',
      'usb=()'
    ],
    crossOriginEmbedderPolicy: 'require-corp',
    crossOriginOpenerPolicy: 'same-origin'
  },
  authentication: {
    requireAuthentication: true,
    sessionTimeout: 3600, // 1 hour
    maxLoginAttempts: 5,
    lockoutDuration: 900, // 15 minutes
    passwordPolicy: {
      minLength: 12,
      requireUppercase: true,
      requireLowercase: true,
      requireNumbers: true,
      requireSpecialChars: true,
      preventReuse: 5,
      maxAge: 7776000 // 90 days
    },
    mfaRequired: true,
    allowedOrigins: ['https://localhost:3000', 'https://your-domain.com']
  },
  encryption: {
    dataAtRest: true,
    dataInTransit: true,
    keyRotationInterval: 2592000, // 30 days
    encryptionAlgorithm: 'AES-256-GCM',
    keySize: 256,
    saltRounds: 12
  },
  monitoring: {
    logSecurityEvents: true,
    detectAnomalies: true,
    rateLimiting: {
      requestsPerMinute: 100,
      requestsPerHour: 1000,
      requestsPerDay: 10000,
      burstLimit: 20,
      windowSize: 60
    },
    ipWhitelist: [],
    ipBlacklist: [],
    geoBlocking: ['CN', 'RU', 'KP'] // Example: Block high-risk countries
  },
  compliance: {
    gdprCompliant: true,
    hipaaCompliant: true,
    sox404Compliant: true,
    iso27001Compliant: true,
    auditLogging: true,
    dataRetentionPeriod: 2592000000 // 30 days in milliseconds
  }
}

export class SecurityManager {
  private config: SecurityConfig

  constructor(config: SecurityConfig = defaultSecurityConfig) {
    this.config = config
  }

  // Generate Content Security Policy header
  generateCSPHeader(): string {
    const csp = this.config.headers.contentSecurityPolicy
    const directives = [
      `default-src ${csp.defaultSrc.join(' ')}`,
      `script-src ${csp.scriptSrc.join(' ')}`,
      `style-src ${csp.styleSrc.join(' ')}`,
      `img-src ${csp.imgSrc.join(' ')}`,
      `connect-src ${csp.connectSrc.join(' ')}`,
      `font-src ${csp.fontSrc.join(' ')}`,
      `object-src ${csp.objectSrc.join(' ')}`,
      `media-src ${csp.mediaSrc.join(' ')}`,
      `frame-src ${csp.frameSrc.join(' ')}`
    ]

    if (csp.reportUri) {
      directives.push(`report-uri ${csp.reportUri}`)
    }

    return directives.join('; ')
  }

  // Generate Strict Transport Security header
  generateHSTSHeader(): string {
    const hsts = this.config.https
    let header = `max-age=${hsts.hstsMaxAge}`
    
    if (hsts.includeSubdomains) {
      header += '; includeSubDomains'
    }
    
    if (hsts.preload) {
      header += '; preload'
    }
    
    return header
  }

  // Generate Permissions Policy header
  generatePermissionsPolicyHeader(): string {
    return this.config.headers.permissionsPolicy.join(', ')
  }

  // Validate HTTPS connection
  validateHTTPS(request: Request): boolean {
    const url = new URL(request.url)
    return url.protocol === 'https:' || this.config.https.enforceHTTPS
  }

  // Check rate limiting
  checkRateLimit(clientId: string, requestCount: number): boolean {
    const limits = this.config.monitoring.rateLimiting
    return requestCount <= limits.requestsPerMinute
  }

  // Validate IP address
  validateIP(ip: string): boolean {
    const monitoring = this.config.monitoring
    
    // Check whitelist first
    if (monitoring.ipWhitelist.length > 0) {
      return monitoring.ipWhitelist.includes(ip)
    }
    
    // Check blacklist
    if (monitoring.ipBlacklist.includes(ip)) {
      return false
    }
    
    return true
  }

  // Generate security headers for response
  getSecurityHeaders(): Record<string, string> {
    const headers: Record<string, string> = {}
    
    // Content Security Policy
    const cspHeader = this.generateCSPHeader()
    headers[this.config.headers.contentSecurityPolicy.reportOnly ? 'Content-Security-Policy-Report-Only' : 'Content-Security-Policy'] = cspHeader
    
    // Strict Transport Security
    if (this.config.headers.strictTransportSecurity) {
      headers['Strict-Transport-Security'] = this.generateHSTSHeader()
    }
    
    // X-Frame-Options
    headers['X-Frame-Options'] = this.config.headers.xFrameOptions
    
    // X-Content-Type-Options
    if (this.config.headers.xContentTypeOptions) {
      headers['X-Content-Type-Options'] = 'nosniff'
    }
    
    // Referrer Policy
    headers['Referrer-Policy'] = this.config.headers.referrerPolicy
    
    // Permissions Policy
    headers['Permissions-Policy'] = this.generatePermissionsPolicyHeader()
    
    // Cross-Origin Embedder Policy
    headers['Cross-Origin-Embedder-Policy'] = this.config.headers.crossOriginEmbedderPolicy
    
    // Cross-Origin Opener Policy
    headers['Cross-Origin-Opener-Policy'] = this.config.headers.crossOriginOpenerPolicy
    
    // Additional security headers
    headers['X-XSS-Protection'] = '1; mode=block'
    headers['X-DNS-Prefetch-Control'] = 'off'
    headers['X-Download-Options'] = 'noopen'
    headers['X-Permitted-Cross-Domain-Policies'] = 'none'
    
    return headers
  }

  // Log security event
  logSecurityEvent(event: SecurityEvent): void {
    if (this.config.monitoring.logSecurityEvents) {
      console.log(`[SECURITY] ${new Date().toISOString()} - ${event.type}: ${event.message}`, {
        ip: event.ip,
        userAgent: event.userAgent,
        severity: event.severity,
        details: event.details
      })
    }
  }

  // Validate certificate
  validateCertificate(cert: any): boolean {
    const certConfig = this.config.https.certificateValidation
    
    // Check key size
    if (cert.keySize < certConfig.minimumKeySize) {
      return false
    }
    
    // Check cipher suite
    if (!certConfig.allowedCipherSuites.includes(cert.cipherSuite)) {
      return false
    }
    
    // Check TLS version
    if (cert.tlsVersion < certConfig.tlsVersion) {
      return false
    }
    
    return true
  }
}

export interface SecurityEvent {
  type: 'authentication' | 'authorization' | 'data_access' | 'system' | 'network'
  message: string
  ip?: string
  userAgent?: string
  severity: 'low' | 'medium' | 'high' | 'critical'
  details?: any
}

// Security middleware factory
export function createSecurityMiddleware(config?: SecurityConfig) {
  const securityManager = new SecurityManager(config)
  
  return function securityMiddleware(request: Request): Response | null {
    // Validate HTTPS
    if (!securityManager.validateHTTPS(request)) {
      return new Response('HTTPS Required', { 
        status: 426,
        headers: { 'Upgrade': 'TLS/1.3, HTTP/1.1' }
      })
    }
    
    // Validate IP
    const clientIP = request.headers.get('x-forwarded-for') || 'unknown'
    if (!securityManager.validateIP(clientIP)) {
      securityManager.logSecurityEvent({
        type: 'network',
        message: 'Blocked request from blacklisted IP',
        ip: clientIP,
        severity: 'medium'
      })
      return new Response('Access Denied', { status: 403 })
    }
    
    return null // Continue processing
  }
}

export { SecurityManager as default }