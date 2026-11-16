# Laundry Walii — Frontend Testing Utilities

This directory (`client/tests/`) contains end-to-end browser and UI verification scripts.

### Available Test Suites

1. **`checkout.e2e.mjs`**
   - **Purpose**: Full end-to-end user checkout validation using Playwright across Desktop, Tablet, and Mobile viewports.
   - **Coverage**:
     - Adding services to the Laundry Basket
     - Cart Drawer open/close and item modification
     - Multi-step checkout modal (Customer Information, Pickup Schedule & Slots, Order Review & COD verification, and final Booking Confirmation)
   - **Usage**: `node client/tests/checkout.e2e.mjs`

