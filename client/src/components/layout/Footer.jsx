import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Phone, MapPin, Mail } from 'lucide-react';
import { BRAND_CONFIG } from '../../config/brand';
import { PRIMARY_BRANCH } from '../../config/branches';
import { servicesApi } from '../../services/api';

export const Footer = () => {
  const location = useLocation();
  const [footerServices, setFooterServices] = useState([
    { name: 'Wash & Fold', slug: 'wash-fold', categorySlug: 'wash-fold' },
    { name: 'Wash & Iron', slug: 'wash-iron', categorySlug: 'wash-iron' },
    { name: 'Dry Cleaning', slug: 'dry-cleaning', categorySlug: 'dry-cleaning' },
    { name: 'Shoe Cleaning', slug: 'shoe-cleaning', categorySlug: 'shoe-cleaning' },
  ]);

  const handleQuickLinkClick = (targetPath) => () => {
    if (location.pathname === targetPath) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleServiceClick = (targetSlug) => () => {
    if (location.pathname === '/services') {
      const el = document.getElementById(targetSlug);
      if (el) {
        const headerOffset = 96;
        const elementPosition = el.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
        window.scrollTo({
          top: Math.max(0, offsetPosition),
          behavior: 'smooth'
        });
      }
      window.dispatchEvent(new CustomEvent('service-hash-navigate', { detail: { slug: targetSlug } }));
    }
  };

  useEffect(() => {
    let active = true;
    servicesApi
      .getCategories()
      .then((cats) => {
        if (active && Array.isArray(cats) && cats.length > 0) {
          setFooterServices(cats.slice(0, 4));
        }
      })
      .catch(() => {});
    return () => {
      active = false;
    };
  }, []);

  return (
    <footer className="lw-footer-root" aria-label="Website Footer">
      {/* Subtle lavender and pink wave background along the bottom edge */}
      <div className="footer-bottom-waves" aria-hidden="true">
        <svg
          viewBox="0 0 1440 90"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          preserveAspectRatio="none"
          className="footer-wave-svg"
        >
          <path
            d="M0,45 C320,80 540,15 820,50 C1100,80 1280,30 1440,55 L1440,90 L0,90 Z"
            fill="url(#waveGradLavender)"
            opacity="0.6"
          />
          <path
            d="M0,62 C260,30 580,85 960,42 C1220,12 1360,65 1440,52 L1440,90 L0,90 Z"
            fill="url(#waveGradPink)"
            opacity="0.45"
          />
          <defs>
            <linearGradient id="waveGradLavender" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#E9D5F5" />
              <stop offset="50%" stopColor="#DFCEF0" />
              <stop offset="100%" stopColor="#E8D2F2" />
            </linearGradient>
            <linearGradient id="waveGradPink" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#FBD4EA" />
              <stop offset="50%" stopColor="#F5C4E5" />
              <stop offset="100%" stopColor="#FCE0F0" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      {/* Main Footer Container */}
      <div className="lw-footer-inner-container">
        <div className="lw-footer-cols-grid">
          {/* COLUMN 1 – BRAND AND CONTACT INFORMATION */}
          <div className="footer-col col-brand-contact">
            <Link to="/" className="footer-logo-link" aria-label="Laundry Waliiii Home">
              <img
                src="/images/laundry-walii-official-logo-transparent.png"
                alt="Laundry Waliiii - Fresh Clothes. Happy People."
                className="footer-logo-img"
                width="54"
                height="54"
              />
            </Link>
            <p className="footer-tagline">Fresh Clothes. Happy People.</p>

            <div className="footer-contact-list">
              {/* Phone */}
              <a href={BRAND_CONFIG.contact.telHref} className="footer-contact-row">
                <div className="footer-icon-badge" aria-hidden="true">
                  <Phone size={13} strokeWidth={2.4} />
                </div>
                <span className="contact-bold-text">+91 {BRAND_CONFIG.contact.phone}</span>
              </a>

              {/* Email */}
              <a href={BRAND_CONFIG.contact.mailtoHref} className="footer-contact-row">
                <div className="footer-icon-badge" aria-hidden="true">
                  <Mail size={13} strokeWidth={2.4} />
                </div>
                <span className="contact-medium-text">{BRAND_CONFIG.contact.email}</span>
              </a>

              {/* Address */}
              <div className="footer-contact-row address-row">
                <div className="footer-icon-badge" aria-hidden="true">
                  <MapPin size={13} strokeWidth={2.4} />
                </div>
                <span className="contact-address-text">
                  #5 Dr Deajay Circle, near Westside, Kuvempu Trust Building, KD Road, Mysore – 570012
                </span>
              </div>
            </div>
          </div>

          {/* Thin Column Separator 1 */}
          <div className="footer-v-sep" aria-hidden="true" />

          {/* COLUMN 2 – QUICK LINKS */}
          <div className="footer-col col-quick-links">
            <h4 className="footer-col-title">QUICK LINKS</h4>
            <ul className="footer-nav-list">
              <li><Link to="/" onClick={handleQuickLinkClick('/')}>Home</Link></li>
              <li><Link to="/services" onClick={handleQuickLinkClick('/services')}>Services</Link></li>
              <li><Link to="/franchise" onClick={handleQuickLinkClick('/franchise')}>Franchise</Link></li>
              <li><Link to="/contact" onClick={handleQuickLinkClick('/contact')}>Contact Us</Link></li>
            </ul>
          </div>

          {/* Thin Column Separator 2 */}
          <div className="footer-v-sep" aria-hidden="true" />

          {/* COLUMN 3 – OUR SERVICES */}
          <div className="footer-col col-services">
            <h4 className="footer-col-title">OUR SERVICES</h4>
            <ul className="footer-nav-list">
              {footerServices.map((cat) => {
                const slug = cat.slug || cat.categorySlug || cat.name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
                return (
                  <li key={slug}>
                    <Link
                      to={`/services#${slug}`}
                      onClick={handleServiceClick(slug)}
                    >
                      {cat.name}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>

          {/* Thin Column Separator 3 */}
          <div className="footer-v-sep" aria-hidden="true" />

          {/* COLUMN 4 – CONNECT WITH US */}
          <div className="footer-col col-connect">
            <h4 className="footer-col-title">CONNECT WITH US</h4>
            <p className="footer-connect-desc">
              Follow our official updates on Instagram or message us on WhatsApp.
            </p>
            <div className="footer-social-bubbles">
              <a
                href={BRAND_CONFIG.social.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="social-bubble-btn"
                aria-label="Follow Laundry Waliiii on Instagram"
              >
                <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <rect width="20" height="20" x="2" y="2" rx="5" ry="5"/>
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
                  <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/>
                </svg>
              </a>
              <a
                href={`${BRAND_CONFIG.contact.whatsappBaseUrl}?text=${encodeURIComponent('Hello Laundry Waliiii, I would like to know more about your laundry services.')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="social-bubble-btn"
                aria-label="Chat with Laundry Waliiii on WhatsApp"
              >
                <svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91C2.13 13.66 2.59 15.36 3.45 16.86L2.05 22L7.3 20.62C8.75 21.41 10.38 21.83 12.04 21.83C17.5 21.83 21.95 17.38 21.95 11.92C21.95 9.27 20.92 6.78 19.05 4.91C17.18 3.03 14.69 2 12.04 2ZM12.05 3.67C14.25 3.67 16.31 4.53 17.87 6.09C19.42 7.65 20.28 9.72 20.28 11.92C20.28 16.46 16.58 20.16 12.05 20.16C10.66 20.16 9.3 19.8 8.1 19.11L7.81 18.94L4.72 19.75L5.54 16.74L5.36 16.44C4.6 15.22 4.19 13.58 4.19 11.91C4.19 7.37 7.89 3.67 12.05 3.67ZM8.83 7.34C8.63 7.34 8.44 7.35 8.27 7.69C8.07 8.08 7.5 8.64 7.5 9.76C7.5 10.88 8.32 11.96 8.44 12.12C8.56 12.28 10.05 14.59 12.33 15.57C14.23 16.38 14.62 16.22 15.04 16.18C15.46 16.14 16.39 15.63 16.58 15.08C16.78 14.54 16.78 14.07 16.72 13.97C16.66 13.88 16.51 13.82 16.27 13.7C16.04 13.59 14.9 13.03 14.68 12.95C14.47 12.87 14.31 12.83 14.16 13.07C14 13.31 13.55 13.88 13.41 14.04C13.28 14.2 13.14 14.22 12.91 14.1C12.67 13.98 11.91 13.73 11.01 12.93C10.31 12.31 9.84 11.54 9.7 11.31C9.57 11.07 9.69 10.94 9.81 10.82C9.91 10.72 10.04 10.55 10.15 10.41C10.27 10.27 10.31 10.17 10.39 10.01C10.47 9.86 10.43 9.72 10.37 9.6C10.31 9.48 9.84 8.32 9.64 7.85C9.45 7.39 9.25 7.45 9.1 7.44C8.96 7.44 8.83 7.34 8.83 7.34Z"/>
                </svg>
              </a>
            </div>
          </div>
        </div>

        {/* BOTTOM COPYRIGHT AND LEGAL BAR */}
        <div className="footer-bottom-bar">
          <p className="copyright-text">
            © 2026 Laundry Waliiii. All Rights Reserved.
          </p>
          <div className="legal-links-wrap">
            <Link to="/privacy-policy" className="legal-anchor">Privacy Policy</Link>
            <span className="legal-divider" aria-hidden="true">|</span>
            <Link to="/terms-and-conditions" className="legal-anchor">Terms & Conditions</Link>
          </div>
        </div>
      </div>

      <style>{`
        /* ========================================================
           LAUNDRY WALIIII — MINIMALIST SOFT WAVE FOOTER
           Soft white/light-lavender palette with subtle waves
           ======================================================== */

        .lw-footer-root {
          width: 100%;
          position: relative;
          background: linear-gradient(180deg, #FFFFFF 0%, #FAF6FC 45%, #F4EBF7 100%);
          border-top: 1px solid rgba(101, 0, 120, 0.08);
          margin-top: 0;
          overflow: hidden;
          box-sizing: border-box;
        }

        /* --------------------------------------------------------
           SUBTLE BOTTOM WAVES
           -------------------------------------------------------- */
        .footer-bottom-waves {
          position: absolute;
          left: 0;
          right: 0;
          bottom: 0;
          height: 85px;
          pointer-events: none;
          z-index: 1;
          overflow: hidden;
        }

        .footer-wave-svg {
          width: 100%;
          height: 100%;
          display: block;
        }

        /* --------------------------------------------------------
           CONTAINER & GRID
           -------------------------------------------------------- */
        .lw-footer-inner-container {
          max-width: 1320px;
          margin: 0 auto;
          padding: clamp(2.5rem, 4vw, 3.75rem) clamp(1.25rem, 3.5vw, 3rem) 1.5rem;
          position: relative;
          z-index: 2;
        }

        .lw-footer-cols-grid {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          gap: clamp(1.25rem, 2vw, 2.25rem);
          padding-bottom: clamp(2rem, 3vw, 2.75rem);
        }

        .footer-col {
          display: flex;
          flex-direction: column;
        }

        /* --------------------------------------------------------
           COLUMN 1: BRAND & CONTACT
           -------------------------------------------------------- */
        .col-brand-contact {
          flex: 1.35;
          min-width: 270px;
        }

        .footer-logo-link {
          display: inline-block;
          margin-bottom: 0.65rem;
          text-decoration: none;
        }

        .footer-logo-img {
          height: 52px;
          width: auto;
          aspect-ratio: 1 / 1;
          display: block;
          object-fit: contain;
          transition: transform 0.25s ease;
        }

        .footer-logo-img:hover {
          transform: scale(1.04);
        }

        .footer-tagline {
          font-family: 'Playfair Display', Georgia, serif;
          font-style: italic;
          font-weight: 700;
          font-size: clamp(1.15rem, 1.4vw, 1.35rem);
          color: #4B1248;
          margin: 0 0 1.25rem;
          letter-spacing: -0.01em;
          line-height: 1.3;
        }

        .footer-contact-list {
          display: flex;
          flex-direction: column;
          gap: 0.8rem;
        }

        .footer-contact-row {
          display: inline-flex;
          align-items: center;
          gap: 0.75rem;
          text-decoration: none;
          color: #2D2433;
          transition: transform 0.2s ease, color 0.2s ease;
        }

        a.footer-contact-row:hover {
          color: #650078;
          transform: translateX(3px);
        }

        .footer-contact-row.address-row {
          align-items: flex-start;
        }

        .footer-icon-badge {
          width: 28px;
          height: 28px;
          border-radius: 50%;
          background: rgba(101, 0, 120, 0.08);
          color: #4B1248;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          margin-top: 2px;
          transition: all 0.25s ease;
        }

        .footer-contact-row:hover .footer-icon-badge {
          background: #650078;
          color: #FFFFFF;
          box-shadow: 0 2px 8px rgba(101, 0, 120, 0.25);
        }

        .contact-bold-text {
          font-family: 'DM Sans', sans-serif;
          font-size: 0.98rem;
          font-weight: 700;
          color: #171421;
          letter-spacing: -0.01em;
        }

        .contact-medium-text {
          font-family: 'DM Sans', sans-serif;
          font-size: 0.92rem;
          font-weight: 600;
          color: #171421;
        }

        .contact-address-text {
          font-family: 'DM Sans', sans-serif;
          font-size: 0.86rem;
          font-weight: 500;
          color: #473E4D;
          line-height: 1.5;
          max-width: 285px;
        }

        /* --------------------------------------------------------
           THIN VERTICAL SEPARATORS
           -------------------------------------------------------- */
        .footer-v-sep {
          width: 1px;
          min-height: 130px;
          background: rgba(101, 0, 120, 0.1);
          align-self: stretch;
          flex-shrink: 0;
        }

        /* --------------------------------------------------------
           COLUMNS 2 & 3: QUICK LINKS & SERVICES
           -------------------------------------------------------- */
        .col-quick-links,
        .col-services {
          flex: 0.95;
          min-width: 140px;
        }

        .footer-col-title {
          font-family: 'DM Sans', sans-serif;
          font-size: 0.88rem;
          font-weight: 800;
          color: #4B1248;
          text-transform: uppercase;
          letter-spacing: 0.08em;
          margin: 0 0 1.15rem;
        }

        .footer-nav-list {
          list-style: none;
          padding: 0;
          margin: 0;
          display: flex;
          flex-direction: column;
          gap: 0.7rem;
        }

        .footer-nav-list a {
          font-family: 'DM Sans', sans-serif;
          font-size: 0.92rem;
          font-weight: 600;
          color: #382F3D;
          text-decoration: none;
          transition: color 0.2s ease, transform 0.2s ease;
          display: inline-block;
        }

        .footer-nav-list a:hover {
          color: #F00087;
          transform: translateX(3px);
        }

        /* --------------------------------------------------------
           COLUMN 4: CONNECT WITH US
           -------------------------------------------------------- */
        .col-connect {
          flex: 1.05;
          min-width: 180px;
        }

        .footer-connect-desc {
          font-family: 'DM Sans', sans-serif;
          font-size: 0.86rem;
          line-height: 1.5;
          color: #554A5B;
          margin: 0 0 1rem;
          max-width: 230px;
        }

        .footer-social-bubbles {
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }

        .social-bubble-btn {
          width: 38px;
          height: 38px;
          border-radius: 50%;
          background: #FFFFFF;
          border: 1px solid rgba(101, 0, 120, 0.15);
          color: #4B1248;
          display: flex;
          align-items: center;
          justify-content: center;
          text-decoration: none;
          box-shadow: 0 2px 6px rgba(101, 0, 120, 0.04);
          transition: all 0.25s ease;
        }

        .social-bubble-btn:hover {
          background: #650078;
          color: #FFFFFF;
          border-color: #650078;
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(101, 0, 120, 0.2);
        }

        /* --------------------------------------------------------
           BOTTOM COPYRIGHT AND LEGAL BAR
           -------------------------------------------------------- */
        .footer-bottom-bar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          border-top: 1px solid rgba(101, 0, 120, 0.1);
          padding-top: 1.25rem;
          font-family: 'DM Sans', sans-serif;
          font-size: 0.84rem;
          color: #5A5060;
          flex-wrap: wrap;
          gap: 0.85rem;
        }

        .copyright-text {
          margin: 0;
          font-weight: 500;
        }

        .legal-links-wrap {
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }

        .legal-anchor {
          color: #5A5060;
          text-decoration: none;
          font-weight: 500;
          transition: color 0.2s ease;
        }

        .legal-anchor:hover {
          color: #650078;
        }

        .legal-divider {
          color: rgba(101, 0, 120, 0.25);
        }

        /* --------------------------------------------------------
           RESPONSIVE BREAKPOINTS
           -------------------------------------------------------- */
        @media (max-width: 1024px) {
          .lw-footer-cols-grid {
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            gap: 2.25rem 2rem;
          }
          .footer-v-sep {
            display: none;
          }
        }

        @media (max-width: 640px) {
          .lw-footer-inner-container {
            padding: 2.25rem 1.25rem 1.25rem;
          }
          .lw-footer-cols-grid {
            display: flex;
            flex-direction: column;
            gap: 1.85rem;
            padding-bottom: 1.85rem;
          }
          .col-brand-contact,
          .col-quick-links,
          .col-services,
          .col-connect {
            width: 100%;
            min-width: 0;
          }
          .footer-bottom-bar {
            flex-direction: column;
            align-items: flex-start;
            gap: 0.65rem;
            padding-top: 1rem;
          }
        }
      `}</style>
    </footer>
  );
};

export default Footer;
