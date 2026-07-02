'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '../context/AuthContext';
import { Shield, User, LogOut, Siren, Menu, X } from 'lucide-react';

interface NavbarProps {
  onTriggerWomensSOS: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onTriggerWomensSOS }) => {
  const pathname = usePathname();
  const { user, isAuthenticated, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  const navLinks = [
    { name: 'Gov Guidance', href: '/guidance' },
    { name: 'Disaster Mode', href: '/disaster' },
    { name: 'AI Scam Detector', href: '/scam-detector' },
    { name: 'Deepfake forensic', href: '/deepfake' },
    { name: 'AI First Aid', href: '/first-aid' },
    { name: 'Missing Person Tool', href: '/missing-person' },
  ];

  return (
    <nav className="bg-slate-900 border-b border-slate-800 text-white sticky top-0 z-50 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo / Government style seal branding */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-2">
              <Shield className="h-8 w-8 text-emerald-500" />
              <div className="flex flex-col">
                <span className="font-extrabold text-base tracking-wider uppercase leading-none">
                  AI Navigator
                </span>
                <span className="text-[10px] text-slate-400 font-medium uppercase tracking-tight">
                  Emergency Government Portal
                </span>
              </div>
            </Link>
          </div>

          {/* Desktop Navigation Links */}
          <div className="hidden lg:flex space-x-4">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`px-3 py-2 rounded-md text-sm font-semibold transition-colors ${
                    isActive
                      ? 'bg-emerald-800 text-white'
                      : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                  }`}
                >
                  {link.name}
                </Link>
              );
            })}
          </div>

          {/* Right Action Bar */}
          <div className="hidden lg:flex items-center space-x-3">
            {/* Blinking 1-Click Women's Safety SOS Button */}
            <button
              onClick={onTriggerWomensSOS}
              className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md text-xs font-black uppercase tracking-wider flex items-center space-x-1.5 shadow-lg border border-red-500 animate-pulse transition-all duration-300"
            >
              <Siren className="h-4 w-4" />
              <span>Women's Safety SOS</span>
            </button>

            {isAuthenticated ? (
              <div className="flex items-center space-x-3">
                {user?.role === 'admin' ? (
                  <Link
                    href="/admin"
                    className="bg-slate-800 border border-slate-700 px-3 py-2 rounded-md text-sm font-semibold text-emerald-400 hover:bg-slate-700"
                  >
                    Admin Dashboard
                  </Link>
                ) : (
                  <span className="text-sm font-medium text-slate-300">
                    Hello, <strong className="text-white">{user?.name}</strong>
                  </span>
                )}
                <button
                  onClick={logout}
                  className="bg-slate-800 hover:bg-slate-700 text-slate-300 p-2 rounded-full"
                  title="Logout"
                >
                  <LogOut className="h-4 w-4" />
                </button>
              </div>
            ) : (
              <div className="flex space-x-2">
                <Link
                  href="/login"
                  className="text-slate-300 hover:bg-slate-800 hover:text-white px-3 py-2 rounded-md text-sm font-semibold"
                >
                  Login
                </Link>
                <Link
                  href="/register"
                  className="bg-emerald-600 hover:bg-emerald-700 text-white px-3 py-2 rounded-md text-sm font-bold shadow-md"
                >
                  Register
                </Link>
              </div>
            )}
          </div>

          {/* Mobile hamburger menu */}
          <div className="flex lg:hidden items-center space-x-2">
            <button
              onClick={onTriggerWomensSOS}
              className="bg-red-600 hover:bg-red-700 text-white px-3 py-1.5 rounded-md text-[10px] font-black uppercase tracking-wider flex items-center space-x-1 shadow-md animate-pulse"
            >
              <Siren className="h-3 w-3" />
              <span>Women's SOS</span>
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="text-slate-400 hover:text-white p-1"
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-slate-900 border-t border-slate-800 px-2 pt-2 pb-4 space-y-1">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`block px-3 py-2 rounded-md text-base font-medium ${
                  isActive ? 'bg-emerald-800 text-white' : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                }`}
              >
                {link.name}
              </Link>
            );
          })}
          <div className="border-t border-slate-800 mt-3 pt-3 flex flex-col space-y-2 px-3">
            {isAuthenticated ? (
              <>
                {user?.role === 'admin' && (
                  <Link
                    href="/admin"
                    onClick={() => setMobileMenuOpen(false)}
                    className="bg-slate-850 text-center border border-slate-700 px-3 py-2 rounded-md text-sm font-semibold text-emerald-400"
                  >
                    Admin Dashboard
                  </Link>
                )}
                <span className="text-sm font-medium text-slate-300 text-center">
                  Hello, <strong className="text-white">{user?.name}</strong>
                </span>
                <button
                  onClick={() => {
                    logout();
                    setMobileMenuOpen(false);
                  }}
                  className="bg-slate-850 hover:bg-slate-800 text-red-400 px-3 py-2 rounded-md text-sm font-semibold flex items-center justify-center space-x-2 border border-slate-800"
                >
                  <LogOut className="h-4 w-4" />
                  <span>Logout</span>
                </button>
              </>
            ) : (
              <div className="flex flex-col space-y-2">
                <Link
                  href="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-center text-slate-300 hover:bg-slate-800 hover:text-white px-3 py-2 rounded-md text-sm font-semibold border border-slate-800"
                >
                  Login
                </Link>
                <Link
                  href="/register"
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-center bg-emerald-600 hover:bg-emerald-700 text-white px-3 py-2 rounded-md text-sm font-bold shadow-md"
                >
                  Register
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};
