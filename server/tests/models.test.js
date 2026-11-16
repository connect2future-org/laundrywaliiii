import test from 'node:test';
import assert from 'node:assert/strict';
import mongoose from 'mongoose';
import {
  ALL_MODELS,
  Service,
  Customer,
  Address,
  Branch,
  Order,
  Review,
  InventoryItem,
  Expense
} from '../src/models/index.js';
import { CORE_SERVICE_CATEGORIES } from '../src/config/constants.js';

test('ALL_MODELS registers all 17 required domain collections', () => {
  const expectedCollections = [
    'services',
    'customers',
    'addresses',
    'branches',
    'admin_users',
    'orders',
    'order_items',
    'order_tracking',
    'walk_in_orders',
    'payments',
    'payment_attempts',
    'reviews',
    'inventory_items',
    'inventory_transactions',
    'expenses',
    'contact_enquiries',
    'franchise_leads',
    'business_settings'
  ];

  const actualCollections = ALL_MODELS.map((m) => m.collection.collectionName);
  assert.deepEqual(actualCollections, expectedCollections);
});

test('Service model supports nullable dynamic fields for the five fixed categories', () => {
  for (const cat of CORE_SERVICE_CATEGORIES) {
    const doc = new Service({
      categorySlug: cat.id,
      name: cat.name,
      selectionMode:
        cat.id === 'customized-services'
          ? 'customization'
          : cat.id === 'dry-cleaning' || cat.id === 'shoe-cleaning'
            ? 'item-selection'
            : 'direct-unit'
    });
    const err = doc.validateSync();
    assert.equal(err, undefined);
    assert.equal(doc.price, null);
    assert.equal(doc.pricingUnit, null);
    assert.equal(doc.description, null);
    assert.equal(doc.image, null);
    assert.equal(doc.items, null);
  }

  const invalidService = new Service({
    categorySlug: 'Invalid Slug With Spaces!',
    name: 'Fake Service',
    selectionMode: 'direct-unit'
  });
  const invalidErr = invalidService.validateSync();
  assert.ok(invalidErr?.errors?.categorySlug);

  const extensibleService = new Service({
    categorySlug: 'curtain-care',
    name: 'Curtain Care',
    selectionMode: 'item-selection'
  });
  assert.equal(extensibleService.validateSync(), undefined);
});

test('Customer, Address, Branch, Order, Review, Inventory, and Expense enforce schema validation', () => {
  const badCustomer = new Customer({ fullName: 'A', phone: '12345', passwordHash: 'hash' });
  const custErr = badCustomer.validateSync();
  assert.ok(custErr.errors.fullName);
  assert.ok(custErr.errors.phone);

  const badAddress = new Address({
    customerId: new mongoose.Types.ObjectId(),
    houseNo: '#5',
    street: 'KD Road',
    pincode: '5700'
  });
  assert.ok(badAddress.validateSync().errors.pincode);

  const goodBranch = new Branch({
    branchCode: 'LW-MYS-01',
    slug: 'mysore',
    name: 'Laundry Waliii – Mysore',
    area: 'KD Road',
    city: 'Mysore',
    state: 'Karnataka',
    pincode: '570012',
    address: '#5 Dr Dejagav Circle, near Westside, Kuvempu Trust Building, KD Road, Mysore – 570012',
    phone: '9035999272'
  });
  assert.equal(goodBranch.validateSync(), undefined);

  const badReview = new Review({
    branchId: new mongoose.Types.ObjectId(),
    customerDisplayName: 'Priya',
    rating: 6,
    comment: 'Too short'
  });
  assert.ok(badReview.validateSync().errors.rating);

  const badStock = new InventoryItem({
    sku: 'DET-01',
    name: 'Detergent',
    category: 'detergent',
    branchId: new mongoose.Types.ObjectId(),
    unit: 'liter',
    currentStock: -2
  });
  assert.ok(badStock.validateSync().errors.currentStock);

  const validOrder = new Order({
    bookingId: 'LW-20261111-ABCDEF',
    customerSnapshot: { fullName: 'Ananya', phone: '9876543210' },
    branchId: goodBranch._id,
    pickupAddress: { houseNo: '12', street: 'KD Road', city: 'Mysore', pincode: '570012' },
    schedule: { pickupDate: new Date(), pickupSlot: '10:00 AM - 12:00 PM' }
  });
  assert.equal(validOrder.validateSync(), undefined);

  const validExpense = new Expense({
    expenseCode: 'EXP-01',
    branchId: goodBranch._id,
    category: 'utilities',
    title: 'Electricity Bill',
    amount: 4200,
    recordedBy: new mongoose.Types.ObjectId()
  });
  assert.equal(validExpense.validateSync(), undefined);
});

