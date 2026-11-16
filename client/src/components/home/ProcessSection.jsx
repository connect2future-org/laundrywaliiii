import React, { useState } from 'react';
import { SectionHeader } from '../common/SectionHeader';
import { Layers, CheckCircle2, ShieldCheck, Thermometer, Droplets, Wind, Sparkles } from 'lucide-react';

const PROCESS_STEPS = [
  {
    id: 1,
    title: 'Diagnostic Sorting & Barcoding',
    icon: Layers,
    description: 'Garments are individually inspected under high-CRI daylight lamps. Stains are cataloged (oil, tannin, protein), fabric blend tags verified, and unique heat-seal QR tags assigned.',
    highlights: ['Zero lost garments with QR tracking', 'Colours segregated by thermal tolerance', 'Delicate buttons & embroidery protected']
  },
  {
    id: 2,
    title: 'De-mineralized RO Hydro-Wash',
    icon: Droplets,
    description: 'We wash exclusively with 0-hardness RO water. Coupled with eco-certified enzyme solutions, this prevents grey sediment deposition and preserves cotton flexibility.',
    highlights: ['Zero hard water mineral crusting', 'European hypoallergenic detergents', 'Dedicated separate wash drum']
  },
  {
    id: 3,
    title: 'Precision Vacuum Steam Finishing',
    icon: Wind,
    description: 'Garments are placed on Italian heated vacuum tables. Pressurized steam is drawn through the fabric fibers rather than smashed by a metal plate, eliminating fabric shine.',
    highlights: ['Eliminates scorch marks completely', 'Restores natural garment silhouette', 'Sharp shirt collars and lapels']
  },
  {
    id: 4,
    title: 'Triple-Point QC & Sealed Packaging',
    icon: ShieldCheck,
    description: 'Every hem, seam, and button is verified by a senior inspector. Packaged in moisture-resistant breathable dust covers or placed on custom recycled velvet-touch hangers.',
    highlights: ['Final UV-C germicidal sanitation', 'Moth-proof breathable dust covers', 'Ready-to-hang wardrobe delivery']
  }
];

export const ProcessSection = () => {
  const [activeStep, setActiveStep] = useState(1);
  const currentStep = PROCESS_STEPS.find((s) => s.id === activeStep) || PROCESS_STEPS[0];
  const StepIcon = currentStep.icon;

  return (
    <section className="section" style={{ background: '#FFFFFF' }}>
      <div className="container">
        <SectionHeader
          badge="Behind The Scenes"
          badgeIcon={Layers}
          title="The Scientific Garment"
          highlightText="Processing Pipeline"
          subtitle="Take a look inside our state-of-the-art Mysore facility where cutting-edge European machinery meets artisan care."
        />

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '2.5rem',
            alignItems: 'center'
          }}
        >
          {/* Step Selector Buttons */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
            {PROCESS_STEPS.map((step) => {
              const Icon = step.icon;
              const isActive = activeStep === step.id;

              return (
                <div
                  key={step.id}
                  onClick={() => setActiveStep(step.id)}
                  style={{
                    padding: '1.25rem 1.5rem',
                    borderRadius: 'var(--radius-xl)',
                    border: isActive ? '2px solid var(--color-pink)' : '1px solid var(--color-border)',
                    background: isActive ? 'var(--color-pink-soft)' : '#FAFAFC',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '1rem',
                    transition: 'all var(--transition-fast)'
                  }}
                >
                  <div
                    style={{
                      width: '44px',
                      height: '44px',
                      borderRadius: 'var(--radius-md)',
                      background: isActive ? 'var(--color-pink)' : '#FFFFFF',
                      color: isActive ? '#FFFFFF' : 'var(--color-purple)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
                      flexShrink: 0
                    }}
                  >
                    <Icon size={20} />
                  </div>

                  <div>
                    <span style={{ fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.06em', color: isActive ? 'var(--color-pink)' : 'var(--color-muted)', fontWeight: 700 }}>
                      Stage 0{step.id}
                    </span>
                    <h4 style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--color-dark)', margin: '0.1rem 0 0 0' }}>
                      {step.title}
                    </h4>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Active Step Deep-Dive Card */}
          <div
            className="card-feature-neu"
            style={{
              padding: '2.5rem',
              borderRadius: 'var(--radius-3xl)',
              background: 'linear-gradient(145deg, #FAF8F5, #F2EFEA)',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              minHeight: '380px'
            }}
          >
            <div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
                <div className="card-icon-badge-pink" style={{ width: '52px', height: '52px' }}>
                  <StepIcon size={26} />
                </div>
                <span className="badge badge-purple" style={{ fontFamily: 'var(--font-heading)', fontSize: '0.8rem' }}>
                  Stage 0{currentStep.id} Quality Protocol
                </span>
              </div>

              <h3 className="heading-section" style={{ fontSize: '1.45rem', marginBottom: '1rem' }}>
                {currentStep.title}
              </h3>

              <p style={{ fontSize: '0.95rem', color: 'var(--color-muted)', lineHeight: 1.7, marginBottom: '2rem' }}>
                {currentStep.description}
              </p>
            </div>

            <div>
              <h5 style={{ fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--color-purple)', marginBottom: '0.75rem', fontWeight: 700 }}>
                Guaranteed Benchmarks:
              </h5>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                {currentStep.highlights.map((h, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.88rem', color: 'var(--color-dark)' }}>
                    <CheckCircle2 size={16} color="var(--color-pink)" />
                    <span>{h}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProcessSection;

