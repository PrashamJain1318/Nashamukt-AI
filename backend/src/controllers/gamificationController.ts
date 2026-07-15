import { Request, Response, NextFunction } from 'express';
import { User } from '../models/User';
import { catchAsync } from '../utils/catchAsync';
import { AppError } from '../utils/AppError';

// Static quests for Gamification
const dailyMissions = [
  { id: 1, type: 'daily', title: "Daily Check-in", xp: 50 },
  { id: 2, type: 'daily', title: "Drink 2L Water", xp: 20 },
  { id: 3, type: 'daily', title: "Complete 4-7-8 Breathing", xp: 30 },
];

const achievementsList = [
  { id: 1, name: "First Step", description: "Logged your first day.", icon: "Award", requiredXp: 0 },
  { id: 2, name: "1 Week Clean", description: "Completed 7 days sober.", icon: "Award", requiredXp: 350 },
  { id: 3, name: "Piggy Bank", description: "Saved your first ₹1000.", icon: "Wallet", requiredXp: 500 },
];

export const getGamificationStatus = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  // @ts-ignore
  const user = await User.findById(req.user.id);
  if (!user) return next(new AppError('User not found', 404));

  const nextLevelXp = user.level * 1000;

  // Process achievements based on user XP
  const achievements = achievementsList.map(a => ({
    ...a,
    unlocked: user.xp >= a.requiredXp,
  }));

  res.status(200).json({
    status: 'success',
    data: {
      level: user.level,
      xp: user.xp,
      nextLevelXp,
      missions: dailyMissions.map(m => ({ ...m, completed: false })), // In a real app, track completion in DB
      achievements,
    },
  });
});

export const completeMission = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const { id, xp } = req.body;

  // @ts-ignore
  const user = await User.findById(req.user.id);
  if (!user) return next(new AppError('User not found', 404));

  user.xp += xp;
  
  // Level up logic
  const nextLevelXp = user.level * 1000;
  if (user.xp >= nextLevelXp) {
    user.level += 1;
  }

  await user.save();

  res.status(200).json({
    status: 'success',
    data: {
      xpEarned: xp,
      newTotalXp: user.xp,
      newLevel: user.level,
    },
  });
});
