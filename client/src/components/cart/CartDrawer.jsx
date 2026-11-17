import { useEffect } from 'react';
import { X, ShoppingBag, ArrowRight, Sparkles, ShieldCheck, Truck } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { formatINR } from '../../utils/currency';
import CartItem from './CartItem';
import { Link } from 'react-router-dom';

export const CartDrawer = ({ onProceedToCheckout }) => {
  const {
    isCartOpen,
    closeCart,
    cartItems,
    itemCount,
    subtotal,
    deliveryFee,
    gst,
    total,
    pricingSettings,
    freeDeliveryThreshold,
    updateQuantity,
    removeFromCart,
    clearCart
  } = useCart();

  useEffect(() => {
    if (isCartOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isCartOpen]);

  if (!isCartOpen) return null;

  const amountToFreeDelivery = Math.max(0, freeDeliveryThreshold - subtotal);
  const freeDeliveryProgress = Math.min(100, Math.round((subtotal / freeDeliveryThreshold) * 100));

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 1000,
        background: 'rgba(23, 18, 27, 0.65)',
        backdropFilter: 'blur(5px)',
        display: 'flex',
        justifyContent: 'flex-end',
        animation: 'fadeIn 0.2s ease-out'
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) closeCart();
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: '460px',
          height: '100%',
          background: '#FFFFFF',
          display: 'flex',
          flexDirection: 'column',
          boxShadow: '-10px 0 35px rgba(0, 0, 0, 0.25)',
          position: 'relative',
          animation: 'slideInRight 0.25s ease-out'
        }}
      >
        {/* Drawer Header */}
        <div
          style={{
            padding: '1.25rem 1.5rem',
            borderBottom: '1px solid var(--color-border)',
            background: '#FFFFFF',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
            <div className="card-icon-badge-pink" style={{ width: '38px', height: '38px', minWidth: '38px' }}>
              <ShoppingBag size={18} />
            </div>
            <div>
              <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.05rem', margin: 0 }}>
                Laundry Basket
              </h3>
              <p style={{ fontSize: '0.78rem', color: 'var(--color-muted)', margin: 0 }}>
                {itemCount} {itemCount === 1 ? 'item' : 'items'} in basket
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            {cartItems.length > 0 && (
              <button
                type="button"
                onClick={clearCart}
                title="Clear all items"
                style={{
                  background: 'none',
                  border: 'none',
                  fontSize: '0.78rem',
                  color: 'var(--color-muted)',
                  cursor: 'pointer',
                  padding: '4px 8px',
                  borderRadius: 'var(--radius-sm)'
                }}
                onMouseEnter={(e) => (e.currentTarget.style.color = '#EF4444')}
                onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--color-muted)')}
              >
                Clear
              </button>
            )}

            <button
              type="button"
              className="btn-neu-icon"
              onClick={closeCart}
              aria-label="Close cart drawer"
              style={{ width: '36px', height: '36px' }}
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Doorstep Pickup & Delivery Banner */}
        {cartItems.length > 0 && (
          <div
            style={{
              padding: '0.75rem 1.25rem',
              background: '#FAF2FB',
              borderBottom: '1px solid var(--color-border)',
              display: 'flex',
              alignItems: 'center',
              gap: '0.65rem'
            }}
          >
            <div
              style={{
                width: '28px',
                height: '28px',
                borderRadius: '50%',
                background: 'rgba(112, 15, 99, 0.1)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#700F63',
                flexShrink: 0
              }}
            >
              <Truck size={14} />
            </div>
            <span style={{ fontSize: '0.8rem', color: '#45414D', fontWeight: 600 }}>
              Convenient Doorstep Pickup &amp; Delivery Available Across Mysore
            </span>
          </div>
        )}

        {/* Items Scroll List */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '1.25rem' }}>
          {cartItems.length === 0 ? (
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                height: '100%',
                textAlign: 'center',
                padding: '2rem 1rem'
              }}
            >
              <div
                className="card-feature-neu"
                style={{
                  width: '90px',
                  height: '90px',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '1.25rem'
                }}
              >
                <ShoppingBag size={40} color="var(--color-pink)" />
              </div>
              <h4 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.1rem', marginBottom: '0.4rem' }}>
                Your Basket is Empty
              </h4>
              <p style={{ fontSize: '0.88rem', color: 'var(--color-muted)', maxWidth: '280px', marginBottom: '1.5rem' }}>
                Explore our dry cleaning, steam ironing, and wash packages to schedule a quick pickup.
              </p>
              <Link
                to="/services"
                onClick={closeCart}
                className="btn-pill-primary"
              >
                <Sparkles size={16} />
                <span>Explore Services</span>
              </Link>
            </div>
          ) : (
            <div>
              {cartItems.map((item) => (
                <CartItem
                  key={item.key}
                  item={item}
                  onUpdateQuantity={updateQuantity}
                  onRemove={removeFromCart}
                />
              ))}
            </div>
          )}
        </div>

        {/* Bottom Checkout Section */}
        {cartItems.length > 0 && (
          <div
            style={{
              padding: '1.25rem 1.5rem',
              background: '#FFFFFF',
              borderTop: '1px solid var(--color-border)',
              boxShadow: '0 -4px 15px rgba(0,0,0,0.04)'
            }}
          >
            {/* Price Calculations */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.45rem', marginBottom: '1rem', fontSize: '0.88rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--color-muted)' }}>
                <span>Basket Subtotal</span>
                <span style={{ fontWeight: 600, color: 'var(--color-dark)' }}>{formatINR(subtotal)}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--color-muted)' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                  <Truck size={14} /> Doorstep Pickup & Delivery
                </span>
                <span style={{ fontWeight: 600, color: 'var(--color-dark)' }}>
                  {deliveryFee === 0 ? 'Included' : formatINR(deliveryFee)}
                </span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--color-muted)' }}>
                <span>GST ({pricingSettings?.gstPercentage ?? 0}% Fabric Care)</span>
                <span style={{ fontWeight: 600, color: 'var(--color-dark)' }}>{formatINR(gst)}</span>
              </div>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  paddingTop: '0.65rem',
                  marginTop: '0.35rem',
                  borderTop: '1px dashed var(--color-border)',
                  fontSize: '1.1rem'
                }}
              >
                <span style={{ fontFamily: 'var(--font-heading)', fontWeight: 700 }}>Estimated Total</span>
                <span style={{ fontFamily: 'var(--font-heading)', fontWeight: 700, color: 'var(--color-purple)' }}>
                  {formatINR(total)}
                </span>
              </div>
            </div>

            {/* Checkout Action Button */}
            <button
              type="button"
              className="btn-glow-submit"
              onClick={() => {
                closeCart();
                if (onProceedToCheckout) {
                  onProceedToCheckout();
                }
              }}
              style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.65rem' }}
            >
              <span>Schedule Pickup & Checkout</span>
              <ArrowRight size={18} />
            </button>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem', marginTop: '0.75rem', fontSize: '0.75rem', color: 'var(--color-muted)' }}>
              <ShieldCheck size={14} color="#10B981" />
              <span>100% Hygienic Guarantee • Cash on Delivery (COD)</span>
            </div>
          </div>
        )}
      </div>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slideInRight {
          from { transform: translateX(100%); }
          to { transform: translateX(0); }
        }
      `}</style>
    </div>
  );
};

export default CartDrawer;

