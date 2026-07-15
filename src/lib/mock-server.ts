import MockAdapter from 'axios-mock-adapter';
import { apiClient } from './api-client';

// This sets the mock adapter on the default instance
const mock = new MockAdapter(apiClient, { delayResponse: 800 });

// === PERSISTENT STATE ===
const loadState = (key: string, defaultState: unknown) => {
  const stored = localStorage.getItem(`nashamukti_${key}`)
  return stored ? JSON.parse(stored) : defaultState
}

const saveState = (key: string, state: unknown) => {
  localStorage.setItem(`nashamukti_${key}`, JSON.stringify(state))
}

const defaultDashboard = {
  smokeFreeDays: 45,
  streak: 45,
  healthScore: 88,
  moneySaved: 4500,
  xp: 1250,
  todaysGoal: "Drink 3L of water",
  dailyMotivation: "Every day is a new beginning. Stay strong!",
  level: 5,
  achievements: [
    { title: "1 Month Clean", date: "Oct 12", icon: "Award" },
    { title: "First ₹1000 Saved", date: "Oct 5", icon: "Wallet" },
    { title: "7 Days Streak", date: "Sep 20", icon: "Flame" },
  ]
}

const defaultLogs: Record<string, unknown>[] = [
  { id: 1, date: new Date().toISOString(), product: "Smoking", quantity: 2, time: "10:30", mood: "Stressed", trigger: "Work meeting", notes: "Felt overwhelmed" }
]

const dashboardData = loadState('dashboard', defaultDashboard)
let logsData = loadState('logs', defaultLogs)

// Function to calculate charts based on logs
const getChartData = () => {
  // Mock implementations for chart data
  const weeklyChart = [
    { name: 'Mon', value: 3 },
    { name: 'Tue', value: 2 },
    { name: 'Wed', value: 0 },
    { name: 'Thu', value: 1 },
    { name: 'Fri', value: Math.random() > 0.5 ? 5 : 0 },
    { name: 'Sat', value: 2 },
    { name: 'Sun', value: 0 },
  ]
  const triggers = [
    { name: 'Stress', value: 40 },
    { name: 'Social', value: 30 },
    { name: 'Boredom', value: 20 },
    { name: 'Anxiety', value: 10 },
  ]
  return { weeklyChart, triggers }
}

// === ROUTES ===

// Onboarding API
mock.onPost('/user/onboarding').reply((config) => {
  const data = JSON.parse(config.data)
  dashboardData.moneySaved = 0
  dashboardData.streak = 0
  dashboardData.smokeFreeDays = 0
  dashboardData.xp = 0
  saveState('dashboard', dashboardData)
  return [200, { message: 'Onboarding complete', user: data }]
})

// AI Analysis API
mock.onPost('/ai/analyze').reply((config) => {
  const data = JSON.parse(config.data)
  
  // Calculate mock financial impact based on daily spending
  const dailySpend = parseInt(data.dailySpending) || 200
  const monthlyWasted = dailySpend * 30
  const yearlyWasted = dailySpend * 365

  // Generate placeholder AI response
  const analysis = {
    addictionScore: 78,
    healthRiskScore: 82,
    financialImpact: {
      monthlyWasted,
      yearlyWasted
    },
    timeline: [
      { time: "20 Minutes", desc: "Heart rate and blood pressure drop to normal." },
      { time: "8 Hours", desc: "Carbon monoxide levels in your blood normalize." },
      { time: "72 Hours", desc: "Breathing becomes easier and energy levels increase." },
      { time: "2 Weeks", desc: "Blood circulation improves significantly." },
      { time: "1 Year", desc: "Risk of heart disease drops to half that of a smoker." }
    ],
    sevenDayPlan: [
      { day: 1, title: "The Clean Break", desc: "Throw away all products and related items. Tell a trusted friend." },
      { day: 2, title: "Trigger Identification", desc: "Write down your cravings and what triggered them." },
      { day: 3, title: "Withdrawal Peak", desc: "Drink plenty of water and use the 4-7-8 breathing technique." },
      { day: 4, title: "Reward System", desc: "Buy yourself something small with the money you saved." },
      { day: 5, title: "Routine Shift", desc: "Change your morning routine to break the habit association." },
      { day: 6, title: "Mindfulness", desc: "Try a 10-minute guided meditation for cravings." },
      { day: 7, title: "First Milestone", desc: "Celebrate one week! The physical addiction is broken." }
    ],
    thirtyDayPlan: "Over the next 30 days, your focus will shift from physical withdrawal to psychological resilience. We will work on building new coping mechanisms for stress, identifying deep-seated triggers, and rewiring your dopamine pathways through healthy alternatives like exercise and hobbies. The cravings will become less frequent and less intense.",
    dailyAdvice: {
      motivation: "The hardest part is taking the first step. You've already done that.",
      goal: "Stay entirely substance-free today and drink 3 liters of water.",
      alternative: "When a craving hits, chew sugar-free gum or go for a brisk 5-minute walk.",
      prevention: "Avoid the environments or people that usually trigger your usage during this early phase."
    }
  }

  return [200, analysis]
})

