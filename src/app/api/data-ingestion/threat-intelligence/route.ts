import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const source = searchParams.get('source')

    if (!source) {
      return NextResponse.json({
        success: true,
        data: {
          availableSources: [
            'misp',
            'alienvault_otx',
            'cisa_kev',
            'soc_radar_attacks',
            'mitre_attack_framework'
          ],
          description: 'Threat intelligence data sources'
        }
      })
    }

    // Return source-specific information
    const sourceInfo = {
      misp: {
        name: 'MISP Threat Intelligence Platform',
        description: 'Malware hashes, phishing URLs, threat actor profiles',
        endpoints: ['events', 'attributes', 'objects'],
        rateLimit: '1000 requests/hour',
        authentication: 'API key required'
      },
      alienvault_otx: {
        name: 'AlienVault OTX',
        description: 'Community-driven threat indicators, curated pulses',
        endpoints: ['pulses', 'indicators'],
        rateLimit: '10000 requests/hour',
        authentication: 'API key required'
      },
      cisa_kev: {
        name: 'CISA KEV Catalog',
        description: 'Known exploited vulnerabilities with CVE mapping',
        endpoints: ['vulnerabilities'],
        rateLimit: 'No limit',
        authentication: 'None required'
      },
      soc_radar_attacks: {
        name: 'SOC Radar Major Cyber Attacks',
        description: 'Global cyber attacks database',
        endpoints: ['attacks'],
        rateLimit: '1000 requests/hour',
        authentication: 'API key required'
      },
      mitre_attack_framework: {
        name: 'MITRE ATT&CK Framework',
        description: 'Adversary tactics, techniques, and procedures',
        endpoints: ['techniques', 'tactics', 'mitigations'],
        rateLimit: 'No limit',
        authentication: 'None required'
      }
    }

    return NextResponse.json({
      success: true,
      data: sourceInfo[source as keyof typeof sourceInfo] || { error: 'Source not found' }
    })

  } catch (error) {
    console.error('Threat intelligence info error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to get threat intelligence info' },
      { status: 500 }
    )
  }
}

// Threat Intelligence data integration
export async function POST(request: NextRequest) {
  try {
    const { source, config } = await request.json()

    switch (source) {
      case 'misp':
        return await ingestMISPData(config)
      case 'alienvault_otx':
        return await ingestOTXData(config)
      case 'cisa_kev':
        return await ingestCISAKEVData(config)
      case 'soc_radar_attacks':
        return await ingestSOCRadarAttacks(config)
      case 'mitre_attack_framework':
        return await ingestMITREAttackFramework(config)
      default:
        return NextResponse.json(
          { success: false, error: 'Unknown threat intelligence source' },
          { status: 400 }
        )
    }
  } catch (error) {
    console.error('Threat intelligence ingestion error:', error)
    return NextResponse.json(
      { success: false, error: 'Threat intelligence ingestion failed' },
      { status: 500 }
    )
  }
}

async function ingestMISPData(config: any) {
  // Mock MISP threat data
  const mockMISPData = [
    {
      uuid: 'misp-001',
      info: 'APT29 Malware Campaign',
      threat_level: 'high',
      analysis: 'completed',
      date: '2024-01-15',
      attributes: [
        { type: 'md5', value: 'a1b2c3d4e5f6789012345678901234567', category: 'Payload delivery' },
        { type: 'domain', value: 'malicious-domain.com', category: 'Network activity' },
        { type: 'ip-dst', value: '192.168.1.100', category: 'Network activity' }
      ],
      tags: ['APT29', 'Cozy Bear', 'Government', 'Espionage']
    }
  ]

  return processIntelligenceData('misp', mockMISPData, 'threat_indicators')
}
async function ingestOTXData(config: any) {
  // Mock AlienVault OTX data
  const mockOTXData = [
    {
      id: 'otx-001',
      name: 'Ransomware Infrastructure',
      description: 'C2 servers and payment infrastructure for ransomware groups',
      created: '2024-01-10',
      modified: '2024-01-15',
      indicators: [
        { type: 'domain', indicator: 'ransomware-c2.net', is_active: true },
        { type: 'bitcoin', indicator: '1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa', is_active: true }
      ],
      tags: ['ransomware', 'c2', 'cryptocurrency']
    }
  ]

  return processIntelligenceData('alienvault_otx', mockOTXData, 'threat_pulses')
}

