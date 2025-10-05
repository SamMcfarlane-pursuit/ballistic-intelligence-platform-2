import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const conventionId = searchParams.get('conventionId')
    const status = searchParams.get('status')
    const minScore = searchParams.get('minScore')
    const category = searchParams.get('category')

    let whereClause: any = {}
    
    if (conventionId && conventionId !== 'all') {
      whereClause.convention_id = conventionId
    }
    
    if (status && status !== 'all') {
      whereClause.status = status
    }
    
    if (minScore) {
      whereClause.overall_fit_score = {
        gte: parseInt(minScore)
      }
    }
    
    if (category && category !== 'all') {
      whereClause.cybersecurity_category = category
    }

    const companies = await db.conventionCompany.findMany({
      where: whereClause,
      orderBy: [
        { overall_fit_score: 'desc' },
        { status: 'asc' }
      ],
      include: {
        convention: {
          select: {
            name: true,
            location: true,
            start_date: true,
            end_date: true
          }
        }
      }
    })

    return NextResponse.json({
      success: true,
      data: companies
    })
  } catch (error) {
    console.error('Error fetching convention companies:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch convention companies' },
      { status: 500 }
    )
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { id, ...updateData } = body

    const updatedCompany = await db.conventionCompany.update({
      where: { id },
      data: updateData
    })

    return NextResponse.json({
      success: true,
      data: updatedCompany
    })
  } catch (error) {
    console.error('Error updating convention company:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to update company' },
      { status: 500 }
    )
  }
}