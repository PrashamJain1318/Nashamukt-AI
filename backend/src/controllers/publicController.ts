import { Request, Response, NextFunction } from 'express';
import { User } from '../models/User';
import { catchAsync } from '../utils/catchAsync';
import { AppError } from '../utils/AppError';

export const getPublicProfile = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const { userId } = req.params;

  const user = await User.findById(userId).select('name avatar xp level createdAt targetQuitDate');

  if (!user) {
    return next(new AppError('Public profile not found', 404));
  }

  // Calculate streak roughly from targetQuitDate if available
  let streak = 0;
  if (user.targetQuitDate && user.targetQuitDate.getTime() < Date.now()) {
    streak = Math.floor((Date.now() - user.targetQuitDate.getTime()) / (1000 * 60 * 60 * 24));
  }

  res.status(200).json({
    status: 'success',
    data: {
      user: {
        id: user.id,
        name: user.name,
        avatar: user.avatar,
        xp: user.xp,
        level: user.level,
        memberSince: user.createdAt,
        currentStreak: streak > 0 ? streak : 0,
      }
    },
  });
});
