'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Switch } from '@/components/ui/switch'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  Shield, 
  Lock, 
  Eye,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Globe,
  Key,
  Monitor,
  FileText,
  Settings,
  Zap,
  Clock,
  Users,
  Server,
  Network
} from 'lucide-react'

interface SecurityStatus {
  https: {
    enabled: boolean
    certificateValid: boolean
    hstsEnabled: boolean
    tlsVersion: string
    cipherSuite: string
  }
  headers: {
    cspEnabled: boolean
    hstsEnabled: boolean
    xFrameOptions: boolean
    xContentTypeOptions: boolean
    referrerPolicy: boolean
  }
  authentication: {
    mfaEnabled: boolean
    sessionTimeout: number
    passwordPolicy: boolean
    rateLimiting: boolean
  }
  monitoring: {
    securityLogging: boolean
    anomalyDetection: boolean
    ipFiltering: boolean
    geoBlocking: boolean
  }
  compliance: {
    gdpr: boolean
    hipaa: boolean
    sox404: boolean
    iso27001: boolean
  }
}

interface SecurityEvent {
  id: string
  timestamp: string
  type: 'authentication' | 'authorization' | 'data_access' | 'system' | 'network'
  severity: 'low' | 'medium' | 'high' | 'critical'
  message: string
  ip?: string
  userAgent?: string
  details?: any
}

