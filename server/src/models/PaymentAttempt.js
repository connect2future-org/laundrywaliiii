import mongoose from 'mongoose';
import { PAYMENT_METHODS } from '../config/constants.js';

const paymentAttemptSchema = new mongoose.Schema(
  {
    paymentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Payment',
      required: true
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
    attemptNumber: {
      type: Number,
      required: true,
      min: 1
    },
    idempotencyKey: {
      type: String,
      unique: true,
      sparse: true,
      trim: true
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
    status: {
      type: String,
      enum: ['created', 'pending', 'succeeded', 'failed', 'cancelled'],
      default: 'created'
    },
    gatewayRequestId: {
      type: String,
      trim: true,
      default: null
    },
    gatewayResponseCode: {
      type: String,
      trim: true,
      default: null
    },
    failureReason: {
      type: String,
      trim: true,
      default: null
    },
    attemptedAt: {
      type: Date,
      default: Date.now
    }
  },
  {
    timestamps: true,
    collection: 'payment_attempts'
  }
);

paymentAttemptSchema.index({ paymentId: 1, attemptNumber: 1 });
paymentAttemptSchema.index({ orderId: 1, attemptedAt: -1 });

export const PaymentAttempt = mongoose.model('PaymentAttempt', paymentAttemptSchema);
export default PaymentAttempt;

