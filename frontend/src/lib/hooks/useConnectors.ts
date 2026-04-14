import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '../api'
import type { DatabaseConnection } from '../types'

export const useConnectors = () =>
  useQuery<DatabaseConnection[]>({
    queryKey: ['connectors'],
    queryFn: async () => (await api.get('/connectors/')).data.results,
  })

export const useCreateConnector = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (data: Partial<DatabaseConnection> & { password: string }) =>
      api.post('/connectors/', data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['connectors'] }),
  })
}

export const useTestConnector = (id: number) =>
  useMutation({
    mutationFn: () => api.post(`/connectors/${id}/test/`),
  })

export const useConnectorTables = (id: number) =>
  useQuery<string[]>({
    queryKey: ['connector-tables', id],
    queryFn: async () => (await api.get(`/connectors/${id}/tables/`)).data.tables,
    enabled: !!id,
  })