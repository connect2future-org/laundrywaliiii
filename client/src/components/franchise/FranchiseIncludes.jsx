import React from 'react';
import { Cog, Headphones, GraduationCap, Megaphone, CheckCircle2 } from 'lucide-react';

export const FRANCHISE_INCLUDES_DATA = [
  {
    id: 1,
    title: 'Premium imported commercial equipment from South Korea (LG Commercial) and Germany',
    icon: Cog
  },
  {
    id: 2,
    title: '24×7 Technical Assistance',
    icon: Headphones
  },
  {
    id: 3,
    title: 'Complete Operational & Staff Training',
    icon: GraduationCap
  },
  {
    id: 4,
    title: 'Marketing & Branding Support',
    icon: Megaphone
  }
];

export const FranchiseIncludes = () => {
  return (
    <section className="franchise-includes-section">
      <div className="container">
        {/* Section Header */}
        <div className="includes-header">
          <div className="section-label-wrapper">
            <span className="label-line" />
            <span className="section-label-text">COMPREHENSIVE SUPPORT</span>
            <span className="label-line" />
          </div>

          <h2 className="includes-main-heading">
            What's Included with Every Franchise
          </h2>

          <p className="includes-subheading">
            Every Laundry Walii franchise partner receives full operational backing from day one to ensure uncompromising service quality.
          </p>
        </div>

        {/* 2-Column Grid on Desktop, Stacked on Mobile */}
        <div className="includes-two-col-grid">
          {FRANCHISE_INCLUDES_DATA.map((item, index) => {
            const Icon = item.icon;
            return (
              <div key={item.id} className="include-card">
                <div className="include-icon-wrap">
                  <Icon size={24} />
                </div>

                <div className="include-content">
                  <div className="include-number-tag">
                    <CheckCircle2 size={15} className="tag-check-icon" />
                    <span>Benefit 0{index + 1}</span>
                  </div>
                  <h3 className="include-text">{item.title}</h3>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <style>{`
        .franchise-includes-section {
          padding: 5rem 0;
          background: #FAF7FC;
          position: relative;
          z-index: 2;
          border-top: 1px solid rgba(220, 204, 226, 0.65);
          border-bottom: 1px solid rgba(220, 204, 226, 0.65);
        }

        .includes-header {
          text-align: center;
          max-width: 720px;
          margin: 0 auto 3.5rem;
        }

        .section-label-wrapper {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 0.75rem;
          margin-bottom: 0.85rem;
        }

        .label-line {
          width: 24px;
          height: 2px;
          background-color: #700F63;
        }

        .section-label-text {
          font-family: var(--font-body);
          font-size: 0.8rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.12em;
          color: #171421;
        }

        .includes-main-heading {
          font-family: var(--font-heading);
          font-style: italic;
          font-size: clamp(2rem, 3.8vw, 2.75rem);
          font-weight: 700;
          color: #171421;
          line-height: 1.2;
          margin-bottom: 0.75rem;
        }

        .includes-subheading {
          font-family: var(--font-body);
          font-size: 1.02rem;
          color: #45414D;
          line-height: 1.65;
          margin: 0 auto;
        }

        .includes-two-col-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 2rem;
          max-width: 1040px;
          margin: 0 auto;
        }

        .include-card {
          background: #FFFFFF;
          border: 1px solid rgba(220, 204, 226, 0.75);
          border-radius: 24px;
          padding: 2.25rem 2rem;
          box-shadow: 0 6px 24px rgba(70, 18, 75, 0.04);
          display: flex;
          align-items: flex-start;
          gap: 1.5rem;
          transition: transform 0.25s ease, box-shadow 0.25s ease, border-color 0.25s ease;
        }

        .include-card:hover {
          transform: translateY(-3px);
          box-shadow: 0 12px 32px rgba(70, 18, 75, 0.09);
          border-color: rgba(112, 15, 99, 0.35);
        }

        .include-icon-wrap {
          width: 54px;
          height: 54px;
          border-radius: 50%;
          background: #F6EEF8;
          color: #700F63;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .include-content {
          flex: 1;
        }

        .include-number-tag {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          font-family: var(--font-body);
          font-size: 0.75rem;
          font-weight: 700;
          color: #700F63;
          text-transform: uppercase;
          letter-spacing: 0.06em;
          margin-bottom: 0.5rem;
        }

        .tag-check-icon {
          color: #700F63;
        }

        .include-text {
          font-family: var(--font-heading);
          font-size: 1.25rem;
          font-weight: 600;
          color: #171421;
          line-height: 1.45;
          margin: 0;
        }

        @media (max-width: 768px) {
          .includes-two-col-grid {
            grid-template-columns: 1fr;
            gap: 1.25rem;
          }
          .include-card {
            padding: 1.75rem 1.5rem;
          }
        }
      `}</style>
    </section>
  );
};

export default FranchiseIncludes;

