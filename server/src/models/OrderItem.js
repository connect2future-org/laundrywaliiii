import mongoose from 'mongoose';
import { PRICING_UNITS } from '../config/constants.js';

const addOnSnapshotSchema = new mongoose.Schema(
  {
    addOnId: { type: mongoose.Schema.Types.ObjectId, default: null },
    code: { type: String, trim: true, default: '' },
    name: { type: String, required: true, trim: true },
    price: { type: Number, required: true, min: 0 }
  },
  { _id: false }
);

const orderItemSchema = new mongoose.Schema(
  {
    orderType: {
      type: String,
      enum: ['online', 'walk_in'],
      required: true,
      default: 'online'
    },
    orderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Order',
      default: null
    },
    walkInOrderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'WalkInOrder',
      default: null
    },
    serviceId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Service',
      default: null
    },
    categorySlug: {
      type: String,
      required: true,
      lowercase: true,
      trim: true
    },
    serviceName: {
      type: String,
      required: true,
      trim: true
    },
    itemId: {
      type: mongoose.Schema.Types.ObjectId,
      default: null
    },
    itemCode: {
      type: String,
      trim: true,
      default: null
    },
    itemName: {
      type: String,
      trim: true,
      default: null
    },
    variantId: {
      type: mongoose.Schema.Types.ObjectId,
      default: null
    },
    variantName: {
      type: String,
      trim: true,
      default: null
    },
    treatmentName: {
      type: String,
      trim: true,
      default: null
    },
    pricingUnit: {
      type: String,
      enum: [...PRICING_UNITS, null],
      default: null
    },
    quantity: {
      type: Number,
      required: true,
      min: 1
    },
    unitPrice: {
      type: Number,
      required: true,
      min: 0
    },
    additionalCharge: {
      type: Number,
      min: 0,
      default: 0
    },
    addOnCharges: {
      type: Number,
      min: 0,
      default: 0
    },
    surchargePerUnit: {
      type: Number,
      min: 0,
      default: 0
    },
    addOnsSnapshot: {
      type: [addOnSnapshotSchema],
      default: []
    },
    lineTotal: {
      type: Number,
      required: true,
      min: 0
    },
    customizations: {
      type: mongoose.Schema.Types.Mixed,
      default: {}
    },
    processingStatus: {
      type: String,
      enum: ['queued', 'washing', 'drying', 'ironing', 'quality_check', 'completed'],
      default: 'queued'
    }
  },
  {
    timestamps: true,
    collection: 'order_items'
  }
);

orderItemSchema.index({ orderId: 1 });
orderItemSchema.index({ walkInOrderId: 1 });
orderItemSchema.index({ serviceId: 1 });

export const OrderItem = mongoose.model('OrderItem', orderItemSchema);
export default OrderItem;
