'use client'
import { useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { useBatch, useExtractBatch, useSubmitBatch } from '@/lib/hooks/useBatches'
import DataGrid from '@/components/DataGrid'
import { Download, Send, RefreshCw, CheckCircle } from 'lucide-react'
import type { BatchJob } from '@/lib/types'

export default function BatchDetailPage() {
  const { id } = useParams<{ id: string }>()
  const router = useRouter()
  const { data: batch, isLoading } = useBatch(Number(id))
  const extract = useExtractBatch(Number(id))
  const submit = useSubmitBatch(Number(id))
  const [editedRows, setEditedRows] = useState<Record<string, unknown>[] | null>(null)

  if (isLoading) return <div className="text-sm text-gray-400">Loading…</div>
  if (!batch) return null

  const displayData = editedRows
    ? { ...batch.edited_data, rows: editedRows }
    : batch.edited_data

  const handleSubmit = async () => {
    await submit.mutateAsync(displayData)
    router.push('/files')
  }

  const statusColor: Record<BatchJob['status'], string> = {
    pending:   'bg-gray-100 text-gray-600',
    extracted: 'bg-blue-50 text-blue-700',
    submitted: 'bg-green-50 text-green-700',
    failed:    'bg-red-50 text-red-700',
  }

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-gray-900">Batch #{batch.id}</h1>
          <p className="text-sm text-gray-400 mt-0.5">{batch.table_name} · {batch.batch_size} rows · offset {batch.offset}</p>
        </div>
        <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${statusColor[batch.status]}`}>
          {batch.status}
        </span>
      </div>

      {/* Action bar */}
      <div className="flex gap-2">
        {batch.status === 'pending' && (
          <button onClick={() => extract.mutate()}
            disabled={extract.isPending}
            className="flex items-center gap-1.5 bg-blue-600 text-white text-sm px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors">
            <RefreshCw size={14} className={extract.isPending ? 'animate-spin' : ''} />
            {extract.isPending ? 'Extracting…' : 'Extract data'}
          </button>
        )}
        {batch.status === 'extracted' && (
          <button onClick={handleSubmit}
            disabled={submit.isPending}
            className="flex items-center gap-1.5 bg-green-600 text-white text-sm px-4 py-2 rounded-lg hover:bg-green-700 disabled:opacity-50 transition-colors">
            <Send size={14} />
            {submit.isPending ? 'Submitting…' : 'Submit & save'}
          </button>
        )}
        {batch.status === 'submitted' && (
          <div className="flex items-center gap-1.5 text-green-600 text-sm font-medium">
            <CheckCircle size={16} /> Submitted — file saved
          </div>
        )}
      </div>

      {/* Data grid */}
      {displayData?.rows?.length > 0 ? (
        <DataGrid
          columns={displayData.columns}
          rows={displayData.rows}
          onChange={setEditedRows}
        />
      ) : batch.status === 'pending' ? (
        <div className="bg-gray-50 rounded-xl border border-dashed border-gray-200 p-12 text-center">
          <p className="text-sm text-gray-400">Click "Extract data" to pull records from the source database.</p>
        </div>
      ) : null}
    </div>
  )
}