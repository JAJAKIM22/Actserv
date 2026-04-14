'use client'
import { useEffect, useState } from 'react'
import { api } from '@/lib/api'
import { Database, Layers, FileJson, Users } from 'lucide-react'
import Link from 'next/link'

interface Stats {
  connectors: number
  batches: number
  files: number
  users: number
}

export default function DashboardPage() {
  const [stats, setStats] = useState<Stats>({ connectors: 0, batches: 0, files: 0, users: 0 })
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetch = async () => {
      try {
        const [c, b, f] = await Promise.all([
          api.get('/connectors/'),
          api.get('/batches/'),
          api.get('/files/'),
        ])
        setStats({
          connectors: c.data.length ?? c.data.count ?? 0,
          batches:    b.data.length ?? b.data.count ?? 0,
          files:      f.data.length ?? f.data.count ?? 0,
          users:      0,
        })
      } finally {
        setIsLoading(false)
      }
    }
    fetch()
  }, [])

  const cards = [
    { label: 'Connectors', value: stats.connectors, icon: Database,  href: '/connectors', color: 'text-blue-600',   bg: 'bg-blue-50' },
    { label: 'Batches',    value: stats.batches,    icon: Layers,     href: '/batches',    color: 'text-purple-600', bg: 'bg-purple-50' },
    { label: 'Files',      value: stats.files,      icon: FileJson,   href: '/files',      color: 'text-green-600',  bg: 'bg-green-50' },
    { label: 'Users',      value: stats.users,      icon: Users,      href: '/admin/users',color: 'text-orange-600', bg: 'bg-orange-50' },
  ]

  return (
    <div>
      <h1 className="text-xl font-semibold text-gray-900 mb-6">Overview</h1>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {cards.map(({ label, value, icon: Icon, href, color, bg }) => (
          <Link key={label} href={href}
            className="bg-white border border-gray-200 rounded-xl p-5 hover:border-blue-200 hover:shadow-sm transition-all">
            <div className={`w-9 h-9 rounded-lg ${bg} flex items-center justify-center mb-3`}>
              <Icon size={18} className={color} />
            </div>
            <p className="text-2xl font-semibold text-gray-900">
              {isLoading ? '—' : value}
            </p>
            <p className="text-xs text-gray-400 mt-0.5">{label}</p>
          </Link>
        ))}
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <div className="bg-white border border-gray-200 rounded-xl p-5">
          <h2 className="text-sm font-medium text-gray-800 mb-4">Quick actions</h2>
          <div className="space-y-2">
            <Link href="/connectors/new"
              className="flex items-center gap-2 text-sm text-gray-600 hover:text-blue-600 hover:bg-blue-50 px-3 py-2 rounded-lg transition-colors">
              <Database size={15} /> Add a new connector
            </Link>
            <Link href="/batches/new"
              className="flex items-center gap-2 text-sm text-gray-600 hover:text-blue-600 hover:bg-blue-50 px-3 py-2 rounded-lg transition-colors">
              <Layers size={15} /> Create a new batch
            </Link>
            <Link href="/files"
              className="flex items-center gap-2 text-sm text-gray-600 hover:text-blue-600 hover:bg-blue-50 px-3 py-2 rounded-lg transition-colors">
              <FileJson size={15} /> View exported files
            </Link>
            <Link href="/admin/users"
              className="flex items-center gap-2 text-sm text-gray-600 hover:text-blue-600 hover:bg-blue-50 px-3 py-2 rounded-lg transition-colors">
              <Users size={15} /> Manage users
            </Link>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-xl p-5">
          <h2 className="text-sm font-medium text-gray-800 mb-4">Getting started</h2>
          <ol className="space-y-3">
            {[
              { step: '1', text: 'Add a connector to your database', href: '/connectors/new' },
              { step: '2', text: 'Test the connection', href: '/connectors' },
              { step: '3', text: 'Create a batch to extract data', href: '/batches/new' },
              { step: '4', text: 'Review and submit the batch', href: '/batches' },
              { step: '5', text: 'Download the exported file', href: '/files' },
            ].map(({ step, text, href }) => (
              <li key={step}>
                <Link href={href} className="flex items-center gap-3 text-sm text-gray-600 hover:text-blue-600 transition-colors">
                  <span className="w-5 h-5 rounded-full bg-gray-100 text-gray-500 text-xs flex items-center justify-center font-medium shrink-0">
                    {step}
                  </span>
                  {text}
                </Link>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </div>
  )
}