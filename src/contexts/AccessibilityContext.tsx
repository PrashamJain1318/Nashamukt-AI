import React, { createContext, useContext, useState, useEffect } from 'react';

interface AccessibilityContextType {
  isLargeText: boolean;
  toggleLargeText: () => void;
  isHighContrast: boolean;
  toggleHighContrast: () => void;
  isVoiceEnabled: boolean;
  toggleVoice: () => void;
  isEcoMode: boolean;
  toggleEcoMode: () => void;
  speak: (text: string) => void;
}

const AccessibilityContext = createContext<AccessibilityContextType | undefined>(undefined);

export const AccessibilityProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isLargeText, setIsLargeText] = useState(false);
  const [isHighContrast, setIsHighContrast] = useState(false);
  const [isVoiceEnabled, setIsVoiceEnabled] = useState(false);
  const [isEcoMode, setIsEcoMode] = useState(() => {
    return localStorage.getItem('accessibility_eco_mode') === 'true';
  });

  useEffect(() => {
    // Apply large text
    if (isLargeText) {
      document.documentElement.classList.add('text-large');
    } else {
      document.documentElement.classList.remove('text-large');
    }

    // Apply high contrast
    if (isHighContrast) {
      document.documentElement.classList.add('high-contrast');
    } else {
      document.documentElement.classList.remove('high-contrast');
    }
  }, [isLargeText, isHighContrast]);

  const toggleLargeText = () => setIsLargeText(!isLargeText);
  const toggleHighContrast = () => setIsHighContrast(!isHighContrast);
  const toggleVoice = () => setIsVoiceEnabled(!isVoiceEnabled);
  const toggleEcoMode = () => {
    setIsEcoMode(prev => {
      const next = !prev;
      localStorage.setItem('accessibility_eco_mode', String(next));
      return next;
    });
  };

  const speak = (text: string) => {
    if (!isVoiceEnabled) return;
    if ('speechSynthesis' in window) {
      // Cancel previous speech
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      window.speechSynthesis.speak(utterance);
    }
  };

  return (
    <AccessibilityContext.Provider
      value={{
        isLargeText,
        toggleLargeText,
        isHighContrast,
        toggleHighContrast,
        isVoiceEnabled,
        toggleVoice,
        isEcoMode,
        toggleEcoMode,
        speak,
      }}
    >
      {children}
    </AccessibilityContext.Provider>
  );
};

export const useAccessibility = () => {
  const context = useContext(AccessibilityContext);
  if (context === undefined) {
    throw new Error('useAccessibility must be used within an AccessibilityProvider');
  }
  return context;
};
