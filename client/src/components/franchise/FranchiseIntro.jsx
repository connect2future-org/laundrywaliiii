import React from 'react';
import { ArrowDown, MessageCircle, FileText } from 'lucide-react';
import { BRAND_CONFIG } from '../../config/brand';

export const FranchiseIntro = ({ onBrochureClick, onExploreClick }) => {
  const whatsappUrl = `https://wa.me/91${BRAND_CONFIG.contact.phone}?text=${encodeURIComponent(
    'Hello Laundry Waliiii Team,\n\nI am interested in owning a Laundry Waliiii franchise. I would like to know more about the available franchise models, investment requirements, setup process, and business opportunities.\n\nPlease share the details with me.\n\nThank you!'
  )}`;

  return (
    <section className="franchise-hero-section">
      <div className="container">
        <div className="franchise-hero-header">
          {/* Label Pill */}
          <div className="section-label-wrapper">
            <span className="label-line" />
            <span className="section-label-text">FRANCHISE OPPORTUNITIES</span>
            <span className="label-line" />
          </div>

          {/* Exact Required Main Heading */}
          <h1 className="franchise-main-heading">
            Own a Laundry Waliiii <em>Franchise</em>
          </h1>

          {/* Exact Required Supporting Description */}
          <p className="franchise-subheading">
            Join our growing laundry network and build a successful business with our proven franchise model, comprehensive operational support, and trusted brand.
          </p>

          {/* Quick Conversion Triggers */}
          <div className="franchise-hero-cta-row">
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-hero-enquire"
              aria-label="Enquire About Franchise on WhatsApp"
            >
              <MessageCircle size={18} strokeWidth={2.2} />
              <span>Enquire About Franchise</span>
            </a>

            <button
              type="button"
              onClick={onBrochureClick}
              className="btn-hero-brochure"
              aria-label="Download Official Franchise Brochure"
            >
              <FileText size={18} strokeWidth={2} />
              <span>Download Franchise Brochure</span>
            </button>
          </div>

          {/* Models Anchor Hint */}
          <div className="hero-scroll-hint">
            <button
              type="button"
              onClick={onExploreClick}
              className="btn-scroll-anchor"
              aria-label="View Franchise Models"
            >
              <span>Explore Franchise Models</span>
              <ArrowDown size={14} />
            </button>
          </div>
        </div>
      </div>

      <style>{`
        .franchise-hero-section {
          padding-top: calc(72px + 3.25rem);
          padding-bottom: 4rem;
          background: linear-gradient(180deg, #FFFFFF 0%, #FAF7FC 100%);
          position: relative;
          z-index: 2;
          border-bottom: 1px solid rgba(220, 204, 226, 0.45);
        }

        .franchise-hero-header {
          text-align: center;
          max-width: 820px;
          margin: 0 auto;
        }

        .section-label-wrapper {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 0.85rem;
          margin-bottom: 1rem;
        }

        .label-line {
          width: 36px;
          height: 1.5px;
          background-color: rgba(112, 15, 99, 0.38);
          border-radius: 2px;
        }

        .section-label-text {
          font-family: var(--font-body);
          font-size: 0.78rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.16em;
          color: #700F63;
        }

        .franchise-main-heading {
          font-family: 'Playfair Display', Georgia, serif;
          font-style: italic;
          font-size: clamp(2.35rem, 4.6vw, 3.6rem);
          font-weight: 700;
          color: #1A1320;
          line-height: 1.18;
          margin: 0 0 1.15rem 0;
          letter-spacing: -0.02em;
        }

        .franchise-main-heading em {
          font-family: 'Playfair Display', Georgia, serif;
          font-style: italic;
          font-weight: 700;
          color: #700F63;
        }

        .franchise-subheading {
          font-family: var(--font-body);
          font-size: clamp(1rem, 1.2vw, 1.12rem);
          color: #5C5564;
          line-height: 1.68;
          max-width: 720px;
          margin: 0 auto 2.25rem auto;
        }

        .franchise-hero-cta-row {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 1rem;
          flex-wrap: wrap;
          margin-bottom: 1.75rem;
        }

        .btn-hero-enquire {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 0.6rem;
          background: #700F63;
          color: #FFFFFF;
          text-decoration: none;
          font-family: var(--font-body);
          font-size: 0.95rem;
          font-weight: 600;
          padding: 0.85rem 1.85rem;
          border-radius: 9999px;
          box-shadow: 0 4px 18px rgba(112, 15, 99, 0.25);
          transition: all 0.22s ease;
        }

        .btn-hero-enquire:hover {
          background: #590A4E;
          transform: translateY(-2px);
          box-shadow: 0 8px 24px rgba(112, 15, 99, 0.35);
        }

        .btn-hero-brochure {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 0.6rem;
          background: #FFFFFF;
          color: #1A1320;
          font-family: var(--font-body);
          font-size: 0.95rem;
          font-weight: 600;
          padding: 0.85rem 1.85rem;
          border-radius: 9999px;
          border: 1.5px solid rgba(112, 15, 99, 0.2);
          cursor: pointer;
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.04);
          transition: all 0.22s ease;
        }

        .btn-hero-brochure:hover {
          background: #FAF7FC;
          border-color: #700F63;
          transform: translateY(-2px);
          box-shadow: 0 6px 16px rgba(112, 15, 99, 0.12);
        }

        .hero-scroll-hint {
          display: flex;
          justify-content: center;
        }

        .btn-scroll-anchor {
          display: inline-flex;
          align-items: center;
          gap: 0.4rem;
          background: transparent;
          border: none;
          color: #8C8395;
          font-family: var(--font-body);
          font-size: 0.82rem;
          font-weight: 600;
          cursor: pointer;
          transition: color 0.2s ease;
          padding: 0.25rem 0.5rem;
        }

        .btn-scroll-anchor:hover {
          color: #700F63;
        }

        @media (max-width: 640px) {
          .franchise-hero-section {
            padding-top: calc(64px + 2rem);
            padding-bottom: 3rem;
          }
          .franchise-hero-cta-row {
            flex-direction: column;
            width: 100%;
          }
          .btn-hero-enquire,
          .btn-hero-brochure {
            width: 100%;
          }
        }
      `}</style>
    </section>
  );
};

export default FranchiseIntro;
