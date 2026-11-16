import React from 'react';
import { Calendar, Truck, Shirt, PackageCheck } from 'lucide-react';

const STEPS = [
  {
    number: '01',
    icon: Calendar,
    title: 'Book Pickup',
    desc: 'Schedule a convenient time online or via call.'
  },
  {
    number: '02',
    icon: Truck,
    title: 'We Collect',
    desc: 'Hassle-free doorstep pickup from your home.'
  },
  {
    number: '03',
    icon: Shirt,
    title: 'We Care',
    desc: 'Hygienic wash and precise steam pressing.'
  },
  {
    number: '04',
    icon: PackageCheck,
    title: 'We Deliver',
    desc: 'Crisp, fresh clothes returned to your door.'
  }
];

export const HowItWorks = () => {
  return (
    <section className="section" style={{ background: '#FFF9EF' }}>
      <div className="container">
        {/* Header */}
        <div className="section-title-wrap">
          <span className="heading-sub">Simple Process</span>
          <h2 className="heading-section" style={{ color: 'var(--color-purple)' }}>
            How It Works
          </h2>
          <p className="text-lead" style={{ marginTop: '0.65rem' }}>
            Four effortless steps from your wardrobe to fresh return.
          </p>
        </div>

        {/* 4 Minimal Steps */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: '3rem'
          }}
        >
          {STEPS.map((step, idx) => {
            const Icon = step.icon;

            return (
              <div
                key={idx}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'flex-start'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%', marginBottom: '1.5rem' }}>
                  <div
                    style={{
                      width: '48px',
                      height: '48px',
                      borderRadius: '50%',
                      background: '#FFFFFF',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'var(--color-pink-primary)',
                      border: '1px solid var(--color-border)',
                      boxShadow: 'var(--shadow-button-subtle)'
                    }}
                  >
                    <Icon size={22} strokeWidth={1.75} />
                  </div>

                  <span
                    style={{
                      fontFamily: 'var(--font-heading)',
                      fontSize: '1.75rem',
                      fontWeight: 400,
                      color: 'rgba(57, 0, 79, 0.15)'
                    }}
                  >
                    {step.number}
                  </span>
                </div>

                <h3
                  style={{
                    fontFamily: 'var(--font-heading)',
                    fontSize: '1.25rem',
                    fontWeight: 600,
                    color: 'var(--color-purple)',
                    marginBottom: '0.5rem'
                  }}
                >
                  {step.title}
                </h3>

                <p
                  style={{
                    fontSize: '0.94rem',
                    color: 'var(--color-muted)',
                    margin: 0,
                    lineHeight: 1.6
                  }}
                >
                  {step.desc}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
