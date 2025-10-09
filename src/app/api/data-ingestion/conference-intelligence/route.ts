import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { source, config = {} } = await request.json()

    if (!source) {
      return NextResponse.json(
        { success: false, error: 'Source parameter is required' },
        { status: 400 }
      )
    }

    let ingestionResult

    switch (source) {
      case 'def_con_33':
        ingestionResult = await ingestDefCon33(config)
        break
      case 'cybersec_europe':
        ingestionResult = await ingestCybersecEurope(config)
        break
      case 'infosec_world':
        ingestionResult = await ingestInfoSecWorld(config)
        break
      case 'blue_team_con':
        ingestionResult = await ingestBlueTeamCon(config)
        break
      case 'iccs_conference':
        ingestionResult = await ingestICCSConference(config)
        break
      case 'gartner_security_summit':
        ingestionResult = await ingestGartnerSummit(config)
        break
      case 'cyberuk':
        ingestionResult = await ingestCyberUK(config)
        break
      case 'sans_orlando':
        ingestionResult = await ingestSANSOrlando(config)
        break
      default:
        return NextResponse.json(
          { success: false, error: 'Unknown conference intelligence source' },
          { status: 400 }
        )
    }

    return NextResponse.json({
      success: true,
      data: {
        source,
        ingestionResult,
        timestamp: new Date().toISOString()
      }
    })

  } catch (error) {
    console.error('Conference intelligence ingestion error:', error)
    return NextResponse.json(
      { success: false, error: 'Conference intelligence ingestion failed' },
      { status: 500 }
    )
  }
}

async function ingestDefCon33(config: any) {
  // Mock DEF CON 33 ingestion
  // In production, this would scrape DEF CON startup demos and VC activities
  
  const mockDefConData = {
    event: 'DEF CON 33',
    dates: 'August 7-10, 2025',
    location: 'Las Vegas, NV',
    startupDemos: [
      {
        name: 'HackerShield',
        category: 'Red Team Tools',
        demoType: 'Live Demo',
        vcInterest: 'High',
        informalMeetings: 3
      },
      {
        name: 'ExploitGuard',
        category: 'Vulnerability Management',
        demoType: 'Tool Showcase',
        vcInterest: 'Medium',
        informalMeetings: 2
      }
    ],
    vcAccess: {
      informalMeetings: 45,
      scheduledPitches: 12,
      networkingEvents: 8
    },
    hackerCommunityFeedback: {
      toolsShowcased: 85,
      communityVotes: 1250,
      averageRating: 4.2
    }
  }

  // Simulate processing delay
  await new Promise(resolve => setTimeout(resolve, 130))

  return {
    processed: mockDefConData.startupDemos.length,
    created: 2,
    updated: 0,
    errors: 0,
    eventData: mockDefConData,
    summary: {
      startupsPresenting: 85,
      vcMeetings: 45,
      communityEngagement: 1250,
      daysOfEvent: 4
    }
  }
}

async function ingestCybersecEurope(config: any) {
  // Mock Cybersec Europe ingestion
  // In production, this would gather EU startup zone and funding data
  
  const mockEuropeData = {
    event: 'Cybersec Europe',
    dates: 'May 21-22, 2025',
    location: 'Brussels, Belgium',
    startupZone: [
      {
        name: 'EuroSecure',
        country: 'Germany',
        fundingStage: 'Series A',
        euInnovationFunding: '€2.5M',
        category: 'Privacy Tech'
      },
      {
        name: 'CyberDefense Nordic',
        country: 'Sweden',
        fundingStage: 'Seed',
        euInnovationFunding: '€800K',
        category: 'Industrial Security'
      }
    ],
    euFunding: {
      totalAvailable: '€50M',
      applicants: 156,
      approvedGrants: 23,
      averageGrant: '€2.2M'
    },
    regionalFocus: {
      gdprCompliance: 89,
      digitalSovereignty: 67,
      criticalInfrastructure: 45
    }
  }

  // Simulate processing delay
  await new Promise(resolve => setTimeout(resolve, 105))

  return {
    processed: mockEuropeData.startupZone.length,
    created: 2,
    updated: 0,
    errors: 0,
    eventData: mockEuropeData,
    summary: {
      euStartups: 45,
      totalFunding: '€50M',
      grantApprovals: 23,
      daysOfEvent: 2
    }
  }
}

