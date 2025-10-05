"use client"

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import { Menu, X, ChevronLeft, ChevronRight } from 'lucide-react'

export function ResponsiveSidebar({ 
  children, 
  isOpen, 
  onClose 
}: { 
  children: React.ReactNode
  isOpen: boolean
  onClose: () => void 
}) {
  return (
    <>
      {/* Mobile Sidebar */}
      <Sheet open={isOpen} onOpenChange={onClose}>
        <SheetContent side="left" className="w-80 p-0">
          {children}
        </SheetContent>
      </Sheet>
    </>
  )
}

export function ResponsiveContainer({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
      <div className="flex flex-col lg:flex-row h-screen">
        {children}
      </div>
    </div>
  )
}

export function ResponsiveMainContent({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex-1 overflow-auto bg-slate-50">
      <div className="p-4 lg:p-6 space-y-4 lg:space-y-6 max-w-7xl mx-auto">
        {children}
      </div>
    </div>
  )
}

export function ResponsiveHeader({ 
  title, 
  description, 
  actions 
}: { 
  title: string
  description: string
  actions?: React.ReactNode 
}) {
  return (
    <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
      <div className="flex-1">
        <h1 className="text-2xl lg:text-3xl font-bold tracking-tight text-slate-900">
          {title}
        </h1>
        <p className="text-slate-600 text-base lg:text-lg mt-1">
          {description}
        </p>
      </div>
      {actions && (
        <div className="flex gap-2 lg:gap-3">
          {actions}
        </div>
      )}
    </div>
  )
}

export function ResponsiveGrid({ 
  children, 
  cols = { default: 1, sm: 2, lg: 4 } 
}: { 
  children: React.ReactNode
  cols?: { default: number; sm?: number; md?: number; lg?: number; xl?: number }
}) {
  const gridClasses = [
    `grid-cols-${cols.default}`,
    cols.sm && `sm:grid-cols-${cols.sm}`,
    cols.md && `md:grid-cols-${cols.md}`,
    cols.lg && `lg:grid-cols-${cols.lg}`,
    cols.xl && `xl:grid-cols-${cols.xl}`,
  ].filter(Boolean).join(' ')

  return (
    <div className={`grid ${gridClasses} gap-3 lg:gap-4`}>
      {children}
    </div>
  )
}

export function ResponsiveCard({ 
  children, 
  className = "" 
}: { 
  children: React.ReactNode
  className?: string 
}) {
  return (
    <div className={`border border-slate-200 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow ${className}`}>
      {children}
    </div>
  )
}

export function ResponsiveMetricCard({ 
  title, 
  value, 
  subtitle, 
  icon: Icon, 
  color, 
  bgColor 
}: { 
  title: string
  value: string
  subtitle: string
  icon: any
  color: string
  bgColor: string 
}) {
  return (
    <ResponsiveCard className="p-4 lg:p-6">
      <div className="flex items-center gap-3 lg:gap-4">
        <div className={`p-2 lg:p-3 rounded-lg ${bgColor} flex-shrink-0`}>
          <Icon className={`h-5 lg:h-6 w-5 lg:w-6 ${color}`} />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-xs lg:text-sm text-slate-600 mb-1">{title}</p>
          <p className={`text-lg lg:text-2xl font-bold ${color} truncate`}>
            {value}
          </p>
          <p className="text-xs text-slate-500 truncate">
            {subtitle}
          </p>
        </div>
      </div>
    </ResponsiveCard>
  )
}

export function MobileMenuButton({ onClick }: { onClick: () => void }) {
  return (
    <Button
      variant="ghost"
      size="sm"
      className="lg:hidden h-10 w-10 p-0"
      onClick={onClick}
    >
      <Menu className="h-5 w-5" />
    </Button>
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
  return (
    <nav className="space-y-1">
      {items.map((item) => (
        <button
          key={item.id}
          onClick={() => onItemClick(item.id)}
          className={`w-full flex items-center gap-3 p-3 rounded-lg text-left transition-colors ${
            activeItem === item.id
              ? 'bg-blue-50 text-blue-700 border border-blue-200'
              : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
          }`}
        >
          <item.icon className={`h-5 w-5 flex-shrink-0 ${
            activeItem === item.id ? 'text-blue-600' : 'text-slate-500'
          }`} />
          <div className="flex-1 min-w-0">
            <div className="font-medium text-sm">{item.label}</div>
            {item.description && (
              <div className="text-xs text-slate-500 mt-0.5">{item.description}</div>
            )}
          </div>
        </button>
      ))}
    </nav>
  )
}

export function ResponsiveSidebarToggle({ 
  isExpanded, 
  onToggle 
}: { 
  isExpanded: boolean
  onToggle: () => void 
}) {
  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={onToggle}
      className="hidden lg:flex ml-auto"
    >
      {isExpanded ? <ChevronLeft className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
    </Button>
  )
}

export function ResponsiveSearchBar({ 
  placeholder = "Search...",
  onSearch 
}: { 
  placeholder?: string
  onSearch?: (value: string) => void 
}) {
  const [value, setValue] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSearch?.(value)
  }

  return (
    <form onSubmit={handleSubmit} className="relative">
      <input
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        className="w-full lg:w-64 h-9 px-3 py-2 text-sm border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
      />
      <button
        type="submit"
        className="absolute right-2 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600"
      >
        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      </button>
    </form>
  )
}

export function ResponsiveBadge({ 
  children, 
  variant = "default" 
}: { 
  children: React.ReactNode
  variant?: "default" | "secondary" | "destructive" | "outline"
}) {
  const baseClasses = "inline-flex items-center px-2 py-1 rounded-full text-xs font-medium"
  
  const variantClasses = {
    default: "bg-blue-100 text-blue-800",
    secondary: "bg-slate-100 text-slate-800",
    destructive: "bg-red-100 text-red-800",
    outline: "border border-slate-300 text-slate-700"
  }

  return (
    <span className={`${baseClasses} ${variantClasses[variant]}`}>
      {children}
    </span>
  )
}

export function ResponsiveButton({ 
  children, 
  variant = "default",
  size = "default",
  onClick,
  className = ""
}: { 
  children: React.ReactNode
  variant?: "default" | "outline" | "ghost" | "destructive"
  size?: "sm" | "default" | "lg"
  onClick?: () => void
  className?: string
}) {
  const baseClasses = "inline-flex items-center justify-center rounded-md font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none"
  
  const variantClasses = {
    default: "bg-blue-600 text-white hover:bg-blue-700",
    outline: "border border-slate-300 bg-white text-slate-700 hover:bg-slate-50",
    ghost: "text-slate-700 hover:bg-slate-100",
    destructive: "bg-red-600 text-white hover:bg-red-700"
  }

  const sizeClasses = {
    sm: "h-8 px-3 text-xs",
    default: "h-9 px-4 text-sm",
    lg: "h-10 px-6 text-base"
  }

  return (
    <button
      onClick={onClick}
      className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
    >
      {children}
    </button>
  )
}

// Hook for responsive design
export function useResponsive() {
  const [isMobile, setIsMobile] = useState(false)
  const [isTablet, setIsTablet] = useState(false)
  const [isDesktop, setIsDesktop] = useState(false)

  useEffect(() => {
    const checkScreenSize = () => {
      const width = window.innerWidth
      setIsMobile(width < 768)
      setIsTablet(width >= 768 && width < 1024)
      setIsDesktop(width >= 1024)
    }

    checkScreenSize()
    window.addEventListener('resize', checkScreenSize)
    return () => window.removeEventListener('resize', checkScreenSize)
  }, [])

  return { isMobile, isTablet, isDesktop }
}