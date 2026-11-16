import { ArrowRight } from 'lucide-react';

export const FranchiseIntro = ({ onApplyClick }) => {
  return (
    <section className="franchise-hero-section">
      <div className="container">
        <div className="franchise-hero-header">
          <div className="section-label-wrapper">
            <span className="label-line" />
            <span className="section-label-text">FRANCHISE OPPORTUNITY</span>
            <span className="label-line" />
          </div>

          {/* Exact Required Heading: Own a Laundry Walii Franchise */}
          <h1 className="franchise-main-heading">
            Own a Laundry Walii <em>Franchise</em>
          </h1>

          {/* Exact Required Subtitle */}
          <p className="franchise-subheading">
            Join our growing laundry network and build a successful business with our proven franchise model.
          </p>

          <div className="franchise-hero-actions">
            <button
              type="button"
              onClick={onApplyClick}
              className="btn-franchise-hero-explore"
            >
              <span>Inquire About Our Franchise</span>
              <ArrowRight size={17} strokeWidth={2.2} />
            </button>
          </div>
        </div>
      </div>

      <style>{`
        .franchise-hero-section {
          padding-top: calc(72px + 3.25rem);
          padding-bottom: 4.5rem;
          background: #FAF7FC;
          position: relative;
          z-index: 2;
          border-bottom: 1px solid rgba(220, 204, 226, 0.45);
        }

        .franchise-hero-header {
          text-align: center;
          max-width: 780px;
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
          width: 48px;
          height: 1.5px;
          background-color: rgba(112, 15, 99, 0.38);
          border-radius: 2px;
        }

        .section-label-text {
          font-family: var(--font-body);
          font-size: 0.8rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.18em;
          color: #1A1320;
        }

        .franchise-main-heading {
          font-family: 'Playfair Display', Georgia, serif;
          font-style: italic;
          font-size: clamp(2.4rem, 4.8vw, 3.8rem);
          font-weight: 700;
          color: #1A1320;
          line-height: 1.15;
          margin: 0 0 1rem 0;
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
          font-size: clamp(1rem, 1.25vw, 1.15rem);
          color: #5C5564;
          line-height: 1.7;
          margin: 0 auto 2.25rem auto;
          max-width: 620px;
        }

        .franchise-hero-actions {
          display: flex;
          justify-content: center;
        }

        .btn-franchise-hero-explore {
          display: inline-flex;
          align-items: center;
          gap: 0.65rem;
          background: #700F63;
          color: #FFFFFF;
          font-family: var(--font-body);
          font-size: 0.98rem;
          font-weight: 600;
          padding: 0.88rem 2.25rem;
          border-radius: 9999px;
          border: none;
          cursor: pointer;
          box-shadow: 0 4px 16px rgba(112, 15, 99, 0.25);
          transition: all 0.25s ease;
        }

        .btn-franchise-hero-explore:hover {
          background: #590A4E;
          transform: translateY(-2px);
          box-shadow: 0 8px 22px rgba(112, 15, 99, 0.32);
        }

        @media (max-width: 480px) {
          .btn-franchise-hero-explore {
            padding: 0.85rem 1.35rem;
            font-size: 0.92rem;
            max-width: 100%;
            white-space: normal;
            text-align: center;
          }
        }
      `}</style>
    </section>
  );
};

export default FranchiseIntro;
