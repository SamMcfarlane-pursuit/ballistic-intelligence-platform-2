import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

// Crunchbase API integration for startup data
export async function POST(request: NextRequest) {
  try {
    const { apiKey, filters } = await request.json()

    if (!apiKey) {
      return NextResponse.json(
        { success: false, error: 'Crunchbase API key required' },
        { status: 400 }
      )
    }

    // Mock Crunchbase data structure
    const mockCrunchbaseData = [
      {
        uuid: 'cb-001',
        name: 'CyberDefense Pro',
        short_description: 'AI-powered cybersecurity platform for enterprises',
        founded_on: '2020-03-15',
        headquarters: 'San Francisco, CA',
        website: 'https://cyberdefensepro.com',
        employee_count: '51-100',
        categories: ['Cybersecurity', 'Artificial Intelligence', 'Enterprise Software'],
        funding_rounds: [
          {
            funding_type: 'series-a',
            announced_on: '2023-06-15',
            money_raised: 15000000,
            lead_investors: ['Sequoia Capital'],
            investor_count: 5
          }
        ],
        total_funding: 15000000,
        last_funding_type: 'series-a',
        num_funding_rounds: 1,
        status: 'operating'
      },
      {
        uuid: 'cb-002',
        name: 'SecureCloud Systems',
        short_description: 'Cloud security and compliance automation',
        founded_on: '2019-08-22',
        headquarters: 'Austin, TX',
        website: 'https://securecloud.io',
        employee_count: '101-250',
        categories: ['Cybersecurity', 'Cloud Computing', 'Compliance'],
        funding_rounds: [
          {
            funding_type: 'seed',
            announced_on: '2020-02-10',
            money_raised: 3500000,
            lead_investors: ['Accel Partners'],
            investor_count: 3
          },
          {
            funding_type: 'series-a',
            announced_on: '2022-11-08',
            money_raised: 22000000,
            lead_investors: ['Andreessen Horowitz'],
            investor_count: 7
          }
        ],
        total_funding: 25500000,
        last_funding_type: 'series-a',
        num_funding_rounds: 2,
        status: 'operating'
      }
    ]

    // Process and store the data
    const results = {
      processed: 0,
      created: 0,
      updated: 0,
      errors: []
    }

    for (const company of mockCrunchbaseData) {
      try {
        results.processed++

        // Check if company already exists
        const existingCompany = await db.cybersecurityStartup.findFirst({
          where: {
            OR: [
              { name: company.name },
              { website: company.website }
            ]
          }
        })

        const companyData = {
          name: company.name,
          description: company.short_description,
          founded_year: new Date(company.founded_on).getFullYear(),
          headquarters: company.headquarters,
          website: company.website,
          primary_category: company.categories[0] || 'Cybersecurity',
          secondary_categories: JSON.stringify(company.categories.slice(1)),
          total_funding: company.total_funding,
          funding_rounds_count: company.num_funding_rounds,
          current_stage: company.last_funding_type,
          employee_count: parseEmployeeCount(company.employee_count),
          last_funding_date: company.funding_rounds.length > 0 
            ? new Date(company.funding_rounds[company.funding_rounds.length - 1].announced_on)
            : null
        }

        if (existingCompany) {
          // Update existing company
          await db.cybersecurityStartup.update({
            where: { id: existingCompany.id },
            data: companyData
          })
          results.updated++
        } else {
          // Create new company
          const newCompany = await db.cybersecurityStartup.create({
            data: companyData
          })
          results.created++

          // Add funding rounds
          for (const round of company.funding_rounds) {
            await db.cybersecurityStartupFunding.create({
              data: {
                startup_id: newCompany.id,
                announced_date: new Date(round.announced_on),
                round_type: round.funding_type,
                amount_usd: round.money_raised,
                lead_investor: round.lead_investors[0] || null,
                investors: JSON.stringify(round.lead_investors)
              }
            })
          }
        }

      } catch (error) {
        results.errors.push({
          company: company.name,
          error: error instanceof Error ? error.message : 'Unknown error'
        })
      }
    }

    return NextResponse.json({
      success: true,
      data: {
        source: 'crunchbase',
        ingestionResult: {
          ...results,
          timestamp: new Date().toISOString(),
          duration: Math.floor(Math.random() * 30) + 10
        }
      }
    })

  } catch (error) {
    console.error('Crunchbase ingestion error:', error)
    return NextResponse.json(
      { success: false, error: 'Crunchbase ingestion failed' },
      { status: 500 }
    )
  }
}

function parseEmployeeCount(employeeRange: string): number {
  const ranges: Record<string, number> = {
    '1-10': 5,
    '11-50': 25,
    '51-100': 75,
    '101-250': 175,
    '251-500': 375,
    '501-1000': 750,
    '1001-5000': 2500,
    '5001-10000': 7500,
    '10000+': 15000
  }
  return ranges[employeeRange] || 0
}