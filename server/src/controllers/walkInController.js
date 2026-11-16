import { WalkInOrder, OrderItem, OrderTracking, Branch } from '../models/index.js';
import { generateRefCode } from '../services/orderService.js';
import { AppError, asyncHandler } from '../middleware/errorMiddleware.js';

export const createWalkInOrder = asyncHandler(async (req, res) => {
  const branch = await Branch.findById(req.body.branchId);
  if (!branch || !branch.isActive) {
    throw new AppError('Branch not found or inactive', 400);
  }

  if (
    req.admin.role !== 'super_admin' &&
    req.admin.assignedBranchId &&
    String(branch._id) !== String(req.admin.assignedBranchId)
  ) {
    throw new AppError('Cannot create walk-in order outside your assigned branch.', 403);
  }

  let subtotal = 0;
  const lineDocs = req.body.items.map((item) => {
    const surcharge = Number(item.surchargePerUnit || 0);
    const lineTotal = (Number(item.unitPrice) + surcharge) * Number(item.quantity);
    subtotal += lineTotal;
    return {
      ...item,
      surchargePerUnit: surcharge,
      lineTotal
    };
  });

  const discountAmount = Number(req.body.discountAmount || 0);
  const gstAmount = Math.round(subtotal * 0.05 * 100) / 100;
  const totalAmount = Math.max(0, Math.round((subtotal + gstAmount - discountAmount) * 100) / 100);
  const amountPaid = Number(req.body.amountPaid || 0);
  const paymentStatus = amountPaid >= totalAmount ? 'captured' : amountPaid > 0 ? 'authorized' : 'pending';

  const receiptNumber = generateRefCode('LWW');

  const walkInOrder = await WalkInOrder.create({
    receiptNumber,
    branchId: branch._id,
    customerId: req.body.customerId || null,
    customerName: req.body.customerName,
    customerPhone: req.body.customerPhone,
    status: 'received',
    subtotal,
    discountAmount,
    gstAmount,
    totalAmount,
    amountPaid,
    paymentMethod: req.body.paymentMethod || 'cod',
    paymentStatus,
    dueDate: req.body.dueDate || null,
    notes: req.body.notes || '',
    createdBy: req.admin._id
  });

  const items = await OrderItem.insertMany(
    lineDocs.map((it) => ({
      ...it,
      orderType: 'walk_in',
      walkInOrderId: walkInOrder._id
    }))
  );

  const tracking = await OrderTracking.create({
    walkInOrderId: walkInOrder._id,
    trackingCode: receiptNumber,
    currentStatus: 'confirmed',
    events: [
      {
        status: 'confirmed',
        note: 'Walk-in order received at branch counter.',
        location: branch.name,
        updatedBy: req.admin._id
      }
    ]
  });

  res.status(201).json({ success: true, walkInOrder, items, tracking });
});

export const listWalkInOrders = asyncHandler(async (req, res) => {
  const filter = {};
  if (req.admin.role !== 'super_admin' && req.admin.assignedBranchId) {
    filter.branchId = req.admin.assignedBranchId;
  } else if (req.query.branchId) {
    filter.branchId = req.query.branchId;
  }

  if (req.query.status) {
    filter.status = req.query.status;
  }

  const orders = await WalkInOrder.find(filter)
    .populate('branchId', 'name slug')
    .sort({ createdAt: -1 })
    .limit(100)
    .lean();

  res.json({ success: true, count: orders.length, walkInOrders: orders });
});

export const updateWalkInOrderStatus = asyncHandler(async (req, res) => {
  const walkInOrder = await WalkInOrder.findById(req.params.id);
  if (!walkInOrder) {
    throw new AppError('Walk-in order not found', 404);
  }

  if (
    req.admin.role !== 'super_admin' &&
    req.admin.assignedBranchId &&
    String(walkInOrder.branchId) !== String(req.admin.assignedBranchId)
  ) {
    throw new AppError('Cannot update walk-in order outside your assigned branch.', 403);
  }

  walkInOrder.status = req.body.status;
  if (req.body.amountPaid !== undefined) {
    walkInOrder.amountPaid = Number(req.body.amountPaid);
    if (walkInOrder.amountPaid >= walkInOrder.totalAmount) {
      walkInOrder.paymentStatus = 'captured';
    }
  }
  if (req.body.status === 'completed' && !walkInOrder.collectedAt) {
    walkInOrder.collectedAt = new Date();
  }
  if (req.body.notes !== undefined) walkInOrder.notes = req.body.notes;

  await walkInOrder.save();
  res.json({ success: true, walkInOrder });
});

