import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const search = searchParams.get('search') || ''
    const country = searchParams.get('country') || ''

    let whereClause: any = {}

    if (search) {
      whereClause.company_name = {
        contains: search,
        mode: 'insensitive'
      }
    }

    if (country) {
      whereClause.country = country
    }

    const companies = await db.cybersecurityCompany.findMany({
      where: whereClause,
      include: {
        funding_rounds: {
          include: {
            investors: true
          },
          orderBy: {
            announced_date: 'desc'
          }
        }
      },
      orderBy: {
        company_name: 'asc'
      }
    })

    return NextResponse.json(companies)
  } catch (error) {
    console.error('Error fetching companies:', error)
    return NextResponse.json(
      { error: 'Failed to fetch companies' },
      { status: 500 }
    )
  }
}