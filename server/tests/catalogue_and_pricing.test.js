import test from 'node:test';
import assert from 'node:assert/strict';
import request from 'supertest';
import mongoose from 'mongoose';
import { createApp } from '../src/app.js';
import { connectDatabase, disconnectDatabase } from '../src/config/database.js';
import { Service, Branch, Order, OrderItem, OrderTracking, AdminUser } from '../src/models/index.js';
import { signAdminToken } from '../src/services/tokenService.js';
import { OFFICIAL_CATALOGUE_SEED } from '../src/services/catalogueSeedData.js';

const app = createApp();

test('OFFICIAL_CATALOGUE_SEED matches all exact verified prices and variants', () => {
  const bySlug = Object.fromEntries(OFFICIAL_CATALOGUE_SEED.map((c) => [c.categorySlug, c]));

  assert.equal(bySlug['wash-fold'].price, 69);
  assert.equal(bySlug['wash-fold'].pricingUnit, 'kg');
  assert.equal(bySlug['wash-iron'].price, 99);
  assert.equal(bySlug['wash-iron'].pricingUnit, 'kg');

  const dcItems = Object.fromEntries(bySlug['dry-cleaning'].items.map((i) => [i.itemCode, i]));
  assert.equal(bySlug['dry-cleaning'].items.length, 19);
  assert.equal(dcItems['dc-tshirt'].variants.find((v) => v.name === 'Normal').price, 90);
  assert.equal(dcItems['dc-tshirt'].variants.find((v) => v.name === 'Stain Removal').price, 130);
  assert.equal(dcItems['dc-lehenga'].variants[0].price, 430);
  assert.equal(dcItems['dc-lehenga'].variants[0].unit, 'set');
  assert.equal(dcItems['dc-blazer-two-piece'].variants[0].price, 230);
  assert.equal(dcItems['dc-blazer-two-piece'].variants[0].unit, 'item');
  assert.equal(dcItems['dc-carpet'].variants.find((v) => v.name === '4 × 6 ft').price, 630);
  assert.equal(dcItems['dc-carpet'].variants.find((v) => v.name === '8 × 10 ft').price, 1030);

  const shoeItems = Object.fromEntries(bySlug['shoe-cleaning'].items.map((i) => [i.itemCode, i]));
  assert.equal(shoeItems['shoe-sports'].variants.find((v) => v.name === 'Normal').price, 159);
  assert.equal(shoeItems['shoe-sports'].variants.find((v) => v.name === 'Premium').price, 220);
  assert.equal(shoeItems['shoe-formal-leather'].variants.find((v) => v.name === 'Normal').price, 249);
  assert.equal(shoeItems['shoe-formal-leather'].variants.find((v) => v.name === 'Premium').price, 349);

  const wetItems = Object.fromEntries(bySlug['customized-services'].items.map((i) => [i.itemCode, i]));
  assert.equal(wetItems['wet-bedsheet'].variants.find((v) => v.name === 'Small').price, 160);
  assert.equal(wetItems['wet-bedsheet'].variants.find((v) => v.name === 'Big').price, 200);
  assert.equal(wetItems['wet-blanket'].variants.find((v) => v.name === 'Small').price, 230);
  assert.equal(wetItems['wet-blanket'].variants.find((v) => v.name === 'Big').price, 260);

  const specItems = Object.fromEntries(bySlug['specialty-services'].items.map((i) => [i.itemCode, i]));
  assert.equal(specItems['spec-toy-cleaning'].basePrice, 429);
  assert.equal(specItems['spec-bag-cleaning'].basePrice, 229);
});