async function ingestInfoSecWorld(config: any) {
  // Mock InfoSec World ingestion
  // In production, this would capture startup showcase and CISO panels
  
  const mockInfoSecData = {
    event: 'InfoSec World',
    dates: 'October 27-29, 2025',
    location: 'Orlando, FL',
    startupShowcase: [
      {
        name: 'SecureOps Pro',
        category: 'Security Operations',
        cisoRating: 4.5,
        investorInterest: 'High',
        panelPresentation: true
      },
      {
        name: 'ThreatScope AI',
        category: 'Threat Detection',
        cisoRating: 4.2,
        investorInterest: 'Medium',
        panelPresentation: false
      }
    ],
    cisoInvestorPanels: [
      {
        title: 'CISO Investment Priorities 2025',
        panelists: 8,
        startupsPitched: 12,
        fundingCommitments: 3
      },
      {
        title: 'Enterprise Security Budgets',
        panelists: 6,
        startupsPitched: 8,
        fundingCommitments: 2
      }
    ],
    networkingMetrics: {
      cisoAttendees: 450,
      investorAttendees: 89,
      startupMeetings: 234
    }
  }

  // Simulate processing delay
  await new Promise(resolve => setTimeout(resolve, 115))

  return {
    processed: mockInfoSecData.startupShowcase.length,
    created: 2,
    updated: 0,
    errors: 0,
    eventData: mockInfoSecData,
    summary: {
      startupsShowcased: 67,
      cisoAttendees: 450,
      investorMeetings: 234,
      fundingCommitments: 5
    }
  }
}

async function ingestBlueTeamCon(config: any) {
  // Mock Blue Team Con ingestion
  // In production, this would capture SOC tooling and defensive security startups
  
  const mockBlueTeamData = {
    event: 'Blue Team Con',
    dates: 'September 6-7, 2025',
    location: 'Chicago, IL',
    startupDemos: [
      {
        name: 'SOCAutomation',
        category: 'Security Orchestration',
        toolType: 'SOAR Platform',
        blueTeamRating: 4.7,
        socAdoption: 'High'
      },
      {
        name: 'DefenseMatrix',
        category: 'Incident Response',
        toolType: 'IR Platform',
        blueTeamRating: 4.3,
        socAdoption: 'Medium'
      }
    ],
    socToolingPitches: {
      totalPitches: 32,
      automationTools: 12,
      threatHuntingTools: 8,
      incidentResponseTools: 7,
      complianceTools: 5
    },
    blueTeamFeedback: {
      practitionerAttendees: 890,
      toolEvaluations: 156,
      adoptionCommitments: 23
    }
  }

  // Simulate processing delay
  await new Promise(resolve => setTimeout(resolve, 95))

  return {
    processed: mockBlueTeamData.startupDemos.length,
    created: 2,
    updated: 0,
    errors: 0,
    eventData: mockBlueTeamData,
    summary: {
      socToolsPitched: 32,
      practitionerAttendees: 890,
      adoptionCommitments: 23,
      daysOfEvent: 2
    }
  }
}

async function ingestICCSConference(config: any) {
  // Mock ICCS Conference ingestion
  // In production, this would capture academic-startup crossover and funding panels
  
  const mockICCSData = {
    event: 'International Conference on Cyber Security (ICCS)',
    dates: 'July 14-16, 2025',
    location: 'New York, NY',
    academicStartupCrossover: [
      {
        startup: 'CyberResearch Labs',
        academicPartner: 'MIT CSAIL',
        researchArea: 'Quantum Cryptography',
        fundingReceived: '$3.2M',
        publicationCount: 12
      },
      {
        startup: 'SecureAI Systems',
        academicPartner: 'Stanford HAI',
        researchArea: 'AI Security',
        fundingReceived: '$5.8M',
        publicationCount: 8
      }
    ],
    fundingPanels: [
      {
        title: 'Academic-Industry Funding Bridges',
        participants: 15,
        fundingCommitments: '$12M',
        startupsPresented: 8
      },
      {
        title: 'Research Commercialization',
        participants: 12,
        fundingCommitments: '$8.5M',
        startupsPresented: 6
      }
    ],
    researchMetrics: {
      papersPresented: 78,
      startupCollaborations: 23,
      fundingOpportunities: 45
    }
  }

  // Simulate processing delay
  await new Promise(resolve => setTimeout(resolve, 125))

  return {
    processed: mockICCSData.academicStartupCrossover.length,
    created: 2,
    updated: 0,
    errors: 0,
    eventData: mockICCSData,
    summary: {
      academicPartnerships: 23,
      totalFunding: '$20.5M',
      researchPapers: 78,
      daysOfEvent: 3
    }
  }
}

