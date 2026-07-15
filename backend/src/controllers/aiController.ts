import { Request, Response, NextFunction } from 'express';
import { catchAsync } from '../utils/catchAsync';
import { AppError } from '../utils/AppError';

export const analyzeHealth = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const { userData } = req.body;

  if (!userData) {
    return next(new AppError('User data is required for analysis', 400));
  }

  // MOCK: In production, this wraps the @google/genai SDK
  // e.g. const response = await geminiModel.generateContent(`Analyze this user...`);
  
  const mockAiResponse = {
    addictionScore: 75,
    healthRiskScore: 82,
    financialImpact: "Severe",
    monthlyMoneyWasted: 3000,
    yearlyMoneyWasted: 36500,
    estimatedHealthTimeline: "Significant improvement in lung function expected within 3 months.",
    sevenDayPlan: ["Day 1: Drink lots of water", "Day 2: 15 min walk", "Day 3: Call a friend"],
    thirtyDayPlan: ["Week 1: Focus on routine", "Week 2: Exercise", "Week 3: Save money", "Week 4: Reward yourself"],
    dailyMotivation: "Every step you take is a step towards freedom.",
    healthyAlternatives: ["Chewing gum", "Deep breathing", "Drinking water", "Meditation"],
    cravingTips: ["Wait 10 minutes", "Change your environment", "Talk to someone"],
  };

  res.status(200).json({
    status: 'success',
    data: mockAiResponse,
  });
});

export const getCravingIntervention = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const { messages } = req.body;

  if (!messages) {
    return next(new AppError('Messages are required for conversation', 400));
  }

  const mockResponseText = "I understand you're feeling a craving right now. Take a deep breath. You've come so far. Can you try drinking a glass of water and waiting 5 minutes?";

  res.status(200).json({
    status: 'success',
    data: {
      role: 'assistant',
      content: mockResponseText,
    },
  });
});

export const getWeeklyProgressReport = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const mockReport = {
    summary: "You had a fantastic week! Your cravings decreased by 20% and you saved ₹700.",
    highlights: ["3 perfect days", "Completed 5 breathing exercises", "Saved ₹700"],
    areasForImprovement: ["Evening cravings are still high. Try going for a walk after dinner."],
    nextWeekGoal: "Aim for 5 perfect days.",
  };
  res.status(200).json({ status: 'success', data: mockReport });
});

export const simulateRiskAndSavings = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const { yearsToSimulate, dailySpending } = req.body;
  const days = (yearsToSimulate || 1) * 365;
  const spend = dailySpending || 100;
  
  const mockSimulation = {
    projectedSavings: days * spend,
    healthRiskReduction: "Your risk of cardiovascular disease will drop by 50%.",
    lifeExpectancyGained: `${(yearsToSimulate || 1) * 2} months`,
  };
  res.status(200).json({ status: 'success', data: mockSimulation });
});

export const analyzeMood = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const mockMoodAnalysis = {
    trend: "Improving",
    averageMood: "Good",
    triggersIdentified: ["Stress at work", "Late nights"],
    aiSuggestion: "Consider a 5-minute meditation before sleep.",
  };
  res.status(200).json({ status: 'success', data: mockMoodAnalysis });
});

export const generateMotivation = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const quotes = [
    "Every step you take is a step towards freedom.",
    "Your future self will thank you for the choices you make today.",
    "Small daily improvements are the key to staggering long-term results.",
  ];
  const mockMotivation = {
    quote: quotes[Math.floor(Math.random() * quotes.length)],
    personalizedMessage: "You've been sober for 45 days. That's incredible progress. Keep it up!",
  };
  res.status(200).json({ status: 'success', data: mockMotivation });
});

export const getHealthInsights = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const mockInsights = [
    "Your blood pressure should be returning to normal levels now.",
    "Your sense of taste and smell are likely improving.",
    "Lung function begins to improve, making breathing easier.",
  ];
  res.status(200).json({ status: 'success', data: mockInsights });
});

export const predictHabit = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const mockPrediction = {
    highRiskTime: "18:00 - 20:00",
    likelyTrigger: "Post-work fatigue",
    preventiveAction: "Schedule a gym session or call a friend at 18:00.",
  };
  res.status(200).json({ status: 'success', data: mockPrediction });
});
