import React from 'react';
import { TrendingUp, Smartphone, GraduationCap, Megaphone, Truck, ShieldCheck, Award } from 'lucide-react';
import { FRANCHISE_BENEFITS } from '../../config/business';

const getBenefitIcon = (iconName) => {
  switch (iconName) {
    case 'TrendingUp':
      return TrendingUp;
    case 'Smartphone':
      return Smartphone;
    case 'GraduationCap':
      return GraduationCap;
    case 'Megaphone':
      return Megaphone;
    case 'Truck':
      return Truck;
    case 'ShieldCheck':
      return ShieldCheck;
    default:
      return Award;
  }
};

export const FranchiseBenefits = () => {
  return (
    <section className="franchise-benefits-section">
      <div className="container">
        <div className="benefits-header">
          <div className="section-label-wrapper">
            <span className="label-line" />
            <span className="section-label-text">PARTNER ADVANTAGES</span>
            <span className="label-line" />
          </div>

          <h2 className="benefits-main-heading">
            Operational <em>Infrastructure.</em>
          </h2>

          <p className="benefits-subheading">
            From store layout planning to cloud software and doorstep logistics, we provide end-to-end partner support.
          </p>
        </div>

        <div className="benefits-grid">
          {FRANCHISE_BENEFITS.map((benefit, index) => {
            const Icon = getBenefitIcon(benefit.icon);

            return (
              <div key={index} className="benefit-card">
                <div className="benefit-icon-bubble">
                  <Icon size={22} />
                </div>

                <h3 className="benefit-title">{benefit.title}</h3>
                <p className="benefit-desc">{benefit.desc}</p>
              </div>
            );
          })}
        </div>
      </div>

      <style>{`
        .franchise-benefits-section {
          padding: 5rem 0;
          background: #FAF7FC;
          position: relative;
          z-index: 2;
        }

        .benefits-header {
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

        .benefits-main-heading {
          font-family: var(--font-heading);
          font-style: italic;
          font-size: clamp(2rem, 3.8vw, 2.75rem);
          font-weight: 700;
          color: #171421;
          line-height: 1.2;
          margin-bottom: 0.75rem;
        }

        .benefits-main-heading em {
          font-family: var(--font-serif);
          font-style: italic;
          font-weight: 700;
          color: #700F63;
        }

        .benefits-subheading {
          font-family: var(--font-body);
          font-size: 1.02rem;
          color: #45414D;
          line-height: 1.65;
          margin: 0 auto;
        }

        .benefits-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(310px, 1fr));
          gap: 2rem;
        }

        .benefit-card {
          background: #FFFFFF;
          border: 1px solid rgba(220, 204, 226, 0.75);
          border-radius: 24px;
          padding: 2.25rem 2rem;
          box-shadow: 0 6px 24px rgba(70, 18, 75, 0.04);
          display: flex;
          flex-direction: column;
          transition: transform 0.25s, box-shadow 0.25s, border-color 0.25s;
        }

        .benefit-card:hover {
          transform: translateY(-3px);
          box-shadow: 0 12px 32px rgba(70, 18, 75, 0.09);
          border-color: rgba(112, 15, 99, 0.35);
        }

        .benefit-icon-bubble {
          width: 48px;
          height: 48px;
          border-radius: 50%;
          background: #F6EEF8;
          color: #700F63;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 1.25rem;
        }

        .benefit-title {
          font-family: var(--font-heading);
          font-size: 1.25rem;
          font-weight: 700;
          color: #171421;
          margin-bottom: 0.5rem;
        }

        .benefit-desc {
          font-family: var(--font-body);
          font-size: 0.92rem;
          color: #45414D;
          line-height: 1.6;
          margin: 0;
        }
      `}</style>
    </section>
  );
};

export default FranchiseBenefits;
