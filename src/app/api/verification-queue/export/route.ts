import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { format, filter, priority } = await request.json()

    if (!format || !['csv', 'excel'].includes(format)) {
      return NextResponse.json(
        { success: false, error: 'Valid format (csv or excel) is required' },
        { status: 400 }
      )
    }

    // Mock data - in production, this would query your database with filters
    const tasks = [
      {
        id: '1',
        type: 'funding',
        priority: 'high',
        status: 'pending',
        title: 'Conflicting Funding Amount for CyberSecure Inc.',
        companyName: 'CyberSecure Inc.',
        flaggedBy: 'data_verification_agent',
        createdAt: '2024-01-16T10:00:00Z',
        dueDate: '2024-01-18T17:00:00Z'
      },
      {
        id: '2',
        type: 'people',
        priority: 'medium',
        status: 'in_review',
        title: 'Verify CloudGuard Founders via LinkedIn',
        companyName: 'CloudGuard',
        flaggedBy: 'company_profiling_agent',
        createdAt: '2024-01-15T14:30:00Z',
        dueDate: '2024-01-19T17:00:00Z'
      }
    ]

    if (format === 'csv') {
      // Generate CSV content
      const headers = ['ID', 'Type', 'Priority', 'Status', 'Title', 'Company', 'Flagged By', 'Created', 'Due Date']
      const csvRows = [
        headers.join(','),
        ...tasks.map(task => [
          task.id,
          task.type,
          task.priority,
          task.status,
          `"${task.title}"`,
          task.companyName || '',
          task.flaggedBy,
          new Date(task.createdAt).toLocaleDateString(),
          new Date(task.dueDate).toLocaleDateString()
        ].join(','))
      ]
      
      const csvContent = csvRows.join('\n')
      
      return new NextResponse(csvContent, {
        headers: {
          'Content-Type': 'text/csv',
          'Content-Disposition': 'attachment; filename="verification-queue.csv"'
        }
      })
    }

    if (format === 'excel') {
      // For Excel, we'll return a simple CSV with Excel MIME type
      // In production, you'd use a library like xlsx to create proper Excel files
      const headers = ['ID', 'Type', 'Priority', 'Status', 'Title', 'Company', 'Flagged By', 'Created', 'Due Date']
      const csvRows = [
        headers.join('\t'),
        ...tasks.map(task => [
          task.id,
          task.type,
          task.priority,
          task.status,
          task.title,
          task.companyName || '',
          task.flaggedBy,
          new Date(task.createdAt).toLocaleDateString(),
          new Date(task.dueDate).toLocaleDateString()
        ].join('\t'))
      ]
      
      const content = csvRows.join('\n')
      
      return new NextResponse(content, {
        headers: {
          'Content-Type': 'application/vnd.ms-excel',
          'Content-Disposition': 'attachment; filename="verification-queue.xls"'
        }
      })
    }

  } catch (error) {
    console.error('Export API error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to export verification queue' },
      { status: 500 }
    )
  }
}