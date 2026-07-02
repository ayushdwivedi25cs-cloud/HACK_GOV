'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../context/AuthContext';
import { Navbar } from '../../components/Navbar';
import { FloatingBot } from '../../components/FloatingBot';
import { Shield, Lock, Mail, Users, AlertCircle, CheckCircle } from 'lucide-react';
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
    <main className="min-h-screen bg-slate-950 text-white flex flex-col">
      <Navbar onTriggerWomensSOS={() => {}} />

      <div className="flex-1 flex items-center justify-center p-4">
        <div className="bg-slate-900 border border-slate-800 rounded-xl shadow-2xl max-w-md w-full overflow-hidden">
          
          {/* Top Panel Banner */}
          <div className="bg-slate-900 border-b border-slate-850 p-6 flex flex-col items-center text-center">
            <Shield className="h-10 w-10 text-emerald-500 mb-2" />
            <h1 className="font-extrabold text-lg uppercase tracking-wider text-white">Emergency Portal Secure Login</h1>
            <p className="text-xs text-slate-400">Specify your credentials to login to the system</p>
          </div>

          <div className="p-6">
            {/* Roles selector buttons */}
            <div className="grid grid-cols-2 gap-2 mb-6">
              <button
                type="button"
                onClick={() => {
                  setRole('citizen');
                  setError(null);
                }}
                className={`py-2 rounded font-bold text-xs uppercase tracking-wide flex items-center justify-center space-x-1.5 border transition-all ${
                  role === 'citizen'
                    ? 'bg-emerald-600 border-emerald-500 text-white'
                    : 'bg-slate-850 border-slate-800 text-slate-400 hover:text-slate-300'
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
                className={`py-2 rounded font-bold text-xs uppercase tracking-wide flex items-center justify-center space-x-1.5 border transition-all ${
                  role === 'admin'
                    ? 'bg-emerald-600 border-emerald-500 text-white'
                    : 'bg-slate-850 border-slate-800 text-slate-400 hover:text-slate-300'
                }`}
              >
                <Shield className="h-4 w-4" />
                <span>Admin Login</span>
              </button>
            </div>

            {/* Notifications */}
            {error && (
              <div className="bg-red-950/60 border border-red-800 text-red-300 rounded p-3 mb-4 flex items-start space-x-2 text-xs">
                <AlertCircle className="h-4 w-4 mt-0.5 shrink-0" />
                <span>{error}</span>
              </div>
            )}
            {success && (
              <div className="bg-emerald-950/60 border border-emerald-800 text-emerald-350 rounded p-3 mb-4 flex items-start space-x-2 text-xs">
                <CheckCircle className="h-4 w-4 mt-0.5 shrink-0 animate-bounce" />
                <span>Login successful. Redirecting to your panel...</span>
              </div>
            )}

            {role === 'admin' && (
              <div className="bg-slate-950 border border-slate-850 p-3 rounded mb-4 text-[10px] text-slate-400 leading-relaxed font-mono">
                <span className="text-emerald-400 font-bold uppercase block mb-1">💡 Demo Admin Portal Credentials</span>
                Email: <span className="text-white">admin@hackgov.in</span><br/>
                Password: <span className="text-white">admin123</span>
              </div>
            )}

            {/* Login form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4.5 w-4.5 text-slate-500" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@example.com"
                    className="w-full bg-slate-950 border border-slate-800 rounded p-2.5 pl-10 text-sm focus:outline-none focus:border-emerald-500 text-white placeholder-slate-650"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4.5 w-4.5 text-slate-500" />
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full bg-slate-950 border border-slate-800 rounded p-2.5 pl-10 text-sm focus:outline-none focus:border-emerald-500 text-white placeholder-slate-650"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-3 rounded text-sm font-bold uppercase tracking-wide transition-all shadow-lg hover:shadow-emerald-950 flex items-center justify-center space-x-1.5"
              >
                {loading ? 'Authenticating...' : 'Secure Authorization'}
              </button>
            </form>

            <div className="mt-6 pt-6 border-t border-slate-850 text-center">
              <p className="text-xs text-slate-400">
                New Citizen?{' '}
                <Link href="/register" className="text-emerald-400 font-bold hover:underline">
                  Create Emergency Profile
                </Link>
              </p>
            </div>

          </div>
        </div>
      </div>
    </main>
  );
}
