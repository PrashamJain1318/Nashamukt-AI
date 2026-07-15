import express from 'express';
import { getAllUsers, deletePost, createArticle, sendNotification, getPlatformAnalytics } from '../controllers/adminController';
import { protect, restrictTo } from '../middlewares/authMiddleware';

const router = express.Router();

router.use(protect);
router.use(restrictTo('admin'));

router.get('/users', getAllUsers);
router.delete('/community/:id', deletePost);
router.post('/articles', createArticle);
router.post('/notifications', sendNotification);
router.get('/analytics', getPlatformAnalytics);

export default router;
