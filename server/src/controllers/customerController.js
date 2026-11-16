import { Customer, Order } from '../models/index.js';
import { AppError, asyncHandler } from '../middleware/errorMiddleware.js';

export const getMyProfile = asyncHandler(async (req, res) => {
  const customer = await Customer.findById(req.customer._id).populate('defaultBranchId', 'name slug city');
  res.json({ success: true, customer });
});

export const updateMyProfile = asyncHandler(async (req, res) => {
  const updates = {};
  if (req.body.fullName) updates.fullName = req.body.fullName;
  if (req.body.email) updates.email = req.body.email.toLowerCase();

  const customer = await Customer.findByIdAndUpdate(req.customer._id, updates, {
    new: true,
    runValidators: true
  });

  res.json({ success: true, customer });
});

export const getMyOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({ customerId: req.customer._id })
    .populate('branchId', 'name slug phone address')
    .sort({ createdAt: -1 })
    .lean();

  res.json({ success: true, count: orders.length, orders });
});

export const listCustomersAdmin = asyncHandler(async (req, res) => {
  const page = Math.max(1, Number(req.query.page) || 1);
  const limit = Math.min(100, Math.max(1, Number(req.query.limit) || 20));
  const search = (req.query.search || '').trim();

  const filter = search
    ? {
        $or: [
          { fullName: { $regex: search, $options: 'i' } },
          { phone: { $regex: search, $options: 'i' } },
          { email: { $regex: search, $options: 'i' } }
        ]
      }
    : {};

  const [customers, total] = await Promise.all([
    Customer.find(filter).sort({ createdAt: -1 }).skip((page - 1) * limit).limit(limit).lean(),
    Customer.countDocuments(filter)
  ]);

  res.json({
    success: true,
    pagination: { page, limit, total, pages: Math.ceil(total / limit) },
    customers
  });
});

export const getCustomerDetailsAdmin = asyncHandler(async (req, res) => {
  const customer = await Customer.findById(req.params.id).lean();
  if (!customer) {
    throw new AppError('Customer not found', 404);
  }
  const recentOrders = await Order.find({ customerId: customer._id }).sort({ createdAt: -1 }).limit(10).lean();
  res.json({ success: true, customer, recentOrders });
});

