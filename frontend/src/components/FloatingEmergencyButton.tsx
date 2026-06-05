'use client';

import React, { useState, useEffect } from 'react';
import { useLocation } from '../context/LocationContext';
import { AlertTriangle, X, Send, Loader2 } from 'lucide-react';

export function FloatingEmergencyButton() {
  const [isOpen, setIsOpen] = useState(false);
  const [countdown, setCountdown] = useState(10);
  const [isSending, setIsSending] = useState(false);
  const [sent, setSent] = useState(false);
  const { location } = useLocation();

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isOpen && !isSending && !sent && countdown > 0) {
      timer = setTimeout(() => setCountdown(c => c - 1), 1000);
    } else if (isOpen && countdown === 0 && !isSending && !sent) {
      triggerEmergency();
    }
    return () => clearTimeout(timer);
  }, [isOpen, countdown, isSending, sent]);

  const handleOpen = () => {
    setIsOpen(true);
    setCountdown(10);
    setSent(false);
    setIsSending(false);
  };

  const cancel = () => {
    setIsOpen(false);
  };

  const triggerEmergency = async () => {
    setIsSending(true);
    try {
      // Mocking the trigger API
      const res = await fetch('http://localhost:5000/api/sos/trigger', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          category: 'CRITICAL_EMERGENCY',
          location: location.lat ? location : { lat: 0, lng: 0, address: 'Unknown' },
          timestamp: new Date().toISOString()
        })
      });
      if (res.ok) {
        setSent(true);
      } else {
        alert('Failed to send alert. Please dial 112 manually.');
      }
    } catch (e) {
      alert('Network error. Please dial 112 manually.');
    } finally {
      setIsSending(false);
    }
  };

  return (
    <>
      <button
        onClick={handleOpen}
        className="fixed left-4 bottom-4 md:left-8 md:bottom-8 z-[900] bg-red-600 text-white w-16 h-16 rounded-full shadow-[0_0_20px_rgba(220,38,38,0.6)] flex flex-col items-center justify-center animate-pulse hover:bg-red-700 hover:scale-105 transition-all border-4 border-white"
        aria-label="Emergency Trigger"
      >
        <AlertTriangle className="w-8 h-8" />
      </button>

      {isOpen && (
        <div className="fixed inset-0 bg-black/80 z-[1000] flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl p-6 md:p-8 w-full max-w-sm text-center">
            {sent ? (
              <div className="flex flex-col items-center">
                <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-4">
                  <Send className="w-10 h-10" />
                </div>
                <h2 className="text-2xl font-bold text-gray-800 mb-2">Alert Sent</h2>
                <p className="text-gray-600 mb-6">Your emergency contacts and authorities have been notified with your live location.</p>
                <p className="text-sm text-blue-600 font-bold mb-6">Tracking Link sent via SMS & WhatsApp.</p>
                <button onClick={cancel} className="w-full py-3 bg-gray-200 text-gray-800 rounded-lg font-bold">Close</button>
              </div>
            ) : isSending ? (
              <div className="flex flex-col items-center py-8">
                <Loader2 className="w-16 h-16 text-red-600 animate-spin mb-4" />
                <h2 className="text-xl font-bold text-gray-800">Dispatching Alert...</h2>
              </div>
            ) : (
              <div className="flex flex-col items-center">
                <div className="w-24 h-24 bg-red-100 text-red-600 rounded-full flex items-center justify-center mb-4 border-4 border-red-200">
                  <span className="text-5xl font-black">{countdown}</span>
                </div>
                <h2 className="text-2xl font-bold text-red-600 mb-2">Emergency Alert</h2>
                <p className="text-gray-600 mb-6 font-medium">Alert will be sent automatically in {countdown} seconds.</p>
                
                <div className="flex flex-col gap-3 w-full">
                  <button onClick={triggerEmergency} className="w-full py-4 bg-red-600 text-white rounded-lg font-bold text-lg flex justify-center items-center gap-2 hover:bg-red-700 shadow-lg">
                    <Send className="w-5 h-5" /> Send Now
                  </button>
                  <button onClick={cancel} className="w-full py-4 bg-gray-200 text-gray-800 rounded-lg font-bold text-lg hover:bg-gray-300">
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
