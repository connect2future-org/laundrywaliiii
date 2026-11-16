import mongoose from 'mongoose';
import { ADMIN_ROLES } from '../config/constants.js';

const adminUserSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 120
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, 'Valid admin email is required']
    },
    phone: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      match: [/^[6-9]\d{9}$/, 'Valid 10-digit phone number is required']
    },
    passwordHash: {
      type: String,
      required: true,
      select: false
    },
    role: {
      type: String,
      enum: ADMIN_ROLES,
      required: true,
      default: 'operator'
    },
    assignedBranchId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Branch',
      default: null
    },
    permissions: {
      type: [String],
      default: []
    },
    isActive: {
      type: Boolean,
      default: true
    },
    lastLoginAt: {
      type: Date,
      default: null
    }
  },
  {
    timestamps: true,
    collection: 'admin_users'
  }
);

adminUserSchema.index({ role: 1, isActive: 1 });
adminUserSchema.index({ assignedBranchId: 1 });

export const AdminUser = mongoose.model('AdminUser', adminUserSchema);
export default AdminUser;

