import { useState, useEffect, useCallback, useRef } from 'react';
import { useOutletContext, useLocation } from 'react-router-dom';
import { servicesApi } from '../services/api';
import { formatPricingUnit } from '../config/services';
import ServiceCard from '../components/services/ServiceCard';
import ItemSelectionModal from '../components/services/ItemSelectionModal';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { useCart } from '../context/CartContext';
import { formatINR } from '../utils/currency';
import {
  ShoppingBag,
  Plus,
  Minus,
  Trash2,
  ArrowRight,
  ShieldCheck,
  Sparkles,
  RefreshCw,
  AlertCircle
} from 'lucide-react';

export const ServicesPage = () => {
  const { openCheckout } = useOutletContext() || {};
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState('');
  const [activeModalService, setActiveModalService] = useState(null);

  const location = useLocation();
  const carouselTrackRef = useRef(null);
  const [activeCarouselIndex, setActiveCarouselIndex] = useState(0);

  const handleCarouselScroll = useCallback(() => {
    const el = carouselTrackRef.current;
    if (!el) return;
    const scrollLeft = el.scrollLeft;
    const firstCard = el.querySelector('.services-grid-slot');
    if (!firstCard) return;
    const cardWidth = firstCard.getBoundingClientRect().width;
    const gap = 16;
    const index = Math.round(scrollLeft / (cardWidth + gap));
    setActiveCarouselIndex(Math.min(categories.length - 1, Math.max(0, index)));
  }, [categories.length]);

  const scrollToCarouselCard = useCallback((idx) => {
    const el = carouselTrackRef.current;
    if (!el) return;
    const cards = el.querySelectorAll('.services-grid-slot');
    if (cards[idx]) {
      cards[idx].scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'start' });
      setActiveCarouselIndex(idx);
    }
  }, []);

  const scrollToHashTarget = useCallback(
    (targetSlug) => {
      if (!targetSlug) return false;
      const cleanSlug = targetSlug.replace(/^#/, '').trim();
      if (!cleanSlug) return false;

      const element = document.getElementById(cleanSlug);
      if (element) {
        const headerOffset = 96;
        const elementPosition = element.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
        window.scrollTo({
          top: Math.max(0, offsetPosition),
          behavior: 'smooth'
        });

        if (carouselTrackRef.current && Array.isArray(categories)) {
          const catIdx = categories.findIndex(
            (c) => (c.categorySlug || c.slug) === cleanSlug
          );
          if (catIdx !== -1) {
            scrollToCarouselCard(catIdx);
          }
        }
        return true;
      }
      return false;
    },
    [categories, scrollToCarouselCard]
  );

  // Hash target scroll effect (handles cross-page entry and in-page hash changes)
  useEffect(() => {
    if (!location.hash) return;
    const cleanSlug = location.hash.replace(/^#/, '').trim();
    if (isLoading) return;

    const timer = setTimeout(() => {
      scrollToHashTarget(cleanSlug);
    }, 80);

    return () => clearTimeout(timer);
  }, [location.hash, isLoading, categories, scrollToHashTarget]);

  // In-page hash navigation event listener (handles repeated clicks on footer quick links)
  useEffect(() => {
    const handleCustomNav = (e) => {
      if (e.detail?.slug) {
        scrollToHashTarget(e.detail.slug);
      }
    };
    window.addEventListener('service-hash-navigate', handleCustomNav);
    return () => window.removeEventListener('service-hash-navigate', handleCustomNav);
  }, [scrollToHashTarget]);

  const {
    cartItems,
    addToCart,
    addMultipleToCart,
    updateQuantity,
    removeFromCart,
    itemCount,
    subtotal,
    deliveryFee,
    gst,
    total,
    pricingSettings,
    isVerifyingQuote,
    quoteError,
    clearCart
  } = useCart();

  const fetchCatalogue = useCallback(async () => {
    setIsLoading(true);
    setLoadError('');
    try {
      const data = await servicesApi.getAll();
      setCategories(Array.isArray(data) ? data : []);
    } catch (err) {
      setLoadError(err.message || 'Unable to load services catalogue. Please try again.');
      setCategories([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    let active = true;
    servicesApi
      .getAll()
      .then((data) => {
        if (active) {
          setCategories(Array.isArray(data) ? data : []);
          setLoadError('');
        }
      })
      .catch((err) => {
        if (active) {
          setLoadError(err.message || 'Unable to load services catalogue. Please try again.');
          setCategories([]);
        }
      })
      .finally(() => {
        if (active) setIsLoading(false);
      });
    return () => {
      active = false;
    };
  }, []);

  const getDirectCartItem = (category) =>
    cartItems.find(
      (it) => it.categorySlug === category.categorySlug && !it.itemCode
    );

  const handleCategoryAction = (category) => {
    const mode = category.selectionMode || 'direct-unit';
    const hasPrice = category.price !== null && category.price !== undefined;

    if (mode === 'direct-unit' && hasPrice) {
      addToCart(
        {
          id: category.categorySlug,
          serviceId: category._id,
          categorySlug: category.categorySlug,
          serviceName: category.name,
          name: category.name,
          category: category.categorySlug,
          price: category.price,
          unit: formatPricingUnit(category.pricingUnit || 'kg'),
          minQuantity: Number(category.minQuantity || 1),
          quantityStep: Number(category.quantityStep || 1),
          turnaround: category.turnaroundHours ? `${category.turnaroundHours} Hours` : '48 Hours'
        },
        {},
        Number(category.minQuantity || 1)
      );
      return;
    }

    setActiveModalService(category);
  };

  const handleDirectCardQuantity = (category, nextQty) => {
    const existing = getDirectCartItem(category);
    if (!existing) return;
    if (nextQty < Number(category.minQuantity || 1)) {
      removeFromCart(existing.key);
    } else {
      updateQuantity(existing.key, nextQty, true);
    }
  };

  return (
    <div className="services-page-root">
      {/* ============================================================ */}
      {/* 1. SERVICES HERO & FIVE CATEGORY SHOWCASE                    */}
      {/* ============================================================ */}
      <section className="services-hero-section">
        <div className="container services-container-wide">
          <div className="services-header-content">
            <div className="section-label-wrapper">
              <span className="label-line" />
              <span className="section-label-text">OUR SERVICES</span>
              <span className="label-line" />
            </div>

            <h1 className="services-main-heading">
              Complete Care for <em>Your Clothes.</em>
            </h1>

            <p className="services-subheading">
              Explore our five core garment care categories crafted with hygienic individual-drum washing, gentle detergents, and doorstep convenience.
            </p>
          </div>

          {/* Dynamic Database-Driven Categories Grid */}
          {isLoading ? (
            <div style={{ padding: '2.5rem 0' }}>
              <LoadingSpinner text="Loading live service catalogue..." />
            </div>
          ) : loadError ? (
            <div className="services-status-notice" role="alert" style={{ flexDirection: 'column', gap: '0.85rem', padding: '1.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#B91C1C', fontWeight: 600 }}>
                <AlertCircle size={18} />
                <span>{loadError}</span>
              </div>
              <button
                type="button"
                onClick={fetchCatalogue}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.45rem',
                  padding: '0.55rem 1.25rem',
                  borderRadius: '9999px',
                  border: 'none',
                  background: '#700F63',
                  color: '#FFFFFF',
                  fontWeight: 600,
                  fontSize: '0.85rem',
                  cursor: 'pointer'
                }}
              >
                <RefreshCw size={14} />
                <span>Retry</span>
              </button>
            </div>
          ) : categories.length === 0 ? (
            <div className="services-status-notice" role="status" style={{ padding: '1.5rem' }}>
              <span>No active services are currently available. Please check back shortly.</span>
            </div>
          ) : (
            <div className="services-showcase-wrapper">
              {/* Mobile Swipe Guidance Banner */}
              <div className="services-mobile-swipe-instruction" aria-hidden="true">
                <span>Swipe to explore more services</span>
                <ArrowRight size={14} className="swipe-arrow-anim" />
              </div>

              <div
                ref={carouselTrackRef}
                className="services-five-grid"
                onScroll={handleCarouselScroll}
                role="region"
                aria-label="Services carousel"
              >
                {categories.map((category) => {
                  const directCartItem = getDirectCartItem(category);
                  const slug = category.categorySlug || category.slug;
                  return (
                    <div
                      key={category._id || slug}
                      id={slug}
                      className="services-grid-slot"
                    >
                      <ServiceCard
                        category={category}
                        cartQuantity={directCartItem ? directCartItem.quantity : 0}
                        onAction={handleCategoryAction}
                        onUpdateQuantity={handleDirectCardQuantity}
                      />
                    </div>
                  );
                })}
              </div>

              {/* Mobile Carousel Pagination Indicators */}
              {categories.length > 1 && (
                <div className="services-carousel-pagination" aria-label="Services navigation dots">
                  {categories.map((cat, idx) => (
                    <button
                      key={cat._id || cat.categorySlug || idx}
                      type="button"
                      className={`services-carousel-dot ${idx === activeCarouselIndex ? 'active' : ''}`}
                      onClick={() => scrollToCarouselCard(idx)}
                      aria-label={`Go to ${cat.name || 'service'} (slide ${idx + 1} of ${categories.length})`}
                    />
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </section>

      {/* ============================================================ */}
      {/* 2. SHOPPING CART / LAUNDRY BASKET (PRESERVED)                */}
      {/* ============================================================ */}
      <section id="shopping-cart-section" className="services-cart-section">
        <div className="container" style={{ maxWidth: '960px' }}>
          <div className="cart-section-header">
            <div className="section-label-wrapper">
              <span className="label-line" />
              <span className="section-label-text">YOUR SELECTION</span>
              <span className="label-line" />
            </div>
            <h2 className="cart-main-heading">
              Your Laundry <em>Basket.</em>
            </h2>
            <p className="cart-subheading">
              Review selected services, adjust quantities, and proceed to book your doorstep pickup.
            </p>
          </div>

          {cartItems.length === 0 ? (
            <div className="cart-empty-card">
              <div className="empty-cart-icon-wrap">
                <ShoppingBag size={28} />
              </div>
              <h3 className="empty-cart-title">Your basket is currently empty</h3>
              <p className="empty-cart-desc">
                Select a service category above once live rates are loaded to begin your order.
              </p>
            </div>
          ) : (
            <div className="cart-active-card">
              <div className="cart-top-bar">
                <div className="cart-count-badge">
                  <Sparkles size={14} />
                  <span>
                    {itemCount} {itemCount === 1 ? 'Service Selected' : 'Services Selected'}
                  </span>
                </div>

                <button
                  type="button"
                  onClick={clearCart}
                  className="cart-clear-btn"
                >
                  Clear All
                </button>
              </div>

              <div className="cart-items-list">
                {cartItems.map((item) => (
                  <div key={item.key} className="cart-item-row">
                    <div className="cart-item-info">
                      <h4 className="cart-item-name">{item.name}</h4>
                      <div className="cart-item-meta">
                        <span>{formatINR(item.unitPrice)} / {item.unit}</span>
                        {item.options?.fragrance && <span> • {item.options.fragrance}</span>}
                        {item.options?.speed === 'express' && <span className="meta-express"> • Express 24h</span>}
                      </div>
                    </div>

                    <div className="cart-item-actions">
                      <div className="cart-qty-pill">
                        <button
                          type="button"
                          onClick={() => updateQuantity(item.key, -1)}
                          className="qty-btn"
                          aria-label="Decrease quantity"
                        >
                          <Minus size={13} />
                        </button>
                        <span className="qty-number">{item.quantity}</span>
                        <button
                          type="button"
                          onClick={() => updateQuantity(item.key, 1)}
                          className="qty-btn"
                          aria-label="Increase quantity"
                        >
                          <Plus size={13} />
                        </button>
                      </div>

                      <span className="cart-item-total">
                        {formatINR(item.unitPrice * item.quantity)}
                      </span>

                      <button
                        type="button"
                        onClick={() => removeFromCart(item.key)}
                        title="Remove item"
                        className="cart-remove-btn"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <div className="cart-summary-box">
                {isVerifyingQuote && (
                  <div style={{ fontSize: '0.8rem', color: '#700F63', marginBottom: '0.5rem', fontWeight: 600 }}>
                    Verifying live prices with server...
                  </div>
                )}
                {quoteError && (
                  <div style={{ fontSize: '0.8rem', color: '#B91C1C', marginBottom: '0.5rem', fontWeight: 600 }}>
                    {quoteError}
                  </div>
                )}
                <div className="summary-row">
                  <span className="summary-label">Subtotal:</span>
                  <span className="summary-val">{formatINR(subtotal)}</span>
                </div>

                <div className="summary-row">
                  <span className="summary-label">Doorstep Pickup & Delivery:</span>
                  <span className="summary-val">
                    {deliveryFee === 0 ? 'Included' : formatINR(deliveryFee)}
                  </span>
                </div>

                <div className="summary-row">
                  <span className="summary-label">Applicable GST ({pricingSettings?.gstPercentage ?? 0}%):</span>
                  <span className="summary-val">{formatINR(gst)}</span>
                </div>

                <div className="summary-row summary-row-total">
                  <span className="summary-total-label">Total Payable:</span>
                  <span className="summary-total-val">{formatINR(total)}</span>
                </div>
              </div>

              <div className="cart-cta-wrapper">
                <button
                  type="button"
                  className="btn-checkout-primary"
                  onClick={openCheckout}
                >
                  <span>Proceed to Book Pickup</span>
                  <ArrowRight size={18} />
                </button>

                <div className="checkout-trust-badge">
                  <ShieldCheck size={16} className="trust-icon" />
                  <span>Doorstep Collection in Mysore • Cash on Delivery (COD)</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Database-Driven Item & Variant Selection Modal */}
      <ItemSelectionModal
        key={activeModalService?._id || 'closed'}
        isOpen={Boolean(activeModalService)}
        onClose={() => setActiveModalService(null)}
        service={activeModalService}
        onAddItems={addMultipleToCart}
      />

      <style>{`
        .services-page-root {
          background-color: #FFFFFF;
          min-height: 100vh;
          position: relative;
          overflow-x: hidden;
        }

        .services-container-wide {
          max-width: 1320px;
        }

        /* Hero Section */
        .services-hero-section {
          padding-top: calc(var(--header-height, 84px) + 2.5rem);
          padding-bottom: 5rem;
          background: #FAF7FC;
          position: relative;
          z-index: 2;
        }

        .services-header-content {
          text-align: center;
          max-width: 740px;
          margin: 0 auto 3.25rem;
        }

        .section-label-wrapper {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 0.75rem;
          margin-bottom: 0.85rem;
        }

        .label-line {
          width: 24px;
          height: 2px;
          background-color: #700F63;
        }

        .section-label-text {
          font-family: var(--font-body);
          font-size: 0.8rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.12em;
          color: #171421;
        }

        .services-main-heading {
          font-family: var(--font-heading);
          font-style: italic;
          font-size: clamp(2.3rem, 4.6vw, 3.5rem);
          font-weight: 700;
          color: #171421;
          line-height: 1.15;
          margin-bottom: 1rem;
          letter-spacing: -0.02em;
        }

        .services-main-heading em {
          font-family: var(--font-serif);
          font-style: italic;
          font-weight: 700;
          color: #700F63;
        }

        .services-subheading {
          font-family: var(--font-body);
          font-size: 1.04rem;
          color: #45414D;
          line-height: 1.7;
          margin: 0 auto;
          max-width: 600px;
        }

        /* 5-Card Horizontal Showcase */
        .services-showcase-wrapper {
          position: relative;
          display: flex;
          align-items: center;
        }

        .services-five-grid {
          width: 100%;
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
          gap: 1.25rem;
          align-items: stretch;
        }

        .services-grid-slot {
          display: flex;
          flex-direction: column;
          min-width: 0;
          scroll-margin-top: 96px;
        }

        .showcase-nav-btn {
          display: none;
          position: absolute;
          top: 50%;
          transform: translateY(-50%);
          width: 40px;
          height: 40px;
          border-radius: 50%;
          background: #FFFFFF;
          border: 1px solid #EEE9EF;
          color: #700F63;
          box-shadow: 0 4px 14px rgba(23, 20, 33, 0.08);
          align-items: center;
          justify-content: center;
          cursor: pointer;
          z-index: 10;
          transition: all 0.2s ease;
        }

        .showcase-nav-btn:hover {
          background: #FAF7FC;
          border-color: #700F63;
        }

        .nav-left {
          left: -14px;
        }

        .nav-right {
          right: -14px;
        }

        /* Status Notice Banner */
        .services-status-notice {
          max-width: 680px;
          margin: 2rem auto 0;
          padding: 0.9rem 1.35rem;
          background: #FAF7FC;
          border: 1px solid #EEE9EF;
          border-radius: 16px;
          color: #700F63;
          font-family: var(--font-body);
          font-size: 0.88rem;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.65rem;
          text-align: center;
        }

        .notice-info-icon {
          color: #700F63;
          flex-shrink: 0;
        }

        /* Cart Section */
        .services-cart-section {
          padding: 4.5rem 0 6.5rem;
          background: #FAF7FC;
          border-top: 1px solid rgba(220, 204, 226, 0.6);
          position: relative;
          z-index: 2;
        }

        .cart-section-header {
          text-align: center;
          margin-bottom: 2.75rem;
        }

        .cart-main-heading {
          font-family: var(--font-heading);
          font-style: italic;
          font-size: clamp(2rem, 3.8vw, 2.75rem);
          font-weight: 700;
          color: #171421;
          margin-bottom: 0.5rem;
        }

        .cart-main-heading em {
          font-family: var(--font-serif);
          font-style: italic;
          font-weight: 700;
          color: #700F63;
        }

        .cart-subheading {
          font-family: var(--font-body);
          font-size: 1rem;
          color: #45414D;
        }

        .cart-empty-card {
          background: #FFFFFF;
          border: 1px solid #EEE9EF;
          border-radius: 28px;
          padding: 3.5rem 2rem;
          text-align: center;
          box-shadow: 0 6px 24px rgba(23, 20, 33, 0.045);
        }

        .empty-cart-icon-wrap {
          width: 64px;
          height: 64px;
          border-radius: 50%;
          background: #FAF7FC;
          color: #700F63;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 1.25rem;
        }

        .empty-cart-title {
          font-family: var(--font-heading);
          font-size: 1.35rem;
          color: #171421;
          margin-bottom: 0.5rem;
        }

        .empty-cart-desc {
          font-family: var(--font-body);
          color: #77717D;
          font-size: 0.95rem;
          max-width: 440px;
          margin: 0 auto;
        }

        .cart-active-card {
          background: #FFFFFF;
          border: 1px solid #EEE9EF;
          border-radius: 28px;
          padding: 2.5rem;
          box-shadow: 0 6px 24px rgba(23, 20, 33, 0.05);
        }

        .cart-top-bar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding-bottom: 1.5rem;
          border-bottom: 1px solid #EEE9EF;
          margin-bottom: 1.75rem;
        }

        .cart-count-badge {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          background: #FAF7FC;
          color: #700F63;
          font-family: var(--font-body);
          font-size: 0.85rem;
          font-weight: 700;
          padding: 6px 14px;
          border-radius: 9999px;
        }

        .cart-clear-btn {
          background: none;
          border: none;
          font-family: var(--font-body);
          font-size: 0.85rem;
          color: #77717D;
          cursor: pointer;
          text-decoration: underline;
        }

        .cart-clear-btn:hover {
          color: #700F63;
        }

        .cart-items-list {
          display: flex;
          flex-direction: column;
          gap: 1.25rem;
          margin-bottom: 2rem;
        }

        .cart-item-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 1rem;
          padding: 1.25rem 1.5rem;
          background: #FCFAFC;
          border-radius: 20px;
          border: 1px solid #EEE9EF;
        }

        .cart-item-name {
          font-family: var(--font-heading);
          font-size: 1.15rem;
          color: #171421;
          margin-bottom: 0.2rem;
        }

        .cart-item-meta {
          font-family: var(--font-body);
          font-size: 0.85rem;
          color: #77717D;
        }

        .meta-express {
          color: #700F63;
          font-weight: 600;
        }

        .cart-item-actions {
          display: flex;
          align-items: center;
          gap: 1rem;
        }

        .cart-qty-pill {
          display: flex;
          align-items: center;
          gap: 0.4rem;
          background: #FFFFFF;
          padding: 4px 8px;
          border-radius: 9999px;
          border: 1px solid #EEE9EF;
          box-shadow: 0 2px 6px rgba(23, 20, 33, 0.04);
        }

        .qty-btn {
          width: 28px;
          height: 28px;
          border-radius: 50%;
          background: transparent;
          border: none;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          color: #171421;
        }

        .qty-btn:hover {
          background: #FAF7FC;
          color: #700F63;
        }

        .qty-number {
          min-width: 22px;
          text-align: center;
          font-family: var(--font-body);
          font-weight: 700;
          font-size: 0.92rem;
          color: #171421;
        }

        .cart-item-total {
          font-family: var(--font-heading);
          font-size: 1.15rem;
          font-weight: 700;
          color: #171421;
          min-width: 70px;
          text-align: right;
        }

        .cart-remove-btn {
          background: none;
          border: none;
          color: #77717D;
          cursor: pointer;
          padding: 6px;
          border-radius: 6px;
          display: flex;
          align-items: center;
        }

        .cart-remove-btn:hover {
          color: #700F63;
        }

        .cart-summary-box {
          background: #FCFAFC;
          border-radius: 20px;
          padding: 1.75rem;
          border: 1px solid #EEE9EF;
          margin-bottom: 2rem;
        }

        .summary-row {
          display: flex;
          justify-content: space-between;
          font-family: var(--font-body);
          font-size: 0.95rem;
          margin-bottom: 0.65rem;
        }

        .summary-label {
          color: #77717D;
        }

        .summary-val {
          color: #171421;
          font-weight: 600;
        }

        .text-free {
          color: #059669;
          font-weight: 700;
        }

        .summary-row-total {
          margin-top: 1rem;
          padding-top: 1rem;
          border-top: 1px dashed #EEE9EF;
          font-size: 1.25rem;
          margin-bottom: 0;
        }

        .summary-total-label {
          font-family: var(--font-heading);
          font-weight: 700;
          color: #171421;
        }

        .summary-total-val {
          font-family: var(--font-heading);
          font-weight: 700;
          color: #700F63;
        }

        .cart-cta-wrapper {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 1rem;
        }

        .btn-checkout-primary {
          width: 100%;
          max-width: 420px;
          padding: 0.95rem 2rem;
          font-family: var(--font-body);
          font-size: 1.05rem;
          font-weight: 600;
          background: #700F63;
          color: #FFFFFF;
          border: none;
          border-radius: 9999px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 0.6rem;
          cursor: pointer;
          transition: all 0.25s ease;
          box-shadow: 0 6px 18px rgba(133, 0, 120, 0.24);
        }

        .btn-checkout-primary:hover {
          background: #590A4E;
          transform: translateY(-2px);
          box-shadow: 0 10px 24px rgba(133, 0, 120, 0.32);
        }

        .checkout-trust-badge {
          display: flex;
          align-items: center;
          gap: 6px;
          font-family: var(--font-body);
          font-size: 0.82rem;
          color: #77717D;
        }

        .trust-icon {
          color: #700F63;
        }

        /* Swipe Guidance & Carousel Indicators */
        .services-mobile-swipe-instruction,
        .services-carousel-pagination {
          display: none;
        }

        /* Responsive Layout Breakpoints */
        @media (min-width: 641px) and (max-width: 1024px) {
          .services-five-grid {
            display: grid;
            grid-template-columns: repeat(2, minmax(0, 1fr));
            gap: 1.25rem;
          }
          .services-mobile-swipe-instruction,
          .services-carousel-pagination {
            display: none !important;
          }
        }

        @media (max-width: 640px) {
          .services-showcase-wrapper {
            display: flex;
            flex-direction: column;
            width: 100%;
            position: relative;
          }

          .services-mobile-swipe-instruction {
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 6px;
            font-family: var(--font-body);
            font-size: 0.8rem;
            font-weight: 600;
            color: #700F63;
            margin-bottom: 0.85rem;
            user-select: none;
          }

          .swipe-arrow-anim {
            animation: bounceArrow 1.5s ease-in-out infinite;
          }

          @keyframes bounceArrow {
            0%, 100% { transform: translateX(0); }
            50% { transform: translateX(4px); }
          }

          /* Single Horizontal Row with Touch Swipe on Mobile */
          .services-five-grid {
            display: flex !important;
            flex-direction: row !important;
            flex-wrap: nowrap !important;
            overflow-x: auto !important;
            overflow-y: hidden !important;
            scroll-snap-type: x mandatory;
            scroll-behavior: smooth;
            -webkit-overflow-scrolling: touch;
            overscroll-behavior-x: contain;
            gap: 0.85rem;
            padding: 0.35rem 1rem 1rem 1rem;
            margin: 0 -1rem;
            scrollbar-width: none;
            -ms-overflow-style: none;
          }
          .services-five-grid::-webkit-scrollbar {
            display: none;
          }

          /* Display ~1 complete card and 20-25% peek of next card */
          .services-grid-slot {
            flex: 0 0 76vw !important;
            max-width: 320px;
            min-width: 0 !important;
            scroll-snap-align: start;
            scroll-snap-stop: normal;
          }

          /* Ensure final card is completely accessible and not clipped */
          .services-grid-slot:last-child {
            margin-right: 1rem;
          }

          /* Pagination dots */
          .services-carousel-pagination {
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 8px;
            margin-top: 1rem;
          }

          .services-carousel-dot {
            height: 8px;
            width: 8px;
            border-radius: 9999px;
            background: rgba(112, 15, 99, 0.22);
            border: none;
            padding: 0;
            cursor: pointer;
            transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1);
          }

          .services-carousel-dot.active {
            width: 24px;
            background: #700F63;
            box-shadow: 0 2px 6px rgba(112, 15, 99, 0.28);
          }

          .cart-active-card {
            padding: 1.5rem;
          }
          .cart-item-row {
            flex-direction: column;
            align-items: flex-start;
          }
          .cart-item-actions {
            width: 100%;
            justify-content: space-between;
          }
        }
      `}</style>
    </div>
  );
};

export default ServicesPage;
