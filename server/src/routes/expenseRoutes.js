import { Router } from 'express';
import { createExpense, listExpenses } from '../controllers/expenseController.js';
import { authenticateAdmin, authorizeRoles } from '../middleware/authMiddleware.js';
import { validateRequest } from '../middleware/validateMiddleware.js';
import { createExpenseSchema } from '../validations/expenseValidation.js';

const router = Router();

router.use(authenticateAdmin);
router.use(authorizeRoles('super_admin', 'branch_manager', 'accountant'));

router.get('/', listExpenses);
router.post('/', validateRequest(createExpenseSchema), createExpense);

export default router;

