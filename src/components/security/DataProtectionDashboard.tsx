'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  Shield, 
  Lock, 
  Eye,
  EyeOff,
  Key,
  FileText,
  Users,
  Clock,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Database,
  Fingerprint,
  UserCheck,
  Activity,
  Download,
  Upload
} from 'lucide-react'

interface DataClassification {
  level: string
  category: string
  sensitivity: number
  retention: number
  encryption: boolean
  accessControl: string[]
  auditRequired: boolean
}

interface AuditLog {
  id: string
  timestamp: string
  userId: string
  action: string
  resource: string
  dataClassification: string
  success: boolean
  ipAddress: string
  riskScore?: number
}

interface ComplianceReport {
  period: { start: string; end: string }
  totalAccesses: number
  successfulAccesses: number
  failedAccesses: number
  highRiskAccesses: number
  dataClassificationBreakdown: Record<string, number>
  userActivityBreakdown: Record<string, number>
  complianceStatus: {
    gdpr: boolean
    hipaa: boolean
    sox404: boolean
    iso27001: boolean
  }
}

export default function DataProtectionDashboard() {
  const [classifications, setClassifications] = useState<Record<string, DataClassification>>({})
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([])
  const [complianceReport, setComplianceReport] = useState<ComplianceReport | null>(null)
  const [loading, setLoading] = useState(true)
  const [mounted, setMounted] = useState(false)
  const [testData, setTestData] = useState('')
  const [testClassification, setTestClassification] = useState('vulnerability_high')
  const [testUserId, setTestUserId] = useState('security_analyst_001')
  const [encryptedResult, setEncryptedResult] = useState<any>(null)
  const [maskedResult, setMaskedResult] = useState<any>(null)

  const loadDataProtectionInfo = async () => {
    try {
      setLoading(true)
      
      // Load data classifications
      const classificationsResponse = await fetch('/api/secure-data?action=classifications')
      const classificationsData = await classificationsResponse.json()
      
      if (classificationsData.success) {
        setClassifications(classificationsData.data.details)
      }

      // Load audit logs
      const auditResponse = await fetch(`/api/secure-data?action=audit-logs&userId=${testUserId}`)
      const auditData = await auditResponse.json()
      
      if (auditData.success) {
        setAuditLogs(auditData.data.logs)
      }

      // Load compliance report
      const complianceResponse = await fetch(`/api/secure-data?action=compliance-report&userId=${testUserId}`)
      const complianceData = await complianceResponse.json()
      
      if (complianceData.success) {
        setComplianceReport(complianceData.data)
      }

    } catch (error) {
      console.error('Failed to load data protection info:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    setMounted(true)
    loadDataProtectionInfo()
  }, [])

  // Prevent hydration mismatch
  if (!mounted) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  const testEncryption = async () => {
    if (!testData.trim()) return

    try {
      const response = await fetch('/api/secure-data', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'encrypt-data',
          userId: testUserId,
          data: { sensitiveInfo: testData },
          classification: testClassification
        })
      })

      const result = await response.json()
      if (result.success) {
        setEncryptedResult(result.data)
      }
    } catch (error) {
      console.error('Encryption test failed:', error)
    }
  }

  const testDataMasking = async () => {
    try {
      // Test with sample vulnerability data
      const sampleData = {
        cve: 'CVE-2024-0001',
        exploitCode: 'SENSITIVE_EXPLOIT_CODE_HERE',
        internalNotes: 'CONFIDENTIAL_INTERNAL_ASSESSMENT',
        sourceCode: 'kernel32.dll vulnerable function details'
      }

      const response = await fetch('/api/secure-data', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'mask-data',
          userId: testUserId,
          data: sampleData,
          classification: testClassification
        })
      })

      const result = await response.json()
      if (result.success) {
        setMaskedResult(result.data)
      }
    } catch (error) {
      console.error('Data masking test failed:', error)
    }
  }

  const getSensitivityColor = (sensitivity: number) => {
    if (sensitivity >= 9) return 'bg-red-100 text-red-800 border-red-200'
    if (sensitivity >= 7) return 'bg-orange-100 text-orange-800 border-orange-200'
    if (sensitivity >= 5) return 'bg-yellow-100 text-yellow-800 border-yellow-200'
    return 'bg-green-100 text-green-800 border-green-200'
  }

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'top_secret':
        return 'bg-red-100 text-red-800 border-red-200'
      case 'restricted':
        return 'bg-orange-100 text-orange-800 border-orange-200'
      case 'confidential':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'internal':
        return 'bg-blue-100 text-blue-800 border-blue-200'
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const getRiskColor = (riskScore: number) => {
    if (riskScore >= 8) return 'bg-red-100 text-red-800 border-red-200'
    if (riskScore >= 6) return 'bg-orange-100 text-orange-800 border-orange-200'
    if (riskScore >= 4) return 'bg-yellow-100 text-yellow-800 border-yellow-200'
    return 'bg-green-100 text-green-800 border-green-200'
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
          <h1 className="text-3xl font-bold">Data Protection Center</h1>
          <p className="text-gray-600">Comprehensive data security and compliance management</p>
        </div>
        <div className="flex items-center gap-2">
          <Database className="h-5 w-5 text-blue-500" />
          <span className="text-sm font-medium text-blue-700">Data Protection: Active</span>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Protection Status</p>
                <p className="text-lg font-bold text-green-600">Active</p>
              </div>
              <Shield className="h-8 w-8 text-green-500" />
            </div>
            <div className="mt-2 text-xs text-gray-500">
              {Object.keys(classifications).length} classifications
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Encrypted Data</p>
                <p className="text-lg font-bold text-blue-600">2.8K</p>
              </div>
              <Lock className="h-8 w-8 text-blue-500" />
            </div>
            <div className="mt-2 text-xs text-gray-500">
              AES-256-GCM
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Access Events</p>
                <p className="text-lg font-bold text-purple-600">{auditLogs.length}</p>
              </div>
              <Activity className="h-8 w-8 text-purple-500" />
            </div>
            <div className="mt-2 text-xs text-gray-500">
              {auditLogs.filter(log => !log.success).length} failed
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Compliance</p>
                <p className="text-lg font-bold text-green-600">100%</p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-500" />
            </div>
            <div className="mt-2 text-xs text-gray-500">
              All standards met
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="classifications" className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="classifications">Classifications</TabsTrigger>
          <TabsTrigger value="encryption">Encryption</TabsTrigger>
          <TabsTrigger value="masking">Data Masking</TabsTrigger>
          <TabsTrigger value="audit">Audit Logs</TabsTrigger>
          <TabsTrigger value="compliance">Compliance</TabsTrigger>
        </TabsList>

        <TabsContent value="classifications" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Data Classifications ({Object.keys(classifications).length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {Object.entries(classifications).map(([name, config]) => (
                  <div key={name} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-medium">{name.replace(/_/g, ' ').toUpperCase()}</h3>
                      <div className="flex items-center gap-2">
                        <Badge className={`text-xs ${getLevelColor(config.level)}`} variant="outline">
                          {config.level.toUpperCase()}
                        </Badge>
                        <Badge className={`text-xs ${getSensitivityColor(config.sensitivity)}`} variant="outline">
                          Sensitivity: {config.sensitivity}/10
                        </Badge>
                      </div>
                    </div>
                    
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>Category:</span>
                        <span className="font-medium">{config.category}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Retention:</span>
                        <span className="font-medium">{Math.floor(config.retention / 365)} years</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Encryption:</span>
                        <div className="flex items-center gap-1">
                          {config.encryption ? (
                            <CheckCircle className="h-4 w-4 text-green-500" />
                          ) : (
                            <XCircle className="h-4 w-4 text-red-500" />
                          )}
                          <span>{config.encryption ? 'Required' : 'Optional'}</span>
                        </div>
                      </div>
                      <div className="flex justify-between">
                        <span>Audit Required:</span>
                        <div className="flex items-center gap-1">
                          {config.auditRequired ? (
                            <CheckCircle className="h-4 w-4 text-green-500" />
                          ) : (
                            <XCircle className="h-4 w-4 text-gray-400" />
                          )}
                          <span>{config.auditRequired ? 'Yes' : 'No'}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="mt-3">
                      <div className="text-xs text-gray-600 mb-1">Access Control:</div>
                      <div className="flex flex-wrap gap-1">
                        {config.accessControl.map((role) => (
                          <Badge key={role} variant="secondary" className="text-xs">
                            {role.replace(/_/g, ' ')}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="encryption" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lock className="h-5 w-5" />
                Data Encryption Testing
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">Test Data:</label>
                  <Input
                    placeholder="Enter sensitive data to encrypt..."
                    value={testData}
                    onChange={(e) => setTestData(e.target.value)}
                    className="mt-1"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Classification:</label>
                  <select 
                    value={testClassification}
                    onChange={(e) => setTestClassification(e.target.value)}
                    className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md"
                  >
                    {Object.keys(classifications).map(name => (
                      <option key={name} value={name}>{name}</option>
                    ))}
                  </select>
                </div>
              </div>
              
              <div className="flex gap-2">
                <Button onClick={testEncryption} disabled={!testData.trim()}>
                  <Lock className="h-4 w-4 mr-2" />
                  Test Encryption
                </Button>
                <Input
                  placeholder="User ID"
                  value={testUserId}
                  onChange={(e) => setTestUserId(e.target.value)}
                  className="w-48"
                />
              </div>

              {encryptedResult && (
                <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                  <h4 className="font-medium mb-2">Encryption Result:</h4>
                  <div className="space-y-2 text-sm">
                    <div>
                      <strong>Algorithm:</strong> {encryptedResult.encrypted.algorithm}
                    </div>
                    <div>
                      <strong>Classification:</strong> {encryptedResult.encrypted.classification}
                    </div>
                    <div>
                      <strong>Encrypted Data:</strong>
                      <code className="block mt-1 p-2 bg-white rounded text-xs break-all">
                        {encryptedResult.encrypted.data.substring(0, 100)}...
                      </code>
                    </div>
                    <div>
                      <strong>Salt:</strong> {encryptedResult.encrypted.salt.substring(0, 20)}...
                    </div>
                    <div>
                      <strong>Timestamp:</strong> {encryptedResult.timestamp}
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="masking" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <EyeOff className="h-5 w-5" />
                Data Masking Testing
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-2">
                <Button onClick={testDataMasking}>
                  <EyeOff className="h-4 w-4 mr-2" />
                  Test Data Masking
                </Button>
                <div className="text-sm text-gray-600 flex items-center">
                  Testing with sample vulnerability data for user: {testUserId}
                </div>
              </div>

              {maskedResult && (
                <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                  <h4 className="font-medium mb-2">Data Masking Result:</h4>
                  <div className="space-y-2 text-sm">
                    <div>
                      <strong>Classification:</strong> {maskedResult.classification}
                    </div>
                    <div>
                      <strong>Masked Data:</strong>
                      <pre className="mt-1 p-2 bg-white rounded text-xs overflow-auto">
                        {JSON.stringify(maskedResult.masked, null, 2)}
                      </pre>
                    </div>
                    <div className="text-xs text-gray-500">
                      Note: Sensitive fields like exploitCode and internalNotes are masked based on user permissions
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="audit" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5" />
                Audit Logs ({auditLogs.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {auditLogs.slice(0, 10).map((log) => (
                  <div key={log.id} className="border rounded-lg p-3">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <UserCheck className="h-4 w-4 text-blue-500" />
                        <span className="font-medium">{log.action}</span>
                        <Badge variant="outline" className="text-xs">
                          {log.dataClassification}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-2">
                        {log.success ? (
                          <CheckCircle className="h-4 w-4 text-green-500" />
                        ) : (
                          <XCircle className="h-4 w-4 text-red-500" />
                        )}
                        {log.riskScore && (
                          <Badge className={`text-xs ${getRiskColor(log.riskScore)}`} variant="outline">
                            Risk: {log.riskScore}/10
                          </Badge>
                        )}
                        <span className="text-xs text-gray-500">{formatTimeAgo(log.timestamp)}</span>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-2 text-xs text-gray-600">
                      <div><strong>User:</strong> {log.userId}</div>
                      <div><strong>IP:</strong> {log.ipAddress}</div>
                      <div><strong>Resource:</strong> {log.resource}</div>
                      <div><strong>Status:</strong> {log.success ? 'Success' : 'Failed'}</div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="compliance" className="mt-6">
          {complianceReport && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5" />
                    Compliance Status
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4">
                    {Object.entries(complianceReport.complianceStatus).map(([standard, status]) => (
                      <div key={standard} className="text-center p-3 border rounded-lg">
                        {status ? (
                          <CheckCircle className="h-6 w-6 text-green-500 mx-auto mb-1" />
                        ) : (
                          <XCircle className="h-6 w-6 text-red-500 mx-auto mb-1" />
                        )}
                        <h3 className="font-medium">{standard.toUpperCase()}</h3>
                        <Badge 
                          variant="outline" 
                          className={status ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}
                        >
                          {status ? 'Compliant' : 'Non-Compliant'}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Access Statistics</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <span>Total Accesses:</span>
                      <span className="font-medium">{complianceReport.totalAccesses}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Successful:</span>
                      <span className="font-medium text-green-600">{complianceReport.successfulAccesses}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Failed:</span>
                      <span className="font-medium text-red-600">{complianceReport.failedAccesses}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>High Risk:</span>
                      <span className="font-medium text-orange-600">{complianceReport.highRiskAccesses}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Period:</span>
                      <span className="text-sm text-gray-600">
                        {new Date(complianceReport.period.start).toLocaleDateString()} - {new Date(complianceReport.period.end).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}