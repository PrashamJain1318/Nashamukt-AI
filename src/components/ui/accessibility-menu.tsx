import { useState } from 'react';
import { useAccessibility } from '@/contexts/AccessibilityContext';
import { useTranslation } from 'react-i18next';
import { Settings2, Volume2, Type, Sun, Globe, Cpu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { motion, AnimatePresence } from 'framer-motion';

export function AccessibilityMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const { 
    isLargeText, toggleLargeText, 
    isHighContrast, toggleHighContrast, 
    isVoiceEnabled, toggleVoice,
    isEcoMode, toggleEcoMode
  } = useAccessibility();
  const { t, i18n } = useTranslation();

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
  };

  return (
    <div className="relative">
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setIsOpen(!isOpen)}
        className="rounded-xl w-10 h-10 hover:bg-primary/20"
      >
        <Settings2 className="h-5 w-5" />
      </Button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            className="absolute right-0 top-12 w-64 bg-card border border-border/50 shadow-xl rounded-2xl p-4 z-50 flex flex-col space-y-4"
          >
            <div className="space-y-2">
              <h4 className="text-sm font-semibold text-muted-foreground flex items-center space-x-2">
                <Globe className="h-4 w-4" />
                <span>Language</span>
              </h4>
              <div className="flex space-x-2">
                <Button 
                  size="sm" 
                  variant={i18n.language === 'en' ? 'primary' : 'secondary'}
                  onClick={() => changeLanguage('en')}
                  className="flex-1"
                >
                  EN
                </Button>
                <Button 
                  size="sm" 
                  variant={i18n.language === 'hi' ? 'primary' : 'secondary'}
                  onClick={() => changeLanguage('hi')}
                  className="flex-1"
                >
                  HI
                </Button>
                <Button 
                  size="sm" 
                  variant={i18n.language === 'kn' ? 'primary' : 'secondary'}
                  onClick={() => changeLanguage('kn')}
                  className="flex-1"
                >
                  KN
                </Button>
              </div>
            </div>

            <div className="h-px bg-border/50 w-full" />

            <div className="space-y-2">
              <h4 className="text-sm font-semibold text-muted-foreground">Accessibility</h4>
              
              <Button
                variant={isLargeText ? 'primary' : 'secondary'}
                onClick={toggleLargeText}
                className="w-full justify-start space-x-3"
              >
                <Type className="h-4 w-4" />
                <span>{t('largeText', 'Large Text')}</span>
              </Button>

              <Button
                variant={isHighContrast ? 'primary' : 'secondary'}
                onClick={toggleHighContrast}
                className="w-full justify-start space-x-3"
              >
                <Sun className="h-4 w-4" />
                <span>{t('highContrast', 'High Contrast')}</span>
              </Button>

              <Button
                variant={isVoiceEnabled ? 'primary' : 'secondary'}
                onClick={toggleVoice}
                className="w-full justify-start space-x-3"
              >
                <Volume2 className="h-4 w-4" />
                <span>{t('voiceAssist', 'Voice Assist')}</span>
              </Button>

              <Button
                variant={isEcoMode ? 'primary' : 'secondary'}
                onClick={toggleEcoMode}
                className="w-full justify-start space-x-3"
              >
                <Cpu className="h-4 w-4" />
                <span>{t('ecoMode', 'Eco Mode (2D)')}</span>
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
