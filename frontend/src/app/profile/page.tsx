'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Plus, Trash2, Save, User as UserIcon, Heart, Phone } from 'lucide-react';

export default function ProfilePage() {
  const { user } = useAuth();
  const [medicalInfo, setMedicalInfo] = useState({
    bloodGroup: '',
    allergies: '',
    conditions: ''
  });
  const [contacts, setContacts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (user && user.id) {
      setMedicalInfo(user.medicalInfo || { bloodGroup: '', allergies: '', conditions: '' });
      setContacts(user.emergencyContacts || []);
      setLoading(false);
    }
  }, [user]);

  const handleAddContact = () => {
    setContacts([...contacts, { name: '', relationship: '', mobile: '', email: '' }]);
  };

  const handleContactChange = (index: number, field: string, value: string) => {
    const updated = [...contacts];
    updated[index][field] = value;
    setContacts(updated);
  };

  const handleRemoveContact = (index: number) => {
    setContacts(contacts.filter((_, i) => i !== index));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const token = localStorage.getItem('gov_token');
      const res = await fetch('http://localhost:5000/api/auth/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ medicalInfo, emergencyContacts: contacts })
      });
      if (res.ok) {
        alert('Profile saved successfully!');
      } else {
        alert('Failed to save profile.');
      }
    } catch (e) {
      alert('Network error.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="p-8 text-center">Loading Profile...</div>;
  if (!user || user.id === 'admin-id') return <div className="p-8 text-center text-red-600 font-bold">Please login as a Citizen to view this page.</div>;

  return (
    <div className="max-w-4xl mx-auto p-4 md:p-8">
      <h1 className="text-3xl font-bold text-[#1B2B6B] mb-8 flex items-center gap-3">
        <UserIcon className="w-8 h-8 text-red-600" />
        Emergency Profile & Contacts
      </h1>

      <div className="bg-white rounded-xl shadow-md p-6 mb-8 border border-gray-100">
        <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2 mb-6 border-b pb-3">
          <Heart className="w-5 h-5 text-red-500" />
          Medical Information
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Blood Group</label>
            <select
              value={medicalInfo.bloodGroup}
              onChange={(e) => setMedicalInfo({ ...medicalInfo, bloodGroup: e.target.value })}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0057A8]"
            >
              <option value="">Select</option>
              {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map(bg => <option key={bg} value={bg}>{bg}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Allergies</label>
            <input
              type="text"
              value={medicalInfo.allergies}
              onChange={(e) => setMedicalInfo({ ...medicalInfo, allergies: e.target.value })}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0057A8]"
              placeholder="E.g., Peanuts, Penicillin"
            />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">Pre-existing Medical Conditions</label>
            <textarea
              value={medicalInfo.conditions}
              onChange={(e) => setMedicalInfo({ ...medicalInfo, conditions: e.target.value })}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0057A8]"
              placeholder="E.g., Asthma, Diabetes"
              rows={3}
            />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-md p-6 mb-8 border border-gray-100">
        <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2 mb-6 border-b pb-3">
          <Phone className="w-5 h-5 text-green-500" />
          Family Emergency Contacts
        </h2>
        <p className="text-gray-500 mb-6 text-sm">Add your family members here. They will receive SMS, WhatsApp, and live location links if you trigger an SOS.</p>
        
        {contacts.map((contact, index) => (
          <div key={index} className="bg-gray-50 p-4 rounded-lg mb-4 border border-gray-200 relative">
            <button onClick={() => handleRemoveContact(index)} className="absolute top-4 right-4 text-red-500 hover:text-red-700">
              <Trash2 className="w-5 h-5" />
            </button>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Name</label>
                <input type="text" value={contact.name} onChange={(e) => handleContactChange(index, 'name', e.target.value)} className="w-full p-2 border border-gray-300 rounded focus:ring-1 focus:ring-[#0057A8]" />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Relationship</label>
                <select value={contact.relationship} onChange={(e) => handleContactChange(index, 'relationship', e.target.value)} className="w-full p-2 border border-gray-300 rounded focus:ring-1 focus:ring-[#0057A8]">
                  <option value="">Select</option>
                  <option value="Father">Father</option>
                  <option value="Mother">Mother</option>
                  <option value="Brother">Brother</option>
                  <option value="Sister">Sister</option>
                  <option value="Spouse">Spouse</option>
                  <option value="Friend">Friend</option>
                  <option value="Guardian">Guardian</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Mobile Number</label>
                <input type="text" value={contact.mobile} onChange={(e) => handleContactChange(index, 'mobile', e.target.value)} className="w-full p-2 border border-gray-300 rounded focus:ring-1 focus:ring-[#0057A8]" />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Email (Optional)</label>
                <input type="email" value={contact.email} onChange={(e) => handleContactChange(index, 'email', e.target.value)} className="w-full p-2 border border-gray-300 rounded focus:ring-1 focus:ring-[#0057A8]" />
              </div>
            </div>
          </div>
        ))}
        
        <button onClick={handleAddContact} className="mt-2 text-[#0057A8] font-semibold flex items-center gap-1 hover:underline">
          <Plus className="w-4 h-4" /> Add Another Contact
        </button>
      </div>

      <div className="flex justify-end">
        <button
          onClick={handleSave}
          disabled={saving}
          className="bg-[#0057A8] text-white px-8 py-3 rounded-lg font-bold flex items-center gap-2 hover:bg-[#1B2B6B] transition-colors disabled:opacity-50"
        >
          {saving ? <span className="animate-spin text-xl">⏳</span> : <Save className="w-5 h-5" />}
          {saving ? 'Saving...' : 'Save Profile'}
        </button>
      </div>
    </div>
  );
}
