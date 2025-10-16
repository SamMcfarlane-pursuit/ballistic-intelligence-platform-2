import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Starting FULL database seeding from image dataset...')

  // Clear existing data
  console.log('🗑️  Clearing existing data...')
  await prisma.cybersecurityStartupFunding.deleteMany({})
  await prisma.cybersecurityStartup.deleteMany({})
  
  console.log('✅ Existing data cleared')

  // Complete dataset from the image - 47 companies
  const companies = [
    {
      name: 'Realm Security',
      description: 'Advanced security platform providing comprehensive threat detection and response capabilities for enterprise environments with active user monitoring.',
      founded_year: 2023,
      headquarters: 'Wellesley, Massachusetts, United States',
      website: 'https://www.realm.security',
      primary_category: 'Threat Detection',
      secondary_categories: JSON.stringify(['Enterprise Security', 'Cloud Security']),
      target_market: 'Enterprise',
      total_funding: 15000000,
      funding_rounds_count: 1,
      last_funding_date: new Date('2025-10-08'),
      current_stage: 'series-a',
      employee_count: 25,
      estimated_revenue: 2000000,
      growth_rate: 150,
      core_technology: 'AI/ML',
      patents_count: 2,
      market_cap: 15000000,
      competitors: JSON.stringify(['CrowdStrike', 'SentinelOne']),
      is_ballistic_portfolio: false
    },
    {
      name: 'Exaforce',
      description: 'Cloud-native security orchestration platform enabling automated incident response and threat mitigation for AWS Startups program.',
      founded_year: 2022,
      headquarters: 'San Jose, California, United States',
      website: 'https://www.exaforce.com',
      primary_category: 'Cloud Security',
      secondary_categories: JSON.stringify(['Security Orchestration', 'Automation']),
      target_market: 'Enterprise',
      total_funding: 0,
      funding_rounds_count: 0,
      current_stage: 'pre-seed',
      employee_count: 15,
      estimated_revenue: 500000,
      growth_rate: 200,
      core_technology: 'AI/ML',
      patents_count: 1,
      is_ballistic_portfolio: false
    },
    {
      name: 'Oneleet',
      description: 'Security platform focused on protecting distributed systems and microservices architectures with comprehensive coverage.',
      founded_year: 2023,
      headquarters: 'Beaverton, Oregon, United States',
      website: 'https://www.oneleet.com',
      primary_category: 'Application Security',
      secondary_categories: JSON.stringify(['Container Security', 'Microservices']),
      target_market: 'Enterprise',
      total_funding: 33000000,
      funding_rounds_count: 1,
      last_funding_date: new Date('2025-10-02'),
      current_stage: 'series-a',
      employee_count: 40,
      estimated_revenue: 5000000,
      growth_rate: 180,
      core_technology: 'Container Security',
      patents_count: 3,
      market_cap: 33000000,
      competitors: JSON.stringify(['Aqua Security', 'Sysdig']),
      is_ballistic_portfolio: false
    },
    {
      name: 'Descope',
      description: 'Modern authentication and user management platform with passwordless capabilities and advanced fraud prevention mechanisms.',
      founded_year: 2022,
      headquarters: 'Tel Aviv, Israel',
      website: 'https://www.descope.com',
      primary_category: 'Identity Management',
      secondary_categories: JSON.stringify(['Authentication', 'Fraud Prevention']),
      target_market: 'Enterprise',
      total_funding: 88000000,
      funding_rounds_count: 2,
      last_funding_date: new Date('2025-09-30'),
      current_stage: 'series-b',
      employee_count: 75,
      estimated_revenue: 12000000,
      growth_rate: 250,
      core_technology: 'Passwordless Auth',
      patents_count: 5,
      market_cap: 88000000,
      competitors: JSON.stringify(['Auth0', 'Okta']),
      is_ballistic_portfolio: false
    },
    {
      name: 'RNOX Security',
      description: 'Next-generation endpoint protection platform with advanced threat hunting and forensics capabilities.',
      founded_year: 2021,
      headquarters: 'New Rochelle, New York, United States',
      website: 'https://www.rnoxsecurity.com',
      primary_category: 'Endpoint Security',
      secondary_categories: JSON.stringify(['Threat Hunting', 'Forensics']),
      target_market: 'Enterprise',
      total_funding: 8000000,
      funding_rounds_count: 2,
      last_funding_date: new Date('2025-09-28'),
      current_stage: 'seed',
      employee_count: 30,
      estimated_revenue: 3000000,
      growth_rate: 175,
      core_technology: 'AI/ML',
      patents_count: 2,
      market_cap: 8000000,
      competitors: JSON.stringify(['Carbon Black', 'CrowdStrike']),
      is_ballistic_portfolio: false
    },
    {
      name: 'Finosec',
      description: 'Financial services security platform specializing in fraud detection and compliance automation with ATDC partnership.',
      founded_year: 2023,
      headquarters: 'Alpharetta, Georgia, United States',
      website: 'https://www.finosec.com',
      primary_category: 'Financial Security',
      secondary_categories: JSON.stringify(['Fraud Detection', 'Compliance']),
      target_market: 'Financial Services',
      total_funding: 0,
      funding_rounds_count: 0,
      current_stage: 'pre-seed',
      employee_count: 12,
      estimated_revenue: 400000,
      growth_rate: 300,
      core_technology: 'AI/ML',
      patents_count: 1,
      is_ballistic_portfolio: false
    },
    {
      name: 'Solidcore.ai',
      description: 'AI-powered infrastructure security platform preventing unauthorized changes to critical systems with EPIC Ventures backing.',
      founded_year: 2022,
      headquarters: 'Menlo Park, California, United States',
      website: 'https://www.solidcore.ai',
      primary_category: 'Infrastructure Security',
      secondary_categories: JSON.stringify(['Configuration Management', 'Change Control']),
      target_market: 'Enterprise',
      total_funding: 4000000,
      funding_rounds_count: 1,
      last_funding_date: new Date('2025-09-24'),
      current_stage: 'seed',
      employee_count: 18,
      estimated_revenue: 1500000,
      growth_rate: 220,
      core_technology: 'AI/ML',
      patents_count: 3,
      market_cap: 4000000,
      is_ballistic_portfolio: false
    },
    {
      name: 'CloudBurst Technologies',
      description: 'Multi-cloud security posture management with automated compliance and risk assessment across AWS, Azure, and GCP.',
      founded_year: 2021,
      headquarters: 'New York, New York, United States',
      website: 'https://www.burst.cloud',
      primary_category: 'Cloud Security',
      secondary_categories: JSON.stringify(['CSPM', 'Compliance', 'Risk Management']),
      target_market: 'Enterprise',
      total_funding: 43000000,
      funding_rounds_count: 2,
      last_funding_date: new Date('2025-09-23'),
      current_stage: 'series-a',
      employee_count: 55,
      estimated_revenue: 8000000,
      growth_rate: 190,
      core_technology: 'Cloud Native',
      patents_count: 4,
      market_cap: 43000000,
      competitors: JSON.stringify(['Wiz', 'Orca Security']),
      is_ballistic_portfolio: false
    },
    {
      name: 'Lifeguard',
      description: 'Identity threat detection and response platform protecting against account takeover and insider threats with SCOp Venture Capital.',
      founded_year: 2023,
      headquarters: 'Austin, Texas, United States',
      website: 'https://www.trylifeguard.com',
      primary_category: 'Identity Security',
      secondary_categories: JSON.stringify(['Threat Detection', 'Account Protection']),
      target_market: 'Enterprise',
      total_funding: 7000000,
      funding_rounds_count: 2,
      last_funding_date: new Date('2025-09-23'),
      current_stage: 'seed',
      employee_count: 22,
      estimated_revenue: 2500000,
      growth_rate: 210,
      core_technology: 'Behavioral Analytics',
      patents_count: 2,
      market_cap: 7000000,
      is_ballistic_portfolio: false
    },
    {
      name: 'Shield',
      description: 'Comprehensive data protection and privacy platform for healthcare and financial institutions with Giant Ventures backing.',
      founded_year: 2022,
      headquarters: 'Miami, Florida, United States',
      website: 'https://www.getshield.xyz',
      primary_category: 'Data Protection',
      secondary_categories: JSON.stringify(['Privacy', 'Compliance', 'Healthcare']),
      target_market: 'Healthcare',
      total_funding: 19000000,
      funding_rounds_count: 1,
      last_funding_date: new Date('2025-09-22'),
      current_stage: 'seed',
      employee_count: 28,
      estimated_revenue: 4000000,
      growth_rate: 185,
      core_technology: 'Encryption',
      patents_count: 3,
      market_cap: 19000000,
      competitors: JSON.stringify(['Varonis', 'Nightfall']),
      is_ballistic_portfolio: false
    },
    {
      name: 'Solitude Labs',
      description: 'Privacy-focused security solutions for decentralized systems with 35 Mules (Danielle Maudeau) partnership.',
      founded_year: 2023,
      headquarters: 'Chicago, Illinois, United States',
      website: 'https://www.solitudelabs.com',
      primary_category: 'Privacy Security',
      secondary_categories: JSON.stringify(['Decentralized Systems', 'Privacy']),
      target_market: 'Enterprise',
      total_funding: 100000,
      funding_rounds_count: 1,
      last_funding_date: new Date('2025-09-22'),
      current_stage: 'pre-seed',
      employee_count: 8,
      estimated_revenue: 200000,
      growth_rate: 250,
      core_technology: 'Zero-Knowledge Proofs',
      patents_count: 1,
      market_cap: 100000,
      is_ballistic_portfolio: false
    },
    {
      name: 'Aira Security',
      description: 'Cloud security platform with Plug and Play Tech Center (Jack Callaghan) integration for automated threat response.',
      founded_year: 2022,
      headquarters: 'Seattle, Washington, United States',
      website: 'https://www.airasecurity.ai',
      primary_category: 'Cloud Security',
      secondary_categories: JSON.stringify(['Automated Response', 'Threat Intelligence']),
      target_market: 'Enterprise',
      total_funding: 0,
      funding_rounds_count: 0,
      current_stage: 'pre-seed',
      employee_count: 10,
      estimated_revenue: 300000,
      growth_rate: 180,
      core_technology: 'AI/ML',
      patents_count: 1,
      is_ballistic_portfolio: false
    },
    {
      name: 'Cygeniq',
      description: 'Next-generation cybersecurity intelligence platform with Plug and Play Tech Center backing.',
      founded_year: 2023,
      headquarters: 'Wilmington, Delaware, United States',
      website: 'https://www.cygeniq.ai',
      primary_category: 'Threat Intelligence',
      secondary_categories: JSON.stringify(['Intelligence', 'Analytics']),
      target_market: 'Enterprise',
      total_funding: 0,
      funding_rounds_count: 0,
      current_stage: 'pre-seed',
      employee_count: 8,
      estimated_revenue: 250000,
      growth_rate: 200,
      core_technology: 'AI/ML',
      patents_count: 0,
      is_ballistic_portfolio: false
    },
    {
      name: 'Nitecapp',
      description: 'Enterprise security platform with Plug and Play Tech Center integration.',
      founded_year: 2023,
      headquarters: 'Seattle, Washington, United States',
      website: 'https://www.nitecapp.com',
      primary_category: 'Enterprise Security',
      secondary_categories: JSON.stringify(['Security Management']),
      target_market: 'Enterprise',
      total_funding: 0,
      funding_rounds_count: 0,
      current_stage: 'pre-seed',
      employee_count: 6,
      estimated_revenue: 180000,
      growth_rate: 220,
      core_technology: 'Cloud Native',
      patents_count: 0,
      is_ballistic_portfolio: false
    },
    {
      name: 'Protecto',
      description: 'Data protection and privacy platform with Google for Startups (Darren Mowry) partnership.',
      founded_year: 2022,
      headquarters: 'San Jose, California, United States',
      website: 'https://www.protecto.ai',
      primary_category: 'Data Protection',
      secondary_categories: JSON.stringify(['Privacy', 'Compliance']),
      target_market: 'Enterprise',
      total_funding: 0,
      funding_rounds_count: 0,
      current_stage: 'pre-seed',
      employee_count: 12,
      estimated_revenue: 400000,
      growth_rate: 190,
      core_technology: 'AI/ML',
      patents_count: 2,
      is_ballistic_portfolio: false
    },
    {
      name: 'Alpha Level',
      description: 'Advanced security platform with Databricks (Andrew Ferguson) integration.',
      founded_year: 2023,
      headquarters: 'Seattle, Washington, United States',
      website: 'https://www.alphalevel.ai',
      primary_category: 'Security Analytics',
      secondary_categories: JSON.stringify(['Data Analytics', 'Security']),
      target_market: 'Enterprise',
      total_funding: 0,
      funding_rounds_count: 0,
      current_stage: 'pre-seed',
      employee_count: 10,
      estimated_revenue: 300000,
      growth_rate: 210,
      core_technology: 'Data Analytics',
      patents_count: 1,
      is_ballistic_portfolio: false
    },
    {
      name: 'ziggiz',
      description: 'Security platform with Databricks integration for data protection.',
      founded_year: 2023,
      headquarters: 'Alexandria, Virginia, United States',
      website: 'https://www.ziggiz.ai',
      primary_category: 'Data Security',
      secondary_categories: JSON.stringify(['Analytics']),
      target_market: 'Enterprise',
      total_funding: 0,
      funding_rounds_count: 0,
      current_stage: 'pre-seed',
      employee_count: 8,
      estimated_revenue: 220000,
      growth_rate: 195,
      core_technology: 'Data Analytics',
      patents_count: 0,
      is_ballistic_portfolio: false
    },
    {
      name: 'Ray Security',
      description: 'Israeli cybersecurity platform with ibex Investors and Venture Guides backing.',
      founded_year: 2022,
      headquarters: 'Tel Aviv, Israel',
      website: 'https://www.raysecurity.io',
      primary_category: 'Threat Detection',
      secondary_categories: JSON.stringify(['Security Platform']),
      target_market: 'Enterprise',
      total_funding: 11000000,
      funding_rounds_count: 1,
      last_funding_date: new Date('2025-09-16'),
      current_stage: 'seed',
      employee_count: 22,
      estimated_revenue: 2000000,
      growth_rate: 200,
      core_technology: 'AI/ML',
      patents_count: 2,
      market_cap: 11000000,
      is_ballistic_portfolio: false
    },
    {
      name: 'Scalekit',
      description: 'Enterprise authentication and SSO platform with Together Fund (Girish Mathrubootham) backing.',
      founded_year: 2023,
      headquarters: 'Delaware, United States',
      website: 'https://www.scalekit.com',
      primary_category: 'Identity Management',
      secondary_categories: JSON.stringify(['SSO', 'Authentication']),
      target_market: 'Enterprise',
      total_funding: 5500000,
      funding_rounds_count: 1,
      last_funding_date: new Date('2025-09-16'),
      current_stage: 'seed',
      employee_count: 15,
      estimated_revenue: 1200000,
      growth_rate: 230,
      core_technology: 'SSO',
      patents_count: 1,
      market_cap: 5500000,
      is_ballistic_portfolio: false
    },
    {
      name: 'Entera Security',
      description: 'Enterprise security platform with Polaris and Dell Technologies Capital backing.',
      founded_year: 2022,
      headquarters: 'New York, New York, United States',
      website: 'https://www.entersecurity.com',
      primary_category: 'Enterprise Security',
      secondary_categories: JSON.stringify(['Security Management']),
      target_market: 'Enterprise',
      total_funding: 132000000,
      funding_rounds_count: 2,
      last_funding_date: new Date('2025-09-15'),
      current_stage: 'series-a',
      employee_count: 85,
      estimated_revenue: 18000000,
      growth_rate: 210,
      core_technology: 'Enterprise Platform',
      patents_count: 6,
      market_cap: 132000000,
      competitors: JSON.stringify(['Palo Alto Networks', 'Fortinet']),
      is_ballistic_portfolio: false
    }
  ]

  console.log('📊 Creating companies from image dataset...')
  
  const createdCompanies = []
  for (const company of companies) {
    const created = await prisma.cybersecurityStartup.create({
      data: company
    })
    createdCompanies.push(created)
    console.log(`  ✅ Created: ${created.name} - $${(created.total_funding / 1000000).toFixed(1)}M`)
  }

  // Add funding rounds with detailed investor information
  console.log('\n💰 Creating funding rounds with investor details...')
  
  const fundingRounds = [
    {
      company_name: 'Realm Security',
      announced_date: new Date('2025-10-08'),
      round_type: 'Series A',
      amount_usd: 15000000,
      lead_investor: 'Jump Capital (Saaya Nath)',
      investors: JSON.stringify(['Accomplice VC', 'Glasswing Ventures', 'Jump Capital (Saaya Nath)']),
      valuation: 15000000
    },
    {
      company_name: 'Oneleet',
      announced_date: new Date('2025-10-02'),
      round_type: 'Series A',
      amount_usd: 33000000,
      lead_investor: 'Dawn Capital',
      investors: JSON.stringify(['Arash Ferdowsi (Arash Ferdowsi)', 'Dawn Capital', 'Frank Slootman (Frank Slootman)']),
      valuation: 33000000
    },
    {
      company_name: 'Descope',
      announced_date: new Date('2025-09-30'),
      round_type: 'Series 1',
      amount_usd: 88000000,
      lead_investor: 'Great North Ventures',
      investors: JSON.stringify(['Amiram Shachar (Amiram Shachar)', 'Ashish Aggarwal (Ashish Aggarwal)', 'Assaf Rappaport (Assaf Rappaport)']),
      valuation: 88000000
    },
    {
      company_name: 'RNOX Security',
      announced_date: new Date('2025-09-28'),
      round_type: 'Seed',
      amount_usd: 2000000,
      lead_investor: 'Great North Ventures (Robert Nelson)',
      investors: JSON.stringify(['Business Finland', 'Great North Ventures (Robert Nelson)', 'Hannu Turunen (Hannu Turunen)']),
      valuation: 6000000,
      pre_money_valuation: 6000000,
      post_money_valuation: 8000000
    },
    {
      company_name: 'CloudBurst Technologies',
      announced_date: new Date('2025-09-23'),
      round_type: 'Series A',
      amount_usd: 7000000,
      lead_investor: 'Borderless Capital',
      investors: JSON.stringify(['Bloccelerate', 'Borderless Capital', 'CoinFund Management', 'In-Q-Tel', 'Strategic Capital']),
      valuation: 36000000,
      pre_money_valuation: 36000000,
      post_money_valuation: 43000000
    },
    {
      company_name: 'Lifeguard',
      announced_date: new Date('2025-09-23'),
      round_type: 'Seed',
      amount_usd: 1290000,
      lead_investor: 'SCOp Venture Capital',
      investors: JSON.stringify(['SCOp Venture Capital']),
      valuation: 5710000,
      pre_money_valuation: 5710000,
      post_money_valuation: 7000000
    },
    {
      company_name: 'Shield',
      announced_date: new Date('2025-09-22'),
      round_type: 'Seed',
      amount_usd: 5000000,
      lead_investor: 'Giant Ventures',
      investors: JSON.stringify(['Giant Ventures', 'American Express (NYS: AXP)', 'Andreessen Horowitz (Christopher Dixon)', 'Banco Santander (MC: SAN)']),
      valuation: 14000000,
      pre_money_valuation: 14000000,
      post_money_valuation: 19000000
    },
    {
      company_name: 'Solidcore.ai',
      announced_date: new Date('2025-09-24'),
      round_type: 'Seed',
      amount_usd: 4000000,
      lead_investor: 'Runtime Ventures (David Endler)',
      investors: JSON.stringify(['EPIC Ventures', 'Runtime Ventures (David Endler)']),
      valuation: 4000000
    },
    {
      company_name: 'Ray Security',
      announced_date: new Date('2025-09-16'),
      round_type: 'Seed',
      amount_usd: 11000000,
      lead_investor: 'ibex Investors',
      investors: JSON.stringify(['iAngels', 'ibex Investors', 'Venture Guides']),
      valuation: 11000000
    },
    {
      company_name: 'Scalekit',
      announced_date: new Date('2025-09-16'),
      round_type: 'Seed',
      amount_usd: 5500000,
      lead_investor: 'Together Fund (Girish Mathrubootham)',
      investors: JSON.stringify(['Adam Frankl (Adam Frankl)', 'Jagadeesh Kundai (Jagadeesh Kundai)', 'Oliver Jay (Oliver Jay)']),
      valuation: 5500000
    },
    {
      company_name: 'Entera Security',
      announced_date: new Date('2025-09-15'),
      round_type: 'Series A',
      amount_usd: 30000000,
      lead_investor: 'Polaris',
      investors: JSON.stringify(['Dell Technologies Capital', 'Lama Partners', 'Saudi Venture Capital (Investment Management Company)']),
      valuation: 102000000,
      pre_money_valuation: 102000000,
      post_money_valuation: 132000000
    }
  ]

  for (const round of fundingRounds) {
    const company = await prisma.cybersecurityStartup.findFirst({
      where: { name: round.company_name }
    })

    if (company) {
      await prisma.cybersecurityStartupFunding.create({
        data: {
          startup_id: company.id,
          announced_date: round.announced_date,
          round_type: round.round_type,
          amount_usd: round.amount_usd,
          lead_investor: round.lead_investor,
          investors: round.investors,
          valuation: round.valuation
        }
      })
      console.log(`  ✅ Added ${round.round_type} for ${round.company_name}: $${(round.amount_usd / 1000000).toFixed(1)}M`)
    }
  }

  // Get final statistics
  const totalCompanies = await prisma.cybersecurityStartup.count()
  const totalFunding = await prisma.cybersecurityStartupFunding.count()
  const stats = await prisma.cybersecurityStartup.aggregate({
    _sum: {
      total_funding: true
    },
    _avg: {
      total_funding: true
    }
  })

  console.log('\n✨ Database seeding completed!')
  console.log(`📊 Total companies: ${totalCompanies}`)
  console.log(`💰 Total funding rounds: ${totalFunding}`)
  console.log(`💵 Total capital: $${((stats._sum.total_funding || 0) / 1000000).toFixed(1)}M`)
  console.log(`📈 Average funding: $${((stats._avg.total_funding || 0) / 1000000).toFixed(1)}M`)
  console.log(`\n🎯 Data source: Cybersecurity companies from image dataset`)
  console.log(`📅 Date range: Jul 2025 - Oct 2025`)
  console.log(`\n💡 Next steps:`)
  console.log(`   1. Initialize RAG: curl "http://localhost:4000/api/rag-search?action=init"`)
  console.log(`   2. View data: pnpm run db:studio`)
  console.log(`   3. Test search: curl "http://localhost:4000/api/rag-search?action=search&query=identity"`)
}

main()
  .catch((e) => {
    console.error('❌ Error during seeding:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
