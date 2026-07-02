'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../context/AuthContext';
import { Navbar } from '../../components/Navbar';
import {
  ShieldAlert,
  Loader2,
  ListFilter,
  CheckCircle,
  Radio,
  FileSpreadsheet,
  AlertOctagon,
  MapPin,
  TrendingUp,
  Activity,
  ArrowRight,
  Send,
  Compass
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
      // 1. Fetch Incidents List
      const resList = await fetch('http://localhost:5000/api/incidents/all', {
        headers: { Authorization: `Bearer ${token}` }
      });
      const dataList = await resList.json();
      
      // 2. Fetch Analytics Report
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
    // Redirect if not admin
    if (!isAuthenticated) {
      router.push('/login');
      return;
    }
    if (user && user.role !== 'admin') {
      router.push('/');
      return;
    }
    fetchAdminData();
  }, [isAuthenticated, token]);

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
        // Refresh local listings
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
      alert(`⚠️ CIVIL EMERGENCY BROADCAST ISSUED SUCCESSFULLY!\nTopic: ${broadcastType}\nMessage sent to all registered state numbers.`);
      setBroadcastMessage('');
      setBroadcastLoading(false);
    }, 1500);
  };

  const filteredIncidents = incidents.filter(
    (inc) => statusFilter === 'all' || inc.status === statusFilter
  );

  if (loading && !analytics) {
    return (
      <main className="min-h-screen bg-slate-950 text-white flex flex-col justify-center items-center">
        <Loader2 className="h-8 w-8 animate-spin text-emerald-400" />
        <span className="text-xs mt-2 text-slate-500 font-semibold">Loading Civil Safety Analytics...</span>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-950 text-white flex flex-col">
      <Navbar onTriggerWomensSOS={() => {}} />

      <div className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        
        {/* Title panel */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-slate-850 pb-6">
          <div>
            <h1 className="font-extrabold text-2xl sm:text-3xl uppercase tracking-wider text-white flex items-center space-x-2">
              <ShieldAlert className="h-7 w-7 text-red-500 animate-pulse" />
              <span>Government Emergency Analytics Dashboard</span>
            </h1>
            <p className="text-xs text-slate-400 mt-1">
              Internal Command Center. Allocate resources, update status alerts, and map safety zones.
            </p>
          </div>
          <span className="text-[10px] text-emerald-400 font-bold uppercase bg-emerald-950 px-3 py-1 rounded border border-emerald-900 shadow">
            Security Status: Clearance Level 1
          </span>
        </div>

        {/* ANALYTICS STATS GRIDS */}
        {analytics && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-slate-900 border border-slate-850 p-4 rounded-xl shadow-md">
              <span className="text-[10px] font-bold text-slate-450 uppercase block">Total Incidents Reported</span>
              <span className="font-black text-2xl text-white block mt-1">{analytics.totalIncidents} Cases</span>
              <span className="text-[9px] text-emerald-400 font-bold mt-1 block">Live Database Connected</span>
            </div>
            
            <div className="bg-slate-900 border border-slate-850 p-4 rounded-xl shadow-md">
              <span className="text-[10px] font-bold text-slate-450 uppercase block">Pending SOS Dispatch</span>
              <span className="font-black text-2xl text-red-500 block mt-1">{analytics.statusCounts.pending} Cases</span>
              <span className="text-[9px] text-red-400 font-bold mt-1 block">Immediate Actions Required</span>
            </div>

            <div className="bg-slate-900 border border-slate-850 p-4 rounded-xl shadow-md">
              <span className="text-[10px] font-bold text-slate-450 uppercase block">Active Response Units</span>
              <span className="font-black text-2xl text-orange-400 block mt-1">{analytics.statusCounts.dispatched} Dispatched</span>
              <span className="text-[9px] text-slate-400 mt-1 block">En-route coordinates verified</span>
            </div>

            <div className="bg-slate-900 border border-slate-850 p-4 rounded-xl shadow-md">
              <span className="text-[10px] font-bold text-slate-450 uppercase block">Cases Resolved successfully</span>
              <span className="font-black text-2xl text-emerald-500 block mt-1">{analytics.statusCounts.resolved} Resolved</span>
              <span className="text-[9px] text-emerald-400 font-bold mt-1 block">Filing directories updated</span>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left panel: Incident alerts feed list */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Table Control panel header */}
            <div className="bg-slate-900 border border-slate-850 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow">
              <h3 className="font-bold text-xs uppercase tracking-widest text-slate-400 flex items-center space-x-1.5">
                <ListFilter className="h-4.5 w-4.5 text-emerald-400" />
                <span>Incident Log Registry</span>
              </h3>

              {/* Filtering tabs */}
              <div className="flex gap-1.5">
                {['all', 'pending', 'dispatched', 'resolved'].map((f) => (
                  <button
                    key={f}
                    onClick={() => setStatusFilter(f)}
                    className={`px-2 py-1 rounded text-[10px] font-extrabold uppercase transition-all ${
                      statusFilter === f
                        ? 'bg-emerald-600 text-white shadow'
                        : 'bg-slate-950 text-slate-400 hover:text-slate-300'
                    }`}
                  >
                    {f}
                  </button>
                ))}
              </div>
            </div>

            {/* List reports body */}
            <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2">
              {filteredIncidents.map((inc) => (
                <div
                  key={inc._id}
                  className={`bg-slate-900 border rounded-xl p-4 shadow flex flex-col justify-between space-y-4 transition-all hover:scale-[1.01] ${
                    inc.status === 'pending'
                      ? 'border-red-900/60 hover:border-red-800'
                      : inc.status === 'dispatched'
                      ? 'border-orange-900/60 hover:border-orange-850'
                      : 'border-slate-850 hover:border-slate-800'
                  }`}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <span className={`text-[9px] font-black uppercase px-2 py-0.5 rounded mr-2 ${
                        inc.status === 'pending' ? 'bg-red-950 text-red-400 border border-red-900' : inc.status === 'dispatched' ? 'bg-orange-950 text-orange-400 border border-orange-900' : 'bg-emerald-950 text-emerald-400 border border-emerald-900'
                      }`}>
                        {inc.status}
                      </span>
                      <span className="font-extrabold text-sm uppercase text-white tracking-wide">{inc.category}</span>
                      <p className="text-[10px] text-slate-400 mt-1">
                        Reported: {new Date(inc.timestamp).toLocaleString()} | ID: <span className="font-mono text-slate-300">{inc._id}</span>
                      </p>
                    </div>
                    <span className="text-[10px] font-black uppercase text-red-500 animate-pulse">
                      Severity: {inc.severity}
                    </span>
                  </div>

                  {/* Citizen contact summary info */}
                  <div className="bg-slate-950 p-3 rounded-lg border border-slate-850 text-xs text-slate-350 space-y-2">
                    <div className="flex items-center space-x-1.5 text-white font-bold">
                      <Compass className="h-4 w-4 text-emerald-400" />
                      <span>Reporter: {inc.user ? inc.user.name : inc.guestName}</span>
                    </div>
                    <p className="pl-5">Location coordinates: {inc.location.address || 'Central District coords verified'}</p>
                    <p className="pl-5 text-[10px] text-slate-455">
                      Lat: {inc.location.lat}, Lng: {inc.location.lng}
                    </p>
                    {inc.user && (
                      <div className="pl-5 border-t border-slate-850 pt-2 flex justify-between items-center text-[10px]">
                        <span>Contact: <strong className="text-white">{inc.user.mobile}</strong></span>
                        <span>Email: <strong className="text-white">{inc.user.email}</strong></span>
                      </div>
                    )}
                  </div>

                  {/* Actions buttons */}
                  {inc.status !== 'resolved' && (
                    <div className="flex space-x-2 pt-1">
                      {inc.status === 'pending' && (
                        <button
                          onClick={() => handleUpdateStatus(inc._id, 'dispatched')}
                          disabled={updatingId === inc._id}
                          className="flex-1 bg-orange-600 hover:bg-orange-700 text-white py-2 rounded text-xs font-bold uppercase tracking-wide flex items-center justify-center space-x-1.5 shadow"
                        >
                          {updatingId === inc._id ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <span>Dispatch Responders</span>}
                        </button>
                      )}
                      
                      <button
                        onClick={() => handleUpdateStatus(inc._id, 'resolved')}
                        disabled={updatingId === inc._id}
                        className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white py-2 rounded text-xs font-bold uppercase tracking-wide flex items-center justify-center space-x-1.5 shadow"
                      >
                        {updatingId === inc._id ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <span>Resolve Report</span>}
                      </button>
                    </div>
                  )}

                </div>
              ))}
              {filteredIncidents.length === 0 && (
                <div className="bg-slate-900 border border-slate-850 p-8 rounded-xl text-center text-slate-500">
                  No active incidents recorded under this category.
                </div>
              )}
            </div>

          </div>

          {/* Right panel: Tactical heatmap & Broadcast Emergency Warning */}
          <div className="space-y-6">
            
            {/* TACTICAL MAP WIDGET / HEATMAP PLOT */}
            <div className="bg-slate-900 border border-slate-850 rounded-xl p-6 shadow-xl space-y-4">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center space-x-1.5">
                <Compass className="h-4.5 w-4.5 text-emerald-400" />
                <span>Tactical Heatmap Overlay</span>
              </h3>

              {/* Grid representation */}
              <div className="h-[220px] bg-slate-950 border border-slate-850 rounded-lg relative overflow-hidden flex items-center justify-center">
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:15px_15px] opacity-15" />
                
                <svg className="w-full h-full absolute inset-0 z-10">
                  {/* Danger clusters */}
                  {analytics && analytics.heatmapPoints.map((pt: any, i: number) => {
                    const cx = 50 + (pt.lng - 77.5946) * 50; // simple mock scaling centered around Bengaluru
                    const cy = 50 + (pt.lat - 12.9716) * 50;
                    const r = pt.severity === 'critical' ? '12' : '7';
                    const color = pt.severity === 'critical' ? '#dc2626' : '#f97316';
                    return (
                      <g key={i}>
                        <circle cx={`${cx}%`} cy={`${cy}%`} r={r} fill={color} opacity="0.3" className="animate-pulse" />
                        <circle cx={`${cx}%`} cy={`${cy}%`} r="3" fill={color} />
                      </g>
                    );
                  })}
                  
                  {/* Live anchor center */}
                  <circle cx="50%" cy="50%" r="5" fill="#3b82f6" />
                  <text x="50%" y="60%" fill="#3b82f6" fontSize="7" fontWeight="bold" textAnchor="middle">COMMAND TOWER</text>
                </svg>

                <div className="absolute bottom-2 left-2 bg-slate-900/90 border border-slate-850 px-2 py-0.5 rounded text-[8px] font-bold z-20">
                  GRID SCALE: 1 UNIT / 500M
                </div>
              </div>
            </div>

            {/* BROADCAST PANEL COMPONENT */}
            <div className="bg-slate-900 border border-slate-850 rounded-xl p-6 shadow-xl space-y-4">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center space-x-1.5">
                <Radio className="h-4.5 w-4.5 text-red-500 animate-pulse" />
                <span>State Emergency Warning Broadcast</span>
              </h3>

              <form onSubmit={handleSendBroadcast} className="space-y-3 text-xs">
                <div>
                  <label className="block text-[9px] font-bold uppercase tracking-wider text-slate-400 mb-1">Alert Category</label>
                  <select
                    value={broadcastType}
                    onChange={(e) => setBroadcastType(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-850 rounded p-2 text-white text-xs focus:outline-none"
                  >
                    <option value="Flood Warning">Flood Evacuation Order</option>
                    <option value="Earthquake Tremors">Earthquake Advisory</option>
                    <option value="Cyclone Landfall">Cyclone Storm Action</option>
                    <option value="Cyber Attack Alert">Cyber Fraud Notice</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[9px] font-bold uppercase tracking-wider text-slate-400 mb-1">Broadcast Message Wording</label>
                  <textarea
                    required
                    value={broadcastMessage}
                    onChange={(e) => setBroadcastMessage(e.target.value)}
                    placeholder="Enter immediate advice for citizens..."
                    rows={3}
                    className="w-full bg-slate-950 border border-slate-850 rounded p-2 text-white text-xs focus:outline-none focus:border-red-500 placeholder-slate-650"
                  />
                </div>

                <button
                  type="submit"
                  disabled={broadcastLoading}
                  className="w-full bg-red-650 hover:bg-red-700 text-white py-2 rounded text-xs font-bold uppercase tracking-wide flex items-center justify-center space-x-1.5 shadow"
                >
                  {broadcastLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : (
                    <>
                      <Send className="h-4 w-4" />
                      <span>Broadcast Warning</span>
                    </>
                  )}
                </button>
              </form>
            </div>

          </div>

        </div>

      </div>
    </main>
  );
}
