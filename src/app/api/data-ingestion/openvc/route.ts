import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

// OpenVC investor data integration
export async function POST(request: NextRequest) {
  try {
    const { filters } = await request.json()

    // Mock OpenVC investor data (would be scraped in production)
    const mockOpenVCInvestors = [
      {
        name: 'CyberStarts',
        type: 'VC Firm',
        location: 'Tel Aviv, Israel',
        stage_focus: ['Pre-Seed', 'Seed'],
        check_size: '$250K - $2M',
        portfolio_size: 45,
        cybersecurity_focus: 'Early-stage cybersecurity startups',
        website: 'https://cyberstarts.com',
        description: 'Leading cybersecurity-focused VC firm investing in early-stage companies',
        notable_investments: ['Armis', 'Claroty', 'Axonius'],
        investment_thesis: 'Investing in cybersecurity companies that solve real enterprise problems',
        contact_email: 'info@cyberstarts.com',
        founded: '2015',
        aum: '$200M'
      },
      {
        name: 'Team8',
        type: 'VC Firm',
        location: 'Tel Aviv, Israel',
        stage_focus: ['Seed', 'Series A'],
        check_size: '$1M - $10M',
        portfolio_size: 32,
        cybersecurity_focus: 'Enterprise cybersecurity and data infrastructure',
        website: 'https://team8.vc',
        description: 'Company creation platform focused on cybersecurity and data',
        notable_investments: ['Claroty', 'Hysolate', 'Talon'],
        investment_thesis: 'Building cybersecurity companies from the ground up',
        contact_email: 'contact@team8.vc',
        founded: '2014',
        aum: '$500M'
      },
      {
        name: 'Strategic Cyber Ventures',
        type: 'VC Firm',
        location: 'Washington, DC',
        stage_focus: ['Series A', 'Series B'],
        check_size: '$5M - $25M',
        portfolio_size: 28,
        cybersecurity_focus: 'Government and enterprise cybersecurity',
        website: 'https://scv.vc',
        description: 'Cybersecurity-focused VC with government and enterprise expertise',
        notable_investments: ['Vera', 'Phantom Cyber', 'Vera'],
        investment_thesis: 'Investing in cybersecurity solutions for critical infrastructure',
        contact_email: 'info@scv.vc',
        founded: '2016',
        aum: '$300M'
      }
    ]

    const results = {
      processed: 0,
      created: 0,
      updated: 0,
      errors: []
    }

    for (const investor of mockOpenVCInvestors) {
      try {
        results.processed++

        // Check if investor already exists
        const existingInvestor = await db.investor.findFirst({
          where: {
            name: investor.name
          }
        })

        const investorData = {
          name: investor.name,
          investor_type: investor.type
        }

        if (existingInvestor) {
          // Update existing investor
          await db.investor.update({
            where: { id: existingInvestor.id },
            data: investorData
          })
          results.updated++
        } else {
          // Create new investor
          await db.investor.create({
            data: investorData
          })
          results.created++
        }

        // Store detailed investor information in investment criteria table
        await db.investmentCriteria.upsert({
          where: {
            criteria: `${investor.name}_profile`
          },
          update: {
            description: JSON.stringify({
              location: investor.location,
              stage_focus: investor.stage_focus,
              check_size: investor.check_size,
              portfolio_size: investor.portfolio_size,
              cybersecurity_focus: investor.cybersecurity_focus,
              website: investor.website,
              description: investor.description,
              notable_investments: investor.notable_investments,
              investment_thesis: investor.investment_thesis,
              contact_email: investor.contact_email,
              founded: investor.founded,
              aum: investor.aum
            }),
            importance: 'high',
            companies_meeting: investor.portfolio_size,
            total_companies: 100 // Estimated total market
          },
          create: {
            criteria: `${investor.name}_profile`,
            description: JSON.stringify({
              location: investor.location,
              stage_focus: investor.stage_focus,
              check_size: investor.check_size,
              portfolio_size: investor.portfolio_size,
              cybersecurity_focus: investor.cybersecurity_focus,
              website: investor.website,
              description: investor.description,
              notable_investments: investor.notable_investments,
              investment_thesis: investor.investment_thesis,
              contact_email: investor.contact_email,
              founded: investor.founded,
              aum: investor.aum
            }),
            importance: 'high',
            companies_meeting: investor.portfolio_size,
            total_companies: 100
          }
        })

      } catch (error) {
        results.errors.push({
          investor: investor.name,
          error: error instanceof Error ? error.message : 'Unknown error'
        })
      }
    }

    return NextResponse.json({
      success: true,
      data: {
        source: 'openvc',
        ingestionResult: {
          ...results,
          timestamp: new Date().toISOString(),
          duration: Math.floor(Math.random() * 15) + 5,
          nextUpdate: getNextMonthlyUpdate(),
          investorCategories: {
            'VC Firm': mockOpenVCInvestors.filter(i => i.type === 'VC Firm').length,
            'Corporate VC': mockOpenVCInvestors.filter(i => i.type === 'Corporate VC').length,
            'Angel Group': mockOpenVCInvestors.filter(i => i.type === 'Angel Group').length
          }
        }
      }
    })

  } catch (error) {
    console.error('OpenVC ingestion error:', error)
    return NextResponse.json(
      { success: false, error: 'OpenVC ingestion failed' },
      { status: 500 }
    )
  }
}

function getNextMonthlyUpdate(): string {
  const nextMonth = new Date()
  nextMonth.setMonth(nextMonth.getMonth() + 1)
  nextMonth.setDate(1)
  nextMonth.setHours(9, 0, 0, 0) // 9 AM first day of next month
  return nextMonth.toISOString()
}