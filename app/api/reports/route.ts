import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function POST(request: NextRequest) {
  try {
    console.log('POST request received')
    const body = await request.json()
    console.log('Received request body:', body)
    const { name, nationalId, collegeId, contactNumber, issue } = body

    // Validate required fields
    if (!name || !nationalId || !collegeId || !contactNumber || !issue) {
      console.log('Validation failed: missing required fields')
      return NextResponse.json(
        { error: 'جميع الحقول مطلوبة' },
        { status: 400 }
      )
    }

    // Validate nationalId, collegeId, and contactNumber are digits only
    if (!/^\d+$/.test(nationalId) || !/^\d+$/.test(collegeId) || !/^\d+$/.test(contactNumber)) {
      console.log('Validation failed: invalid digits')
      return NextResponse.json(
        { error: 'رقم الهوية الوطنية ورقم الكلية ورقم الهاتف يجب أن تحتوي على أرقام فقط' },
        { status: 400 }
      )
    }

    console.log('Creating report with data:', { name, nationalId, collegeId, contactNumber, issue })
    
    const reportData = {
      name,
      nationalId,
      collegeId,
      contactNumber,
      issue
    }
    
    console.log('About to create report with Prisma...')
    const report = await prisma.report.create({
      data: reportData
    })

    console.log('Report created successfully:', report)
    return NextResponse.json(report, { status: 201 })
  } catch (error) {
    console.error('Error creating report:', error)
    return NextResponse.json(
      { error: 'خطأ في الخادم، يرجى المحاولة مرة أخرى' },
      { status: 500 }
    )
  }
}

export async function GET() {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.isAdmin) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const reports = await prisma.report.findMany({
      orderBy: { createdAt: 'desc' }
    })

    return NextResponse.json(reports)
  } catch (error) {
    console.error('Error fetching reports:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}