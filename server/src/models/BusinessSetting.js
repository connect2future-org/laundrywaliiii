import mongoose from 'mongoose';

const businessSettingSchema = new mongoose.Schema(
  {
    key: {
      type: String,
      required: true,
      unique: true,
      default: 'default',
      trim: true
    },
    gstPercentage: {
      type: Number,
      required: true,
      min: 0,
      max: 100
    },
    deliveryFee: {
      type: Number,
      required: true,
      min: 0
    },
    freeDeliveryThreshold: {
      type: Number,
      required: true,
      min: 0
    },
    updatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'AdminUser',
      default: null
    }
  },
  {
    timestamps: true,
    collection: 'business_settings'
  }
);

export const BusinessSetting = mongoose.model('BusinessSetting', businessSettingSchema);
export default BusinessSetting;

