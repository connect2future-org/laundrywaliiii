import { AdminUser, Order, WalkInOrder, Payment, Expense, Customer, InventoryItem, BusinessSetting } from '../models/index.js';
import { NotificationLog } from '../models/NotificationLog.js';
import { hashPassword } from '../services/passwordService.js';
import { getActiveBusinessPricingSettings } from '../services/pricingService.js';
import { sendWhatsAppNotification } from '../services/whatsappService.js';
import { sendContactEnquiryNotification } from '../services/mailService.js';
import { getEnvConfig } from '../config/env.js';
import { AppError, asyncHandler } from '../middleware/errorMiddleware.js';

export const getBusinessPricingSettingsAdmin = asyncHandler(async (_req, res) => {
  const settings = await getActiveBusinessPricingSettings();
  res.json({ success: true, settings });
});

export const updateBusinessPricingSettingsAdmin = asyncHandler(async (req, res) => {
  const existing = await BusinessSetting.findOne({ key: 'default' });
  if (!existing) {
    throw new AppError('Business pricing settings record not initialized in MongoDB.', 404);
  }

  if (req.body.gstPercentage !== undefined) existing.gstPercentage = req.body.gstPercentage;
  if (req.body.deliveryFee !== undefined) existing.deliveryFee = req.body.deliveryFee;
  if (req.body.freeDeliveryThreshold !== undefined) {
    existing.freeDeliveryThreshold = req.body.freeDeliveryThreshold;
  }
  existing.updatedBy = req.admin._id;
  await existing.save();

  res.json({
    success: true,
    message: 'Business pricing settings updated in MongoDB',
    settings: {
      gstPercentage: existing.gstPercentage,
      deliveryFee: existing.deliveryFee,
      freeDeliveryThreshold: existing.freeDeliveryThreshold
    }
  });
});

export const getAdminProfile = asyncHandler(async (req, res) => {
  const admin = await AdminUser.findById(req.admin._id).populate('assignedBranchId', 'name slug city');
  res.json({ success: true, admin });
});

export const createAdminUser = asyncHandler(async (req, res) => {
  const { fullName, email, phone, password, role, assignedBranchId, permissions } = req.body;

  const existing = await AdminUser.findOne({ $or: [{ email: email.toLowerCase() }, { phone }] });
  if (existing) {
    throw new AppError('An admin/staff account with this email or phone already exists.', 409);
  }

  const passwordHash = await hashPassword(password);
  const adminUser = await AdminUser.create({
    fullName,
    email,
    phone,
    passwordHash,
    role,
    assignedBranchId: assignedBranchId || null,
    permissions: permissions || []
  });

  res.status(201).json({
    success: true,
    admin: {
      id: adminUser._id,
      fullName: adminUser.fullName,
      email: adminUser.email,
      phone: adminUser.phone,
      role: adminUser.role,
      assignedBranchId: adminUser.assignedBranchId
    }
  });
});

export const listAdminUsers = asyncHandler(async (_req, res) => {
  const users = await AdminUser.find({})
    .populate('assignedBranchId', 'name slug')
    .sort({ createdAt: -1 })
    .lean();
  res.json({ success: true, count: users.length, users });
});

export const getDashboardSummary = asyncHandler(async (req, res) => {
  const branchScope =
    req.admin.role !== 'super_admin' && req.admin.assignedBranchId
      ? { branchId: req.admin.assignedBranchId }
      : req.query.branchId
        ? { branchId: req.query.branchId }
        : {};

  const [
    totalOrders,
    pendingOrders,
    totalWalkInOrders,
    totalCustomers,
    capturedPayments,
    totalExpensesAgg,
    lowStockCount
  ] = await Promise.all([
    Order.countDocuments(branchScope),
    Order.countDocuments({ ...branchScope, status: { $in: ['pending', 'confirmed', 'pickup_assigned', 'processing'] } }),
    WalkInOrder.countDocuments(branchScope),
    Customer.countDocuments({ isActive: true }),
    Payment.aggregate([
      { $match: { ...branchScope, status: 'captured' } },
      { $group: { _id: null, revenue: { $sum: '$amount' } } }
    ]),
    Expense.aggregate([
      { $match: branchScope },
      { $group: { _id: null, total: { $sum: '$amount' } } }
    ]),
    InventoryItem.countDocuments({
      ...branchScope,
      isActive: true,
      $expr: { $lte: ['$currentStock', '$reorderLevel'] }
    })
  ]);

  res.json({
    success: true,
    summary: {
      totalOrders,
      activeOrders: pendingOrders,
      totalWalkInOrders,
      totalCustomers,
      capturedRevenue: capturedPayments[0]?.revenue || 0,
      totalExpenses: totalExpensesAgg[0]?.total || 0,
      lowStockItems: lowStockCount
    }
  });
});

export const listNotificationLogsAdmin = asyncHandler(async (req, res) => {
  const { channel, eventType, status, limit = 50 } = req.query;
  const filter = {};
  if (channel) filter.channel = channel;
  if (eventType) filter.eventType = eventType;
  if (status) filter.status = status;

  const logs = await NotificationLog.find(filter)
    .sort({ createdAt: -1 })
    .limit(Math.min(100, Number(limit)))
    .lean();

  res.json({ success: true, count: logs.length, logs });
});

export const testNotificationDeliveryAdmin = asyncHandler(async (req, res) => {
  const { channel = 'whatsapp', recipientOverride } = req.body;
  const cfg = getEnvConfig();

  let result;
  if (channel === 'whatsapp') {
    result = await sendWhatsAppNotification({
      eventType: 'test_diagnostic',
      referenceId: `TEST-${Date.now()}`,
      text: `🧪 *LAUNDRY WALIIII SYSTEM TEST*\n━━━━━━━━━━━━━━━━━━━━\nNotification pipeline verified at ${new Date().toLocaleString('en-IN')}.\nServer Environment: ${cfg.nodeEnv}`,
      recipientOverride
    });
  } else if (channel === 'email') {
    result = await sendContactEnquiryNotification({
      name: 'System Admin Diagnostic',
      phone: '9035999272',
      email: cfg.smtp.contactNotificationEmail,
      subject: 'System Notification Diagnostic Test',
      message: 'This is a test notification verifying SMTP email delivery from Laundry Waliiii.'
    });
  } else {
    throw new AppError(`Unsupported test channel: ${channel}`, 400);
  }

  res.json({ success: true, channel, result });
});

