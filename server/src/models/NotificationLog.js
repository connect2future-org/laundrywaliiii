import mongoose from 'mongoose';

const notificationLogSchema = new mongoose.Schema(
  {
    eventType: {
      type: String,
      enum: ['order', 'contact_enquiry', 'franchise_lead', 'test_diagnostic'],
      required: true,
      index: true
    },
    referenceId: {
      type: String,
      required: true,
      index: true
    },
    channel: {
      type: String,
      enum: ['whatsapp', 'email', 'sms'],
      required: true,
      index: true
    },
    recipient: {
      type: String,
      required: true
    },
    payloadSummary: {
      type: String,
      default: ''
    },
    status: {
      type: String,
      enum: ['sent', 'failed', 'not_configured', 'free_click_to_chat', 'customer_initiated'],
      required: true,
      index: true
    },
    provider: {
      type: String,
      default: 'none'
    },
    providerMessageId: {
      type: String,
      default: null
    },
    errorMessage: {
      type: String,
      default: null
    },
    metadata: {
      type: mongoose.Schema.Types.Mixed,
      default: null
    }
  },
  {
    timestamps: true,
    collection: 'notification_logs'
  }
);

export const NotificationLog = mongoose.model('NotificationLog', notificationLogSchema);
export default NotificationLog;
