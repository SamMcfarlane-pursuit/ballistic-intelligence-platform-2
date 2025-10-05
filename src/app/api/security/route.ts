import { NextRequest, NextResponse } from 'next/server'
import { securityHealthCheck, getSecurityMetrics } from '@/lib/security'
import { logAuditEvent } from '@/lib/security'

export async function GET(request: NextRequest) {
  try {
    logAuditEvent('security_metrics_access', '/api/security', {}, 'success', undefined, request)
    
    const [healthCheck, metrics] = await Promise.all([
      securityHealthCheck(),
      Promise.resolve(getSecurityMetrics())
    ])
    
    return NextResponse.json({
      success: true,
      data: {
        health: healthCheck,
        metrics
      }
    })
  } catch (error) {
    console.error('Error fetching security metrics:', error)
    logAuditEvent('security_metrics_error', '/api/security', { 
      error: error instanceof Error ? error.message : 'Unknown error'
    }, 'failure', undefined, request)
    
    return NextResponse.json(
      { error: 'Failed to fetch security metrics' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { action } = body
    
    if (!action || typeof action !== 'string') {
      logAuditEvent('invalid_security_action', '/api/security', { action: 'missing' }, 'failure', undefined, request)
      return NextResponse.json({ error: 'Action is required' }, { status: 400 })
    }
    
    switch (action) {
      case 'clear-logs':
        // In a real implementation, you would clear old logs from the database
        logAuditEvent('security_logs_cleared', '/api/security', {}, 'success', undefined, request)
        return NextResponse.json({ success: true, message: 'Security logs cleared' })
        
      case 'export-logs':
        // In a real implementation, you would export logs to a secure location
        logAuditEvent('security_logs_exported', '/api/security', {}, 'success', undefined, request)
        return NextResponse.json({ 
          success: true, 
          message: 'Security logs exported',
          data: {
            exportTime: new Date().toISOString(),
            format: 'json'
          }
        })
        
      default:
        logAuditEvent('unknown_security_action', '/api/security', { action }, 'failure', undefined, request)
        return NextResponse.json({ error: 'Unknown action' }, { status: 400 })
    }
  } catch (error) {
    console.error('Error in security endpoint:', error)
    logAuditEvent('security_endpoint_error', '/api/security', { 
      error: error instanceof Error ? error.message : 'Unknown error'
    }, 'failure', undefined, request)
    
    return NextResponse.json(
      { error: 'Security operation failed' },
      { status: 500 }
    )
  }
}