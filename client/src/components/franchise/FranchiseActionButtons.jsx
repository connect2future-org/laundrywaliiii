import React, { useState } from 'react';
import { MessageCircle, FileText, ExternalLink } from 'lucide-react';
import { BRAND_CONFIG } from '../../config/brand';

export const FranchiseActionButtons = ({ onBrochureClick }) => {
  const [showFallback, setShowFallback] = useState(false);

  const prefilledMessage =
`Hello Laundry Waliiii Team,

I am interested in owning a Laundry Waliiii franchise. I would like to know more about the available franchise models, investment requirements, setup process, and business opportunities.

Please share the details with me.

Thank you!`.trim();

  const whatsappUrl = `https://wa.me/91${BRAND_CONFIG.contact.phone}?text=${encodeURIComponent(prefilledMessage)}`;

  const handleEnquireClick = (e) => {
    // Open in new tab/window via wa.me click-to-chat
    const newWindow = window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
    if (!newWindow || newWindow.closed || typeof newWindow.closed === 'undefined') {
      // Pop-up blocker triggered -> display direct fallback link
      setShowFallback(true);
    }
  };

  return (
    <section className="franchise-final-cta-section" id="franchise-contact">
      <div className="container">
        <div className="cta-content-wrap">
          {/* Section Label */}
          <div className="section-label-wrapper">
            <span className="label-line" />
            <span className="section-label-text">TAKE THE NEXT STEP</span>
            <span className="label-line" />
          </div>

          {/* Exact Heading */}
          <h2 className="cta-main-heading">
            Ready to Start Your Laundry Business?
          </h2>

          {/* Exact Supporting Description */}
          <p className="cta-subheading">
            Take the next step towards owning your Laundry Waliiii franchise. Explore our franchise opportunities or download our detailed brochure to learn more.
          </p>

          {/* Exactly TWO Action Buttons */}
          <div className="cta-buttons-group">
            {/* Button 1: Enquire About Franchise (Direct WhatsApp) */}
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={handleEnquireClick}
              className="btn-action-whatsapp"
              aria-label="Enquire About Franchise on WhatsApp"
            >
              <MessageCircle size={19} strokeWidth={2.3} />
              <span>Enquire About Franchise</span>
            </a>

            {/* Button 2: Download Franchise Brochure */}
            <button
              type="button"
              onClick={onBrochureClick}
              className="btn-action-brochure"
              aria-label="Download Official Franchise Brochure"
            >
              <FileText size={19} strokeWidth={2.2} />
              <span>Download Franchise Brochure</span>
            </button>
          </div>

          {/* Fallback link if browser blocked redirect */}
          {showFallback && (
            <div className="whatsapp-fallback-notice">
              <span>Browser blocked WhatsApp redirect? </span>
              <a href={whatsappUrl} target="_blank" rel="noopener noreferrer">
                Click here to chat on WhatsApp <ExternalLink size={12} />
              </a>
            </div>
          )}
        </div>
      </div>

      <style>{`
        .franchise-final-cta-section {
          padding: 5.5rem 0 6rem;
          background: linear-gradient(180deg, #FAF7FC 0%, #FFFFFF 100%);
          text-align: center;
          position: relative;
          z-index: 2;
        }

        .cta-content-wrap {
          max-width: 760px;
          margin: 0 auto;
        }

        .section-label-wrapper {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 0.85rem;
          margin-bottom: 0.85rem;
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

        .cta-main-heading {
          font-family: 'Playfair Display', Georgia, serif;
          font-style: italic;
          font-size: clamp(2.2rem, 4vw, 3rem);
          font-weight: 700;
          color: #1A1320;
          line-height: 1.2;
          margin: 0 0 0.85rem;
          letter-spacing: -0.015em;
        }

        .cta-subheading {
          font-family: var(--font-body);
          font-size: 1.05rem;
          color: #5C5564;
          line-height: 1.68;
          max-width: 640px;
          margin: 0 auto 2.5rem;
        }

        .cta-buttons-group {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 1.25rem;
          flex-wrap: wrap;
        }

        .btn-action-whatsapp {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 0.65rem;
          background: #700F63;
          color: #FFFFFF;
          text-decoration: none;
          font-family: var(--font-body);
          font-size: 1rem;
          font-weight: 600;
          padding: 0.95rem 2.25rem;
          border-radius: 9999px;
          box-shadow: 0 6px 20px rgba(112, 15, 99, 0.28);
          transition: all 0.22s ease;
          border: 1px solid transparent;
        }

        .btn-action-whatsapp:hover {
          background: #590A4E;
          transform: translateY(-2px);
          box-shadow: 0 10px 28px rgba(112, 15, 99, 0.38);
        }

        .btn-action-brochure {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 0.65rem;
          background: #FFFFFF;
          color: #1A1320;
          font-family: var(--font-body);
          font-size: 1rem;
          font-weight: 600;
          padding: 0.95rem 2.25rem;
          border-radius: 9999px;
          border: 1.5px solid rgba(112, 15, 99, 0.22);
          cursor: pointer;
          box-shadow: 0 4px 14px rgba(45, 15, 55, 0.05);
          transition: all 0.22s ease;
        }

        .btn-action-brochure:hover {
          background: #FAF7FC;
          border-color: #700F63;
          transform: translateY(-2px);
          box-shadow: 0 8px 22px rgba(112, 15, 99, 0.12);
        }

        .whatsapp-fallback-notice {
          margin-top: 1.25rem;
          font-family: var(--font-body);
          font-size: 0.85rem;
          color: #5C5564;
        }

        .whatsapp-fallback-notice a {
          color: #700F63;
          font-weight: 600;
          text-decoration: underline;
          display: inline-flex;
          align-items: center;
          gap: 0.25rem;
        }

        @media (max-width: 640px) {
          .cta-buttons-group {
            flex-direction: column;
            width: 100%;
          }
          .btn-action-whatsapp,
          .btn-action-brochure {
            width: 100%;
          }
          .franchise-final-cta-section {
            padding: 4rem 0 4.5rem;
          }
        }
      `}</style>
    </section>
  );
};

export default FranchiseActionButtons;
