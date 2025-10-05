import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('Seeding Ballistic Ventures funding database...')

  // Create Ballistic Portfolio Companies
  const portfolioCompanies = await Promise.all([
    prisma.ballisticPortfolioCompany.create({
      data: {
        name: 'SecureShield AI',
        description: 'AI-powered threat detection and response platform using machine learning to identify and neutralize advanced persistent threats',
        founded_year: 2021,
        location: 'Palo Alto, CA',
        cybersecurity_category: 'AI Security',
        funding_stage: 'Series A',
        funding_amount: 15000000,
        funding_date: new Date('2023-06-15'),
        lead_investor: 'Ballistic Ventures',
        employee_range: '50-100',
        website: 'https://secureshield.ai',
        users: '10K+',
        revenue: '$5M ARR',
        growth: '300% YoY',
        active_users: true,
        paying_customers: true,
        mssp_integration: true,
        market_traction: 85,
      },
    }),
    prisma.ballisticPortfolioCompany.create({
      data: {
        name: 'CloudFortress',
        description: 'Cloud-native security posture management platform providing continuous compliance and threat protection for multi-cloud environments',
        founded_year: 2020,
        location: 'Austin, TX',
        cybersecurity_category: 'Cloud Security',
        funding_stage: 'Series B',
        funding_amount: 35000000,
        funding_date: new Date('2023-09-20'),
        lead_investor: 'Ballistic Ventures',
        employee_range: '100-200',
        website: 'https://cloudfortress.com',
        users: '50K+',
        revenue: '$20M ARR',
        growth: '250% YoY',
        active_users: true,
        paying_customers: true,
        mssp_integration: true,
        market_traction: 92,
        exit_type: 'acquired',
        acquirer: 'Cisco',
        exit_date: new Date('2024-01-15'),
        exit_value: 450000000,
      },
    }),
    prisma.ballisticPortfolioCompany.create({
      data: {
        name: 'ZeroTrust Networks',
        description: 'Comprehensive zero trust architecture solution providing identity-based security for modern distributed enterprises',
        founded_year: 2021,
        location: 'Seattle, WA',
        cybersecurity_category: 'Identity Security',
        funding_stage: 'Series A',
        funding_amount: 12000000,
        funding_date: new Date('2023-03-10'),
        lead_investor: 'Ballistic Ventures',
        employee_range: '25-50',
        website: 'https://zerotrust.networks',
        users: '5K+',
        revenue: '$2M ARR',
        growth: '400% YoY',
        active_users: true,
        paying_customers: true,
        mssp_integration: false,
        market_traction: 78,
      },
    }),
    prisma.ballisticPortfolioCompany.create({
      data: {
        name: 'ThreatHunter Pro',
        description: 'Advanced threat hunting platform combining behavioral analysis with threat intelligence to detect sophisticated attacks',
        founded_year: 2022,
        location: 'Boston, MA',
        cybersecurity_category: 'Threat Detection',
        funding_stage: 'Seed',
        funding_amount: 8000000,
        funding_date: new Date('2023-11-10'),
        lead_investor: 'Ballistic Ventures',
        employee_range: '10-25',
        website: 'https://threathunter.pro',
        users: '1K+',
        revenue: '$500K ARR',
        growth: '600% YoY',
        active_users: true,
        paying_customers: false,
        mssp_integration: true,
        market_traction: 65,
      },
    }),
  ])

  // Create Ballistic Funding Rounds
  const fundingRounds = await Promise.all([
    prisma.ballisticFundingRound.create({
      data: {
        company_id: portfolioCompanies[0].id,
        round_type: 'Series A',
        amount_usd: 15000000,
        announced_date: new Date('2023-06-15'),
        lead_investor: 'Ballistic Ventures',
        valuation: 75000000,
        pre_money_valuation: 60000000,
        post_money_valuation: 75000000,
        ballistic_participation: true,
        investment_thesis: 'AI-driven threat detection represents the future of cybersecurity, with SecureShield AI leading the charge in ML-based security solutions',
        due_diligence_notes: 'Strong technical team with proven track record in AI and security. Large addressable market with clear product-market fit.',
        board_seat: true,
      },
    }),
    prisma.ballisticFundingRound.create({
      data: {
        company_id: portfolioCompanies[1].id,
        round_type: 'Series B',
        amount_usd: 35000000,
        announced_date: new Date('2023-09-20'),
        lead_investor: 'Ballistic Ventures',
        valuation: 200000000,
        pre_money_valuation: 165000000,
        post_money_valuation: 200000000,
        ballistic_participation: true,
        investment_thesis: 'Cloud security is critical as enterprises migrate to multi-cloud environments. CloudFortress has exceptional technology and market traction.',
        due_diligence_notes: 'Outstanding growth metrics and enterprise adoption. Strategic fit for major cloud providers.',
        board_seat: true,
      },
    }),
  ])

  // Create Ballistic Team Members
  const teamMembers = await Promise.all([
    prisma.ballisticTeamMember.create({
      data: {
        company_id: portfolioCompanies[0].id,
        name: 'Dr. Sarah Chen',
        position: 'CEO & Co-founder',
        background: 'Former Head of AI Security at Google, PhD in Machine Learning from Stanford',
        linkedin_url: 'https://linkedin.com/in/sarahchen',
        is_founder: true,
        is_ceo: true,
        prior_experience: 'Google, Palo Alto Networks, PhD Stanford',
      },
    }),
    prisma.ballisticTeamMember.create({
      data: {
        company_id: portfolioCompanies[0].id,
        name: 'Michael Rodriguez',
        position: 'CTO & Co-founder',
        background: 'Lead Security Engineer at Amazon Web Services, expert in distributed systems',
        linkedin_url: 'https://linkedin.com/in/mrodriguez',
        is_founder: true,
        is_cto: true,
        prior_experience: 'AWS, Netflix, MIT',
      },
    }),
    prisma.ballisticTeamMember.create({
      data: {
        company_id: portfolioCompanies[1].id,
        name: 'Jennifer Wong',
        position: 'CEO & Founder',
        background: 'Former Director of Cloud Security at Microsoft, 15+ years in enterprise security',
        linkedin_url: 'https://linkedin.com/in/jenniferwong',
        is_founder: true,
        is_ceo: true,
        prior_experience: 'Microsoft, Oracle, Harvard MBA',
      },
    }),
  ])

  // Create Ballistic Exit Data
  const exitData = await Promise.all([
    prisma.ballisticExitData.create({
      data: {
        company_id: portfolioCompanies[1].id,
        exit_type: 'acquired',
        exit_date: new Date('2024-01-15'),
        exit_value: 450000000,
        acquirer: 'Cisco',
        deal_terms: 'Cash and stock transaction with earnout provisions',
        investment_amount: 35000000,
        return_multiple: 12.8,
        holding_period: 16,
        irr: 285,
        strategic_importance: 'Strategic acquisition to enhance Cisco\'s cloud security portfolio',
        market_validation: true,
      },
    }),
  ])

  // Create Cybersecurity Startups (tracked but not necessarily in portfolio)
  const cybersecurityStartups = await Promise.all([
    prisma.cybersecurityStartup.create({
      data: {
        name: 'QuantumShield',
        description: 'Post-quantum cryptography solutions for enterprise security against quantum computing threats',
        founded_year: 2022,
        headquarters: 'Cambridge, MA',
        website: 'https://quantumshield.security',
        primary_category: 'Cryptography',
        secondary_categories: '["Quantum Computing", "Enterprise Security"]',
        target_market: 'Enterprise, Government',
        total_funding: 5000000,
        funding_rounds_count: 2,
        last_funding_date: new Date('2023-10-15'),
        current_stage: 'Seed',
        employee_count: 15,
        estimated_revenue: 300000,
        growth_rate: 200,
        core_technology: 'Quantum Cryptography',
        patents_count: 8,
        is_ballistic_portfolio: false,
        ballistic_notes: 'Promising technology but early stage. Monitoring for Series A.',
      },
    }),
    prisma.cybersecurityStartup.create({
      data: {
        name: 'APIGuardian',
        description: 'API security and management platform for modern application architectures',
        founded_year: 2021,
        headquarters: 'San Francisco, CA',
        website: 'https://apiguardian.io',
        primary_category: 'API Security',
        secondary_categories: '["Application Security", "DevSecOps"]',
        target_market: 'Enterprise, Developers',
        total_funding: 15000000,
        funding_rounds_count: 3,
        last_funding_date: new Date('2023-08-20'),
        current_stage: 'Series A',
        employee_count: 35,
        estimated_revenue: 2500000,
        growth_rate: 180,
        core_technology: 'API Gateway, WAF',
        patents_count: 3,
        is_ballistic_portfolio: true,
        ballistic_notes: 'Strong product-market fit, excellent team. Potential for Series B.',
      },
    }),
    prisma.cybersecurityStartup.create({
      data: {
        name: 'IoTFortress',
        description: 'IoT security platform providing device discovery, vulnerability management, and threat detection',
        founded_year: 2020,
        headquarters: 'Austin, TX',
        website: 'https://iotfortress.com',
        primary_category: 'IoT Security',
        secondary_categories: '["Device Management", "Network Security"]',
        target_market: 'Enterprise, Industrial',
        total_funding: 22000000,
        funding_rounds_count: 4,
        last_funding_date: new Date('2023-12-01'),
        current_stage: 'Series B',
        employee_count: 60,
        estimated_revenue: 8000000,
        growth_rate: 150,
        core_technology: 'IoT Protocol Analysis, Machine Learning',
        patents_count: 12,
        is_ballistic_portfolio: true,
        ballistic_notes: 'Market leader in IoT security. Strong enterprise adoption and revenue growth.',
      },
    }),
  ])

  // Create Cybersecurity Startup Funding Rounds
  const startupFundingRounds = await Promise.all([
    prisma.cybersecurityStartupFunding.create({
      data: {
        startup_id: cybersecurityStartups[0].id,
        round_type: 'Seed',
        amount_usd: 5000000,
        announced_date: new Date('2023-10-15'),
        lead_investor: 'Data Collective',
        valuation: 25000000,
        investors: '["Data Collective", "Google Ventures", "Khosla Ventures"]',
        investment_thesis: 'Post-quantum cryptography will be critical as quantum computing advances',
      },
    }),
    prisma.cybersecurityStartupFunding.create({
      data: {
        startup_id: cybersecurityStartups[1].id,
        round_type: 'Series A',
        amount_usd: 15000000,
        announced_date: new Date('2023-08-20'),
        lead_investor: 'Ballistic Ventures',
        valuation: 75000000,
        investors: '["Ballistic Ventures", "Accel", "Kleiner Perkins"]',
        investment_thesis: 'API security is critical with the rise of microservices and cloud-native applications',
      },
    }),
  ])

  // Create Cybersecurity Startup Team Members
  const startupTeamMembers = await Promise.all([
    prisma.cybersecurityStartupTeam.create({
      data: {
        startup_id: cybersecurityStartups[0].id,
        name: 'Dr. Alex Thompson',
        position: 'CEO & Founder',
        background: 'Quantum computing researcher at MIT, expert in cryptographic algorithms',
        linkedin_url: 'https://linkedin.com/in/alexthompson',
        is_founder: true,
        prior_companies: '["MIT", "IBM Research"]',
        education: 'PhD in Quantum Computing, MIT',
        expertise: 'Quantum Cryptography, Algorithm Design',
      },
    }),
    prisma.cybersecurityStartupTeam.create({
      data: {
        startup_id: cybersecurityStartups[1].id,
        name: 'Lisa Park',
        position: 'CEO & Co-founder',
        background: 'Former Product Manager at Twilio, expert in API platforms',
        linkedin_url: 'https://linkedin.com/in/lisapark',
        is_founder: true,
        prior_companies: '["Twilio", "Stripe"]',
        education: 'Stanford Computer Science',
        expertise: 'API Management, Product Strategy',
      },
    }),
  ])

  // Create Acquisitions
  const acquisitions = await Promise.all([
    prisma.acquisition.create({
      data: {
        startup_id: cybersecurityStartups[2].id,
        acquirer: 'Microsoft',
        acquisition_date: new Date('2024-02-01'),
        acquisition_value: 120000000,
        deal_type: 'cash',
        premium_percentage: 45,
        earnout: true,
        earnout_terms: '30M earnout based on revenue targets over 3 years',
        strategic_rationale: 'Strengthen Microsoft\'s IoT security portfolio and Azure IoT offerings',
        integration_status: 'in_progress',
      },
    }),
  ])

  console.log('Database seeded successfully!')
  console.log(`Created ${portfolioCompanies.length} portfolio companies`)
  console.log(`Created ${fundingRounds.length} funding rounds`)
  console.log(`Created ${teamMembers.length} team members`)
  console.log(`Created ${exitData.length} exit records`)
  console.log(`Created ${cybersecurityStartups.length} cybersecurity startups`)
  console.log(`Created ${startupFundingRounds.length} startup funding rounds`)
  console.log(`Created ${startupTeamMembers.length} startup team members`)
  console.log(`Created ${acquisitions.length} acquisition records`)
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })