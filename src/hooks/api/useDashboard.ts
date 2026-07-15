import { useQuery } from '@tanstack/react-query';
import { getDashboardData, DashboardData } from '@/services/dashboard.service';

export const useDashboardData = () => {
  return useQuery<DashboardData, Error>({
    queryKey: ['dashboard'],
    queryFn: getDashboardData,
  });
};
