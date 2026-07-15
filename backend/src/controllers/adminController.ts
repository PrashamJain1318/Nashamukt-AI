import { Request, Response, NextFunction } from 'express';
import { User } from '../models/User';
import { Post } from '../models/Post';
import { Article } from '../models/Article';
import { catchAsync } from '../utils/catchAsync';
import { AppError } from '../utils/AppError';

export const getAllUsers = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const users = await User.find().select('-password');
  res.status(200).json({
    status: 'success',
    results: users.length,
    data: users,
  });
});

export const deletePost = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const post = await Post.findByIdAndDelete(req.params.id);
  if (!post) return next(new AppError('No post found with that ID', 404));

  res.status(204).json({
    status: 'success',
    data: null,
  });
});

export const createArticle = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const { title, content, category, isPublished } = req.body;

  const newArticle = await Article.create({
    title,
    content,
    category,
    isPublished: isPublished || false,
    // @ts-ignore
    author: req.user.id,
  });

  res.status(201).json({
    status: 'success',
    data: newArticle,
  });
});

export const sendNotification = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const { title, body, userIds } = req.body;

  if (!title || !body) return next(new AppError('Title and body are required', 400));

  // MOCK: Integration with FCM or APNS would happen here
  console.log(`[Notification Sent] To ${userIds ? userIds.length + ' users' : 'All Users'} - ${title}: ${body}`);

  res.status(200).json({
    status: 'success',
    message: 'Notification sent successfully',
  });
});

export const getPlatformAnalytics = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const totalUsers = await User.countDocuments();
  const totalPosts = await Post.countDocuments();
  
  res.status(200).json({
    status: 'success',
    data: {
      totalUsers,
      totalPosts,
      activeToday: Math.floor(totalUsers * 0.25), // mock
      platformHealthScore: 92,
    },
  });
});
