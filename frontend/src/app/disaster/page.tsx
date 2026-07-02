'use client';

import React, { useState } from 'react';
import { Navbar } from '../../components/Navbar';
import { FloatingBot } from '../../components/FloatingBot';
import {
  Flame,
  AlertTriangle,
  Home,
  MapPin,
  CheckCircle,
  XCircle,
  ShieldAlert,
  Compass,
  ArrowRight,
  TrendingUp,
  Info
} from 'lucide-react';

interface ShelterCamp {
  name: string;
  location: string;
  occupancy: number;
  capacity: number;
  contact: string;
  status: 'available' | 'full';
}

interface DisasterAdvice {
  dos: string[];
  donts: string[];
  safeRoutesDescription: string;
}

export default function DisasterPage() {
  const [activeDisaster, setActiveDisaster] = useState<string>('flood');

  const disasters: Record<string, { title: string; advice: DisasterAdvice; shelters: ShelterCamp[] }> = {
    flood: {
      title: 'Flood Alert - Low Lying Areas',
      advice: {
        dos: [
          'Move to the highest floor or elevated terrain immediately.',
          'Shut off main electricity grids and gas lines to avoid electrocution/fires.',
          'Drink only boiled or bottled water to prevent waterborne diseases.',
          'Keep your phone charged and listen to local radio/alerts.'
        ],
        donts: [
          'Do not walk, swim, or drive through moving water. Even 6 inches can sweep you off.',
          'Avoid touching electrical equipment if you are wet or standing in water.',
          'Do not consume food that has come in contact with floodwater.'
        ],
        safeRoutesDescription: 'Sector 5 Evacuation Corridor is OPEN. Head East towards the Central Stadium Relief Camp. Avoid Underpass Road and Riverside Expressway due to severe logging.'
      },
      shelters: [
        { name: 'Central Sports Stadium Shelter', location: 'Sector 4, East Dist', occupancy: 245, capacity: 500, contact: '1078 / 011-294719', status: 'available' },
        { name: 'Government Girls High School Camp', location: 'Ansari Lane', occupancy: 120, capacity: 150, contact: '011-2394719', status: 'available' },
        { name: 'Municipal Community Center Hall', location: 'South Gate road', occupancy: 200, capacity: 200, contact: '011-2947291', status: 'full' }
      ]
    },
    earthquake: {
      title: 'Earthquake Action Response',
      advice: {
        dos: [
          'DROP, COVER, and HOLD ON under sturdy furniture like tables or desks.',
          'If outdoors, move to open spaces away from buildings, power lines, and trees.',
          'Be prepared for aftershocks. Keep a helmet or backpack on your head.'
        ],
        donts: [
          'Do not use elevators/lifts under any circumstances.',
          'Do not stand near glass windows, heavy mirrors, or cabinets.',
          'Do not use matches or lighters in case of gas leaks.'
        ],
        safeRoutesDescription: 'Assemble in Sector 2 Open Grounds and Central Park. Rescuers are stationed at the North Gate exit route.'
      },
      shelters: [
        { name: 'District Parade Ground Shelter', location: 'Cantonment Area', occupancy: 410, capacity: 1000, contact: '1078', status: 'available' },
        { name: 'Sector 2 Community Assembly Park', location: 'Park Lane', occupancy: 350, capacity: 400, contact: '011-9472019', status: 'available' }
      ]
    },
    cyclone: {
      title: 'Cyclone & High Wind Warning',
      advice: {
        dos: [
          'Stay indoors, preferably in the center of the house or windowless rooms.',
          'Secure loose objects outside that could fly and cause injuries.',
          'Unplug electrical appliances to protect them from high surge hazards.'
        ],
        donts: [
          'Do not go outside even if the wind dies down. The calm "eye" of the storm will pass and severe winds will resume.',
          'Do not stand near sliding doors or windows.',
          'Avoid seeking shelter near coastal retaining walls.'
        ],
        safeRoutesDescription: 'Coastal Highway is CLOSED. Use Inland Bypass West corridor to evacuate to designated relief camps.'
      },
      shelters: [
        { name: 'Multipurpose Cyclone Shelter Camp #1', location: 'High Grounds, West Sector', occupancy: 650, capacity: 800, contact: '1078', status: 'available' },
        { name: 'Municipal Transit Camp', location: 'Interstate Bus Terminus', occupancy: 290, capacity: 300, contact: '011-283019', status: 'available' }
      ]
    },
    fire: {
      title: 'Wildfire / Building Fire Safety',
      advice: {
        dos: [
          'Evacuate immediately. Shout to alert others. Touch doors with the back of your hand to check for heat before opening.',
          'Crawl low under smoke. The cleanest air is near the floor.',
          'Cover your nose and mouth with a wet cloth to filter smoke particles.'
        ],
        donts: [
          'Do not open hot doors. It means the fire is blocking the other side.',
          'Do not return to retrieve belongings. Lives take absolute priority.',
          'Do not throw water on electrical or oil fires.'
        ],
        safeRoutesDescription: 'Fire escapes 2 & 4 are clear. Gather at North Muster Point. Emergency units are entering via South Access Lane.'
      },
      shelters: [
        { name: 'Central Red Cross Center', location: 'Station Road', occupancy: 85, capacity: 150, contact: '101', status: 'available' }
      ]
    },
    landslide: {
      title: 'Landslide / Mudflow Advisory',
      advice: {
        dos: [
          'Move away from the path of the slide. Head to stable rocky ground.',
          'Listen for unusual sounds like trees cracking or boulders knocking, indicating soil movement.',
          'Curl into a tight ball and protect your head if escape is impossible.'
        ],
        donts: [
          'Do not cross bridges if you hear mudflows approaching underneath.',
          'Avoid steep hillsides or valleys during heavy rainfall.',
          'Do not try to clear debris without technical rescue teams.'
        ],
        safeRoutesDescription: 'Hill Highway NH-58 is BLOCKED. All traffic diverted to Valley Exit Route B towards the foothills.'
      },
      shelters: [
        { name: 'Foothills Transit Camp', location: 'Base Terminal', occupancy: 190, capacity: 300, contact: '1078', status: 'available' }
      ]
    }
  };

  const activeData = disasters[activeDisaster];

  return (
    <main className="min-h-screen bg-slate-950 text-white flex flex-col">
      <Navbar onTriggerWomensSOS={() => {}} />

      <div className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        
        {/* Urgent header warning banner */}
        <div className="bg-red-950/60 border border-red-800 rounded-xl p-4 flex items-start space-x-3 shadow-lg animate-pulse">
          <ShieldAlert className="h-6 w-6 text-red-400 shrink-0 mt-0.5" />
          <div>
            <h1 className="font-extrabold text-sm uppercase tracking-wide text-white">Active Disaster Response Mode</h1>
            <p className="text-xs text-slate-350 leading-relaxed mt-1">
              National Emergency Monitoring Center is active. High-risk zones are being monitored. Use tabs below for real-time safety routes and active relief camp allocations.
            </p>
          </div>
        </div>

        {/* Disaster selection tabs */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-2 border-b border-slate-850 pb-4">
          {Object.keys(disasters).map((key) => (
            <button
              key={key}
              onClick={() => setActiveDisaster(key)}
              className={`py-2.5 rounded-lg text-xs font-extrabold uppercase transition-all flex items-center justify-center space-x-1.5 border ${
                activeDisaster === key
                  ? 'bg-orange-600 border-orange-500 text-white shadow shadow-orange-950'
                  : 'bg-slate-900 border-slate-850 text-slate-400 hover:text-slate-300'
              }`}
            >
              <AlertTriangle className="h-4 w-4" />
              <span>{key} Mode</span>
            </button>
          ))}
        </div>

        {/* Main Dashboard Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left / Middle: Advisories & Safe Routes */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Advice panel */}
            <div className="bg-slate-900 border border-slate-850 rounded-xl p-6 shadow-xl space-y-6">
              <h2 className="font-black text-lg text-white uppercase tracking-wider border-b border-slate-850 pb-2.5 flex items-center space-x-2">
                <ShieldAlert className="h-5.5 w-5.5 text-orange-500 animate-pulse" />
                <span>{activeData.title}</span>
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Dos */}
                <div className="space-y-3">
                  <h3 className="text-xs font-bold text-emerald-400 uppercase tracking-widest flex items-center space-x-1.5">
                    <CheckCircle className="h-4 w-4" />
                    <span>DOs (Actions to Take)</span>
                  </h3>
                  <ul className="space-y-2">
                    {activeData.advice.dos.map((item, i) => (
                      <li key={i} className="text-xs text-slate-300 bg-slate-950 p-2.5 border border-slate-850 rounded-lg flex items-start space-x-2 font-medium">
                        <span className="text-emerald-400 shrink-0 font-bold">•</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Don'ts */}
                <div className="space-y-3">
                  <h3 className="text-xs font-bold text-red-400 uppercase tracking-widest flex items-center space-x-1.5">
                    <XCircle className="h-4 w-4" />
                    <span>DON'Ts (Avoid completely)</span>
                  </h3>
                  <ul className="space-y-2">
                    {activeData.advice.donts.map((item, i) => (
                      <li key={i} className="text-xs text-slate-300 bg-slate-950 p-2.5 border border-slate-850 rounded-lg flex items-start space-x-2 font-medium">
                        <span className="text-red-400 shrink-0 font-bold">•</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            {/* Tactical Safe Route overlay */}
            <div className="bg-slate-900 border border-slate-850 rounded-xl p-6 shadow-xl space-y-4">
              <h3 className="text-xs font-bold text-emerald-400 uppercase tracking-widest flex items-center space-x-1.5">
                <Compass className="h-4.5 w-4.5 animate-spin-slow" />
                <span>Tactical Evacuation Routes</span>
              </h3>
              <p className="text-xs text-slate-300 bg-slate-950 p-3.5 border border-slate-850 rounded-lg leading-relaxed">
                {activeData.advice.safeRoutesDescription}
              </p>

              {/* Mini SVG vector mapping corridor */}
              <div className="h-[120px] bg-slate-950 rounded-lg border border-slate-850 relative overflow-hidden flex items-center justify-center">
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:15px_15px] opacity-10" />
                
                <svg className="w-full h-full absolute inset-0 z-10">
                  {/* Danger zone pulsing */}
                  <circle cx="20%" cy="50%" r="20" fill="rgba(239, 68, 68, 0.1)" className="animate-ping" />
                  <circle cx="20%" cy="50%" r="8" fill="#ef4444" />
                  <text x="20%" y="65%" fill="#ef4444" fontSize="8" fontWeight="bold" textAnchor="middle">FLOOD RISK ZONE</text>
                  
                  {/* Safe pathway */}
                  <path d="M 20 60 Q 50 15, 80 50" fill="none" stroke="#10b981" strokeWidth="2.5" strokeDasharray="5 3" className="animate-[dash_2s_linear_infinite]" />
                  <circle cx="80%" cy="50%" r="6" fill="#10b981" />
                  <text x="80%" y="65%" fill="#10b981" fontSize="8" fontWeight="bold" textAnchor="middle">SHELTER AREA</text>
                </svg>

                <div className="absolute top-2 left-2 bg-slate-900/90 border border-slate-850 px-2 py-0.5 rounded text-[8px] font-bold z-20">
                  LIVE ROUTE STATUS: EAST CORRIDOR ACTIVE
                </div>
              </div>
            </div>

          </div>

          {/* Right panel: Relief Shelters Status */}
          <div className="space-y-6">
            <div className="bg-slate-900 border border-slate-850 rounded-xl p-6 shadow-xl space-y-4">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center space-x-1.5">
                <Home className="h-4.5 w-4.5 text-emerald-400" />
                <span>Nearby Relief Camps</span>
              </h3>

              <div className="space-y-3">
                {activeData.shelters.map((shelter) => {
                  const percent = Math.min(Math.round((shelter.occupancy / shelter.capacity) * 100), 100);
                  const isFull = shelter.status === 'full';
                  return (
                    <div key={shelter.name} className="bg-slate-950 p-4 border border-slate-850 rounded-lg space-y-3">
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-extrabold text-xs text-white">{shelter.name}</h4>
                          <span className="text-[9px] text-slate-400 flex items-center space-x-0.5 mt-0.5">
                            <MapPin className="h-3 w-3 shrink-0" />
                            <span>{shelter.location}</span>
                          </span>
                        </div>
                        <span className={`text-[8px] font-black uppercase px-2 py-0.5 rounded ${
                          isFull ? 'bg-red-950 text-red-400 border border-red-800' : 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                        }`}>
                          {shelter.status}
                        </span>
                      </div>

                      {/* Progress bar */}
                      <div>
                        <div className="flex justify-between text-[9px] font-bold text-slate-400 mb-1">
                          <span>Capacity Tracking</span>
                          <span>{shelter.occupancy} / {shelter.capacity} ({percent}%)</span>
                        </div>
                        <div className="w-full bg-slate-900 rounded-full h-1.5 overflow-hidden">
                          <div
                            className={`h-1.5 rounded-full transition-all ${
                              isFull ? 'bg-red-500' : percent > 80 ? 'bg-amber-500' : 'bg-emerald-500'
                            }`}
                            style={{ width: `${percent}%` }}
                          />
                        </div>
                      </div>

                      <div className="pt-1.5 flex justify-between items-center text-[10px]">
                        <span className="text-slate-400">Emergency Desk: <strong className="text-white">{shelter.contact}</strong></span>
                        <a
                          href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(shelter.name)}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-emerald-400 hover:text-emerald-300 font-bold flex items-center space-x-0.5"
                        >
                          <span>Get Route</span>
                          <ArrowRight className="h-3 w-3" />
                        </a>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Helpline summary box */}
            <div className="bg-slate-900 border border-slate-850 p-4 rounded-xl flex items-start space-x-3">
              <Info className="h-5 w-5 text-emerald-500 mt-0.5 shrink-0" />
              <div className="text-xs text-slate-405 leading-relaxed">
                <span className="font-bold text-white uppercase block mb-0.5">DISASTER MITIGATION INFO</span>
                If stranded or requiring heavy machinery evacuation, send your immediate GPS coordinates using the chatbot assistant by typing *"NDMA Evac Request"*.
              </div>
            </div>

          </div>

        </div>

      </div>
      <FloatingBot />
    </main>
  );
}
