import express from 'express';
import { getGamificationStatus, completeMission } from '../controllers/gamificationController';
import { protect } from '../middlewares/authMiddleware';

const router = express.Router();

router.use(protect);

router.get('/', getGamificationStatus);
router.post('/mission', completeMission);

export default router;
