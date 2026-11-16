import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);

let jwt;
try {
  jwt = require('jsonwebtoken');
} catch {
  jwt = require('../node_modules/jsonwebtoken');
}

const ADMIN_SECRET =
  process.env.ADMIN_JWT_SECRET ||
  'lw_super_admin_jwt_secret_mysore_2026_production_key_antigravity';

const adminToken =
  process.env.ADMIN_TOKEN ||
  jwt.sign(
    {
      sub: '6af448b11111111111111111',
      userId: '6af448b11111111111111111',
      role: 'super_admin',
      email: 'admin@laundrywaliii.com',
      fullName: 'Super Admin'
    },
    ADMIN_SECRET,
    { expiresIn: '1h' }
  );

const API_BASE = process.env.API_URL || 'http://localhost:5001/api/v1';

async function checkAdmin() {
  console.log(`Connecting to ${API_BASE}/orders/admin/list...`);
  const res = await fetch(`${API_BASE}/orders/admin/list`, {
    headers: {
      Authorization: `Bearer ${adminToken}`
    }
  });

  console.log('Admin orders response status:', res.status);
  const data = await res.json();

  if (res.status === 200) {
    console.log('✓ Total orders found:', data.orders?.length ?? 0);
    if (data.orders?.length > 0) {
      const latest = data.orders[0];
      console.log('Latest order in admin dashboard:');
      console.log('  Booking ID:', latest.bookingId);
      console.log('  Customer:', latest.customerSnapshot?.fullName, latest.customerSnapshot?.phone);
      console.log('  Address Line:', latest.pickupAddress?.addressLine);
      console.log('  Landmark:', latest.pickupAddress?.landmark);
      console.log('  Schedule:', latest.schedule?.pickupSlot);
      console.log('  Payment Method:', latest.paymentMethod);
      console.log('  Payment Status:', latest.paymentStatus);
      console.log('  Total Amount:', latest.totalAmount);
    }
  } else {
    console.log('Admin query status:', res.status, data.message || data);
  }
}

checkAdmin().catch((err) => {
  console.error('Error in checkAdmin:', err);
});

