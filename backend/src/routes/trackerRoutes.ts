import express from 'express';
import { logHabit, getLogs } from '../controllers/trackerController';
import { protect } from '../middlewares/authMiddleware';

const router = express.Router();

router.use(protect);

router.post('/log', logHabit);
router.get('/logs', getLogs);

export default router;
