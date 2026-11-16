import { Customer, AdminUser } from '../models/index.js';
import { hashPassword, verifyPassword } from '../services/passwordService.js';
import { signCustomerToken, signAdminToken } from '../services/tokenService.js';
import { AppError, asyncHandler } from '../middleware/errorMiddleware.js';

export const registerCustomer = asyncHandler(async (req, res) => {
  const { fullName, phone, email, password } = req.body;

  const existingPhone = await Customer.findOne({ phone });
  if (existingPhone) {
    throw new AppError('An account with this mobile number already exists.', 409);
  }

  if (email) {
    const existingEmail = await Customer.findOne({ email: email.toLowerCase() });
    if (existingEmail) {
      throw new AppError('An account with this email already exists.', 409);
    }
  }

  const passwordHash = await hashPassword(password);
  const customer = await Customer.create({
    fullName,
    phone,
    ...(email ? { email } : {}),
    passwordHash
  });

  const token = signCustomerToken(customer);

  res.status(201).json({
    success: true,
    token,
    customer: {
      id: customer._id,
      fullName: customer.fullName,
      phone: customer.phone,
      email: customer.email || null
    }
  });
});

export const loginCustomer = asyncHandler(async (req, res) => {
  const { phoneOrEmail, password } = req.body;
  const query = phoneOrEmail.includes('@')
    ? { email: phoneOrEmail.toLowerCase() }
    : { phone: phoneOrEmail };

  const customer = await Customer.findOne(query).select('+passwordHash');
  if (!customer || !(await verifyPassword(password, customer.passwordHash))) {
    throw new AppError('Invalid credentials.', 401);
  }

  if (!customer.isActive) {
    throw new AppError('Your account has been deactivated.', 403);
  }

  customer.lastLoginAt = new Date();
  await customer.save();

  const token = signCustomerToken(customer);

  res.json({
    success: true,
    token,
    customer: {
      id: customer._id,
      fullName: customer.fullName,
      phone: customer.phone,
      email: customer.email || null
    }
  });
});

export const loginAdmin = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const admin = await AdminUser.findOne({ email: email.toLowerCase() }).select('+passwordHash');

  if (!admin || !(await verifyPassword(password, admin.passwordHash))) {
    throw new AppError('Invalid admin credentials.', 401);
  }

  if (!admin.isActive) {
    throw new AppError('Admin account is deactivated.', 403);
  }

  admin.lastLoginAt = new Date();
  await admin.save();

  const token = signAdminToken(admin);

  res.json({
    success: true,
    token,
    admin: {
      id: admin._id,
      fullName: admin.fullName,
      email: admin.email,
      role: admin.role,
      assignedBranchId: admin.assignedBranchId
    }
  });
});

