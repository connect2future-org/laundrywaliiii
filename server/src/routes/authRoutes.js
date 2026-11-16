import { Router } from 'express';
import { registerCustomer, loginCustomer, loginAdmin } from '../controllers/authController.js';
import { validateRequest } from '../middleware/validateMiddleware.js';
import { authRateLimiter } from '../middleware/rateLimitMiddleware.js';
import { customerRegisterSchema, customerLoginSchema, adminLoginSchema } from '../validations/authValidation.js';

const router = Router();

router.post('/customer/register', authRateLimiter, validateRequest(customerRegisterSchema), registerCustomer);
router.post('/customer/login', authRateLimiter, validateRequest(customerLoginSchema), loginCustomer);
router.post('/admin/login', authRateLimiter, validateRequest(adminLoginSchema), loginAdmin);

export default router;

