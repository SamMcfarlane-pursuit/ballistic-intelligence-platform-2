import { NextRequest, NextResponse } from 'next/server'

interface VentureCapital {
  id: string
  name: string
  type: 'VC' | 'Corporate' | 'Angel' | 'Private Equity'
  focus: string[]
  totalInvestments: number
  averageCheckSize: number
  portfolioCompanies: number
  recentInvestments: number
  foundedYear: number
  headquarters: string
  website: string
  confidence: number
  lastUpdated: string
}

interface FundingAnalysis {
  totalFunding: number
  dealCount: number
  averageDealSize: number
  topSectors: Array<{
    sector: string
    funding: number
    deals: number
  }>
  trendingVCs: Array<{
    name: string
    investments: number
    growth: number
  }>
  marketTrends: Array<{
    trend: string
    impact: 'high' | 'medium' | 'low'
    description: string
  }>
}

// Mock data - in a real implementation, this would come from a database
const mockVCData: VentureCapital[] = [
  {
    id: '1',
    name: 'Andreessen Horowitz',
    type: 'VC',
    focus: ['Cybersecurity', 'AI', 'Enterprise SaaS'],
    totalInvestments: 2850000000,
    averageCheckSize: 15000000,
    portfolioCompanies: 342,
    recentInvestments: 12,
    foundedYear: 2009,
    headquarters: 'Menlo Park, CA',
    website: 'https://a16z.com',
    confidence: 96,
    lastUpdated: new Date().toISOString()
  },
  {
    id: '2',
    name: 'Sequoia Capital',
    type: 'VC',
    focus: ['Enterprise Security', 'Cloud Infrastructure', 'DevOps'],
    totalInvestments: 3200000000,
    averageCheckSize: 20000000,
    portfolioCompanies: 287,
    recentInvestments: 8,
    foundedYear: 1972,
    headquarters: 'Menlo Park, CA',
    website: 'https://sequoiacap.com',
    confidence: 98,
    lastUpdated: new Date().toISOString()
  },
  {
    id: '3',
    name: 'Google Ventures',
    type: 'Corporate',
    focus: ['AI Security', 'Cloud Security', 'Threat Detection'],
    totalInvestments: 1800000000,
    averageCheckSize: 12000000,
    portfolioCompanies: 156,
    recentInvestments: 6,
    foundedYear: 2009,
    headquarters: 'Mountain View, CA',
    website: 'https://gv.com',
    confidence: 94,
    lastUpdated: new Date().toISOString()
  },
  {
    id: '4',
    name: 'Accel',
    type: 'VC',
    focus: ['Cybersecurity', 'SaaS', 'FinTech'],
    totalInvestments: 2400000000,
    averageCheckSize: 18000000,
    portfolioCompanies: 198,
    recentInvestments: 9,
    foundedYear: 1983,
    headquarters: 'Palo Alto, CA',
    website: 'https://accel.com',
    confidence: 95,
    lastUpdated: new Date().toISOString()
  },
  {
    id: '5',
    name: 'Kleiner Perkins',
    type: 'VC',
    focus: ['Enterprise Security', 'Digital Health', 'Climate Tech'],
    totalInvestments: 2100000000,
    averageCheckSize: 16000000,
    portfolioCompanies: 234,
    recentInvestments: 7,
    foundedYear: 1972,
    headquarters: 'Menlo Park, CA',
    website: 'https://kpcb.com',
    confidence: 93,
    lastUpdated: new Date().toISOString()
  },
  {
    id: '6',
    name: 'Lightspeed Venture Partners',
    type: 'VC',
    focus: ['Enterprise Security', 'Cloud Computing', 'Data Analytics'],
    totalInvestments: 1900000000,
    averageCheckSize: 14000000,
    portfolioCompanies: 167,
    recentInvestments: 11,
    foundedYear: 1999,
    headquarters: 'Menlo Park, CA',
    website: 'https://lsvp.com',
    confidence: 92,
    lastUpdated: new Date().toISOString()
  },
  {
    id: '7',
    name: 'Index Ventures',
    type: 'VC',
    focus: ['Cybersecurity', 'SaaS', 'Fintech'],
    totalInvestments: 1600000000,
    averageCheckSize: 13000000,
    portfolioCompanies: 189,
    recentInvestments: 5,
    foundedYear: 1996,
    headquarters: 'San Francisco, CA',
    website: 'https://indexventures.com',
    confidence: 91,
    lastUpdated: new Date().toISOString()
  },
  {
    id: '8',
    name: 'Bessemer Venture Partners',
    type: 'VC',
    focus: ['Cloud Security', 'Enterprise Software', 'Cybersecurity'],
    totalInvestments: 1400000000,
    averageCheckSize: 11000000,
    portfolioCompanies: 145,
    recentInvestments: 8,
    foundedYear: 1911,
    headquarters: 'Cambridge, MA',
    website: 'https://bvp.com',
    confidence: 90,
    lastUpdated: new Date().toISOString()
  },
  {
    id: '9',
    name: 'Microsoft Ventures',
    type: 'Corporate',
    focus: ['AI Security', 'Cloud Security', 'Enterprise Software'],
    totalInvestments: 1200000000,
    averageCheckSize: 10000000,
    portfolioCompanies: 134,
    recentInvestments: 4,
    foundedYear: 2016,
    headquarters: 'Redmond, WA',
    website: 'https://microsoft.com/ventures',
    confidence: 89,
    lastUpdated: new Date().toISOString()
  },
  {
    id: '10',
    name: 'Cisco Investments',
    type: 'Corporate',
    focus: ['Network Security', 'Cloud Security', 'IoT Security'],
    totalInvestments: 1000000000,
    averageCheckSize: 9000000,
    portfolioCompanies: 98,
    recentInvestments: 3,
    foundedYear: 2013,
    headquarters: 'San Jose, CA',
    website: 'https://investments.cisco.com',
    confidence: 88,
    lastUpdated: new Date().toISOString()
  }
]

