import { Router } from 'express';
import {
  listActiveBranches,
  getBranchBySlug,
  checkPincodeCoverage,
  createBranch,
  updateBranch
} from '../controllers/branchController.js';
import { authenticateAdmin, authorizeRoles } from '../middleware/authMiddleware.js';
import { validateRequest } from '../middleware/validateMiddleware.js';
import { createBranchSchema, updateBranchSchema } from '../validations/branchValidation.js';

const router = Router();

router.get('/', listActiveBranches);
router.get('/coverage/:pincode', checkPincodeCoverage);
router.get('/:slug', getBranchBySlug);

router.post('/', authenticateAdmin, authorizeRoles('super_admin'), validateRequest(createBranchSchema), createBranch);
router.patch('/:id', authenticateAdmin, authorizeRoles('super_admin', 'branch_manager'), validateRequest(updateBranchSchema), updateBranch);

export default router;

