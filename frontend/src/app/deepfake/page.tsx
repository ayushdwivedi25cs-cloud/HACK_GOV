'use client';

import React, { useState } from 'react';
import {
  Upload,
  FileImage,
  Video,
  Music,
  Printer,
  Loader2,
  Lock,
  ExternalLink,
  ShieldCheck,
  AlertTriangle
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
    <div className="gov-section-gray min-h-screen print:bg-white print:p-0">
      <div className="gov-container flex flex-col justify-center py-8 print:p-0">
        
        {/* Page title */}
        <div className="text-center max-w-2xl mx-auto mb-8 print:hidden">
          <h1 className="gov-section-title flex items-center justify-center gap-2 mb-2">
            <Lock className="h-7 w-7 text-[#0057A8]" />
            AI Deepfake Forensic Reporting Center
          </h1>
          <p className="gov-section-subtitle mb-0">
            Verify image, video, and audio authenticity. Analyze media for deepfake manipulations, generate formal cryptographic evidence certificates, and connect to national reporting systems.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
          
          {/* Left Panel: Form Control (Hidden in Print Mode) */}
          <form onSubmit={handleVerify} className="bg-white border border-gray-200 p-6 rounded shadow-sm border-t-4 border-t-[#0057A8] print:hidden">
            
            {error && (
              <div className="gov-notice gov-notice-danger mb-4 flex items-start gap-2">
                <AlertTriangle className="h-4.5 w-4.5 mt-0.5 shrink-0 text-[#CC0001]" />
                <span className="text-sm font-semibold text-[#CC0001]">{error}</span>
              </div>
            )}

            {/* Selector buttons */}
            <div className="mb-6">
              <label className="block text-xs font-bold uppercase text-[#1B2B6B] mb-3">
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
                      className={`py-2 rounded border text-xs font-bold uppercase tracking-wide flex items-center justify-center gap-1.5 transition-colors ${
                        mediaType === type.id
                          ? 'bg-[#0057A8] border-[#0057A8] text-white shadow-sm'
                          : 'bg-white border-gray-300 text-gray-600 hover:text-[#0057A8] hover:bg-blue-50'
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
            <div className="mb-6">
              <label className="block text-xs font-bold uppercase text-[#1B2B6B] mb-2">
                Upload Media File
              </label>

              {!file ? (
                <div className="bg-gray-50 border-2 border-dashed border-gray-300 rounded p-8 flex flex-col items-center justify-center text-center cursor-pointer hover:border-[#0057A8] hover:bg-blue-50 relative transition-colors">
                  <input
                    type="file"
                    accept={mediaType === 'image' ? 'image/*' : mediaType === 'video' ? 'video/*' : 'audio/*'}
                    onChange={handleFileChange}
                    className="absolute inset-0 opacity-0 cursor-pointer"
                  />
                  <Upload className="h-10 w-10 text-[#0057A8] mb-2 opacity-70" />
                  <span className="text-sm font-bold text-[#1B2B6B]">Choose media for deepfake check</span>
                  <span className="text-xs text-gray-500 mt-1">Supports PNG, JPG, MP4, WAV, MP3 formats</span>
                </div>
              ) : (
                <div className="bg-blue-50 border border-blue-200 p-4 rounded flex items-center justify-between">
                  <div className="flex items-center gap-3 min-w-0">
                    {mediaType === 'image' ? (
                      <FileImage className="h-8 w-8 text-[#0057A8] shrink-0" />
                    ) : mediaType === 'video' ? (
                      <Video className="h-8 w-8 text-[#0057A8] shrink-0" />
                    ) : (
                      <Music className="h-8 w-8 text-[#0057A8] shrink-0" />
                    )}
                    <div className="min-w-0">
                      <p className="text-sm font-bold text-[#1B2B6B] truncate">{file.name}</p>
                      <p className="text-xs text-gray-500">{(file.size / (1024 * 1024)).toFixed(2)} MB</p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={handleRemoveFile}
                    className="text-[#CC0001] hover:bg-red-50 px-3 py-1.5 rounded text-xs font-bold"
                  >
                    Clear
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
                  <Lock className="h-4 w-4" />
                  <span>EVALUATE AND REPORT</span>
                </>
              )}
            </button>
          </form>

          {/* Right Panel / Whole Screen Print: Report Document */}
          <div className="lg:col-span-1 print:col-span-2">
            {result ? (
              <div className="space-y-6">
                
                {/* Print Layout Envelope (Stays hidden in screen UI or styles nicely, prints perfectly) */}
                <div className="bg-white text-gray-900 border border-gray-300 p-8 rounded shadow-sm space-y-6 border-t-[12px] border-t-[#0057A8] print:shadow-none print:border-t-[12px] print:border-[#0057A8] print:rounded-none">
                  {/* National Emblem emblem block */}
                  <div className="border-b-2 border-[#1B2B6B] pb-4 text-center space-y-1">
                    <span className="font-bold text-sm uppercase tracking-widest block text-[#1B2B6B]">
                      GOVERNMENT OF INDIA
                    </span>
                    <span className="text-xs uppercase font-bold tracking-wider text-gray-600 block">
                      Cyber Forensic Verification Division
                    </span>
                    <h2 className="font-black text-lg uppercase tracking-wider mt-2 text-[#1B2B6B]">
                      FORENSIC EVIDENCE REPORT SUMMARY
                    </h2>
                  </div>

                  <div className="space-y-4 text-sm">
                    {/* Verdict status */}
                    <div className="flex justify-between items-center border-b border-gray-200 pb-3">
                      <span className="font-bold text-gray-600">FORENSIC VERDICT:</span>
                      <span className={`font-black uppercase tracking-wider px-3 py-1 rounded text-xs ${
                        result.isDeepfake ? 'bg-red-50 text-[#CC0001] border border-red-200' : 'bg-green-50 text-[#138808] border border-green-200'
                      }`}>
                        {result.isDeepfake ? 'DEEPFAKE DETECTED (HIGH RISK)' : 'AUTHENTIC BIOLOGICAL SIGNAL'}
                      </span>
                    </div>

                    {/* Meta info */}
                    <div className="grid grid-cols-2 gap-4 text-xs leading-relaxed">
                      <div>
                        <span className="text-gray-500 block font-bold uppercase tracking-wider mb-0.5">SOURCE FILE</span>
                        <span className="font-bold text-gray-900 truncate block">{result.fileName}</span>
                      </div>
                      <div>
                        <span className="text-gray-500 block font-bold uppercase tracking-wider mb-0.5">VERIFICATION HASH</span>
                        <span className="font-mono text-gray-900 select-all block truncate">{result.evidenceHash}</span>
                      </div>
                      <div>
                        <span className="text-gray-500 block font-bold uppercase tracking-wider mb-0.5">FILE TYPE / SIZE</span>
                        <span className="font-bold text-gray-900 block">
                          {result.mimeType} / {(result.fileSize / (1024 * 1024)).toFixed(2)} MB
                        </span>
                      </div>
                      <div>
                        <span className="text-gray-500 block font-bold uppercase tracking-wider mb-0.5">TIMESTAMP VERIFIED</span>
                        <span className="font-bold text-gray-900 block">
                          {new Date(result.timestamp).toLocaleString()}
                        </span>
                      </div>
                    </div>

                    {/* Indicators list */}
                    <div className="pt-3 border-t border-gray-200 space-y-2">
                      <span className="font-bold text-gray-600 block uppercase tracking-wider text-xs">
                        Forensic Scan Diagnostic Indicators
                      </span>
                      <ul className="space-y-1.5 list-disc pl-5 text-gray-800 text-sm font-medium leading-relaxed">
                        {result.indicators.map((ind: string, idx: number) => (
                          <li key={idx}>{ind}</li>
                        ))}
                      </ul>
                    </div>

                    {/* Verification score */}
                    <div className="pt-3 border-t border-gray-200">
                      <div className="flex justify-between text-xs font-bold text-gray-600 mb-1.5">
                        <span>Confidence Score</span>
                        <span>{result.confidence}%</span>
                      </div>
                      <div className="w-full bg-gray-200 h-2 rounded-full overflow-hidden">
                        <div
                          className="bg-[#1B2B6B] h-2 rounded-full"
                          style={{ width: `${result.confidence}%` }}
                        />
                      </div>
                    </div>

                    {/* Official footer */}
                    <div className="pt-6 border-t border-gray-300 border-dashed flex justify-between items-end text-xs text-gray-600 leading-tight">
                      <div>
                        <p className="font-bold uppercase text-[10px] text-gray-500">DIGITAL SYSTEM SIGNATURE</p>
                        <p className="font-mono text-gray-800 mt-0.5">AI-EGN-SIGN: {result.evidenceHash.slice(8, 20)}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-[#1B2B6B]">STATUS ACTIVE</p>
                        <p className="text-[10px]">Document Valid for Legal Complaints</p>
                      </div>
                    </div>
                  </div>

                </div>

                {/* Report Action buttons (Hidden in Print Mode) */}
                <div className="flex flex-col sm:flex-row gap-3 print:hidden">
                  <button
                    onClick={handlePrintEvidence}
                    className="gov-btn-outline flex-1 justify-center py-3"
                  >
                    <Printer className="h-4.5 w-4.5" />
                    <span>Print Evidence Document</span>
                  </button>
                  <a
                    href="https://cybercrime.gov.in"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="gov-btn-primary flex-1 justify-center py-3"
                  >
                    <span>Connect Cyber Portal</span>
                    <ExternalLink className="h-4.5 w-4.5" />
                  </a>
                </div>

              </div>
            ) : (
              <div className="bg-white border border-gray-200 border-dashed rounded p-8 h-full min-h-[400px] flex flex-col items-center justify-center text-center text-gray-500 bg-gray-50 print:hidden">
                <ShieldCheck className="h-12 w-12 text-[#0057A8] mb-4 opacity-50" />
                <h3 className="font-bold text-sm uppercase tracking-widest text-[#1B2B6B] mb-2">Evidence Certificate Ready</h3>
                <p className="text-sm max-w-sm leading-relaxed">
                  Upload an image, video, or voice file and run analysis to compile forensic verification logs and download complaint certificates.
                </p>
              </div>
            )}
          </div>

        </div>

      </div>
    </div>
  );
}
