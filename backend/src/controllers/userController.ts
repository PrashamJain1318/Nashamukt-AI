import { Request, Response, NextFunction } from 'express';
import { User } from '../models/User';
import { catchAsync } from '../utils/catchAsync';
import { AppError } from '../utils/AppError';

export const updateProfile = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  // @ts-ignore
  const userId = req.user.id;

  // Filter out unwanted fields
  const allowedFields = ['name', 'age', 'gender', 'productsUsed', 'yearsOfAddiction', 'dailyQuantity', 'dailySpending', 'reasonForAddiction', 'reasonToQuit', 'targetQuitDate', 'preferredLanguage', 'avatar'];
  
  const updateData: any = {};
  Object.keys(req.body).forEach((el) => {
    if (allowedFields.includes(el)) updateData[el] = req.body[el];
  });

  const updatedUser = await User.findByIdAndUpdate(userId, updateData, {
    new: true,
    runValidators: true,
  });

  if (!updatedUser) {
    return next(new AppError('No user found with that ID', 404));
  }

  res.status(200).json({
    status: 'success',
    data: {
      user: updatedUser,
    },
  });
});
