import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const timeframe = searchParams.get('timeframe') || '12m'

    // Mock analytics data
    const analytics = {
      timeline: {
        labels: [
          '2023-02', '2023-03', '2023-04', '2023-05', '2023-06', '2023-07',
          '2023-08', '2023-09', '2023-10', '2023-11', '2023-12', '2024-01'
        ],
        datasets: [
          {
            label: 'Total Funding ($M)',
            data: [450, 520, 380, 670, 890, 750, 920, 1100, 850, 980, 1200, 1350],
            borderColor: 'rgb(59, 130, 246)',
            backgroundColor: 'rgba(59, 130, 246, 0.1)',
            tension: 0.4
          },
          {
            label: 'Number of Rounds',
            data: [12, 15, 10, 18, 22, 19, 25, 28, 21, 24, 30, 32],
            borderColor: 'rgb(16, 185, 129)',
            backgroundColor: 'rgba(16, 185, 129, 0.1)',
            tension: 0.4,
            yAxisID: 'y1'
          }
        ]
      },
      roundTypes: {
        labels: ['Seed', 'Series A', 'Series B', 'Series C', 'Series D+'],
        datasets: [{
          data: [35, 28, 20, 12, 5],
          backgroundColor: [
            '#10B981', '#3B82F6', '#8B5CF6', '#F59E0B', '#EF4444'
          ]
        }]
      },
      topInvestors: [
        { name: 'Andreessen Horowitz', investments: 15, totalAmount: 450000000 },
        { name: 'Sequoia Capital', investments: 12, totalAmount: 380000000 },
        { name: 'Accel Partners', investments: 10, totalAmount: 320000000 },
        { name: 'Kleiner Perkins', investments: 8, totalAmount: 280000000 },
        { name: 'Index Ventures', investments: 7, totalAmount: 250000000 }
      ],
      topSectors: [
        { sector: 'AI Security', deals: 25, totalFunding: 850000000 },
        { sector: 'Cloud Security', deals: 20, totalFunding: 720000000 },
        { sector: 'Identity & Access', deals: 15, totalFunding: 480000000 },
        { sector: 'Network Security', deals: 12, totalFunding: 380000000 },
        { sector: 'Data Protection', deals: 10, totalFunding: 320000000 }
      ],
      investorNetworks: [
        {
          investorA: 'Andreessen Horowitz',
          investorB: 'Sequoia Capital',
          coInvestmentCount: 8,
          totalAmount: 280000000,
          relationshipStrength: 0.85
        },
        {
          investorA: 'Accel Partners',
          investorB: 'Index Ventures',
          coInvestmentCount: 6,
          totalAmount: 220000000,
          relationshipStrength: 0.78
        },
        {
          investorA: 'Kleiner Perkins',
          investorB: 'GV',
          coInvestmentCount: 5,
          totalAmount: 180000000,
          relationshipStrength: 0.72
        },
        {
          investorA: 'Lightspeed Venture Partners',
          investorB: 'Bessemer Venture Partners',
          coInvestmentCount: 4,
          totalAmount: 150000000,
          relationshipStrength: 0.68
        }
      ],
      summary: {
        totalFunding: 4250000000,
        totalRounds: 156,
        averageRoundSize: 27243590,
        uniqueInvestors: 89,
        uniqueCompanies: 134,
        growthRate: 42.5,
        lastUpdated: new Date().toISOString()
      }
    }

    return NextResponse.json({
      success: true,
      data: analytics
    })

  } catch (error) {
    console.error('Error fetching analytics:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch analytics' },
      { status: 500 }
    )
  }
}