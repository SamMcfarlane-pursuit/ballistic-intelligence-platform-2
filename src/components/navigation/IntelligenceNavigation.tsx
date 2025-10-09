'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  Brain, 
  Shield, 
  TrendingUp, 
  Network,
  Target,
  FileText,
  Building2,
  BarChart3,
  Command,
  ChevronDown,
  Activity,
  Zap
} from 'lucide-react'

const intelligenceModules = [
  {
    name: 'Intelligence Center',
    href: '/intelligence-center',
    icon: Command,
    description: 'Unified command center',
    status: 'operational'
  },
  {
    name: 'AI Agents',
    href: '/ai-agents',
    icon: Brain,
    description: 'Multi-agent analysis',
    status: 'operational'
  },
  {
    name: 'RAG Intelligence',
    href: '/rag-intelligence',
    icon: Network,
    description: 'Knowledge graph analysis',
    status: 'operational'
  },
  {
    name: 'Threat Intelligence',
    href: '/threat-intelligence',
    icon: Shield,
    description: 'Cybersecurity monitoring',
    status: 'operational'
  },
  {
    name: 'Patent Intelligence',
    href: '/patent-intelligence',
    icon: FileText,
    description: 'IP and innovation analysis',
    status: 'operational'
  },
  {
    name: 'Funding Tracker',
    href: '/funding-tracker',
    icon: TrendingUp,
    description: 'Investment tracking',
    status: 'operational'
  },
  {
    name: 'Ballistic Portfolio',
    href: '/ballistic-portfolio',
    icon: Target,
    description: 'Portfolio intelligence',
    status: 'operational'
  }
]

export default function IntelligenceNavigation() {
  const [isExpanded, setIsExpanded] = useState(false)
  const pathname = usePathname()

  const isIntelligencePage = intelligenceModules.some(module => 
    pathname.startsWith(module.href)
  )

  if (!isIntelligencePage) {
    return null
  }

  return (
    <div className="bg-gray-50 border-b">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between py-3">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Activity className="h-5 w-5 text-blue-600" />
              <span className="font-semibold text-gray-900">Intelligence Platform</span>
              <Badge variant="outline" className="text-xs">
                7 Modules Active
              </Badge>
            </div>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsExpanded(!isExpanded)}
              className="flex items-center gap-2"
            >
              <span className="text-sm">Modules</span>
              <ChevronDown className={`h-4 w-4 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
            </Button>
          </div>

          <div className="flex items-center gap-2">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              <span>All Systems Operational</span>
            </div>
            
            <Link href="/intelligence-center">
              <Button size="sm" className="flex items-center gap-2">
                <Command className="h-4 w-4" />
                Command Center
              </Button>
            </Link>
          </div>
        </div>

        {isExpanded && (
          <div className="pb-4">
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3">
              {intelligenceModules.map((module) => {
                const Icon = module.icon
                const isActive = pathname === module.href
                
                return (
                  <Link key={module.href} href={module.href}>
                    <div className={`
                      p-3 rounded-lg border transition-all cursor-pointer
                      ${isActive 
                        ? 'bg-blue-50 border-blue-200 shadow-sm' 
                        : 'bg-white border-gray-200 hover:border-gray-300 hover:shadow-sm'
                      }
                    `}>
                      <div className="flex items-center gap-2 mb-1">
                        <Icon className={`h-4 w-4 ${isActive ? 'text-blue-600' : 'text-gray-600'}`} />
                        <Badge 
                          variant={module.status === 'operational' ? 'default' : 'destructive'}
                          className="text-xs px-1 py-0"
                        >
                          {module.status === 'operational' ? '●' : '○'}
                        </Badge>
                      </div>
                      <div className={`text-sm font-medium ${isActive ? 'text-blue-900' : 'text-gray-900'}`}>
                        {module.name}
                      </div>
                      <div className="text-xs text-gray-600 mt-1">
                        {module.description}
                      </div>
                    </div>
                  </Link>
                )
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}