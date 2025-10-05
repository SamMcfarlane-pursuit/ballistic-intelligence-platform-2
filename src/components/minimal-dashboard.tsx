"use client"

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  DollarSign, 
  Building2, 
  AlertTriangle, 
  TrendingUp,
  Brain,
  Search,
  Bell,
  Activity,
  Map,
  Settings,
  Shield,
  Zap,
  LogOut,
  BarChart3,
  User,
  Users,
  Lightbulb,
  Globe,
  Briefcase,
  Database,
  Radar,
  ChevronLeft,
  ChevronRight
} from 'lucide-react'
import { useDashboardData } from '@/hooks/use-dashboard-data'
import { useAuth } from '@/components/auth-provider'
import AIConferenceAnalyst from '@/components/ai-conference-analyst'
import AICompanyResearcher from '@/components/ai-company-researcher'
import AIInvestmentAdvisor from '@/components/ai-investment-advisor'
import AIVulnerabilityIntelligence from '@/components/ai-vulnerability-intelligence'
import ConciseAIAnalyst from '@/components/concise-ai-analyst'
import ResearchDashboard from '@/components/research-dashboard'
import FundingCharts from '@/components/funding-charts'
import VulnerabilitiesList from '@/components/vulnerabilities-list'
import DealMap from '@/components/deal-map'
import ConvergenceInsights from '@/components/convergence-insights'
import PersonalizedExperience from '@/components/personalized-experience'
import CollaborationHub from '@/components/collaboration-hub'
import ActionableInsightsEngine from '@/components/actionable-insights-engine'
import CybersecurityFundingLandscape from '@/components/cybersecurity-funding-landscape'
import VentureCapitalList from '@/components/venture-capital-list'
import BallisticFundingDatabase from '@/components/ballistic-funding-database'
import DealFlowSourcing from '@/components/deal-flow-sourcing'

