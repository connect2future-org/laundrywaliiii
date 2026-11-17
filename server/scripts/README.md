# Laundry Waliiii — Backend Development & Diagnostic Scripts

This directory (`server/scripts/`) contains standalone executable utilities for database and API testing against the Express API and MongoDB.

### Available Scripts

1. **`verify_checkout_api.mjs`**
   - **Purpose**: Verifies live order placement, customer field validation, operating schedule hours (10:00 AM – 8:00 PM), live price calculations, and Cash on Delivery persistence in MongoDB.
   - **Usage**: `node server/scripts/verify_checkout_api.mjs`

2. **`test_admin_orders.mjs`**
   - **Purpose**: Administrative diagnostic script that generates a signed admin JWT and verifies the protected admin order listing endpoint (`/api/v1/orders/admin/list`).
   - **Usage**: `node server/scripts/test_admin_orders.mjs`

---
> Automated tests for CI/CD are maintained under `server/tests/` and executed via `npm test`.

