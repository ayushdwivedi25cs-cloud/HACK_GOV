'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import {
  Activity, Shield, Flame, Monitor, Heart, Users, Baby, Search,
  AlertTriangle, FileText, Phone, MapPin, ChevronRight, Send,
  Mic, MicOff, Volume2, BookOpen, Loader2, CheckCircle,
  Siren, Info, ArrowRight, Navigation, UserCheck
} from 'lucide-react';

const ALERTS = [
  { id: 1, type: 'warning', text: 'IMD Issues Heavy Rainfall Warning for Coastal Karnataka — 02 July 2024' },
  { id: 2, type: 'info', text: 'Cyber Crime Helpline 1930 now operational 24/7 — Ministry of Home Affairs' },
  { id: 3, type: 'warning', text: 'Orange Alert: Flash Floods Possible in Western Ghats Districts — NDMA Advisory' },
  { id: 4, type: 'info', text: 'New Missing Person AI Portal Launched — Register and Track Cases Digitally' },
  { id: 5, type: 'warning', text: 'Heat Wave Advisory: Stay Hydrated — Temperatures may reach 43°C in Northern Plains' },
];

const HELPLINES = [
  { number: '112', label: 'National Emergency', color: 'border-l-[#CC0001]' },
  { number: '108', label: 'Ambulance (EMRI)', color: 'border-l-[#CC0001]' },
  { number: '100', label: 'Police', color: 'border-l-[#0057A8]' },
  { number: '101', label: 'Fire Brigade', color: 'border-l-[#FF6200]' },
  { number: '181', label: 'Women Helpline', color: 'border-l-[#8B0045]' },
  { number: '1098', label: 'Childline', color: 'border-l-[#138808]' },
  { number: '1930', label: 'Cyber Crime', color: 'border-l-[#0057A8]' },
  { number: '1078', label: 'NDMA Disaster', color: 'border-l-[#FF6200]' },
];

const GUIDANCE_STEPS = [
  { icon: '🪪', title: 'Lost Aadhaar Card', href: '/guidance', steps: 3, time: '15 min' },
  { icon: '💳', title: 'Lost PAN Card', href: '/guidance', steps: 4, time: '7 days' },
  { icon: '📗', title: 'Lost Passport', href: '/guidance', steps: 5, time: '30 days' },
  { icon: '🚗', title: 'Lost Driving Licence', href: '/guidance', steps: 4, time: '15 days' },
  { icon: '🔒', title: 'Cyber Crime Complaint', href: '/guidance', steps: 3, time: '24 hrs' },
  { icon: '👩‍⚖️', title: "Women's Safety Complaint", href: '/guidance', steps: 3, time: 'Immediate' },
];

