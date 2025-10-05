"use client"

import { useState, useMemo, useCallback } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Slider } from '@/components/ui/slider'
import { 
  Search, 
  Filter, 
  Download, 
  RefreshCw, 
  Eye, 
  EyeOff, 
  Calendar,
  TrendingUp,
  TrendingDown,
  BarChart3,
  PieChart as PieChartIcon,
  Activity,
  Target,
  DollarSign,
  Building2,
  AlertTriangle,
  Users,
  Zap,
  Award,
  ChevronDown,
  ChevronRight,
  Plus,
  Minus,
  RotateCcw,
  Maximize2,
  Minimize2,
  Settings,
  Save,
  Share2,
  Printer,
  Mail,
  MessageSquare,
  Star,
  Flag,
  Bookmark,
  MoreHorizontal,
  Grid,
  List,
  Table,
  Code
} from 'lucide-react'

interface DataFilter {
  id: string
  name: string
  type: 'select' | 'range' | 'date' | 'text' | 'boolean'
  options?: string[]
  min?: number
  max?: number
  value: any
}

interface DataView {
  id: string
  name: string
  type: 'grid' | 'table' | 'chart' | 'cards'
  icon: any
  description: string
}

interface DataExport {
  format: 'csv' | 'excel' | 'pdf' | 'json'
  name: string
  icon: any
}

interface InteractiveDataExplorerProps {
  data: any[]
  columns: string[]
  title?: string
  description?: string
  enableFilters?: boolean
  enableSearch?: boolean
  enableExport?: boolean
  enableViews?: boolean
  defaultView?: 'grid' | 'table' | 'chart' | 'cards'
}

