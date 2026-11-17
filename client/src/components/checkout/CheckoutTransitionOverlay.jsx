import React from 'react';
import { Loader2, Sparkles, CheckCircle2 } from 'lucide-react';
import { BRAND_CONFIG } from '../../config/brand';

export const CheckoutTransitionOverlay = ({ isVisible, statusText = 'Processing your pickup request...' }) => {
  if (!isVisible) return null;

  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        zIndex: 50,
        background: 'rgba(255, 255, 255, 0.94)',
        backdropFilter: 'blur(4px)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '2rem',
        textAlign: 'center',
        borderRadius: 'inherit',
        animation: 'fadeIn 0.2s ease-out'
      }}
    >
      <div
        style={{
          width: '70px',
          height: '70px',
          borderRadius: '50%',
          background: 'var(--color-pink-soft)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: '1.25rem',
          boxShadow: 'var(--shadow-pink-glow)',
          position: 'relative'
        }}
      >
        <img
          src={BRAND_CONFIG.logo}
          alt="Laundry Waliiii"
          style={{ width: '48px', height: '48px', borderRadius: '50%' }}
        />
        <div
          style={{
            position: 'absolute',
            inset: -4,
            borderRadius: '50%',
            border: '2px dashed var(--color-pink)',
            animation: 'spin 4s linear infinite'
          }}
        />
      </div>

      <h4 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.05rem', color: 'var(--color-purple)', marginBottom: '0.5rem' }}>
        {statusText}
      </h4>

      <p style={{ fontSize: '0.82rem', color: 'var(--color-muted)', maxWidth: '320px' }}>
        Walii Ji is assigning your dedicated fabric care pilot and reserving your sanitized wash drum.
      </p>

      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default CheckoutTransitionOverlay;

