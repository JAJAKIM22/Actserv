'use client'
import { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useConnectors } from '@/lib/hooks/useConnectors'
import { api } from '@/lib/api'

export default function NewBatchPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { data: connectors, isLoading } = useConnectors()

  const [form, setForm] = useState({
    connector: searchParams.get('connector') ?? '',
    table_name: '',
    batch_size: '100',
    offset: '0',
  })
  const [error, setError] = useState('')
  const [saving, setSaving] = useState(false)

  const set = (k: string, v: string) => setForm(f => ({ ...f, [k]: v }))

  const handleSubmit = async () => {
    if (!form.connector) return setError('Please select a connector')
    if (!form.table_name) return setError('Please enter a table name')
    setSaving(true)
    setError('')
    try {
      const { data } = await api.post('/batches/', {
        connection: Number(form.connector),
        table_name: form.table_name,
        batch_size: Number(form.batch_size),
        offset: Number(form.offset),
      })
      router.push(`/batches/${data.id}`)
    } catch (e: any) {
      setError(e?.response?.data?.detail ?? JSON.stringify(e?.response?.data) ?? 'Failed to create batch')
    } finally {
      setSaving(false)
    }
  }

  if (isLoading) return <div className="text-sm text-gray-400">Loading…</div>

  return (
    <div className="max-w-lg">
      <h1 className="text-xl font-semibold text-gray-900 mb-6">New batch</h1>

      <div className="bg-white border border-gray-200 rounded-xl p-6 space-y-4">

        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">Connector</label>
          <select value={form.connector} onChange={e => set('connector', e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
            <option value="">Select a connector…</option>
            {connectors?.map(c => (
              <option key={c.id} value={c.id}>{c.name} ({c.db_type})</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">Table name</label>
          <input value={form.table_name} onChange={e => set('table_name', e.target.value)}
            placeholder="e.g. users"
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Batch size</label>
            <input value={form.batch_size} onChange={e => set('batch_size', e.target.value)}
              type="number" min="1" max="10000"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Offset</label>
            <input value={form.offset} onChange={e => set('offset', e.target.value)}
              type="number" min="0"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
        </div>

        {error && <p className="text-xs text-red-500">{error}</p>}

        <div className="flex gap-2 pt-2">
          <button onClick={handleSubmit} disabled={saving}
            className="bg-blue-600 text-white text-sm px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors">
            {saving ? 'Creating…' : 'Create batch'}
          </button>
          <button onClick={() => router.back()}
            className="text-sm text-gray-500 border border-gray-200 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors">
            Cancel
          </button>
        </div>
      </div>
    </div>
  )
}