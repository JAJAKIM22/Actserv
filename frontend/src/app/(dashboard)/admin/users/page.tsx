'use client'
import { useEffect, useState } from 'react'
import { api } from '@/lib/api'
import { UserPlus, Shield, User } from 'lucide-react'

interface UserRecord {
  id: number
  email: string
  first_name: string
  last_name: string
  is_active: boolean
  is_staff: boolean
  is_superuser: boolean
  created_at: string
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState<UserRecord[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({ email: '', first_name: '', last_name: '', password: '', is_staff: false })
  const [error, setError] = useState('')
  const [saving, setSaving] = useState(false)

 const fetchUsers = async () => {
    try {
      const { data } = await api.get('/accounts/users/')
      setUsers(data.results ?? data)  // ← handle both paginated and plain array
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => { fetchUsers() }, [])

  const handleCreate = async () => {
    setSaving(true)
    setError('')
    try {
      await api.post('/accounts/users/', form)
      setShowForm(false)
      setForm({ email: '', first_name: '', last_name: '', password: '', is_staff: false })
      fetchUsers()
    } catch (e: any) {
      setError(e?.response?.data?.email?.[0] ?? e?.response?.data?.detail ?? 'Failed to create user')
    } finally {
      setSaving(false)
    }
  }

  const handleToggleActive = async (user: UserRecord) => {
    await api.patch(`/accounts/users/${user.id}/`, { is_active: !user.is_active })
    fetchUsers()
  }

  if (isLoading) return <div className="text-sm text-gray-400">Loading…</div>

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-semibold text-gray-900">Users</h1>
        <button onClick={() => setShowForm(f => !f)}
          className="flex items-center gap-1.5 bg-blue-600 text-white text-sm px-3 py-2 rounded-lg hover:bg-blue-700 transition-colors">
          <UserPlus size={14} /> New user
        </button>
      </div>

      {/* Create user form */}
      {showForm && (
        <div className="bg-white border border-gray-200 rounded-xl p-5 mb-6 space-y-3">
          <h2 className="text-sm font-medium text-gray-800">Create user</h2>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">First name</label>
              <input value={form.first_name} onChange={e => setForm(f => ({ ...f, first_name: e.target.value }))}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Last name</label>
              <input value={form.last_name} onChange={e => setForm(f => ({ ...f, last_name: e.target.value }))}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Email</label>
            <input value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
              type="email"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Password</label>
            <input value={form.password} onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
              type="password"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
          <div className="flex items-center gap-2">
            <input type="checkbox" id="is_staff" checked={form.is_staff}
              onChange={e => setForm(f => ({ ...f, is_staff: e.target.checked }))}
              className="rounded" />
            <label htmlFor="is_staff" className="text-xs text-gray-600">Staff (admin access)</label>
          </div>
          {error && <p className="text-xs text-red-500">{error}</p>}
          <div className="flex gap-2 pt-1">
            <button onClick={handleCreate} disabled={saving}
              className="bg-blue-600 text-white text-sm px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors">
              {saving ? 'Creating…' : 'Create user'}
            </button>
            <button onClick={() => setShowForm(false)}
              className="text-sm text-gray-500 border border-gray-200 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors">
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Users table */}
      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="text-left px-4 py-3 text-xs font-medium text-gray-500">User</th>
              <th className="text-left px-4 py-3 text-xs font-medium text-gray-500">Role</th>
              <th className="text-left px-4 py-3 text-xs font-medium text-gray-500">Joined</th>
              <th className="text-left px-4 py-3 text-xs font-medium text-gray-500">Status</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {users.map(user => (
              <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-4 py-3">
                  <p className="font-medium text-gray-900">{user.first_name} {user.last_name}</p>
                  <p className="text-xs text-gray-400">{user.email}</p>
                </td>
                <td className="px-4 py-3">
                  <span className={`flex items-center gap-1 w-fit text-xs px-2 py-0.5 rounded-md ${user.is_superuser ? 'bg-purple-50 text-purple-700' : user.is_staff ? 'bg-blue-50 text-blue-700' : 'bg-gray-100 text-gray-600'}`}>
                    {user.is_superuser ? <><Shield size={10} /> Superuser</> : user.is_staff ? <><Shield size={10} /> Staff</> : <><User size={10} /> User</>}
                  </span>
                </td>
                <td className="px-4 py-3 text-xs text-gray-400">
                  {new Date(user.created_at).toLocaleDateString()}
                </td>
                <td className="px-4 py-3">
                  <span className={`text-xs px-2 py-0.5 rounded-full ${user.is_active ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-600'}`}>
                    {user.is_active ? 'Active' : 'Inactive'}
                  </span>
                </td>
                <td className="px-4 py-3 text-right">
                  <button onClick={() => handleToggleActive(user)}
                    className="text-xs text-gray-500 border border-gray-200 px-2.5 py-1.5 rounded-lg hover:bg-gray-50 transition-colors">
                    {user.is_active ? 'Deactivate' : 'Activate'}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}