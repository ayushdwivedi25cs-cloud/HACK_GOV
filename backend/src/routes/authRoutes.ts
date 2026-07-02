import { Router } from 'express';
import { registerCitizen, login, getProfile } from '../controllers/authController';
import { verifyToken } from '../middleware/authMiddleware';

const router = Router();

router.post('/register', registerCitizen);
router.post('/login', login);
router.get('/profile', verifyToken, getProfile);

export default router;
