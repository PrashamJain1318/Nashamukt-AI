import MockAdapter from 'axios-mock-adapter';
import { apiClient } from './api-client';

// This sets the mock adapter on the default instance
const mock = new MockAdapter(apiClient, { delayResponse: 800 });

// === MOCK DATA ===
const dashboardData = {
  streak: 45,
  level: 5,
  healthScore: 88,
  moneySaved: 4500,
  dailyStats: [
    { name: 'Mon', completed: 100 },
    { name: 'Tue', completed: 80 },
    { name: 'Wed', completed: 100 },
    { name: 'Thu', completed: 90 },
    { name: 'Fri', completed: 100 },
    { name: 'Sat', completed: 70 },
    { name: 'Sun', completed: 100 },
  ],
  achievements: [
    { title: "1 Month Clean", date: "Oct 12", icon: "Award" },
    { title: "First ₹1000 Saved", date: "Oct 5", icon: "Wallet" },
    { title: "7 Days Streak", date: "Sep 20", icon: "Flame" },
  ]
};

// === ROUTES ===

// Onboarding API
mock.onPost('/user/onboarding').reply((config) => {
  const data = JSON.parse(config.data)
  
  // Update mock dashboard stats based on onboarding data
  dashboardData.moneySaved = 0 // Baseline starts at 0
  dashboardData.streak = 0 // Baseline starts at 0
  
  // We can also store the user profile here, but for now we just return 200 OK
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
mock.onGet('/dashboard').reply(200, dashboardData);

export { mock };
