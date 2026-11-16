import { Router } from 'express';
import {
  quoteOrderPricing,
  createOrder,
  getOrderByBookingId,
  listOrdersAdmin,
  updateOrderStatusAdmin
} from '../controllers/orderController.js';
import {
  optionalCustomerAuth,
  authenticateAdmin,
  authorizeRoles
} from '../middleware/authMiddleware.js';
import { validateRequest } from '../middleware/validateMiddleware.js';
import {
  cartQuoteSchema,
  createOrderSchema,
  updateOrderStatusSchema
} from '../validations/orderValidation.js';

const router = Router();

router.post('/quote', validateRequest(cartQuoteSchema), quoteOrderPricing);
router.post('/', optionalCustomerAuth, validateRequest(createOrderSchema), createOrder);
router.get('/booking/:bookingId', optionalCustomerAuth, getOrderByBookingId);

router.get(
  '/admin/list',
  authenticateAdmin,
  authorizeRoles('super_admin', 'branch_manager', 'operator', 'delivery_pilot'),
  listOrdersAdmin
);

router.patch(
  '/admin/:id/status',
  authenticateAdmin,
  authorizeRoles('super_admin', 'branch_manager', 'operator', 'delivery_pilot'),
  validateRequest(updateOrderStatusSchema),
  updateOrderStatusAdmin
);

export default router;

