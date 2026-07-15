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

// Dashboard
mock.onGet('/dashboard').reply(200, dashboardData);

export { mock };
