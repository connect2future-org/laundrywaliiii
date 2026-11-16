import { Router } from 'express';
import {
  listServices,
  listServiceCategories,
  listServiceItems,
  getServiceBySlug,
  getPublicPricingSettings,
  listAllServicesAdmin,
  createServiceCategory,
  upsertServiceCategory,
  updateServicePricing,
  addServiceItem,
  updateServiceItem,
  addItemVariant,
  updateItemVariant,
  addServiceAddOn,
  updateServiceAddOn
} from '../controllers/serviceController.js';
import { authenticateAdmin, authorizeRoles } from '../middleware/authMiddleware.js';
import { validateRequest } from '../middleware/validateMiddleware.js';
import {
  upsertServiceCategorySchema,
  updateServicePricingSchema,
  itemSchema,
  itemUpdateSchema,
  variantSchema,
  variantUpdateSchema,
  addOnSchema,
  addOnUpdateSchema
} from '../validations/serviceValidation.js';

const router = Router();

// Public database-driven catalogue routes (active + customer-visible only)
router.get('/', listServices);
router.get('/categories', listServiceCategories);
router.get('/items', listServiceItems);
router.get('/settings/pricing', getPublicPricingSettings);

// Admin catalogue management routes (must come before /:slug catch-all)
router.get(
  '/admin/all',
  authenticateAdmin,
  authorizeRoles('super_admin', 'branch_manager'),
  listAllServicesAdmin
);

router.post(
  '/admin/categories',
  authenticateAdmin,
  authorizeRoles('super_admin', 'branch_manager'),
  validateRequest(upsertServiceCategorySchema),
  createServiceCategory
);

router.put(
  '/admin',
  authenticateAdmin,
  authorizeRoles('super_admin', 'branch_manager'),
  validateRequest(upsertServiceCategorySchema),
  upsertServiceCategory
);

router.patch(
  '/admin/:slug/pricing',
  authenticateAdmin,
  authorizeRoles('super_admin', 'branch_manager'),
  validateRequest(updateServicePricingSchema),
  updateServicePricing
);

router.patch(
  '/admin/:slug',
  authenticateAdmin,
  authorizeRoles('super_admin', 'branch_manager'),
  validateRequest(updateServicePricingSchema),
  updateServicePricing
);

router.post(
  '/admin/:slug/items',
  authenticateAdmin,
  authorizeRoles('super_admin', 'branch_manager'),
  validateRequest(itemSchema),
  addServiceItem
);

router.patch(
  '/admin/:slug/items/:itemId',
  authenticateAdmin,
  authorizeRoles('super_admin', 'branch_manager'),
  validateRequest(itemUpdateSchema),
  updateServiceItem
);

router.post(
  '/admin/:slug/items/:itemId/variants',
  authenticateAdmin,
  authorizeRoles('super_admin', 'branch_manager'),
  validateRequest(variantSchema),
  addItemVariant
);

router.patch(
  '/admin/:slug/items/:itemId/variants/:variantId',
  authenticateAdmin,
  authorizeRoles('super_admin', 'branch_manager'),
  validateRequest(variantUpdateSchema),
  updateItemVariant
);

router.post(
  '/admin/:slug/addons',
  authenticateAdmin,
  authorizeRoles('super_admin', 'branch_manager'),
  validateRequest(addOnSchema),
  addServiceAddOn
);

router.patch(
  '/admin/:slug/addons/:addOnId',
  authenticateAdmin,
  authorizeRoles('super_admin', 'branch_manager'),
  validateRequest(addOnUpdateSchema),
  updateServiceAddOn
);

// Public single category/service lookup
router.get('/:slug', getServiceBySlug);

export default router;
