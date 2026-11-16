import { getEnvConfig } from '../config/env.js';

export const isSmsConfigured = (cfg = getEnvConfig()) => {
  const sms = cfg?.sms;
  if (!sms) return false;
  return sms.provider !== 'none' && Boolean(sms.apiKey);
};

export const sendSmsNotification = async ({
  eventType = 'general',
  referenceId = 'ref',
  text,
  recipientOverride = null
}) => {
  const cfg = getEnvConfig();
  const sms = cfg.sms;
  const recipient = (recipientOverride || sms.notifyNumber || '919035999272').replace(/\D/g, '');

  if (!isSmsConfigured(cfg)) {
    const reason = 'SMS gateway credentials (SMS_PROVIDER / SMS_API_KEY) are not configured in server/.env';
    return {
      channel: 'sms',
      status: 'not_configured',
      provider: sms.provider || 'none',
      recipient,
      reason,
      errorMessage: reason
    };
  }

  try {
    if (sms.provider === 'fast2sms') {
      const url = 'https://www.fast2sms.com/dev/bulkV2';
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          authorization: sms.apiKey,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          route: 'q',
          message: text,
          flash: 0,
          numbers: recipient.slice(-10)
        })
      });
      const data = await response.json().catch(() => null);

      if (!response.ok || data?.return === false) {
        return {
          channel: 'sms',
          status: 'failed',
          provider: 'fast2sms',
          recipient,
          errorMessage: data?.message?.[0] || `Fast2SMS HTTP ${response.status}`,
          metadata: data
        };
      }

      return {
        channel: 'sms',
        status: 'sent',
        provider: 'fast2sms',
        recipient,
        providerMessageId: data?.request_id || 'fast2sms-sent',
        metadata: data
      };
    }

    return {
      channel: 'sms',
      status: 'not_configured',
      provider: sms.provider,
      recipient,
      reason: `SMS provider "${sms.provider}" integration driver not active.`
    };
  } catch (err) {
    return {
      channel: 'sms',
      status: 'failed',
      provider: sms.provider,
      recipient,
      errorMessage: err.message
    };
  }
};