async function ingestCISAKEVData(config: any) {
  // Mock CISA KEV data
  const mockKEVData = [
    {
      cveID: 'CVE-2024-0001',
      vendorProject: 'Microsoft',
      product: 'Windows',
      vulnerabilityName: 'Windows Kernel Elevation of Privilege',
      dateAdded: '2024-01-08',
      shortDescription: 'Windows kernel contains an elevation of privilege vulnerability',
      requiredAction: 'Apply updates per vendor instructions',
      dueDate: '2024-02-08',
      knownRansomwareCampaignUse: 'Known'
    }
  ]

  return processIntelligenceData('cisa_kev', mockKEVData, 'vulnerabilities')
}

async function ingestSOCRadarAttacks(config: any) {
  // Mock SOC Radar major attacks data
  const mockAttacksData = [
    {
      id: 'attack-001',
      date: '2024-01-12',
      target: 'Healthcare Provider',
      attack_type: 'Ransomware',
      threat_actor: 'LockBit',
      impact: 'Data encryption and exfiltration',
      affected_records: 500000,
      industry: 'Healthcare',
      country: 'United States',
      recovery_time: '72 hours',
      ransom_amount: 2000000
    }
  ]

  return processIntelligenceData('soc_radar_attacks', mockAttacksData, 'cyber_attacks')
}

