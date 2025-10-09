'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Plus, BarChart3, Calendar, Briefcase } from 'lucide-react'
import Link from 'next/link'

interface QuickAction {
  id: string
  label: string
  icon: string
  endpoint: string
}

interface QuickActionsProps {
  actions?: QuickAction[]
}

const iconMap = {
  plus: Plus,
  chart: BarChart3,
  calendar: Calendar,
  briefcase: Briefcase
}

export function QuickActions({ actions }: QuickActionsProps) {
  const defaultActions = [
    { id: 'add_company', label: 'Add Company', icon: 'plus', endpoint: '/companies/new' },
    { id: 'analyze_market', label: 'Market Analysis', icon: 'chart', endpoint: '/analytics' },
    { id: 'create_convention', label: 'Add Convention', icon: 'calendar', endpoint: '/conventions/new' },
    { id: 'portfolio_review', label: 'Portfolio Review', icon: 'briefcase', endpoint: '/portfolio' }
  ]

  const displayActions = actions || defaultActions

  return (
    <Card>
      <CardHeader>
        <CardTitle>Quick Actions</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {displayActions.map((action) => {
            const Icon = iconMap[action.icon as keyof typeof iconMap] || Plus
            
            return (
              <Button
                key={action.id}
                variant="outline"
                className="h-auto p-4 flex flex-col items-center space-y-2 hover:bg-blue-50 hover:border-blue-200"
                asChild
              >
                <Link href={action.endpoint}>
                  <Icon className="h-5 w-5 text-blue-600" />
                  <span className="text-sm font-medium text-center">
                    {action.label}
                  </span>
                </Link>
              </Button>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}