import mongoose from 'mongoose';
import { INVENTORY_TRANSACTION_TYPES } from '../config/constants.js';

const inventoryTransactionSchema = new mongoose.Schema(
  {
    inventoryItemId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'InventoryItem',
      required: true
    },
    branchId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Branch',
      required: true
    },
    type: {
      type: String,
      enum: INVENTORY_TRANSACTION_TYPES,
      required: true
    },
    quantity: {
      type: Number,
      required: true,
      min: 0.01
    },
    previousStock: {
      type: Number,
      required: true,
      min: 0
    },
    newStock: {
      type: Number,
      required: true,
      min: 0
    },
    unitCost: {
      type: Number,
      min: 0,
      default: 0
    },
    referenceNote: {
      type: String,
      trim: true,
      default: ''
    },
    orderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Order',
      default: null
    },
    performedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'AdminUser',
      required: true
    }
  },
  {
    timestamps: true,
    collection: 'inventory_transactions'
  }
);

inventoryTransactionSchema.index({ inventoryItemId: 1, createdAt: -1 });
inventoryTransactionSchema.index({ branchId: 1, type: 1, createdAt: -1 });

export const InventoryTransaction = mongoose.model('InventoryTransaction', inventoryTransactionSchema);
export default InventoryTransaction;

