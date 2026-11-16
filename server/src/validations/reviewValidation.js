import Joi from 'joi';
import { objectIdRule } from './commonValidation.js';
import { REVIEW_STATUSES } from '../config/constants.js';

export const createReviewSchema = Joi.object({
  orderId: objectIdRule.allow(null).optional(),
  branchId: objectIdRule.required(),
  customerDisplayName: Joi.string().trim().min(2).max(80).required(),
  rating: Joi.number().integer().min(1).max(5).required(),
  comment: Joi.string().trim().min(5).max(1000).required(),
  serviceCategories: Joi.array().items(Joi.string().trim()).optional()
});

export const moderateReviewSchema = Joi.object({
  status: Joi.string().valid(...REVIEW_STATUSES).required()
});

