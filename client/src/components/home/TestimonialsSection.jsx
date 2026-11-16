import React from 'react';
import { Link } from 'react-router-dom';
import { MessageSquare, Truck } from 'lucide-react';

export const TestimonialsSection = () => {
  return (
    <section
      style={{
        paddingTop: '5rem',
        paddingBottom: '5rem',
        background: '#FFF9EF',
        position: 'relative'
      }}
    >
      <div className="container">
        {/* Section Heading */}
        <div style={{ textAlign: 'center', maxWidth: '640px', margin: '0 auto 3rem auto' }}>
          <h2
            className="heading-section"
            style={{
              fontSize: 'clamp(2rem, 3.8vw, 2.75rem)',
              color: 'var(--color-purple)',
              fontWeight: 600,
              margin: '0 0 0.5rem 0'
            }}
          >
            Customer Experiences
          </h2>
          <p style={{ color: 'var(--color-muted)', fontSize: '0.98rem', margin: 0 }}>
            Real reviews and testimonials from our patrons across Mysore.
          </p>
        </div>

        {/* Clean, authentic empty state presentation */}
        <div
          style={{
            maxWidth: '680px',
            margin: '0 auto',
            background: 'rgba(255, 255, 255, 0.85)',
            border: '1px solid var(--color-border)',
            borderRadius: 'var(--radius-2xl)',
            padding: '3rem 2.5rem',
            textAlign: 'center',
            boxShadow: 'var(--shadow-card)'
          }}
        >
          <div
            style={{
              width: '54px',
              height: '54px',
              borderRadius: '50%',
              background: 'var(--color-pink-soft)',
              color: 'var(--color-pink-primary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 1.5rem auto'
            }}
          >
            <MessageSquare size={24} />
          </div>

          <h3
            style={{
              fontFamily: 'var(--font-heading)',
              fontSize: '1.25rem',
              color: 'var(--color-purple)',
              fontWeight: 600,
              marginBottom: '0.65rem'
            }}
          >
            Verified Reviews Coming Soon
          </h3>

          <p
            style={{
              color: 'var(--color-muted)',
              fontSize: '0.94rem',
              lineHeight: 1.65,
              maxWidth: '480px',
              margin: '0 auto 2rem auto'
            }}
          >
            We are collecting verified reviews from our first customers across Mysore. Experience our hygienic doorstep fabric care and share your thoughts with us.
          </p>

          <Link
            to="/services"
            className="btn-pill-primary"
            style={{ padding: '0.85rem 2.2rem', fontSize: '0.95rem' }}
          >
            <Truck size={17} />
            <span>Schedule Your First Pickup</span>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
