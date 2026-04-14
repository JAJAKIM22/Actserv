'use client'
import { useState } from 'react'
import { useConnectors, useTestConnector } from '@/lib/hooks/useConnectors'
import { Plus, Zap, CheckCircle, XCircle } from 'lucide-react'
import Link from 'next/link'

const DB_COLORS: Record<string, string> = {
  postgresql: 'bg-blue-50 text-blue-700',
  mysql:      'bg-orange-50 text-orange-700',
  mongodb:    'bg-green-50 text-green-700',
  clickhouse: 'bg-yellow-50 text-yellow-700',
}

export default function ConnectorsPage() {
  const { data: connectors, isLoading } = useConnectors()
  const [testResults, setTestResults] = useState<Record<number, 'ok' | 'failed' | 'loading'>>({})

  const handleTest = async (id: number) => {
    setTestResults(r => ({ ...r, [id]: 'loading' }))
    try {
      const { data } = await (await import('@/lib/api')).api.post(`/connectors/${id}/test/`)
      setTestResults(r => ({ ...r, [id]: data.status === 'ok' ? 'ok' : 'failed' }))
    } catch {
      setTestResults(r => ({ ...r, [id]: 'failed' }))
    }
  }

  if (isLoading) return <div className="text-sm text-gray-400">Loading…</div>

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-semibold text-gray-900">Connectors</h1>
        <Link href="/connectors/new"
          className="flex items-center gap-1.5 bg-blue-600 text-white text-sm px-3 py-2 rounded-lg hover:bg-blue-700 transition-colors">
          <Plus size={14} /> New connector
        </Link>
      </div>

      <div className="grid gap-3">
        {connectors?.map(conn => (
          <div key={conn.id} className="bg-white border border-gray-200 rounded-xl p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className={`text-xs font-medium px-2 py-0.5 rounded-md ${DB_COLORS[conn.db_type]}`}>
                {conn.db_type}
              </span>
              <div>
                <p className="text-sm font-medium text-gray-900">{conn.name}</p>
                <p className="text-xs text-gray-400">{conn.host}:{conn.port} / {conn.database}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {testResults[conn.id] === 'ok' && <CheckCircle size={16} className="text-green-500" />}
              {testResults[conn.id] === 'failed' && <XCircle size={16} className="text-red-500" />}
              <button onClick={() => handleTest(conn.id)}
                disabled={testResults[conn.id] === 'loading'}
                className="flex items-center gap-1 text-xs text-gray-500 border border-gray-200 px-2.5 py-1.5 rounded-lg hover:bg-gray-50 disabled:opacity-50 transition-colors">
                <Zap size={12} />
                {testResults[conn.id] === 'loading' ? 'Testing…' : 'Test'}
              </button>
              <Link href={`/batches/new?connector=${conn.id}`}
                className="text-xs text-blue-600 border border-blue-200 px-2.5 py-1.5 rounded-lg hover:bg-blue-50 transition-colors">
                Extract data
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}