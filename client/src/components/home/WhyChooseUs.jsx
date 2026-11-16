import { useEffect } from 'react';
import { Heart, Leaf, Droplets, WashingMachine, Network } from 'lucide-react';

/* Custom precision Lucide-style outline icons (24x24 viewBox, strokeWidth 2) */
const SparkleIcon = (props) => (
  <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="m12 3-1.9 6.1a2 2 0 0 1-1.2 1.2L2.8 12l6.1 1.9a2 2 0 0 1 1.2 1.2L12 21.2l1.9-6.1a2 2 0 0 1 1.2-1.2l6.1-1.9-6.1-1.9a2 2 0 0 1-1.2-1.2Z" />
  </svg>
);

const MoneyBagIcon = (props) => (
  <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M10 4h4a2 2 0 0 1 2 2v1h-8V6a2 2 0 0 1 2-2Z" />
    <path d="M6 9a5 5 0 0 1 5-2h2a5 5 0 0 1 5 2c2 3.5 1.5 8-1 11a7 7 0 0 1-5 2h0a7 7 0 0 1-5-2C4.5 17 4 12.5 6 9Z" />
    <path d="M9.5 11h4" />
    <path d="M9.5 13.5h3.5" />
    <path d="M10 11v5" />
    <path d="M12 13.5l2 2.5" />
  </svg>
);

const UvShieldIcon = (props) => (
  <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    <path d="M8.5 9v3a1.5 1.5 0 0 0 3 0V9" />
    <path d="M13 9l1.5 6 1.5-6" />
    <path d="M12 2v-1" />
    <path d="M5 4L4 3" />
    <path d="M19 4l1-1" />
    <path d="M2 10H1" />
    <path d="M23 10h-1" />
  </svg>
);

const ScooterDeliveryIcon = (props) => (
  <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <circle cx="6" cy="18" r="2.5" />
    <circle cx="18" cy="18" r="2.5" />
    <path d="M10 18h4.5a1.5 1.5 0 0 0 1.5-1.5V13l-3-4H8.5" />
    <path d="M13 9h-3" />
    <path d="M18 15.5V10l-2-2" />
    <path d="M2.5 12h2.5" />
    <path d="M1.5 15h2.5" />
  </svg>
);

const TeamStarIcon = (props) => (
  <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <circle cx="12" cy="14" r="2.5" />
    <path d="M8 21v-1a4 4 0 0 1 8 0v1" />
    <circle cx="5" cy="15" r="2" />
    <path d="M2 21v-.8a3.5 3.5 0 0 1 4.5-3.3" />
    <circle cx="19" cy="15" r="2" />
    <path d="M17.5 16.9a3.5 3.5 0 0 1 4.5 3.3v.8" />
    <polygon points="12 3 13 5.5 15.5 5.8 13.7 7.4 14.1 10 12 8.7 9.9 10 10.3 7.4 8.5 5.8 11 5.5 12 3" />
  </svg>
);

const FEATURES = [
  { id: 'expert-assistance', Icon: SparkleIcon, lines: ['Expert', 'Assistance'] },
  { id: 'on-demand-service', Icon: Heart, lines: ['On-Demand', 'Service'] },
  { id: 'cost-effective', Icon: MoneyBagIcon, lines: ['Cost-Effective'] },
  { id: 'biodegradable-products', Icon: Leaf, lines: ['Biodegradable', 'Products'] },
  { id: 'uv-safe-air-drying', Icon: UvShieldIcon, lines: ['UV Safe', 'Air Drying'] },
  { id: 'uses-less-fresh-water', Icon: Droplets, lines: ['Uses Less &', 'Fresh Water'] },
  { id: 'in-house-processing', Icon: WashingMachine, lines: ['In-House', 'Processing Facility'] },
  { id: 'modern-technology', Icon: Network, lines: ['Modern', 'Technology'] },
  { id: 'home-delivery', Icon: ScooterDeliveryIcon, lines: ['Home Delivery'] },
  { id: 'skilled-trained-staff', Icon: TeamStarIcon, lines: ['Skilled and', 'Trained Staff'] }
];

