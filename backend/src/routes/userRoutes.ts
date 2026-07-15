import express from 'express';
import { updateProfile } from '../controllers/userController';
import { protect } from '../middlewares/authMiddleware';

const router = express.Router();

// All routes below require authentication
router.use(protect);

/**
 * @swagger
 * /api/users/profile:
 *   put:
 *     summary: Update current user profile
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               age:
 *                 type: number
 *               gender:
 *                 type: string
 *               dailyQuantity:
 *                 type: number
 *               dailySpending:
 *                 type: number
 *     responses:
 *       200:
 *         description: Profile updated successfully
 */
router.put('/profile', updateProfile);

export default router;
