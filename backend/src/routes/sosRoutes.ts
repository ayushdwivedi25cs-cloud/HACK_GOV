import { Router } from 'express';
import { triggerSOS, getMyIncidents } from '../controllers/sosController';
import { verifyToken } from '../middleware/authMiddleware';

const router = Router();

router.post('/trigger', triggerSOS);
router.get('/my-incidents', verifyToken, getMyIncidents);

export default router;
