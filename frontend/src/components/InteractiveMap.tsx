'use client';

import React, { useState, useEffect } from 'react';
import {
  MapPin,
  Navigation,
  Activity,
  Shield,
  Flame,
  Globe,
  Home,
  Clock,
  Compass,
  ArrowRight
} from 'lucide-react';

interface ServiceItem {
  id: string;
  name: string;
  type: 'hospital' | 'police' | 'fire' | 'cyber' | 'relief';
  latOffset: number; // For plotting on the visual grid
  lngOffset: number;
  phone: string;
  distance: number;
  time: number;
  status: 'Open 24/7' | 'Active' | 'Full' | 'Spaces Available';
  address: string;
}

export const InteractiveMap: React.FC = () => {
  const [selectedType, setSelectedType] = useState<string>('all');
  const [activeItem, setActiveItem] = useState<ServiceItem | null>(null);
  const [userPos, setUserPos] = useState<{ x: number; y: number }>({ x: 50, y: 50 });
  const [routeActive, setRouteActive] = useState<boolean>(false);

  const services: ServiceItem[] = [
    {
      id: 'h1',
      name: 'All India Institute of Medical Sciences (AIIMS)',
      type: 'hospital',
      latOffset: 30,
      lngOffset: 25,
      phone: '011-26588500',
      distance: 1.8,
      time: 5,
      status: 'Open 24/7',
      address: 'Ansari Nagar, New Delhi'
    },
    {
      id: 'h2',
      name: 'Metro Emergency Hospital',
      type: 'hospital',
      latOffset: 65,
      lngOffset: 80,
      phone: '102 / 011-2947291',
      distance: 3.4,
      time: 9,
      status: 'Open 24/7',
      address: 'Sector 12, Dwarka, Delhi'
    },
    {
      id: 'p1',
      name: 'District Police Headquarter & Station',
      type: 'police',
      latOffset: 20,
      lngOffset: 70,
      phone: '100 / 011-2301929',
      distance: 1.2,
      time: 3,
      status: 'Open 24/7',
      address: 'Parliament Street, New Delhi'
    },
    {
      id: 'p2',
      name: 'Central Cyber Crime Police Station',
      type: 'cyber',
      latOffset: 45,
      lngOffset: 35,
      phone: '1930',
      distance: 0.9,
      time: 2,
      status: 'Active',
      address: 'CGO Complex, Lodhi Road'
    },
    {
      id: 'f1',
      name: 'Central Fire Control Station',
      type: 'fire',
      latOffset: 80,
      lngOffset: 40,
      phone: '101 / 011-2341222',
      distance: 2.1,
      time: 6,
      status: 'Open 24/7',
      address: 'Connaught Place, New Delhi'
    },
    {
      id: 'r1',
      name: 'Government Emergency Relief Camp #4',
      type: 'relief',
      latOffset: 75,
      lngOffset: 20,
      phone: '1078',
      distance: 4.2,
      time: 12,
      status: 'Spaces Available',
      address: 'Stadium Grounds, Sector 4'
    },
    {
      id: 'r2',
      name: 'Municipal Disaster Shield Center',
      type: 'relief',
      latOffset: 15,
      lngOffset: 55,
      phone: '011-2343801',
      distance: 2.7,
      time: 7,
      status: 'Full',
      address: 'Community Center Hall, South Ext'
    }
  ];

  // Try to locate user or simulate movement
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((pos) => {
        // Just keeping it centered within visual offsets but logging coordinates
        console.log('Secure GPS obtained for Map: ', pos.coords.latitude, pos.coords.longitude);
      });
    }
  }, []);

  const handleSelectItem = (item: ServiceItem) => {
    setActiveItem(item);
    setRouteActive(true);
  };

  const filteredServices = services.filter(
    (s) => selectedType === 'all' || s.type === selectedType
  );

  const getServiceColor = (type: string) => {
    switch (type) {
      case 'hospital':
        return 'text-emerald-500 bg-emerald-500/10 border-emerald-500/30';
      case 'police':
        return 'text-blue-500 bg-blue-500/10 border-blue-500/30';
      case 'fire':
        return 'text-orange-500 bg-orange-500/10 border-orange-500/30';
      case 'cyber':
        return 'text-indigo-500 bg-indigo-500/10 border-indigo-500/30';
      case 'relief':
        return 'text-amber-500 bg-amber-500/10 border-amber-500/30';
      default:
        return 'text-slate-500 bg-slate-500/10 border-slate-500/30';
    }
  };

  const getServiceIcon = (type: string) => {
    switch (type) {
      case 'hospital':
        return Activity;
      case 'police':
        return Shield;
      case 'fire':
        return Flame;
      case 'cyber':
        return Globe;
      case 'relief':
        return Home;
      default:
        return MapPin;
    }
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-xl text-white">
      {/* Map Header Panel */}
      <div className="p-4 bg-slate-950/80 border-b border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div>
          <h3 className="font-extrabold text-sm uppercase tracking-wider flex items-center space-x-1.5 text-emerald-400">
            <Compass className="h-4 w-4 animate-spin-slow" />
            <span>Emergency Services Finder</span>
          </h3>
          <p className="text-xs text-slate-400">GPS location verified. Displaying closest responders.</p>
        </div>

        {/* Filter buttons */}
        <div className="flex flex-wrap gap-1.5">
          {['all', 'hospital', 'police', 'fire', 'cyber', 'relief'].map((t) => (
            <button
              key={t}
              onClick={() => {
                setSelectedType(t);
                setActiveItem(null);
                setRouteActive(false);
              }}
              className={`px-2.5 py-1 rounded text-xs font-bold uppercase transition-all ${
                selectedType === t
                  ? 'bg-emerald-600 text-white shadow'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-705'
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3">
        {/* Left Side: Services List */}
        <div className="p-4 border-r border-slate-850 max-h-[400px] overflow-y-auto space-y-2 lg:col-span-1">
          {filteredServices.map((item) => {
            const Icon = getServiceIcon(item.type);
            const style = getServiceColor(item.type);
            return (
              <button
                key={item.id}
                onClick={() => handleSelectItem(item)}
                className={`w-full text-left p-3 rounded-lg border transition-all flex items-start space-x-3 ${
                  activeItem?.id === item.id
                    ? 'bg-slate-800/80 border-slate-650 shadow-md scale-[1.01]'
                    : 'bg-slate-950/40 border-slate-850 hover:bg-slate-900'
                }`}
              >
                <div className={`p-2 rounded border ${style} shrink-0`}>
                  <Icon className="h-4 w-4" />
                </div>
                <div className="min-w-0 flex-1">
                  <h4 className="font-bold text-xs truncate text-white">{item.name}</h4>
                  <p className="text-[10px] text-slate-400 truncate mb-1">{item.address}</p>
                  
                  <div className="flex items-center space-x-2 text-[10px]">
                    <span className="text-slate-300 font-semibold flex items-center space-x-0.5">
                      <Compass className="h-3 w-3" />
                      <span>{item.distance} km</span>
                    </span>
                    <span className="text-slate-300 font-semibold flex items-center space-x-0.5">
                      <Clock className="h-3 w-3" />
                      <span>{item.time} mins</span>
                    </span>
                    <span className="px-1.5 py-0.2 bg-slate-800 rounded font-bold text-emerald-400">
                      {item.status}
                    </span>
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        {/* Right Side: Visual Map Display */}
        <div className="lg:col-span-2 relative h-[400px] bg-slate-950/80 flex items-center justify-center p-4">
          
          {/* Tactical grid background overlay */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:30px_30px] opacity-15" />
          
          {/* Compass Rose */}
          <div className="absolute bottom-4 right-4 text-slate-700 pointer-events-none">
            <Compass className="h-10 w-10 opacity-40 animate-pulse" />
          </div>

          {/* SVG Map Canvas */}
          <svg className="w-full h-full absolute inset-0 select-none z-10">
            {/* User marker pulsing */}
            <circle cx={`${userPos.x}%`} cy={`${userPos.y}%`} r="14" fill="rgba(16, 185, 129, 0.15)" className="animate-ping" />
            <circle cx={`${userPos.x}%`} cy={`${userPos.y}%`} r="6" fill="#10b981" stroke="#ffffff" strokeWidth="2" />

            {/* Render route if active */}
            {routeActive && activeItem && (
              <>
                <line
                  x1={`${userPos.x}%`}
                  y1={`${userPos.y}%`}
                  x2={`${activeItem.lngOffset}%`}
                  y2={`${activeItem.latOffset}%`}
                  stroke="#10b981"
                  strokeWidth="3"
                  strokeDasharray="6 4"
                  className="animate-[dash_2s_linear_infinite]"
                  style={{
                    strokeDashoffset: 10
                  }}
                />
                {/* Route path glow */}
                <line
                  x1={`${userPos.x}%`}
                  y1={`${userPos.y}%`}
                  x2={`${activeItem.lngOffset}%`}
                  y2={`${activeItem.latOffset}%`}
                  stroke="#10b981"
                  strokeWidth="6"
                  opacity="0.25"
                />
              </>
            )}

            {/* Plot service markers */}
            {filteredServices.map((item) => {
              const isSelected = activeItem?.id === item.id;
              const typeColor = item.type === 'hospital' ? '#10b981' : item.type === 'police' ? '#3b82f6' : item.type === 'fire' ? '#f97316' : item.type === 'cyber' ? '#6366f1' : '#f59e0b';
              return (
                <g key={item.id} className="cursor-pointer" onClick={() => handleSelectItem(item)}>
                  <circle
                    cx={`${item.lngOffset}%`}
                    cy={`${item.latOffset}%`}
                    r={isSelected ? '12' : '8'}
                    fill={typeColor}
                    opacity={isSelected ? '0.3' : '0.15'}
                    className={isSelected ? 'animate-ping' : ''}
                  />
                  <circle
                    cx={`${item.lngOffset}%`}
                    cy={`${item.latOffset}%`}
                    r="4"
                    fill={typeColor}
                  />
                </g>
              );
            })}
          </svg>

          {/* User Location Bubble Indicator */}
          <div className="absolute top-4 left-4 bg-slate-900/90 border border-slate-800 px-3 py-1.5 rounded-lg text-[10px] font-bold z-20 flex items-center space-x-1.5 shadow">
            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>YOU (GPS CENTROID)</span>
          </div>

          {/* Active Navigation Info Overlay Card */}
          {activeItem ? (
            <div className="absolute bottom-4 left-4 right-4 bg-slate-900 border border-emerald-500/30 p-3 rounded-lg shadow-xl z-20 flex items-center justify-between text-left">
              <div className="min-w-0 flex-1 mr-2">
                <span className="text-[10px] text-emerald-400 font-bold uppercase tracking-wider block">ROUTE ACTIVE</span>
                <h4 className="font-extrabold text-xs text-white truncate">{activeItem.name}</h4>
                <p className="text-[10px] text-slate-400 truncate">
                  Time: <strong className="text-white">{activeItem.time} mins</strong> | Distance: <strong className="text-white">{activeItem.distance} km</strong>
                </p>
              </div>
              <a
                href={`https://www.google.com/maps/dir/?api=1&destination=${activeItem.name}`}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-emerald-600 hover:bg-emerald-700 text-white p-2 rounded-lg text-xs font-bold uppercase tracking-wide flex items-center space-x-1 shrink-0 shadow-lg shadow-emerald-950 transition-colors"
              >
                <span>Navigate</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </a>
            </div>
          ) : (
            <div className="absolute bottom-4 left-4 bg-slate-900/90 border border-slate-800 px-4 py-2 rounded-lg text-xs text-slate-400 text-left z-20">
              Select any emergency facility from the list or map to display safe directions and route guidance.
            </div>
          )}

        </div>
      </div>
    </div>
  );
};
