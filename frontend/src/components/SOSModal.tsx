'use client';

import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import {
  X,
  Activity,
  Car,
  Flame,
  MonitorSmartphone,
  UserCheck,
  HeartCrack,
  Baby,
  Search,
  AlertTriangle,
  EyeOff,
  Radio,
  Navigation,
  CheckCircle,
  MessageSquare,
  Loader2,
  Share2
} from 'lucide-react';

interface SOSModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SOSModal: React.FC<SOSModalProps> = ({ isOpen, onClose }) => {
  const { user, triggerEmergencySOS } = useAuth();
  const [step, setStep] = useState<number>(1);
  const [category, setCategory] = useState<string>('');
  const [isLocating, setIsLocating] = useState<boolean>(false);
  const [gpsLocation, setGpsLocation] = useState<{ lat: number; lng: number; address: string } | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [alertLogs, setAlertLogs] = useState<any[]>([]);
  const [incidentId, setIncidentId] = useState<string>('');

  if (!isOpen) return null;

  const categories = [
    { name: 'Medical Emergency', icon: Activity, color: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
    { name: 'Accident', icon: Car, color: 'bg-blue-50 text-blue-700 border-blue-200' },
    { name: 'Fire', icon: Flame, color: 'bg-orange-50 text-orange-700 border-orange-200' },
    { name: 'Cyber Crime', icon: MonitorSmartphone, color: 'bg-indigo-50 text-indigo-700 border-indigo-200' },
    { name: "Women's Safety", icon: UserCheck, color: 'bg-pink-50 text-pink-700 border-pink-200' },
    { name: 'Domestic Violence', icon: HeartCrack, color: 'bg-purple-50 text-purple-700 border-purple-200' },
    { name: 'Child Emergency', icon: Baby, color: 'bg-yellow-50 text-yellow-700 border-yellow-200' },
    { name: 'Missing Person', icon: Search, color: 'bg-teal-50 text-teal-700 border-teal-200' },
    { name: 'Natural Disaster', icon: AlertTriangle, color: 'bg-amber-50 text-amber-700 border-amber-200' },
    { name: 'Deepfake / Harassment', icon: EyeOff, color: 'bg-rose-50 text-rose-700 border-rose-200' },
    { name: 'Other Emergency', icon: Radio, color: 'bg-slate-50 text-slate-700 border-slate-200' }
  ];

  const handleSelectCategory = (catName: string) => {
    setCategory(catName);
    setStep(2);
    captureLocation();
  };

  const captureLocation = () => {
    setIsLocating(true);
    if (!navigator.geolocation) {
      setGpsLocation({ lat: 28.6139, lng: 77.2090, address: 'New Delhi, India (Geolocation not supported, default used)' });
      setIsLocating(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        // Call reverse geocoding mock or real if needed
        setGpsLocation({
          lat: parseFloat(latitude.toFixed(6)),
          lng: parseFloat(longitude.toFixed(6)),
          address: `Lat: ${latitude.toFixed(4)}, Lng: ${longitude.toFixed(4)} (GPS Verified)`
        });
        setIsLocating(false);
      },
      (error) => {
        console.error('Geolocation error:', error);
        // Fallback default coordinates
        setGpsLocation({
          lat: 12.9716,
          lng: 77.5946,
          address: 'Bengaluru, KA, India (Location access denied, defaults used)'
        });
        setIsLocating(false);
      },
      { enableHighAccuracy: true, timeout: 8000 }
    );
  };

  const handleTriggerSOS = async () => {
    if (!gpsLocation) return;
    setIsSubmitting(true);
    try {
      const data = await triggerEmergencySOS(category, gpsLocation);
      setIncidentId(data.incident._id);
      setAlertLogs(data.simulatedAlerts || []);
      setStep(3);
    } catch (error) {
      alert('Failed to trigger emergency SOS. Please dial 112 directly.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    setStep(1);
    setCategory('');
    setGpsLocation(null);
    setAlertLogs([]);
    setIncidentId('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-sm">
      <div className="bg-white rounded-xl shadow-2xl max-w-lg w-full overflow-hidden border border-slate-200">
        
        {/* Header bar */}
        <div className="bg-slate-900 text-white px-6 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Radio className="h-5 w-5 text-red-500 animate-pulse" />
            <h2 className="font-extrabold text-base tracking-wide uppercase">Emergency SOS Dispatcher</h2>
          </div>
          {step !== 3 && (
            <button onClick={onClose} className="text-slate-400 hover:text-white transition-colors">
              <X className="h-5 w-5" />
            </button>
          )}
        </div>

        {/* Modal content body */}
        <div className="p-6">
          
          {/* STEP 1: SELECT CATEGORY */}
          {step === 1 && (
            <div>
              <p className="text-slate-500 text-sm font-medium mb-4 text-center">
                Select your category. This routes your incident to the correct response unit.
              </p>
              <div className="grid grid-cols-2 gap-3 max-h-[350px] overflow-y-auto pr-1">
                {categories.map((cat) => {
                  const Icon = cat.icon;
                  return (
                    <button
                      key={cat.name}
                      onClick={() => handleSelectCategory(cat.name)}
                      className={`flex flex-col items-center justify-center p-3 rounded-lg border text-center transition-all hover:shadow-md hover:scale-[1.02] ${cat.color}`}
                    >
                      <Icon className="h-7 w-7 mb-2" />
                      <span className="text-xs font-bold leading-tight">{cat.name}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* STEP 2: CAPTURE GPS AND SUBMIT */}
          {step === 2 && (
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center text-red-600 mb-4 animate-bounce">
                <Navigation className="h-8 w-8" />
              </div>
              <h3 className="font-bold text-lg text-slate-800 mb-1">Verifying Location</h3>
              <p className="text-sm text-slate-500 mb-4">
                Routing <strong className="text-red-600">{category}</strong> dispatch.
              </p>

              {/* Geo location box */}
              <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 w-full mb-6 text-left">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-400">GPS Status</span>
                  {isLocating ? (
                    <span className="text-xs text-amber-600 font-semibold flex items-center space-x-1">
                      <Loader2 className="h-3 w-3 animate-spin" />
                      <span>Locating...</span>
                    </span>
                  ) : (
                    <span className="text-xs text-emerald-600 font-semibold">📍 Signal Secured</span>
                  )}
                </div>
                <p className="text-sm font-bold text-slate-700 break-words">
                  {gpsLocation ? gpsLocation.address : 'Locating device...'}
                </p>
                {gpsLocation && (
                  <span className="text-[10px] text-slate-400 mt-1 block">
                    Lat: {gpsLocation.lat}, Lng: {gpsLocation.lng}
                  </span>
                )}
              </div>

              <div className="flex w-full space-x-3">
                <button
                  onClick={() => setStep(1)}
                  disabled={isSubmitting}
                  className="flex-1 border border-slate-350 text-slate-700 py-3 rounded-lg text-sm font-bold hover:bg-slate-50 disabled:opacity-50 transition-colors"
                >
                  Back
                </button>
                <button
                  onClick={handleTriggerSOS}
                  disabled={isLocating || !gpsLocation || isSubmitting}
                  className="flex-1 bg-red-600 hover:bg-red-700 text-white py-3 rounded-lg text-sm font-bold shadow-lg shadow-red-100 flex items-center justify-center space-x-2 disabled:opacity-50 transition-all"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <span>Dispatching SOS...</span>
                    </>
                  ) : (
                    <span>CONFIRM TRIGGER SOS</span>
                  )}
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: DISPATCH SENT LOGGER */}
          {step === 3 && (
            <div className="flex flex-col">
              <div className="flex flex-col items-center text-center mb-6">
                <div className="w-12 h-12 bg-emerald-50 rounded-full flex items-center justify-center text-emerald-600 mb-3">
                  <CheckCircle className="h-6 w-6" />
                </div>
                <h3 className="font-extrabold text-lg text-slate-900 uppercase tracking-wide">SOS ACTIVATED</h3>
                <span className="text-xs text-slate-400 font-semibold uppercase mt-0.5">ID: {incidentId}</span>
              </div>

              <div className="bg-slate-900 text-slate-300 rounded-lg p-4 font-mono text-xs space-y-3 max-h-[220px] overflow-y-auto w-full mb-6">
                <div className="text-emerald-400 font-bold border-b border-slate-800 pb-1.5 flex items-center justify-between">
                  <span>&gt; ALERT DISPATCH LOGS</span>
                  <span className="text-[10px] bg-emerald-950 text-emerald-400 px-2 py-0.5 rounded border border-emerald-800">
                    ONLINE
                  </span>
                </div>
                <p className="text-slate-400">&gt; Timestamp: {new Date().toLocaleTimeString()}</p>
                <p className="text-slate-400">&gt; Geolocation coordinates logged successfully.</p>
                
                {alertLogs.map((log, index) => (
                  <div key={index} className="pt-2 border-t border-slate-850 space-y-1">
                    <p className="text-emerald-400 font-bold">&gt; Contact: {log.contactName} ({log.relationship})</p>
                    <p className="text-slate-400">├ SMS Outbound: <span className="text-emerald-500 font-bold">{log.channelSMS.status}</span> ({log.channelSMS.to})</p>
                    <p className="text-slate-400">├ WhatsApp Outbound: <span className="text-emerald-500 font-bold">{log.channelWhatsApp.status}</span></p>
                    <p className="text-slate-400">└ Email Outbound: <span className="text-emerald-500 font-bold">{log.channelEmail.status}</span> ({log.channelEmail.to})</p>
                  </div>
                ))}
              </div>

              <button
                onClick={handleReset}
                className="w-full bg-slate-900 hover:bg-slate-850 text-white py-3 rounded-lg text-sm font-bold transition-all text-center"
              >
                DISMISS & BACK TO NAVIGATION
              </button>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};
