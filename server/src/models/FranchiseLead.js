import mongoose from 'mongoose';
import { FRANCHISE_LEAD_STATUSES } from '../config/constants.js';

const franchiseLeadSchema = new mongoose.Schema(
  {
    leadRef: {
      type: String,
      required: true,
      unique: true,
      uppercase: true,
      trim: true
    },
    name: {
      type: String,
      required: true,
      trim: true,
      maxlength: 120
    },
    phone: {
      type: String,
      required: true,
      trim: true,
      match: [/^[6-9]\d{9}$/, 'Valid 10-digit mobile number is required']
    },
    email: {
      type: String,
      required: false,
      lowercase: true,
      trim: true,
      default: '',
      validate: {
        validator: (v) => !v || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v),
        message: 'Valid email is required'
      }
    },
    city: {
      type: String,
      required: true,
      trim: true
    },
    investmentRange: {
      type: String,
      required: true,
      trim: true
    },
    experience: {
      type: String,
      trim: true,
      default: ''
    },
    message: {
      type: String,
      trim: true,
      default: ''
    },
    status: {
      type: String,
      enum: FRANCHISE_LEAD_STATUSES,
      default: 'new'
    },
    assignedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'AdminUser',
      default: null
    },
    followUpNote: {
      type: String,
      trim: true,
      default: ''
    }
  },
  {
    timestamps: true,
    collection: 'franchise_leads'
  }
);

franchiseLeadSchema.index({ status: 1, createdAt: -1 });
franchiseLeadSchema.index({ city: 1 });

export const FranchiseLead = mongoose.model('FranchiseLead', franchiseLeadSchema);
export default FranchiseLead;

