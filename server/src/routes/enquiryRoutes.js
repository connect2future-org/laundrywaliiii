import { Router } from 'express';
import {
  submitContactEnquiry,
  listContactEnquiriesAdmin,
  updateContactEnquiryAdmin,
  submitFranchiseLead,
  submitFranchiseBrochureLead,
  listFranchiseLeadsAdmin,
  updateFranchiseLeadAdmin
} from '../controllers/enquiryController.js';
import { authenticateAdmin, authorizeRoles } from '../middleware/authMiddleware.js';
import { validateRequest } from '../middleware/validateMiddleware.js';
import { publicSubmissionLimiter } from '../middleware/rateLimitMiddleware.js';
import {
  contactEnquirySchema,
  updateEnquiryStatusSchema,
  franchiseLeadSchema,
  franchiseBrochureLeadSchema,
  updateFranchiseLeadStatusSchema
} from '../validations/leadValidation.js';

const router = Router();

router.post('/contact', publicSubmissionLimiter, validateRequest(contactEnquirySchema), submitContactEnquiry);
router.post('/franchise-leads', publicSubmissionLimiter, validateRequest(franchiseLeadSchema), submitFranchiseLead);
router.post(
  '/franchise-leads/brochure',
  publicSubmissionLimiter,
  validateRequest(franchiseBrochureLeadSchema),
  submitFranchiseBrochureLead
);

router.get(
  '/admin/contact',
  authenticateAdmin,
  authorizeRoles('super_admin', 'branch_manager', 'operator'),
  listContactEnquiriesAdmin
);

router.patch(
  '/admin/contact/:id',
  authenticateAdmin,
  authorizeRoles('super_admin', 'branch_manager', 'operator'),
  validateRequest(updateEnquiryStatusSchema),
  updateContactEnquiryAdmin
);

router.get(
  '/admin/franchise-leads',
  authenticateAdmin,
  authorizeRoles('super_admin', 'branch_manager'),
  listFranchiseLeadsAdmin
);

router.patch(
  '/admin/franchise-leads/:id',
  authenticateAdmin,
  authorizeRoles('super_admin', 'branch_manager'),
  validateRequest(updateFranchiseLeadStatusSchema),
  updateFranchiseLeadAdmin
);

export default router;

