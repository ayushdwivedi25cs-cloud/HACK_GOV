import dotenv from 'dotenv';

dotenv.config();

const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent';

export class AIService {
  private static getApiKey(): string | undefined {
    return process.env.GEMINI_API_KEY;
  }

  /**
   * Universal fetch helper for Gemini API
   */
  private static async callGemini(prompt: string, systemInstruction?: string): Promise<string> {
    const apiKey = this.getApiKey();
    if (!apiKey) {
      throw new Error('GEMINI_API_KEY not configured');
    }

    try {
      const url = `${GEMINI_API_URL}?key=${apiKey}`;
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          ...(systemInstruction ? {
            systemInstruction: { parts: [{ text: systemInstruction }] }
          } : {})
        })
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Gemini API Error details:', errorText);
        throw new Error(`Gemini API error: ${response.statusText}`);
      }

      const data = await response.json() as any;
      return data.candidates?.[0]?.content?.parts?.[0]?.text || 'No response generated from AI.';
    } catch (error) {
      console.error('Error calling Gemini API:', error);
      throw error;
    }
  }

  /**
   * 1. Multi-lingual Chat Bot Assistant
   */
  public static async getChatResponse(message: string, history: { role: string; text: string }[], language: string = 'english'): Promise<string> {
    const apiKey = this.getApiKey();
    const sysInstruction = `You are the official AI Emergency Government Navigator Chatbot. 
Your goal is to guide citizens who are lost, in danger, or need to navigate government procedures.
Provide steps, helplines, or procedures in a calm, clear, and reassuring tone.
The current language of communication selected by the user is: ${language}. Answer in that language if possible.
Keep responses concise, clear, and structured with bullet points. Do not make up facts.`;

    if (!apiKey) {
      return this.mockChatResponse(message, language);
    }

    const formattedHistory = history.map(h => `${h.role === 'user' ? 'Citizen' : 'Navigator'}: ${h.text}`).join('\n');
    const prompt = `${formattedHistory}\nCitizen: ${message}\nNavigator:`;

    try {
      return await this.callGemini(prompt, sysInstruction);
    } catch (e) {
      console.warn('Gemini API failed or is not available. Using mock fallback.', e);
      return this.mockChatResponse(message, language);
    }
  }

  /**
   * 2. AI Emergency Classifier
   */
  public static async classifyIncident(text: string): Promise<{
    category: string;
    helpline: string;
    firProcess: string;
    procedure: string;
  }> {
    const apiKey = this.getApiKey();
    const prompt = `Classify this user statement into exactly one of these categories:
- Cyber Crime
- Medical Emergency
- Women's Safety
- Fraud
- Fire
- Disaster
- Missing Person
- Violence
- Property Loss
- Other Emergency

Also extract the appropriate Indian emergency helpline, file complaint process details, and short immediate procedure steps.
Format the output as a valid JSON object with the keys: category, helpline, firProcess, procedure. Do not include markdown tags except the json structure itself.`;

    if (!apiKey) {
      return this.mockClassification(text);
    }

    try {
      const response = await this.callGemini(`${prompt}\n\nUser input: "${text}"`, "You are a backend classifier returning JSON only.");
      const cleaned = response.replace(/```json/g, '').replace(/```/g, '').trim();
      return JSON.parse(cleaned);
    } catch (e) {
      console.warn('Gemini classification failed. Using mock fallback.', e);
      return this.mockClassification(text);
    }
  }

  /**
   * 3. AI Scam Detection Assistant
   */
  public static async analyzeScam(content: string): Promise<{
    status: 'SAFE' | 'SUSPICIOUS' | 'HIGH RISK';
    probability: number;
    indicators: string[];
    explanation: string;
  }> {
    const apiKey = this.getApiKey();
    const prompt = `Analyze this message (could be an SMS, WhatsApp, Email, or raw text) for potential scams, phishing, or fraud.
Analyze fraud probability, suspicious indicators, and phishing elements.
Format the output as a JSON object with these keys:
- status: "SAFE" | "SUSPICIOUS" | "HIGH RISK"
- probability: a number from 0 to 100
- indicators: array of strings containing specific warning signs
- explanation: a detailed paragraph explanation.
Output JSON only.`;

    if (!apiKey) {
      return this.mockScamAnalysis(content);
    }

    try {
      const response = await this.callGemini(`${prompt}\n\nMessage content:\n"${content}"`, "Return JSON only.");
      const cleaned = response.replace(/```json/g, '').replace(/```/g, '').trim();
      return JSON.parse(cleaned);
    } catch (e) {
      console.warn('Gemini scam analysis failed. Using mock fallback.', e);
      return this.mockScamAnalysis(content);
    }
  }

  /**
   * 4. Emotional Distress Detection
   */
  public static async detectDistress(text: string): Promise<{
    distressDetected: boolean;
    level: 'none' | 'moderate' | 'severe';
    actionSuggested: string;
  }> {
    const apiKey = this.getApiKey();
    const prompt = `Analyze the user's input text for signs of extreme panic, emotional distress, anxiety, or confusion.
Output a JSON object with keys:
- distressDetected: true or false
- level: "none" | "moderate" | "severe"
- actionSuggested: supportive advice or suggestion of helpline.
Output JSON only.`;

    if (!apiKey) {
      return this.mockDistressDetection(text);
    }

    try {
      const response = await this.callGemini(`${prompt}\n\nUser input: "${text}"`, "Return JSON only.");
      const cleaned = response.replace(/```json/g, '').replace(/```/g, '').trim();
      return JSON.parse(cleaned);
    } catch (e) {
      return this.mockDistressDetection(text);
    }
  }

  // --- MOCK FALLBACK IMPLEMENTATIONS ---

  private static mockChatResponse(message: string, language: string): string {
    const msg = message.toLowerCase();
    const isHindi = language === 'hindi';

    if (msg.includes('aadhaar')) {
      if (isHindi) {
        return `**खोया हुआ आधार कार्ड (Aadhaar Card) पुनर्प्राप्त करने के चरण:**\n1. आधिकारिक UIDAI वेबसाइट (uidai.gov.in) पर जाएं।\n2. 'Retrieve Lost UID/EID' विकल्प चुनें।\n3. अपना नाम, मोबाइल नंबर और ईमेल दर्ज करें।\n4. OTP दर्ज करें और अपने फोन पर आधार नंबर प्राप्त करें।\n5. इसके बाद, आप e-Aadhaar डाउनलोड कर सकते हैं।\n\n*अपेक्षित समय:* 10-15 मिनट | *आवश्यक दस्तावेज:* आधार से लिंक मोबाइल नंबर।`;
      }
      return `**Steps to Retrieve Lost Aadhaar Card:**\n1. Visit the official UIDAI website (uidai.gov.in).\n2. Select the 'Retrieve Lost UID/EID' option under My Aadhaar.\n3. Enter your full name, registered mobile number, and email.\n4. Complete the OTP verification. Your Aadhaar number (UID) will be sent to your phone.\n5. Use the UID to download your digital e-Aadhaar PDF.\n\n*Expected Timeline:* 10-15 mins | *Documents Required:* Registered Mobile Number.`;
    }

    if (msg.includes('pan')) {
      return `**Steps to Replace Lost PAN Card:**\n1. Go to the NSDL or UTITSL online portal for PAN replacement.\n2. Click "Reprint PAN Card" (charge of ₹50 within India).\n3. Fill in your PAN number, Aadhaar number, and DOB.\n4. Complete authentication via Aadhaar OTP.\n5. The physical card will be dispatched to your registered address.\n\n*Expected Timeline:* 7 to 10 working days | *Documents Required:* Aadhaar card.`;
    }

    if (msg.includes('license') || msg.includes('driving')) {
      return `**Steps to apply for Duplicate Driving License (DL):**\n1. Visit the Sarathi Parivahan portal (sarathi.parivahan.gov.in).\n2. Choose your state and click "Apply for Duplicate DL".\n3. Enter your DL number and date of birth.\n4. Fill in the application form, upload a copy of the lost DL (if available) and an FIR copy (mandatory in most states for lost DL).\n5. Pay the online fee (approx ₹200-₹400) and download the receipt.\n\n*Expected Timeline:* 15-30 days | *Documents Required:* LLD application, FIR Copy, Address Proof, Original DL copy (optional).`;
    }

    if (msg.includes('scam') || msg.includes('scammed') || msg.includes('fraud') || msg.includes('money')) {
      return `**Steps for Online Financial Fraud / Cyber Scam:**\n1. **IMMEDIATE ACTION**: Call the national cybercrime helpline at **1930** within 2 hours to block the transaction.\n2. File a complaint online at the official portal: **cybercrime.gov.in**.\n3. Keep screenshots of the scam chat, transaction proofs, and banking statements ready.\n4. Visit your local bank branch and submit a written dispute form.\n\n*Expected Timeline:* Initial blocking within 2-24 hours | *Official Link:* [cybercrime.gov.in](https://cybercrime.gov.in)`;
    }

    if (msg.includes('flood') || msg.includes('water') || msg.includes('disaster')) {
      return `**Emergency Flood Guidance:**\n1. Move to higher ground or upper floors immediately. Avoid walking/driving through floodwaters.\n2. Turn off the main electrical switch and LPG gas cylinders to prevent electrocution and fire.\n3. Drink boiled/bottled water only. Keep emergency helpline numbers handy.\n4. Call **108** (Medical) or **1078** (National Disaster Management Authority - NDMA).\n\n*Nearby Relief Camps*: Check the 'Disaster Mode' tab on our navigation panel for live shelter maps.`;
    }

    if (msg.includes('earthquake') || msg.includes('tremor') || msg.includes('seismic')) {
      return `**Earthquake Safety Procedure (Drop-Cover-Hold):**\n1. **DROP** to your hands and knees immediately to avoid being knocked down.\n2. **COVER** your head and neck with your arms. Shelter under a sturdy desk/table if nearby.\n3. **HOLD ON** until shaking completely stops — do not attempt to run outside during shaking.\n4. After shaking stops, evacuate calmly via stairs (NOT elevators). Check for gas leaks.\n5. Call **1078** (NDMA) or **112** to report injuries or structural collapses.\n\n*After an earthquake*: Stay away from damaged buildings. Expect aftershocks. Listen to All India Radio for official advisories.`;
    }

    if (msg.includes('choking') || msg.includes('heimlich') || msg.includes('first aid') || msg.includes('first-aid') || msg.includes('cpr') || msg.includes('chest compression') || msg.includes('heart attack')) {
      return `**Emergency First Aid Guidance:**\n\n**If choking (Heimlich Maneuver):**\n1. Stand behind the person and wrap your arms around their waist.\n2. Make a fist just above the navel. Grasp with your other hand.\n3. Give 5 firm upward thrusts until the object is dislodged.\n\n**If cardiac arrest (CPR):**\n1. Call 108 immediately. Put the phone on speaker.\n2. Place heel of hand on centre of chest. Interlock fingers.\n3. Compress hard and fast — 30 compressions at 2 per second.\n4. Give 2 rescue breaths. Continue until ambulance arrives.\n\n*Visit our AI First Aid Guide* for step-by-step voice-guided instructions on 10+ emergencies.`;
    }

    if (isHindi) {
      return `नमस्ते! मैं आपका सरकारी आपातकालीन मार्गदर्शक सहायक हूँ। मैं आपकी सहायता कैसे कर सकता हूँ? आप मुझसे पूछ सकते हैं:\n- "मेरा आधार कार्ड खो गया है"\n- "मेरे साथ ऑनलाइन धोखाधड़ी हुई है"\n- "बाढ़ के दौरान सुरक्षा निर्देश क्या हैं?"\n- "हार्ट अटैक या सीपीआर के लिए प्राथमिक चिकित्सा निर्देश"`;
    }
    return `Hello! I am your AI Government Emergency Navigator. I can assist you with emergency response directions, public safety advisories, and step-by-step government procedures.\n\nTry asking:\n- *"I lost my driving license."*\n- *"I was scammed online."*\n- *"What are the first-aid steps for choking?"*\n- *"What should I do during an earthquake?"*`;
  }

  private static mockClassification(text: string): {
    category: string;
    helpline: string;
    firProcess: string;
    procedure: string;
  } {
    const input = text.toLowerCase();

    if (input.includes('cyber') || input.includes('scam') || input.includes('hack') || input.includes('money') || input.includes('phish')) {
      return {
        category: 'Cyber Crime',
        helpline: '1930 (National Cyber Crime Helpline)',
        firProcess: 'Report online at cybercrime.gov.in or visit the nearest cyber crime cell.',
        procedure: '1. Call 1930 immediately to freeze bank transfers. 2. Capture screenshots of transactions and messages. 3. Download bank statements. 4. Register a formal complaint at cybercrime.gov.in.'
      };
    }

    if (input.includes('accident') || input.includes('road') || input.includes('car crash')) {
      return {
        category: 'Accident',
        helpline: '112 / 102 (Ambulance) / 1033 (National Highways)',
        firProcess: 'File an FIR at the local jurisdiction police station covering the accident site.',
        procedure: '1. Safely pull over and switch on hazard lights. 2. Check for injuries and call 112/102. 3. Document the vehicle numbers and take photos. 4. Note down contacts of eyewitnesses.'
      };
    }

    if (input.includes('women') || input.includes('harass') || input.includes('eve teasing') || input.includes('stalk')) {
      return {
        category: "Women's Safety",
        helpline: '1091 (Women Helpline) / 181 (Domestic Violence)',
        firProcess: 'Report through the State Police Women safety app or visit local police station.',
        procedure: '1. Activate the Women\'s Safety SOS button on this portal. 2. Seek a crowded public place. 3. Call 1091 or 112. 4. Share live location with your emergency contacts.'
      };
    }

    if (input.includes('fire') || input.includes('smoke') || input.includes('burn')) {
      return {
        category: 'Fire',
        helpline: '101 (Fire Services) / 112',
        firProcess: 'Usually handled directly by emergency response, follow-up FIR done via local police station.',
        procedure: '1. Evacuate the building immediately using stairs, NOT elevators. 2. Alert others by shouting. 3. Crawl low under smoke to breathe better. 4. Call 101 once you are in a safe area.'
      };
    }

    if (input.includes('missing') || input.includes('kidnap') || input.includes('lost person')) {
      return {
        category: 'Missing Person',
        helpline: '1098 (Childline) / 100 / 112',
        firProcess: 'Submit a missing person report at the local police station immediately (no 24-hr wait rule applies for children/vulnerable).',
        procedure: '1. Search immediate surroundings. 2. Keep a clear, recent photo ready. 3. Create a Missing Person poster using our portal tool. 4. File a complaint with the police and distribute posters.'
      };
    }

    if (input.includes('medical') || input.includes('heart') || input.includes('stroke') || input.includes('bleed') || input.includes('cpr')) {
      return {
        category: 'Medical Emergency',
        helpline: '108 / 102 (Ambulance)',
        firProcess: 'Hospital MLC (Medico-Legal Case) registration done automatically if it is a trauma case.',
        procedure: '1. Check responsiveness and breathing. 2. Call 108 immediately. 3. If unconscious and not breathing, start CPR. 4. Control severe bleeding by applying direct pressure.'
      };
    }

    return {
      category: 'Other Emergency',
      helpline: '112 (National Emergency Number)',
      firProcess: 'File complaint at local police station or via state online e-FIR system.',
      procedure: '1. Remain calm. 2. Ensure personal safety. 3. Call 112. 4. Follow guidance from authorities.'
    };
  }

  private static mockScamAnalysis(content: string): {
    status: 'SAFE' | 'SUSPICIOUS' | 'HIGH RISK';
    probability: number;
    indicators: string[];
    explanation: string;
  } {
    const input = content.toLowerCase();
    const indicators: string[] = [];
    let probability = 10;

    if (input.includes('otp') || input.includes('one time password') || input.includes('share pin')) {
      indicators.push('Asks for confidential credentials/OTP');
      probability += 30;
    }
    if (input.includes('win') || input.includes('lottery') || input.includes('crore') || input.includes('lakh') || input.includes('prize')) {
      indicators.push('Unrealistic financial reward promises');
      probability += 25;
    }
    if (input.includes('urgent') || input.includes('immediately') || input.includes('block your account') || input.includes('within 24 hours')) {
      indicators.push('Urgency tactics designed to trigger panic');
      probability += 20;
    }
    if (input.includes('http') && !input.includes('.gov.in') && !input.includes('.nic.in') && (input.includes('bit.ly') || input.includes('tinyurl') || input.includes('pay-') || input.includes('kyc'))) {
      indicators.push('Suspicious URL shortener or unofficial domain link');
      probability += 20;
    }

    let status: 'SAFE' | 'SUSPICIOUS' | 'HIGH RISK' = 'SAFE';
    if (probability > 60) {
      status = 'HIGH RISK';
    } else if (probability > 25) {
      status = 'SUSPICIOUS';
    }

    return {
      status,
      probability: Math.min(probability, 100),
      indicators: indicators.length > 0 ? indicators : ['No immediate fraud triggers found, but proceed with caution.'],
      explanation: status === 'HIGH RISK'
        ? 'This message displays heavy phishing indicators. It attempts to build urgency or promises high rewards, while pushing for credentials, bank actions, or unofficial links. DO NOT reply, click links, or share OTPs.'
        : status === 'SUSPICIOUS'
        ? 'This message has minor flags, such as urgency or suspicious links. It might be spam or a targeted phishing attempt. Verify through official channels before responding.'
        : 'The message contains standard text. No obvious scam indicators detected. However, always verify requests for transactions or sensitive data directly.'
    };
  }

  private static mockDistressDetection(text: string): {
    distressDetected: boolean;
    level: 'none' | 'moderate' | 'severe';
    actionSuggested: string;
  } {
    const input = text.toLowerCase();
    const panicKeywords = ['die', 'dying', 'kill', 'scared', 'afraid', 'panicking', 'panic', 'hurry', 'help me', 'please help', 'save me', 'stuck', 'trapped'];

    const matched = panicKeywords.filter(k => input.includes(k));

    if (matched.length >= 3) {
      return {
        distressDetected: true,
        level: 'severe',
        actionSuggested: 'Immediate critical alert. Take deep breaths. Please activate the SOS button at the top of the screen immediately. Or dial 112 directly. Help is available.'
      };
    } else if (matched.length >= 1) {
      return {
        distressDetected: true,
        level: 'moderate',
        actionSuggested: 'Panic symptoms detected. We recommend contacting a trusted friend or dial the national emotional support helpline Kiran at 1800-599-0019.'
      };
    }

    return {
      distressDetected: false,
      level: 'none',
      actionSuggested: ''
    };
  }
}
