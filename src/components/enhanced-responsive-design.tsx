"use client"

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet'
import { 
  Menu, 
  X, 
  ChevronLeft, 
  ChevronRight, 
  Home, 
  BarChart3, 
  PieChart, 
  TrendingUp, 
  Users, 
  Settings, 
  Bell, 
  Search, 
  Filter,
  Download,
  RefreshCw,
  Maximize2,
  Minimize2,
  Grid,
  List,
  Table,
  Smartphone,
  Tablet,
  Monitor,
  Activity,
  Target,
  DollarSign,
  Building2,
  AlertTriangle,
  Brain,
  Shield,
  Zap,
  Award,
  Eye,
  Clock,
  Calendar,
  Map,
  Briefcase,
  Database,
  Lightbulb,
  Rocket,
  Star,
  Bookmark,
  MoreHorizontal,
  ChevronDown,
  ChevronUp,
  Plus,
  Minus
} from 'lucide-react'

interface ResponsiveLayoutProps {
  children: React.ReactNode
  sidebar?: React.ReactNode
  header?: React.ReactNode
  footer?: React.ReactNode
  className?: string
}

interface BreakpointConfig {
  xs: number
  sm: number
  md: number
  lg: number
  xl: number
  '2xl': number
}

interface DeviceInfo {
  type: 'mobile' | 'tablet' | 'desktop'
  width: number
  height: number
  orientation: 'portrait' | 'landscape'
  isTouch: boolean
}

const BREAKPOINTS: BreakpointConfig = {
  xs: 0,
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  '2xl': 1536
}

export function useDeviceInfo(): DeviceInfo {
  const [deviceInfo, setDeviceInfo] = useState<DeviceInfo>({
    type: 'desktop',
    width: 1024,
    height: 768,
    orientation: 'landscape',
    isTouch: false
  })

  useEffect(() => {
    const updateDeviceInfo = () => {
      const width = window.innerWidth
      const height = window.innerHeight
      
      let type: DeviceInfo['type'] = 'desktop'
      if (width < BREAKPOINTS.sm) {
        type = 'mobile'
      } else if (width < BREAKPOINTS.lg) {
        type = 'tablet'
      }

      setDeviceInfo({
        type,
        width,
        height,
        orientation: width > height ? 'landscape' : 'portrait',
        isTouch: 'ontouchstart' in window || navigator.maxTouchPoints > 0
      })
    }

    updateDeviceInfo()
    window.addEventListener('resize', updateDeviceInfo)
    return () => window.removeEventListener('resize', updateDeviceInfo)
  }, [])

  return deviceInfo
}

