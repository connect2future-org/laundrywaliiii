import React from 'react';
import { Plus, Minus, Trash2, Tag, Shirt, Sparkles, Footprints, Layers, Home, Zap } from 'lucide-react';
import { formatINR } from '../../utils/currency';

const getServiceIcon = (iconName) => {
  switch (iconName) {
    case 'Shirt':
      return Shirt;
    case 'Sparkles':
      return Sparkles;
    case 'Footprints':
      return Footprints;
    case 'Layers':
      return Layers;
    case 'Home':
      return Home;
    case 'Zap':
      return Zap;
    default:
      return Shirt;
  }
};

export const CartItem = ({ item, onUpdateQuantity, onRemove, onEditCustomization }) => {
  const Icon = getServiceIcon(item.iconName);

  return (
    <div
      className="card-modern-flat"
      style={{
        padding: '1.1rem',
        marginBottom: '0.85rem',
        borderRadius: 'var(--radius-lg)',
        border: '1px solid var(--color-border)'
      }}
    >
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '0.75rem' }}>
        <div style={{ display: 'flex', gap: '0.85rem', flex: 1 }}>
          <div
            className="card-icon-badge-pink"
            style={{ width: '42px', height: '42px', minWidth: '42px', minHeight: '42px' }}
          >
            <Icon size={20} />
          </div>

          <div style={{ flex: 1 }}>
            <h4
              style={{
                fontFamily: 'var(--font-heading)',
                fontSize: '0.9rem',
                color: 'var(--color-dark)',
                marginBottom: '0.2rem'
              }}
            >
              {item.name}
            </h4>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.4rem' }}>
              <span style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--color-pink)' }}>
                {formatINR(item.unitPrice)}
              </span>
              <span style={{ fontSize: '0.75rem', color: 'var(--color-muted)' }}>
                / {item.unit}
              </span>
            </div>

            {/* Customization Badges if selected */}
            {item.options && Object.keys(item.options).length > 0 && (
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem', marginTop: '0.35rem' }}>
                {item.options.fragrance && (
                  <span className="badge badge-pink" style={{ fontSize: '0.7rem' }}>
                    Scent: {item.options.fragrance}
                  </span>
                )}
                {item.options.packaging && (
                  <span className="badge badge-purple" style={{ fontSize: '0.7rem' }}>
                    {item.options.packaging === 'hanger' ? 'Hanger' : 'Fold'}
                  </span>
                )}
                {item.options.starchLevels && item.options.starchLevels !== 'none' && (
                  <span className="badge badge-yellow" style={{ fontSize: '0.7rem' }}>
                    Starch: {item.options.starchLevels}
                  </span>
                )}
                {item.options.speed === 'express' && (
                  <span className="badge badge-pink" style={{ fontSize: '0.7rem', fontWeight: 700 }}>
                    ⚡ Express 24h
                  </span>
                )}
                {item.options.addons && item.options.addons.length > 0 && (
                  <span className="badge badge-success" style={{ fontSize: '0.7rem' }}>
                    +{item.options.addons.length} Add-on(s)
                  </span>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Delete action */}
        <button
          type="button"
          onClick={() => onRemove(item.key)}
          aria-label="Remove item"
          style={{
            background: 'transparent',
            border: 'none',
            color: '#A0A0A8',
            cursor: 'pointer',
            padding: '4px',
            transition: 'color var(--transition-fast)'
          }}
          onMouseEnter={(e) => (e.currentTarget.style.color = '#EF4444')}
          onMouseLeave={(e) => (e.currentTarget.style.color = '#A0A0A8')}
        >
          <Trash2 size={16} />
        </button>
      </div>

      {/* Footer: Quantity Controls & Line Total */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginTop: '0.85rem',
          paddingTop: '0.75rem',
          borderTop: '1px dashed var(--color-border)'
        }}
      >
        {/* Quantity Controls */}
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem',
            background: 'var(--neu-bg)',
            borderRadius: 'var(--radius-pill)',
            padding: '3px 8px'
          }}
        >
          <button
            type="button"
            onClick={() => onUpdateQuantity(item.key, -1)}
            disabled={item.quantity <= 1}
            aria-label="Decrease quantity"
            style={{
              width: '26px',
              height: '26px',
              borderRadius: '50%',
              background: '#FFFFFF',
              border: 'none',
              cursor: item.quantity <= 1 ? 'not-allowed' : 'pointer',
              opacity: item.quantity <= 1 ? 0.4 : 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
            }}
          >
            <Minus size={13} />
          </button>

          <span
            style={{
              fontFamily: 'var(--font-heading)',
              fontSize: '0.85rem',
              fontWeight: 700,
              minWidth: '24px',
              textAlign: 'center'
            }}
          >
            {item.quantity}
          </span>

          <button
            type="button"
            onClick={() => onUpdateQuantity(item.key, 1)}
            aria-label="Increase quantity"
            style={{
              width: '26px',
              height: '26px',
              borderRadius: '50%',
              background: 'var(--color-pink-primary)',
              color: '#FFF',
              border: 'none',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 2px 6px rgba(245, 29, 120, 0.3)'
            }}
          >
            <Plus size={13} />
          </button>
        </div>

        {/* Item Total */}
        <div style={{ textAlign: 'right' }}>
          <span style={{ fontSize: '0.75rem', color: 'var(--color-muted)', display: 'block' }}>Total</span>
          <span style={{ fontFamily: 'var(--font-heading)', fontSize: '0.95rem', fontWeight: 700, color: 'var(--color-dark)' }}>
            {formatINR(item.unitPrice * item.quantity)}
          </span>
        </div>
      </div>
    </div>
  );
};

export default CartItem;

