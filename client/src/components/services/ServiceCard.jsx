import { useState } from 'react';
import { ArrowRight, Plus, Minus, Check, ChevronDown, ChevronUp } from 'lucide-react';
import { formatINR } from '../../utils/currency';
import { formatPricingUnit } from '../../config/services';

export const ServiceCard = ({
  category,
  service,
  cartQuantity = 0,
  onAction,
  onOpenCustomize,
  onUpdateQuantity
}) => {
  const [isDetailsExpanded, setIsDetailsExpanded] = useState(false);
  const item = category || service || {};
  const selectionMode = item.selectionMode || 'direct-unit';

  const SERVICE_IMAGES = {
    'wash-fold': '/images/services/service-wash-fold.jpg',
    'wash-iron': '/images/services/service-wash-iron.jpg',
    'dry-cleaning': '/images/services/service-dry-clean.jpg',
    'shoe-cleaning': '/images/services/service-shoe-care.jpg',
    'customized-services': '/images/services/service-customized.jpg',
    'specialty-services': '/images/services/service-specialty.jpg'
  };

  const resolvedImage =
    SERVICE_IMAGES[item.categorySlug] ||
    (item.image && !item.image.endsWith('.svg') ? item.image : null) ||
    '/images/services/service-wash-fold.jpg';

  const activeItems = Array.isArray(item.items)
    ? item.items.filter((it) => it.isActive !== false && it.isAvailable !== false)
    : [];

  const hasFixedCategoryPrice =
    selectionMode === 'direct-unit' &&
    item.price !== null &&
    item.price !== undefined &&
    typeof item.price === 'number' &&
    !Number.isNaN(item.price);

  const displayPrice = hasFixedCategoryPrice ? item.price : null;
  const displayUnit = item.pricingUnit ? formatPricingUnit(item.pricingUnit) : '';
  const hasValidPrice = hasFixedCategoryPrice;
  const featureList = Array.isArray(item.features)
    ? item.features
    : Array.isArray(item.includes)
      ? item.includes
      : null;

  const actionLabel =
    selectionMode === 'direct-unit'
      ? 'Add to Cart'
      : activeItems.length > 0
        ? `Select Items (${activeItems.length})`
        : 'View Options';

  const isDirectWithPrice = selectionMode === 'direct-unit' && hasValidPrice;
  const triggerAction = onAction || onOpenCustomize;
  const step = Number(item.quantityStep || 1);

  return (
    <article className="lw-service-card" aria-label={item.name}>
      {/* 1. Image Area */}
      <div className="lw-card-media">
        <img
          src={resolvedImage}
          alt={item.name}
          loading="lazy"
          className="lw-card-img"
        />
      </div>

      {/* 2. Content Body */}
      <div className="lw-card-body">
        <h3 className="lw-card-title">{item.name}</h3>

        {isDirectWithPrice ? (
          <div className="lw-card-pricing-zone">
            <span className="lw-price-amount">{formatINR(displayPrice)}</span>
            <span className="lw-price-unit">
              {displayUnit ? `PER ${displayUnit}` : ''}
            </span>
          </div>
        ) : (
          <div className="lw-card-pricing-spacer" aria-hidden="true">
            <span className="lw-card-title-divider" />
          </div>
        )}

        <div className={`lw-card-desc-zone ${isDetailsExpanded ? 'expanded' : ''}`}>
          <p className={`lw-card-desc ${item.description ? '' : 'is-placeholder'}`}>
            {item.description || 'Details synced from live service catalogue.'}
          </p>
        </div>

        <div className="lw-card-features-zone">
          {featureList && featureList.length > 0 ? (
            <>
              <ul className={`lw-features-list ${isDetailsExpanded ? 'expanded' : ''}`}>
                {featureList.map((feat, idx) => (
                  <li
                    key={idx}
                    className={`lw-feature-item ${idx >= 2 && !isDetailsExpanded ? 'mobile-hidden' : ''}`}
                  >
                    <Check size={14} strokeWidth={2.4} className="lw-feature-check" />
                    <span>{feat}</span>
                  </li>
                ))}
              </ul>

              {featureList.length > 2 && (
                <button
                  type="button"
                  className="lw-features-expand-btn mobile-only"
                  onClick={() => setIsDetailsExpanded(!isDetailsExpanded)}
                  aria-expanded={isDetailsExpanded}
                  aria-label={`${isDetailsExpanded ? 'Hide' : 'Show'} details for ${item.name}`}
                >
                  <span>{isDetailsExpanded ? 'Hide details' : `+ ${featureList.length - 2} more features`}</span>
                  {isDetailsExpanded ? <ChevronUp size={13} /> : <ChevronDown size={13} />}
                </button>
              )}
            </>
          ) : (
            <div className="lw-features-placeholder">
              <span className="lw-placeholder-dot" aria-hidden="true" />
              <span>{activeItems.length > 0 ? `${activeItems.length} selectable items` : 'Live catalogue item'}</span>
            </div>
          )}
        </div>
      </div>

      {/* 3. Bottom Action-Button Area */}
      <div className="lw-card-footer">
        {isDirectWithPrice && cartQuantity > 0 && onUpdateQuantity ? (
          <div className="lw-qty-control" aria-label={`${item.name} quantity`}>
            <button
              type="button"
              className="lw-qty-btn"
              onClick={() => onUpdateQuantity(item, cartQuantity - step)}
              aria-label={`Decrease ${item.name} quantity`}
            >
              <Minus size={14} />
            </button>
            <span className="lw-qty-val">
              {cartQuantity} {displayUnit}
            </span>
            <button
              type="button"
              className="lw-qty-btn"
              onClick={() => onUpdateQuantity(item, cartQuantity + step)}
              aria-label={`Increase ${item.name} quantity`}
            >
              <Plus size={14} />
            </button>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => triggerAction && triggerAction(item)}
            className="lw-card-action-btn"
            aria-label={actionLabel}
          >
            <span>{actionLabel}</span>
            <ArrowRight size={15} strokeWidth={2.2} />
          </button>
        )}
      </div>

      <style>{`
        .lw-service-card {
          display: flex;
          flex-direction: column;
          background: #FFFFFF;
          border: 1px solid rgba(220, 204, 226, 0.75);
          border-radius: 22px;
          overflow: hidden;
          box-shadow: 0 4px 20px rgba(50, 15, 60, 0.04);
          transition: transform 0.3s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.3s ease, border-color 0.3s ease;
          height: 100%;
          min-width: 0;
          box-sizing: border-box;
        }
        .lw-service-card:hover {
          transform: translateY(-4px);
          border-color: rgba(112, 15, 99, 0.35);
          box-shadow: 0 12px 32px rgba(112, 15, 99, 0.1);
        }
        .lw-card-media {
          width: 100%;
          height: 195px;
          background: #FAF7FC;
          border-bottom: 1px solid rgba(220, 204, 226, 0.6);
          overflow: hidden;
          flex-shrink: 0;
          position: relative;
        }
        .lw-card-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
          transition: transform 0.5s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .lw-service-card:hover .lw-card-img {
          transform: scale(1.05);
        }
        .lw-card-body {
          padding: 1.35rem 1.25rem 0.75rem;
          display: flex;
          flex-direction: column;
          flex: 1;
          text-align: center;
        }
        .lw-card-title {
          font-family: var(--font-heading);
          font-size: 1.28rem;
          font-weight: 700;
          color: #1A1320;
          margin: 0 0 0.7rem 0;
          line-height: 1.25;
          letter-spacing: -0.01em;
          min-height: 1.55em;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .lw-card-pricing-zone {
          min-height: 54px;
          padding: 0.25rem 0 0.5rem;
          margin-bottom: 0.75rem;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 3px;
        }
        .lw-card-pricing-spacer {
          min-height: 22px;
          margin-bottom: 0.75rem;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .lw-card-title-divider {
          width: 36px;
          height: 2px;
          border-radius: 999px;
          background: rgba(112, 15, 99, 0.2);
        }
        .lw-price-amount {
          font-family: var(--font-heading);
          font-size: 1.85rem;
          font-weight: 800;
          color: #700F63;
          line-height: 1.1;
          letter-spacing: -0.02em;
        }
        .lw-price-unit {
          font-family: var(--font-body);
          font-size: 0.74rem;
          font-weight: 700;
          color: #5C5564;
          text-transform: uppercase;
          letter-spacing: 0.08em;
        }
        .lw-card-desc-zone {
          min-height: 44px;
          margin-bottom: 0.75rem;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .lw-card-desc {
          font-family: var(--font-body);
          font-size: 0.85rem;
          color: #45414D;
          line-height: 1.48;
          margin: 0;
        }
        .lw-card-desc.is-placeholder {
          color: #77717D;
        }
        .lw-card-features-zone {
          flex: 1;
          min-height: 52px;
          border-top: 1px solid rgba(220, 204, 226, 0.6);
          padding-top: 0.75rem;
          display: flex;
          flex-direction: column;
          justify-content: flex-start;
        }
        .lw-features-list {
          list-style: none;
          margin: 0;
          padding: 0;
          display: flex;
          flex-direction: column;
          gap: 0.4rem;
          text-align: left;
        }
        .lw-feature-item {
          display: flex;
          align-items: flex-start;
          gap: 0.45rem;
          font-family: var(--font-body);
          font-size: 0.82rem;
          color: #45414D;
          line-height: 1.35;
        }
        .lw-feature-check {
          color: #700F63;
          flex-shrink: 0;
          margin-top: 2px;
        }
        .lw-features-placeholder {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 0.45rem;
          font-family: var(--font-body);
          font-size: 0.78rem;
          color: #77717D;
          margin: auto 0;
        }
        .lw-placeholder-dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: #700F63;
          opacity: 0.6;
          flex-shrink: 0;
        }
        .lw-features-expand-btn {
          margin-top: 0.5rem;
          background: none;
          border: none;
          padding: 0.25rem 0;
          color: #700F63;
          font-family: var(--font-body);
          font-size: 0.76rem;
          font-weight: 600;
          display: inline-flex;
          align-items: center;
          gap: 4px;
          cursor: pointer;
        }
        .lw-card-footer {
          padding: 0.9rem 1.25rem 1.3rem;
          background: #FFFFFF;
        }
        .lw-card-action-btn {
          width: 100%;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 0.45rem;
          padding: 0.78rem 1.15rem;
          border-radius: 9999px;
          background: #700F63;
          color: #FFFFFF;
          border: 1px solid transparent;
          font-family: var(--font-body);
          font-size: 0.88rem;
          font-weight: 600;
          cursor: pointer;
          box-shadow: 0 4px 14px rgba(112, 15, 99, 0.22);
          transition: all 0.2s ease;
        }
        .lw-card-action-btn:hover {
          background: #590A4E;
          transform: translateY(-1px);
          box-shadow: 0 6px 18px rgba(112, 15, 99, 0.3);
        }
        .lw-qty-control {
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: space-between;
          background: #FAF7FC;
          border: 1px solid rgba(112, 15, 99, 0.25);
          border-radius: 9999px;
          padding: 4px 8px;
        }
        .lw-qty-btn {
          width: 30px;
          height: 30px;
          border-radius: 50%;
          background: #FFFFFF;
          color: #700F63;
          border: 1px solid rgba(220, 204, 226, 0.75);
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.15s ease;
        }
        .lw-qty-btn:hover {
          background: #700F63;
          color: #FFFFFF;
        }
        .lw-qty-val {
          font-family: var(--font-body);
          font-size: 0.92rem;
          font-weight: 700;
          color: #1A1320;
        }

        .mobile-only {
          display: none;
        }

        /* Responsive Mobile Styles */
        @media (max-width: 768px) {
          .lw-card-media {
            height: 155px;
          }
          .lw-card-body {
            padding: 1.1rem 1rem 0.65rem;
          }
          .lw-card-title {
            font-size: 1.18rem;
            margin-bottom: 0.45rem;
            min-height: auto;
          }
          .lw-card-pricing-zone {
            min-height: auto;
            padding: 0.15rem 0 0.35rem;
            margin-bottom: 0.5rem;
          }
          .lw-price-amount {
            font-size: 1.6rem;
          }
          .lw-card-desc-zone:not(.expanded) {
            min-height: auto;
            margin-bottom: 0.5rem;
          }
          .lw-card-desc-zone:not(.expanded) .lw-card-desc {
            display: -webkit-box;
            -webkit-line-clamp: 2;
            -webkit-box-orient: vertical;
            overflow: hidden;
            font-size: 0.8rem;
          }
          .mobile-only {
            display: inline-flex;
          }
          .lw-feature-item.mobile-hidden {
            display: none;
          }
          .lw-card-footer {
            padding: 0.75rem 1rem 1.15rem;
          }
          .lw-card-action-btn {
            padding: 0.7rem 1rem;
            font-size: 0.85rem;
          }
        }
      `}</style>
    </article>
  );
};

export default ServiceCard;
