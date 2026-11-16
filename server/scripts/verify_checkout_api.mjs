import assert from 'node:assert/strict';

const BASE_URL = process.env.API_URL || 'http://localhost:5001/api/v1';

async function runTests() {
  console.log('--- STARTING CHECKOUT API & VALIDATION VERIFICATION ---');

  // 1. Fetch live branch
  const branchRes = await fetch(`${BASE_URL}/branches`);
  const branchData = await branchRes.json();
  assert.equal(branchRes.status, 200);
  assert.ok(branchData.branches?.length > 0, 'At least 1 branch must exist');
  const branchId = branchData.branches[0]._id;
  console.log(`✓ Active branch loaded: ${branchData.branches[0].name} (${branchId})`);

  // 2. Fetch catalogue quote
  const quoteRes = await fetch(`${BASE_URL}/orders/quote`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      items: [
        { categorySlug: 'wash-fold', quantity: 3 }, // 3 * 69 = 207
        { categorySlug: 'wash-iron', quantity: 2 }  // 2 * 99 = 198 -> subtotal 405
      ]
    })
  });
  const quoteData = await quoteRes.json();
  assert.equal(quoteRes.status, 200);
  assert.equal(quoteData.quote.subtotal, 405);
  console.log(`✓ Live quote verified: Subtotal = ₹${quoteData.quote.subtotal}, Delivery = ₹${quoteData.quote.deliveryFee}, Total = ₹${quoteData.quote.totalAmount}`);

  const validItems = [
    { categorySlug: 'wash-fold', quantity: 3 },
    { categorySlug: 'wash-iron', quantity: 2 }
  ];

  // Helper date generators
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const tomorrowIso = tomorrow.toISOString();

  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayIso = yesterday.toISOString();

  // Test 1: Empty Name rejected
  const resEmptyName = await fetch(`${BASE_URL}/orders`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      customer: { fullName: '', phone: '9876543210' },
      branchId,
      pickupAddress: { addressLine: 'Flat 101, Sun City, KD Road' },
      schedule: { pickupDate: tomorrowIso, pickupSlot: '11:00 AM – 1:00 PM' },
      items: validItems
    })
  });
  assert.equal(resEmptyName.status, 400);
  console.log('✓ Validation: Empty name rejected');

  // Test 2: Invalid Phone (9 digits) rejected
  const resShortPhone = await fetch(`${BASE_URL}/orders`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      customer: { fullName: 'Rohit Kumar', phone: '987654321' },
      branchId,
      pickupAddress: { addressLine: 'Flat 101, Sun City, KD Road' },
      schedule: { pickupDate: tomorrowIso, pickupSlot: '11:00 AM – 1:00 PM' },
      items: validItems
    })
  });
  assert.equal(resShortPhone.status, 400);
  console.log('✓ Validation: 9-digit phone rejected');

  // Test 3: Invalid Phone (11 digits) rejected
  const resLongPhone = await fetch(`${BASE_URL}/orders`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      customer: { fullName: 'Rohit Kumar', phone: '98765432101' },
      branchId,
      pickupAddress: { addressLine: 'Flat 101, Sun City, KD Road' },
      schedule: { pickupDate: tomorrowIso, pickupSlot: '11:00 AM – 1:00 PM' },
      items: validItems
    })
  });
  assert.equal(resLongPhone.status, 400);
  console.log('✓ Validation: 11-digit phone rejected');

  // Test 4: Invalid email format rejected
  const resBadEmail = await fetch(`${BASE_URL}/orders`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      customer: { fullName: 'Rohit Kumar', phone: '9876543210', email: 'not-an-email' },
      branchId,
      pickupAddress: { addressLine: 'Flat 101, Sun City, KD Road' },
      schedule: { pickupDate: tomorrowIso, pickupSlot: '11:00 AM – 1:00 PM' },
      items: validItems
    })
  });
  assert.equal(resBadEmail.status, 400);
  console.log('✓ Validation: Invalid email rejected');

  // Test 5: Empty pickupAddress rejected
  const resNoAddress = await fetch(`${BASE_URL}/orders`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      customer: { fullName: 'Rohit Kumar', phone: '9876543210' },
      branchId,
      pickupAddress: { addressLine: '   ' },
      schedule: { pickupDate: tomorrowIso, pickupSlot: '11:00 AM – 1:00 PM' },
      items: validItems
    })
  });
  assert.equal(resNoAddress.status, 400);
  console.log('✓ Validation: Empty pickup address rejected');

  // Test 6: Past Date rejected
  const resPastDate = await fetch(`${BASE_URL}/orders`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      customer: { fullName: 'Rohit Kumar', phone: '9876543210' },
      branchId,
      pickupAddress: { addressLine: 'Flat 101, Sun City, KD Road' },
      schedule: { pickupDate: yesterdayIso, pickupSlot: '11:00 AM – 1:00 PM' },
      items: validItems
    })
  });
  assert.equal(resPastDate.status, 400);
  console.log('✓ Validation: Past date (yesterday) rejected');

  // Test 7: Slot outside business hours rejected (8:00 AM)
  const resEarlySlot = await fetch(`${BASE_URL}/orders`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      customer: { fullName: 'Rohit Kumar', phone: '9876543210' },
      branchId,
      pickupAddress: { addressLine: 'Flat 101, Sun City, KD Road' },
      schedule: { pickupDate: tomorrowIso, pickupSlot: '8:00 AM – 9:00 AM' },
      items: validItems
    })
  });
  assert.equal(resEarlySlot.status, 400);
  console.log('✓ Validation: Slot before 10 AM rejected');

  // Test 8: Slot outside business hours rejected (8:30 PM)
  const resLateSlot = await fetch(`${BASE_URL}/orders`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      customer: { fullName: 'Rohit Kumar', phone: '9876543210' },
      branchId,
      pickupAddress: { addressLine: 'Flat 101, Sun City, KD Road' },
      schedule: { pickupDate: tomorrowIso, pickupSlot: '8:30 PM – 9:30 PM' },
      items: validItems
    })
  });
  assert.equal(resLateSlot.status, 400);
  console.log('✓ Validation: Slot after 8 PM rejected');

  // Test 9: Valid Order Placement (Cash on Delivery)
  const createRes = await fetch(`${BASE_URL}/orders`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      customer: {
        fullName: 'Ananya Deshmukh',
        phone: '9876501234',
        email: 'ananya.deshmukh@example.com'
      },
      branchId,
      pickupAddress: {
        addressLine: '#42 Blossom Apartments, 3rd Floor, KD Road, Mysore',
        landmark: 'Opposite Westside Store',
        pinCode: '570012'
      },
      schedule: {
        pickupDate: tomorrowIso,
        pickupSlot: '11:30 AM – 12:00 PM',
        specialInstructions: 'Ring bell twice, fabric softener preferred.'
      },
      items: validItems,
      paymentMethod: 'cod'
    })
  });

  const createData = await createRes.json();
  assert.equal(createRes.status, 201);
  assert.ok(createData.order?.bookingId?.startsWith('LW-'));
  assert.equal(createData.order.paymentMethod, 'cod');
  assert.equal(createData.order.paymentStatus, 'pending');
  assert.equal(createData.order.totalAmount, quoteData.quote.totalAmount);

  console.log('✓ Order successfully created in MongoDB!');
  console.log(`  - Booking ID: ${createData.order.bookingId}`);
  console.log(`  - Customer: ${createData.order.customerSnapshot?.fullName} (${createData.order.customerSnapshot?.phone})`);
  console.log(`  - Address: ${createData.order.pickupAddress?.addressLine}`);
  console.log(`  - Landmark: ${createData.order.pickupAddress?.landmark}`);
  console.log(`  - Schedule: ${createData.order.schedule?.pickupSlot}`);
  console.log(`  - Payment Method: ${createData.order.paymentMethod.toUpperCase()}`);
  console.log(`  - Payment Status: ${createData.order.paymentStatus}`);
  console.log(`  - Total Amount: ₹${createData.order.totalAmount}`);

  // Test 10: Fetch Order by Booking ID
  const getRes = await fetch(`${BASE_URL}/orders/booking/${createData.order.bookingId}`);
  const getData = await getRes.json();
  assert.equal(getRes.status, 200);
  assert.equal(getData.order.bookingId, createData.order.bookingId);
  console.log(`✓ Order retrieved by Booking ID: ${getData.order.bookingId} with ${getData.items?.length ?? 0} items`);

  console.log('--- ALL BACKEND CHECKOUT & VALIDATION TESTS PASSED! ---');
}

runTests().catch((err) => {
  console.error('VERIFICATION FAILED:', err);
  process.exit(1);
});