export function ResponsiveContainer({ children, sidebar, header, footer, className = '' }: ResponsiveLayoutProps) {
  const deviceInfo = useDeviceInfo()
  const [isSidebarOpen, setIsSidebarOpen] = useState(deviceInfo.type !== 'mobile')
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const isMobile = deviceInfo.type === 'mobile'
  const isTablet = deviceInfo.type === 'tablet'
  const isDesktop = deviceInfo.type === 'desktop'

  return (
    <div className={`min-h-screen bg-slate-50 ${className}`}>
      {/* Mobile Header */}
      {isMobile && (
        <div className="sticky top-0 z-40 bg-white border-b border-slate-200 px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="sm" className="h-9 w-9 p-0">
                    <Menu className="h-5 w-5" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="left" className="w-80 p-0">
                  <SheetHeader className="p-4 border-b border-slate-200">
                    <SheetTitle className="flex items-center gap-3">
                      <Shield className="h-6 w-6 text-blue-600" />
                      <span className="font-bold">Ballistic Intelligence</span>
                    </SheetTitle>
                  </SheetHeader>
                  <div className="p-4">
                    {sidebar}
                  </div>
                </SheetContent>
              </Sheet>
              <div className="flex items-center gap-2">
                <Shield className="h-6 w-6 text-blue-600" />
                <span className="font-semibold text-slate-900">Ballistic</span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                <Search className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                <Bell className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      )}

      <div className="flex">
        {/* Desktop Sidebar */}
        {isDesktop && (
          <aside className={`bg-white border-r border-slate-200 transition-all duration-300 ${
            isSidebarOpen ? 'w-72' : 'w-20'
          }`}>
            <div className="flex flex-col h-full">
              <div className="p-4 border-b border-slate-200">
                <div className="flex items-center justify-between">
                  {isSidebarOpen && (
                    <div className="flex items-center gap-3">
                      <Shield className="h-8 w-8 text-blue-600" />
                      <div>
                        <h1 className="font-bold text-lg">Ballistic</h1>
                        <p className="text-xs text-slate-500">Intelligence</p>
                      </div>
                    </div>
                  )}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                    className="h-8 w-8 p-0"
                  >
                    {isSidebarOpen ? <ChevronLeft className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                  </Button>
                </div>
              </div>
              <div className="flex-1 overflow-y-auto p-4">
                {sidebar}
              </div>
            </div>
          </aside>
        )}

        {/* Main Content */}
        <main className={`flex-1 ${isMobile ? 'pt-0' : ''}`}>
          {header}
          <div className="p-4">
            {children}
          </div>
          {footer}
        </main>
      </div>
    </div>
  )
}

export function ResponsiveGrid({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  const deviceInfo = useDeviceInfo()

  const getGridClasses = () => {
    switch (deviceInfo.type) {
      case 'mobile':
        return 'grid-cols-1 gap-4'
      case 'tablet':
        return 'grid-cols-1 md:grid-cols-2 gap-4'
      case 'desktop':
        return 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'
      default:
        return 'grid-cols-1 gap-4'
    }
  }

  return (
    <div className={`grid ${getGridClasses()} ${className}`}>
      {children}
    </div>
  )
}

export function ResponsiveCard({ 
  children, 
  title, 
  icon: Icon, 
  actions, 
  className = '' 
}: { 
  children: React.ReactNode
  title?: string
  icon?: any
  actions?: React.ReactNode
  className?: string 
}) {
  const deviceInfo = useDeviceInfo()
  const [isExpanded, setIsExpanded] = useState(false)

  const isMobile = deviceInfo.type === 'mobile'

  return (
    <Card className={`border border-slate-200 bg-white shadow-sm hover:shadow-md transition-all duration-300 ${className}`}>
      {(title || Icon || actions) && (
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {Icon && (
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Icon className="h-5 w-5 text-blue-600" />
                </div>
              )}
              {title && (
                <CardTitle className="text-lg font-semibold text-slate-900">
                  {title}
                </CardTitle>
              )}
            </div>
            <div className="flex items-center gap-2">
              {actions}
              {isMobile && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsExpanded(!isExpanded)}
                  className="h-8 w-8 p-0"
                >
                  {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                </Button>
              )}
            </div>
          </div>
        </CardHeader>
      )}
      <CardContent className={`${isMobile && !isExpanded ? 'max-h-32 overflow-hidden' : ''}`}>
        {children}
      </CardContent>
    </Card>
  )
}

export function ResponsiveNavigation({ 
  items, 
  activeItem, 
  onItemClick 
}: { 
  items: Array<{ id: string; label: string; icon: any; description?: string }>
  activeItem: string
  onItemClick: (id: string) => void 
}) {
  const deviceInfo = useDeviceInfo()
  const isMobile = deviceInfo.type === 'mobile'

  if (isMobile) {
    return (
      <div className="space-y-2">
        {items.map(item => (
          <Button
            key={item.id}
            variant={activeItem === item.id ? 'default' : 'ghost'}
            className="w-full justify-start h-12 px-4"
            onClick={() => onItemClick(item.id)}
          >
            <item.icon className="h-5 w-5 mr-3" />
            <div className="text-left">
              <div className="font-medium">{item.label}</div>
              {item.description && (
                <div className="text-xs text-slate-500">{item.description}</div>
              )}
            </div>
          </Button>
        ))}
      </div>
    )
  }

  return (
    <nav className="space-y-2">
      {items.map(item => (
        <Button
          key={item.id}
          variant={activeItem === item.id ? 'default' : 'ghost'}
          className="w-full justify-start h-12 px-4 rounded-xl"
          onClick={() => onItemClick(item.id)}
        >
          <item.icon className="h-5 w-5 mr-3" />
          <div className="text-left">
            <div className="font-medium">{item.label}</div>
            {item.description && (
              <div className="text-xs text-slate-500">{item.description}</div>
            )}
          </div>
        </Button>
      ))}
    </nav>
  )
}

export function ResponsiveHeader({ 
  title, 
  subtitle, 
  actions, 
  breadcrumbs 
}: { 
  title: string
  subtitle?: string
  actions?: React.ReactNode
  breadcrumbs?: Array<{ label: string; href?: string }>
}) {
  const deviceInfo = useDeviceInfo()
  const isMobile = deviceInfo.type === 'mobile'

  return (
    <div className="mb-6">
      {/* Breadcrumbs */}
      {breadcrumbs && breadcrumbs.length > 0 && (
        <nav className="flex items-center gap-2 text-sm text-slate-600 mb-4">
          {breadcrumbs.map((crumb, index) => (
            <div key={index} className="flex items-center gap-2">
              {index > 0 && <ChevronRight className="h-4 w-4" />}
              <span className={index === breadcrumbs.length - 1 ? 'text-slate-900 font-medium' : ''}>
                {crumb.label}
              </span>
            </div>
          ))}
        </nav>
      )}

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className={`font-bold text-slate-900 ${isMobile ? 'text-2xl' : 'text-3xl'}`}>
            {title}
          </h1>
          {subtitle && (
            <p className="text-slate-600 mt-1">{subtitle}</p>
          )}
        </div>
        
        {actions && (
          <div className="flex flex-wrap items-center gap-2">
            {actions}
          </div>
        )}
      </div>
    </div>
  )
}

export function ResponsiveStats({ 
  stats 
}: { 
  stats: Array<{ 
    label: string 
    value: string | number 
    change?: string 
    icon?: any 
    color?: string 
  }> 
}) {
  const deviceInfo = useDeviceInfo()
  const isMobile = deviceInfo.type === 'mobile'

  return (
    <div className={`grid ${isMobile ? 'grid-cols-1' : 'grid-cols-2 lg:grid-cols-4'} gap-4`}>
      {stats.map((stat, index) => (
        <Card key={index} className="border border-slate-200 bg-white shadow-sm">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              {stat.icon && (
                <div className={`p-2 rounded-lg ${stat.color || 'bg-blue-100'}`}>
                  <stat.icon className={`h-4 w-4 ${stat.color?.replace('bg-', 'text-') || 'text-blue-600'}`} />
                </div>
              )}
              {stat.change && (
                <Badge 
                  variant="outline" 
                  className={`text-xs ${
                    stat.change.startsWith('+') ? 'text-emerald-600 border-emerald-200' : 
                    stat.change.startsWith('-') ? 'text-red-600 border-red-200' : 
                    'text-slate-600 border-slate-200'
                  }`}
                >
                  {stat.change}
                </Badge>
              )}
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-900">{stat.value}</p>
              <p className="text-sm text-slate-600">{stat.label}</p>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

export function ResponsiveActions({ 
  actions 
}: { 
  actions: Array<{ 
    label: string 
    icon?: any 
    variant?: 'default' | 'outline' | 'ghost' | 'destructive'
    onClick?: () => void 
    disabled?: boolean
  }> 
}) {
  const deviceInfo = useDeviceInfo()
  const isMobile = deviceInfo.type === 'mobile'

  const primaryActions = actions.filter(action => action.variant === 'default' || !action.variant)
  const secondaryActions = actions.filter(action => action.variant && action.variant !== 'default')

  if (isMobile) {
    return (
      <div className="flex flex-col gap-2">
        {primaryActions.map((action, index) => (
          <Button
            key={index}
            variant={action.variant || 'default'}
            onClick={action.onClick}
            disabled={action.disabled}
            className="w-full justify-start"
          >
            {action.icon && <action.icon className="h-4 w-4 mr-2" />}
            {action.label}
          </Button>
        ))}
        
        {secondaryActions.length > 0 && (
          <Select>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="More actions" />
            </SelectTrigger>
            <SelectContent>
              {secondaryActions.map((action, index) => (
                <SelectItem key={index} value={action.label} onClick={action.onClick}>
                  <div className="flex items-center gap-2">
                    {action.icon && <action.icon className="h-4 w-4" />}
                    {action.label}
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
      </div>
    )
  }

  return (
    <div className="flex flex-wrap items-center gap-2">
      {actions.map((action, index) => (
        <Button
          key={index}
          variant={action.variant || 'default'}
          onClick={action.onClick}
          disabled={action.disabled}
          size="sm"
        >
          {action.icon && <action.icon className="h-4 w-4 mr-2" />}
          {action.label}
        </Button>
      ))}
    </div>
  )
}

export function DeviceIndicator() {
  const deviceInfo = useDeviceInfo()

  const getDeviceIcon = () => {
    switch (deviceInfo.type) {
      case 'mobile':
        return <Smartphone className="h-4 w-4" />
      case 'tablet':
        return <Tablet className="h-4 w-4" />
      case 'desktop':
        return <Monitor className="h-4 w-4" />
      default:
        return <Monitor className="h-4 w-4" />
    }
  }

  const getDeviceColor = () => {
    switch (deviceInfo.type) {
      case 'mobile':
        return 'text-purple-600 bg-purple-100 border-purple-200'
      case 'tablet':
        return 'text-blue-600 bg-blue-100 border-blue-200'
      case 'desktop':
        return 'text-green-600 bg-green-100 border-green-200'
      default:
        return 'text-slate-600 bg-slate-100 border-slate-200'
    }
  }

  return (
    <Badge variant="outline" className={`text-xs ${getDeviceColor()}`}>
      {getDeviceIcon()}
      <span className="ml-1 capitalize">{deviceInfo.type}</span>
      <span className="ml-1">({deviceInfo.width}×{deviceInfo.height})</span>
    </Badge>
  )
}

// Example usage component
export function ResponsiveDemo() {
  const deviceInfo = useDeviceInfo()
  const [activeTab, setActiveTab] = useState('overview')

  const navItems = [
    { id: 'overview', label: 'Overview', icon: Home, description: 'Main dashboard' },
    { id: 'analytics', label: 'Analytics', icon: BarChart3, description: 'Data analysis' },
    { id: 'reports', label: 'Reports', icon: PieChart, description: 'Generate reports' },
    { id: 'settings', label: 'Settings', icon: Settings, description: 'Configuration' }
  ]

  const stats = [
    { label: 'Total Users', value: '1,234', change: '+12%', icon: Users, color: 'text-blue-600 bg-blue-100' },
    { label: 'Revenue', value: '$45.6K', change: '+8%', icon: DollarSign, color: 'text-emerald-600 bg-emerald-100' },
    { label: 'Conversion', value: '3.2%', change: '+2%', icon: TrendingUp, color: 'text-purple-600 bg-purple-100' },
    { label: 'Active Sessions', value: '89', change: '-1%', icon: Activity, color: 'text-orange-600 bg-orange-100' }
  ]

  const actions = [
    { label: 'Add New', icon: Plus, variant: 'default' as const },
    { label: 'Export', icon: Download, variant: 'outline' as const },
    { label: 'Filter', icon: Filter, variant: 'outline' as const },
    { label: 'Refresh', icon: RefreshCw, variant: 'ghost' as const }
  ]

  return (
    <ResponsiveContainer
      sidebar={
        <ResponsiveNavigation
          items={navItems}
          activeItem={activeTab}
          onItemClick={setActiveTab}
        />
      }
      header={
        <ResponsiveHeader
          title="Responsive Dashboard"
          subtitle="Optimized for all devices"
          actions={<DeviceIndicator />}
          breadcrumbs={[
            { label: 'Home' },
            { label: 'Dashboard' },
            { label: 'Responsive Demo' }
          ]}
        />
      }
    >
      <div className="space-y-6">
        <ResponsiveStats stats={stats} />
        
        <ResponsiveActions actions={actions} />
        
        <ResponsiveGrid>
          <ResponsiveCard
            title="Device Information"
            icon={Smartphone}
            actions={
              <Button variant="ghost" size="sm">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            }
          >
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm text-slate-600">Device Type</span>
                <span className="text-sm font-medium capitalize">{deviceInfo.type}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-slate-600">Screen Size</span>
                <span className="text-sm font-medium">{deviceInfo.width} × {deviceInfo.height}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-slate-600">Orientation</span>
                <span className="text-sm font-medium capitalize">{deviceInfo.orientation}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-slate-600">Touch Enabled</span>
                <span className="text-sm font-medium">{deviceInfo.isTouch ? 'Yes' : 'No'}</span>
              </div>
            </div>
          </ResponsiveCard>
          
          <ResponsiveCard
            title="Responsive Features"
            icon={Settings}
          >
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                <span className="text-sm">Mobile-first design approach</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                <span className="text-sm">Touch-optimized interactions</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                <span className="text-sm">Adaptive layouts and components</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                <span className="text-sm">Performance optimized</span>
              </div>
            </div>
          </ResponsiveCard>
          
          <ResponsiveCard
            title="Breakpoint System"
            icon={Monitor}
          >
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-slate-600">Mobile (XS)</span>
                <Badge variant="outline" className="text-xs">&lt; 640px</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-slate-600">Tablet (SM)</span>
                <Badge variant="outline" className="text-xs">640px - 768px</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-slate-600">Desktop (MD)</span>
                <Badge variant="outline" className="text-xs">768px - 1024px</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-slate-600">Large (LG)</span>
                <Badge variant="outline" className="text-xs">1024px - 1280px</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-slate-600">XLarge (XL)</span>
                <Badge variant="outline" className="text-xs">1280px - 1536px</Badge>
              </div>
            </div>
          </ResponsiveCard>
        </ResponsiveGrid>
      </div>
    </ResponsiveContainer>
  )
}