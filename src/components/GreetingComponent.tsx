import React, { useState, useEffect } from 'react';
import { Language } from '../types/service';
import { Sun, Sunset, Moon, Sunrise, Sparkles } from 'lucide-react';

interface GreetingComponentProps {
  language: Language;
}

export const GreetingComponent: React.FC<GreetingComponentProps> = ({ language }) => {
  const isHi = language === 'hi';
  const [greeting, setGreeting] = useState<{ hi: string; en: string; icon: React.ReactNode }>({
    hi: 'नमस्ते',
    en: 'Welcome',
    icon: <Sparkles className="w-4 h-4 text-amber-500 animate-pulse" />
  });

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour >= 5 && hour < 12) {
      setGreeting({
        hi: 'सुप्रभात (Good Morning)',
        en: 'Good Morning',
        icon: <Sunrise className="w-4 h-4 text-amber-500 animate-bounce" />
      });
    } else if (hour >= 12 && hour < 17) {
      setGreeting({
        hi: 'नमस्कार (Good Afternoon)',
        en: 'Good Afternoon',
        icon: <Sun className="w-4 h-4 text-amber-500 animate-spin-slow" />
      });
    } else if (hour >= 17 && hour < 21) {
      setGreeting({
        hi: 'शुभ संध्या (Good Evening)',
        en: 'Good Evening',
        icon: <Sunset className="w-4 h-4 text-orange-500" />
      });
    } else {
      setGreeting({
        hi: 'शुभ रात्रि (Good Evening)',
        en: 'Welcome & Good Evening',
        icon: <Moon className="w-4 h-4 text-indigo-400" />
      });
    }
  }, []);

  return (
    <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-900 text-xs sm:text-sm font-bold shadow-2xs backdrop-blur-xs">
      {greeting.icon}
      <span>{isHi ? greeting.hi : greeting.en}</span>
      <span className="text-slate-300">|</span>
      <span className="text-slate-600 font-medium">
        {isHi ? 'डिजिटल एवं जन सेवा केंद्र में आपका स्वागत है' : 'Welcome to Digital & Jan Seva Portal'}
      </span>
    </div>
  );
};
