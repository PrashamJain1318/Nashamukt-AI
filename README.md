# 🕊️ NashaMukt AI

> **"Empowering journeys to a substance-free life through Artificial Intelligence."**

An Apple/Stripe-inspired, modern, full-stack application built for individuals seeking to overcome addiction to tobacco, alcohol, and pan masala/gutkha. **NashaMukt AI** acts as a personalized, gamified, and highly accessible companion designed to motivate, track, and provide real-time behavioral interventions using AI.

---

## 🏆 Hackathon Pitch
**Problem:** Substance abuse (tobacco, alcohol, gutkha) claims millions of lives annually. Traditional quitting methods lack real-time intervention, personalized coping strategies, and long-term gamification to retain user motivation. 

**Solution:** **NashaMukt AI** is an AI-powered sobriety ecosystem. By combining multimodal behavioral prediction, gamified tracking, and instant craving interventions, we provide a pocket-sized digital rehab that dynamically adapts to a user's psychological state.

---

## 🚀 Key Features

### 🧠 1. AI-Powered Craving Interventions
An interactive SOS modal accessible from anywhere in the app. If a user feels a craving, the AI analyzes their context and suggests breathing exercises, water reminders, or a brief motivational dialogue to distract them and reduce the urge.

### 📊 2. Advanced Health & Financial Analytics
- **Health Timeline:** A physiological breakdown of how the user's body is repairing itself based on their sober streak.
- **Risk & Savings Simulator:** AI-driven projections of money saved and life expectancy gained over the next 1-10 years.

### 🎮 3. Gamification & Community
- **XP & Levels:** Every logged day, journal entry, and avoided craving grants XP.
- **Sobriety Milestones:** Unlock badges and streaks.
- **Community Feed:** Anonymous peer-to-peer support group with upvotes and comments.

### 🌐 4. Accessibility & Localization First
- **Languages:** English, Hindi, and Kannada.
- **Accessibility Modes:** High Contrast Mode, Large Text Mode, and Voice Assistance (Web Speech API) for maximum inclusivity.
- **Emergency SOS:** Persistent floating action button to instantly dial national helplines.

### 📱 5. QR Code Public Profile
Share your sobriety milestones securely. Generate a QR code that links to a read-only public profile page displaying your current level and streak.

---

## 🛠 Tech Stack

### Frontend
- **Framework:** React 18 + Vite + TypeScript
- **Styling:** Tailwind CSS + Vanilla CSS (Custom Glassmorphism)
- **Animations:** Framer Motion
- **State Management:** React Query, React Context
- **Routing:** React Router DOM (v6)

### Backend
- **Environment:** Node.js + Express
- **Language:** TypeScript
- **Database:** MongoDB (via Mongoose)
- **Authentication:** JSON Web Tokens (JWT) & bcrypt
- **Security:** Helmet, CORS, custom error handling

---

## 🏗 Architecture
NashaMukt AI follows a Clean Architecture approach:
- **Presentation Layer:** Glassmorphic React UI.
- **API Layer:** Express controllers wrapped in `catchAsync` to eliminate `try/catch` bloat.
- **Service Layer (AI):** Pluggable structure ready for Google Gemini SDK integration.
- **Data Access Layer:** Mongoose Schemas (`User`, `Post`, `Journal`, `Tracker`).

---

## 🚦 Demo Flow

1. **Landing Page:** Walk through the Framer Motion-animated hero section, showcasing the dynamic problem/solution.
2. **Onboarding:** Register a user and traverse the multi-step React onboarding wizard. Input product used and daily spend.
3. **Dashboard:** Land on the gamified dashboard. Point out the Health Score, XP, and dynamic Daily Goal.
4. **AI Craving Assistant:** Trigger a craving event. Show the modal's immediate response and AI chat interface.
5. **Insights & Timeline:** Navigate to `AI Insights` to show the Savings Simulator and Mood Analysis. Click "Read Aloud" to demo the accessibility voice feature.
6. **QR Share:** Generate the QR Code and navigate to the `/p/:userId` public profile.
7. **Accessibility Switch:** Toggle Hindi/Kannada and High Contrast Mode.

---

## 📦 Installation Guide

### Prerequisites
- Node.js (v18+)
- MongoDB connection string (Atlas or Local)

### Backend Setup
```bash
cd backend
npm install
# Create a .env file with:
# PORT=5000
# DATABASE_URL=mongodb+srv://<user>:<password>@cluster...
# JWT_SECRET=your_super_secret_key
# JWT_EXPIRES_IN=90d
npm run dev
```

### Frontend Setup
```bash
# From the root directory
npm install
# Create a .env file with:
# VITE_API_URL=http://localhost:5000/api
npm run dev
```

---

## 🌍 Deployment Guide

### Frontend -> Vercel
1. Import the repository to Vercel.
2. Ensure the Framework Preset is `Vite`.
3. Add the `VITE_API_URL` environment variable pointing to the Render backend URL.
4. The `vercel.json` file is already included to handle SPA routing.
5. Deploy.

### Backend -> Render
1. Create a new Web Service on Render and link the repo.
2. Set the **Root Directory** to `backend`.
3. Build Command: `npm install && npm run build`
4. Start Command: `npm start`
5. Add your Environment Variables (`DATABASE_URL`, `JWT_SECRET`, etc.).
6. Deploy.

### Database -> MongoDB Atlas
1. Create a cluster on MongoDB Atlas.
2. Allow access from any IP (`0.0.0.0/0`) or your Render IP.
3. Copy the Connection String and inject it into your Render environment variables.

---

## 🔮 Future Scope
1. **Wearable Integration:** Sync heart rate and sleep data from Apple Health / Google Fit to detect physiological stress spikes before a craving even occurs.
2. **True Multimodal AI:** Process images of users' pupils or face to detect signs of relapse using Gemini 1.5 Pro.
3. **Clinical Dashboard:** A portal for registered therapists to monitor consenting users' mood trends and intervene proactively.
