import React, { useRef, useState } from 'react';
import FranchiseIntro from '../components/franchise/FranchiseIntro';
import FranchisePlans from '../components/franchise/FranchisePlans';
import FranchiseIncludes from '../components/franchise/FranchiseIncludes';
import FranchiseActionButtons from '../components/franchise/FranchiseActionButtons';
import FranchiseForm from '../components/franchise/FranchiseForm';

export const FranchisePage = () => {
  const formRef = useRef(null);
  const [selectedModel, setSelectedModel] = useState(null);

  const handleScrollToForm = () => {
    if (formRef.current) {
      formRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleSelectPlan = (plan) => {
    setSelectedModel(plan);
    handleScrollToForm();
  };

  return (
    <div className="franchise-page-root">
      {/* 1. Hero Section: Heading "Own a Laundry Walii Franchise" */}
      <FranchiseIntro onApplyClick={handleScrollToForm} />

      {/* 2. Franchise Investment Plans: Express Kiosk, Standard Outlet, Premium Center */}
      <FranchisePlans onSelectPlan={handleSelectPlan} />

      {/* 3. What's Included with Every Franchise: 4 exact benefits in 2-column layout */}
      <FranchiseIncludes />

      {/* 4. Franchise Action Buttons at the end of details */}
      <section className="franchise-cta-bar-section">
        <div className="container">
          <div className="section-label-wrapper">
            <span className="label-line" />
            <span className="section-label-text">GET STARTED TODAY</span>
            <span className="label-line" />
          </div>
          <h2 className="cta-bar-heading">
            Ready to Build Your Laundry Business?
          </h2>
          <p className="cta-bar-subheading">
            Connect with the Laundry Walii Team or request our comprehensive franchise overview.
          </p>

          <FranchiseActionButtons onEnquireClick={handleScrollToForm} />
        </div>
      </section>

      {/* 5. Franchise Enquiry Form */}
      <section ref={formRef} id="franchise-enquiry-form" className="franchise-enquiry-section">
        <div className="container" style={{ maxWidth: '880px' }}>
          <div className="enquiry-header-wrap">
            <div className="section-label-wrapper">
              <span className="label-line" />
              <span className="section-label-text">APPLICATION DESK</span>
              <span className="label-line" />
            </div>

            <h2 className="enquiry-main-heading">
              Franchise <em>Enquiry Form</em>
            </h2>

            <p className="enquiry-subheading">
              Submit your expression of interest below. The Laundry Walii Team will connect with you to discuss territory opportunities.
            </p>
          </div>

          <FranchiseForm preselectedModel={selectedModel} />
        </div>
      </section>

      <style>{`
        .franchise-page-root {
          background-color: #FAF7FC;
          min-height: 100vh;
          position: relative;
          overflow: hidden;
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

        /* CTA Bar Section */
        .franchise-cta-bar-section {
          padding: 5rem 0;
          background: #FAF7FC;
          text-align: center;
          position: relative;
          z-index: 2;
          border-top: 1px solid rgba(220, 204, 226, 0.45);
        }

        .cta-bar-heading {
          font-family: var(--font-heading);
          font-style: italic;
          font-size: clamp(2rem, 3.8vw, 2.75rem);
          font-weight: 700;
          color: #1A1320;
          margin-bottom: 0.75rem;
          letter-spacing: -0.015em;
        }

        .cta-bar-subheading {
          font-family: var(--font-body);
          font-size: 1.05rem;
          color: #5C5564;
          max-width: 620px;
          margin: 0 auto;
          line-height: 1.65;
        }

        /* Enquiry Form Section */
        .franchise-enquiry-section {
          padding: 5rem 0 6.5rem;
          background: #FFFFFF;
          position: relative;
          z-index: 2;
          border-top: 1px solid rgba(220, 204, 226, 0.6);
        }

        .enquiry-header-wrap {
          text-align: center;
          margin-bottom: 3rem;
        }

        .enquiry-main-heading {
          font-family: var(--font-heading);
          font-style: italic;
          font-size: clamp(2.2rem, 4vw, 3rem);
          font-weight: 700;
          color: #1A1320;
          margin-bottom: 0.75rem;
          letter-spacing: -0.015em;
        }

        .enquiry-main-heading em {
          font-family: var(--font-serif);
          font-style: italic;
          font-weight: 700;
          color: #700F63;
        }

        .enquiry-subheading {
          font-family: var(--font-body);
          font-size: 1.05rem;
          color: #5C5564;
          max-width: 640px;
          margin: 0 auto;
          line-height: 1.65;
        }

        @media (max-width: 768px) {
          .franchise-cta-bar-section,
          .franchise-enquiry-section {
            padding: 3.5rem 0;
          }
        }
      `}</style>
    </div>
  );
};

export default FranchisePage;
