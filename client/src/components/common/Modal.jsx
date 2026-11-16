import React, { useEffect } from 'react';
import { X } from 'lucide-react';

export const Modal = ({
  isOpen,
  onClose,
  title,
  subtitle,
  children,
  maxWidth = '640px',
  showCloseButton = true
}) => {
  // ESC key handler and body scroll lock
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className={`modal-overlay ${isOpen ? 'active' : ''}`}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      role="dialog"
      aria-modal="true"
    >
      <div className="modal-content" style={{ maxWidth }}>
        {(title || showCloseButton) && (
          <div
            style={{
              padding: '1.25rem 1.5rem',
              borderBottom: '1px solid var(--color-border)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              position: 'sticky',
              top: 0,
              background: '#FFFFFF',
              zIndex: 10
            }}
          >
            <div>
              {title && <h3 className="heading-card" style={{ margin: 0 }}>{title}</h3>}
              {subtitle && <p className="text-small text-muted" style={{ margin: '0.2rem 0 0 0' }}>{subtitle}</p>}
            </div>
            {showCloseButton && (
              <button
                type="button"
                className="btn-neu-icon"
                onClick={onClose}
                aria-label="Close dialog"
                style={{ width: '36px', height: '36px' }}
              >
                <X size={18} />
              </button>
            )}
          </div>
        )}

        <div style={{ padding: '1.5rem' }}>{children}</div>
      </div>
    </div>
  );
};

export default Modal;

