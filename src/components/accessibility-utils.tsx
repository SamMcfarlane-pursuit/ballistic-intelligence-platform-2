"use client"

import { useState, useEffect, useRef, useCallback } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  Keyboard, 
  Volume2, 
  VolumeX, 
  Eye, 
  EyeOff,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Sun,
  Moon,
  Contrast
} from 'lucide-react'

interface AccessibilitySettings {
  highContrast: boolean
  largeText: boolean
  reducedMotion: boolean
  screenReader: boolean
  keyboardNav: boolean
}

export function AccessibilityPanel() {
  const [isOpen, setIsOpen] = useState(false)
  const [settings, setSettings] = useState<AccessibilitySettings>({
    highContrast: false,
    largeText: false,
    reducedMotion: false,
    screenReader: false,
    keyboardNav: true
  })

  const updateSetting = useCallback((key: keyof AccessibilitySettings, value: boolean) => {
    setSettings(prev => ({ ...prev, [key]: value }))
    
    // Apply settings to document
    if (key === 'highContrast') {
      document.documentElement.classList.toggle('high-contrast', value)
    }
    if (key === 'largeText') {
      document.documentElement.classList.toggle('large-text', value)
    }
    if (key === 'reducedMotion') {
      document.documentElement.classList.toggle('reduced-motion', value)
    }
  }, [])

  useEffect(() => {
    // Load settings from localStorage
    const savedSettings = localStorage.getItem('accessibility-settings')
    if (savedSettings) {
      const parsed = JSON.parse(savedSettings)
      setSettings(parsed)
      
      // Apply saved settings
      Object.entries(parsed).forEach(([key, value]) => {
        if (key === 'highContrast') {
          document.documentElement.classList.toggle('high-contrast', value as boolean)
        }
        if (key === 'largeText') {
          document.documentElement.classList.toggle('large-text', value as boolean)
        }
        if (key === 'reducedMotion') {
          document.documentElement.classList.toggle('reduced-motion', value as boolean)
        }
      })
    }

    // Keyboard navigation
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.altKey && e.key === 'a') {
        setIsOpen(prev => !prev)
      }
      
      // Escape to close
      if (e.key === 'Escape' && isOpen) {
        setIsOpen(false)
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [isOpen])

  useEffect(() => {
    // Save settings to localStorage
    localStorage.setItem('accessibility-settings', JSON.stringify(settings))
  }, [settings])

  const settingsList = [
    {
      key: 'highContrast' as keyof AccessibilitySettings,
      icon: Contrast,
      label: 'High Contrast',
      description: 'Increase color contrast for better visibility'
    },
    {
      key: 'largeText' as keyof AccessibilitySettings,
      icon: ZoomIn,
      label: 'Large Text',
      description: 'Increase text size for better readability'
    },
    {
      key: 'reducedMotion' as keyof AccessibilitySettings,
      icon: RotateCcw,
      label: 'Reduced Motion',
      description: 'Minimize animations and transitions'
    },
    {
      key: 'screenReader' as keyof AccessibilitySettings,
      icon: Volume2,
      label: 'Screen Reader',
      description: 'Enable screen reader compatibility'
    },
    {
      key: 'keyboardNav' as keyof AccessibilitySettings,
      icon: Keyboard,
      label: 'Keyboard Navigation',
      description: 'Enhanced keyboard navigation support'
    }
  ]

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {/* Accessibility Button */}
      <Button
        variant="outline"
        size="sm"
        onClick={() => setIsOpen(!isOpen)}
        className="bg-white shadow-lg border-slate-300 hover:bg-slate-50"
        aria-label="Accessibility options (Alt+A)"
        title="Accessibility options (Alt+A)"
      >
        <Keyboard className="h-4 w-4" />
      </Button>

      {/* Accessibility Panel */}
      {isOpen && (
        <Card className="absolute bottom-12 right-0 w-80 bg-white border border-slate-200 shadow-xl">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-slate-900">Accessibility Options</h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsOpen(false)}
                aria-label="Close accessibility panel"
              >
                <EyeOff className="h-4 w-4" />
              </Button>
            </div>

            <div className="space-y-3">
              {settingsList.map((setting) => (
                <div
                  key={setting.key}
                  className="flex items-center justify-between p-3 rounded-lg border border-slate-200 hover:bg-slate-50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <setting.icon className="h-5 w-5 text-slate-600" />
                    <div>
                      <div className="font-medium text-sm text-slate-900">
                        {setting.label}
                      </div>
                      <div className="text-xs text-slate-500">
                        {setting.description}
                      </div>
                    </div>
                  </div>
                  <Button
                    variant={settings[setting.key] ? "default" : "outline"}
                    size="sm"
                    onClick={() => updateSetting(setting.key, !settings[setting.key])}
                    className={`text-xs ${
                      settings[setting.key] 
                        ? 'bg-blue-600 text-white hover:bg-blue-700' 
                        : 'border-slate-300 text-slate-700 hover:bg-slate-50'
                    }`}
                    aria-pressed={settings[setting.key]}
                  >
                    {settings[setting.key] ? 'On' : 'Off'}
                  </Button>
                </div>
              ))}
            </div>

            <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
              <div className="text-xs text-blue-800">
                <strong>Keyboard Shortcuts:</strong>
                <ul className="mt-1 space-y-1">
                  <li>• Alt+A: Open accessibility panel</li>
                  <li>• Escape: Close panels</li>
                  <li>• Tab: Navigate between elements</li>
                  <li>• Enter/Space: Activate buttons</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

export function KeyboardNavigationHelper() {
  const [showHelp, setShowHelp] = useState(false)

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === '?' && (e.ctrlKey || e.metaKey)) {
        setShowHelp(prev => !prev)
      }
      if (e.key === 'Escape' && showHelp) {
        setShowHelp(false)
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [showHelp])

  const shortcuts = [
    { key: 'Tab', description: 'Navigate between interactive elements' },
    { key: 'Shift+Tab', description: 'Navigate backwards' },
    { key: 'Enter/Space', description: 'Activate buttons and links' },
    { key: 'Escape', description: 'Close dialogs and panels' },
    { key: 'Alt+A', description: 'Open accessibility panel' },
    { key: 'Ctrl/Cmd+?', description: 'Show this help' },
    { key: 'Ctrl/Cmd+K', description: 'Focus search input' },
    { key: 'Ctrl/Cmd+N', description: 'Open notifications' },
    { key: 'Ctrl/Cmd+/', description: 'Toggle sidebar' }
  ]

  return (
    <>
      {/* Help Button */}
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setShowHelp(!showHelp)}
        className="text-slate-500 hover:text-slate-700"
        title="Keyboard shortcuts (Ctrl+?)"
      >
        <Keyboard className="h-4 w-4" />
      </Button>

      {/* Help Panel */}
      {showHelp && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <Card className="w-full max-w-md mx-4">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-slate-900">Keyboard Shortcuts</h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowHelp(false)}
                >
                  <EyeOff className="h-4 w-4" />
                </Button>
              </div>

              <div className="space-y-2">
                {shortcuts.map((shortcut, index) => (
                  <div key={index} className="flex items-center justify-between p-2 rounded hover:bg-slate-50">
                    <kbd className="px-2 py-1 text-xs font-mono bg-slate-100 border border-slate-300 rounded">
                      {shortcut.key}
                    </kbd>
                    <span className="text-sm text-slate-600">{shortcut.description}</span>
                  </div>
                ))}
              </div>

              <div className="mt-4 text-center">
                <p className="text-xs text-slate-500">
                  Press <kbd className="px-1 py-0.5 text-xs font-mono bg-slate-100 border border-slate-300 rounded">Escape</kbd> to close
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </>
  )
}

export function FocusTrap({ children, isActive }: { children: React.ReactNode; isActive: boolean }) {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!isActive || !containerRef.current) return

    const container = containerRef.current
    const focusableElements = container.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    )
    
    if (focusableElements.length === 0) return

    const firstElement = focusableElements[0] as HTMLElement
    const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return

      if (e.shiftKey) {
        if (document.activeElement === firstElement) {
          e.preventDefault()
          lastElement.focus()
        }
      } else {
        if (document.activeElement === lastElement) {
          e.preventDefault()
          firstElement.focus()
        }
      }
    }

    container.addEventListener('keydown', handleKeyDown)
    
    // Focus first element when trap is activated
    firstElement.focus()

    return () => {
      container.removeEventListener('keydown', handleKeyDown)
    }
  }, [isActive])

  return (
    <div ref={containerRef} role="dialog" aria-modal="true">
      {children}
    </div>
  )
}

