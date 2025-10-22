'use client'

import { Badge } from '@/components/ui/badge'
import { Code, Cpu, Database, Globe, Server, Smartphone } from 'lucide-react'

interface TechStackProps {
  technologies: string[]
  variant?: 'compact' | 'detailed' | 'minimal'
  maxVisible?: number
  showIcons?: boolean
  className?: string
}

// Tech category icons mapping
const getTechIcon = (tech: string) => {
  const techLower = tech.toLowerCase()
  
  if (techLower.includes('python') || techLower.includes('javascript') || techLower.includes('typescript') || techLower.includes('java') || techLower.includes('go') || techLower.includes('rust') || techLower.includes('c++')) {
    return <Code className="h-3 w-3" />
  }
  if (techLower.includes('react') || techLower.includes('vue') || techLower.includes('angular') || techLower.includes('next') || techLower.includes('svelte')) {
    return <Globe className="h-3 w-3" />
  }
  if (techLower.includes('node') || techLower.includes('express') || techLower.includes('django') || techLower.includes('spring') || techLower.includes('fastapi')) {
    return <Server className="h-3 w-3" />
  }
  if (techLower.includes('postgresql') || techLower.includes('mysql') || techLower.includes('mongodb') || techLower.includes('redis') || techLower.includes('elasticsearch')) {
    return <Database className="h-3 w-3" />
  }
  if (techLower.includes('tensorflow') || techLower.includes('pytorch') || techLower.includes('kubernetes') || techLower.includes('docker') || techLower.includes('aws')) {
    return <Cpu className="h-3 w-3" />
  }
  if (techLower.includes('swift') || techLower.includes('kotlin') || techLower.includes('react native') || techLower.includes('flutter')) {
    return <Smartphone className="h-3 w-3" />
  }
  
  return <Code className="h-3 w-3" />
}

// Tech category colors
const getTechColor = (tech: string) => {
  const techLower = tech.toLowerCase()
  
  if (techLower.includes('python')) return 'bg-yellow-50 text-yellow-700 border-yellow-200 hover:bg-yellow-100'
  if (techLower.includes('javascript') || techLower.includes('typescript')) return 'bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100'
  if (techLower.includes('react') || techLower.includes('next')) return 'bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100'
  if (techLower.includes('node') || techLower.includes('express')) return 'bg-green-50 text-green-700 border-green-200 hover:bg-green-100'
  if (techLower.includes('python') || techLower.includes('django')) return 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100'
  if (techLower.includes('java') || techLower.includes('spring')) return 'bg-orange-50 text-orange-700 border-orange-200 hover:bg-orange-100'
  if (techLower.includes('go')) return 'bg-cyan-50 text-cyan-700 border-cyan-200 hover:bg-cyan-100'
  if (techLower.includes('rust')) return 'bg-red-50 text-red-700 border-red-200 hover:bg-red-100'
  if (techLower.includes('postgresql') || techLower.includes('mysql')) return 'bg-indigo-50 text-indigo-700 border-indigo-200 hover:bg-indigo-100'
  if (techLower.includes('mongodb')) return 'bg-green-50 text-green-700 border-green-200 hover:bg-green-100'
  if (techLower.includes('redis')) return 'bg-red-50 text-red-700 border-red-200 hover:bg-red-100'
  if (techLower.includes('docker') || techLower.includes('kubernetes')) return 'bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100'
  if (techLower.includes('aws') || techLower.includes('gcp') || techLower.includes('azure')) return 'bg-purple-50 text-purple-700 border-purple-200 hover:bg-purple-100'
  if (techLower.includes('tensorflow') || techLower.includes('pytorch')) return 'bg-pink-50 text-pink-700 border-pink-200 hover:bg-pink-100'
  
  // Default color
  return 'bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100'
}

export default function TechStack({ 
  technologies, 
  variant = 'compact', 
  maxVisible = 3, 
  showIcons = true,
  className = '' 
}: TechStackProps) {
  if (!technologies || technologies.length === 0) {
    return null
  }

  const visibleTechs = technologies.slice(0, maxVisible)
  const remainingCount = technologies.length - maxVisible

  if (variant === 'minimal') {
    return (
      <div className={`flex items-center space-x-1 ${className}`}>
        <span className="text-xs text-gray-500">Tech:</span>
        <span className="text-xs text-gray-700 truncate">
          {technologies.slice(0, 2).join(', ')}
          {technologies.length > 2 && ` +${technologies.length - 2}`}
        </span>
      </div>
    )
  }

  if (variant === 'detailed') {
    return (
      <div className={`space-y-3 ${className}`}>
        <div className="flex items-center space-x-2">
          <span className="w-3 h-3 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"></span>
          <h4 className="text-sm font-semibold text-gray-900">Technology Stack</h4>
          <Badge variant="outline" className="text-xs">
            {technologies.length} technologies
          </Badge>
        </div>
        <div className="flex flex-wrap gap-2">
          {technologies.map((tech, index) => (
            <Badge 
              key={index} 
              variant="secondary" 
              className={`px-3 py-1.5 text-sm transition-all shadow-sm ${getTechColor(tech)}`}
            >
              {showIcons && (
                <span className="mr-1.5">
                  {getTechIcon(tech)}
                </span>
              )}
              {tech}
            </Badge>
          ))}
        </div>
      </div>
    )
  }

  // Compact variant (default)
  return (
    <div className={`space-y-2 ${className}`}>
      <div className="flex items-center space-x-2">
        <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
        <span className="text-xs font-medium text-gray-700">Tech Stack</span>
      </div>
      <div className="flex flex-wrap gap-1.5">
        {visibleTechs.map((tech, index) => (
          <Badge 
            key={index} 
            variant="secondary" 
            className={`text-xs px-2 py-1 transition-all ${getTechColor(tech)}`}
          >
            {showIcons && (
              <span className="mr-1">
                {getTechIcon(tech)}
              </span>
            )}
            {tech}
          </Badge>
        ))}
        {remainingCount > 0 && (
          <Badge 
            variant="outline" 
            className="text-xs px-2 py-1 text-gray-500 border-gray-300 hover:bg-gray-50"
          >
            +{remainingCount} more
          </Badge>
        )}
      </div>
    </div>
  )
}