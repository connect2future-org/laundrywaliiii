import { InventoryItem, InventoryTransaction } from '../models/index.js';
import { AppError } from '../middleware/errorMiddleware.js';

export const adjustInventoryStock = async ({
  inventoryItemId,
  type,
  quantity,
  referenceNote = '',
  orderId = null,
  unitCost = null,
  adminUser
}) => {
  const item = await InventoryItem.findById(inventoryItemId);
  if (!item) {
    throw new AppError('Inventory item not found', 404);
  }

  const qty = Number(quantity);
  if (!Number.isFinite(qty) || qty <= 0) {
    throw new AppError('Quantity must be a positive number', 400);
  }

  const previousStock = item.currentStock;
  let newStock = previousStock;

  if (type === 'stock_in') {
    newStock = previousStock + qty;
    item.lastRestockedAt = new Date();
  } else if (type === 'stock_out' || type === 'waste') {
    if (previousStock < qty) {
      throw new AppError(
        `Insufficient stock for "${item.name}". Available: ${previousStock} ${item.unit}`,
        400
      );
    }
    newStock = previousStock - qty;
  } else if (type === 'adjustment') {
    newStock = qty;
  } else {
    throw new AppError(`Invalid inventory transaction type "${type}"`, 400);
  }

  item.currentStock = newStock;
  if (unitCost !== null && unitCost !== undefined) {
    item.costPerUnit = Number(unitCost);
  }
  await item.save();

  const tx = await InventoryTransaction.create({
    inventoryItemId: item._id,
    branchId: item.branchId,
    type,
    quantity: qty,
    previousStock,
    newStock,
    unitCost: unitCost ?? item.costPerUnit,
    referenceNote,
    orderId,
    performedBy: adminUser._id
  });

  return { item, transaction: tx };
};

