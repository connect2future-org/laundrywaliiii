import React from 'react';

export const SectionHeader = ({
  badge,
  badgeIcon: BadgeIcon,
  badgeVariant = 'pink',
  title,
  highlightText,
  subtitle,
  centered = true,
  className = ''
}) => {
  return (
    <div
      className={`section-title-wrap ${className}`}
      style={{
        textAlign: centered ? 'center' : 'left',
        margin: centered ? '0 auto 3rem auto' : '0 0 2.5rem 0'
      }}
    >
      {badge && (
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.45rem',
            padding: '0.35rem 0.95rem',
            borderRadius: 'var(--radius-pill)',
            background: badgeVariant === 'purple' ? 'var(--color-purple-muted)' : 'var(--color-pink-soft)',
            color: badgeVariant === 'purple' ? 'var(--color-purple)' : 'var(--color-pink)',
            fontSize: '0.78rem',
            fontWeight: 700,
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
            marginBottom: '0.85rem',
            border: badgeVariant === 'purple' ? '1px solid rgba(57, 0, 79, 0.12)' : '1px solid rgba(233, 30, 120, 0.2)'
          }}
        >
          {BadgeIcon && <BadgeIcon size={14} />}
          <span>{badge}</span>
        </div>
      )}

      {title && (
        <h2 className="heading-section" style={{ color: 'var(--color-purple)' }}>
          {title}{' '}
          {highlightText && (
            <span style={{ fontFamily: 'var(--font-serif)', fontStyle: 'italic', color: 'var(--color-pink)' }}>
              {highlightText}
            </span>
          )}
        </h2>
      )}

      {subtitle && <p className="text-lead" style={{ marginTop: '0.75rem', color: 'var(--color-muted)' }}>{subtitle}</p>}
    </div>
  );
};

export default SectionHeader;