async function ingestMITREAttackFramework(config: any) {
  // MITRE ATT&CK Framework techniques with the provided attack IDs
  const mockMITREData = [
    {
      id: 'T1036',
      name: 'Masquerading',
      tactic: 'Defense Evasion',
      description: 'Adversaries may attempt to manipulate features of their artifacts to make them appear legitimate',
      platforms: ['Windows', 'macOS', 'Linux'],
      data_sources: ['File monitoring', 'Process monitoring'],
      detection: 'Monitor for files that have been renamed to mimic legitimate files',
      mitigation: 'Execution Prevention, Code Signing'
    },
    {
      id: 'T1059',
      name: 'Command and Scripting Interpreter',
      tactic: 'Execution',
      description: 'Adversaries may abuse command and script interpreters to execute commands',
      platforms: ['Windows', 'macOS', 'Linux'],
      data_sources: ['Process monitoring', 'Command line monitoring'],
      detection: 'Monitor executed commands and arguments',
      mitigation: 'Execution Prevention, Disable or Remove Feature'
    },
    {
      id: 'T1480',
      name: 'Execution Guardrails',
      tactic: 'Defense Evasion',
      description: 'Adversaries may use execution guardrails to constrain execution or actions',
      platforms: ['Windows', 'macOS', 'Linux'],
      data_sources: ['Process monitoring', 'File monitoring'],
      detection: 'Monitor for conditional execution patterns',
      mitigation: 'Code Signing, Application Control'
    },
    {
      id: 'T1530',
      name: 'Data from Cloud Storage Object',
      tactic: 'Collection',
      description: 'Adversaries may access data objects from improperly secured cloud storage',
      platforms: ['AWS', 'Azure', 'GCP'],
      data_sources: ['Cloud storage logs', 'API monitoring'],
      detection: 'Monitor cloud storage access patterns',
      mitigation: 'User Account Management, Audit'
    },
    {
      id: 'T1497.001',
      name: 'System Checks',
      tactic: 'Defense Evasion',
      description: 'Adversaries may employ various system checks to detect virtualized environments',
      platforms: ['Windows', 'macOS', 'Linux'],
      data_sources: ['Process monitoring', 'API monitoring'],
      detection: 'Monitor for system information discovery commands',
      mitigation: 'Execution Prevention'
    },
    {
      id: 'T1505',
      name: 'Server Software Component',
      tactic: 'Persistence',
      description: 'Adversaries may abuse legitimate extensible development features of servers',
      platforms: ['Windows', 'Linux', 'Network'],
      data_sources: ['File monitoring', 'Process monitoring'],
      detection: 'Monitor for changes to server software components',
      mitigation: 'Code Signing, Privileged Account Management'
    },
    {
      id: 'T1218',
      name: 'Signed Binary Proxy Execution',
      tactic: 'Defense Evasion',
      description: 'Adversaries may bypass process and signature-based defenses',
      platforms: ['Windows'],
      data_sources: ['Process monitoring', 'Binary file metadata'],
      detection: 'Monitor for signed binaries executing unusual payloads',
      mitigation: 'Execution Prevention, Application Control'
    },
    {
      id: 'T1547.001',
      name: 'Registry Run Keys / Startup Folder',
      tactic: 'Persistence',
      description: 'Adversaries may achieve persistence by adding programs to startup folders',
      platforms: ['Windows'],
      data_sources: ['Windows Registry', 'File monitoring'],
      detection: 'Monitor registry keys and startup folders',
      mitigation: 'User Account Control, Audit'
    },
    {
      id: 'T1071.001',
      name: 'Web Protocols',
      tactic: 'Command and Control',
      description: 'Adversaries may communicate using application layer protocols',
      platforms: ['Windows', 'macOS', 'Linux'],
      data_sources: ['Network traffic', 'Packet capture'],
      detection: 'Monitor network traffic for unusual patterns',
      mitigation: 'Network Intrusion Prevention, Restrict Web-Based Content'
    },
    {
      id: 'T1110',
      name: 'Brute Force',
      tactic: 'Credential Access',
      description: 'Adversaries may use brute force techniques to gain access to accounts',
      platforms: ['Windows', 'macOS', 'Linux', 'Office 365', 'SaaS'],
      data_sources: ['Authentication logs', 'Windows event logs'],
      detection: 'Monitor for multiple failed authentication attempts',
      mitigation: 'Account Use Policies, Multi-factor Authentication'
    },
    {
      id: 'T1486',
      name: 'Data Encrypted for Impact',
      tactic: 'Impact',
      description: 'Adversaries may encrypt data on target systems to interrupt availability',
      platforms: ['Windows', 'macOS', 'Linux'],
      data_sources: ['File monitoring', 'Process monitoring'],
      detection: 'Monitor for rapid file modifications and encryption activities',
      mitigation: 'Data Backup, Behavior Prevention on Endpoint'
    },
    {
      id: 'T1566',
      name: 'Phishing',
      tactic: 'Initial Access',
      description: 'Adversaries may send phishing messages to gain access to victim systems',
      platforms: ['Windows', 'macOS', 'Linux'],
      data_sources: ['Email gateway', 'File monitoring'],
      detection: 'Monitor for suspicious email attachments and links',
      mitigation: 'User Training, Email Security'
    }
  ]

  return processIntelligenceData('mitre_attack_framework', mockMITREData, 'attack_techniques')
}

async function processIntelligenceData(source: string, data: any[], dataType: string) {
  const results = {
    processed: 0,
    created: 0,
    updated: 0,
    errors: []
  }

  // For now, we'll store threat intelligence in a generic format
  // In production, you'd have specific tables for different threat data types
  
  for (const item of data) {
    try {
      results.processed++
      
      // Mock database storage - in production, store in actual database
      // await db.threatIntelligence.create({ data: item })
      
      results.created++
    } catch (error) {
      results.errors.push({
        item: item.id || item.uuid || item.cveID || 'unknown',
        error: error instanceof Error ? error.message : 'Unknown error'
      })
    }
  }

  return NextResponse.json({
    success: true,
    data: {
      source,
      dataType,
      ingestionResult: {
        ...results,
        timestamp: new Date().toISOString(),
        duration: Math.floor(Math.random() * 20) + 5
      }
    }
  })
}