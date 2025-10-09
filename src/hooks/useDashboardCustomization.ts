'use client'

import { useState, useEffect } from 'react'

interface DashboardWidget {
  id: string
  name: string
  description: string
  enabled: boolean
  position: number
  size: 'small' | 'medium' | 'large' | 'full'
}

interface DashboardLayout {
  type: 'grid' | 'sidebar' | 'masonry'
  columns: number
}

interface DashboardTheme {
  name: string
  primary: string
  secondary: string
  background: string
}

interface DashboardCustomization {
  widgets: DashboardWidget[]
  layout: DashboardLayout
  theme: DashboardTheme
}

const defaultWidgets: DashboardWidget[] = [
  {
    id: 'stats-cards',
    name: 'Statistics Cards',
    description: 'Key performance indicators and metrics',
    enabled: true,
    position: 1,
    size: 'full'
  },
  {
    id: 'funding-overview',
    name: 'Funding Overview Chart',
    description: 'Monthly funding trends visualization',
    enabled: true,
    position: 2,
    size: 'large'
  },
  {
    id: 'startups-by-stage',
    name: 'Startups by Stage',
    description: 'Distribution across funding stages',
    enabled: true,
    position: 3,
    size: 'large'
  },
  {
    id: 'top-startups',
    name: 'Top Performing Startups',
    description: 'Ranked list of highest scoring companies',
    enabled: true,
    position: 4,
    size: 'medium'
  },
  {
    id: 'recent-funding',
    name: 'Recent Funding',
    description: 'Latest funding rounds and activities',
    enabled: true,
    position: 5,
    size: 'medium'
  },
  {
    id: 'startups-table',
    name: 'All Startups Table',
    description: 'Comprehensive data table with all companies',
    enabled: true,
    position: 6,
    size: 'full'
  },
  {
    id: 'market-distribution',
    name: 'Market Distribution',
    description: 'Pie chart showing market category breakdown',
    enabled: false,
    position: 7,
    size: 'medium'
  },
  {
    id: 'investor-activity',
    name: 'Investor Activity',
    description: 'Recent investor activities and trends',
    enabled: false,
    position: 8,
    size: 'medium'
  },
  {
    id: 'threat-intelligence',
    name: 'Threat Intelligence',
    description: 'Real-time cybersecurity threats and vulnerabilities',
    enabled: false,
    position: 9,
    size: 'medium'
  },
  {
    id: 'patent-intelligence',
    name: 'Patent Intelligence',
    description: 'Innovation trends and research datasets',
    enabled: false,
    position: 10,
    size: 'medium'
  },
  {
    id: 'conference-intelligence',
    name: 'Conference Intelligence',
    description: 'Startup showcases and investor activities at conferences',
    enabled: false,
    position: 11,
    size: 'medium'
  }
]

const defaultLayout: DashboardLayout = {
  type: 'grid',
  columns: 3
}

const defaultTheme: DashboardTheme = {
  name: 'Default',
  primary: '#3b82f6',
  secondary: '#e5e7eb',
  background: '#f8fafc'
}

export function useDashboardCustomization() {
  const [customization, setCustomization] = useState<DashboardCustomization>({
    widgets: defaultWidgets,
    layout: defaultLayout,
    theme: defaultTheme
  })

  // Load customization from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('dashboard-customization')
    if (saved) {
      try {
        const parsed = JSON.parse(saved)
        setCustomization({
          widgets: parsed.widgets || defaultWidgets,
          layout: parsed.layout || defaultLayout,
          theme: parsed.theme || defaultTheme
        })
      } catch (error) {
        console.error('Failed to parse dashboard customization:', error)
      }
    }
  }, [])

  // Save customization to localStorage whenever it changes
  const saveCustomization = (newCustomization: DashboardCustomization) => {
    setCustomization(newCustomization)
    localStorage.setItem('dashboard-customization', JSON.stringify(newCustomization))
  }

  const updateWidgets = (widgets: DashboardWidget[]) => {
    const newCustomization = { ...customization, widgets }
    saveCustomization(newCustomization)
  }

  const updateLayout = (layout: DashboardLayout) => {
    const newCustomization = { ...customization, layout }
    saveCustomization(newCustomization)
  }

  const updateTheme = (theme: DashboardTheme) => {
    const newCustomization = { ...customization, theme }
    saveCustomization(newCustomization)
  }

  const resetToDefaults = () => {
    const defaultCustomization = {
      widgets: defaultWidgets,
      layout: defaultLayout,
      theme: defaultTheme
    }
    saveCustomization(defaultCustomization)
  }

  const getEnabledWidgets = () => {
    return customization.widgets
      .filter(widget => widget.enabled)
      .sort((a, b) => a.position - b.position)
  }

  const isWidgetEnabled = (widgetId: string) => {
    const widget = customization.widgets.find(w => w.id === widgetId)
    return widget?.enabled || false
  }

  return {
    customization,
    updateWidgets,
    updateLayout,
    updateTheme,
    resetToDefaults,
    getEnabledWidgets,
    isWidgetEnabled
  }
}