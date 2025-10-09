import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

// Data source configurations
const DATA_SOURCES = {
  // Investment & Funding Sources
  intellizence: {
    name: 'Intellizence Startup Funding API',
    url: 'https://intellizence.com/product/startup-funding-dataset/',
    type: 'api',
    description: 'Real-time startup funding, VC/PE deals, investor profiles',
    status: 'available',
    updateFrequency: 'real-time',
    category: 'funding'
  },
  finro: {
    name: 'Finro Cybersecurity Valuation Benchmarks',
    url: 'https://www.finrofca.com/news/cybersecurity-valuation-mid-2025',
    type: 'dataset',
    description: 'Revenue multiples, niche valuations, M&A trends',
    status: 'available',
    updateFrequency: 'quarterly',
    category: 'funding'
  },
  datarade: {
    name: 'Datarade Startup APIs',
    url: 'https://datarade.ai/data-categories/startup-data',
    type: 'api_marketplace',
    description: 'Founding dates, funding rounds, team bios, market size',
    status: 'available',
    updateFrequency: 'daily',
    category: 'funding'
  },
  crunchbase: {
    name: 'Crunchbase API',
    url: 'https://data.crunchbase.com/docs',
    type: 'api',
    description: 'Startup profiles, funding history, investor networks',
    status: 'available',
    updateFrequency: 'daily',
    category: 'funding'
  },
  sec_edgar: {
    name: 'SEC EDGAR Database',
    url: 'https://www.sec.gov/edgar.shtml',
    type: 'xml_api',
    description: 'Form D filings, stealth rounds, public disclosures',
    status: 'available',
    updateFrequency: 'daily',
    category: 'funding'
  },
  growthlist: {
    name: 'GrowthList Cybersecurity Startups',
    url: 'https://growthlist.co/cyber-security-startups/',
    type: 'scraping',
    description: 'Weekly updated list of funded cybersecurity startups',
    status: 'available',
    updateFrequency: 'weekly',
    category: 'funding'
  },
  openvc: {
    name: 'OpenVC Cybersecurity Investors',
    url: 'https://www.openvc.app/investor-lists/cybersecurity-investors',
    type: 'scraping',
    description: '150+ cybersecurity-focused VC firms with filters',
    status: 'available',
    updateFrequency: 'monthly',
    category: 'funding'
  },

  // Threat Intelligence Sources
  misp: {
    name: 'MISP Threat Intelligence Platform',
    url: 'https://www.misp-project.org/',
    type: 'api',
    description: 'Malware hashes, phishing URLs, threat actor profiles',
    status: 'available',
    updateFrequency: 'real-time',
    category: 'threat_intelligence'
  },
  alienvault_otx: {
    name: 'AlienVault OTX',
    url: 'https://otx.alienvault.com/',
    type: 'api',
    description: 'Community-driven threat indicators, curated pulses',
    status: 'available',
    updateFrequency: 'real-time',
    category: 'threat_intelligence'
  },
  cisa_kev: {
    name: 'CISA KEV Catalog',
    url: 'https://www.cisa.gov/known-exploited-vulnerabilities-catalog',
    type: 'feed',
    description: 'Known exploited vulnerabilities with CVE mapping',
    status: 'available',
    updateFrequency: 'daily',
    category: 'threat_intelligence'
  },
  whoisxml_threats: {
    name: 'WhoisXML Threat Feeds',
    url: 'https://www.whoisxmlapi.com/blog/threat-intelligence-feeds-guide',
    type: 'api',
    description: 'Malicious domains, IPs, predictive threat indicators',
    status: 'available',
    updateFrequency: 'hourly',
    category: 'threat_intelligence'
  },
  github_threat_intel: {
    name: 'GitHub Threat Intelligence Lists',
    url: 'https://github.com/hslatman/awesome-threat-intelligence',
    type: 'curated_repo',
    description: 'Dozens of open feeds, including botnet trackers and APT lists',
    status: 'available',
    updateFrequency: 'weekly',
    category: 'threat_intelligence'
  },
  soc_radar_feeds: {
    name: 'SOC Radar Threat Intelligence',
    url: 'https://socradar.io/the-ultimate-list-of-free-and-open-source-threat-intelligence-feeds/',
    type: 'feed_aggregator',
    description: 'Comprehensive list of free and open-source threat feeds',
    status: 'available',
    updateFrequency: 'daily',
    category: 'threat_intelligence'
  },
  soc_radar_attacks: {
    name: 'SOC Radar Major Cyber Attacks',
    url: 'https://socradar.io/resources/radar/major-cyber-attacks/',
    type: 'dataset',
    description: 'Global cyber attacks database with downloadable Excel sheets',
    status: 'available',
    updateFrequency: 'monthly',
    category: 'threat_intelligence'
  },
  mitre_attack_framework: {
    name: 'MITRE ATT&CK Framework',
    url: 'https://attack.mitre.org/',
    type: 'framework_api',
    description: 'Adversary tactics, techniques, and procedures (TTPs) with attack IDs',
    status: 'available',
    updateFrequency: 'quarterly',
    category: 'threat_intelligence'
  },

  // Patent & Innovation Intelligence Sources
  uspto_open_data: {
    name: 'USPTO Open Data',
    url: 'https://developer.uspto.gov/data',
    type: 'api',
    description: 'Patent filings, citations, inventor networks',
    status: 'available',
    updateFrequency: 'weekly',
    category: 'patent_intelligence'
  },
  google_patents: {
    name: 'Google Patents Public Datasets',
    url: 'https://console.cloud.google.com/marketplace/product/google_patents_public_datasets',
    type: 'bigquery',
    description: 'Patent metadata, semantic search, citation analysis',
    status: 'available',
    updateFrequency: 'weekly',
    category: 'patent_intelligence'
  },
  cybersecurity_datasets_github: {
    name: 'Cybersecurity Datasets GitHub',
    url: 'https://github.com/gfek/Real-CyberSecurity-Datasets',
    type: 'public_repo',
    description: 'Malware, botnet, ICS, and cloud security research datasets',
    status: 'available',
    updateFrequency: 'monthly',
    category: 'patent_intelligence'
  },

  // Market Intelligence Sources
  acs_global_cybersecurity_report: {
    name: 'ACS Global Cybersecurity Market Report',
    url: 'https://acsmi.org/blogs/global-cybersecurity-market-report-2025-original-data-amp-industry-outlook',
    type: 'report',
    description: 'Sector growth, regional investment, public/private split',
    status: 'available',
    updateFrequency: 'annually',
    category: 'market_intelligence'
  },
  gitnux_cybersecurity_stats: {
    name: 'Gitnux Cybersecurity Stats',
    url: 'https://gitnux.org/cybersecurity-industry-statistics/',
    type: 'dataset',
    description: 'Threat frequency, breach costs, urgency scores',
    status: 'available',
    updateFrequency: 'quarterly',
    category: 'market_intelligence'
  },
  global_trade_magazine: {
    name: 'Global Trade Magazine',
    url: 'https://www.globaltrademag.com/cybersecurity-the-resilient-sector-amid-global-market-uncertainty/',
    type: 'commentary',
    description: 'Strategic resilience, investor sentiment, macro trends',
    status: 'available',
    updateFrequency: 'monthly',
    category: 'market_intelligence'
  },
  rsa_launch_pad: {
    name: 'RSA Launch Pad',
    url: 'https://www.rsaconference.com/usa/programs/launch-pad',
    type: 'web_scrape',
    description: 'Finalists, judges, pitch decks, strategic blurbs',
    status: 'available',
    updateFrequency: 'annually',
    category: 'market_intelligence'
  },
  black_hat_archives: {
    name: 'Black Hat Archives',
    url: 'https://www.blackhat.com/html/archives.html',
    type: 'archive',
    description: 'Speaker decks, tool demos, startup showcases',
    status: 'available',
    updateFrequency: 'annually',
    category: 'market_intelligence'
  },
  cyber_events_database: {
    name: 'Cyber Events Database (CISSM)',
    url: 'https://cissm.umd.edu/cyber-events-database',
    type: 'downloadable_dataset',
    description: 'Global cyber events, threat actor attribution, industry targeting',
    status: 'available',
    updateFrequency: 'monthly',
    category: 'market_intelligence'
  },
  black_hat_usa: {
    name: 'Black Hat USA',
    url: 'https://www.blackhat.com/us-25/',
    type: 'event_intelligence',
    description: 'Startup spotlight, investor briefings (Aug 2-7, Las Vegas)',
    status: 'available',
    updateFrequency: 'annually',
    category: 'market_intelligence'
  },

  // Conference Intelligence Sources
  def_con_33: {
    name: 'DEF CON 33',
    url: 'https://defcon.org/',
    type: 'conference_intelligence',
    description: 'Hacker-led startup demos, informal VC access (Aug 7-10, Las Vegas)',
    status: 'available',
    updateFrequency: 'annually',
    category: 'conference_intelligence'
  },
  cybersec_europe: {
    name: 'Cybersec Europe',
    url: 'https://www.cyberseceurope.com/',
    type: 'conference_intelligence',
    description: 'Startup zone, EU innovation funding (May 21-22, Brussels)',
    status: 'available',
    updateFrequency: 'annually',
    category: 'conference_intelligence'
  },
  infosec_world: {
    name: 'InfoSec World',
    url: 'https://www.infosecworld.com/',
    type: 'conference_intelligence',
    description: 'Startup showcase, CISO investor panels (Oct 27-29, Orlando)',
    status: 'available',
    updateFrequency: 'annually',
    category: 'conference_intelligence'
  },
  blue_team_con: {
    name: 'Blue Team Con',
    url: 'https://www.blueteamcon.com/',
    type: 'conference_intelligence',
    description: 'Startup demos, SOC tooling pitches (Sep 6-7, Chicago)',
    status: 'available',
    updateFrequency: 'annually',
    category: 'conference_intelligence'
  },
  iccs_conference: {
    name: 'International Conference on Cyber Security (ICCS)',
    url: 'https://iccs.fordham.edu/',
    type: 'conference_intelligence',
    description: 'Academic + startup crossover, funding panels (Jul 14-16, NYC)',
    status: 'available',
    updateFrequency: 'annually',
    category: 'conference_intelligence'
  },
  gartner_security_summit: {
    name: 'Gartner Security & Risk Management Summit',
    url: 'https://www.gartner.com/en/conferences/na/security-risk-management-us',
    type: 'conference_intelligence',
    description: 'Emerging tech showcase, investor briefings (Jun 9-11, National Harbor)',
    status: 'available',
    updateFrequency: 'annually',
    category: 'conference_intelligence'
  },
  cyberuk: {
    name: 'CYBERUK',
    url: 'https://www.cyberuk.gov.uk/',
    type: 'conference_intelligence',
    description: 'UK government-backed startup funding tracks (May 6-8, Manchester)',
    status: 'available',
    updateFrequency: 'annually',
    category: 'conference_intelligence'
  },
  sans_orlando: {
    name: 'SANS Orlando 2025',
    url: 'https://www.sans.org/cyber-security-training-events/orlando-2025/',
    type: 'conference_intelligence',
    description: 'Startup booths, training-linked demos (Apr 13-18, Orlando)',
    status: 'available',
    updateFrequency: 'annually',
    category: 'conference_intelligence'
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const source = searchParams.get('source')
    const action = searchParams.get('action') || 'list'

    if (action === 'list') {
      return NextResponse.json({
        success: true,
        data: {
          sources: Object.entries(DATA_SOURCES).map(([key, config]) => ({
            id: key,
            ...config,
            lastSync: getLastSyncTime(key),
            recordCount: getRecordCount(key)
          })),
          summary: {
            totalSources: Object.keys(DATA_SOURCES).length,
            activeSources: Object.values(DATA_SOURCES).filter(s => s.status === 'available').length,
            lastUpdate: new Date().toISOString()
          }
        }
      })
    }

    if (action === 'status' && source) {
      const sourceConfig = DATA_SOURCES[source as keyof typeof DATA_SOURCES]
      if (!sourceConfig) {
        return NextResponse.json(
          { success: false, error: 'Data source not found' },
          { status: 404 }
        )
      }

      return NextResponse.json({
        success: true,
        data: {
          source: {
            id: source,
            ...sourceConfig,
            lastSync: getLastSyncTime(source),
            recordCount: getRecordCount(source),
            healthStatus: await checkSourceHealth(source),
            syncHistory: getSyncHistory(source)
          }
        }
      })
    }

    return NextResponse.json({
      success: false,
      error: 'Invalid action specified'
    }, { status: 400 })

  } catch (error) {
    console.error('Data sources error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch data sources' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const { source, action, config } = await request.json()

    if (!source || !DATA_SOURCES[source as keyof typeof DATA_SOURCES]) {
      return NextResponse.json(
        { success: false, error: 'Invalid data source' },
        { status: 400 }
      )
    }

    switch (action) {
      case 'sync':
        return await syncDataSource(source)
      case 'configure':
        return await configureDataSource(source, config)
      case 'test':
        return await testDataSource(source)
      default:
        return NextResponse.json(
          { success: false, error: 'Invalid action' },
          { status: 400 }
        )
    }

  } catch (error) {
    console.error('Data source operation error:', error)
    return NextResponse.json(
      { success: false, error: 'Operation failed' },
      { status: 500 }
    )
  }
}

// Helper functions
function getLastSyncTime(source: string): string {
  // In production, this would query a sync log table
  const mockTimes: Record<string, string> = {
    // Funding sources
    intellizence: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2 hours ago
    finro: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(), // 1 week ago
    datarade: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(), // 1 day ago
    crunchbase: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(), // 6 hours ago
    sec_edgar: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(), // 12 hours ago
    growthlist: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(), // 3 days ago
    openvc: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(), // 2 weeks ago
    
    // Threat intelligence sources
    misp: new Date(Date.now() - 30 * 60 * 1000).toISOString(), // 30 minutes ago
    alienvault_otx: new Date(Date.now() - 45 * 60 * 1000).toISOString(), // 45 minutes ago
    cisa_kev: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString(), // 8 hours ago
    whoisxml_threats: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2 hours ago
    github_threat_intel: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(), // 5 days ago
    soc_radar_feeds: new Date(Date.now() - 18 * 60 * 60 * 1000).toISOString(), // 18 hours ago
    soc_radar_attacks: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(), // 10 days ago
    mitre_attack_framework: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days ago
    
    // Patent intelligence sources
    uspto_open_data: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(), // 4 days ago
    google_patents: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString(), // 6 days ago
    cybersecurity_datasets_github: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(), // 15 days ago
    
    // Market intelligence sources
    acs_global_cybersecurity_report: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days ago
    gitnux_cybersecurity_stats: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000).toISOString(), // 45 days ago
    global_trade_magazine: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString(), // 20 days ago
    rsa_launch_pad: new Date(Date.now() - 120 * 24 * 60 * 60 * 1000).toISOString(), // 120 days ago
    black_hat_archives: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString(), // 90 days ago
    cyber_events_database: new Date(Date.now() - 25 * 24 * 60 * 60 * 1000).toISOString(), // 25 days ago
    black_hat_usa: new Date(Date.now() - 180 * 24 * 60 * 60 * 1000).toISOString(), // 180 days ago
    
    // Conference intelligence sources
    def_con_33: new Date(Date.now() - 150 * 24 * 60 * 60 * 1000).toISOString(), // 150 days ago
    cybersec_europe: new Date(Date.now() - 200 * 24 * 60 * 60 * 1000).toISOString(), // 200 days ago
    infosec_world: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString(), // 60 days ago
    blue_team_con: new Date(Date.now() - 120 * 24 * 60 * 60 * 1000).toISOString(), // 120 days ago
    iccs_conference: new Date(Date.now() - 170 * 24 * 60 * 60 * 1000).toISOString(), // 170 days ago
    gartner_security_summit: new Date(Date.now() - 240 * 24 * 60 * 60 * 1000).toISOString(), // 240 days ago
    cyberuk: new Date(Date.now() - 210 * 24 * 60 * 60 * 1000).toISOString(), // 210 days ago
    sans_orlando: new Date(Date.now() - 270 * 24 * 60 * 60 * 1000).toISOString() // 270 days ago
  }
  return mockTimes[source] || new Date().toISOString()
}

