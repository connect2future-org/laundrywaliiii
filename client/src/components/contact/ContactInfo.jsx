import { Phone, MapPin, ExternalLink, Mail } from 'lucide-react';
import { BRAND_CONFIG } from '../../config/brand';
import { PRIMARY_BRANCH } from '../../config/branches';

export const ContactInfo = () => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Official Phone Card */}
      <div
        className="card-royal"
        style={{
          padding: '2.25rem',
          display: 'flex',
          alignItems: 'flex-start',
          gap: '1.25rem',
          border: '1px solid var(--color-border)',
          background: '#FFFFFF'
        }}
      >
        <div className="card-icon-badge-pink">
          <Phone size={20} />
        </div>
        <div>
          <span style={{ fontSize: '0.78rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--color-pink)' }}>
            Official Phone
          </span>
          <h3 style={{ fontSize: '1.45rem', fontWeight: 700, margin: '0.25rem 0', color: 'var(--color-purple)' }}>
            <a href={BRAND_CONFIG.contact.telHref} style={{ color: 'var(--color-purple)', textDecoration: 'none' }}>
              {BRAND_CONFIG.contact.phone}
            </a>
          </h3>
          <p style={{ fontSize: '0.92rem', color: 'var(--color-muted)', margin: 0, lineHeight: 1.6 }}>
            Direct customer assistance for doorstep pickups and garment status.
          </p>
        </div>
      </div>

      {/* Official Email Card */}
      <div
        className="card-royal"
        style={{
          padding: '2.25rem',
          display: 'flex',
          alignItems: 'flex-start',
          gap: '1.25rem',
          border: '1px solid var(--color-border)',
          background: '#FFFFFF'
        }}
      >
        <div className="card-icon-badge-pink">
          <Mail size={20} />
        </div>
        <div>
          <span style={{ fontSize: '0.78rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--color-pink)' }}>
            Official Email
          </span>
          <h3 style={{ fontSize: '1.2rem', fontWeight: 700, margin: '0.25rem 0', color: 'var(--color-purple)', wordBreak: 'break-all' }}>
            <a href={BRAND_CONFIG.contact.mailtoHref} style={{ color: 'var(--color-purple)', textDecoration: 'none' }}>
              {BRAND_CONFIG.contact.email}
            </a>
          </h3>
          <p style={{ fontSize: '0.92rem', color: 'var(--color-muted)', margin: 0, lineHeight: 1.6 }}>
            Write to our official support desk for service queries and feedback.
          </p>
        </div>
      </div>

      {/* Confirmed Branch Address Card */}
      <div
        className="card-royal"
        style={{
          padding: '2.25rem',
          display: 'flex',
          alignItems: 'flex-start',
          gap: '1.25rem',
          background: '#FFFFFF',
          border: '1px solid var(--color-border)'
        }}
      >
        <div className="card-icon-badge-pink">
          <MapPin size={20} />
        </div>
        <div>
          <span style={{ fontSize: '0.78rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--color-pink)' }}>
            Our Location
          </span>
          <h4 style={{ fontSize: '1.2rem', fontWeight: 600, color: 'var(--color-purple)', margin: '0.25rem 0' }}>
            {PRIMARY_BRANCH.name}
          </h4>
          <p style={{ fontSize: '0.94rem', color: 'var(--color-dark)', margin: '0 0 0.4rem 0', lineHeight: 1.6 }}>
            {PRIMARY_BRANCH.address}
          </p>
          <p style={{ fontSize: '0.85rem', color: 'var(--color-muted)', margin: '0 0 1.25rem 0' }}>
            Landmark: {PRIMARY_BRANCH.landmark}
          </p>

          <a
            href={PRIMARY_BRANCH.mapUrl}
            target="_blank"
            rel="noreferrer"
            className="btn-pill-primary"
            style={{ padding: '0.7rem 1.6rem', fontSize: '0.88rem' }}
          >
            <span>Get Directions</span>
            <ExternalLink size={14} />
          </a>
        </div>
      </div>

      {/* Official Instagram Profile Card */}
      <div
        className="card-royal"
        style={{
          padding: '2.25rem',
          display: 'flex',
          alignItems: 'flex-start',
          gap: '1.25rem',
          background: '#FFFFFF',
          border: '1px solid var(--color-border)'
        }}
      >
        <div className="card-icon-badge-pink">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <rect width="20" height="20" x="2" y="2" rx="5" ry="5"/>
            <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
            <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/>
          </svg>
        </div>
        <div>
          <span style={{ fontSize: '0.78rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--color-pink)' }}>
            Official Instagram
          </span>
          <h4 style={{ fontSize: '1.2rem', fontWeight: 600, color: 'var(--color-purple)', margin: '0.25rem 0' }}>
            <a
              href={BRAND_CONFIG.social.instagram}
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: 'var(--color-purple)', textDecoration: 'none' }}
            >
              {BRAND_CONFIG.social.instagramHandle}
            </a>
          </h4>
          <p style={{ fontSize: '0.92rem', color: 'var(--color-muted)', margin: '0 0 1.25rem 0', lineHeight: 1.6 }}>
            Follow our official account for daily laundry care routines and studio stories.
          </p>

          <a
            href={BRAND_CONFIG.social.instagram}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-pill-primary"
            style={{ padding: '0.7rem 1.6rem', fontSize: '0.88rem' }}
          >
            <span>Follow on Instagram</span>
            <ExternalLink size={14} />
          </a>
        </div>
      </div>
    </div>
  );
};

export default ContactInfo;
