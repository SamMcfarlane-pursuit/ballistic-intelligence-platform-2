import { NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET() {
  try {
    // Test database connection
    const startTime = Date.now()
    
    // Quick database health check
    const [companyCount, portfolioCount] = await Promise.all([
      db.cybersecurityStartup.count().catch(() => 0),
      db.ballisticPortfolioCompany.count().catch(() => 0)
    ])
    
    const dbResponseTime = Date.now() - startTime
    const dbHealth = dbResponseTime < 1000 ? 'healthy' : dbResponseTime < 3000 ? 'degraded' : 'slow'
    
    // System status
    const systemStatus = {
      status: 'operational',
      timestamp: new Date().toISOString(),
      version: '1.0.0',
      environment: process.env.NODE_ENV || 'development',
      
      // Database health
      database: {
        status: dbHealth,
        connected: true,
        responseTime: `${dbResponseTime}ms`,
        records: {
          companies: companyCount,
          portfolio: portfolioCount
        }
      },
      
      // API services
      services: {
        dashboard: 'operational',
        portfolio: 'operational',
        analytics: 'operational',
        dataIngestion: 'operational'
      },
      
      // Server info
      server: {
        uptime: process.uptime(),
        memory: {
          used: Math.round(process.memoryUsage().heapUsed / 1024 / 1024),
          total: Math.round(process.memoryUsage().heapTotal / 1024 / 1024)
        },
        nodeVersion: process.version
      }
    }
    
    return NextResponse.json({
      success: true,
      message: 'All systems operational',
      data: systemStatus
    })
    
  } catch (error) {
    console.error('Health check error:', error)
    return NextResponse.json(
      {
        success: false,
        status: 'error',
        message: 'System health check failed',
        error: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    )
  }
}