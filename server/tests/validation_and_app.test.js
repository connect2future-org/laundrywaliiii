import test from 'node:test';
import assert from 'node:assert/strict';
import request from 'supertest';
import { createApp } from '../src/app.js';
import { franchiseLeadSchema, contactEnquirySchema } from '../src/validations/leadValidation.js';
import { phoneRule } from '../src/validations/commonValidation.js';

const app = createApp();

test('GET /api/health returns service metadata and LaundryWalii target DB', async () => {
  const res = await request(app).get('/api/health');
  assert.equal(res.status, 200);
  assert.equal(res.body.success, true);
  assert.equal(res.body.service, 'laundrywalii-api');
  assert.equal(res.body.databaseTarget, 'LaundryWalii');
});

test('Unknown route returns clean 404 JSON response', async () => {
  const res = await request(app).get('/api/v1/does-not-exist');
  assert.equal(res.status, 404);
  assert.equal(res.body.success, false);
  assert.match(res.body.message, /Route not found/);
});

test('Protected customer and admin endpoints reject unauthenticated requests with 401', async () => {
  const endpoints = [
    ['get', '/api/v1/customers/me'],
    ['get', '/api/v1/addresses'],
    ['get', '/api/v1/admin/dashboard'],
    ['get', '/api/v1/admin/users'],
    ['get', '/api/v1/walk-in-orders'],
    ['get', '/api/v1/inventory'],
    ['get', '/api/v1/expenses'],
    ['patch', '/api/v1/services/admin/wash-fold/pricing']
  ];

  for (const [method, url] of endpoints) {
    const res = await request(app)[method](url);
    assert.equal(res.status, 401, `Expected 401 on ${method.toUpperCase()} ${url}, got ${res.status}`);
  }
});

test('Request validation middleware rejects malformed payloads with HTTP 400', async () => {
  const badRegister = await request(app)
    .post('/api/v1/auth/customer/register')
    .send({ fullName: 'A', phone: '123', password: 'short' });
  assert.equal(badRegister.status, 400);
  assert.equal(badRegister.body.message, 'Validation failed');
  assert.ok(Array.isArray(badRegister.body.details));

  const badContact = await request(app)
    .post('/api/v1/contact')
    .send({ name: 'X', phone: '0000', email: 'not-an-email', message: 'hi' });
  assert.equal(badContact.status, 400);

  const badOrder = await request(app)
    .post('/api/v1/orders')
    .send({ items: [] });
  assert.equal(badOrder.status, 400);

  const badLead = await request(app)
    .post('/api/v1/franchise-leads')
    .send({ name: 'Ramesh', phone: '9876543210' });
  assert.equal(badLead.status, 400);
});

test('CORS middleware allows localhost:5175, handles OPTIONS preflight, and rejects untrusted origins with 403', async () => {
  const allowedRes = await request(app)
    .get('/api/health')
    .set('Origin', 'http://localhost:5175');
  assert.equal(allowedRes.status, 200);
  assert.equal(allowedRes.headers['access-control-allow-origin'], 'http://localhost:5175');
  assert.equal(allowedRes.headers['access-control-allow-credentials'], 'true');

  const preflightRes = await request(app)
    .options('/api/v1/admin/settings/pricing')
    .set('Origin', 'http://127.0.0.1:5175')
    .set('Access-Control-Request-Method', 'PATCH')
    .set('Access-Control-Request-Headers', 'Content-Type,Authorization');
  assert.equal(preflightRes.status, 204);
  assert.equal(preflightRes.headers['access-control-allow-origin'], 'http://127.0.0.1:5175');

  const blockedRes = await request(app)
    .get('/api/health')
    .set('Origin', 'https://untrusted.example.com');
  assert.equal(blockedRes.status, 403);
  assert.equal(blockedRes.body.success, false);
});

test('Backend phoneRule and lead validation schemas strictly enforce 10-digit phone and optional franchise email', () => {
  // 1. Phone number rule checks
  const validPhones = ['9876543210', '8888888888', '7000000000', '6999999999'];
  const invalidPhones = ['987654321', '98765432100', '98765abcde', '5876543210', '0876543210', '', null];

  for (const phone of validPhones) {
    const { error } = phoneRule.validate(phone);
    assert.equal(error, undefined, `Expected valid for phone ${phone}`);
  }

  for (const phone of invalidPhones) {
    const { error } = phoneRule.validate(phone);
    assert.ok(error, `Expected error for invalid phone: ${phone}`);
  }

  // 2. Franchise lead email is optional (omitted, empty string, or null)
  const baseFranchisePayload = {
    name: 'Ramesh Hegde',
    phone: '9876543210',
    city: 'Mysore',
    investmentRange: '₹14 Lakhs – Express Kiosk'
  };

  // Without email
  const resNoEmail = franchiseLeadSchema.validate(baseFranchisePayload);
  assert.equal(resNoEmail.error, undefined, 'Franchise lead without email should be valid');

  // With empty string email
  const resEmptyEmail = franchiseLeadSchema.validate({ ...baseFranchisePayload, email: '' });
  assert.equal(resEmptyEmail.error, undefined, 'Franchise lead with empty email string should be valid');

  // With null email
  const resNullEmail = franchiseLeadSchema.validate({ ...baseFranchisePayload, email: null });
  assert.equal(resNullEmail.error, undefined, 'Franchise lead with null email should be valid');

  // With valid email
  const resValidEmail = franchiseLeadSchema.validate({ ...baseFranchisePayload, email: 'ramesh@example.com' });
  assert.equal(resValidEmail.error, undefined, 'Franchise lead with valid email should be valid');

  // With invalid email
  const resInvalidEmail = franchiseLeadSchema.validate({ ...baseFranchisePayload, email: 'not-an-email' });
  assert.ok(resInvalidEmail.error, 'Franchise lead with invalid email format should fail validation');

  // 3. Contact enquiry message and email are optional
  const baseContactPayload = {
    name: 'Ananya Sharma',
    phone: '9876543210'
  };
  const resContactNoMsgNoEmail = contactEnquirySchema.validate(baseContactPayload);
  assert.equal(resContactNoMsgNoEmail.error, undefined, 'Contact enquiry without email and message should be valid');

  const resContactInvalidPhone = contactEnquirySchema.validate({ ...baseContactPayload, phone: '12345' });
  assert.ok(resContactInvalidPhone.error, 'Contact enquiry with short phone should fail validation');
});

