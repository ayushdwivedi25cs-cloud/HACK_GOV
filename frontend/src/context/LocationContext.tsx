'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

export interface LocationData {
  lat: number | null;
  lng: number | null;
  address: string;
}

interface LocationContextType {
  location: LocationData;
  setLocation: (loc: LocationData) => void;
  permissionGranted: boolean | null;
  requestLocation: () => void;
  loading: boolean;
}

const LocationContext = createContext<LocationContextType | undefined>(undefined);

export const LocationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [location, setLocationState] = useState<LocationData>({ lat: null, lng: null, address: '' });
  const [permissionGranted, setPermissionGranted] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(false);
  const [prompted, setPrompted] = useState(false);

  useEffect(() => {
    // Only prompt once on mount
    if (!prompted) {
      setPrompted(true);
      requestLocation();
    }
  }, [prompted]);

  const requestLocation = () => {
    setLoading(true);
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          setPermissionGranted(true);
          const lat = position.coords.latitude;
          const lng = position.coords.longitude;
          try {
            // Reverse geocoding fallback (basic mock if API fails)
            setLocationState({ lat, lng, address: 'Current GPS Location' });
          } catch (e) {
            setLocationState({ lat, lng, address: 'Unknown Location' });
          }
          setLoading(false);
        },
        (error) => {
          console.warn('Location permission denied or error', error);
          setPermissionGranted(false);
          setLoading(false);
        },
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
      );
    } else {
      setPermissionGranted(false);
      setLoading(false);
    }
  };

  return (
    <LocationContext.Provider value={{ location, setLocation: setLocationState, permissionGranted, requestLocation, loading }}>
      {children}
    </LocationContext.Provider>
  );
};

export const useLocation = () => {
  const ctx = useContext(LocationContext);
  if (!ctx) throw new Error('useLocation must be used within LocationProvider');
  return ctx;
};
