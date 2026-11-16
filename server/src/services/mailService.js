import nodemailer from 'nodemailer';
import { getEnvConfig } from '../config/env.js';

const escapeHtml = (value = '') =>
  String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');

export const isSmtpConfigured = (cfg = getEnvConfig()) =>
  Boolean(cfg?.smtp?.host && cfg?.smtp?.user && cfg?.smtp?.pass);

const createDefaultTransporter = (smtp) =>
  nodemailer.createTransport({
    host: smtp.host,
    port: smtp.port,
    secure: smtp.secure,
    auth: {
      user: smtp.user,
      pass: smtp.pass
    }
  });

/**
 * Sends a contact enquiry notification email to the configured business recipient.
 * Never throws or exposes credentials; MongoDB enquiry persistence remains primary.
 */
export const sendContactEnquiryNotification = async (enquiry, options = {}) => {
  const cfg = getEnvConfig();
  const recipient = cfg.smtp.contactNotificationEmail || 'hr@connect2future.com';

  if (!isSmtpConfigured(cfg)) {
    console.warn(
      '[mailService] SMTP credentials are not configured in server/.env; skipping enquiry email notification.'
    );
    return {
      sent: false,
      channel: 'email',
      status: 'not_configured',
      reason: 'smtp_not_configured',
      recipient
    };
  }

  const submittedAt = enquiry?.createdAt
    ? new Date(enquiry.createdAt).toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })
    : new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' });

  const customerName = enquiry?.name || 'Customer';
  const customerPhone = enquiry?.phone || 'Not provided';
  const customerEmail = enquiry?.email || 'Not provided';
  const enquiryType = enquiry?.subject || 'General Service Inquiry';
  const messageBody = enquiry?.message || '';

  const text = [
    'New Customer Enquiry — Laundry Walii',
    '',
    `Name: ${customerName}`,
    `Phone: ${customerPhone}`,
    `Email: ${customerEmail}`,
    `Enquiry Type: ${enquiryType}`,
    `Submitted At: ${submittedAt}`,
    '',
    'Message:',
    messageBody
  ].join('\n');

  const html = `
    <div style="font-family: Arial, sans-serif; color: #1F1B24; max-width: 600px;">
      <h2 style="color: #850078; margin-bottom: 12px;">New Customer Enquiry — Laundry Walii</h2>
      <table style="border-collapse: collapse; width: 100%; margin-bottom: 16px;">
        <tr><td style="padding: 6px 0; font-weight: bold;">Name:</td><td>${escapeHtml(customerName)}</td></tr>
        <tr><td style="padding: 6px 0; font-weight: bold;">Phone:</td><td>${escapeHtml(customerPhone)}</td></tr>
        <tr><td style="padding: 6px 0; font-weight: bold;">Email:</td><td>${escapeHtml(customerEmail)}</td></tr>
        <tr><td style="padding: 6px 0; font-weight: bold;">Enquiry Type:</td><td>${escapeHtml(enquiryType)}</td></tr>
        <tr><td style="padding: 6px 0; font-weight: bold;">Submitted At:</td><td>${escapeHtml(submittedAt)}</td></tr>
      </table>
      <div style="background: #FAF9FC; border: 1px solid #EEE9EF; border-radius: 8px; padding: 12px;">
        <strong>Message:</strong>
        <p style="white-space: pre-wrap; margin: 8px 0 0;">${escapeHtml(messageBody || 'None provided')}</p>
      </div>
    </div>
  `;

  try {
    const transporter = options.transporterFactory
      ? options.transporterFactory(cfg.smtp)
      : createDefaultTransporter(cfg.smtp);

    const info = await transporter.sendMail({
      from: cfg.smtp.from || cfg.smtp.user,
      to: recipient,
      replyTo: enquiry?.email || undefined,
      subject: `[Laundry Walii Enquiry] ${enquiryType} — ${customerName}`,
      text,
      html
    });

    return {
      sent: true,
      channel: 'email',
      status: 'sent',
      messageId: info?.messageId || null,
      providerMessageId: info?.messageId || null,
      recipient
    };
  } catch (err) {
    console.warn(
      `[mailService] Failed to send enquiry notification email: ${err?.message || 'Unknown mail error'}`
    );
    return {
      sent: false,
      channel: 'email',
      status: 'failed',
      reason: 'send_failed',
      errorMessage: err?.message || 'Unknown mail error',
      recipient
    };
  }
};

