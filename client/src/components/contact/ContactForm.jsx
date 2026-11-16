import { useState } from 'react';
import { Send, CheckCircle2, AlertCircle, Loader2, MessageCircle } from 'lucide-react';
import { isValidEmail, isValidPhone, validateRequired } from '../../utils/validators';
import { contactApi } from '../../services/api';

export const ContactForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    subject: 'General Service Inquiry',
    message: ''
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedSummary, setSubmittedSummary] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');

  const validate = () => {
    const errs = {};
    if (!validateRequired(formData.name) || formData.name.trim().length < 2) {
      errs.name = 'Please enter your full name (at least 2 characters)';
    }
    const cleanPhone = formData.phone.replace(/\D/g, '');
    if (!cleanPhone || cleanPhone.length !== 10 || !/^[6-9]\d{9}$/.test(cleanPhone)) {
      errs.phone = 'Phone number must be exactly 10 digits';
    }
    if (formData.email.trim() && !isValidEmail(formData.email)) {
      errs.email = 'Please enter a valid email address';
    }
    // Message field is optional: no mandatory/required validation applied
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isSubmitting) return;
    if (!validate()) return;

    setIsSubmitting(true);
    setErrorMessage('');

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
      subject: formData.subject,
      message: formData.message.trim(),
      source: 'website_contact_page'
    };

    try {
      const response = await contactApi.submitEnquiry(payload);

      const contactWhatsAppMessage = `💬 *NEW CUSTOMER ENQUIRY - LAUNDRY WALIIII*
━━━━━━━━━━━━━━━━━━━━
👤 *Customer Name:* ${payload.name}
📞 *Phone Number:* ${payload.phone}${payload.email ? `\n📧 *Email:* ${payload.email}` : ''}
🏷 *Enquiry Subject:* ${payload.subject}${payload.message ? `\n\n📝 *Message:*\n${payload.message}` : '\n\n📝 *Message:* (No additional message provided)'}
━━━━━━━━━━━━━━━━━━━━
_Submitted via Laundry Waliiii Contact Form_`.trim();

      const contactWhatsAppUrl = `https://wa.me/919035999272?text=${encodeURIComponent(contactWhatsAppMessage)}`;

      if (waWindow && !waWindow.closed) {
        waWindow.location.href = contactWhatsAppUrl;
      } else {
        window.open(contactWhatsAppUrl, '_blank', 'noopener,noreferrer');
      }

      setSubmittedSummary({
        name: payload.name,
        phone: payload.phone,
        email: payload.email,
        subject: payload.subject,
        message: payload.message,
        enquiryId: response?.enquiryId || null,
        whatsappUrl: contactWhatsAppUrl
      });
      setFormData({
        name: '',
        phone: '',
        email: '',
        subject: 'General Service Inquiry',
        message: ''
      });
      setErrors({});
    } catch (err) {
      if (waWindow && !waWindow.closed) {
        waWindow.close();
      }
      setErrorMessage(err.message || 'Failed to submit enquiry. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    setFormData({
      name: '',
      phone: '',
      email: '',
      subject: 'General Service Inquiry',
      message: ''
    });
    setErrors({});
    setSubmittedSummary(null);
    setErrorMessage('');
  };

  if (submittedSummary) {
    return (
      <div className="contact-form-card success-container">
        <div className="success-icon-wrap">
          <CheckCircle2 size={40} />
        </div>
        <h3 className="success-heading">Enquiry Submitted Successfully!</h3>
        <p className="success-desc">
          Thank you, <strong>{submittedSummary.name}</strong>! Your inquiry regarding{' '}
          <strong>{submittedSummary.subject}</strong> has been safely recorded in our database.
        </p>

        {/* Status Box */}
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
            <span>Enquiry Saved in Database</span>
          </div>
          <div style={{ color: '#374151', fontSize: '0.78rem', lineHeight: 1.45 }}>
            WhatsApp was launched with your enquiry prefilled to connect directly with our concierge team (+91 9035999272). If WhatsApp did not open automatically, you can reopen it using the link below.
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.75rem', width: '100%', maxWidth: '340px', margin: '1rem auto 0' }}>
          <a
            href={submittedSummary.whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.4rem',
              color: '#16A34A',
              fontSize: '0.85rem',
              fontWeight: 600,
              textDecoration: 'none'
            }}
          >
            <MessageCircle size={16} />
            <span>Reopen WhatsApp Message</span>
          </a>

          <button
            type="button"
            onClick={handleReset}
            className="btn-send-another"
            style={{ marginTop: '0.25rem' }}
          >
            <span>Send Another Message</span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="contact-form-card">
      {/* Header */}
      <div className="form-header">
        <span className="form-tag">ENQUIRY FORM</span>
        <h2 className="form-main-title">Send a <span style={{ color: '#700F63' }}>Message</span></h2>
        <p className="form-subtitle">
          Fill in your details below and our concierge team will respond within a few hours.
        </p>
      </div>

      {errorMessage && (
        <div className="form-error-banner" role="alert">
          <AlertCircle size={17} />
          <span>{errorMessage}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} noValidate className="form-body">
        {/* Full Name */}
        <div className="field-group">
          <label className="field-label" htmlFor="fullName">
            Full Name <span className="req">*</span>
          </label>
          <input
            id="fullName"
            type="text"
            placeholder="e.g. Ananya Sharma"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className={`form-input ${errors.name ? 'input-error' : ''}`}
          />
          {errors.name && <span className="error-hint">{errors.name}</span>}
        </div>

        {/* Mobile Number & Email Address (Side-by-side on desktop) */}
        <div className="fields-row-2">
          <div className="field-group">
            <label className="field-label" htmlFor="mobileNumber">
              Mobile Number <span className="req">*</span>
            </label>
            <input
              id="mobileNumber"
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
              className={`form-input ${errors.phone ? 'input-error' : ''}`}
            />
            {errors.phone && <span className="error-hint">{errors.phone}</span>}
          </div>

          <div className="field-group">
            <label className="field-label" htmlFor="emailAddress">
              Email Address <span style={{ color: '#6E667A', fontWeight: 500 }}>(Optional)</span>
            </label>
            <input
              id="emailAddress"
              type="email"
              placeholder="e.g. ananya@example.com"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className={`form-input ${errors.email ? 'input-error' : ''}`}
            />
            {errors.email && <span className="error-hint">{errors.email}</span>}
          </div>
        </div>

        {/* Enquiry Type Dropdown */}
        <div className="field-group">
          <label className="field-label" htmlFor="inquirySubject">
            Enquiry Type
          </label>
          <div className="select-wrapper">
            <select
              id="inquirySubject"
              value={formData.subject}
              onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
              className="form-input form-select"
            >
              <option value="General Service Inquiry">General Service Inquiry</option>
              <option value="Laundry Service">Laundry Service</option>
              <option value="Dry Cleaning">Dry Cleaning</option>
              <option value="Shoe Cleaning">Shoe Cleaning</option>
              <option value="Pickup and Delivery">Pickup and Delivery</option>
              <option value="Franchise Inquiry">Franchise Inquiry</option>
              <option value="Other">Other</option>
            </select>
          </div>
        </div>

        {/* Your Message (Optional) */}
        <div className="field-group">
          <label className="field-label" htmlFor="yourMessage">
            Your Message <span style={{ color: '#6E667A', fontWeight: 500 }}>(Optional)</span>
          </label>
          <textarea
            id="yourMessage"
            rows="4"
            placeholder="Tell us how we can help with your garment care..."
            value={formData.message}
            onChange={(e) => setFormData({ ...formData, message: e.target.value })}
            className={`form-input form-textarea ${errors.message ? 'input-error' : ''}`}
          />
          {errors.message && <span className="error-hint">{errors.message}</span>}
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="btn-submit-message"
        >
          {isSubmitting ? (
            <>
              <Loader2 size={18} className="spinner" />
              <span>Saving &amp; Opening WhatsApp...</span>
            </>
          ) : (
            <>
              <MessageCircle size={18} />
              <span>Send &amp; Continue to WhatsApp</span>
            </>
          )}
        </button>
      </form>

      <style>{`
        .contact-form-card {
          background: #FFFFFF;
          border-radius: 28px;
          border: 1px solid rgba(220, 204, 226, 0.75);
          box-shadow: 0 6px 24px rgba(70, 18, 75, 0.04);
          padding: 2.25rem 2.5rem;
          height: 100%;
          display: flex;
          flex-direction: column;
          box-sizing: border-box;
        }

        .form-header {
          margin-bottom: 1.5rem;
        }

        .form-tag {
          font-family: var(--font-body);
          font-size: 0.74rem;
          font-weight: 700;
          color: #700F63;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          display: block;
          margin-bottom: 0.35rem;
        }

        .form-main-title {
          font-family: var(--font-heading);
          font-style: italic;
          font-weight: 700;
          font-size: 2.1rem;
          color: #171421;
          line-height: 1.2;
          margin: 0 0 0.5rem 0;
          letter-spacing: -0.01em;
        }

        .form-subtitle {
          font-family: var(--font-body);
          font-size: 0.9rem;
          color: #45414D;
          line-height: 1.55;
          margin: 0;
        }

        .form-error-banner {
          display: flex;
          align-items: center;
          gap: 0.6rem;
          padding: 0.75rem 1rem;
          background: #FEF2F2;
          border: 1px solid #FECACA;
          border-radius: 12px;
          color: #DC2626;
          font-family: var(--font-body);
          font-size: 0.85rem;
          margin-bottom: 1.25rem;
        }

        .form-body {
          display: flex;
          flex-direction: column;
          gap: 1.15rem;
        }

        .fields-row-2 {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1.15rem;
        }

        .field-group {
          display: flex;
          flex-direction: column;
        }

        .field-label {
          font-family: var(--font-body);
          font-size: 0.84rem;
          font-weight: 600;
          color: #171421;
          margin-bottom: 0.35rem;
        }

        .req {
          color: #700F63;
        }

        .form-input {
          width: 100%;
          box-sizing: border-box;
          padding: 0.78rem 1rem;
          background: #FFFFFF;
          border: 1px solid rgba(220, 204, 226, 0.75);
          border-radius: 12px;
          font-family: var(--font-body);
          font-size: 0.92rem;
          color: #171421;
          outline: none;
          transition: border-color 0.2s, box-shadow 0.2s;
        }

        .form-input::placeholder {
          color: #77717D;
        }

        .form-input:focus {
          border-color: #700F63;
          box-shadow: 0 0 0 3px rgba(112, 15, 99, 0.12);
        }

        .form-input.input-error {
          border-color: #EF4444;
          background: #FFFDFD;
        }

        .select-wrapper {
          position: relative;
        }

        .form-select {
          appearance: auto;
          cursor: pointer;
          background: #FFFFFF;
        }

        .form-textarea {
          resize: vertical;
          min-height: 95px;
        }

        .error-hint {
          font-family: var(--font-body);
          font-size: 0.76rem;
          color: #DC2626;
          margin-top: 0.3rem;
        }

        .btn-submit-message {
          width: 100%;
          padding: 0.95rem 1.5rem;
          background: #700F63;
          color: #FFFFFF;
          border: none;
          border-radius: 9999px;
          font-family: var(--font-body);
          font-size: 0.98rem;
          font-weight: 600;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 0.55rem;
          cursor: pointer;
          transition: all 0.25s ease;
          box-shadow: 0 6px 18px rgba(112, 15, 99, 0.24);
          margin-top: 0.35rem;
        }

        .btn-submit-message:hover:not(:disabled) {
          background: #590A4E;
          transform: translateY(-2px);
          box-shadow: 0 10px 24px rgba(112, 15, 99, 0.32);
        }

        .btn-submit-message:disabled {
          opacity: 0.7;
          cursor: not-allowed;
        }

        .spinner {
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        /* Success State */
        .success-container {
          text-align: center;
          padding: 4rem 2rem;
          align-items: center;
          justify-content: center;
        }

        .success-icon-wrap {
          width: 68px;
          height: 68px;
          border-radius: 50%;
          background: #E8F8F0;
          color: #10B981;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 1.25rem;
        }

        .success-heading {
          font-family: var(--font-heading);
          font-style: italic;
          font-size: 1.6rem;
          color: #171421;
          margin: 0 0 0.65rem 0;
        }

        .success-desc {
          font-family: var(--font-body);
          font-size: 0.95rem;
          color: #45414D;
          max-width: 440px;
          margin: 0 auto 1.75rem;
          line-height: 1.6;
        }

        .btn-send-another {
          padding: 0.85rem 2rem;
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

        .btn-send-another:hover {
          background: #590A4E;
          transform: translateY(-2px);
        }

        @media (max-width: 640px) {
          .contact-form-card {
            padding: 1.75rem 1.4rem;
          }
          .fields-row-2 {
            grid-template-columns: 1fr;
            gap: 1.15rem;
          }
        }
      `}</style>
    </div>
  );
};

export default ContactForm;
