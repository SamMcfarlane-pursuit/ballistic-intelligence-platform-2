import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Starting database seeding...')

  // Clear existing data
  console.log('🗑️  Clearing existing data...')
  await prisma.cybersecurityStartupFunding.deleteMany({})
  await prisma.cybersecurityStartup.deleteMany({})
  
  console.log('✅ Existing data cleared')

  // Seed cybersecurity companies from the dataset
  const companies = [
    {
      name: 'Realm Security',
      description: 'Advanced security platform providing comprehensive threat detection and response capabilities for enterprise environments.',
      founded_year: 2023,
      headquarters: 'Wellesley, Massachusetts',
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
      market_cap: 45000000,
      competitors: JSON.stringify(['CrowdStrike', 'SentinelOne', 'Palo Alto Networks']),
      is_ballistic_portfolio: false
    },
    {
      name: 'Exaforce',
      description: 'Cloud-native security orchestration platform enabling automated incident response and threat mitigation.',
      founded_year: 2022,
      headquarters: 'San Jose, California',
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
      description: 'Security platform focused on protecting distributed systems and microservices architectures.',
      founded_year: 2023,
      headquarters: 'Beaverton, Oregon',
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
      market_cap: 99000000,
      competitors: JSON.stringify(['Aqua Security', 'Sysdig', 'Snyk']),
      is_ballistic_portfolio: false
    },
    {
      name: 'Descope',
      description: 'Modern authentication and user management platform with passwordless capabilities and fraud prevention.',
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
      market_cap: 264000000,
      competitors: JSON.stringify(['Auth0', 'Okta', 'Ping Identity']),
      is_ballistic_portfolio: false
    },
    {
      name: 'RNOX Security',
      description: 'Next-generation endpoint protection platform with advanced threat hunting and forensics capabilities.',
      founded_year: 2021,
      headquarters: 'New Rochelle, New York',
      website: 'https://www.rnoxsecurity.com',
      primary_category: 'Endpoint Security',
      secondary_categories: JSON.stringify(['Threat Hunting', 'Forensics']),
      target_market: 'Enterprise',
      total_funding: 8000000,
      funding_rounds_count: 1,
      last_funding_date: new Date('2025-09-28'),
      current_stage: 'seed',
      employee_count: 30,
      estimated_revenue: 3000000,
      growth_rate: 175,
      core_technology: 'AI/ML',
      patents_count: 2,
      market_cap: 24000000,
      competitors: JSON.stringify(['Carbon Black', 'CrowdStrike Falcon', 'Microsoft Defender']),
      is_ballistic_portfolio: false
    },
    {
      name: 'Finosec',
      description: 'Financial services security platform specializing in fraud detection and compliance automation.',
      founded_year: 2023,
      headquarters: 'Alpharetta, Georgia',
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
      description: 'AI-powered infrastructure security platform preventing unauthorized changes to critical systems.',
      founded_year: 2022,
      headquarters: 'Menlo Park, California',
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
      market_cap: 12000000,
      is_ballistic_portfolio: false
    },
    {
      name: 'CloudBurst Technologies',
      description: 'Multi-cloud security posture management with automated compliance and risk assessment.',
      founded_year: 2021,
      headquarters: 'New York, New York',
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
      market_cap: 129000000,
      competitors: JSON.stringify(['Wiz', 'Orca Security', 'Lacework']),
      is_ballistic_portfolio: false
    },
    {
      name: 'Lifeguard',
      description: 'Identity threat detection and response platform protecting against account takeover and insider threats.',
      founded_year: 2023,
      headquarters: 'Austin, Texas',
      website: 'https://www.trylifeguard.com',
      primary_category: 'Identity Security',
      secondary_categories: JSON.stringify(['Threat Detection', 'Account Protection']),
      target_market: 'Enterprise',
      total_funding: 7000000,
      funding_rounds_count: 1,
      last_funding_date: new Date('2025-09-23'),
      current_stage: 'seed',
      employee_count: 22,
      estimated_revenue: 2500000,
      growth_rate: 210,
      core_technology: 'Behavioral Analytics',
      patents_count: 2,
      market_cap: 21000000,
      is_ballistic_portfolio: false
    },
    {
      name: 'Shield (Miami)',
      description: 'Comprehensive data protection and privacy platform for healthcare and financial institutions.',
      founded_year: 2022,
      headquarters: 'Miami, Florida',
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
      market_cap: 57000000,
      competitors: JSON.stringify(['Varonis', 'Nightfall', 'BigID']),
      is_ballistic_portfolio: false
    }
  ]

  console.log('📊 Creating companies...')
  
  for (const company of companies) {
    const created = await prisma.cybersecurityStartup.create({
      data: company
    })
    console.log(`  ✅ Created: ${created.name}`)
  }

  // Add funding rounds
  console.log('\n💰 Creating funding rounds...')
  
  const fundingRounds = [
    {
      company_name: 'Realm Security',
      announced_date: new Date('2025-10-08'),
      round_type: 'Series A',
      amount_usd: 15000000,
      lead_investor: 'Jump Capital (Saaya Nath)',
      investors: JSON.stringify(['Accomplice VC', 'Glasswing Ventures', 'Jump Capital (Saaya Nath)']),
      valuation: 45000000
    },
    {
      company_name: 'Oneleet',
      announced_date: new Date('2025-10-02'),
      round_type: 'Series A',
      amount_usd: 33000000,
      lead_investor: 'Dawn Capital',
      investors: JSON.stringify(['Arash Ferdowsi (Arash Ferdowsi)', 'Dawn Capital', 'Frank Slootman (Frank Slootman)']),
      valuation: 99000000
    },
    {
      company_name: 'Descope',
      announced_date: new Date('2025-09-30'),
      round_type: 'Series B',
      amount_usd: 88000000,
      lead_investor: 'Great North Ventures',
      investors: JSON.stringify(['Amiram Shachar (Amiram Shachar)', 'Ashish Aggarwal (Ashish Aggarwal)', 'Assaf Rappaport (Assaf Rappaport)']),
      valuation: 264000000
    },
    {
      company_name: 'RNOX Security',
      announced_date: new Date('2025-09-28'),
      round_type: 'Seed',
      amount_usd: 2000000,
      lead_investor: 'Great North Ventures',
      investors: JSON.stringify(['Business Finland', 'Great North Ventures (Robert Nelson)', 'Hannu Turunen (Hannu Turunen)']),
      valuation: 8000000
    },
    {
      company_name: 'CloudBurst Technologies',
      announced_date: new Date('2025-09-23'),
      round_type: 'Series A',
      amount_usd: 7000000,
      lead_investor: 'Borderless Capital',
      investors: JSON.stringify(['Bloccelerate', 'Borderless Capital', 'CoinFund Management', 'In-Q-Tel', 'Strategic Capital']),
      valuation: 43000000
    },
    {
      company_name: 'Lifeguard',
      announced_date: new Date('2025-09-23'),
      round_type: 'Seed',
      amount_usd: 1290000,
      lead_investor: 'SCOp Venture Capital',
      investors: JSON.stringify(['SCOp Venture Capital']),
      valuation: 7000000
    },
    {
      company_name: 'Shield (Miami)',
      announced_date: new Date('2025-09-22'),
      round_type: 'Seed',
      amount_usd: 5000000,
      lead_investor: 'Giant Ventures',
      investors: JSON.stringify(['Giant Ventures', 'American Express (NYS: AXP)', 'Andreessen Horowitz (Christopher Dixon)', 'Banco Santander (MC: SAN)']),
      valuation: 19000000
    },
    {
      company_name: 'Solidcore.ai',
      announced_date: new Date('2025-09-24'),
      round_type: 'Seed',
      amount_usd: 4000000,
      lead_investor: 'Runtime Ventures (David Endler)',
      investors: JSON.stringify(['EPIC Ventures', 'Runtime Ventures (David Endler)']),
      valuation: 12000000
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

  // Get final counts
  const totalCompanies = await prisma.cybersecurityStartup.count()
  const totalFunding = await prisma.cybersecurityStartupFunding.count()

  console.log('\n✨ Database seeding completed!')
  console.log(`📊 Total companies: ${totalCompanies}`)
  console.log(`💰 Total funding rounds: ${totalFunding}`)
  console.log(`\n🎯 Next steps:`)
  console.log(`   1. Run: pnpm run db:studio (to view data)`)
  console.log(`   2. Access dashboards at: http://localhost:4000/executive-dashboard`)
  console.log(`   3. Set up RAG integration for vector search`)
}

main()
  .catch((e) => {
    console.error('❌ Error during seeding:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
