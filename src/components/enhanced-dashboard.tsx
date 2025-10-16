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
  ChevronRight,
  Sparkles,
  Target,
  Rocket,
  Award,
  Eye,
  Clock,
  Menu
} from 'lucide-react'
import { useDashboardData } from '@/hooks/use-dashboard-data'
import { useAuth } from '@/components/auth-provider'
import { EnhancedLoadingScreen } from '@/components/enhanced-loading-states'
import { TransitionWrapper, StaggeredContainer, StaggeredItem, PageTransition, CounterAnimation } from '@/components/transition-wrapper'
import { 
  ProfessionalHeroSection, 
  ProfessionalFeatureCard, 
  ProfessionalActivityCard, 
  ProfessionalInsightCard,
  ProfessionalStatsGrid,
  ProfessionalCallToAction
} from '@/components/professional-content'
import { 
  EnhancedMetricsCard, 
  MetricComparison, 
  PerformanceGauge
} from '@/components/enhanced-metrics'
import { 
  ResponsiveContainer,
  ResponsiveMainContent,
  ResponsiveSidebar,
  ResponsiveNavigation,
  ResponsiveSidebarToggle,
  ResponsiveSearchBar,
  ResponsiveBadge,
  useResponsive
} from '@/components/responsive-utils'
import { 
  NotificationCenter, 
  RealTimeMetrics, 
  ConnectionStatus, 
  ActivityFeed 
} from '@/components/real-time-updates'
import { 
  AccessibilityPanel, 
  KeyboardNavigationHelper, 
  SkipToContent, 
  Announcer,
  FocusTrap
} from '@/components/accessibility-utils'
import ConciseAIAnalyst from '@/components/concise-ai-analyst'
import ResearchDashboard from '@/components/research-dashboard'
import FundingCharts from '@/components/funding-charts'
import EnhancedDataVisualization from '@/components/enhanced-data-visualization'
import EnhancedKPIDashboard from '@/components/enhanced-kpi-dashboard'
import VulnerabilitiesList from '@/components/vulnerabilities-list'
import DealMap from '@/components/deal-map'
import ConvergenceInsights from '@/components/convergence-insights'
import PersonalizedExperience from '@/components/personalized-experience'
import CollaborationHub from '@/components/collaboration-hub'
import DealFlowSourcing from '@/components/deal-flow-sourcing'

