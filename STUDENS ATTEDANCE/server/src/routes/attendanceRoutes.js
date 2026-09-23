import { Router } from 'express';
import { listAttendance, upsertAttendance } from '../controllers/attendanceController.js';
import { requireAuth } from '../middleware/auth.js';

const router = Router();
router.use(requireAuth);
router.get('/', listAttendance);
router.put('/', upsertAttendance);
export default router;
