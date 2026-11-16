import Joi from 'joi';
import { PRICING_UNITS } from '../config/constants.js';

const slugPattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

export const variantSchema = Joi.object({
  code: Joi.string().trim().lowercase().max(60).allow(null, '').optional(),
  name: Joi.string().trim().min(1).max(80).required(),
  variantType: Joi.string().valid('standard', 'treatment', 'size', 'tier').optional(),
  price: Joi.number().min(0).allow(null).required(),
  additionalCharge: Joi.number().min(0).optional(),
  unit: Joi.string().valid(...PRICING_UNITS, null).optional(),
  isDefault: Joi.boolean().optional(),
  isAvailable: Joi.boolean().optional(),
  isActive: Joi.boolean().optional()
});

export const variantUpdateSchema = Joi.object({
  code: Joi.string().trim().lowercase().max(60).allow(null, '').optional(),
  name: Joi.string().trim().min(1).max(80).optional(),
  variantType: Joi.string().valid('standard', 'treatment', 'size', 'tier').optional(),
  price: Joi.number().min(0).allow(null).optional(),
  additionalCharge: Joi.number().min(0).optional(),
  unit: Joi.string().valid(...PRICING_UNITS, null).optional(),
  isDefault: Joi.boolean().optional(),
  isAvailable: Joi.boolean().optional(),
  isActive: Joi.boolean().optional()
}).min(1);

export const itemSchema = Joi.object({
  itemCode: Joi.string().trim().lowercase().min(1).max(60).required(),
  name: Joi.string().trim().min(1).max(120).required(),
  subCategory: Joi.string().trim().max(80).allow(null, '').optional(),
  description: Joi.string().trim().max(300).allow(null, '').optional(),
  pricingMethod: Joi.string().valid('per_unit', 'variant', 'fixed_size').optional(),
  basePrice: Joi.number().min(0).allow(null).optional(),
  pricingUnit: Joi.string().valid(...PRICING_UNITS, null).optional(),
  minQuantity: Joi.number().integer().min(1).optional(),
  quantityStep: Joi.number().integer().min(1).optional(),
  variants: Joi.array().items(variantSchema).optional(),
  isAvailable: Joi.boolean().optional(),
  isActive: Joi.boolean().optional(),
  sortOrder: Joi.number().integer().min(0).optional()
});

export const itemUpdateSchema = Joi.object({
  itemCode: Joi.string().trim().lowercase().min(1).max(60).optional(),
  name: Joi.string().trim().min(1).max(120).optional(),
  subCategory: Joi.string().trim().max(80).allow(null, '').optional(),
  description: Joi.string().trim().max(300).allow(null, '').optional(),
  pricingMethod: Joi.string().valid('per_unit', 'variant', 'fixed_size').optional(),
  basePrice: Joi.number().min(0).allow(null).optional(),
  pricingUnit: Joi.string().valid(...PRICING_UNITS, null).optional(),
  minQuantity: Joi.number().integer().min(1).optional(),
  quantityStep: Joi.number().integer().min(1).optional(),
  variants: Joi.array().items(variantSchema).optional(),
  isAvailable: Joi.boolean().optional(),
  isActive: Joi.boolean().optional(),
  sortOrder: Joi.number().integer().min(0).optional()
}).min(1);

export const addOnSchema = Joi.object({
  code: Joi.string().trim().lowercase().min(1).max(60).required(),
  name: Joi.string().trim().min(1).max(120).required(),
  description: Joi.string().trim().max(240).allow(null, '').optional(),
  price: Joi.number().min(0).required(),
  isAvailable: Joi.boolean().optional(),
  isActive: Joi.boolean().optional()
});

export const addOnUpdateSchema = Joi.object({
  code: Joi.string().trim().lowercase().min(1).max(60).optional(),
  name: Joi.string().trim().min(1).max(120).optional(),
  description: Joi.string().trim().max(240).allow(null, '').optional(),
  price: Joi.number().min(0).optional(),
  isAvailable: Joi.boolean().optional(),
  isActive: Joi.boolean().optional()
}).min(1);

export const upsertServiceCategorySchema = Joi.object({
  categorySlug: Joi.string().trim().lowercase().pattern(slugPattern).min(2).max(80).required(),
  name: Joi.string().trim().min(2).max(120).required(),
  price: Joi.number().min(0).allow(null).optional(),
  pricingMethod: Joi.string().valid('per_unit', 'itemized', 'fixed_size', 'custom').optional(),
  pricingUnit: Joi.string().valid(...PRICING_UNITS, null).optional(),
  description: Joi.string().trim().max(400).allow(null, '').optional(),
  features: Joi.array().items(Joi.string().trim().max(120)).allow(null).optional(),
  image: Joi.string().trim().max(500).allow(null, '').optional(),
  selectionMode: Joi.string().valid('direct-unit', 'item-selection', 'customization').default('direct-unit'),
  items: Joi.array().items(itemSchema).allow(null).optional(),
  addOns: Joi.array().items(addOnSchema).allow(null).optional(),
  minQuantity: Joi.number().integer().min(1).optional(),
  quantityStep: Joi.number().integer().min(1).optional(),
  turnaroundHours: Joi.number().integer().min(1).allow(null).optional(),
  sortOrder: Joi.number().integer().min(0).optional(),
  isAvailable: Joi.boolean().optional(),
  isCustomerVisible: Joi.boolean().optional(),
  isActive: Joi.boolean().optional()
});

export const updateServicePricingSchema = Joi.object({
  name: Joi.string().trim().min(2).max(120).optional(),
  price: Joi.number().min(0).allow(null).optional(),
  pricingMethod: Joi.string().valid('per_unit', 'itemized', 'fixed_size', 'custom').optional(),
  pricingUnit: Joi.string().valid(...PRICING_UNITS, null).optional(),
  description: Joi.string().trim().max(400).allow(null, '').optional(),
  features: Joi.array().items(Joi.string().trim().max(120)).allow(null).optional(),
  image: Joi.string().trim().max(500).allow(null, '').optional(),
  selectionMode: Joi.string().valid('direct-unit', 'item-selection', 'customization').optional(),
  items: Joi.array().items(itemSchema).allow(null).optional(),
  addOns: Joi.array().items(addOnSchema).allow(null).optional(),
  minQuantity: Joi.number().integer().min(1).optional(),
  quantityStep: Joi.number().integer().min(1).optional(),
  turnaroundHours: Joi.number().integer().min(1).allow(null).optional(),
  sortOrder: Joi.number().integer().min(0).optional(),
  isAvailable: Joi.boolean().optional(),
  isCustomerVisible: Joi.boolean().optional(),
  isActive: Joi.boolean().optional()
}).min(1);

export const updateBusinessPricingSettingsSchema = Joi.object({
  gstPercentage: Joi.number().min(0).max(100).optional(),
  deliveryFee: Joi.number().min(0).optional(),
  freeDeliveryThreshold: Joi.number().min(0).optional()
}).min(1);
