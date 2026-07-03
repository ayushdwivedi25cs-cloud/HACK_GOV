'use client';

import React, { useState } from 'react';
import {
  AlertTriangle,
  Home,
  MapPin,
  CheckCircle,
  XCircle,
  ShieldAlert,
  Compass,
  ArrowRight,
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
    <div className="gov-section-gray min-h-screen">
      <div className="gov-container space-y-6">
        
        {/* Urgent header warning banner */}
        <div className="bg-[#FFF8E1] border border-[#FFD54F] border-l-4 border-l-[#CC0001] p-4 rounded flex items-start gap-3 shadow-sm">
          <ShieldAlert className="h-6 w-6 text-[#CC0001] shrink-0 mt-0.5 animate-pulse" />
          <div>
            <h1 className="font-bold text-sm uppercase tracking-wide text-[#CC0001]">Active Disaster Response Mode</h1>
            <p className="text-sm text-gray-800 leading-relaxed mt-1">
              National Emergency Monitoring Center is active. High-risk zones are being monitored. Use tabs below for real-time safety routes and active relief camp allocations.
            </p>
          </div>
        </div>

        {/* Disaster selection tabs */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-2 border-b border-gray-200 pb-4">
          {Object.keys(disasters).map((key) => (
            <button
              key={key}
              onClick={() => setActiveDisaster(key)}
              className={`py-3 rounded text-[11px] font-bold uppercase transition-colors flex items-center justify-center gap-1.5 border ${
                activeDisaster === key
                  ? 'bg-[#FF6200] border-[#FF6200] text-white shadow-sm'
                  : 'bg-white border-gray-200 text-gray-600 hover:text-[#0057A8] hover:bg-blue-50'
              }`}
            >
              <AlertTriangle className="h-4 w-4" />
              <span>{key} Advisory</span>
            </button>
          ))}
        </div>

        {/* Main Dashboard Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Left / Middle: Advisories & Safe Routes */}
          <div className="lg:col-span-2 flex flex-col gap-6">
            
            {/* Advice panel */}
            <div className="bg-white border border-gray-200 rounded p-6 shadow-sm border-t-4 border-t-[#0057A8]">
              <h2 className="font-bold text-lg text-[#1B2B6B] uppercase tracking-wider border-b border-gray-200 pb-3 flex items-center gap-2 mb-4">
                <ShieldAlert className="h-5 w-5 text-[#FF6200]" />
                <span>{activeData.title}</span>
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Dos */}
                <div className="space-y-3">
                  <h3 className="text-xs font-bold text-[#138808] uppercase tracking-widest flex items-center gap-1.5">
                    <CheckCircle className="h-4 w-4" />
                    <span>Official Guidance (DOs)</span>
                  </h3>
                  <ul className="space-y-3">
                    {activeData.advice.dos.map((item, i) => (
                      <li key={i} className="text-sm text-gray-700 bg-green-50 p-3 border border-green-200 rounded flex items-start gap-2 font-medium">
                        <span className="text-[#138808] shrink-0 font-bold mt-0.5">•</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Don'ts */}
                <div className="space-y-3">
                  <h3 className="text-xs font-bold text-[#CC0001] uppercase tracking-widest flex items-center gap-1.5">
                    <XCircle className="h-4 w-4" />
                    <span>Strict Prohibitions (DON'Ts)</span>
                  </h3>
                  <ul className="space-y-3">
                    {activeData.advice.donts.map((item, i) => (
                      <li key={i} className="text-sm text-gray-700 bg-red-50 p-3 border border-red-200 rounded flex items-start gap-2 font-medium">
                        <span className="text-[#CC0001] shrink-0 font-bold mt-0.5">•</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            {/* Tactical Safe Route overlay */}
            <div className="bg-white border border-gray-200 rounded p-6 shadow-sm border-t-4 border-t-[#138808]">
              <h3 className="text-xs font-bold text-[#138808] uppercase tracking-widest flex items-center gap-1.5 mb-3">
                <Compass className="h-4.5 w-4.5 animate-spin-slow" />
                <span>Verified Evacuation Routes</span>
              </h3>
              <p className="text-sm text-gray-800 bg-gray-50 p-4 border border-gray-200 rounded leading-relaxed mb-4">
                {activeData.advice.safeRoutesDescription}
              </p>

              {/* Mini SVG vector mapping corridor */}
              <div className="h-[140px] bg-[#EEF4FB] rounded border border-[#BDD5EF] relative overflow-hidden flex items-center justify-center">
                <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'radial-gradient(#0057A8 1px, transparent 1px)', backgroundSize: '15px 15px' }} />
                
                <svg className="w-full h-full absolute inset-0 z-10">
                  {/* Danger zone pulsing */}
                  <circle cx="20%" cy="50%" r="20" fill="rgba(204, 0, 1, 0.1)" className="animate-ping" />
                  <circle cx="20%" cy="50%" r="8" fill="#CC0001" />
                  <text x="20%" y="65%" fill="#CC0001" fontSize="9" fontWeight="bold" textAnchor="middle">DANGER ZONE</text>
                  
                  {/* Safe pathway */}
                  <path d="M 20 60 Q 50 15, 80 50" fill="none" stroke="#138808" strokeWidth="2.5" strokeDasharray="5 3" className="animate-[dash_2s_linear_infinite]" />
                  <circle cx="80%" cy="50%" r="6" fill="#138808" />
                  <text x="80%" y="65%" fill="#138808" fontSize="9" fontWeight="bold" textAnchor="middle">SHELTER AREA</text>
                </svg>

                <div className="absolute top-2 left-2 bg-white border border-gray-200 px-2 py-1 rounded text-[9px] font-bold z-20 text-[#0057A8]">
                  LIVE ROUTE STATUS: CORRIDOR ACTIVE
                </div>
              </div>
            </div>

          </div>

          {/* Right panel: Relief Shelters Status */}
          <div className="flex flex-col gap-6">
            <div className="bg-white border border-gray-200 rounded p-6 shadow-sm border-t-4 border-t-[#0057A8]">
              <h3 className="text-xs font-bold text-[#1B2B6B] uppercase tracking-widest flex items-center gap-1.5 mb-4">
                <Home className="h-4.5 w-4.5 text-[#0057A8]" />
                <span>Official Relief Camps</span>
              </h3>

              <div className="space-y-4">
                {activeData.shelters.map((shelter) => {
                  const percent = Math.min(Math.round((shelter.occupancy / shelter.capacity) * 100), 100);
                  const isFull = shelter.status === 'full';
                  return (
                    <div key={shelter.name} className="bg-gray-50 p-4 border border-gray-200 rounded space-y-3">
                      <div className="flex justify-between items-start gap-2">
                        <div>
                          <h4 className="font-bold text-sm text-gray-900">{shelter.name}</h4>
                          <span className="text-[10px] text-gray-600 flex items-center gap-0.5 mt-1">
                            <MapPin className="h-3 w-3 shrink-0 text-gray-400" />
                            <span>{shelter.location}</span>
                          </span>
                        </div>
                        <span className={`gov-badge shrink-0 ${
                          isFull ? 'gov-badge-red' : 'gov-badge-green'
                        }`}>
                          {shelter.status}
                        </span>
                      </div>

                      {/* Progress bar */}
                      <div>
                        <div className="flex justify-between text-[10px] font-bold text-gray-600 mb-1.5">
                          <span>Capacity Tracking</span>
                          <span>{shelter.occupancy} / {shelter.capacity} ({percent}%)</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                          <div
                            className={`h-2 rounded-full transition-all ${
                              isFull ? 'bg-[#CC0001]' : percent > 80 ? 'bg-[#FF6200]' : 'bg-[#138808]'
                            }`}
                            style={{ width: `${percent}%` }}
                          />
                        </div>
                      </div>

                      <div className="pt-2 flex justify-between items-center text-[11px] border-t border-gray-200 mt-2">
                        <span className="text-gray-600 font-medium">Emergency Desk: <strong className="text-gray-900">{shelter.contact}</strong></span>
                        <a
                          href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(shelter.name)}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[#0057A8] hover:text-[#004080] font-bold flex items-center gap-0.5"
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
            <div className="bg-[#EEF4FB] border border-[#BDD5EF] p-4 rounded flex items-start gap-3">
              <Info className="h-5 w-5 text-[#0057A8] mt-0.5 shrink-0" />
              <div className="text-xs text-[#0057A8] leading-relaxed">
                <span className="font-bold uppercase block mb-1">NDMA MITIGATION INFO</span>
                If stranded or requiring heavy machinery evacuation, send your immediate GPS coordinates using the chatbot assistant by typing *"NDMA Evac Request"*.
              </div>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
}
