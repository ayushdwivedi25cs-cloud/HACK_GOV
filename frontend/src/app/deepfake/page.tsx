'use client';

import React, { useState } from 'react';
import { Navbar } from '../../components/Navbar';
import { FloatingBot } from '../../components/FloatingBot';
import {
  ShieldAlert,
  Upload,
  FileImage,
  Video,
  Music,
  Download,
  Printer,
  CheckCircle,
  AlertTriangle,
  Loader2,
  Lock,
  ExternalLink
} from 'lucide-react';

export default function DeepfakePage() {
  const [mediaType, setMediaType] = useState<'image' | 'video' | 'audio'>('image');
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setError(null);
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleRemoveFile = () => {
    setFile(null);
    setResult(null);
  };

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) {
      setError('Please upload a media file (Image, Video, or Audio) for Deepfake forensic check.');
      return;
    }

    setLoading(true);
    setError(null);
    setResult(null);

    const formData = new FormData();
    formData.append('media', file);
    formData.append('mediaType', mediaType);

    try {
      const response = await fetch('http://localhost:5000/api/ai/deepfake-detect', {
        method: 'POST',
        body: formData
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || 'Forensic evaluation failed');
      }

      setResult(data);
    } catch (err: any) {
      setError(err.message || 'Failed to complete forensic check.');
    } finally {
      setLoading(false);
    }
  };

  // Trigger browser print of the formatted evidence sheet
  const handlePrintEvidence = () => {
    window.print();
  };

  return (
    <main className="min-h-screen bg-slate-950 text-white flex flex-col print:bg-white print:text-black">
      {/* Hide navbar on print */}
      <div className="print:hidden">
        <Navbar onTriggerWomensSOS={() => {}} />
      </div>

      <div className="flex-1 max-w-6xl w-full mx-auto px-4 py-8 space-y-8 flex flex-col justify-center">
        
        {/* Page title */}
        <div className="text-center max-w-2xl mx-auto space-y-2 print:hidden">
          <h1 className="font-extrabold text-2xl sm:text-3xl uppercase tracking-wider text-white flex items-center justify-center space-x-2">
            <Lock className="h-7 w-7 text-emerald-400" />
            <span>AI Deepfake Forensic Reporting Center</span>
          </h1>
          <p className="text-xs text-slate-405 leading-relaxed">
            Verify image, video, and audio authentication. Analyze media for deepfake manipulations, generate formal cryptographic evidence certificates, and connect to national reporting systems.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
          
          {/* Left Panel: Form Control (Hidden in Print Mode) */}
          <form onSubmit={handleVerify} className="bg-slate-900 border border-slate-850 p-6 rounded-xl shadow-xl space-y-6 print:hidden">
            
            {error && (
              <div className="bg-red-950/60 border border-red-800 text-red-300 rounded p-3 text-xs">
                <span>{error}</span>
              </div>
            )}

            {/* Selector buttons */}
            <div>
              <label className="block text-xs font-extrabold uppercase tracking-widest text-slate-400 mb-3">
                Media Content Type
              </label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: 'image', icon: FileImage, label: 'Image Face' },
                  { id: 'video', icon: Video, label: 'Video Clip' },
                  { id: 'audio', icon: Music, label: 'Voice Audio' }
                ].map((type) => {
                  const Icon = type.icon;
                  return (
                    <button
                      key={type.id}
                      type="button"
                      onClick={() => {
                        setMediaType(type.id as any);
                        setFile(null);
                        setResult(null);
                      }}
                      className={`py-2 rounded border font-bold text-xs uppercase tracking-wide flex items-center justify-center space-x-1.5 transition-all ${
                        mediaType === type.id
                          ? 'bg-emerald-600 border-emerald-500 text-white shadow shadow-emerald-950'
                          : 'bg-slate-950 border-slate-850 text-slate-400 hover:text-slate-350'
                      }`}
                    >
                      <Icon className="h-4 w-4" />
                      <span>{type.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Media Upload dragbox */}
            <div>
              <label className="block text-xs font-extrabold uppercase tracking-widest text-slate-400 mb-2">
                Upload Media File
              </label>

              {!file ? (
                <div className="bg-slate-950 border-2 border-dashed border-slate-800 rounded-lg p-8 flex flex-col items-center justify-center text-center cursor-pointer hover:border-slate-700 relative">
                  <input
                    type="file"
                    accept={mediaType === 'image' ? 'image/*' : mediaType === 'video' ? 'video/*' : 'audio/*'}
                    onChange={handleFileChange}
                    className="absolute inset-0 opacity-0 cursor-pointer"
                  />
                  <Upload className="h-10 w-10 text-slate-500 mb-2 animate-bounce" />
                  <span className="text-xs font-bold text-slate-300">Choose media for deepfake check</span>
                  <span className="text-[9px] text-slate-500 mt-1">Supports PNG, JPG, MP4, WAV, MP3 formats</span>
                </div>
              ) : (
                <div className="bg-slate-950 border border-slate-850 p-4 rounded-lg flex items-center justify-between">
                  <div className="flex items-center space-x-3 min-w-0">
                    {mediaType === 'image' ? (
                      <FileImage className="h-8 w-8 text-emerald-500 shrink-0" />
                    ) : mediaType === 'video' ? (
                      <Video className="h-8 w-8 text-emerald-500 shrink-0" />
                    ) : (
                      <Music className="h-8 w-8 text-emerald-500 shrink-0" />
                    )}
                    <div className="min-w-0">
                      <p className="text-xs font-bold text-white truncate">{file.name}</p>
                      <p className="text-[10px] text-slate-500">{(file.size / (1024 * 1024)).toFixed(2)} MB</p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={handleRemoveFile}
                    className="text-red-400 hover:text-red-300 px-2.5 py-1 text-xs font-bold"
                  >
                    Clear
                  </button>
                </div>
              )}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-3.5 rounded-lg text-sm font-extrabold uppercase tracking-wider transition-all shadow-md hover:shadow-emerald-950 flex items-center justify-center space-x-2"
            >
              {loading ? (
                <>
                  <Loader2 className="h-4.5 w-4.5 animate-spin" />
                  <span>AI Forensic Scanning Active...</span>
                </>
              ) : (
                <span>EVALUATE AND REPORT</span>
              )}
            </button>
          </form>

          {/* Right Panel / Whole Screen Print: Report Document */}
          <div className="lg:col-span-1 print:col-span-2">
            {result ? (
              <div className="space-y-6">
                
                {/* Print Layout Envelope (Stays hidden in screen UI or styles nicely, prints perfectly) */}
                <div className="bg-white text-slate-900 border border-slate-350 p-6 rounded-xl shadow-xl space-y-6 font-serif border-t-8 border-t-emerald-700 print:shadow-none print:border-slate-300">
                  {/* National Emblem emblem block */}
                  <div className="border-b-2 border-slate-900 pb-4 text-center space-y-1">
                    <span className="font-extrabold text-sm uppercase tracking-widest block font-sans">
                      DEPARTMENT OF CIVIL SECURITY
                    </span>
                    <span className="text-[10px] uppercase font-bold tracking-wider text-slate-550 block font-sans">
                      Cyber Forensic Verification Division
                    </span>
                    <h2 className="font-black text-base uppercase tracking-wider mt-1 text-emerald-800">
                      FORENSIC EVIDENCE REPORT SUMMARY
                    </h2>
                  </div>

                  <div className="space-y-4 text-xs font-sans">
                    {/* Verdict status */}
                    <div className="flex justify-between items-center border-b border-slate-200 pb-2">
                      <span className="font-bold text-slate-500">FORENSIC VERDICT:</span>
                      <span className={`font-black uppercase tracking-wider px-2 py-0.5 rounded ${
                        result.isDeepfake ? 'bg-red-50 text-red-700 border border-red-200' : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                      }`}>
                        {result.isDeepfake ? 'DEEPFAKE DETECTED (HIGH RISK)' : 'AUTHENTIC BIOLOGICAL SIGNAL'}
                      </span>
                    </div>

                    {/* Meta info */}
                    <div className="grid grid-cols-2 gap-3 text-[11px] leading-relaxed">
                      <div>
                        <span className="text-slate-400 block font-bold">SOURCE FILE</span>
                        <span className="font-bold text-slate-800 truncate block">{result.fileName}</span>
                      </div>
                      <div>
                        <span className="text-slate-400 block font-bold">VERIFICATION HASH</span>
                        <span className="font-mono text-slate-800 select-all block truncate">{result.evidenceHash}</span>
                      </div>
                      <div>
                        <span className="text-slate-400 block font-bold">FILE TYPE / SIZE</span>
                        <span className="font-bold text-slate-800 block">
                          {result.mimeType} / {(result.fileSize / (1024 * 1024)).toFixed(2)} MB
                        </span>
                      </div>
                      <div>
                        <span className="text-slate-400 block font-bold">TIMESTAMP VERIFIED</span>
                        <span className="font-bold text-slate-800 block">
                          {new Date(result.timestamp).toLocaleString()}
                        </span>
                      </div>
                    </div>

                    {/* Indicators list */}
                    <div className="pt-2 border-t border-slate-200 space-y-2">
                      <span className="font-bold text-slate-500 block uppercase tracking-wider text-[10px]">
                        Forensic Scan Diagnostic Indicators
                      </span>
                      <ul className="space-y-1.5 list-disc pl-4 text-slate-700 text-[11px] font-medium leading-relaxed">
                        {result.indicators.map((ind: string, idx: number) => (
                          <li key={idx}>{ind}</li>
                        ))}
                      </ul>
                    </div>

                    {/* Verification score */}
                    <div className="pt-2 border-t border-slate-200">
                      <div className="flex justify-between text-[11px] font-bold text-slate-500 mb-1">
                        <span>Confidence Score</span>
                        <span>{result.confidence}%</span>
                      </div>
                      <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                        <div
                          className="bg-emerald-700 h-1.5 rounded-full"
                          style={{ width: `${result.confidence}%` }}
                        />
                      </div>
                    </div>

                    {/* Official footer */}
                    <div className="pt-4 border-t border-slate-200 border-dashed flex justify-between items-end text-[9px] text-slate-500 leading-tight">
                      <div>
                        <p className="font-bold uppercase text-[8px]">DIGITAL SYSTEM SIGNATURE</p>
                        <p className="font-mono">AI-EGN-SIGN: {result.evidenceHash.slice(8, 20)}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold">STATUS ACTIVE</p>
                        <p>Document Valid for Legal Complaints</p>
                      </div>
                    </div>
                  </div>

                </div>

                {/* Report Action buttons (Hidden in Print Mode) */}
                <div className="flex space-x-3 print:hidden">
                  <button
                    onClick={handlePrintEvidence}
                    className="flex-1 bg-slate-900 hover:bg-slate-850 text-white py-3 border border-slate-800 rounded-lg text-xs font-extrabold uppercase tracking-wide flex items-center justify-center space-x-1.5 shadow"
                  >
                    <Printer className="h-4.5 w-4.5" />
                    <span>Print Evidence Document</span>
                  </button>
                  <a
                    href="https://cybercrime.gov.in"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white py-3 rounded-lg text-xs font-extrabold uppercase tracking-wide flex items-center justify-center space-x-1.5 shadow"
                  >
                    <span>Connect Cyber Portal</span>
                    <ExternalLink className="h-4.5 w-4.5" />
                  </a>
                </div>

              </div>
            ) : (
              <div className="bg-slate-900/40 border border-slate-850/60 rounded-xl p-8 h-[380px] flex flex-col items-center justify-center text-center text-slate-500 print:hidden">
                <Lock className="h-10 w-10 text-slate-655 mb-3 animate-pulse" />
                <h3 className="font-extrabold text-xs uppercase tracking-widest text-slate-400 mb-1">Evidence Certificate ready</h3>
                <p className="text-[10px] max-w-xs leading-relaxed">
                  Upload an image, video, or voice file and run analysis to compile forensic verification logs and download complaint certificates.
                </p>
              </div>
            )}
          </div>

        </div>

      </div>
      <FloatingBot />
    </main>
  );
}
