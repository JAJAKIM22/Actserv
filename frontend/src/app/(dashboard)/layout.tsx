'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { getAccessToken } from '@/lib/auth'
import Sidebar from '@/components/Sidebar'

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const [checked, setChecked] = useState(false)

  useEffect(() => {
    if (!getAccessToken()) {
      router.replace('/login')
    } else {
      setChecked(true)
    }
  }, [router])

  if (!checked) return null  // wait for auth check before rendering

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      <main className="flex-1 overflow-auto p-6">{children}</main>
    </div>
  )
}