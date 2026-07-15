import { Request, Response, NextFunction } from 'express';
import { TrackerLog } from '../models/Tracker';
import { catchAsync } from '../utils/catchAsync';
import { AppError } from '../utils/AppError';

export const logHabit = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const { product, quantity, time, mood, trigger, notes } = req.body;

  if (!product || !quantity || !time || !mood || !trigger) {
    return next(new AppError('Please provide all required fields', 400));
  }

  const newLog = await TrackerLog.create({
    // @ts-ignore
    user: req.user.id,
    product,
    quantity,
    time,
    mood,
    trigger,
    notes,
  });

  res.status(201).json({
    status: 'success',
    data: newLog,
  });
});

export const getLogs = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  // @ts-ignore
  const logs = await TrackerLog.find({ user: req.user.id }).sort({ createdAt: -1 });

  res.status(200).json({
    status: 'success',
    results: logs.length,
    data: logs,
  });
});
