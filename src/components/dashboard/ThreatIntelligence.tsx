'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { 
  Shield, 
  AlertTriangle, 
  TrendingUp, 
  Clock,
  ExternalLink,
  RefreshCw,
  Zap,
  Tool,
  Target,
  AlertCircle
} from 'lucide-react'


interface ThreatData {
  id: string
  source: string
  type: string
  severity: 'critical' | 'high' | 'medium' | 'low'
  title: string
  description: string
  timestamp: string
  indicators: number
  affectedSectors: string[]
  cve?: string
  cvss?: number
  exploitAvailable?: boolean
  patchAvailable?: boolean
  detectionMethods: string[]
  iocs: {
    type: string
    value: string
  }[]
  threatActions?: ThreatAction[]
  recommendedTools?: RecommendedTool[]
  mitigationSteps?: string[]
  businessImpact?: string
  exploitComplexity?: 'low' | 'medium' | 'high'
  attackVector?: string
}

interface ThreatAction {
  id: string
  action: string
  description: string
  urgency: 'immediate' | 'high' | 'medium' | 'low'
  category: 'prevention' | 'detection' | 'response' | 'recovery'
  estimatedTime: string
  requiredSkills: string[]
}

interface RecommendedTool {
  name: string
  category: 'scanner' | 'monitor' | 'analyzer' | 'blocker' | 'forensics'
  description: string
  vendor?: string
  cost: 'free' | 'commercial' | 'enterprise'
  effectiveness: number // 1-10 scale
  url?: string
}

interface MITREAttackTechnique {
  id: string
  name: string
  tactic: string
  description: string
  platforms: string[]
  detection: string
  mitigation: string
}

