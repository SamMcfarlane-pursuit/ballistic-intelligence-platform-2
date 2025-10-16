import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { getVectorStore } from '@/lib/vector-store'

/**
 * RAG Search API Endpoint
 * Provides semantic search capabilities over company data
 */

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const action = searchParams.get('action') || 'search'

    switch (action) {
      case 'init':
        return await initializeVectorStore()
      
      case 'search':
        const query = searchParams.get('query') || ''
        const limit = parseInt(searchParams.get('limit') || '5')
        return await semanticSearch(query, limit)
      
      case 'category':
        const category = searchParams.get('category') || ''
        return await searchByCategory(category)
      
      case 'stats':
        return await getVectorStats()
      
      default:
        return NextResponse.json({
          success: false,
          error: 'Invalid action'
        }, { status: 400 })
    }
  } catch (error) {
    console.error('RAG Search error:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'RAG search failed',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}

/**
 * Initialize vector store with database companies
 */
async function initializeVectorStore() {
  try {
    const vectorStore = getVectorStore()
    vectorStore.clear()

    // Load all companies from database
    const companies = await db.cybersecurityStartup.findMany({
      select: {
        id: true,
        name: true,
        description: true,
        primary_category: true,
        total_funding: true,
        current_stage: true,
        headquarters: true
      }
    })

    // Add to vector store
    for (const company of companies) {
      await vectorStore.addCompany({
        id: company.id,
        name: company.name,
        description: company.description,
        category: company.primary_category || 'General Security',
        funding: company.total_funding || 0,
        stage: company.current_stage || 'unknown',
        location: company.headquarters || 'Unknown'
      })
    }

    return NextResponse.json({
      success: true,
      message: 'Vector store initialized',
      data: {
        companiesLoaded: companies.length,
        timestamp: new Date().toISOString()
      }
    })
  } catch (error) {
    throw error
  }
}

/**
 * Perform semantic search
 */
async function semanticSearch(query: string, limit: number) {
  try {
    const vectorStore = getVectorStore()
    
    // Check if vector store is initialized
    if (vectorStore.getCount() === 0) {
      // Auto-initialize
      await initializeVectorStore()
    }

    const results = await vectorStore.search(query, limit)

    // Enrich with full database data
    const enrichedResults = await Promise.all(
      results.map(async (result) => {
        const company = await db.cybersecurityStartup.findUnique({
          where: { id: result.company.id },
          include: {
            fundingRounds: {
              orderBy: { announced_date: 'desc' },
              take: 1
            }
          }
        })

        return {
          ...result,
          companyDetails: company,
          matchScore: Math.round(result.score * 100)
        }
      })
    )

    return NextResponse.json({
      success: true,
      data: {
        query,
        results: enrichedResults,
        totalResults: enrichedResults.length,
        searchType: 'semantic',
        timestamp: new Date().toISOString()
      }
    })
  } catch (error) {
    throw error
  }
}

/**
 * Search by category
 */
async function searchByCategory(category: string) {
  try {
    const vectorStore = getVectorStore()
    
    if (vectorStore.getCount() === 0) {
      await initializeVectorStore()
    }

    const results = await vectorStore.searchByCategory(category)

    return NextResponse.json({
      success: true,
      data: {
        category,
        companies: results,
        count: results.length,
        timestamp: new Date().toISOString()
      }
    })
  } catch (error) {
    throw error
  }
}

/**
 * Get vector store statistics
 */
async function getVectorStats() {
  try {
    const vectorStore = getVectorStore()
    const dbStats = await db.cybersecurityStartup.aggregate({
      _count: true,
      _sum: {
        total_funding: true
      },
      _avg: {
        total_funding: true
      }
    })

    return NextResponse.json({
      success: true,
      data: {
        vectorStore: {
          companiesIndexed: vectorStore.getCount(),
          isInitialized: vectorStore.getCount() > 0
        },
        database: {
          totalCompanies: dbStats._count,
          totalFunding: dbStats._sum.total_funding || 0,
          averageFunding: Math.round(dbStats._avg.total_funding || 0)
        },
        capabilities: [
          'Semantic search',
          'Category filtering',
          'Funding range search',
          'Real-time indexing'
        ],
        timestamp: new Date().toISOString()
      }
    })
  } catch (error) {
    throw error
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { action, data } = body

    if (action === 'search') {
      const vectorStore = getVectorStore()
      
      if (vectorStore.getCount() === 0) {
        await initializeVectorStore()
      }

      const results = await vectorStore.search(data.query, data.limit || 5)

      return NextResponse.json({
        success: true,
        data: {
          query: data.query,
          results,
          totalResults: results.length
        }
      })
    }

    return NextResponse.json({
      success: false,
      error: 'Invalid action'
    }, { status: 400 })
  } catch (error) {
    console.error('RAG Search POST error:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Search failed'
      },
      { status: 500 }
    )
  }
}
