/**
 * Frontend Service Formatting Helpers
 * ----------------------------------
 * Zero hardcoded service names, categories, items, variants, or prices.
 * All catalogue configuration and pricing are fetched live from MongoDB via `/api/v1/services`.
 */

export const formatPricingUnit = (unit) => {
  if (!unit) return '';
  if (unit === 'fixed_size') return 'fixed size';
  return unit;
};
