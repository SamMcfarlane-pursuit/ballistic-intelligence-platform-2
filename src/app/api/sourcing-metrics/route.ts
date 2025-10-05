import { NextRequest, NextResponse } from 'next/server'

interface SourcingMetrics {
  totalPlatforms: number
  activePlatforms: number
  totalOpportunities: number
  newOpportunities: number
  contactedOpportunities: number
  topCategories: Array<{
    category: string
    count: number
  }>
  topPlatforms: Array<{
    platform: string
    opportunities: number
  }>
  recentActivity: Array<{
    action: string
    company: string
    platform: string
    date: string
  }>
}

// Mock metrics - in a real implementation, this would be calculated from database
const mockMetrics: SourcingMetrics = {
  totalPlatforms: 8,
  activePlatforms: 8,
  totalOpportunities: 5,
  newOpportunities: 2,
  contactedOpportunities: 1,
  topCategories: [
    { category: 'AI Security', count: 1 },
    { category: 'Cloud Security', count: 1 },
    { category: 'API Security', count: 1 },
    { category: 'IoT Security', count: 1 },
    { category: 'Cryptography', count: 1 }
  ],
  topPlatforms: [
    { platform: 'Crunchbase Basic', opportunities: 1 },
    { platform: 'AngelList', opportunities: 1 },
    { platform: 'CyberDB', opportunities: 1 },
    { platform: 'Team8 Portfolio', opportunities: 1 },
    { platform: 'SBIR.gov', opportunities: 1 }
  ],
  recentActivity: [
    { action: 'New Opportunity', company: 'QuantumCrypt', platform: 'Crunchbase Basic', date: '2024-01-15' },
    { action: 'Contacted', company: 'APIFortress', platform: 'AngelList', date: '2024-01-14' },
    { action: 'Meeting Scheduled', company: 'IoTShield', platform: 'CyberDB', date: '2024-01-13' },
    { action: 'Due Diligence Started', company: 'CloudGuardian', platform: 'Team8 Portfolio', date: '2024-01-12' },
    { action: 'New Opportunity', company: 'SecureAI', platform: 'SBIR.gov', date: '2024-01-11' }
  ]
}

export async function GET(request: NextRequest) {
  try {
    return NextResponse.json({
      success: true,
      data: mockMetrics
    })
  } catch (error) {
    console.error('Error fetching sourcing metrics:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}