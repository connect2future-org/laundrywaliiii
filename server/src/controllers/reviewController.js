import { Review, Branch, Order } from '../models/index.js';
import { AppError, asyncHandler } from '../middleware/errorMiddleware.js';

export const listApprovedReviews = asyncHandler(async (req, res) => {
  const filter = { status: 'approved' };
  if (req.query.branchId) filter.branchId = req.query.branchId;

  const reviews = await Review.find(filter)
    .select('customerDisplayName rating comment serviceCategories isVerifiedPurchase createdAt')
    .sort({ createdAt: -1 })
    .limit(30)
    .lean();

  res.json({ success: true, count: reviews.length, reviews });
});

export const createReview = asyncHandler(async (req, res) => {
  const branch = await Branch.findById(req.body.branchId);
  if (!branch) {
    throw new AppError('Branch not found', 404);
  }

  let isVerifiedPurchase = false;
  if (req.body.orderId) {
    const order = await Order.findById(req.body.orderId);
    if (!order) throw new AppError('Referenced order not found', 404);
    if (order.status === 'delivered') isVerifiedPurchase = true;
  }

  const review = await Review.create({
    ...req.body,
    customerId: req.customer?._id || null,
    isVerifiedPurchase,
    status: 'pending'
  });

  res.status(201).json({
    success: true,
    message: 'Thank you for your feedback! Your review is pending moderation.',
    review
  });
});

export const moderateReviewAdmin = asyncHandler(async (req, res) => {
  const review = await Review.findByIdAndUpdate(
    req.params.id,
    {
      status: req.body.status,
      moderatedBy: req.admin._id,
      moderatedAt: new Date()
    },
    { new: true, runValidators: true }
  );

  if (!review) {
    throw new AppError('Review not found', 404);
  }

  res.json({ success: true, review });
});

