import express from 'express';
import { getPosts, createPost, toggleLike, addComment } from '../controllers/communityController';
import { protect } from '../middlewares/authMiddleware';

const router = express.Router();

router.use(protect);

router.get('/', getPosts);
router.post('/', createPost);
router.post('/:id/like', toggleLike);
router.post('/:id/comment', addComment);

export default router;
