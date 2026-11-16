import { Branch } from '../models/index.js';
import { AppError, asyncHandler } from '../middleware/errorMiddleware.js';

export const listActiveBranches = asyncHandler(async (_req, res) => {
  const branches = await Branch.find({ isActive: true }).sort({ isFlagship: -1, createdAt: 1 }).lean();
  res.json({ success: true, count: branches.length, branches });
});

export const getBranchBySlug = asyncHandler(async (req, res) => {
  const branch = await Branch.findOne({ slug: req.params.slug.toLowerCase(), isActive: true }).lean();
  if (!branch) {
    throw new AppError(`Branch "${req.params.slug}" not found`, 404);
  }
  res.json({ success: true, branch });
});

export const checkPincodeCoverage = asyncHandler(async (req, res) => {
  const { pincode } = req.params;
  if (!/^\d{6}$/.test(pincode)) {
    throw new AppError('PIN code must be 6 digits', 400);
  }

  const branch = await Branch.findOne({
    isActive: true,
    $or: [{ pincode }, { serviceablePincodes: pincode }]
  }).lean();

  res.json({
    success: true,
    serviceable: Boolean(branch),
    pincode,
    branch: branch || null
  });
});

export const createBranch = asyncHandler(async (req, res) => {
  const branch = await Branch.create(req.body);
  res.status(201).json({ success: true, branch });
});

export const updateBranch = asyncHandler(async (req, res) => {
  const branch = await Branch.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });
  if (!branch) {
    throw new AppError('Branch not found', 404);
  }
  res.json({ success: true, branch });
});

