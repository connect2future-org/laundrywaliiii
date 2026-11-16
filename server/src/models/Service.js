import mongoose from 'mongoose';
import { PRICING_UNITS } from '../config/constants.js';

const SLUG_REGEX = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

const serviceVariantSchema = new mongoose.Schema(
  {
    code: { type: String, trim: true, lowercase: true, default: null },
    name: { type: String, required: true, trim: true },
    variantType: {
      type: String,
      enum: ['standard', 'treatment', 'size', 'tier'],
      default: 'standard'
    },
    price: { type: Number, min: 0, default: null },
    additionalCharge: { type: Number, min: 0, default: 0 },
    unit: { type: String, enum: [...PRICING_UNITS, null], default: null },
    isDefault: { type: Boolean, default: false },
    isAvailable: { type: Boolean, default: true },
    isActive: { type: Boolean, default: true }
  },
  { _id: true }
);

const serviceCatalogItemSchema = new mongoose.Schema(
  {
    itemCode: { type: String, required: true, trim: true, lowercase: true },
    name: { type: String, required: true, trim: true },
    subCategory: { type: String, trim: true, default: null },
    description: { type: String, trim: true, default: null },
    pricingMethod: {
      type: String,
      enum: ['per_unit', 'variant', 'fixed_size'],
      default: 'variant'
    },
    basePrice: { type: Number, min: 0, default: null },
    pricingUnit: { type: String, enum: [...PRICING_UNITS, null], default: null },
    minQuantity: { type: Number, min: 1, default: 1 },
    quantityStep: { type: Number, min: 1, default: 1 },
    variants: { type: [serviceVariantSchema], default: [] },
    isAvailable: { type: Boolean, default: true },
    isActive: { type: Boolean, default: true },
    sortOrder: { type: Number, default: 0 }
  },
  { _id: true }
);

const serviceAddOnSchema = new mongoose.Schema(
  {
    code: { type: String, required: true, trim: true, lowercase: true },
    name: { type: String, required: true, trim: true },
    description: { type: String, trim: true, default: null },
    price: { type: Number, min: 0, default: 0 },
    isAvailable: { type: Boolean, default: true },
    isActive: { type: Boolean, default: true }
  },
  { _id: true }
);

const serviceSchema = new mongoose.Schema(
  {
    categorySlug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      match: [SLUG_REGEX, 'Category slug must be lowercase alphanumeric with hyphens']
    },
    name: {
      type: String,
      required: true,
      trim: true
    },
    price: {
      type: Number,
      min: 0,
      default: null
    },
    pricingMethod: {
      type: String,
      enum: ['per_unit', 'itemized', 'fixed_size', 'custom'],
      default: 'per_unit'
    },
    pricingUnit: {
      type: String,
      enum: [...PRICING_UNITS, null],
      default: null
    },
    description: {
      type: String,
      trim: true,
      default: null
    },
    features: {
      type: [String],
      default: null
    },
    image: {
      type: String,
      trim: true,
      default: null
    },
    selectionMode: {
      type: String,
      enum: ['direct-unit', 'item-selection', 'customization'],
      required: true
    },
    items: {
      type: [serviceCatalogItemSchema],
      default: null
    },
    addOns: {
      type: [serviceAddOnSchema],
      default: null
    },
    minQuantity: {
      type: Number,
      min: 1,
      default: 1
    },
    quantityStep: {
      type: Number,
      min: 1,
      default: 1
    },
    turnaroundHours: {
      type: Number,
      min: 1,
      default: null
    },
    sortOrder: {
      type: Number,
      default: 0
    },
    isAvailable: {
      type: Boolean,
      default: true
    },
    isCustomerVisible: {
      type: Boolean,
      default: true
    },
    isActive: {
      type: Boolean,
      default: true
    },
    updatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'AdminUser',
      default: null
    }
  },
  {
    timestamps: true,
    collection: 'services'
  }
);

serviceSchema.index({ isActive: 1, isCustomerVisible: 1, sortOrder: 1 });
serviceSchema.index({ 'items.itemCode': 1 });

export const Service = mongoose.model('Service', serviceSchema);
export default Service;
