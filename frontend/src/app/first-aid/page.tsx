'use client';

import React, { useState, useEffect } from 'react';
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
    <div className="gov-section-gray min-h-screen">
      <div className="gov-container flex flex-col justify-center py-8">
        
        {/* Title panel */}
        <div className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h1 className="gov-section-title flex items-center gap-2">
              <Activity className="h-7 w-7 text-[#CC0001] animate-pulse" />
              Voice-Guided Emergency First Aid
            </h1>
            <p className="gov-section-subtitle mb-0">
              Immediate medical instructions. Toggle voice guide to listen to verbal steps in your preferred language.
            </p>
          </div>

          {/* Language selection */}
          <div className="flex items-center gap-2 bg-white border border-gray-200 p-2 rounded shadow-sm shrink-0">
            <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Voice Language</span>
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="bg-gray-50 border border-gray-300 text-xs font-bold rounded px-2.5 py-1.5 text-gray-800 focus:outline-none focus:border-[#0057A8]"
            >
              <option value="english">English</option>
              <option value="hindi">हिन्दी (Hindi)</option>
            </select>
          </div>
        </div>

        {/* First Aid topics tabs selector */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2 border-b border-gray-200 pb-4 mb-6">
          {Object.keys(topics).map((key) => (
            <button
              key={key}
              onClick={() => setTopic(key)}
              className={`py-2 rounded text-[11px] font-bold uppercase border transition-colors ${
                topic === key
                  ? 'bg-[#CC0001] border-[#CC0001] text-white shadow-sm'
                  : 'bg-white border-gray-200 text-gray-600 hover:text-[#0057A8] hover:bg-blue-50'
              }`}
            >
              {topics[key].title.split(' ')[0]}
            </button>
          ))}
        </div>

        {/* Visual guide slide panel */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          
          {/* Left panel: Visual & Speech control */}
          <div className="lg:col-span-2 bg-white border border-gray-200 rounded p-6 shadow-sm border-t-4 border-t-[#CC0001]">
            
            {/* Visual slide card */}
            <div className="bg-red-50 p-8 rounded border border-red-100 text-center space-y-4 min-h-[260px] flex flex-col justify-center relative mb-6">
              <span className="absolute top-4 left-4 text-[10px] bg-white border border-red-200 text-[#CC0001] px-2 py-1 rounded font-bold tracking-wider">
                STEP {activeStep + 1} OF {stepsList.length}
              </span>
              <h2 className="font-bold text-lg sm:text-xl text-[#CC0001] uppercase tracking-wide px-4">
                {stepsList[activeStep].visualText}
              </h2>
              <p className="text-sm sm:text-base text-gray-800 leading-relaxed font-medium max-w-lg mx-auto">
                {stepsList[activeStep].text}
              </p>
            </div>

            {/* Audio Synthesis play buttons bar */}
            <div className="flex items-center justify-between bg-gray-50 p-4 border border-gray-200 rounded mb-4">
              <div className="flex items-center gap-4">
                <button
                  onClick={handlePlayVoice}
                  className={`p-3 rounded-full flex items-center justify-center transition-all shadow-sm ${
                    isPlaying
                      ? 'bg-[#FF6200] text-white animate-pulse'
                      : 'bg-[#1B2B6B] text-white hover:bg-[#0057A8]'
                  }`}
                  title={isPlaying ? 'Pause Voice' : 'Play Voice Instructions'}
                >
                  {isPlaying ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
                </button>
                <div className="text-left">
                  <span className="text-[10px] text-gray-500 font-bold uppercase tracking-wider block mb-0.5">Voice Assistant Status</span>
                  <span className={`text-sm font-bold ${isPlaying ? 'text-[#FF6200]' : 'text-[#1B2B6B]'}`}>
                    {isPlaying ? 'Speaking instruction...' : 'Voice guide muted'}
                  </span>
                </div>
              </div>

              {/* Reset */}
              <button
                onClick={handleReset}
                className="text-gray-400 hover:text-[#1B2B6B] p-2 hover:bg-gray-100 rounded transition-colors"
                title="Restart Guide"
              >
                <RotateCcw className="h-5 w-5" />
              </button>
            </div>

            {/* Next/Prev buttons */}
            <div className="flex justify-between items-center pt-2">
              <button
                onClick={handlePrev}
                disabled={activeStep === 0}
                className="gov-btn-outline px-5 py-2.5 disabled:opacity-50"
              >
                <ArrowLeft className="h-4 w-4" />
                <span>Previous Step</span>
              </button>

              <button
                onClick={handleNext}
                disabled={activeStep === stepsList.length - 1}
                className="gov-btn-primary px-6 py-2.5 disabled:opacity-50"
              >
                <span>Next Step</span>
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>

          </div>

          {/* Right panel: Information advisory */}
          <div className="flex flex-col gap-6">
            <div className="bg-white border border-gray-200 rounded p-6 shadow-sm border-t-4 border-t-[#0057A8]">
              <h3 className="text-xs font-bold text-[#1B2B6B] uppercase tracking-widest flex items-center gap-1.5 mb-3">
                <BookOpen className="h-4 w-4 text-[#0057A8]" />
                <span>First Aid Overview</span>
              </h3>
              <p className="text-sm text-gray-700 leading-relaxed mb-4">
                You are currently viewing instructions for <strong className="text-gray-900">{activeTopic.title}</strong>. These guidelines are compiled from official medical guidelines.
              </p>
              <div className="bg-blue-50 p-4 border border-blue-100 rounded text-xs leading-relaxed text-gray-800">
                <span className="font-bold text-[#0057A8] uppercase block mb-1">Stayin' Alive Beat Rule</span>
                During CPR, deliver compressions at a tempo of 100 to 120 compressions per minute. Sing the chorus of the popular song "Stayin' Alive" to maintain the correct rhythmic interval.
              </div>
            </div>

            <div className="gov-notice gov-notice-danger flex items-start gap-3">
              <Info className="h-5 w-5 text-[#CC0001] mt-0.5 shrink-0" />
              <div className="text-sm text-[#990000] leading-relaxed">
                <span className="font-bold uppercase block mb-1">DISCLAIMER NOTICE</span>
                First aid guides are meant for provisional stabilization only. Always dispatch emergency medical services at <strong className="font-mono text-base bg-[#CC0001] text-white px-1.5 py-0.5 rounded ml-1">108</strong> or <strong className="font-mono text-base bg-[#CC0001] text-white px-1.5 py-0.5 rounded ml-1">112</strong> immediately.
              </div>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
