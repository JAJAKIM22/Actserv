'use client'
import { useBatches } from '@/lib/hooks/useBatches'
import { useRouter } from 'next/navigation'
import { Plus, Clock, CheckCircle, XCircle, Loader2, FileText } from 'lucide-react'
import Link from 'next/link'
import type { BatchJob } from '@/lib/types'

const STATUS_STYLE: Record<BatchJob['status'], string> = {
  pending:   'bg-gray-100 text-gray-600',
  extracted: 'bg-blue-50 text-blue-700',
  submitted: 'bg-green-50 text-green-700',
  failed:    'bg-red-50 text-red-700',
}

const STATUS_ICON: Record<BatchJob['status'], React.ReactNode> = {
  pending:   <Clock size={12} />,
  extracted: <Loader2 size={12} />,
  submitted: <CheckCircle size={12} />,
  failed:    <XCircle size={12} />,
}

export default function BatchesPage() {
  const { data: batches, isLoading } = useBatches()
  const router = useRouter()

  if (isLoading) return <div className="text-sm text-gray-400">Loading…</div>

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-semibold text-gray-900">Batches</h1>
        <Link href="/batches/new"
          className="flex items-center gap-1.5 bg-blue-600 text-white text-sm px-3 py-2 rounded-lg hover:bg-blue-700 transition-colors">
          <Plus size={14} /> New batch
        </Link>
      </div>

      {batches?.length === 0 && (
        <div className="bg-gray-50 rounded-xl border border-dashed border-gray-200 p-12 text-center">
          <p className="text-sm text-gray-400">No batches yet — create one from a connector.</p>
        </div>
      )}

      <div className="grid gap-3">
        {batches?.map(batch => (
          <div key={batch.id}
            onClick={() => router.push(`/batches/${batch.id}`)}
            className="bg-white border border-gray-200 rounded-xl p-4 flex items-center justify-between cursor-pointer hover:border-blue-200 hover:bg-blue-50/30 transition-colors">
            <div className="flex items-center gap-3">
              <FileText size={18} className="text-gray-400 shrink-0" />
              <div>
                <p className="text-sm font-medium text-gray-900">
                  Batch #{batch.id} — {batch.table_name}
                </p>
                <p className="text-xs text-gray-400 mt-0.5">
                  {batch.batch_size} rows · offset {batch.offset} · {new Date(batch.created_at).toLocaleString()}
                </p>
              </div>
            </div>
            <span className={`flex items-center gap-1 text-xs font-medium px-2.5 py-1 rounded-full ${STATUS_STYLE[batch.status]}`}>
              {STATUS_ICON[batch.status]}
              {batch.status}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}