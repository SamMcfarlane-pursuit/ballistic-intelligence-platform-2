import { NextRequest, NextResponse } from 'next/server'

// Security configuration
export const securityConfig = {
  // CORS configuration
  cors: {
    origin: process.env.NODE_ENV === 'production' 
      ? ['https://yourdomain.com'] 
      : ['http://localhost:3000'],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
    credentials: true,
    maxAge: 86400 // 24 hours
  },

  // Rate limiting
  rateLimit: {
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per windowMs
    message: 'Too many requests from this IP, please try again later.'
  },

  // Security headers
  headers: {
    'X-DNS-Prefetch-Control': 'on',
    'Strict-Transport-Security': 'max-age=63072000; includeSubDomains; preload',
    'X-Frame-Options': 'SAMEORIGIN',
    'X-Content-Type-Options': 'nosniff',
    'Referrer-Policy': 'origin-when-cross-origin',
    'Permissions-Policy': 'camera=(), microphone=(), geolocation=()',
    'X-XSS-Protection': '1; mode=block'
  },

  // Encryption settings
  encryption: {
    algorithm: 'aes-256-gcm',
    keyLength: 32, // 256 bits
    ivLength: 16, // 128 bits
    tagLength: 16 // 128 bits
  }
}

// Rate limiting store (in-memory for demo, use Redis in production)
const rateLimitStore = new Map<string, { count: number; resetTime: number }>()

// Security middleware
export async function securityMiddleware(request: NextRequest): Promise<NextResponse | null> {
  const ip = request.ip || 'unknown'
  const url = request.nextUrl.pathname
  
  // Skip security checks for health checks and static assets
  if (url === '/api/health' || url.startsWith('/_next/') || url.startsWith('/static/')) {
    return null
  }

  // Apply rate limiting
  const rateLimitResult = await checkRateLimit(ip)
  if (!rateLimitResult.allowed) {
    return NextResponse.json(
      { error: securityConfig.rateLimit.message },
      { status: 429 }
    )
  }

  // Add security headers
  const response = NextResponse.next()
  Object.entries(securityConfig.headers).forEach(([key, value]) => {
    response.headers.set(key, value)
  })

  return null
}

// Rate limiting check
async function checkRateLimit(ip: string): Promise<{ allowed: boolean; remaining: number }> {
  const now = Date.now()
  const windowStart = now - securityConfig.rateLimit.windowMs
  
  let record = rateLimitStore.get(ip)
  
  // Reset if window has passed
  if (!record || record.resetTime < now) {
    record = {
      count: 1,
      resetTime: now + securityConfig.rateLimit.windowMs
    }
    rateLimitStore.set(ip, record)
    return { allowed: true, remaining: securityConfig.rateLimit.max - 1 }
  }
  
  // Increment count
  record.count++
  
  if (record.count > securityConfig.rateLimit.max) {
    return { allowed: false, remaining: 0 }
  }
  
  return { allowed: true, remaining: securityConfig.rateLimit.max - record.count }
}

// Input validation and sanitization
export function validateAndSanitize(input: string, type: 'email' | 'url' | 'text' | 'id'): string | null {
  if (!input || typeof input !== 'string') {
    return null
  }

  const trimmed = input.trim()
  
  switch (type) {
    case 'email':
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      return emailRegex.test(trimmed) ? trimmed : null
      
    case 'url':
      try {
        const url = new URL(trimmed)
        return ['http:', 'https:'].includes(url.protocol) ? trimmed : null
      } catch {
        return null
      }
      
    case 'id':
      // Allow alphanumeric, hyphens, and underscores
      const idRegex = /^[a-zA-Z0-9_-]+$/
      return idRegex.test(trimmed) && trimmed.length <= 50 ? trimmed : null
      
    case 'text':
      // Remove potentially dangerous characters
      return trimmed
        .replace(/[<>]/g, '') // Remove < and >
        .replace(/javascript:/gi, '') // Remove javascript: protocol
        .replace(/on\w+\s*=/gi, '') // Remove event handlers
        .substring(0, 1000) // Limit length
      
    default:
      return null
  }
}

