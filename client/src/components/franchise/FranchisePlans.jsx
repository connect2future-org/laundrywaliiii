import React from 'react';
import { Store, Building, Sparkles, ArrowRight } from 'lucide-react';

export const FRANCHISE_PLANS_DATA = [
  {
    id: 'express-kiosk',
    name: 'Express Kiosk',
    badge: 'Fast Setup',
    icon: Store,
    areaRequired: '180–250 sq. ft.',
    investment: '₹14 Lakhs',
    estimatedRevenue: 'approx ₹2 Lakhs (after 6 months)',
    revenueShare: '70:30',
    estimatedRoi: '12 Months'
  },
  {
    id: 'standard-outlet',
    name: 'Standard Outlet',
    badge: 'Most Popular',
    isPopular: true,
    icon: Store,
    areaRequired: '180–250 sq. ft.',
    investment: '₹18 Lakhs',
    estimatedRevenue: 'approx ₹3 Lakhs (after 6 months)',
    revenueShare: '70:30',
    estimatedRoi: '18 Months'
  },
  {
    id: 'premium-center',
    name: 'Premium Center',
    badge: 'High Capacity',
    icon: Building,
    areaRequired: '180–250 sq. ft.',
    investment: '₹24 Lakhs',
    estimatedRevenue: 'approx ₹4 Lakhs (after 6 months)',
    revenueShare: '70:30',
    estimatedRoi: '18 Months'
  }
];

