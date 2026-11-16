import { Router } from 'express';
import {
  createWalkInOrder,
  listWalkInOrders,
  updateWalkInOrderStatus
} from '../controllers/walkInController.js';
import { authenticateAdmin, authorizeRoles } from '../middleware/authMiddleware.js';
import { validateRequest } from '../middleware/validateMiddleware.js';
import { createWalkInOrderSchema, updateWalkInStatusSchema } from '../validations/walkInValidation.js';

const router = Router();

router.use(authenticateAdmin);
router.use(authorizeRoles('super_admin', 'branch_manager', 'operator'));

router.get('/', listWalkInOrders);
router.post('/', validateRequest(createWalkInOrderSchema), createWalkInOrder);
router.patch('/:id/status', validateRequest(updateWalkInStatusSchema), updateWalkInOrderStatus);

export default router;

