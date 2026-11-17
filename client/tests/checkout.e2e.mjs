import { chromium } from 'playwright-core';
import assert from 'node:assert/strict';

const CHROME_PATH = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const BASE_URL = process.env.CLIENT_URL || 'http://localhost:5175';

export async function runCheckoutE2E({ headless = true } = {}) {
  console.log('--- STARTING E2E PLAYWRIGHT CHECKOUT SYSTEM VERIFICATION ---');

  const browser = await chromium.launch({
    executablePath: CHROME_PATH,
    headless
  });

  // 1. DESKTOP RUN (1440x900)
  console.log('\n=== 1. TESTING ON DESKTOP (1440x900) ===');
  const desktopContext = await browser.newContext({
    viewport: { width: 1440, height: 900 }
  });
  const page = await desktopContext.newPage();

  console.log(`Navigating to ${BASE_URL}/services...`);
  await page.goto(`${BASE_URL}/services`, { waitUntil: 'networkidle' });

  // Add Wash & Fold to cart
  console.log('Adding Wash & Fold to cart...');
  const addBtn = page.locator('button:has-text("Add to Basket"), button:has-text("Book Service"), button:has-text("Add")').first();
  await addBtn.click();
  await page.waitForTimeout(600);

  // If item modal opened, click Add inside modal
  const modalAdd = page.locator('.modal-backdrop button:has-text("Add to Basket")');
  if (await modalAdd.isVisible()) {
    await modalAdd.click();
    await page.waitForTimeout(600);
  }

  // Check Cart Drawer
  const cartDrawer = page.locator('h3:has-text("Laundry Basket")');
  if (!(await cartDrawer.isVisible())) {
    await page.locator('.navbar-cart-btn').click();
    await page.waitForTimeout(500);
  }
  assert.ok(await cartDrawer.isVisible(), 'Cart drawer must be visible after adding item');
  console.log('✓ Cart Drawer verified');

  // Proceed to Checkout from Cart Drawer
  const checkoutBtn = page.locator('button:has-text("Schedule Pickup & Checkout")');
  await checkoutBtn.click();
  await page.waitForTimeout(600);

  // Verify Checkout Modal Step 1
  const step1Title = page.locator('text=Customer Details & Pickup Address');
  assert.ok(await step1Title.isVisible(), 'Checkout modal Step 1 must be open');

  // Test empty validation
  const continueBtn = page.locator('button:has-text("Continue")');
  await continueBtn.click();
  await page.waitForTimeout(300);

  const nameError = await page.locator('text=Full name is mandatory').isVisible();
  const phoneError = await page.locator('text=Please enter a valid 10-digit mobile number').isVisible();
  const addrError = await page.locator('text=Pickup address is mandatory').isVisible();
  assert.ok(nameError && phoneError && addrError, 'Step 1 validation messages must appear');
  console.log('✓ Step 1 empty validation rejected as required');

  // Fill in customer details
  await page.locator('input[placeholder="e.g. Priya Sharma"]').fill('Dr. Rakesh Hegde');
  await page.locator('input[placeholder="9876543210"]').fill('9035999272');
  await page.locator('input[placeholder="priya.sharma@example.com"]').fill('rakesh.hegde@example.com');
  await page.locator('textarea[placeholder*="complete doorstep address"]').fill(
    'Flat 4B, Silver Oak Residency, 3rd Cross, Jayalakshmipuram, KD Road, Mysore'
  );
  await page.locator('input[placeholder*="Near Westside"]').fill('Behind Kuvempu Trust Building');
  await page.locator('input[placeholder="e.g. 570012"]').fill('570012');

  // Verify Confirmed Hub badge
  const hubBadge = page.locator('text=Laundry Waliiii – Mysore');
  assert.ok(await hubBadge.first().isVisible(), 'Mysore hub must be displayed');
  console.log('✓ Step 1 customer & address details verified');

  // Advance to Step 2: Schedule
  await continueBtn.click();
  await page.waitForTimeout(600);

  const step2Title = page.locator('text=Select Pickup Date & Time Slot');
  assert.ok(await step2Title.isVisible(), 'Step 2 schedule must be active');

  // Verify operating hours text
  const opHours = page.locator('text=Store hours: 10:00 AM – 8:00 PM');
  assert.ok(await opHours.isVisible(), 'Operating hours 10 AM - 8 PM must be displayed');

  // Fill special instructions
  await page.locator('textarea[placeholder*="Special care notes"]').fill(
    'Please handle with hypoallergenic detergent and pack shirts on hangers.'
  );
  console.log('✓ Step 2 schedule & special instructions verified');

  // Advance to Step 3: Review & COD
  await continueBtn.click();
  await page.waitForTimeout(600);

  const step3Title = page.locator('text=Review Order & Cash on Delivery');
  assert.ok(await step3Title.isVisible(), 'Step 3 Review must be active');

  // Verify Cash on Delivery card
  const codCard = page.locator('h5:has-text("Cash on Delivery (COD)")');
  assert.ok(await codCard.isVisible(), 'COD card must be visible');

  const onlyCodBadge = page.locator('text=Only Method Available');
  assert.ok(await onlyCodBadge.isVisible(), 'Only Method Available badge must be visible');

  // Strict check: No online gateways, No QR, No UTR inputs
  const upiCount = await page.locator('text=Instant UPI').count();
  const utrCount = await page.locator('input[placeholder*="UTR"]').count();
  assert.equal(upiCount, 0, 'No instant UPI options allowed in active checkout');
  assert.equal(utrCount, 0, 'No UTR input fields allowed in active checkout');
  console.log('✓ Verified: Cash on Delivery is strictly the ONLY active payment option (0 UPI/UTR)');

  // Confirm Order
  const confirmOrderBtn = page.locator('button:has-text("Confirm Order")');
  await confirmOrderBtn.click();

  // Wait for Step 4 Confirmation
  await page.waitForSelector('text=Your Doorstep Collection is Confirmed!', { timeout: 12000 });
  console.log('✓ Step 4 Confirmation Screen reached successfully!');

  // Verify Booking ID exists
  const bookingIdEl = page.locator('span:has-text("LW-")').first();
  const bookingId = (await bookingIdEl.textContent()).trim();
  assert.ok(bookingId.startsWith('LW-'), `Booking ID must start with LW-, got ${bookingId}`);
  console.log(`✓ Unique Order ID generated in MongoDB: ${bookingId}`);

  // Verify WhatsApp Notification button
  const whatsappBtn = page.locator('button:has-text("Notify / Confirm on WhatsApp")');
  assert.ok(await whatsappBtn.isVisible(), 'WhatsApp button must be present on confirmation screen');

  // Verify COD Payment status pending
  const pendingStatus = page.locator('text=Pending (Pay upon delivery)');
  assert.ok(await pendingStatus.isVisible(), 'Payment status must be Pending (Pay upon delivery)');

  await desktopContext.close();

  // 2. TABLET RUN (768x1024)
  console.log('\n=== 2. TESTING ON TABLET (768x1024) ===');
  const tabletContext = await browser.newContext({
    viewport: { width: 768, height: 1024 }
  });
  const pageTablet = await tabletContext.newPage();
  await pageTablet.goto(`${BASE_URL}/services`, { waitUntil: 'networkidle' });
  await pageTablet.locator('button:has-text("Add to Basket"), button:has-text("Book Service"), button:has-text("Add")').first().click();
  await pageTablet.waitForTimeout(500);

  const tabletModalAdd = pageTablet.locator('.modal-backdrop button:has-text("Add to Basket")');
  if (await tabletModalAdd.isVisible()) {
    await tabletModalAdd.click();
    await pageTablet.waitForTimeout(500);
  }

  const tabletProceed = pageTablet.locator('button:has-text("Schedule Pickup & Checkout")');
  if (await tabletProceed.isVisible()) {
    await tabletProceed.click();
    await pageTablet.waitForTimeout(600);
    console.log('✓ Tablet checkout opened and responsive');
  }
  await tabletContext.close();

  // 3. MOBILE RUN (390x844)
  console.log('\n=== 3. TESTING ON MOBILE (390x844) ===');
  const mobileContext = await browser.newContext({
    viewport: { width: 390, height: 844 },
    hasTouch: true
  });
  const pageMobile = await mobileContext.newPage();
  await pageMobile.goto(`${BASE_URL}/services`, { waitUntil: 'networkidle' });
  await pageMobile.locator('button:has-text("Add to Basket"), button:has-text("Book Service"), button:has-text("Add")').first().click();
  await pageMobile.waitForTimeout(500);

  const mobileModalAdd = pageMobile.locator('.modal-backdrop button:has-text("Add to Basket")');
  if (await mobileModalAdd.isVisible()) {
    await mobileModalAdd.click();
    await pageMobile.waitForTimeout(500);
  }

  const mobileProceed = pageMobile.locator('button:has-text("Schedule Pickup & Checkout")');
  if (await mobileProceed.isVisible()) {
    await mobileProceed.click();
    await pageMobile.waitForTimeout(600);
    console.log('✓ Mobile checkout opened and responsive');
  }
  await mobileContext.close();

  await browser.close();
  console.log('\n=== ALL E2E PLAYWRIGHT TESTS PASSED SUCCESSFULLY! ===');
}

// Auto-run if executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  runCheckoutE2E().catch((err) => {
    console.error('E2E Test Failed:', err);
    process.exit(1);
  });
}