function getRecordCount(source: string): number {
  // In production, this would query the database
  const mockCounts: Record<string, number> = {
    // Funding sources
    intellizence: 1250,
    finro: 89,
    datarade: 2100,
    crunchbase: 3400,
    sec_edgar: 567,
    growthlist: 234,
    openvc: 156,
    
    // Threat intelligence sources
    misp: 45000,
    alienvault_otx: 125000,
    cisa_kev: 1200,
    whoisxml_threats: 89000,
    github_threat_intel: 350,
    soc_radar_feeds: 25000,
    soc_radar_attacks: 2800,
    mitre_attack_framework: 800,
    
    // Patent intelligence sources
    uspto_open_data: 125000,
    google_patents: 890000,
    cybersecurity_datasets_github: 450,
    
    // Market intelligence sources
    acs_global_cybersecurity_report: 1,
    gitnux_cybersecurity_stats: 150,
    global_trade_magazine: 25,
    rsa_launch_pad: 45,
    black_hat_archives: 2800,
    cyber_events_database: 15000,
    black_hat_usa: 120,
    
    // Conference intelligence sources
    def_con_33: 85,
    cybersec_europe: 45,
    infosec_world: 67,
    blue_team_con: 32,
    iccs_conference: 78,
    gartner_security_summit: 156,
    cyberuk: 89,
    sans_orlando: 234
  }
  return mockCounts[source] || 0
}

