import { NextRequest, NextResponse } from 'next/server'
import { crunchbaseService } from '@/services/crunchbase-service'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

/**
 * Crunchbase API Route
 * 
 * Endpoints:
 * - GET /api/crunchbase?action=search&query=company&limit=50
 * - GET /api/crunchbase?action=organization&uuid=org-123
 * - GET /api/crunchbase?action=funding&uuid=org-123
 * - GET /api/crunchbase?action=investors&uuid=org-123
 * - GET /api/crunchbase?action=analysis&timeframe=6m
 * - GET /api/crunchbase?action=health
 */
export async function GET(request: NextRequest) {
  const startTime = Date.now()
  
  try {
    const searchParams = request.nextUrl.searchParams
    const action = searchParams.get('action') || 'search'
    
    console.log(`[Crunchbase API] Action: ${action}`, {
      timestamp: new Date().toISOString(),
      params: Object.fromEntries(searchParams.entries())
    })

    switch (action) {
      case 'search': {
        const query = searchParams.get('query') || ''
        const limit = parseInt(searchParams.get('limit') || '50')
        const page = parseInt(searchParams.get('page') || '1')
        
        const result = await crunchbaseService.searchCybersecurityOrganizations(query, limit, page)
        
        console.log(`[Crunchbase API] Search completed`, {
          timestamp: new Date().toISOString(),
          query,
          results: result.organizations.length,
          duration: Date.now() - startTime
        })
        
        return NextResponse.json({
          success: true,
          data: result,
          timestamp: new Date().toISOString(),
          duration: Date.now() - startTime
        })
      }

      case 'organization': {
        const uuid = searchParams.get('uuid')
        
        if (!uuid) {
          return NextResponse.json({
            success: false,
            error: 'UUID parameter is required',
            timestamp: new Date().toISOString()
          }, { status: 400 })
        }
        
        const organization = await crunchbaseService.getOrganization(uuid)
        
        if (!organization) {
          return NextResponse.json({
            success: false,
            error: 'Organization not found',
            timestamp: new Date().toISOString()
          }, { status: 404 })
        }
        
        console.log(`[Crunchbase API] Organization fetched`, {
          timestamp: new Date().toISOString(),
          uuid,
          name: organization.name,
          duration: Date.now() - startTime
        })
        
        return NextResponse.json({
          success: true,
          data: organization,
          timestamp: new Date().toISOString(),
          duration: Date.now() - startTime
        })
      }

      case 'funding': {
        const uuid = searchParams.get('uuid')
        
        if (!uuid) {
          return NextResponse.json({
            success: false,
            error: 'UUID parameter is required',
            timestamp: new Date().toISOString()
          }, { status: 400 })
        }
        
        const fundingRounds = await crunchbaseService.getOrganizationFundingRounds(uuid)
        
        console.log(`[Crunchbase API] Funding rounds fetched`, {
          timestamp: new Date().toISOString(),
          uuid,
          rounds: fundingRounds.length,
          duration: Date.now() - startTime
        })
        
        return NextResponse.json({
          success: true,
          data: fundingRounds,
          timestamp: new Date().toISOString(),
          duration: Date.now() - startTime
        })
      }

      case 'investors': {
        const uuid = searchParams.get('uuid')
        
        if (!uuid) {
          return NextResponse.json({
            success: false,
            error: 'UUID parameter is required',
            timestamp: new Date().toISOString()
          }, { status: 400 })
        }
        
        const investors = await crunchbaseService.getOrganizationInvestors(uuid)
        
        console.log(`[Crunchbase API] Investors fetched`, {
          timestamp: new Date().toISOString(),
          uuid,
          investors: investors.length,
          duration: Date.now() - startTime
        })
        
        return NextResponse.json({
          success: true,
          data: investors,
          timestamp: new Date().toISOString(),
          duration: Date.now() - startTime
        })
      }

      case 'analysis': {
        const timeframe = (searchParams.get('timeframe') || '6m') as '1m' | '3m' | '6m' | '1y' | 'all'
        
        const analysis = await crunchbaseService.getCybersecurityFundingAnalysis(timeframe)
        
        console.log(`[Crunchbase API] Analysis completed`, {
          timestamp: new Date().toISOString(),
          timeframe,
          totalFunding: analysis.total_funding,
          duration: Date.now() - startTime
        })
        
        return NextResponse.json({
          success: true,
          data: analysis,
          timestamp: new Date().toISOString(),
          duration: Date.now() - startTime
        })
      }

      case 'health': {
        const health = await crunchbaseService.getHealthStatus()
        
        console.log(`[Crunchbase API] Health check`, {
          timestamp: new Date().toISOString(),
          status: health.status,
          duration: Date.now() - startTime
        })
        
        return NextResponse.json({
          success: true,
          data: health,
          timestamp: new Date().toISOString(),
          duration: Date.now() - startTime
        })
      }

      case 'monitor': {
        const companies = searchParams.get('companies')?.split(',') || []
        
        if (companies.length === 0) {
          return NextResponse.json({
            success: false,
            error: 'Companies parameter is required (comma-separated list)',
            timestamp: new Date().toISOString()
          }, { status: 400 })
        }
        
        const fundingRounds = await crunchbaseService.monitorCompanies(companies)
        
        console.log(`[Crunchbase API] Companies monitored`, {
          timestamp: new Date().toISOString(),
          companies: companies.length,
          rounds: fundingRounds.length,
          duration: Date.now() - startTime
        })
        
        return NextResponse.json({
          success: true,
          data: fundingRounds,
          timestamp: new Date().toISOString(),
          duration: Date.now() - startTime
        })
      }

      default:
        return NextResponse.json({
          success: false,
          error: `Unknown action: ${action}`,
          availableActions: ['search', 'organization', 'funding', 'investors', 'analysis', 'health', 'monitor'],
          timestamp: new Date().toISOString()
        }, { status: 400 })
    }
  } catch (error) {
    console.error('[Crunchbase API] Error:', error)
    
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Internal server error',
      timestamp: new Date().toISOString(),
      duration: Date.now() - startTime
    }, { status: 500 })
  }
}
