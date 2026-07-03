'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../context/AuthContext';
import {
  ShieldAlert,
  Loader2,
  ListFilter,
  Radio,
  Compass,
  AlertTriangle,
  CheckCircle,
  Activity
} from 'lucide-react';

interface IncidentReport {
  _id: string;
  category: string;
  location: { lat: number; lng: number; address?: string };
  timestamp: string;
  status: 'pending' | 'resolved' | 'dispatched';
  severity: 'low' | 'medium' | 'high' | 'critical';
  guestName?: string;
  user?: { name: string; mobile: string; email: string };
}

export default function AdminPage() {
  const router = useRouter();
  const { user, token, isAuthenticated } = useAuth();
  
  const [incidents, setIncidents] = useState<IncidentReport[]>([]);
  const [analytics, setAnalytics] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  // Broadcast field
  const [broadcastType, setBroadcastType] = useState('Flood Warning');
  const [broadcastMessage, setBroadcastMessage] = useState('');
  const [broadcastLoading, setBroadcastLoading] = useState(false);

  const fetchAdminData = async () => {
    if (!token) return;
    setLoading(true);
    try {
      const resList = await fetch('http://localhost:5000/api/incidents/all', {
        headers: { Authorization: `Bearer ${token}` }
      });
      const dataList = await resList.json();
      
      const resAnalytics = await fetch('http://localhost:5000/api/incidents/analytics', {
        headers: { Authorization: `Bearer ${token}` }
      });
      const dataAnalytics = await resAnalytics.json();

      if (resList.ok) setIncidents(dataList);
      if (resAnalytics.ok) setAnalytics(dataAnalytics);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
      return;
    }
    if (user && user.role !== 'admin') {
      router.push('/');
      return;
    }
    fetchAdminData();
  }, [isAuthenticated, token, router, user]);

  const handleUpdateStatus = async (id: string, newStatus: 'dispatched' | 'resolved') => {
    setUpdatingId(id);
    try {
      const response = await fetch(`http://localhost:5000/api/incidents/update/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ status: newStatus })
      });

      if (response.ok) {
        fetchAdminData();
      }
    } catch (e) {
      alert('Failed to update incident status.');
    } finally {
      setUpdatingId(null);
    }
  };

  const handleSendBroadcast = (e: React.FormEvent) => {
    e.preventDefault();
    if (!broadcastMessage.trim()) return;

    setBroadcastLoading(true);
    setTimeout(() => {
      alert(`OFFICIAL GOVERNMENT BROADCAST ISSUED\nTopic: ${broadcastType}\nStatus: Sent to all regional emergency contacts.`);
      setBroadcastMessage('');
      setBroadcastLoading(false);
    }, 1500);
  };

  const filteredIncidents = incidents.filter(
    (inc) => statusFilter === 'all' || inc.status === statusFilter
  );

  if (loading && !analytics) {
    return (
      <div className="gov-section-white min-h-screen flex flex-col justify-center items-center">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600 mb-4" />
        <span className="text-sm text-gray-600 font-semibold uppercase tracking-wider">Accessing Government Database...</span>
      </div>
    );
  }

  return (
    <div className="gov-section-gray min-h-screen">
      <div className="gov-container">
        
        {/* Title panel */}
        <div className="bg-white border border-gray-200 rounded p-6 mb-6 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4 border-t-4 border-t-[#1B2B6B]">
          <div>
            <h1 className="text-xl font-bold text-[#1B2B6B] flex items-center gap-2 uppercase tracking-wide">
              <ShieldAlert className="h-6 w-6 text-[#1B2B6B]" />
              National Emergency Command Center
            </h1>
            <p className="text-xs text-gray-500 mt-1">
              Official monitoring dashboard for incident tracking and resource allocation.
            </p>
          </div>
          <div className="bg-green-50 border border-green-200 text-green-800 px-3 py-1.5 rounded text-xs font-bold uppercase flex items-center gap-1.5">
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
            System Active • Secured
          </div>
        </div>

        {/* ANALYTICS STATS GRIDS */}
        {analytics && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-white border border-gray-200 p-5 rounded shadow-sm border-l-4 border-l-[#0057A8]">
              <span className="text-[10px] font-bold text-gray-500 uppercase block mb-1">Total Incidents</span>
              <span className="font-bold text-2xl text-[#1B2B6B] block">{analytics.totalIncidents}</span>
            </div>
            
            <div className="bg-white border border-gray-200 p-5 rounded shadow-sm border-l-4 border-l-[#CC0001]">
              <span className="text-[10px] font-bold text-gray-500 uppercase block mb-1">Pending Dispatch</span>
              <span className="font-bold text-2xl text-[#CC0001] block">{analytics.statusCounts.pending}</span>
            </div>

            <div className="bg-white border border-gray-200 p-5 rounded shadow-sm border-l-4 border-l-[#FF6200]">
              <span className="text-[10px] font-bold text-gray-500 uppercase block mb-1">Active Response Units</span>
              <span className="font-bold text-2xl text-[#FF6200] block">{analytics.statusCounts.dispatched}</span>
            </div>

            <div className="bg-white border border-gray-200 p-5 rounded shadow-sm border-l-4 border-l-[#138808]">
              <span className="text-[10px] font-bold text-gray-500 uppercase block mb-1">Resolved Cases</span>
              <span className="font-bold text-2xl text-[#138808] block">{analytics.statusCounts.resolved}</span>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Left panel: Incident alerts feed list */}
          <div className="lg:col-span-2 flex flex-col gap-4">
            
            {/* Table Control panel header */}
            <div className="bg-white border border-gray-200 rounded p-4 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <h3 className="font-bold text-sm text-[#1B2B6B] uppercase flex items-center gap-2">
                <ListFilter className="h-4.5 w-4.5 text-[#0057A8]" />
                Official Incident Log
              </h3>

              <div className="flex bg-gray-100 p-1 rounded border border-gray-200">
                {['all', 'pending', 'dispatched', 'resolved'].map((f) => (
                  <button
                    key={f}
                    onClick={() => setStatusFilter(f)}
                    className={`px-3 py-1.5 rounded text-[10px] font-bold uppercase transition-colors ${
                      statusFilter === f
                        ? 'bg-white text-[#0057A8] shadow-sm border border-gray-200'
                        : 'text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    {f}
                  </button>
                ))}
              </div>
            </div>

            {/* List reports body */}
            <div className="space-y-3">
              {filteredIncidents.map((inc) => (
                <div
                  key={inc._id}
                  className={`bg-white border rounded p-4 shadow-sm flex flex-col gap-3 ${
                    inc.status === 'pending'
                      ? 'border-l-4 border-l-[#CC0001]'
                      : inc.status === 'dispatched'
                      ? 'border-l-4 border-l-[#FF6200]'
                      : 'border-l-4 border-l-[#138808]'
                  }`}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className={`gov-badge ${
                          inc.status === 'pending' ? 'gov-badge-red' : inc.status === 'dispatched' ? 'gov-badge-orange' : 'gov-badge-green'
                        }`}>
                          {inc.status}
                        </span>
                        {inc.severity === 'critical' && (
                          <span className="gov-badge gov-badge-red animate-pulse">CRITICAL SEVERITY</span>
                        )}
                      </div>
                      <h4 className="font-bold text-sm text-gray-900 uppercase">{inc.category}</h4>
                      <p className="text-[10px] text-gray-500 mt-0.5 font-mono">
                        ID: {inc._id} • {new Date(inc.timestamp).toLocaleString()}
                      </p>
                    </div>
                  </div>

                  {/* Citizen contact summary info */}
                  <div className="bg-gray-50 p-3 rounded border border-gray-200 text-xs text-gray-700">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div>
                        <span className="text-gray-500 font-semibold block mb-0.5 text-[10px] uppercase">Reporter Details</span>
                        <div className="font-medium">{inc.user ? inc.user.name : (inc.guestName || 'Anonymous Citizen')}</div>
                        {inc.user && (
                          <div className="text-gray-600 mt-0.5">
                            {inc.user.mobile} • {inc.user.email}
                          </div>
                        )}
                      </div>
                      <div>
                        <span className="text-gray-500 font-semibold block mb-0.5 text-[10px] uppercase">Location Data</span>
                        <div className="font-medium">{inc.location.address || 'GPS Coordinates Provided'}</div>
                        <div className="text-gray-500 font-mono mt-0.5 text-[10px]">
                          LAT: {inc.location.lat.toFixed(6)}, LNG: {inc.location.lng.toFixed(6)}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Actions buttons */}
                  {inc.status !== 'resolved' && (
                    <div className="flex gap-2 pt-2 border-t border-gray-100">
                      {inc.status === 'pending' && (
                        <button
                          onClick={() => handleUpdateStatus(inc._id, 'dispatched')}
                          disabled={updatingId === inc._id}
                          className="flex-1 bg-[#FF6200] hover:bg-[#E65800] text-white py-2 rounded text-[11px] font-bold uppercase tracking-wide flex items-center justify-center gap-1.5 transition-colors"
                        >
                          {updatingId === inc._id ? <Loader2 className="h-3 w-3 animate-spin" /> : <>Dispatch Emergency Responders</>}
                        </button>
                      )}
                      
                      <button
                        onClick={() => handleUpdateStatus(inc._id, 'resolved')}
                        disabled={updatingId === inc._id}
                        className="flex-1 bg-[#138808] hover:bg-[#0F6B06] text-white py-2 rounded text-[11px] font-bold uppercase tracking-wide flex items-center justify-center gap-1.5 transition-colors"
                      >
                        {updatingId === inc._id ? <Loader2 className="h-3 w-3 animate-spin" /> : <>Mark as Resolved</>}
                      </button>
                    </div>
                  )}

                </div>
              ))}
              {filteredIncidents.length === 0 && (
                <div className="bg-white border border-gray-200 p-8 rounded text-center text-gray-500 text-sm shadow-sm">
                  No active incidents recorded under this category.
                </div>
              )}
            </div>

          </div>

          {/* Right panel: Tactical heatmap & Broadcast Emergency Warning */}
          <div className="flex flex-col gap-6">
            
            {/* TACTICAL MAP WIDGET / HEATMAP PLOT */}
            <div className="bg-white border border-gray-200 rounded shadow-sm p-5 border-t-4 border-t-[#0057A8]">
              <h3 className="text-xs font-bold text-[#1B2B6B] uppercase flex items-center gap-2 mb-4">
                <Compass className="h-4 w-4" />
                Live Tactical Map
              </h3>

              {/* Grid representation */}
              <div className="h-[220px] bg-blue-50 border border-blue-100 rounded relative overflow-hidden flex items-center justify-center">
                <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'radial-gradient(#0057A8 1px, transparent 1px)', backgroundSize: '15px 15px' }} />
                
                <svg className="w-full h-full absolute inset-0 z-10">
                  {analytics && analytics.heatmapPoints.map((pt: any, i: number) => {
                    const cx = 50 + (pt.lng - 77.5946) * 50;
                    const cy = 50 + (pt.lat - 12.9716) * 50;
                    const r = pt.severity === 'critical' ? '12' : '7';
                    const color = pt.severity === 'critical' ? '#CC0001' : '#FF6200';
                    return (
                      <g key={i}>
                        <circle cx={`${cx}%`} cy={`${cy}%`} r={r} fill={color} opacity="0.3" className="animate-pulse" />
                        <circle cx={`${cx}%`} cy={`${cy}%`} r="4" fill={color} stroke="white" strokeWidth="1" />
                      </g>
                    );
                  })}
                  
                  <circle cx="50%" cy="50%" r="5" fill="#1B2B6B" stroke="white" strokeWidth="2" />
                  <text x="50%" y="60%" fill="#1B2B6B" fontSize="8" fontWeight="bold" textAnchor="middle">COMMAND</text>
                </svg>
              </div>
            </div>

            {/* BROADCAST PANEL COMPONENT */}
            <div className="bg-white border border-gray-200 rounded shadow-sm p-5 border-t-4 border-t-[#CC0001]">
              <h3 className="text-xs font-bold text-[#CC0001] uppercase flex items-center gap-2 mb-4">
                <Radio className="h-4 w-4 animate-pulse" />
                Emergency Public Broadcast
              </h3>

              <form onSubmit={handleSendBroadcast} className="space-y-4">
                <div>
                  <label className="block text-[10px] font-bold uppercase text-gray-600 mb-1.5">Alert Category</label>
                  <select
                    value={broadcastType}
                    onChange={(e) => setBroadcastType(e.target.value)}
                    className="w-full border border-gray-300 rounded p-2 text-sm text-gray-800 focus:outline-none focus:border-[#0057A8]"
                  >
                    <option value="Flood Warning">Flood Evacuation Order</option>
                    <option value="Earthquake Tremors">Earthquake Advisory</option>
                    <option value="Cyclone Landfall">Cyclone Storm Action</option>
                    <option value="Cyber Attack Alert">Cyber Fraud Notice</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] font-bold uppercase text-gray-600 mb-1.5">Official Broadcast Message</label>
                  <textarea
                    required
                    value={broadcastMessage}
                    onChange={(e) => setBroadcastMessage(e.target.value)}
                    placeholder="Enter immediate advice for citizens..."
                    rows={4}
                    className="w-full border border-gray-300 rounded p-2 text-sm text-gray-800 focus:outline-none focus:border-[#0057A8] placeholder-gray-400"
                  />
                </div>

                <button
                  type="submit"
                  disabled={broadcastLoading}
                  className="w-full bg-[#CC0001] hover:bg-[#990000] text-white py-2.5 rounded text-[11px] font-bold uppercase tracking-wide flex items-center justify-center gap-1.5 transition-colors"
                >
                  {broadcastLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : (
                    <>
                      <Radio className="h-4 w-4" />
                      Issue Official Broadcast
                    </>
                  )}
                </button>
              </form>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
}
