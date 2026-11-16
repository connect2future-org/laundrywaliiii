import { useEffect } from 'react';
import { NavLink, Link } from 'react-router-dom';
import { X, Phone, Truck } from 'lucide-react';
import { BRAND_CONFIG } from '../../config/brand';

export const MobileNav = ({ isOpen, onClose, navLinks }) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9999,
        background: 'rgba(38, 21, 43, 0.5)',
        backdropFilter: 'blur(6px)',
        display: 'flex',
        justifyContent: 'flex-end',
        transition: 'opacity var(--transition-normal)'
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        style={{
          width: '85%',
          maxWidth: '340px',
          height: '100%',
          background: '#FFFFFF',
          padding: '2rem 1.5rem',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          boxShadow: '-10px 0 35px rgba(23, 20, 33, 0.14)',
          overflowY: 'auto',
          borderLeft: '1px solid var(--color-border)'
        }}
      >
        <div>
          {/* Header */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
              <img
                src="/images/laundry-wali-mascot.png"
                alt="Laundry Waliiii Mascot"
                style={{ width: '42px', height: '42px', objectFit: 'contain' }}
              />
              <span style={{
                fontFamily: "'Satisfy', 'Pacifico', 'Kaushan Script', cursive, sans-serif",
                fontSize: '1.45rem',
                lineHeight: 1,
                letterSpacing: '-0.01em',
                display: 'inline-flex',
                alignItems: 'baseline',
                gap: '0.28rem'
              }}>
                <span style={{
                  color: '#38004D',
                  fontWeight: 700,
                  WebkitTextStroke: '0.35px #38004D',
                  textShadow: '0 0.5px 0.5px rgba(56, 0, 77, 0.18)'
                }}>Laundry</span>
                <span style={{
                  color: '#E91E78',
                  fontWeight: 700,
                  WebkitTextStroke: '0.35px #E91E78',
                  textShadow: '0 0.5px 0.5px rgba(233, 30, 120, 0.18)'
                }}>Waliiii</span>
              </span>
            </div>

            <button
              type="button"
              className="btn-neu-icon"
              onClick={onClose}
              aria-label="Close menu"
              style={{ width: '38px', height: '38px' }}
            >
              <X size={18} />
            </button>
          </div>

          {/* Navigation Links (Only 4 links) */}
          <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {navLinks.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                onClick={onClose}
                style={({ isActive }) => ({
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '0.9rem 1.15rem',
                  borderRadius: 'var(--radius-lg)',
                  fontFamily: 'var(--font-heading)',
                  fontSize: '1.05rem',
                  letterSpacing: '0.01em',
                  background: isActive ? 'var(--color-pink-soft)' : 'transparent',
                  color: isActive ? 'var(--color-pink-primary)' : 'var(--color-purple)',
                  fontWeight: isActive ? 600 : 500,
                  transition: 'all var(--transition-fast)'
                })}
              >
                <span>{link.label}</span>
                <span style={{ fontSize: '0.85rem', opacity: 0.4 }}>→</span>
              </NavLink>
            ))}
          </nav>
        </div>

        {/* Bottom Actions */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem', paddingTop: '1.5rem', borderTop: '1px solid var(--color-border)' }}>
          <a
            href={BRAND_CONFIG.contact.telHref}
            className="btn-pill-outline"
            style={{ width: '100%', justifyContent: 'center', padding: '0.85rem', fontSize: '0.92rem' }}
          >
            <Phone size={16} color="var(--color-pink-primary)" />
            <span>Call: {BRAND_CONFIG.contact.phone}</span>
          </a>

          <Link
            to="/services"
            onClick={onClose}
            className="btn-pill-primary"
            style={{ width: '100%', justifyContent: 'center', padding: '0.85rem', fontSize: '0.92rem' }}
          >
            <Truck size={17} />
            <span>Book Pickup</span>
          </Link>

          {/* Social Channels (Instagram & WhatsApp Only) */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.85rem', paddingTop: '0.35rem' }}>
            <a
              href={BRAND_CONFIG.social.instagram}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Follow Laundry Waliii on Instagram"
              style={{
                width: '38px',
                height: '38px',
                borderRadius: '50%',
                background: '#FAF5FB',
                border: '1px solid rgba(220, 204, 226, 0.85)',
                color: 'var(--color-purple)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                textDecoration: 'none'
              }}
            >
              <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <rect width="20" height="20" x="2" y="2" rx="5" ry="5"/>
                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
                <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/>
              </svg>
            </a>
            <a
              href={BRAND_CONFIG.contact.whatsappBaseUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Chat with Laundry Walii on WhatsApp"
              style={{
                width: '38px',
                height: '38px',
                borderRadius: '50%',
                background: '#FAF5FB',
                border: '1px solid rgba(220, 204, 226, 0.85)',
                color: '#25D366',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                textDecoration: 'none'
              }}
            >
              <svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91C2.13 13.66 2.59 15.36 3.45 16.86L2.05 22L7.3 20.62C8.75 21.41 10.38 21.83 12.04 21.83C17.5 21.83 21.95 17.38 21.95 11.92C21.95 9.27 20.92 6.78 19.05 4.91C17.18 3.03 14.69 2 12.04 2ZM12.05 3.67C14.25 3.67 16.31 4.53 17.87 6.09C19.42 7.65 20.28 9.72 20.28 11.92C20.28 16.46 16.58 20.16 12.05 20.16C10.66 20.16 9.3 19.8 8.1 19.11L7.81 18.94L4.72 19.75L5.54 16.74L5.36 16.44C4.6 15.22 4.19 13.58 4.19 11.91C4.19 7.37 7.89 3.67 12.05 3.67ZM8.83 7.34C8.63 7.34 8.44 7.35 8.27 7.69C8.07 8.08 7.5 8.64 7.5 9.76C7.5 10.88 8.32 11.96 8.44 12.12C8.56 12.28 10.05 14.59 12.33 15.57C14.23 16.38 14.62 16.22 15.04 16.18C15.46 16.14 16.39 15.63 16.58 15.08C16.78 14.54 16.78 14.07 16.72 13.97C16.66 13.88 16.51 13.82 16.27 13.7C16.04 13.59 14.9 13.03 14.68 12.95C14.47 12.87 14.31 12.83 14.16 13.07C14 13.31 13.55 13.88 13.41 14.04C13.28 14.2 13.14 14.22 12.91 14.1C12.67 13.98 11.91 13.73 11.01 12.93C10.31 12.31 9.84 11.54 9.7 11.31C9.57 11.07 9.69 10.94 9.81 10.82C9.91 10.72 10.04 10.55 10.15 10.41C10.27 10.27 10.31 10.17 10.39 10.01C10.47 9.86 10.43 9.72 10.37 9.6C10.31 9.48 9.84 8.32 9.64 7.85C9.45 7.39 9.25 7.45 9.1 7.44C8.96 7.44 8.83 7.34 8.83 7.34Z"/>
              </svg>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MobileNav;
