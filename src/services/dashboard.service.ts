import { apiClient } from '@/lib/api-client';

export interface DashboardData {
  streak: number;
  level: number;
  healthScore: number;
  moneySaved: number;
  dailyStats: { name: string; completed: number }[];
  achievements: { title: string; date: string; icon: string }[];
}

export const getDashboardData = async (): Promise<DashboardData> => {
  const response = await apiClient.get('/dashboard');
  return response.data;
};