/**
 * Sends order confirmation email notifications to the business desk and customer (if email provided).
 */
export const sendOrderNotification = async ({ order, items = [], tracking }, options = {}) => {
  const cfg = getEnvConfig();
  const businessRecipient = cfg.smtp.contactNotificationEmail || 'hr@connect2future.com';

  if (!isSmtpConfigured(cfg)) {
    console.warn(
      '[mailService] SMTP credentials are not configured in server/.env; skipping order email notification.'
    );
    return {
      sent: false,
      channel: 'email',
      status: 'not_configured',
      reason: 'smtp_not_configured',
      recipient: businessRecipient
    };
  }

  const bookingId = order?.bookingId || 'UNKNOWN';
  const customerName = order?.customerSnapshot?.name || order?.customerId?.name || 'Customer';
  const customerPhone = order?.customerSnapshot?.phone || order?.customerId?.phone || 'Not provided';
  const customerEmail = order?.customerSnapshot?.email || order?.customerId?.email || '';
  const totalAmount = order?.totalAmount !== undefined ? `₹${Number(order.totalAmount).toLocaleString('en-IN')}` : 'Pending';

  const itemsList = items.length > 0
    ? items.map(it => `• ${it.itemName || it.serviceName} (${it.quantity}) — ₹${Number(it.lineTotal || 0).toLocaleString('en-IN')}`).join('\n')
    : '• Service items captured in database';

  const text = [
    `New Order Placed — Booking ID: ${bookingId}`,
    '',
    `Customer: ${customerName}`,
    `Phone: ${customerPhone}`,
    `Email: ${customerEmail || 'Not provided'}`,
    `Total Amount: ${totalAmount}`,
    '',
    'Items:',
    itemsList
  ].join('\n');

  try {
    const transporter = options.transporterFactory
      ? options.transporterFactory(cfg.smtp)
      : createDefaultTransporter(cfg.smtp);

    const info = await transporter.sendMail({
      from: cfg.smtp.from || cfg.smtp.user,
      to: businessRecipient,
      subject: `[Laundry Walii Order] New Order #${bookingId} — ${customerName}`,
      text
    });

    return {
      sent: true,
      channel: 'email',
      status: 'sent',
      messageId: info?.messageId || null,
      providerMessageId: info?.messageId || null,
      recipient: businessRecipient
    };
  } catch (err) {
    console.warn(`[mailService] Failed to send order notification email: ${err?.message}`);
    return {
      sent: false,
      channel: 'email',
      status: 'failed',
      reason: 'send_failed',
      errorMessage: err?.message,
      recipient: businessRecipient
    };
  }
};

/**
 * Sends franchise application notification email to the business desk.
 */
export const sendFranchiseLeadNotification = async (lead, options = {}) => {
  const cfg = getEnvConfig();
  const businessRecipient = cfg.smtp.contactNotificationEmail || 'hr@connect2future.com';

  if (!isSmtpConfigured(cfg)) {
    return {
      sent: false,
      channel: 'email',
      status: 'not_configured',
      reason: 'smtp_not_configured',
      recipient: businessRecipient
    };
  }

  try {
    const transporter = options.transporterFactory
      ? options.transporterFactory(cfg.smtp)
      : createDefaultTransporter(cfg.smtp);

    const info = await transporter.sendMail({
      from: cfg.smtp.from || cfg.smtp.user,
      to: businessRecipient,
      subject: `[Franchise Application] ${lead.name} — ${lead.city}`,
      text: `New Franchise Lead\n\nName: ${lead.name}\nPhone: ${lead.phone}\nEmail: ${lead.email || 'Not provided'}\nCity: ${lead.city}\nInvestment: ${lead.investmentRange}\nMessage: ${lead.message || 'None'}`
    });

    return {
      sent: true,
      channel: 'email',
      status: 'sent',
      messageId: info?.messageId,
      providerMessageId: info?.messageId,
      recipient: businessRecipient
    };
  } catch (err) {
    return {
      sent: false,
      channel: 'email',
      status: 'failed',
      reason: 'send_failed',
      errorMessage: err?.message,
      recipient: businessRecipient
    };
  }
};
