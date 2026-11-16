import Joi from 'joi';
import { emailRule, phoneRule, pincodeRule } from './commonValidation.js';

export const createBranchSchema = Joi.object({
  branchCode: Joi.string().trim().uppercase().min(3).max(24).required(),
  slug: Joi.string().trim().lowercase().min(2).max(60).required(),
  name: Joi.string().trim().min(3).max(120).required(),
  area: Joi.string().trim().min(2).max(100).required(),
  city: Joi.string().trim().min(2).max(80).required(),
  state: Joi.string().trim().min(2).max(80).required(),
  pincode: pincodeRule.required(),
  address: Joi.string().trim().min(10).max(300).required(),
  landmark: Joi.string().trim().max(200).allow('').optional(),
  phone: phoneRule.required(),
  email: emailRule.allow(null).optional(),
  operatingHours: Joi.string().trim().max(120).allow(null).optional(),
  serviceablePincodes: Joi.array().items(pincodeRule).optional(),
  servicesOffered: Joi.array().items(Joi.string().trim()).optional(),
  mapUrl: Joi.string().uri().allow(null).optional(),
  isFlagship: Joi.boolean().optional(),
  isActive: Joi.boolean().optional()
});

export const updateBranchSchema = createBranchSchema.fork(
  ['branchCode', 'slug', 'name', 'area', 'city', 'state', 'pincode', 'address', 'phone'],
  (field) => field.optional()
);

