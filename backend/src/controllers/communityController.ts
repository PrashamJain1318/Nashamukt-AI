import { Request, Response, NextFunction } from 'express';
import { Post } from '../models/Post';
import { catchAsync } from '../utils/catchAsync';
import { AppError } from '../utils/AppError';

export const getPosts = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const posts = await Post.find()
    .populate('author', 'name avatar')
    .populate('comments.user', 'name avatar')
    .sort({ createdAt: -1 });

  res.status(200).json({
    status: 'success',
    results: posts.length,
    data: posts,
  });
});

export const createPost = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const { content, isAnonymous, isMilestone } = req.body;
  
  if (!content) return next(new AppError('Content cannot be empty', 400));

  const newPost = await Post.create({
    // @ts-ignore
    author: req.user.id,
    content,
    isAnonymous: isAnonymous || false,
    isMilestone: isMilestone || false,
  });

  res.status(201).json({
    status: 'success',
    data: newPost,
  });
});

export const toggleLike = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const post = await Post.findById(req.params.id);
  if (!post) return next(new AppError('Post not found', 404));

  // @ts-ignore
  const userId = req.user.id;
  const index = post.likes.indexOf(userId);

  if (index === -1) {
    post.likes.push(userId);
  } else {
    post.likes.splice(index, 1);
  }

  await post.save();

  res.status(200).json({
    status: 'success',
    data: post,
  });
});

export const addComment = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const { content } = req.body;
  if (!content) return next(new AppError('Comment content cannot be empty', 400));

  const post = await Post.findById(req.params.id);
  if (!post) return next(new AppError('Post not found', 404));

  post.comments.push({
    // @ts-ignore
    user: req.user.id,
    content,
    createdAt: new Date(),
  });

  await post.save();

  res.status(201).json({
    status: 'success',
    data: post,
  });
});
