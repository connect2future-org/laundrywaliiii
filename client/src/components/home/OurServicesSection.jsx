import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { servicesApi } from '../../services/api';

export const OurServicesSection = () => {
  const [services, setServices] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let active = true;
    const load = async () => {
      try {
        const categories = await servicesApi.getAll();
        if (active) {
          setServices(Array.isArray(categories) ? categories.slice(0, 3) : []);
        }
      } catch (err) {
        if (active) setError(err.message || 'Unable to load services.');
      } finally {
        if (active) setIsLoading(false);
      }
    };
    load();
    return () => {
      active = false;
    };
  }, []);
  return (
    <section className="sakura-services-section" aria-label="Our Services">
      {/* Middle-left subtle sakura blossom */}
      <div className="sakura-mid-left" aria-hidden="true">
        <img
          src="/images/sakura/sakura-flower-mid-left-transparent.png"
          alt=""
          className="sakura-accent-img"
          loading="lazy"
        />
      </div>

      {/* Middle-right delicate sakura branch */}
      <div className="sakura-mid-right" aria-hidden="true">
        <img
          src="/images/sakura/sakura-branch-mid-right-transparent.png"
          alt=""
          className="sakura-branch-img"
          loading="lazy"
        />
      </div>

      <div className="container services-content-container">
        {/* Left Column: Heading, Description, and Berry CTA Button */}
        <div className="services-left-col">
          <span className="section-label-tag">
            OUR SERVICES <span className="label-pink-dash">—</span>
          </span>

          <h2 className="services-editorial-title">
            Complete Care<br />
            <span className="title-serif-italic">for Your Clothes.</span>
          </h2>

          <p className="services-editorial-desc">
            From everyday wear to your most delicate fabrics, we clean, care and deliver with precision.
          </p>

          <Link to="/services" className="btn-services-berry">
            <span>Explore All Services</span>
            <ArrowRight size={16} />
          </Link>
        </div>

        {/* Right Cards: Database-driven Vertical Rounded Service Cards */}
        <div className="services-right-grid">
          {isLoading ? (
            <p style={{ gridColumn: '1 / -1', color: '#556987', fontSize: '0.92rem' }}>
              Loading services...
            </p>
          ) : error ? (
            <p style={{ gridColumn: '1 / -1', color: '#B91C1C', fontSize: '0.92rem' }}>
              {error}
            </p>
          ) : services.length === 0 ? (
            <p style={{ gridColumn: '1 / -1', color: '#556987', fontSize: '0.92rem' }}>
              No active services configured yet.
            </p>
          ) : (
            services.map((srv) => (
              <Link key={srv._id || srv.categorySlug} to={`/services#${srv.categorySlug || srv.slug}`} className="service-vertical-card">
                <div className="service-card-thumb-wrap">
                  <img
                    src={srv.image || '/images/sakura/service-wash-fold.png'}
                    alt={srv.name}
                    className="service-card-thumb"
                    loading="lazy"
                  />
                </div>

                <div className="service-card-info">
                  <h3 className="service-card-title">{srv.name}</h3>
                  <p className="service-card-desc">{srv.description || ''}</p>
                </div>

                <div className="service-card-arrow-btn" aria-hidden="true">
                  <ArrowRight size={14} />
                </div>
              </Link>
            ))
          )}
        </div>
      </div>

      {/* Soapy Bubble Separator transitioning into Testimonials */}
      <div className="services-bottom-foam-separator" aria-hidden="true">
        <div className="services-foam-half services-foam-half--left">
          <img
            src="/images/sakura/foam-wave-left.png"
            alt=""
            className="services-foam-img services-foam-img--left"
            loading="lazy"
          />
        </div>
        <div className="services-foam-half services-foam-half--right">
          <img
            src="/images/sakura/foam-wave-left.png"
            alt=""
            className="services-foam-img services-foam-img--right"
            loading="lazy"
          />
        </div>
      </div>

      <style>{`
        .sakura-services-section {
          position: relative;
          background: radial-gradient(ellipse 85% 70% at 50% 50%, rgba(255, 255, 255, 0.5) 0%, rgba(255, 245, 250, 0.3) 40%, var(--homepage-background, #FCEAF2) 80%, var(--homepage-background, #FCEAF2) 100%);
          padding-top: clamp(2.5rem, 4vw, 3.5rem);
          padding-bottom: 0;
          overflow: hidden;
        }

        /* Decorative Sakura Accents */
        .sakura-mid-left {
          position: absolute;
          top: 30%;
          left: -10px;
          width: clamp(50px, 6vw, 85px);
          pointer-events: none;
          z-index: 2;
        }

        .sakura-mid-right {
          position: absolute;
          top: 35%;
          right: -10px;
          width: clamp(120px, 16vw, 210px);
          pointer-events: none;
          z-index: 2;
        }

        .sakura-accent-img,
        .sakura-branch-img {
          width: 100%;
          height: auto;
          display: block;
        }

        .services-content-container {
          position: relative;
          z-index: 5;
          max-width: 1140px;
          margin: 0 auto;
          padding: 0 1.5rem clamp(1.5rem, 2.5vw, 2.5rem);
          display: grid;
          grid-template-columns: 1fr 1.65fr;
          align-items: center;
          gap: clamp(2rem, 4vw, 4rem);
        }

        /* Left Column */
        .services-left-col {
          display: flex;
          flex-direction: column;
          align-items: flex-start;
        }

        .section-label-tag {
          font-family: 'DM Sans', sans-serif;
          font-size: 0.76rem;
          font-weight: 700;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          color: #14233F;
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          margin-bottom: 0.75rem;
        }

        .label-pink-dash {
          color: #EC3D83;
          font-weight: 800;
        }

        .services-editorial-title {
          font-family: 'Playfair Display', Georgia, serif;
          font-size: clamp(2.2rem, 4vw, 3.2rem);
          font-weight: 700;
          line-height: 1.15;
          letter-spacing: -0.015em;
          color: #14233F;
          margin: 0 0 1.25rem 0;
        }

        .title-serif-italic {
          font-style: italic;
          font-weight: 600;
          color: #14233F;
        }

        .services-editorial-desc {
          font-family: 'DM Sans', sans-serif;
          font-size: clamp(0.95rem, 1.25vw, 1.05rem);
          font-weight: 400;
          line-height: 1.65;
          color: #556987;
          margin: 0 0 2rem 0;
          max-width: 380px;
        }

        /* Berry Button */
        .btn-services-berry {
          display: inline-flex;
          align-items: center;
          gap: 0.6rem;
          background: #850D45;
          color: #FFFFFF;
          font-family: 'DM Sans', sans-serif;
          font-size: 0.92rem;
          font-weight: 600;
          padding: 0.8rem 1.85rem;
          border-radius: 9999px;
          text-decoration: none;
          box-shadow: 0 6px 20px rgba(133, 13, 69, 0.25);
          transition: all 0.25s ease;
        }

        .btn-services-berry:hover {
          background: #9C1052;
          color: #FFFFFF;
          transform: translateY(-2px);
          box-shadow: 0 10px 26px rgba(133, 13, 69, 0.35);
        }

        /* 3 Service Cards in Horizontal Row */
        .services-right-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 1.15rem;
        }

        .service-vertical-card {
          background: #FFFFFF;
          border: 1px solid rgba(255, 225, 240, 0.9);
          border-radius: 18px;
          box-shadow: 0 4px 18px rgba(190, 70, 110, 0.07);
          padding: 1.1rem;
          display: flex;
          flex-direction: column;
          text-decoration: none;
          position: relative;
          transition: all 0.25s ease;
        }

        .service-vertical-card:hover {
          transform: translateY(-3px);
          box-shadow: 0 10px 26px rgba(190, 70, 110, 0.14);
          border-color: rgba(236, 61, 131, 0.35);
        }

        .service-card-thumb-wrap {
          width: 100%;
          height: 90px;
          border-radius: 12px;
          overflow: hidden;
          background: #FFF5F9;
          margin-bottom: 0.85rem;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .service-card-thumb {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
          transition: transform 0.3s ease;
        }

        .service-vertical-card:hover .service-card-thumb {
          transform: scale(1.05);
        }

        .service-card-info {
          flex: 1;
          margin-bottom: 0.85rem;
        }

        .service-card-title {
          font-family: 'DM Sans', sans-serif;
          font-size: 0.98rem;
          font-weight: 700;
          color: #14233F;
          margin: 0 0 0.35rem 0;
        }

        .service-card-desc {
          font-family: 'DM Sans', sans-serif;
          font-size: 0.78rem;
          line-height: 1.45;
          color: #64748B;
          margin: 0;
        }

        .service-card-arrow-btn {
          align-self: flex-end;
          width: 28px;
          height: 28px;
          border-radius: 50%;
          border: 1px solid rgba(236, 61, 131, 0.2);
          background: #FFF5F9;
          color: #14233F;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.2s ease;
        }

        .service-vertical-card:hover .service-card-arrow-btn {
          background: #850D45;
          color: #FFFFFF;
          border-color: #850D45;
          transform: translateX(2px);
        }

        /* Soapy Bubble Separator */
        .services-bottom-foam-separator {
          position: relative;
          z-index: 5;
          width: 100%;
          display: flex;
          align-items: flex-end;
          line-height: 0;
          margin-top: clamp(1rem, 2vw, 2rem);
          margin-bottom: -2px;
          pointer-events: none;
        }

        .services-foam-half {
          flex: 0 0 50.05%;
          width: 50.05%;
          max-width: 50.05%;
          height: auto;
          line-height: 0;
          position: relative;
        }

        .services-foam-half--left {
          display: flex;
          justify-content: flex-end;
          align-items: flex-end;
        }

        .services-foam-half--right {
          display: flex;
          justify-content: flex-start;
          align-items: flex-end;
        }

        .services-foam-img {
          width: 100%;
          height: auto;
          display: block;
          object-fit: contain;
          pointer-events: none;
          user-select: none;
        }

        .services-foam-img--left {
          object-position: bottom right;
        }

        .services-foam-img--right {
          object-position: bottom right;
          transform: scaleX(-1);
        }

        @media (max-width: 960px) {
          .services-content-container {
            grid-template-columns: 1fr;
            gap: 2rem;
          }
          .services-editorial-desc {
            max-width: 100%;
          }
        }

        @media (max-width: 640px) {
          .services-right-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </section>
  );
};

export default OurServicesSection;
