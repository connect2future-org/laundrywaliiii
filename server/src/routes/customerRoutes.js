import { Router } from 'express';
import {
  getMyProfile,
  updateMyProfile,
  getMyOrders,
  listCustomersAdmin,
  getCustomerDetailsAdmin
} from '../controllers/customerController.js';
import {
  authenticateCustomer,
  authenticateAdmin,
  authorizeRoles
} from '../middleware/authMiddleware.js';
import { validateRequest } from '../middleware/validateMiddleware.js';
import { updateProfileSchema } from '../validations/customerValidation.js';

const router = Router();

router.get('/me', authenticateCustomer, getMyProfile);
router.patch('/me', authenticateCustomer, validateRequest(updateProfileSchema), updateMyProfile);
router.get('/me/orders', authenticateCustomer, getMyOrders);

router.get('/admin', authenticateAdmin, authorizeRoles('super_admin', 'branch_manager'), listCustomersAdmin);
router.get('/admin/:id', authenticateAdmin, authorizeRoles('super_admin', 'branch_manager'), getCustomerDetailsAdmin);

export default router;