export default function MinimalDashboard() {
  const { stats, fundingOverTime, fundingByStage, vulnerabilities, loading, error } = useDashboardData()
  const { user, logout, hasPermission } = useAuth()
  const [activeTab, setActiveTab] = useState<'overview' | 'deal-map' | 'funding-landscape' | 'venture-capital' | 'ballistic-database' | 'deal-flow' | 'convergence' | 'personalized' | 'collaboration' | 'insights-engine' | 'ai-analyst' | 'ai-researcher' | 'ai-advisor' | 'ai-vulnerability' | 'concise-ai' | 'research-dashboard'>('overview')
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(false)

  // Streamlined navigation with essential tools only
  const navItems = [
    { id: 'overview', label: 'Dashboard', icon: Activity },
    { id: 'concise-ai', label: 'AI Analysis', icon: Brain, permission: 'ai_analysis' },
    { id: 'funding-landscape', label: 'Funding Trends', icon: TrendingUp },
    { id: 'deal-map', label: 'Deal Map', icon: Map },
    { id: 'ai-vulnerability', label: 'Threat Intel', icon: Zap, permission: 'ai_analysis' },
    { id: 'venture-capital', label: 'VC Directory', icon: Briefcase }
  ].filter(item => !item.permission || hasPermission(item.permission))

  // Essential business metrics only
  const metrics = [
    {
      title: "Total Capital",
      value: `$${stats.totalInvestment}M`,
      subtitle: "Under management",
      icon: DollarSign,
      color: "text-blue-600",
      bgColor: "bg-blue-50"
    },
    {
      title: "Portfolio",
      value: stats.companiesTracked.toString(),
      subtitle: "Active companies",
      icon: Building2,
      color: "text-green-600",
      bgColor: "bg-green-50"
    },
    {
      title: "This Quarter",
      value: "+12%",
      subtitle: "ROI growth",
      icon: TrendingUp,
      color: "text-emerald-600",
      bgColor: "bg-emerald-50"
    },
    {
      title: "Threats",
      value: stats.newVulnerabilities.toString(),
      subtitle: "Active monitoring",
      icon: AlertTriangle,
      color: "text-red-600",
      bgColor: "bg-red-50"
    }
  ]

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-lg font-medium">Loading Ballistic Ventures Intelligence...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center max-w-md">
          <Shield className="h-16 w-16 text-red-500 mx-auto mb-4" />
          <p className="text-lg font-medium text-red-600 mb-4">{error}</p>
          <Button onClick={() => window.location.reload()} size="lg">
            Retry Connection
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="flex h-screen">
        {/* Enhanced Sidebar */}
        <div className={`${isSidebarExpanded ? 'w-64' : 'w-16'} bg-white border-r border-border flex flex-col py-4 transition-all duration-300`}>
          <div className="flex items-center justify-between px-4 mb-6">
            {isSidebarExpanded && (
              <div className="flex items-center gap-2">
                <Shield className="h-8 w-8 text-primary" />
                <span className="font-bold text-lg">Ballistic</span>
              </div>
            )}
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => setIsSidebarExpanded(!isSidebarExpanded)}
              className="ml-auto"
            >
              {isSidebarExpanded ? <ChevronLeft className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
            </Button>
          </div>
          
          <nav className="flex-1 px-2 space-y-1">
            {navItems.map((item) => (
              <Button
                key={item.id}
                variant="ghost"
                className={`w-full justify-start h-9 px-3 rounded-md transition-colors ${
                  activeTab === item.id 
                    ? 'bg-primary/10 text-primary hover:bg-primary/15' 
                    : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                }`}
                onClick={() => setActiveTab(item.id as any)}
                title={isSidebarExpanded ? '' : item.label}
              >
                <item.icon className="h-4 w-4 mr-3 flex-shrink-0" />
                {isSidebarExpanded && (
                  <span className="text-sm font-medium">{item.label}</span>
                )}
              </Button>
            ))}
          </nav>
          
          <div className="px-2 space-y-2">
            {isSidebarExpanded && user && (
              <div className="p-3 border border-border rounded-lg bg-muted/30">
                <p className="text-sm font-medium truncate">{user.name}</p>
                <p className="text-xs text-muted-foreground truncate">{user.email}</p>
                <Badge variant="secondary" className="text-xs mt-1 w-full justify-center">
                  {user.role}
                </Badge>
              </div>
            )}
            <Button variant="ghost" size="sm" className="w-full justify-start h-10 px-3 rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground">
              <Settings className="h-4 w-4 mr-3" />
              {isSidebarExpanded && <span className="text-sm">Settings</span>}
            </Button>
            {user && (
              <Button 
                variant="ghost" 
                size="sm" 
                className="w-full justify-start h-10 px-3 rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground"
                onClick={logout}
              >
                <LogOut className="h-4 w-4 mr-3" />
                {isSidebarExpanded && <span className="text-sm">Logout</span>}
              </Button>
            )}
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 overflow-auto bg-background">
          <div className="p-6 space-y-6 max-w-7xl mx-auto">
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <h1 className="text-3xl font-bold tracking-tight">
                  {navItems.find(item => item.id === activeTab)?.label}
                </h1>
                <p className="text-muted-foreground mt-1">
                  {activeTab === 'overview' && 'Cybersecurity investment intelligence platform'}
                  {activeTab === 'deal-map' && 'Investment deal flow visualization'}
                  {activeTab === 'funding-landscape' && 'Cybersecurity funding landscape mapping'}
                  {activeTab === 'concise-ai' && 'AI-powered company analysis'}
                  {activeTab === 'convergence' && 'Business-user-technical convergence analysis'}
                  {activeTab === 'personalized' && 'AI-powered personalized experience'}
                  {activeTab === 'collaboration' && 'Team intelligence sharing hub'}
                  {activeTab === 'insights-engine' && 'Actionable insights from complex data'}
                  {activeTab === 'research-dashboard' && 'Comprehensive technical and financial research trends'}
                  {activeTab === 'ai-analyst' && 'AI-powered conference analysis'}
                  {activeTab === 'ai-researcher' && 'Automated company research'}
                  {activeTab === 'ai-advisor' && 'AI investment recommendations'}
                  {activeTab === 'ai-vulnerability' && 'AI vulnerability intelligence'}
                  {activeTab === 'venture-capital' && 'Venture capital directory with real-time funding analysis'}
                  {activeTab === 'ballistic-database' && 'Ballistic ventures funding database for cybersecurity startups'}
                  {activeTab === 'deal-flow' && 'Free cybersecurity startup discovery platforms and deal flow tracking'}
                </p>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" className="h-9 px-3">
                  <Search className="h-4 w-4 mr-2" />
                  Search
                </Button>
                <Button variant="outline" size="sm" className="h-9 px-3 relative">
                  <Bell className="h-4 w-4" />
                  <span className="absolute -top-1 -right-1 h-3 w-3 bg-destructive rounded-full"></span>
                </Button>
              </div>
            </div>

            {/* Content based on active tab */}
            {activeTab === 'overview' && (
              <div className="space-y-6">
                {/* Key Business Metrics */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                  {metrics.map((metric, index) => (
                    <Card key={index} className="border border-border/40 shadow-sm">
                      <CardContent className="p-4">
                        <div className="flex items-center gap-3">
                          <div className={`p-2 rounded-lg ${metric.bgColor}`}>
                            <metric.icon className={`h-5 w-5 ${metric.color}`} />
                          </div>
                          <div className="flex-1">
                            <p className="text-xs text-muted-foreground">{metric.title}</p>
                            <p className={`text-lg font-bold ${metric.color}`}>
                              {metric.value}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {metric.subtitle}
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                {/* Essential Tools */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <Card className="border border-border/40 shadow-sm">
                    <CardHeader className="pb-3">
                      <CardTitle className="flex items-center gap-2 text-base font-semibold">
                        <Brain className="h-4 w-4 text-blue-600" />
                        AI Company Analysis
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground mb-4">
                        Analyze any cybersecurity company with AI-powered insights
                      </p>
                      <Button 
                        onClick={() => setActiveTab('concise-ai')}
                        className="w-full"
                        size="sm"
                      >
                        Start Analysis
                      </Button>
                    </CardContent>
                  </Card>

                  <Card className="border border-border/40 shadow-sm">
                    <CardHeader className="pb-3">
                      <CardTitle className="flex items-center gap-2 text-base font-semibold">
                        <TrendingUp className="h-4 w-4 text-emerald-600" />
                        Market Intelligence
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-3 gap-3 text-center mb-4">
                        <div className="bg-blue-50 p-2 rounded">
                          <div className="text-sm font-bold text-blue-600">87%</div>
                          <div className="text-xs text-muted-foreground">Business</div>
                        </div>
                        <div className="bg-green-50 p-2 rounded">
                          <div className="text-sm font-bold text-green-600">92%</div>
                          <div className="text-xs text-muted-foreground">User</div>
                        </div>
                        <div className="bg-purple-50 p-2 rounded">
                          <div className="text-sm font-bold text-purple-600">89%</div>
                          <div className="text-xs text-muted-foreground">Technical</div>
                        </div>
                      </div>
                      <Button 
                        onClick={() => setActiveTab('funding-landscape')}
                        variant="outline"
                        className="w-full"
                        size="sm"
                      >
                        View Trends
                      </Button>
                    </CardContent>
                  </Card>
                </div>

                {/* Business Insights */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Funding Trends */}
                  <Card className="border border-border/40 shadow-sm">
                    <CardHeader className="pb-3">
                      <CardTitle className="flex items-center gap-2 text-base font-semibold">
                        <TrendingUp className="h-4 w-4 text-emerald-600" />
                        Funding Trends
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="h-64">
                        <FundingCharts fundingOverTime={fundingOverTime} fundingByStage={fundingByStage} />
                      </div>
                    </CardContent>
                  </Card>

                  {/* Recent Activity */}
                  <Card className="border border-border/40 shadow-sm">
                    <CardHeader className="pb-3">
                      <CardTitle className="flex items-center gap-2 text-base font-semibold">
                        <Activity className="h-4 w-4 text-blue-600" />
                        Recent Activity
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between p-2 bg-muted/30 rounded">
                          <div>
                            <p className="text-sm font-medium">New investment</p>
                            <p className="text-xs text-muted-foreground">CloudSecure Series A</p>
                          </div>
                          <span className="text-xs text-green-600">+$15M</span>
                        </div>
                        <div className="flex items-center justify-between p-2 bg-muted/30 rounded">
                          <div>
                            <p className="text-sm font-medium">Threat detected</p>
                            <p className="text-xs text-muted-foreground">API vulnerability</p>
                          </div>
                          <span className="text-xs text-red-600">Critical</span>
                        </div>
                        <div className="flex items-center justify-between p-2 bg-muted/30 rounded">
                          <div>
                            <p className="text-sm font-medium">Conference alert</p>
                            <p className="text-xs text-muted-foreground">RSA Conference starts</p>
                          </div>
                          <span className="text-xs text-blue-600">2 days</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Security Alerts */}
                <VulnerabilitiesList vulnerabilities={vulnerabilities} />
              </div>
            )}

            {activeTab === 'deal-map' && <DealMap />}
            {activeTab === 'funding-landscape' && <CybersecurityFundingLandscape />}
            {activeTab === 'venture-capital' && <VentureCapitalList />}
            {activeTab === 'ballistic-database' && <BallisticFundingDatabase />}
            {activeTab === 'deal-flow' && <DealFlowSourcing />}
            {activeTab === 'convergence' && <ConvergenceInsights />}
            {activeTab === 'personalized' && <PersonalizedExperience />}
            {activeTab === 'collaboration' && <CollaborationHub />}
            {activeTab === 'insights-engine' && <ActionableInsightsEngine />}

            {activeTab === 'research-dashboard' && <ResearchDashboard />}
            {activeTab === 'concise-ai' && <ConciseAIAnalyst />}
            {activeTab === 'ai-analyst' && <AIConferenceAnalyst />}
            {activeTab === 'ai-researcher' && <AICompanyResearcher />}
            {activeTab === 'ai-advisor' && <AIInvestmentAdvisor />}
            {activeTab === 'ai-vulnerability' && <AIVulnerabilityIntelligence />}
          </div>
        </div>
      </div>
    </div>
  )
}