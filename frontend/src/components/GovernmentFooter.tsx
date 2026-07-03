'use client';

import React from 'react';
import Link from 'next/link';
import { useLanguage } from '../context/LanguageContext';
import { Phone, Mail, MapPin, ExternalLink } from 'lucide-react';

export const GovernmentFooter: React.FC = () => {
  const { t } = useLanguage();

  const quickLinks = [
    { label: t('nav.home'), href: '/' },
    { label: t('nav.guidance'), href: '/guidance' },
    { label: t('nav.disaster'), href: '/disaster' },
    { label: t('nav.women'), href: '/#women-safety' },
    { label: t('nav.missing'), href: '/missing-person' },
    { label: t('nav.firstAid'), href: '/first-aid' },
    { label: 'Scam Detector', href: '/scam-detector' },
    { label: 'Deepfake Forensics', href: '/deepfake' },
  ];

  const helplines = [
    { label: t('helplines.emergency'), number: '112' },
    { label: t('helplines.ambulance'), number: '108' },
    { label: t('helplines.police'), number: '100' },
    { label: t('helplines.fire'), number: '101' },
    { label: t('helplines.women'), number: '181' },
    { label: t('helplines.child'), number: '1098' },
    { label: t('helplines.cyber'), number: '1930' },
    { label: t('helplines.disaster'), number: '1078' },
  ];

  const govLinks = [
    { label: 'India.gov.in', href: 'https://www.india.gov.in', external: true },
    { label: 'MHA India', href: 'https://www.mha.gov.in', external: true },
    { label: 'NDMA India', href: 'https://ndma.gov.in', external: true },
    { label: 'Cyber Crime Portal', href: 'https://cybercrime.gov.in', external: true },
    { label: 'DigiLocker', href: 'https://digilocker.gov.in', external: true },
  ];

  return (
    <footer className="gov-footer" role="contentinfo">
      {/* Tricolor bar */}
      <div className="tricolor-bar" aria-hidden="true" />

      {/* Main footer content */}
      <div className="gov-footer-main">
        <div className="gov-container">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">

            {/* Column 1: About */}
            <div>
              <div className="flex items-center gap-3 mb-4">
                <svg width="40" height="40" viewBox="0 0 56 56" fill="none" aria-hidden="true">
                  <circle cx="28" cy="28" r="27" stroke="rgba(255,255,255,0.4)" strokeWidth="1.5" fill="rgba(255,255,255,0.05)"/>
                  {Array.from({length: 24}).map((_, i) => {
                    const angle = (i * 360) / 24;
                    const rad = (angle * Math.PI) / 180;
                    const x1 = 28 + 8 * Math.cos(rad);
                    const y1 = 28 + 8 * Math.sin(rad);
                    const x2 = 28 + 15 * Math.cos(rad);
                    const y2 = 28 + 15 * Math.sin(rad);
                    return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="rgba(255,255,255,0.5)" strokeWidth="0.8"/>;
                  })}
                  <circle cx="28" cy="28" r="8" stroke="rgba(255,255,255,0.5)" strokeWidth="1" fill="none"/>
                  <circle cx="28" cy="28" r="2.5" fill="rgba(255,255,255,0.7)"/>
                </svg>
                <div>
                  <div className="text-white font-bold text-sm leading-tight">
                    AI Emergency<br/>Government Navigator
                  </div>
                  <div className="text-white/50 text-[10px] mt-0.5">Government of India</div>
                </div>
              </div>
              <p className="text-sm text-white/65 leading-relaxed mb-4">
                {t('footer.aboutText')}
              </p>
              <div className="space-y-1.5">
                <div className="flex items-center gap-2 text-xs text-white/60">
                  <Phone className="h-3 w-3 text-white/40" />
                  <span>National Emergency: <strong className="text-white">112</strong></span>
                </div>
                <div className="flex items-center gap-2 text-xs text-white/60">
                  <Mail className="h-3 w-3 text-white/40" />
                  <span>support@aiegov.gov.in</span>
                </div>
              </div>
            </div>

            {/* Column 2: Quick Links */}
            <div>
              <div className="gov-footer-heading">{t('footer.quickLinks')}</div>
              <div className="space-y-0.5">
                {quickLinks.map(link => (
                  <Link key={link.href} href={link.href} className="gov-footer-link">
                    › {link.label}
                  </Link>
                ))}
              </div>
              <div className="mt-5">
                <div className="gov-footer-heading">{t('footer.privacy').slice(0,14)}</div>
                <Link href="#" className="gov-footer-link">› {t('footer.privacy')}</Link>
                <Link href="#" className="gov-footer-link">› {t('footer.terms')}</Link>
                <Link href="#" className="gov-footer-link">› {t('footer.accessibility')}</Link>
                <Link href="#" className="gov-footer-link">› {t('footer.sitemap')}</Link>
              </div>
            </div>

            {/* Column 3: Helplines */}
            <div>
              <div className="gov-footer-heading">{t('footer.helplines')}</div>
              <div className="space-y-2">
                {helplines.map(h => (
                  <div key={h.number} className="flex items-center justify-between">
                    <span className="text-xs text-white/65">{h.label}</span>
                    <a
                      href={`tel:${h.number}`}
                      className="text-sm font-black text-[#FF6B6B] hover:text-white font-mono ml-2"
                      aria-label={`Call ${h.label} at ${h.number}`}
                    >
                      {h.number}
                    </a>
                  </div>
                ))}
              </div>
            </div>

            {/* Column 4: Government Links */}
            <div>
              <div className="gov-footer-heading">{t('footer.connect')}</div>
              <div className="space-y-0.5 mb-6">
                {govLinks.map(link => (
                  <a
                    key={link.href}
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="gov-footer-link flex items-center gap-1"
                  >
                    › {link.label}
                    <ExternalLink className="h-2.5 w-2.5 opacity-40" />
                  </a>
                ))}
              </div>

              {/* NIC Branding */}
              <div className="mt-4 p-3 rounded border border-white/10 bg-white/5">
                <div className="text-[10px] text-white/40 uppercase tracking-wider mb-1">Developed by</div>
                <div className="text-xs text-white/80 font-semibold">
                  National Informatics Centre
                </div>
                <div className="text-[10px] text-white/50">Ministry of Electronics & IT</div>
                <div className="text-[10px] text-white/50">Government of India</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer Bottom */}
      <div className="gov-footer-bottom">
        <div className="gov-container">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-2 text-center sm:text-left">
            <span>{t('footer.copyright')}</span>
            <div className="flex items-center gap-3">
              <span className="text-white/40">{t('footer.nicCredit')}</span>
              <span className="text-white/30">|</span>
              <span className="text-white/40">
                {t('footer.lastUpdated')}: July 2024
              </span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};
