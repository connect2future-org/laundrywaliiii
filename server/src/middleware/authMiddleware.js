import { Customer, AdminUser } from '../models/index.js';
import { verifyCustomerToken, verifyAdminToken } from '../services/tokenService.js';
import { AppError, asyncHandler } from './errorMiddleware.js';

const extractBearerToken = (req) => {
  const header = req.headers.authorization;
  if (!header || !header.startsWith('Bearer ')) {
    return null;
  }
  return header.slice(7).trim();
};

export const authenticateCustomer = asyncHandler(async (req, _res, next) => {
  const token = extractBearerToken(req);
  if (!token) {
    return next(new AppError('Authentication required. Please sign in.', 401));
  }

  const decoded = verifyCustomerToken(token);
  const customer = await Customer.findById(decoded.sub);
  if (!customer || !customer.isActive) {
    return next(new AppError('Customer account is unavailable or deactivated.', 401));
  }

  req.customer = customer;
  return next();
});

export const optionalCustomerAuth = asyncHandler(async (req, _res, next) => {
  const token = extractBearerToken(req);
  if (!token) {
    req.customer = null;
    return next();
  }

  try {
    const decoded = verifyCustomerToken(token);
    const customer = await Customer.findById(decoded.sub);
    req.customer = customer && customer.isActive ? customer : null;
  } catch {
    req.customer = null;
  }
  return next();
});

export const authenticateAdmin = asyncHandler(async (req, _res, next) => {
  const token = extractBearerToken(req);
  if (!token) {
    return next(new AppError('Admin authentication required.', 401));
  }

  const decoded = verifyAdminToken(token);
  const admin = await AdminUser.findById(decoded.sub);
  if (!admin || !admin.isActive) {
    return next(new AppError('Admin account is inactive or does not exist.', 401));
  }

  req.admin = admin;
  return next();
});

export const authorizeRoles = (...allowedRoles) => (req, _res, next) => {
  if (!req.admin) {
    return next(new AppError('Admin authentication required.', 401));
  }
  if (!allowedRoles.includes(req.admin.role)) {
    return next(
      new AppError(
        `Access denied. Required role(s): ${allowedRoles.join(', ')}`,
        403
      )
    );
  }
  return next();
};

export const enforceBranchScope = (req, _res, next) => {
  if (!req.admin) {
    return next(new AppError('Admin authentication required.', 401));
  }
  if (req.admin.role === 'super_admin') {
    return next();
  }
  const targetBranchId = req.body?.branchId || req.params?.branchId || req.query?.branchId;
  if (
    targetBranchId &&
    req.admin.assignedBranchId &&
    String(targetBranchId) !== String(req.admin.assignedBranchId)
  ) {
    return next(new AppError('Access denied for resources outside your assigned branch.', 403));
  }
  return next();
};

