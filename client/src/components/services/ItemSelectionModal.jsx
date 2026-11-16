import { useState, useMemo } from 'react';
import { X, Sparkles, Plus, Minus, Check } from 'lucide-react';
import { formatINR } from '../../utils/currency';
import { formatPricingUnit } from '../../config/services';

export const ItemSelectionModal = ({ isOpen, onClose, service, onAddItems }) => {
  const [quantities, setQuantities] = useState({});
  const [selectedVariants, setSelectedVariants] = useState(() => {
    const defaults = {};
    if (service && Array.isArray(service.items)) {
      service.items.forEach((it) => {
        const activeVars = (it.variants || []).filter(
          (v) => v.isActive !== false && v.isAvailable !== false
        );
        if (activeVars.length > 0) {
          defaults[it.itemCode] = activeVars.find((v) => v.isDefault) || activeVars[0];
        }
      });
    }
    return defaults;
  });
  const [selectedAddOns, setSelectedAddOns] = useState([]);
  const [specialNotes, setSpecialNotes] = useState('');

  const activeItems = useMemo(() => {
    if (!service || !Array.isArray(service.items)) return [];
    return service.items.filter((it) => it.isActive !== false && it.isAvailable !== false);
  }, [service]);

  const activeAddOns = useMemo(() => {
    if (!service || !Array.isArray(service.addOns)) return [];
    return service.addOns.filter((a) => a.isActive !== false && a.isAvailable !== false);
  }, [service]);

  const groupedItems = useMemo(() => {
    const groups = new Map();
    activeItems.forEach((it) => {
      const groupName = it.subCategory || 'Services';
      if (!groups.has(groupName)) groups.set(groupName, []);
      groups.get(groupName).push(it);
    });
    return Array.from(groups.entries());
  }, [activeItems]);

  if (!isOpen || !service) return null;

  const handleQtyChange = (item, direction) => {
    const minQty = Number(item.minQuantity || 1);
    const step = Number(item.quantityStep || 1);
    setQuantities((prev) => {
      const current = prev[item.itemCode] || 0;
      let next;
      if (direction > 0) {
        next = current === 0 ? minQty : current + step;
      } else {
        next = current - step;
        if (next < minQty) next = 0;
      }
      if (next <= 0) {
        const copy = { ...prev };
        delete copy[item.itemCode];
        return copy;
      }
      return { ...prev, [item.itemCode]: next };
    });
  };

  const handleSelectVariant = (itemCode, variant) => {
    setSelectedVariants((prev) => ({
      ...prev,
      [itemCode]: variant
    }));
  };

  const toggleAddOn = (addon) => {
    setSelectedAddOns((prev) => {
      const exists = prev.some((a) => a.code === addon.code);
      return exists ? prev.filter((a) => a.code !== addon.code) : [...prev, addon];
    });
  };

  const selectedItemsList = activeItems.filter((it) => (quantities[it.itemCode] || 0) > 0);
  const totalSelectedCount = Object.values(quantities).reduce((a, b) => a + b, 0);
  const addOnsPerUnit = selectedAddOns.reduce((acc, a) => acc + Number(a.price || 0), 0);

  const estimatedTotal = selectedItemsList.reduce((acc, item) => {
    const variant = selectedVariants[item.itemCode];
    const unitPrice = Number(variant?.price ?? item.basePrice ?? 0);
    const qty = quantities[item.itemCode] || 0;
    return acc + (unitPrice + addOnsPerUnit) * qty;
  }, 0);

  const handleConfirm = () => {
    if (selectedItemsList.length === 0) return;

    const itemsToCart = selectedItemsList.map((item) => {
      const variant = selectedVariants[item.itemCode] || null;
      const unitPrice = Number(variant?.price ?? item.basePrice ?? 0);
      const unit = formatPricingUnit(variant?.unit || item.pricingUnit || service.pricingUnit || 'piece');
      const displayName =
        variant && item.variants && item.variants.length > 1
          ? `${service.name}: ${item.name} (${variant.name})`
          : variant && variant.name !== 'Standard'
            ? `${service.name}: ${item.name} (${variant.name})`
            : `${service.name}: ${item.name}`;

      return {
        item: {
          id: `${service.categorySlug}:${item.itemCode}:${variant?.code || variant?.name || 'default'}`,
          serviceId: service._id,
          categorySlug: service.categorySlug,
          serviceName: service.name,
          itemId: item._id,
          itemCode: item.itemCode,
          itemName: item.name,
          variantId: variant?._id || null,
          variantName: variant?.name || null,
          name: displayName,
          category: service.categorySlug,
          price: unitPrice,
          unit,
          minQuantity: Number(item.minQuantity || 1),
          quantityStep: Number(item.quantityStep || 1),
          addOns: selectedAddOns,
          turnaround: service.turnaroundHours ? `${service.turnaroundHours} Hours` : '48-72 Hours'
        },
        options: {
          instructions: specialNotes.trim()
        },
        quantity: quantities[item.itemCode]
      };
    });

    onAddItems(itemsToCart);
    onClose();
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 1100,
        background: 'rgba(23, 18, 27, 0.7)',
        backdropFilter: 'blur(6px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1.25rem',
        animation: 'fadeIn 0.2s ease-out'
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        style={{
          background: '#FFFFFF',
          borderRadius: 'var(--radius-2xl)',
          maxWidth: '720px',
          width: '100%',
          maxHeight: '92vh',
          display: 'flex',
          flexDirection: 'column',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
          overflow: 'hidden'
        }}
      >
        {/* Header */}
        <div
          style={{
            padding: '1.25rem 1.75rem',
            borderBottom: '1px solid var(--color-border)',
            background: '#FCFAFC',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div className="card-icon-badge-pink" style={{ width: '42px', height: '42px' }}>
              <Sparkles size={20} />
            </div>
            <div>
              <span className="badge badge-purple" style={{ marginBottom: '0.2rem' }}>
                Live Catalogue Rates
              </span>
              <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.2rem', margin: 0 }}>
                {service.name}
              </h3>
            </div>
          </div>
          <button
            type="button"
            className="btn-neu-icon"
            onClick={onClose}
            aria-label="Close modal"
            style={{ width: '36px', height: '36px' }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Body */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '1.5rem' }}>
          {service.description && (
            <p style={{ fontSize: '0.86rem', color: 'var(--color-muted)', marginBottom: '1.25rem' }}>
              {service.description}
            </p>
          )}

          {groupedItems.length === 0 ? (
            <p style={{ fontSize: '0.9rem', color: 'var(--color-muted)', textAlign: 'center', padding: '2rem 0' }}>
              No active items are currently available in this category.
            </p>
          ) : (
            groupedItems.map(([groupName, items]) => (
              <div key={groupName} style={{ marginBottom: '1.5rem' }}>
                {groupedItems.length > 1 && (
                  <h4
                    style={{
                      fontFamily: 'var(--font-body)',
                      fontSize: '0.78rem',
                      fontWeight: 700,
                      textTransform: 'uppercase',
                      letterSpacing: '0.08em',
                      color: '#700F63',
                      marginBottom: '0.75rem'
                    }}
                  >
                    {groupName}
                  </h4>
                )}

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  {items.map((item) => {
                    const qty = quantities[item.itemCode] || 0;
                    const isSelected = qty > 0;
                    const activeVars = (item.variants || []).filter(
                      (v) => v.isActive !== false && v.isAvailable !== false
                    );
                    const currentVariant = selectedVariants[item.itemCode] || activeVars[0] || null;
                    const displayPrice = currentVariant?.price ?? item.basePrice ?? 0;
                    const displayUnit = formatPricingUnit(
                      currentVariant?.unit || item.pricingUnit || service.pricingUnit || 'piece'
                    );

                    return (
                      <div
                        key={item._id || item.itemCode}
                        style={{
                          padding: '0.9rem 1.15rem',
                          borderRadius: 'var(--radius-lg)',
                          border: isSelected ? '1.5px solid #700F63' : '1px solid #EEE9EF',
                          background: isSelected ? '#F6EEF8' : '#FCFAFC',
                          transition: 'all 0.15s ease'
                        }}
                      >
                        <div
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            gap: '1rem'
                          }}
                        >
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <h5 style={{ fontSize: '0.95rem', fontWeight: 600, color: '#171421', margin: 0 }}>
                              {item.name}
                            </h5>
                            <span
                              style={{
                                fontSize: '0.84rem',
                                fontWeight: 700,
                                color: '#700F63',
                                display: 'block',
                                marginTop: '0.2rem'
                              }}
                            >
                              {formatINR(displayPrice)}{' '}
                              <span style={{ fontSize: '0.74rem', color: '#77717D', fontWeight: 400 }}>
                                / {displayUnit}
                              </span>
                            </span>
                          </div>

                          {/* Quantity Controls */}
                          <div
                            style={{
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '0.6rem',
                              background: '#FFFFFF',
                              borderRadius: '9999px',
                              padding: '3px 8px',
                              border: '1px solid #EEE9EF'
                            }}
                          >
                            <button
                              type="button"
                              onClick={() => handleQtyChange(item, -1)}
                              disabled={qty === 0}
                              aria-label={`Decrease ${item.name} quantity`}
                              style={{
                                width: '26px',
                                height: '26px',
                                borderRadius: '50%',
                                background: '#F8F1F8',
                                color: '#700F63',
                                border: 'none',
                                cursor: qty === 0 ? 'not-allowed' : 'pointer',
                                opacity: qty === 0 ? 0.35 : 1,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center'
                              }}
                            >
                              <Minus size={13} />
                            </button>
                            <span
                              style={{
                                fontFamily: 'var(--font-heading)',
                                fontSize: '0.88rem',
                                fontWeight: 700,
                                minWidth: '22px',
                                textAlign: 'center',
                                color: '#171421'
                              }}
                            >
                              {qty}
                            </span>
                            <button
                              type="button"
                              onClick={() => handleQtyChange(item, 1)}
                              aria-label={`Increase ${item.name} quantity`}
                              style={{
                                width: '26px',
                                height: '26px',
                                borderRadius: '50%',
                                background: '#700F63',
                                color: '#FFF',
                                border: 'none',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center'
                              }}
                            >
                              <Plus size={13} />
                            </button>
                          </div>
                        </div>

                        {/* Variant / Treatment / Size Selector */}
                        {activeVars.length > 1 && (
                          <div
                            style={{
                              display: 'flex',
                              flexWrap: 'wrap',
                              gap: '0.5rem',
                              marginTop: '0.75rem'
                            }}
                          >
                            {activeVars.map((variant) => {
                              const isVarSelected =
                                (currentVariant?._id && String(currentVariant._id) === String(variant._id)) ||
                                currentVariant?.name === variant.name;
                              return (
                                <button
                                  key={variant._id || variant.name}
                                  type="button"
                                  onClick={() => handleSelectVariant(item.itemCode, variant)}
                                  style={{
                                    padding: '0.35rem 0.75rem',
                                    borderRadius: '9999px',
                                    fontSize: '0.76rem',
                                    fontWeight: 600,
                                    cursor: 'pointer',
                                    border: isVarSelected
                                      ? '1.5px solid #700F63'
                                      : '1px solid #DDD5DF',
                                    background: isVarSelected ? '#700F63' : '#FFFFFF',
                                    color: isVarSelected ? '#FFFFFF' : '#45414D',
                                    transition: 'all 0.15s ease'
                                  }}
                                >
                                  {variant.name} — {formatINR(variant.price)}
                                  {variant.additionalCharge > 0 && (
                                    <span style={{ opacity: 0.85, marginLeft: '4px', fontSize: '0.7rem' }}>
                                      (+{formatINR(variant.additionalCharge)})
                                    </span>
                                  )}
                                </button>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            ))
          )}

          {/* Optional DB Add-ons */}
          {activeAddOns.length > 0 && (
            <div style={{ marginBottom: '1.5rem' }}>
              <h4
                style={{
                  fontFamily: 'var(--font-body)',
                  fontSize: '0.78rem',
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  letterSpacing: '0.08em',
                  color: '#700F63',
                  marginBottom: '0.75rem'
                }}
              >
                Optional Add-Ons
              </h4>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                {activeAddOns.map((addon) => {
                  const isChecked = selectedAddOns.some((a) => a.code === addon.code);
                  return (
                    <div
                      key={addon._id || addon.code}
                      onClick={() => toggleAddOn(addon)}
                      style={{
                        padding: '0.8rem',
                        borderRadius: 'var(--radius-lg)',
                        border: isChecked ? '1.5px solid #700F63' : '1px solid #EEE9EF',
                        background: isChecked ? '#F6EEF8' : '#FFFFFF',
                        cursor: 'pointer',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        gap: '0.5rem'
                      }}
                    >
                      <div>
                        <div style={{ fontSize: '0.83rem', fontWeight: 600, color: '#171421' }}>
                          {addon.name}
                        </div>
                        <div style={{ fontSize: '0.78rem', fontWeight: 700, color: '#700F63' }}>
                          +{formatINR(addon.price)}
                        </div>
                      </div>
                      <div
                        style={{
                          width: '18px',
                          height: '18px',
                          borderRadius: '4px',
                          border: isChecked ? 'none' : '1.5px solid #C9BFCF',
                          background: isChecked ? '#700F63' : '#FFF',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: '#FFF',
                          flexShrink: 0
                        }}
                      >
                        {isChecked && <Check size={12} />}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Special Notes */}
          <div>
            <label className="form-label" style={{ marginBottom: '0.4rem', display: 'block' }}>
              Care Instructions (Optional)
            </label>
            <textarea
              className="input-flat"
              rows={2}
              placeholder="Any specific fabric or stain instructions..."
              value={specialNotes}
              onChange={(e) => setSpecialNotes(e.target.value)}
              style={{ resize: 'none' }}
            />
          </div>
        </div>

        {/* Footer */}
        <div
          style={{
            padding: '1.25rem 1.75rem',
            borderTop: '1px solid var(--color-border)',
            background: '#FCFAFC',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '1.5rem'
          }}
        >
          <div>
            <span style={{ fontSize: '0.78rem', color: 'var(--color-muted)', display: 'block' }}>
              {totalSelectedCount} {totalSelectedCount === 1 ? 'Unit' : 'Units'} Selected
            </span>
            <span style={{ fontFamily: 'var(--font-heading)', fontSize: '1.25rem', fontWeight: 700, color: '#700F63' }}>
              {formatINR(estimatedTotal)}
            </span>
          </div>

          <button
            type="button"
            className="btn-glow-submit"
            onClick={handleConfirm}
            disabled={totalSelectedCount === 0}
            style={{ width: 'auto', padding: '0.85rem 2rem' }}
          >
            <span>Add to Basket</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ItemSelectionModal;
