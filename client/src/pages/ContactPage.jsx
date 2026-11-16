import { Phone, MapPin, ExternalLink, MessageSquare, Mail } from 'lucide-react';
import ContactForm from '../components/contact/ContactForm';
import { BRAND_CONFIG } from '../config/brand';
import { PRIMARY_BRANCH } from '../config/branches';

// Clean inline SVG for the recognizable WhatsApp brand icon
const WhatsAppIcon = ({ size = 18, color = 'currentColor' }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke={color}
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    style={{ flexShrink: 0 }}
  >
    <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
  </svg>
);

export const ContactPage = () => {
  const whatsappUrl = `${BRAND_CONFIG.contact.whatsappBaseUrl}?text=${encodeURIComponent(
    'Hello Laundry Walii, I would like to know more about your laundry services.'
  )}`;
  const whatsappCallFallbackUrl = BRAND_CONFIG.contact.whatsappBaseUrl;
  const hasConfiguredEmail = Boolean(BRAND_CONFIG.contact.email && BRAND_CONFIG.contact.email.includes('@'));
  const mailtoUrl = hasConfiguredEmail
    ? `mailto:${BRAND_CONFIG.contact.email}?subject=${encodeURIComponent('Laundry Walii Customer Inquiry')}`
    : '';

  return (
    <div className="contact-page-container">
      {/* Hero Section */}
      <section className="contact-hero">
        <div className="container">
          <div className="hero-center-box">
            <div className="hero-title-wrap">
              <h1 className="hero-heading">
                Get In <span className="hero-heading-accent">Touch</span>
              </h1>
              {/* Subtle radiant accent marks after 'Touch' */}
              <svg
                className="hero-spark-accent"
                width="32"
                height="28"
                viewBox="0 0 32 28"
                fill="none"
                aria-hidden="true"
              >
                <path d="M4 22L1 18" stroke="#700F63" strokeWidth="2.8" strokeLinecap="round" />
                <path d="M12 12L22 3" stroke="#700F63" strokeWidth="2.8" strokeLinecap="round" />
                <path d="M18 20L30 14" stroke="#700F63" strokeWidth="2.8" strokeLinecap="round" />
              </svg>
            </div>

            {/* Subtle curved purple decorative underline */}
            <div className="hero-underline-wrap" aria-hidden="true">
              <svg width="140" height="14" viewBox="0 0 140 14" fill="none">
                <path
                  d="M3 11C40 2 100 2 137 11"
                  stroke="#700F63"
                  strokeWidth="3.2"
                  strokeLinecap="round"
                />
              </svg>
            </div>

            <p className="hero-subtitle">
              We are always here to help you with your laundry needs.
            </p>
          </div>
        </div>
      </section>

      {/* Main Content Layout: Two-column Desktop */}
      <section className="contact-main-section">
        <div className="container">
          <div className="contact-two-column-grid">
            {/* LEFT COLUMN: Three Stacked Contact Cards */}
            <div className="left-cards-stack">
              {/* CARD 1 – PHONE & SMS SUPPORT */}
              <div className="contact-card">
                <div className="card-inner-flex">
                  <div className="card-icon-bubble bubble-pink">
                    <Phone size={22} strokeWidth={2.2} />
                  </div>
                  <div className="card-content-block">
                    <span className="card-tag">PHONE &amp; SMS SUPPORT</span>
                    <h3 className="card-title-number">
                      <a href={BRAND_CONFIG.contact.telHref}>
                        +91 {BRAND_CONFIG.contact.phone}
                      </a>
                    </h3>
                    <p className="card-description">
                      Call or SMS directly for immediate pickup dispatch, status updates, and support.
                    </p>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.6rem' }}>
                      <a
                        href={BRAND_CONFIG.contact.telHref}
                        className="btn-card-action btn-magenta"
                      >
                        <Phone size={15} />
                        <span>Call Now</span>
                      </a>
                      <a
                        href={BRAND_CONFIG.contact.smsHref}
                        className="btn-card-action"
                        style={{
                          background: '#F6EEF8',
                          color: '#700F63',
                          border: '1px solid rgba(220, 204, 226, 0.75)'
                        }}
                      >
                        <MessageSquare size={15} />
                        <span>Send SMS</span>
                      </a>
                    </div>
                  </div>
                </div>
              </div>

              {/* CARD 2 – WHATSAPP CHAT & CALL */}
              <div className="contact-card">
                <div className="card-inner-flex">
                  <div className="card-icon-bubble bubble-green">
                    <WhatsAppIcon size={22} color="#25D366" />
                  </div>
                  <div className="card-content-block">
                    <span className="card-tag">WHATSAPP CHAT &amp; CALL</span>
                    <h3 className="card-title-number">
                      <a href={whatsappUrl} target="_blank" rel="noreferrer">
                        +91 {BRAND_CONFIG.contact.phone}
                      </a>
                    </h3>
                    <p className="card-description">
                      Chat with our Mysore concierge for quick price quotes and bag pickups, or open WhatsApp to place a voice call.
                    </p>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.6rem' }}>
                      <a
                        href={whatsappUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="btn-card-action btn-green"
                      >
                        <WhatsAppIcon size={15} color="#FFFFFF" />
                        <span>Chat on WhatsApp</span>
                        <ExternalLink size={13} />
                      </a>
                      <a
                        href={whatsappCallFallbackUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="btn-card-action"
                        style={{
                          background: '#ECFDF5',
                          color: '#15803D',
                          border: '1px solid #BBF7D0'
                        }}
                      >
                        <Phone size={15} />
                        <span>WhatsApp Call</span>
                        <ExternalLink size={13} />
                      </a>
                    </div>
                    <span className="studio-landmark-text" style={{ marginTop: '0.15rem', marginBottom: 0 }}>
                      Opens WhatsApp for +91 {BRAND_CONFIG.contact.phone} — tap the call icon inside WhatsApp to start a voice call.
                    </span>
                  </div>
                </div>
              </div>

              {hasConfiguredEmail && (
                <div className="contact-card">
                  <div className="card-inner-flex">
                    <div className="card-icon-bubble bubble-pink">
                      <Mail size={22} strokeWidth={2.2} />
                    </div>
                    <div className="card-content-block">
                      <span className="card-tag">OFFICIAL EMAIL</span>
                      <h3 className="card-title-number" style={{ fontSize: '1.1rem', wordBreak: 'break-all' }}>
                        <a href={mailtoUrl}>{BRAND_CONFIG.contact.email}</a>
                      </h3>
                      <a href={mailtoUrl} className="btn-card-action btn-magenta">
                        <Mail size={15} />
                        <span>Email Us</span>
                      </a>
                    </div>
                  </div>
                </div>
              )}

              {/* CARD 3 – OUR LOCATION */}
              <div className="contact-card">
                <div className="card-inner-flex">
                  <div className="card-icon-bubble bubble-pink">
                    <MapPin size={22} strokeWidth={2.2} />
                  </div>
                  <div className="card-content-block">
                    <span className="card-tag">Our Location</span>
                    <h3 className="card-title-studio">
                      Laundry Waliii – Mysore
                    </h3>
                    <p className="card-description studio-address-text">
                      #5 Dr Dejagav Circle, near Westside, Kuvempu Trust Building, KD Road, Mysore – 570012
                    </p>
                    <span className="studio-landmark-text">
                      Landmark: Near Westside, Kuvempu Trust Building, Dr Dejagav Circle
                    </span>
                    <a
                      href={PRIMARY_BRANCH.mapUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="btn-card-action btn-magenta"
                    >
                      <MapPin size={15} />
                      <span>View on Google Maps</span>
                      <ExternalLink size={13} />
                    </a>
                  </div>
                </div>
              </div>

              {/* CARD 4 – OFFICIAL INSTAGRAM PROFILE */}
              <div className="contact-card">
                <div className="card-inner-flex">
                  <div className="card-icon-bubble bubble-pink">
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#700F63" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                      <rect width="20" height="20" x="2" y="2" rx="5" ry="5"/>
                      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
                      <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/>
                    </svg>
                  </div>
                  <div className="card-content-block">
                    <span className="card-tag">OFFICIAL INSTAGRAM</span>
                    <h3 className="card-title-studio" style={{ fontSize: '1.25rem', marginBottom: '0.35rem' }}>
                      <a
                        href={BRAND_CONFIG.social.instagram}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{ color: '#700F63', textDecoration: 'none' }}
                      >
                        {BRAND_CONFIG.social.instagramHandle}
                      </a>
                    </h3>
                    <p className="card-description">
                      Follow our official profile for daily laundry care tips, fabric transformations, and brand announcements.
                    </p>
                    <a
                      href={BRAND_CONFIG.social.instagram}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn-card-action btn-magenta"
                      aria-label="Open Laundry Waliii Instagram profile in new tab"
                    >
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                        <rect width="20" height="20" x="2" y="2" rx="5" ry="5"/>
                        <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
                        <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/>
                      </svg>
                      <span>Follow on Instagram</span>
                      <ExternalLink size={13} />
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/* RIGHT COLUMN: Enquiry Form Card */}
            <div className="right-form-col">
              <ContactForm />
            </div>
          </div>
        </div>
      </section>

      <style>{`
        .contact-page-container {
          background-color: #FAF7FC;
          min-height: 100vh;
          position: relative;
          overflow: hidden;
          padding-bottom: 5.5rem;
        }

        /* Hero Section */
        .contact-hero {
          padding-top: calc(var(--header-height, 84px) + 2rem);
          padding-bottom: 2.5rem;
          position: relative;
          z-index: 2;
        }

        .hero-center-box {
          text-align: center;
          max-width: 680px;
          margin: 0 auto;
        }

        .hero-title-wrap {
          display: inline-flex;
          align-items: flex-start;
          justify-content: center;
          position: relative;
        }

        .hero-heading {
          font-family: var(--font-heading);
          font-style: italic;
          font-weight: 700;
          font-size: clamp(2.5rem, 5vw, 3.8rem);
          color: #171421;
          line-height: 1.15;
          letter-spacing: -0.015em;
          margin: 0;
        }

        .hero-heading-accent {
          color: #700F63;
        }

        .hero-spark-accent {
          position: absolute;
          top: -4px;
          right: -28px;
        }

        .hero-underline-wrap {
          display: flex;
          justify-content: center;
          margin-top: 0.4rem;
          margin-bottom: 0.9rem;
        }

        .hero-subtitle {
          font-family: var(--font-body);
          font-size: 1.05rem;
          color: #45414D;
          line-height: 1.6;
          margin: 0 auto;
        }

        /* Main Content Section */
        .contact-main-section {
          position: relative;
          z-index: 2;
        }

        .contact-two-column-grid {
          display: grid;
          grid-template-columns: minmax(320px, 440px) 1.25fr;
          gap: 2rem;
          align-items: stretch;
          max-width: 1160px;
          margin: 0 auto;
        }

        /* Left Column Cards */
        .left-cards-stack {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }

        .contact-card {
          background: #FFFFFF;
          border-radius: 24px;
          border: 1px solid rgba(220, 204, 226, 0.75);
          box-shadow: 0 6px 24px rgba(70, 18, 75, 0.04);
          padding: 1.75rem 2rem;
          transition: transform 0.25s ease, box-shadow 0.25s ease, border-color 0.25s ease;
        }

        .contact-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 12px 32px rgba(70, 18, 75, 0.09);
          border-color: rgba(112, 15, 99, 0.35);
        }

        .card-inner-flex {
          display: flex;
          align-items: flex-start;
          gap: 1.25rem;
        }

        .card-icon-bubble {
          width: 48px;
          height: 48px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          margin-top: 2px;
        }

        .bubble-pink {
          background: #F6EEF8;
          color: #700F63;
        }

        .bubble-green {
          background: #E8F8F0;
          color: #25D366;
        }

        .card-content-block {
          flex: 1;
        }

        .card-tag {
          font-family: var(--font-body);
          font-size: 0.74rem;
          font-weight: 700;
          color: #700F63;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          display: block;
          margin-bottom: 0.25rem;
        }

        .card-title-number {
          font-family: var(--font-body);
          font-size: 1.45rem;
          font-weight: 700;
          color: #171421;
          margin: 0 0 0.35rem 0;
          letter-spacing: -0.01em;
        }

        .card-title-number a {
          color: inherit;
          text-decoration: none;
        }

        .card-title-number a:hover {
          color: #700F63;
        }

        .card-title-studio {
          font-family: var(--font-heading);
          font-size: 1.35rem;
          font-weight: 700;
          color: #171421;
          margin: 0 0 0.35rem 0;
        }

        .card-description {
          font-family: var(--font-body);
          font-size: 0.88rem;
          color: #45414D;
          line-height: 1.5;
          margin: 0 0 0.9rem 0;
        }

        .studio-address-text {
          color: #45414D;
          margin-bottom: 0.35rem;
        }

        .studio-landmark-text {
          display: block;
          font-family: var(--font-body);
          font-size: 0.82rem;
          font-weight: 600;
          color: #700F63;
          margin-bottom: 1rem;
          line-height: 1.4;
        }

        .btn-card-action {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.65rem 1.4rem;
          border-radius: 9999px;
          font-family: var(--font-body);
          font-size: 0.88rem;
          font-weight: 600;
          text-decoration: none;
          transition: all 0.2s ease;
          box-shadow: 0 4px 12px rgba(23, 20, 33, 0.06);
        }

        .btn-magenta {
          background: #700F63;
          color: #FFFFFF;
        }

        .btn-magenta:hover {
          background: #590A4E;
          transform: translateY(-1px);
          box-shadow: 0 6px 16px rgba(112, 15, 99, 0.28);
        }

        .btn-green {
          background: #25D366;
          color: #FFFFFF;
        }

        .btn-green:hover {
          background: #20BD5A;
          transform: translateY(-1px);
          box-shadow: 0 6px 16px rgba(37, 211, 102, 0.35);
        }

        /* Right Column Form */
        .right-form-col {
          display: flex;
          flex-direction: column;
        }

        /* Responsive Breakpoints */
        @media (max-width: 980px) {
          .contact-two-column-grid {
            grid-template-columns: 1fr;
            gap: 2rem;
          }
        }

        @media (max-width: 640px) {
          .contact-page-container {
            padding-bottom: 4rem;
          }
          .hero-spark-accent {
            display: none;
          }
          .contact-card {
            padding: 1.5rem;
          }
          .card-inner-flex {
            gap: 1rem;
          }
          .card-title-number {
            font-size: 1.25rem;
          }
          .btn-card-action {
            width: 100%;
            justify-content: center;
          }
        }
      `}</style>
    </div>
  );
};

export default ContactPage;
