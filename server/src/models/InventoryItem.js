import mongoose from 'mongoose';
import { INVENTORY_CATEGORIES } from '../config/constants.js';

const inventoryItemSchema = new mongoose.Schema(
  {
    sku: {
      type: String,
      required: true,
      unique: true,
      uppercase: true,
      trim: true
    },
    name: {
      type: String,
      required: true,
      trim: true
    },
    category: {
      type: String,
      enum: INVENTORY_CATEGORIES,
      required: true
    },
    branchId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Branch',
      required: true
    },
    unit: {
      type: String,
      enum: ['kg', 'liter', 'unit', 'pack', 'bottle'],
      required: true
    },
    currentStock: {
      type: Number,
      required: true,
      min: 0,
      default: 0
    },
    reorderLevel: {
      type: Number,
      min: 0,
      default: 5
    },
    costPerUnit: {
      type: Number,
      min: 0,
      default: 0
    },
    supplierName: {
      type: String,
      trim: true,
      default: ''
    },
    lastRestockedAt: {
      type: Date,
      default: null
    },
    isActive: {
      type: Boolean,
      default: true
    }
  },
  {
    timestamps: true,
    collection: 'inventory_items'
  }
);

inventoryItemSchema.index({ branchId: 1, category: 1 });
inventoryItemSchema.index({ branchId: 1, currentStock: 1 });

export const InventoryItem = mongoose.model('InventoryItem', inventoryItemSchema);
export default InventoryItem;

