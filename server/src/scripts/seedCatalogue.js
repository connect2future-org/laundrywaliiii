import { getEnvConfig } from '../config/env.js';
import { connectDatabase, disconnectDatabase } from '../config/database.js';
import { CONFIRMED_PRIMARY_BRANCH } from '../config/constants.js';
import { Service, Branch, BusinessSetting } from '../models/index.js';
import { OFFICIAL_CATALOGUE_SEED } from '../services/catalogueSeedData.js';

/**
 * Idempotent Database Seeder for LaundryWalii
 * --------------------------------------------
 * - Connects strictly to LaundryWalii
 * - Upserts the official Service Catalogue by categorySlug (preserves existing _ids, never drops collections)
 * - Upserts the confirmed Mysore Branch by branchCode
 * - Never touches customers, orders, payments, or historical order snapshots
 */
export const runCatalogueSeed = async () => {
  const serviceSummary = [];

  for (const cat of OFFICIAL_CATALOGUE_SEED) {
    const existing = await Service.findOne({ categorySlug: cat.categorySlug });
    if (!existing) {
      await Service.create(cat);
      serviceSummary.push({
        categorySlug: cat.categorySlug,
        action: 'created',
        itemsCount: Array.isArray(cat.items) ? cat.items.length : 0
      });
    } else {
      existing.name = cat.name;
      existing.price = cat.price;
      existing.pricingMethod = cat.pricingMethod;
      existing.pricingUnit = cat.pricingUnit;
      existing.description = cat.description;
      existing.features = cat.features;
      existing.image = cat.image;
      existing.selectionMode = cat.selectionMode;
      existing.minQuantity = cat.minQuantity;
      existing.quantityStep = cat.quantityStep;
      existing.turnaroundHours = cat.turnaroundHours;
      existing.sortOrder = cat.sortOrder;
      existing.isAvailable = cat.isAvailable;
      existing.isCustomerVisible = cat.isCustomerVisible;
      existing.isActive = cat.isActive;
      existing.items = cat.items;
      existing.addOns = cat.addOns;
      await existing.save();

      serviceSummary.push({
        categorySlug: cat.categorySlug,
        action: 'updated',
        itemsCount: Array.isArray(cat.items) ? cat.items.length : 0
      });
    }
  }

  let branchAction = 'exists';
  const existingBranch = await Branch.findOne({ branchCode: CONFIRMED_PRIMARY_BRANCH.branchCode });
  if (!existingBranch) {
    await Branch.create(CONFIRMED_PRIMARY_BRANCH);
    branchAction = 'created';
  }

  let settingsAction = 'exists';
  const existingSettings = await BusinessSetting.findOne({ key: 'default' });
  if (!existingSettings) {
    await BusinessSetting.create({
      key: 'default',
      gstPercentage: 5,
      deliveryFee: 49,
      freeDeliveryThreshold: 299
    });
    settingsAction = 'created';
  }

  return { serviceSummary, branchAction, settingsAction };
};

const executeCli = async () => {
  try {
    const cfg = getEnvConfig();
    if (!cfg.mongoUri || cfg.mongoUri.includes('<LAUNDRY_WALII')) {
      throw new Error('MONGO_URI is not configured in server/.env');
    }

    console.log(`[db:seed] Connecting strictly to database "${cfg.mongodbDbName}"...`);
    await connectDatabase();
    const result = await runCatalogueSeed();
    console.log('[db:seed] Catalogue seed completed cleanly (idempotent):');
    console.table(result.serviceSummary);
    console.log(`[db:seed] Primary Mysore branch (${CONFIRMED_PRIMARY_BRANCH.branchCode}): ${result.branchAction}`);
    console.log(`[db:seed] Business pricing settings (default): ${result.settingsAction}`);
  } catch (err) {
    console.error('[db:seed] Failed:', err.message);
    process.exitCode = 1;
  } finally {
    await disconnectDatabase();
  }
};

if (process.argv[1] && process.argv[1].endsWith('seedCatalogue.js')) {
  executeCli();
}

