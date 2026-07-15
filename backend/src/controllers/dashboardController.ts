import { Request, Response, NextFunction } from 'express';
import { catchAsync } from '../utils/catchAsync';

export const getDashboardStats = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  // @ts-ignore
  const user = req.user;

  // In a real application, you would aggregate data from Logs, Gamification, and User settings
  // Here we mock the aggregated response based on user profile logic
  const mockStats = {
    smokeFreeDays: 45,
    currentStreak: 45,
    healthScore: 85,
    moneySaved: (user.dailySpending || 100) * 45,
    xp: 2500,
    level: 5,
    todaysGoal: "Complete a 5-minute craving meditation",
    dailyMotivation: "Every day is a new beginning. Stay strong!",
  };

  res.status(200).json({
    status: 'success',
    data: mockStats,
  });
});
