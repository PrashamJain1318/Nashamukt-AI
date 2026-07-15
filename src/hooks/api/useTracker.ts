import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { apiClient } from '@/lib/api-client'

export function useTrackerLogs() {
  return useQuery({
    queryKey: ['trackerLogs'],
    queryFn: async () => {
      const response = await apiClient.get('/tracker/logs')
      return response.data
    }
  })
}

export function useLogHabit() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (data: Record<string, unknown>) => {
      const response = await apiClient.post('/tracker/log', data)
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['trackerLogs'] })
      queryClient.invalidateQueries({ queryKey: ['dashboard'] })
    }
  })
}
