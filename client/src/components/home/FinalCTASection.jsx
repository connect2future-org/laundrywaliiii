import React from 'react';
import { Link, useOutletContext } from 'react-router-dom';
import { Truck } from 'lucide-react';

export const FinalCTASection = () => {
  const outletCtx = useOutletContext();
  const openCheckout = outletCtx?.openCheckout;

  const handleBookClick = (e) => {
    if (openCheckout) {
      e.preventDefault();
      openCheckout();
    }
  };

  return (
    <section className="sakura-cta-section" aria-label="Book Pickup Call to Action">
      <div className="container cta-content-container">
        {/* Headline */}
        <h2 className="cta-editorial-title">
          Ready for Fresher,<br />
          <span className="title-serif-accent">Happier Clothes?</span>
        </h2>

        {/* Subtitle */}
        <p className="cta-editorial-desc">
          Schedule your pickup today and experience laundry the smarter way.
        </p>

        {/* Action Button: Deep Purple Book Pickup */}
        <div className="cta-action-wrap">
          {openCheckout ? (
            <button
              type="button"
              onClick={handleBookClick}
              className="btn-cta-berry"
            >
              <Truck size={19} strokeWidth={2.2} />
              <span>Book Pickup</span>
            </button>
          ) : (
            <Link to="/contact" className="btn-cta-berry">
              <Truck size={19} strokeWidth={2.2} />
              <span>Book Pickup</span>
            </Link>
          )}
        </div>
      </div>

      <style>{`
        .sakura-cta-section {
          position: relative;
          background: #FAF7FC;
          border-top: 1px solid rgba(220, 204, 226, 0.65);
          padding-top: clamp(3.5rem, 5vw, 4.75rem);
          padding-bottom: clamp(3.5rem, 5vw, 4.5rem);
          overflow: hidden;
          text-align: center;
        }

        /* Content Container */
        .cta-content-container {
          position: relative;
          z-index: 4;
          max-width: 820px;
          margin: 0 auto;
          padding: 0 1.5rem;
        }

        /* Headline */
        .cta-editorial-title {
          font-family: 'Playfair Display', Georgia, serif;
          font-style: italic;
          font-size: clamp(2.25rem, 4.4vw, 3.5rem);
          font-weight: 700;
          color: #171421;
          line-height: 1.15;
          letter-spacing: -0.015em;
          margin: 0 0 1rem;
        }

        .title-serif-accent {
          color: #700F63;
        }

        /* Subtitle */
        .cta-editorial-desc {
          font-family: 'DM Sans', sans-serif;
          font-size: clamp(0.98rem, 1.3vw, 1.12rem);
          color: #45414D;
          max-width: 580px;
          margin: 0 auto clamp(1.75rem, 2.5vw, 2.25rem);
          line-height: 1.55;
        }

        /* Action Wrap & Button */
        .cta-action-wrap {
          display: flex;
          justify-content: center;
          align-items: center;
        }

        .btn-cta-berry {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 0.65rem;
          background: #700F63;
          color: #FFFFFF;
          padding: 0.95rem 2.3rem;
          border-radius: 9999px;
          font-family: 'DM Sans', sans-serif;
          font-size: 1.02rem;
          font-weight: 600;
          text-decoration: none;
          box-shadow: 0 6px 18px rgba(112, 15, 99, 0.24);
          transition: all 0.25s ease;
          border: 1px solid transparent;
          cursor: pointer;
        }

        .btn-cta-berry:hover {
          background: #590A4E;
          transform: translateY(-2px);
          box-shadow: 0 10px 24px rgba(112, 15, 99, 0.32);
          color: #FFFFFF;
        }

        @media (max-width: 768px) {
          .sakura-cta-section {
            padding-top: 3rem;
            padding-bottom: 3rem;
          }
          .btn-cta-berry {
            padding: 0.85rem 1.85rem;
            font-size: 0.98rem;
          }
        }
      `}</style>
    </section>
  );
};

export default FinalCTASection;
