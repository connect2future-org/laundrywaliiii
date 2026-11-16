import { OrderTracking } from '../models/index.js';
import { AppError, asyncHandler } from '../middleware/errorMiddleware.js';

export const getTrackingByCode = asyncHandler(async (req, res) => {
  const trackingCode = req.params.trackingCode.toUpperCase();
  const tracking = await OrderTracking.findOne({ trackingCode })
    .populate('orderId', 'bookingId status schedule totalAmount')
    .populate('walkInOrderId', 'receiptNumber status dueDate totalAmount')
    .lean();

  if (!tracking) {
    throw new AppError(`Tracking code "${trackingCode}" not found`, 404);
  }

  res.json({ success: true, tracking });
});

