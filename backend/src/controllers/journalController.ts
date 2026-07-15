import { Request, Response, NextFunction } from 'express';
import { JournalEntry } from '../models/Journal';
import { catchAsync } from '../utils/catchAsync';
import { AppError } from '../utils/AppError';

export const createEntry = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const { title, content, mood, tags } = req.body;

  if (!title || !content || !mood) {
    return next(new AppError('Please provide title, content, and mood', 400));
  }

  const newEntry = await JournalEntry.create({
    // @ts-ignore
    user: req.user.id,
    title,
    content,
    mood,
    tags,
  });

  res.status(201).json({
    status: 'success',
    data: newEntry,
  });
});

export const getEntries = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  // @ts-ignore
  const entries = await JournalEntry.find({ user: req.user.id }).sort({ createdAt: -1 });

  res.status(200).json({
    status: 'success',
    results: entries.length,
    data: entries,
  });
});
