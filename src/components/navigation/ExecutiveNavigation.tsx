'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  LayoutDashboard,
  TrendingUp,
  Shield,
  Brain,
  Target,
  Menu,
  X,
  ChevronRight
} from 'lucide-react'

const navigationItems = [
  {
    name: 'Executive Dashboard',
    href: '/executive-dashboard',
    icon: LayoutDashboard,
    description: 'Complete overview',
    color: 'text-blue-600'
  },
  {
    name: 'Portfolio Intelligence',
    href: '/ballistic-portfolio-new',
    icon: TrendingUp,
    description: 'Investment tracking',
    color: 'text-green-600'
  },
  {
    name: 'Security Center',
    href: '/security',
    icon: Shield,
    description: 'Threat monitoring',
    color: 'text-red-600'
  },
]

export function ExecutiveNavigation() {
  const [isOpen, setIsOpen] = useState(false)
  const pathname = usePathname()

  return (
    <>
      {/* Mobile Menu Button */}
      <div className="lg:hidden fixed top-4 left-4 z-50">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setIsOpen(!isOpen)}
          className="bg-white shadow-lg"
        >
          {isOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
        </Button>
      </div>

      {/* Navigation Sidebar */}
      <div className={`
        fixed inset-y-0 left-0 z-40 w-80 bg-white shadow-xl transform transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        lg:translate-x-0 lg:static lg:inset-0 lg:w-64 lg:shadow-none lg:border-r
      `}>
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="p-6 border-b">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                <Target className="h-6 w-6 text-white" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-gray-900">CS Intelligence</h2>
                <p className="text-sm text-gray-500">Executive Platform</p>
              </div>
            </div>
          </div>

          {/* Navigation Items */}
          <nav className="flex-1 p-4 space-y-2">
            {navigationItems.map((item) => {
              const Icon = item.icon
              const isActive = pathname === item.href
              
              return (
                <Link key={item.name} href={item.href}>
                  <div className={`
                    group flex items-center justify-between p-4 rounded-lg transition-all duration-200
                    ${isActive 
                      ? 'bg-blue-50 border-2 border-blue-200 shadow-sm' 
                      : 'hover:bg-gray-50 border-2 border-transparent hover:border-gray-200'
                    }
                  `}>
                    <div className="flex items-center gap-3">
                      <Icon className={`h-5 w-5 ${isActive ? 'text-blue-600' : item.color}`} />
                      <div>
                        <p className={`font-medium ${isActive ? 'text-blue-900' : 'text-gray-900'}`}>
                          {item.name}
                        </p>
                        <p className="text-sm text-gray-500">{item.description}</p>
                      </div>
                    </div>
                    <ChevronRight className={`h-4 w-4 transition-transform ${
                      isActive ? 'text-blue-600 rotate-90' : 'text-gray-400 group-hover:translate-x-1'
                    }`} />
                  </div>
                </Link>
              )
            })}
          </nav>

          {/* System Status */}
          <div className="p-4 border-t bg-gray-50">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700">System Status</span>
              <Badge variant="outline" className="text-green-600 border-green-200">
                Operational
              </Badge>
            </div>
            <div className="space-y-1 text-xs text-gray-500">
              <div className="flex justify-between">
                <span>AI Agents</span>
                <span className="text-green-600">5/5 Active</span>
              </div>
              <div className="flex justify-between">
                <span>Security</span>
                <span className="text-green-600">98.7% Health</span>
              </div>
              <div className="flex justify-between">
                <span>Portfolio</span>
                <span className="text-green-600">$1.2B Tracked</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Overlay for mobile */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  )
}