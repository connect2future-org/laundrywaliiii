import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import {
  X,
  Download,
  CheckCircle2,
  AlertCircle,
  TrendingUp,
  ShieldCheck,
  GraduationCap,
  Sparkles,
  Loader2
} from 'lucide-react';
import { franchiseApi } from '../../services/api';

const BROCHURE_PDF_URL = '/docs/laundry-waliiii-franchise-brochure.pdf';
const BROCHURE_FILENAME = 'Laundry-Waliiii-Franchise-Brochure.pdf';

export const FranchiseBrochureModal = ({ isOpen, onClose }) => {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    city: ''
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [submitError, setSubmitError] = useState(null);

  const modalRef = useRef(null);

  // Reset form when modal opens
  useEffect(() => {
    if (isOpen) {
      setFormData({ name: '', phone: '', email: '', city: '' });
      setErrors({});
      setIsSuccess(false);
      setSubmitError(null);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  // Handle escape key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  // Sanitize phone input to only numeric digits (0-9) up to 10 chars
  const handlePhoneChange = (e) => {
    const rawVal = e.target.value;
    const digitsOnly = rawVal.replace(/\D/g, '').slice(0, 10);
    setFormData((prev) => ({ ...prev, phone: digitsOnly }));
    if (errors.phone) {
      setErrors((prev) => ({ ...prev, phone: null }));
    }
  };

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: null }));
    }
  };

  const validate = () => {
    const newErrors = {};

    // 1. Full Name: Required, not whitespace only, min 2 chars
    if (!formData.name.trim()) {
      newErrors.name = 'Please enter your full name.';
    } else if (formData.name.trim().length < 2) {
      newErrors.name = 'Full name must be at least 2 characters.';
    }

    // 2. Phone Number: Required, exactly 10 digits
    if (!formData.phone) {
      newErrors.phone = 'Please enter your 10-digit mobile number.';
    } else if (formData.phone.length !== 10) {
      newErrors.phone = 'Phone number must be exactly 10 digits.';
    } else if (!/^[6-9]\d{9}$/.test(formData.phone)) {
      newErrors.phone = 'Please enter a valid 10-digit Indian mobile number.';
    }

    // 3. Email: Optional, format validated if supplied
    if (formData.email.trim()) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email.trim())) {
        newErrors.email = 'Please enter a valid email address.';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const triggerPdfDownload = () => {
    try {
      const link = document.createElement('a');
      link.href = BROCHURE_PDF_URL;
      link.download = BROCHURE_FILENAME;
      link.target = '_blank';
      link.rel = 'noopener noreferrer';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (err) {
      console.error('[BrochureModal] Auto download error:', err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitError(null);

    if (!validate()) return;

    setIsSubmitting(true);

    try {
      await franchiseApi.submitBrochureLead({
        name: formData.name.trim(),
        phone: formData.phone.trim(),
        email: formData.email.trim() || undefined,
        city: formData.city.trim() || undefined,
        source: 'Franchise Brochure Download'
      });

      // Successful backend persistence -> trigger official attached PDF download
      setIsSuccess(true);
      triggerPdfDownload();
    } catch (err) {
      console.error('[BrochureModal] Submission failed:', err);
      setSubmitError(
        err.message || 'Unable to submit your details right now. Please try again or contact us on WhatsApp.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const modalContent = (
    <div
      className="brochure-modal-backdrop"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      role="dialog"
      aria-modal="true"
      aria-labelledby="brochure-modal-title"
    >
      <div className="brochure-modal-dialog" ref={modalRef}>
        {/* Close Button */}
        <button
          type="button"
          className="brochure-modal-close-btn"
          onClick={onClose}
          aria-label="Close modal"
        >
          <X size={20} />
        </button>

        {!isSuccess ? (
          <div className="brochure-modal-body">
            {/* Modal Header */}
            <div className="brochure-modal-header">
              <div className="brochure-badge-pill">
                <Sparkles size={13} />
                <span>OFFICIAL FRANCHISE DOSSIER</span>
              </div>
              <h2 id="brochure-modal-title" className="brochure-modal-heading">
                Download Franchise Brochure
              </h2>
              <p className="brochure-modal-desc">
                Learn more about Laundry Waliiii's franchise opportunities, investment plans,
                revenue projections, operational support, training, and business growth opportunities.
              </p>
            </div>

            {/* 4 Highlight Benefits */}
            <div className="brochure-highlights-grid">
              <div className="highlight-item">
                <div className="highlight-icon">
                  <ShieldCheck size={16} />
                </div>
                <span>Low Investment</span>
              </div>

              <div className="highlight-item">
                <div className="highlight-icon">
                  <TrendingUp size={16} />
                </div>
                <span>High ROI Potential</span>
              </div>

              <div className="highlight-item">
                <div className="highlight-icon">
                  <GraduationCap size={16} />
                </div>
                <span>Complete Training Support</span>
              </div>

              <div className="highlight-item">
                <div className="highlight-icon">
                  <Sparkles size={16} />
                </div>
                <span>Marketing & Branding Support</span>
              </div>
            </div>

            {/* Error Banner */}
            {submitError && (
              <div className="brochure-error-alert" role="alert">
                <AlertCircle size={18} />
                <span>{submitError}</span>
              </div>
            )}

            {/* Lead Capture Form */}
            <form onSubmit={handleSubmit} className="brochure-lead-form" noValidate>
              {/* Field 1: Full Name */}
              <div className="form-group">
                <label htmlFor="brochure-name" className="form-label">
                  Full Name <span className="required-star">*</span>
                </label>
                <input
                  id="brochure-name"
                  type="text"
                  className={`form-input ${errors.name ? 'input-error' : ''}`}
                  placeholder="e.g. Rahul Sharma"
                  value={formData.name}
                  onChange={(e) => handleChange('name', e.target.value)}
                  disabled={isSubmitting}
                  autoComplete="name"
                  required
                />
                {errors.name && <span className="field-error-msg">{errors.name}</span>}
              </div>

              {/* Field 2: Phone Number */}
              <div className="form-group">
                <label htmlFor="brochure-phone" className="form-label">
                  Phone Number <span className="required-star">*</span>
                </label>
                <div className="phone-input-wrap">
                  <span className="phone-prefix">+91</span>
                  <input
                    id="brochure-phone"
                    type="tel"
                    inputMode="numeric"
                    maxLength={10}
                    className={`form-input phone-input ${errors.phone ? 'input-error' : ''}`}
                    placeholder="10-digit mobile number"
                    value={formData.phone}
                    onChange={handlePhoneChange}
                    onPaste={(e) => {
                      e.preventDefault();
                      const pasted = e.clipboardData.getData('text');
                      const digits = pasted.replace(/\D/g, '').slice(0, 10);
                      setFormData((prev) => ({ ...prev, phone: digits }));
                    }}
                    disabled={isSubmitting}
                    autoComplete="tel"
                    required
                  />
                </div>
                {errors.phone && <span className="field-error-msg">{errors.phone}</span>}
              </div>

              {/* Field 3: Email Address (Optional) */}
              <div className="form-group">
                <label htmlFor="brochure-email" className="form-label">
                  Email Address <span className="optional-tag">(Optional)</span>
                </label>
                <input
                  id="brochure-email"
                  type="email"
                  className={`form-input ${errors.email ? 'input-error' : ''}`}
                  placeholder="name@example.com"
                  value={formData.email}
                  onChange={(e) => handleChange('email', e.target.value)}
                  disabled={isSubmitting}
                  autoComplete="email"
                />
                {errors.email && <span className="field-error-msg">{errors.email}</span>}
              </div>

              {/* Field 4: City (Optional) */}
              <div className="form-group">
                <label htmlFor="brochure-city" className="form-label">
                  City <span className="optional-tag">(Optional)</span>
                </label>
                <input
                  id="brochure-city"
                  type="text"
                  className="form-input"
                  placeholder="e.g. Mysore, Bengaluru"
                  value={formData.city}
                  onChange={(e) => handleChange('city', e.target.value)}
                  disabled={isSubmitting}
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="btn-brochure-submit"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 size={18} className="animate-spin" />
                    <span>Processing Details...</span>
                  </>
                ) : (
                  <>
                    <Download size={18} />
                    <span>Submit & Download Brochure</span>
                  </>
                )}
              </button>
            </form>
          </div>
        ) : (
          /* Success Screen */
          <div className="brochure-success-view">
            <div className="success-icon-wrap">
              <CheckCircle2 size={46} color="#700F63" strokeWidth={2.2} />
            </div>

            <h3 className="success-main-heading">Your brochure is ready!</h3>
            <p className="success-subheading">
              Thank you for your interest in Laundry Waliiii. Your franchise brochure download has started.
            </p>

            <div className="success-action-group">
              <a
                href={BROCHURE_PDF_URL}
                download={BROCHURE_FILENAME}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-brochure-download-again"
              >
                <Download size={17} />
                <span>Click here if download didn't start</span>
              </a>

              <button
                type="button"
                className="btn-brochure-close-modal"
                onClick={onClose}
              >
                Close & Return to Website
              </button>
            </div>
          </div>
        )}
      </div>

      <style>{`
        .brochure-modal-backdrop {
          position: fixed;
          inset: 0;
          background: rgba(18, 9, 23, 0.75);
          backdrop-filter: blur(5px);
          -webkit-backdrop-filter: blur(5px);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 999999;
          padding: 1rem;
          overflow-y: auto;
        }

        .brochure-modal-dialog {
          background: #FFFFFF !important;
          opacity: 1 !important;
          width: 100%;
          max-width: 540px;
          border-radius: 20px;
          box-shadow: 0 25px 70px rgba(45, 10, 48, 0.35), 0 4px 16px rgba(0, 0, 0, 0.1);
          position: relative;
          overflow: hidden;
          padding: 2.25rem 2rem 2.25rem;
          border: 1px solid rgba(112, 15, 99, 0.12);
          z-index: 1000000;
        }

        @keyframes modalScaleUp {
          from {
            opacity: 0;
            transform: scale(0.96) translateY(8px);
          }
          to {
            opacity: 1;
            transform: scale(1) translateY(0);
          }
        }

        .brochure-modal-close-btn {
          position: absolute;
          top: 1.15rem;
          right: 1.15rem;
          background: #F5EEF8;
          border: none;
          color: #5C5564;
          width: 36px;
          height: 36px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.2s ease;
          z-index: 10;
        }

        .brochure-modal-close-btn:hover {
          background: #E8D9EE;
          color: #1A1320;
          transform: rotate(90deg);
        }

        .brochure-modal-header {
          text-align: center;
          margin-bottom: 1.5rem;
        }

        .brochure-badge-pill {
          display: inline-flex;
          align-items: center;
          gap: 0.4rem;
          background: #FAF2FB;
          color: #700F63;
          border: 1px solid rgba(112, 15, 99, 0.18);
          font-family: var(--font-body);
          font-size: 0.72rem;
          font-weight: 700;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          padding: 0.32rem 0.85rem;
          border-radius: 9999px;
          margin-bottom: 0.75rem;
        }

        .brochure-modal-heading {
          font-family: 'Playfair Display', Georgia, serif;
          font-style: italic;
          font-size: 1.85rem;
          font-weight: 700;
          color: #1A1320;
          margin: 0 0 0.5rem;
          line-height: 1.2;
        }

        .brochure-modal-desc {
          font-family: var(--font-body);
          font-size: 0.88rem;
          color: #5C5564;
          line-height: 1.55;
          margin: 0;
        }

        /* 4 Highlights */
        .brochure-highlights-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 0.55rem;
          margin-bottom: 1.5rem;
          background: #FAF7FC;
          padding: 0.85rem;
          border-radius: 12px;
          border: 1px solid rgba(220, 204, 226, 0.5);
        }

        .highlight-item {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-family: var(--font-body);
          font-size: 0.78rem;
          font-weight: 600;
          color: #38004D;
        }

        .highlight-icon {
          width: 26px;
          height: 26px;
          border-radius: 50%;
          background: #FFFFFF;
          color: #700F63;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          box-shadow: 0 1px 4px rgba(112, 15, 99, 0.12);
        }

        .brochure-error-alert {
          display: flex;
          align-items: center;
          gap: 0.65rem;
          background: #FDF2F4;
          color: #B42318;
          border: 1px solid #FECDCA;
          padding: 0.75rem 0.95rem;
          border-radius: 10px;
          font-size: 0.82rem;
          margin-bottom: 1.25rem;
        }

        /* Form */
        .brochure-lead-form {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .form-group {
          display: flex;
          flex-direction: column;
          gap: 0.35rem;
          text-align: left;
        }

        .form-label {
          font-family: var(--font-body);
          font-size: 0.82rem;
          font-weight: 600;
          color: #2D1A38;
        }

        .required-star {
          color: #E91E78;
          font-weight: 700;
        }

        .optional-tag {
          font-weight: 400;
          font-size: 0.75rem;
          color: #8C8395;
        }

        .form-input {
          font-family: var(--font-body);
          font-size: 0.92rem;
          padding: 0.72rem 0.95rem;
          border: 1.5px solid #E5DDE9;
          border-radius: 10px;
          background: #FFFFFF;
          color: #1A1320;
          transition: border-color 0.2s, box-shadow 0.2s;
          outline: none;
        }

        .form-input:focus {
          border-color: #700F63;
          box-shadow: 0 0 0 3px rgba(112, 15, 99, 0.12);
        }

        .form-input.input-error {
          border-color: #D92D20;
          background: #FFFBFB;
        }

        .phone-input-wrap {
          display: flex;
          align-items: stretch;
          border: 1.5px solid #E5DDE9;
          border-radius: 10px;
          overflow: hidden;
          background: #FFFFFF;
          transition: border-color 0.2s, box-shadow 0.2s;
        }

        .phone-input-wrap:focus-within {
          border-color: #700F63;
          box-shadow: 0 0 0 3px rgba(112, 15, 99, 0.12);
        }

        .phone-prefix {
          display: flex;
          align-items: center;
          padding: 0 0.85rem;
          background: #FAF7FC;
          color: #5C5564;
          font-size: 0.88rem;
          font-weight: 600;
          border-right: 1.5px solid #E5DDE9;
          user-select: none;
        }

        .phone-input {
          border: none !important;
          border-radius: 0 !important;
          box-shadow: none !important;
          flex: 1;
        }

        .field-error-msg {
          font-family: var(--font-body);
          font-size: 0.75rem;
          color: #D92D20;
          margin-top: 0.15rem;
        }

        .btn-brochure-submit {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 0.55rem;
          background: #700F63;
          color: #FFFFFF;
          border: none;
          padding: 0.92rem 1.5rem;
          font-family: var(--font-body);
          font-size: 0.95rem;
          font-weight: 600;
          border-radius: 9999px;
          cursor: pointer;
          margin-top: 0.5rem;
          transition: all 0.2s ease;
          box-shadow: 0 4px 16px rgba(112, 15, 99, 0.28);
        }

        .btn-brochure-submit:hover:not(:disabled) {
          background: #590A4E;
          transform: translateY(-1.5px);
          box-shadow: 0 6px 20px rgba(112, 15, 99, 0.38);
        }

        .btn-brochure-submit:disabled {
          opacity: 0.7;
          cursor: not-allowed;
        }

        /* Success View */
        .brochure-success-view {
          text-align: center;
          padding: 1.5rem 0.5rem;
        }

        .success-icon-wrap {
          width: 72px;
          height: 72px;
          background: #FDF3FB;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 1.25rem;
          box-shadow: 0 6px 20px rgba(112, 15, 99, 0.12);
        }

        .success-main-heading {
          font-family: 'Playfair Display', Georgia, serif;
          font-style: italic;
          font-size: 1.95rem;
          font-weight: 700;
          color: #1A1320;
          margin: 0 0 0.65rem;
        }

        .success-subheading {
          font-family: var(--font-body);
          font-size: 0.95rem;
          color: #5C5564;
          line-height: 1.6;
          max-width: 420px;
          margin: 0 auto 1.75rem;
        }

        .success-action-group {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
          max-width: 340px;
          margin: 0 auto;
        }

        .btn-brochure-download-again {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          background: #700F63;
          color: #FFFFFF;
          text-decoration: none;
          font-family: var(--font-body);
          font-size: 0.9rem;
          font-weight: 600;
          padding: 0.85rem 1.5rem;
          border-radius: 9999px;
          box-shadow: 0 4px 14px rgba(112, 15, 99, 0.22);
          transition: all 0.2s ease;
        }

        .btn-brochure-download-again:hover {
          background: #590A4E;
          transform: translateY(-1px);
        }

        .btn-brochure-close-modal {
          background: #FAF7FC;
          color: #5C5564;
          border: 1px solid #E5DDE9;
          font-family: var(--font-body);
          font-size: 0.88rem;
          font-weight: 600;
          padding: 0.8rem 1.5rem;
          border-radius: 9999px;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .btn-brochure-close-modal:hover {
          background: #F0E6F3;
          color: #1A1320;
        }

        @media (max-width: 480px) {
          .brochure-modal-dialog {
            padding: 1.75rem 1.25rem 1.75rem;
            border-radius: 16px;
          }
          .brochure-modal-heading {
            font-size: 1.6rem;
          }
          .brochure-highlights-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );

  return typeof document !== 'undefined'
    ? createPortal(modalContent, document.body)
    : modalContent;
};

export default FranchiseBrochureModal;
