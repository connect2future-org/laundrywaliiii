import { Router } from 'express';
import { getTrackingByCode } from '../controllers/trackingController.js';

const router = Router();

router.get('/:trackingCode', getTrackingByCode);

export default router;

