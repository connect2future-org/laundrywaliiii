import { Payment, PaymentAttempt, Order, WalkInOrder } from '../models/index.js';
import { generateRefCode } from '../services/orderService.js';
import { AppError, asyncHandler } from '../middleware/errorMiddleware.js';

export const initiatePayment = asyncHandler(async (req, res) => {
  const { orderId, walkInOrderId, method, amount, idempotencyKey, gatewayName } = req.body;

  let targetOrder = null;
  let targetWalkIn = null;
  let branchId = null;

  if (orderId) {
    targetOrder = await Order.findById(orderId);
    if (!targetOrder) throw new AppError('Order not found', 404);
    branchId = targetOrder.branchId;
  } else if (walkInOrderId) {
    targetWalkIn = await WalkInOrder.findById(walkInOrderId);
    if (!targetWalkIn) throw new AppError('Walk-in order not found', 404);
    branchId = targetWalkIn.branchId;
  }

  const paymentReference = generateRefCode('PAY');
  const payment = await Payment.create({
    paymentReference,
    orderId: targetOrder?._id || null,
    walkInOrderId: targetWalkIn?._id || null,
    customerId: targetOrder?.customerId || req.customer?._id || null,
    branchId,
    method,
    amount,
    status: method === 'cod' ? 'pending' : 'initiated',
    gatewayName: gatewayName || null,
    recordedBy: req.admin?._id || null
  });

  const attempt = await PaymentAttempt.create({
    paymentId: payment._id,
    orderId: targetOrder?._id || null,
    walkInOrderId: targetWalkIn?._id || null,
    attemptNumber: 1,
    ...(idempotencyKey ? { idempotencyKey } : {}),
    method,
    amount,
    status: method === 'cod' ? 'pending' : 'created'
  });

  res.status(201).json({ success: true, payment, attempt });
});

export const updatePaymentStatus = asyncHandler(async (req, res) => {
  const payment = await Payment.findById(req.params.id);
  if (!payment) {
    throw new AppError('Payment record not found', 404);
  }

  const { status, gatewayOrderId, gatewayPaymentId, gatewayResponseCode, failureReason, refundedAmount } = req.body;

  payment.status = status;
  if (gatewayOrderId) payment.gatewayOrderId = gatewayOrderId;
  if (gatewayPaymentId) payment.gatewayPaymentId = gatewayPaymentId;
  if (status === 'captured' && !payment.paidAt) payment.paidAt = new Date();
  if (refundedAmount !== undefined) payment.refundedAmount = refundedAmount;
  await payment.save();

  const attemptCount = await PaymentAttempt.countDocuments({ paymentId: payment._id });
  await PaymentAttempt.create({
    paymentId: payment._id,
    orderId: payment.orderId,
    walkInOrderId: payment.walkInOrderId,
    attemptNumber: attemptCount + 1,
    method: payment.method,
    amount: payment.amount,
    status: status === 'captured' ? 'succeeded' : status === 'failed' ? 'failed' : 'pending',
    gatewayRequestId: gatewayOrderId || null,
    gatewayResponseCode: gatewayResponseCode || null,
    failureReason: failureReason || null
  });

  if (payment.orderId) {
    await Order.findByIdAndUpdate(payment.orderId, { paymentStatus: status });
  }
  if (payment.walkInOrderId) {
    await WalkInOrder.findByIdAndUpdate(payment.walkInOrderId, { paymentStatus: status });
  }

  res.json({ success: true, payment });
});

export const listPaymentsAdmin = asyncHandler(async (req, res) => {
  const filter = {};
  if (req.admin.role !== 'super_admin' && req.admin.assignedBranchId) {
    filter.branchId = req.admin.assignedBranchId;
  } else if (req.query.branchId) {
    filter.branchId = req.query.branchId;
  }
  if (req.query.status) filter.status = req.query.status;

  const payments = await Payment.find(filter)
    .populate('orderId', 'bookingId totalAmount')
    .populate('walkInOrderId', 'receiptNumber totalAmount')
    .sort({ createdAt: -1 })
    .limit(100)
    .lean();

  res.json({ success: true, count: payments.length, payments });
});

