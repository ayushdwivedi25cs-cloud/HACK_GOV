'use client';

import React, { useState } from 'react';
import { Navbar } from '../../components/Navbar';
import { FloatingBot } from '../../components/FloatingBot';
import {
  ShieldAlert,
  ShieldCheck,
  AlertOctagon,
  UploadCloud,
  FileText,
  Trash2,
  Loader2,
  AlertTriangle,
  Info
} from 'lucide-react';

export default function ScamDetectorPage() {
  const [text, setText] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setError(null);
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      if (!selectedFile.type.startsWith('image/')) {
        setError('Please upload an image screenshot file only (PNG, JPG, JPEG).');
        return;
      }
      setFile(selectedFile);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setError(null);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const droppedFile = e.dataTransfer.files[0];
      if (!droppedFile.type.startsWith('image/')) {
        setError('Please upload an image screenshot file only.');
        return;
      }
      setFile(droppedFile);
    }
  };

  const handleRemoveFile = () => {
    setFile(null);
  };

  const handleScan = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim() && !file) {
      setError('Please type in the message text or drag and drop a screenshot image to analyze.');
      return;
    }

    setLoading(true);
    setError(null);
    setResult(null);

    const formData = new FormData();
    if (text) formData.append('text', text);
    if (file) formData.append('screenshot', file);

    try {
      const response = await fetch('http://localhost:5000/api/ai/scam-detect', {
        method: 'POST',
        body: formData
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || 'Scam scan failed');
      }

      setResult(data);
    } catch (err: any) {
      setError(err.message || 'An error occurred during verification scanning.');
    } finally {
      setLoading(false);
    }
  };

  const getBadgeStyle = (status: string) => {
    switch (status) {
      case 'SAFE':
        return {
          bg: 'bg-emerald-950/60 border-emerald-800 text-emerald-400',
          icon: ShieldCheck,
          label: 'SAFE LOGICAL VERDICT'
        };
      case 'SUSPICIOUS':
        return {
          bg: 'bg-amber-950/60 border-amber-800 text-amber-400',
          icon: AlertTriangle,
          label: 'SUSPICIOUS INDICATORS FOUND'
        };
      case 'HIGH RISK':
        return {
          bg: 'bg-red-950/60 border-red-800 text-red-400 animate-pulse',
          icon: AlertOctagon,
          label: 'HIGH RISK SCAM / PHISHING DETECTED'
        };
      default:
        return {
          bg: 'bg-slate-900 border-slate-800 text-slate-400',
          icon: ShieldAlert,
          label: 'UNSPECIFIED VULNERABILITY'
        };
    }
  };

  return (
    <main className="min-h-screen bg-slate-950 text-white flex flex-col">
      <Navbar onTriggerWomensSOS={() => {}} />

      <div className="flex-1 max-w-5xl w-full mx-auto px-4 py-8 space-y-8 flex flex-col justify-center">
        
        {/* Title block */}
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <h1 className="font-extrabold text-2xl sm:text-3xl uppercase tracking-wider text-white flex items-center justify-center space-x-2">
            <ShieldAlert className="h-7 w-7 text-emerald-400" />
            <span>AI Cyber Scam Screening Center</span>
          </h1>
          <p className="text-xs text-slate-400 leading-relaxed">
            Protect yourself from financial fraud. Copy and paste messages, links, or upload screenshots of SMS, WhatsApp, and Emails to evaluate risk triggers instantly.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
          
          {/* Left panel Form inputs */}
          <form onSubmit={handleScan} className="bg-slate-900 border border-slate-850 p-6 rounded-xl shadow-xl space-y-6">
            
            {error && (
              <div className="bg-red-950/60 border border-red-800 text-red-300 rounded p-3 text-xs flex items-start space-x-2">
                <AlertOctagon className="h-4.5 w-4.5 mt-0.5 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {/* Input 1: Textarea copy paste */}
            <div>
              <label className="block text-xs font-extrabold uppercase tracking-widest text-slate-400 mb-2">
                Copy/Paste Message Text
              </label>
              <textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Paste suspicious text message, links, OTP request wording or emails here..."
                rows={5}
                className="w-full bg-slate-950 border border-slate-850 rounded-lg p-3 text-xs text-white placeholder-slate-650 focus:outline-none focus:border-emerald-500"
              />
            </div>

            {/* Input 2: Drag and drop file upload screenshot */}
            <div>
              <label className="block text-xs font-extrabold uppercase tracking-widest text-slate-400 mb-2">
                Or Upload Screenshot (WhatsApp/SMS)
              </label>
              
              {!file ? (
                <div
                  onDragOver={handleDragOver}
                  onDrop={handleDrop}
                  className="bg-slate-950 border-2 border-dashed border-slate-800 rounded-lg p-6 flex flex-col items-center justify-center text-center cursor-pointer hover:border-slate-700 transition-colors relative"
                >
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="absolute inset-0 opacity-0 cursor-pointer"
                  />
                  <UploadCloud className="h-10 w-10 text-slate-500 mb-2" />
                  <span className="text-xs font-bold text-slate-300">Drag & Drop Image Screenshot</span>
                  <span className="text-[10px] text-slate-500 mt-1">Supports PNG, JPG, JPEG files (max 10MB)</span>
                </div>
              ) : (
                <div className="bg-slate-950 border border-slate-850 p-4 rounded-lg flex items-center justify-between">
                  <div className="flex items-center space-x-3 min-w-0">
                    <FileText className="h-8 w-8 text-emerald-500 shrink-0" />
                    <div className="min-w-0">
                      <p className="text-xs font-bold text-white truncate">{file.name}</p>
                      <p className="text-[10px] text-slate-500">{(file.size / 1024).toFixed(1)} KB</p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={handleRemoveFile}
                    className="text-red-400 hover:text-red-300 p-2"
                  >
                    <Trash2 className="h-4.5 w-4.5" />
                  </button>
                </div>
              )}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-3.5 rounded-lg text-sm font-extrabold uppercase tracking-wider transition-all flex items-center justify-center space-x-2"
            >
              {loading ? (
                <>
                  <Loader2 className="h-4.5 w-4.5 animate-spin" />
                  <span>AI Forensic Scanning Active...</span>
                </>
              ) : (
                <span>SCAN WITH AI PROTECTOR</span>
              )}
            </button>
          </form>

          {/* Right panel: Scan Results */}
          <div className="lg:col-span-1">
            {result ? (
              <div className="bg-slate-900 border border-slate-850 p-6 rounded-xl shadow-xl space-y-6">
                
                {/* Result header badge */}
                {(() => {
                  const style = getBadgeStyle(result.status);
                  const Icon = style.icon;
                  return (
                    <div className={`border p-4 rounded-lg flex items-center space-x-3.5 ${style.bg}`}>
                      <Icon className="h-10 w-10 shrink-0" />
                      <div>
                        <span className="text-[10px] font-black uppercase tracking-wider block">Verdict Report</span>
                        <h3 className="font-black text-sm uppercase tracking-wide leading-tight">{style.label}</h3>
                      </div>
                    </div>
                  );
                })()}

                {/* Score slider indicator */}
                <div className="space-y-1.5">
                  <div className="flex justify-between text-xs font-bold text-slate-400">
                    <span>Scam Indicator Probability</span>
                    <span className={result.probability > 60 ? 'text-red-400' : result.probability > 25 ? 'text-amber-400' : 'text-emerald-400'}>
                      {result.probability}%
                    </span>
                  </div>
                  <div className="w-full bg-slate-950 rounded-full h-2 overflow-hidden">
                    <div
                      className={`h-2 rounded-full transition-all ${
                        result.status === 'HIGH RISK' ? 'bg-red-500' : result.status === 'SUSPICIOUS' ? 'bg-amber-500' : 'bg-emerald-500'
                      }`}
                      style={{ width: `${result.probability}%` }}
                    />
                  </div>
                </div>

                {/* Warning details */}
                <div className="space-y-2">
                  <h4 className="text-xs font-extrabold text-slate-400 uppercase tracking-widest">Forensic Indicators Identifications</h4>
                  <ul className="space-y-2">
                    {result.indicators.map((ind: string, idx: number) => (
                      <li key={idx} className="bg-slate-950 p-2.5 border border-slate-850 rounded text-xs flex items-start space-x-2 leading-relaxed font-semibold">
                        <span className="text-red-500 font-bold">•</span>
                        <span>{ind}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Explanation text */}
                <div className="space-y-1.5">
                  <h4 className="text-xs font-extrabold text-slate-400 uppercase tracking-widest">AI Analyst Note</h4>
                  <p className="text-xs text-slate-300 leading-relaxed bg-slate-950/40 p-3.5 border border-slate-850 rounded-lg">
                    {result.explanation}
                  </p>
                </div>

                {/* Warning action guidance */}
                {result.status !== 'SAFE' && (
                  <div className="bg-red-950/30 border border-red-900/60 p-4 rounded-lg flex items-start space-x-2.5">
                    <AlertTriangle className="h-5 w-5 text-red-500 shrink-0 mt-0.5" />
                    <div className="text-[10px] text-slate-400 leading-relaxed">
                      <span className="font-bold text-red-400 uppercase block mb-1">PROMPT COUNTER ACTION</span>
                      If you shared bank account details, call the Cyber Cell Helpline immediately at <strong className="text-white">1930</strong>.
                    </div>
                  </div>
                )}

              </div>
            ) : (
              <div className="bg-slate-900/40 border border-slate-850/60 rounded-xl p-8 h-[380px] flex flex-col items-center justify-center text-center text-slate-500">
                <Info className="h-10 w-10 text-slate-655 mb-3" />
                <h3 className="font-extrabold text-xs uppercase tracking-widest text-slate-400 mb-1">Report Dashboard Ready</h3>
                <p className="text-[10px] max-w-xs leading-relaxed">
                  Submit text or upload an SMS image screenshot using the form panel to activate AI scanning and view the verification analysis.
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