export function Announcer() {
  const [announcement, setAnnouncement] = useState('')

  const announce = useCallback((message: string) => {
    setAnnouncement(message)
    setTimeout(() => setAnnouncement(''), 1000)
  }, [])

  useEffect(() => {
    // Make announce function globally available
    (window as any).announce = announce
  }, [announce])

  return (
    <div
      aria-live="assertive"
      aria-atomic="true"
      className="sr-only"
    >
      {announcement}
    </div>
  )
}

export function SkipToContent() {
  const skipToContent = () => {
    const mainContent = document.querySelector('main')
    if (mainContent) {
      mainContent.setAttribute('tabindex', '-1')
      mainContent.focus()
      mainContent.removeAttribute('tabindex')
    }
  }

  return (
    <a
      href="#main-content"
      onClick={skipToContent}
      className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 bg-blue-600 text-white px-4 py-2 rounded-md z-50"
    >
      Skip to main content
    </a>
  )
}

// Hook for keyboard navigation
export function useKeyboardNavigation(
  items: string[],
  activeIndex: number,
  setActiveIndex: (index: number) => void
) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowDown':
          e.preventDefault()
          setActiveIndex((activeIndex + 1) % items.length)
          break
        case 'ArrowUp':
          e.preventDefault()
          setActiveIndex((activeIndex - 1 + items.length) % items.length)
          break
        case 'Home':
          e.preventDefault()
          setActiveIndex(0)
          break
        case 'End':
          e.preventDefault()
          setActiveIndex(items.length - 1)
          break
        case 'Enter':
        case ' ':
          e.preventDefault()
          // Handle item activation
          break
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [items, activeIndex, setActiveIndex])
}

// High contrast styles
export const highContrastStyles = `
  .high-contrast {
    --background: 000000;
    --foreground: ffffff;
    --card: 000000;
    --card-foreground: ffffff;
    --popover: 000000;
    --popover-foreground: ffffff;
    --primary: ffffff;
    --primary-foreground: 000000;
    --secondary: 333333;
    --secondary-foreground: ffffff;
    --muted: 333333;
    --muted-foreground: ffffff;
    --accent: 333333;
    --accent-foreground: ffffff;
    --destructive: ff0000;
    --destructive-foreground: ffffff;
    --border: ffffff;
    --input: 333333;
    --ring: ffffff;
  }
`

// Large text styles
export const largeTextStyles = `
  .large-text {
    font-size: 125%;
    line-height: 1.5;
  }
  
  .large-text h1 {
    font-size: 2.5rem;
  }
  
  .large-text h2 {
    font-size: 2rem;
  }
  
  .large-text h3 {
    font-size: 1.75rem;
  }
  
  .large-text p, .large-text span, .large-text div {
    font-size: 1.125rem;
  }
`

// Reduced motion styles
export const reducedMotionStyles = `
  .reduced-motion * {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
`