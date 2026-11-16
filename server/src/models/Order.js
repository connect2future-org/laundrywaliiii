import mongoose from 'mongoose';
import { ORDER_STATUSES, PAYMENT_METHODS, PAYMENT_STATUSES } from '../config/constants.js';

const addressSnapshotSchema = new mongoose.Schema(
  {
    addressLine: { type: String, trim: true, default: '' },
    houseNo: { type: String, trim: true, default: '' },
    street: { type: String, trim: true, default: '' },
    landmark: { type: String, trim: true, default: '' },
    area: { type: String, trim: true, default: '' },
    city: { type: String, trim: true, default: 'Mysore' },
    pincode: { type: String, trim: true, default: '' }
  },
  { _id: false }
);

const orderSchema = new mongoose.Schema(
  {
    bookingId: {
      type: String,
      required: true,
      unique: true,
      uppercase: true,
      trim: true
    },
    customerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Customer',
      default: null
    },
    customerSnapshot: {
      fullName: { type: String, required: true, trim: true },
      phone: { type: String, required: true, trim: true, match: [/^[6-9]\d{9}$/, 'Valid phone is required'] },
      email: { type: String, trim: true, lowercase: true, default: null }
    },
    branchId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Branch',
      required: true
    },
    addressId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Address',
      default: null
    },
    pickupAddress: {
      type: addressSnapshotSchema,
      required: true
    },
    schedule: {
      pickupDate: { type: Date, required: true },
      pickupSlot: { type: String, required: true, trim: true },
      expectedDeliveryDate: { type: Date, default: null },
      instructions: { type: String, trim: true, default: '' }
    },
    status: {
      type: String,
      enum: ORDER_STATUSES,
      default: 'pending'
    },
    paymentMethod: {
      type: String,
      enum: PAYMENT_METHODS,
      default: 'cod'
    },
    paymentStatus: {
      type: String,
      enum: PAYMENT_STATUSES,
      default: 'pending'
    },
    subtotal: {
      type: Number,
      min: 0,
      default: 0
    },
    discountAmount: {
      type: Number,
      min: 0,
      default: 0
    },
    deliveryFee: {
      type: Number,
      min: 0,
      default: 0
    },
    gstAmount: {
      type: Number,
      min: 0,
      default: 0
    },
    pricingSettingsSnapshot: {
      gstPercentage: { type: Number, min: 0, default: 0 },
      deliveryFeeApplied: { type: Number, min: 0, default: 0 },
      freeDeliveryThreshold: { type: Number, min: 0, default: 0 }
    },
    totalAmount: {
      type: Number,
      min: 0,
      default: 0
    },
    assignedPilotId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'AdminUser',
      default: null
    },
    cancelledReason: {
      type: String,
      trim: true,
      default: null
    }
  },
  {
    timestamps: true,
    collection: 'orders'
  }
);

orderSchema.index({ customerId: 1, createdAt: -1 });
orderSchema.index({ branchId: 1, status: 1, createdAt: -1 });
orderSchema.index({ status: 1, 'schedule.pickupDate': 1 });
orderSchema.index({ 'customerSnapshot.phone': 1, createdAt: -1 });

export const Order = mongoose.model('Order', orderSchema);
export default Order;