export default function SecurityDashboard() {
  const [securityStatus, setSecurityStatus] = useState<SecurityStatus | null>(null)
  const [securityEvents, setSecurityEvents] = useState<SecurityEvent[]>([])
  const [loading, setLoading] = useState(true)
  const [mounted, setMounted] = useState(false)

  const loadSecurityStatus = async () => {
    try {
      // Mock security status - in production, this would come from your security API
      const mockStatus: SecurityStatus = {
        https: {
          enabled: true,
          certificateValid: true,
          hstsEnabled: true,
          tlsVersion: 'TLS 1.3',
          cipherSuite: 'TLS_AES_256_GCM_SHA384'
        },
        headers: {
          cspEnabled: true,
          hstsEnabled: true,
          xFrameOptions: true,
          xContentTypeOptions: true,
          referrerPolicy: true
        },
        authentication: {
          mfaEnabled: true,
          sessionTimeout: 3600,
          passwordPolicy: true,
          rateLimiting: true
        },
        monitoring: {
          securityLogging: true,
          anomalyDetection: true,
          ipFiltering: true,
          geoBlocking: true
        },
        compliance: {
          gdpr: true,
          hipaa: true,
          sox404: true,
          iso27001: true
        }
      }

      setSecurityStatus(mockStatus)
    } catch (error) {
      console.error('Failed to load security status:', error)
    } finally {
      setLoading(false)
    }
  }

  const loadSecurityEvents = async () => {
    try {
      // Mock security events - in production, this would come from your security logs
      const mockEvents: SecurityEvent[] = [
        {
          id: 'evt-001',
          timestamp: new Date(Date.now() - 300000).toISOString(),
          type: 'authentication',
          severity: 'medium',
          message: 'Multiple failed login attempts detected',
          ip: '192.168.1.100',
          userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
          details: { attempts: 5, username: 'admin' }
        },
        {
          id: 'evt-002',
          timestamp: new Date(Date.now() - 600000).toISOString(),
          type: 'network',
          severity: 'high',
          message: 'Suspicious traffic pattern detected',
          ip: '10.0.0.50',
          userAgent: 'curl/7.68.0',
          details: { requestCount: 1000, timeWindow: '1 minute' }
        },
        {
          id: 'evt-003',
          timestamp: new Date(Date.now() - 900000).toISOString(),
          type: 'data_access',
          severity: 'low',
          message: 'Access to vulnerability intelligence data',
          ip: '172.16.0.10',
          userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)',
          details: { endpoint: '/api/vulnerabilities', method: 'GET' }
        },
        {
          id: 'evt-004',
          timestamp: new Date(Date.now() - 1200000).toISOString(),
          type: 'system',
          severity: 'critical',
          message: 'Potential SQL injection attempt blocked',
          ip: '203.0.113.45',
          userAgent: 'sqlmap/1.6.12',
          details: { payload: "' OR 1=1 --", blocked: true }
        },
        {
          id: 'evt-005',
          timestamp: new Date(Date.now() - 1800000).toISOString(),
          type: 'authorization',
          severity: 'medium',
          message: 'Unauthorized API access attempt',
          ip: '198.51.100.25',
          userAgent: 'PostmanRuntime/7.29.2',
          details: { endpoint: '/api/intelligence-center', status: 403 }
        }
      ]

      setSecurityEvents(mockEvents)
    } catch (error) {
      console.error('Failed to load security events:', error)
    }
  }

  useEffect(() => {
    setMounted(true)
    loadSecurityStatus()
    loadSecurityEvents()
  }, [])

  // Prevent hydration mismatch by not rendering until mounted
  if (!mounted) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
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

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'authentication':
        return <Key className="h-4 w-4" />
      case 'authorization':
        return <Lock className="h-4 w-4" />
      case 'data_access':
        return <FileText className="h-4 w-4" />
      case 'system':
        return <Server className="h-4 w-4" />
      case 'network':
        return <Network className="h-4 w-4" />
      default:
        return <AlertTriangle className="h-4 w-4" />
    }
  }

  const formatTimeAgo = (timestamp: string) => {
    const now = new Date()
    const time = new Date(timestamp)
    const diffInMinutes = Math.floor((now.getTime() - time.getTime()) / (1000 * 60))
    
    if (diffInMinutes < 1) return 'Just now'
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`
    
    const diffInHours = Math.floor(diffInMinutes / 60)
    if (diffInHours < 24) return `${diffInHours}h ago`
    
    const diffInDays = Math.floor(diffInHours / 24)
    return `${diffInDays}d ago`
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Security Dashboard</h1>
          <p className="text-gray-600">Advanced security monitoring and configuration</p>
        </div>
        <div className="flex items-center gap-2">
          <Shield className="h-5 w-5 text-green-500" />
          <span className="text-sm font-medium text-green-700">Security Status: Active</span>
        </div>
      </div>

      {/* Security Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Security Status</p>
                <p className="text-lg font-bold text-green-600">Secure</p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-500" />
            </div>
            <div className="mt-2 text-xs text-gray-500">
              All protections active
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">HTTPS/TLS</p>
                <p className="text-lg font-bold text-blue-600">TLS 1.3</p>
              </div>
              <Lock className="h-8 w-8 text-blue-500" />
            </div>
            <div className="mt-2 text-xs text-gray-500">
              Certificate valid
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Security Events</p>
                <p className="text-lg font-bold text-orange-600">{securityEvents.length}</p>
              </div>
              <Eye className="h-8 w-8 text-orange-500" />
            </div>
            <div className="mt-2 text-xs text-gray-500">
              Last 24 hours
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Compliance</p>
                <p className="text-lg font-bold text-purple-600">100%</p>
              </div>
              <FileText className="h-8 w-8 text-purple-500" />
            </div>
            <div className="mt-2 text-xs text-gray-500">
              GDPR • HIPAA • SOX
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="status" className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="status">Status</TabsTrigger>
          <TabsTrigger value="events">Events</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
          <TabsTrigger value="compliance">Compliance</TabsTrigger>
          <TabsTrigger value="certificates">Certificates</TabsTrigger>
        </TabsList>

        <TabsContent value="status" className="mt-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Lock className="h-5 w-5" />
                  HTTPS & Transport Security
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm">HTTPS Enforcement</span>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span className="text-sm text-green-600">Enabled</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Certificate Validation</span>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span className="text-sm text-green-600">Valid</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">HSTS Policy</span>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span className="text-sm text-green-600">Active</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">TLS Version</span>
                  <Badge variant="outline" className="bg-green-50 text-green-700">
                    {securityStatus?.https.tlsVersion}
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Cipher Suite</span>
                  <code className="text-xs bg-gray-100 px-2 py-1 rounded">
                    {securityStatus?.https.cipherSuite}
                  </code>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  Security Headers
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Content Security Policy</span>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span className="text-sm text-green-600">Active</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">X-Frame-Options</span>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span className="text-sm text-green-600">DENY</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">X-Content-Type-Options</span>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span className="text-sm text-green-600">nosniff</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Referrer Policy</span>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span className="text-sm text-green-600">strict-origin</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Permissions Policy</span>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span className="text-sm text-green-600">Restricted</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="events" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Eye className="h-5 w-5" />
                Security Events ({securityEvents.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {securityEvents.map((event) => (
                  <div key={event.id} className="border rounded-lg p-4">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-2">
                        {getTypeIcon(event.type)}
                        <span className="font-medium">{event.message}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge className={`text-xs ${getSeverityColor(event.severity)}`} variant="outline">
                          {event.severity.toUpperCase()}
                        </Badge>
                        <span className="text-xs text-gray-500">{formatTimeAgo(event.timestamp)}</span>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600">
                      <div>
                        <span className="font-medium">IP Address:</span> {event.ip || 'N/A'}
                      </div>
                      <div>
                        <span className="font-medium">Type:</span> {event.type}
                      </div>
                      <div>
                        <span className="font-medium">Timestamp:</span> {new Date(event.timestamp).toLocaleString()}
                      </div>
                    </div>
                    
                    {event.details && (
                      <div className="mt-2 p-2 bg-gray-50 rounded text-xs">
                        <strong>Details:</strong> {JSON.stringify(event.details, null, 2)}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings" className="mt-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Authentication Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Multi-Factor Authentication</p>
                    <p className="text-sm text-gray-600">Require MFA for all users</p>
                  </div>
                  <Switch checked={securityStatus?.authentication.mfaEnabled} />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Strong Password Policy</p>
                    <p className="text-sm text-gray-600">Enforce complex passwords</p>
                  </div>
                  <Switch checked={securityStatus?.authentication.passwordPolicy} />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Rate Limiting</p>
                    <p className="text-sm text-gray-600">Limit login attempts</p>
                  </div>
                  <Switch checked={securityStatus?.authentication.rateLimiting} />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Monitoring Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Security Logging</p>
                    <p className="text-sm text-gray-600">Log all security events</p>
                  </div>
                  <Switch checked={securityStatus?.monitoring.securityLogging} />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Anomaly Detection</p>
                    <p className="text-sm text-gray-600">Detect unusual patterns</p>
                  </div>
                  <Switch checked={securityStatus?.monitoring.anomalyDetection} />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">IP Filtering</p>
                    <p className="text-sm text-gray-600">Block malicious IPs</p>
                  </div>
                  <Switch checked={securityStatus?.monitoring.ipFiltering} />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Geo-blocking</p>
                    <p className="text-sm text-gray-600">Block high-risk countries</p>
                  </div>
                  <Switch checked={securityStatus?.monitoring.geoBlocking} />
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="compliance" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Compliance Status
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="text-center p-4 border rounded-lg">
                  <CheckCircle className="h-8 w-8 text-green-500 mx-auto mb-2" />
                  <h3 className="font-medium">GDPR</h3>
                  <p className="text-sm text-gray-600">EU Data Protection</p>
                  <Badge variant="outline" className="mt-2 bg-green-50 text-green-700">
                    Compliant
                  </Badge>
                </div>
                <div className="text-center p-4 border rounded-lg">
                  <CheckCircle className="h-8 w-8 text-green-500 mx-auto mb-2" />
                  <h3 className="font-medium">HIPAA</h3>
                  <p className="text-sm text-gray-600">Healthcare Privacy</p>
                  <Badge variant="outline" className="mt-2 bg-green-50 text-green-700">
                    Compliant
                  </Badge>
                </div>
                <div className="text-center p-4 border rounded-lg">
                  <CheckCircle className="h-8 w-8 text-green-500 mx-auto mb-2" />
                  <h3 className="font-medium">SOX 404</h3>
                  <p className="text-sm text-gray-600">Financial Controls</p>
                  <Badge variant="outline" className="mt-2 bg-green-50 text-green-700">
                    Compliant
                  </Badge>
                </div>
                <div className="text-center p-4 border rounded-lg">
                  <CheckCircle className="h-8 w-8 text-green-500 mx-auto mb-2" />
                  <h3 className="font-medium">ISO 27001</h3>
                  <p className="text-sm text-gray-600">Information Security</p>
                  <Badge variant="outline" className="mt-2 bg-green-50 text-green-700">
                    Compliant
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="certificates" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Key className="h-5 w-5" />
                SSL/TLS Certificates
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-medium">Primary Certificate</h3>
                    <Badge variant="outline" className="bg-green-50 text-green-700">
                      Valid
                    </Badge>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="font-medium">Issuer:</span> Let's Encrypt Authority X3
                    </div>
                    <div>
                      <span className="font-medium">Valid Until:</span> March 15, 2025
                    </div>
                    <div>
                      <span className="font-medium">Key Size:</span> 2048 bits
                    </div>
                    <div>
                      <span className="font-medium">Signature Algorithm:</span> SHA256-RSA
                    </div>
                  </div>
                  <div className="mt-4 flex gap-2">
                    <Button size="sm" variant="outline">
                      View Details
                    </Button>
                    <Button size="sm" variant="outline">
                      Renew Certificate
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}