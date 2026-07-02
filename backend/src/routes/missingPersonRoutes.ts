import { Router } from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import {
  createMissingReport,
  getMissingPeople,
  getSingleMissingCase
} from '../controllers/missingPersonController';

const uploadDir = path.join(__dirname, '../../uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, uploadDir);
  },
  filename: (_req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});

const upload = multer({ storage });
const router = Router();

router.post('/report', upload.single('photo'), createMissingReport);
router.get('/list', getMissingPeople);
router.get('/:id', getSingleMissingCase);

export default router;