const mockAnalysis: FundingAnalysis = {
  totalFunding: 12350000000,
  dealCount: 479,
  averageDealSize: 25782881,
  topSectors: [
    { sector: 'AI Security', funding: 2850000000, deals: 89 },
    { sector: 'Cloud Security', funding: 3200000000, deals: 124 },
    { sector: 'Zero Trust', funding: 1800000000, deals: 67 },
    { sector: 'Threat Detection', funding: 2400000000, deals: 98 },
    { sector: 'Compliance', funding: 2100000000, deals: 101 }
  ],
  trendingVCs: [
    { name: 'Andreessen Horowitz', investments: 12, growth: 23 },
    { name: 'Sequoia Capital', investments: 8, growth: 18 },
    { name: 'Accel', investments: 9, growth: 15 },
    { name: 'Google Ventures', investments: 6, growth: 12 },
    { name: 'Kleiner Perkins', investments: 7, growth: 10 }
  ],
  marketTrends: [
    {
      trend: 'AI-Powered Security',
      impact: 'high',
      description: 'Increased investment in AI-driven threat detection and response'
    },
    {
      trend: 'Zero Trust Architecture',
      impact: 'high',
      description: 'Growing demand for zero trust security solutions'
    },
    {
      trend: 'Cloud Security Posture',
      impact: 'medium',
      description: 'Focus on cloud-native security and compliance'
    }
  ]
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const type = searchParams.get('type')
    const sortBy = searchParams.get('sortBy') || 'totalInvestments'
    const search = searchParams.get('search') || ''

    // Filter data based on query parameters
    let filteredData = mockVCData

    if (type && type !== 'all') {
      filteredData = filteredData.filter(vc => vc.type === type)
    }

    if (search) {
      filteredData = filteredData.filter(vc => 
        vc.name.toLowerCase().includes(search.toLowerCase()) ||
        vc.focus.some(f => f.toLowerCase().includes(search.toLowerCase()))
      )
    }

    // Sort data
    filteredData.sort((a, b) => {
      switch (sortBy) {
        case 'totalInvestments':
          return b.totalInvestments - a.totalInvestments
        case 'recentInvestments':
          return b.recentInvestments - a.recentInvestments
        case 'confidence':
          return b.confidence - a.confidence
        case 'portfolioCompanies':
          return b.portfolioCompanies - a.portfolioCompanies
        default:
          return 0
      }
    })

    const response = {
      success: true,
      data: {
        vcData: filteredData,
        analysis: mockAnalysis,
        metadata: {
          totalVCs: filteredData.length,
          lastUpdated: new Date().toISOString(),
          filters: {
            type,
            sortBy,
            search
          }
        }
      }
    }

    // Add CORS headers for real-time access
    return NextResponse.json(response, {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0'
      }
    })
  } catch (error) {
    console.error('Error fetching venture capital data:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function OPTIONS() {
  return NextResponse.json({}, {
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization'
    }
  })
}