import Joi from 'joi';
import { objectIdRule, phoneRule } from './commonValidation.js';
import { PAYMENT_METHODS, PRICING_UNITS, WALKIN_STATUSES } from '../config/constants.js';

const walkInItemSchema = Joi.object({
  serviceId: objectIdRule.allow(null).optional(),
  categorySlug: Joi.string()
    .valid('wash-fold', 'wash-iron', 'dry-cleaning', 'shoe-cleaning', 'customized-services')
    .required(),
  serviceName: Joi.string().trim().min(2).max(120).required(),
  itemName: Joi.string().trim().allow(null, '').optional(),
  variantName: Joi.string().trim().allow(null, '').optional(),
  pricingUnit: Joi.string().valid(...PRICING_UNITS, null).optional(),
  quantity: Joi.number().integer().min(1).max(500).required(),
  unitPrice: Joi.number().min(0).required(),
  surchargePerUnit: Joi.number().min(0).optional(),
  customizations: Joi.object().unknown(true).optional()
});

export const createWalkInOrderSchema = Joi.object({
  branchId: objectIdRule.required(),
  customerId: objectIdRule.allow(null).optional(),
  customerName: Joi.string().trim().min(2).max(120).required(),
  customerPhone: phoneRule.required(),
  items: Joi.array().items(walkInItemSchema).min(1).required(),
  discountAmount: Joi.number().min(0).optional(),
  amountPaid: Joi.number().min(0).optional(),
  paymentMethod: Joi.string().valid(...PAYMENT_METHODS).optional(),
  dueDate: Joi.date().iso().allow(null).optional(),
  notes: Joi.string().trim().max(500).allow('').optional()
});

export const updateWalkInStatusSchema = Joi.object({
  status: Joi.string().valid(...WALKIN_STATUSES).required(),
  amountPaid: Joi.number().min(0).optional(),
  notes: Joi.string().trim().max(500).allow('').optional()
});

