import { MapPin, Phone, ExternalLink } from 'lucide-react';
import { PRIMARY_BRANCH } from '../../config/branches';

export const BranchesPreview = () => {
  return (
    <section className="section" style={{ background: '#FFF9EF' }}>
      <div className="container">
        <div
          style={{
            background: '#FFFFFF',
            border: '1px solid var(--color-border)',
            borderRadius: 'var(--radius-3xl)',
            padding: '3.5rem',
            boxShadow: 'var(--shadow-card)',
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            alignItems: 'center',
            gap: '3rem'
          }}
        >
          {/* Left: Branch Info */}
          <div>
            <span className="heading-sub">Physical Location</span>

            <h2
              className="heading-section"
              style={{
                fontSize: 'clamp(2rem, 3.8vw, 2.75rem)',
                color: 'var(--color-purple)',
                marginBottom: '1rem'
              }}
            >
              Our Mysore Branch
            </h2>

            <p style={{ color: 'var(--color-muted)', fontSize: '1rem', lineHeight: 1.7, marginBottom: '2rem' }}>
              Drop off garments in person at our dedicated studio or call our counter team directly for instant booking support.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', marginBottom: '2.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.85rem' }}>
                <MapPin size={20} color="var(--color-pink)" style={{ flexShrink: 0, marginTop: '3px' }} />
                <div>
                  <strong style={{ display: 'block', color: 'var(--color-purple)', fontSize: '1.05rem', marginBottom: '0.2rem' }}>
                    {PRIMARY_BRANCH.name}
                  </strong>
                  <span style={{ color: 'var(--color-dark)', fontSize: '0.94rem', lineHeight: 1.6 }}>
                    {PRIMARY_BRANCH.address}
                  </span>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
                <Phone size={19} color="var(--color-pink)" />
                <a
                  href={`tel:+91${PRIMARY_BRANCH.phone}`}
                  style={{ fontSize: '1.05rem', fontWeight: 600, color: 'var(--color-purple)', textDecoration: 'none' }}
                >
                  {PRIMARY_BRANCH.phone}
                </a>
              </div>
            </div>

            {/* Actions */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', alignItems: 'center' }}>
              <a
                href={PRIMARY_BRANCH.mapUrl}
                target="_blank"
                rel="noreferrer"
                className="btn-pill-primary"
                style={{ padding: '0.9rem 2.2rem' }}
              >
                <span>Get Directions</span>
                <ExternalLink size={16} />
              </a>

              <a
                href={`tel:+91${PRIMARY_BRANCH.phone}`}
                className="btn-pill-outline"
                style={{ padding: '0.9rem 2rem' }}
              >
                <span>Call Studio</span>
              </a>
            </div>
          </div>

          {/* Right: Elegant Mysore Image Preview */}
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <div
              style={{
                width: '100%',
                maxHeight: '340px',
                borderRadius: 'var(--radius-2xl)',
                overflow: 'hidden',
                border: '1px solid var(--color-border)'
              }}
            >
              <img
                src="/images/royal/branch-gate.jpg"
                alt="Laundry Waliiii Mysore Location"
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  display: 'block'
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default BranchesPreview;
