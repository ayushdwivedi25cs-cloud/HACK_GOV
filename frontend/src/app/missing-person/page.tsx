'use client';

import React, { useState, useEffect, useRef } from 'react';
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
      alert('Missing person case successfully registered in central records.');
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
    ctx.fillStyle = '#CC0001'; // Emergency Red
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = '#ffffff'; // White inner panel
    ctx.fillRect(15, 15, canvas.width - 30, canvas.height - 30);

    // 2. Headline
    ctx.fillStyle = '#CC0001';
    ctx.font = '900 52px "Arial Black", sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('MISSING PERSON', canvas.width / 2, 75);

    // Sub-title
    ctx.fillStyle = '#0f172a';
    ctx.font = 'bold 16px Arial, sans-serif';
    ctx.fillText('IF YOU HAVE ANY INFORMATION PLEASE CALL IMMEDIATELY', canvas.width / 2, 105);

    // 3. Draw Photo Box or placeholder
    const drawDetailsAndContacts = () => {
      // Draw details list box
      ctx.fillStyle = '#f8fafc';
      ctx.fillRect(35, 470, canvas.width - 70, 180);
      ctx.strokeStyle = '#cbd5e1';
      ctx.lineWidth = 2;
      ctx.strokeRect(35, 470, canvas.width - 70, 180);

      // Render Text fields
      ctx.fillStyle = '#1B2B6B';
      ctx.textAlign = 'left';
      ctx.font = 'bold 22px Arial, sans-serif';
      ctx.fillText(`NAME: ${person.name.toUpperCase()}`, 55, 505);

      ctx.fillStyle = '#0f172a';
      ctx.font = 'bold 16px Arial, sans-serif';
      ctx.fillText(`AGE / GENDER: ${person.age} Years old / ${person.gender}`, 55, 535);
      ctx.fillText(`DATE MISSING: ${new Date(person.dateMissing).toLocaleDateString()}`, 55, 565);
      ctx.fillText(`LAST SEEN AT: ${person.lastSeenLocation}`, 55, 595);
      
      // Trim description if long
      const desc = person.description || 'No specific marks detailed.';
      const cleanDesc = desc.length > 50 ? `${desc.slice(0, 50)}...` : desc;
      ctx.fillText(`DETAILS: ${cleanDesc}`, 55, 625);

      // 4. Emergency call box
      ctx.fillStyle = '#CC0001';
      ctx.fillRect(35, 670, canvas.width - 70, 90);

      ctx.fillStyle = '#ffffff';
      ctx.textAlign = 'center';
      ctx.font = 'bold 22px Arial, sans-serif';
      ctx.fillText('🚨 CALL OFFICIAL HELPLINE 🚨', canvas.width / 2, 705);
      ctx.font = '900 28px Arial, sans-serif';
      ctx.fillText(person.contactNumber, canvas.width / 2, 745);
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
        ctx.lineWidth = 4;
        ctx.strokeRect(150, 135, 300, 310);
        drawDetailsAndContacts();
      };
      img.onerror = () => {
        // Fallback standard text box if image fails
        ctx.fillStyle = '#f1f5f9';
        ctx.fillRect(150, 135, 300, 310);
        ctx.fillStyle = '#475569';
        ctx.font = '14px Arial, sans-serif';
        ctx.fillText('NO PHOTOGRAPH REPORTED', canvas.width / 2, 290);
        drawDetailsAndContacts();
      };
    } else {
      ctx.fillStyle = '#f1f5f9';
      ctx.fillRect(150, 135, 300, 310);
      ctx.fillStyle = '#475569';
      ctx.font = '14px Arial, sans-serif';
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
    <div className="gov-section-gray min-h-screen">
      <div className="gov-container flex flex-col justify-center py-8">
        
        {/* Banner Title */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-gray-200 pb-6 mb-8">
          <div>
            <h1 className="gov-section-title flex items-center gap-2 mb-2">
              <Users className="h-7 w-7 text-[#0057A8]" />
              Civil Missing Person Registry
            </h1>
            <p className="gov-section-subtitle mb-0">
              Create official missing person alerts, generate printable search posters instantly, and link case files across the national grid.
            </p>
          </div>

          <button
            onClick={() => setFormOpen(true)}
            className="gov-btn-primary shrink-0 py-2.5"
          >
            <Plus className="h-4 w-4" />
            <span>File Missing Report</span>
          </button>
        </div>

        {/* Dynamic creation form overlay */}
        {formOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-gray-900/60 backdrop-blur-sm overflow-y-auto">
            <div className="bg-white border border-gray-200 rounded shadow-2xl max-w-2xl w-full max-h-[90vh] flex flex-col">
              
              <div className="bg-gray-50 px-6 py-4 flex items-center justify-between border-b border-gray-200 rounded-t">
                <span className="font-bold text-sm uppercase tracking-wider text-[#1B2B6B]">Official Missing Person Report</span>
                <button onClick={() => setFormOpen(false)} className="text-gray-500 hover:text-[#CC0001] transition-colors p-1">
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="overflow-y-auto p-6">
                <form onSubmit={handleSubmitReport} className="space-y-6">
                  {error && (
                    <div className="gov-notice gov-notice-danger flex items-start gap-2 mb-4">
                      <AlertTriangle className="h-4.5 w-4.5 mt-0.5 shrink-0 text-[#CC0001]" />
                      <span className="text-sm font-semibold text-[#CC0001]">{error}</span>
                    </div>
                  )}
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-xs font-bold uppercase text-gray-700 mb-1">Full Name *</label>
                      <input
                        type="text"
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Enter full legal name"
                        className="w-full bg-white border border-gray-300 rounded p-2.5 text-sm text-gray-900 focus:outline-none focus:border-[#0057A8]"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase text-gray-700 mb-1">Age (Years) *</label>
                      <input
                        type="number"
                        required
                        value={age}
                        onChange={(e) => setAge(e.target.value)}
                        placeholder="e.g. 24"
                        className="w-full bg-white border border-gray-300 rounded p-2.5 text-sm text-gray-900 focus:outline-none focus:border-[#0057A8]"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase text-gray-700 mb-1">Gender *</label>
                      <select
                        value={gender}
                        onChange={(e) => setGender(e.target.value)}
                        className="w-full bg-white border border-gray-300 rounded p-2.5 text-sm text-gray-900 focus:outline-none focus:border-[#0057A8]"
                      >
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase text-gray-700 mb-1">Date Missing *</label>
                      <input
                        type="date"
                        required
                        value={dateMissing}
                        onChange={(e) => setDateMissing(e.target.value)}
                        className="w-full bg-white border border-gray-300 rounded p-2.5 text-sm text-gray-900 focus:outline-none focus:border-[#0057A8]"
                      />
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-xs font-bold uppercase text-gray-700 mb-1">Last Seen Location *</label>
                      <input
                        type="text"
                        required
                        value={lastSeenLocation}
                        onChange={(e) => setLastSeenLocation(e.target.value)}
                        placeholder="Specify street, city, landmark or jurisdiction"
                        className="w-full bg-white border border-gray-300 rounded p-2.5 text-sm text-gray-900 focus:outline-none focus:border-[#0057A8]"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase text-gray-700 mb-1">Contact Helpling *</label>
                      <input
                        type="tel"
                        required
                        value={contactNumber}
                        onChange={(e) => setContactNumber(e.target.value)}
                        placeholder="Official/Family contact number"
                        className="w-full bg-white border border-gray-300 rounded p-2.5 text-sm text-gray-900 focus:outline-none focus:border-[#0057A8]"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase text-gray-700 mb-1">Photograph *</label>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handlePhotoChange}
                        className="w-full text-xs text-gray-600 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-xs file:font-bold file:bg-gray-200 file:text-gray-800 hover:file:bg-gray-300 cursor-pointer"
                      />
                      {photoPreview && (
                        <img src={photoPreview} className="h-20 mt-2 rounded border border-gray-300 object-cover" alt="Preview" />
                      )}
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-xs font-bold uppercase text-gray-700 mb-1">Physical Marks / Description</label>
                      <textarea
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder="Height, birthmarks, color of clothes worn..."
                        rows={3}
                        className="w-full bg-white border border-gray-300 rounded p-2.5 text-sm text-gray-900 focus:outline-none focus:border-[#0057A8]"
                      />
                    </div>
                  </div>

                  <div className="flex gap-3 pt-6 border-t border-gray-200">
                    <button
                      type="button"
                      onClick={() => setFormOpen(false)}
                      className="gov-btn-outline flex-1 justify-center py-2.5"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={formLoading}
                      className="gov-btn-primary flex-1 justify-center py-2.5"
                    >
                      {formLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <span>File Incident Case</span>}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}

        {/* Main layout search cards */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 text-gray-500 space-y-3">
            <Loader2 className="h-10 w-10 animate-spin text-[#0057A8]" />
            <span className="text-sm font-bold uppercase tracking-wider">Loading Civilian Registry...</span>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {cases.map((person) => (
              <div key={person._id} className="bg-white border border-gray-200 rounded shadow-sm overflow-hidden flex flex-col justify-between hover:shadow-md transition-shadow">
                <div>
                  {/* Photo area */}
                  <div className="h-[240px] bg-gray-100 relative overflow-hidden flex items-center justify-center border-b border-gray-200">
                    {person.photoUrl ? (
                      <img
                        src={`http://localhost:5000${person.photoUrl}`}
                        className="w-full h-full object-cover"
                        alt={person.name}
                      />
                    ) : (
                      <FileImage className="h-12 w-12 text-gray-400" />
                    )}
                    <span className="absolute top-3 left-3 bg-[#CC0001] text-white font-black text-[9px] uppercase tracking-wider px-2.5 py-1 rounded shadow animate-pulse">
                      ACTIVE MISSING FILE
                    </span>
                  </div>

                  {/* Description metadata */}
                  <div className="p-4 space-y-3">
                    <div className="border-b border-gray-100 pb-2">
                      <h3 className="font-bold text-sm text-[#1B2B6B] uppercase tracking-wide truncate" title={person.name}>{person.name}</h3>
                      <p className="text-[11px] text-gray-500 font-medium">Age: {person.age} | Gender: {person.gender}</p>
                    </div>

                    <div className="text-[11px] text-gray-600 space-y-1.5 leading-relaxed font-medium">
                      <p className="flex items-start gap-1.5">
                        <MapPin className="h-3.5 w-3.5 text-gray-400 shrink-0 mt-0.5" />
                        <span className="line-clamp-2">Last Seen: {person.lastSeenLocation}</span>
                      </p>
                      <p className="flex items-center gap-1.5">
                        <Calendar className="h-3.5 w-3.5 text-gray-400 shrink-0" />
                        <span>Date: {new Date(person.dateMissing).toLocaleDateString()}</span>
                      </p>
                    </div>
                  </div>
                </div>

                <div className="p-4 pt-2 border-t border-gray-100 bg-gray-50">
                  <button
                    onClick={() => handleOpenPosterModal(person)}
                    className="w-full bg-white border border-gray-300 hover:border-[#0057A8] hover:text-[#0057A8] text-gray-700 py-2 rounded text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 transition-colors shadow-sm"
                  >
                    <Printer className="h-3.5 w-3.5" />
                    <span>Compile Poster</span>
                  </button>
                </div>
              </div>
            ))}
            {cases.length === 0 && (
              <div className="col-span-full bg-white border border-gray-200 border-dashed p-12 rounded text-center text-gray-500">
                <Info className="h-10 w-10 text-gray-400 mx-auto mb-3" />
                <p className="text-sm font-medium">No active missing person reports currently registered in the database.</p>
              </div>
            )}
          </div>
        )}

        {/* Selected poster generation modal overlay */}
        {selectedPosterCase && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-gray-900/80 backdrop-blur-sm overflow-y-auto">
            <div className="bg-white border border-gray-200 rounded shadow-2xl p-6 max-w-3xl w-full flex flex-col md:flex-row gap-8 relative border-t-8 border-t-[#CC0001]">
              
              <button
                onClick={() => setSelectedPosterCase(null)}
                className="absolute top-3 right-3 text-gray-400 hover:text-gray-700 transition-colors bg-gray-100 rounded p-1"
                title="Close"
              >
                <X className="h-5 w-5" />
              </button>

              {/* Canvas builder container */}
              <div className="flex-1 bg-gray-100 border border-gray-300 p-2 rounded flex justify-center items-center shadow-inner mt-4 md:mt-0">
                <canvas ref={canvasRef} className="max-w-full h-auto max-h-[600px] bg-white rounded shadow-sm" />
              </div>

              {/* Action tools */}
              <div className="md:w-64 flex flex-col justify-between py-2">
                <div className="space-y-4">
                  <h3 className="font-bold text-sm text-[#1B2B6B] uppercase tracking-wider border-b border-gray-200 pb-2">Alert Poster Details</h3>
                  <p className="text-xs text-gray-600 leading-relaxed">
                    This high-contrast red "MISSING" poster is dynamically generated. Download it as a high-resolution image for digital sharing or print it for physical distribution.
                  </p>

                  <div className="bg-red-50 border border-red-200 p-3 rounded text-[11px] leading-relaxed text-gray-800">
                    <span className="font-bold text-[#CC0001] uppercase block mb-1">DISTRIBUTION NOTICE</span>
                    You can print the generated poster directly. Distributed posters include verified timestamps and contact channels.
                  </div>
                </div>

                <div className="space-y-3 mt-8">
                  <button
                    onClick={downloadPoster}
                    className="w-full bg-[#1B2B6B] hover:bg-[#004080] text-white py-3 rounded text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 transition-colors shadow-sm"
                  >
                    <Download className="h-4 w-4" />
                    <span>Download Image</span>
                  </button>
                  <button
                    onClick={() => window.print()}
                    className="w-full bg-white border border-gray-300 hover:border-gray-400 hover:bg-gray-50 text-gray-800 py-3 rounded text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 transition-colors shadow-sm"
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
    </div>
  );
}