async function checkSourceHealth(source: string): Promise<'healthy' | 'warning' | 'error'> {
  // In production, this would actually test the data source
  const healthStatuses: Record<string, 'healthy' | 'warning' | 'error'> = {
    // Funding sources
    intellizence: 'healthy',
    finro: 'healthy',
    datarade: 'healthy',
    crunchbase: 'warning', // Rate limited
    sec_edgar: 'healthy',
    growthlist: 'healthy',
    openvc: 'warning', // No official API
    
    // Threat intelligence sources
    misp: 'healthy',
    alienvault_otx: 'healthy',
    cisa_kev: 'healthy',
    whoisxml_threats: 'warning', // API key required
    github_threat_intel: 'healthy',
    soc_radar_feeds: 'healthy',
    soc_radar_attacks: 'healthy',
    mitre_attack_framework: 'healthy',
    
    // Patent intelligence sources
    uspto_open_data: 'healthy',
    google_patents: 'warning', // Requires BigQuery setup
    cybersecurity_datasets_github: 'healthy',
    
    // Market intelligence sources
    acs_global_cybersecurity_report: 'healthy',
    gitnux_cybersecurity_stats: 'healthy',
    global_trade_magazine: 'healthy',
    rsa_launch_pad: 'warning', // Event-based, seasonal availability
    black_hat_archives: 'healthy',
    cyber_events_database: 'healthy',
    black_hat_usa: 'warning', // Event-based, seasonal availability
    
    // Conference intelligence sources
    def_con_33: 'warning', // Event-based, seasonal availability
    cybersec_europe: 'healthy',
    infosec_world: 'healthy',
    blue_team_con: 'healthy',
    iccs_conference: 'healthy',
    gartner_security_summit: 'healthy',
    cyberuk: 'healthy',
    sans_orlando: 'healthy'
  }
  return healthStatuses[source] || 'error'
}

