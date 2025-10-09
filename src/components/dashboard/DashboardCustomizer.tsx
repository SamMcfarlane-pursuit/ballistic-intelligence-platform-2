'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Switch } from '@/components/ui/switch'
import { 
  Settings, 
  Eye, 
  EyeOff, 
  Move, 
  Palette, 
  Layout,
  Save,
  RotateCcw
} from 'lucide-react'

interface DashboardWidget {
  id: string
  name: string
  description: string
  enabled: boolean
  position: number
  size: 'small' | 'medium' | 'large' | 'full'
}

interface DashboardCustomizerProps {
  isOpen: boolean
  onClose: () => void
  widgets: DashboardWidget[]
  onUpdateWidgets: (widgets: DashboardWidget[]) => void
}

export function DashboardCustomizer({ 
  isOpen, 
  onClose, 
  widgets, 
  onUpdateWidgets 
}: DashboardCustomizerProps) {
  const [localWidgets, setLocalWidgets] = useState(widgets)
  const [activeTab, setActiveTab] = useState<'layout' | 'widgets' | 'theme'>('widgets')

  if (!isOpen) return null

  const handleToggleWidget = (widgetId: string) => {
    setLocalWidgets(prev => 
      prev.map(widget => 
        widget.id === widgetId 
          ? { ...widget, enabled: !widget.enabled }
          : widget
      )
    )
  }

  const handleSaveChanges = () => {
    onUpdateWidgets(localWidgets)
    onClose()
  }

  const handleReset = () => {
    setLocalWidgets(widgets)
  }

  const getSizeLabel = (size: string) => {
    switch (size) {
      case 'small': return 'Small (1/4 width)'
      case 'medium': return 'Medium (1/2 width)'
      case 'large': return 'Large (2/3 width)'
      case 'full': return 'Full width'
      default: return size
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
      <Card className="w-full max-w-4xl max-h-[90vh] overflow-hidden">
        <CardHeader className="border-b">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Settings className="h-5 w-5" />
              <CardTitle>Customize Dashboard</CardTitle>
            </div>
            <Button variant="ghost" size="sm" onClick={onClose}>
              ×
            </Button>
          </div>
          
          {/* Tabs */}
          <div className="flex space-x-1 bg-gray-100 rounded-lg p-1">
            {[
              { id: 'widgets', label: 'Widgets', icon: Layout },
              { id: 'layout', label: 'Layout', icon: Move },
              { id: 'theme', label: 'Theme', icon: Palette }
            ].map(tab => {
              const Icon = tab.icon
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    activeTab === tab.id
                      ? 'bg-white text-gray-900 shadow-sm'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span>{tab.label}</span>
                </button>
              )
            })}
          </div>
        </CardHeader>

        <CardContent className="p-6 overflow-y-auto max-h-[60vh]">
          {activeTab === 'widgets' && (
            <div className="space-y-4">
              <div className="mb-6">
                <h3 className="text-lg font-semibold mb-2">Dashboard Widgets</h3>
                <p className="text-sm text-gray-600">
                  Enable or disable widgets to customize your dashboard view
                </p>
              </div>

              <div className="grid gap-4">
                {localWidgets.map((widget) => (
                  <div 
                    key={widget.id}
                    className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="flex items-center space-x-2">
                        {widget.enabled ? (
                          <Eye className="h-4 w-4 text-green-600" />
                        ) : (
                          <EyeOff className="h-4 w-4 text-gray-400" />
                        )}
                        <div>
                          <h4 className="font-medium">{widget.name}</h4>
                          <p className="text-sm text-gray-600">{widget.description}</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-3">
                      <Badge variant="outline" className="text-xs">
                        {getSizeLabel(widget.size)}
                      </Badge>
                      <Switch
                        checked={widget.enabled}
                        onCheckedChange={() => handleToggleWidget(widget.id)}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'layout' && (
            <div className="space-y-4">
              <div className="mb-6">
                <h3 className="text-lg font-semibold mb-2">Layout Options</h3>
                <p className="text-sm text-gray-600">
                  Customize the layout and arrangement of your dashboard
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 border rounded-lg cursor-pointer hover:bg-blue-50 hover:border-blue-200">
                  <div className="mb-2">
                    <div className="w-full h-20 bg-gray-100 rounded mb-2">
                      <div className="grid grid-cols-4 gap-1 p-2 h-full">
                        <div className="bg-blue-200 rounded"></div>
                        <div className="bg-blue-200 rounded"></div>
                        <div className="bg-blue-200 rounded"></div>
                        <div className="bg-blue-200 rounded"></div>
                      </div>
                    </div>
                  </div>
                  <h4 className="font-medium">Grid Layout</h4>
                  <p className="text-xs text-gray-600">4-column grid layout</p>
                </div>

                <div className="p-4 border rounded-lg cursor-pointer hover:bg-blue-50 hover:border-blue-200">
                  <div className="mb-2">
                    <div className="w-full h-20 bg-gray-100 rounded mb-2">
                      <div className="flex gap-1 p-2 h-full">
                        <div className="flex-1 bg-blue-200 rounded"></div>
                        <div className="w-1/3 bg-blue-200 rounded"></div>
                      </div>
                    </div>
                  </div>
                  <h4 className="font-medium">Sidebar Layout</h4>
                  <p className="text-xs text-gray-600">Main content with sidebar</p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'theme' && (
            <div className="space-y-4">
              <div className="mb-6">
                <h3 className="text-lg font-semibold mb-2">Theme Settings</h3>
                <p className="text-sm text-gray-600">
                  Customize colors and appearance
                </p>
              </div>

              <div className="grid grid-cols-3 gap-4">
                {[
                  { name: 'Default', primary: '#3b82f6', secondary: '#e5e7eb' },
                  { name: 'Dark', primary: '#1f2937', secondary: '#374151' },
                  { name: 'Green', primary: '#10b981', secondary: '#d1fae5' },
                  { name: 'Purple', primary: '#8b5cf6', secondary: '#ede9fe' },
                  { name: 'Orange', primary: '#f97316', secondary: '#fed7aa' },
                  { name: 'Red', primary: '#ef4444', secondary: '#fecaca' }
                ].map((theme) => (
                  <div 
                    key={theme.name}
                    className="p-3 border rounded-lg cursor-pointer hover:bg-gray-50"
                  >
                    <div className="flex space-x-2 mb-2">
                      <div 
                        className="w-6 h-6 rounded"
                        style={{ backgroundColor: theme.primary }}
                      ></div>
                      <div 
                        className="w-6 h-6 rounded"
                        style={{ backgroundColor: theme.secondary }}
                      ></div>
                    </div>
                    <p className="text-sm font-medium">{theme.name}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </CardContent>

        <div className="border-t p-4 flex items-center justify-between bg-gray-50">
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm" onClick={handleReset}>
              <RotateCcw className="h-4 w-4 mr-2" />
              Reset
            </Button>
          </div>
          
          <div className="flex items-center space-x-2">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button onClick={handleSaveChanges}>
              <Save className="h-4 w-4 mr-2" />
              Save Changes
            </Button>
          </div>
        </div>
      </Card>
    </div>
  )
}