import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '../api'
import type { StoredFile } from '../types'

export const useFiles = () =>
  useQuery<StoredFile[]>({
    queryKey: ['files'],
    queryFn: async () => (await api.get('/files/')).data.results,
  })

export const useShareFile = (id: number) => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (userIds: number[]) => api.post(`/files/${id}/share/`, { user_ids: userIds }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['files'] }),
  })
}