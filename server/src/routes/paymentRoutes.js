import { Router } from 'express';
import {
  initiatePayment,
  updatePaymentStatus,
  listPaymentsAdmin
} from '../controllers/paymentController.js';
import {
  optionalCustomerAuth,
  authenticateAdmin,
  authorizeRoles
} from '../middleware/authMiddleware.js';
import { validateRequest } from '../middleware/validateMiddleware.js';
import { initiatePaymentSchema, updatePaymentStatusSchema } from '../validations/paymentValidation.js';

const router = Router();

router.post('/initiate', optionalCustomerAuth, validateRequest(initiatePaymentSchema), initiatePayment);

router.get(
  '/admin/list',
  authenticateAdmin,
  authorizeRoles('super_admin', 'branch_manager', 'accountant'),
  listPaymentsAdmin
);

router.patch(
  '/admin/:id/status',
  authenticateAdmin,
  authorizeRoles('super_admin', 'branch_manager', 'accountant'),
  validateRequest(updatePaymentStatusSchema),
  updatePaymentStatus
);

export default router;

