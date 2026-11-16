import test from 'node:test';
import assert from 'node:assert/strict';
import request from 'supertest';
import { createApp } from '../src/app.js';
import { connectDatabase, disconnectDatabase } from '../src/config/database.js';
import { Branch, Order, OrderItem, OrderTracking, AdminUser } from '../src/models/index.js';
import { signAdminToken } from '../src/services/tokenService.js';

const app = createApp();

test('Complete Customer Checkout & Order Lifecycle (Validation, COD, Schedule, Admin)', async () => {
  await connectDatabase();
  let createdOrderId = null;
  let tempAdminId = null;

  try {
    let adminUser = await AdminUser.findOne({ isActive: true });
    if (!adminUser) {
      adminUser = await AdminUser.create({
        fullName: 'Super Admin',
        email: 'admin.checkout.test@laundrywaliii.com',
        passwordHash: 'fake_hash',
        role: 'super_admin',
        isActive: true
      });
      tempAdminId = adminUser._id;
    }
    const adminToken = signAdminToken({
      _id: String(adminUser._id),
      role: adminUser.role,
      email: adminUser.email,
      fullName: adminUser.fullName
    });

    const branch = await Branch.findOne({ isActive: true });
    assert.ok(branch, 'Active branch must exist in database');
    const branchId = String(branch._id);

    // 1. Verify live catalogue quote
    const quoteRes = await request(app)
      .post('/api/v1/orders/quote')
      .send({
        items: [
          { categorySlug: 'wash-fold', quantity: 3 },
          { categorySlug: 'wash-iron', quantity: 2 }
        ]
      });
    assert.equal(quoteRes.status, 200);
    assert.ok(quoteRes.body.quote.subtotal > 0);
    const expectedSubtotal = quoteRes.body.quote.subtotal;
    const expectedTotal = quoteRes.body.quote.totalAmount;

    const validItems = [
      { categorySlug: 'wash-fold', quantity: 3 },
      { categorySlug: 'wash-iron', quantity: 2 }
    ];

    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const tomorrowIso = tomorrow.toISOString();

    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayIso = yesterday.toISOString();

    // 2. Reject empty customer name
    const resEmptyName = await request(app)
      .post('/api/v1/orders')
      .send({
        customer: { fullName: '', phone: '9876543210' },
        branchId,
        pickupAddress: { addressLine: 'Flat 101, Sun City, KD Road' },
        schedule: { pickupDate: tomorrowIso, pickupSlot: '11:00 AM – 11:30 AM' },
        items: validItems
      });
    assert.equal(resEmptyName.status, 400);

    // 3. Reject 9-digit phone
    const res9Phone = await request(app)
      .post('/api/v1/orders')
      .send({
        customer: { fullName: 'Priya Sharma', phone: '987654321' },
        branchId,
        pickupAddress: { addressLine: 'Flat 101, Sun City, KD Road' },
        schedule: { pickupDate: tomorrowIso, pickupSlot: '11:00 AM – 11:30 AM' },
        items: validItems
      });
    assert.equal(res9Phone.status, 400);

    // 4. Reject 11-digit phone
    const res11Phone = await request(app)
      .post('/api/v1/orders')
      .send({
        customer: { fullName: 'Priya Sharma', phone: '98765432100' },
        branchId,
        pickupAddress: { addressLine: 'Flat 101, Sun City, KD Road' },
        schedule: { pickupDate: tomorrowIso, pickupSlot: '11:00 AM – 11:30 AM' },
        items: validItems
      });
    assert.equal(res11Phone.status, 400);

    // 5. Reject invalid email format
    const resBadEmail = await request(app)
      .post('/api/v1/orders')
      .send({
        customer: { fullName: 'Priya Sharma', phone: '9876543210', email: 'invalid-email' },
        branchId,
        pickupAddress: { addressLine: 'Flat 101, Sun City, KD Road' },
        schedule: { pickupDate: tomorrowIso, pickupSlot: '11:00 AM – 11:30 AM' },
        items: validItems
      });
    assert.equal(resBadEmail.status, 400);

    // 6. Reject empty address
    const resBadAddr = await request(app)
      .post('/api/v1/orders')
      .send({
        customer: { fullName: 'Priya Sharma', phone: '9876543210' },
        branchId,
        pickupAddress: { addressLine: '' },
        schedule: { pickupDate: tomorrowIso, pickupSlot: '11:00 AM – 11:30 AM' },
        items: validItems
      });
    assert.equal(resBadAddr.status, 400);

    // 7. Reject past pickup date (yesterday)
    const resPastDate = await request(app)
      .post('/api/v1/orders')
      .send({
        customer: { fullName: 'Priya Sharma', phone: '9876543210' },
        branchId,
        pickupAddress: { addressLine: 'Flat 101, Sun City, KD Road' },
        schedule: { pickupDate: yesterdayIso, pickupSlot: '11:00 AM – 11:30 AM' },
        items: validItems
      });
    assert.equal(resPastDate.status, 400);

    // 8. Reject slot before 10 AM
    const resEarlySlot = await request(app)
      .post('/api/v1/orders')
      .send({
        customer: { fullName: 'Priya Sharma', phone: '9876543210' },
        branchId,
        pickupAddress: { addressLine: 'Flat 101, Sun City, KD Road' },
        schedule: { pickupDate: tomorrowIso, pickupSlot: '08:30 AM – 09:00 AM' },
        items: validItems
      });
    assert.equal(resEarlySlot.status, 400);

    // 9. Reject slot after 8 PM
    const resLateSlot = await request(app)
      .post('/api/v1/orders')
      .send({
        customer: { fullName: 'Priya Sharma', phone: '9876543210' },
        branchId,
        pickupAddress: { addressLine: 'Flat 101, Sun City, KD Road' },
        schedule: { pickupDate: tomorrowIso, pickupSlot: '09:00 PM – 09:30 PM' },
        items: validItems
      });
    assert.equal(resLateSlot.status, 400);

    // 10. Successfully create order with unified address, no PIN code, optional landmark, COD
    const createRes = await request(app)
      .post('/api/v1/orders')
      .send({
        customer: {
          fullName: 'Ananya Deshmukh',
          phone: '9876501234',
          email: 'ananya@example.com'
        },
        branchId,
        pickupAddress: {
          addressLine: '#42 Blossom Apartments, 3rd Floor, KD Road, Mysore',
          landmark: 'Opposite Westside Store'
        },
        schedule: {
          pickupDate: tomorrowIso,
          pickupSlot: '11:30 AM – 12:00 PM',
          instructions: 'Call before arriving'
        },
        items: validItems,
        paymentMethod: 'cod'
      });

    assert.equal(createRes.status, 201);
    const createdOrder = createRes.body.order;
    createdOrderId = createdOrder._id;
    assert.ok(createdOrder.bookingId.startsWith('LW-'));
    assert.equal(createdOrder.paymentMethod, 'cod');
    assert.equal(createdOrder.paymentStatus, 'pending');
    assert.equal(createdOrder.totalAmount, expectedTotal);
    assert.equal(createdOrder.pickupAddress.addressLine, '#42 Blossom Apartments, 3rd Floor, KD Road, Mysore');
    assert.equal(createdOrder.pickupAddress.landmark, 'Opposite Westside Store');
    assert.equal(createdOrder.schedule.instructions, 'Call before arriving');

    // 11. Retrieve created order by Booking ID
    const fetchRes = await request(app).get(`/api/v1/orders/booking/${createdOrder.bookingId}`);
    assert.equal(fetchRes.status, 200);
    assert.equal(fetchRes.body.order.bookingId, createdOrder.bookingId);
    assert.equal(fetchRes.body.items.length, 2);

    // 12. Verify order appears in Admin orders listing
    const adminListRes = await request(app)
      .get('/api/v1/orders/admin/list')
      .set('Authorization', `Bearer ${adminToken}`);
    assert.equal(adminListRes.status, 200);
    assert.ok(Array.isArray(adminListRes.body.orders));
    const foundOrder = adminListRes.body.orders.find((o) => o.bookingId === createdOrder.bookingId);
    assert.ok(foundOrder, 'Created COD order must be listed in admin dashboard');
    assert.equal(foundOrder.paymentMethod, 'cod');
    assert.equal(foundOrder.paymentStatus, 'pending');
    assert.equal(foundOrder.customerSnapshot.fullName, 'Ananya Deshmukh');
  } finally {
    if (createdOrderId) {
      await Order.deleteOne({ _id: createdOrderId });
      await OrderItem.deleteMany({ orderId: createdOrderId });
      await OrderTracking.deleteOne({ orderId: createdOrderId });
    }
    if (tempAdminId) {
      await AdminUser.deleteOne({ _id: tempAdminId });
    }
    await disconnectDatabase();
  }
});
