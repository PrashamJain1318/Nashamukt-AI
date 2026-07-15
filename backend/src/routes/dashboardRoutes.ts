import express from 'express';
import { getDashboardStats } from '../controllers/dashboardController';
import { protect } from '../middlewares/authMiddleware';

const router = express.Router();

router.use(protect);

/**
 * @swagger
 * /api/dashboard:
 *   get:
 *     summary: Get dashboard statistics for the logged in user
 *     tags: [Dashboard]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Dashboard stats retrieved successfully
 */
router.get('/', getDashboardStats);

export default router;
