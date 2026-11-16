import { Service, BusinessSetting } from '../models/index.js';
import { AppError } from '../middleware/errorMiddleware.js';

export const getActiveBusinessPricingSettings = async () => {
  const settings = await BusinessSetting.findOneAndUpdate(
    { key: 'default' },
    {
      $setOnInsert: {
        key: 'default',
        gstPercentage: 5,
        deliveryFee: 49,
        freeDeliveryThreshold: 299
      }
    },
    { upsert: true, new: true, setDefaultsOnInsert: true }
  ).lean();

  return {
    gstPercentage: Number(settings.gstPercentage),
    deliveryFee: Number(settings.deliveryFee),
    freeDeliveryThreshold: Number(settings.freeDeliveryThreshold)
  };
};

/**
 * Authoritative Server-Side Cart & Order Pricing Engine.
 * Strictly reads all service, item, variant, and add-on rates from MongoDB.
 * Never trusts any browser-submitted price, surcharge, or subtotal.
 */
export const calculateServerOrderPricing = async ({ items, discountAmount = 0 }) => {
  if (!Array.isArray(items) || items.length === 0) {
    throw new AppError('At least one service item is required.', 400);
  }

  const resolvedItems = [];
  let subtotal = 0;

  for (const rawItem of items) {
    const serviceQuery = { isActive: true, isAvailable: true };
    if (rawItem.serviceId) {
      serviceQuery._id = rawItem.serviceId;
    } else {
      serviceQuery.categorySlug = String(rawItem.categorySlug || '').toLowerCase();
    }

    const serviceDoc = await Service.findOne(serviceQuery);
    if (!serviceDoc) {
      throw new AppError(
        `Service "${rawItem.categorySlug || rawItem.serviceId}" not found, inactive, or unavailable.`,
        400
      );
    }

    let subItem = null;
    let selectedVariant = null;
    let authoritativeUnitPrice = null;
    let authoritativeUnit = serviceDoc.pricingUnit || null;
    let minQuantity = serviceDoc.minQuantity || 1;
    let quantityStep = serviceDoc.quantityStep || 1;
    let additionalCharge = 0;
    let treatmentName = null;

    if (rawItem.itemId || rawItem.itemCode) {
      const itemsList = Array.isArray(serviceDoc.items) ? serviceDoc.items : [];
      subItem = itemsList.find((it) => {
        if (!it.isActive || it.isAvailable === false) return false;
        if (rawItem.itemId && String(it._id) === String(rawItem.itemId)) return true;
        if (rawItem.itemCode && it.itemCode === String(rawItem.itemCode).toLowerCase()) return true;
        return false;
      });

      if (!subItem) {
        throw new AppError(
          `Catalog item "${rawItem.itemCode || rawItem.itemId}" is invalid or unavailable under "${serviceDoc.name}".`,
          400
        );
      }

      minQuantity = subItem.minQuantity || minQuantity;
      quantityStep = subItem.quantityStep || quantityStep;
      authoritativeUnit = subItem.pricingUnit || authoritativeUnit;

      const activeVariants = Array.isArray(subItem.variants)
        ? subItem.variants.filter((v) => v.isActive && v.isAvailable !== false)
        : [];

      if (rawItem.variantId || rawItem.variantName) {
        selectedVariant = activeVariants.find((v) => {
          if (rawItem.variantId && String(v._id) === String(rawItem.variantId)) return true;
          if (rawItem.variantName && v.name.toLowerCase() === String(rawItem.variantName).toLowerCase()) {
            return true;
          }
          return false;
        });

        if (!selectedVariant) {
          throw new AppError(
            `Variant "${rawItem.variantName || rawItem.variantId}" is invalid or unavailable for "${subItem.name}".`,
            400
          );
        }

        authoritativeUnitPrice = selectedVariant.price;
        authoritativeUnit = selectedVariant.unit || authoritativeUnit;
        additionalCharge = Number(selectedVariant.additionalCharge || 0);
        if (selectedVariant.variantType === 'treatment') {
          treatmentName = selectedVariant.name;
        }
      } else if (activeVariants.length > 0 && (subItem.basePrice === null || subItem.basePrice === undefined)) {
        const defaultVariant = activeVariants.find((v) => v.isDefault) || activeVariants[0];
        selectedVariant = defaultVariant;
        authoritativeUnitPrice = defaultVariant.price;
        authoritativeUnit = defaultVariant.unit || authoritativeUnit;
        additionalCharge = Number(defaultVariant.additionalCharge || 0);
        if (defaultVariant.variantType === 'treatment') {
          treatmentName = defaultVariant.name;
        }
      } else {
        authoritativeUnitPrice = subItem.basePrice;
      }
    } else {
      if (serviceDoc.selectionMode === 'item-selection') {
        throw new AppError(
          `Please select a specific item from "${serviceDoc.name}" instead of booking the category directly.`,
          400
        );
      }
      authoritativeUnitPrice = serviceDoc.price;
    }

    if (authoritativeUnitPrice === null || authoritativeUnitPrice === undefined) {
      throw new AppError(
        `Live pricing is not configured for "${subItem?.name || serviceDoc.name}".`,
        400
      );
    }

    const quantity = Number(rawItem.quantity);
    if (!Number.isInteger(quantity) || quantity < minQuantity) {
      throw new AppError(
        `Minimum quantity for "${subItem?.name || serviceDoc.name}" is ${minQuantity}.`,
        400
      );
    }
    if ((quantity - minQuantity) % quantityStep !== 0) {
      throw new AppError(
        `Quantity for "${subItem?.name || serviceDoc.name}" must increment in steps of ${quantityStep}.`,
        400
      );
    }

    // Resolve and validate add-ons strictly from MongoDB
    const requestedAddOnIds = Array.isArray(rawItem.addOnIds) ? rawItem.addOnIds.map(String) : [];
    const requestedAddOnCodes = Array.isArray(rawItem.addOnCodes)
      ? rawItem.addOnCodes.map((c) => String(c).toLowerCase())
      : [];

    const addOnsSnapshot = [];
    let addOnCharges = 0;
    const availableAddOns = Array.isArray(serviceDoc.addOns) ? serviceDoc.addOns : [];

    for (const addOnId of requestedAddOnIds) {
      const matched = availableAddOns.find(
        (a) => a.isActive && a.isAvailable !== false && String(a._id) === addOnId
      );
      if (!matched) {
        throw new AppError(`Add-on "${addOnId}" is invalid or unavailable.`, 400);
      }
      addOnsSnapshot.push({
        addOnId: matched._id,
        code: matched.code,
        name: matched.name,
        price: Number(matched.price || 0)
      });
      addOnCharges += Number(matched.price || 0);
    }

    for (const addOnCode of requestedAddOnCodes) {
      const matched = availableAddOns.find(
        (a) => a.isActive && a.isAvailable !== false && a.code === addOnCode
      );
      if (!matched) {
        throw new AppError(`Add-on "${addOnCode}" is invalid or unavailable.`, 400);
      }
      if (!addOnsSnapshot.some((s) => s.code === matched.code)) {
        addOnsSnapshot.push({
          addOnId: matched._id,
          code: matched.code,
          name: matched.name,
          price: Number(matched.price || 0)
        });
        addOnCharges += Number(matched.price || 0);
      }
    }

    const lineTotal = Math.round((authoritativeUnitPrice + addOnCharges) * quantity * 100) / 100;
    subtotal = Math.round((subtotal + lineTotal) * 100) / 100;

    resolvedItems.push({
      serviceId: serviceDoc._id,
      categorySlug: serviceDoc.categorySlug,
      serviceName: serviceDoc.name,
      itemId: subItem?._id || null,
      itemCode: subItem?.itemCode || null,
      itemName: subItem?.name || null,
      variantId: selectedVariant?._id || null,
      variantName: selectedVariant?.name || null,
      treatmentName,
      pricingUnit: authoritativeUnit,
      quantity,
      unitPrice: authoritativeUnitPrice,
      additionalCharge,
      addOnCharges,
      surchargePerUnit: addOnCharges,
      addOnsSnapshot,
      lineTotal,
      customizations: rawItem.customizations || {}
    });
  }

  const settings = await getActiveBusinessPricingSettings();
  const gstAmount = Math.round(subtotal * (settings.gstPercentage / 100) * 100) / 100;
  const deliveryFee =
    subtotal === 0
      ? 0
      : subtotal >= settings.freeDeliveryThreshold
        ? 0
        : settings.deliveryFee;
  const safeDiscount = Math.max(0, Number(discountAmount || 0));
  const totalAmount = Math.max(
    0,
    Math.round((subtotal + gstAmount + deliveryFee - safeDiscount) * 100) / 100
  );

  return {
    resolvedItems,
    subtotal,
    gstAmount,
    deliveryFee,
    discountAmount: safeDiscount,
    totalAmount,
    pricingSettings: settings,
    pricingSettingsSnapshot: {
      gstPercentage: settings.gstPercentage,
      deliveryFeeApplied: deliveryFee,
      freeDeliveryThreshold: settings.freeDeliveryThreshold
    }
  };
};

