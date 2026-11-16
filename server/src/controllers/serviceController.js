import mongoose from 'mongoose';
import { Service } from '../models/index.js';
import { AppError, asyncHandler } from '../middleware/errorMiddleware.js';
import { getActiveBusinessPricingSettings } from '../services/pricingService.js';

export const getPublicPricingSettings = asyncHandler(async (_req, res) => {
  const settings = await getActiveBusinessPricingSettings();
  res.json({ success: true, settings });
});

const filterPublicServiceDoc = (doc) => {
  const activeItems = Array.isArray(doc.items)
    ? doc.items
        .filter((it) => it.isActive && it.isAvailable !== false)
        .sort((a, b) => (a.sortOrder || 0) - (b.sortOrder || 0))
        .map((it) => ({
          ...it,
          variants: Array.isArray(it.variants)
            ? it.variants.filter((v) => v.isActive && v.isAvailable !== false)
            : []
        }))
    : null;

  const activeAddOns = Array.isArray(doc.addOns)
    ? doc.addOns.filter((a) => a.isActive && a.isAvailable !== false)
    : null;

  return {
    ...doc,
    id: doc.categorySlug,
    items: activeItems,
    addOns: activeAddOns
  };
};

const findServiceBySlugOrId = async (slugOrId) => {
  if (mongoose.Types.ObjectId.isValid(slugOrId)) {
    const byId = await Service.findById(slugOrId);
    if (byId) return byId;
  }
  return Service.findOne({ categorySlug: String(slugOrId).toLowerCase() });
};

/**
 * Public: Get all active, customer-visible service categories and their active items/variants.
 * Strictly database-driven: returns an empty array if no active services exist in MongoDB.
 */
export const listServices = asyncHandler(async (_req, res) => {
  const docs = await Service.find({ isActive: true, isCustomerVisible: true })
    .sort({ sortOrder: 1, createdAt: 1 })
    .lean();

  const categories = docs.map(filterPublicServiceDoc);

  return res.json({
    success: true,
    source: 'database',
    count: categories.length,
    categories
  });
});

/**
 * Public: List active, customer-visible categories summary.
 */
export const listServiceCategories = asyncHandler(async (_req, res) => {
  const docs = await Service.find({ isActive: true, isCustomerVisible: true })
    .sort({ sortOrder: 1, createdAt: 1 })
    .lean();

  const categories = docs.map((doc) => {
    const filtered = filterPublicServiceDoc(doc);
    return {
      _id: filtered._id,
      id: filtered.categorySlug,
      categorySlug: filtered.categorySlug,
      name: filtered.name,
      description: filtered.description,
      image: filtered.image,
      selectionMode: filtered.selectionMode,
      pricingMethod: filtered.pricingMethod,
      price: filtered.price,
      pricingUnit: filtered.pricingUnit,
      minQuantity: filtered.minQuantity,
      quantityStep: filtered.quantityStep,
      sortOrder: filtered.sortOrder,
      itemCount: Array.isArray(filtered.items) ? filtered.items.length : 0
    };
  });

  res.json({ success: true, count: categories.length, categories });
});

/**
 * Public: List active, customer-visible items across categories or filtered by categorySlug/subCategory.
 */
export const listServiceItems = asyncHandler(async (req, res) => {
  const filter = { isActive: true, isCustomerVisible: true };
  if (req.query.categorySlug) {
    filter.categorySlug = String(req.query.categorySlug).toLowerCase();
  }

  const docs = await Service.find(filter).sort({ sortOrder: 1, createdAt: 1 }).lean();
  const subCategoryFilter = req.query.subCategory
    ? String(req.query.subCategory).trim().toLowerCase()
    : null;

  const items = [];
  for (const doc of docs) {
    const filtered = filterPublicServiceDoc(doc);
    if (Array.isArray(filtered.items)) {
      for (const item of filtered.items) {
        if (
          subCategoryFilter &&
          String(item.subCategory || '').trim().toLowerCase() !== subCategoryFilter
        ) {
          continue;
        }
        items.push({
          ...item,
          serviceId: filtered._id,
          categorySlug: filtered.categorySlug,
          categoryName: filtered.name
        });
      }
    }
  }

  res.json({ success: true, count: items.length, items });
});

export const getServiceBySlug = asyncHandler(async (req, res) => {
  const slugOrId = req.params.slug;
  const query = mongoose.Types.ObjectId.isValid(slugOrId)
    ? { _id: slugOrId, isActive: true, isCustomerVisible: true }
    : { categorySlug: slugOrId.toLowerCase(), isActive: true, isCustomerVisible: true };

  const doc = await Service.findOne(query).lean();
  if (!doc) {
    throw new AppError(`Service category "${slugOrId}" not found or inactive`, 404);
  }

  res.json({ success: true, service: filterPublicServiceDoc(doc) });
});

/**
 * Admin: List all categories including inactive/hidden ones.
 */
export const listAllServicesAdmin = asyncHandler(async (_req, res) => {
  const categories = await Service.find({}).sort({ sortOrder: 1, createdAt: 1 }).lean();
  res.json({ success: true, count: categories.length, categories });
});

export const createServiceCategory = asyncHandler(async (req, res) => {
  const slug = req.body.categorySlug.toLowerCase();
  const existing = await Service.findOne({ categorySlug: slug });
  if (existing) {
    throw new AppError(`Category "${slug}" already exists`, 409);
  }

  const service = await Service.create({
    ...req.body,
    categorySlug: slug,
    updatedBy: req.admin._id
  });

  res.status(201).json({
    success: true,
    message: `Service category "${service.name}" created`,
    service
  });
});

