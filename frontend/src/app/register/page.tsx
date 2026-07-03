'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth, IEmergencyContact } from '../../context/AuthContext';
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
    <div className="gov-section-gray min-h-screen flex flex-col justify-center py-12">
      <div className="gov-container max-w-4xl">
        <div className="bg-white border border-gray-200 rounded shadow-sm overflow-hidden border-t-4 border-t-[#0057A8]">
          
          {/* Header Panel */}
          <div className="bg-gray-50 border-b border-gray-200 p-8 flex flex-col items-center text-center">
            <Shield className="h-12 w-12 text-[#0057A8] mb-3" />
            <h1 className="font-bold text-xl uppercase tracking-wider text-[#1B2B6B]">Citizen Emergency Registration</h1>
            <p className="text-sm text-gray-600 mt-1">Establish your unified identity profile to secure real-time alerts</p>
          </div>

          <form onSubmit={handleSubmit} className="p-6 md:p-10 space-y-10">
            {error && (
              <div className="gov-notice gov-notice-danger flex items-start gap-2">
                <AlertCircle className="h-5 w-5 mt-0.5 shrink-0 text-[#CC0001]" />
                <span className="text-sm font-semibold text-[#CC0001]">{error}</span>
              </div>
            )}
            {success && (
              <div className="gov-notice flex items-start gap-2" style={{ backgroundColor: '#f0fdf4', borderColor: '#bbf7d0' }}>
                <CheckCircle className="h-5 w-5 mt-0.5 shrink-0 text-[#138808] animate-bounce" />
                <span className="text-sm font-semibold text-[#138808]">Registration successful! Directing to Login page...</span>
              </div>
            )}

            {/* SECTION 1: PERSONAL PROFILE */}
            <div className="space-y-5">
              <h3 className="text-sm font-bold text-[#1B2B6B] uppercase tracking-wider flex items-center gap-2 border-b-2 border-[#1B2B6B] pb-2 inline-flex">
                <FileText className="h-4.5 w-4.5" />
                <span>1. Personal Identity Profile</span>
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-xs font-bold uppercase text-gray-700 mb-1.5">Full Name *</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter full name"
                    className="w-full bg-white border border-gray-300 rounded p-2.5 text-sm focus:outline-none focus:border-[#0057A8] focus:ring-1 focus:ring-[#0057A8] text-gray-900"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-gray-700 mb-1.5">Aadhaar Number (Optional Demo)</label>
                  <input
                    type="text"
                    value={aadhaar}
                    onChange={(e) => setAadhaar(e.target.value)}
                    placeholder="12-digit Aadhaar Number"
                    className="w-full bg-white border border-gray-300 rounded p-2.5 text-sm focus:outline-none focus:border-[#0057A8] focus:ring-1 focus:ring-[#0057A8] text-gray-900"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-gray-700 mb-1.5">Mobile Number *</label>
                  <input
                    type="tel"
                    required
                    value={mobile}
                    onChange={(e) => setMobile(e.target.value)}
                    placeholder="10-digit Mobile Number"
                    className="w-full bg-white border border-gray-300 rounded p-2.5 text-sm focus:outline-none focus:border-[#0057A8] focus:ring-1 focus:ring-[#0057A8] text-gray-900"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-gray-700 mb-1.5">Email Address *</label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="citizen@domain.com"
                    className="w-full bg-white border border-gray-300 rounded p-2.5 text-sm focus:outline-none focus:border-[#0057A8] focus:ring-1 focus:ring-[#0057A8] text-gray-900"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-gray-700 mb-1.5">Date of Birth *</label>
                  <input
                    type="date"
                    required
                    value={dob}
                    onChange={(e) => setDob(e.target.value)}
                    className="w-full bg-white border border-gray-300 rounded p-2.5 text-sm focus:outline-none focus:border-[#0057A8] focus:ring-1 focus:ring-[#0057A8] text-gray-900"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-gray-700 mb-1.5">Gender *</label>
                  <select
                    value={gender}
                    onChange={(e) => setGender(e.target.value)}
                    className="w-full bg-white border border-gray-300 rounded p-2.5 text-sm focus:outline-none focus:border-[#0057A8] focus:ring-1 focus:ring-[#0057A8] text-gray-900"
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div className="md:col-span-2">
                  <label className="block text-xs font-bold uppercase text-gray-700 mb-1.5">Residential Address *</label>
                  <input
                    type="text"
                    required
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="House number, Street name, Locality"
                    className="w-full bg-white border border-gray-300 rounded p-2.5 text-sm focus:outline-none focus:border-[#0057A8] focus:ring-1 focus:ring-[#0057A8] text-gray-900"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-gray-700 mb-1.5">State *</label>
                  <input
                    type="text"
                    required
                    value={state}
                    onChange={(e) => setState(e.target.value)}
                    placeholder="e.g. Delhi"
                    className="w-full bg-white border border-gray-300 rounded p-2.5 text-sm focus:outline-none focus:border-[#0057A8] focus:ring-1 focus:ring-[#0057A8] text-gray-900"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-gray-700 mb-1.5">District *</label>
                  <input
                    type="text"
                    required
                    value={district}
                    onChange={(e) => setDistrict(e.target.value)}
                    placeholder="e.g. New Delhi"
                    className="w-full bg-white border border-gray-300 rounded p-2.5 text-sm focus:outline-none focus:border-[#0057A8] focus:ring-1 focus:ring-[#0057A8] text-gray-900"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-xs font-bold uppercase text-gray-700 mb-1.5">Password *</label>
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full bg-white border border-gray-300 rounded p-2.5 text-sm focus:outline-none focus:border-[#0057A8] focus:ring-1 focus:ring-[#0057A8] text-gray-900"
                  />
                </div>
              </div>
            </div>

            {/* SECTION 2: MEDICAL INFORMATION */}
            <div className="space-y-5">
              <h3 className="text-sm font-bold text-[#1B2B6B] uppercase tracking-wider flex items-center gap-2 border-b-2 border-[#1B2B6B] pb-2 inline-flex">
                <Activity className="h-4.5 w-4.5 text-[#CC0001]" />
                <span>2. Emergency Medical Profile</span>
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                <div>
                  <label className="block text-xs font-bold uppercase text-gray-700 mb-1.5">Blood Group</label>
                  <select
                    value={bloodGroup}
                    onChange={(e) => setBloodGroup(e.target.value)}
                    className="w-full bg-white border border-gray-300 rounded p-2.5 text-sm focus:outline-none focus:border-[#0057A8] focus:ring-1 focus:ring-[#0057A8] text-gray-900"
                  >
                    {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map((bg) => (
                      <option key={bg} value={bg}>{bg}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-gray-700 mb-1.5">Known Allergies</label>
                  <input
                    type="text"
                    value={allergies}
                    onChange={(e) => setAllergies(e.target.value)}
                    placeholder="e.g. Penicillin, Nuts"
                    className="w-full bg-white border border-gray-300 rounded p-2.5 text-sm focus:outline-none focus:border-[#0057A8] focus:ring-1 focus:ring-[#0057A8] text-gray-900"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-gray-700 mb-1.5">Chronic Conditions</label>
                  <input
                    type="text"
                    value={conditions}
                    onChange={(e) => setConditions(e.target.value)}
                    placeholder="e.g. Asthma, Diabetes"
                    className="w-full bg-white border border-gray-300 rounded p-2.5 text-sm focus:outline-none focus:border-[#0057A8] focus:ring-1 focus:ring-[#0057A8] text-gray-900"
                  />
                </div>
              </div>
            </div>

            {/* SECTION 3: EMERGENCY CONTACTS */}
            <div className="space-y-5">
              <div className="flex flex-col sm:flex-row sm:items-end justify-between border-b-2 border-[#1B2B6B] pb-2 gap-2">
                <h3 className="text-sm font-bold text-[#1B2B6B] uppercase tracking-wider flex items-center gap-2">
                  <Users className="h-4.5 w-4.5 text-[#0057A8]" />
                  <span>3. Trusted Emergency Contacts</span>
                </h3>
                <span className="text-[10px] text-gray-500 font-bold uppercase">
                  Enforces Min 3 Contacts ({contacts.length} Configured)
                </span>
              </div>

              <div className="space-y-4">
                {contacts.map((contact, index) => (
                  <div key={index} className="bg-gray-50 p-5 border border-gray-200 rounded relative">
                    <div className="flex justify-between items-center mb-4">
                      <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Emergency Contact #{index + 1}</span>
                      {contacts.length > 3 && (
                        <button
                          type="button"
                          onClick={() => handleRemoveContact(index)}
                          className="text-[#CC0001] hover:underline flex items-center gap-1 text-xs font-bold"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                          <span>Remove</span>
                        </button>
                      )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                      <div>
                        <label className="block text-[10px] font-bold uppercase text-gray-600 mb-1.5">Contact Name *</label>
                        <input
                          type="text"
                          required
                          value={contact.name}
                          onChange={(e) => handleContactChange(index, 'name', e.target.value)}
                          placeholder="Full Name"
                          className="w-full bg-white border border-gray-300 rounded p-2 text-sm focus:outline-none focus:border-[#0057A8] text-gray-900"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold uppercase text-gray-600 mb-1.5">Relationship *</label>
                        <input
                          type="text"
                          required
                          value={contact.relationship}
                          onChange={(e) => handleContactChange(index, 'relationship', e.target.value)}
                          placeholder="e.g. Spouse, Father"
                          className="w-full bg-white border border-gray-300 rounded p-2 text-sm focus:outline-none focus:border-[#0057A8] text-gray-900"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold uppercase text-gray-600 mb-1.5">Mobile Number *</label>
                        <input
                          type="tel"
                          required
                          value={contact.mobile}
                          onChange={(e) => handleContactChange(index, 'mobile', e.target.value)}
                          placeholder="Phone Number"
                          className="w-full bg-white border border-gray-300 rounded p-2 text-sm focus:outline-none focus:border-[#0057A8] text-gray-900"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold uppercase text-gray-600 mb-1.5">Email Address *</label>
                        <input
                          type="email"
                          required
                          value={contact.email}
                          onChange={(e) => handleContactChange(index, 'email', e.target.value)}
                          placeholder="email@domain.com"
                          className="w-full bg-white border border-gray-300 rounded p-2 text-sm focus:outline-none focus:border-[#0057A8] text-gray-900"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <button
                type="button"
                onClick={handleAddContact}
                className="gov-btn-outline py-2 px-4"
              >
                <Plus className="h-4 w-4" />
                <span>Add Additional Contact</span>
              </button>
            </div>

            <div className="pt-8 border-t border-gray-200 flex flex-col md:flex-row items-center justify-between gap-6">
              <p className="text-sm text-gray-600 text-center md:text-left">
                Already registered?{' '}
                <Link href="/login" className="text-[#0057A8] font-bold hover:underline hover:text-[#004080]">
                  Secure Sign In
                </Link>
              </p>
              <button
                type="submit"
                disabled={loading}
                className="gov-btn-primary w-full md:w-auto px-8 py-3.5"
              >
                {loading ? 'Creating Account Folder...' : 'Register Profile'}
              </button>
            </div>

          </form>
        </div>
      </div>
    </div>
  );
}
