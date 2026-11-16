import mongoose from 'mongoose';
import { ENQUIRY_STATUSES } from '../config/constants.js';

const contactEnquirySchema = new mongoose.Schema(
  {
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
    subject: {
      type: String,
      trim: true,
      default: 'General Service Inquiry'
    },
    message: {
      type: String,
      required: false,
      trim: true,
      default: '',
      maxlength: 2000
    },
    source: {
      type: String,
      trim: true,
      default: 'website_contact_page'
    },
    status: {
      type: String,
      enum: ENQUIRY_STATUSES,
      default: 'new'
    },
    assignedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'AdminUser',
      default: null
    },
    resolutionNote: {
      type: String,
      trim: true,
      default: ''
    }
  },
  {
    timestamps: true,
    collection: 'contact_enquiries'
  }
);

contactEnquirySchema.index({ status: 1, createdAt: -1 });
contactEnquirySchema.index({ phone: 1 });

export const ContactEnquiry = mongoose.model('ContactEnquiry', contactEnquirySchema);
export default ContactEnquiry;

