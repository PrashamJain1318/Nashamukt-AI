import express from 'express';
import { getHealthAnalytics } from '../controllers/healthController';
import { protect } from '../middlewares/authMiddleware';

const router = express.Router();

router.use(protect);

router.get('/', getHealthAnalytics);

export default router;
