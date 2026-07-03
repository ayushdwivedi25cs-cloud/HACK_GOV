'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import { Language } from '../translations';
import {
  Menu, X, ChevronDown, Phone, LogOut, User,
  Shield, AlertTriangle, FileText, MapPin,
  Heart, Search, Zap, BookOpen
} from 'lucide-react';

interface GovernmentHeaderProps {
  onTriggerSOS: () => void;
  onTriggerWomensSOS: () => void;
}

export const GovernmentHeader: React.FC<GovernmentHeaderProps> = ({ onTriggerSOS, onTriggerWomensSOS }) => {
  const { t, language, setLanguage } = useLanguage();
  const { user, isAuthenticated, logout } = useAuth();
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [fontClass, setFontClass] = useState('');
  const [highContrast, setHighContrast] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setActiveDropdown(null);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  // Apply accessibility classes to body
  const increaseFont = () => {
    document.body.classList.remove('font-small');
    document.body.classList.add('font-large');
    setFontClass('large');
  };
  const decreaseFont = () => {
    document.body.classList.remove('font-large');
    document.body.classList.add('font-small');
    setFontClass('small');
  };
  const resetFont = () => {
    document.body.classList.remove('font-large', 'font-small');
    setFontClass('');
  };
  const toggleContrast = () => {
    document.body.classList.toggle('high-contrast');
    setHighContrast(prev => !prev);
  };

  const navItems = [
    { key: 'home', label: t('nav.home'), href: '/' },
    {
      key: 'emergency', label: t('nav.emergency'), href: '#',
      children: [
        { label: t('services.medical.title'), href: '/#emergency', icon: <Heart className="h-3.5 w-3.5" /> },
        { label: t('services.police.title'), href: '/#emergency', icon: <Shield className="h-3.5 w-3.5" /> },
        { label: t('services.fire.title'), href: '/#emergency', icon: <Zap className="h-3.5 w-3.5" /> },
        { label: t('services.cyber.title'), href: '/scam-detector', icon: <AlertTriangle className="h-3.5 w-3.5" /> },
      ]
    },
    { key: 'guidance', label: t('nav.guidance'), href: '/guidance' },
    {
      key: 'disaster', label: t('nav.disaster'), href: '/disaster',
      children: [
        { label: 'Flood Response', href: '/disaster', icon: <AlertTriangle className="h-3.5 w-3.5" /> },
        { label: 'Earthquake Safety', href: '/disaster', icon: <AlertTriangle className="h-3.5 w-3.5" /> },
        { label: 'Cyclone Advisory', href: '/disaster', icon: <AlertTriangle className="h-3.5 w-3.5" /> },
      ]
    },
    { key: 'women', label: t('nav.women'), href: '/#women-safety' },
    { key: 'missing', label: t('nav.missing'), href: '/missing-person' },
    { key: 'firstAid', label: t('nav.firstAid'), href: '/first-aid' },
    { key: 'contact', label: t('nav.contact'), href: '/#contact' },
  ];

  const languages: { code: Language; label: string }[] = [
    { code: 'en', label: 'EN' },
    { code: 'hi', label: 'हिं' },
    { code: 'kn', label: 'ಕನ್ನ' },
  ];

  return (
    <header role="banner">
      {/* Skip Navigation */}
      <a href="#main-content" className="skip-nav">{t('site.skip')}</a>

      {/* ── TOP UTILITY BAR ── */}
      <div className="gov-utility-bar">
        <div className="gov-container">
          <div className="flex items-center justify-between gap-4 flex-wrap">

            {/* Left: Government label */}
            <div className="flex items-center gap-3">
              <span className="text-xs text-white/70 hidden sm:block font-medium">
                {t('site.gov')} | {t('site.ministry')}
              </span>
              <span className="text-xs text-white/70 sm:hidden font-medium">{t('site.gov')}</span>
            </div>

            {/* Right: Language + Accessibility + Login */}
            <div className="flex items-center gap-3 flex-wrap">

              {/* Language switcher */}
              <div className="flex items-center gap-1" role="group" aria-label="Language Switcher">
                {languages.map(lang => (
                  <button
                    key={lang.code}
                    onClick={() => setLanguage(lang.code)}
                    className={`lang-btn ${language === lang.code ? 'active' : ''}`}
                    aria-label={`Switch to ${lang.code}`}
                    aria-pressed={language === lang.code}
                  >
                    {lang.label}
                  </button>
                ))}
              </div>

              {/* Separator */}
              <span className="text-white/30 hidden sm:block">|</span>

              {/* Accessibility Controls */}
              <div className="hidden sm:flex items-center gap-1" role="group" aria-label="Accessibility Controls">
                <button onClick={decreaseFont} className="a11y-btn" title={t('accessibility.decreaseFont')}>A-</button>
                <button onClick={resetFont} className="a11y-btn" title="Normal font size">A</button>
                <button onClick={increaseFont} className="a11y-btn" title={t('accessibility.increaseFont')}>A+</button>
                <button
                  onClick={toggleContrast}
                  className={`a11y-btn ${highContrast ? 'active' : ''}`}
                  title={t('accessibility.highContrast')}
                  aria-pressed={highContrast}
                >⊕</button>
              </div>

              {/* Separator */}
              <span className="text-white/30 hidden sm:block">|</span>

              {/* Auth links */}
              {isAuthenticated ? (
                <div className="flex items-center gap-2">
                  <span className="text-xs text-white/80">
                    {t('common.hello')}, <strong className="text-white">{user?.name?.split(' ')[0]}</strong>
                  </span>
                  {user?.role === 'admin' && (
                    <Link href="/admin" className="text-xs text-yellow-300 hover:text-yellow-100 font-semibold">
                      Admin
                    </Link>
                  )}
                  <button onClick={logout} className="text-xs text-white/70 hover:text-white flex items-center gap-1">
                    <LogOut className="h-3 w-3" />
                    <span className="hidden sm:inline">{t('nav.logout')}</span>
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Link href="/login" className="text-xs text-white/80 hover:text-white font-medium flex items-center gap-1">
                    <User className="h-3 w-3" />
                    <span>{t('nav.login')}</span>
                  </Link>
                  <span className="text-white/30">|</span>
                  <Link href="/login?role=admin" className="text-xs text-white/80 hover:text-white font-medium">
                    {t('nav.adminLogin')}
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ── HEADER MAIN (Logo + Site Name) ── */}
      <div className="gov-header-main">
        <div className="gov-container">
          <div className="flex items-center justify-between gap-4">

            {/* Emblem + Site Name */}
            <Link href="/" className="flex items-center gap-4 no-underline" aria-label="Go to Homepage">
              {/* Government Seal SVG */}
              <div className="flex-shrink-0">
                <svg width="56" height="56" viewBox="0 0 56 56" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                  <circle cx="28" cy="28" r="27" stroke="#1B2B6B" strokeWidth="2" fill="#EEF4FB"/>
                  <circle cx="28" cy="28" r="20" stroke="#0057A8" strokeWidth="1.5" fill="none"/>
                  {/* Ashoka Chakra spokes */}
                  {Array.from({length: 24}).map((_, i) => {
                    const angle = (i * 360) / 24;
                    const rad = (angle * Math.PI) / 180;
                    const x1 = 28 + 9 * Math.cos(rad);
                    const y1 = 28 + 9 * Math.sin(rad);
                    const x2 = 28 + 17 * Math.cos(rad);
                    const y2 = 28 + 17 * Math.sin(rad);
                    return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="#1B2B6B" strokeWidth="0.8"/>;
                  })}
                  <circle cx="28" cy="28" r="9" stroke="#1B2B6B" strokeWidth="1.2" fill="none"/>
                  <circle cx="28" cy="28" r="2.5" fill="#1B2B6B"/>
                  {/* Lion heads simplified */}
                  <text x="28" y="48" textAnchor="middle" fontSize="7" fill="#1B2B6B" fontWeight="bold" fontFamily="serif">🦁</text>
                </svg>
              </div>

              <div>
                <p className="gov-emblem-text">{t('site.gov')}</p>
                <h1 className="text-lg font-bold text-[#1B2B6B] leading-tight mt-0.5">
                  {t('site.name')}
                </h1>
                <p className="text-xs text-gray-500 mt-0.5">{t('site.ministry')}</p>
              </div>
            </Link>

            {/* Right: Emergency phone numbers (desktop) */}
            <div className="hidden lg:flex items-center gap-6">
              <div className="text-center">
                <div className="text-2xl font-black text-[#CC0001] font-mono">112</div>
                <div className="text-xs text-gray-500 font-medium">National Emergency</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-black text-[#CC0001] font-mono">108</div>
                <div className="text-xs text-gray-500 font-medium">Ambulance</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-black text-[#CC0001] font-mono">181</div>
                <div className="text-xs text-gray-500 font-medium">Women Helpline</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── TRICOLOR BAR ── */}
      <div className="tricolor-bar" aria-hidden="true" />

      {/* ── MAIN NAVIGATION ── */}
      <nav className="gov-navbar" role="navigation" aria-label="Main Navigation" ref={dropdownRef}>
        <div className="gov-container">
          <div className="flex items-center justify-between">

            {/* Desktop Nav Links */}
            <div className="hidden lg:flex items-center">
              {navItems.map(item => (
                <div key={item.key} className="relative">
                  {item.children ? (
                    <>
                      <button
                        className={`gov-nav-link flex items-center gap-1 ${activeDropdown === item.key ? 'active' : ''}`}
                        onClick={() => setActiveDropdown(activeDropdown === item.key ? null : item.key)}
                        aria-expanded={activeDropdown === item.key}
                        aria-haspopup="true"
                      >
                        {item.label}
                        <ChevronDown className={`h-3 w-3 transition-transform ${activeDropdown === item.key ? 'rotate-180' : ''}`} />
                      </button>
                      {activeDropdown === item.key && (
                        <div className="gov-dropdown" role="menu">
                          {item.children.map((child, i) => (
                            <Link
                              key={i}
                              href={child.href}
                              className="gov-dropdown-item flex items-center gap-2"
                              role="menuitem"
                              onClick={() => setActiveDropdown(null)}
                            >
                              <span className="text-[#0057A8]">{child.icon}</span>
                              {child.label}
                            </Link>
                          ))}
                        </div>
                      )}
                    </>
                  ) : (
                    <Link
                      href={item.href}
                      className={`gov-nav-link ${pathname === item.href ? 'active' : ''}`}
                    >
                      {item.label}
                    </Link>
                  )}
                </div>
              ))}
            </div>

            {/* Desktop: SOS Button */}
            <div className="hidden lg:flex items-center gap-2">
              <button
                onClick={onTriggerWomensSOS}
                className="gov-btn-women-sos text-xs py-2 px-3 animate-pulse"
                aria-label="Women Safety SOS"
              >
                ♀ {t('hero.womenSOS')}
              </button>
              <button
                onClick={onTriggerSOS}
                className="gov-btn-sos text-xs py-2 px-3"
                aria-label="Emergency SOS"
              >
                🚨 {t('hero.sos')}
              </button>
            </div>

            {/* Mobile: Hamburger */}
            <div className="lg:hidden flex items-center gap-2 py-1">
              <button
                onClick={onTriggerWomensSOS}
                className="gov-btn-women-sos text-[11px] py-1.5 px-2.5 animate-pulse"
              >
                ♀ SOS
              </button>
              <button
                onClick={() => setMobileOpen(!mobileOpen)}
                className="text-white p-2"
                aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
                aria-expanded={mobileOpen}
              >
                {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </button>
            </div>
          </div>

          {/* Mobile Drawer */}
          {mobileOpen && (
            <div className="lg:hidden border-t border-white/10 py-2" role="navigation" aria-label="Mobile Navigation">
              {navItems.map(item => (
                <Link
                  key={item.key}
                  href={item.href === '#' ? '/' : item.href}
                  className="block py-2.5 px-2 text-sm text-white/90 hover:text-white hover:bg-white/10 font-medium border-b border-white/5"
                  onClick={() => setMobileOpen(false)}
                >
                  {item.label}
                </Link>
              ))}
              <div className="pt-3 pb-1 px-2">
                <button
                  onClick={() => { onTriggerSOS(); setMobileOpen(false); }}
                  className="gov-btn-sos w-full text-sm justify-center"
                >
                  🚨 {t('hero.sos')}
                </button>
              </div>
            </div>
          )}
        </div>
      </nav>
    </header>
  );
};
