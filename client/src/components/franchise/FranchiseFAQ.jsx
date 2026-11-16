import React, { useState } from 'react';
import { Crown, ChevronDown, ChevronUp } from 'lucide-react';
import { FRANCHISE_FAQS } from '../../config/business';

export const FranchiseFAQ = () => {
  const [openIdx, setOpenIdx] = useState(0);

  const toggle = (idx) => {
    setOpenIdx(openIdx === idx ? null : idx);
  };

  return (
    <section className="section" style={{ background: '#FFF9EF' }}>
      <div className="container" style={{ maxWidth: '860px' }}>
        <div className="section-title-wrap">
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.65rem' }}>
            <Crown size={20} color="var(--color-gold)" />
            <span
              style={{
                fontFamily: 'var(--font-body)',
                fontSize: '0.78rem',
                fontWeight: 700,
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
                color: 'var(--color-gold)'
              }}
            >
              Frequently Asked Questions
            </span>
          </div>

          <h2
            className="heading-section"
            style={{
              fontSize: 'clamp(1.85rem, 3.5vw, 2.6rem)',
              color: 'var(--color-purple)',
              marginBottom: '0.75rem'
            }}
          >
            Franchise Queries & <br />
            <span style={{ fontFamily: 'var(--font-serif)', fontStyle: 'italic', color: 'var(--color-pink)' }}>
              Operational Details
            </span>
          </h2>

          <p style={{ color: 'var(--color-muted)', fontSize: '0.96rem', lineHeight: 1.65, margin: '0 auto', maxWidth: '600px' }}>
            Common questions regarding licensing, store requirements, and operational support.
          </p>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
          {FRANCHISE_FAQS.map((faq, idx) => {
            const isOpen = openIdx === idx;

            return (
              <div
                key={idx}
                className="card-royal"
                style={{
                  padding: '1.25rem 1.65rem',
                  borderRadius: 'var(--radius-xl)',
                  background: isOpen ? '#FFFFFF' : '#FFFDF9',
                  border: isOpen ? '1.5px solid var(--color-pink)' : '1px solid var(--color-border)',
                  cursor: 'pointer',
                  transition: 'all var(--transition-fast)'
                }}
                onClick={() => toggle(idx)}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem' }}>
                  <h3 style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--color-purple)', margin: 0 }}>
                    {faq.question}
                  </h3>
                  <div style={{ color: 'var(--color-pink)', flexShrink: 0 }}>
                    {isOpen ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                  </div>
                </div>

                {isOpen && (
                  <p style={{ fontSize: '0.88rem', color: 'var(--color-muted)', lineHeight: 1.65, marginTop: '0.85rem', marginBottom: 0 }}>
                    {faq.answer}
                  </p>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default FranchiseFAQ;
