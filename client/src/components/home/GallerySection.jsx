import React from 'react';
import { SectionHeader } from '../common/SectionHeader';
import { Image, Sparkles, Shirt, Footprints, Layers, Zap, CheckCircle2 } from 'lucide-react';

const GALLERY_ITEMS = [
  {
    title: 'Italian Vacuum Steam Press Stations',
    category: 'Finishing Studio',
    icon: Zap,
    caption: 'Dual-vacuum industrial tables that extract moisture instantly for zero scorching and knife-sharp creases.',
    accentColor: '#E91E78'
  },
  {
    title: 'Ultrasonic Footwear Restoration Lab',
    category: 'Shoe Spa',
    icon: Footprints,
    caption: 'Sonic scrub basins and UV-C ozone sterilization towers designed for delicate knit, leather, and suede.',
    accentColor: '#39004F'
  },
  {
    title: 'Crisp Stack-Folded Everyday Cottons',
    category: 'Wash & Fold',
    icon: Shirt,
    caption: 'Uniform architectural fold geometry packed inside 100% biodegradable compostable carry bags.',
    accentColor: '#E91E78'
  },
  {
    title: 'Hydrocarbon Silk & Zari Dry Clean Vault',
    category: 'Delicates Care',
    icon: Sparkles,
    caption: 'Zero-PERC hydrocarbon solvent tanks ensuring heavy bridal zari work and pure mulberry silks retain original sheen.',
    accentColor: '#39004F'
  },
  {
    title: 'RO Water De-mineralization Facility',
    category: 'Purity & Water',
    icon: Layers,
    caption: 'Industrial reverse osmosis systems ensuring zero calcium hardness contacts your garment fibers.',
    accentColor: '#E91E78'
  },
  {
    title: 'Executive Suit & Blazer Hanger Line',
    category: 'Hanger Delivery',
    icon: CheckCircle2,
    caption: 'Reinforced contoured wooden-feel hangers enveloped in breathable dust-proof garment bags.',
    accentColor: '#39004F'
  }
];

export const GallerySection = () => {
  return (
    <section className="section" style={{ background: 'var(--color-cream)' }}>
      <div className="container">
        <SectionHeader
          badge="Behind The Scenes"
          badgeIcon={Image}
          title="Inside Our Modern"
          highlightText="Processing Hubs"
          subtitle="Explore the precision technology, hygienic protocols, and artisanal craftsmanship that care for your garments."
        />

        <div className="grid-3">
          {GALLERY_ITEMS.map((item, index) => {
            const Icon = item.icon;

            return (
              <div
                key={index}
                className="card-modern-flat"
                style={{
                  padding: '2rem 1.75rem',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  height: '100%',
                  background: '#FFFFFF'
                }}
              >
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
                    <div
                      className="card-icon-badge-pink"
                      style={{
                        background: index % 2 === 0 ? 'var(--color-pink-soft)' : 'var(--color-purple-muted)',
                        color: index % 2 === 0 ? 'var(--color-pink)' : 'var(--color-purple)'
                      }}
                    >
                      <Icon size={24} />
                    </div>

                    <span
                      className={`badge ${index % 2 === 0 ? 'badge-pink' : 'badge-purple'}`}
                      style={{ fontSize: '0.72rem', letterSpacing: '0.04em', textTransform: 'uppercase' }}
                    >
                      {item.category}
                    </span>
                  </div>

                  {/* Graphic preview plate */}
                  <div
                    style={{
                      height: '140px',
                      background: 'linear-gradient(135deg, #F6F6F9 0%, #EAEAEF 100%)',
                      borderRadius: 'var(--radius-lg)',
                      marginBottom: '1.25rem',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexDirection: 'column',
                      gap: '0.5rem',
                      border: '1px solid var(--color-border)',
                      position: 'relative',
                      overflow: 'hidden'
                    }}
                  >
                    <Icon size={42} color={item.accentColor} style={{ opacity: 0.85 }} />
                    <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--color-muted)' }}>
                      Laundry Waliiii Studio Standard
                    </span>

                    {/* Subtle aesthetic watermarked background */}
                    <div
                      style={{
                        position: 'absolute',
                        right: '-20px',
                        bottom: '-20px',
                        opacity: 0.05,
                        transform: 'rotate(-15deg)'
                      }}
                    >
                      <Icon size={120} color="var(--color-purple)" />
                    </div>
                  </div>

                  <h3
                    className="heading-card"
                    style={{ fontSize: '1.05rem', color: 'var(--color-dark)', marginBottom: '0.5rem' }}
                  >
                    {item.title}
                  </h3>

                  <p style={{ fontSize: '0.85rem', color: 'var(--color-muted)', lineHeight: 1.6 }}>
                    {item.caption}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default GallerySection;

