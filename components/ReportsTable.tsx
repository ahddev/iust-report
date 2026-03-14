'use client'

import { useEffect, useState } from 'react'
import ExcelJS from 'exceljs'
import { Download, ChevronDown } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Button } from '@/components/ui/button'

interface Report {
  id: string
  name: string
  collegeId: string
  contactNumber: string
  issue: string
  createdAt: string
}

export function ReportsTable() {
  const [reports, setReports] = useState<Report[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [expandedIssues, setExpandedIssues] = useState<Set<string>>(new Set())

  useEffect(() => {
    fetchReports()
  }, [])

  const fetchReports = async () => {
    try {
      const response = await fetch('/api/reports')
      if (response.ok) {
        const data = await response.json()
        setReports(data)
      } else {
        setError('Failed to fetch reports')
      }
    } catch {
      setError('An error occurred while fetching reports')
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const handleExportExcel = async () => {
    const workbook = new ExcelJS.Workbook()
    const worksheet = workbook.addWorksheet('التقارير', { views: [{ rightToLeft: true }] })

    // Column definitions with widths
    worksheet.columns = [
      { header: 'الاسم', key: 'name', width: 22 },
      { header: 'رقم جامعي', key: 'collegeId', width: 14 },
      { header: 'رقم الهاتف', key: 'contactNumber', width: 16 },
      { header: 'المشكلة', key: 'issue', width: 55 },
      { header: 'تاريخ التقديم', key: 'createdAt', width: 22 }
    ]

    // Style header row: bold, brand color background, white text
    const headerRow = worksheet.getRow(1)
    headerRow.font = { bold: true, color: { argb: 'FFFFFFFF' }, size: 12 }
    headerRow.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FF005072' }
    }
    headerRow.alignment = { horizontal: 'right', vertical: 'middle', wrapText: true }
    headerRow.height = 28

    // Add data rows
    reports.forEach((report) => {
      worksheet.addRow({
        name: report.name,
        collegeId: report.collegeId,
        contactNumber: report.contactNumber,
        issue: report.issue,
        createdAt: formatDate(report.createdAt)
      })
    })

    // Style data rows: right align, wrap text for issue column
    worksheet.eachRow((row: { alignment?: object; getCell: (n: number) => { alignment?: object } }, rowNumber: number) => {
      if (rowNumber > 1) {
        row.alignment = { horizontal: 'right', vertical: 'top', wrapText: true }
        row.getCell(4).alignment = { horizontal: 'right', vertical: 'top', wrapText: true }
      }
    })

    // Add borders to all cells
    worksheet.eachRow((row: { eachCell: (fn: (cell: { border?: object }) => void) => void }) => {
      row.eachCell((cell: { border?: object }) => {
        cell.border = {
          top: { style: 'thin' },
          left: { style: 'thin' },
          bottom: { style: 'thin' },
          right: { style: 'thin' }
        }
      })
    })

    // Download (browser)
    const buffer = await workbook.xlsx.writeBuffer()
    const blob = new Blob([buffer], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `reports-${new Date().toISOString().slice(0, 10)}.xlsx`
    a.click()
    URL.revokeObjectURL(url)
  }

  const expandAll = () => setExpandedIssues(new Set(reports.map((r) => r.id)))
  const collapseAll = () => setExpandedIssues(new Set())

  const toggleIssueExpansion = (reportId: string) => {
    setExpandedIssues(prev => {
      const newSet = new Set(prev)
      if (newSet.has(reportId)) {
        newSet.delete(reportId)
      } else {
        newSet.add(reportId)
      }
      return newSet
    })
  }

  const isIssueExpanded = (reportId: string) => expandedIssues.has(reportId)
  const shouldShowReadMore = (issue: string) => issue.length > 100

  if (loading) {
    return (
      <Card className="w-full" dir="rtl">
        <CardHeader>
          <CardTitle className="text-right">التقارير</CardTitle>
          <CardDescription className="text-right">جاري تحميل التقارير...</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex justify-center items-center h-32">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#005072]"></div>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (error) {
    return (
      <Card className="w-full" dir="rtl">
        <CardHeader>
          <CardTitle className="text-right">التقارير</CardTitle>
          <CardDescription className="text-right">خطأ في تحميل التقارير</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-red-600 text-center">{error}</div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="w-full" dir="rtl">
      <CardHeader>
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <CardTitle className="text-right">التقارير المقدمة</CardTitle>
            <CardDescription className="text-right">
              جميع تقارير المشاكل المقدمة ({reports.length} إجمالي)
            </CardDescription>
          </div>
          <div className="flex flex-wrap gap-2 shrink-0">
            <Button
              variant="outline"
              onClick={expandAll}
              disabled={reports.length === 0}
              className="border-[#005072] text-[#005072] hover:bg-[#005072] hover:text-white"
            >
              <ChevronDown className="size-4" />
              توسيع الكل
            </Button>
            <Button
              variant="outline"
              onClick={collapseAll}
              disabled={reports.length === 0}
              className="border-[#005072] text-[#005072] hover:bg-[#005072] hover:text-white"
            >
              طي الكل
            </Button>
            <Button
              variant="outline"
              onClick={handleExportExcel}
              disabled={reports.length === 0}
              className="border-[#005072] text-[#005072] hover:bg-[#005072] hover:text-white"
            >
              <Download className="size-4" />
              تصدير إلى Excel
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {reports.length === 0 ? (
          <div className="text-center text-gray-500 py-8">
            لم يتم تقديم أي تقارير بعد.
          </div>
        ) : (
          <>
            {/* Desktop Table */}
            <div className="hidden md:block overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-right">الاسم</TableHead>
                    <TableHead className="text-right">رقم جامعي</TableHead>
                    <TableHead className="text-right">رقم الهاتف</TableHead>
                    <TableHead className="text-right">المشكلة</TableHead>
                    <TableHead className="text-right">تاريخ التقديم</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {reports.map((report) => (
                    <TableRow key={report.id}>
                      <TableCell className="font-medium text-right">{report.name}</TableCell>
                      <TableCell className="text-right">{report.collegeId}</TableCell>
                      <TableCell className="text-right">{report.contactNumber}</TableCell>
                      <TableCell className="max-w-md min-w-48">
                        <div className="break-words text-right">
                          {isIssueExpanded(report.id) ? (
                            <div>
                              <div className="whitespace-pre-wrap">{report.issue}</div>
                              {shouldShowReadMore(report.issue) && (
                                <button
                                  onClick={() => toggleIssueExpansion(report.id)}
                                  className="text-blue-600 hover:text-blue-800 text-sm mt-1 underline"
                                >
                                  قراءة أقل
                                </button>
                              )}
                            </div>
                          ) : (
                            <div>
                              <div className="break-words">
                                {shouldShowReadMore(report.issue) 
                                  ? `${report.issue.substring(0, 100)}...` 
                                  : report.issue
                                }
                              </div>
                              {shouldShowReadMore(report.issue) && (
                                <button
                                  onClick={() => toggleIssueExpansion(report.id)}
                                  className="text-blue-600 hover:text-blue-800 text-sm mt-1 underline"
                                >
                                  اقرأ المزيد
                                </button>
                              )}
                            </div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="text-right">{formatDate(report.createdAt)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            {/* Mobile Cards */}
            <div className="md:hidden space-y-4">
              {reports.map((report) => (
                <Card key={report.id} className="p-4">
                  <div className="space-y-3">
                    <div className="flex justify-between items-start">
                      <span className="text-sm font-medium text-gray-600">الاسم:</span>
                      <span className="text-sm font-medium text-right">{report.name}</span>
                    </div>
                    <div className="flex justify-between items-start">
                      <span className="text-sm font-medium text-gray-600">رقم جامعي:</span>
                      <span className="text-sm text-right">{report.collegeId}</span>
                    </div>
                    <div className="flex justify-between items-start">
                      <span className="text-sm font-medium text-gray-600">رقم الهاتف:</span>
                      <span className="text-sm text-right">{report.contactNumber}</span>
                    </div>
                    <div className="flex justify-between items-start">
                      <span className="text-sm font-medium text-gray-600">تاريخ التقديم:</span>
                      <span className="text-sm text-right">{formatDate(report.createdAt)}</span>
                    </div>
                    <div className="border-t pt-3">
                      <div className="flex justify-between items-start mb-2">
                        <span className="text-sm font-medium text-gray-600">المشكلة:</span>
                      </div>
                      <div className="text-right">
                        {isIssueExpanded(report.id) ? (
                          <div>
                            <div className="whitespace-pre-wrap text-sm">{report.issue}</div>
                            {shouldShowReadMore(report.issue) && (
                              <button
                                onClick={() => toggleIssueExpansion(report.id)}
                                className="text-blue-600 hover:text-blue-800 text-sm mt-2 underline"
                              >
                                قراءة أقل
                              </button>
                            )}
                          </div>
                        ) : (
                          <div>
                            <div className="break-words text-sm">
                              {shouldShowReadMore(report.issue) 
                                ? `${report.issue.substring(0, 100)}...` 
                                : report.issue
                              }
                            </div>
                            {shouldShowReadMore(report.issue) && (
                              <button
                                onClick={() => toggleIssueExpansion(report.id)}
                                className="text-blue-600 hover:text-blue-800 text-sm mt-2 underline"
                              >
                                اقرأ المزيد
                              </button>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </>
        )}
      </CardContent>
    </Card>
  )
}