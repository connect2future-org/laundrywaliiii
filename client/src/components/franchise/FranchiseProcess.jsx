import React from 'react';
import { ArrowRight, CheckCircle2, ClipboardCheck, MapPin, Store, Settings, Users, Rocket } from 'lucide-react';

export const FranchiseProcess = ({ onApplyClick }) => {
  const steps = [
    {
      step: '01',
      title: 'Application & Territory Review',
      desc: 'Submit your expression of interest and preferred city/locality. Our expansion team evaluates initial territory feasibility.',
      icon: ClipboardCheck
    },
    {
      step: '02',
      title: 'Site Selection & Feasibility',
      desc: 'Identification and validation of ideal retail or catchment premises with appropriate power, water supply, and customer access.',
      icon: MapPin
    },
    {
      step: '03',
      title: 'Agreement & Store Architecture',
      desc: 'Execution of formal licensing documentation followed by customized architectural floor plans and brand fit-out guidelines.',
      icon: Store
    },
    {
      step: '04',
      title: 'Equipment & Cloud POS Setup',
      desc: 'Delivery and commissioning of specialized steam finishing and laundry equipment, along with cloud POS setup and barcode tagging.',
      icon: Settings
    },
    {
      step: '05',
      title: 'Staff Onboarding & Dry Runs',
      desc: 'Comprehensive training for operating staff covering fabric inspection, delicate stain treatment, packaging standards, and concierge care.',
      icon: Users
    },
    {
      step: '06',
      title: 'Grand Launch & Pickup Rollout',
      desc: 'Official territory opening with centralized brand campaign, digital marketing rollout, and active doorstep pickup operations.',
      icon: Rocket
    }
  ];

  const formats = [
    {
      name: 'Collection & Customer Drop Kiosk',
      space: '150 – 250 Sq. Ft.',
      desc: 'Compact retail intake point ideal for gated residential communities and commercial retail complexes.',
      highlights: ['Minimal space requirement', 'Cloud POS barcode intake', 'Daily feeder logistics connection']
    },
    {
      name: 'Retail & Steam Finishing Studio',
      space: '400 – 650 Sq. Ft.',
      desc: 'Full-service consumer studio with on-site vacuum steam pressing, shoe care drop-off, and customer counter.',
      highlights: ['Italian vacuum steam stations', 'Direct walk-in & doorstep processing', 'Prominent high-street brand presence']
    },
    {
      name: 'Master Processing Hub',
      space: '1,200 – 2,000 Sq. Ft.',
      desc: 'High-volume central cleaning and finishing hub equipped to handle satellite store batches and institutional clients.',
      highlights: ['Commercial washers & dryers', 'Eco dry cleaning capability', 'Regional territory exclusivity']
    }
  ];

  return (
    <section className="section" style={{ background: '#FFFDFB' }}>
      <div className="container">
        {/* Section Heading */}
        <div className="section-title-wrap">
          <span className="heading-sub">Structured Launch</span>
          <h2 className="heading-section" style={{ color: 'var(--color-purple)' }}>
            The 6-Step Franchise Process
          </h2>
          <p className="text-lead" style={{ marginTop: '0.65rem' }}>
            A proven, structured roadmap guiding partners from territory reservation to profitable launch.
          </p>
        </div>

        {/* 6-Step Grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '1.75rem',
            marginBottom: '5rem'
          }}
        >
          {steps.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className="card-royal"
                style={{
                  padding: '2.25rem 2rem',
                  background: '#FFFFFF',
                  borderRadius: 'var(--radius-2xl)',
                  position: 'relative',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  border: '1px solid var(--color-border)'
                }}
              >
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
                    <div className="card-icon-badge-pink">
                      <Icon size={20} />
                    </div>
                    <span
                      style={{
                        fontFamily: 'var(--font-heading)',
                        fontSize: '1.6rem',
                        fontWeight: 700,
                        color: 'var(--color-pink-primary)',
                        opacity: 0.9
                      }}
                    >
                      {item.step}
                    </span>
                  </div>

                  <h3
                    style={{
                      fontSize: '1.18rem',
                      fontWeight: 600,
                      color: 'var(--color-purple)',
                      marginBottom: '0.5rem',
                      lineHeight: 1.35
                    }}
                  >
                    {item.title}
                  </h3>

                  <p style={{ fontSize: '0.9rem', color: 'var(--color-muted)', margin: 0, lineHeight: 1.65 }}>
                    {item.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Operating Formats - No fake financial figures */}
        <div style={{ marginBottom: '3rem' }}>
          <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
            <span className="heading-sub">Operating Formats</span>
            <h3 className="heading-section" style={{ color: 'var(--color-purple)', fontSize: '2rem' }}>
              Flexible Franchise Formats
            </h3>
            <p className="text-lead" style={{ marginTop: '0.5rem' }}>
              Tailored store architectures designed for different retail environments. Detailed capital plans shared post-application.
            </p>
          </div>

          <div className="grid-3">
            {formats.map((fmt, i) => (
              <div
                key={i}
                className="card-royal"
                style={{
                  padding: '2.25rem',
                  background: '#FFFFFF',
                  borderRadius: 'var(--radius-2xl)',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  border: '1px solid var(--color-border)'
                }}
              >
                <div>
                  <span className="heading-sub" style={{ fontSize: '0.74rem', marginBottom: '0.4rem' }}>
                    Format {i + 1}
                  </span>
                  <h4 style={{ fontSize: '1.25rem', fontWeight: 600, color: 'var(--color-purple)', marginBottom: '0.4rem' }}>
                    {fmt.name}
                  </h4>
                  <div style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--color-pink)', marginBottom: '1rem' }}>
                    Space: {fmt.space}
                  </div>
                  <p style={{ fontSize: '0.88rem', color: 'var(--color-muted)', lineHeight: 1.6, marginBottom: '1.25rem' }}>
                    {fmt.desc}
                  </p>

                  <ul style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '1.5rem' }}>
                    {fmt.highlights.map((h, hi) => (
                      <li key={hi} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.86rem', color: 'var(--color-dark)' }}>
                        <CheckCircle2 size={15} color="var(--color-pink)" style={{ flexShrink: 0 }} />
                        <span>{h}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <button
                  type="button"
                  className="btn-pill-outline"
                  onClick={onApplyClick}
                  style={{ width: '100%', justifyContent: 'center' }}
                >
                  <span>Apply for this Format</span>
                  <ArrowRight size={14} />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default FranchiseProcess;
