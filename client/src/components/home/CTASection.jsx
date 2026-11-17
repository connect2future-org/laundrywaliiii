import { Truck, Phone } from 'lucide-react';
import { BRAND_CONFIG } from '../../config/brand';
import { getBookPickupWhatsAppUrl } from '../../utils/whatsapp';

export const CTASection = () => {
  return (
    <section
      style={{
        background: 'var(--color-purple)',
        color: '#FFFFFF',
        padding: '5.5rem 0',
        position: 'relative'
      }}
    >
      <div className="container" style={{ position: 'relative', zIndex: 1 }}>
        <div
          style={{
            maxWidth: '720px',
            margin: '0 auto',
            textAlign: 'center'
          }}
        >
          <span
            style={{
              fontFamily: 'var(--font-body)',
              fontSize: '0.84rem',
              fontWeight: 600,
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
              color: 'var(--color-pink-soft)',
              marginBottom: '1rem',
              display: 'inline-block'
            }}
          >
            Doorstep Convenience
          </span>

          <h2
            className="heading-section"
            style={{
              color: '#FFFFFF',
              fontSize: 'clamp(2.2rem, 4.5vw, 3.4rem)',
              lineHeight: 1.15,
              marginBottom: '1.25rem'
            }}
          >
            Fresh Clothes, <br />
            <span style={{ fontFamily: 'var(--font-serif)', fontStyle: 'italic', color: 'var(--color-pink-soft)' }}>
              Delivered to Your Door.
            </span>
          </h2>

          <p
            style={{
              color: 'rgba(255, 255, 255, 0.8)',
              fontSize: '1.05rem',
              lineHeight: 1.7,
              marginBottom: '2.5rem',
              margin: '0 auto 2.5rem auto',
              maxWidth: '540px'
            }}
          >
            Schedule your pickup online in seconds, or call our Mysore concierge team directly for quick assistance.
          </p>

          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: '1.25rem',
              justifyContent: 'center',
              alignItems: 'center'
            }}
          >
            <a
              href={getBookPickupWhatsAppUrl()}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-pill-primary"
              style={{ padding: '1rem 2.6rem', fontSize: '1.02rem' }}
              aria-label="Book Pickup on WhatsApp"
            >
              <Truck size={18} />
              <span>Book Pickup</span>
            </a>

            <a
              href={BRAND_CONFIG.contact.telHref}
              className="btn-pill-outline"
              style={{
                background: 'rgba(255, 255, 255, 0.08)',
                color: '#FFFFFF',
                border: '1px solid rgba(255, 255, 255, 0.25)',
                padding: '1rem 2.4rem',
                fontSize: '1.02rem'
              }}
            >
              <Phone size={17} color="var(--color-pink)" />
              <span>Call: {BRAND_CONFIG.contact.phone}</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTASection;
