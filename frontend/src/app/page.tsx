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
  const [activeTab, setActiveTab] = useState<'sos' | 'ai'>('sos');
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
    if (activeTab === 'ai') {
      chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [aiMessages, activeTab]);

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
    { key: 'missing', icon: <Search className="h-6 w-6" />, href: '/missing-person', color: 'text-teal-700', bg: 'bg-teal-50' },
  ];

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* ════════ EMERGENCY ALERT BANNER ════════ */}
      <div className="alert-banner bg-yellow-50 border-b border-yellow-200" role="alert" aria-live="polite">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3 py-2">
            <span className="bg-red-600 text-white text-xs font-bold px-2 py-1 rounded-sm uppercase tracking-wider flex-shrink-0">
              ⚠ {t('alert.title') || 'Alert'}
            </span>
            <div
              className="ticker-wrap flex-1 overflow-hidden cursor-pointer"
              onMouseEnter={() => setTickerPaused(true)}
              onMouseLeave={() => setTickerPaused(false)}
            >
              <div className={`ticker-content text-gray-800 text-sm font-medium ${tickerPaused ? '[animation-play-state:paused]' : ''}`}>
                {ALERTS.map(a => (
                  <span key={a.id} className="mr-16 inline-block">
                    {a.type === 'warning' ? '🔴' : '🔵'} {a.text}
                  </span>
                ))}
              </div>
            </div>
            <Link href="#" className="text-xs text-blue-700 font-semibold hover:underline flex-shrink-0">
              {t('alert.view') || 'View All'}
            </Link>
          </div>
        </div>
      </div>

      {/* ════════ HERO & IRCTC-STYLE FLOATING CARD ════════ */}
      <section className="relative bg-gradient-to-br from-[#1B2B6B] via-[#0F1B45] to-[#0057A8] text-white pt-12 pb-40">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="flex flex-col lg:flex-row gap-8 items-start">
            
            {/* Left Column: Branding and Intro */}
            <div className="lg:w-[45%] pt-8">
              <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 text-white/90 text-xs font-bold px-3 py-1.5 rounded uppercase tracking-wider mb-6">
                <CheckCircle className="h-4 w-4 text-green-400" />
                {t('hero.certified') || 'Official Govt of India Platform'}
              </div>
              <h1 className="text-4xl lg:text-5xl font-bold mb-4 leading-tight">
                {t('hero.title') || 'AI Emergency Government Navigator'}
              </h1>
              <p className="text-lg text-blue-100 mb-6 italic">
                "{t('hero.tagline') || 'Your Digital Lifeline During Crisis'}"
              </p>
              <p className="text-sm text-white/80 leading-relaxed mb-8 max-w-md">
                {t('hero.desc') || 'A unified platform for instant SOS distress routing, AI-guided first aid, scam detection, disaster relief coordination, and missing person reporting.'}
              </p>

              <div className="flex flex-wrap gap-4">
                <Link href="#women-safety" className="bg-[#8B0045] hover:bg-[#6B0035] text-white px-6 py-3 rounded text-sm font-bold uppercase tracking-wider flex items-center gap-2 transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5 border border-[#8B0045]">
                  ♀ {t('hero.womenSOS') || "Women's Safety SOS"}
                </Link>
                <Link href="#helplines" className="bg-transparent border-2 border-white/40 hover:border-white hover:bg-white/10 text-white px-6 py-3 rounded text-sm font-bold uppercase tracking-wider flex items-center gap-2 transition-all">
                  <Phone className="h-4 w-4" />
                  View Helplines
                </Link>
              </div>
            </div>

            {/* Right Column: IRCTC Style Floating Card */}
            <div className="lg:w-[55%] w-full lg:mt-0 mt-8">
              <div className="bg-white rounded-lg shadow-[0_20px_50px_rgba(0,0,0,0.3)] overflow-hidden flex flex-col h-[520px]">
                {/* Card Tabs */}
                <div className="flex border-b border-gray-200 bg-gray-50">
                  <button 
                    onClick={() => setActiveTab('sos')} 
                    className={`flex-1 py-4 text-sm font-bold flex items-center justify-center gap-2 transition-colors ${activeTab === 'sos' ? 'bg-[#0057A8] text-white' : 'text-gray-600 hover:bg-gray-200'}`}
                  >
                    🚨 {t('hero.sos') || 'EMERGENCY SOS'}
                  </button>
                  <button 
                    onClick={() => setActiveTab('ai')} 
                    className={`flex-1 py-4 text-sm font-bold flex items-center justify-center gap-2 transition-colors ${activeTab === 'ai' ? 'bg-[#0057A8] text-white' : 'text-gray-600 hover:bg-gray-200'}`}
                  >
                    🤖 {t('hero.aiAssist') || 'AI HELPDESK'}
                  </button>
                </div>

                {/* Tab Content */}
                <div className="flex-1 p-6 overflow-hidden flex flex-col bg-white text-gray-800">
                  {activeTab === 'sos' ? (
                    <div className="flex flex-col h-full">
                      <div className="mb-4">
                        <h2 className="text-xl font-bold text-[#1B2B6B] flex items-center gap-2">
                          <AlertTriangle className="h-5 w-5 text-red-600" />
                          {t('sos.select') || 'Select Emergency Type'}
                        </h2>
                        <p className="text-sm text-gray-500 mt-1">Tap a category below to alert authorities and registered contacts instantly.</p>
                      </div>
                      
                      <div className="grid grid-cols-3 gap-3 mb-auto">
                        {[
                          { key: 'medical', icon: '🏥', color: 'border-red-200 hover:border-red-400 bg-red-50 text-red-800' },
                          { key: 'police', icon: '🚔', color: 'border-blue-200 hover:border-blue-400 bg-blue-50 text-blue-800' },
                          { key: 'fire', icon: '🔥', color: 'border-orange-200 hover:border-orange-400 bg-orange-50 text-orange-800' },
                          { key: 'women', icon: '♀', color: 'border-pink-200 hover:border-pink-400 bg-pink-50 text-pink-800' },
                          { key: 'disaster', icon: '🌊', color: 'border-amber-200 hover:border-amber-400 bg-amber-50 text-amber-800' },
                          { key: 'missing', icon: '🔍', color: 'border-teal-200 hover:border-teal-400 bg-teal-50 text-teal-800' },
                          { key: 'child', icon: '👶', color: 'border-yellow-200 hover:border-yellow-400 bg-yellow-50 text-yellow-800' },
                          { key: 'cyber', icon: '💻', color: 'border-indigo-200 hover:border-indigo-400 bg-indigo-50 text-indigo-800' },
                          { key: 'other', icon: '📞', color: 'border-gray-200 hover:border-gray-400 bg-gray-50 text-gray-800' },
                        ].map(cat => (
                          <Link key={cat.key} href={`/guidance`}
                            className={`p-4 rounded border text-center transition-all cursor-pointer shadow-sm hover:shadow ${cat.color} block`}
                          >
                            <div className="text-3xl mb-2">{cat.icon}</div>
                            <div className="text-xs font-bold leading-tight">
                              {t(`sos.categories.${cat.key}`) || cat.key.toUpperCase()}
                            </div>
                          </Link>
                        ))}
                      </div>

                      <div className="mt-4 p-3 bg-red-50 border-l-4 border-red-600 rounded text-sm text-red-800 flex gap-3 items-start">
                        <Info className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
                        <p>
                          <strong>{t('sos.note') || 'Life-Threatening Emergency?'}</strong><br/>
                          Directly dial <a href="tel:112" className="font-bold underline hover:text-red-900">112</a> for immediate assistance. This portal will also log your location.
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-col h-full bg-gray-50 border border-gray-200 rounded-lg overflow-hidden">
                      <div className="bg-[#1B2B6B] text-white px-4 py-3 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="text-xl">🤖</span>
                          <div>
                            <div className="text-sm font-bold">Government AI Navigator</div>
                            <div className="text-xs text-blue-200">Online • Supports Speech</div>
                          </div>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></span>
                          <span className="text-xs font-medium">Live</span>
                        </div>
                      </div>
                      
                      <div className="flex-1 p-4 overflow-y-auto flex flex-col gap-3 bg-[#F5F7FA]" role="log" aria-live="polite">
                        {aiMessages.map((msg, i) => (
                          <div key={i} className={`max-w-[85%] rounded p-3 text-sm shadow-sm ${msg.role === 'bot' ? 'bg-white border border-gray-200 text-gray-800 self-start rounded-tl-none' : 'bg-[#0057A8] text-white self-end rounded-tr-none'}`}>
                            {msg.role === 'bot' && <span className="text-[10px] text-blue-600 font-bold block mb-1 uppercase">GOV AI</span>}
                            <p className="whitespace-pre-line leading-relaxed">{msg.text}</p>
                          </div>
                        ))}
                        {aiLoading && (
                          <div className="bg-white border border-gray-200 p-3 rounded rounded-tl-none self-start shadow-sm">
                            <Loader2 className="h-4 w-4 animate-spin text-[#0057A8]" />
                          </div>
                        )}
                        <div ref={chatEndRef} />
                      </div>
                      
                      <div className="p-3 bg-white border-t border-gray-200">
                        <div className="flex gap-2">
                          <input
                            type="text"
                            value={aiMessage}
                            onChange={e => setAiMessage(e.target.value)}
                            onKeyDown={e => e.key === 'Enter' && sendAiMessage(aiMessage)}
                            placeholder={t('ai.placeholder') || "Ask for help, rules, or guidance..."}
                            className="flex-1 border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-[#0057A8] focus:ring-1 focus:ring-[#0057A8]"
                          />
                          <button
                            onClick={toggleVoice}
                            className={`p-2 rounded border transition-colors ${isListening ? 'bg-red-600 border-red-600 text-white' : 'border-gray-300 text-gray-500 hover:bg-gray-100'}`}
                            title="Speak"
                          >
                            {isListening ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
                          </button>
                          <button
                            onClick={() => sendAiMessage(aiMessage)}
                            disabled={!aiMessage.trim() || aiLoading}
                            className="bg-[#0057A8] hover:bg-[#004080] text-white px-4 py-2 rounded text-sm font-medium transition-colors disabled:opacity-50"
                          >
                            <Send className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ════════ IRCTC STYLE QUICK SERVICES GRID OVERLAP ════════ */}
      <section className="relative z-20 -mt-20 mb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-lg shadow-xl border border-gray-200 p-6">
            <h3 className="text-center font-bold text-gray-800 text-lg mb-6 uppercase tracking-wider border-b border-gray-100 pb-4">
              Explore Services
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4 justify-items-center">
              {[
                { icon: <Search className="w-6 h-6" />, label: 'Missing Person', href: '/missing-person', color: 'text-blue-600', bg: 'bg-blue-50' },
                { icon: <Monitor className="w-6 h-6" />, label: 'Scam Detect', href: '/scam-detector', color: 'text-indigo-600', bg: 'bg-indigo-50' },
                { icon: <Activity className="w-6 h-6" />, label: 'First Aid', href: '/first-aid', color: 'text-emerald-600', bg: 'bg-emerald-50' },
                { icon: <AlertTriangle className="w-6 h-6" />, label: 'Disaster Relief', href: '/disaster', color: 'text-amber-600', bg: 'bg-amber-50' },
                { icon: <BookOpen className="w-6 h-6" />, label: 'Guidance', href: '/guidance', color: 'text-slate-600', bg: 'bg-slate-50' },
                { icon: <MapPin className="w-6 h-6" />, label: 'Nearby Maps', href: '#nearby', color: 'text-red-600', bg: 'bg-red-50' },
                { icon: <Heart className="w-6 h-6" />, label: 'Domestic Abuse', href: '/guidance', color: 'text-pink-600', bg: 'bg-pink-50' },
                { icon: <FileText className="w-6 h-6" />, label: 'FIR Docs', href: '/guidance', color: 'text-cyan-600', bg: 'bg-cyan-50' },
              ].map((item, i) => (
                <Link key={i} href={item.href} className="flex flex-col items-center gap-2 group w-full text-center">
                  <div className={`w-14 h-14 rounded-full flex items-center justify-center transition-all duration-300 ${item.bg} ${item.color} group-hover:scale-110 group-hover:shadow-md border border-gray-100`}>
                    {item.icon}
                  </div>
                  <span className="text-xs font-semibold text-gray-600 group-hover:text-[#0057A8] max-w-[80px] leading-tight">
                    {item.label}
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ════════ GOVERNMENT GUIDANCE & PROCEDURES ════════ */}
      <section className="py-12 bg-white border-y border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-end mb-8">
            <div>
              <h2 className="text-2xl font-bold text-[#1B2B6B] mb-2">{t('guidance.title') || 'Government Procedures'}</h2>
              <p className="text-sm text-gray-500">Step-by-step guides for lost documents and official complaints</p>
            </div>
            <Link href="/guidance" className="text-sm font-bold text-[#0057A8] hover:underline flex items-center gap-1">
              View All <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {GUIDANCE_STEPS.map((g, i) => (
              <Link key={i} href={g.href} className="bg-gray-50 border border-gray-200 rounded-lg p-5 flex items-center justify-between hover:bg-blue-50 hover:border-blue-300 transition-colors group">
                <div className="flex items-center gap-4">
                  <div className="text-3xl bg-white p-2 rounded shadow-sm border border-gray-100">{g.icon}</div>
                  <div>
                    <h3 className="font-bold text-gray-800 text-sm group-hover:text-[#0057A8]">{g.title}</h3>
                    <p className="text-xs text-gray-500 mt-1">{g.steps} steps • Expected time: {g.time}</p>
                  </div>
                </div>
                <ChevronRight className="text-gray-400 group-hover:text-[#0057A8]" />
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ════════ NEARBY EMERGENCY SERVICES ════════ */}
      <section id="nearby" className="py-12 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-[#1B2B6B] mb-2">{t('nav.nearby') || 'Nearby Government Facilities'}</h2>
          <p className="text-sm text-gray-500 mb-8">Locate hospitals, police stations, and relief centers near you</p>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 bg-gray-200 rounded-lg border border-gray-300 h-[350px] flex flex-col items-center justify-center gap-4 relative overflow-hidden">
              <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/connected.png')] opacity-30"></div>
              <MapPin className="h-16 w-16 text-gray-400 z-10" />
              <p className="text-gray-600 font-medium z-10">Map requires location access</p>
              <button onClick={() => navigator.geolocation?.getCurrentPosition(() => {})} className="bg-[#0057A8] hover:bg-[#004080] text-white px-6 py-2 rounded text-sm font-bold shadow z-10 flex items-center gap-2">
                <Navigation className="h-4 w-4" /> Enable Location
              </button>
            </div>
            
            <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-4">
              <h3 className="font-bold text-gray-800 mb-4 pb-2 border-b border-gray-100">Find in radius</h3>
              <div className="flex flex-col gap-2">
                {[
                  { icon: '🏥', label: 'Hospitals & Clinics', color: 'bg-red-50' },
                  { icon: '🚔', label: 'Police Stations', color: 'bg-blue-50' },
                  { icon: '🚒', label: 'Fire Stations', color: 'bg-orange-50' },
                  { icon: '🏛️', label: 'Govt Offices', color: 'bg-gray-100' },
                  { icon: '⛺', label: 'Relief Shelters', color: 'bg-green-50' },
                  { icon: '💊', label: 'Pharmacies', color: 'bg-teal-50' }
                ].map((item, i) => (
                  <button key={i} className="flex items-center justify-between p-3 rounded border border-gray-100 hover:border-blue-300 hover:bg-blue-50 transition-colors w-full text-left">
                    <span className="flex items-center gap-3">
                      <span className={`w-8 h-8 rounded flex items-center justify-center text-lg ${item.color}`}>{item.icon}</span>
                      <span className="text-sm font-medium text-gray-700">{item.label}</span>
                    </span>
                    <ChevronRight className="h-4 w-4 text-gray-400" />
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ════════ WOMEN SAFETY DEDICATED BLOCK ════════ */}
      <section id="women-safety" className="py-12 bg-gradient-to-r from-[#4A0030] to-[#8B0045] text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-block bg-white/20 px-3 py-1 text-xs font-bold uppercase tracking-widest rounded mb-4 border border-white/30">
                ♀ Priority Service
              </div>
              <h2 className="text-3xl font-bold mb-4">{t('women.title') || "Women's Safety & Empowerment"}</h2>
              <p className="text-pink-100 mb-6 italic text-lg">{t('women.subtitle') || "Zero Tolerance Towards Crime"}</p>
              <p className="text-white/80 text-sm leading-relaxed mb-8">
                {t('women.desc') || "A dedicated suite of tools ensuring immediate response. Share live locations, trigger discreet sirens, or connect instantly with the 181 Women Helpline."}
              </p>
              <div className="flex gap-4">
                <a href="tel:181" className="bg-white text-[#8B0045] px-6 py-3 rounded text-sm font-bold flex items-center gap-2 hover:bg-gray-100 transition-colors shadow">
                  <Phone className="h-4 w-4" /> {t('women.helpline') || "Call 181 Helpline"}
                </a>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {[
                { icon: '📍', label: 'Live Location Tracking', desc: 'Share GPS with trusted contacts instantly' },
                { icon: '🔔', label: 'Loud Safety Siren', desc: 'Trigger high-decibel alarm to deter threats' },
                { icon: '📞', label: 'Direct Helpline (181)', desc: 'Connect to specialized task force' },
                { icon: '🚔', label: 'Find Police Station', desc: 'Navigate to nearest safe zone' },
              ].map((item, i) => (
                <div key={i} className="bg-white/10 border border-white/20 p-5 rounded-lg hover:bg-white/20 transition-colors">
                  <div className="text-3xl mb-3">{item.icon}</div>
                  <h3 className="font-bold text-sm mb-2">{item.label}</h3>
                  <p className="text-xs text-white/70 leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ════════ IMPORTANT HELPLINES FOOTER STRIP ════════ */}
      <section id="helplines" className="py-10 bg-[#0F1B45] text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h2 className="text-xl font-bold uppercase tracking-wider mb-2">National Emergency Numbers</h2>
            <p className="text-sm text-gray-400">Available 24x7. Free to call from any mobile or landline.</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4">
            {HELPLINES.map((h, i) => (
              <a key={i} href={`tel:${h.number}`} className="bg-white/5 border border-white/10 p-4 rounded text-center hover:bg-white/10 transition-colors group">
                <div className="text-2xl font-bold text-red-400 mb-1 group-hover:text-white transition-colors">{h.number}</div>
                <div className="text-xs font-medium text-gray-300">{h.label}</div>
              </a>
            ))}
          </div>
        </div>
      </section>

    </div>
  );
}
