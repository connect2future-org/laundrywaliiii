import mongoose from 'mongoose';

const branchSchema = new mongoose.Schema(
  {
    branchCode: {
      type: String,
      required: true,
      unique: true,
      uppercase: true,
      trim: true
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true
    },
    name: {
      type: String,
      required: true,
      trim: true
    },
    area: {
      type: String,
      required: true,
      trim: true
    },
    city: {
      type: String,
      required: true,
      trim: true
    },
    state: {
      type: String,
      required: true,
      trim: true
    },
    pincode: {
      type: String,
      required: true,
      match: [/^\d{6}$/, 'Branch PIN code must be 6 digits']
    },
    address: {
      type: String,
      required: true,
      trim: true
    },
    landmark: {
      type: String,
      trim: true,
      default: ''
    },
    phone: {
      type: String,
      required: true,
      match: [/^[6-9]\d{9}$/, 'Please provide a valid 10-digit branch phone']
    },
    email: {
      type: String,
      trim: true,
      lowercase: true,
      default: null
    },
    operatingHours: {
      type: String,
      trim: true,
      default: null
    },
    serviceablePincodes: {
      type: [String],
      default: []
    },
    servicesOffered: {
      type: [String],
      default: ['wash-fold', 'wash-iron', 'dry-cleaning', 'shoe-cleaning', 'customized-services']
    },
    mapUrl: {
      type: String,
      trim: true,
      default: null
    },
    coordinates: {
      lat: { type: Number, default: null },
      lng: { type: Number, default: null }
    },
    isFlagship: {
      type: Boolean,
      default: false
    },
    isActive: {
      type: Boolean,
      default: true
    }
  },
  {
    timestamps: true,
    collection: 'branches'
  }
);

branchSchema.index({ serviceablePincodes: 1 });
branchSchema.index({ city: 1, isActive: 1 });

export const Branch = mongoose.model('Branch', branchSchema);
export default Branch;

