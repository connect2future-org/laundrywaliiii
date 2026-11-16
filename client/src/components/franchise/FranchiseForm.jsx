import React, { useState, useEffect } from 'react';
import { Send, CheckCircle2, AlertCircle, Loader2, Sparkles, MessageCircle } from 'lucide-react';
import { isValidEmail, isValidPhone, validateRequired } from '../../utils/validators';
import { franchiseApi } from '../../services/api';
import { BRAND_CONFIG } from '../../config/brand';

export const FranchiseForm = ({ preselectedModel }) => {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    city: 'Mysore',
    investmentRange: '₹14 Lakhs – Express Kiosk',
    experience: '',
    message: ''
  });

  useEffect(() => {
    if (preselectedModel) {
      setFormData((prev) => ({
        ...prev,
        investmentRange: `${preselectedModel.investment} – ${preselectedModel.name}`
      }));
    }
  }, [preselectedModel]);

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [leadDetails, setLeadDetails] = useState(null);

  const validate = () => {
    const errs = {};
    if (!validateRequired(formData.name)) errs.name = 'Please enter your full name';
    const cleanPhone = String(formData.phone).replace(/\D/g, '');
    if (!cleanPhone || cleanPhone.length !== 10 || !/^[6-9]\d{9}$/.test(cleanPhone)) {
      errs.phone = 'Please enter a valid 10-digit mobile number';
    }
    if (formData.email && formData.email.trim() && !isValidEmail(formData.email.trim())) {
      errs.email = 'Please enter a valid email address';
    }
    if (!validateRequired(formData.city)) errs.city = 'Please specify your target city/neighborhood';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    let waWindow = null;
    try {
      waWindow = window.open('about:blank', '_blank');
    } catch {
      waWindow = null;
    }

    const payload = {
      name: formData.name.trim(),
      phone: formData.phone.replace(/\D/g, '').slice(-10),
      email: formData.email.trim(),
      city: formData.city.trim(),
      investmentRange: formData.investmentRange,
      experience: formData.experience.trim(),
      message: formData.message.trim()
    };

    try {
      const res = await franchiseApi.submitLead(payload);
      setLeadDetails(res);
      setIsSuccess(true);

      const franchiseWhatsAppMessage = `🤝 *FRANCHISE PARTNERSHIP ENQUIRY - LAUNDRY WALIIII*
━━━━━━━━━━━━━━━━━━━━
🆔 *Lead Reference ID:* ${res?.leadId || 'FL-NEW'}
👤 *Applicant Name:* ${payload.name}
📞 *Phone Number:* ${payload.phone}${payload.email ? `\n📧 *Email Address:* ${payload.email}` : ''}
📍 *Preferred City/Location:* ${payload.city}
💼 *Investment Model:* ${payload.investmentRange}${payload.experience ? `\n📊 *Business Experience:* ${payload.experience}` : ''}${payload.message ? `\n\n📝 *Applicant Notes:*\n${payload.message}` : ''}
━━━━━━━━━━━━━━━━━━━━
_Submitted via Laundry Waliiii Franchise Portal_`.trim();

      const waUrl = `https://wa.me/91${BRAND_CONFIG.contact.phone}?text=${encodeURIComponent(
        franchiseWhatsAppMessage
      )}`;

      if (waWindow && !waWindow.closed) {
        waWindow.location.href = waUrl;
      } else {
        window.open(waUrl, '_blank', 'noopener,noreferrer');
      }
    } catch (err) {
      if (waWindow && !waWindow.closed) {
        waWindow.close();
      }
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    setFormData({
      name: '',
      phone: '',
      email: '',
      city: 'Mysore',
      investmentRange: '₹14 Lakhs – Express Kiosk',
      experience: '',
      message: ''
    });
    setErrors({});
    setIsSuccess(false);
    setLeadDetails(null);
  };

  const generalFranchiseWhatsAppUrl = `https://wa.me/91${BRAND_CONFIG.contact.phone}?text=${encodeURIComponent(
    'Hello Laundry Walii Team, I am interested in exploring franchise partnership opportunities for Laundry Waliiii.'
  )}`;

  if (isSuccess && leadDetails) {
    const franchiseWhatsAppMessage = `🤝 *FRANCHISE PARTNERSHIP ENQUIRY - LAUNDRY WALIIII*
━━━━━━━━━━━━━━━━━━━━
🆔 *Lead Reference ID:* ${leadDetails?.leadId || 'FL-NEW'}
👤 *Applicant Name:* ${formData.name}
📞 *Phone Number:* ${formData.phone}
📧 *Email Address:* ${formData.email}
📍 *Preferred City/Location:* ${formData.city}
💼 *Investment Model:* ${formData.investmentRange}${formData.experience ? `\n📊 *Business Experience:* ${formData.experience.trim()}` : ''}${formData.message ? `\n\n📝 *Applicant Notes:*\n${formData.message.trim()}` : ''}
━━━━━━━━━━━━━━━━━━━━
_Submitted via Laundry Waliiii Franchise Portal_`.trim();

    const whatsappFranchiseUrl = `https://wa.me/91${BRAND_CONFIG.contact.phone}?text=${encodeURIComponent(
      franchiseWhatsAppMessage
    )}`;

    return (
      <div className="franchise-form-card form-success-view">
        <div className="success-icon-bubble">
          <CheckCircle2 size={36} />
        </div>

        <span className="lead-ref-badge">
          Lead Ref: {leadDetails.leadId}
        </span>

        <h3 className="success-heading">
          Franchise Enquiry Submitted Successfully!
        </h3>

        <p className="success-text">
          Thank you, <strong>{formData.name}</strong>. Your franchise partnership interest for <strong>{formData.investmentRange}</strong> in <strong>{formData.city}</strong> has been securely recorded in our database.
        </p>

        {/* Clean Status Box */}
        <div style={{
          margin: '1.25rem 0',
          padding: '0.85rem 1rem',
          borderRadius: '12px',
          fontSize: '0.82rem',
          textAlign: 'left',
          background: '#F0FDF4',
          border: '1px solid #BBF7D0',
          color: '#166534'
        }}>
          <div style={{ fontWeight: 700, marginBottom: '0.25rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <CheckCircle2 size={16} color="#16A34A" />
            <span>Application Saved in Database</span>
          </div>
          <div style={{ color: '#374151', fontSize: '0.78rem', lineHeight: 1.45 }}>
            WhatsApp was launched with your complete application prefilled to connect directly with our Franchise Expansion Desk (+91 {BRAND_CONFIG.contact.phone}). If WhatsApp did not open automatically, you can{' '}
            <a
              href={whatsappFranchiseUrl}
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: '#15803D', fontWeight: 700, textDecoration: 'underline' }}
            >
              click here to launch WhatsApp
            </a>.
          </div>
        </div>

        <div className="success-actions" style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', width: '100%', maxWidth: '340px', margin: '0 auto' }}>
          <button
            type="button"
            className="btn-submit-another"
            onClick={handleReset}
            style={{
              padding: '0.9rem 1.6rem',
              borderRadius: '100px',
              border: 'none',
              background: 'linear-gradient(135deg, #700F63 0%, #E91E63 100%)',
              color: '#FFFFFF',
              fontWeight: 700,
              fontSize: '0.92rem',
              cursor: 'pointer',
              boxShadow: '0 8px 20px rgba(112, 15, 99, 0.25)'
            }}
          >
            <span>Submit Another Enquiry</span>
          </button>

          <a
            href={whatsappFranchiseUrl}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.4rem',
              color: '#059669',
              fontSize: '0.82rem',
              fontWeight: 600,
              textDecoration: 'none',
              marginTop: '0.25rem'
            }}
          >
            <MessageCircle size={15} />
            <span>Reopen WhatsApp Message</span>
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="franchise-form-card">
      <div className="form-card-header">
        <div className="form-badge">
          <Sparkles size={12} />
          <span>Expression of Interest</span>
        </div>
        <h3 className="form-heading">Enquire About Franchise</h3>
        <p className="form-subheading">
          Fill out the details below. The Laundry Walii Team will review your territory preference and reach out to schedule an introductory consultation.
        </p>
      </div>

      <form onSubmit={handleSubmit} noValidate className="franchise-form-grid">
        <div className="form-row-two">
          <div className="form-field-group">
            <label className="field-label">
              Full Name <span className="req-star">*</span>
            </label>
            <input
              type="text"
              placeholder="e.g. Ramesh Hegde"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className={`field-input ${errors.name ? 'error' : ''}`}
            />
            {errors.name && <span className="error-text">{errors.name}</span>}
          </div>

          <div className="form-field-group">
            <label className="field-label">
              Mobile Number <span className="req-star">*</span>
            </label>
            <input
              type="tel"
              inputMode="numeric"
              pattern="[0-9]*"
              maxLength={10}
              placeholder="e.g. 9876543210"
              value={formData.phone}
              onKeyDown={(e) => {
                if (['Backspace', 'Delete', 'Tab', 'ArrowLeft', 'ArrowRight', 'Home', 'End', 'Enter'].includes(e.key)) {
                  return;
                }
                if (e.ctrlKey || e.metaKey) {
                  return;
                }
                if (!/^[0-9]$/.test(e.key)) {
                  e.preventDefault();
                }
              }}
              onChange={(e) => {
                const digitsOnly = e.target.value.replace(/\D/g, '').slice(0, 10);
                setFormData({ ...formData, phone: digitsOnly });
                if (errors.phone && digitsOnly.length === 10) {
                  setErrors((prev) => ({ ...prev, phone: null }));
                }
              }}
              className={`field-input ${errors.phone ? 'error' : ''}`}
            />
            {errors.phone && <span className="error-text">{errors.phone}</span>}
          </div>
        </div>

        <div className="form-row-two">
          <div className="form-field-group">
            <label className="field-label">
              Email Address <span style={{ color: '#6E667A', fontWeight: 500 }}>(Optional)</span>
            </label>
            <input
              type="email"
              placeholder="e.g. ramesh@example.com"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className={`field-input ${errors.email ? 'error' : ''}`}
            />
            {errors.email && <span className="error-text">{errors.email}</span>}
          </div>

          <div className="form-field-group">
            <label className="field-label">
              Preferred City / Locality <span className="req-star">*</span>
            </label>
            <input
              type="text"
              placeholder="e.g. Mysore (Gokulam / Vijayanagar)"
              value={formData.city}
              onChange={(e) => setFormData({ ...formData, city: e.target.value })}
              className={`field-input ${errors.city ? 'error' : ''}`}
            />
            {errors.city && <span className="error-text">{errors.city}</span>}
          </div>
        </div>

        <div className="form-field-group">
          <label className="field-label">Preferred Franchise Investment Plan</label>
          <select
            value={formData.investmentRange}
            onChange={(e) => setFormData({ ...formData, investmentRange: e.target.value })}
            className="field-input field-select"
          >
            <option value="₹14 Lakhs – Express Kiosk">Express Kiosk (₹14 Lakhs • 180–250 sq. ft.)</option>
            <option value="₹18 Lakhs – Standard Outlet">Standard Outlet (₹18 Lakhs • 180–250 sq. ft.)</option>
            <option value="₹24 Lakhs – Premium Center">Premium Center (₹24 Lakhs • 180–250 sq. ft.)</option>
            <option value="Multi-Unit Territory">Multi-Unit Territory Expansion</option>
          </select>
        </div>

        <div className="form-field-group">
          <label className="field-label">Any Additional Notes or Background (Optional)</label>
          <textarea
            rows="3"
            placeholder="Tell us about your business background or commercial property availability..."
            value={formData.message}
            onChange={(e) => setFormData({ ...formData, message: e.target.value })}
            className="field-input field-textarea"
          />
        </div>

        <div className="form-submit-row">
          <button
            type="submit"
            disabled={isSubmitting}
            className="btn-submit-franchise"
          >
            {isSubmitting ? (
              <>
                <Loader2 size={18} className="spin-icon" />
                <span>Saving &amp; Opening WhatsApp...</span>
              </>
            ) : (
              <>
                <MessageCircle size={18} />
                <span>Submit &amp; Continue to WhatsApp</span>
              </>
            )}
          </button>

          <a
            href={generalFranchiseWhatsAppUrl}
            target="_blank"
            rel="noreferrer"
            className="btn-whatsapp-direct"
          >
            <MessageCircle size={16} />
            <span>Chat on WhatsApp (+91 {BRAND_CONFIG.contact.phone})</span>
          </a>
        </div>
      </form>

      <style>{`
        .franchise-form-card {
          background: #FFFFFF;
          border: 1px solid rgba(220, 204, 226, 0.75);
          border-radius: 28px;
          padding: 2.75rem;
          box-shadow: 0 6px 24px rgba(70, 18, 75, 0.04);
        }

        .form-success-view {
          text-align: center;
          padding: 3.5rem 2rem;
        }

        .success-icon-bubble {
          width: 68px;
          height: 68px;
          border-radius: 50%;
          background: #ECFDF5;
          color: #10B981;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 1.25rem;
        }

        .lead-ref-badge {
          display: inline-block;
          background: #F6EEF8;
          color: #700F63;
          font-family: var(--font-body);
          font-size: 0.76rem;
          font-weight: 700;
          padding: 4px 12px;
          border-radius: 9999px;
          margin-bottom: 0.85rem;
        }

        .success-heading {
          font-family: var(--font-heading);
          font-style: italic;
          font-size: 1.6rem;
          color: #171421;
          margin-bottom: 0.65rem;
        }

        .success-text {
          font-family: var(--font-body);
          font-size: 0.95rem;
          color: #45414D;
          max-width: 520px;
          margin: 0 auto 1.75rem;
          line-height: 1.65;
        }

        .success-actions {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 1rem;
          flex-wrap: wrap;
        }

        .btn-submit-another {
          padding: 0.85rem 1.85rem;
          background: #700F63;
          color: #FFFFFF;
          border: none;
          border-radius: 9999px;
          font-family: var(--font-body);
          font-size: 0.92rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
        }

        .btn-submit-another:hover {
          background: #590A4E;
          transform: translateY(-2px);
        }

        .btn-whatsapp-chat {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.85rem 1.85rem;
          background: #ECFDF5;
          color: #059669;
          border: 1px solid #A7F3D0;
          border-radius: 9999px;
          font-family: var(--font-body);
          font-size: 0.92rem;
          font-weight: 600;
          text-decoration: none;
          transition: all 0.2s;
        }

        .btn-whatsapp-chat:hover {
          background: #059669;
          color: #FFFFFF;
          transform: translateY(-2px);
        }

        .form-card-header {
          margin-bottom: 2rem;
        }

        .form-badge {
          display: inline-flex;
          align-items: center;
          gap: 5px;
          background: #F6EEF8;
          color: #700F63;
          font-family: var(--font-body);
          font-size: 0.75rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.08em;
          padding: 4px 12px;
          border-radius: 9999px;
          margin-bottom: 0.5rem;
        }

        .form-heading {
          font-family: var(--font-heading);
          font-style: italic;
          font-size: 1.65rem;
          font-weight: 700;
          color: #171421;
          margin: 0 0 0.4rem 0;
        }

        .form-subheading {
          font-family: var(--font-body);
          font-size: 0.92rem;
          color: #45414D;
          line-height: 1.6;
          margin: 0;
        }

        .franchise-form-grid {
          display: flex;
          flex-direction: column;
          gap: 1.25rem;
        }

        .form-row-two {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1.25rem;
        }

        .form-field-group {
          display: flex;
          flex-direction: column;
          gap: 0.4rem;
        }

        .field-label {
          font-family: var(--font-body);
          font-size: 0.85rem;
          font-weight: 600;
          color: #171421;
        }

        .req-star {
          color: #700F63;
        }

        .field-input {
          width: 100%;
          padding: 0.82rem 1.15rem;
          border: 1px solid rgba(220, 204, 226, 0.75);
          border-radius: 14px;
          font-family: var(--font-body);
          font-size: 0.92rem;
          color: #171421;
          background: #FFFFFF;
          outline: none;
          transition: border-color 0.2s, box-shadow 0.2s;
        }

        .field-input:focus {
          border-color: #700F63;
          box-shadow: 0 0 0 3px rgba(112, 15, 99, 0.12);
        }

        .field-input.error {
          border-color: #EF4444;
          background: #FFFBFB;
        }

        .field-select {
          appearance: auto;
          cursor: pointer;
        }

        .field-textarea {
          resize: vertical;
          min-height: 80px;
        }

        .error-text {
          font-family: var(--font-body);
          font-size: 0.78rem;
          color: #EF4444;
        }

        .form-submit-row {
          display: flex;
          align-items: center;
          gap: 1.25rem;
          flex-wrap: wrap;
          margin-top: 0.75rem;
        }

        .btn-submit-franchise {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 0.6rem;
          padding: 0.95rem 2.2rem;
          background: #700F63;
          color: #FFFFFF;
          border: none;
          border-radius: 9999px;
          font-family: var(--font-body);
          font-size: 0.95rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.25s ease;
          box-shadow: 0 6px 18px rgba(112, 15, 99, 0.24);
        }

        .btn-submit-franchise:hover:not(:disabled) {
          background: #590A4E;
          transform: translateY(-2px);
          box-shadow: 0 10px 24px rgba(112, 15, 99, 0.32);
        }

        .btn-submit-franchise:disabled {
          opacity: 0.65;
          cursor: not-allowed;
        }

        .btn-whatsapp-direct {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.95rem 1.6rem;
          background: #ECFDF5;
          color: #059669;
          border: 1px solid #A7F3D0;
          border-radius: 9999px;
          font-family: var(--font-body);
          font-size: 0.9rem;
          font-weight: 600;
          text-decoration: none;
          transition: all 0.2s;
        }

        .btn-whatsapp-direct:hover {
          background: #059669;
          color: #FFFFFF;
          transform: translateY(-2px);
        }

        .spin-icon {
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        @media (max-width: 640px) {
          .franchise-form-card {
            padding: 1.75rem;
          }
          .form-row-two {
            grid-template-columns: 1fr;
          }
          .form-submit-row {
            flex-direction: column;
            width: 100%;
          }
          .btn-submit-franchise,
          .btn-whatsapp-direct {
            width: 100%;
            justify-content: center;
          }
        }
      `}</style>
    </div>
  );
};

export default FranchiseForm;
