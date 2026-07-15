import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

// English Translations
const en = {
  translation: {
    welcome: 'Welcome to NashaMukt AI',
    dashboard: 'Dashboard',
    community: 'Community',
    profile: 'Profile',
    insights: 'AI Insights',
    readAloud: 'Read Aloud',
    emergencyContact: 'Emergency Contact',
    largeText: 'Large Text',
    highContrast: 'High Contrast',
    voiceAssist: 'Voice Assist',
    dailyTips: 'Daily Health Tips',
    habitTracker: 'Habit Tracker',
    logHabit: 'Log Habit',
    // ... we can add more granular strings here
  },
};

// Hindi Translations
const hi = {
  translation: {
    welcome: 'नशामुक्त AI में आपका स्वागत है',
    dashboard: 'डैशबोर्ड',
    community: 'समुदाय',
    profile: 'प्रोफ़ाइल',
    insights: 'AI अंतर्दृष्टि',
    readAloud: 'जोर से पढ़ें',
    emergencyContact: 'आपातकालीन संपर्क',
    largeText: 'बड़ा पाठ',
    highContrast: 'उच्च कंट्रास्ट',
    voiceAssist: 'वॉयस असिस्ट',
    dailyTips: 'दैनिक स्वास्थ्य सुझाव',
    habitTracker: 'आदत ट्रैकर',
    logHabit: 'आदत लॉग करें',
  },
};

// Kannada Translations
const kn = {
  translation: {
    welcome: 'ನಶಾಮುಕ್ತ್ AI ಗೆ ಸುಸ್ವಾಗತ',
    dashboard: 'ಡ್ಯಾಶ್‌ಬೋರ್ಡ್',
    community: 'ಸಮುದಾಯ',
    profile: 'ಪ್ರೊಫೈಲ್',
    insights: 'AI ಒಳನೋಟಗಳು',
    readAloud: 'ಗಟ್ಟಿಯಾಗಿ ಓದಿ',
    emergencyContact: 'ತುರ್ತು ಸಂಪರ್ಕ',
    largeText: 'ದೊಡ್ಡ ಪಠ್ಯ',
    highContrast: 'ಹೆಚ್ಚಿನ ಕಾಂಟ್ರಾಸ್ಟ್',
    voiceAssist: 'ಧ್ವನಿ ಸಹಾಯ',
    dailyTips: 'ದೈನಂದಿನ ಆರೋಗ್ಯ ಸಲಹೆಗಳು',
    habitTracker: 'ಹವ್ಯಾಸ ಟ್ರ್ಯಾಕರ್',
    logHabit: 'ಹವ್ಯಾಸವನ್ನು ಲಾಗ್ ಮಾಡಿ',
  },
};

i18n
  .use(initReactI18next)
  .init({
    resources: {
      en,
      hi,
      kn,
    },
    lng: 'en', // default language
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false, // react already safes from xss
    },
  });

export default i18n;
