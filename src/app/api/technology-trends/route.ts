import { NextRequest, NextResponse } from 'next/server'

// Mock technology trends data
const mockTechnologyTrends = [
  {
    id: '1',
    name: 'Python',
    category: 'Backend',
    adoptionCount: 12,
    growthRate: 25.5,
    avgFunding: 45000000,
    trendDirection: 'up',
    maturityLevel: 'stable',
    popularityScore: 92,
    successRate: 78,
    topCompanies: ['SecureFlow', 'ThreatHunter AI', 'DataVault Enterprise'],
    relatedTechnologies: ['TensorFlow', 'Django', 'FastAPI', 'PostgreSQL']
  },
  {
    id: '2',
    name: 'React',
    category: 'Frontend',
    adoptionCount: 10,
    growthRate: 18.3,
    avgFunding: 38000000,
    trendDirection: 'up',
    maturityLevel: 'stable',
    popularityScore: 88,
    successRate: 72,
    topCompanies: ['CloudGuard Pro', 'ZeroTrust Systems', 'MobileShield'],
    relatedTechnologies: ['Next.js', 'TypeScript', 'Node.js', 'Tailwind CSS']
  },
  {
    id: '3',
    name: 'Kubernetes',
    category: 'DevOps',
    adoptionCount: 9,
    growthRate: 32.1,
    avgFunding: 52000000,
    trendDirection: 'up',
    maturityLevel: 'growing',
    popularityScore: 85,
    successRate: 81,
    topCompanies: ['CloudGuard Pro', 'SecureFlow', 'CryptoSecure Labs'],
    relatedTechnologies: ['Docker', 'Terraform', 'Prometheus', 'Istio']
  },
  {
    id: '4',
    name: 'TensorFlow',
    category: 'AI/ML',
    adoptionCount: 8,
    growthRate: 45.2,
    avgFunding: 62000000,
    trendDirection: 'up',
    maturityLevel: 'growing',
    popularityScore: 82,
    successRate: 85,
    topCompanies: ['ThreatHunter AI', 'SecureFlow', 'AI Security Labs'],
    relatedTechnologies: ['Python', 'PyTorch', 'Jupyter', 'Pandas']
  },
  {
    id: '5',
    name: 'PostgreSQL',
    category: 'Database',
    adoptionCount: 11,
    growthRate: 12.8,
    avgFunding: 41000000,
    trendDirection: 'up',
    maturityLevel: 'mature',
    popularityScore: 79,
    successRate: 74,
    topCompanies: ['DataVault Enterprise', 'SecureFlow', 'CloudGuard Pro'],
    relatedTechnologies: ['Python', 'Node.js', 'Redis', 'GraphQL']
  },
  {
    id: '6',
    name: 'Go',
    category: 'Backend',
    adoptionCount: 7,
    growthRate: 28.7,
    avgFunding: 48000000,
    trendDirection: 'up',
    maturityLevel: 'growing',
    popularityScore: 76,
    successRate: 79,
    topCompanies: ['CloudGuard Pro', 'Network Defense Pro', 'SecureFlow'],
    relatedTechnologies: ['Kubernetes', 'Docker', 'gRPC', 'Prometheus']
  },
  {
    id: '7',
    name: 'Rust',
    category: 'Backend',
    adoptionCount: 5,
    growthRate: 67.3,
    avgFunding: 55000000,
    trendDirection: 'up',
    maturityLevel: 'emerging',
    popularityScore: 73,
    successRate: 88,
    topCompanies: ['CryptoSecure Labs', 'Quantum Shield', 'SecureFlow'],
    relatedTechnologies: ['WebAssembly', 'C++', 'OpenSSL', 'Tokio']
  },
  {
    id: '8',
    name: 'Node.js',
    category: 'Backend',
    adoptionCount: 9,
    growthRate: 15.4,
    avgFunding: 39000000,
    trendDirection: 'stable',
    maturityLevel: 'stable',
    popularityScore: 84,
    successRate: 71,
    topCompanies: ['MobileShield', 'ZeroTrust Systems', 'CloudGuard Pro'],
    relatedTechnologies: ['React', 'Express.js', 'MongoDB', 'TypeScript']
  },
  {
    id: '9',
    name: 'Docker',
    category: 'DevOps',
    adoptionCount: 13,
    growthRate: 22.1,
    avgFunding: 43000000,
    trendDirection: 'up',
    maturityLevel: 'stable',
    popularityScore: 87,
    successRate: 76,
    topCompanies: ['SecureFlow', 'CloudGuard Pro', 'DataVault Enterprise'],
    relatedTechnologies: ['Kubernetes', 'Linux', 'CI/CD', 'Microservices']
  },
  {
    id: '10',
    name: 'TypeScript',
    category: 'Frontend',
    adoptionCount: 8,
    growthRate: 35.6,
    avgFunding: 42000000,
    trendDirection: 'up',
    maturityLevel: 'growing',
    popularityScore: 81,
    successRate: 77,
    topCompanies: ['ZeroTrust Systems', 'MobileShield', 'CloudGuard Pro'],
    relatedTechnologies: ['React', 'Node.js', 'Angular', 'Vue.js']
  }
]

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const action = searchParams.get('action')
    const category = searchParams.get('category')
    const sortBy = searchParams.get('sortBy') || 'popularityScore'
    const order = searchParams.get('order') || 'desc'

    let trends = [...mockTechnologyTrends]

    // Filter by category if specified
    if (category && category !== 'all') {
      trends = trends.filter(trend => 
        trend.category.toLowerCase() === category.toLowerCase()
      )
    }

    // Sort trends
    trends.sort((a, b) => {
      const aValue = a[sortBy as keyof typeof a] as number
      const bValue = b[sortBy as keyof typeof b] as number
      
      if (order === 'desc') {
        return bValue - aValue
      } else {
        return aValue - bValue
      }
    })

    // Get categories for analytics
    const categories = Array.from(new Set(mockTechnologyTrends.map(t => t.category)))

    // Handle different actions
    switch (action) {
      case 'categories':
        return NextResponse.json({
          success: true,
          data: categories
        })

      case 'top-growing':
        const topGrowing = trends
          .filter(t => t.trendDirection === 'up')
          .sort((a, b) => b.growthRate - a.growthRate)
          .slice(0, 5)
        
        return NextResponse.json({
          success: true,
          data: topGrowing
        })

      case 'analytics':
        const analytics = {
          totalTechnologies: trends.length,
          trendingUp: trends.filter(t => t.trendDirection === 'up').length,
          avgGrowthRate: Math.round(trends.reduce((acc, t) => acc + t.growthRate, 0) / trends.length),
          avgSuccessRate: Math.round(trends.reduce((acc, t) => acc + t.successRate, 0) / trends.length),
          totalAdoptions: trends.reduce((acc, t) => acc + t.adoptionCount, 0),
          avgFunding: Math.round(trends.reduce((acc, t) => acc + t.avgFunding, 0) / trends.length),
          categoriesBreakdown: categories.map(cat => ({
            category: cat,
            count: trends.filter(t => t.category === cat).length,
            avgGrowth: Math.round(
              trends
                .filter(t => t.category === cat)
                .reduce((acc, t) => acc + t.growthRate, 0) / 
              trends.filter(t => t.category === cat).length
            )
          }))
        }

        return NextResponse.json({
          success: true,
          data: analytics
        })

      default:
        return NextResponse.json({
          success: true,
          data: trends,
          meta: {
            total: trends.length,
            categories: Array.from(new Set(trends.map(t => t.category))),
            sortBy,
            order
          }
        })
    }

  } catch (error) {
    console.error('Technology trends API error:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to fetch technology trends data',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { action, data } = body

    switch (action) {
      case 'track-adoption':
        // TODO: Implement technology adoption tracking
        return NextResponse.json({
          success: true,
          message: 'Technology adoption tracked successfully'
        })

      case 'update-trend':
        // TODO: Implement trend data updates
        return NextResponse.json({
          success: true,
          message: 'Technology trend updated successfully'
        })

      default:
        return NextResponse.json(
          { success: false, error: 'Invalid action' },
          { status: 400 }
        )
    }

  } catch (error) {
    console.error('Technology trends POST error:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to process technology trends request',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}