'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { translations, Language } from '../translations';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => any;
  languageSelected: boolean;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>('en');
  const [languageSelected, setLanguageSelected] = useState<boolean>(false);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    const stored = localStorage.getItem('gov_language') as Language;
    if (stored && ['en', 'hi', 'kn', 'ta', 'te'].includes(stored)) {
      setLanguageState(stored);
      setLanguageSelected(true);
      return;
    }
  }, []);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    setLanguageSelected(true);
    try { localStorage.setItem('gov_language', lang); } catch {}
  };

  const t = (key: string): any => {
    const keys = key.split('.');
    let current: any = translations[language];
    for (const k of keys) {
      if (current && typeof current === 'object' && k in current) {
        current = current[k];
      } else {
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

  if (!isClient) return null;

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t, languageSelected }}>
      {!languageSelected ? (
        <div className="fixed inset-0 bg-[#0F1B45] z-[9999] flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-2xl p-8 max-w-md w-full text-center">
            <img src="/gov-logo.png" alt="Gov Logo" className="w-16 h-16 mx-auto mb-4 opacity-50" />
            <h1 className="text-2xl font-bold text-[#1B2B6B] mb-2">Choose Your Language</h1>
            <p className="text-gray-500 mb-6 text-sm">Please select your preferred language to continue.</p>
            <div className="flex flex-col gap-3">
              {[
                { code: 'en', label: 'English' },
                { code: 'hi', label: 'हिन्दी (Hindi)' },
                { code: 'kn', label: 'ಕನ್ನಡ (Kannada)' },
                { code: 'ta', label: 'தமிழ் (Tamil)' },
                { code: 'te', label: 'తెలుగు (Telugu)' }
              ].map(lang => (
                <button
                  key={lang.code}
                  onClick={() => setLanguage(lang.code as Language)}
                  className="w-full py-3 px-4 border border-gray-300 rounded hover:bg-[#0057A8] hover:text-white hover:border-[#0057A8] transition-colors font-medium"
                >
                  {lang.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      ) : null}
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error('useLanguage must be used within LanguageProvider');
  return ctx;
};
