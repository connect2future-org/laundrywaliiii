import mongoose from 'mongoose';
import { ORDER_STATUSES } from '../config/constants.js';

const trackingEventSchema = new mongoose.Schema(
  {
    status: {
      type: String,
      required: true,
      trim: true
    },
    note: {
      type: String,
      trim: true,
      default: ''
    },
    location: {
      type: String,
      trim: true,
      default: ''
    },
    updatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'AdminUser',
      default: null
    },
    timestamp: {
      type: Date,
      default: Date.now
    }
  },
  { _id: true }
);

const orderTrackingSchema = new mongoose.Schema(
  {
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
    trackingCode: {
      type: String,
      required: true,
      unique: true,
      uppercase: true,
      trim: true
    },
    currentStatus: {
      type: String,
      required: true,
      enum: ORDER_STATUSES,
      default: 'pending'
    },
    events: {
      type: [trackingEventSchema],
      default: []
    },
    pickupConfirmedAt: { type: Date, default: null },
    processingStartedAt: { type: Date, default: null },
    qualityCheckedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'AdminUser',
      default: null
    },
    qualityCheckPassed: { type: Boolean, default: null },
    readyAt: { type: Date, default: null },
    deliveredAt: { type: Date, default: null }
  },
  {
    timestamps: true,
    collection: 'order_tracking'
  }
);

orderTrackingSchema.index({ orderId: 1 }, { sparse: true });
orderTrackingSchema.index({ walkInOrderId: 1 }, { sparse: true });
orderTrackingSchema.index({ currentStatus: 1, updatedAt: -1 });

export const OrderTracking = mongoose.model('OrderTracking', orderTrackingSchema);
export default OrderTracking;