async function ingestGartnerSummit(config: any) {
  // Mock Gartner Security Summit ingestion
  // In production, this would capture emerging tech and analyst insights
  
  const mockGartnerData = {
    event: 'Gartner Security & Risk Management Summit',
    dates: 'June 9-11, 2025',
    location: 'National Harbor, MD',
    emergingTechShowcase: [
      {
        technology: 'Zero Trust Architecture',
        startups: 12,
        gartnerRating: 'High Potential',
        marketSize: '$15.2B',
        adoptionTimeline: '2-3 years'
      },
      {
        technology: 'AI-Powered Security',
        startups: 18,
        gartnerRating: 'Transformational',
        marketSize: '$22.8B',
        adoptionTimeline: '1-2 years'
      }
    ],
    investorBriefings: [
      {
        title: 'Security Market Outlook 2025-2027',
        attendees: 89,
        startupsHighlighted: 25,
        investmentCommitments: '$45M'
      },
      {
        title: 'Emerging Security Technologies',
        attendees: 67,
        startupsHighlighted: 18,
        investmentCommitments: '$32M'
      }
    ],
    analystInsights: {
      marketPredictions: 15,
      technologyTrends: 23,
      investmentRecommendations: 12
    }
  }

  // Simulate processing delay
  await new Promise(resolve => setTimeout(resolve, 140))

  return {
    processed: mockGartnerData.emergingTechShowcase.length,
    created: 2,
    updated: 0,
    errors: 0,
    eventData: mockGartnerData,
    summary: {
      emergingTechnologies: 2,
      totalStartups: 30,
      investmentCommitments: '$77M',
      analystInsights: 50
    }
  }
}

async function ingestCyberUK(config: any) {
  // Mock CYBERUK ingestion
  // In production, this would capture UK government-backed funding tracks
  
  const mockCyberUKData = {
    event: 'CYBERUK',
    dates: 'May 6-8, 2025',
    location: 'Manchester, UK',
    governmentFundingTracks: [
      {
        program: 'UK Cyber Innovation Fund',
        totalFunding: '£25M',
        applicants: 67,
        approved: 12,
        averageGrant: '£2.1M'
      },
      {
        program: 'Defence Cyber Accelerator',
        totalFunding: '£15M',
        applicants: 45,
        approved: 8,
        averageGrant: '£1.9M'
      }
    ],
    startupShowcase: [
      {
        name: 'CyberDefence UK',
        category: 'Critical Infrastructure',
        governmentBacking: '£3.2M',
        securityClearance: 'SC Level',
        contractsPipeline: '£12M'
      },
      {
        name: 'QuantumSecure Ltd',
        category: 'Quantum Security',
        governmentBacking: '£2.8M',
        securityClearance: 'DV Level',
        contractsPipeline: '£8.5M'
      }
    ],
    governmentMetrics: {
      totalInvestment: '£40M',
      startupsSupported: 20,
      contractsAwarded: '£20.5M',
      internationalPartnerships: 15
    }
  }

  // Simulate processing delay
  await new Promise(resolve => setTimeout(resolve, 110))

  return {
    processed: mockCyberUKData.startupShowcase.length,
    created: 2,
    updated: 0,
    errors: 0,
    eventData: mockCyberUKData,
    summary: {
      governmentFunding: '£40M',
      startupsSupported: 20,
      contractsAwarded: '£20.5M',
      daysOfEvent: 3
    }
  }
}

