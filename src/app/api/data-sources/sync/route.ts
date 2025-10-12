import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { sourceId } = await request.json()

    // Simulate data source synchronization
    const syncResults: Record<string, any> = {
      intellizence: {
        success: true,
        recordsProcessed: Math.floor(Math.random() * 100) + 50,
        newRecords: Math.floor(Math.random() * 20) + 5,
        processingTime: Math.floor(Math.random() * 500) + 200,
        dataTypes: ['funding_rounds', 'investor_profiles', 'startup_metrics'],
        lastSync: new Date().toISOString()
      },
      finro: {
        success: true,
        recordsProcessed: Math.floor(Math.random() * 50) + 20,
        newRecords: Math.floor(Math.random() * 10) + 2,
        processingTime: Math.floor(Math.random() * 1000) + 800,
        dataTypes: ['valuation_multiples', 'ma_trends', 'market_analysis'],
        lastSync: new Date().toISOString()
      },
      datarade: {
        success: true,
        recordsProcessed: Math.floor(Math.random() * 80) + 40,
        newRecords: Math.floor(Math.random() * 15) + 3,
        processingTime: Math.floor(Math.random() * 400) + 250,
        dataTypes: ['startup_profiles', 'founding_data', 'team_bios', 'market_size'],
        lastSync: new Date().toISOString()
      },
      crunchbase: {
        success: true,
        recordsProcessed: Math.floor(Math.random() * 200) + 100,
        newRecords: Math.floor(Math.random() * 30) + 10,
        processingTime: Math.floor(Math.random() * 300) + 150,
        dataTypes: ['company_profiles', 'funding_history', 'investor_networks'],
        lastSync: new Date().toISOString()
      },
      'sec-edgar': {
        success: true,
        recordsProcessed: Math.floor(Math.random() * 60) + 30,
        newRecords: Math.floor(Math.random() * 12) + 4,
        processingTime: Math.floor(Math.random() * 1200) + 600,
        dataTypes: ['form_d_filings', 'stealth_rounds', 'public_disclosures'],
        lastSync: new Date().toISOString()
      },
      growthlist: {
        success: true,
        recordsProcessed: Math.floor(Math.random() * 40) + 20,
        newRecords: Math.floor(Math.random() * 8) + 2,
        processingTime: Math.floor(Math.random() * 2500) + 1500,
        dataTypes: ['cybersecurity_startups', 'funding_status', 'weekly_updates'],
        lastSync: new Date().toISOString()
      },
      openvc: {
        success: true,
        recordsProcessed: Math.floor(Math.random() * 25) + 10,
        newRecords: Math.floor(Math.random() * 5) + 1,
        processingTime: Math.floor(Math.random() * 3500) + 2000,
        dataTypes: ['vc_profiles', 'investment_criteria', 'geographic_focus'],
        lastSync: new Date().toISOString()
      }
    }

    const result = syncResults[sourceId] || {
      success: false,
      error: 'Unknown data source'
    }

    if (result.success) {
      return NextResponse.json({
        success: true,
        data: {
          sourceId,
          syncResult: result,
          message: `Successfully synchronized ${result.recordsProcessed} records from ${sourceId}`,
          timestamp: new Date().toISOString()
        }
      })
    } else {
      return NextResponse.json(
        { success: false, error: result.error },
        { status: 400 }
      )
    }

  } catch (error) {
    console.error('Data source sync error:', error)
    return NextResponse.json(
      { success: false, error: 'Data source synchronization failed' },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const action = searchParams.get('action')

    if (action === 'status') {
      return NextResponse.json({
        success: true,
        data: {
          totalSources: 7,
          activeSources: 7,
          totalRecords: 86610,
          avgSuccessRate: 95.3,
          lastGlobalSync: new Date().toISOString(),
          sourceCategories: {
            funding: 5,
            market: 1,
            investors: 1
          },
          syncFrequency: {
            realtime: 2,
            daily: 2,
            weekly: 1,
            monthly: 1,
            quarterly: 1
          }
        }
      })
    }

    // Default: return all data sources status
    return NextResponse.json({
      success: true,
      data: {
        sources: [
          {
            id: 'intellizence',
            name: 'Intellizence Startup Funding',
            status: 'active',
            category: 'funding',
            type: 'API',
            records: 15420,
            successRate: 98.7,
            lastSync: new Date(Date.now() - 2 * 60 * 1000).toISOString()
          },
          {
            id: 'finro',
            name: 'Finro Cybersecurity Valuations',
            status: 'active',
            category: 'market',
            type: 'Dataset',
            records: 2840,
            successRate: 95.2,
            lastSync: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()
          },
          {
            id: 'datarade',
            name: 'Datarade Startup APIs',
            status: 'active',
            category: 'funding',
            type: 'API',
            records: 8920,
            successRate: 97.1,
            lastSync: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString()
          },
          {
            id: 'crunchbase',
            name: 'Crunchbase Data',
            status: 'active',
            category: 'funding',
            type: 'API',
            records: 45680,
            successRate: 99.2,
            lastSync: new Date(Date.now() - 15 * 60 * 1000).toISOString()
          },
          {
            id: 'sec-edgar',
            name: 'SEC EDGAR Filings',
            status: 'active',
            category: 'funding',
            type: 'XML/API',
            records: 12340,
            successRate: 94.8,
            lastSync: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString()
          },
          {
            id: 'growthlist',
            name: 'GrowthList Cybersecurity',
            status: 'active',
            category: 'funding',
            type: 'Scraping',
            records: 1250,
            successRate: 92.5,
            lastSync: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString()
          },
          {
            id: 'openvc',
            name: 'OpenVC Cybersecurity Investors',
            status: 'active',
            category: 'investors',
            type: 'Scraping',
            records: 156,
            successRate: 89.7,
            lastSync: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()
          }
        ]
      }
    })

  } catch (error) {
    console.error('Data sources API error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch data sources status' },
      { status: 500 }
    )
  }
}