export const FranchisePlans = ({ onSelectPlan }) => {
  return (
    <section className="franchise-plans-section">
      <div className="container">
        {/* Section Header */}
        <div className="plans-header">
          <div className="section-label-wrapper">
            <span className="label-line" />
            <span className="section-label-text">INVESTMENT OPTIONS</span>
            <span className="label-line" />
          </div>

          <h2 className="plans-main-heading">
            Franchise Investment <em>Plans</em>
          </h2>

          <p className="plans-subheading">
            Select the franchise model tailored to your investment budget, retail footprint, and territory scale.
          </p>
        </div>

        {/* 3 Investment Cards Grid */}
        <div className="plans-cards-grid">
          {FRANCHISE_PLANS_DATA.map((plan) => {
            const Icon = plan.icon;
            return (
              <div
                key={plan.id}
                className={`plan-card ${plan.isPopular ? 'popular-plan' : ''}`}
              >
                {/* Popular Ribbon / Badge */}
                {plan.badge && (
                  <div className="plan-badge-pill">
                    <Sparkles size={12} />
                    <span>{plan.badge}</span>
                  </div>
                )}

                {/* Plan Header */}
                <div className="plan-card-header">
                  <div className="plan-icon-bubble">
                    <Icon size={24} />
                  </div>
                  <h3 className="plan-type-heading">{plan.name}</h3>
                </div>

                {/* 5 Information Fields in Exact Required Order */}
                <div className="plan-specs-list">
                  {/* Field 1: Area Required */}
                  <div className="spec-row">
                    <span className="spec-label">Area Required:</span>
                    <strong className="spec-value">{plan.areaRequired}</strong>
                  </div>

                  {/* Field 2: Investment */}
                  <div className="spec-row highlight-investment">
                    <span className="spec-label">Investment:</span>
                    <strong className="spec-value investment-value">{plan.investment}</strong>
                  </div>

                  {/* Field 3: Estimated Monthly Revenue */}
                  <div className="spec-row">
                    <span className="spec-label">Estimated Monthly Revenue:</span>
                    <strong className="spec-value">{plan.estimatedRevenue}</strong>
                  </div>

                  {/* Field 4: Revenue Share */}
                  <div className="spec-row">
                    <span className="spec-label">Revenue Share:</span>
                    <strong className="spec-value">{plan.revenueShare}</strong>
                  </div>

                  {/* Field 5: Estimated ROI */}
                  <div className="spec-row">
                    <span className="spec-label">Estimated ROI:</span>
                    <strong className="spec-value">{plan.estimatedRoi}</strong>
                  </div>
                </div>

                {/* Action CTA within Card */}
                {onSelectPlan && (
                  <div className="plan-card-action">
                    <button
                      type="button"
                      onClick={() => onSelectPlan(plan)}
                      className={`btn-select-plan ${plan.isPopular ? 'btn-popular' : ''}`}
                    >
                      <span>Choose {plan.name}</span>
                      <ArrowRight size={15} />
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      <style>{`
        .franchise-plans-section {
          padding: 5rem 0;
          background: #FAF7FC;
          position: relative;
          z-index: 2;
        }

        .plans-header {
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

        .plans-main-heading {
          font-family: var(--font-heading);
          font-style: italic;
          font-size: clamp(2rem, 3.8vw, 2.75rem);
          font-weight: 700;
          color: #171421;
          line-height: 1.2;
          margin-bottom: 0.75rem;
        }

        .plans-main-heading em {
          font-family: var(--font-serif);
          font-style: italic;
          font-weight: 700;
          color: #700F63;
        }

        .plans-subheading {
          font-family: var(--font-body);
          font-size: 1.02rem;
          color: #45414D;
          line-height: 1.65;
          margin: 0 auto;
        }

        .plans-cards-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 2rem;
          align-items: stretch;
        }

        .plan-card {
          background: #FFFFFF;
          border: 1px solid rgba(220, 204, 226, 0.75);
          border-radius: 28px;
          padding: 2.5rem 2rem;
          box-shadow: 0 6px 24px rgba(70, 18, 75, 0.04);
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          position: relative;
          transition: transform 0.25s ease, box-shadow 0.25s ease, border-color 0.25s ease;
        }

        .plan-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 12px 32px rgba(70, 18, 75, 0.09);
          border-color: rgba(112, 15, 99, 0.35);
        }

        .plan-card.popular-plan {
          border-color: #700F63;
          box-shadow: 0 10px 32px rgba(112, 15, 99, 0.12);
        }

        .plan-badge-pill {
          position: absolute;
          top: -12px;
          right: 24px;
          display: inline-flex;
          align-items: center;
          gap: 5px;
          background: #700F63;
          color: #FFFFFF;
          font-family: var(--font-body);
          font-size: 0.74rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.06em;
          padding: 5px 14px;
          border-radius: 9999px;
          box-shadow: 0 4px 12px rgba(112, 15, 99, 0.26);
        }

        .plan-card-header {
          text-align: center;
          margin-bottom: 2rem;
          padding-bottom: 1.5rem;
          border-bottom: 1px solid rgba(220, 204, 226, 0.55);
        }

        .plan-icon-bubble {
          width: 58px;
          height: 58px;
          border-radius: 50%;
          background: #F6EEF8;
          color: #700F63;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 1.15rem;
        }

        .plan-type-heading {
          font-family: var(--font-heading);
          font-size: 1.6rem;
          font-weight: 700;
          color: #171421;
          margin: 0;
          letter-spacing: -0.01em;
        }

        .plan-specs-list {
          display: flex;
          flex-direction: column;
          gap: 1rem;
          flex: 1;
          margin-bottom: 2rem;
        }

        .spec-row {
          display: flex;
          flex-direction: column;
          gap: 0.25rem;
          padding: 0.75rem 1rem;
          background: #FCFAFC;
          border-radius: 14px;
          border: 1px solid rgba(220, 204, 226, 0.5);
        }

        .spec-row.highlight-investment {
          background: #F8F2F9;
          border-color: rgba(112, 15, 99, 0.22);
        }

        .spec-label {
          font-family: var(--font-body);
          font-size: 0.8rem;
          color: #77717D;
          text-transform: uppercase;
          letter-spacing: 0.04em;
          font-weight: 600;
        }

        .spec-value {
          font-family: var(--font-body);
          font-size: 0.98rem;
          color: #171421;
          font-weight: 700;
          line-height: 1.4;
        }

        .investment-value {
          font-family: var(--font-heading);
          font-size: 1.35rem;
          color: #700F63;
          font-weight: 700;
        }

        .plan-card-action {
          margin-top: auto;
        }

        .btn-select-plan {
          width: 100%;
          padding: 0.85rem 1.25rem;
          font-family: var(--font-body);
          font-size: 0.92rem;
          font-weight: 600;
          background: #FFFFFF;
          color: #171421;
          border: 1px solid rgba(220, 204, 226, 0.75);
          border-radius: 9999px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .btn-select-plan:hover {
          border-color: #700F63;
          color: #700F63;
          background: #F8F2F9;
          transform: translateY(-2px);
        }

        .btn-popular {
          background: #700F63;
          color: #FFFFFF;
          border-color: #700F63;
          box-shadow: 0 4px 14px rgba(112, 15, 99, 0.22);
        }

        .btn-popular:hover {
          background: #590A4E;
          color: #FFFFFF;
          border-color: #590A4E;
          box-shadow: 0 6px 18px rgba(112, 15, 99, 0.3);
        }

        @media (max-width: 1024px) {
          .plans-cards-grid {
            grid-template-columns: 1fr;
            max-width: 580px;
            margin: 0 auto;
          }
        }
      `}</style>
    </section>
  );
};

export default FranchisePlans;

