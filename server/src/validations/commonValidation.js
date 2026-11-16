import Joi from 'joi';

export const objectIdRule = Joi.string()
  .pattern(/^[a-fA-F0-9]{24}$/)
  .message('Must be a valid 24-character MongoDB ObjectId');

export const phoneRule = Joi.string()
  .trim()
  .pattern(/^[6-9]\d{9}$/)
  .message('Must be a valid 10-digit Indian mobile number');

export const pincodeRule = Joi.string()
  .trim()
  .pattern(/^\d{6}$/)
  .message('PIN code must be exactly 6 digits');

export const emailRule = Joi.string().trim().lowercase().email();

