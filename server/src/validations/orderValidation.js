import Joi from 'joi';
import { emailRule, objectIdRule, phoneRule, pincodeRule } from './commonValidation.js';
import { ORDER_STATUSES, PAYMENT_METHODS, PRICING_UNITS } from '../config/constants.js';

const slugPattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

export const orderItemInputSchema = Joi.object({
  serviceId: objectIdRule.allow(null).optional(),
  categorySlug: Joi.string().trim().lowercase().pattern(slugPattern).required(),
  itemId: objectIdRule.allow(null).optional(),
  itemCode: Joi.string().trim().lowercase().allow(null, '').optional(),
  itemName: Joi.string().trim().allow(null, '').optional(),
  variantId: objectIdRule.allow(null).optional(),
  variantName: Joi.string().trim().allow(null, '').optional(),
  addOnIds: Joi.array().items(objectIdRule).optional(),
  addOnCodes: Joi.array().items(Joi.string().trim().lowercase()).optional(),
  pricingUnit: Joi.string().valid(...PRICING_UNITS, null).optional(),
  quantity: Joi.number().integer().min(1).max(500).required(),
  customizations: Joi.object().unknown(true).optional()
});

export const cartQuoteSchema = Joi.object({
  items: Joi.array().items(orderItemInputSchema).min(1).required(),
  discountAmount: Joi.number().min(0).optional()
});

export const createOrderSchema = Joi.object({
  customer: Joi.object({
    fullName: Joi.string().trim().min(1).max(120).required(),
    phone: phoneRule.required(),
    email: emailRule.allow(null, '').optional()
  }).required(),
  branchId: objectIdRule.required(),
  addressId: objectIdRule.allow(null).optional(),
  pickupAddress: Joi.object({
    addressLine: Joi.string().trim().max(500).allow('').optional(),
    address: Joi.string().trim().max(500).allow('').optional(),
    houseNo: Joi.string().trim().max(150).allow('').optional(),
    street: Joi.string().trim().max(200).allow('').optional(),
    landmark: Joi.string().trim().max(200).allow('').optional(),
    area: Joi.string().trim().max(120).allow('').optional(),
    city: Joi.string().trim().max(80).default('Mysore').allow('').optional(),
    pincode: Joi.string().trim().pattern(/^\d{6}$/).allow('', null).optional()
  })
    .custom((val, helpers) => {
      const full =
        (val.addressLine && val.addressLine.trim().length > 0) ||
        (val.address && val.address.trim().length > 0) ||
        (val.street && val.street.trim().length > 0) ||
        (val.houseNo && val.houseNo.trim().length > 0);
      if (!full) {
        return helpers.message('Pickup address is mandatory');
      }
      return val;
    })
    .required(),
  schedule: Joi.object({
    pickupDate: Joi.date().iso().required(),
    pickupSlot: Joi.string().trim().min(2).max(80).required(),
    instructions: Joi.string().trim().max(500).allow('').optional()
  }).required(),
  items: Joi.array().items(orderItemInputSchema).min(1).required(),
  discountAmount: Joi.number().min(0).optional(),
  paymentMethod: Joi.string().valid(...PAYMENT_METHODS).optional()
});

export const updateOrderStatusSchema = Joi.object({
  status: Joi.string().valid(...ORDER_STATUSES).required(),
  note: Joi.string().trim().max(300).allow('').optional(),
  location: Joi.string().trim().max(160).allow('').optional(),
  assignedPilotId: objectIdRule.allow(null).optional(),
  qualityCheckPassed: Joi.boolean().optional(),
  cancelledReason: Joi.string().trim().max(300).allow(null, '').optional()
});
