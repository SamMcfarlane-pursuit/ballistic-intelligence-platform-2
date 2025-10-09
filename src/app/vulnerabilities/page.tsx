'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  Shield, 
  AlertTriangle, 
  Search,
  Filter,
  Download,
  ExternalLink,
  Zap,
  Wrench,
  Target,
  Clock,
  TrendingUp,
  Users,
  Building2,
  CheckCircle,
  XCircle,
  AlertCircle
} from 'lucide-react'

interface VulnerabilityDetail {
  id: string
  cve: string
  title: string
  description: string
  severity: 'critical' | 'high' | 'medium' | 'low'
  cvss: number
  publishedDate: string
  lastModified: string
  exploitAvailable: boolean
  patchAvailable: boolean
  exploitComplexity: 'low' | 'medium' | 'high'
  attackVector: string
  affectedProducts: string[]
  affectedVersions: string[]
  businessImpact: string
  threatActions: ThreatAction[]
  recommendedTools: RecommendedTool[]
  mitigationSteps: string[]
  references: Reference[]
  exploitDetails?: ExploitDetail
}

interface ThreatAction {
  id: string
  action: string
  description: string
  urgency: 'immediate' | 'high' | 'medium' | 'low'
  category: 'prevention' | 'detection' | 'response' | 'recovery'
  estimatedTime: string
  requiredSkills: string[]
  automatable: boolean
}

interface RecommendedTool {
  name: string
  category: 'scanner' | 'monitor' | 'analyzer' | 'blocker' | 'forensics'
  description: string
  vendor?: string
  cost: 'free' | 'commercial' | 'enterprise'
  effectiveness: number
  url?: string
  supportedPlatforms: string[]
}

interface Reference {
  type: 'advisory' | 'exploit' | 'patch' | 'analysis'
  title: string
  url: string
  source: string
}

interface ExploitDetail {
  publicExploits: number
  exploitKits: string[]
  attackComplexity: string
  userInteraction: boolean
  privilegesRequired: string
  scope: string
}

