import Joi from 'joi';
import { emailRule, phoneRule } from './commonValidation.js';
import { ENQUIRY_STATUSES, FRANCHISE_LEAD_STATUSES } from '../config/constants.js';

export const contactEnquirySchema = Joi.object({
  name: Joi.string().trim().min(2).max(120).required(),
  phone: phoneRule.required(),
  email: emailRule.allow('', null).optional(),
  subject: Joi.string().trim().max(160).optional(),
  message: Joi.string().trim().max(2000).allow('', null).optional(),
  source: Joi.string().trim().max(80).optional()
});

export const updateEnquiryStatusSchema = Joi.object({
  status: Joi.string().valid(...ENQUIRY_STATUSES).required(),
  resolutionNote: Joi.string().trim().max(1000).allow('').optional()
});

export const franchiseLeadSchema = Joi.object({
  name: Joi.string().trim().min(2).max(120).required(),
  phone: phoneRule.required(),
  email: emailRule.allow('', null).optional(),
  city: Joi.string().trim().min(2).max(120).required(),
  investmentRange: Joi.string().trim().min(2).max(120).required(),
  experience: Joi.string().trim().max(500).allow('').optional(),
  message: Joi.string().trim().max(2000).allow('').optional()
});

export const updateFranchiseLeadStatusSchema = Joi.object({
  status: Joi.string().valid(...FRANCHISE_LEAD_STATUSES).required(),
  followUpNote: Joi.string().trim().max(1000).allow('').optional()
});

