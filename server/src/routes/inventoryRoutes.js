import { Router } from 'express';
import {
  listInventoryItems,
  createInventoryItem,
  recordInventoryTransaction,
  listInventoryTransactions
} from '../controllers/inventoryController.js';
import { authenticateAdmin, authorizeRoles } from '../middleware/authMiddleware.js';
import { validateRequest } from '../middleware/validateMiddleware.js';
import { createInventoryItemSchema, inventoryTransactionSchema } from '../validations/inventoryValidation.js';

const router = Router();

router.use(authenticateAdmin);
router.use(authorizeRoles('super_admin', 'branch_manager', 'operator'));

router.get('/', listInventoryItems);
router.post('/', authorizeRoles('super_admin', 'branch_manager'), validateRequest(createInventoryItemSchema), createInventoryItem);
router.get('/transactions', listInventoryTransactions);
router.get('/:id/transactions', listInventoryTransactions);
router.post('/:id/transactions', validateRequest(inventoryTransactionSchema), recordInventoryTransaction);

export default router;

