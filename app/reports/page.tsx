'use client'

import { useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { signOut } from 'next-auth/react'
import { ReportsTable } from '@/components/ReportsTable'
import { Button } from '@/components/ui/button'

export default function ReportsPage() {
  const { data: session, status } = useSession()
  const router = useRouter()

  useEffect(() => {
    if (status === 'loading') return // Still loading

    if (!session) {
      router.push('/login')
      return
    }

    if (!session.user?.isAdmin) {
      router.push('/')
      return
    }
  }, [session, status, router])

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center" dir="rtl">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#005072]"></div>
      </div>
    )
  }

  if (!session || !session.user?.isAdmin) {
    return null
  }

  const handleSignOut = () => {
    signOut({ callbackUrl: '/' })
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100" dir="rtl">
      <div className="container mx-auto px-4 py-4 md:py-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 md:mb-8 gap-4">
          <div className="w-full md:w-auto">
            <h1 className="text-2xl md:text-3xl font-bold text-[#005072] text-right">لوحة الإدارة</h1>
            <p className="text-gray-600 text-right">إدارة تقارير المشاكل المقدمة</p>
          </div>
          <div className="flex flex-col md:flex-row items-start md:items-center gap-2 md:gap-4 w-full md:w-auto">
            <span className="text-sm text-gray-600 text-right">
              مرحباً، {session.user.email}
            </span>
            <Button 
              variant="outline" 
              onClick={handleSignOut}
              className="border-[#005072] text-[#005072] hover:bg-[#005072] hover:text-white w-full md:w-auto"
            >
              تسجيل الخروج
            </Button>
          </div>
        </div>

        {/* Reports Table */}
        <ReportsTable />
      </div>
    </div>
  )
}