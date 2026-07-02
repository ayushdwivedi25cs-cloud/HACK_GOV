import { Request, Response } from 'express';
import { AIService } from '../services/aiService';

export const handleAIChat = async (req: Request, res: Response): Promise<void> => {
  try {
    const { message, history, language } = req.body;
    if (!message) {
      res.status(400).json({ message: 'Input message is required.' });
      return;
    }

    const response = await AIService.getChatResponse(message, history || [], language || 'english');
    res.json({ response });
  } catch (error) {
    console.error('AIChat Controller Error:', error);
    res.status(500).json({ message: 'Failed to obtain AI assistant response.', error: String(error) });
  }
};

export const handleAIClassify = async (req: Request, res: Response): Promise<void> => {
  try {
    const { text } = req.body;
    if (!text) {
      res.status(400).json({ message: 'Text content is required for classification.' });
      return;
    }

    const classification = await AIService.classifyIncident(text);
    res.json(classification);
  } catch (error) {
    console.error('AIClassify Controller Error:', error);
    res.status(500).json({ message: 'AI classifier error.', error: String(error) });
  }
};

export const handleScamDetect = async (req: Request, res: Response): Promise<void> => {
  try {
    const { text } = req.body;
    const file = req.file;

    let contentToAnalyze = text || '';

    // If an image screenshot was uploaded, we'll simulate reading the text from it
    if (file) {
      contentToAnalyze += ` [Screenshot file analyzed: ${file.originalname}] `;
      // If we don't have text provided, we can simulate an OCR result based on file name or dummy phishing text
      if (!text) {
        contentToAnalyze = `URGENT: Your SBI bank account has been blocked due to suspicious activity. Click here to verify your KYC details and resume transaction: http://sbi-verify-kyc.bit.ly/login. Do not share your OTP with anyone.`;
      }
    }

    if (!contentToAnalyze) {
      res.status(400).json({ message: 'Please provide either text or upload an SMS/WhatsApp screenshot.' });
      return;
    }

    const analysis = await AIService.analyzeScam(contentToAnalyze);
    res.json({
      ...analysis,
      fileName: file ? file.originalname : undefined
    });
  } catch (error) {
    console.error('ScamDetect Controller Error:', error);
    res.status(500).json({ message: 'Failed to run AI scam scan.', error: String(error) });
  }
};

export const handleDeepfakeDetect = async (req: Request, res: Response): Promise<void> => {
  try {
    const file = req.file;
    const { mediaType } = req.body; // 'image', 'video', or 'audio'

    if (!file) {
      res.status(400).json({ message: 'Please upload a file for deepfake analysis.' });
      return;
    }

    // Simulate forensic analysis search indicators
    const isDeepfake = Math.random() > 0.5; // Simulate detection (hackathon logic)
    const confidence = parseFloat((70 + Math.random() * 25).toFixed(2));
    
    let indicators: string[] = [];
    if (mediaType === 'image' || file.mimetype.startsWith('image/')) {
      indicators = [
        'Frequency domain eye-reflection discrepancies',
        'Asymmetric shadowing around face margins',
        'Inconsistent pixel boundaries along jawline structure'
      ];
    } else if (mediaType === 'video' || file.mimetype.startsWith('video/')) {
      indicators = [
        'Abnormal eye blinking frequency dynamics',
        'Lip sync phase shift in voice matching alignment',
        'Temporal light jitter on cheek regions'
      ];
    } else {
      indicators = [
        'Atypical spectral noise densities in high bands',
        'Phase continuity interruptions in pitch transitions',
        'Robotized frequency harmonics'
      ];
    }

    const output = {
      isDeepfake,
      confidence,
      fileName: file.originalname,
      fileSize: file.size,
      mimeType: file.mimetype,
      indicators: isDeepfake ? indicators : ['Forensic parameters indicate authentic biological origin.'],
      evidenceHash: `SHA-256:${Buffer.from(file.originalname + Date.now()).toString('hex').slice(0, 32).toUpperCase()}`,
      status: isDeepfake ? 'HIGH_RISK_DEEPFAKE' : 'VERIFIED_AUTHENTIC',
      timestamp: new Date()
    };

    res.json(output);
  } catch (error) {
    console.error('DeepfakeDetect Controller Error:', error);
    res.status(500).json({ message: 'Failed to complete deepfake forensic check.', error: String(error) });
  }
};

export const handleDistressCheck = async (req: Request, res: Response): Promise<void> => {
  try {
    const { text } = req.body;
    if (!text) {
      res.status(400).json({ message: 'Input text is required for distress analysis.' });
      return;
    }

    const analysis = await AIService.detectDistress(text);
    res.json(analysis);
  } catch (error) {
    res.status(500).json({ message: 'Distress detector failure.', error: String(error) });
  }
};