// Dashboard
mock.onGet('/dashboard').reply(() => [200, dashboardData]);

// Tracker GET
mock.onGet('/tracker/logs').reply(() => {
  return [200, {
    logs: logsData,
    charts: getChartData()
  }]
})

// Tracker POST
mock.onPost('/tracker/log').reply((config) => {
  const data = JSON.parse(config.data)
  const newLog = {
    id: Date.now(),
    date: new Date().toISOString(),
    ...data
  }
  
  // Update Logs
  logsData = [newLog, ...logsData]
  saveState('logs', logsData)
  
  // If user slipped (quantity > 0), reset streak
  if (data.quantity > 0) {
    dashboardData.streak = 0
    dashboardData.healthScore = Math.max(0, dashboardData.healthScore - 2)
  }
  
  saveState('dashboard', dashboardData)
  
  return [200, newLog]
})

// AI Craving Chat API
mock.onPost('/ai/craving').reply((config) => {
  const data = JSON.parse(config.data)
  const userMessage = data.message.toLowerCase()
  
  let reply = "I understand this is incredibly difficult. Take a deep breath. You've made it this far, and this craving is just a temporary wave. It will pass. Can you tell me more about what triggered this?"
  
  if (userMessage.includes('stress') || userMessage.includes('work')) {
    reply = "Stress is a huge trigger. It's completely normal to feel this way right now. Let's try the 4-7-8 breathing exercise together. Have you drank any water recently?"
  } else if (userMessage.includes('friend') || userMessage.includes('social') || userMessage.includes('party')) {
    reply = "Social situations are tough. Remember why you started this journey. If it's too much, it's okay to step outside for a few minutes or even leave early. Your health comes first."
  } else if (userMessage.includes('bored')) {
    reply = "Boredom can easily trick your brain into wanting a dopamine hit. How about we go for a quick 5-minute walk, or you can play a quick game on your phone? Let's distract your mind."
  } else if (userMessage.includes('help')) {
    reply = "I'm right here with you. Please focus on the timer on the left. Watch it count down. The peak of this craving will only last a few minutes."
  }

  return [200, { reply }]
})

// Health Analytics API
mock.onGet('/health').reply(() => {
  return [200, {
    metrics: {
      smokeFreeDays: dashboardData.smokeFreeDays,
      moneySaved: dashboardData.moneySaved,
      lifeHoursRegained: 120, // Mocked 5 days * 24h
      healthScore: dashboardData.healthScore,
      riskReduction: 45 // 45% risk reduction
    },
    charts: {
      dailyConsumption: [
        { date: '1', amount: 5 },
        { date: '2', amount: 4 },
        { date: '3', amount: 3 },
        { date: '4', amount: 2 },
        { date: '5', amount: 0 },
        { date: '6', amount: 0 },
        { date: '7', amount: 0 },
      ],
      moodTrends: [
        { subject: 'Happy', A: 80, fullMark: 100 },
        { subject: 'Stressed', A: 40, fullMark: 100 },
        { subject: 'Anxious', A: 30, fullMark: 100 },
        { subject: 'Calm', A: 90, fullMark: 100 },
        { subject: 'Sad', A: 20, fullMark: 100 },
      ],
      cravings: [
        { date: 'Mon', count: 10 },
        { date: 'Tue', count: 8 },
        { date: 'Wed', count: 6 },
        { date: 'Thu', count: 4 },
        { date: 'Fri', count: 2 },
        { date: 'Sat', count: 1 },
        { date: 'Sun', count: 0 },
      ]
    }
  }]
})

export { mock };
