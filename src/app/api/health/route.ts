import { NextResponse } from 'next/server'

/**
 * Health Check API Endpoint
 * Used by Docker health checks and monitoring systems
 */
export async function GET() {
  try {
    const healthData = {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      version: process.env.npm_package_version || '1.0.0',
      environment: process.env.NODE_ENV || 'development',
      uptime: process.uptime(),
      memory: {
        used: Math.round(process.memoryUsage().heapUsed / 1024 / 1024),
        total: Math.round(process.memoryUsage().heapTotal / 1024 / 1024),
        external: Math.round(process.memoryUsage().external / 1024 / 1024)
      },
      services: {
        brightdata: process.env.BRIGHTDATA_API_KEY ? 'configured' : 'not-configured',
        crunchbase: process.env.CRUNCHBASE_API_KEY ? 'configured' : 'not-configured',
        database: process.env.DATABASE_URL ? 'configured' : 'not-configured'
      }
    }

    return NextResponse.json(healthData)
  } catch (error) {
    return NextResponse.json(
      {
        status: 'unhealthy',
        timestamp: new Date().toISOString(),
        error: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}