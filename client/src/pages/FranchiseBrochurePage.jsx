import React from 'react';
import { Link } from 'react-router-dom';
import { FileText, ArrowRight, BookOpen, Layers, ShieldCheck, Sparkles, Printer } from 'lucide-react';

const BROCHURE_CHAPTERS = [
  {
    number: '01',
    title: 'Executive Summary & Mysore Heritage Brand',
    desc: 'The evolution of Laundry Waliiii into Mysore’s premier fabric care destination, combining modern aesthetic care with everyday reliability.'
  },
  {
    number: '02',
    title: 'Fabric Care Protocols & Standards',
    desc: 'Our specialized washing workflows: dedicated individual drums, calibrated soft-water treatments, and delicate dry-cleaning processes.'
  },
  {
    number: '03',
    title: 'Store Formats & Architectural Guidelines',
    desc: 'Signature pink & white design standards, ergonomic intake counters, and customer pickup lounges.'
  },
  {
    number: '04',
    title: 'Machinery Specifications & Sourcing',
    desc: 'Imported South Korean (LG Commercial) and German commercial equipment, Italian vacuum steam finishing tables, and cloud order tracking.'
  },
  {
    number: '05',
    title: 'Operator Training & Staff Certification',
    desc: 'Comprehensive staff onboarding covering fabric inspection, stain removal, and customer concierge service.'
  },
  {
    number: '06',
    title: 'Territory Exclusivity & Application Process',
    desc: 'Territory evaluation criteria, licensing documentation, and grand opening launch roadmap.'
  }
];

