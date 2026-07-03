'use client';

import React, { useState, useRef, useCallback } from 'react';
import { GovernmentHeader } from '../components/GovernmentHeader';
import { GovernmentFooter } from '../components/GovernmentFooter';
import { SOSModal } from '../components/SOSModal';
import { FloatingBot } from '../components/FloatingBot';

export function ClientLayout({ children }: { children: React.ReactNode }) {
  const [sosOpen, setSosOpen] = useState(false);
  const [womensSirenActive, setWomensSirenActive] = useState(false);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const sirenNodesRef = useRef<{ osc: OscillatorNode; gain: GainNode }[]>([]);

  const stopSiren = useCallback(() => {
    sirenNodesRef.current.forEach(({ osc, gain }) => {
      try { gain.gain.setTargetAtTime(0, audioCtxRef.current!.currentTime, 0.1); } catch {}
      try { osc.stop(audioCtxRef.current!.currentTime + 0.2); } catch {}
    });
    sirenNodesRef.current = [];
    setWomensSirenActive(false);
  }, []);

  const triggerWomensSOS = useCallback(() => {
    if (womensSirenActive) { stopSiren(); return; }

    try {
      const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
      audioCtxRef.current = ctx;

      const playTone = (freq1: number, freq2: number, startTime: number, duration: number) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain); gain.connect(ctx.destination);
        osc.frequency.setValueAtTime(freq1, startTime);
        osc.frequency.linearRampToValueAtTime(freq2, startTime + duration / 2);
        osc.frequency.linearRampToValueAtTime(freq1, startTime + duration);
        gain.gain.setValueAtTime(0.25, startTime);
        gain.gain.setTargetAtTime(0, startTime + duration - 0.05, 0.05);
        osc.start(startTime); osc.stop(startTime + duration);
        sirenNodesRef.current.push({ osc, gain });
      };

      const t = ctx.currentTime;
      for (let i = 0; i < 6; i++) { playTone(880, 1320, t + i * 0.8, 0.75); }
      setWomensSirenActive(true);
      setTimeout(stopSiren, 5000);

      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(pos => {
          fetch('http://localhost:5000/api/sos/trigger', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              category: "Women's Safety",
              location: { lat: pos.coords.latitude, lng: pos.coords.longitude, address: 'GPS Location' }
            })
          }).catch(() => {});
        }, () => {});
      }
    } catch (e) { console.warn('Audio not available', e); }
  }, [womensSirenActive, stopSiren]);

  return (
    <>
      {/* Floating Women SOS button (every page) */}
      <button
        onClick={triggerWomensSOS}
        className="floating-women-sos"
        aria-label="Women Safety SOS"
        title="Women Safety SOS — Tap to activate siren and alert contacts"
      >
        ♀ {womensSirenActive ? 'STOP SIREN' : "Women's SOS"}
      </button>

      <GovernmentHeader
        onTriggerSOS={() => setSosOpen(true)}
        onTriggerWomensSOS={triggerWomensSOS}
      />

      <main id="main-content" tabIndex={-1} style={{ outline: 'none' }}>
        {children}
      </main>

      <GovernmentFooter />
      <FloatingBot />
      <SOSModal isOpen={sosOpen} onClose={() => setSosOpen(false)} />
    </>
  );
}
