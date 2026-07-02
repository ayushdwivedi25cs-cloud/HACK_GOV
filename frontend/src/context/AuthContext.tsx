'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

export interface IEmergencyContact {
  name: string;
  relationship: string;
  mobile: string;
  email: string;
}

export interface IMedicalInfo {
  bloodGroup?: string;
  allergies?: string;
  conditions?: string;
}

export interface IUser {
  id: string;
  name: string;
  email: string;
  mobile?: string;
  role: 'citizen' | 'admin';
  medicalInfo?: IMedicalInfo;
  emergencyContacts?: IEmergencyContact[];
  state?: string;
  district?: string;
}

interface AuthContextType {
  user: IUser | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string, role: 'citizen' | 'admin') => Promise<void>;
  logout: () => void;
  register: (citizenData: any) => Promise<void>;
  triggerEmergencySOS: (category: string, location: { lat: number; lng: number; address?: string }) => Promise<any>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<IUser | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const API_URL = 'http://localhost:5000/api';

  useEffect(() => {
    // Load existing session on mount
    const storedToken = localStorage.getItem('hackgov_token');
    const storedUser = localStorage.getItem('hackgov_user');

    if (storedToken && storedUser) {
      setToken(storedToken);
      setUser(JSON.parse(storedUser));
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string, role: 'citizen' | 'admin') => {
    setIsLoading(true);
    try {
      const response = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, role })
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || 'Login failed');
      }

      setToken(data.token);
      setUser(data.user);
      localStorage.setItem('hackgov_token', data.token);
      localStorage.setItem('hackgov_user', JSON.stringify(data.user));
    } catch (error) {
      console.error(error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('hackgov_token');
    localStorage.removeItem('hackgov_user');
  };

  const register = async (citizenData: any) => {
    setIsLoading(true);
    try {
      const response = await fetch(`${API_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(citizenData)
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || 'Registration failed');
      }
    } catch (error) {
      console.error(error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const triggerEmergencySOS = async (category: string, location: { lat: number; lng: number; address?: string }) => {
    try {
      const response = await fetch(`${API_URL}/sos/trigger`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          category,
          location,
          userId: user?.role === 'citizen' ? user.id : undefined,
          guestName: user?.role === 'citizen' ? user.name : 'Anonymous Citizen'
        })
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || 'SOS dispatch failed');
      }
      return data;
    } catch (error) {
      console.error(error);
      throw error;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!token,
        isLoading,
        login,
        logout,
        register,
        triggerEmergencySOS
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