export default function EnhancedDashboard() {
  const { stats, fundingOverTime, fundingByStage, vulnerabilities, loading, error } = useDashboardData()
  const { user, logout, hasPermission } = useAuth()
  const { isMobile, isTablet, isDesktop } = useResponsive()
  const [activeTab, setActiveTab] = useState<'overview' | 'deal-map' | 'funding-landscape' | 'venture-capital' | 'ballistic-database' | 'deal-flow' | 'concise-ai' | 'research-dashboard'>('overview')
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [currentTime, setCurrentTime] = useState('')

  // Update time every minute
  useEffect(() => {
    const updateTime = () => {
      const now = new Date()
      setCurrentTime(now.toLocaleTimeString('en-US', { 
        hour: '2-digit', 
        minute: '2-digit',
        hour12: true 
      }))
    }
    
    updateTime()
    const interval = setInterval(updateTime, 60000)
    return () => clearInterval(interval)
  }, [])

  // Professional navigation with enhanced descriptions
  const navItems = [
    { 
      id: 'overview', 
      label: 'Intelligence Hub', 
      icon: Activity,
      description: 'Strategic overview and key metrics'
    },
    { 
      id: 'concise-ai', 
      label: 'AI Analysis', 
      icon: Brain, 
      permission: 'ai_analysis',
      description: 'Advanced company intelligence'
    },
    { 
      id: 'funding-landscape', 
      label: 'Funding Trends', 
      icon: TrendingUp,
      description: 'Market dynamics and investments'
    },
    { 
      id: 'deal-map', 
      label: 'Deal Flow', 
      icon: Map,
      description: 'Investment opportunities pipeline'
    },
  ].filter(item => !item.permission || hasPermission(item.permission))

  // Enhanced business metrics with sophisticated data structure
  const metrics = [
    {
      id: 'assets-under-management',
      title: "Assets Under Management",
      value: stats.totalInvestment,
      target: 50,
      change: 2.4,
      changeType: 'positive' as const,
      unit: 'M',
      icon: DollarSign,
      color: "text-slate-700",
      bgColor: "bg-slate-100",
      description: "Total capital deployed across portfolio companies",
      category: 'financial' as const,
      trend: 'up' as const,
      historical: [
        { date: 'Jan', value: 38 },
        { date: 'Feb', value: 39 },
        { date: 'Mar', value: 40 },
        { date: 'Apr', value: 41 },
        { date: 'May', value: 42 },
        { date: 'Jun', value: 43 }
      ]
    },
    {
      id: 'portfolio-companies',
      title: "Portfolio Companies",
      value: stats.companiesTracked,
      target: 10,
      change: 16.7,
      changeType: 'positive' as const,
      unit: '',
      icon: Building2,
      color: "text-blue-700",
      bgColor: "bg-blue-100",
      description: "Active investments in cybersecurity sector",
      category: 'growth' as const,
      trend: 'up' as const,
      historical: [
        { date: 'Jan', value: 4 },
        { date: 'Feb', value: 5 },
        { date: 'Mar', value: 5 },
        { date: 'Apr', value: 5 },
        { date: 'May', value: 6 },
        { date: 'Jun', value: 6 }
      ]
    },
    {
      id: 'quarterly-performance',
      title: "Quarterly Performance",
      value: 12,
      target: 15,
      change: 12,
      changeType: 'positive' as const,
      unit: '%',
      icon: TrendingUp,
      color: "text-emerald-700",
      bgColor: "bg-emerald-100",
      description: "Year-over-year return on investment growth",
      category: 'financial' as const,
      trend: 'up' as const,
      historical: [
        { date: 'Jan', value: 8 },
        { date: 'Feb', value: 9 },
        { date: 'Mar', value: 10 },
        { date: 'Apr', value: 11 },
        { date: 'May', value: 11 },
        { date: 'Jun', value: 12 }
      ]
    },
    {
      id: 'active-threats',
      title: "Active Threats",
      value: stats.newVulnerabilities,
      change: -15,
      changeType: 'positive' as const,
      unit: '',
      icon: AlertTriangle,
      color: "text-red-700",
      bgColor: "bg-red-100",
      description: "Security threats currently under active monitoring",
      category: 'security' as const,
      trend: 'down' as const,
      historical: [
        { date: 'Jan', value: 8 },
        { date: 'Feb', value: 7 },
        { date: 'Mar', value: 6 },
        { date: 'Apr', value: 5 },
        { date: 'May', value: 4 },
        { date: 'Jun', value: 3 }
      ]
    }
  ]

  // Additional sophisticated metrics for comparison
  const comparisonMetrics = [
    {
      id: 'deal-flow',
      title: "Deal Flow",
      value: 24,
      target: 30,
      change: 8.3,
      changeType: 'positive' as const,
      unit: '',
      icon: Target,
      color: "text-purple-700",
      bgColor: "bg-purple-100",
      description: "New investment opportunities this quarter",
      category: 'operational' as const,
      trend: 'up' as const,
      historical: [
        { date: 'Jan', value: 18 },
        { date: 'Feb', value: 20 },
        { date: 'Mar', value: 22 },
        { date: 'Apr', value: 23 },
        { date: 'May', value: 24 },
        { date: 'Jun', value: 24 }
      ]
    },
    {
      id: 'team-size',
      title: "Team Size",
      value: 18,
      target: 20,
      change: 5.9,
      changeType: 'positive' as const,
      unit: '',
      icon: Users,
      color: "text-indigo-700",
      bgColor: "bg-indigo-100",
      description: "Investment professionals and analysts",
      category: 'operational' as const,
      trend: 'up' as const,
      historical: [
        { date: 'Jan', value: 15 },
        { date: 'Feb', value: 16 },
        { date: 'Mar', value: 17 },
        { date: 'Apr', value: 17 },
        { date: 'May', value: 18 },
        { date: 'Jun', value: 18 }
      ]
    },
    {
      id: 'ai-accuracy',
      title: "AI Accuracy",
      value: 94,
      target: 95,
      change: 2.2,
      changeType: 'positive' as const,
      unit: '%',
      icon: Brain,
      color: "text-pink-700",
      bgColor: "bg-pink-100",
      description: "AI analysis prediction accuracy",
      category: 'operational' as const,
      trend: 'up' as const,
      historical: [
        { date: 'Jan', value: 89 },
        { date: 'Feb', value: 90 },
        { date: 'Mar', value: 91 },
        { date: 'Apr', value: 92 },
        { date: 'May', value: 93 },
        { date: 'Jun', value: 94 }
      ]
    }
  ]

  // Combine all metrics for the enhanced KPI dashboard
  const allMetrics = [...metrics, ...comparisonMetrics]

  if (loading) {
    return <EnhancedLoadingScreen />
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
        <div className="text-center max-w-md">
          <div className="bg-red-100 p-4 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6">
            <Shield className="h-10 w-10 text-red-600" />
          </div>
          <h2 className="text-xl font-semibold text-slate-800 mb-4">Connection Interrupted</h2>
          <p className="text-slate-600 mb-6">{error}</p>
          <Button 
            onClick={() => window.location.reload()} 
            size="lg"
            className="bg-blue-600 hover:bg-blue-700 text-white px-8"
          >
            Reconnect to Platform
          </Button>
        </div>
      </div>
    )
  }

  return (
    <PageTransition>
      <SkipToContent />
      <Announcer />
      <AccessibilityPanel />
      <ResponsiveContainer>
        {/* Desktop Sidebar */}
        {!isMobile && (
          <div className={`${isSidebarExpanded ? 'w-72' : 'w-20'} bg-white border-r border-slate-200 flex flex-col py-4 transition-all duration-300 shadow-sm`}>
            <div className="flex items-center justify-between px-4 py-6 border-b border-slate-100">
              {isSidebarExpanded && (
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <Shield className="h-8 w-8 text-blue-600" />
                    <div className="absolute -top-1 -right-1 h-3 w-3 bg-emerald-500 rounded-full border-2 border-white"></div>
                  </div>
                  <div>
                    <h1 className="font-bold text-lg text-slate-900">Ballistic</h1>
                    <p className="text-xs text-slate-500">Intelligence Platform</p>
                  </div>
                </div>
              )}
              <ResponsiveSidebarToggle 
                isExpanded={isSidebarExpanded} 
                onToggle={() => setIsSidebarExpanded(!isSidebarExpanded)} 
              />
            </div>
            
            <nav className="flex-1 px-3 py-4 space-y-2" role="navigation" aria-label="Main navigation">
              {navItems.map((item, index) => (
                <Button
                  key={item.id}
                  variant="ghost"
                  className={`w-full justify-start h-12 px-4 rounded-xl transition-all duration-200 ${
                    activeTab === item.id 
                      ? 'bg-blue-50 text-blue-700 border border-blue-200 shadow-sm' 
                      : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                  }`}
                  onClick={() => setActiveTab(item.id as any)}
                  title={isSidebarExpanded ? '' : item.label}
                  aria-current={activeTab === item.id ? 'page' : undefined}
                  role="menuitem"
                  tabIndex={0}
                >
                  <div className="flex items-center gap-3 w-full">
                    <item.icon className={`h-5 w-5 flex-shrink-0 ${activeTab === item.id ? 'text-blue-600' : 'text-slate-500'}`} />
                    {isSidebarExpanded && (
                      <div className="flex-1 text-left">
                        <div className="font-medium text-sm">{item.label}</div>
                        <div className="text-xs text-slate-500 mt-0.5">{item.description}</div>
                      </div>
                    )}
                  </div>
                </Button>
              ))}
            </nav>
            
            <div className="px-3 py-4 border-t border-slate-100 space-y-3">
              {isSidebarExpanded && user && (
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                      <User className="h-5 w-5 text-blue-600" />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-sm text-slate-900 truncate">{user.name}</p>
                      <p className="text-xs text-slate-500 truncate">{user.email}</p>
                    </div>
                  </div>
                  <Badge variant="secondary" className="text-xs bg-blue-100 text-blue-700 border-blue-200 w-full justify-center">
                    {user.role}
                  </Badge>
                </div>
              )}
              <Button variant="ghost" size="sm" className="w-full justify-start h-10 px-4 rounded-lg text-slate-600 hover:bg-slate-50 hover:text-slate-900">
                <Settings className="h-4 w-4 mr-3" />
                {isSidebarExpanded && <span className="text-sm">Settings</span>}
              </Button>
              {user && (
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="w-full justify-start h-10 px-4 rounded-lg text-slate-600 hover:bg-red-50 hover:text-red-600"
                  onClick={logout}
                >
                  <LogOut className="h-4 w-4 mr-3" />
                  {isSidebarExpanded && <span className="text-sm">Sign Out</span>}
                </Button>
              )}
            </div>
          </div>
        )}

        {/* Mobile Sidebar */}
        {isMobile && (
          <ResponsiveSidebar isOpen={isMobileMenuOpen} onClose={() => setIsMobileMenuOpen(false)}>
            <div className="flex flex-col h-full">
              <div className="flex items-center justify-between p-4 border-b border-slate-200">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <Shield className="h-8 w-8 text-blue-600" />
                    <div className="absolute -top-1 -right-1 h-3 w-3 bg-emerald-500 rounded-full border-2 border-white"></div>
                  </div>
                  <div>
                    <h1 className="font-bold text-lg text-slate-900">Ballistic</h1>
                    <p className="text-xs text-slate-500">Intelligence Platform</p>
                  </div>
                </div>
              </div>
              
              <div className="flex-1 overflow-y-auto p-4">
                <ResponsiveNavigation 
                  items={navItems}
                  activeItem={activeTab}
                  onItemClick={(id) => {
                    setActiveTab(id as any)
                    setIsMobileMenuOpen(false)
                  }}
                />
              </div>
              
              {user && (
                <div className="p-4 border-t border-slate-200 space-y-3">
                  <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                        <User className="h-5 w-5 text-blue-600" />
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-sm text-slate-900 truncate">{user.name}</p>
                        <p className="text-xs text-slate-500 truncate">{user.email}</p>
                      </div>
                    </div>
                    <Badge variant="secondary" className="text-xs bg-blue-100 text-blue-700 border-blue-200 w-full justify-center">
                      {user.role}
                    </Badge>
                  </div>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="w-full justify-start h-10 px-4 rounded-lg text-slate-600 hover:bg-red-50 hover:text-red-600"
                    onClick={logout}
                  >
                    <LogOut className="h-4 w-4 mr-3" />
                    Sign Out
                  </Button>
                </div>
              )}
            </div>
          </ResponsiveSidebar>
        )}

        {/* Main Content */}
        <ResponsiveMainContent>
          <main id="main-content" tabIndex={-1}>
            {/* Professional Header */}
            <div className="flex items-center justify-between mb-4 lg:mb-6">
            <div className="flex items-center gap-3">
              {isMobile && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-10 w-10 p-0"
                  onClick={() => setIsMobileMenuOpen(true)}
                >
                  <Menu className="h-5 w-5" />
                </Button>
              )}
              <div>
                <div className="flex items-center gap-2 lg:gap-3 mb-2">
                  <h1 className="text-2xl lg:text-3xl font-bold text-slate-900">
                    {navItems.find(item => item.id === activeTab)?.label}
                  </h1>
                  <ResponsiveBadge className="bg-emerald-100 text-emerald-700 border-emerald-200">
                    <Clock className="h-3 w-3 mr-1" />
                    {currentTime}
                  </ResponsiveBadge>
                </div>
                <p className="text-slate-600 text-base lg:text-lg">
                  {activeTab === 'overview' && 'Comprehensive cybersecurity investment intelligence and strategic insights'}
                  {activeTab === 'deal-map' && 'Visualize investment opportunities and deal flow pipeline'}
                  {activeTab === 'funding-landscape' && 'Analyze cybersecurity funding trends and market dynamics'}
                  {activeTab === 'concise-ai' && 'AI-powered company analysis and investment intelligence'}
                  {activeTab === 'convergence' && 'Business-user-technical convergence analysis and insights'}
                  {activeTab === 'personalized' && 'Tailored intelligence powered by advanced AI algorithms'}
                  {activeTab === 'collaboration' && 'Team intelligence sharing and collaborative insights'}
                  {activeTab === 'insights-engine' && 'Actionable insights derived from complex data analysis'}
                  {activeTab === 'research-dashboard' && 'Comprehensive technical and financial research intelligence'}
                  {activeTab === 'ai-analyst' && 'AI-powered conference analysis and opportunity identification'}
                  {activeTab === 'ai-researcher' && 'Automated company research and due diligence'}
                  {activeTab === 'ai-advisor' && 'AI-driven investment recommendations and portfolio optimization'}
                  {activeTab === 'ai-vulnerability' && 'Advanced vulnerability intelligence and threat assessment'}
                  {activeTab === 'venture-capital' && 'Venture capital ecosystem with real-time funding intelligence'}
                  {activeTab === 'ballistic-database' && 'Comprehensive Ballistic Ventures portfolio intelligence'}
                  {activeTab === 'deal-flow' && 'Cybersecurity startup discovery and deal flow management'}
                </p>
              </div>
            </div>
            <div className="flex gap-2 lg:gap-3">
              <ResponsiveSearchBar placeholder="Search intelligence..." />
              <ConnectionStatus />
              <KeyboardNavigationHelper />
              <NotificationCenter />
            </div>
          </div>

          {/* Enhanced Content based on active tab */}
          {activeTab === 'overview' && (
            <div className="space-y-4 lg:space-y-6">
              {/* Professional Hero Section */}
              <ProfessionalHeroSection />
              
              {/* Enhanced KPI Dashboard */}
              <EnhancedKPIDashboard metrics={allMetrics} showControls={true} />
              
              {/* Enhanced Data Visualization */}
              <EnhancedDataVisualization 
                fundingOverTime={fundingOverTime} 
                fundingByStage={fundingByStage} 
                vulnerabilities={vulnerabilities}
              />
              
              {/* Real-time Updates Section */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">
                <RealTimeMetrics initialData={{
                  totalInvestment: stats.totalInvestment,
                  companiesTracked: stats.companiesTracked,
                  newVulnerabilities: stats.newVulnerabilities
                }} />
                
                <ActivityFeed activities={[
                  {
                    id: '1',
                    type: 'investment',
                    title: 'New Investment',
                    description: 'CloudSecure Series A funding',
                    value: '+$15M',
                    timestamp: new Date(Date.now() - 300000)
                  },
                  {
                    id: '2',
                    type: 'threat',
                    title: 'Security Alert',
                    description: 'API vulnerability detected',
                    value: 'Critical',
                    timestamp: new Date(Date.now() - 600000)
                  },
                  {
                    id: '3',
                    type: 'conference',
                    title: 'Conference Update',
                    description: 'RSA Conference starts soon',
                    value: '2 days',
                    timestamp: new Date(Date.now() - 900000)
                  }
                ]} />
              </div>

              {/* Performance Overview */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-6">
                <MetricComparison 
                  title="Key Performance Indicators"
                  metrics={comparisonMetrics}
                  timeframe="Quarter"
                />
                
                <Card className="border border-slate-200 bg-white shadow-sm">
                  <CardHeader className="pb-4">
                    <CardTitle className="flex items-center gap-3 text-lg font-semibold text-slate-900">
                      <div className="p-2 bg-emerald-100 rounded-lg">
                        <Target className="h-5 w-5 text-emerald-600" />
                      </div>
                      Performance Overview
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 gap-6">
                      <PerformanceGauge 
                        value={87} 
                        label="Business Fit"
                        color="emerald"
                      />
                      <PerformanceGauge 
                        value={92} 
                        label="User Adoption"
                        color="blue"
                      />
                      <PerformanceGauge 
                        value={89} 
                        label="Technical Score"
                        color="purple"
                      />
                      <PerformanceGauge 
                        value={94} 
                        label="AI Accuracy"
                        color="pink"
                      />
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Enhanced Core Tools Section */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">
                <ProfessionalFeatureCard
                  title="AI-Powered Company Analysis"
                  description="Leverage cutting-edge artificial intelligence and machine learning algorithms to conduct comprehensive analysis of cybersecurity companies. Our advanced engine evaluates technical capabilities, market positioning, competitive landscape, and investment potential with unprecedented accuracy."
                  icon={Brain}
                  color="text-blue-600"
                  bgColor="bg-blue-100"
                  badges={["AI-Driven", "Investment Ready", "Real-Time Analysis"]}
                  buttonText="Launch Analysis Engine"
                  onButtonClick={() => setActiveTab('concise-ai')}
                />

                <ProfessionalFeatureCard
                  title="Market Intelligence Suite"
                  description="Access real-time cybersecurity funding trends, market dynamics, and competitive intelligence. Our comprehensive platform provides actionable insights into investment patterns, emerging technologies, and market opportunities across the cybersecurity landscape."
                  icon={TrendingUp}
                  color="text-emerald-600"
                  bgColor="bg-emerald-100"
                  buttonText="Explore Market Dynamics"
                  onButtonClick={() => setActiveTab('funding-landscape')}
                >
                  <ProfessionalStatsGrid 
                    stats={[
                      { label: "Business Fit", value: "87%", change: "+3%" },
                      { label: "User Adoption", value: "92%", change: "+5%" },
                      { label: "Technical Score", value: "89%", change: "+2%" }
                    ]}
                  />
                </ProfessionalFeatureCard>
              </div>

              {/* Enhanced Business Insights */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">
                {/* Professional Activity Feed */}
                <ProfessionalActivityCard 
                  activities={[
                    {
                      type: 'investment',
                      title: 'Strategic Investment',
                      subtitle: 'CloudSecure Series A funding round',
                      value: '+$15M'
                    },
                    {
                      type: 'threat',
                      title: 'Critical Vulnerability',
                      subtitle: 'API security flaw detected',
                      value: 'Critical'
                    },
                    {
                      type: 'conference',
                      title: 'Industry Event',
                      subtitle: 'RSA Conference 2024',
                      value: '2 days'
                    }
                  ]}
                />

                {/* Vulnerabilities List */}
                <VulnerabilitiesList vulnerabilities={vulnerabilities} />
              </div>

              {/* Strategic Insights */}
              <ProfessionalInsightCard 
                title="Strategic Intelligence Briefing"
                icon={Lightbulb}
                insights={[
                  "Cybersecurity funding shows strong momentum in Q4 2024, with AI-driven security solutions leading investment trends.",
                  "Enterprise adoption of zero-trust architecture continues to accelerate, creating significant market opportunities.",
                  "Regulatory compliance requirements are driving increased demand for automated security solutions.",
                  "Consolidation in the cybersecurity sector suggests strategic acquisition opportunities for portfolio companies."
                ]}
              />

              {/* Call to Action */}
              <ProfessionalCallToAction
                title="Ready to Dive Deeper?"
                description="Explore our comprehensive suite of intelligence tools and gain unparalleled insights into the cybersecurity investment landscape."
                buttonText="Explore All Tools"
                onButtonClick={() => setActiveTab('funding-landscape')}
              />
            </div>
          )}

          {/* Render other tabs with enhanced styling */}
          {activeTab === 'deal-map' && <DealMap />}
          {activeTab === 'deal-flow' && <DealFlowSourcing />}

          {activeTab === 'research-dashboard' && <ResearchDashboard />}
          {activeTab === 'concise-ai' && <ConciseAIAnalyst />}
          </main>
        </ResponsiveMainContent>
      </ResponsiveContainer>
    </PageTransition>
  )
}