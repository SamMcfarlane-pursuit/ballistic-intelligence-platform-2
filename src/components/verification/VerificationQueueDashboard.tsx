'use client'

import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { SecureActionButton } from '@/components/ui/secure-button'
import { 
  AlertTriangle,
  CheckCircle,
  Clock,
  ExternalLink,
  Filter,
  Search,
  Users,
  Building,
  DollarSign,
  Shield,
  Cpu,
  Eye,
  FileText,
  Download,
  RefreshCw
} from 'lucide-react'

interface VerificationTask {
  id: string
  type: 'funding' | 'company' | 'people' | 'threat' | 'tech'
  priority: 'high' | 'medium' | 'low'
  status: 'pending' | 'in_review' | 'verified' | 'rejected'
  title: string
  description: string
  conflictDetails: string
  sources: Array<{
    name: string
    url: string
    data: any
  }>
  assignedTo?: string
  createdAt: string
  dueDate: string
  companyName?: string
  flaggedBy: 'data_verification_agent' | 'company_profiling_agent' | 'funding_agent' | 'threat_agent'
}

interface VerificationStats {
  totalTasks: number
  pendingTasks: number
  inReviewTasks: number
  completedToday: number
  highPriorityTasks: number
  averageResolutionTime: number
  tasksByType: {
    funding: number
    company: number
    people: number
    threat: number
    tech: number
  }
}