export default function VulnerabilitiesPage() {
  const [vulnerabilities, setVulnerabilities] = useState<VulnerabilityDetail[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [severityFilter, setSeverityFilter] = useState('all')
  const [selectedVuln, setSelectedVuln] = useState<VulnerabilityDetail | null>(null)

  useEffect(() => {
    fetchVulnerabilities()
  }, [])

  const fetchVulnerabilities = async () => {
    try {
      // Mock comprehensive vulnerability data
      const mockVulns: VulnerabilityDetail[] = [
        {
          id: 'vuln-001',
          cve: 'CVE-2024-0001',
          title: 'Windows Kernel Privilege Escalation Vulnerability',
          description: 'A privilege escalation vulnerability exists in the Windows kernel that allows an attacker to gain SYSTEM privileges through improper validation of user-supplied data.',
          severity: 'critical',
          cvss: 9.8,
          publishedDate: '2024-01-15T00:00:00Z',
          lastModified: '2024-01-16T12:00:00Z',
          exploitAvailable: true,
          patchAvailable: true,
          exploitComplexity: 'low',
          attackVector: 'Local',
          affectedProducts: ['Windows 10', 'Windows 11', 'Windows Server 2019', 'Windows Server 2022'],
          affectedVersions: ['All versions prior to January 2024 updates'],
          businessImpact: 'Complete system compromise, privilege escalation, potential ransomware deployment, data exfiltration',
          threatActions: [
            {
              id: 'ta-001-1',
              action: 'Emergency Patch Deployment',
              description: 'Deploy Microsoft security update KB5034441 immediately to all Windows systems using automated patch management',
              urgency: 'immediate',
              category: 'prevention',
              estimatedTime: '2-4 hours',
              requiredSkills: ['Patch Management', 'Windows Administration', 'WSUS/SCCM'],
              automatable: true
            },
            {
              id: 'ta-001-2',
              action: 'Privilege Audit and Restriction',
              description: 'Conduct comprehensive audit of user privileges and implement least privilege principle across all systems',
              urgency: 'high',
              category: 'prevention',
              estimatedTime: '8-16 hours',
              requiredSkills: ['Identity Management', 'Access Control', 'Active Directory'],
              automatable: false
            },
            {
              id: 'ta-001-3',
              action: 'Kernel Activity Monitoring',
              description: 'Deploy advanced endpoint detection to monitor kernel-level activities and privilege escalation attempts',
              urgency: 'high',
              category: 'detection',
              estimatedTime: '2-4 hours',
              requiredSkills: ['Endpoint Security', 'SIEM Configuration', 'Threat Hunting'],
              automatable: true
            },
            {
              id: 'ta-001-4',
              action: 'Incident Response Preparation',
              description: 'Prepare incident response procedures for potential exploitation and system compromise scenarios',
              urgency: 'medium',
              category: 'response',
              estimatedTime: '4-6 hours',
              requiredSkills: ['Incident Response', 'Forensics', 'Communication'],
              automatable: false
            }
          ],
          recommendedTools: [
            {
              name: 'Microsoft WSUS',
              category: 'blocker',
              description: 'Windows Server Update Services for centralized patch management and deployment',
              vendor: 'Microsoft',
              cost: 'free',
              effectiveness: 9,
              url: 'https://docs.microsoft.com/en-us/windows-server/administration/windows-server-update-services/',
              supportedPlatforms: ['Windows']
            },
            {
              name: 'System Center Configuration Manager (SCCM)',
              category: 'blocker',
              description: 'Enterprise patch management and system configuration tool',
              vendor: 'Microsoft',
              cost: 'enterprise',
              effectiveness: 10,
              supportedPlatforms: ['Windows']
            },
            {
              name: 'Nessus Professional',
              category: 'scanner',
              description: 'Comprehensive vulnerability scanner for identifying unpatched systems and misconfigurations',
              vendor: 'Tenable',
              cost: 'commercial',
              effectiveness: 9,
              url: 'https://www.tenable.com/products/nessus',
              supportedPlatforms: ['Windows', 'Linux', 'macOS']
            },
            {
              name: 'Sysmon',
              category: 'monitor',
              description: 'Windows system activity monitoring with detailed logging of process and network activity',
              vendor: 'Microsoft',
              cost: 'free',
              effectiveness: 8,
              url: 'https://docs.microsoft.com/en-us/sysinternals/downloads/sysmon',
              supportedPlatforms: ['Windows']
            },
            {
              name: 'CrowdStrike Falcon',
              category: 'monitor',
              description: 'Advanced endpoint detection and response with real-time threat hunting capabilities',
              vendor: 'CrowdStrike',
              cost: 'enterprise',
              effectiveness: 10,
              supportedPlatforms: ['Windows', 'Linux', 'macOS']
            },
            {
              name: 'Splunk Enterprise Security',
              category: 'analyzer',
              description: 'Security information and event management platform for correlation and analysis',
              vendor: 'Splunk',
              cost: 'enterprise',
              effectiveness: 9,
              url: 'https://www.splunk.com/en_us/products/enterprise-security.html',
              supportedPlatforms: ['Cross-platform']
            }
          ],
          mitigationSteps: [
            'Apply security patches immediately using automated deployment systems',
            'Enable Windows Defender Application Control (WDAC) to prevent unauthorized code execution',
            'Implement User Account Control (UAC) with highest security settings',
            'Deploy endpoint detection and response (EDR) solutions with kernel monitoring',
            'Regular vulnerability scanning and penetration testing',
            'Implement network segmentation to limit lateral movement',
            'Enable advanced audit policies for privilege escalation detection',
            'Deploy application whitelisting on critical systems'
          ],
          references: [
            {
              type: 'advisory',
              title: 'Microsoft Security Advisory',
              url: 'https://msrc.microsoft.com/update-guide/vulnerability/CVE-2024-0001',
              source: 'Microsoft'
            },
            {
              type: 'patch',
              title: 'Security Update KB5034441',
              url: 'https://support.microsoft.com/kb/5034441',
              source: 'Microsoft'
            },
            {
              type: 'analysis',
              title: 'Technical Analysis by Security Researchers',
              url: 'https://example.com/analysis',
              source: 'Security Research Community'
            }
          ],
          exploitDetails: {
            publicExploits: 3,
            exploitKits: ['Metasploit', 'Custom PoCs'],
            attackComplexity: 'Low - Public exploits available',
            userInteraction: false,
            privilegesRequired: 'Low - Standard user account sufficient',
            scope: 'Changed - Can affect resources beyond vulnerable component'
          }
        },
        {
          id: 'vuln-002',
          cve: 'CVE-2024-0002',
          title: 'Chrome Browser Remote Code Execution',
          description: 'A use-after-free vulnerability in Chrome V8 JavaScript engine allows remote code execution through malicious web pages.',
          severity: 'critical',
          cvss: 9.6,
          publishedDate: '2024-01-10T00:00:00Z',
          lastModified: '2024-01-12T08:00:00Z',
          exploitAvailable: true,
          patchAvailable: true,
          exploitComplexity: 'medium',
          attackVector: 'Network',
          affectedProducts: ['Google Chrome', 'Microsoft Edge', 'Chromium-based browsers'],
          affectedVersions: ['Chrome < 121.0.6167.85', 'Edge < 121.0.2277.83'],
          businessImpact: 'Remote code execution, data theft, malware installation, browser-based attacks',
          threatActions: [
            {
              id: 'ta-002-1',
              action: 'Browser Update Enforcement',
              description: 'Force immediate update of all Chrome and Chromium-based browsers to latest version',
              urgency: 'immediate',
              category: 'prevention',
              estimatedTime: '1-2 hours',
              requiredSkills: ['Browser Management', 'Group Policy', 'Software Deployment'],
              automatable: true
            },
            {
              id: 'ta-002-2',
              action: 'Web Traffic Monitoring',
              description: 'Implement enhanced monitoring of web traffic for exploit attempts and malicious JavaScript',
              urgency: 'high',
              category: 'detection',
              estimatedTime: '2-3 hours',
              requiredSkills: ['Network Security', 'Web Filtering', 'Traffic Analysis'],
              automatable: true
            },
            {
              id: 'ta-002-3',
              action: 'Browser Security Hardening',
              description: 'Deploy browser security policies to restrict JavaScript execution and plugin usage',
              urgency: 'high',
              category: 'prevention',
              estimatedTime: '3-4 hours',
              requiredSkills: ['Browser Administration', 'Security Policy', 'Group Policy'],
              automatable: true
            }
          ],
          recommendedTools: [
            {
              name: 'Google Chrome Enterprise',
              category: 'blocker',
              description: 'Centralized browser management with automatic updates and security policies',
              vendor: 'Google',
              cost: 'free',
              effectiveness: 9,
              url: 'https://chromeenterprise.google/',
              supportedPlatforms: ['Windows', 'macOS', 'Linux']
            },
            {
              name: 'Zscaler Internet Access',
              category: 'blocker',
              description: 'Cloud-based web security with real-time threat protection',
              vendor: 'Zscaler',
              cost: 'enterprise',
              effectiveness: 9,
              supportedPlatforms: ['Cross-platform']
            },
            {
              name: 'Palo Alto Networks Prisma Access',
              category: 'monitor',
              description: 'Cloud-delivered security platform with advanced threat prevention',
              vendor: 'Palo Alto Networks',
              cost: 'enterprise',
              effectiveness: 10,
              supportedPlatforms: ['Cross-platform']
            }
          ],
          mitigationSteps: [
            'Update all Chrome and Chromium-based browsers immediately',
            'Deploy browser management policies through Group Policy or MDM',
            'Implement web application firewalls (WAF) to filter malicious content',
            'Enable browser sandboxing and site isolation features',
            'Deploy endpoint protection with browser exploit protection',
            'Regular security awareness training for safe browsing practices'
          ],
          references: [
            {
              type: 'advisory',
              title: 'Chrome Security Advisory',
              url: 'https://chromereleases.googleblog.com/2024/01/stable-channel-update-for-desktop.html',
              source: 'Google'
            },
            {
              type: 'patch',
              title: 'Chrome 121.0.6167.85 Update',
              url: 'https://chrome.google.com/webstore',
              source: 'Google'
            }
          ],
          exploitDetails: {
            publicExploits: 1,
            exploitKits: ['Browser exploit kits'],
            attackComplexity: 'Medium - Requires user to visit malicious website',
            userInteraction: true,
            privilegesRequired: 'None - No authentication required',
            scope: 'Unchanged - Impact limited to vulnerable component'
          }
        }
      ]

      setVulnerabilities(mockVulns)
    } catch (error) {
      console.error('Failed to fetch vulnerabilities:', error)
    } finally {
      setLoading(false)
    }
  }

  const filteredVulnerabilities = vulnerabilities.filter(vuln => {
    const matchesSearch = vuln.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         vuln.cve.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         vuln.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesSeverity = severityFilter === 'all' || vuln.severity === severityFilter
    return matchesSearch && matchesSeverity
  })

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

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case 'immediate':
        return 'bg-red-50 text-red-700 border-red-200'
      case 'high':
        return 'bg-orange-50 text-orange-700 border-orange-200'
      case 'medium':
        return 'bg-yellow-50 text-yellow-700 border-yellow-200'
      case 'low':
        return 'bg-green-50 text-green-700 border-green-200'
      default:
        return 'bg-gray-50 text-gray-700 border-gray-200'
    }
  }

  const getCostColor = (cost: string) => {
    switch (cost) {
      case 'free':
        return 'bg-green-50 text-green-700 border-green-200'
      case 'commercial':
        return 'bg-blue-50 text-blue-700 border-blue-200'
      case 'enterprise':
        return 'bg-purple-50 text-purple-700 border-purple-200'
      default:
        return 'bg-gray-50 text-gray-700 border-gray-200'
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Vulnerability Intelligence Center</h1>
        <p className="text-gray-600">
          Comprehensive vulnerability analysis with actionable threat intelligence and security tools
        </p>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search vulnerabilities by CVE, title, or description..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <div className="flex gap-2">
          {['all', 'critical', 'high', 'medium', 'low'].map((severity) => (
            <Button
              key={severity}
              variant={severityFilter === severity ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSeverityFilter(severity)}
              className="capitalize"
            >
              {severity}
            </Button>
          ))}
        </div>
      </div>

      {/* Vulnerabilities List */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Active Vulnerabilities ({filteredVulnerabilities.length})</h2>
          {loading ? (
            <div className="space-y-4">
              {[...Array(3)].map((_, i) => (
                <Card key={i} className="animate-pulse">
                  <CardContent className="p-4">
                    <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              {filteredVulnerabilities.map((vuln) => (
                <Card 
                  key={vuln.id} 
                  className={`cursor-pointer transition-all hover:shadow-md ${
                    selectedVuln?.id === vuln.id ? 'ring-2 ring-blue-500' : ''
                  }`}
                  onClick={() => setSelectedVuln(vuln)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="font-mono text-xs">
                          {vuln.cve}
                        </Badge>
                        <Badge className={`text-xs ${getSeverityColor(vuln.severity)}`} variant="outline">
                          {vuln.severity.toUpperCase()}
                        </Badge>
                        <Badge variant="outline" className="text-xs">
                          CVSS: {vuln.cvss}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-1">
                        {vuln.exploitAvailable ? (
                          <XCircle className="h-4 w-4 text-red-500" title="Exploit Available" />
                        ) : (
                          <CheckCircle className="h-4 w-4 text-green-500" title="No Known Exploits" />
                        )}
                        {vuln.patchAvailable ? (
                          <CheckCircle className="h-4 w-4 text-green-500" title="Patch Available" />
                        ) : (
                          <XCircle className="h-4 w-4 text-red-500" title="No Patch Available" />
                        )}
                      </div>
                    </div>
                    
                    <h3 className="font-semibold text-gray-900 mb-2">{vuln.title}</h3>
                    <p className="text-sm text-gray-600 mb-3">{vuln.description}</p>
                    
                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <span>Published: {new Date(vuln.publishedDate).toLocaleDateString()}</span>
                      <span>{vuln.threatActions.length} Actions • {vuln.recommendedTools.length} Tools</span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>

        {/* Vulnerability Details */}
        <div className="lg:sticky lg:top-4">
          {selectedVuln ? (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5 text-red-600" />
                  {selectedVuln.cve} Details
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="actions" className="w-full">
                  <TabsList className="grid w-full grid-cols-4">
                    <TabsTrigger value="actions">Actions</TabsTrigger>
                    <TabsTrigger value="tools">Tools</TabsTrigger>
                    <TabsTrigger value="details">Details</TabsTrigger>
                    <TabsTrigger value="references">References</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="actions" className="mt-4">
                    <div className="space-y-4">
                      <h4 className="font-semibold flex items-center gap-2">
                        <Zap className="h-4 w-4" />
                        Threat Actions ({selectedVuln.threatActions.length})
                      </h4>
                      {selectedVuln.threatActions.map((action) => (
                        <div key={action.id} className="border rounded-lg p-3">
                          <div className="flex items-center justify-between mb-2">
                            <h5 className="font-medium">{action.action}</h5>
                            <div className="flex items-center gap-2">
                              <Badge className={`text-xs ${getUrgencyColor(action.urgency)}`} variant="outline">
                                {action.urgency}
                              </Badge>
                              <Badge variant="secondary" className="text-xs">
                                {action.category}
                              </Badge>
                              {action.automatable && (
                                <Badge variant="outline" className="text-xs bg-blue-50 text-blue-700">
                                  Automatable
                                </Badge>
                              )}
                            </div>
                          </div>
                          <p className="text-sm text-gray-600 mb-2">{action.description}</p>
                          <div className="flex items-center gap-4 text-xs text-gray-500">
                            <span className="flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              {action.estimatedTime}
                            </span>
                            <span className="flex items-center gap-1">
                              <Users className="h-3 w-3" />
                              {action.requiredSkills.join(', ')}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="tools" className="mt-4">
                    <div className="space-y-4">
                      <h4 className="font-semibold flex items-center gap-2">
                        <Wrench className="h-4 w-4" />
                        Recommended Tools ({selectedVuln.recommendedTools.length})
                      </h4>
                      {selectedVuln.recommendedTools.map((tool, index) => (
                        <div key={index} className="border rounded-lg p-3">
                          <div className="flex items-center justify-between mb-2">
                            <h5 className="font-medium">{tool.name}</h5>
                            <div className="flex items-center gap-2">
                              <Badge className={`text-xs ${getCostColor(tool.cost)}`} variant="outline">
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
                          <p className="text-sm text-gray-600 mb-2">{tool.description}</p>
                          <div className="flex items-center justify-between text-xs text-gray-500">
                            <span>Platforms: {tool.supportedPlatforms.join(', ')}</span>
                            {tool.vendor && <span>Vendor: {tool.vendor}</span>}
                          </div>
                          {tool.url && (
                            <div className="mt-2">
                              <Button size="sm" variant="outline" asChild>
                                <a href={tool.url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1">
                                  <ExternalLink className="h-3 w-3" />
                                  Learn More
                                </a>
                              </Button>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="details" className="mt-4">
                    <div className="space-y-4">
                      <div>
                        <h5 className="font-medium mb-2">Business Impact</h5>
                        <p className="text-sm text-red-700 bg-red-50 p-3 rounded border border-red-200">
                          {selectedVuln.businessImpact}
                        </p>
                      </div>
                      
                      <div>
                        <h5 className="font-medium mb-2">Affected Products</h5>
                        <div className="flex flex-wrap gap-2">
                          {selectedVuln.affectedProducts.map((product) => (
                            <Badge key={product} variant="outline">{product}</Badge>
                          ))}
                        </div>
                      </div>
                      
                      <div>
                        <h5 className="font-medium mb-2">Mitigation Steps</h5>
                        <ul className="space-y-1">
                          {selectedVuln.mitigationSteps.map((step, index) => (
                            <li key={index} className="text-sm flex items-start gap-2">
                              <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                              {step}
                            </li>
                          ))}
                        </ul>
                      </div>
                      
                      {selectedVuln.exploitDetails && (
                        <div>
                          <h5 className="font-medium mb-2">Exploit Information</h5>
                          <div className="bg-orange-50 border border-orange-200 rounded p-3 space-y-2">
                            <div className="text-sm">
                              <strong>Public Exploits:</strong> {selectedVuln.exploitDetails.publicExploits}
                            </div>
                            <div className="text-sm">
                              <strong>Attack Complexity:</strong> {selectedVuln.exploitDetails.attackComplexity}
                            </div>
                            <div className="text-sm">
                              <strong>User Interaction:</strong> {selectedVuln.exploitDetails.userInteraction ? 'Required' : 'Not Required'}
                            </div>
                            <div className="text-sm">
                              <strong>Privileges Required:</strong> {selectedVuln.exploitDetails.privilegesRequired}
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="references" className="mt-4">
                    <div className="space-y-3">
                      <h4 className="font-semibold">References & Resources</h4>
                      {selectedVuln.references.map((ref, index) => (
                        <div key={index} className="border rounded p-3">
                          <div className="flex items-center justify-between mb-1">
                            <Badge variant="outline" className="text-xs">
                              {ref.type}
                            </Badge>
                            <span className="text-xs text-gray-500">{ref.source}</span>
                          </div>
                          <h6 className="font-medium text-sm mb-2">{ref.title}</h6>
                          <Button size="sm" variant="outline" asChild>
                            <a href={ref.url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1">
                              <ExternalLink className="h-3 w-3" />
                              View Resource
                            </a>
                          </Button>
                        </div>
                      ))}
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent className="p-8 text-center">
                <Target className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Select a Vulnerability</h3>
                <p className="text-gray-600">
                  Choose a vulnerability from the list to view detailed threat actions, recommended tools, and mitigation strategies.
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}