function getSyncHistory(source: string) {
  // Mock sync history - in production, this would come from a sync log table
  return [
    { timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), status: 'success', recordsProcessed: 45 },
    { timestamp: new Date(Date.now() - 26 * 60 * 60 * 1000).toISOString(), status: 'success', recordsProcessed: 67 },
    { timestamp: new Date(Date.now() - 50 * 60 * 60 * 1000).toISOString(), status: 'success', recordsProcessed: 23 }
  ]
}

async function syncDataSource(source: string) {
  // Mock sync operation - in production, this would trigger actual data ingestion
  const sourceConfig = DATA_SOURCES[source as keyof typeof DATA_SOURCES]
  
  // Simulate sync process
  const mockResults = {
    intellizence: { newRecords: 23, updatedRecords: 45, errors: 0 },
    finro: { newRecords: 5, updatedRecords: 12, errors: 0 },
    datarade: { newRecords: 67, updatedRecords: 89, errors: 2 },
    crunchbase: { newRecords: 34, updatedRecords: 78, errors: 1 },
    sec_edgar: { newRecords: 12, updatedRecords: 23, errors: 0 },
    growthlist: { newRecords: 8, updatedRecords: 15, errors: 0 },
    openvc: { newRecords: 3, updatedRecords: 7, errors: 0 }
  }

  const result = mockResults[source as keyof typeof mockResults] || { newRecords: 0, updatedRecords: 0, errors: 1 }

  return NextResponse.json({
    success: result.errors === 0,
    data: {
      source,
      syncResult: {
        ...result,
        timestamp: new Date().toISOString(),
        duration: Math.floor(Math.random() * 30) + 10 // 10-40 seconds
      }
    }
  })
}

async function configureDataSource(source: string, config: any) {
  // Mock configuration - in production, this would update source settings
  return NextResponse.json({
    success: true,
    data: {
      source,
      configuration: {
        ...config,
        updatedAt: new Date().toISOString()
      }
    }
  })
}

async function testDataSource(source: string) {
  // Mock connection test - in production, this would test actual connectivity
  const sourceConfig = DATA_SOURCES[source as keyof typeof DATA_SOURCES]
  const health = await checkSourceHealth(source)
  
  return NextResponse.json({
    success: health !== 'error',
    data: {
      source,
      testResult: {
        status: health,
        responseTime: Math.floor(Math.random() * 2000) + 100, // 100-2100ms
        timestamp: new Date().toISOString(),
        message: health === 'healthy' ? 'Connection successful' : 
                health === 'warning' ? 'Connection with warnings' : 'Connection failed'
      }
    }
  })
}