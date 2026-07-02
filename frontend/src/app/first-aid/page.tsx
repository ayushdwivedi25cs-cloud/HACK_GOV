'use client';

import React, { useState, useEffect } from 'react';
import { Navbar } from '../../components/Navbar';
import { FloatingBot } from '../../components/FloatingBot';
import {
  Activity,
  Volume2,
  VolumeX,
  Play,
  Pause,
  ArrowRight,
  ArrowLeft,
  RotateCcw,
  BookOpen,
  Info
} from 'lucide-react';

interface FirstAidTopic {
  title: string;
  steps: { text: string; visualText: string }[];
  stepsHindi: { text: string; visualText: string }[];
}

export default function FirstAidPage() {
  const [topic, setTopic] = useState<string>('cpr');
  const [activeStep, setActiveStep] = useState<number>(0);
  const [language, setLanguage] = useState<string>('english');
  const [isPlaying, setIsPlaying] = useState<boolean>(false);

  const topics: Record<string, FirstAidTopic> = {
    cpr: {
      title: 'Cardiopulmonary Resuscitation (CPR)',
      steps: [
        { text: 'Verify response. Tap the shoulders and ask loudly, "Are you okay?". Call 108 immediately if there is no response.', visualText: 'Check Responsiveness & Call 108' },
        { text: 'Place the heel of one hand in the center of the victim\'s chest, and interlock your other hand on top.', visualText: 'Position Hands on Chest Center' },
        { text: 'Push hard and fast in the center of the chest. Maintain a rate of 100 to 120 compressions per minute (to the beat of Stayin\' Alive). Push down at least 2 inches.', visualText: 'Deliver Compressions (100-120/min)' },
        { text: 'Open the airway. Tilt the head back slightly, pinch the nose, and give 2 gentle rescue breaths after every 30 compressions.', visualText: 'Airway Tilt & Deliver Rescue Breaths' }
      ],
      stepsHindi: [
        { text: 'प्रतिक्रिया की जांच करें। कंधों को थपथपाएं और जोर से पूछें, "क्या आप ठीक हैं?"। कोई प्रतिक्रिया न होने पर तुरंत 108 पर कॉल करें।', visualText: 'प्रतिक्रिया की जांच करें और 108 पर कॉल करें' },
        { text: 'पीड़ित की छाती के केंद्र में एक हाथ की हथेली रखें, और दूसरे हाथ की उंगलियों को आपस में फंसा लें।', visualText: 'हथेली को छाती के बीच में रखें' },
        { text: 'छाती के केंद्र में जोर से और तेजी से दबाएं। प्रति मिनट 100 से 120 कंप्रेशन की दर बनाए रखें। कम से कम 2 इंच नीचे दबाएं।', visualText: 'तेजी से दबाएं (100-120 बार/मिनट)' },
        { text: 'हवा का रास्ता खोलें। सिर को थोड़ा पीछे झुकाएं, नाक बंद करें, और हर 30 कंप्रेशन के बाद 2 बार फूंक मारें।', visualText: 'सिर झुकाएं और सांस दें' }
      ]
    },
    choking: {
      title: 'Choking Assistance (Heimlich Maneuver)',
      steps: [
        { text: 'Stand behind the person, wrap your arms around their waist, and locate the navel.', visualText: 'Stand Behind and Wrap Arms' },
        { text: 'Make a fist with one hand and place the thumb side slightly above the person\'s navel, well below the breastbone.', visualText: 'Place Fist Above Navel' },
        { text: 'Grasp the fist with your other hand and perform quick, upward, and inward thrusts until the object is expelled.', visualText: 'Deliver Inward/Upward Thrusts' }
      ],
      stepsHindi: [
        { text: 'व्यक्ति के पीछे खड़े हों, अपने हाथों को उनकी कमर के चारों ओर लपेटें, और नाभि का पता लगाएं।', visualText: 'पीछे खड़े होकर कमर लपेटें' },
        { text: 'एक हाथ से मुट्ठी बनाएं और अंगूठे की तरफ नाभि से थोड़ा ऊपर, छाती की हड्डी से काफी नीचे रखें।', visualText: 'नाभि के ऊपर मुट्ठी रखें' },
        { text: 'दूसरे हाथ से मुट्ठी को पकड़ें और त्वरित, ऊपर की ओर और अंदर की ओर जोर से धक्का दें जब तक कि फंसी वस्तु बाहर न निकल जाए।', visualText: 'ऊपर और अंदर की ओर दबाएं' }
      ]
    },
    burn: {
      title: 'Burn Wound Treatment',
      steps: [
        { text: 'Immediately cool the burn under cool running water for at least 10 to 20 minutes. Do not use ice.', visualText: 'Cool Under Running Water' },
        { text: 'Remove rings or tight items from the burned area gently before swelling starts.', visualText: 'Gently Remove Tight Ornaments' },
        { text: 'Apply a sterile, non-adhesive bandage or clean cloth. Avoid applying butter, oils, or toothpaste.', visualText: 'Apply Clean Bandage (No Oils/Toothpaste)' }
      ],
      stepsHindi: [
        { text: 'तुरंत कम से कम 10 से 20 मिनट के लिए ठंडे बहते पानी के नीचे जले हुए हिस्से को ठंडा करें। बर्फ का प्रयोग न करें।', visualText: 'बहते पानी के नीचे ठंडा करें' },
        { text: 'सूजन शुरू होने से पहले जले हुए क्षेत्र से अंगूठियां या तंग चीजें धीरे से हटा दें।', visualText: 'तंग गहने/सामान हटा दें' },
        { text: 'एक साफ, गैर-चिपकने वाली पट्टी या साफ कपड़ा लपेटें। मक्खन, तेल या टूथपेस्ट लगाने से बचें।', visualText: 'साफ पट्टी बांधें (तेल/टूथपेस्ट न लगाएं)' }
      ]
    },
    snake: {
      title: 'Snake Bite Response Protocol',
      steps: [
        { text: 'Keep the victim calm and completely still. Immobilize the bitten limb to slow the spread of venom.', visualText: 'Keep Victim Calm & Still' },
        { text: 'Remove any jewelry or tight clothing before swelling sets in. Keep the bite level below the heart.', visualText: 'Remove Rings & Keep Below Heart' },
        { text: 'Do NOT cut the wound, do NOT try to suck the venom out, and do NOT apply tourniquets. Transport to hospital immediately.', visualText: 'Do NOT Cut/Suck Venom. Rush to Hospital' }
      ],
      stepsHindi: [
        { text: 'पीड़ित को शांत और बिल्कुल स्थिर रखें। जहर के फैलाव को धीमा करने के लिए काटे गए अंग को हिलाने से रोकें।', visualText: 'शांत और बिल्कुल स्थिर रखें' },
        { text: 'सूजन शुरू होने से पहले कोई भी गहने या तंग कपड़े उतार दें। घाव को दिल के स्तर से नीचे रखें।', visualText: 'गहने उतारें और दिल के नीचे रखें' },
        { text: 'घाव को न काटें, जहर चूसने की कोशिश न करें, और पट्टी से रक्त प्रवाह न रोकें। तुरंत अस्पताल ले जाएं।', visualText: 'घाव न काटें/न चूसें। तुरंत अस्पताल ले जाएं' }
      ]
    },
    bleeding: {
      title: 'Severe Bleeding Control',
      steps: [
        { text: 'Apply direct, firm pressure on the wound using a clean sterile bandage or cloth.', visualText: 'Apply Direct Pressure with Clean Cloth' },
        { text: 'If the bleeding does not stop, add more bandages on top. Do not remove the original bandage.', visualText: 'Add Extra Layers (Do Not Remove First Layer)' },
        { text: 'Elevate the injured limb above the level of the heart if possible, keeping pressure steady.', visualText: 'Elevate Limb Above Heart Level' }
      ],
      stepsHindi: [
        { text: 'एक साफ रोगाणुहीन पट्टी या कपड़े का उपयोग करके घाव पर सीधा, मजबूत दबाव डालें।', visualText: 'साफ कपड़े से सीधा दबाव डालें' },
        { text: 'यदि रक्तस्राव नहीं रुकता है, तो ऊपर से और पट्टियां जोड़ें। मूल पट्टी को न हटाएं।', visualText: 'अतिरिक्त परतें जोड़ें (पहली परत न हटाएं)' },
        { text: 'यदि संभव हो तो घायल अंग को दिल के स्तर से ऊपर उठाएं, दबाव को स्थिर रखें।', visualText: 'अंग को दिल के स्तर से ऊपर उठाएं' }
      ]
    },
    fracture: {
      title: 'Fracture & Bone Injury Protocol',
      steps: [
        { text: 'Do not try to realign the bone. Keep the injured area completely still.', visualText: 'Do Not Move or Realign Bone' },
        { text: 'Apply a splint (using rolled newspapers, wood, or cardboard) above and below the joint to immobilize it.', visualText: 'Apply Splint to Immobilize Joint' },
        { text: 'Apply cold packs wrapped in a cloth to reduce swelling. Do not apply ice directly to the skin.', visualText: 'Apply Cold Pack wrapped in cloth' }
      ],
      stepsHindi: [
        { text: 'हड्डी को सीधा करने की कोशिश न करें। घायल क्षेत्र को पूरी तरह से स्थिर रखें।', visualText: 'हड्डी हिलाने या सीधा करने का प्रयास न करें' },
        { text: 'हड्डी को स्थिर करने के लिए जोड़ के ऊपर और नीचे एक खपच्ची (अखबार, लकड़ी या कार्डबोर्ड का उपयोग करके) लगाएं।', visualText: 'स्थिर करने के लिए खपच्ची/सपोर्ट लगाएं' },
        { text: 'सूजन कम करने के लिए कपड़े में लपेटकर बर्फ की सिकाई करें। सीधे त्वचा पर बर्फ न लगाएं।', visualText: 'कपड़े में लपेटकर ठंडी सिकाई करें' }
      ]
    }
  };

  const activeTopic = topics[topic];
  const stepsList = language === 'hindi' ? activeTopic.stepsHindi : activeTopic.steps;

  // Web Speech Synthesis
  const speakStep = (stepIndex: number) => {
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      window.speechSynthesis.cancel(); // Cancel active speech

      const textToSpeak = stepsList[stepIndex].text;
      const utterance = new SpeechSynthesisUtterance(textToSpeak);
      
      utterance.lang = language === 'hindi' ? 'hi-IN' : 'en-US';
      utterance.onend = () => setIsPlaying(false);
      utterance.onerror = () => setIsPlaying(false);

      setIsPlaying(true);
      window.speechSynthesis.speak(utterance);
    }
  };

  const handlePlayVoice = () => {
    if (isPlaying) {
      if (typeof window !== 'undefined' && window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
      setIsPlaying(false);
    } else {
      speakStep(activeStep);
    }
  };

  const handleNext = () => {
    if (activeStep < stepsList.length - 1) {
      const nextStep = activeStep + 1;
      setActiveStep(nextStep);
      if (isPlaying) speakStep(nextStep);
    }
  };

  const handlePrev = () => {
    if (activeStep > 0) {
      const prevStep = activeStep - 1;
      setActiveStep(prevStep);
      if (isPlaying) speakStep(prevStep);
    }
  };

  const handleReset = () => {
    setActiveStep(0);
    if (isPlaying) speakStep(0);
  };

  // Mute audio synthesis on tab change
  useEffect(() => {
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
    setIsPlaying(false);
    setActiveStep(0);
  }, [topic, language]);

  return (
    <main className="min-h-screen bg-slate-950 text-white flex flex-col">
      <Navbar onTriggerWomensSOS={() => {}} />

      <div className="flex-1 max-w-5xl w-full mx-auto px-4 py-8 space-y-8 flex flex-col justify-center">
        
        {/* Title panel */}
        <div className="mb-4 text-center md:text-left flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h1 className="font-extrabold text-2xl sm:text-3xl uppercase tracking-wider text-white flex items-center justify-center md:justify-start space-x-2">
              <Activity className="h-7 w-7 text-red-500 animate-pulse" />
              <span>Voice-Guided Emergency First Aid</span>
            </h1>
            <p className="text-xs text-slate-400 mt-1">
              Immediate medical instructions. Toggle voice guide to listen to verbal steps in your preferred language.
            </p>
          </div>

          {/* Language selection */}
          <div className="flex items-center justify-center space-x-2 bg-slate-900 border border-slate-850 p-2 rounded-lg">
            <span className="text-[10px] font-bold text-slate-450 uppercase tracking-widest">Synthesis Language</span>
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="bg-slate-950 border border-slate-800 text-xs font-bold rounded px-2.5 py-1 text-white focus:outline-none"
            >
              <option value="english">English (US/UK)</option>
              <option value="hindi">हिन्दी (Hindi)</option>
            </select>
          </div>
        </div>

        {/* First Aid topics tabs selector */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2 border-b border-slate-850 pb-4">
          {Object.keys(topics).map((key) => (
            <button
              key={key}
              onClick={() => setTopic(key)}
              className={`py-2 rounded-lg text-xs font-extrabold uppercase border transition-all ${
                topic === key
                  ? 'bg-red-600 border-red-500 text-white shadow shadow-red-950 scale-[1.02]'
                  : 'bg-slate-900 border-slate-850 text-slate-400 hover:text-slate-300'
              }`}
            >
              {topics[key].title.split(' ')[0]}
            </button>
          ))}
        </div>

        {/* Visual guide slide panel */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
          
          {/* Left panel: Visual & Speech control */}
          <div className="md:col-span-2 bg-slate-900 border border-slate-850 rounded-xl p-6 shadow-xl space-y-6">
            
            {/* Visual slide card */}
            <div className="bg-slate-950 p-8 rounded-xl border border-slate-850 text-center space-y-4 min-h-[220px] flex flex-col justify-center relative">
              <span className="absolute top-4 left-4 text-[10px] bg-slate-900 text-slate-450 px-2 py-0.5 rounded font-mono font-bold">
                STEP {activeStep + 1} OF {stepsList.length}
              </span>
              <h2 className="font-extrabold text-base sm:text-xl text-emerald-400 uppercase tracking-wide px-4">
                {stepsList[activeStep].visualText}
              </h2>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-semibold max-w-md mx-auto">
                {stepsList[activeStep].text}
              </p>
            </div>

            {/* Audio Synthesis play buttons bar */}
            <div className="flex items-center justify-between bg-slate-950 p-3.5 border border-slate-850 rounded-lg">
              <div className="flex items-center space-x-2">
                <button
                  onClick={handlePlayVoice}
                  className={`p-3 rounded-full flex items-center justify-center transition-all ${
                    isPlaying
                      ? 'bg-red-655 text-white animate-pulse'
                      : 'bg-emerald-600 text-white hover:bg-emerald-700'
                  }`}
                  title={isPlaying ? 'Pause Voice' : 'Play Voice Instructions'}
                >
                  {isPlaying ? <Pause className="h-4.5 w-4.5" /> : <Play className="h-4.5 w-4.5" />}
                </button>
                <div className="text-left">
                  <span className="text-[9px] text-slate-450 font-bold uppercase tracking-wider block">Voice Assistant status</span>
                  <span className="text-xs font-bold text-white">
                    {isPlaying ? 'Speaking instruction...' : 'Voice guide muted'}
                  </span>
                </div>
              </div>

              {/* Reset */}
              <button
                onClick={handleReset}
                className="text-slate-400 hover:text-white p-2"
                title="Restart Guide"
              >
                <RotateCcw className="h-4.5 w-4.5" />
              </button>
            </div>

            {/* Next/Prev buttons */}
            <div className="flex justify-between items-center pt-2">
              <button
                onClick={handlePrev}
                disabled={activeStep === 0}
                className="border border-slate-800 text-slate-350 hover:bg-slate-950 px-4 py-2.5 rounded-lg text-xs font-bold flex items-center space-x-1.5 disabled:opacity-30 transition-all"
              >
                <ArrowLeft className="h-4 w-4" />
                <span>Previous Step</span>
              </button>

              <button
                onClick={handleNext}
                disabled={activeStep === stepsList.length - 1}
                className="bg-slate-950 hover:bg-slate-850 text-white border border-slate-800 px-4 py-2.5 rounded-lg text-xs font-bold flex items-center space-x-1.5 disabled:opacity-30 transition-all"
              >
                <span>Next Step</span>
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>

          </div>

          {/* Right panel: Information advisory */}
          <div className="space-y-6">
            <div className="bg-slate-900 border border-slate-850 rounded-xl p-6 shadow-xl space-y-4">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center space-x-1.5">
                <BookOpen className="h-4.5 w-4.5 text-emerald-400" />
                <span>First Aid Overview</span>
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                You are currently viewing instructions for <strong className="text-white">{activeTopic.title}</strong>. These guidelines are compiled from official ambulance guidelines.
              </p>
              <div className="bg-slate-950 p-3 border border-slate-850 rounded text-[11px] leading-relaxed text-slate-400">
                <span className="font-bold text-white uppercase block mb-1">Stayin' Alive Beat Rule</span>
                During CPR, deliver compressions at a tempo of 100 to 120 compressions per minute. Sing the chorus of the popular song "Stayin' Alive" by the Bee Gees to maintain the correct rhythmic interval.
              </div>
            </div>

            <div className="bg-slate-900 border border-slate-850 p-4 rounded-xl flex items-start space-x-3">
              <Info className="h-5 w-5 text-emerald-500 mt-0.5 shrink-0" />
              <div className="text-xs text-slate-400 leading-relaxed">
                <span className="font-bold text-white uppercase block mb-0.5">DISCLAIMER NOTICE</span>
                First aid guides are meant for provisional stabilization only. Always dispatch emergency medical services at <strong className="text-white">108</strong> or <strong className="text-white">102</strong> immediately.
              </div>
            </div>
          </div>

        </div>

      </div>
      <FloatingBot />
    </main>
  );
}
