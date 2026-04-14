'use client'
import {
  useReactTable, getCoreRowModel, flexRender,
  type ColumnDef, type CellContext,
} from '@tanstack/react-table'
import { useState, useCallback } from 'react'

interface DataGridProps {
  columns: string[]
  rows: Record<string, unknown>[]
  onChange: (rows: Record<string, unknown>[]) => void
}

function EditableCell({ getValue, row, column, table }: CellContext<Record<string, unknown>, unknown>) {
  const [editing, setEditing] = useState(false)
  const [value, setValue] = useState(String(getValue() ?? ''))

  const commit = () => {
    setEditing(false)
    const meta = table.options.meta as { updateData: (row: number, col: string, val: unknown) => void }
    meta.updateData(row.index, column.id, value)
  }

  if (editing) {
    return (
      <input
        autoFocus
        value={value}
        onChange={e => setValue(e.target.value)}
        onBlur={commit}
        onKeyDown={e => { if (e.key === 'Enter') commit(); if (e.key === 'Escape') setEditing(false) }}
        className="w-full border border-blue-400 rounded px-1.5 py-0.5 text-xs outline-none focus:ring-1 focus:ring-blue-400"
      />
    )
  }

  return (
    <span
      className="block truncate cursor-pointer hover:bg-blue-50 rounded px-1.5 py-0.5 text-xs"
      onClick={() => setEditing(true)}
      title={value}
    >
      {value || <span className="text-gray-300 italic">—</span>}
    </span>
  )
}

export default function DataGrid({ columns, rows, onChange }: DataGridProps) {
  const [data, setData] = useState(rows)

  const updateData = useCallback((rowIndex: number, colId: string, value: unknown) => {
    setData(prev => {
      const next = prev.map((r, i) => i === rowIndex ? { ...r, [colId]: value } : r)
      onChange(next)
      return next
    })
  }, [onChange])

  const colDefs: ColumnDef<Record<string, unknown>>[] = columns.map(col => ({
    id: col,
    accessorKey: col,
    header: col,
    cell: EditableCell,
  }))

  const table = useReactTable({
    data,
    columns: colDefs,
    getCoreRowModel: getCoreRowModel(),
    meta: { updateData },
  })

  return (
    <div className="overflow-auto rounded-xl border border-gray-200">
      <table className="w-full text-xs border-collapse">
        <thead className="bg-gray-50 sticky top-0 z-10">
          {table.getHeaderGroups().map(hg => (
            <tr key={hg.id}>
              {hg.headers.map(h => (
                <th key={h.id}
                  className="text-left px-3 py-2.5 font-medium text-gray-600 border-b border-gray-200 whitespace-nowrap"
                  style={{ minWidth: 120, maxWidth: 240 }}>
                  {flexRender(h.column.columnDef.header, h.getContext())}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody className="bg-white divide-y divide-gray-100">
          {table.getRowModel().rows.map(row => (
            <tr key={row.id} className="hover:bg-gray-50 transition-colors">
              {row.getVisibleCells().map(cell => (
                <td key={cell.id} className="px-2 py-1.5" style={{ minWidth: 120, maxWidth: 240 }}>
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      <div className="bg-gray-50 border-t border-gray-200 px-4 py-2 text-xs text-gray-400">
        {data.length} rows · click any cell to edit · Enter to confirm · Esc to cancel
      </div>
    </div>
  )
}