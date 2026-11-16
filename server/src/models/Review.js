import mongoose from 'mongoose';
import { REVIEW_STATUSES } from '../config/constants.js';

const reviewSchema = new mongoose.Schema(
  {
    customerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Customer',
      default: null
    },
    orderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Order',
      default: null
    },
    branchId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Branch',
      required: true
    },
    customerDisplayName: {
      type: String,
      required: true,
      trim: true,
      maxlength: 80
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5
    },
    comment: {
      type: String,
      required: true,
      trim: true,
      minlength: 5,
      maxlength: 1000
    },
    serviceCategories: {
      type: [String],
      default: []
    },
    status: {
      type: String,
      enum: REVIEW_STATUSES,
      default: 'pending'
    },
    isVerifiedPurchase: {
      type: Boolean,
      default: false
    },
    moderatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'AdminUser',
      default: null
    },
    moderatedAt: {
      type: Date,
      default: null
    }
  },
  {
    timestamps: true,
    collection: 'reviews'
  }
);

reviewSchema.index({ branchId: 1, status: 1, createdAt: -1 });
reviewSchema.index({ orderId: 1 }, { sparse: true });
reviewSchema.index({ status: 1, rating: -1 });

export const Review = mongoose.model('Review', reviewSchema);
export default Review;

