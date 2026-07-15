import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { apiClient } from '@/lib/api-client'
import { toast } from 'sonner'

export function useGamificationData() {
  return useQuery({
    queryKey: ['gamification'],
    queryFn: async () => {
      const response = await apiClient.get('/gamification')
      return response.data
    }
  })
}

export function useCompleteMission() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (data: { id: number, xp: number }) => {
      const response = await apiClient.post('/gamification/mission', data)
      return response.data
    },
    onSuccess: (data) => {
      toast.success(`Mission Completed! +${data.xpEarned} XP`)
      queryClient.invalidateQueries({ queryKey: ['gamification'] })
      queryClient.invalidateQueries({ queryKey: ['dashboard'] }) // update dashboard XP
    }
  })
}
