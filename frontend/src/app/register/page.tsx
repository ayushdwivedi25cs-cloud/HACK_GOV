'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth, IEmergencyContact } from '../../context/AuthContext';
import { Navbar } from '../../components/Navbar';
import { Shield, Plus, Trash2, Users, FileText, Activity, AlertCircle, CheckCircle } from 'lucide-react';
import Link from 'next/link';

export default function RegisterPage() {
  const router = useRouter();
  const { register } = useAuth();

  // Personal info
  const [name, setName] = useState('');
  const [aadhaar, setAadhaar] = useState('');
  const [mobile, setMobile] = useState('');
  const [email, setEmail] = useState('');
  const [dob, setDob] = useState('');
  const [gender, setGender] = useState('Male');
  const [address, setAddress] = useState('');
  const [state, setState] = useState('');
  const [district, setDistrict] = useState('');
  const [password, setPassword] = useState('');

  // Medical Info
  const [bloodGroup, setBloodGroup] = useState('O+');
  const [allergies, setAllergies] = useState('');
  const [conditions, setConditions] = useState('');

  // Dynamic Emergency Contacts
  const [contacts, setContacts] = useState<IEmergencyContact[]>([
    { name: '', relationship: '', mobile: '', email: '' },
    { name: '', relationship: '', mobile: '', email: '' },
    { name: '', relationship: '', mobile: '', email: '' }
  ]);

  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<boolean>(false);
  const [loading, setLoading] = useState(false);

  const handleContactChange = (index: number, field: keyof IEmergencyContact, value: string) => {
    const updated = [...contacts];
    updated[index] = { ...updated[index], [field]: value };
    setContacts(updated);
  };

  const handleAddContact = () => {
    setContacts([...contacts, { name: '', relationship: '', mobile: '', email: '' }]);
  };

  const handleRemoveContact = (index: number) => {
    if (contacts.length <= 3) {
      alert('Security regulations require a minimum of 3 emergency contacts to remain registered.');
      return;
    }
    const updated = contacts.filter((_, i) => i !== index);
    setContacts(updated);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    // Form client-side checks
    if (contacts.length < 3) {
      setError('You must configure at least 3 emergency contacts.');
      setLoading(false);
      return;
    }

    // Check that contacts are filled
    for (let i = 0; i < contacts.length; i++) {
      const c = contacts[i];
      if (!c.name || !c.relationship || !c.mobile || !c.email) {
        setError(`Please fill in all details for Emergency Contact #${i + 1}.`);
        setLoading(false);
        return;
      }
    }

    try {
      await register({
        name,
        aadhaar,
        mobile,
        email,
        dob,
        gender,
        address,
        state,
        district,
        password,
        medicalInfo: {
          bloodGroup,
          allergies,
          conditions
        },
        emergencyContacts: contacts
      });

      setSuccess(true);
      setTimeout(() => {
        router.push('/login');
      }, 1500);
    } catch (err: any) {
      setError(err.message || 'Registration failed. Check inputs and try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-slate-950 text-white flex flex-col">
      <Navbar onTriggerWomensSOS={() => {}} />

      <div className="flex-1 max-w-4xl w-full mx-auto p-4 md:py-8 flex flex-col justify-center">
        <div className="bg-slate-900 border border-slate-800 rounded-xl shadow-2xl overflow-hidden">
          
          {/* Header Panel */}
          <div className="bg-slate-900 border-b border-slate-850 p-6 flex flex-col items-center text-center">
            <Shield className="h-10 w-10 text-emerald-500 mb-2" />
            <h1 className="font-extrabold text-xl uppercase tracking-wider text-white">Citizen Emergency Registration</h1>
            <p className="text-xs text-slate-400">Establish your unified identity profile to secure real-time alerts</p>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-8">
            {error && (
              <div className="bg-red-950/60 border border-red-800 text-red-300 rounded p-4 flex items-start space-x-2 text-xs">
                <AlertCircle className="h-4 w-4 mt-0.5 shrink-0" />
                <span>{error}</span>
              </div>
            )}
            {success && (
              <div className="bg-emerald-950/60 border border-emerald-800 text-emerald-350 rounded p-4 flex items-start space-x-2 text-xs">
                <CheckCircle className="h-4 w-4 mt-0.5 shrink-0 animate-bounce" />
                <span>Registration successful! Directing to Login page...</span>
              </div>
            )}

            {/* SECTION 1: PERSONAL PROFILE */}
            <div className="space-y-4">
              <h3 className="text-sm font-extrabold text-emerald-400 uppercase tracking-wider flex items-center space-x-1.5 border-b border-slate-850 pb-2">
                <FileText className="h-4 w-4" />
                <span>1. Personal Identity Profile</span>
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">Full Name *</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter full name"
                    className="w-full bg-slate-950 border border-slate-800 rounded p-2 text-sm text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">Aadhaar Number (Optional Demo)</label>
                  <input
                    type="text"
                    value={aadhaar}
                    onChange={(e) => setAadhaar(e.target.value)}
                    placeholder="12-digit Aadhaar Number"
                    className="w-full bg-slate-950 border border-slate-800 rounded p-2 text-sm text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">Mobile Number *</label>
                  <input
                    type="tel"
                    required
                    value={mobile}
                    onChange={(e) => setMobile(e.target.value)}
                    placeholder="10-digit Mobile Number"
                    className="w-full bg-slate-950 border border-slate-800 rounded p-2 text-sm text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">Email Address *</label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="citizen@domain.com"
                    className="w-full bg-slate-950 border border-slate-800 rounded p-2 text-sm text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">Date of Birth *</label>
                  <input
                    type="date"
                    required
                    value={dob}
                    onChange={(e) => setDob(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded p-2 text-sm text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">Gender *</label>
                  <select
                    value={gender}
                    onChange={(e) => setGender(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded p-2 text-sm text-white focus:outline-none focus:border-emerald-500"
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div className="md:col-span-2">
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">Residential Address *</label>
                  <input
                    type="text"
                    required
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="House number, Street name, Locality"
                    className="w-full bg-slate-950 border border-slate-800 rounded p-2 text-sm text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">State *</label>
                  <input
                    type="text"
                    required
                    value={state}
                    onChange={(e) => setState(e.target.value)}
                    placeholder="e.g. Delhi"
                    className="w-full bg-slate-950 border border-slate-800 rounded p-2 text-sm text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">District *</label>
                  <input
                    type="text"
                    required
                    value={district}
                    onChange={(e) => setDistrict(e.target.value)}
                    placeholder="e.g. New Delhi"
                    className="w-full bg-slate-950 border border-slate-800 rounded p-2 text-sm text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">Password *</label>
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full bg-slate-950 border border-slate-800 rounded p-2 text-sm text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>
            </div>

            {/* SECTION 2: MEDICAL INFORMATION */}
            <div className="space-y-4">
              <h3 className="text-sm font-extrabold text-emerald-400 uppercase tracking-wider flex items-center space-x-1.5 border-b border-slate-850 pb-2">
                <Activity className="h-4 w-4" />
                <span>2. Emergency Medical Profile</span>
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">Blood Group</label>
                  <select
                    value={bloodGroup}
                    onChange={(e) => setBloodGroup(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded p-2 text-sm text-white focus:outline-none focus:border-emerald-500"
                  >
                    {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map((bg) => (
                      <option key={bg} value={bg}>{bg}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">Known Allergies</label>
                  <input
                    type="text"
                    value={allergies}
                    onChange={(e) => setAllergies(e.target.value)}
                    placeholder="e.g. Penicillin, Nuts"
                    className="w-full bg-slate-950 border border-slate-800 rounded p-2 text-sm text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">Chronic Conditions</label>
                  <input
                    type="text"
                    value={conditions}
                    onChange={(e) => setConditions(e.target.value)}
                    placeholder="e.g. Asthma, Diabetes"
                    className="w-full bg-slate-950 border border-slate-800 rounded p-2 text-sm text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>
            </div>

            {/* SECTION 3: EMERGENCY CONTACTS */}
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-slate-850 pb-2">
                <h3 className="text-sm font-extrabold text-emerald-400 uppercase tracking-wider flex items-center space-x-1.5">
                  <Users className="h-4 w-4" />
                  <span>3. Trusted Emergency Contacts</span>
                </h3>
                <span className="text-[10px] text-slate-405 font-bold uppercase">
                  Enforces Min 3 Contacts ({contacts.length} Configured)
                </span>
              </div>

              <div className="space-y-4">
                {contacts.map((contact, index) => (
                  <div key={index} className="bg-slate-950 p-4 border border-slate-850 rounded-lg relative">
                    <div className="flex justify-between items-center mb-3">
                      <span className="text-xs font-bold text-slate-400">Emergency Contact #{index + 1}</span>
                      {contacts.length > 3 && (
                        <button
                          type="button"
                          onClick={() => handleRemoveContact(index)}
                          className="text-red-400 hover:text-red-300 flex items-center space-x-1 text-xs"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                          <span>Remove</span>
                        </button>
                      )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                      <div>
                        <label className="block text-[9px] font-bold uppercase tracking-wider text-slate-500 mb-1">Contact Name *</label>
                        <input
                          type="text"
                          required
                          value={contact.name}
                          onChange={(e) => handleContactChange(index, 'name', e.target.value)}
                          placeholder="Full Name"
                          className="w-full bg-slate-900 border border-slate-800 rounded p-1.5 text-xs text-white focus:outline-none focus:border-emerald-500"
                        />
                      </div>
                      <div>
                        <label className="block text-[9px] font-bold uppercase tracking-wider text-slate-500 mb-1">Relationship *</label>
                        <input
                          type="text"
                          required
                          value={contact.relationship}
                          onChange={(e) => handleContactChange(index, 'relationship', e.target.value)}
                          placeholder="e.g. Spouse, Father"
                          className="w-full bg-slate-900 border border-slate-800 rounded p-1.5 text-xs text-white focus:outline-none focus:border-emerald-500"
                        />
                      </div>
                      <div>
                        <label className="block text-[9px] font-bold uppercase tracking-wider text-slate-500 mb-1">Mobile Number *</label>
                        <input
                          type="tel"
                          required
                          value={contact.mobile}
                          onChange={(e) => handleContactChange(index, 'mobile', e.target.value)}
                          placeholder="Phone Number"
                          className="w-full bg-slate-900 border border-slate-800 rounded p-1.5 text-xs text-white focus:outline-none focus:border-emerald-500"
                        />
                      </div>
                      <div>
                        <label className="block text-[9px] font-bold uppercase tracking-wider text-slate-500 mb-1">Email Address *</label>
                        <input
                          type="email"
                          required
                          value={contact.email}
                          onChange={(e) => handleContactChange(index, 'email', e.target.value)}
                          placeholder="email@domain.com"
                          className="w-full bg-slate-900 border border-slate-800 rounded p-1.5 text-xs text-white focus:outline-none focus:border-emerald-500"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <button
                type="button"
                onClick={handleAddContact}
                className="bg-slate-850 hover:bg-slate-800 text-slate-300 px-4 py-2 border border-slate-800 rounded text-xs font-bold uppercase tracking-wide flex items-center space-x-1.5"
              >
                <Plus className="h-4 w-4 text-emerald-400" />
                <span>Add Additional Contact</span>
              </button>
            </div>

            <div className="pt-6 border-t border-slate-850 flex flex-col md:flex-row items-center justify-between gap-4">
              <p className="text-xs text-slate-400 text-center md:text-left">
                Already registered?{' '}
                <Link href="/login" className="text-emerald-400 font-bold hover:underline">
                  Secure Sign In
                </Link>
              </p>
              <button
                type="submit"
                disabled={loading}
                className="w-full md:w-auto bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-3 rounded text-sm font-bold uppercase tracking-wider transition-all shadow-lg hover:shadow-emerald-950 flex items-center justify-center space-x-1.5"
              >
                {loading ? 'Creating Account Folder...' : 'Register Profile'}
              </button>
            </div>

          </form>
        </div>
      </div>
    </main>
  );
}
