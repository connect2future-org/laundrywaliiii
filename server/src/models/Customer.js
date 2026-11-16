import mongoose from 'mongoose';

const customerSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: [true, 'Customer full name is required'],
      trim: true,
      minlength: 2,
      maxlength: 120
    },
    phone: {
      type: String,
      required: [true, 'Customer phone number is required'],
      unique: true,
      trim: true,
      match: [/^[6-9]\d{9}$/, 'Please provide a valid 10-digit Indian mobile number']
    },
    email: {
      type: String,
      unique: true,
      sparse: true,
      lowercase: true,
      trim: true,
      match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, 'Please provide a valid email address']
    },
    passwordHash: {
      type: String,
      required: [true, 'Password hash is required'],
      select: false
    },
    isPhoneVerified: {
      type: Boolean,
      default: false
    },
    isEmailVerified: {
      type: Boolean,
      default: false
    },
    isActive: {
      type: Boolean,
      default: true
    },
    defaultBranchId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Branch',
      default: null
    },
    loyaltyPoints: {
      type: Number,
      min: 0,
      default: 0
    },
    lastLoginAt: {
      type: Date,
      default: null
    }
  },
  {
    timestamps: true,
    collection: 'customers'
  }
);

customerSchema.index({ createdAt: -1 });
customerSchema.index({ isActive: 1 });

export const Customer = mongoose.model('Customer', customerSchema);
export default Customer;

