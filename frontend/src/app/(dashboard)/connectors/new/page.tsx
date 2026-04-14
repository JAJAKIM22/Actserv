'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { api } from '@/lib/api'

const DB_TYPES = ['postgresql', 'mysql', 'mongodb', 'clickhouse']

export default function NewConnectorPage() {
  const router = useRouter()
  const [form, setForm] = useState({
    name: '', db_type: 'postgresql', host: '',
    port: '5432', database: '', username: '', password: '',
  })
  const [error, setError] = useState('')
  const [saving, setSaving] = useState(false)

  const set = (k: string, v: string) => setForm(f => ({ ...f, [k]: v }))

  const handleSubmit = async () => {
    setSaving(true)
    setError('')
    try {
      await api.post('/connectors/', { ...form, port: Number(form.port) })
      router.push('/connectors')
    } catch (e: any) {
      setError(e?.response?.data?.detail ?? 'Failed to save connector')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="max-w-lg">
      <h1 className="text-xl font-semibold text-gray-900 mb-6">New connector</h1>

      <div className="bg-white border border-gray-200 rounded-xl p-6 space-y-4">

        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">Name</label>
          <input value={form.name} onChange={e => set('name', e.target.value)}
            placeholder="e.g. Production DB"
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
        </div>

        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">Database type</label>
          <select value={form.db_type} onChange={e => set('db_type', e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
            {DB_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
          </select>
        </div>

        <div className="grid grid-cols-3 gap-3">
          <div className="col-span-2">
            <label className="block text-xs font-medium text-gray-600 mb-1">Host</label>
            <input value={form.host} onChange={e => set('host', e.target.value)}
              placeholder="localhost"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Port</label>
            <input value={form.port} onChange={e => set('port', e.target.value)}
              placeholder="5432"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
        </div>

        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">Database</label>
          <input value={form.database} onChange={e => set('database', e.target.value)}
            placeholder="my_database"
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Username</label>
            <input value={form.username} onChange={e => set('username', e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Password</label>
            <input value={form.password} onChange={e => set('password', e.target.value)}
              type="password"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
        </div>

        {error && <p className="text-xs text-red-500">{error}</p>}

        <div className="flex gap-2 pt-2">
          <button onClick={handleSubmit} disabled={saving}
            className="bg-blue-600 text-white text-sm px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors">
            {saving ? 'Saving…' : 'Save connector'}
          </button>
          <button onClick={() => router.push('/connectors')}
            className="text-sm text-gray-500 border border-gray-200 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors">
            Cancel
          </button>
        </div>
      </div>
    </div>
  )
}