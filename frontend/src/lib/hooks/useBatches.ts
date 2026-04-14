import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '../api'
import type { BatchJob } from '../types'

export const useBatches = () =>
  useQuery<BatchJob[]>({
    queryKey: ['batches'],
    queryFn: async () => (await api.get('/batches/')).data.results,
  })

export const useBatch = (id: number) =>
  useQuery<BatchJob>({
    queryKey: ['batch', id],
    queryFn: async () => (await api.get(`/batches/${id}/`)).data,
    enabled: !!id,
  })

export const useCreateBatch = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (data: { connection: number; table_name: string; batch_size: number; offset: number }) =>
      api.post('/batches/', data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['batches'] }),
  })
}

export const useExtractBatch = (id: number) => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: () => api.post(`/batches/${id}/extract/`),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['batch', id] }),
  })
}

export const useSubmitBatch = (id: number) => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (editedData: BatchJob['edited_data']) =>
      api.post(`/batches/${id}/submit/`, { edited_data: editedData }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['batch', id] })
      qc.invalidateQueries({ queryKey: ['files'] })
    },
  })
}