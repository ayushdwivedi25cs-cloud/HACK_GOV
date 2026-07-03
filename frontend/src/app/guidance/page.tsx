'use client';

import React, { useState } from 'react';
import {
  FileText,
  Clock,
  ExternalLink,
  ShieldCheck,
  BookOpen,
  Info,
  ChevronRight
} from 'lucide-react';

interface Procedure {
  title: string;
  category: string;
  steps: string[];
  documents: string[];
  timeline: string;
  officialLink: string;
  firLink?: string;
  firName?: string;
}

export default function GuidancePage() {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [activeProcedure, setActiveProcedure] = useState<number>(0);

  const procedures: Procedure[] = [
    {
      title: 'Lost Aadhaar Card',
      category: 'identity',
      steps: [
        'Visit the official UIDAI portal (uidai.gov.in) and select "Retrieve Lost UID/EID" under My Aadhaar services.',
        'Provide your registered full name, mobile number, and email. Complete the CAPTCHA and request OTP.',
        'Enter the OTP received on your phone. Your Aadhaar number (UID) will be messaged to you instantly. Use this UID to download your digital e-Aadhaar PDF.'
      ],
      documents: ['Registered Mobile Number', 'Email Address', 'Proof of Identity (matching UIDAI records)'],
      timeline: '10 - 15 Minutes (Instant Digital copy)',
      officialLink: 'https://uidai.gov.in',
      firLink: 'https://uidai.gov.in',
      firName: 'UIDAI Retrieve Portal'
    },
    {
      title: 'Lost PAN Card',
      category: 'identity',
      steps: [
        'Go to the NSDL Tin-PAN portal or UTITSL online pan reprint application page.',
        'Enter your PAN Number, Aadhaar Number, and Date of Birth. Agree to Aadhaar-based OTP authorization.',
        'Pay the processing fee (approx ₹50 for shipping within India). Verify via OTP. Your reprint card will be printed and dispatched by post.'
      ],
      documents: ['PAN Number (or copy)', 'Aadhaar Number', 'Registered Mobile Number'],
      timeline: '7 - 10 Working Days',
      officialLink: 'https://www.tin-nsdl.com',
      firLink: 'https://www.onlineservices.nsdl.com/paam/ReprintEPan.html',
      firName: 'NSDL Reprint Portal'
    },
    {
      title: 'Lost Driving License (DL)',
      category: 'identity',
      steps: [
        'Visit the Sarathi Parivahan portal (sarathi.parivahan.gov.in) and select your respective State.',
        'Click on "Apply for Duplicate DL" and fill in your DL number and DOB. Agree to fetch details.',
        'Upload your lost DL copy (if available) along with an official Police FIR/Lost Report copy, pay the duplicate license fee online, and download your e-receipt.'
      ],
      documents: ['Police FIR Copy / Lost Article Report', 'Aadhaar Card (Address Proof)', 'Original DL copy (optional)', 'Passport size photo'],
      timeline: '15 - 30 Days (Dispatched by post)',
      officialLink: 'https://sarathi.parivahan.gov.in',
      firLink: 'https://sarathi.parivahan.gov.in',
      firName: 'Sarathi DL Portal'
    },
    {
      title: 'Lost Passport',
      category: 'identity',
      steps: [
        'Register an immediate online Police FIR or Lost Document Report stating the details of the lost passport.',
        'Log in to the Passport Seva online portal (passportindia.gov.in) and apply for a "Re-issue of Passport" under the Lost category.',
        'Book an appointment at the nearest PSK (Passport Seva Kendra), bring the original FIR and required verification papers, and complete physical document audit.'
      ],
      documents: ['Police FIR (Mandatory for lost passports)', 'Address Proof (Utility bill, Aadhaar)', 'Date of Birth Proof (School cert, birth cert)', 'Annexure F (Declaration of loss details)'],
      timeline: '10 - 20 Days (Normal) | 3 - 7 Days (Tatkaal)',
      officialLink: 'https://www.passportindia.gov.in',
      firLink: 'https://www.passportindia.gov.in',
      firName: 'Passport Seva Portal'
    },
    {
      title: 'Lost Mobile Phone',
      category: 'property',
      steps: [
        'File an online Lost Report on your State Police Portal to get a reference receipt. Contact your cellular provider to block the SIM card.',
        'Visit the Central Equipment Identity Register (CEIR) official portal (ceir.gov.in) provided by the Dept of Telecommunications.',
        'Select "Block Stolen/Lost Mobile", enter the device IMEI numbers, attach the Police Lost Report, and submit. The device will be blacklisted across all Indian telecom grids.'
      ],
      documents: ['Police Lost Report / FIR Reference Number', 'Device Purchase Invoice (optional)', 'SIM Card Ownership Details', 'IMEI Numbers (15-digit)'],
      timeline: '24 - 48 Hours for network blacklisting',
      officialLink: 'https://ceir.gov.in',
      firLink: 'https://ceir.gov.in/Home/index.jsp',
      firName: 'CEIR Blocking Portal'
    },
    {
      title: 'Cyber Financial Fraud',
      category: 'scams',
      steps: [
        'Call the National Cyber Crime Hotline at 1930 within the golden hour (first 2 hours) to allow the bank to freeze the transaction.',
        'Gather all screenshots of fraudulent messages, UPI transfer IDs, bank receipts, and fake links.',
        'Log in to cybercrime.gov.in and file a formal incident report. Provide your bank name, card number, and fraud event timeline.'
      ],
      documents: ['Screenshots of transaction confirmations', 'Bank statements showing debit', 'SMS/WhatsApp messages from fraudster', 'ID Proof'],
      timeline: 'Immediate freeze (2-24 hours) | Resolution varies',
      officialLink: 'https://cybercrime.gov.in',
      firLink: 'https://cybercrime.gov.in',
      firName: 'National Cyber Portal'
    },
    {
      title: 'Domestic Violence & Harassment',
      category: 'safety',
      steps: [
        'Dial the national women helpline 1091 or domestic violence line 181 for immediate response or emergency evacuation support.',
        'Access the National Commission for Women (NCW) official portal (ncw.nic.in) or visit your local police station to file a complaint.',
        'A Protection Officer will be assigned under the Protection of Women from Domestic Violence Act, 2005, to ensure your safety and coordinate legal guidance.'
      ],
      documents: ['Medical records (if any injuries)', 'Any communication/recording proof', 'Identity Proof of complainant'],
      timeline: 'Immediate response (Helpline) | Legal action in 48 hours',
      officialLink: 'http://ncw.nic.in',
      firLink: 'http://ncw.nic.in/online-complaint-registration-system',
      firName: 'NCW Online Complaint'
    },
    {
      title: 'Missing Person Filing',
      category: 'safety',
      steps: [
        'Conduct a search of immediate relatives, friends, and the last known vicinity. Gather the most recent photograph and physical descriptions.',
        'Visit the local police station of jurisdiction immediately. Note: There is NO 24-hour waiting rule required to file a report for missing children or vulnerable adults.',
        'File an official Missing Person Report/FIR. Request the police to upload the profile to the national Track Child or Khoya-Paya database.'
      ],
      documents: ['Recent high-resolution photographs', 'Detailed description of clothes & marks', 'Proof of relationship to the missing person'],
      timeline: 'Immediate FIR Filing',
      officialLink: 'https://trackthechild.gov.in',
      firLink: 'https://trackthechild.gov.in',
      firName: 'Track the Child Portal'
    }
  ];

  const filteredProcedures = procedures.filter(
    (p) => selectedCategory === 'all' || p.category === selectedCategory
  );

  const selectProcedure = (index: number) => {
    setActiveProcedure(index);
  };

  return (
    <div className="gov-section-gray min-h-screen">
      <div className="gov-container">
        
        {/* Banner Title */}
        <div className="mb-6">
          <h1 className="gov-section-title flex items-center gap-2">
            <BookOpen className="h-6 w-6 text-[#0057A8]" />
            Government Standard Procedures Directory
          </h1>
          <p className="gov-section-subtitle mb-0">Official guidelines, timelines, checklist documents, and direct application links.</p>
        </div>

        {/* Filter categories tabs */}
        <div className="flex flex-wrap gap-2 mb-6 border-b border-gray-200 pb-4">
          {[
            { id: 'all', name: 'All Procedures' },
            { id: 'identity', name: 'Identity Documents' },
            { id: 'property', name: 'Property & Loss' },
            { id: 'scams', name: 'Scams & Cyber Fraud' },
            { id: 'safety', name: 'Civil Safety & Harassment' }
          ].map((cat) => (
            <button
              key={cat.id}
              onClick={() => {
                setSelectedCategory(cat.id);
                setActiveProcedure(0);
              }}
              className={`px-4 py-2 rounded text-[13px] font-bold uppercase transition-colors ${
                selectedCategory === cat.id
                  ? 'bg-[#0057A8] text-white shadow-sm border border-[#0057A8]'
                  : 'bg-white text-gray-600 hover:text-[#0057A8] border border-gray-200 hover:bg-blue-50'
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left panel: List items */}
          <div className="space-y-3 lg:col-span-1">
            {filteredProcedures.map((proc, index) => (
              <button
                key={proc.title}
                onClick={() => selectProcedure(index)}
                className={`w-full text-left p-4 rounded border transition-all flex items-center justify-between ${
                  activeProcedure === index
                    ? 'bg-blue-50 border-[#0057A8] shadow-sm'
                    : 'bg-white border-gray-200 hover:border-[#0057A8] hover:bg-blue-50/50'
                }`}
              >
                <div>
                  <h4 className={`font-bold text-sm ${activeProcedure === index ? 'text-[#0057A8]' : 'text-gray-900'}`}>{proc.title}</h4>
                  <span className="text-[10px] text-gray-500 font-bold uppercase tracking-wider mt-1 block">
                    {proc.category}
                  </span>
                </div>
                <ChevronRight className={`h-5 w-5 ${activeProcedure === index ? 'text-[#0057A8]' : 'text-gray-400'}`} />
              </button>
            ))}
            {filteredProcedures.length === 0 && (
              <p className="text-sm text-gray-500 text-center py-8">No procedures found in this category.</p>
            )}
          </div>

          {/* Right panel: Active Procedure Detail */}
          {filteredProcedures[activeProcedure] && (
            <div className="lg:col-span-2 bg-white border border-gray-200 rounded p-6 shadow-sm border-t-4 border-t-[#0057A8] h-fit">
              {/* Header */}
              <div className="border-b border-gray-200 pb-5 flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                <div>
                  <h2 className="font-bold text-xl text-[#1B2B6B] uppercase tracking-wide">
                    {filteredProcedures[activeProcedure].title}
                  </h2>
                  <div className="flex items-center space-x-2 mt-2">
                    <span className="text-[10px] bg-gray-100 border border-gray-200 text-gray-600 px-2.5 py-1 rounded font-bold uppercase">
                      Category: {filteredProcedures[activeProcedure].category}
                    </span>
                  </div>
                </div>

                {filteredProcedures[activeProcedure].firLink && (
                  <a
                    href={filteredProcedures[activeProcedure].firLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="gov-btn-primary"
                  >
                    <span>{filteredProcedures[activeProcedure].firName || 'Access Portal'}</span>
                    <ExternalLink className="h-4 w-4" />
                  </a>
                )}
              </div>

              {/* Steps Layout */}
              <div className="space-y-4 mt-6">
                <h3 className="text-sm font-bold text-[#1B2B6B] uppercase border-b-2 border-[#1B2B6B] pb-1 inline-block">
                  Standard Procedure
                </h3>
                <div className="space-y-4">
                  {filteredProcedures[activeProcedure].steps.map((step, idx) => (
                    <div key={idx} className="flex items-start gap-4 p-4 bg-gray-50 border border-gray-200 rounded">
                      <span className="w-8 h-8 rounded bg-[#EEF4FB] border border-[#BDD5EF] text-[#0057A8] flex items-center justify-center font-bold text-sm shrink-0">
                        {idx + 1}
                      </span>
                      <p className="text-gray-700 text-sm leading-relaxed pt-1.5">{step}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Lower Details panel: docs + timeline */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8 border-t border-gray-200 pt-6">
                {/* Documents */}
                <div className="space-y-3">
                  <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider flex items-center gap-1.5">
                    <ShieldCheck className="h-4 w-4 text-[#138808]" />
                    Required Documents
                  </h4>
                  <ul className="text-sm text-gray-700 space-y-2 list-disc pl-5">
                    {filteredProcedures[activeProcedure].documents.map((doc, i) => (
                      <li key={i}>{doc}</li>
                    ))}
                  </ul>
                </div>

                {/* Timeline */}
                <div className="space-y-3">
                  <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider flex items-center gap-1.5">
                    <Clock className="h-4 w-4 text-[#FF6200]" />
                    Processing Timeline
                  </h4>
                  <p className="text-base font-bold text-gray-900 pl-1">
                    {filteredProcedures[activeProcedure].timeline}
                  </p>
                  <p className="text-[11px] text-gray-500 italic pl-1 leading-tight">
                    * Timeline is indicative of normal administrative volumes. Real timeframes may vary by jurisdiction.
                  </p>
                </div>
              </div>

              {/* General official external portals integration info */}
              <div className="mt-8 bg-[#EEF4FB] border border-[#BDD5EF] p-4 rounded flex items-start gap-3">
                <Info className="h-5 w-5 text-[#0057A8] shrink-0 mt-0.5" />
                <div className="text-xs text-[#0057A8] leading-relaxed">
                  <span className="font-bold uppercase block mb-1">Government Portal Integration</span>
                  Clicking the access button above redirects you securely to the official governmental portal. You can use your Aadhaar or DigiLocker profile details to authenticate.
                </div>
              </div>

            </div>
          )}
        </div>

      </div>
    </div>
  );
}
