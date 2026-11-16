import { Address } from '../models/index.js';
import { AppError, asyncHandler } from '../middleware/errorMiddleware.js';

export const listMyAddresses = asyncHandler(async (req, res) => {
  const addresses = await Address.find({ customerId: req.customer._id })
    .sort({ isDefault: -1, createdAt: -1 })
    .lean();
  res.json({ success: true, addresses });
});

export const createAddress = asyncHandler(async (req, res) => {
  if (req.body.isDefault) {
    await Address.updateMany({ customerId: req.customer._id }, { isDefault: false });
  }

  const address = await Address.create({
    ...req.body,
    customerId: req.customer._id
  });

  res.status(201).json({ success: true, address });
});

export const updateAddress = asyncHandler(async (req, res) => {
  const existing = await Address.findOne({ _id: req.params.id, customerId: req.customer._id });
  if (!existing) {
    throw new AppError('Address not found', 404);
  }

  if (req.body.isDefault) {
    await Address.updateMany(
      { customerId: req.customer._id, _id: { $ne: existing._id } },
      { isDefault: false }
    );
  }

  Object.assign(existing, req.body);
  await existing.save();

  res.json({ success: true, address: existing });
});

export const deleteAddress = asyncHandler(async (req, res) => {
  const deleted = await Address.findOneAndDelete({
    _id: req.params.id,
    customerId: req.customer._id
  });

  if (!deleted) {
    throw new AppError('Address not found', 404);
  }

  res.json({ success: true, message: 'Address removed cleanly' });
});