// Data encryption utilities
export async function encryptData(data: string, key: string): Promise<string> {
  // In a real implementation, use a proper encryption library
  // This is a placeholder for demonstration
  const encoder = new TextEncoder()
  const dataBuffer = encoder.encode(data)
  const keyBuffer = encoder.encode(key.padEnd(32, '0').slice(0, 32))
  
  // Simple XOR encryption for demo (NOT secure for production)
  const encrypted = new Uint8Array(dataBuffer.length)
  for (let i = 0; i < dataBuffer.length; i++) {
    encrypted[i] = dataBuffer[i] ^ keyBuffer[i % keyBuffer.length]
  }
  
  return btoa(String.fromCharCode(...encrypted))
}

export async function decryptData(encryptedData: string, key: string): Promise<string> {
  // In a real implementation, use a proper decryption library
  const encrypted = atob(encryptedData)
  const encryptedBuffer = new Uint8Array(encrypted.split('').map(char => char.charCodeAt(0)))
  const keyBuffer = new TextEncoder().encode(key.padEnd(32, '0').slice(0, 32))
  
  // Simple XOR decryption for demo (NOT secure for production)
  const decrypted = new Uint8Array(encryptedBuffer.length)
  for (let i = 0; i < encryptedBuffer.length; i++) {
    decrypted[i] = encryptedBuffer[i] ^ keyBuffer[i % keyBuffer.length]
  }
  
  return new TextDecoder().decode(decrypted)
}

// Audit logging
export interface AuditLog {
  id: string
  timestamp: string
  userId?: string
  action: string
  resource: string
  details: Record<string, any>
  ipAddress: string
  userAgent: string
  result: 'success' | 'failure'
}

const auditLogs: AuditLog[] = []

export function logAuditEvent(
  action: string,
  resource: string,
  details: Record<string, any>,
  result: 'success' | 'failure' = 'success',
  userId?: string,
  request?: NextRequest
): void {
  const auditLog: AuditLog = {
    id: crypto.randomUUID(),
    timestamp: new Date().toISOString(),
    userId,
    action,
    resource,
    details,
    ipAddress: request?.ip || 'unknown',
    userAgent: request?.headers.get('user-agent') || 'unknown',
    result
  }
  
  auditLogs.push(auditLog)
  
  // In production, you would send this to a logging service
  console.log('Audit Event:', JSON.stringify(auditLog, null, 2))
}

// Security monitoring
export function getSecurityMetrics() {
  return {
    totalRequests: auditLogs.length,
    failedRequests: auditLogs.filter(log => log.result === 'failure').length,
    uniqueIPs: new Set(auditLogs.map(log => log.ipAddress)).size,
    recentActivity: auditLogs.slice(-10), // Last 10 events
    rateLimitViolations: rateLimitStore.size
  }
}

// CSRF Protection
export function generateCSRFToken(): string {
  return crypto.randomUUID()
}

export function validateCSRFToken(token: string, sessionToken: string): boolean {
  return token === sessionToken
}

// Security health check
export async function securityHealthCheck(): Promise<{
  status: 'healthy' | 'degraded' | 'unhealthy'
  checks: Record<string, boolean>
  timestamp: string
}> {
  const checks = {
    rateLimiting: rateLimitStore.size < 1000, // Not too many IPs tracked
    auditLogging: auditLogs.length < 10000, // Not too many logs
    headersConfigured: Object.keys(securityConfig.headers).length > 0,
    encryptionReady: !!process.env.ENCRYPTION_KEY
  }
  
  const failedChecks = Object.values(checks).filter(check => !check).length
  
  let status: 'healthy' | 'degraded' | 'unhealthy' = 'healthy'
  if (failedChecks > 2) status = 'unhealthy'
  else if (failedChecks > 0) status = 'degraded'
  
  return {
    status,
    checks,
    timestamp: new Date().toISOString()
  }
}