import { Request, Response, NextFunction } from 'express';
import { catchAsync } from '../utils/catchAsync';

export const getHealthAnalytics = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const mockAnalytics = {
    metrics: {
      smokeFreeDays: 45,
      moneySaved: 4500,
      lifeHoursRegained: 120,
      healthScore: 85,
      riskReduction: 45
    },
    charts: {
      dailyConsumption: [
        { date: '1', amount: 5 }, { date: '2', amount: 4 }, { date: '3', amount: 3 },
        { date: '4', amount: 2 }, { date: '5', amount: 0 }, { date: '6', amount: 0 }
      ],
      moodTrends: [
        { subject: 'Happy', A: 80, fullMark: 100 },
        { subject: 'Stressed', A: 40, fullMark: 100 },
        { subject: 'Anxious', A: 30, fullMark: 100 },
      ],
      cravings: [
        { date: 'Mon', count: 10 }, { date: 'Tue', count: 8 }, { date: 'Wed', count: 6 },
      ]
    }
  };

  res.status(200).json({
    status: 'success',
    data: mockAnalytics,
  });
});
