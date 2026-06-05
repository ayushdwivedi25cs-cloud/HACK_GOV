'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { MapPin, User, AlertTriangle, Clock, ShieldAlert } from 'lucide-react';

export default function LiveTrackingPage() {
  const { id } = useParams();
  const [incident, setIncident] = useState<any>(null);
  const [error, setError] = useState('');

  const fetchTracking = async () => {
    try {
      const res = await fetch(`http://localhost:5000/api/sos/tracking/${id}`);
      if (!res.ok) throw new Error('Tracking session not found');
      const data = await res.json();
      setIncident(data);
    } catch (e: any) {
      setError(e.message);
    }
  };

  useEffect(() => {
    fetchTracking();
    const interval = setInterval(() => {
      fetchTracking();
    }, 15000); // refresh every 15 seconds
    return () => clearInterval(interval);
  }, [id]);

  if (error) return <div className="p-8 text-center text-red-600 font-bold text-xl">{error}</div>;
  if (!incident) return <div className="p-8 text-center animate-pulse">Loading live tracking data...</div>;

  const loc = incident.location;
  const timeStr = loc.lastUpdated ? new Date(loc.lastUpdated).toLocaleTimeString() : new Date(incident.timestamp).toLocaleTimeString();
  const dateStr = loc.lastUpdated ? new Date(loc.lastUpdated).toLocaleDateString() : new Date(incident.timestamp).toLocaleDateString();

  return (
    <div className="max-w-3xl mx-auto p-4 md:p-8">
      <div className="bg-red-600 text-white p-6 rounded-t-xl shadow-lg flex items-center gap-4">
        <ShieldAlert className="w-12 h-12 animate-pulse" />
        <div>
          <h1 className="text-2xl font-black uppercase tracking-wider">Live Emergency Tracking</h1>
          <p className="text-red-100 font-medium">Tracking ID: {id}</p>
        </div>
      </div>

      <div className="bg-white border border-gray-200 rounded-b-xl shadow-lg p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="flex items-start gap-3">
            <User className="w-6 h-6 text-gray-400 mt-1" />
            <div>
              <p className="text-sm text-gray-500 font-semibold uppercase">Subject In Distress</p>
              <p className="text-lg font-bold text-gray-800">{incident.user?.name || incident.guestName || 'Unknown Citizen'}</p>
              {incident.user?.mobile && <p className="text-gray-600">{incident.user.mobile}</p>}
            </div>
          </div>
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-6 h-6 text-red-500 mt-1" />
            <div>
              <p className="text-sm text-gray-500 font-semibold uppercase">Emergency Type</p>
              <p className="text-lg font-bold text-red-600">{incident.category}</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <Clock className="w-6 h-6 text-blue-500 mt-1" />
            <div>
              <p className="text-sm text-gray-500 font-semibold uppercase">Last Updated</p>
              <p className="text-lg font-bold text-gray-800">{timeStr}</p>
              <p className="text-gray-500 text-sm">{dateStr} (Refreshes every 15s)</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <MapPin className="w-6 h-6 text-green-500 mt-1" />
            <div>
              <p className="text-sm text-gray-500 font-semibold uppercase">Coordinates</p>
              <p className="text-lg font-bold text-gray-800">Lat: {loc.lat.toFixed(6)}</p>
              <p className="text-lg font-bold text-gray-800">Lng: {loc.lng.toFixed(6)}</p>
            </div>
          </div>
        </div>

        {incident.medicalInfo && (
          <div className="bg-red-50 border border-red-100 rounded-lg p-4 mb-8">
            <h3 className="font-bold text-red-800 mb-2 border-b border-red-200 pb-2">Medical Profile</h3>
            <p className="text-red-900"><span className="font-semibold">Blood Group:</span> {incident.medicalInfo.bloodGroup || 'Unknown'}</p>
            <p className="text-red-900"><span className="font-semibold">Allergies:</span> {incident.medicalInfo.allergies || 'None'}</p>
            <p className="text-red-900"><span className="font-semibold">Conditions:</span> {incident.medicalInfo.conditions || 'None'}</p>
          </div>
        )}

        <div className="w-full h-64 bg-gray-100 rounded-lg overflow-hidden relative border-2 border-gray-300">
          {/* Simulated Map Background */}
          <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'url("https://www.transparenttextures.com/patterns/cubes.png")' }}></div>
          
          {/* Animated Map Pin at Center */}
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 flex flex-col items-center">
            <div className="w-16 h-16 bg-blue-500/20 rounded-full animate-ping absolute"></div>
            <MapPin className="w-12 h-12 text-red-600 drop-shadow-md z-10" fill="currentColor" />
            <div className="bg-white px-3 py-1 rounded shadow text-xs font-bold mt-2 z-10 border border-red-200 text-red-600">
              LIVE LOCATION
            </div>
          </div>
          
          <div className="absolute bottom-2 right-2 bg-white/80 px-2 py-1 text-xs font-medium rounded text-gray-600">
            GPS Tracker Active
          </div>
        </div>

        <div className="mt-8 text-center">
          <p className="text-gray-500 text-sm mb-4">If you are a family member, please try to contact the person directly or call 112 for immediate dispatch.</p>
          <a href={`https://maps.google.com/?q=${loc.lat},${loc.lng}`} target="_blank" rel="noreferrer" className="inline-block bg-green-600 text-white px-6 py-3 rounded-lg font-bold hover:bg-green-700">
            Open in Google Maps
          </a>
        </div>
      </div>
    </div>
  );
}
