'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../context/AuthContext';
import { Shield, Lock, Mail, Users, AlertCircle, CheckCircle, Info } from 'lucide-react';
import Link from 'next/link';

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();
  const [role, setRole] = useState<'citizen' | 'admin'>('citizen');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<boolean>(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      await login(email, password, role);
      setSuccess(true);
      setTimeout(() => {
        if (role === 'admin') {
          router.push('/admin');
        } else {
          router.push('/');
        }
      }, 1000);
    } catch (err: any) {
      setError(err.message || 'Login credentials invalid. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="gov-section-gray min-h-[calc(100vh-140px)] flex flex-col justify-center items-center py-12 px-4">
      <div className="bg-white border border-gray-200 rounded shadow-sm max-w-md w-full overflow-hidden border-t-4 border-t-[#0057A8]">
        
        {/* Top Panel Banner */}
        <div className="bg-gray-50 border-b border-gray-200 p-6 flex flex-col items-center text-center">
          <Shield className="h-12 w-12 text-[#0057A8] mb-3" />
          <h1 className="font-bold text-lg uppercase tracking-wider text-[#1B2B6B]">Emergency Portal Secure Login</h1>
          <p className="text-sm text-gray-600 mt-1">Specify your credentials to login to the national system</p>
        </div>

        <div className="p-6 md:p-8">
          {/* Roles selector buttons */}
          <div className="grid grid-cols-2 gap-2 mb-6">
            <button
              type="button"
              onClick={() => {
                setRole('citizen');
                setError(null);
              }}
              className={`py-2.5 rounded text-xs font-bold uppercase tracking-wide flex items-center justify-center gap-1.5 border transition-colors ${
                role === 'citizen'
                  ? 'bg-[#0057A8] border-[#0057A8] text-white shadow-sm'
                  : 'bg-white border-gray-300 text-gray-600 hover:text-[#0057A8] hover:bg-blue-50'
              }`}
            >
              <Users className="h-4 w-4" />
              <span>Citizen Login</span>
            </button>
            <button
              type="button"
              onClick={() => {
                setRole('admin');
                setError(null);
              }}
              className={`py-2.5 rounded text-xs font-bold uppercase tracking-wide flex items-center justify-center gap-1.5 border transition-colors ${
                role === 'admin'
                  ? 'bg-[#0057A8] border-[#0057A8] text-white shadow-sm'
                  : 'bg-white border-gray-300 text-gray-600 hover:text-[#0057A8] hover:bg-blue-50'
              }`}
            >
              <Shield className="h-4 w-4" />
              <span>Admin Login</span>
            </button>
          </div>

          {/* Notifications */}
          {error && (
            <div className="gov-notice gov-notice-danger flex items-start gap-2 mb-6">
              <AlertCircle className="h-4.5 w-4.5 mt-0.5 shrink-0 text-[#CC0001]" />
              <span className="text-sm font-semibold text-[#CC0001]">{error}</span>
            </div>
          )}
          {success && (
            <div className="gov-notice flex items-start gap-2 mb-6" style={{ backgroundColor: '#f0fdf4', borderColor: '#bbf7d0' }}>
              <CheckCircle className="h-4.5 w-4.5 mt-0.5 shrink-0 text-[#138808] animate-bounce" />
              <span className="text-sm font-semibold text-[#138808]">Authentication verified. Establishing secure connection...</span>
            </div>
          )}

          {role === 'admin' && (
            <div className="bg-[#EEF4FB] border border-[#BDD5EF] p-4 rounded mb-6 text-xs text-[#0057A8] leading-relaxed font-mono">
              <span className="font-bold uppercase block mb-1.5 flex items-center gap-1.5">
                <Info className="h-4 w-4" /> Demo Portal Credentials
              </span>
              <div className="flex justify-between items-center bg-white p-2 rounded border border-blue-200 mt-1 mb-1">
                <span>Email:</span> <strong className="select-all">admin@hackgov.in</strong>
              </div>
              <div className="flex justify-between items-center bg-white p-2 rounded border border-blue-200">
                <span>Password:</span> <strong className="select-all">admin123</strong>
              </div>
            </div>
          )}

          {/* Login form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-xs font-bold uppercase text-gray-700 mb-1.5">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full bg-white border border-gray-300 rounded p-2.5 pl-10 text-sm focus:outline-none focus:border-[#0057A8] focus:ring-1 focus:ring-[#0057A8] text-gray-900"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-gray-700 mb-1.5">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-white border border-gray-300 rounded p-2.5 pl-10 text-sm focus:outline-none focus:border-[#0057A8] focus:ring-1 focus:ring-[#0057A8] text-gray-900"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="gov-btn-primary w-full justify-center py-3 text-sm mt-2"
            >
              {loading ? 'Authenticating...' : 'Secure Authorization'}
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-gray-200 text-center">
            <p className="text-sm text-gray-600">
              New Citizen User?{' '}
              <Link href="/register" className="text-[#0057A8] font-bold hover:underline hover:text-[#004080]">
                Create Emergency Profile
              </Link>
            </p>
          </div>

        </div>
      </div>
      
      {/* Footer warning */}
      <div className="mt-6 text-center max-w-sm">
        <p className="text-xs text-gray-500 flex items-center justify-center gap-1">
          <Lock className="h-3 w-3" />
          Unauthorized access to this portal is strictly prohibited and monitored.
        </p>
      </div>
    </div>
  );
}
