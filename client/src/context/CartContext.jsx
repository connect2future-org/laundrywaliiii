import { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';
import { ordersApi, servicesApi } from '../services/api';

const CART_STORAGE_KEY = 'laundry_walii_cart';

const CartContext = createContext(null);

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState(() => {
    try {
      const saved = localStorage.getItem(CART_STORAGE_KEY);
      if (!saved) return [];
      const parsed = JSON.parse(saved);
      if (!Array.isArray(parsed)) return [];
      // Only keep items that carry database catalogue identifiers
      return parsed.filter((it) => it && it.categorySlug && typeof it.quantity === 'number');
    } catch (e) {
      console.error('Failed to parse cart from local storage:', e);
      return [];
    }
  });

  const [isCartOpen, setIsCartOpen] = useState(false);
  const [activeCustomizingItem, setActiveCustomizingItem] = useState(null);
  const [verifiedQuote, setVerifiedQuote] = useState(null);
  const [isVerifyingQuote, setIsVerifyingQuote] = useState(false);
  const [quoteError, setQuoteError] = useState('');
  const [pricingSettings, setPricingSettings] = useState(null);

  useEffect(() => {
    let active = true;
    servicesApi
      .getPricingSettings()
      .then((settings) => {
        if (active && settings) setPricingSettings(settings);
      })
      .catch(() => {});
    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cartItems));
    } catch (e) {
      console.error('Failed to save cart to local storage:', e);
    }
  }, [cartItems]);

  const toQuoteItemsPayload = useCallback(
    (items) =>
      items.map((it) => ({
        ...(it.serviceId ? { serviceId: it.serviceId } : {}),
        categorySlug: it.categorySlug,
        ...(it.itemId ? { itemId: it.itemId } : {}),
        ...(it.itemCode ? { itemCode: it.itemCode } : {}),
        ...(it.itemName ? { itemName: it.itemName } : {}),
        ...(it.variantId ? { variantId: it.variantId } : {}),
        ...(it.variantName ? { variantName: it.variantName } : {}),
        ...(Array.isArray(it.addOnIds) && it.addOnIds.length > 0 ? { addOnIds: it.addOnIds } : {}),
        ...(Array.isArray(it.addOnCodes) && it.addOnCodes.length > 0
          ? { addOnCodes: it.addOnCodes }
          : {}),
        quantity: it.quantity,
        customizations: it.options || {}
      })),
    []
  );

  const verifyCartWithBackend = useCallback(
    async (itemsToVerify = cartItems) => {
      if (!itemsToVerify || itemsToVerify.length === 0) {
        setVerifiedQuote(null);
        setQuoteError('');
        return null;
      }

      setIsVerifyingQuote(true);
      setQuoteError('');
      try {
        const quote = await ordersApi.quoteOrder({
          items: toQuoteItemsPayload(itemsToVerify)
        });
        setVerifiedQuote(quote);
        return quote;
      } catch (err) {
        setQuoteError(err.message || 'Unable to verify cart pricing with server.');
        setVerifiedQuote(null);
        return null;
      } finally {
        setIsVerifyingQuote(false);
      }
    },
    [cartItems, toQuoteItemsPayload]
  );

  useEffect(() => {
    let active = true;
    const sync = async () => {
      if (cartItems.length === 0) {
        setVerifiedQuote(null);
        setQuoteError('');
        return;
      }
      setIsVerifyingQuote(true);
      setQuoteError('');
      try {
        const quote = await ordersApi.quoteOrder({
          items: toQuoteItemsPayload(cartItems)
        });
        if (active) {
          setVerifiedQuote(quote);
        }
      } catch (err) {
        if (active) {
          setQuoteError(err.message || 'Unable to verify cart pricing with server.');
          setVerifiedQuote(null);
        }
      } finally {
        if (active) {
          setIsVerifyingQuote(false);
        }
      }
    };
    sync();
    return () => {
      active = false;
    };
  }, [cartItems, toQuoteItemsPayload]);

  const openCart = () => setIsCartOpen(true);
  const closeCart = () => setIsCartOpen(false);
  const toggleCart = () => setIsCartOpen((prev) => !prev);

  const createItemKey = (item, options = {}) => {
    const baseParts = [
      item.categorySlug || item.category || item.id,
      item.itemCode || '',
      item.variantId || item.variantName || '',
      Array.isArray(item.addOnCodes) ? [...item.addOnCodes].sort().join(',') : ''
    ].join('::');

    const sortedOptions = Object.keys(options)
      .sort()
      .map((k) => `${k}:${JSON.stringify(options[k])}`)
      .join('|');
    return `${baseParts}__${sortedOptions}`;
  };

  /**
   * Add database-backed service/item/variant to cart.
   * Final pricing is always verified by the backend quote/order endpoints.
   */
  const addToCart = (item, options = {}, quantity) => {
    const minQty = Number(item.minQuantity || 1);
    const step = Number(item.quantityStep || 1);
    const initialQty = quantity !== undefined ? Math.max(minQty, Number(quantity)) : minQty;
    const key = createItemKey(item, options);

    const addOnsList = Array.isArray(item.addOns) ? item.addOns : [];
    const addOnCharges = addOnsList.reduce((sum, a) => sum + Number(a.price || 0), 0);
    const baseUnitPrice = Number(item.price || 0);

    setCartItems((prevItems) => {
      const existingIndex = prevItems.findIndex((it) => it.key === key);

      if (existingIndex > -1) {
        const updated = [...prevItems];
        updated[existingIndex] = {
          ...updated[existingIndex],
          quantity: updated[existingIndex].quantity + initialQty
        };
        return updated;
      }

      const newItem = {
        key,
        id: item.id || item.itemCode || item.categorySlug,
        serviceId: item.serviceId || null,
        categorySlug: item.categorySlug || item.category,
        serviceName: item.serviceName || item.name,
        itemId: item.itemId || null,
        itemCode: item.itemCode || null,
        itemName: item.itemName || null,
        variantId: item.variantId || null,
        variantName: item.variantName || null,
        name: item.name,
        category: item.categorySlug || item.category,
        unit: item.unit || 'piece',
        minQuantity: minQty,
        quantityStep: step,
        basePrice: baseUnitPrice,
        addOnCharges,
        surcharge: addOnCharges,
        unitPrice: baseUnitPrice + addOnCharges,
        addOnIds: addOnsList.map((a) => a._id).filter(Boolean),
        addOnCodes: addOnsList.map((a) => a.code).filter(Boolean),
        addOns: addOnsList,
        quantity: initialQty,
        options,
        turnaround: item.turnaround || '24-48 Hours'
      };
      return [...prevItems, newItem];
    });

    openCart();
  };

  const addMultipleToCart = (itemsList) => {
    itemsList.forEach(({ item, options, quantity }) => {
      addToCart(item, options, quantity);
    });
  };

  const removeFromCart = (key) => {
    setCartItems((prev) => prev.filter((item) => item.key !== key));
  };

  const updateQuantity = (key, deltaOrVal, isAbsolute = false) => {
    setCartItems((prev) =>
      prev
        .map((item) => {
          if (item.key !== key) return item;
          const minQty = Number(item.minQuantity || 1);
          const step = Number(item.quantityStep || 1);
          const nextQty = isAbsolute
            ? Number(deltaOrVal)
            : item.quantity + Number(deltaOrVal) * step;

          if (nextQty < minQty) return null;
          return { ...item, quantity: nextQty };
        })
        .filter(Boolean)
    );
  };

  const clearCart = () => {
    setCartItems([]);
    setVerifiedQuote(null);
    setQuoteError('');
  };

  const { itemCount, subtotal, deliveryFee, gst, total } = useMemo(() => {
    const count = cartItems.reduce((acc, item) => acc + item.quantity, 0);

    if (verifiedQuote) {
      return {
        itemCount: count,
        subtotal: verifiedQuote.subtotal,
        deliveryFee: verifiedQuote.deliveryFee,
        gst: verifiedQuote.gstAmount,
        total: verifiedQuote.totalAmount
      };
    }

    const sub = cartItems.reduce((acc, item) => acc + item.unitPrice * item.quantity, 0);
    if (!pricingSettings) {
      return {
        itemCount: count,
        subtotal: sub,
        deliveryFee: 0,
        gst: 0,
        total: sub
      };
    }

    const delivery =
      sub === 0
        ? 0
        : sub >= pricingSettings.freeDeliveryThreshold
          ? 0
          : pricingSettings.deliveryFee;
    const tax = Math.round(sub * (pricingSettings.gstPercentage / 100) * 100) / 100;
    const grandTotal = Math.round((sub + delivery + tax) * 100) / 100;

    return {
      itemCount: count,
      subtotal: sub,
      deliveryFee: delivery,
      gst: tax,
      total: grandTotal
    };
  }, [cartItems, verifiedQuote, pricingSettings]);

  const activePricingSettings = verifiedQuote?.pricingSettings || pricingSettings;

  const value = {
    cartItems,
    isCartOpen,
    openCart,
    closeCart,
    toggleCart,
    addToCart,
    addMultipleToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    activeCustomizingItem,
    setActiveCustomizingItem,
    itemCount,
    subtotal,
    deliveryFee,
    gst,
    total,
    pricingSettings: activePricingSettings,
    verifiedQuote,
    isVerifyingQuote,
    quoteError,
    verifyCartWithBackend,
    toQuoteItemsPayload,
    freeDeliveryThreshold: activePricingSettings?.freeDeliveryThreshold ?? 0
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

// eslint-disable-next-line react-refresh/only-export-components
export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
