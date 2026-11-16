import { InventoryItem, InventoryTransaction, Branch } from '../models/index.js';
import { adjustInventoryStock } from '../services/inventoryService.js';
import { AppError, asyncHandler } from '../middleware/errorMiddleware.js';

export const listInventoryItems = asyncHandler(async (req, res) => {
  const filter = {};
  if (req.admin.role !== 'super_admin' && req.admin.assignedBranchId) {
    filter.branchId = req.admin.assignedBranchId;
  } else if (req.query.branchId) {
    filter.branchId = req.query.branchId;
  }
  if (req.query.category) filter.category = req.query.category;

  const items = await InventoryItem.find(filter)
    .populate('branchId', 'name slug')
    .sort({ name: 1 })
    .lean();

  res.json({ success: true, count: items.length, items });
});

export const createInventoryItem = asyncHandler(async (req, res) => {
  const branch = await Branch.findById(req.body.branchId);
  if (!branch) throw new AppError('Branch not found', 404);

  if (
    req.admin.role !== 'super_admin' &&
    req.admin.assignedBranchId &&
    String(branch._id) !== String(req.admin.assignedBranchId)
  ) {
    throw new AppError('Cannot create inventory item for another branch.', 403);
  }

  const item = await InventoryItem.create(req.body);
  res.status(201).json({ success: true, item });
});

export const recordInventoryTransaction = asyncHandler(async (req, res) => {
  const existingItem = await InventoryItem.findById(req.params.id);
  if (!existingItem) throw new AppError('Inventory item not found', 404);

  if (
    req.admin.role !== 'super_admin' &&
    req.admin.assignedBranchId &&
    String(existingItem.branchId) !== String(req.admin.assignedBranchId)
  ) {
    throw new AppError('Cannot adjust inventory for another branch.', 403);
  }

  const result = await adjustInventoryStock({
    inventoryItemId: existingItem._id,
    type: req.body.type,
    quantity: req.body.quantity,
    unitCost: req.body.unitCost,
    referenceNote: req.body.referenceNote,
    orderId: req.body.orderId,
    adminUser: req.admin
  });

  res.status(201).json({ success: true, ...result });
});

export const listInventoryTransactions = asyncHandler(async (req, res) => {
  const filter = {};
  if (req.params.id) filter.inventoryItemId = req.params.id;
  if (req.admin.role !== 'super_admin' && req.admin.assignedBranchId) {
    filter.branchId = req.admin.assignedBranchId;
  } else if (req.query.branchId) {
    filter.branchId = req.query.branchId;
  }

  const transactions = await InventoryTransaction.find(filter)
    .populate('inventoryItemId', 'sku name unit')
    .populate('performedBy', 'fullName role')
    .sort({ createdAt: -1 })
    .limit(100)
    .lean();

  res.json({ success: true, count: transactions.length, transactions });
});

