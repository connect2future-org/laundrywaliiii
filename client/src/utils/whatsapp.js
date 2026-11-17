import { BRAND_CONFIG } from '../config/brand.js';

/**
 * Exact pre-filled message required for customer Book Pickup WhatsApp requests.
 */
export const BOOK_PICKUP_WHATSAPP_MESSAGE = `Hello Laundry Waliiii Team! 👋

I would like to book a laundry pickup. Could you please contact me and share the details about the pickup process, available time slots, and services?

Please let me know how to proceed.

Thank you!`.trim();

/**
 * Returns the official WhatsApp Click-to-Chat URL with the pre-filled Book Pickup message.
 * Targets the verified business number: +91 9035999272
 */
export const getBookPickupWhatsAppUrl = () => {
  const phone = BRAND_CONFIG?.contact?.phone || '9035999272';
  return `https://wa.me/91${phone}?text=${encodeURIComponent(BOOK_PICKUP_WHATSAPP_MESSAGE)}`;
};

/**
 * Helper to safely open the WhatsApp chat in a new tab/app.
 */
export const openBookPickupWhatsApp = (e) => {
  if (e && typeof e.preventDefault === 'function') {
    e.preventDefault();
  }
  const url = getBookPickupWhatsAppUrl();
  window.open(url, '_blank', 'noopener,noreferrer');
};
