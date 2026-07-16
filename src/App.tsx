import React, { Suspense } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Layout } from '@/components/layout'
import { ProtectedRoute } from '@/components/protected-route'
import { DashboardLayout } from '@/components/ui/dashboard-layout'
import { LoadingSpinner } from '@/components/ui/loading-spinner'
import { EmergencyContact } from '@/components/ui/emergency-contact'

// Lazy Load Pages
const LandingPage = React.lazy(() => import('@/pages/landing').then(m => ({ default: m.LandingPage })))
const Dashboard = React.lazy(() => import('@/pages/dashboard').then(m => ({ default: m.Dashboard })))
const ChatInterface = React.lazy(() => import('@/pages/chat').then(m => ({ default: m.ChatInterface })))
const LoginPage = React.lazy(() => import('@/pages/auth/login').then(m => ({ default: m.LoginPage })))
const RegisterPage = React.lazy(() => import('@/pages/auth/register').then(m => ({ default: m.RegisterPage })))
const ForgotPasswordPage = React.lazy(() => import('@/pages/auth/forgot-password').then(m => ({ default: m.ForgotPasswordPage })))
const VerifyEmailPage = React.lazy(() => import('@/pages/auth/verify-email').then(m => ({ default: m.VerifyEmailPage })))
const VerifyOTPPage = React.lazy(() => import('@/pages/auth/verify-otp').then(m => ({ default: m.VerifyOTPPage })))
const DesignSystemPage = React.lazy(() => import('@/pages/design-system').then(m => ({ default: m.DesignSystemPage })))
const TrackerPage = React.lazy(() => import('@/pages/tracker').then(m => ({ default: m.TrackerPage })))
const JournalPage = React.lazy(() => import('@/pages/journal').then(m => ({ default: m.JournalPage })))
const MoneySavedPage = React.lazy(() => import('@/pages/savings').then(m => ({ default: m.MoneySavedPage })))
const HealthTimelinePage = React.lazy(() => import('@/pages/health').then(m => ({ default: m.HealthTimelinePage })))
const CommunityPage = React.lazy(() => import('@/pages/community').then(m => ({ default: m.CommunityPage })))
const ProfilePage = React.lazy(() => import('@/pages/profile').then(m => ({ default: m.ProfilePage })))
const SettingsPage = React.lazy(() => import('@/pages/settings').then(m => ({ default: m.SettingsPage })))
const OnboardingPage = React.lazy(() => import('@/pages/onboarding').then(m => ({ default: m.OnboardingPage })))
const PlanPage = React.lazy(() => import('@/pages/plan').then(m => ({ default: m.PlanPage })))
const PublicProfilePage = React.lazy(() => import('@/pages/public-profile').then(m => ({ default: m.PublicProfilePage })))
const AIInsightsPage = React.lazy(() => import('@/pages/ai-insights').then(m => ({ default: m.AIInsightsPage })))
const StoryPage = React.lazy(() => import('@/pages/story').then(m => ({ default: m.StoryPage })))
const AchievementsPage = React.lazy(() => import('@/pages/achievements').then(m => ({ default: m.AchievementsPage })))
const SimulatorPage = React.lazy(() => import('@/pages/simulator').then(m => ({ default: m.SimulatorPage })))
const PitchPage = React.lazy(() => import('@/pages/pitch').then(m => ({ default: m.PitchPage })))

function App() {
  return (
    <BrowserRouter>
      <Suspense fallback={<LoadingSpinner />}>
        <EmergencyContact />
        <Routes>
          <Route path="/" element={<Layout />}>
            {/* Public Routes */}
            <Route index element={<LandingPage />} />
            <Route path="login" element={<LoginPage />} />
            <Route path="register" element={<RegisterPage />} />
            <Route path="forgot-password" element={<ForgotPasswordPage />} />
            <Route path="verify-email" element={<VerifyEmailPage />} />
            <Route path="verify-otp" element={<VerifyOTPPage />} />
            <Route path="design" element={<DesignSystemPage />} />
            <Route path="p/:userId" element={<PublicProfilePage />} />
            <Route path="story" element={<StoryPage />} />
            <Route path="pitch" element={<PitchPage />} />
          </Route>

          {/* Protected Routes */}
          <Route element={<ProtectedRoute />}>
            {/* Onboarding and Plan are protected but not inside dashboard layout */}
            <Route path="onboarding" element={<OnboardingPage />} />
            <Route path="plan" element={<PlanPage />} />
            
            <Route element={<DashboardLayout />}>
              <Route path="dashboard" element={<Dashboard />} />
              <Route path="tracker" element={<TrackerPage />} />
              <Route path="journal" element={<JournalPage />} />
              <Route path="savings" element={<MoneySavedPage />} />
              <Route path="health" element={<HealthTimelinePage />} />
              <Route path="insights" element={<AIInsightsPage />} />
              <Route path="chat" element={<ChatInterface />} />
              <Route path="community" element={<CommunityPage />} />
              <Route path="profile" element={<ProfilePage />} />
              <Route path="settings" element={<SettingsPage />} />
              <Route path="achievements" element={<AchievementsPage />} />
              <Route path="simulator" element={<SimulatorPage />} />
            </Route>
          </Route>
        </Routes>
      </Suspense>
    </BrowserRouter>
  )
}

export default App
