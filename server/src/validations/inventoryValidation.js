import Joi from 'joi';
import { objectIdRule } from './commonValidation.js';
import { INVENTORY_CATEGORIES, INVENTORY_TRANSACTION_TYPES } from '../config/constants.js';

export const createInventoryItemSchema = Joi.object({
  sku: Joi.string().trim().uppercase().min(2).max(50).required(),
  name: Joi.string().trim().min(2).max(140).required(),
  category: Joi.string().valid(...INVENTORY_CATEGORIES).required(),
  branchId: objectIdRule.required(),
  unit: Joi.string().valid('kg', 'liter', 'unit', 'pack', 'bottle').required(),
  currentStock: Joi.number().min(0).default(0),
  reorderLevel: Joi.number().min(0).default(5),
  costPerUnit: Joi.number().min(0).default(0),
  supplierName: Joi.string().trim().max(140).allow('').optional()
});

export const inventoryTransactionSchema = Joi.object({
  type: Joi.string().valid(...INVENTORY_TRANSACTION_TYPES).required(),
  quantity: Joi.number().positive().required(),
  unitCost: Joi.number().min(0).optional(),
  referenceNote: Joi.string().trim().max(300).allow('').optional(),
  orderId: objectIdRule.allow(null).optional()
});