export const FranchiseBrochurePage = () => {
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="brochure-page-root">
      {/* Hero Header */}
      <section className="brochure-hero-section">
        <div className="container">
          <div className="brochure-hero-content">
            <div className="section-label-wrapper">
              <span className="label-line" />
              <span className="section-label-text">OFFICIAL PROSPECTUS</span>
              <span className="label-line" />
            </div>

            <h1 className="brochure-main-heading">
              Franchise Operations <em>Brochure</em>
            </h1>

            <p className="brochure-subheading">
              A comprehensive blueprint detailing equipment standards, retail studio layouts, operational workflows, and territory exclusivity guidelines.
            </p>

            <div className="brochure-hero-actions">
              <button
                type="button"
                onClick={handlePrint}
                className="btn-print-brochure"
              >
                <Printer size={17} />
                <span>Print Prospectus Overview</span>
              </button>

              <Link to="/franchise" className="btn-apply-direct">
                <span>Enquire & Apply for Franchise</span>
                <ArrowRight size={16} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Dossier Preview Section */}
      <section className="brochure-content-section">
        <div className="container">
          <div className="dossier-preview-card">
            {/* Left Cover Preview */}
            <div className="dossier-book-cover">
              <div className="cover-brand-header">
                <img
                  src="/images/laundry-walii-official-logo-transparent.png"
                  alt="Laundry Waliiii"
                  className="cover-logo-img"
                />
              </div>

              <div className="cover-title-block">
                <span className="cover-doc-tag">PARTNER DOSSIER</span>
                <h3 className="cover-headline">
                  Operations & Standards Blueprint
                </h3>
                <p className="cover-desc">
                  Expansion Guide for Commercial Licensing Partners
                </p>
              </div>

              <div className="cover-footer-row">
                <span>Edition: 2026–2027</span>
                <span>Mysore HQ</span>
              </div>
            </div>

            {/* Right Overview */}
            <div className="dossier-info-block">
              <div className="dossier-badge">
                <Sparkles size={12} />
                <span>Confidential Partner Guide</span>
              </div>

              <h2 className="dossier-heading">
                Complete Information in One Comprehensive Guide
              </h2>

              <p className="dossier-desc">
                The Laundry Waliiii Franchise Prospectus outlines our operational standards, equipment configurations, and territory licensing framework. Formal dossiers are shared directly with verified applicants.
              </p>

              <div className="dossier-highlights-grid">
                <div className="highlight-item">
                  <BookOpen size={18} className="highlight-icon" />
                  <span>6 In-Depth Chapters</span>
                </div>
                <div className="highlight-item">
                  <ShieldCheck size={18} className="highlight-icon" />
                  <span>Territory Protection</span>
                </div>
                <div className="highlight-item">
                  <Layers size={18} className="highlight-icon" />
                  <span>Equipment Blueprints</span>
                </div>
                <div className="highlight-item">
                  <Sparkles size={18} className="highlight-icon" />
                  <span>Turnkey Licensing</span>
                </div>
              </div>

              <div className="dossier-actions">
                <Link to="/franchise" className="btn-dossier-enquire">
                  <FileText size={17} />
                  <span>Request Prospectus & Enquire</span>
                </Link>
              </div>
            </div>
          </div>

          {/* Chapters Breakdown */}
          <div className="chapters-section">
            <div className="chapters-header">
              <div className="section-label-wrapper">
                <span className="label-line" />
                <span className="section-label-text">TABLE OF CONTENTS</span>
                <span className="label-line" />
              </div>
              <h3 className="chapters-title">
                Prospectus Table of <em>Contents</em>
              </h3>
            </div>

            <div className="chapters-grid">
              {BROCHURE_CHAPTERS.map((ch) => (
                <div key={ch.number} className="chapter-card">
                  <span className="chapter-number">{ch.number}</span>
                  <h4 className="chapter-name">{ch.title}</h4>
                  <p className="chapter-desc">{ch.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <style>{`
        .brochure-page-root {
          background-color: #FAF7FC;
          min-height: 100vh;
          position: relative;
          overflow: hidden;
          padding-bottom: 6rem;
        }

        .brochure-hero-section {
          padding-top: calc(var(--header-height, 84px) + 2.5rem);
          padding-bottom: 4rem;
          background: #FAF7FC;
          position: relative;
          z-index: 2;
        }

        .brochure-hero-content {
          text-align: center;
          max-width: 760px;
          margin: 0 auto;
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

        .brochure-main-heading {
          font-family: var(--font-heading);
          font-style: italic;
          font-size: clamp(2.3rem, 4.8vw, 3.6rem);
          font-weight: 700;
          color: #171421;
          line-height: 1.15;
          margin-bottom: 1rem;
        }

        .brochure-main-heading em {
          font-family: var(--font-serif);
          font-style: italic;
          font-weight: 700;
          color: #700F63;
        }

        .brochure-subheading {
          font-family: var(--font-body);
          font-size: 1.05rem;
          color: #45414D;
          line-height: 1.7;
          margin: 0 auto 2.25rem;
          max-width: 620px;
        }

        .brochure-hero-actions {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 1.25rem;
          flex-wrap: wrap;
        }

        .btn-print-brochure {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.85rem 1.8rem;
          background: #FFFFFF;
          color: #700F63;
          border: 1px solid rgba(112, 15, 99, 0.35);
          border-radius: 9999px;
          font-family: var(--font-body);
          font-size: 0.92rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
          box-shadow: 0 4px 14px rgba(23, 20, 33, 0.04);
        }

        .btn-print-brochure:hover {
          border-color: #700F63;
          color: #4B1248;
          background: #F8F2F9;
        }

        .btn-apply-direct {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.85rem 2rem;
          background: #700F63;
          color: #FFFFFF;
          border-radius: 9999px;
          font-family: var(--font-body);
          font-size: 0.92rem;
          font-weight: 600;
          text-decoration: none;
          transition: all 0.2s;
          box-shadow: 0 4px 14px rgba(112, 15, 99, 0.22);
        }

        .btn-apply-direct:hover {
          background: #590A4E;
          transform: translateY(-2px);
        }

        .brochure-content-section {
          padding-top: 3.5rem;
          position: relative;
          z-index: 2;
        }

        .dossier-preview-card {
          background: #FFFFFF;
          border: 1px solid rgba(220, 204, 226, 0.75);
          border-radius: 28px;
          padding: 3rem;
          box-shadow: 0 6px 24px rgba(70, 18, 75, 0.04);
          display: grid;
          grid-template-columns: 320px 1fr;
          gap: 3rem;
          align-items: center;
          margin-bottom: 5rem;
        }

        .dossier-book-cover {
          background: linear-gradient(145deg, #700F63 0%, #3B0835 100%);
          border-radius: 20px;
          padding: 2.25rem;
          color: #FFFFFF;
          box-shadow: 0 12px 32px rgba(75, 18, 72, 0.22);
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          height: 380px;
        }

        .cover-brand-header {
          background: rgba(255, 255, 255, 0.96);
          padding: 8px 14px;
          border-radius: 12px;
          display: inline-block;
          max-width: fit-content;
        }

        .cover-logo-img {
          height: 28px;
          width: auto;
        }

        .cover-doc-tag {
          display: block;
          font-family: var(--font-body);
          font-size: 0.72rem;
          letter-spacing: 0.12em;
          color: #F3D1EE;
          font-weight: 700;
          margin-bottom: 0.5rem;
        }

        .cover-headline {
          font-family: var(--font-heading);
          font-size: 1.45rem;
          color: #FFFFFF;
          line-height: 1.3;
          margin: 0 0 0.5rem;
        }

        .cover-desc {
          font-family: var(--font-body);
          font-size: 0.82rem;
          color: rgba(255, 255, 255, 0.78);
          margin: 0;
        }

        .cover-footer-row {
          display: flex;
          justify-content: space-between;
          font-family: var(--font-body);
          font-size: 0.75rem;
          color: rgba(255, 255, 255, 0.75);
          border-top: 1px solid rgba(255, 255, 255, 0.22);
          padding-top: 0.85rem;
        }

        .dossier-badge {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          background: #F6EEF8;
          color: #700F63;
          font-family: var(--font-body);
          font-size: 0.76rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.06em;
          padding: 4px 12px;
          border-radius: 9999px;
          margin-bottom: 0.85rem;
        }

        .dossier-heading {
          font-family: var(--font-heading);
          font-style: italic;
          font-size: 1.85rem;
          font-weight: 700;
          color: #171421;
          line-height: 1.25;
          margin-bottom: 0.85rem;
        }

        .dossier-desc {
          font-family: var(--font-body);
          font-size: 0.95rem;
          color: #45414D;
          line-height: 1.65;
          margin-bottom: 1.75rem;
        }

        .dossier-highlights-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1rem;
          margin-bottom: 2rem;
        }

        .highlight-item {
          display: flex;
          align-items: center;
          gap: 0.6rem;
          font-family: var(--font-body);
          font-size: 0.88rem;
          color: #45414D;
          font-weight: 500;
        }

        .highlight-icon {
          color: #700F63;
          flex-shrink: 0;
        }

        .btn-dossier-enquire {
          display: inline-flex;
          align-items: center;
          gap: 0.55rem;
          padding: 0.95rem 2.2rem;
          background: #700F63;
          color: #FFFFFF;
          border-radius: 9999px;
          font-family: var(--font-body);
          font-size: 0.95rem;
          font-weight: 600;
          text-decoration: none;
          transition: all 0.25s ease;
          box-shadow: 0 6px 18px rgba(112, 15, 99, 0.24);
        }

        .btn-dossier-enquire:hover {
          background: #590A4E;
          transform: translateY(-2px);
        }

        .chapters-header {
          text-align: center;
          margin-bottom: 3rem;
        }

        .chapters-title {
          font-family: var(--font-heading);
          font-style: italic;
          font-size: clamp(1.85rem, 3.5vw, 2.5rem);
          font-weight: 700;
          color: #171421;
          margin-top: 0.35rem;
        }

        .chapters-title em {
          font-family: var(--font-serif);
          font-style: italic;
          font-weight: 700;
          color: #700F63;
        }

        .chapters-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
          gap: 1.75rem;
        }

        .chapter-card {
          background: #FFFFFF;
          border: 1px solid rgba(220, 204, 226, 0.75);
          border-radius: 20px;
          padding: 2rem;
          box-shadow: 0 6px 20px rgba(70, 18, 75, 0.04);
          transition: transform 0.2s, border-color 0.2s;
        }

        .chapter-card:hover {
          transform: translateY(-2px);
          border-color: rgba(112, 15, 99, 0.35);
        }

        .chapter-number {
          font-family: var(--font-heading);
          font-size: 1.4rem;
          font-weight: 700;
          color: #700F63;
          display: block;
          margin-bottom: 0.5rem;
        }

        .chapter-name {
          font-family: var(--font-heading);
          font-size: 1.15rem;
          font-weight: 700;
          color: #171421;
          margin-bottom: 0.5rem;
        }

        .chapter-desc {
          font-family: var(--font-body);
          font-size: 0.88rem;
          color: #45414D;
          line-height: 1.6;
          margin: 0;
        }

        @media (max-width: 900px) {
          .dossier-preview-card {
            grid-template-columns: 1fr;
            padding: 2rem;
          }
          .dossier-book-cover {
            height: 320px;
          }
        }
      `}</style>
    </div>
  );
};

export default FranchiseBrochurePage;