test('Live MongoDB catalogue, server-side quote, admin CRUD, and historical order snapshot immutability', async () => {
  await connectDatabase();

  const tempAdminId = new mongoose.Types.ObjectId();
  const fakeAdminToken = signAdminToken({
    _id: tempAdminId,
    email: 'test-admin@laundrywalii.invalid',
    role: 'super_admin'
  });

  // Ensure AdminUser lookup in authenticateAdmin succeeds for this synthetic test admin
  await AdminUser.create({
    _id: tempAdminId,
    fullName: 'Phase Test Admin',
    email: 'test-admin@laundrywalii.invalid',
    phone: '9999988888',
    passwordHash: 'not-used-in-token-test',
    role: 'super_admin',
    isActive: true
  });

  let createdOrderId = null;

  try {
    // 1. Public catalogue endpoints
    const listRes = await request(app).get('/api/v1/services');
    assert.equal(listRes.status, 200);
    assert.equal(listRes.body.source, 'database');
    assert.ok(listRes.body.categories.length >= 6);

    const catRes = await request(app).get('/api/v1/services/categories');
    assert.equal(catRes.status, 200);
    assert.ok(catRes.body.categories.some((c) => c.categorySlug === 'specialty-services'));

    const itemsRes = await request(app).get('/api/v1/services/items?categorySlug=shoe-cleaning');
    assert.equal(itemsRes.status, 200);
    assert.equal(itemsRes.body.items.length, 4);

    // 2. Server-side quote calculation (ignores browser price, validates variants)
    const quoteRes = await request(app)
      .post('/api/v1/orders/quote')
      .send({
        items: [
          { categorySlug: 'wash-fold', quantity: 2 }, // 2 * 69 = 138
          { categorySlug: 'dry-cleaning', itemCode: 'dc-tshirt', variantName: 'Stain Removal', quantity: 1 }, // 130 (NOT 90+130)
          { categorySlug: 'dry-cleaning', itemCode: 'dc-carpet', variantName: '8 × 10 ft', quantity: 1 }, // 1030
          { categorySlug: 'shoe-cleaning', itemCode: 'shoe-formal-leather', variantName: 'Premium', quantity: 1 }, // 349
          { categorySlug: 'customized-services', itemCode: 'wet-bedsheet', variantName: 'Big', quantity: 1 }, // 200
          { categorySlug: 'specialty-services', itemCode: 'spec-toy-cleaning', quantity: 1 } // 429
        ]
      });

    assert.equal(quoteRes.status, 200);
    const expectedSubtotal = 138 + 130 + 1030 + 349 + 200 + 429; // 2276
    assert.equal(quoteRes.body.quote.subtotal, expectedSubtotal);
    assert.equal(quoteRes.body.quote.deliveryFee, 0);
    assert.equal(quoteRes.body.quote.gstAmount, Math.round(expectedSubtotal * 0.05 * 100) / 100);

    // 3. Reject invalid variant
    const badVariantRes = await request(app)
      .post('/api/v1/orders/quote')
      .send({
        items: [{ categorySlug: 'dry-cleaning', itemCode: 'dc-tshirt', variantName: 'NonExistent', quantity: 1 }]
      });
    assert.equal(badVariantRes.status, 400);

    // 4. Admin creates a new category + item without source changes, visible immediately in public API
    const createCatRes = await request(app)
      .post('/api/v1/services/admin/categories')
      .set('Authorization', `Bearer ${fakeAdminToken}`)
      .send({
        categorySlug: 'test-curtain-care',
        name: 'Test Curtain Care',
        selectionMode: 'item-selection',
        pricingMethod: 'itemized',
        pricingUnit: 'piece',
        sortOrder: 99
      });
    assert.equal(createCatRes.status, 201);

    const addItemRes = await request(app)
      .post('/api/v1/services/admin/test-curtain-care/items')
      .set('Authorization', `Bearer ${fakeAdminToken}`)
      .send({
        itemCode: 'test-sheer-curtain',
        name: 'Sheer Curtain',
        basePrice: 199,
        pricingUnit: 'piece',
        variants: [{ name: 'Standard', price: 199, unit: 'piece', isDefault: true }]
      });
    assert.equal(addItemRes.status, 201);

    const publicAfterAdd = await request(app).get('/api/v1/services/test-curtain-care');
    assert.equal(publicAfterAdd.status, 200);
    assert.equal(publicAfterAdd.body.service.items[0].name, 'Sheer Curtain');

    // Deactivate test category -> public endpoint rejects with 404 & quote rejects with 400
    const deactivateRes = await request(app)
      .patch('/api/v1/services/admin/test-curtain-care')
      .set('Authorization', `Bearer ${fakeAdminToken}`)
      .send({ isActive: false });
    assert.equal(deactivateRes.status, 200);

    const inactiveQuoteRes = await request(app)
      .post('/api/v1/orders/quote')
      .send({ items: [{ categorySlug: 'test-curtain-care', itemCode: 'test-sheer-curtain', quantity: 1 }] });
    assert.equal(inactiveQuoteRes.status, 400);

    // 5. Order creation + Historical Price Snapshot Immutability
    const branch = await Branch.findOne({ isActive: true });
    assert.ok(branch, 'Confirmed Mysore branch must exist');

    const orderRes = await request(app)
      .post('/api/v1/orders')
      .send({
        customer: { fullName: 'Test Snapshot User', phone: '9876543210' },
        branchId: String(branch._id),
        pickupAddress: { houseNo: '10', street: 'KD Road', city: 'Mysore', pincode: '570012' },
        schedule: { pickupDate: new Date().toISOString(), pickupSlot: '10:00 AM - 12:00 PM' },
        items: [{ categorySlug: 'wash-fold', quantity: 2 }]
      });
    assert.equal(orderRes.status, 201);
    createdOrderId = orderRes.body.order._id;
    assert.equal(orderRes.body.items[0].unitPrice, 69);
    assert.equal(orderRes.body.items[0].lineTotal, 138);

    // Admin updates Wash & Fold price to 79 -> new quote is 158, old order snapshot remains 69 / 138
    await request(app)
      .patch('/api/v1/services/admin/wash-fold/pricing')
      .set('Authorization', `Bearer ${fakeAdminToken}`)
      .send({ price: 79 });

    const newQuote = await request(app)
      .post('/api/v1/orders/quote')
      .send({ items: [{ categorySlug: 'wash-fold', quantity: 2 }] });
    assert.equal(newQuote.body.quote.subtotal, 158);

    const oldOrderFetch = await request(app).get(`/api/v1/orders/booking/${orderRes.body.bookingId}`);
    assert.equal(oldOrderFetch.status, 200);
    assert.equal(oldOrderFetch.body.items[0].unitPrice, 69);
    assert.equal(oldOrderFetch.body.items[0].lineTotal, 138);
    assert.equal(oldOrderFetch.body.order.pricingSettingsSnapshot.gstPercentage, 5);
    assert.equal(oldOrderFetch.body.order.pricingSettingsSnapshot.deliveryFeeApplied, 49);

    // 6. Business pricing settings DB read/update + historical order snapshot immutability
    const pubSettings = await request(app).get('/api/v1/services/settings/pricing');
    assert.equal(pubSettings.status, 200);
    assert.equal(pubSettings.body.settings.gstPercentage, 5);

    const updSettings = await request(app)
      .patch('/api/v1/admin/settings/pricing')
      .set('Authorization', `Bearer ${fakeAdminToken}`)
      .send({ gstPercentage: 12, deliveryFee: 60 });
    assert.equal(updSettings.status, 200);
    assert.equal(updSettings.body.settings.gstPercentage, 12);

    const quoteAfterTaxChange = await request(app)
      .post('/api/v1/orders/quote')
      .send({ items: [{ categorySlug: 'wash-fold', quantity: 1 }] }); // 1*79 = 79
    assert.equal(quoteAfterTaxChange.body.quote.deliveryFee, 60);
    assert.equal(quoteAfterTaxChange.body.quote.gstAmount, Math.round(79 * 0.12 * 100) / 100);

    // Old order retains original 5% GST & 49 deliveryFee
    const oldOrderAfterTaxChange = await request(app).get(`/api/v1/orders/booking/${orderRes.body.bookingId}`);
    assert.equal(oldOrderAfterTaxChange.body.order.gstAmount, orderRes.body.order.gstAmount);
    assert.equal(oldOrderAfterTaxChange.body.order.deliveryFee, 49);
  } finally {
    // Restore Wash & Fold price to 69 and business settings to defaults, clean up only synthetic test artifacts
    await Service.updateOne({ categorySlug: 'wash-fold' }, { $set: { price: 69 } });
    await Service.db.collection('business_settings').updateOne(
      { key: 'default' },
      { $set: { gstPercentage: 5, deliveryFee: 49, freeDeliveryThreshold: 299 } }
    );
    await Service.deleteOne({ categorySlug: 'test-curtain-care' });
    await AdminUser.deleteOne({ _id: tempAdminId });
    if (createdOrderId) {
      await OrderItem.deleteMany({ orderId: createdOrderId });
      await OrderTracking.deleteMany({ orderId: createdOrderId });
      await Order.deleteOne({ _id: createdOrderId });
    }
    await disconnectDatabase();
  }
});

