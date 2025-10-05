import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('Seeding database...')

  // Create sample companies
  const companies = await Promise.all([
    prisma.cybersecurityCompany.create({
      data: {
        company_name: 'CyberShield AI',
        website: 'https://cybershield.ai',
        country: 'United States',
        city: 'San Francisco',
        founded_year: 2021,
        employee_range: '51-100'
      }
    }),
    prisma.cybersecurityCompany.create({
      data: {
        company_name: 'QuantumSec',
        website: 'https://quantumsec.com',
        country: 'United States',
        city: 'Boston',
        founded_year: 2022,
        employee_range: '11-50'
      }
    }),
    prisma.cybersecurityCompany.create({
      data: {
        company_name: 'ThreatLock',
        website: 'https://threatlock.com',
        country: 'Israel',
        city: 'Tel Aviv',
        founded_year: 2020,
        employee_range: '101-250'
      }
    }),
    prisma.cybersecurityCompany.create({
      data: {
        company_name: 'ZeroDay Defense',
        website: 'https://zerodaydefense.com',
        country: 'United States',
        city: 'Austin',
        founded_year: 2021,
        employee_range: '51-100'
      }
    }),
    prisma.cybersecurityCompany.create({
      data: {
        company_name: 'CloudGuard Security',
        website: 'https://cloudguard.security',
        country: 'United Kingdom',
        city: 'London',
        founded_year: 2019,
        employee_range: '251-500'
      }
    }),
    prisma.cybersecurityCompany.create({
      data: {
        company_name: 'AI Sentinel',
        website: 'https://aisentinel.io',
        country: 'Canada',
        city: 'Toronto',
        founded_year: 2022,
        employee_range: '11-50'
      }
    }),
    prisma.cybersecurityCompany.create({
      data: {
        company_name: 'Blockchain Firewall',
        website: 'https://blockchainfirewall.com',
        country: 'Germany',
        city: 'Berlin',
        founded_year: 2021,
        employee_range: '51-100'
      }
    }),
    prisma.cybersecurityCompany.create({
      data: {
        company_name: 'IoT Secure',
        website: 'https://iotsecure.com',
        country: 'United States',
        city: 'Seattle',
        founded_year: 2020,
        employee_range: '101-250'
      }
    })
  ])

  // Create sample investors
  const investors = await Promise.all([
    prisma.investor.create({
      data: {
        name: 'Ballistic Ventures',
        investor_type: 'VC Firm'
      }
    }),
    prisma.investor.create({
      data: {
        name: 'Sequoia Capital',
        investor_type: 'VC Firm'
      }
    }),
    prisma.investor.create({
      data: {
        name: 'Accel',
        investor_type: 'VC Firm'
      }
    }),
    prisma.investor.create({
      data: {
        name: 'Kleiner Perkins',
        investor_type: 'VC Firm'
      }
    }),
    prisma.investor.create({
      data: {
        name: 'Lightspeed Venture Partners',
        investor_type: 'VC Firm'
      }
    }),
    prisma.investor.create({
      data: {
        name: 'Y Combinator',
        investor_type: 'Accelerator'
      }
    }),
    prisma.investor.create({
      data: {
        name: 'Andreessen Horowitz',
        investor_type: 'VC Firm'
      }
    }),
    prisma.investor.create({
      data: {
        name: 'GV (Google Ventures)',
        investor_type: 'Corporate VC'
      }
    }),
    prisma.investor.create({
      data: {
        name: 'Index Ventures',
        investor_type: 'VC Firm'
      }
    }),
    prisma.investor.create({
      data: {
        name: 'Bessemer Venture Partners',
        investor_type: 'VC Firm'
      }
    })
  ])

  // Create sample funding rounds
  const fundingRounds = await Promise.all([
    prisma.fundingRound.create({
      data: {
        company_id: companies[0].id, // CyberShield AI
        announced_date: new Date('2024-01-15'),
        round_type: 'Series A',
        amount_usd: 25000000,
        lead_investor: 'Ballistic Ventures',
        lumpsum_investors: 'Ballistic Ventures, Kleiner Perkins',
        investors: {
          connect: [
            { id: investors[0].id }, // Ballistic Ventures
            { id: investors[3].id }  // Kleiner Perkins
          ]
        }
      }
    }),
    prisma.fundingRound.create({
      data: {
        company_id: companies[1].id, // QuantumSec
        announced_date: new Date('2024-01-10'),
        round_type: 'Seed',
        amount_usd: 5000000,
        lead_investor: 'Accel',
        lumpsum_investors: 'Accel, Y Combinator',
        investors: {
          connect: [
            { id: investors[2].id }, // Accel
            { id: investors[5].id }  // Y Combinator
          ]
        }
      }
    }),
    prisma.fundingRound.create({
      data: {
        company_id: companies[2].id, // ThreatLock
        announced_date: new Date('2024-01-05'),
        round_type: 'Series B',
        amount_usd: 75000000,
        lead_investor: 'Sequoia Capital',
        lumpsum_investors: 'Sequoia Capital, Lightspeed Venture Partners',
        investors: {
          connect: [
            { id: investors[1].id }, // Sequoia Capital
            { id: investors[4].id }  // Lightspeed Venture Partners
          ]
        }
      }
    }),
    prisma.fundingRound.create({
      data: {
        company_id: companies[3].id, // ZeroDay Defense
        announced_date: new Date('2023-12-20'),
        round_type: 'Series A',
        amount_usd: 18000000,
        lead_investor: 'Andreessen Horowitz',
        lumpsum_investors: 'Andreessen Horowitz, GV',
        investors: {
          connect: [
            { id: investors[6].id }, // Andreessen Horowitz
            { id: investors[7].id }  // GV
          ]
        }
      }
    }),
    prisma.fundingRound.create({
      data: {
        company_id: companies[4].id, // CloudGuard Security
        announced_date: new Date('2023-12-15'),
        round_type: 'Series C',
        amount_usd: 120000000,
        lead_investor: 'Index Ventures',
        lumpsum_investors: 'Index Ventures, Bessemer Venture Partners',
        investors: {
          connect: [
            { id: investors[8].id }, // Index Ventures
            { id: investors[9].id }  // Bessemer Venture Partners
          ]
        }
      }
    }),
    prisma.fundingRound.create({
      data: {
        company_id: companies[5].id, // AI Sentinel
        announced_date: new Date('2023-12-10'),
        round_type: 'Seed',
        amount_usd: 3500000,
        lead_investor: 'Y Combinator',
        lumpsum_investors: 'Y Combinator',
        investors: {
          connect: [
            { id: investors[5].id }  // Y Combinator
          ]
        }
      }
    }),
    prisma.fundingRound.create({
      data: {
        company_id: companies[6].id, // Blockchain Firewall
        announced_date: new Date('2023-12-05'),
        round_type: 'Series A',
        amount_usd: 15000000,
        lead_investor: 'Kleiner Perkins',
        lumpsum_investors: 'Kleiner Perkins, Accel',
        investors: {
          connect: [
            { id: investors[3].id }, // Kleiner Perkins
            { id: investors[2].id }  // Accel
          ]
        }
      }
    }),
    prisma.fundingRound.create({
      data: {
        company_id: companies[7].id, // IoT Secure
        announced_date: new Date('2023-11-30'),
        round_type: 'Series B',
        amount_usd: 45000000,
        lead_investor: 'Lightspeed Venture Partners',
        lumpsum_investors: 'Lightspeed Venture Partners, Sequoia Capital',
        investors: {
          connect: [
            { id: investors[4].id }, // Lightspeed Venture Partners
            { id: investors[1].id }  // Sequoia Capital
          ]
        }
      }
    })
  ])

  console.log('Database seeded successfully!')
  console.log(`Created ${companies.length} companies`)
  console.log(`Created ${investors.length} investors`)
  console.log(`Created ${fundingRounds.length} funding rounds`)

  // Create Ballistic Ventures portfolio companies
  console.log('Creating Ballistic Ventures portfolio data...')
  
  const ballisticCompanies = await Promise.all([
    prisma.ballisticPortfolioCompany.create({
      data: {
        name: 'Pangaea',
        description: 'Cloud security posture management and threat detection platform',
        founded_year: 2020,
        location: 'San Francisco, CA',
        cybersecurity_category: 'Cloud Security',
        funding_stage: 'series-a',
        funding_amount: 15000000,
        funding_date: new Date('2023-03-15'),
        lead_investor: 'Ballistic Ventures',
        employee_range: '50-100',
        website: 'https://pangaea.security',
        users: '2,500+ enterprises',
        revenue: '$8M ARR',
        growth: '300% YoY',
        active_users: true,
        paying_customers: true,
        mssp_integration: true,
        market_traction: 95,
        exit_type: 'acquired',
        acquirer: 'CrowdStrike',
        exit_date: new Date('2024-01-15'),
        exit_value: 85000000
      }
    }),
    prisma.ballisticPortfolioCompany.create({
      data: {
        name: 'Seceon',
        description: 'AI-driven threat detection and automated response platform',
        founded_year: 2021,
        location: 'Boston, MA',
        cybersecurity_category: 'Threat Detection',
        funding_stage: 'seed',
        funding_amount: 8000000,
        funding_date: new Date('2023-06-20'),
        lead_investor: 'Ballistic Ventures',
        employee_range: '25-50',
        users: '1,200+ organizations',
        revenue: '$4M ARR',
        growth: '250% YoY',
        active_users: true,
        paying_customers: true,
        mssp_integration: true,
        market_traction: 88
      }
    }),
    prisma.ballisticPortfolioCompany.create({
      data: {
        name: 'NexusGuard',
        description: 'Zero-trust network access and identity security platform',
        founded_year: 2020,
        location: 'Austin, TX',
        cybersecurity_category: 'Identity Security',
        funding_stage: 'series-a',
        funding_amount: 12000000,
        funding_date: new Date('2023-09-10'),
        lead_investor: 'Ballistic Ventures',
        employee_range: '40-80',
        users: '3,000+ businesses',
        revenue: '$6M ARR',
        growth: '200% YoY',
        active_users: true,
        paying_customers: true,
        mssp_integration: true,
        market_traction: 92
      }
    }),
    prisma.ballisticPortfolioCompany.create({
      data: {
        name: 'CyberFlow',
        description: 'Supply chain security and third-party risk management',
        founded_year: 2021,
        location: 'Seattle, WA',
        cybersecurity_category: 'Supply Chain Security',
        funding_stage: 'pre-seed',
        funding_amount: 3000000,
        funding_date: new Date('2023-11-05'),
        lead_investor: 'Ballistic Ventures',
        employee_range: '15-25',
        users: '500+ enterprises',
        revenue: '$1.5M ARR',
        growth: '400% YoY',
        active_users: true,
        paying_customers: true,
        mssp_integration: false,
        market_traction: 75
      }
    }),
    prisma.ballisticPortfolioCompany.create({
      data: {
        name: 'QuantumShield',
        description: 'Post-quantum cryptography and quantum-resistant solutions',
        founded_year: 2022,
        location: 'Cambridge, MA',
        cybersecurity_category: 'Quantum Security',
        funding_stage: 'pre-seed',
        funding_amount: 2500000,
        funding_date: new Date('2023-12-01'),
        lead_investor: 'Ballistic Ventures',
        employee_range: '10-20',
        users: '200+ organizations',
        revenue: '$0.8M ARR',
        growth: '600% YoY',
        active_users: true,
        paying_customers: false,
        mssp_integration: false,
        market_traction: 65
      }
    })
  ])

  // Create investment criteria
  const investmentCriteria = await Promise.all([
    prisma.investmentCriteria.create({
      data: {
        criteria: 'Active User Engagement',
        description: 'Users actively engaging with the product',
        importance: 'high',
        companies_meeting: 5,
        total_companies: 5
      }
    }),
    prisma.investmentCriteria.create({
      data: {
        criteria: 'Paying Customers',
        description: 'Companies placing orders and generating revenue',
        importance: 'high',
        companies_meeting: 4,
        total_companies: 5
      }
    }),
    prisma.investmentCriteria.create({
      data: {
        criteria: 'MSSP Integration',
        description: 'MSSPs can integrate without heavy support',
        importance: 'medium',
        companies_meeting: 3,
        total_companies: 5
      }
    }),
    prisma.investmentCriteria.create({
      data: {
        criteria: 'Technical Innovation',
        description: 'Novel technology addressing critical security gaps',
        importance: 'high',
        companies_meeting: 5,
        total_companies: 5
      }
    }),
    prisma.investmentCriteria.create({
      data: {
        criteria: 'Founder Experience',
        description: 'Team with deep cybersecurity domain expertise',
        importance: 'high',
        companies_meeting: 5,
        total_companies: 5
      }
    }),
    prisma.investmentCriteria.create({
      data: {
        criteria: 'Market Timing',
        description: 'Addressing emerging threats and market needs',
        importance: 'medium',
        companies_meeting: 4,
        total_companies: 5
      }
    })
  ])

  console.log(`Created ${ballisticCompanies.length} Ballistic Ventures portfolio companies`)
  console.log(`Created ${investmentCriteria.length} investment criteria`)
  console.log('Ballistic Ventures data seeded successfully!')

  // Create cybersecurity conventions data
  console.log('Creating cybersecurity conventions data...')
  
  const conventions = await Promise.all([
    prisma.cybersecurityConvention.create({
      data: {
        name: 'RSA Conference 2024',
        location: 'San Francisco, CA',
        start_date: new Date('2024-04-29'),
        end_date: new Date('2024-05-02'),
        website: 'https://www.rsaconference.com',
        description: 'Premier cybersecurity conference bringing together industry leaders and innovators',
        is_active: true
      }
    }),
    prisma.cybersecurityConvention.create({
      data: {
        name: 'Black Hat USA 2024',
        location: 'Las Vegas, NV',
        start_date: new Date('2024-08-03'),
        end_date: new Date('2024-08-08'),
        website: 'https://www.blackhat.com',
        description: 'Leading security conference featuring cutting-edge research and training',
        is_active: true
      }
    }),
    prisma.cybersecurityConvention.create({
      data: {
        name: 'DEF CON 32',
        location: 'Las Vegas, NV',
        start_date: new Date('2024-08-08'),
        end_date: new Date('2024-08-11'),
        website: 'https://defcon.org',
        description: 'World\'s longest running and largest underground hacking conference',
        is_active: true
      }
    })
  ])

  // Create convention companies (potential investment targets)
  const conventionCompanies = await Promise.all([
    prisma.conventionCompany.create({
      data: {
        convention_id: conventions[0].id, // RSA Conference
        company_name: 'SecureNexus AI',
        booth_number: 'A123',
        description: 'AI-powered threat intelligence platform for enterprise security teams',
        website: 'https://securenexus.ai',
        cybersecurity_category: 'Threat Intelligence',
        funding_stage: 'seed',
        contact_email: 'invest@securenexus.ai',
        contact_name: 'Sarah Johnson',
        product_demo: true,
        seeking_investment: true,
        notes: 'Impressive demo showing real-time threat detection with 85% accuracy',
        // Ballistic Ventures criteria scores
        active_users_score: 75,
        paying_customers_score: 60,
        mssp_integration_score: 80,
        technical_innovation: 90,
        founder_experience: 85,
        market_timing_score: 88,
        overall_fit_score: 80,
        status: 'prospect'
      }
    }),
    prisma.conventionCompany.create({
      data: {
        convention_id: conventions[0].id, // RSA Conference
        company_name: 'ZeroTrust Dynamics',
        booth_number: 'B456',
        description: 'Zero-trust architecture solutions for cloud-native applications',
        website: 'https://zerotrustdynamics.com',
        cybersecurity_category: 'Identity Security',
        funding_stage: 'pre-seed',
        contact_email: 'funding@zerotrustdynamics.com',
        contact_name: 'Michael Chen',
        product_demo: true,
        seeking_investment: true,
        notes: 'Strong founding team with ex-Google and Microsoft security experts',
        // Ballistic Ventures criteria scores
        active_users_score: 65,
        paying_customers_score: 40,
        mssp_integration_score: 70,
        technical_innovation: 85,
        founder_experience: 95,
        market_timing_score: 82,
        overall_fit_score: 75,
        status: 'contacted'
      }
    }),
    prisma.conventionCompany.create({
      data: {
        convention_id: conventions[1].id, // Black Hat
        company_name: 'QuantumCrypt Labs',
        booth_number: 'C789',
        description: 'Post-quantum encryption solutions for financial institutions',
        website: 'https://quantumcryptlabs.com',
        cybersecurity_category: 'Quantum Security',
        funding_stage: 'seed',
        contact_email: 'partnerships@quantumcryptlabs.com',
        contact_name: 'Dr. Emily Rodriguez',
        product_demo: true,
        seeking_investment: true,
        notes: 'Breakthrough quantum-resistant algorithms with 3 patents filed',
        // Ballistic Ventures criteria scores
        active_users_score: 55,
        paying_customers_score: 30,
        mssp_integration_score: 45,
        technical_innovation: 98,
        founder_experience: 90,
        market_timing_score: 95,
        overall_fit_score: 85,
        status: 'meeting'
      }
    }),
    prisma.conventionCompany.create({
      data: {
        convention_id: conventions[1].id, // Black Hat
        company_name: 'CloudArmor Systems',
        booth_number: 'D012',
        description: 'Automated cloud security posture management with AI remediation',
        website: 'https://cloudarmor.systems',
        cybersecurity_category: 'Cloud Security',
        funding_stage: 'series-a',
        contact_email: 'vc@cloudarmor.systems',
        contact_name: 'James Wilson',
        product_demo: true,
        seeking_investment: true,
        notes: 'Already has 15 enterprise customers including 2 Fortune 500 companies',
        // Ballistic Ventures criteria scores
        active_users_score: 90,
        paying_customers_score: 85,
        mssp_integration_score: 75,
        technical_innovation: 80,
        founder_experience: 88,
        market_timing_score: 85,
        overall_fit_score: 88,
        status: 'due_diligence'
      }
    }),
    prisma.conventionCompany.create({
      data: {
        convention_id: conventions[2].id, // DEF CON
        company_name: 'ThreatFlow Analytics',
        booth_number: 'E345',
        description: 'Open-source threat intelligence platform with community-driven data sharing',
        website: 'https://threatflow.io',
        cybersecurity_category: 'Threat Detection',
        funding_stage: 'pre-seed',
        contact_email: 'hello@threatflow.io',
        contact_name: 'Alex Kumar',
        product_demo: true,
        seeking_investment: true,
        notes: 'Strong open-source community with 2,000+ contributors on GitHub',
        // Ballistic Ventures criteria scores
        active_users_score: 85,
        paying_customers_score: 25,
        mssp_integration_score: 90,
        technical_innovation: 75,
        founder_experience: 70,
        market_timing_score: 80,
        overall_fit_score: 72,
        status: 'prospect'
      }
    }),
    prisma.conventionCompany.create({
      data: {
        convention_id: conventions[2].id, // DEF CON
        company_name: 'IoT Secure Gateway',
        booth_number: 'F678',
        description: 'Hardware-based security for IoT devices and edge computing',
        website: 'https://iotsecuregateway.com',
        cybersecurity_category: 'IoT Security',
        funding_stage: 'seed',
        contact_email: 'invest@iotsecuregateway.com',
        contact_name: 'Lisa Park',
        product_demo: true,
        seeking_investment: true,
        notes: 'Proprietary hardware design with military-grade encryption',
        // Ballistic Ventures criteria scores
        active_users_score: 60,
        paying_customers_score: 45,
        mssp_integration_score: 65,
        technical_innovation: 92,
        founder_experience: 80,
        market_timing_score: 88,
        overall_fit_score: 78,
        status: 'prospect'
      }
    })
  ])

  console.log(`Created ${conventions.length} cybersecurity conventions`)
  console.log(`Created ${conventionCompanies.length} convention companies`)
  console.log('Cybersecurity conventions data seeded successfully!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })