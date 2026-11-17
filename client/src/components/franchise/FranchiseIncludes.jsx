import React from 'react';
import {
  Cog,
  Headphones,
  GraduationCap,
  Users,
  Megaphone,
  Rocket,
  Compass,
  CheckCircle2
} from 'lucide-react';

export const FRANCHISE_BENEFITS_DATA = [
  {
    id: 1,
    title: 'Premium Imported Commercial Equipment',
    description: 'Commercial laundry equipment from South Korea, including LG Commercial, and Germany, as specified in the official franchise materials.',
    icon: Cog
  },
  {
    id: 2,
    title: '24/7 Technical Assistance',
    description: 'Technical support and round-the-clock assistance to help maintain smooth business operations and eliminate downtime.',
    icon: Headphones
  },
  {
    id: 3,
    title: 'Complete Operational Training',
    description: 'Practical training covering daily operations, garment care methodologies, service management, and business processes.',
    icon: GraduationCap
  },
  {
    id: 4,
    title: 'Staff Training & Development',
    description: 'Comprehensive training and guidance to help staff maintain service quality, fabric-handling expertise, and operational standards.',
    icon: Users
  },
  {
    id: 5,
    title: 'Marketing & Branding Support',
    description: 'National and hyper-local brand identity, promotional collateral, digital marketing guidance, and high business visibility support.',
    icon: Megaphone
  },
  {
    id: 6,
    title: 'Business Setup & Launch Assistance',
    description: 'Turnkey architectural layout support, equipment installation guidance, and grand opening launch management.',
    icon: Rocket
  },
  {
    id: 7,
    title: 'Ongoing Business Guidance',
    description: 'Continued operational audits, supply chain backing, and strategic guidance to help franchise partners manage and grow their business profitably.',
    icon: Compass
  }
];

export const FranchiseIncludes = () => {
  return (
    <section className="franchise-includes-section" id="franchise-benefits">
      <div className="container">
        {/* Section Header */}
        <div className="includes-header">
          <div className="section-label-wrapper">
            <span className="label-line" />
            <span className="section-label-text">COMPREHENSIVE ECOSYSTEM</span>
            <span className="label-line" />
          </div>

          <h2 className="includes-main-heading">
            What's Included With Every Franchise?
          </h2>

          <p className="includes-subheading">
            We provide everything you need to establish, operate, and grow your laundry business with confidence.
          </p>
        </div>

        {/* Benefits Grid */}
        <div className="includes-benefits-grid">
          {FRANCHISE_BENEFITS_DATA.map((benefit, index) => {
            const Icon = benefit.icon;
            return (
              <div key={benefit.id} className="benefit-card">
                <div className="benefit-header">
                  <div className="benefit-icon-wrap">
                    <Icon size={24} />
                  </div>
                  <div className="benefit-tag">
                    <CheckCircle2 size={13} className="tag-check" />
                    <span>Benefit 0{index + 1}</span>
                  </div>
                </div>

                <h3 className="benefit-title">{benefit.title}</h3>
                <p className="benefit-description">{benefit.description}</p>
              </div>
            );
          })}
        </div>
      </div>

      <style>{`
        .franchise-includes-section {
          padding: 5.5rem 0;
          background: #FFFFFF;
          position: relative;
          z-index: 2;
          border-top: 1px solid rgba(220, 204, 226, 0.55);
          border-bottom: 1px solid rgba(220, 204, 226, 0.55);
        }

        .includes-header {
          text-align: center;
          max-width: 760px;
          margin: 0 auto 3.5rem;
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

        .includes-main-heading {
          font-family: 'Playfair Display', Georgia, serif;
          font-style: italic;
          font-size: clamp(2.2rem, 3.8vw, 3rem);
          font-weight: 700;
          color: #1A1320;
          line-height: 1.2;
          margin: 0 0 0.85rem;
          letter-spacing: -0.015em;
        }

        .includes-subheading {
          font-family: var(--font-body);
          font-size: 1.02rem;
          color: #5C5564;
          line-height: 1.65;
          margin: 0;
        }

        /* Benefits Grid */
        .includes-benefits-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 1.5rem;
        }

        .benefit-card {
          background: #FAF7FC;
          border-radius: 16px;
          padding: 1.85rem 1.6rem;
          border: 1px solid rgba(220, 204, 226, 0.65);
          display: flex;
          flex-direction: column;
          transition: transform 0.22s ease, box-shadow 0.22s ease, border-color 0.22s ease;
        }

        .benefit-card:hover {
          transform: translateY(-3px);
          box-shadow: 0 10px 28px rgba(112, 15, 99, 0.08);
          border-color: rgba(112, 15, 99, 0.25);
          background: #FFFFFF;
        }

        .benefit-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 1.25rem;
        }

        .benefit-icon-wrap {
          width: 48px;
          height: 48px;
          border-radius: 12px;
          background: #FAF2FB;
          color: #700F63;
          display: flex;
          align-items: center;
          justify-content: center;
          border: 1px solid rgba(112, 15, 99, 0.12);
        }

        .benefit-tag {
          display: inline-flex;
          align-items: center;
          gap: 0.35rem;
          font-family: var(--font-body);
          font-size: 0.72rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.06em;
          color: #700F63;
          background: #FAF2FB;
          padding: 0.28rem 0.65rem;
          border-radius: 9999px;
          border: 1px solid rgba(112, 15, 99, 0.1);
        }

        .tag-check {
          color: #700F63;
        }

        .benefit-title {
          font-family: 'Playfair Display', Georgia, serif;
          font-size: 1.2rem;
          font-weight: 700;
          color: #1A1320;
          line-height: 1.35;
          margin: 0 0 0.65rem;
        }

        .benefit-description {
          font-family: var(--font-body);
          font-size: 0.88rem;
          color: #5C5564;
          line-height: 1.6;
          margin: 0;
        }

        @media (max-width: 992px) {
          .includes-benefits-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }

        @media (max-width: 640px) {
          .includes-benefits-grid {
            grid-template-columns: 1fr;
          }
          .franchise-includes-section {
            padding: 4rem 0;
          }
        }
      `}</style>
    </section>
  );
};

export default FranchiseIncludes;
