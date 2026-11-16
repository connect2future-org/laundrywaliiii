import React from 'react';
import { MapPin, Check, Store } from 'lucide-react';
import { BRANCHES_DATA, PRIMARY_BRANCH } from '../../config/branches';

export const BranchSelector = ({ selectedBranchId, onSelectBranch }) => {
  // Only the single confirmed physical branch
  const branch = PRIMARY_BRANCH;
  const isSelected = !selectedBranchId || selectedBranchId === branch.id;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
      <div
        onClick={() => onSelectBranch && onSelectBranch(branch)}
        style={{
          padding: '1rem 1.15rem',
          borderRadius: 'var(--radius-lg)',
          border: '2px solid var(--color-pink)',
          background: 'var(--color-pink-soft)',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'flex-start',
          justifyContent: 'space-between',
          gap: '0.75rem',
          transition: 'all var(--transition-fast)'
        }}
      >
        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <div
            style={{
              width: '36px',
              height: '36px',
              borderRadius: 'var(--radius-sm)',
              background: 'var(--color-pink)',
              color: '#FFFFFF',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0
            }}
          >
            <Store size={18} />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.2rem' }}>
              <h5 style={{ fontSize: '0.95rem', fontWeight: 700, margin: 0, color: 'var(--color-dark)' }}>
                {branch.name}
              </h5>
              <span className="badge badge-purple" style={{ fontSize: '0.65rem' }}>
                Confirmed Branch
              </span>
            </div>
            <p style={{ fontSize: '0.8rem', color: 'var(--color-muted)', margin: 0, lineHeight: 1.4 }}>
              {branch.address}
            </p>
            <p style={{ fontSize: '0.75rem', color: 'var(--color-pink)', fontWeight: 600, margin: '0.25rem 0 0 0' }}>
              Official Helpline: {branch.phone}
            </p>
          </div>
        </div>

        <div
          style={{
            width: '20px',
            height: '20px',
            borderRadius: '50%',
            background: 'var(--color-pink)',
            color: '#FFFFFF',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
            marginTop: '4px'
          }}
        >
          <Check size={13} />
        </div>
      </div>
    </div>
  );
};

export default BranchSelector;
