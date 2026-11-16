import mongoose from 'mongoose';
import { PAYMENT_METHODS, PAYMENT_STATUSES } from '../config/constants.js';

const paymentSchema = new mongoose.Schema(
  {
    paymentReference: {
      type: String,
      required: true,
      unique: true,
      uppercase: true,
      trim: true
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
    customerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Customer',
      default: null
    },
    branchId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Branch',
      required: true
    },
    method: {
      type: String,
      enum: PAYMENT_METHODS,
      required: true
    },
    amount: {
      type: Number,
      required: true,
      min: 0
    },
    currency: {
      type: String,
      default: 'INR',
      uppercase: true,
      trim: true
    },
    status: {
      type: String,
      enum: PAYMENT_STATUSES,
      default: 'pending'
    },
    gatewayName: {
      type: String,
      trim: true,
      default: null
    },
    gatewayOrderId: {
      type: String,
      trim: true,
      default: null
    },
    gatewayPaymentId: {
      type: String,
      trim: true,
      default: null
    },
    paidAt: {
      type: Date,
      default: null
    },
    refundedAmount: {
      type: Number,
      min: 0,
      default: 0
    },
    recordedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'AdminUser',
      default: null
    }
  },
  {
    timestamps: true,
    collection: 'payments'
  }
);

paymentSchema.index({ orderId: 1 });
paymentSchema.index({ walkInOrderId: 1 });
paymentSchema.index({ branchId: 1, status: 1, createdAt: -1 });
paymentSchema.index({ status: 1, createdAt: -1 });

export const Payment = mongoose.model('Payment', paymentSchema);
export default Payment;