export default function InteractiveDataExplorer({
  data,
  columns,
  title = "Data Explorer",
  description = "Explore and analyze your data with interactive tools",
  enableFilters = true,
  enableSearch = true,
  enableExport = true,
  enableViews = true,
  defaultView = 'grid'
}: InteractiveDataExplorerProps) {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedView, setSelectedView] = useState(defaultView)
  const [filters, setFilters] = useState<DataFilter[]>([])
  const [sortConfig, setSortConfig] = useState<{ key: string; direction: 'asc' | 'desc' } | null>(null)
  const [selectedColumns, setSelectedColumns] = useState<string[]>(columns)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false)
  const [pageSize, setPageSize] = useState(10)
  const [currentPage, setCurrentPage] = useState(1)
  const [selectedRows, setSelectedRows] = useState<Set<number>>(new Set())

  // Available data views
  const dataViews: DataView[] = [
    { id: 'grid', name: 'Grid View', type: 'grid', icon: Grid, description: 'Card-based layout' },
    { id: 'table', name: 'Table View', type: 'table', icon: Table, description: 'Traditional table layout' },
    { id: 'chart', name: 'Chart View', type: 'chart', icon: BarChart3, description: 'Visual chart representation' },
    { id: 'cards', name: 'Cards View', type: 'cards', icon: List, description: 'Detailed card layout' }
  ]

  // Export options
  const exportOptions: DataExport[] = [
    { format: 'csv', name: 'CSV', icon: Download },
    { format: 'excel', name: 'Excel', icon: Table },
    { format: 'pdf', name: 'PDF', icon: Printer },
    { format: 'json', name: 'JSON', icon: Code }
  ]

  // Initialize filters based on columns
  const initializeFilters = useCallback(() => {
    const newFilters: DataFilter[] = columns.map(column => {
      const values = data.map(item => item[column])
      const uniqueValues = [...new Set(values)]
      
      if (typeof values[0] === 'number') {
        return {
          id: column,
          name: column,
          type: 'range',
          min: Math.min(...values as number[]),
          max: Math.max(...values as number[]),
          value: [Math.min(...values as number[]), Math.max(...values as number[])]
        }
      } else if (uniqueValues.length <= 10) {
        return {
          id: column,
          name: column,
          type: 'select',
          options: uniqueValues.map(String),
          value: ''
        }
      } else {
        return {
          id: column,
          name: column,
          type: 'text',
          value: ''
        }
      }
    })
    setFilters(newFilters)
  }, [columns, data])

  // Filter and sort data
  const filteredData = useMemo(() => {
    let result = data.filter(item => {
      // Search filter
      if (searchTerm) {
        const searchMatch = Object.values(item).some(value => 
          String(value).toLowerCase().includes(searchTerm.toLowerCase())
        )
        if (!searchMatch) return false
      }

      // Column filters
      return filters.every(filter => {
        if (!filter.value && filter.type !== 'range') return true
        if (filter.type === 'range' && Array.isArray(filter.value)) {
          const [min, max] = filter.value
          return item[filter.id] >= min && item[filter.id] <= max
        }
        if (filter.type === 'select') {
          return String(item[filter.id]) === filter.value
        }
        if (filter.type === 'text') {
          return String(item[filter.id]).toLowerCase().includes(filter.value.toLowerCase())
        }
        return true
      })
    })

    // Sort data
    if (sortConfig) {
      result.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === 'asc' ? -1 : 1
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === 'asc' ? 1 : -1
        }
        return 0
      })
    }

    return result
  }, [data, searchTerm, filters, sortConfig])

  // Pagination
  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize
    return filteredData.slice(startIndex, startIndex + pageSize)
  }, [filteredData, currentPage, pageSize])

  const totalPages = Math.ceil(filteredData.length / pageSize)

  // Handle sorting
  const handleSort = (key: string) => {
    setSortConfig(prev => ({
      key,
      direction: prev?.key === key && prev.direction === 'asc' ? 'desc' : 'asc'
    }))
  }

  // Handle filter change
  const handleFilterChange = (filterId: string, value: any) => {
    setFilters(prev => prev.map(filter => 
      filter.id === filterId ? { ...filter, value } : filter
    ))
  }

  // Toggle column selection
  const toggleColumn = (column: string) => {
    setSelectedColumns(prev => 
      prev.includes(column) 
        ? prev.filter(c => c !== column)
        : [...prev, column]
    )
  }

  // Toggle row selection
  const toggleRowSelection = (index: number) => {
    setSelectedRows(prev => {
      const newSet = new Set(prev)
      if (newSet.has(index)) {
        newSet.delete(index)
      } else {
        newSet.add(index)
      }
      return newSet
    })
  }

  // Select all rows
  const selectAllRows = () => {
    if (selectedRows.size === paginatedData.length) {
      setSelectedRows(new Set())
    } else {
      setSelectedRows(new Set(paginatedData.map((_, index) => index)))
    }
  }

  // Export data
  const handleExport = (format: DataExport['format']) => {
    const exportData = selectedRows.size > 0 
      ? paginatedData.filter((_, index) => selectedRows.has(index))
      : filteredData

    switch (format) {
      case 'csv':
        // Implement CSV export
        console.log('Exporting to CSV:', exportData)
        break
      case 'excel':
        // Implement Excel export
        console.log('Exporting to Excel:', exportData)
        break
      case 'pdf':
        // Implement PDF export
        console.log('Exporting to PDF:', exportData)
        break
      case 'json':
        // Implement JSON export
        console.log('Exporting to JSON:', exportData)
        break
    }
  }

  // Render data based on selected view
  const renderDataView = () => {
    switch (selectedView) {
      case 'table':
        return (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b border-slate-200">
                  <th className="p-3 text-left">
                    <input
                      type="checkbox"
                      checked={selectedRows.size === paginatedData.length}
                      onChange={selectAllRows}
                      className="rounded border-slate-300"
                    />
                  </th>
                  {selectedColumns.map(column => (
                    <th 
                      key={column} 
                      className="p-3 text-left font-medium text-slate-700 cursor-pointer hover:bg-slate-50"
                      onClick={() => handleSort(column)}
                    >
                      <div className="flex items-center gap-2">
                        {column}
                        {sortConfig?.key === column && (
                          { asc: '↑', desc: '↓' }[sortConfig.direction]
                        )}
                      </div>
                    </th>
                  ))}
                  <th className="p-3 text-left font-medium text-slate-700">Actions</th>
                </tr>
              </thead>
              <tbody>
                {paginatedData.map((item, index) => (
                  <tr key={index} className="border-b border-slate-100 hover:bg-slate-50">
                    <td className="p-3">
                      <input
                        type="checkbox"
                        checked={selectedRows.has(index)}
                        onChange={() => toggleRowSelection(index)}
                        className="rounded border-slate-300"
                      />
                    </td>
                    {selectedColumns.map(column => (
                      <td key={column} className="p-3 text-sm text-slate-700">
                        {item[column]}
                      </td>
                    ))}
                    <td className="p-3">
                      <div className="flex items-center gap-2">
                        <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )

      case 'grid':
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {paginatedData.map((item, index) => (
              <Card key={index} className="border border-slate-200 bg-white shadow-sm hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-3">
                    <input
                      type="checkbox"
                      checked={selectedRows.has(index)}
                      onChange={() => toggleRowSelection(index)}
                      className="rounded border-slate-300"
                    />
                    <div className="flex items-center gap-1">
                      <Button size="sm" variant="ghost" className="h-6 w-6 p-0">
                        <Star className="h-3 w-3" />
                      </Button>
                      <Button size="sm" variant="ghost" className="h-6 w-6 p-0">
                        <Bookmark className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                  <div className="space-y-2">
                    {selectedColumns.slice(0, 3).map(column => (
                      <div key={column}>
                        <Label className="text-xs text-slate-500">{column}</Label>
                        <p className="text-sm font-medium text-slate-700">{item[column]}</p>
                      </div>
                    ))}
                  </div>
                  <div className="flex items-center justify-between mt-4">
                    <Button size="sm" variant="outline" className="text-xs">
                      View Details
                    </Button>
                    <Button size="sm" variant="ghost" className="h-6 w-6 p-0">
                      <MoreHorizontal className="h-3 w-3" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )

      case 'cards':
        return (
          <div className="space-y-4">
            {paginatedData.map((item, index) => (
              <Card key={index} className="border border-slate-200 bg-white shadow-sm hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        checked={selectedRows.has(index)}
                        onChange={() => toggleRowSelection(index)}
                        className="rounded border-slate-300"
                      />
                      <div className="flex items-center gap-2">
                        <Button size="sm" variant="ghost" className="h-6 w-6 p-0">
                          <Star className="h-3 w-3" />
                        </Button>
                        <Button size="sm" variant="ghost" className="h-6 w-6 p-0">
                          <Flag className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {selectedColumns.map(column => (
                      <div key={column}>
                        <Label className="text-xs text-slate-500">{column}</Label>
                        <p className="text-sm font-medium text-slate-700">{item[column]}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )

      case 'chart':
        return (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="border border-slate-200 bg-white shadow-sm">
              <CardHeader>
                <CardTitle className="text-lg font-semibold">Data Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64 flex items-center justify-center text-slate-500">
                  <BarChart3 className="h-12 w-12 mr-3" />
                  Chart visualization would be rendered here
                </div>
              </CardContent>
            </Card>
            <Card className="border border-slate-200 bg-white shadow-sm">
              <CardHeader>
                <CardTitle className="text-lg font-semibold">Trend Analysis</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64 flex items-center justify-center text-slate-500">
                  <TrendingUp className="h-12 w-12 mr-3" />
                  Trend chart would be rendered here
                </div>
              </CardContent>
            </Card>
          </div>
        )

      default:
        return null
    }
  }

  return (
    <div className={`space-y-6 ${isFullscreen ? 'fixed inset-0 bg-white z-50 p-6' : ''}`}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">{title}</h2>
          <p className="text-slate-600">{description}</p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsFullscreen(!isFullscreen)}
          >
            {isFullscreen ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
          </Button>
          <Button variant="outline" size="sm">
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
        </div>
      </div>

      {/* Controls */}
      <Card className="border border-slate-200 bg-white shadow-sm">
        <CardContent className="p-4">
          <div className="flex flex-wrap items-center gap-4">
            {/* Search */}
            {enableSearch && (
              <div className="flex-1 min-w-64">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <Input
                    placeholder="Search data..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
            )}

            {/* View Selector */}
            {enableViews && (
              <div className="flex items-center gap-2">
                <Label className="text-sm font-medium">View:</Label>
                <div className="flex border border-slate-200 rounded-lg">
                  {dataViews.map(view => (
                    <Button
                      key={view.id}
                      variant={selectedView === view.id ? 'default' : 'ghost'}
                      size="sm"
                      onClick={() => setSelectedView(view.id as any)}
                      className="h-8 px-3 rounded-none"
                    >
                      <view.icon className="h-4 w-4" />
                    </Button>
                  ))}
                </div>
              </div>
            )}

            {/* Export */}
            {enableExport && (
              <div className="flex items-center gap-2">
                <Label className="text-sm font-medium">Export:</Label>
                <Select onValueChange={(value) => handleExport(value as any)}>
                  <SelectTrigger className="w-24 h-8">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {exportOptions.map(option => (
                      <SelectItem key={option.format} value={option.format}>
                        <div className="flex items-center gap-2">
                          <option.icon className="h-4 w-4" />
                          {option.name}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            {/* Advanced Filters Toggle */}
            {enableFilters && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
              >
                <Filter className="h-4 w-4 mr-2" />
                Filters {showAdvancedFilters ? <ChevronDown className="h-4 w-4 ml-1" /> : <ChevronRight className="h-4 w-4 ml-1" />}
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Advanced Filters */}
      {showAdvancedFilters && enableFilters && (
        <Card className="border border-slate-200 bg-white shadow-sm">
          <CardContent className="p-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filters.map(filter => (
                <div key={filter.id} className="space-y-2">
                  <Label className="text-sm font-medium">{filter.name}</Label>
                  {filter.type === 'select' && (
                    <Select value={filter.value} onValueChange={(value) => handleFilterChange(filter.id, value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select..." />
                      </SelectTrigger>
                      <SelectContent>
                        {filter.options?.map(option => (
                          <SelectItem key={option} value={option}>
                            {option}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                  {filter.type === 'range' && (
                    <div className="space-y-2">
                      <Slider
                        value={filter.value}
                        onValueChange={(value) => handleFilterChange(filter.id, value)}
                        min={filter.min}
                        max={filter.max}
                        step={1}
                        className="w-full"
                      />
                      <div className="flex justify-between text-xs text-slate-500">
                        <span>{filter.value[0]}</span>
                        <span>{filter.value[1]}</span>
                      </div>
                    </div>
                  )}
                  {filter.type === 'text' && (
                    <Input
                      value={filter.value}
                      onChange={(e) => handleFilterChange(filter.id, e.target.value)}
                      placeholder="Filter..."
                    />
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Column Selector */}
      <Card className="border border-slate-200 bg-white shadow-sm">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <Label className="text-sm font-medium">Visible Columns:</Label>
            <div className="flex flex-wrap gap-2">
              {columns.map(column => (
                <Button
                  key={column}
                  variant={selectedColumns.includes(column) ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => toggleColumn(column)}
                  className="text-xs"
                >
                  {column}
                </Button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Data Summary */}
      <Card className="border border-slate-200 bg-white shadow-sm">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-6">
              <div>
                <span className="text-sm text-slate-600">Total Records:</span>
                <span className="ml-2 font-semibold text-slate-900">{filteredData.length}</span>
              </div>
              <div>
                <span className="text-sm text-slate-600">Selected:</span>
                <span className="ml-2 font-semibold text-slate-900">{selectedRows.size}</span>
              </div>
              <div>
                <span className="text-sm text-slate-600">Page:</span>
                <span className="ml-2 font-semibold text-slate-900">{currentPage} of {totalPages}</span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Label className="text-sm font-medium">Page Size:</Label>
              <Select value={pageSize.toString()} onValueChange={(value) => setPageSize(Number(value))}>
                <SelectTrigger className="w-20 h-8">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="5">5</SelectItem>
                  <SelectItem value="10">10</SelectItem>
                  <SelectItem value="25">25</SelectItem>
                  <SelectItem value="50">50</SelectItem>
                  <SelectItem value="100">100</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Main Data View */}
      <div className="min-h-[400px]">
        {renderDataView()}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <Card className="border border-slate-200 bg-white shadow-sm">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(1)}
                  disabled={currentPage === 1}
                >
                  First
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                  disabled={currentPage === 1}
                >
                  Previous
                </Button>
              </div>
              
              <div className="flex items-center gap-2">
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  let pageNum
                  if (totalPages <= 5) {
                    pageNum = i + 1
                  } else if (currentPage <= 3) {
                    pageNum = i + 1
                  } else if (currentPage >= totalPages - 2) {
                    pageNum = totalPages - 4 + i
                  } else {
                    pageNum = currentPage - 2 + i
                  }
                  
                  return (
                    <Button
                      key={pageNum}
                      variant={currentPage === pageNum ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setCurrentPage(pageNum)}
                      className="w-8 h-8"
                    >
                      {pageNum}
                    </Button>
                  )
                })}
              </div>
              
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                  disabled={currentPage === totalPages}
                >
                  Next
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(totalPages)}
                  disabled={currentPage === totalPages}
                >
                  Last
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}