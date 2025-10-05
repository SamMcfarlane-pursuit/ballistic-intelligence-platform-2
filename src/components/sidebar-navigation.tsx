"use client"

import { Button } from '@/components/ui/button'
import { 
  Activity, 
  Map, 
  Building2, 
  Users, 
  Target, 
  Calendar, 
  TrendingUp, 
  Settings,
  Shield
} from 'lucide-react'

export default function SidebarNavigation() {
  const navItems = [
    { icon: Activity, label: 'Overview', active: true },
    { icon: Calendar, label: 'Conferences' },
    { icon: Building2, label: 'Companies' },
    { icon: Users, label: 'Investors' },
    { icon: Map, label: 'Deal Map' },
    { icon: TrendingUp, label: 'Analytics' },
    { icon: Target, label: 'Vulnerabilities' },
    { icon: Settings, label: 'Settings' }
  ]

  return (
    <div className="w-64 bg-slate-900 text-white p-6">
      <div className="mb-8">
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <Shield className="h-6 w-6" />
          CyberEdge Intel
        </h1>
        <p className="text-slate-400 text-sm mt-1">Conference Intelligence Platform</p>
      </div>
      
      <nav className="space-y-2">
        {navItems.map((item, index) => (
          <Button
            key={index}
            variant="ghost"
            className={`w-full justify-start text-white hover:bg-slate-800 ${
              item.active ? 'bg-slate-800' : ''
            }`}
          >
            <item.icon className="mr-2 h-4 w-4" />
            {item.label}
          </Button>
        ))}
      </nav>
    </div>
  )
}