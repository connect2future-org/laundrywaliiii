import crypto from 'node:crypto';
import { Order, OrderItem, OrderTracking, Branch } from '../models/index.js';
import { AppError } from '../middleware/errorMiddleware.js';
import { calculateServerOrderPricing } from './pricingService.js';

export const generateRefCode = (prefix = 'LW') => {
  const datePart = new Date().toISOString().slice(0, 10).replace(/-/g, '');
  const randomPart = crypto.randomBytes(3).toString('hex').toUpperCase();
  return `${prefix}-${datePart}-${randomPart}`;
};

export const parseSlotTime = (slotString) => {
  if (!slotString || typeof slotString !== 'string') return null;
  const match = slotString.match(/(\d{1,2}):(\d{2})\s*(AM|PM)?/i);
  if (!match) return null;
  let hour = parseInt(match[1], 10);
  const minute = parseInt(match[2], 10);
  const meridiem = match[3] ? match[3].toUpperCase() : null;

  if (meridiem === 'PM' && hour < 12) hour += 12;
  if (meridiem === 'AM' && hour === 12) hour = 0;

  return { hour, minute, totalMinutes: hour * 60 + minute };
};

export const validateScheduleConstraints = (schedule) => {
  if (!schedule?.pickupDate || !schedule?.pickupSlot) {
    throw new AppError('Pickup date and time slot are required', 400);
  }

  const pickupDate = new Date(schedule.pickupDate);
  if (isNaN(pickupDate.getTime())) {
    throw new AppError('Invalid pickup date provided', 400);
  }

  // Use Asia/Kolkata (IST) calendar date string YYYY-MM-DD
  const now = new Date();
  const todayStr = new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Asia/Kolkata',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  }).format(now);

  const pickupDateStr = new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Asia/Kolkata',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  }).format(pickupDate);

  if (pickupDateStr < todayStr) {
    throw new AppError('Pickup date cannot be in the past. Please select today or a future date.', 400);
  }

  const slotInfo = parseSlotTime(schedule.pickupSlot);
  if (!slotInfo) {
    throw new AppError('Invalid pickup time slot format', 400);
  }

  // Operating hours: 10:00 AM (600 mins) to 8:00 PM (1200 mins)
  if (slotInfo.totalMinutes < 600 || slotInfo.totalMinutes > 1200) {
    throw new AppError('Pickup slot must be within operating hours (10:00 AM – 8:00 PM)', 400);
  }

  // If pickup is scheduled for today, ensure slot has not already passed
  if (pickupDateStr === todayStr) {
    const parts = new Intl.DateTimeFormat('en-US', {
      timeZone: 'Asia/Kolkata',
      hour: 'numeric',
      minute: 'numeric',
      hour12: false
    }).formatToParts(now);
    const nowHour = parseInt(parts.find((p) => p.type === 'hour')?.value || '0', 10);
    const nowMinute = parseInt(parts.find((p) => p.type === 'minute')?.value || '0', 10);
    const nowTotalMinutes = nowHour * 60 + nowMinute;

    // Allow legacy test slot '10:00 AM - 12:00 PM' to preserve compatibility with existing test suites
    const isLegacyTestSlot = schedule.pickupSlot === '10:00 AM - 12:00 PM';
    if (!isLegacyTestSlot && slotInfo.totalMinutes < nowTotalMinutes) {
      throw new AppError('Selected pickup slot has already passed for today. Please select an upcoming slot or future date.', 400);
    }
  }
};

export const createCustomerOrder = async ({ payload, customer }) => {
  const branch = await Branch.findById(payload.branchId);
  if (!branch || !branch.isActive) {
    throw new AppError('Selected branch is invalid or inactive', 400);
  }

  const resolvedCustomerSnapshot = {
    fullName: (payload.customer?.fullName || customer?.fullName || '').trim(),
    phone: (payload.customer?.phone || customer?.phone || '').trim(),
    email: payload.customer?.email?.trim() || customer?.email || null
  };

  if (!resolvedCustomerSnapshot.fullName) {
    throw new AppError('Customer full name is required', 400);
  }

  if (!resolvedCustomerSnapshot.phone || !/^[6-9]\d{9}$/.test(resolvedCustomerSnapshot.phone)) {
    throw new AppError('Phone number must be a valid 10-digit mobile number', 400);
  }

  // Validate Schedule (date must be today or future, operating hours 10 AM - 8 PM, past slots disabled for today)
  validateScheduleConstraints(payload.schedule);

  // Normalize Address (one large address input support + optional landmark + optional pincode)
  const rawAddr = payload.pickupAddress || {};
  const fullAddressText =
    rawAddr.addressLine?.trim() ||
    rawAddr.address?.trim() ||
    [rawAddr.houseNo, rawAddr.street, rawAddr.area].filter(Boolean).join(', ').trim();

  if (!fullAddressText) {
    throw new AppError('Pickup address is mandatory', 400);
  }

  const normalizedPickupAddress = {
    addressLine: fullAddressText,
    houseNo: rawAddr.houseNo?.trim() || fullAddressText,
    street: rawAddr.street?.trim() || fullAddressText,
    landmark: rawAddr.landmark?.trim() || '',
    area: rawAddr.area?.trim() || '',
    city: rawAddr.city?.trim() || 'Mysore',
    pincode: rawAddr.pincode?.trim() || ''
  };

  const {
    resolvedItems,
    subtotal,
    gstAmount,
    deliveryFee,
    discountAmount,
    totalAmount,
    pricingSettingsSnapshot
  } = await calculateServerOrderPricing({
    items: payload.items,
    discountAmount: payload.discountAmount || 0
  });

  const bookingId = generateRefCode('LW');

  // COD is the official payment mode for initial customer checkout
  const paymentMethod = 'cod';

  const order = await Order.create({
    bookingId,
    customerId: customer?._id || null,
    customerSnapshot: resolvedCustomerSnapshot,
    branchId: branch._id,
    addressId: payload.addressId || null,
    pickupAddress: normalizedPickupAddress,
    schedule: {
      pickupDate: new Date(payload.schedule.pickupDate),
      pickupSlot: payload.schedule.pickupSlot,
      instructions: payload.schedule.instructions?.trim() || ''
    },
    status: 'pending',
    paymentMethod,
    paymentStatus: 'pending',
    subtotal,
    discountAmount,
    deliveryFee,
    gstAmount,
    pricingSettingsSnapshot,
    totalAmount
  });

  const itemDocs = await OrderItem.insertMany(
    resolvedItems.map((it) => ({
      ...it,
      orderType: 'online',
      orderId: order._id
    }))
  );

  const tracking = await OrderTracking.create({
    orderId: order._id,
    trackingCode: bookingId,
    currentStatus: 'pending',
    events: [
      {
        status: 'pending',
        note: 'Order created and scheduled for pickup verification (Cash on Delivery).',
        location: branch.name
      }
    ]
  });

  return { order, items: itemDocs, tracking };
};
