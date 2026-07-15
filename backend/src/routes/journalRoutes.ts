import express from 'express';
import { createEntry, getEntries } from '../controllers/journalController';
import { protect } from '../middlewares/authMiddleware';

const router = express.Router();

router.use(protect);

router.post('/', createEntry);
router.get('/', getEntries);

export default router;
