import { NextRequest, NextResponse } from 'next/server'
import { crunchbaseService } from '@/services/crunchbase-service'

/**
 * Crunchbase API Endpoint
 * Provides access to Crunchbase cybersecurity company data
 */

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const action = searchParams.get('action') || 'search'
    const query = searchParams.get('query') || ''
    const limit = parseInt(searchParams.get('limit') || '50')
    const page = parseInt(searchParams.get('page') || '1')
    const uuid = searchParams.get('uuid') || ''
    const timeframe = (searchParams.get('timeframe') || '6m') as '1m' | '3m' | '6m' | '1y' | 'all'

    switch (action) {
      case 'search':
        return await searchOrganizations(query, limit, page)
      
      case 'organization':
        return await getOrganization(uuid)
      
      case 'funding-rounds':
        return await getFundingRounds(uuid)
      
      case 'investors':
        return await getInvestors(uuid)
      
      case 'funding-analysis':
        return await getFundingAnalysis(timeframe)
      
      case 'real-time-alerts':
        return await getRealTimeAlerts()
      
      case 'monitor':
        const companies = searchParams.get('companies')?.split(',') || []
        return await monitorCompanies(companies)
      
      case 'health':
        return await getHealthStatus()
      
      default:
        return NextResponse.json({
          success: false,
          error: 'Invalid action'
        }, { status: 400 })
    }
  } catch (error) {
    console.error('Crunchbase API error:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Crunchbase API request failed',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}

/**
 * Search for cybersecurity organizations
 */
async function searchOrganizations(query: string, limit: number, page: number) {
  try {
    const result = await crunchbaseService.searchCybersecurityOrganizations(query, limit, page)
    
    return NextResponse.json({
      success: true,
      data: result,
      timestamp: new Date().toISOString()
    })
  } catch (error) {
    throw error
  }
}

/**
 * Get organization details
 */
async function getOrganization(uuid: string) {
  try {
    if (!uuid) {
      return NextResponse.json({
        success: false,
        error: 'Organization UUID required'
      }, { status: 400 })
    }

    const organization = await crunchbaseService.getOrganization(uuid)
    
    if (!organization) {
      return NextResponse.json({
        success: false,
        error: 'Organization not found'
      }, { status: 404 })
    }

    return NextResponse.json({
      success: true,
      data: organization,
      timestamp: new Date().toISOString()
    })
  } catch (error) {
    throw error
  }
}

/**
 * Get funding rounds for organization
 */
async function getFundingRounds(uuid: string) {
  try {
    if (!uuid) {
      return NextResponse.json({
        success: false,
        error: 'Organization UUID required'
      }, { status: 400 })
    }

    const rounds = await crunchbaseService.getOrganizationFundingRounds(uuid)
    
    return NextResponse.json({
      success: true,
      data: {
        rounds,
        totalRounds: rounds.length,
        totalFunding: rounds.reduce((sum, r) => sum + (r.money_raised_usd || 0), 0)
      },
      timestamp: new Date().toISOString()
    })
  } catch (error) {
    throw error
  }
}

/**
 * Get investors for organization
 */
async function getInvestors(uuid: string) {
  try {
    if (!uuid) {
      return NextResponse.json({
        success: false,
        error: 'Organization UUID required'
      }, { status: 400 })
    }

    const investors = await crunchbaseService.getOrganizationInvestors(uuid)
    
    return NextResponse.json({
      success: true,
      data: {
        investors,
        totalInvestors: investors.length
      },
      timestamp: new Date().toISOString()
    })
  } catch (error) {
    throw error
  }
}

/**
 * Get comprehensive funding analysis
 */
async function getFundingAnalysis(timeframe: '1m' | '3m' | '6m' | '1y' | 'all') {
  try {
    const analysis = await crunchbaseService.getCybersecurityFundingAnalysis(timeframe)
    
    return NextResponse.json({
      success: true,
      data: analysis,
      timeframe,
      timestamp: new Date().toISOString()
    })
  } catch (error) {
    throw error
  }
}

/**
 * Get real-time funding alerts
 */
async function getRealTimeAlerts() {
  try {
    const alerts = await crunchbaseService.getRealTimeFundingAlerts()
    
    return NextResponse.json({
      success: true,
      data: {
        alerts,
        totalAlerts: alerts.length,
        period: 'Last 30 days'
      },
      timestamp: new Date().toISOString()
    })
  } catch (error) {
    throw error
  }
}

/**
 * Monitor specific companies
 */
async function monitorCompanies(companies: string[]) {
  try {
    if (companies.length === 0) {
      return NextResponse.json({
        success: false,
        error: 'At least one company required'
      }, { status: 400 })
    }

    const rounds = await crunchbaseService.monitorCompanies(companies)
    
    return NextResponse.json({
      success: true,
      data: {
        rounds,
        totalRounds: rounds.length,
        companies
      },
      timestamp: new Date().toISOString()
    })
  } catch (error) {
    throw error
  }
}

/**
 * Get service health status
 */
async function getHealthStatus() {
  try {
    const health = await crunchbaseService.getHealthStatus()
    
    return NextResponse.json({
      success: true,
      data: health,
      timestamp: new Date().toISOString()
    })
  } catch (error) {
    throw error
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { action, companies } = body

    if (action === 'monitor' && companies) {
      const rounds = await crunchbaseService.monitorCompanies(companies)
      
      return NextResponse.json({
        success: true,
        data: {
          rounds,
          totalRounds: rounds.length,
          companies
        },
        timestamp: new Date().toISOString()
      })
    }

    return NextResponse.json({
      success: false,
      error: 'Invalid action'
    }, { status: 400 })
  } catch (error) {
    console.error('Crunchbase POST error:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Request failed'
      },
      { status: 500 }
    )
  }
}
