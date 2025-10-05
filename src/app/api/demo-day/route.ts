import { NextRequest, NextResponse } from 'next/server'

// Mock database for demo day interactions
let demoInteractions = [
  {
    id: '1',
    type: 'contact',
    name: 'Sarah Chen',
    company: 'Ballistic Ventures',
    role: 'Partner',
    email: 's.chen@ballistic.vc',
    interest: 'high',
    notes: 'Interested in AI-powered market intelligence for cybersecurity investments',
    timestamp: new Date().toISOString()
  },
  {
    id: '2',
    type: 'opportunity',
    company: 'Sequoia Capital',
    opportunityType: 'partnership',
    title: 'Data Analytics Partnership',
    description: 'Exploring data analytics partnerships for portfolio companies',
    value: '$75k',
    status: 'meeting',
    timestamp: new Date().toISOString()
  }
]

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const type = searchParams.get('type')

    let filteredInteractions = demoInteractions
    if (type) {
      filteredInteractions = demoInteractions.filter(interaction => interaction.type === type)
    }

    // Calculate demo day statistics
    const stats = {
      totalViews: 156,
      totalContacts: demoInteractions.filter(i => i.type === 'contact').length,
      totalOpportunities: demoInteractions.filter(i => i.type === 'opportunity').length,
      totalPartnerships: demoInteractions.filter(i => i.type === 'opportunity' && i.status === 'closed').length,
      averageInterest: demoInteractions
        .filter(i => i.type === 'contact')
        .reduce((sum, contact) => {
          const interestScore = contact.interest === 'high' ? 3 : contact.interest === 'medium' ? 2 : 1
          return sum + interestScore
        }, 0) / demoInteractions.filter(i => i.type === 'contact').length || 0
    }

    return NextResponse.json({
      interactions: filteredInteractions,
      stats,
      success: true
    })
  } catch (error) {
    console.error('Error fetching demo day data:', error)
    return NextResponse.json(
      { error: 'Failed to fetch demo day data' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { type, data } = body

    let newInteraction

    switch (type) {
      case 'contact':
        newInteraction = {
          id: Date.now().toString(),
          type: 'contact',
          name: data.name,
          company: data.company,
          role: data.role,
          email: data.email,
          linkedin: data.linkedin,
          interest: data.interest || 'medium',
          notes: data.notes,
          timestamp: new Date().toISOString()
        }
        break

      case 'opportunity':
        newInteraction = {
          id: Date.now().toString(),
          type: 'opportunity',
          company: data.company,
          opportunityType: data.opportunityType,
          title: data.title,
          description: data.description,
          value: data.value,
          status: data.status || 'lead',
          timestamp: new Date().toISOString()
        }
        break

      case 'demo-view':
        newInteraction = {
          id: Date.now().toString(),
          type: 'demo-view',
          viewerType: data.viewerType, // 'employer', 'investor', 'partner', 'student'
          company: data.company,
          duration: data.duration,
          featuresViewed: data.featuresViewed,
          timestamp: new Date().toISOString()
        }
        break

      default:
        return NextResponse.json(
          { error: 'Invalid interaction type' },
          { status: 400 }
        )
    }

    demoInteractions.push(newInteraction)

    // Send notification email (in a real implementation)
    if (type === 'contact' && data.interest === 'high') {
      console.log(`High-value contact alert: ${data.name} from ${data.company}`)
    }

    return NextResponse.json({
      interaction: newInteraction,
      success: true,
      message: `${type} recorded successfully`
    })
  } catch (error) {
    console.error('Error recording demo day interaction:', error)
    return NextResponse.json(
      { error: 'Failed to record interaction' },
      { status: 500 }
    )
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { id, updates } = body

    const interactionIndex = demoInteractions.findIndex(interaction => interaction.id === id)
    if (interactionIndex === -1) {
      return NextResponse.json(
        { error: 'Interaction not found' },
        { status: 404 }
      )
    }

    demoInteractions[interactionIndex] = {
      ...demoInteractions[interactionIndex],
      ...updates,
      updatedAt: new Date().toISOString()
    }

    return NextResponse.json({
      interaction: demoInteractions[interactionIndex],
      success: true,
      message: 'Interaction updated successfully'
    })
  } catch (error) {
    console.error('Error updating demo day interaction:', error)
    return NextResponse.json(
      { error: 'Failed to update interaction' },
      { status: 500 }
    )
  }
}