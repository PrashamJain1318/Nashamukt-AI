import { useQuery } from '@tanstack/react-query'
import { apiClient } from '@/lib/api-client'

export function useHealthData() {
  return useQuery({
    queryKey: ['health'],
    queryFn: async () => {
      const response = await apiClient.get('/health')
      return response.data
    }
  })
}