export default function VerificationQueueDashboard() {
  const [tasks, setTasks] = useState<VerificationTask[]>([])
  const [stats, setStats] = useState<VerificationStats | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [selectedFilter, setSelectedFilter] = useState<string>('all')
  const [selectedPriority, setSelectedPriority] = useState<string>('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (mounted) {
      loadVerificationQueue()
    }
  }, [mounted, selectedFilter, selectedPriority])

  const loadVerificationQueue = async () => {
    setIsLoading(true)
    try {
      const response = await fetch(`/api/verification-queue?filter=${selectedFilter}&priority=${selectedPriority}`)
      const data = await response.json()
      
      if (data.success) {
        setTasks(data.tasks)
        setStats(data.stats)
      } else {
        setTasks(getMockTasks())
        setStats(getMockStats())
      }
    } catch (error) {
      console.error('Failed to load verification queue:', error)
      setTasks(getMockTasks())
      setStats(getMockStats())
    } finally {
      setIsLoading(false)
    }
  }

  const updateTaskStatus = async (taskId: string, status: string, notes?: string) => {
    try {
      const response = await fetch('/api/verification-queue/update', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ taskId, status, notes })
      })
      
      if (response.ok) {
        loadVerificationQueue()
      }
    } catch (error) {
      console.error('Failed to update task:', error)
    }
  }

  const exportQueue = async (format: 'csv' | 'excel') => {
    try {
      const response = await fetch('/api/verification-queue/export', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ format, filter: selectedFilter, priority: selectedPriority })
      })
      
      if (response.ok) {
        const blob = await response.blob()
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `verification-queue.${format}`
        a.click()
        window.URL.revokeObjectURL(url)
      }
    } catch (error) {
      console.error('Export failed:', error)
    }
  }

  const filteredTasks = tasks.filter(task => {
    const matchesSearch = task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         task.companyName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         task.description.toLowerCase().includes(searchQuery.toLowerCase())
    
    const matchesFilter = selectedFilter === 'all' || task.type === selectedFilter
    const matchesPriority = selectedPriority === 'all' || task.priority === selectedPriority
    
    return matchesSearch && matchesFilter && matchesPriority
  })

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'funding': return <DollarSign className="h-4 w-4" />
      case 'company': return <Building className="h-4 w-4" />
      case 'people': return <Users className="h-4 w-4" />
      case 'threat': return <Shield className="h-4 w-4" />
      case 'tech': return <Cpu className="h-4 w-4" />
      default: return <FileText className="h-4 w-4" />
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'destructive'
      case 'medium': return 'default'
      case 'low': return 'secondary'
      default: return 'secondary'
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'destructive'
      case 'in_review': return 'default'
      case 'verified': return 'secondary'
      case 'rejected': return 'outline'
      default: return 'secondary'
    }
  }

  if (!mounted || isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <AlertTriangle className="h-12 w-12 mx-auto mb-4 animate-pulse text-orange-500" />
          <p className="text-lg font-medium">Loading Verification Queue...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
            Data Verification Queue
          </h1>
          <p className="text-lg text-muted-foreground mt-2">
            Administrative view for ensuring data quality and resolving conflicts
          </p>
        </div>
        <div className="flex gap-3">
          <SecureActionButton onClick={() => loadVerificationQueue()} debounceMs={1000}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </SecureActionButton>
          <SecureActionButton onClick={() => exportQueue('excel')} debounceMs={1000}>
            <Download className="h-4 w-4 mr-2" />
            Export Excel
          </SecureActionButton>
        </div>
      </div>

      {/* Stats Overview */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="bg-gradient-to-r from-red-50 to-orange-50 border-red-200">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-red-600">Pending Tasks</p>
                  <p className="text-3xl font-bold text-red-900">{stats.pendingTasks}</p>
                  <p className="text-sm text-red-600 mt-1">Require immediate attention</p>
                </div>
                <AlertTriangle className="h-8 w-8 text-red-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-yellow-50 to-orange-50 border-yellow-200">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-yellow-600">In Review</p>
                  <p className="text-3xl font-bold text-yellow-900">{stats.inReviewTasks}</p>
                  <p className="text-sm text-yellow-600 mt-1">Being processed</p>
                </div>
                <Clock className="h-8 w-8 text-yellow-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-green-50 to-emerald-50 border-green-200">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-green-600">Completed Today</p>
                  <p className="text-3xl font-bold text-green-900">{stats.completedToday}</p>
                  <p className="text-sm text-green-600 mt-1">Tasks resolved</p>
                </div>
                <CheckCircle className="h-8 w-8 text-green-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-purple-50 to-violet-50 border-purple-200">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-purple-600">Avg Resolution</p>
                  <p className="text-3xl font-bold text-purple-900">{stats.averageResolutionTime}h</p>
                  <p className="text-sm text-purple-600 mt-1">Time to resolve</p>
                </div>
                <Clock className="h-8 w-8 text-purple-500" />
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Filters and Search */}
      <Card>
        <CardHeader>
          <CardTitle>Filter & Search</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-4">
            <div className="flex-1 min-w-64">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Search tasks, companies, or descriptions..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border rounded-md"
                />
              </div>
            </div>
            <select 
              value={selectedFilter}
              onChange={(e) => setSelectedFilter(e.target.value)}
              className="px-3 py-2 border rounded-md"
            >
              <option value="all">All Types</option>
              <option value="funding">Funding</option>
              <option value="company">Company</option>
              <option value="people">People</option>
              <option value="threat">Threats</option>
              <option value="tech">Technology</option>
            </select>
            <select 
              value={selectedPriority}
              onChange={(e) => setSelectedPriority(e.target.value)}
              className="px-3 py-2 border rounded-md"
            >
              <option value="all">All Priorities</option>
              <option value="high">High Priority</option>
              <option value="medium">Medium Priority</option>
              <option value="low">Low Priority</option>
            </select>
          </div>
        </CardContent>
      </Card>

      {/* Tasks List */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold">Verification Tasks ({filteredTasks.length})</h2>
          <Badge variant="outline" className="text-lg px-3 py-1">
            {stats?.highPriorityTasks} high priority
          </Badge>
        </div>

        {filteredTasks.map((task) => (
          <Card key={task.id} className="border-l-4 border-l-orange-500">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  {getTypeIcon(task.type)}
                  <div>
                    <CardTitle className="text-lg">{task.title}</CardTitle>
                    <CardDescription className="mt-1">
                      {task.companyName && (
                        <span className="font-medium text-blue-600">{task.companyName} • </span>
                      )}
                      Flagged by {task.flaggedBy.replace('_', ' ')} • Due: {new Date(task.dueDate).toLocaleDateString()}
                    </CardDescription>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant={getPriorityColor(task.priority) as any}>
                    {task.priority.toUpperCase()}
                  </Badge>
                  <Badge variant={getStatusColor(task.status) as any}>
                    {task.status.replace('_', ' ').toUpperCase()}
                  </Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium mb-2">Description:</h4>
                  <p className="text-sm text-muted-foreground">{task.description}</p>
                </div>

                <div>
                  <h4 className="font-medium mb-2">Conflict Details:</h4>
                  <p className="text-sm bg-yellow-50 p-3 rounded-md border border-yellow-200">
                    {task.conflictDetails}
                  </p>
                </div>

                <div>
                  <h4 className="font-medium mb-2">Sources ({task.sources.length}):</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {task.sources.map((source, index) => (
                      <div key={index} className="border rounded-md p-3 bg-gray-50">
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-medium text-sm">{source.name}</span>
                          <a 
                            href={source.url} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-blue-500 hover:text-blue-700"
                          >
                            <ExternalLink className="h-4 w-4" />
                          </a>
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {JSON.stringify(source.data, null, 2).substring(0, 100)}...
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex gap-2 pt-4 border-t">
                  <SecureActionButton 
                    onClick={() => updateTaskStatus(task.id, 'in_review')}
                    debounceMs={1000}
                    className="bg-blue-500 hover:bg-blue-600"
                  >
                    <Eye className="h-4 w-4 mr-2" />
                    Start Review
                  </SecureActionButton>
                  <SecureActionButton 
                    onClick={() => updateTaskStatus(task.id, 'verified')}
                    debounceMs={1000}
                    className="bg-green-500 hover:bg-green-600"
                  >
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Verify
                  </SecureActionButton>
                  <SecureActionButton 
                    onClick={() => updateTaskStatus(task.id, 'rejected')}
                    debounceMs={1000}
                    className="bg-red-500 hover:bg-red-600"
                  >
                    <AlertTriangle className="h-4 w-4 mr-2" />
                    Reject
                  </SecureActionButton>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}

        {filteredTasks.length === 0 && (
          <Card>
            <CardContent className="text-center py-12">
              <CheckCircle className="h-12 w-12 mx-auto mb-4 text-green-500" />
              <h3 className="text-lg font-medium mb-2">No Tasks Found</h3>
              <p className="text-muted-foreground">
                {searchQuery || selectedFilter !== 'all' || selectedPriority !== 'all' 
                  ? 'No tasks match your current filters.' 
                  : 'All verification tasks have been completed!'}
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}

// Mock data functions
function getMockTasks(): VerificationTask[] {
  return [
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
    }
  ]
}

function getMockStats(): VerificationStats {
  return {
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
}