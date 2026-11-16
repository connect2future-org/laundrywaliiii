import { Expense, Branch } from '../models/index.js';
import { generateRefCode } from '../services/orderService.js';
import { AppError, asyncHandler } from '../middleware/errorMiddleware.js';

export const createExpense = asyncHandler(async (req, res) => {
  const branch = await Branch.findById(req.body.branchId);
  if (!branch) throw new AppError('Branch not found', 404);

  if (
    req.admin.role !== 'super_admin' &&
    req.admin.assignedBranchId &&
    String(branch._id) !== String(req.admin.assignedBranchId)
  ) {
    throw new AppError('Cannot record expense outside your assigned branch.', 403);
  }

  const expense = await Expense.create({
    ...req.body,
    expenseCode: generateRefCode('EXP'),
    recordedBy: req.admin._id
  });

  res.status(201).json({ success: true, expense });
});

export const listExpenses = asyncHandler(async (req, res) => {
  const filter = {};
  if (req.admin.role !== 'super_admin' && req.admin.assignedBranchId) {
    filter.branchId = req.admin.assignedBranchId;
  } else if (req.query.branchId) {
    filter.branchId = req.query.branchId;
  }
  if (req.query.category) filter.category = req.query.category;

  const expenses = await Expense.find(filter)
    .populate('branchId', 'name slug')
    .populate('recordedBy', 'fullName role')
    .sort({ expenseDate: -1, createdAt: -1 })
    .limit(100)
    .lean();

  res.json({ success: true, count: expenses.length, expenses });
});