export default function HomePage() {
  const { t } = useLanguage();
  const { user, isAuthenticated } = useAuth();
  const [aiMessage, setAiMessage] = useState('');
  const [aiMessages, setAiMessages] = useState<{ role: 'user' | 'bot'; text: string }[]>([
    { role: 'bot', text: 'Namaste! I am your Government AI Help Desk. How can I assist you today? You can type in English, हिन्दी, or ಕನ್ನಡ.' }
  ]);
  const [aiLoading, setAiLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef<any>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const [tickerPaused, setTickerPaused] = useState(false);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [aiMessages]);

  const sendAiMessage = async (msg: string) => {
    if (!msg.trim()) return;
    const userMsg = msg.trim();
    setAiMessage('');
    setAiMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setAiLoading(true);
    try {
      const res = await fetch('http://localhost:5000/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userMsg, language: 'english' })
      });
      const data = await res.json();
      setAiMessages(prev => [...prev, { role: 'bot', text: data.response || 'Sorry, I could not process your request.' }]);
    } catch {
      setAiMessages(prev => [...prev, { role: 'bot', text: 'Unable to reach the government AI service. Please try again or call 112 for immediate assistance.' }]);
    } finally { setAiLoading(false); }
  };

  const toggleVoice = () => {
    if (!('webkitSpeechRecognition' in window || 'SpeechRecognition' in window)) {
      alert('Voice input not supported in this browser. Please use Chrome.'); return;
    }
    if (isListening) {
      recognitionRef.current?.stop(); setIsListening(false); return;
    }
    const SR = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    const rec = new SR();
    rec.lang = 'en-IN'; rec.interimResults = false;
    rec.onresult = (e: any) => { setAiMessage(e.results[0][0].transcript); setIsListening(false); };
    rec.onerror = () => setIsListening(false);
    rec.onend = () => setIsListening(false);
    recognitionRef.current = rec;
    rec.start(); setIsListening(true);
  };

  const services = [
    { key: 'medical', icon: <Activity className="h-6 w-6" />, href: '/', color: 'text-red-600', bg: 'bg-red-50' },
    { key: 'police', icon: <Shield className="h-6 w-6" />, href: '/', color: 'text-blue-700', bg: 'bg-blue-50' },
    { key: 'fire', icon: <Flame className="h-6 w-6" />, href: '/', color: 'text-orange-600', bg: 'bg-orange-50' },
    { key: 'cyber', icon: <Monitor className="h-6 w-6" />, href: '/scam-detector', color: 'text-indigo-700', bg: 'bg-indigo-50' },
    { key: 'women', icon: <UserCheck className="h-6 w-6" />, href: '/#women-safety', color: 'text-pink-700', bg: 'bg-pink-50' },
    { key: 'domestic', icon: <Heart className="h-6 w-6" />, href: '/guidance', color: 'text-purple-700', bg: 'bg-purple-50' },
    { key: 'child', icon: <Baby className="h-6 w-6" />, href: '/', color: 'text-yellow-600', bg: 'bg-yellow-50' },
    { key: 'disaster', icon: <AlertTriangle className="h-6 w-6" />, href: '/disaster', color: 'text-amber-600', bg: 'bg-amber-50' },
    { key: 'missing', icon: <Search className="h-6 w-6" />, href: '/missing-person', color: 'text-teal-700', bg: 'bg-teal-50' },
    { key: 'document', icon: <FileText className="h-6 w-6" />, href: '/guidance', color: 'text-slate-700', bg: 'bg-slate-50' },
    { key: 'scam', icon: <Monitor className="h-6 w-6" />, href: '/scam-detector', color: 'text-violet-700', bg: 'bg-violet-50' },
    { key: 'firstAid', icon: <Activity className="h-6 w-6" />, href: '/first-aid', color: 'text-emerald-700', bg: 'bg-emerald-50' },
  ];

  return (
    <>
      {/* ════════ EMERGENCY ALERT BANNER ════════ */}
      <div className="alert-banner" role="alert" aria-live="polite">
        <div className="gov-container">
          <div className="flex items-center gap-3">
            <span className="alert-badge flex-shrink-0">⚠ {t('alert.title')}</span>
            <div
              className="ticker-wrap flex-1 overflow-hidden cursor-pointer"
              onMouseEnter={() => setTickerPaused(true)}
              onMouseLeave={() => setTickerPaused(false)}
            >
              <div className={`ticker-content text-gray-700 font-medium ${tickerPaused ? '[animation-play-state:paused]' : ''}`}>
                {ALERTS.map(a => (
                  <span key={a.id} className="mr-16">
                    {a.type === 'warning' ? '🔴' : '🔵'} {a.text}
                  </span>
                ))}
              </div>
            </div>
            <Link href="#" className="text-xs text-blue-700 font-semibold hover:underline flex-shrink-0">
              {t('alert.view')}
            </Link>
          </div>
        </div>
      </div>

      {/* ════════ HERO SECTION ════════ */}
      <section className="gov-hero" aria-labelledby="hero-heading">
        <div className="gov-container relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
            {/* Left: Content */}
            <div>
              <div className="gov-hero-badge">
                <CheckCircle className="h-3.5 w-3.5 text-green-300" />
                {t('hero.certified')}
              </div>

              <h2 id="hero-heading" className="gov-hero h1">
                {t('hero.title')}
              </h2>

              <p className="gov-hero-tagline">"{t('hero.tagline')}"</p>
              <p className="gov-hero-desc">{t('hero.desc')}</p>

              {/* CTA Buttons */}
              <div className="flex flex-wrap gap-3">
                <Link href="#emergency-sos" className="gov-btn-sos">
                  🚨 {t('hero.sos')}
                </Link>
                <Link href="#women-safety" className="gov-btn-women-sos">
                  ♀ {t('hero.womenSOS')}
                </Link>
                <Link href="#ai-helpdesk" className="gov-btn-secondary">
                  🤖 {t('hero.aiAssist')}
                </Link>
                <Link href="#nearby-services" className="gov-btn-secondary">
                  📍 {t('hero.nearbyHelp')}
                </Link>
              </div>
            </div>

            {/* Right: Helpline panel */}
            <div className="hidden lg:block">
              <div className="bg-white/10 border border-white/20 rounded p-6 backdrop-blur-sm">
                <h3 className="text-white font-bold text-sm uppercase tracking-wider mb-4 flex items-center gap-2">
                  <Phone className="h-4 w-4 text-red-300" />
                  {t('helplines.title')}
                </h3>
                <div className="grid grid-cols-2 gap-2">
                  {HELPLINES.slice(0, 6).map(h => (
                    <a key={h.number} href={`tel:${h.number}`}
                      className="flex items-center gap-2 bg-white/10 hover:bg-white/20 p-2.5 rounded transition-colors group">
                      <span className="text-red-300 font-black text-base font-mono">{h.number}</span>
                      <span className="text-white/75 text-xs group-hover:text-white">{h.label}</span>
                    </a>
                  ))}
                </div>
                <p className="text-white/50 text-xs mt-3 text-center">
                  Available 24×7 — Free of charge from any network
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ════════ QUICK ACCESS SERVICES ════════ */}
      <section className="gov-section-white" aria-labelledby="services-heading">
        <div className="gov-container">
          <div className="mb-6">
            <h2 id="services-heading" className="gov-section-title">{t('services.title')}</h2>
            <p className="gov-section-subtitle">{t('services.subtitle')}</p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {services.map(svc => {
              const svcT = t(`services.${svc.key}.title`);
              const svcD = t(`services.${svc.key}.desc`);
              return (
                <Link key={svc.key} href={svc.href}
                  className="gov-service-card group text-center items-center"
                  aria-label={svcT}
                >
                  <div className={`gov-service-card-icon ${svc.bg} ${svc.color} mx-auto group-hover:scale-110 transition-transform`}>
                    {svc.icon}
                  </div>
                  <h3 className="text-xs font-bold text-center leading-tight mb-1">{svcT}</h3>
                  <p className="text-[11px] text-gray-500 text-center leading-tight hidden sm:block flex-1">{svcD}</p>
                  <span className="text-xs text-blue-700 font-semibold mt-2 hover:underline">{t('services.medical.btn')}</span>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* ════════ EMERGENCY SOS PANEL ════════ */}
      <section id="emergency-sos" className="gov-section-gray" aria-labelledby="sos-heading">
        <div className="gov-container">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left: SOS info */}
            <div className="lg:col-span-1">
              <h2 id="sos-heading" className="gov-section-title">{t('sos.title')}</h2>
              <p className="gov-section-subtitle">{t('sos.subtitle')}</p>

              <div className="gov-notice-danger gov-notice mb-4">
                <p className="text-sm font-semibold text-red-700">
                  🚨 {t('sos.note')}
                </p>
              </div>

              {/* Helplines */}
              <div className="space-y-2">
                {HELPLINES.map(h => (
                  <a key={h.number} href={`tel:${h.number}`}
                    className={`helpline-card flex items-center justify-between hover:bg-blue-50 transition-colors ${h.color}`}>
                    <span className="helpline-label">{h.label}</span>
                    <span className="helpline-number">{h.number}</span>
                  </a>
                ))}
              </div>
            </div>

            {/* Right: SOS Category grid */}
            <div className="lg:col-span-2">
              <div className="gov-card">
                <div className="flex items-center gap-2 mb-4 pb-3 border-b border-gray-100">
                  <AlertTriangle className="h-5 w-5 text-red-600" />
                  <h3 className="font-bold text-gray-800">{t('sos.select')}</h3>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-4">
                  {[
                    { key: 'medical', icon: '🏥', color: 'border-red-200 hover:border-red-400 hover:bg-red-50' },
                    { key: 'police', icon: '🚔', color: 'border-blue-200 hover:border-blue-400 hover:bg-blue-50' },
                    { key: 'fire', icon: '🔥', color: 'border-orange-200 hover:border-orange-400 hover:bg-orange-50' },
                    { key: 'women', icon: '♀', color: 'border-pink-200 hover:border-pink-400 hover:bg-pink-50' },
                    { key: 'disaster', icon: '🌊', color: 'border-amber-200 hover:border-amber-400 hover:bg-amber-50' },
                    { key: 'missing', icon: '🔍', color: 'border-teal-200 hover:border-teal-400 hover:bg-teal-50' },
                    { key: 'child', icon: '👶', color: 'border-yellow-200 hover:border-yellow-400 hover:bg-yellow-50' },
                    { key: 'cyber', icon: '💻', color: 'border-indigo-200 hover:border-indigo-400 hover:bg-indigo-50' },
                    { key: 'other', icon: '📞', color: 'border-gray-200 hover:border-gray-400 hover:bg-gray-50' },
                  ].map(cat => (
                    <Link key={cat.key} href={`/guidance`}
                      className={`p-4 rounded border-2 text-center transition-all cursor-pointer ${cat.color} block`}
                    >
                      <div className="text-2xl mb-1">{cat.icon}</div>
                      <div className="text-xs font-bold text-gray-700 leading-tight">
                        {t(`sos.categories.${cat.key}`)}
                      </div>
                    </Link>
                  ))}
                </div>

                <div className="gov-notice gov-notice-info flex items-start gap-2">
                  <Info className="h-4 w-4 text-blue-600 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-blue-800">
                    For immediate life-threatening emergency, directly call <strong>112</strong>. This platform logs incidents and alerts your registered emergency contacts.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ════════ AI GOVERNMENT HELPDESK ════════ */}
      <section id="ai-helpdesk" className="gov-section-white" aria-labelledby="ai-heading">
        <div className="gov-container">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
            {/* Left: Description */}
            <div>
              <h2 id="ai-heading" className="gov-section-title">{t('ai.title')}</h2>
              <p className="gov-section-subtitle">{t('ai.subtitle')}</p>
              <p className="text-sm text-gray-600 mb-5 leading-relaxed">{t('ai.desc')}</p>

              {/* Features */}
              <div className="space-y-3 mb-6">
                {[
                  { icon: '🗣️', label: 'Voice Input — English, हिन्दी, ಕನ್ನಡ' },
                  { icon: '🔊', label: 'Text-to-Speech response in your language' },
                  { icon: '🚨', label: 'Distress detection with auto-helpline routing' },
                  { icon: '📋', label: 'Step-by-step government procedure guidance' },
                  { icon: '🕐', label: 'Available 24×7, even during network disruptions' },
                ].map((f, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <span className="text-lg">{f.icon}</span>
                    <span className="text-sm text-gray-700">{f.label}</span>
                  </div>
                ))}
              </div>

              {/* Suggested questions */}
              <div>
                <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Suggested Questions</p>
                <div className="flex flex-wrap gap-2">
                  {(t('ai.suggestions') as unknown as string[]).map((q: string, i: number) => (
                    <button key={i}
                      onClick={() => sendAiMessage(q)}
                      className="text-xs bg-blue-50 text-blue-700 border border-blue-200 px-3 py-1.5 rounded hover:bg-blue-100 transition-colors font-medium"
                    >
                      {q}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Right: Chat interface */}
            <div className="gov-helpdesk">
              <div className="gov-helpdesk-header">
                <div className="w-8 h-8 bg-white/20 rounded flex items-center justify-center text-base">🤖</div>
                <div>
                  <div className="font-bold text-sm">{t('ai.title')}</div>
                  <div className="text-xs text-white/60">Government of India • Online</div>
                </div>
                <div className="ml-auto flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></span>
                  <span className="text-xs text-white/60">Live</span>
                </div>
              </div>

              <div className="gov-helpdesk-messages" role="log" aria-live="polite" aria-label="Chat messages">
                {aiMessages.map((msg, i) => (
                  <div key={i} className={msg.role === 'bot' ? 'gov-msg-bot' : 'gov-msg-user'}>
                    {msg.role === 'bot' && <span className="text-[10px] text-blue-500 font-bold block mb-1">GOV AI NAVIGATOR</span>}
                    <p className="text-sm whitespace-pre-line">{msg.text}</p>
                  </div>
                ))}
                {aiLoading && (
                  <div className="gov-msg-bot">
                    <Loader2 className="h-4 w-4 animate-spin text-blue-600" />
                  </div>
                )}
                <div ref={chatEndRef} />
              </div>

              <div className="p-3 border-t border-gray-200 bg-white">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={aiMessage}
                    onChange={e => setAiMessage(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && sendAiMessage(aiMessage)}
                    placeholder={t('ai.placeholder')}
                    className="flex-1 border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-200"
                    aria-label="Type your question"
                  />
                  <button
                    onClick={toggleVoice}
                    className={`p-2 rounded border transition-colors ${isListening ? 'bg-red-600 border-red-600 text-white' : 'border-gray-300 text-gray-500 hover:bg-gray-50'}`}
                    aria-label={t('ai.voice')}
                    title={t('ai.voice')}
                  >
                    {isListening ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
                  </button>
                  <button
                    onClick={() => sendAiMessage(aiMessage)}
                    disabled={!aiMessage.trim() || aiLoading}
                    className="gov-btn-primary gov-btn-sm disabled:opacity-50"
                    aria-label={t('ai.send')}
                  >
                    <Send className="h-4 w-4" />
                    <span className="hidden sm:inline">{t('ai.send')}</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ════════ GOVERNMENT GUIDANCE ════════ */}
      <section className="gov-section-gray" aria-labelledby="guidance-heading">
        <div className="gov-container">
          <div className="mb-6">
            <h2 id="guidance-heading" className="gov-section-title">{t('guidance.title')}</h2>
            <p className="gov-section-subtitle">{t('guidance.subtitle')}</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {GUIDANCE_STEPS.map(g => (
              <Link key={g.title} href={g.href} className="guidance-card group">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{g.icon}</span>
                  <div>
                    <div className="font-semibold text-sm group-hover:text-blue-700">{g.title}</div>
                    <div className="text-xs text-gray-500">{g.steps} steps • Est. time: {g.time}</div>
                  </div>
                </div>
                <ChevronRight className="h-4 w-4 text-gray-400 group-hover:text-blue-600 flex-shrink-0" />
              </Link>
            ))}
          </div>

          <div className="mt-4 text-center">
            <Link href="/guidance" className="gov-btn-outline">
              <BookOpen className="h-4 w-4" />
              View All Government Procedures
            </Link>
          </div>
        </div>
      </section>

      {/* ════════ WOMEN SAFETY SECTION ════════ */}
      <section id="women-safety" className="women-safety-section" aria-labelledby="women-heading">
        <div className="gov-container">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <div>
              <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 px-3 py-1 rounded text-xs font-bold uppercase tracking-wider mb-4">
                ♀ {t('common.official')}
              </div>
              <h2 id="women-heading" className="text-2xl font-bold text-white mb-3">
                {t('women.title')}
              </h2>
              <p className="text-base text-white/80 mb-2 font-medium italic">{t('women.subtitle')}</p>
              <p className="text-sm text-white/65 leading-relaxed mb-6">{t('women.desc')}</p>

              <div className="flex flex-wrap gap-3">
                <a href="tel:181" className="gov-btn-primary bg-white text-[#8B0045] border-white hover:bg-white/90">
                  <Phone className="h-4 w-4" />
                  {t('women.helpline')}
                </a>
                <a href="tel:112" className="gov-btn-secondary">
                  <Phone className="h-4 w-4" />
                  {t('women.police')}
                </a>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {[
                { icon: '📍', label: t('women.location'), desc: 'Share live GPS location with trusted contacts' },
                { icon: '🔔', label: t('women.siren'), desc: 'Activate loud audio siren to deter attackers' },
                { icon: '📞', label: t('women.helpline'), desc: 'Direct connect to Women Helpline 181' },
                { icon: '🚔', label: t('women.nearest'), desc: 'Find nearest police station with navigation' },
              ].map((item, i) => (
                <div key={i} className="bg-white/10 border border-white/15 p-4 rounded hover:bg-white/15 transition-colors">
                  <div className="text-2xl mb-2">{item.icon}</div>
                  <div className="text-white font-bold text-sm mb-1">{item.label}</div>
                  <div className="text-white/60 text-xs leading-relaxed">{item.desc}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ════════ NEARBY SERVICES MAP ════════ */}
      <section id="nearby-services" className="gov-section-white" aria-labelledby="nearby-heading">
        <div className="gov-container">
          <div className="mb-6">
            <h2 id="nearby-heading" className="gov-section-title">{t('nav.nearby')}</h2>
            <p className="gov-section-subtitle">Find government facilities near your location</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Map placeholder */}
            <div className="lg:col-span-2">
              <div className="border border-gray-200 rounded bg-gray-100 h-72 flex flex-col items-center justify-center gap-3">
                <MapPin className="h-10 w-10 text-gray-400" />
                <p className="text-sm font-medium text-gray-500">Enable location to find nearby services</p>
                <button
                  onClick={() => navigator.geolocation?.getCurrentPosition(() => {})}
                  className="gov-btn-primary gov-btn-sm"
                >
                  <Navigation className="h-4 w-4" />
                  Enable Location Access
                </button>
              </div>
            </div>

            {/* Nearby categories */}
            <div className="space-y-2">
              {[
                { icon: '🏥', label: 'Hospitals & Clinics', count: 'Finding...' },
                { icon: '🚔', label: 'Police Stations', count: 'Finding...' },
                { icon: '🚒', label: 'Fire Stations', count: 'Finding...' },
                { icon: '🏛️', label: 'Government Offices', count: 'Finding...' },
                { icon: '⛺', label: 'Relief Shelters', count: 'Finding...' },
                { icon: '💊', label: 'Pharmacies', count: 'Finding...' },
              ].map((item, i) => (
                <div key={i} className="flex items-center justify-between p-3 border border-gray-200 rounded hover:border-blue-300 hover:bg-blue-50 transition-colors cursor-pointer">
                  <div className="flex items-center gap-3">
                    <span className="text-xl">{item.icon}</span>
                    <span className="text-sm font-medium text-gray-700">{item.label}</span>
                  </div>
                  <span className="text-xs text-gray-400 font-medium">{item.count}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ════════ MISSING PERSON ════════ */}
      <section className="gov-section-blue" aria-labelledby="missing-heading">
        <div className="gov-container">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <div>
              <h2 id="missing-heading" className="gov-section-title">{t('missing.title')}</h2>
              <p className="gov-section-subtitle">{t('missing.subtitle')}</p>
              <div className="flex flex-wrap gap-3 mt-4">
                <Link href="/missing-person" className="gov-btn-primary">
                  <Search className="h-4 w-4" />
                  {t('missing.report')}
                </Link>
                <Link href="/missing-person" className="gov-btn-outline">
                  {t('missing.poster')}
                </Link>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-3">
              {[
                { icon: '📸', label: 'Upload Photo', desc: 'Clear recent photo' },
                { icon: '📝', label: 'Enter Details', desc: 'Age, description, location' },
                { icon: '📢', label: 'Auto Report', desc: 'Submit to authorities instantly' },
              ].map((step, i) => (
                <div key={i} className="gov-card text-center">
                  <div className="text-3xl mb-2">{step.icon}</div>
                  <div className="text-sm font-bold text-gray-800 mb-1">Step {i + 1}</div>
                  <div className="text-xs font-semibold text-blue-700 mb-1">{step.label}</div>
                  <div className="text-xs text-gray-500">{step.desc}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ════════ FIRST AID SECTION ════════ */}
      <section className="gov-section-white" aria-labelledby="firstaid-heading">
        <div className="gov-container">
          <div className="mb-6">
            <h2 id="firstaid-heading" className="gov-section-title">{t('nav.firstAid')}</h2>
            <p className="gov-section-subtitle">Government-approved voice-guided emergency first aid instructions</p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mb-4">
            {[
              { icon: '❤️', label: 'CPR' },
              { icon: '🔥', label: 'Burns' },
              { icon: '🐍', label: 'Snake Bite' },
              { icon: '😮', label: 'Choking' },
              { icon: '🩸', label: 'Bleeding' },
              { icon: '🦴', label: 'Fracture' },
            ].map((item, i) => (
              <Link key={i} href="/first-aid"
                className="gov-card text-center hover:border-blue-300 cursor-pointer group">
                <div className="text-3xl mb-2">{item.icon}</div>
                <div className="text-sm font-bold text-gray-700 group-hover:text-blue-700">{item.label}</div>
                <div className="text-xs text-blue-600 mt-1 font-medium">Voice Guide →</div>
              </Link>
            ))}
          </div>
          <div className="text-center">
            <Link href="/first-aid" className="gov-btn-primary">
              <Volume2 className="h-4 w-4" />
              Open Full First Aid Guide
            </Link>
          </div>
        </div>
      </section>

      {/* ════════ DISASTER ASSISTANCE ════════ */}
      <section className="gov-section-gray" aria-labelledby="disaster-heading">
        <div className="gov-container">
          <div className="mb-6">
            <h2 id="disaster-heading" className="gov-section-title">{t('nav.disaster')}</h2>
            <p className="gov-section-subtitle">Government disaster response procedures, safe routes & relief camp locations</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 mb-4">
            {[
              { icon: '🌊', label: 'Floods', status: 'Advisory Active', color: 'border-blue-300 bg-blue-50' },
              { icon: '🏔️', label: 'Earthquakes', status: 'Safe Zone', color: 'border-gray-300 bg-gray-50' },
              { icon: '🌀', label: 'Cyclones', status: 'Watch Mode', color: 'border-yellow-300 bg-yellow-50' },
              { icon: '🔥', label: 'Wildfires', status: 'Safe Zone', color: 'border-gray-300 bg-gray-50' },
              { icon: '⛰️', label: 'Landslides', status: 'Alert Active', color: 'border-orange-300 bg-orange-50' },
            ].map((d, i) => (
              <Link key={i} href="/disaster"
                className={`gov-card border-2 text-center cursor-pointer hover:shadow-md ${d.color}`}>
                <div className="text-3xl mb-2">{d.icon}</div>
                <div className="text-sm font-bold text-gray-800 mb-1">{d.label}</div>
                <span className={`gov-badge text-xs ${d.status === 'Safe Zone' ? 'gov-badge-green' : d.status.includes('Active') ? 'gov-badge-red' : 'gov-badge-orange'}`}>
                  {d.status}
                </span>
              </Link>
            ))}
          </div>
          <div className="text-center">
            <Link href="/disaster" className="gov-btn-outline">
              <AlertTriangle className="h-4 w-4" />
              Open Disaster Assistance Portal
            </Link>
          </div>
        </div>
      </section>

      {/* ════════ FULL HELPLINES SECTION ════════ */}
      <section id="contact" className="gov-section-navy" aria-labelledby="helplines-heading">
        <div className="gov-container">
          <div className="mb-6 text-center">
            <h2 id="helplines-heading" className="text-xl font-bold text-white mb-2">
              {t('helplines.title')}
            </h2>
            <p className="text-white/60 text-sm">Free calls available 24×7 from any mobile or landline</p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {HELPLINES.map(h => (
              <a key={h.number} href={`tel:${h.number}`}
                className="bg-white/10 border border-white/15 hover:bg-white/20 p-4 rounded text-center transition-colors group">
                <div className="text-3xl font-black text-red-300 group-hover:text-white font-mono mb-1">
                  {h.number}
                </div>
                <div className="text-xs text-white/70 group-hover:text-white/90 font-medium">{h.label}</div>
              </a>
            ))}
          </div>

          <p className="text-center text-white/40 text-xs mt-6">
            Always call 112 first in a life-threatening emergency. This platform provides AI assistance in addition to emergency services.
          </p>
        </div>
      </section>
    </>
  );
}
