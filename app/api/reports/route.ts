import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function POST(request: NextRequest) {
  try {
    console.log('POST request received')
    const body = await request.json()
    console.log('Received request body:', body)
    const { name, collegeId, contactNumber, issue } = body

    // Validate required fields and collect missing ones
    const fieldLabels: Record<string, string> = {
      name: 'الاسم الكامل',
      collegeId: 'الرقم الجامعي',
      contactNumber: 'رقم الهاتف',
      issue: 'وصف الشكوى أو المشكلة',
    }
    const missing: string[] = []
    if (!name?.trim()) missing.push(fieldLabels.name)
    if (!collegeId?.trim()) missing.push(fieldLabels.collegeId)
    if (!contactNumber?.trim()) missing.push(fieldLabels.contactNumber)
    if (!issue?.trim()) missing.push(fieldLabels.issue)

    if (missing.length > 0) {
      console.log('Validation failed: missing required fields', missing)
      return NextResponse.json(
        { error: 'الحقول المطلوبة: ' + missing.join('، ') },
        { status: 400 }
      )
    }

    // Validate collegeId and contactNumber are digits only
    if (!/^\d+$/.test(collegeId) || !/^\d+$/.test(contactNumber)) {
      console.log('Validation failed: invalid digits')
      return NextResponse.json(
        { error: 'الرقم الجامعي ورقم الهاتف يجب أن يحتويان على أرقام فقط' },
        { status: 400 }
      )
    }

    console.log('Creating report with data:', { name, collegeId, contactNumber, issue })
    
    const reportData = {
      name,
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