export const upsertServiceCategory = asyncHandler(async (req, res) => {
  const categorySlug = req.body.categorySlug.toLowerCase();
  const service = await Service.findOneAndUpdate(
    { categorySlug },
    {
      ...req.body,
      categorySlug,
      updatedBy: req.admin._id
    },
    {
      new: true,
      upsert: true,
      runValidators: true,
      setDefaultsOnInsert: true
    }
  );

  res.status(200).json({
    success: true,
    message: `Service category "${service.name}" saved cleanly`,
    service
  });
});

export const updateServicePricing = asyncHandler(async (req, res) => {
  const service = await findServiceBySlugOrId(req.params.slug);
  if (!service) {
    throw new AppError(`Service category "${req.params.slug}" not found`, 404);
  }

  Object.assign(service, req.body, { updatedBy: req.admin._id });
  await service.save();

  res.json({
    success: true,
    message: `Service updated for "${service.name}"`,
    service
  });
});

export const addServiceItem = asyncHandler(async (req, res) => {
  const service = await findServiceBySlugOrId(req.params.slug);
  if (!service) {
    throw new AppError(`Service category "${req.params.slug}" not found`, 404);
  }

  if (!Array.isArray(service.items)) {
    service.items = [];
  }

  const itemCode = req.body.itemCode.toLowerCase();
  if (service.items.some((it) => it.itemCode === itemCode)) {
    throw new AppError(`Item code "${itemCode}" already exists in "${service.name}"`, 409);
  }

  service.items.push({
    ...req.body,
    itemCode
  });
  service.updatedBy = req.admin._id;
  await service.save();

  const createdItem = service.items[service.items.length - 1];
  res.status(201).json({
    success: true,
    message: `Item "${createdItem.name}" added to "${service.name}"`,
    item: createdItem,
    service
  });
});

export const updateServiceItem = asyncHandler(async (req, res) => {
  const service = await findServiceBySlugOrId(req.params.slug);
  if (!service) {
    throw new AppError(`Service category "${req.params.slug}" not found`, 404);
  }

  const itemId = req.params.itemId;
  const item = (service.items || []).find(
    (it) => String(it._id) === itemId || it.itemCode === itemId.toLowerCase()
  );

  if (!item) {
    throw new AppError(`Item "${itemId}" not found in "${service.name}"`, 404);
  }

  Object.assign(item, req.body);
  service.updatedBy = req.admin._id;
  await service.save();

  res.json({
    success: true,
    message: `Item "${item.name}" updated`,
    item,
    service
  });
});

export const addItemVariant = asyncHandler(async (req, res) => {
  const service = await findServiceBySlugOrId(req.params.slug);
  if (!service) {
    throw new AppError(`Service category "${req.params.slug}" not found`, 404);
  }

  const itemId = req.params.itemId;
  const item = (service.items || []).find(
    (it) => String(it._id) === itemId || it.itemCode === itemId.toLowerCase()
  );
  if (!item) {
    throw new AppError(`Item "${itemId}" not found in "${service.name}"`, 404);
  }

  item.variants.push(req.body);
  service.updatedBy = req.admin._id;
  await service.save();

  const createdVariant = item.variants[item.variants.length - 1];
  res.status(201).json({
    success: true,
    message: `Variant "${createdVariant.name}" added to "${item.name}"`,
    variant: createdVariant,
    service
  });
});

export const updateItemVariant = asyncHandler(async (req, res) => {
  const service = await findServiceBySlugOrId(req.params.slug);
  if (!service) {
    throw new AppError(`Service category "${req.params.slug}" not found`, 404);
  }

  const itemId = req.params.itemId;
  const item = (service.items || []).find(
    (it) => String(it._id) === itemId || it.itemCode === itemId.toLowerCase()
  );
  if (!item) {
    throw new AppError(`Item "${itemId}" not found in "${service.name}"`, 404);
  }

  const variant = item.variants.id(req.params.variantId);
  if (!variant) {
    throw new AppError(`Variant "${req.params.variantId}" not found`, 404);
  }

  Object.assign(variant, req.body);
  service.updatedBy = req.admin._id;
  await service.save();

  res.json({
    success: true,
    message: `Variant "${variant.name}" updated`,
    variant,
    service
  });
});

export const addServiceAddOn = asyncHandler(async (req, res) => {
  const service = await findServiceBySlugOrId(req.params.slug);
  if (!service) {
    throw new AppError(`Service category "${req.params.slug}" not found`, 404);
  }

  if (!Array.isArray(service.addOns)) {
    service.addOns = [];
  }

  const code = req.body.code.toLowerCase();
  if (service.addOns.some((a) => a.code === code)) {
    throw new AppError(`Add-on "${code}" already exists in "${service.name}"`, 409);
  }

  service.addOns.push({ ...req.body, code });
  service.updatedBy = req.admin._id;
  await service.save();

  const createdAddOn = service.addOns[service.addOns.length - 1];
  res.status(201).json({
    success: true,
    message: `Add-on "${createdAddOn.name}" added`,
    addOn: createdAddOn,
    service
  });
});

export const updateServiceAddOn = asyncHandler(async (req, res) => {
  const service = await findServiceBySlugOrId(req.params.slug);
  if (!service) {
    throw new AppError(`Service category "${req.params.slug}" not found`, 404);
  }

  const addOn = (service.addOns || []).find(
    (a) => String(a._id) === req.params.addOnId || a.code === req.params.addOnId.toLowerCase()
  );
  if (!addOn) {
    throw new AppError(`Add-on "${req.params.addOnId}" not found`, 404);
  }

  Object.assign(addOn, req.body);
  service.updatedBy = req.admin._id;
  await service.save();

  res.json({
    success: true,
    message: `Add-on "${addOn.name}" updated`,
    addOn,
    service
  });
});
