import { Router } from 'express';
import { getAllIncidents, updateIncidentStatus, getIncidentAnalytics } from '../controllers/incidentController';
import { verifyToken, requireAdmin } from '../middleware/authMiddleware';

const router = Router();

// Secured admin routes
router.get('/all', verifyToken, requireAdmin, getAllIncidents);
router.put('/update/:id', verifyToken, requireAdmin, updateIncidentStatus);
router.get('/analytics', verifyToken, requireAdmin, getIncidentAnalytics);

export default router;
