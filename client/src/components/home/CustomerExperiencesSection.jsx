import React, { useState } from 'react';
import { Star, Quote } from 'lucide-react';
import { TESTIMONIALS } from '../../data/testimonials';

export const CustomerExperiencesSection = () => {
  const [isPaused, setIsPaused] = useState(false);

  // We repeat the verified testimonials to ensure a generous, populated marquee set
  const marqueeCards = [...TESTIMONIALS, ...TESTIMONIALS];

  return (
    <section className="customer-experiences-section" aria-label="Customer Experiences">
      <div className="ce-content-container">
        {/* Section Header */}
        <div className="ce-header">
          <div className="ce-eyebrow">
            <span className="ce-eyebrow-line" aria-hidden="true" />
            <span className="ce-eyebrow-text">CUSTOMER EXPERIENCES</span>
            <span className="ce-eyebrow-line" aria-hidden="true" />
          </div>

          <h2 className="ce-title">
            What Our <span className="ce-title-accent">Customers Say.</span>
          </h2>

          <p className="ce-subtitle">
            Real reviews and testimonials from our happy patrons across Mysore.
          </p>
        </div>
      </div>

      {/* Full-bleed Marquee Viewport with Soft Fading Edges */}
      <div
        className="ce-marquee-viewport"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
        onTouchStart={() => setIsPaused(true)}
        onTouchEnd={() => setIsPaused(false)}
      >
        <div className={`ce-marquee-track ${isPaused ? 'is-paused' : ''}`}>
          {/* Primary Group */}
          <div className="ce-marquee-group" aria-hidden="false">
            {marqueeCards.map((item, index) => (
              <div key={`primary-${item.id}-${index}`} className="ce-card">
                <div className="ce-card-top">
                  <div className="ce-card-user">
                    <div className="ce-card-avatar-wrap">
                      <img
                        src={item.avatar}
                        alt={item.name}
                        className="ce-card-avatar"
                        loading="lazy"
                      />
                    </div>
                    <div className="ce-card-meta">
                      <h4 className="ce-card-name">{item.name}</h4>
                      <span className="ce-card-location">{item.service} • {item.location}</span>
                    </div>
                  </div>
                  <div className="ce-card-quote-badge" aria-hidden="true">
                    <Quote size={18} strokeWidth={2.4} />
                  </div>
                </div>

                <div className="ce-card-body">
                  <div className="ce-card-stars" aria-label={`${item.stars} out of 5 stars`}>
                    {[...Array(item.stars)].map((_, i) => (
                      <Star key={i} size={13} fill="#FBBF24" color="#FBBF24" />
                    ))}
                  </div>
                  <p className="ce-card-text">"{item.review}"</p>
                </div>
              </div>
            ))}
          </div>

          {/* Duplicate Group for 100% Seamless Infinite Looping */}
          <div className="ce-marquee-group" aria-hidden="true">
            {marqueeCards.map((item, index) => (
              <div key={`duplicate-${item.id}-${index}`} className="ce-card">
                <div className="ce-card-top">
                  <div className="ce-card-user">
                    <div className="ce-card-avatar-wrap">
                      <img
                        src={item.avatar}
                        alt=""
                        className="ce-card-avatar"
                        loading="lazy"
                      />
                    </div>
                    <div className="ce-card-meta">
                      <h4 className="ce-card-name">{item.name}</h4>
                      <span className="ce-card-location">{item.service} • {item.location}</span>
                    </div>
                  </div>
                  <div className="ce-card-quote-badge" aria-hidden="true">
                    <Quote size={18} strokeWidth={2.4} />
                  </div>
                </div>

                <div className="ce-card-body">
                  <div className="ce-card-stars">
                    {[...Array(item.stars)].map((_, i) => (
                      <Star key={i} size={13} fill="#FBBF24" color="#FBBF24" />
                    ))}
                  </div>
                  <p className="ce-card-text">"{item.review}"</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <style>{`
        .customer-experiences-section {
          position: relative;
          background: #FAF7FC;
          padding-top: clamp(3.5rem, 5.5vw, 5rem);
          padding-bottom: clamp(3.5rem, 5.5vw, 5rem);
          overflow: hidden;
          text-align: center;
          border-bottom: 1px solid rgba(224, 212, 228, 0.45);
        }

        /* Container */
        .ce-content-container {
          position: relative;
          z-index: 4;
          max-width: 1280px;
          margin: 0 auto;
          padding: 0 1.25rem;
        }

        /* Header */
        .ce-header {
          margin-bottom: clamp(2rem, 3.2vw, 3rem);
        }

        .ce-eyebrow {
          display: inline-flex;
          align-items: center;
          gap: 0.85rem;
          margin-bottom: 0.85rem;
        }

        .ce-eyebrow-line {
          width: 48px;
          height: 1.5px;
          background: rgba(112, 15, 99, 0.38);
          border-radius: 2px;
          display: inline-block;
        }

        .ce-eyebrow-text {
          font-family: 'DM Sans', sans-serif;
          font-size: 0.8rem;
          font-weight: 700;
          letter-spacing: 0.18em;
          color: #1A1320;
          text-transform: uppercase;
        }

        .ce-title {
          font-family: 'Playfair Display', Georgia, serif;
          font-style: italic;
          font-size: clamp(2.2rem, 3.8vw, 3.25rem);
          font-weight: 700;
          line-height: 1.15;
          color: #1A1320;
          letter-spacing: -0.015em;
          margin: 0 0 0.75rem;
        }

        .ce-title-accent {
          color: #700F63;
        }

        .ce-subtitle {
          font-family: 'DM Sans', sans-serif;
          font-size: clamp(1rem, 1.25vw, 1.12rem);
          color: #5C5564;
          margin: 0 auto;
          max-width: 620px;
          font-weight: 400;
        }

        /* ---------------------------------------------------------
           CONTINUOUS SEAMLESS MARQUEE VIEWPORT & TRACK
           --------------------------------------------------------- */
        .ce-marquee-viewport {
          position: relative;
          width: 100%;
          overflow: hidden;
          padding: 0.5rem 0 1.25rem;
          user-select: none;
        }

        /* Left & Right Elegant Edge Fading */
        .ce-marquee-viewport::before,
        .ce-marquee-viewport::after {
          content: '';
          position: absolute;
          top: 0;
          bottom: 0;
          width: clamp(2.5rem, 8vw, 8rem);
          z-index: 6;
          pointer-events: none;
        }

        .ce-marquee-viewport::before {
          left: 0;
          background: linear-gradient(to right, #FAF7FC 0%, rgba(250, 247, 252, 0) 100%);
        }

        .ce-marquee-viewport::after {
          right: 0;
          background: linear-gradient(to left, #FAF7FC 0%, rgba(250, 247, 252, 0) 100%);
        }

        .ce-marquee-track {
          display: flex;
          width: max-content;
          will-change: transform;
          animation: ceMarqueeScroll 52s linear infinite;
        }

        /* Pause on hover on desktop or when isPaused state is active */
        .ce-marquee-viewport:hover .ce-marquee-track,
        .ce-marquee-track.is-paused {
          animation-play-state: paused;
        }

        .ce-marquee-group {
          display: flex;
          align-items: stretch;
          gap: 1.5rem;
          padding-right: 1.5rem; /* Exactly matches gap for continuous continuity */
          flex-shrink: 0;
        }

        /* Continuous Smooth Keyframe Animation */
        @keyframes ceMarqueeScroll {
          0% {
            transform: translate3d(0, 0, 0);
          }
          100% {
            transform: translate3d(-50%, 0, 0);
          }
        }

        /* ---------------------------------------------------------
           PREMIUM TESTIMONIAL CARD
           --------------------------------------------------------- */
        .ce-card {
          width: 350px;
          min-width: 350px;
          background: linear-gradient(180deg, #FFFFFF 0%, #FDFBFD 100%);
          border-radius: 24px;
          padding: 1.5rem 1.6rem;
          text-align: left;
          box-shadow: 0 4px 20px rgba(45, 15, 55, 0.04);
          border: 1px solid rgba(220, 204, 226, 0.75);
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          gap: 1.15rem;
          transition: transform 0.28s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.28s ease, border-color 0.28s ease;
          box-sizing: border-box;
        }

        .ce-card:hover {
          transform: translateY(-4px);
          border-color: rgba(112, 15, 99, 0.35);
          box-shadow: 0 10px 28px rgba(112, 15, 99, 0.09);
        }

        /* Card Top */
        .ce-card-top {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 0.75rem;
        }

        .ce-card-user {
          display: flex;
          align-items: center;
          gap: 0.85rem;
        }

        .ce-card-avatar-wrap {
          width: 46px;
          height: 46px;
          border-radius: 50%;
          overflow: hidden;
          flex-shrink: 0;
          background: #FAF7FC;
          border: 1.5px solid rgba(220, 204, 226, 0.85);
          box-shadow: 0 2px 8px rgba(70, 20, 75, 0.06);
        }

        .ce-card-avatar {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
        }

        .ce-card-meta {
          display: flex;
          flex-direction: column;
          gap: 0.2rem;
        }

        .ce-card-name {
          font-family: 'DM Sans', sans-serif;
          font-size: 0.98rem;
          font-weight: 700;
          color: #1A1320;
          margin: 0;
          line-height: 1.2;
        }

        .ce-card-location {
          font-family: 'DM Sans', sans-serif;
          font-size: 0.76rem;
          color: #700F63;
          font-weight: 600;
          letter-spacing: 0.02em;
        }

        .ce-card-quote-badge {
          width: 36px;
          height: 36px;
          border-radius: 50%;
          background: rgba(112, 15, 99, 0.06);
          color: #700F63;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        /* Card Body */
        .ce-card-body {
          display: flex;
          flex-direction: column;
          gap: 0.65rem;
        }

        .ce-card-stars {
          display: flex;
          align-items: center;
          gap: 0.2rem;
        }

        .ce-card-text {
          font-family: 'DM Sans', sans-serif;
          font-size: 0.92rem;
          line-height: 1.6;
          color: #45414D;
          margin: 0;
          font-style: italic;
        }

        /* ---------------------------------------------------------
           RESPONSIVE BREAKPOINTS
           --------------------------------------------------------- */
        @media (max-width: 1024px) {
          .ce-card {
            width: 310px;
            min-width: 310px;
            padding: 1.35rem 1.4rem;
          }
          .ce-marquee-group {
            gap: 1.25rem;
            padding-right: 1.25rem;
          }
          .ce-marquee-track {
            animation-duration: 48s;
          }
        }

        @media (max-width: 640px) {
          .customer-experiences-section {
            padding-top: 3rem;
            padding-bottom: 3rem;
          }
          .ce-card {
            width: 285px;
            min-width: 285px;
            padding: 1.2rem 1.25rem;
            border-radius: 20px;
          }
          .ce-card-avatar-wrap {
            width: 42px;
            height: 42px;
          }
          .ce-card-name {
            font-size: 0.92rem;
          }
          .ce-card-text {
            font-size: 0.88rem;
            line-height: 1.55;
          }
          .ce-marquee-group {
            gap: 1rem;
            padding-right: 1rem;
          }
          .ce-marquee-track {
            animation-duration: 44s;
          }
        }

        /* Reduced-Motion Accessibility */
        @media (prefers-reduced-motion: reduce) {
          .ce-marquee-viewport {
            overflow-x: auto;
            scroll-snap-type: x mandatory;
          }
          .ce-marquee-track {
            animation: none;
            width: 100%;
          }
          .ce-card {
            scroll-snap-align: start;
          }
        }
      `}</style>
    </section>
  );
};

export default CustomerExperiencesSection;
