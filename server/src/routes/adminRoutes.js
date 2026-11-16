import { Router } from 'express';
import {
  getAdminProfile,
  createAdminUser,
  listAdminUsers,
  getDashboardSummary,
  getBusinessPricingSettingsAdmin,
  updateBusinessPricingSettingsAdmin,
  listNotificationLogsAdmin,
  testNotificationDeliveryAdmin
} from '../controllers/adminController.js';
import { authenticateAdmin, authorizeRoles } from '../middleware/authMiddleware.js';
import { validateRequest } from '../middleware/validateMiddleware.js';
import { createAdminUserSchema } from '../validations/authValidation.js';
import { updateBusinessPricingSettingsSchema } from '../validations/serviceValidation.js';

const router = Router();

router.use(authenticateAdmin);

router.get('/me', getAdminProfile);
router.get(
  '/dashboard',
  authorizeRoles('super_admin', 'branch_manager', 'accountant'),
  getDashboardSummary
);
router.get('/users', authorizeRoles('super_admin'), listAdminUsers);
router.post('/users', authorizeRoles('super_admin'), validateRequest(createAdminUserSchema), createAdminUser);

router.get(
  '/settings/pricing',
  authorizeRoles('super_admin', 'branch_manager'),
  getBusinessPricingSettingsAdmin
);
router.patch(
  '/settings/pricing',
  authorizeRoles('super_admin', 'branch_manager'),
  validateRequest(updateBusinessPricingSettingsSchema),
  updateBusinessPricingSettingsAdmin
);

router.get(
  '/notifications',
  authorizeRoles('super_admin', 'branch_manager'),
  listNotificationLogsAdmin
);

router.post(
  '/notifications/test',
  authorizeRoles('super_admin'),
  testNotificationDeliveryAdmin
);

export default router;

