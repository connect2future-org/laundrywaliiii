import mongoose from 'mongoose';
import { EXPENSE_CATEGORIES, PAYMENT_METHODS } from '../config/constants.js';

const expenseSchema = new mongoose.Schema(
  {
    expenseCode: {
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
    category: {
      type: String,
      enum: EXPENSE_CATEGORIES,
      required: true
    },
    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 160
    },
    description: {
      type: String,
      trim: true,
      default: ''
    },
    amount: {
      type: Number,
      required: true,
      min: 0
    },
    expenseDate: {
      type: Date,
      required: true,
      default: Date.now
    },
    paymentMethod: {
      type: String,
      enum: [...PAYMENT_METHODS, 'cash', 'bank_transfer'],
      default: 'bank_transfer'
    },
    vendorName: {
      type: String,
      trim: true,
      default: ''
    },
    receiptRef: {
      type: String,
      trim: true,
      default: ''
    },
    approvedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'AdminUser',
      default: null
    },
    recordedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'AdminUser',
      required: true
    }
  },
  {
    timestamps: true,
    collection: 'expenses'
  }
);

expenseSchema.index({ branchId: 1, expenseDate: -1 });
expenseSchema.index({ category: 1, expenseDate: -1 });

export const Expense = mongoose.model('Expense', expenseSchema);
export default Expense;