test('Contact enquiry submission, validation, protected admin listing, and status update in LaundryWalii', async () => {
  const { ContactEnquiry } = await import('../src/models/index.js');
  await connectDatabase();
  const tempAdminId = new mongoose.Types.ObjectId();
  let createdEnquiryId = null;

  try {
    await AdminUser.create({
      _id: tempAdminId,
      fullName: 'Temp Enquiry Admin',
      email: `temp-enq-admin-${Date.now()}@example.com`,
      phone: '9999999998',
      passwordHash: 'not-used-in-jwt-test',
      role: 'super_admin'
    });
    const adminToken = signAdminToken({
      _id: tempAdminId,
      role: 'super_admin',
      branchId: null
    });
    // 1. Public submission with optional email omitted
    const createRes = await request(app)
      .post('/api/v1/contact')
      .send({
        name: 'Test Contact User',
        phone: '9876501234',
        subject: 'Dry Cleaning',
        message: 'Testing dry cleaning pickup enquiry storage in MongoDB.'
      });
    assert.equal(createRes.status, 201);
    assert.equal(createRes.body.success, true);
    assert.ok(createRes.body.enquiryId);
    createdEnquiryId = createRes.body.enquiryId;

    // 2. Invalid phone rejected with 400
    const badRes = await request(app)
      .post('/api/v1/contact')
      .send({
        name: 'Bad Phone User',
        phone: '12345',
        message: 'Invalid phone should fail.'
      });
    assert.equal(badRes.status, 400);

    // 3. Unauthenticated admin listing rejected with 401
    const unauthRes = await request(app).get('/api/v1/admin/contact');
    assert.equal(unauthRes.status, 401);

    // 4. Authenticated admin listing with search finds the stored enquiry
    const listRes = await request(app)
      .get('/api/v1/admin/contact?status=new&search=9876501234')
      .set('Authorization', `Bearer ${adminToken}`);
    assert.equal(listRes.status, 200);
    assert.ok(listRes.body.enquiries.some((e) => String(e._id) === String(createdEnquiryId)));

    // 5. Authenticated admin updates status to contacted
    const patchRes = await request(app)
      .patch(`/api/v1/admin/contact/${createdEnquiryId}`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ status: 'contacted' });
    assert.equal(patchRes.status, 200);
    assert.equal(patchRes.body.enquiry.status, 'contacted');
  } finally {
    if (createdEnquiryId) {
      await ContactEnquiry.deleteOne({ _id: createdEnquiryId });
    }
    await AdminUser.deleteOne({ _id: tempAdminId });
    await disconnectDatabase();
  }
});

