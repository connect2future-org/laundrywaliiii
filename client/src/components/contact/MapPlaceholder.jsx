import React from 'react';
import { MapPin, ExternalLink, Compass, Car } from 'lucide-react';
import { PRIMARY_BRANCH } from '../../config/branches';

export const MapPlaceholder = () => {
  return (
    <div
      className="card-royal"
      style={{
        padding: '2.5rem',
        borderRadius: 'var(--radius-3xl)',
        background: '#FFFFFF',
        display: 'flex',
        flexDirection: 'column',
        gap: '1.75rem',
        boxShadow: 'var(--shadow-card)',
        border: '1px solid var(--color-border)'
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <span className="heading-sub">Confirmed Studio</span>
          <h3 className="heading-card" style={{ fontSize: '1.35rem', margin: 0, color: 'var(--color-purple)' }}>
            {PRIMARY_BRANCH.name}
          </h3>
        </div>

        <a
          href={PRIMARY_BRANCH.mapUrl}
          target="_blank"
          rel="noreferrer"
          className="btn-pill-primary"
          style={{ padding: '0.65rem 1.4rem', fontSize: '0.88rem' }}
        >
          <span>Open in Google Maps</span>
          <ExternalLink size={14} />
        </a>
      </div>

      {/* Styled Map Board */}
      <div
        style={{
          height: '260px',
          width: '100%',
          background: 'linear-gradient(180deg, #FFF9EF 0%, #FFF5F8 100%)',
          borderRadius: 'var(--radius-2xl)',
          border: '1px solid var(--color-border)',
          position: 'relative',
          overflow: 'hidden',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}
      >
        {/* Central Map Marker Card */}
        <div
          style={{
            position: 'relative',
            zIndex: 10,
            background: '#FFFFFF',
            padding: '1.4rem 1.85rem',
            borderRadius: 'var(--radius-2xl)',
            border: '1px solid var(--color-border)',
            boxShadow: '0 8px 25px rgba(57, 0, 79, 0.08)',
            display: 'flex',
            alignItems: 'center',
            gap: '1rem',
            maxWidth: '440px'
          }}
        >
          <div className="card-icon-badge-pink" style={{ width: '44px', height: '44px', minWidth: '44px' }}>
            <MapPin size={22} />
          </div>
          <div>
            <h4 style={{ fontSize: '1.05rem', fontWeight: 600, margin: '0 0 0.2rem 0', color: 'var(--color-purple)' }}>
              {PRIMARY_BRANCH.name}
            </h4>
            <p style={{ fontSize: '0.85rem', color: 'var(--color-muted)', margin: 0, lineHeight: 1.5 }}>
              {PRIMARY_BRANCH.address}
            </p>
          </div>
        </div>
      </div>

      {/* Access Notes */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem', fontSize: '0.92rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--color-purple)' }}>
          <Compass size={17} color="var(--color-pink)" />
          <span>Landmark: Near Westside, Kuvempu Trust Building</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--color-purple)' }}>
          <Car size={17} color="var(--color-pink)" />
          <span>Convenient customer drop-off on KD Road</span>
        </div>
      </div>
    </div>
  );
};

export default MapPlaceholder;
