import Joi from 'joi';
import { emailRule, objectIdRule, phoneRule } from './commonValidation.js';
import { ADMIN_ROLES } from '../config/constants.js';

export const customerRegisterSchema = Joi.object({
  fullName: Joi.string().trim().min(2).max(120).required(),
  phone: phoneRule.required(),
  email: emailRule.optional(),
  password: Joi.string().min(8).max(128).required()
});

export const customerLoginSchema = Joi.object({
  phoneOrEmail: Joi.string().trim().required(),
  password: Joi.string().required()
});

export const adminLoginSchema = Joi.object({
  email: emailRule.required(),
  password: Joi.string().required()
});

export const createAdminUserSchema = Joi.object({
  fullName: Joi.string().trim().min(2).max(120).required(),
  email: emailRule.required(),
  phone: phoneRule.required(),
  password: Joi.string().min(8).max(128).required(),
  role: Joi.string().valid(...ADMIN_ROLES).required(),
  assignedBranchId: objectIdRule.allow(null).optional(),
  permissions: Joi.array().items(Joi.string().trim()).optional()
});

