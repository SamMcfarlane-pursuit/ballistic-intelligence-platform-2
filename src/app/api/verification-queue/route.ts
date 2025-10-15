import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const filter = searchParams.get('filter') || 'all'
    const priority = searchParams.get('priority') || 'all'

    const where: any = {}
    if (filter !== 'all') {
      where.type = filter
    }
    if (priority !== 'all') {
      where.priority = priority
    }

    const tasks = await prisma.verificationTask.findMany({ where })
    const stats = await prisma.verificationStats.findFirst()

    return NextResponse.json({
      success: true,
      tasks: tasks,
      stats: stats,
      message: 'Verification queue loaded successfully'
    })

  } catch (error) {
    console.error('Verification queue API error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to load verification queue' },
      { status: 500 }
    )
  }
}
