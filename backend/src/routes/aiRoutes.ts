import express from 'express';
import { 
  analyzeHealth, 
  getCravingIntervention,
  getWeeklyProgressReport,
  simulateRiskAndSavings,
  analyzeMood,
  generateMotivation,
  getHealthInsights,
  predictHabit
} from '../controllers/aiController';
import { protect } from '../middlewares/authMiddleware';

const router = express.Router();

router.use(protect);

router.post('/analyze', analyzeHealth);
router.post('/craving', getCravingIntervention);
router.get('/weekly-report', getWeeklyProgressReport);
router.post('/simulate', simulateRiskAndSavings);
router.get('/mood-analysis', analyzeMood);
router.get('/motivation', generateMotivation);
router.get('/health-insights', getHealthInsights);
router.get('/habit-prediction', predictHabit);

export default router;
