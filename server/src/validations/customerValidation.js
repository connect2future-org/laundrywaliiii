import Joi from 'joi';
import { emailRule, pincodeRule } from './commonValidation.js';

export const updateProfileSchema = Joi.object({
  fullName: Joi.string().trim().min(2).max(120).optional(),
  email: emailRule.optional()
});

export const addressSchema = Joi.object({
  label: Joi.string().valid('Home', 'Work', 'Other').optional(),
  houseNo: Joi.string().trim().min(1).max(150).required(),
  street: Joi.string().trim().min(2).max(200).required(),
  landmark: Joi.string().trim().max(200).allow('').optional(),
  area: Joi.string().trim().max(120).allow('').optional(),
  city: Joi.string().trim().min(2).max(80).optional(),
  state: Joi.string().trim().min(2).max(80).optional(),
  pincode: pincodeRule.required(),
  coordinates: Joi.object({
    lat: Joi.number().min(-90).max(90).allow(null),
    lng: Joi.number().min(-180).max(180).allow(null)
  }).optional(),
  isDefault: Joi.boolean().optional()
});

