'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { translations, Language } from '../translations';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => any;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>('en');

  useEffect(() => {
    const stored = localStorage.getItem('gov_language') as Language;
    if (stored && ['en', 'hi', 'kn'].includes(stored)) {
      setLanguageState(stored);
      return;
    }
    const browserLang = navigator.language.toLowerCase();
    if (browserLang.startsWith('hi')) setLanguageState('hi');
    else if (browserLang.startsWith('kn') || browserLang.startsWith('kan')) setLanguageState('kn');
  }, []);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    try { localStorage.setItem('gov_language', lang); } catch {}
  };

  const t = (key: string): any => {
    const keys = key.split('.');
    // Try current language
    let current: any = translations[language];
    for (const k of keys) {
      if (current && typeof current === 'object' && k in current) {
        current = current[k];
      } else {
        // Fallback to English
        let fallback: any = translations['en'];
        for (const fk of keys) {
          if (fallback && typeof fallback === 'object' && fk in fallback) {
            fallback = fallback[fk];
          } else return key;
        }
        return (typeof fallback === 'string' || Array.isArray(fallback)) ? fallback : key;
      }
    }
    return (typeof current === 'string' || Array.isArray(current)) ? current : key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error('useLanguage must be used within LanguageProvider');
  return ctx;
};
