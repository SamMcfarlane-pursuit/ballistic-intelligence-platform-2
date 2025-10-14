import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const filter = searchParams.get('filter') || 'all'
    const priority = searchParams.get('priority') || 'all'

    // Mock data - in production, this would query your database
    const mockTasks = [
      {
        id: '1',
        type: 'funding',
        priority: 'high',
        status: 'pending',
        title: 'Conflicting Funding Amount for CyberSecure Inc.',
        description: 'Multiple sources report different funding amounts for CyberSecure Inc. Series A round.',
        conflictDetails: 'Source A (TechCrunch) reports $10M, Source B (VentureBeat) reports $12M. Need manual verification.',
        sources: [
          {
            name: 'TechCrunch',
            url: 'https://techcrunch.com/cybersecure-funding',
            data: { amount: '$10M', round: 'Series A', date: '2024-01-15' }
          },
          {
            name: 'VentureBeat',
            url: 'https://venturebeat.com/cybersecure-series-a',
            data: { amount: '$12M', round: 'Series A', date: '2024-01-15' }
          }
        ],
        createdAt: '2024-01-16T10:00:00Z',
        dueDate: '2024-01-18T17:00:00Z',
        companyName: 'CyberSecure Inc.',
        flaggedBy: 'data_verification_agent'
      },
      {
        id: '2',
        type: 'people',
        priority: 'medium',
        status: 'in_review',
        title: 'Verify CloudGuard Founders via LinkedIn',
        description: 'Need to manually verify founder information for CloudGuard through LinkedIn profiles.',
        conflictDetails: 'Company website lists 3 founders, but LinkedIn search only shows 2 profiles. Need verification.',
        sources: [
          {
            name: 'Company Website',
            url: 'https://cloudguard.com/about',
            data: { founders: ['John Smith', 'Jane Doe', 'Mike Johnson'] }
          },
          {
            name: 'LinkedIn Search',
            url: 'https://linkedin.com/search/cloudguard',
            data: { foundProfiles: ['John Smith', 'Jane Doe'] }
          }
        ],
        createdAt: '2024-01-15T14:30:00Z',
        dueDate: '2024-01-19T17:00:00Z',
        companyName: 'CloudGuard',
        flaggedBy: 'company_profiling_agent',
        assignedTo: 'analyst@ballistic.vc'
      },
      {
        id: '3',
        type: 'threat',
        priority: 'high',
        status: 'pending',
        title: 'Threat Intelligence Data Mismatch',
        description: 'Conflicting threat severity ratings from different intelligence sources.',
        conflictDetails: 'MITRE reports severity as "Critical" while NIST rates it as "High". Need expert review.',
        sources: [
          {
            name: 'MITRE ATT&CK',
            url: 'https://attack.mitre.org/techniques/T1055/',
            data: { severity: 'Critical', technique: 'Process Injection' }
          },
          {
            name: 'NIST Database',
            url: 'https://nvd.nist.gov/vuln/detail/CVE-2024-0001',
            data: { severity: 'High', cvss: 7.8 }
          }
        ],
        createdAt: '2024-01-16T09:15:00Z',
        dueDate: '2024-01-17T12:00:00Z',
        flaggedBy: 'threat_agent'
      },
      {
        id: '4',
        type: 'company',
        priority: 'low',
        status: 'verified',
        title: 'Company Location Discrepancy - ThreatScanner Inc.',
        description: 'Different sources report different headquarters locations.',
        conflictDetails: 'Crunchbase shows San Francisco, company website shows Palo Alto.',
        sources: [
          {
            name: 'Crunchbase',
            url: 'https://crunchbase.com/threatscanner',
            data: { location: 'San Francisco, CA' }
          },
          {
            name: 'Company Website',
            url: 'https://threatscanner.com/contact',
            data: { location: 'Palo Alto, CA' }
          }
        ],
        createdAt: '2024-01-14T11:20:00Z',
        dueDate: '2024-01-16T17:00:00Z',
        companyName: 'ThreatScanner Inc.',
        flaggedBy: 'company_profiling_agent'
      },
      {
        id: '5',
        type: 'tech',
        priority: 'medium',
        status: 'pending',
        title: 'Technology Stack Verification - SecureFlow AI',
        description: 'Need to verify claimed AI/ML technology stack through technical analysis.',
        conflictDetails: 'Company claims proprietary ML algorithms but job postings suggest standard frameworks.',
        sources: [
          {
            name: 'Company Marketing',
            url: 'https://secureflow.ai/technology',
            data: { claims: 'Proprietary ML algorithms, Custom neural networks' }
          },
          {
            name: 'Job Postings',
            url: 'https://linkedin.com/jobs/secureflow',
            data: { requirements: 'TensorFlow, PyTorch, Scikit-learn experience' }
          }
        ],
        createdAt: '2024-01-15T16:45:00Z',
        dueDate: '2024-01-20T17:00:00Z',
        companyName: 'SecureFlow AI',
        flaggedBy: 'company_profiling_agent'
      }
    ]

    const mockStats = {
      totalTasks: 47,
      pendingTasks: 12,
      inReviewTasks: 8,
      completedToday: 15,
      highPriorityTasks: 5,
      averageResolutionTime: 4.2,
      tasksByType: {
        funding: 18,
        company: 12,
        people: 8,
        threat: 6,
        tech: 3
      }
    }

    // Apply filters
    let filteredTasks = mockTasks
    if (filter !== 'all') {
      filteredTasks = filteredTasks.filter(task => task.type === filter)
    }
    if (priority !== 'all') {
      filteredTasks = filteredTasks.filter(task => task.priority === priority)
    }

    return NextResponse.json({
      success: true,
      tasks: filteredTasks,
      stats: mockStats,
      message: 'Verification queue loaded successfully'
    })

  } catch (error) {
    console.error('Verification queue API error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to load verification queue' },
      { status: 500 }
    )
  }
}