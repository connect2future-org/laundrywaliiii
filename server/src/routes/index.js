import { Router } from 'express';
import healthRoutes from './healthRoutes.js';
import serviceRoutes from './serviceRoutes.js';
import authRoutes from './authRoutes.js';
import customerRoutes from './customerRoutes.js';
import addressRoutes from './addressRoutes.js';
import branchRoutes from './branchRoutes.js';
import orderRoutes from './orderRoutes.js';
import trackingRoutes from './trackingRoutes.js';
import walkInRoutes from './walkInRoutes.js';
import paymentRoutes from './paymentRoutes.js';
import reviewRoutes from './reviewRoutes.js';
import inventoryRoutes from './inventoryRoutes.js';
import expenseRoutes from './expenseRoutes.js';
import enquiryRoutes from './enquiryRoutes.js';
import adminRoutes from './adminRoutes.js';

const router = Router();

router.use('/health', healthRoutes);
router.use('/services', serviceRoutes);
router.use('/auth', authRoutes);
router.use('/customers', customerRoutes);
router.use('/addresses', addressRoutes);
router.use('/branches', branchRoutes);
router.use('/orders', orderRoutes);
router.use('/tracking', trackingRoutes);
router.use('/walk-in-orders', walkInRoutes);
router.use('/payments', paymentRoutes);
router.use('/reviews', reviewRoutes);
router.use('/inventory', inventoryRoutes);
router.use('/expenses', expenseRoutes);
router.use('/admin', adminRoutes);
router.use('/', enquiryRoutes);

export default router;

