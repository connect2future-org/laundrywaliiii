import mongoose from 'mongoose';

const addressSchema = new mongoose.Schema(
  {
    customerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Customer',
      required: true,
      index: true
    },
    label: {
      type: String,
      enum: ['Home', 'Work', 'Other'],
      default: 'Home'
    },
    houseNo: {
      type: String,
      required: [true, 'House / Flat / Building is required'],
      trim: true,
      maxlength: 150
    },
    street: {
      type: String,
      required: [true, 'Street / Society name is required'],
      trim: true,
      maxlength: 200
    },
    landmark: {
      type: String,
      trim: true,
      maxlength: 200,
      default: ''
    },
    area: {
      type: String,
      trim: true,
      maxlength: 120,
      default: ''
    },
    city: {
      type: String,
      required: true,
      trim: true,
      default: 'Mysore'
    },
    state: {
      type: String,
      required: true,
      trim: true,
      default: 'Karnataka'
    },
    pincode: {
      type: String,
      required: [true, 'PIN code is required'],
      trim: true,
      match: [/^\d{6}$/, 'PIN code must be 6 digits']
    },
    coordinates: {
      lat: { type: Number, default: null },
      lng: { type: Number, default: null }
    },
    isDefault: {
      type: Boolean,
      default: false
    }
  },
  {
    timestamps: true,
    collection: 'addresses'
  }
);

addressSchema.index({ customerId: 1, isDefault: -1 });
addressSchema.index({ pincode: 1 });

export const Address = mongoose.model('Address', addressSchema);
export default Address;