export function ThreatIntelligence() {
  const [threats, setThreats] = useState<ThreatData[]>([])
  const [mitreAttacks, setMitreAttacks] = useState<MITREAttackTechnique[]>([])
  const [loading, setLoading] = useState(true)
  const [lastUpdate, setLastUpdate] = useState<string>('')

  useEffect(() => {
    fetchThreatData()
    const interval = setInterval(fetchThreatData, 5 * 60 * 1000) // Update every 5 minutes
    return () => clearInterval(interval)
  }, [])

  const fetchThreatData = async () => {
    try {
      // Mock comprehensive threat intelligence data
      const mockThreats: ThreatData[] = [
        {
          id: 'threat-001',
          source: 'MISP',
          type: 'Malware Campaign',
          severity: 'critical',
          title: 'APT29 Infrastructure Update',
          description: 'New C2 servers and malware variants detected targeting government entities',
          timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
          indicators: 15,
          affectedSectors: ['Government', 'Healthcare', 'Finance'],
          exploitAvailable: true,
          patchAvailable: false,
          detectionMethods: ['Network Traffic Analysis', 'Endpoint Detection', 'DNS Monitoring'],
          businessImpact: 'Data exfiltration, system compromise, potential nation-state espionage',
          exploitComplexity: 'high',
          attackVector: 'Network/Email',
          iocs: [
            { type: 'IP', value: '192.168.1.100' },
            { type: 'Domain', value: 'malicious-c2.com' },
            { type: 'Hash', value: 'a1b2c3d4e5f6...' }
          ],
          threatActions: [
            {
              id: 'action-001-1',
              action: 'Block C2 Infrastructure',
              description: 'Immediately block all known C2 domains and IPs at network perimeter',
              urgency: 'immediate',
              category: 'prevention',
              estimatedTime: '15 minutes',
              requiredSkills: ['Network Security', 'Firewall Management']
            },
            {
              id: 'action-001-2',
              action: 'Hunt for Indicators',
              description: 'Search environment for presence of known IOCs and malware signatures',
              urgency: 'high',
              category: 'detection',
              estimatedTime: '2 hours',
              requiredSkills: ['Threat Hunting', 'SIEM Analysis']
            },
            {
              id: 'action-001-3',
              action: 'Update Detection Rules',
              description: 'Deploy new YARA rules and SIEM signatures for APT29 variants',
              urgency: 'high',
              category: 'detection',
              estimatedTime: '1 hour',
              requiredSkills: ['Rule Writing', 'SIEM Management']
            }
          ],
          recommendedTools: [
            {
              name: 'Suricata',
              category: 'monitor',
              description: 'Network IDS/IPS for detecting C2 communications',
              cost: 'free',
              effectiveness: 8,
              url: 'https://suricata.io'
            },
            {
              name: 'YARA',
              category: 'scanner',
              description: 'Malware identification and classification tool',
              cost: 'free',
              effectiveness: 9,
              url: 'https://virustotal.github.io/yara/'
            },
            {
              name: 'CrowdStrike Falcon',
              category: 'monitor',
              description: 'Advanced endpoint detection and response',
              vendor: 'CrowdStrike',
              cost: 'enterprise',
              effectiveness: 10
            }
          ],
          mitigationSteps: [
            'Implement network segmentation to limit lateral movement',
            'Deploy advanced email security to block spear-phishing attempts',
            'Enable PowerShell logging and monitoring',
            'Implement application whitelisting on critical systems'
          ]
        },
        {
          id: 'threat-002',
          source: 'CISA KEV',
          type: 'Vulnerability',
          severity: 'critical',
          title: 'Windows Kernel Privilege Escalation',
          description: 'CVE-2024-0001 actively exploited in the wild with public PoC available',
          timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
          indicators: 8,
          affectedSectors: ['Enterprise', 'Government', 'Healthcare'],
          cve: 'CVE-2024-0001',
          cvss: 9.8,
          exploitAvailable: true,
          patchAvailable: true,
          detectionMethods: ['System Call Monitoring', 'Process Monitoring', 'Registry Monitoring'],
          businessImpact: 'Complete system compromise, privilege escalation, potential ransomware deployment',
          exploitComplexity: 'low',
          attackVector: 'Local/Network',
          iocs: [
            { type: 'Process', value: 'malicious.exe' },
            { type: 'Registry', value: 'HKLM\\Software\\Malware' }
          ],
          threatActions: [
            {
              id: 'action-002-1',
              action: 'Emergency Patching',
              description: 'Deploy Microsoft security update KB5034441 immediately to all Windows systems',
              urgency: 'immediate',
              category: 'prevention',
              estimatedTime: '4 hours',
              requiredSkills: ['Patch Management', 'Windows Administration']
            },
            {
              id: 'action-002-2',
              action: 'Privilege Audit',
              description: 'Review and restrict user privileges, implement least privilege principle',
              urgency: 'high',
              category: 'prevention',
              estimatedTime: '8 hours',
              requiredSkills: ['Identity Management', 'Access Control']
            },
            {
              id: 'action-002-3',
              action: 'Kernel Monitoring',
              description: 'Deploy kernel-level monitoring to detect privilege escalation attempts',
              urgency: 'medium',
              category: 'detection',
              estimatedTime: '2 hours',
              requiredSkills: ['Endpoint Security', 'System Monitoring']
            }
          ],
          recommendedTools: [
            {
              name: 'Microsoft WSUS',
              category: 'blocker',
              description: 'Centralized patch management for Windows environments',
              vendor: 'Microsoft',
              cost: 'free',
              effectiveness: 9,
              url: 'https://docs.microsoft.com/en-us/windows-server/administration/windows-server-update-services/'
            },
            {
              name: 'Sysmon',
              category: 'monitor',
              description: 'Windows system activity monitoring',
              vendor: 'Microsoft',
              cost: 'free',
              effectiveness: 8,
              url: 'https://docs.microsoft.com/en-us/sysinternals/downloads/sysmon'
            },
            {
              name: 'Nessus',
              category: 'scanner',
              description: 'Vulnerability scanner for identifying unpatched systems',
              vendor: 'Tenable',
              cost: 'commercial',
              effectiveness: 9,
              url: 'https://www.tenable.com/products/nessus'
            },
            {
              name: 'Windows Defender ATP',
              category: 'monitor',
              description: 'Advanced threat protection with kernel monitoring',
              vendor: 'Microsoft',
              cost: 'enterprise',
              effectiveness: 9
            }
          ],
          mitigationSteps: [
            'Apply security patches immediately using automated deployment',
            'Enable Windows Defender Application Control (WDAC)',
            'Implement User Account Control (UAC) with highest settings',
            'Deploy endpoint detection and response (EDR) solutions',
            'Regular vulnerability scanning and assessment'
          ]
        },
        {
          id: 'threat-003',
          source: 'SOC Radar',
          type: 'Ransomware',
          severity: 'high',
          title: 'LockBit 3.0 Healthcare Campaign',
          description: 'LockBit ransomware targeting healthcare providers with new encryption methods',
          timestamp: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
          indicators: 23,
          affectedSectors: ['Healthcare', 'Medical Devices'],
          exploitAvailable: true,
          patchAvailable: false,
          detectionMethods: ['File System Monitoring', 'Network Behavior Analysis', 'Email Security'],
          businessImpact: 'Complete data encryption, operational shutdown, patient care disruption, HIPAA violations',
          exploitComplexity: 'medium',
          attackVector: 'Email/RDP',
          iocs: [
            { type: 'Email', value: 'phishing@fake-domain.com' },
            { type: 'File Extension', value: '.lockbit' },
            { type: 'Ransom Note', value: 'README_LOCKBIT.txt' }
          ],
          threatActions: [
            {
              id: 'action-003-1',
              action: 'Backup Verification',
              description: 'Immediately verify backup integrity and test restoration procedures',
              urgency: 'immediate',
              category: 'recovery',
              estimatedTime: '1 hour',
              requiredSkills: ['Backup Administration', 'Data Recovery']
            },
            {
              id: 'action-003-2',
              action: 'Network Isolation',
              description: 'Isolate critical systems and implement network segmentation',
              urgency: 'immediate',
              category: 'prevention',
              estimatedTime: '30 minutes',
              requiredSkills: ['Network Security', 'Incident Response']
            },
            {
              id: 'action-003-3',
              action: 'Email Security Hardening',
              description: 'Deploy advanced email filtering and user training programs',
              urgency: 'high',
              category: 'prevention',
              estimatedTime: '4 hours',
              requiredSkills: ['Email Security', 'User Training']
            },
            {
              id: 'action-003-4',
              action: 'Behavioral Monitoring',
              description: 'Implement file system monitoring for encryption activities',
              urgency: 'high',
              category: 'detection',
              estimatedTime: '2 hours',
              requiredSkills: ['Endpoint Security', 'Behavioral Analysis']
            }
          ],
          recommendedTools: [
            {
              name: 'Veeam Backup & Replication',
              category: 'blocker',
              description: 'Immutable backup solution with ransomware protection',
              vendor: 'Veeam',
              cost: 'commercial',
              effectiveness: 10,
              url: 'https://www.veeam.com/'
            },
            {
              name: 'CryptoLocker Prevention Kit',
              category: 'blocker',
              description: 'Group Policy templates to prevent ransomware execution',
              cost: 'free',
              effectiveness: 7,
              url: 'https://fsrm.experiant.ca/'
            },
            {
              name: 'Proofpoint Email Protection',
              category: 'blocker',
              description: 'Advanced email security with ransomware detection',
              vendor: 'Proofpoint',
              cost: 'enterprise',
              effectiveness: 9
            },
            {
              name: 'Splunk SIEM',
              category: 'monitor',
              description: 'Security information and event management platform',
              vendor: 'Splunk',
              cost: 'enterprise',
              effectiveness: 9,
              url: 'https://www.splunk.com/'
            },
            {
              name: 'FSRM (File Server Resource Manager)',
              category: 'monitor',
              description: 'Windows file system monitoring and quotas',
              vendor: 'Microsoft',
              cost: 'free',
              effectiveness: 6
            }
          ],
          mitigationSteps: [
            'Implement 3-2-1 backup strategy with offline/immutable copies',
            'Deploy advanced email security with sandboxing',
            'Enable Windows Defender Controlled Folder Access',
            'Implement application whitelisting and behavioral monitoring',
            'Regular security awareness training for healthcare staff',
            'Network segmentation to isolate critical medical systems'
          ]
        },
        {
          id: 'threat-004',
          source: 'AlienVault OTX',
          type: 'Phishing Campaign',
          severity: 'high',
          title: 'Financial Services Credential Harvesting',
          description: 'Sophisticated phishing campaign targeting banking credentials with AI-generated content',
          timestamp: new Date(Date.now() - 18 * 60 * 60 * 1000).toISOString(),
          indicators: 45,
          affectedSectors: ['Finance', 'Banking', 'Fintech'],
          exploitAvailable: false,
          patchAvailable: true,
          detectionMethods: ['Email Analysis', 'URL Reputation', 'User Behavior Analytics'],
          iocs: [
            { type: 'URL', value: 'https://fake-bank-login.com' },
            { type: 'Email Subject', value: 'Urgent: Account Verification Required' },
            { type: 'Sender', value: 'security@fake-bank.com' }
          ]
        },
        {
          id: 'threat-005',
          source: 'CrowdStrike',
          type: 'Zero-Day Exploit',
          severity: 'critical',
          title: 'Chrome Browser RCE Vulnerability',
          description: 'Zero-day remote code execution vulnerability in Chrome browser being exploited',
          timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
          indicators: 12,
          affectedSectors: ['Enterprise', 'Government', 'Education'],
          cve: 'CVE-2024-0002',
          cvss: 9.6,
          exploitAvailable: true,
          patchAvailable: false,
          detectionMethods: ['Browser Monitoring', 'Memory Analysis', 'Network Traffic Analysis'],
          iocs: [
            { type: 'URL', value: 'https://exploit-site.com/payload' },
            { type: 'JavaScript', value: 'malicious_function()' }
          ]
        },
        {
          id: 'threat-006',
          source: 'FireEye',
          type: 'Supply Chain Attack',
          severity: 'high',
          title: 'NPM Package Compromise',
          description: 'Popular NPM package compromised with cryptocurrency mining malware',
          timestamp: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString(),
          indicators: 18,
          affectedSectors: ['Software Development', 'Technology', 'Startups'],
          exploitAvailable: true,
          patchAvailable: true,
          detectionMethods: ['Package Integrity Monitoring', 'Code Analysis', 'Runtime Monitoring'],
          iocs: [
            { type: 'Package', value: 'malicious-npm-package@1.2.3' },
            { type: 'Mining Pool', value: 'crypto-pool.malicious.com' }
          ]
        }
      ]

      // Mock MITRE ATT&CK techniques data
      const mockMITREAttacks: MITREAttackTechnique[] = [
        {
          id: 'T1036',
          name: 'Masquerading',
          tactic: 'Defense Evasion',
          description: 'Adversaries may attempt to manipulate features of their artifacts to make them appear legitimate',
          platforms: ['Windows', 'macOS', 'Linux'],
          detection: 'Monitor for files that have been renamed to mimic legitimate files',
          mitigation: 'Execution Prevention, Code Signing'
        },
        {
          id: 'T1059',
          name: 'Command and Scripting Interpreter',
          tactic: 'Execution',
          description: 'Adversaries may abuse command and script interpreters to execute commands',
          platforms: ['Windows', 'macOS', 'Linux'],
          detection: 'Monitor executed commands and arguments',
          mitigation: 'Execution Prevention, Disable or Remove Feature'
        },
        {
          id: 'T1486',
          name: 'Data Encrypted for Impact',
          tactic: 'Impact',
          description: 'Adversaries may encrypt data on target systems to interrupt availability',
          platforms: ['Windows', 'macOS', 'Linux'],
          detection: 'Monitor for rapid file modifications and encryption activities',
          mitigation: 'Data Backup, Behavior Prevention on Endpoint'
        },
        {
          id: 'T1566',
          name: 'Phishing',
          tactic: 'Initial Access',
          description: 'Adversaries may send phishing messages to gain access to victim systems',
          platforms: ['Windows', 'macOS', 'Linux'],
          detection: 'Monitor for suspicious email attachments and links',
          mitigation: 'User Training, Email Security'
        }
      ]

      setThreats(mockThreats)
      setMitreAttacks(mockMITREAttacks)
      setLastUpdate(new Date().toISOString())
    } catch (error) {
      console.error('Failed to fetch threat data:', error)
    } finally {
      setLoading(false)
    }
  }

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical':
        return 'bg-red-100 text-red-800 border-red-200'
      case 'high':
        return 'bg-orange-100 text-orange-800 border-orange-200'
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'low':
        return 'bg-green-100 text-green-800 border-green-200'
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const formatTimeAgo = (timestamp: string) => {
    const now = new Date()
    const time = new Date(timestamp)
    const diffInHours = Math.floor((now.getTime() - time.getTime()) / (1000 * 60 * 60))
    
    if (diffInHours < 1) return 'Just now'
    if (diffInHours < 24) return `${diffInHours}h ago`
    
    const diffInDays = Math.floor(diffInHours / 24)
    return `${diffInDays}d ago`
  }

  return (
    <Card className="bg-white border border-gray-100 shadow-sm">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Shield className="h-5 w-5 text-red-600" />
            <CardTitle className="text-lg font-semibold text-gray-900">
              Threat Intelligence
            </CardTitle>
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={fetchThreatData}
              disabled={loading}
            >
              <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
            </Button>
            <Button variant="outline" size="sm" asChild>
              <a href="/vulnerabilities" className="flex items-center space-x-1">
                <span>View All</span>
                <ExternalLink className="h-3 w-3" />
              </a>
            </Button>
          </div>
        </div>
        {lastUpdate && (
          <p className="text-xs text-gray-500">
            Last updated: {formatTimeAgo(lastUpdate)}
          </p>
        )}
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="space-y-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            {threats.slice(0, 5).map((threat) => (
              <div 
                key={threat.id}
                className="flex items-start space-x-3 p-3 rounded-lg border hover:bg-gray-50 transition-colors"
              >
                <div className="flex-shrink-0 mt-1">
                  <AlertTriangle className={`h-4 w-4 ${
                    threat.severity === 'critical' ? 'text-red-600' :
                    threat.severity === 'high' ? 'text-orange-600' :
                    threat.severity === 'medium' ? 'text-yellow-600' :
                    'text-green-600'
                  }`} />
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <h4 className="text-sm font-medium text-gray-900 truncate">
                      {threat.title}
                    </h4>
                    <Badge 
                      className={`text-xs ${getSeverityColor(threat.severity)}`}
                      variant="outline"
                    >
                      {threat.severity.toUpperCase()}
                    </Badge>
                  </div>
                  
                  <p className="text-xs text-gray-600 mb-2">
                    {threat.description}
                  </p>
                  
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-3 text-xs text-gray-500">
                      <span className="flex items-center space-x-1">
                        <Shield className="h-3 w-3" />
                        <span>{threat.source}</span>
                      </span>
                      <span className="flex items-center space-x-1">
                        <TrendingUp className="h-3 w-3" />
                        <span>{threat.indicators} IOCs</span>
                      </span>
                      <span className="flex items-center space-x-1">
                        <Clock className="h-3 w-3" />
                        <span>{formatTimeAgo(threat.timestamp)}</span>
                      </span>
                    </div>
                  </div>

                  {/* CVE and CVSS Information */}
                  {threat.cve && (
                    <div className="flex items-center gap-2 mb-2">
                      <Badge variant="outline" className="text-xs bg-red-50 text-red-700 border-red-200">
                        {threat.cve}
                      </Badge>
                      {threat.cvss && (
                        <Badge variant="outline" className="text-xs bg-orange-50 text-orange-700 border-orange-200">
                          CVSS: {threat.cvss}
                        </Badge>
                      )}
                      {threat.exploitAvailable && (
                        <Badge variant="outline" className="text-xs bg-red-50 text-red-700 border-red-200">
                          Exploit Available
                        </Badge>
                      )}
                      {threat.patchAvailable && (
                        <Badge variant="outline" className="text-xs bg-green-50 text-green-700 border-green-200">
                          Patch Available
                        </Badge>
                      )}
                    </div>
                  )}

                  {/* Detection Methods */}
                  <div className="mb-2">
                    <div className="text-xs text-gray-600 mb-1">Detection Methods:</div>
                    <div className="flex flex-wrap gap-1">
                      {threat.detectionMethods.slice(0, 3).map((method) => (
                        <Badge 
                          key={method}
                          variant="secondary" 
                          className="text-xs bg-blue-50 text-blue-700"
                        >
                          {method}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  {/* Business Impact & Attack Vector */}
                  {threat.businessImpact && (
                    <div className="mb-2">
                      <div className="text-xs text-gray-600 mb-1">Business Impact:</div>
                      <p className="text-xs text-red-700 bg-red-50 p-2 rounded border border-red-200">
                        {threat.businessImpact}
                      </p>
                    </div>
                  )}

                  {/* Threat Actions */}
                  {threat.threatActions && threat.threatActions.length > 0 && (
                    <div className="mb-3">
                      <div className="text-xs text-gray-600 mb-2 font-medium">Immediate Actions Required:</div>
                      <div className="space-y-2">
                        {threat.threatActions.slice(0, 3).map((action) => (
                          <div key={action.id} className="bg-yellow-50 border border-yellow-200 rounded p-2">
                            <div className="flex items-center justify-between mb-1">
                              <span className="text-xs font-medium text-gray-900">{action.action}</span>
                              <div className="flex items-center gap-1">
                                <Badge 
                                  variant="outline" 
                                  className={`text-xs ${
                                    action.urgency === 'immediate' ? 'bg-red-50 text-red-700 border-red-200' :
                                    action.urgency === 'high' ? 'bg-orange-50 text-orange-700 border-orange-200' :
                                    action.urgency === 'medium' ? 'bg-yellow-50 text-yellow-700 border-yellow-200' :
                                    'bg-green-50 text-green-700 border-green-200'
                                  }`}
                                >
                                  {action.urgency}
                                </Badge>
                                <Badge variant="secondary" className="text-xs">
                                  {action.category}
                                </Badge>
                              </div>
                            </div>
                            <p className="text-xs text-gray-600 mb-1">{action.description}</p>
                            <div className="flex items-center gap-3 text-xs text-gray-500">
                              <span>⏱️ {action.estimatedTime}</span>
                              <span>🎯 {action.requiredSkills.join(', ')}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Recommended Tools */}
                  {threat.recommendedTools && threat.recommendedTools.length > 0 && (
                    <div className="mb-3">
                      <div className="text-xs text-gray-600 mb-2 font-medium">Recommended Security Tools:</div>
                      <div className="grid grid-cols-1 gap-2">
                        {threat.recommendedTools.slice(0, 3).map((tool, index) => (
                          <div key={index} className="bg-blue-50 border border-blue-200 rounded p-2">
                            <div className="flex items-center justify-between mb-1">
                              <span className="text-xs font-medium text-gray-900">{tool.name}</span>
                              <div className="flex items-center gap-1">
                                <Badge 
                                  variant="outline" 
                                  className={`text-xs ${
                                    tool.cost === 'free' ? 'bg-green-50 text-green-700 border-green-200' :
                                    tool.cost === 'commercial' ? 'bg-blue-50 text-blue-700 border-blue-200' :
                                    'bg-purple-50 text-purple-700 border-purple-200'
                                  }`}
                                >
                                  {tool.cost}
                                </Badge>
                                <Badge variant="secondary" className="text-xs">
                                  {tool.category}
                                </Badge>
                                <div className="flex items-center gap-1">
                                  <span className="text-xs text-gray-500">★</span>
                                  <span className="text-xs text-gray-700">{tool.effectiveness}/10</span>
                                </div>
                              </div>
                            </div>
                            <p className="text-xs text-gray-600 mb-1">{tool.description}</p>
                            {tool.vendor && (
                              <div className="text-xs text-gray-500">
                                Vendor: {tool.vendor}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* IOCs Preview */}
                  <div className="mb-2">
                    <div className="text-xs text-gray-600 mb-1">Key Indicators:</div>
                    <div className="space-y-1">
                      {threat.iocs.slice(0, 2).map((ioc, index) => (
                        <div key={index} className="flex items-center gap-2 text-xs">
                          <Badge variant="outline" className="text-xs">
                            {ioc.type}
                          </Badge>
                          <code className="bg-gray-100 px-1 rounded text-xs font-mono">
                            {ioc.value.length > 30 ? `${ioc.value.substring(0, 30)}...` : ioc.value}
                          </code>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div className="flex flex-wrap gap-1 mt-2">
                    {threat.affectedSectors.slice(0, 3).map((sector) => (
                      <Badge 
                        key={sector}
                        variant="secondary" 
                        className="text-xs"
                      >
                        {sector}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            ))}
            
            {/* MITRE ATT&CK Techniques Section */}
            <div className="mt-6 pt-4 border-t">
              <h4 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <Shield className="h-4 w-4 text-blue-600" />
                MITRE ATT&CK Techniques
              </h4>
              <div className="grid gap-2">
                {mitreAttacks.slice(0, 4).map((technique) => (
                  <div 
                    key={technique.id}
                    className="flex items-start space-x-3 p-2 rounded border hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <Badge variant="outline" className="text-xs bg-blue-50 text-blue-700 border-blue-200">
                          {technique.id}
                        </Badge>
                        <span className="text-sm font-medium text-gray-900">{technique.name}</span>
                        <Badge variant="secondary" className="text-xs">
                          {technique.tactic}
                        </Badge>
                      </div>
                      <p className="text-xs text-gray-600 mb-1">
                        {technique.description}
                      </p>
                      <div className="flex items-center gap-3 text-xs text-gray-500">
                        <span>Platforms: {technique.platforms.join(', ')}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

