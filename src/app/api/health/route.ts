import { NextResponse } from 'next/server'

export async function GET() {
  try {
    // Basic health check
    const healthData = {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      environment: process.env.NODE_ENV || 'development',
      version: process.env.npm_package_version || '1.0.0',
      services: {
        database: 'connected', // TODO: Add actual database health check
        brightdata: 'available', // TODO: Add BrightData API health check
        crunchbase: 'available' // TODO: Add Crunchbase API health check
      },
      features: {
        technologyTrends: true,
        companyIntelligence: true,
        patentAnalysis: true,
        sectorAnalysis: true,
        dataIntelligence: true
      }
    }

    return NextResponse.json(healthData, { status: 200 })
  } catch (error) {
    console.error('Health check failed:', error)
    
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