export const WhyChooseUs = () => {
  useEffect(() => {
    const handleHash = () => {
      if (window.location.hash === '#why-choose-us') {
        const el = document.getElementById('why-choose-us');
        if (el) {
          window.scrollTo(0, el.offsetTop);
        }
      }
    };
    handleHash();
    window.addEventListener('hashchange', handleHash);
    return () => window.removeEventListener('hashchange', handleHash);
  }, []);

  return (
    <section className="sakura-why-section" id="why-choose-us" aria-label="Why Choose Laundry Waliii">
      {/* Main Center Content Container */}
      <div className="why-content-container">
        {/* Section Header */}
        <div className="why-header-centered">
          <div className="why-label-wrap">
            <span className="why-label-line" aria-hidden="true" />
            <span className="why-label-text">WHY CHOOSE US</span>
            <span className="why-label-line" aria-hidden="true" />
          </div>

          <h2 className="why-editorial-title">
            Care, Cleanliness &amp;<br />
            Convenience <span className="title-serif-accent">in Every Wash.</span>
          </h2>

          <p className="why-editorial-desc">
            A thoughtful laundry experience with the care your clothes deserve.
          </p>
        </div>

        {/* 10 Benefit Pill Buttons (5 per row on desktop) */}
        <div className="why-pills-grid" role="list">
          {FEATURES.map((feat) => {
            const IconComponent = feat.Icon;
            return (
              <div key={feat.id} className="why-pill-btn" role="listitem">
                <div className="why-pill-icon-wrap" aria-hidden="true">
                  <IconComponent className="why-pill-icon" />
                </div>
                <div className="why-pill-text">
                  {feat.lines.map((line, idx) => (
                    <span key={idx} className="why-pill-line">{line}</span>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <style>{`
        .sakura-why-section {
          position: relative;
          background: #FAF7FC;
          border-top: 1px solid rgba(224, 212, 228, 0.45);
          border-bottom: 1px solid rgba(224, 212, 228, 0.45);
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          box-sizing: border-box;
          padding: clamp(3rem, 4.8vw, 4.5rem) 1.5rem;
          overflow: hidden;
          z-index: 1;
        }

        .why-content-container {
          position: relative;
          z-index: 5;
          max-width: 1200px;
          width: 100%;
          margin: 0 auto;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          box-sizing: border-box;
        }

        .why-header-centered {
          text-align: center;
          margin-bottom: clamp(2rem, 3.2vw, 3rem);
          max-width: 860px;
          width: 100%;
        }

        .why-label-wrap {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 1rem;
          margin-bottom: 0.85rem;
        }

        .why-label-line {
          width: 48px;
          height: 1.5px;
          background: rgba(112, 15, 99, 0.38);
          border-radius: 2px;
          display: inline-block;
        }

        .why-label-text {
          font-family: 'DM Sans', -apple-system, BlinkMacSystemFont, sans-serif;
          font-size: 0.8rem;
          font-weight: 700;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          color: #1A1320;
        }

        .why-editorial-title {
          font-family: 'Playfair Display', Georgia, serif;
          font-style: italic;
          font-size: clamp(2.2rem, 3.5vw, 3.25rem);
          font-weight: 700;
          line-height: 1.15;
          letter-spacing: -0.015em;
          color: #1A1320;
          margin: 0 0 0.75rem 0;
        }

        .title-serif-accent {
          font-style: italic;
          font-weight: 700;
          color: #700F63;
        }

        .why-editorial-desc {
          font-family: 'DM Sans', -apple-system, BlinkMacSystemFont, sans-serif;
          font-size: clamp(0.98rem, 1.2vw, 1.1rem);
          font-weight: 400;
          line-height: 1.55;
          color: #5C5564;
          margin: 0 auto;
          max-width: 660px;
        }

        .why-pills-grid {
          display: grid;
          grid-template-columns: repeat(5, 1fr);
          gap: clamp(0.75rem, 1.15vw, 1.15rem);
          width: 100%;
          max-width: 1180px;
          margin: 0 auto;
        }

        .why-pill-btn {
          background: #FFFFFF;
          border-radius: 9999px;
          min-height: clamp(54px, 4.2vw, 62px);
          padding: 0.65rem 1.15rem;
          display: flex;
          align-items: center;
          justify-content: flex-start;
          gap: 0.75rem;
          box-shadow: 0 4px 16px rgba(45, 15, 55, 0.035);
          border: 1px solid rgba(224, 212, 228, 0.75);
          transition: all 0.25s ease;
          user-select: none;
          box-sizing: border-box;
        }

        .why-pill-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 22px rgba(112, 15, 99, 0.09);
          border-color: rgba(112, 15, 99, 0.35);
        }

        .why-pill-icon-wrap {
          flex-shrink: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #700F63;
          width: 26px;
          height: 26px;
        }

        .why-pill-icon {
          width: 100%;
          height: 100%;
          stroke-width: 2px;
          display: block;
        }

        .why-pill-text {
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          justify-content: center;
          text-align: left;
        }

        .why-pill-line {
          font-family: 'DM Sans', -apple-system, BlinkMacSystemFont, sans-serif;
          font-size: clamp(0.82rem, 0.88vw, 0.94rem);
          font-weight: 600;
          line-height: 1.25;
          letter-spacing: -0.01em;
          color: #1A1320;
          white-space: nowrap;
        }

        @media (max-width: 960px) {
          .why-pills-grid {
            grid-template-columns: repeat(3, 1fr);
            gap: 0.95rem;
            max-width: 820px;
          }
          .why-editorial-title {
            font-size: clamp(2rem, 4.5vw, 2.75rem);
          }
        }

        @media (max-width: 768px) {
          .sakura-why-section {
            padding: 3rem 1.25rem;
          }
          .why-header-centered {
            margin-bottom: 2rem;
          }
          .why-pills-grid {
            grid-template-columns: repeat(2, 1fr);
            gap: 0.75rem;
            max-width: 600px;
            width: 100%;
          }
          .why-pill-btn {
            border-radius: 16px;
            padding: 0.65rem 0.85rem;
            min-height: 56px;
            gap: 0.6rem;
          }
          .why-pill-icon-wrap {
            width: 22px;
            height: 22px;
          }
          .why-pill-line {
            font-size: 0.8rem;
            white-space: normal;
          }
        }

        @media (max-width: 480px) {
          .sakura-why-section {
            padding: 2.25rem 0.85rem;
          }
          .why-header-centered {
            margin-bottom: 1.5rem;
          }
          .why-editorial-title {
            font-size: 1.85rem;
            line-height: 1.2;
          }
          .why-editorial-desc {
            font-size: 0.92rem;
          }
          .why-pills-grid {
            grid-template-columns: repeat(2, 1fr);
            gap: 0.55rem;
            max-width: 100%;
          }
          .why-pill-btn {
            border-radius: 14px;
            padding: 0.55rem 0.65rem;
            min-height: 52px;
            gap: 0.5rem;
            justify-content: flex-start;
          }
          .why-pill-icon-wrap {
            width: 20px;
            height: 20px;
          }
          .why-pill-line {
            font-size: 0.75rem;
            line-height: 1.2;
            white-space: normal;
          }
        }

        @media (max-width: 340px) {
          .why-pill-btn {
            padding: 0.45rem 0.5rem;
            gap: 0.4rem;
          }
          .why-pill-icon-wrap {
            width: 18px;
            height: 18px;
          }
          .why-pill-line {
            font-size: 0.7rem;
          }
        }
      `}</style>
    </section>
  );
};

export default WhyChooseUs;
