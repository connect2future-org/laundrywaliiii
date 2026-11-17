import { Link } from 'react-router-dom';
import { MapPin, Phone, ExternalLink, Sparkles, CheckCircle2 } from 'lucide-react';
import { getBookPickupWhatsAppUrl } from '../../utils/whatsapp';

export const BranchCard = ({ branch }) => {
  return (
    <div className="branch-card-root">
      {/* Top Header */}
      <div className="branch-card-header">
        <div className="branch-badge">
          <Sparkles size={13} />
          <span>Confirmed Studio Facility</span>
        </div>
        <h3 className="branch-card-name">{branch.name}</h3>
      </div>

      {/* Address */}
      <div className="branch-address-row">
        <div className="branch-icon-pin">
          <MapPin size={20} />
        </div>
        <div className="branch-address-text">
          <strong>Primary Location:</strong>
          <p>{branch.address}</p>
          <span className="branch-landmark">Landmark: {branch.landmark}</span>
        </div>
      </div>

      {/* Phone & Direct Contact Box */}
      <div className="branch-contact-box">
        <div className="branch-contact-left">
          <div className="branch-phone-icon-wrap">
            <Phone size={18} />
          </div>
          <div>
            <span className="contact-label">Customer Support & Desk</span>
            <a href={`tel:+91${branch.phone}`} className="contact-phone-number">
              +91 {branch.phone}
            </a>
          </div>
        </div>

        <a href={`tel:+91${branch.phone}`} className="btn-call-branch">
          <span>Call Desk</span>
        </a>
      </div>

      {/* Services Handled at Facility */}
      <div className="branch-services-wrap">
        <span className="services-title">Services Available at this Studio:</span>
        <div className="services-pill-list">
          {branch.servicesAvailable.map((srv, i) => (
            <span key={i} className="service-tag-pill">
              <CheckCircle2 size={13} className="tag-check" />
              <span>{srv}</span>
            </span>
          ))}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="branch-card-actions">
        <a
          href={branch.mapUrl}
          target="_blank"
          rel="noreferrer"
          className="btn-branch-directions"
        >
          <span>Get Directions</span>
          <ExternalLink size={15} />
        </a>

        <a
          href={getBookPickupWhatsAppUrl()}
          target="_blank"
          rel="noopener noreferrer"
          className="btn-branch-pickup"
          aria-label="Book Doorstep Pickup on WhatsApp"
        >
          <Sparkles size={16} />
          <span>Book Doorstep Pickup</span>
        </a>
      </div>

      <style>{`
        .branch-card-root {
          background: #FFFFFF;
          border: 1px solid #EEE9EF;
          border-radius: 28px;
          padding: 2.5rem;
          box-shadow: 0 6px 24px rgba(23, 20, 33, 0.045);
          position: relative;
        }

        .branch-card-header {
          margin-bottom: 1.5rem;
        }

        .branch-badge {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          background: #F6EEF8;
          color: #700F63;
          font-family: var(--font-body);
          font-size: 0.76rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.06em;
          padding: 4px 12px;
          border-radius: 9999px;
          margin-bottom: 0.65rem;
        }

        .branch-card-name {
          font-family: var(--font-heading);
          font-style: italic;
          font-size: 1.85rem;
          font-weight: 700;
          color: #171421;
          margin: 0;
          letter-spacing: -0.01em;
        }

        .branch-address-row {
          display: flex;
          align-items: flex-start;
          gap: 0.9rem;
          margin-bottom: 1.75rem;
        }

        .branch-icon-pin {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          background: #F6EEF8;
          color: #700F63;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          margin-top: 2px;
        }

        .branch-address-text strong {
          display: block;
          font-family: var(--font-body);
          font-size: 0.85rem;
          color: #171421;
          margin-bottom: 0.2rem;
        }

        .branch-address-text p {
          font-family: var(--font-body);
          font-size: 0.98rem;
          color: #45414D;
          line-height: 1.6;
          margin: 0 0 0.35rem;
        }

        .branch-landmark {
          display: inline-block;
          font-family: var(--font-body);
          font-size: 0.82rem;
          color: #700F63;
          font-weight: 600;
        }

        .branch-contact-box {
          background: #FCFAFC;
          border: 1px solid rgba(220, 204, 226, 0.75);
          border-radius: 20px;
          padding: 1.25rem 1.75rem;
          margin-bottom: 2rem;
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 1rem;
        }

        .branch-contact-left {
          display: flex;
          align-items: center;
          gap: 0.85rem;
        }

        .branch-phone-icon-wrap {
          width: 42px;
          height: 42px;
          border-radius: 50%;
          background: #700F63;
          color: #FFFFFF;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .contact-label {
          display: block;
          font-family: var(--font-body);
          font-size: 0.74rem;
          color: #77717D;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          font-weight: 600;
        }

        .contact-phone-number {
          font-family: var(--font-heading);
          font-size: 1.18rem;
          font-weight: 700;
          color: #171421;
          text-decoration: none;
        }

        .contact-phone-number:hover {
          color: #700F63;
        }

        .btn-call-branch {
          padding: 0.65rem 1.4rem;
          font-family: var(--font-body);
          font-size: 0.88rem;
          font-weight: 600;
          background: #700F63;
          color: #FFFFFF;
          border-radius: 9999px;
          text-decoration: none;
          transition: all 0.2s;
        }

        .btn-call-branch:hover {
          background: #6D0062;
          transform: translateY(-2px);
        }

        .branch-services-wrap {
          margin-bottom: 2rem;
        }

        .services-title {
          font-family: var(--font-body);
          font-size: 0.82rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.06em;
          color: #171421;
          display: block;
          margin-bottom: 0.85rem;
        }

        .services-pill-list {
          display: flex;
          flex-wrap: wrap;
          gap: 0.55rem;
        }

        .service-tag-pill {
          display: inline-flex;
          align-items: center;
          gap: 5px;
          background: #FFFFFF;
          border: 1px solid #EEE9EF;
          padding: 6px 13px;
          border-radius: 9999px;
          font-family: var(--font-body);
          font-size: 0.82rem;
          color: #45414D;
          box-shadow: 0 2px 6px rgba(23, 20, 33, 0.03);
        }

        .tag-check {
          color: #700F63;
        }

        .branch-card-actions {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 1rem;
          padding-top: 1.75rem;
          border-top: 1px solid rgba(220, 204, 226, 0.75);
        }

        .btn-branch-directions {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          background: #700F63;
          color: #FFFFFF;
          font-family: var(--font-body);
          font-size: 0.95rem;
          font-weight: 600;
          padding: 0.85rem 1.5rem;
          border-radius: 9999px;
          text-decoration: none;
          transition: all 0.2s;
          box-shadow: 0 4px 14px rgba(112, 15, 99, 0.22);
        }

        .btn-branch-directions:hover {
          background: #590A4E;
          transform: translateY(-2px);
        }

        .btn-branch-pickup {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          background: #FFFFFF;
          color: #700F63;
          border: 1px solid rgba(112, 15, 99, 0.35);
          font-family: var(--font-body);
          font-size: 0.95rem;
          font-weight: 600;
          padding: 0.85rem 1.5rem;
          border-radius: 9999px;
          text-decoration: none;
          transition: all 0.2s;
          box-shadow: 0 4px 14px rgba(23, 20, 33, 0.04);
        }

        .btn-branch-pickup:hover {
          border-color: #700F63;
          background: #F8F2F9;
          color: #4B1248;
          transform: translateY(-2px);
        }

        @media (max-width: 640px) {
          .branch-card-root {
            padding: 1.6rem;
          }
          .branch-card-actions {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
};

export default BranchCard;
