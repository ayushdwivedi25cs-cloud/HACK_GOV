import { Router } from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import {
  handleAIChat,
  handleAIClassify,
  handleScamDetect,
  handleDeepfakeDetect,
  handleDistressCheck
} from '../controllers/aiController';

// Enforce backend/uploads directory creation inside the workspace
const uploadDir = path.join(__dirname, '../../uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Multer storage engine configuration
const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, uploadDir);
  },
  filename: (_req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 } // 10MB limit
});

const router = Router();

router.post('/chat', handleAIChat);
router.post('/classify', handleAIClassify);
router.post('/scam-detect', upload.single('screenshot'), handleScamDetect);
router.post('/deepfake-detect', upload.single('media'), handleDeepfakeDetect);
router.post('/distress-check', handleDistressCheck);

export default router;
