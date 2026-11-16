import Joi from 'joi';
import { objectIdRule } from './commonValidation.js';
import { EXPENSE_CATEGORIES, PAYMENT_METHODS } from '../config/constants.js';

export const createExpenseSchema = Joi.object({
  branchId: objectIdRule.required(),
  category: Joi.string().valid(...EXPENSE_CATEGORIES).required(),
  title: Joi.string().trim().min(2).max(160).required(),
  description: Joi.string().trim().max(600).allow('').optional(),
  amount: Joi.number().min(0).required(),
  expenseDate: Joi.date().iso().optional(),
  paymentMethod: Joi.string().valid(...PAYMENT_METHODS, 'cash', 'bank_transfer').optional(),
  vendorName: Joi.string().trim().max(140).allow('').optional(),
  receiptRef: Joi.string().trim().max(120).allow('').optional()
});

