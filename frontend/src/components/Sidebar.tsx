'use client'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { Database, Layers, FileText, LayoutDashboard, LogOut, ShieldCheck } from 'lucide-react'
import { clearTokens } from '@/lib/auth'

const nav = [
  { href: '/',          label: 'Overview',    icon: LayoutDashboard },
  { href: '/connectors',         label: 'Connectors',  icon: Database },
  { href: '/batches',            label: 'Batches',     icon: Layers },
  { href: '/files',              label: 'Files',       icon: FileText },
  { href: '/admin/users',        label: 'Admin',       icon: ShieldCheck, adminOnly: true },
]

export default function Sidebar() {
  const pathname = usePathname()
  const router = useRouter()

  const logout = () => { clearTokens(); router.push('/login') }

  return (
    <aside className="w-56 bg-white border-r border-gray-200 flex flex-col shrink-0">
      <div className="p-5 border-b border-gray-100">
        <span className="font-semibold text-gray-900 text-sm tracking-tight">DataConnector</span>
      </div>
      <nav className="flex-1 p-3 space-y-0.5">
        {nav.map(({ href, label, icon: Icon }) => {
          const active = pathname.startsWith(href)
          return (
            <Link key={href} href={href}
              className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition-colors
                ${active ? 'bg-blue-50 text-blue-700 font-medium' : 'text-gray-600 hover:bg-gray-50'}`}>
              <Icon size={16} />
              {label}
            </Link>
          )
        })}
      </nav>
      <div className="p-3 border-t border-gray-100">
        <button onClick={logout}
          className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm text-gray-500 hover:bg-gray-50 w-full transition-colors">
          <LogOut size={16} />
          Sign out
        </button>
      </div>
    </aside>
  )
}