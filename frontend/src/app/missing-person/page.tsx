'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Navbar } from '../../components/Navbar';
import { FloatingBot } from '../../components/FloatingBot';
import {
  Users,
  Plus,
  FileImage,
  Loader2,
  Printer,
  Download,
  Phone,
  MapPin,
  Calendar,
  AlertTriangle,
  Info,
  X
} from 'lucide-react';

interface MissingPersonCase {
  _id: string;
  name: string;
  age: number;
  gender: string;
  dateMissing: string;
  lastSeenLocation: string;
  photoUrl?: string;
  description?: string;
  contactNumber: string;
  status: 'missing' | 'found';
}

export default function MissingPersonPage() {
  const [cases, setCases] = useState<MissingPersonCase[]>([]);
  const [loading, setLoading] = useState(true);
  const [formOpen, setFormOpen] = useState(false);

  // Form Fields
  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [gender, setGender] = useState('Male');
  const [dateMissing, setDateMissing] = useState('');
  const [lastSeenLocation, setLastSeenLocation] = useState('');
  const [contactNumber, setContactNumber] = useState('');
  const [description, setDescription] = useState('');
  const [photo, setPhoto] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [formLoading, setFormLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Selected case for poster generation
  const [selectedPosterCase, setSelectedPosterCase] = useState<MissingPersonCase | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const fetchCases = async () => {
    setLoading(true);
    try {
      const response = await fetch('http://localhost:5000/api/missing-person/list');
      const data = await response.json();
      if (response.ok) {
        setCases(data);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCases();
  }, []);

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setPhoto(file);
      setPhotoPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmitReport = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setFormLoading(true);

    const formData = new FormData();
    formData.append('name', name);
    formData.append('age', age);
    formData.append('gender', gender);
    formData.append('dateMissing', dateMissing);
    formData.append('lastSeenLocation', lastSeenLocation);
    formData.append('contactNumber', contactNumber);
    formData.append('description', description);
    if (photo) formData.append('photo', photo);

    try {
      const response = await fetch('http://localhost:5000/api/missing-person/report', {
        method: 'POST',
        body: formData
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || 'Failed to submit report');
      }

      setFormOpen(false);
      resetForm();
      fetchCases();
      alert('Missing person case successfully registered in search files.');
    } catch (err: any) {
      setError(err.message || 'An error occurred during submission.');
    } finally {
      setFormLoading(false);
    }
  };

  const resetForm = () => {
    setName('');
    setAge('');
    setGender('Male');
    setDateMissing('');
    setLastSeenLocation('');
    setContactNumber('');
    setDescription('');
    setPhoto(null);
    setPhotoPreview(null);
  };

  // Draw Poster onto Canvas dynamically for download
  const drawPoster = (person: MissingPersonCase) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set dimensions
    canvas.width = 600;
    canvas.height = 800;

    // 1. Draw Red alert Border background
    ctx.fillStyle = '#dc2626'; // Emergency Red
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = '#ffffff'; // White inner panel
    ctx.fillRect(15, 15, canvas.width - 30, canvas.height - 30);

    // 2. Headline
    ctx.fillStyle = '#dc2626';
    ctx.font = '900 48px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('MISSING', canvas.width / 2, 75);

    // Sub-title
    ctx.fillStyle = '#0f172a';
    ctx.font = 'bold 16px sans-serif';
    ctx.fillText('IF YOU HAVE ANY INFORMATION PLEASE CALL IMMEDIATELY', canvas.width / 2, 105);

    // 3. Draw Photo Box or placeholder
    const drawDetailsAndContacts = () => {
      // Draw details list box
      ctx.fillStyle = '#f8fafc';
      ctx.fillRect(35, 470, canvas.width - 70, 180);
      ctx.strokeStyle = '#cbd5e1';
      ctx.strokeRect(35, 470, canvas.width - 70, 180);

      // Render Text fields
      ctx.fillStyle = '#0f172a';
      ctx.textAlign = 'left';
      ctx.font = 'bold 20px sans-serif';
      ctx.fillText(`NAME: ${person.name.toUpperCase()}`, 55, 505);

      ctx.font = '15px sans-serif';
      ctx.fillText(`AGE / GENDER: ${person.age} Years old / ${person.gender}`, 55, 535);
      ctx.fillText(`DATE MISSING: ${new Date(person.dateMissing).toLocaleDateString()}`, 55, 565);
      ctx.fillText(`LAST SEEN AT: ${person.lastSeenLocation}`, 55, 595);
      
      // Trim description if long
      const desc = person.description || 'No specific marks detailed.';
      const cleanDesc = desc.length > 50 ? `${desc.slice(0, 50)}...` : desc;
      ctx.fillText(`DETAILS: ${cleanDesc}`, 55, 625);

      // 4. Emergency call box
      ctx.fillStyle = '#dc2626';
      ctx.fillRect(35, 670, canvas.width - 70, 90);

      ctx.fillStyle = '#ffffff';
      ctx.textAlign = 'center';
      ctx.font = 'bold 22px sans-serif';
      ctx.fillText('🚨 CALL CONTACT HELPLINE 🚨', canvas.width / 2, 705);
      ctx.font = '900 26px sans-serif';
      ctx.fillText(person.contactNumber, canvas.width / 2, 742);
    };

    if (person.photoUrl) {
      const img = new Image();
      // Allow cross origin for local node server static uploads
      img.crossOrigin = 'anonymous';
      img.src = `http://localhost:5000${person.photoUrl}`;
      img.onload = () => {
        // Draw photo centered
        ctx.drawImage(img, 150, 135, 300, 310);
        ctx.strokeStyle = '#0f172a';
        ctx.lineWidth = 3;
        ctx.strokeRect(150, 135, 300, 310);
        drawDetailsAndContacts();
      };
      img.onerror = () => {
        // Fallback standard text box if image fails
        ctx.fillStyle = '#f1f5f9';
        ctx.fillRect(150, 135, 300, 310);
        ctx.fillStyle = '#475569';
        ctx.font = '14px sans-serif';
        ctx.fillText('NO PHOTOGRAPH REPORTED', canvas.width / 2, 290);
        drawDetailsAndContacts();
      };
    } else {
      ctx.fillStyle = '#f1f5f9';
      ctx.fillRect(150, 135, 300, 310);
      ctx.fillStyle = '#475569';
      ctx.font = '14px sans-serif';
      ctx.fillText('NO PHOTOGRAPH REPORTED', canvas.width / 2, 290);
      drawDetailsAndContacts();
    }
  };

  const handleOpenPosterModal = (person: MissingPersonCase) => {
    setSelectedPosterCase(person);
    // Let DOM update and draw
    setTimeout(() => {
      drawPoster(person);
    }, 100);
  };

  const downloadPoster = () => {
    const canvas = canvasRef.current;
    if (!canvas || !selectedPosterCase) return;

    const dataUrl = canvas.toDataURL('image/png');
    const link = document.createElement('a');
    link.download = `MISSING_POSTER_${selectedPosterCase.name.replace(/\s+/g, '_')}.png`;
    link.href = dataUrl;
    link.click();
  };

  return (
    <main className="min-h-screen bg-slate-950 text-white flex flex-col">
      <Navbar onTriggerWomensSOS={() => {}} />

      <div className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        
        {/* Banner Title */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-slate-850 pb-6">
          <div>
            <h1 className="font-extrabold text-2xl sm:text-3xl uppercase tracking-wider text-white flex items-center space-x-2">
              <Users className="h-7 w-7 text-emerald-400" />
              <span>Civil Missing Person Assistant</span>
            </h1>
            <p className="text-xs text-slate-405 mt-1">
              Create official missing person alerts, generate printable search posters instantly, and link case files.
            </p>
          </div>

          <button
            onClick={() => setFormOpen(true)}
            className="bg-emerald-600 hover:bg-emerald-750 text-white px-4 py-2.5 rounded-lg text-xs font-black uppercase tracking-wider flex items-center space-x-1.5 shadow-lg"
          >
            <Plus className="h-4.5 w-4.5" />
            <span>File Missing Report</span>
          </button>
        </div>

        {/* Dynamic creation form overlay */}
        {formOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-sm overflow-y-auto">
            <div className="bg-slate-900 border border-slate-800 rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              
              <div className="bg-slate-950 px-6 py-4 flex items-center justify-between border-b border-slate-850">
                <span className="font-extrabold text-xs uppercase tracking-wider text-white">New Missing Case File</span>
                <button onClick={() => setFormOpen(false)} className="text-slate-450 hover:text-white">
                  <X className="h-5 w-5" />
                </button>
              </div>

              <form onSubmit={handleSubmitReport} className="p-6 space-y-6">
                {error && <p className="text-red-400 text-xs">{error}</p>}
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">Full Name *</label>
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Enter name"
                      className="w-full bg-slate-950 border border-slate-800 rounded p-2 text-sm text-white focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">Age (Years) *</label>
                    <input
                      type="number"
                      required
                      value={age}
                      onChange={(e) => setAge(e.target.value)}
                      placeholder="e.g. 24"
                      className="w-full bg-slate-950 border border-slate-800 rounded p-2 text-sm text-white focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">Gender *</label>
                    <select
                      value={gender}
                      onChange={(e) => setGender(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded p-2 text-sm text-white focus:outline-none"
                    >
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">Date Missing *</label>
                    <input
                      type="date"
                      required
                      value={dateMissing}
                      onChange={(e) => setDateMissing(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded p-2 text-sm text-white focus:outline-none"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">Last Seen Location *</label>
                    <input
                      type="text"
                      required
                      value={lastSeenLocation}
                      onChange={(e) => setLastSeenLocation(e.target.value)}
                      placeholder="Specify street, city, landmark"
                      className="w-full bg-slate-950 border border-slate-800 rounded p-2 text-sm text-white focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">Contact Number for Alerts *</label>
                    <input
                      type="tel"
                      required
                      value={contactNumber}
                      onChange={(e) => setContactNumber(e.target.value)}
                      placeholder="Emergency contact phone"
                      className="w-full bg-slate-950 border border-slate-800 rounded p-2 text-sm text-white focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">Photograph *</label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handlePhotoChange}
                      className="w-full text-xs text-slate-400 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-slate-800 file:text-white hover:file:bg-slate-700 cursor-pointer"
                    />
                    {photoPreview && (
                      <img src={photoPreview} className="h-16 mt-2 rounded border border-slate-850" alt="Preview" />
                    )}
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">Physical Marks / Description</label>
                    <textarea
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      placeholder="Height, birthmarks, color of clothes worn..."
                      rows={3}
                      className="w-full bg-slate-950 border border-slate-800 rounded p-2 text-sm text-white focus:outline-none"
                    />
                  </div>
                </div>

                <div className="flex space-x-3 pt-4 border-t border-slate-850">
                  <button
                    type="button"
                    onClick={() => setFormOpen(false)}
                    className="flex-1 bg-slate-850 text-slate-350 py-3 rounded-lg text-xs font-bold"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={formLoading}
                    className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white py-3 rounded-lg text-xs font-bold flex items-center justify-center space-x-1.5"
                  >
                    {formLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <span>File Incident Case</span>}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Main layout search cards */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 text-slate-500 space-y-2">
            <Loader2 className="h-8 w-8 animate-spin text-emerald-400" />
            <span className="text-xs">Loading civilian registry...</span>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {cases.map((person) => (
              <div key={person._id} className="bg-slate-900 border border-slate-850 rounded-xl overflow-hidden shadow-xl flex flex-col justify-between">
                <div>
                  {/* Photo area */}
                  <div className="h-[220px] bg-slate-950 relative overflow-hidden flex items-center justify-center border-b border-slate-850">
                    {person.photoUrl ? (
                      <img
                        src={`http://localhost:5000${person.photoUrl}`}
                        className="w-full h-full object-cover"
                        alt={person.name}
                      />
                    ) : (
                      <FileImage className="h-12 w-12 text-slate-700" />
                    )}
                    <span className="absolute top-3 left-3 bg-red-650 text-white font-extrabold text-[8px] uppercase px-2 py-0.5 rounded shadow animate-pulse">
                      ACTIVE MISSING FILE
                    </span>
                  </div>

                  {/* Description metadata */}
                  <div className="p-4 space-y-3">
                    <div>
                      <h3 className="font-extrabold text-sm text-white uppercase tracking-wide truncate">{person.name}</h3>
                      <p className="text-[10px] text-slate-455">Age: {person.age} | Gender: {person.gender}</p>
                    </div>

                    <div className="text-[10px] text-slate-350 space-y-1 leading-relaxed">
                      <p className="flex items-center space-x-1.5">
                        <MapPin className="h-3.5 w-3.5 text-slate-500 shrink-0" />
                        <span className="truncate">Last Seen: {person.lastSeenLocation}</span>
                      </p>
                      <p className="flex items-center space-x-1.5">
                        <Calendar className="h-3.5 w-3.5 text-slate-500 shrink-0" />
                        <span>Date: {new Date(person.dateMissing).toLocaleDateString()}</span>
                      </p>
                    </div>
                  </div>
                </div>

                <div className="p-4 pt-0">
                  <button
                    onClick={() => handleOpenPosterModal(person)}
                    className="w-full bg-slate-950 hover:bg-slate-800 text-emerald-400 border border-emerald-500/20 py-2 rounded text-xs font-bold uppercase tracking-wider flex items-center justify-center space-x-1 transition-colors"
                  >
                    <Printer className="h-3.5 w-3.5" />
                    <span>Compile Poster</span>
                  </button>
                </div>
              </div>
            ))}
            {cases.length === 0 && (
              <div className="col-span-full bg-slate-900 border border-slate-850 p-12 rounded-xl text-center text-slate-500">
                No active missing person reports currently registered.
              </div>
            )}
          </div>
        )}

        {/* Selected poster generation modal overlay */}
        {selectedPosterCase && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm overflow-y-auto">
            <div className="bg-slate-900 border border-slate-800 rounded-xl shadow-2xl p-6 max-w-2xl w-full flex flex-col md:flex-row gap-6 relative">
              
              <button
                onClick={() => setSelectedPosterCase(null)}
                className="absolute top-4 right-4 text-slate-400 hover:text-white"
              >
                <X className="h-5 w-5" />
              </button>

              {/* Canvas builder container */}
              <div className="flex-1 bg-slate-950 border border-slate-850 p-2 rounded flex justify-center items-center">
                <canvas ref={canvasRef} className="max-w-full h-auto max-h-[500px] bg-white rounded border border-slate-800" />
              </div>

              {/* Action tools */}
              <div className="md:w-60 flex flex-col justify-between py-4">
                <div className="space-y-4">
                  <h3 className="font-extrabold text-sm text-white uppercase tracking-wider">Alert Poster Canvas</h3>
                  <p className="text-[10px] text-slate-400 leading-relaxed">
                    This high-contrast red "MISSING" poster is formatted using HTML canvas drawing contexts. Download as high resolution image or print on paper.
                  </p>

                  <div className="bg-slate-950 border border-slate-850 p-3 rounded text-[10px] leading-relaxed text-slate-450">
                    <span className="font-bold text-white uppercase block mb-1">PROMOTION DISPATCH</span>
                    You can print the generated poster directly. Distributed posters include verified timestamps and contact channels.
                  </div>
                </div>

                <div className="space-y-2 mt-6 md:mt-0">
                  <button
                    onClick={downloadPoster}
                    className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-2.5 rounded text-xs font-bold uppercase tracking-wider flex items-center justify-center space-x-1.5 shadow"
                  >
                    <Download className="h-4 w-4" />
                    <span>Download Image</span>
                  </button>
                  <button
                    onClick={() => window.print()}
                    className="w-full bg-slate-850 hover:bg-slate-800 text-slate-300 py-2.5 rounded text-xs font-bold uppercase tracking-wider flex items-center justify-center space-x-1.5 border border-slate-800"
                  >
                    <Printer className="h-4 w-4" />
                    <span>Print Poster</span>
                  </button>
                </div>
              </div>

            </div>
          </div>
        )}

      </div>
      <FloatingBot />
    </main>
  );
}
