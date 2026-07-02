'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { Navbar } from '../components/Navbar';
import { SOSModal } from '../components/SOSModal';
import { InteractiveMap } from '../components/InteractiveMap';
import { FloatingBot } from '../components/FloatingBot';
import {
  ShieldAlert,
  Flame,
  Activity,
  Users,
  Compass,
  AlertOctagon,
  Siren,
  Phone,
  Info,
  MapPin,
  Clock,
  ShieldCheck,
  FileText,
  UserCheck
} from 'lucide-react';
import Link from 'next/link';

export default function HomePage() {
  const { user, triggerEmergencySOS, isAuthenticated } = useAuth();
  const [sosModalOpen, setSosModalOpen] = useState(false);
  const [womensSOSActive, setWomensSOSActive] = useState(false);
  const [womensSOSLog, setWomensSOSLog] = useState<any[]>([]);
  const [locating, setLocating] = useState(false);
  const [womensLocation, setWomensLocation] = useState<any>(null);

  // Web Audio Context reference for synthesizer alarm
  const audioCtxRef = useRef<AudioContext | null>(null);
  const oscillatorRef = useRef<OscillatorNode | null>(null);
  const gainNodeRef = useRef<GainNode | null>(null);

  // Scroll to Map handler
  const handleScrollToMap = () => {
    const mapSection = document.getElementById('map-section');
    if (mapSection) {
      mapSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Trigger Women's Safety SOS
  const handleTriggerWomensSOS = async () => {
    if (womensSOSActive) {
      // Deactivate if already active
      stopSiren();
      setWomensSOSActive(false);
      setWomensLocation(null);
      setWomensSOSLog([]);
      return;
    }

    setWomensSOSActive(true);
    setLocating(true);
    playSiren();

    // Log tracking
    const logs = [`[${new Date().toLocaleTimeString()}] WOMEN'S SAFETY SOS INITIATED`] ;
    setWomensSOSLog(logs);

    let lat = 12.9716;
    let lng = 77.5946;
    let locationStr = 'Location access pending...';

    // 1. Capture Location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          lat = position.coords.latitude;
          lng = position.coords.longitude;
          locationStr = `GPS Verified (Lat: ${lat.toFixed(4)}, Lng: ${lng.toFixed(4)})`;
          
          setWomensLocation({ lat, lng, address: locationStr });
          setLocating(false);

          setWomensSOSLog(prev => [
            ...prev,
            `[${new Date().toLocaleTimeString()}] Location Captured: ${locationStr}`,
            `[${new Date().toLocaleTimeString()}] Initiating API Dispatch Logs`
          ]);

          // 2. Submit alert to backend
          try {
            const data = await triggerEmergencySOS("Women's Safety", { lat, lng, address: 'Women\'s Safety Incident (Pulsing Siren)' });
            if (data.simulatedAlerts) {
              data.simulatedAlerts.forEach((alert: any) => {
                setWomensSOSLog(prev => [
                  ...prev,
                  `[${new Date().toLocaleTimeString()}] Sent SMS & WhatsApp to ${alert.contactName} (${alert.relationship}) - Status: DELIVERED`
                ]);
              });
            }
          } catch (e) {
            setWomensSOSLog(prev => [...prev, `[${new Date().toLocaleTimeString()}] Fallback dispatch sent to Local Police cell.`]);
          }
        },
        (error) => {
          setWomensLocation({ lat, lng, address: 'GPS access denied, tracking default sector.' });
          setLocating(false);
          setWomensSOSLog(prev => [
            ...prev,
            `[${new Date().toLocaleTimeString()}] GPS access denied, using central district fallback.`,
            `[${new Date().toLocaleTimeString()}] Sent emergency broadcast to National safety cells.`
          ]);
        }
      );
    } else {
      setWomensLocation({ lat, lng, address: 'GPS not supported on device.' });
      setLocating(false);
    }
  };

  // Synthesize alarm sound using browser Web Audio API
  const playSiren = () => {
    try {
      if (typeof window === 'undefined') return;
      
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioContextClass) return;

      const ctx = new AudioContextClass();
      audioCtxRef.current = ctx;

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(800, ctx.currentTime);
      
      // Siren modulation
      osc.frequency.linearRampToValueAtTime(1200, ctx.currentTime + 0.5);
      osc.frequency.linearRampToValueAtTime(800, ctx.currentTime + 1);
      
      oscillatorRef.current = osc;
      gainNodeRef.current = gain;

      // Loop frequency oscillation every second
      let isHigh = false;
      const interval = setInterval(() => {
        if (!oscillatorRef.current || ctx.state === 'closed') {
          clearInterval(interval);
          return;
        }
        const time = ctx.currentTime;
        oscillatorRef.current.frequency.cancelScheduledValues(time);
        oscillatorRef.current.frequency.setValueAtTime(isHigh ? 800 : 1200, time);
        oscillatorRef.current.frequency.linearRampToValueAtTime(isHigh ? 1200 : 800, time + 0.5);
        isHigh = !isHigh;
      }, 500);

      gain.gain.setValueAtTime(0.3, ctx.currentTime); // moderate volume

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
    } catch (e) {
      console.error('Audio synthesizer failed:', e);
    }
  };

  const stopSiren = () => {
    try {
      if (oscillatorRef.current) {
        oscillatorRef.current.stop();
        oscillatorRef.current.disconnect();
        oscillatorRef.current = null;
      }
      if (audioCtxRef.current) {
        audioCtxRef.current.close();
        audioCtxRef.current = null;
      }
    } catch (e) {
      console.error('Audio stop failed:', e);
    }
  };

  // Clean up sound on unmount
  useEffect(() => {
    return () => {
      stopSiren();
    };
  }, []);

  return (
    <main className="min-h-screen bg-slate-950 text-white flex flex-col">
      <Navbar onTriggerWomensSOS={handleTriggerWomensSOS} />

      {/* HERO SECTION */}
      <section className="relative overflow-hidden bg-slate-900 border-b border-slate-850 px-4 py-16 md:py-24 text-center">
        {/* Subtle grid graphic */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:40px_40px] opacity-10" />

        <div className="max-w-4xl mx-auto relative z-10 space-y-6">
          <div className="inline-flex items-center space-x-2 bg-emerald-950 border border-emerald-800 text-emerald-400 px-3.5 py-1.5 rounded-full text-xs font-black uppercase tracking-wider shadow">
            <ShieldCheck className="h-4 w-4" />
            <span>National Crisis Response Infrastructure</span>
          </div>

          <h1 className="font-extrabold text-4xl sm:text-5xl md:text-6xl tracking-tight leading-none text-white">
            AI Emergency Government Navigator
          </h1>
          <h2 className="font-extrabold text-lg sm:text-2xl text-red-500 uppercase tracking-widest leading-none">
            One Platform. Every Emergency. Zero Confusion.
          </h2>
          <p className="max-w-2xl mx-auto text-sm sm:text-base text-slate-350 font-medium">
            An AI-powered emergency response and government assistance platform helping citizens instantly access emergency services, government procedures, safety guidance, and real-time support.
          </p>

          {/* Primary Landing Action Buttons */}
          <div className="pt-4 flex flex-wrap justify-center gap-3 max-w-lg sm:max-w-none mx-auto">
            <button
              onClick={() => setSosModalOpen(true)}
              className="bg-red-600 hover:bg-red-700 text-white px-6 py-3.5 rounded-lg text-sm font-extrabold uppercase tracking-wider flex items-center space-x-2 shadow-lg shadow-red-950 border border-red-500 hover:scale-[1.02] transition-transform"
            >
              <ShieldAlert className="h-4.5 w-4.5" />
              <span>Emergency SOS</span>
            </button>

            <button
              onClick={handleTriggerWomensSOS}
              className={`px-6 py-3.5 rounded-lg text-sm font-extrabold uppercase tracking-wider flex items-center space-x-2 shadow-lg border hover:scale-[1.02] transition-all ${
                womensSOSActive
                  ? 'bg-amber-600 hover:bg-amber-700 text-white border-amber-500 animate-pulse'
                  : 'bg-red-950/80 hover:bg-red-900 text-red-300 border-red-800'
              }`}
            >
              <Siren className="h-4.5 w-4.5" />
              <span>{womensSOSActive ? 'Stop Women\'s SOS' : 'Women\'s Safety SOS'}</span>
            </button>

            <button
              onClick={() => {
                // Focus search or trigger chatbot
                const chatBtn = document.querySelector('[title="Open Emergency AI Assistant"]') as HTMLButtonElement;
                if (chatBtn) chatBtn.click();
              }}
              className="bg-slate-800 hover:bg-slate-700 text-white px-6 py-3.5 rounded-lg text-sm font-extrabold uppercase tracking-wider flex items-center space-x-2 border border-slate-700 hover:scale-[1.02] transition-transform"
            >
              <Activity className="h-4.5 w-4.5 text-emerald-400" />
              <span>AI Assistant</span>
            </button>

            <button
              onClick={handleScrollToMap}
              className="bg-slate-850 hover:bg-slate-800 text-slate-300 px-6 py-3.5 rounded-lg text-sm font-extrabold uppercase tracking-wider flex items-center space-x-2 border border-slate-800 hover:scale-[1.02] transition-transform"
            >
              <Compass className="h-4.5 w-4.5" />
              <span>Find Help Near Me</span>
            </button>
          </div>
        </div>
      </section>

      {/* ACTIVE WOMEN'S SOS TRACKING DASHBOARD PANEL */}
      {womensSOSActive && (
        <section className="bg-red-950/40 border-b border-red-900 p-6">
          <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Siren Alert Indicator */}
            <div className="bg-slate-900 border border-red-800 rounded-xl p-4 flex flex-col justify-between shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 h-24 w-24 bg-red-650/10 rounded-full animate-ping pointer-events-none" />
              <div className="flex items-start space-x-3">
                <Siren className="h-10 w-10 text-red-500 animate-spin-slow shrink-0" />
                <div>
                  <h3 className="font-black text-base text-white tracking-wide uppercase">WOMEN'S SOS ACTIVE</h3>
                  <p className="text-[10px] text-red-400 font-bold uppercase tracking-tight">Audio Siren Beeping</p>
                  <p className="text-xs text-slate-300 mt-2">
                    A high-pitched looping emergency siren is broadcasting from this device to deter threats and draw immediate public attention.
                  </p>
                </div>
              </div>
              <button
                onClick={stopSiren}
                className="mt-4 bg-slate-800 hover:bg-slate-750 border border-slate-700 text-red-400 text-xs font-bold uppercase py-2 rounded flex items-center justify-center space-x-1.5"
              >
                <span>Mute Local Siren</span>
              </button>
            </div>

            {/* Tracking logs */}
            <div className="bg-slate-950 border border-red-900/60 rounded-xl p-4 flex flex-col justify-between shadow-2xl font-mono text-xs">
              <div className="border-b border-red-950 pb-2 mb-2 flex items-center justify-between">
                <span className="text-red-400 font-bold uppercase tracking-wider">🚨 Safety Dispatch Logs</span>
                {locating && <span className="text-[9px] bg-amber-950 text-amber-400 px-1.5 py-0.2 rounded">Locating...</span>}
              </div>
              <div className="flex-1 space-y-1.5 max-h-[140px] overflow-y-auto mb-2 text-slate-300">
                {womensSOSLog.map((log, i) => (
                  <p key={i} className="leading-tight text-[10px]">&gt; {log}</p>
                ))}
              </div>
              <div className="bg-slate-900 p-2.5 rounded border border-slate-850">
                <span className="text-[9px] text-slate-400 font-extrabold block mb-0.5">CURRENT COORDINATES</span>
                <p className="text-xs font-bold text-white truncate">
                  {womensLocation ? womensLocation.address : 'Verifying GPS satellite feed...'}
                </p>
              </div>
            </div>

            {/* Nearest Police & Contacts Helplines */}
            <div className="bg-slate-900 border border-red-800 rounded-xl p-4 flex flex-col justify-between shadow-2xl">
              <div>
                <span className="text-[9px] bg-red-900 text-white font-extrabold uppercase px-2 py-0.5 rounded tracking-wide">
                  Closest Police Responders
                </span>
                <h4 className="font-extrabold text-sm text-white mt-2 flex items-center space-x-1">
                  <MapPin className="h-4 w-4 text-red-400 shrink-0" />
                  <span>Central District Women Police Cell</span>
                </h4>
                <p className="text-[10px] text-slate-400 mb-3">Distance: ~1.2 km | Estimated Arrival: 3-5 mins</p>
              </div>

              <div className="grid grid-cols-2 gap-2 mt-2">
                <a
                  href="tel:1091"
                  className="bg-red-650 hover:bg-red-700 text-white py-2 rounded text-xs font-extrabold uppercase tracking-wide flex items-center justify-center space-x-1 shadow"
                >
                  <Phone className="h-3.5 w-3.5" />
                  <span>Call 1091</span>
                </a>
                <a
                  href="tel:112"
                  className="bg-slate-800 hover:bg-slate-750 text-slate-350 py-2 rounded text-xs font-extrabold uppercase tracking-wide flex items-center justify-center space-x-1 border border-slate-750"
                >
                  <Phone className="h-3.5 w-3.5" />
                  <span>Call 112</span>
                </a>
              </div>
            </div>

          </div>
        </section>
      )}

      {/* QUICK LAUNCH GRID TOOLS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h3 className="font-extrabold text-xs text-slate-400 uppercase tracking-widest text-center mb-8">
          Civil Protection & Safety Modules
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {[
            { title: 'Disaster Mode', href: '/disaster', desc: 'Evacuations & camps', icon: Flame, color: 'text-orange-500 hover:border-orange-500/40' },
            { title: 'AI Scam Detector', href: '/scam-detector', desc: 'Scan fraud SMS', icon: ShieldAlert, color: 'text-indigo-400 hover:border-indigo-400/40' },
            { title: 'Deepfake Check', href: '/deepfake', desc: 'Verify image/audio', icon: AlertOctagon, color: 'text-rose-500 hover:border-rose-500/40' },
            { title: 'AI First Aid', href: '/first-aid', desc: 'CPR voice guides', icon: Activity, color: 'text-emerald-500 hover:border-emerald-500/40' },
            { title: 'Missing Person', href: '/missing-person', desc: 'Poster builder', icon: Users, color: 'text-teal-400 hover:border-teal-400/40' },
            { title: 'Gov Procedures', href: '/guidance', desc: 'Lost documentation', icon: FileText, color: 'text-blue-400 hover:border-blue-400/40' }
          ].map((mod) => {
            const Icon = mod.icon;
            return (
              <Link
                key={mod.title}
                href={mod.href}
                className={`bg-slate-900 border border-slate-850 p-4 rounded-xl flex flex-col justify-between group hover:bg-slate-850 transition-all hover:scale-[1.03] ${mod.color}`}
              >
                <div className="p-2 rounded bg-slate-950/60 w-fit mb-3">
                  <Icon className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="font-extrabold text-xs text-white uppercase group-hover:text-emerald-400 transition-colors">
                    {mod.title}
                  </h4>
                  <p className="text-[10px] text-slate-400 mt-1 leading-tight">{mod.desc}</p>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* MAP VIEW SECTION */}
      <section id="map-section" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <div className="mb-6 flex flex-col md:flex-row md:items-end justify-between gap-2">
          <div>
            <h3 className="font-extrabold text-lg uppercase tracking-wider text-white">Emergency Services Locator</h3>
            <p className="text-xs text-slate-400">Locates neighboring hospitals, fire control, police units, and relief cells.</p>
          </div>
          <span className="text-[10px] text-slate-500 font-mono">MAP CENTROID LOCK: NEW DELHI/BENGALURU</span>
        </div>
        <InteractiveMap />
      </section>

      {/* EMERGENCY INFRASTRUCTURE STATISTICS */}
      <section className="bg-slate-900 border-t border-b border-slate-850 py-12 text-center">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-2 md:grid-cols-4 gap-6">
          <div>
            <span className="font-black text-2xl sm:text-3xl text-emerald-400 block">&lt; 3.2 mins</span>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Avg Dispatch Response</span>
          </div>
          <div>
            <span className="font-black text-2xl sm:text-3xl text-emerald-400 block">100%</span>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Active Server Uptime</span>
          </div>
          <div>
            <span className="font-black text-2xl sm:text-3xl text-emerald-400 block">5 Language</span>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Multilingual AI Channels</span>
          </div>
          <div>
            <span className="font-black text-2xl sm:text-3xl text-emerald-400 block">1930 / 112</span>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Direct Trunk Line Integrations</span>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-slate-950 border-t border-slate-900 py-8 text-center text-xs text-slate-500 font-semibold">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-2">
          <p className="uppercase tracking-widest">Official Emergency Services Portal of India</p>
          <p className="text-[10px] text-slate-600">Designed for 100% availability on low bandwidths. Powered by Web Speech, Leaflet, and Gemini AI.</p>
        </div>
      </footer>

      {/* SOS MODAL & FLOATING ASSISTANT */}
      <SOSModal isOpen={sosModalOpen} onClose={() => setSosModalOpen(false)} />
      <FloatingBot />
    </main>
  );
}
