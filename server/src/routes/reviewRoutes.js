import { Router } from 'express';
import {
  listApprovedReviews,
  createReview,
  moderateReviewAdmin
} from '../controllers/reviewController.js';
import {
  optionalCustomerAuth,
  authenticateAdmin,
  authorizeRoles
} from '../middleware/authMiddleware.js';
import { validateRequest } from '../middleware/validateMiddleware.js';
import { createReviewSchema, moderateReviewSchema } from '../validations/reviewValidation.js';

const router = Router();

router.get('/', listApprovedReviews);
router.post('/', optionalCustomerAuth, validateRequest(createReviewSchema), createReview);

router.patch(
  '/admin/:id/moderate',
  authenticateAdmin,
  authorizeRoles('super_admin', 'branch_manager'),
  validateRequest(moderateReviewSchema),
  moderateReviewAdmin
);

export default router;

