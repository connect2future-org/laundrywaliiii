import mongoose from 'mongoose';
import { WALKIN_STATUSES, PAYMENT_METHODS, PAYMENT_STATUSES } from '../config/constants.js';

const walkInOrderSchema = new mongoose.Schema(
  {
    receiptNumber: {
      type: String,
      required: true,
      unique: true,
      uppercase: true,
      trim: true
    },
    branchId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Branch',
      required: true
    },
    customerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Customer',
      default: null
    },
    customerName: {
      type: String,
      required: true,
      trim: true
    },
    customerPhone: {
      type: String,
      required: true,
      trim: true,
      match: [/^[6-9]\d{9}$/, 'Valid 10-digit customer mobile number is required']
    },
    status: {
      type: String,
      enum: WALKIN_STATUSES,
      default: 'received'
    },
    subtotal: {
      type: Number,
      min: 0,
      required: true
    },
    discountAmount: {
      type: Number,
      min: 0,
      default: 0
    },
    gstAmount: {
      type: Number,
      min: 0,
      default: 0
    },
    totalAmount: {
      type: Number,
      min: 0,
      required: true
    },
    amountPaid: {
      type: Number,
      min: 0,
      default: 0
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
    dueDate: {
      type: Date,
      default: null
    },
    collectedAt: {
      type: Date,
      default: null
    },
    notes: {
      type: String,
      trim: true,
      default: ''
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'AdminUser',
      required: true
    }
  },
  {
    timestamps: true,
    collection: 'walk_in_orders'
  }
);

walkInOrderSchema.index({ branchId: 1, status: 1, createdAt: -1 });
walkInOrderSchema.index({ customerPhone: 1, createdAt: -1 });

export const WalkInOrder = mongoose.model('WalkInOrder', walkInOrderSchema);
export default WalkInOrder;

