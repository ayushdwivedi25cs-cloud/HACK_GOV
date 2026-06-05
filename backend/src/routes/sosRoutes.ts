import { Router } from 'express';
import { triggerSOS, getMyIncidents, updateLiveLocation, getLiveTracking } from '../controllers/sosController';
import { verifyToken } from '../middleware/authMiddleware';

const router = Router();

router.post('/trigger', triggerSOS);
router.post('/location-update', updateLiveLocation);
router.get('/tracking/:id', getLiveTracking);
router.get('/my-incidents', verifyToken, getMyIncidents);

export default router;