async function ingestSANSOrlando(config: any) {
  // Mock SANS Orlando ingestion
  // In production, this would capture training-linked startup demos
  
  const mockSANSData = {
    event: 'SANS Orlando 2025',
    dates: 'April 13-18, 2025',
    location: 'Orlando, FL',
    startupBooths: [
      {
        name: 'TrainingTech Security',
        category: 'Security Training',
        trainingIntegration: 'Hands-on Labs',
        certificationTies: ['GSEC', 'GCIH'],
        attendeeInterest: 'High'
      },
      {
        name: 'CyberSkills Pro',
        category: 'Skills Assessment',
        trainingIntegration: 'Assessment Platform',
        certificationTies: ['GIAC', 'CISSP'],
        attendeeInterest: 'Medium'
      }
    ],
    trainingLinkedDemos: {
      totalDemos: 234,
      handsOnLabs: 89,
      certificationPrep: 67,
      skillsAssessment: 45,
      practicalTools: 33
    },
    educationMetrics: {
      trainingAttendees: 2800,
      certificationCandidates: 890,
      toolAdoptions: 156,
      courseIntegrations: 23
    }
  }

  // Simulate processing delay
  await new Promise(resolve => setTimeout(resolve, 120))

  return {
    processed: mockSANSData.startupBooths.length,
    created: 2,
    updated: 0,
    errors: 0,
    eventData: mockSANSData,
    summary: {
      startupBooths: 234,
      trainingAttendees: 2800,
      certificationCandidates: 890,
      daysOfEvent: 6
    }
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const source = searchParams.get('source')

    if (!source) {
      return NextResponse.json({
        success: true,
        data: {
          availableSources: [
            'def_con_33',
            'cybersec_europe',
            'infosec_world',
            'blue_team_con',
            'iccs_conference',
            'gartner_security_summit',
            'cyberuk',
            'sans_orlando'
          ],
          description: 'Conference and event intelligence data sources'
        }
      })
    }

    // Return source-specific information
    const sourceInfo = {
      def_con_33: {
        name: 'DEF CON 33',
        description: 'Hacker-led startup demos, informal VC access',
        endpoints: ['demos', 'vc_meetings'],
        rateLimit: 'Annual event',
        authentication: 'Event registration'
      },
      cybersec_europe: {
        name: 'Cybersec Europe',
        description: 'Startup zone, EU innovation funding',
        endpoints: ['startups', 'funding'],
        rateLimit: 'Annual event',
        authentication: 'Event registration'
      },
      infosec_world: {
        name: 'InfoSec World',
        description: 'Startup showcase, CISO investor panels',
        endpoints: ['showcase', 'panels'],
        rateLimit: 'Annual event',
        authentication: 'Event registration'
      },
      blue_team_con: {
        name: 'Blue Team Con',
        description: 'Startup demos, SOC tooling pitches',
        endpoints: ['demos', 'tools'],
        rateLimit: 'Annual event',
        authentication: 'Event registration'
      },
      iccs_conference: {
        name: 'International Conference on Cyber Security (ICCS)',
        description: 'Academic + startup crossover, funding panels',
        endpoints: ['research', 'funding'],
        rateLimit: 'Annual event',
        authentication: 'Academic registration'
      },
      gartner_security_summit: {
        name: 'Gartner Security & Risk Management Summit',
        description: 'Emerging tech showcase, investor briefings',
        endpoints: ['tech_showcase', 'briefings'],
        rateLimit: 'Annual event',
        authentication: 'Gartner client access'
      },
      cyberuk: {
        name: 'CYBERUK',
        description: 'UK government-backed startup funding tracks',
        endpoints: ['funding', 'startups'],
        rateLimit: 'Annual event',
        authentication: 'Government registration'
      },
      sans_orlando: {
        name: 'SANS Orlando 2025',
        description: 'Startup booths, training-linked demos',
        endpoints: ['booths', 'training'],
        rateLimit: 'Annual event',
        authentication: 'SANS registration'
      }
    }

    return NextResponse.json({
      success: true,
      data: sourceInfo[source as keyof typeof sourceInfo] || { error: 'Source not found' }
    })

  } catch (error) {
    console.error('Conference intelligence info error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to get conference intelligence info' },
      { status: 500 }
    )
  }
}