import { Router } from 'express';
import {
  listMyAddresses,
  createAddress,
  updateAddress,
  deleteAddress
} from '../controllers/addressController.js';
import { authenticateCustomer } from '../middleware/authMiddleware.js';
import { validateRequest } from '../middleware/validateMiddleware.js';
import { addressSchema } from '../validations/customerValidation.js';

const router = Router();

router.use(authenticateCustomer);

router.get('/', listMyAddresses);
router.post('/', validateRequest(addressSchema), createAddress);
router.patch('/:id', validateRequest(addressSchema.fork(['houseNo', 'street', 'pincode'], (f) => f.optional())), updateAddress);
router.delete('/:id', deleteAddress);

export default router;

