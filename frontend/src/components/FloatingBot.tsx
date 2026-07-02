'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import {
  MessageSquare,
  X,
  Send,
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  Shield,
  Loader2,
  AlertOctagon,
  HeartHandshake
} from 'lucide-react';

export const FloatingBot: React.FC = () => {
  const { user, triggerEmergencySOS } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Array<{ role: 'user' | 'model'; text: string }>>([
    { role: 'model', text: 'Hello! I am your AI Emergency Government Navigator. How can I guide you today? Speak or type your concern.' }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [language, setLanguage] = useState('english');
  const [isRecording, setIsRecording] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [loading, setLoading] = useState(false);
  const [distressInfo, setDistressInfo] = useState<{ detected: boolean; helpline: string; info: string } | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);

  const API_URL = 'http://localhost:5000/api';

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen]);

  // Setup Web Speech Recognition
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (SpeechRecognition) {
        const rec = new SpeechRecognition();
        rec.continuous = false;
        rec.interimResults = false;
        
        // Map language locale codes
        const getLocale = (lang: string) => {
          switch (lang) {
            case 'hindi': return 'hi-IN';
            case 'kannada': return 'kn-IN';
            case 'tamil': return 'ta-IN';
            case 'telugu': return 'te-IN';
            default: return 'en-US';
          }
        };

        rec.lang = getLocale(language);

        rec.onresult = (event: any) => {
          const speechToText = event.results[0][0].transcript;
          setInputValue(speechToText);
          setIsRecording(false);
        };

        rec.onerror = (err: any) => {
          console.error('Speech recognition error:', err);
          setIsRecording(false);
        };

        rec.onend = () => {
          setIsRecording(false);
        };

        recognitionRef.current = rec;
      }
    }
  }, [language]);

  const handleSendMessage = async (text: string) => {
    if (!text.trim()) return;

    const newMessages: Array<{ role: 'user' | 'model'; text: string }> = [
      ...messages,
      { role: 'user' as 'user' | 'model', text }
    ];
    setMessages(newMessages);
    setInputValue('');
    setLoading(true);
    setErrorBanner(null);

    // Cancel speech synthesis if speaking
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }

    try {
      // 1. Check emotional distress
      const distressResponse = await fetch(`${API_URL}/ai/distress-check`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text })
      });
      const distressData = await distressResponse.json();

      if (distressData.distressDetected) {
        setDistressInfo({
          detected: true,
          helpline: 'Kiran Helpline: 1800-599-0019',
          info: distressData.actionSuggested
        });
      }

      // 2. Fetch Chat Response
      const response = await fetch(`${API_URL}/ai/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: text,
          history: messages,
          language
        })
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || 'Chat error');
      }

      const aiReply = data.response;
      setMessages((prev) => [...prev, { role: 'model', text: aiReply }]);
      
      // Auto Voice response if supported
      speakText(aiReply);
    } catch (err) {
      console.error(err);
      setMessages((prev) => [
        ...prev,
        { role: 'model', text: 'Sorry, I am facing connectivity issues. Please secure a stable network connection or call 112.' }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const [errorBanner, setErrorBanner] = useState<string | null>(null);

  const startListening = () => {
    if (!recognitionRef.current) {
      setErrorBanner('Speech recording not supported in this browser. Please use Chrome/Edge.');
      return;
    }
    setErrorBanner(null);
    setIsRecording(true);
    recognitionRef.current.start();
  };

  const stopListening = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      setIsRecording(false);
    }
  };

  const speakText = (text: string) => {
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      // Clean markdown characters for cleaner speech output
      const cleanText = text.replace(/[*#`_\-]/g, '');
      const utterance = new SpeechSynthesisUtterance(cleanText);
      
      // Select voice lang
      switch (language) {
        case 'hindi': utterance.lang = 'hi-IN'; break;
        case 'kannada': utterance.lang = 'kn-IN'; break;
        case 'tamil': utterance.lang = 'ta-IN'; break;
        case 'telugu': utterance.lang = 'te-IN'; break;
        default: utterance.lang = 'en-US';
      }

      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);
      
      setIsSpeaking(true);
      window.speechSynthesis.speak(utterance);
    }
  };

  const stopSpeaking = () => {
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }
  };

  const handleNotifyContacts = async () => {
    if (!user) {
      alert('Please login to notify your registered family members.');
      return;
    }

    try {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(async (pos) => {
          await triggerEmergencySOS('Emotional Distress & Panic', {
            lat: pos.coords.latitude,
            lng: pos.coords.longitude,
            address: 'GPS Verified Location from Distress Chatbot'
          });
          alert('Alert notifications sent to your registered contacts!');
          setDistressInfo(null);
        });
      }
    } catch (e) {
      alert('Failed to send alerts.');
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-45 flex flex-col items-end">
      
      {/* Bot Chat window */}
      {isOpen && (
        <div className="bg-slate-900 border border-slate-800 rounded-xl shadow-2xl w-[350px] sm:w-[400px] h-[500px] flex flex-col mb-4 overflow-hidden text-white transition-all duration-300">
          
          {/* Header Panel */}
          <div className="bg-slate-950 p-4 border-b border-slate-800 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              <Shield className="h-5 w-5 text-emerald-400" />
              <div className="flex flex-col">
                <span className="font-extrabold text-xs uppercase tracking-wide">Emergency Assistant</span>
                <span className="text-[9px] text-slate-400 font-medium">Multilingual Guide</span>
              </div>
            </div>

            {/* Language Selector */}
            <div className="flex items-center space-x-2">
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="bg-slate-850 border border-slate-700 text-[10px] rounded px-1.5 py-0.5 text-slate-300 focus:outline-none"
              >
                <option value="english">English</option>
                <option value="hindi">हिन्दी (Hindi)</option>
                <option value="kannada">ಕನ್ನಡ (Kannada)</option>
                <option value="tamil">தமிழ் (Tamil)</option>
                <option value="telugu">తెలుగు (Telugu)</option>
              </select>
              <button
                onClick={() => {
                  stopSpeaking();
                  setIsOpen(false);
                }}
                className="text-slate-400 hover:text-white"
              >
                <X className="h-4.5 w-4.5" />
              </button>
            </div>
          </div>

          {/* Distress banner warning */}
          {distressInfo && (
            <div className="bg-red-950/90 border-b border-red-800 p-3 text-xs text-red-300 flex items-start space-x-2 animate-pulse">
              <AlertOctagon className="h-4 w-4 shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="font-bold">Panic / Distress Detected</p>
                <p className="text-[10px] text-slate-300 mb-1.5">{distressInfo.info}</p>
                <div className="flex space-x-2">
                  <a
                    href="tel:18005990019"
                    className="bg-red-800 hover:bg-red-700 text-white px-2.5 py-1 rounded font-bold text-[9px] uppercase"
                  >
                    Call Helpline
                  </a>
                  {user && (
                    <button
                      onClick={handleNotifyContacts}
                      className="bg-slate-800 hover:bg-slate-700 text-emerald-400 border border-slate-750 px-2.5 py-1 rounded font-bold text-[9px] uppercase flex items-center space-x-1"
                    >
                      <HeartHandshake className="h-3 w-3" />
                      <span>Notify Contacts</span>
                    </button>
                  )}
                </div>
              </div>
              <button onClick={() => setDistressInfo(null)} className="text-red-400">
                <X className="h-3.5 w-3.5" />
              </button>
            </div>
          )}

          {/* Messages body scrolling */}
          <div className="flex-1 p-4 overflow-y-auto space-y-4 max-h-[350px]">
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`p-3 rounded-lg text-xs leading-relaxed max-w-[85%] ${
                    msg.role === 'user'
                      ? 'bg-emerald-600 text-white rounded-tr-none shadow-md'
                      : 'bg-slate-800 text-slate-200 rounded-tl-none border border-slate-750'
                  }`}
                >
                  <p className="whitespace-pre-wrap">{msg.text}</p>
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start">
                <div className="bg-slate-800 p-3 rounded-lg border border-slate-750 flex items-center space-x-1.5">
                  <Loader2 className="h-3.5 w-3.5 animate-spin text-emerald-400" />
                  <span className="text-[10px] text-slate-400">AI is mapping query...</span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Error Synthesizer Banner */}
          {errorBanner && (
            <p className="bg-amber-950 border-t border-amber-800 text-amber-300 text-[10px] px-3 py-1 font-semibold">
              {errorBanner}
            </p>
          )}

          {/* Footer input controller */}
          <div className="p-3 bg-slate-950 border-t border-slate-800 flex items-center space-x-2">
            {/* Audio Synthesis control */}
            {isSpeaking ? (
              <button
                onClick={stopSpeaking}
                className="p-2 rounded-full bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20"
                title="Mute Audio Response"
              >
                <Volume2 className="h-4.5 w-4.5 animate-bounce" />
              </button>
            ) : (
              <button
                onClick={() => speakText(messages[messages.length - 1].text)}
                className="p-2 rounded-full text-slate-400 hover:text-white"
                title="Speak Last Response"
              >
                <VolumeX className="h-4.5 w-4.5" />
              </button>
            )}

            {/* Speech-to-Text Recording control */}
            {isRecording ? (
              <button
                onClick={stopListening}
                className="p-2 rounded-full bg-red-650 text-white animate-pulse"
                title="Stop Recording"
              >
                <MicOff className="h-4.5 w-4.5" />
              </button>
            ) : (
              <button
                onClick={startListening}
                className="p-2 rounded-full bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white"
                title="Speak to Assistant"
              >
                <Mic className="h-4.5 w-4.5" />
              </button>
            )}

            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSendMessage(inputValue)}
              placeholder="Ask anything..."
              className="flex-1 bg-slate-900 border border-slate-850 rounded px-2.5 py-1.5 text-xs focus:outline-none focus:border-emerald-500 text-white placeholder-slate-600"
            />
            
            <button
              onClick={() => handleSendMessage(inputValue)}
              className="p-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded"
            >
              <Send className="h-4 w-4" />
            </button>
          </div>

        </div>
      )}

      {/* Floating Trigger button */}
      <button
        onClick={() => {
          stopSpeaking();
          setIsOpen(!isOpen);
        }}
        className="bg-emerald-600 hover:bg-emerald-750 text-white p-4 rounded-full shadow-2xl flex items-center justify-center border-2 border-emerald-500 hover:scale-[1.05] active:scale-[0.98] transition-all"
        title="Open Emergency AI Assistant"
      >
        <MessageSquare className="h-6 w-6 animate-pulse" />
      </button>

    </div>
  );
};
