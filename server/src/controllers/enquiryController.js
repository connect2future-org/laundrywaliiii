import { ContactEnquiry, FranchiseLead } from '../models/index.js';
import { generateRefCode } from '../services/orderService.js';
import {
  dispatchContactNotifications,
  dispatchFranchiseNotifications
} from '../services/notificationService.js';
import { AppError, asyncHandler } from '../middleware/errorMiddleware.js';

export const submitContactEnquiry = asyncHandler(async (req, res) => {
  const { name, phone, email, subject, message, source } = req.body;
  const enquiry = await ContactEnquiry.create({
    name,
    phone,
    email: email || '',
    subject: subject || 'General Service Inquiry',
    message,
    source: source || 'website_contact_page'
  });

  // Multi-channel notification dispatch (never fails enquiry persistence)
  let notifications = null;
  try {
    notifications = await dispatchContactNotifications(enquiry);
  } catch (mailErr) {
    console.warn(`[enquiryController] Non-fatal notification error: ${mailErr?.message || 'unknown'}`);
  }

  res.status(201).json({
    success: true,
    message: `Thank you, ${enquiry.name}! Your inquiry has been submitted successfully. Our Laundry Walii team will review it and get in touch with you.`,
    enquiryId: enquiry._id,
    notifications,
    enquiry: {
      _id: enquiry._id,
      name: enquiry.name,
      subject: enquiry.subject,
      status: enquiry.status,
      createdAt: enquiry.createdAt
    }
  });
});

export const listContactEnquiriesAdmin = asyncHandler(async (req, res) => {
  const filter = {};
  if (req.query.status && req.query.status !== 'all') {
    filter.status = req.query.status;
  }
  if (req.query.search && String(req.query.search).trim()) {
    const escaped = String(req.query.search)
      .trim()
      .replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const regex = new RegExp(escaped, 'i');
    filter.$or = [{ name: regex }, { phone: regex }, { email: regex }];
  }

  const enquiries = await ContactEnquiry.find(filter).sort({ createdAt: -1 }).limit(100).lean();
  res.json({ success: true, count: enquiries.length, enquiries });
});

export const updateContactEnquiryAdmin = asyncHandler(async (req, res) => {
  const enquiry = await ContactEnquiry.findByIdAndUpdate(
    req.params.id,
    {
      ...req.body,
      assignedTo: req.admin._id
    },
    { new: true, runValidators: true }
  );

  if (!enquiry) throw new AppError('Contact enquiry not found', 404);
  res.json({ success: true, enquiry });
});

export const submitFranchiseLead = asyncHandler(async (req, res) => {
  const leadRef = generateRefCode('FL');
  const lead = await FranchiseLead.create({
    ...req.body,
    leadRef
  });

  // Multi-channel notification dispatch (never fails lead persistence)
  let notifications = null;
  try {
    notifications = await dispatchFranchiseNotifications(lead);
  } catch (notifErr) {
    console.warn(`[enquiryController] Non-fatal franchise notification error: ${notifErr?.message || 'unknown'}`);
  }

  res.status(201).json({
    success: true,
    leadId: lead.leadRef,
    notifications,
    message: 'Your franchise interest application has been received. Our expansion lead will contact you within 24–48 hours.'
  });
});

export const listFranchiseLeadsAdmin = asyncHandler(async (req, res) => {
  const filter = {};
  if (req.query.status) filter.status = req.query.status;

  const leads = await FranchiseLead.find(filter).sort({ createdAt: -1 }).limit(100).lean();
  res.json({ success: true, count: leads.length, leads });
});

export const updateFranchiseLeadAdmin = asyncHandler(async (req, res) => {
  const lead = await FranchiseLead.findByIdAndUpdate(
    req.params.id,
    {
      ...req.body,
      assignedTo: req.admin._id
    },
    { new: true, runValidators: true }
  );

  if (!lead) throw new AppError('Franchise lead not found', 404);
  res.json({ success: true, lead });
});

