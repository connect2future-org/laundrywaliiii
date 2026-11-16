import Joi from 'joi';
import { objectIdRule } from './commonValidation.js';
import { PAYMENT_METHODS, PAYMENT_STATUSES } from '../config/constants.js';

export const initiatePaymentSchema = Joi.object({
  orderId: objectIdRule.optional(),
  walkInOrderId: objectIdRule.optional(),
  method: Joi.string().valid(...PAYMENT_METHODS).required(),
  amount: Joi.number().min(0).required(),
  idempotencyKey: Joi.string().trim().max(120).optional(),
  gatewayName: Joi.string().trim().max(60).allow(null, '').optional()
}).or('orderId', 'walkInOrderId');

export const updatePaymentStatusSchema = Joi.object({
  status: Joi.string().valid(...PAYMENT_STATUSES).required(),
  gatewayOrderId: Joi.string().trim().max(120).allow(null, '').optional(),
  gatewayPaymentId: Joi.string().trim().max(120).allow(null, '').optional(),
  gatewayResponseCode: Joi.string().trim().max(60).allow(null, '').optional(),
  failureReason: Joi.string().trim().max(300).allow(null, '').optional(),
  refundedAmount: Joi.number().min(0).optional()
});

