import { getEnvConfig } from '../config/env.js';

/**
 * WhatsApp Notification Service - Official Free Click-to-Chat Workflow (wa.me)
 * Provides prefilled message formatting for customer-initiated WhatsApp actions
 * without requiring Meta Cloud API, Twilio, or paid messaging subscriptions.
 */

export const isWhatsAppConfigured = () => true;

export const formatOrderWhatsAppMessage = ({ order, items = [], tracking }) => {
  const bookingId = order?.bookingId || 'UNKNOWN';
  const customerName = order?.customerSnapshot?.name || order?.customerId?.name || 'Valued Customer';
  const customerPhone = order?.customerSnapshot?.phone || order?.customerId?.phone || 'Not provided';
  const address = order?.pickupAddress
    ? `${order.pickupAddress.addressLine || ''}${order.pickupAddress.landmark ? ` (Landmark: ${order.pickupAddress.landmark})` : ''} - ${order.pickupAddress.pincode || ''}`
    : 'Not provided';

  const pickupDate = order?.pickupSchedule?.pickupDate
    ? new Date(order.pickupSchedule.pickupDate).toLocaleDateString('en-IN', {
        weekday: 'short',
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      })
    : 'Not scheduled';
  const pickupSlot = order?.pickupSchedule?.pickupSlot || 'Morning Slot';
  const totalAmount = order?.totalAmount !== undefined ? `₹${Number(order.totalAmount).toLocaleString('en-IN')}` : 'Pending';
  const subtotal = order?.subtotal !== undefined ? `₹${Number(order.subtotal).toLocaleString('en-IN')}` : 'Pending';
  const deliveryFee = Number(order?.deliveryFee || 0) === 0 ? 'FREE' : `₹${Number(order.deliveryFee).toLocaleString('en-IN')}`;
  const notes = order?.pickupSchedule?.instructions ? `\n📝 *Notes:* ${order.pickupSchedule.instructions.trim()}` : '';

  const itemsList = items.length > 0
    ? items.map(it => `• ${it.itemName || it.serviceName || 'Service'}${it.variantName ? ` (${it.variantName})` : ''} × ${it.quantity} — ₹${Number(it.lineTotal || 0).toLocaleString('en-IN')}`).join('\n')
    : '• Service items captured in database';

  return `🧺 *NEW PICKUP ORDER - LAUNDRY WALIIII*
━━━━━━━━━━━━━━━━━━━━
🆔 *Order ID:* ${bookingId}
👤 *Customer:* ${customerName}
📞 *Phone:* ${customerPhone}
📍 *Address:* ${address}
📅 *Pickup Date:* ${pickupDate}
⏰ *Time Slot:* ${pickupSlot}
💵 *Payment Mode:* Cash on Delivery (COD) - Pending${notes}

🛍️ *Ordered Services:*
${itemsList}

💰 *Subtotal:* ${subtotal}
🚚 *Pickup & Delivery:* ${deliveryFee}
✨ *Total Payable:* ${totalAmount}
━━━━━━━━━━━━━━━━━━━━
*Action Required:* Please assign an executive for bag pickup.`.trim();
};

export const formatContactEnquiryWhatsAppMessage = (enquiry) => {
  const name = enquiry?.name || 'Customer';
  const phone = enquiry?.phone || 'Not provided';
  const email = enquiry?.email ? `\n📧 *Email:* ${enquiry.email}` : '';
  const subject = enquiry?.subject || 'General Service Inquiry';
  const message = enquiry?.message ? `\n💬 *Message:* "${enquiry.message}"` : '\n💬 *Message:* (None provided)';
  const submittedAt = enquiry?.createdAt
    ? new Date(enquiry.createdAt).toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })
    : new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' });

  return `📩 *NEW CONTACT ENQUIRY - LAUNDRY WALIIII*
━━━━━━━━━━━━━━━━━━━━
👤 *Customer:* ${name}
📞 *Phone:* ${phone}${email}
🏷️ *Enquiry Type:* ${subject}
⏰ *Time:* ${submittedAt}${message}
━━━━━━━━━━━━━━━━━━━━
*Action Required:* Please follow up with customer concierge support.`.trim();
};

export const formatFranchiseLeadWhatsAppMessage = (lead) => {
  const name = lead?.name || 'Applicant';
  const phone = lead?.phone || 'Not provided';
  const email = lead?.email || 'Not provided';
  const city = lead?.city || 'Not provided';
  const investment = lead?.investmentRange || 'Not provided';
  const experience = lead?.experience ? `\n💼 *Experience:* ${lead.experience}` : '';
  const message = lead?.message ? `\n💬 *Notes:* "${lead.message}"` : '';
  const leadRef = lead?.leadRef || 'FL-NEW';

  return `🏢 *NEW FRANCHISE APPLICATION - LAUNDRY WALIIII*
━━━━━━━━━━━━━━━━━━━━
🆔 *Application Ref:* ${leadRef}
👤 *Applicant:* ${name}
📞 *Phone:* ${phone}
📧 *Email:* ${email}
📍 *Proposed Territory:* ${city}
💰 *Investment Range:* ${investment}${experience}${message}
━━━━━━━━━━━━━━━━━━━━
*Action Required:* Franchise team to review territory and initiate consultation.`.trim();
};

/**
 * Free customer-initiated WhatsApp click-to-chat workflow.
 * Prepares wa.me url and avoids requiring external WhatsApp Cloud or Twilio API credentials.
 */
export const sendWhatsAppNotification = async ({
  eventType = 'general',
  referenceId = 'ref',
  text = '',
  recipientOverride = null
} = {}) => {
  const recipient = (recipientOverride || '919035999272').replace(/\D/g, '');
  return {
    channel: 'whatsapp',
    status: 'customer_initiated',
    provider: 'wa_click_to_chat',
    recipient,
    referenceId,
    eventType,
    workflow: 'free_click_to_chat',
    message: 'Official free WhatsApp Click-to-Chat workflow active. Customer initiates conversation via wa.me link.',
    waUrl: `https://wa.me/${recipient}?text=${encodeURIComponent(text)}`
  };
};

export default {
  isWhatsAppConfigured,
  formatOrderWhatsAppMessage,
  formatContactEnquiryWhatsAppMessage,
  formatFranchiseLeadWhatsAppMessage,
  sendWhatsAppNotification
};
