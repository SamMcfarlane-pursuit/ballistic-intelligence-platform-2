import { NextRequest, NextResponse } from 'next/server'
import { dataProtectionManager, DATA_CLASSIFICATIONS } from '@/lib/security/data-protection'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const action = searchParams.get('action')
    const userId = searchParams.get('userId') || 'anonymous'
    const classification = searchParams.get('classification')

    // Log access attempt
    dataProtectionManager.logDataAccess(userId, 'api_access', action || 'unknown', true)

    switch (action) {
      case 'classifications':
        // Return available data classifications
        return NextResponse.json({
          success: true,
          data: {
            classifications: Object.keys(DATA_CLASSIFICATIONS),
            details: DATA_CLASSIFICATIONS
          }
        })

      case 'vulnerability-data':
        // Return masked vulnerability data based on user permissions
        const vulnData = await getVulnerabilityData(userId, classification || 'vulnerability_high')
        return NextResponse.json({
          success: true,
          data: vulnData
        })

      case 'threat-intelligence':
        // Return masked threat intelligence data
        const threatData = await getThreatIntelligenceData(userId, classification || 'threat_intelligence')
        return NextResponse.json({
          success: true,
          data: threatData
        })

      case 'audit-logs':
        // Return audit logs (admin only)
        if (!dataProtectionManager.verifyAccess(userId, 'operational_data', 'read')) {
          return NextResponse.json(
            { success: false, error: 'Access denied: Insufficient permissions' },
            { status: 403 }
          )
        }

        const startDate = searchParams.get('startDate') ? new Date(searchParams.get('startDate')!) : new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
        const endDate = searchParams.get('endDate') ? new Date(searchParams.get('endDate')!) : new Date()
        
        const auditLogs = dataProtectionManager.getAuditLogs(startDate, endDate, searchParams.get('filterUserId') || undefined)
        
        return NextResponse.json({
          success: true,
          data: {
            logs: auditLogs,
            summary: {
              totalLogs: auditLogs.length,
              period: { start: startDate.toISOString(), end: endDate.toISOString() }
            }
          }
        })

      case 'compliance-report':
        // Generate compliance report (admin only)
        if (!dataProtectionManager.verifyAccess(userId, 'operational_data', 'read')) {
          return NextResponse.json(
            { success: false, error: 'Access denied: Insufficient permissions' },
            { status: 403 }
          )
        }

        const reportStartDate = searchParams.get('startDate') ? new Date(searchParams.get('startDate')!) : new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
        const reportEndDate = searchParams.get('endDate') ? new Date(searchParams.get('endDate')!) : new Date()
        
        const complianceReport = dataProtectionManager.generateComplianceReport(reportStartDate, reportEndDate)
        
        return NextResponse.json({
          success: true,
          data: complianceReport
        })

      default:
        return NextResponse.json(
          { success: false, error: 'Invalid action parameter' },
          { status: 400 }
        )
    }

  } catch (error) {
    console.error('Secure Data API error:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { action, userId, data, classification } = body

    if (!userId) {
      return NextResponse.json(
        { success: false, error: 'User ID required' },
        { status: 400 }
      )
    }

    switch (action) {
      case 'encrypt-data':
        // Encrypt sensitive data
        if (!classification || !data) {
          return NextResponse.json(
            { success: false, error: 'Classification and data required' },
            { status: 400 }
          )
        }

        // Verify user has permission to encrypt this classification
        if (!dataProtectionManager.verifyAccess(userId, classification, 'write')) {
          dataProtectionManager.logDataAccess(userId, 'encrypt', classification, false)
          return NextResponse.json(
            { success: false, error: 'Access denied: Insufficient permissions' },
            { status: 403 }
          )
        }

        const encryptedData = dataProtectionManager.encryptData(JSON.stringify(data), classification)
        dataProtectionManager.logDataAccess(userId, 'encrypt', classification, true)

        return NextResponse.json({
          success: true,
          data: {
            encrypted: encryptedData,
            classification,
            timestamp: new Date().toISOString()
          }
        })

      case 'decrypt-data':
        // Decrypt sensitive data
        if (!data) {
          return NextResponse.json(
            { success: false, error: 'Encrypted data required' },
            { status: 400 }
          )
        }

        try {
          const decryptedData = dataProtectionManager.decryptData(data, userId)
          
          return NextResponse.json({
            success: true,
            data: {
              decrypted: JSON.parse(decryptedData),
              classification: data.classification,
              timestamp: new Date().toISOString()
            }
          })
        } catch (error) {
          dataProtectionManager.logDataAccess(userId, 'decrypt', data.classification || 'unknown', false, { error: error.message })
          return NextResponse.json(
            { success: false, error: 'Decryption failed: ' + error.message },
            { status: 403 }
          )
        }

      case 'mask-data':
        // Apply data masking
        if (!classification || !data) {
          return NextResponse.json(
            { success: false, error: 'Classification and data required' },
            { status: 400 }
          )
        }

        const maskedData = dataProtectionManager.maskSensitiveData(data, userId, classification)
        dataProtectionManager.logDataAccess(userId, 'mask', classification, true)

        return NextResponse.json({
          success: true,
          data: {
            masked: maskedData,
            classification,
            timestamp: new Date().toISOString()
          }
        })

      case 'verify-access':
        // Verify user access to classified data
        const { targetClassification, targetAction } = body
        
        if (!targetClassification || !targetAction) {
          return NextResponse.json(
            { success: false, error: 'Target classification and action required' },
            { status: 400 }
          )
        }

        const hasAccess = dataProtectionManager.verifyAccess(userId, targetClassification, targetAction)
        dataProtectionManager.logDataAccess(userId, 'access_check', targetClassification, hasAccess)

        return NextResponse.json({
          success: true,
          data: {
            hasAccess,
            classification: targetClassification,
            action: targetAction,
            timestamp: new Date().toISOString()
          }
        })

      default:
        return NextResponse.json(
          { success: false, error: 'Invalid action' },
          { status: 400 }
        )
    }

  } catch (error) {
    console.error('Secure Data POST error:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// Get vulnerability data with appropriate masking
async function getVulnerabilityData(userId: string, classification: string) {
  // Mock vulnerability data with sensitive information
  const rawVulnData = {
    cve: 'CVE-2024-0001',
    title: 'Critical Windows Kernel Privilege Escalation',
    description: 'A privilege escalation vulnerability exists in the Windows kernel',
    severity: 'critical',
    cvss: 9.8,
    exploitCode: `
      // SENSITIVE: Proof of concept exploit code
      #include <windows.h>
      #include <stdio.h>
      
      int main() {
          // Exploit implementation details
          HANDLE hDevice = CreateFile(L"\\\\.\\vulnerable_driver", 
                                    GENERIC_READ | GENERIC_WRITE, 0, NULL, 
                                    OPEN_EXISTING, 0, NULL);
          // ... exploit payload ...
          return 0;
      }
    `,
    internalNotes: 'CONFIDENTIAL: This vulnerability was discovered during red team exercise. Affects government systems.',
    sourceCode: 'kernel32.dll!NtCreateFile vulnerable function at offset 0x12345',
    affectedSystems: ['Windows 10', 'Windows 11', 'Windows Server 2019'],
    patchStatus: 'Available',
    threatActors: ['APT29', 'Lazarus Group'],
    exploitComplexity: 'Low',
    publicExploits: 3,
    mitigations: [
      'Apply Microsoft security update KB5034441',
      'Enable Windows Defender Application Control',
      'Implement least privilege access'
    ]
  }

  // Apply data masking based on user permissions
  return dataProtectionManager.maskSensitiveData(rawVulnData, userId, classification)
}

// Get threat intelligence data with appropriate masking
async function getThreatIntelligenceData(userId: string, classification: string) {
  // Mock threat intelligence data
  const rawThreatData = {
    threatId: 'THREAT-2024-001',
    threatActor: 'APT29 (Cozy Bear)',
    campaign: 'Operation CloudHopper 2.0',
    description: 'Advanced persistent threat targeting cloud infrastructure',
    ttps: [
      'T1566.001 - Spearphishing Attachment',
      'T1059.001 - PowerShell',
      'T1055 - Process Injection'
    ],
    iocs: [
      {
        type: 'domain',
        value: 'malicious-c2-server.com',
        confidence: 95
      },
      {
        type: 'ip',
        value: '192.168.100.50',
        confidence: 90
      },
      {
        type: 'hash',
        value: 'a1b2c3d4e5f6789012345678901234567890abcd',
        confidence: 98
      }
    ],
    targets: ['Government', 'Healthcare', 'Financial Services'],
    attribution: {
      country: 'Russia',
      confidence: 85,
      evidence: 'CLASSIFIED: Signals intelligence and human sources confirm attribution'
    },
    countermeasures: [
      'Block known C2 domains at DNS level',
      'Deploy advanced email security',
      'Implement behavioral monitoring'
    ],
    internalAssessment: 'HIGH CONFIDENCE: This threat actor has demonstrated capability to compromise critical infrastructure'
  }

  // Apply data masking based on user permissions
  return dataProtectionManager.maskSensitiveData(rawThreatData, userId, classification)
}