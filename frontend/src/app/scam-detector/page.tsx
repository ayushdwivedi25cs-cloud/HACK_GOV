'use client';

import React, { useState } from 'react';
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
          bg: 'bg-green-50 border-green-200 text-[#138808]',
          icon: ShieldCheck,
          label: 'SAFE LOGICAL VERDICT'
        };
      case 'SUSPICIOUS':
        return {
          bg: 'bg-orange-50 border-orange-200 text-[#FF6200]',
          icon: AlertTriangle,
          label: 'SUSPICIOUS INDICATORS FOUND'
        };
      case 'HIGH RISK':
        return {
          bg: 'bg-red-50 border-red-200 text-[#CC0001] animate-pulse',
          icon: AlertOctagon,
          label: 'HIGH RISK SCAM / PHISHING DETECTED'
        };
      default:
        return {
          bg: 'bg-gray-50 border-gray-200 text-gray-500',
          icon: ShieldAlert,
          label: 'UNSPECIFIED VULNERABILITY'
        };
    }
  };

  return (
    <div className="gov-section-gray min-h-screen">
      <div className="gov-container flex flex-col justify-center py-8">
        
        {/* Title block */}
        <div className="text-center max-w-2xl mx-auto mb-8">
          <h1 className="gov-section-title flex items-center justify-center gap-2 mb-2">
            <ShieldAlert className="h-7 w-7 text-[#0057A8]" />
            AI Cyber Scam Screening Center
          </h1>
          <p className="gov-section-subtitle mb-0">
            Official government tool to protect against financial fraud. Paste messages, links, or upload screenshots to evaluate cyber risk instantly.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
          
          {/* Left panel Form inputs */}
          <form onSubmit={handleScan} className="bg-white border border-gray-200 p-6 rounded shadow-sm border-t-4 border-t-[#0057A8]">
            
            {error && (
              <div className="gov-notice gov-notice-danger mb-4 flex items-start gap-2">
                <AlertOctagon className="h-4.5 w-4.5 mt-0.5 shrink-0 text-[#CC0001]" />
                <span className="text-sm font-semibold text-[#CC0001]">{error}</span>
              </div>
            )}

            {/* Input 1: Textarea copy paste */}
            <div className="mb-6">
              <label className="block text-xs font-bold uppercase text-[#1B2B6B] mb-2">
                Copy/Paste Message Text
              </label>
              <textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Paste suspicious text message, links, OTP request wording or emails here..."
                rows={5}
                className="w-full bg-gray-50 border border-gray-300 rounded p-3 text-sm text-gray-900 focus:outline-none focus:border-[#0057A8] focus:bg-white"
              />
            </div>

            {/* Input 2: Drag and drop file upload screenshot */}
            <div className="mb-6">
              <label className="block text-xs font-bold uppercase text-[#1B2B6B] mb-2">
                Or Upload Screenshot (WhatsApp/SMS)
              </label>
              
              {!file ? (
                <div
                  onDragOver={handleDragOver}
                  onDrop={handleDrop}
                  className="bg-gray-50 border-2 border-dashed border-gray-300 rounded p-6 flex flex-col items-center justify-center text-center cursor-pointer hover:border-[#0057A8] hover:bg-blue-50 transition-colors relative"
                >
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="absolute inset-0 opacity-0 cursor-pointer"
                  />
                  <UploadCloud className="h-10 w-10 text-[#0057A8] mb-2 opacity-70" />
                  <span className="text-sm font-bold text-[#1B2B6B]">Drag & Drop Image Screenshot</span>
                  <span className="text-xs text-gray-500 mt-1">Supports PNG, JPG, JPEG files (max 10MB)</span>
                </div>
              ) : (
                <div className="bg-blue-50 border border-blue-200 p-4 rounded flex items-center justify-between">
                  <div className="flex items-center gap-3 min-w-0">
                    <FileText className="h-8 w-8 text-[#0057A8] shrink-0" />
                    <div className="min-w-0">
                      <p className="text-sm font-bold text-[#1B2B6B] truncate">{file.name}</p>
                      <p className="text-xs text-gray-500">{(file.size / 1024).toFixed(1)} KB</p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={handleRemoveFile}
                    className="text-[#CC0001] hover:bg-red-50 p-2 rounded"
                    title="Remove file"
                  >
                    <Trash2 className="h-4.5 w-4.5" />
                  </button>
                </div>
              )}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="gov-btn-primary w-full justify-center py-3 text-sm tracking-wider"
            >
              {loading ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  <span>AI Forensic Scanning Active...</span>
                </>
              ) : (
                <>
                  <ShieldAlert className="h-4 w-4" />
                  <span>SCAN WITH AI PROTECTOR</span>
                </>
              )}
            </button>
          </form>

          {/* Right panel: Scan Results */}
          <div>
            {result ? (
              <div className="bg-white border border-gray-200 p-6 rounded shadow-sm border-t-4 border-t-[#1B2B6B]">
                
                {/* Result header badge */}
                {(() => {
                  const style = getBadgeStyle(result.status);
                  const Icon = style.icon;
                  return (
                    <div className={`border p-4 rounded flex items-center gap-4 mb-6 ${style.bg}`}>
                      <Icon className="h-10 w-10 shrink-0" />
                      <div>
                        <span className="text-xs font-bold uppercase tracking-wider block opacity-80">Official Verdict Report</span>
                        <h3 className="font-black text-sm uppercase tracking-wide leading-tight mt-0.5">{style.label}</h3>
                      </div>
                    </div>
                  );
                })()}

                {/* Score slider indicator */}
                <div className="mb-6">
                  <div className="flex justify-between text-xs font-bold text-gray-600 mb-1">
                    <span>Scam Indicator Probability</span>
                    <span className={result.probability > 60 ? 'text-[#CC0001]' : result.probability > 25 ? 'text-[#FF6200]' : 'text-[#138808]'}>
                      {result.probability}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                    <div
                      className={`h-2 rounded-full transition-all ${
                        result.status === 'HIGH RISK' ? 'bg-[#CC0001]' : result.status === 'SUSPICIOUS' ? 'bg-[#FF6200]' : 'bg-[#138808]'
                      }`}
                      style={{ width: `${result.probability}%` }}
                    />
                  </div>
                </div>

                {/* Warning details */}
                <div className="mb-6">
                  <h4 className="text-xs font-bold text-[#1B2B6B] uppercase border-b-2 border-[#1B2B6B] pb-1 inline-block mb-3">
                    Forensic Indicators Identified
                  </h4>
                  <ul className="space-y-2">
                    {result.indicators.map((ind: string, idx: number) => (
                      <li key={idx} className="bg-gray-50 p-3 border border-gray-200 rounded text-sm flex items-start gap-2 font-medium text-gray-800">
                        <span className="text-[#CC0001] font-bold mt-0.5">•</span>
                        <span>{ind}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Explanation text */}
                <div className="mb-6">
                  <h4 className="text-xs font-bold text-[#1B2B6B] uppercase border-b-2 border-[#1B2B6B] pb-1 inline-block mb-3">
                    Cyber Cell Analyst Note
                  </h4>
                  <p className="text-sm text-gray-700 leading-relaxed bg-[#EEF4FB] p-4 border border-[#BDD5EF] rounded">
                    {result.explanation}
                  </p>
                </div>

                {/* Warning action guidance */}
                {result.status !== 'SAFE' && (
                  <div className="gov-notice gov-notice-danger flex items-start gap-3">
                    <AlertTriangle className="h-5 w-5 text-[#CC0001] shrink-0 mt-0.5" />
                    <div className="text-sm text-[#990000] leading-relaxed">
                      <span className="font-bold uppercase block mb-1">PROMPT COUNTER ACTION REQUIRED</span>
                      If you shared bank account details or transferred money, call the National Cyber Crime Helpline immediately at <strong className="font-mono text-lg bg-[#CC0001] text-white px-2 py-0.5 rounded ml-1">1930</strong>.
                    </div>
                  </div>
                )}

              </div>
            ) : (
              <div className="bg-white border border-gray-200 border-dashed rounded p-8 h-full min-h-[400px] flex flex-col items-center justify-center text-center text-gray-500 bg-gray-50">
                <Info className="h-12 w-12 text-[#0057A8] mb-4 opacity-50" />
                <h3 className="font-bold text-sm uppercase tracking-widest text-[#1B2B6B] mb-2">Dashboard Ready</h3>
                <p className="text-sm max-w-sm leading-relaxed">
                  Submit text or upload an SMS image screenshot using the secure form to activate AI forensic scanning and view the verification analysis.
                </p>
              </div>
            )}
          </div>

        </div>

      </div>
    </div>
  );
}
