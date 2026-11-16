import test from 'node:test';
import assert from 'node:assert/strict';
import request from 'supertest';
import { createApp } from '../src/app.js';
import { connectDatabase, disconnectDatabase } from '../src/config/database.js';
import { ContactEnquiry } from '../src/models/index.js';
import { sendContactEnquiryNotification } from '../src/services/mailService.js';

const app = createApp();

const withTempSmtpEnv = async (overrides, fn) => {
  const keys = [
    'SMTP_HOST',
    'SMTP_PORT',
    'SMTP_SECURE',
    'SMTP_USER',
    'SMTP_PASS',
    'SMTP_FROM',
    'CONTACT_NOTIFICATION_EMAIL'
  ];
  const prev = {};
  for (const k of keys) {
    prev[k] = process.env[k];
    if (overrides[k] === undefined) {
      delete process.env[k];
    } else {
      process.env[k] = overrides[k];
    }
  }
  try {
    return await fn();
  } finally {
    for (const k of keys) {
      if (prev[k] === undefined) {
        delete process.env[k];
      } else {
        process.env[k] = prev[k];
      }
    }
  }
};

test('mailService sends enquiry notification to hr@connect2future.com with all customer details', async () => {
  let capturedMail = null;
  const mockTransporterFactory = () => ({
    sendMail: async (mailOptions) => {
      capturedMail = mailOptions;
      return { messageId: 'mock-msg-id-001' };
    }
  });

  const result = await withTempSmtpEnv(
    {
      SMTP_HOST: 'smtp.example.com',
      SMTP_PORT: '587',
      SMTP_USER: 'mailer@example.com',
      SMTP_PASS: 'super-secret-smtp-pass-value',
      CONTACT_NOTIFICATION_EMAIL: 'hr@connect2future.com'
    },
    () =>
      sendContactEnquiryNotification(
        {
          name: 'Ananya Sharma',
          phone: '9876543210',
          email: 'ananya@example.com',
          subject: 'Dry Cleaning',
          message: 'Need silk saree dry cleaning pickup tomorrow.',
          createdAt: new Date('2026-11-12T09:00:00.000Z')
        },
        { transporterFactory: mockTransporterFactory }
      )
  );

  assert.equal(result.sent, true);
  assert.equal(result.recipient, 'hr@connect2future.com');
  assert.equal(capturedMail.to, 'hr@connect2future.com');
  assert.ok(capturedMail.text.includes('Ananya Sharma'));
  assert.ok(capturedMail.text.includes('9876543210'));
  assert.ok(capturedMail.text.includes('ananya@example.com'));
  assert.ok(capturedMail.text.includes('Dry Cleaning'));
  assert.ok(capturedMail.text.includes('Need silk saree dry cleaning pickup tomorrow.'));
  assert.ok(capturedMail.text.includes('Submitted At:'));
  assert.ok(!capturedMail.text.includes('super-secret-smtp-pass-value'));
});

test('mailService warns clearly when SMTP is not configured and enquiry still saves in MongoDB', async () => {
  await connectDatabase();
  const warnings = [];
  const origWarn = console.warn;
  console.warn = (msg) => warnings.push(String(msg));
  let createdEnquiryId = null;

  try {
    await withTempSmtpEnv(
      {
        SMTP_HOST: undefined,
        SMTP_USER: undefined,
        SMTP_PASS: undefined,
        CONTACT_NOTIFICATION_EMAIL: 'hr@connect2future.com'
      },
      async () => {
        const res = await request(app)
          .post('/api/v1/contact')
          .send({
            name: 'Missing Smtp User',
            phone: '9876501111',
            email: 'missing-smtp@example.com',
            subject: 'Laundry Service',
            message: 'Testing enquiry save when SMTP is not configured.'
          });

        assert.equal(res.status, 201);
        assert.equal(res.body.success, true);
        assert.ok(res.body.enquiryId);
        createdEnquiryId = res.body.enquiryId;

        const saved = await ContactEnquiry.findById(createdEnquiryId).lean();
        assert.equal(saved.name, 'Missing Smtp User');
        assert.ok(
          warnings.some((w) => w.includes('SMTP credentials are not configured')),
          `Expected SMTP warning, got: ${JSON.stringify(warnings)}`
        );
      }
    );
  } finally {
    console.warn = origWarn;
    if (createdEnquiryId) {
      await ContactEnquiry.deleteOne({ _id: createdEnquiryId });
    }
    await disconnectDatabase();
  }
});

test('mailService handles email delivery failure gracefully without failing enquiry save', async () => {
  await connectDatabase();
  const warnings = [];
  const origWarn = console.warn;
  console.warn = (msg) => warnings.push(String(msg));
  let createdEnquiryId = null;

  try {
    await withTempSmtpEnv(
      {
        SMTP_HOST: '127.0.0.1',
        SMTP_PORT: '59999', // closed local port -> guaranteed fast ECONNREFUSED failure
        SMTP_SECURE: 'false',
        SMTP_USER: 'mailer@example.com',
        SMTP_PASS: 'do-not-leak-this-secret',
        CONTACT_NOTIFICATION_EMAIL: 'hr@connect2future.com'
      },
      async () => {
        // 1. Direct mailService failure check
        const failRes = await sendContactEnquiryNotification(
          {
            name: 'Fail Mail User',
            phone: '9876502222',
            subject: 'Other',
            message: 'Simulated failure test',
            createdAt: new Date()
          },
          {
            transporterFactory: () => ({
              sendMail: async () => {
                throw new Error('SMTP connection refused');
              }
            })
          }
        );
        assert.equal(failRes.sent, false);
        assert.equal(failRes.reason, 'send_failed');
        assert.ok(warnings.some((w) => w.includes('SMTP connection refused')));
        assert.ok(!warnings.some((w) => w.includes('do-not-leak-this-secret')));

        // 2. End-to-end API submission still saves to MongoDB and returns 201 even when SMTP fails
        const apiRes = await request(app)
          .post('/api/v1/contact')
          .send({
            name: 'Fail Smtp User',
            phone: '9876503333',
            subject: 'Pickup and Delivery',
            message: 'Testing enquiry persistence when SMTP delivery fails.'
          });
        assert.equal(apiRes.status, 201);
        assert.equal(apiRes.body.success, true);
        createdEnquiryId = apiRes.body.enquiryId;

        const saved = await ContactEnquiry.findById(createdEnquiryId).lean();
        assert.equal(saved.name, 'Fail Smtp User');
      }
    );
  } finally {
    console.warn = origWarn;
    if (createdEnquiryId) {
      await ContactEnquiry.deleteOne({ _id: createdEnquiryId });
    }
    await disconnectDatabase();
  }
});

