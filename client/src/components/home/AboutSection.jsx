import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

const BENEFITS = [
  {
    title: 'Fabric-Safe Care',
    desc: 'Gentle, fabric-friendly detergents formulated to protect delicate fibers and maintain original color vibrancy.'
  },
  {
    title: 'Hygienic Cleaning',
    desc: 'Dedicated wash drum for every customer order with purified, softened water for spotless freshness.'
  },
  {
    title: 'Convenient Doorstep Service',
    desc: 'Punctual collection and delivery across Mysore, scheduled completely around your daily routine.'
  },
  {
    title: 'Professional Garment Finishing',
    desc: 'Specialized vacuum steam pressing for crisp suits, silk sarees, delicate formals, and clean footwear.'
  }
];

export const AboutSection = () => {
  return (
    <section id="about" className="section" style={{ background: '#FFFDFB' }}>
      <div className="container">
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            alignItems: 'center',
            gap: '4.5rem'
          }}
        >
          {/* Left Column: Clean Brand Image */}
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <div
              style={{
                width: '100%',
                maxWidth: '460px',
                borderRadius: 'var(--radius-3xl)',
                overflow: 'hidden',
                boxShadow: 'var(--shadow-card)',
                border: '1px solid var(--color-border)'
              }}
            >
              <img
                src="/images/royal/about-mascot.jpg"
                alt="Laundry Waliiii Fabric Care"
                style={{
                  width: '100%',
                  height: 'auto',
                  display: 'block',
                  objectFit: 'cover'
                }}
              />
            </div>
          </div>

          {/* Right Column: Editorial Text & Verified Service Benefits */}
          <div>
            <span className="heading-sub">About Laundry Waliiii</span>

            <h2
              className="heading-section"
              style={{
                fontSize: 'clamp(2.2rem, 4.2vw, 3.2rem)',
                lineHeight: 1.18,
                color: 'var(--color-purple)',
                marginBottom: '1.25rem'
              }}
            >
              More Than Laundry, <br />
              <span style={{ fontFamily: 'var(--font-serif)', fontStyle: 'italic', color: 'var(--color-pink-primary)' }}>
                It's Care.
              </span>
            </h2>

            <p
              style={{
                fontSize: '1.05rem',
                color: 'var(--color-muted)',
                lineHeight: 1.75,
                marginBottom: '2.5rem'
              }}
            >
              Laundry Waliiii brings professional, hygienic and fabric-friendly laundry care to Mysore. We treat every garment with the care it deserves, so you always look and feel your best.
            </p>

            {/* Editorial Benefits List (Concise Statements, No Heavy Cards) */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', marginBottom: '2.5rem' }}>
              {BENEFITS.map((item, idx) => (
                <div key={idx} style={{ borderLeft: '2px solid var(--color-pink)', paddingLeft: '1.25rem' }}>
                  <h3
                    style={{
                      fontFamily: 'var(--font-heading)',
                      fontSize: '1.1rem',
                      fontWeight: 600,
                      color: 'var(--color-purple)',
                      marginBottom: '0.25rem'
                    }}
                  >
                    {item.title}
                  </h3>
                  <p style={{ fontSize: '0.92rem', color: 'var(--color-muted)', margin: 0, lineHeight: 1.55 }}>
                    {item.desc}
                  </p>
                </div>
              ))}
            </div>

            <Link
              to="/services"
              className="btn-pill-primary"
              style={{ padding: '0.9rem 2.2rem', fontSize: '0.96rem' }}
            >
              <span>Explore Services</span>
              <ArrowRight size={17} />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
