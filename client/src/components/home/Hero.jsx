import { Link } from 'react-router-dom';
import { Truck, ArrowRight } from 'lucide-react';

export const Hero = () => {
  return (
    <section className="lavender-hero-section" aria-label="Hero Introduction">
      {/* Center Content: Headline, Subtitle, and Two Action Buttons */}
      <div className="hero-content-container">
        {/* Large Editorial Italic Serif Headline */}
        <h1 className="hero-editorial-title">
          <span className="hero-title-dark">Fresh Clothes,</span>
          <span className="hero-title-purple">Happy People.</span>
        </h1>

        {/* Supporting Subtitle */}
        <p className="hero-editorial-desc">
          Hygienic, safe and convenient laundry care<br className="desc-break" />
          for your everyday life.
        </p>

        {/* Action Buttons: Book Pickup & Our Services */}
        <div className="hero-actions-wrap">
          <Link to="/contact" className="btn-hero-book">
            <Truck size={18} strokeWidth={2.2} />
            <span>Book Pickup</span>
          </Link>

          <Link to="/services" className="btn-hero-services">
            <span>Our Services</span>
            <ArrowRight size={17} strokeWidth={2.2} />
          </Link>
        </div>
      </div>

      <style>{`
        /* Premium Minimalist Lavender Hero Section */
        .lavender-hero-section {
          position: relative;
          background-color: #FAF7FC;
          background-image: url('/images/lavender/hero-lavender-bg-2x.jpg');
          background-size: cover;
          background-position: center top;
          background-repeat: no-repeat;
          width: 100%;
          height: 100vh;
          height: 100dvh;
          min-height: 100vh;
          min-height: 100dvh;
          max-height: 100vh;
          max-height: 100dvh;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          text-align: center;
          padding: 72px 1.5rem 0 1.5rem;
          box-sizing: border-box;
          overflow: hidden;
          z-index: 10;
        }

        /* Center Content Container: positioned in visual center below the navbar */
        .hero-content-container {
          position: relative;
          z-index: 5;
          max-width: 960px;
          width: 100%;
          margin: 0 auto;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
        }

        /* Editorial Italic Serif Headline */
        .hero-editorial-title {
          font-family: 'Playfair Display', Georgia, serif;
          font-style: italic;
          font-weight: 700;
          font-size: clamp(3.2rem, 5.6vw, 5.4rem);
          line-height: 1.12;
          letter-spacing: -0.018em;
          margin: 0 0 clamp(1rem, 2vh, 1.35rem) 0;
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        .hero-title-dark {
          display: block;
          color: #1A1320;
          white-space: nowrap;
        }

        .hero-title-purple {
          display: block;
          color: #700F63;
          white-space: nowrap;
        }

        /* Clean Modern Sans-Serif Subtitle */
        .hero-editorial-desc {
          font-family: 'DM Sans', -apple-system, BlinkMacSystemFont, sans-serif;
          font-size: clamp(1rem, 1.2vw, 1.15rem);
          font-weight: 400;
          line-height: 1.6;
          color: #5C5564;
          margin: 0 auto clamp(1.6rem, 2.8vh, 2.4rem) auto;
          max-width: 540px;
        }

        /* Two Centered Action Buttons */
        .hero-actions-wrap {
          display: inline-flex;
          align-items: center;
          gap: 1.25rem;
          flex-wrap: wrap;
          justify-content: center;
        }

        /* Button 1: Book Pickup (Deep Plum Purple Pill) */
        .btn-hero-book {
          display: inline-flex;
          align-items: center;
          gap: 0.65rem;
          background: #700F63;
          color: #FFFFFF;
          font-family: 'DM Sans', sans-serif;
          font-size: 1.02rem;
          font-weight: 600;
          padding: 0.92rem 2.4rem;
          min-height: 52px;
          border-radius: 9999px;
          text-decoration: none;
          box-shadow: 0 8px 24px rgba(112, 15, 99, 0.28);
          border: 1px solid transparent;
          transition: all 0.25s ease;
        }

        .btn-hero-book:hover {
          background: #5B0C50;
          color: #FFFFFF;
          transform: translateY(-2px);
          box-shadow: 0 12px 28px rgba(112, 15, 99, 0.35);
        }

        .btn-hero-book:active {
          transform: translateY(0);
        }

        /* Button 2: Our Services (Pale Lavender / White with Delicate Border) */
        .btn-hero-services {
          display: inline-flex;
          align-items: center;
          gap: 0.65rem;
          background: #FAF7FC;
          color: #1A1320;
          font-family: 'DM Sans', sans-serif;
          font-size: 1.02rem;
          font-weight: 600;
          padding: 0.92rem 2.4rem;
          min-height: 52px;
          border-radius: 9999px;
          text-decoration: none;
          border: 1px solid #D8C6DE;
          box-shadow: 0 4px 16px rgba(45, 15, 55, 0.04);
          transition: all 0.25s ease;
        }

        .btn-hero-services svg {
          color: #700F63;
          transition: transform 0.25s ease;
        }

        .btn-hero-services:hover {
          background: #F3EAF5;
          border-color: #700F63;
          color: #700F63;
          transform: translateY(-2px);
          box-shadow: 0 8px 20px rgba(112, 15, 99, 0.12);
        }

        .btn-hero-services:hover svg {
          transform: translateX(3px);
        }

        .btn-hero-services:active {
          transform: translateY(0);
        }

        /* Responsive Breakpoints */
        @media (max-width: 991px) {
          .lavender-hero-section {
            height: auto;
            max-height: none;
            min-height: 100vh;
            min-height: 100dvh;
            padding: calc(62px + 2.5rem) 1.25rem 2.5rem 1.25rem;
            justify-content: center;
          }
          .hero-content-container {
            margin: auto 0;
          }
          .hero-editorial-title {
            font-size: clamp(2.85rem, 6.2vw, 4.2rem);
          }
          .hero-editorial-desc {
            font-size: 1.08rem;
          }
          .btn-hero-book,
          .btn-hero-services {
            padding: 0.88rem 2rem;
            font-size: 0.98rem;
            min-height: 48px;
          }
        }

        @media (max-width: 640px) {
          .lavender-hero-section {
            padding: calc(62px + 2rem) 1.25rem 2.2rem 1.25rem;
            background-position: center 20%;
          }

          .hero-editorial-title {
            font-size: clamp(2.3rem, 9.2vw, 3.1rem);
            margin-bottom: 0.85rem;
          }

          .hero-editorial-desc {
            font-size: 0.96rem;
            margin-bottom: 1.75rem;
            line-height: 1.55;
          }

          .hero-actions-wrap {
            flex-direction: column;
            width: 100%;
            max-width: 290px;
            gap: 0.85rem;
          }

          .btn-hero-book,
          .btn-hero-services {
            width: 100%;
            justify-content: center;
            min-height: 48px;
            padding: 0.85rem 1.75rem;
          }
        }
      `}</style>
    </section>
  );
};

export default Hero;
