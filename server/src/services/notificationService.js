import {
  sendWhatsAppNotification,
  formatOrderWhatsAppMessage,
  formatContactEnquiryWhatsAppMessage,
  formatFranchiseLeadWhatsAppMessage
} from './whatsappService.js';
import {
  sendContactEnquiryNotification,
  sendOrderNotification,
  sendFranchiseLeadNotification
} from './mailService.js';
import { sendSmsNotification } from './smsService.js';
import { NotificationLog } from '../models/NotificationLog.js';

const safeLogNotification = async (entry) => {
  try {
    return await NotificationLog.create({
      eventType: entry.eventType,
      referenceId: String(entry.referenceId || 'N/A'),
      channel: entry.channel,
      recipient: String(entry.recipient || 'N/A'),
      payloadSummary: String(entry.payloadSummary || '').slice(0, 500),
      status: entry.status || 'not_configured',
      provider: entry.provider || 'none',
      providerMessageId: entry.providerMessageId || null,
      errorMessage: entry.errorMessage || entry.reason || null,
      metadata: entry.metadata || null
    });
  } catch (err) {
    console.warn(`[notificationService] Could not persist NotificationLog: ${err.message}`);
    return null;
  }
};

/**
 * Dispatches multi-channel business & customer notifications for newly placed orders.
 */
export const dispatchOrderNotifications = async ({ order, items = [], tracking }) => {
  const bookingId = order?.bookingId || 'UNKNOWN';

  // 1. WhatsApp Customer-to-Business Click-to-Chat Prepared
  const waResult = {
    channel: 'whatsapp',
    status: 'customer_initiated',
    recipient: '919035999272',
    method: 'free_click_to_chat'
  };
  await safeLogNotification({
    eventType: 'order',
    referenceId: bookingId,
    payloadSummary: `New order #${bookingId} total: ₹${order?.totalAmount} (Free WhatsApp click-to-chat ready)`,
    channel: 'whatsapp',
    recipient: '919035999272',
    status: 'customer_initiated',
    provider: 'wa_click_to_chat'
  });

  // 2. Email Notification
  const emailResult = await sendOrderNotification({ order, items, tracking });
  await safeLogNotification({
    eventType: 'order',
    referenceId: bookingId,
    payloadSummary: `Order confirmation email for #${bookingId}`,
    ...emailResult
  });

  // 3. SMS Notification
  const smsText = `Laundry Waliiii: New Order #${bookingId} for ₹${order?.totalAmount}. Pickup: ${order?.pickupSchedule?.pickupSlot || 'Scheduled'}.`;
  const smsResult = await sendSmsNotification({
    eventType: 'order',
    referenceId: bookingId,
    text: smsText
  });
  await safeLogNotification({
    eventType: 'order',
    referenceId: bookingId,
    payloadSummary: smsText,
    ...smsResult
  });

  return {
    whatsapp: waResult,
    email: emailResult,
    sms: smsResult
  };
};

/**
 * Dispatches multi-channel business notifications for contact form inquiries.
 */
export const dispatchContactNotifications = async (enquiry) => {
  const enquiryId = enquiry?._id?.toString() || 'ENQ-NEW';

  // 1. WhatsApp Customer-to-Business Click-to-Chat Prepared
  const waResult = {
    channel: 'whatsapp',
    status: 'customer_initiated',
    recipient: '919035999272',
    method: 'free_click_to_chat'
  };
  await safeLogNotification({
    eventType: 'contact_enquiry',
    referenceId: enquiryId,
    payloadSummary: `Contact inquiry from ${enquiry?.name} (${enquiry?.phone}) - ${enquiry?.subject} (Free WhatsApp click-to-chat ready)`,
    channel: 'whatsapp',
    recipient: '919035999272',
    status: 'customer_initiated',
    provider: 'wa_click_to_chat'
  });

  // 2. Email Alert
  const emailResult = await sendContactEnquiryNotification(enquiry);
  await safeLogNotification({
    eventType: 'contact_enquiry',
    referenceId: enquiryId,
    payloadSummary: `Enquiry email notification for ${enquiry?.name}`,
    ...emailResult
  });

  // 3. SMS Alert
  const smsText = `Laundry Waliiii: New inquiry from ${enquiry?.name} (${enquiry?.phone}). Subject: ${enquiry?.subject}.`;
  const smsResult = await sendSmsNotification({
    eventType: 'contact_enquiry',
    referenceId: enquiryId,
    text: smsText
  });
  await safeLogNotification({
    eventType: 'contact_enquiry',
    referenceId: enquiryId,
    payloadSummary: smsText,
    ...smsResult
  });

  return {
    whatsapp: waResult,
    email: emailResult,
    sms: smsResult
  };
};

/**
 * Dispatches multi-channel business notifications for franchise interest applications.
 */
export const dispatchFranchiseNotifications = async (lead) => {
  const leadId = lead?.leadRef || lead?._id?.toString() || 'FL-NEW';

  // 1. WhatsApp Customer-to-Business Click-to-Chat Prepared
  const waResult = {
    channel: 'whatsapp',
    status: 'customer_initiated',
    recipient: '919035999272',
    method: 'free_click_to_chat'
  };
  await safeLogNotification({
    eventType: 'franchise_lead',
    referenceId: leadId,
    payloadSummary: `Franchise lead ${leadId} from ${lead?.name} in ${lead?.city} (Free WhatsApp click-to-chat ready)`,
    channel: 'whatsapp',
    recipient: '919035999272',
    status: 'customer_initiated',
    provider: 'wa_click_to_chat'
  });

  // 2. Email Alert
  const emailResult = await sendFranchiseLeadNotification(lead);
  await safeLogNotification({
    eventType: 'franchise_lead',
    referenceId: leadId,
    payloadSummary: `Franchise lead email for ${lead?.name}`,
    ...emailResult
  });

  // 3. SMS Alert
  const smsText = `Laundry Waliiii: New franchise lead ${leadId} from ${lead?.name} (${lead?.phone}) for ${lead?.city}.`;
  const smsResult = await sendSmsNotification({
    eventType: 'franchise_lead',
    referenceId: leadId,
    text: smsText
  });
  await safeLogNotification({
    eventType: 'franchise_lead',
    referenceId: leadId,
    payloadSummary: smsText,
    ...smsResult
  });

  return {
    whatsapp: waResult,
    email: emailResult,
    sms: smsResult
  };
};
