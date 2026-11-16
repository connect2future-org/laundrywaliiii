import { Order, OrderItem, OrderTracking } from '../models/index.js';
import { createCustomerOrder } from '../services/orderService.js';
import { calculateServerOrderPricing } from '../services/pricingService.js';
import { dispatchOrderNotifications } from '../services/notificationService.js';
import { AppError, asyncHandler } from '../middleware/errorMiddleware.js';

export const quoteOrderPricing = asyncHandler(async (req, res) => {
  const quote = await calculateServerOrderPricing({
    items: req.body.items,
    discountAmount: req.body.discountAmount || 0
  });

  res.status(200).json({
    success: true,
    quote
  });
});

export const createOrder = asyncHandler(async (req, res) => {
  const { order, items, tracking } = await createCustomerOrder({
    payload: req.body,
    customer: req.customer || null
  });

  // Non-blocking multi-channel notification dispatch (never fails order persistence)
  let notifications = null;
  try {
    notifications = await dispatchOrderNotifications({ order, items, tracking });
  } catch (notifErr) {
    console.warn(`[orderController] Non-fatal notification error: ${notifErr.message}`);
  }

  res.status(201).json({
    success: true,
    bookingId: order.bookingId,
    order,
    items,
    tracking,
    notifications
  });
});

export const getOrderByBookingId = asyncHandler(async (req, res) => {
  const bookingId = req.params.bookingId.toUpperCase();
  const order = await Order.findOne({ bookingId })
    .populate('branchId', 'name slug address phone')
    .lean();

  if (!order) {
    throw new AppError(`Order "${bookingId}" not found`, 404);
  }

  // Enforce ownership if authenticated as customer and order belongs to another customer
  if (
    req.customer &&
    order.customerId &&
    String(order.customerId) !== String(req.customer._id)
  ) {
    throw new AppError('You do not have permission to view this order.', 403);
  }

  const [items, tracking] = await Promise.all([
    OrderItem.find({ orderId: order._id }).lean(),
    OrderTracking.findOne({ orderId: order._id }).lean()
  ]);

  res.json({ success: true, order, items, tracking });
});

export const listOrdersAdmin = asyncHandler(async (req, res) => {
  const page = Math.max(1, Number(req.query.page) || 1);
  const limit = Math.min(100, Math.max(1, Number(req.query.limit) || 20));

  const filter = {};
  if (req.admin.role !== 'super_admin' && req.admin.assignedBranchId) {
    filter.branchId = req.admin.assignedBranchId;
  } else if (req.query.branchId) {
    filter.branchId = req.query.branchId;
  }

  if (req.query.status) {
    filter.status = req.query.status;
  }

  const [orders, total] = await Promise.all([
    Order.find(filter)
      .populate('branchId', 'name slug')
      .populate('assignedPilotId', 'fullName phone role')
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .lean(),
    Order.countDocuments(filter)
  ]);

  res.json({
    success: true,
    pagination: { page, limit, total, pages: Math.ceil(total / limit) },
    orders
  });
});

export const updateOrderStatusAdmin = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);
  if (!order) {
    throw new AppError('Order not found', 404);
  }

  if (
    req.admin.role !== 'super_admin' &&
    req.admin.assignedBranchId &&
    String(order.branchId) !== String(req.admin.assignedBranchId)
  ) {
    throw new AppError('Cannot modify an order outside your assigned branch.', 403);
  }

  const { status, note, location, assignedPilotId, qualityCheckPassed, cancelledReason } = req.body;

  order.status = status;
  if (assignedPilotId !== undefined) order.assignedPilotId = assignedPilotId;
  if (status === 'cancelled' && cancelledReason) order.cancelledReason = cancelledReason;
  await order.save();

  const tracking = await OrderTracking.findOne({ orderId: order._id });
  if (tracking) {
    tracking.currentStatus = status;
    tracking.events.push({
      status,
      note: note || `Order moved to ${status.replace(/_/g, ' ')}`,
      location: location || '',
      updatedBy: req.admin._id,
      timestamp: new Date()
    });

    if (status === 'picked_up' && !tracking.pickupConfirmedAt) tracking.pickupConfirmedAt = new Date();
    if (status === 'processing' && !tracking.processingStartedAt) tracking.processingStartedAt = new Date();
    if (status === 'quality_check' && qualityCheckPassed !== undefined) {
      tracking.qualityCheckPassed = qualityCheckPassed;
      tracking.qualityCheckedBy = req.admin._id;
    }
    if (status === 'ready' && !tracking.readyAt) tracking.readyAt = new Date();
    if (status === 'delivered' && !tracking.deliveredAt) tracking.deliveredAt = new Date();

    await tracking.save();
  }

  res.json({ success: true, order, tracking });
});

