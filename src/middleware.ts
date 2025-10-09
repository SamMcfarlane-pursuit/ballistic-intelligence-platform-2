import { NextRequest, NextResponse } from 'next/server'
import { SecurityManager, defaultSecurityConfig } from './lib/security/security-config'

// Initialize security manager
const securityManager = new SecurityManager(defaultSecurityConfig)

export function middleware(request: NextRequest) {
  const response = NextResponse.next()
  
  // Force HTTPS redirect in production
  if (process.env.NODE_ENV === 'production' && request.nextUrl.protocol === 'http:') {
    const httpsUrl = new URL(request.url)
    httpsUrl.protocol = 'https:'
    return NextResponse.redirect(httpsUrl, 301)
  }
  
  // Get client IP
  const clientIP = request.ip || 
                   request.headers.get('x-forwarded-for')?.split(',')[0] || 
                   request.headers.get('x-real-ip') || 
                   'unknown'
  
  // Validate IP address
  if (!securityManager.validateIP(clientIP)) {
    securityManager.logSecurityEvent({
      type: 'network',
      message: 'Blocked request from unauthorized IP',
      ip: clientIP,
      userAgent: request.headers.get('user-agent') || 'unknown',
      severity: 'medium'
    })
    return new NextResponse('Access Denied', { status: 403 })
  }
  
  // Rate limiting check (simplified)
  const userAgent = request.headers.get('user-agent') || ''
  if (userAgent.includes('bot') && !userAgent.includes('Googlebot')) {
    // Block suspicious bots
    return new NextResponse('Access Denied', { status: 403 })
  }
  
  // Apply security headers
  const securityHeaders = securityManager.getSecurityHeaders()
  Object.entries(securityHeaders).forEach(([key, value]) => {
    response.headers.set(key, value)
  })
  
  // Additional security headers for vulnerability intelligence platform
  response.headers.set('X-Robots-Tag', 'noindex, nofollow, nosnippet, noarchive')
  response.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate')
  response.headers.set('Pragma', 'no-cache')
  response.headers.set('Expires', '0')
  
  // Log security event for sensitive paths
  const sensitivePathPatterns = [
    '/vulnerabilities',
    '/intelligence-center',
    '/ai-agents',
    '/threat-intelligence',
    '/api/'
  ]
  
  const isSensitivePath = sensitivePathPatterns.some(pattern => 
    request.nextUrl.pathname.startsWith(pattern)
  )
  
  if (isSensitivePath) {
    securityManager.logSecurityEvent({
      type: 'data_access',
      message: `Access to sensitive path: ${request.nextUrl.pathname}`,
      ip: clientIP,
      userAgent: request.headers.get('user-agent') || 'unknown',
      severity: 'low',
      details: {
        path: request.nextUrl.pathname,
        method: request.method,
        timestamp: new Date().toISOString()
      }
    })
  }
  
  return response
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
}