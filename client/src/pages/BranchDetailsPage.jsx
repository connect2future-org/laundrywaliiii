import { useParams, Link } from 'react-router-dom';
import { BRANCHES_DATA, PRIMARY_BRANCH } from '../config/branches';
import { MapPin, Phone, ExternalLink, ArrowLeft, CheckCircle2, Sparkles } from 'lucide-react';
import { getBookPickupWhatsAppUrl } from '../utils/whatsapp';

export const BranchDetailsPage = () => {
  const { branchId } = useParams();
  const branch = BRANCHES_DATA.find((b) => b.id === branchId) || (branchId === 'mysore' ? PRIMARY_BRANCH : null);

  if (!branch) {
    return (
      <div className="branch-not-found-root">
        <h2 className="heading-section">Branch Not Found</h2>
        <p className="text-muted">We could not locate the branch you requested.</p>
        <Link to="/branches" className="btn-back-pill">
          <ArrowLeft size={16} />
          <span>Back to Branches</span>
        </Link>
      </div>
    );
  }

  return (
    <div className="branch-details-root">
      <div className="container" style={{ maxWidth: '880px', position: 'relative', zIndex: 2 }}>
        {/* Back Link */}
        <div className="branch-back-wrap">
          <Link to="/branches" className="back-link">
            <ArrowLeft size={16} />
            <span>Back to Studio Overview</span>
          </Link>
        </div>

        {/* Hero Card */}
        <div className="branch-details-card">
          <div className="details-badge">
            <Sparkles size={13} />
            <span>Confirmed Mysore Studio</span>
          </div>

          <h1 className="details-heading">{branch.name}</h1>

          <div className="details-address-row">
            <MapPin size={20} className="pin-icon" />
            <div className="address-content">
              <p className="address-text">{branch.address}</p>
              <span className="landmark-tag">Landmark: {branch.landmark}</span>
            </div>
          </div>

          {/* Contact Box */}
          <div className="details-contact-strip">
            <div className="contact-strip-left">
              <div className="phone-icon-bubble">
                <Phone size={18} />
              </div>
              <div>
                <span className="desk-label">Customer Concierge Desk</span>
                <a href={`tel:+91${branch.phone}`} className="phone-number-link">
                  +91 {branch.phone}
                </a>
              </div>
            </div>

            <a href={`tel:+91${branch.phone}`} className="btn-desk-call">
              <span>Call Studio</span>
            </a>
          </div>

          {/* Available Services */}
          <div className="details-services-section">
            <h3 className="section-title">Specialized Services Available</h3>
            <div className="services-grid">
              {branch.servicesAvailable.map((srv, idx) => (
                <div key={idx} className="service-feature-item">
                  <CheckCircle2 size={16} className="feature-check" />
                  <span>{srv}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Action Row */}
          <div className="details-action-row">
            <a
              href={branch.mapUrl}
              target="_blank"
              rel="noreferrer"
              className="btn-primary-direction"
            >
              <span>Get Directions on Google Maps</span>
              <ExternalLink size={15} />
            </a>

            <a
              href={getBookPickupWhatsAppUrl()}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-secondary-book"
              aria-label="Book Doorstep Pickup on WhatsApp"
            >
              <span>Book Doorstep Pickup</span>
            </a>
          </div>
        </div>
      </div>

      <style>{`
        .branch-details-root {
          background-color: #FFFFFF;
          min-height: 100vh;
          padding-top: calc(var(--header-height, 84px) + 2rem);
          padding-bottom: 6rem;
          position: relative;
          overflow: hidden;
        }

        .branch-not-found-root {
          text-align: center;
          padding: 8rem 1rem;
          background: #FFFFFF;
          min-height: 80vh;
        }

        .btn-back-pill {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          background: #700F63;
          color: #FFFFFF;
          padding: 0.75rem 1.6rem;
          border-radius: 9999px;
          text-decoration: none;
          font-weight: 600;
        }

        .branch-back-wrap {
          margin-bottom: 1.5rem;
        }

        .back-link {
          display: inline-flex;
          align-items: center;
          gap: 0.45rem;
          font-family: var(--font-body);
          font-size: 0.9rem;
          font-weight: 600;
          color: #700F63;
          text-decoration: none;
        }

        .back-link:hover {
          text-decoration: underline;
        }

        .branch-details-card {
          background: #FFFFFF;
          border: 1px solid rgba(220, 204, 226, 0.75);
          border-radius: 28px;
          padding: 3rem;
          box-shadow: 0 6px 24px rgba(70, 18, 75, 0.04);
        }

        .details-badge {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          background: #F6EEF8;
          color: #700F63;
          font-family: var(--font-body);
          font-size: 0.78rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.06em;
          padding: 5px 14px;
          border-radius: 9999px;
          margin-bottom: 1rem;
        }

        .details-heading {
          font-family: var(--font-heading);
          font-style: italic;
          font-size: clamp(2rem, 4vw, 2.75rem);
          font-weight: 700;
          color: #171421;
          margin-bottom: 1.25rem;
        }

        .details-address-row {
          display: flex;
          align-items: flex-start;
          gap: 0.85rem;
          margin-bottom: 2rem;
        }

        .pin-icon {
          color: #700F63;
          flex-shrink: 0;
          margin-top: 3px;
        }

        .address-text {
          font-family: var(--font-body);
          font-size: 1.05rem;
          color: #45414D;
          line-height: 1.6;
          margin: 0 0 0.4rem 0;
        }

        .landmark-tag {
          font-family: var(--font-body);
          font-size: 0.85rem;
          color: #700F63;
          font-weight: 600;
        }

        .details-contact-strip {
          background: #FCFAFC;
          border: 1px solid rgba(220, 204, 226, 0.75);
          border-radius: 20px;
          padding: 1.5rem 2rem;
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 1.25rem;
          margin-bottom: 2.5rem;
        }

        .contact-strip-left {
          display: flex;
          align-items: center;
          gap: 1rem;
        }

        .phone-icon-bubble {
          width: 44px;
          height: 44px;
          border-radius: 50%;
          background: #700F63;
          color: #FFFFFF;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .desk-label {
          display: block;
          font-family: var(--font-body);
          font-size: 0.76rem;
          color: #77717D;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          font-weight: 600;
        }

        .phone-number-link {
          font-family: var(--font-heading);
          font-size: 1.25rem;
          font-weight: 700;
          color: #171421;
          text-decoration: none;
        }

        .phone-number-link:hover {
          color: #700F63;
        }

        .btn-desk-call {
          padding: 0.75rem 1.6rem;
          background: #700F63;
          color: #FFFFFF;
          border-radius: 9999px;
          font-family: var(--font-body);
          font-size: 0.9rem;
          font-weight: 600;
          text-decoration: none;
          transition: all 0.2s;
        }

        .btn-desk-call:hover {
          background: #590A4E;
          transform: translateY(-2px);
        }

        .details-services-section {
          margin-bottom: 2.5rem;
        }

        .section-title {
          font-family: var(--font-body);
          font-size: 0.85rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.06em;
          color: #171421;
          margin-bottom: 1.2rem;
        }

        .services-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
          gap: 0.85rem;
        }

        .service-feature-item {
          display: flex;
          align-items: center;
          gap: 0.6rem;
          padding: 0.85rem 1.25rem;
          background: #FCFAFC;
          border: 1px solid rgba(220, 204, 226, 0.75);
          border-radius: 14px;
          font-family: var(--font-body);
          font-size: 0.9rem;
          color: #45414D;
          font-weight: 500;
        }

        .feature-check {
          color: #700F63;
          flex-shrink: 0;
        }

        .details-action-row {
          display: flex;
          align-items: center;
          gap: 1.25rem;
          padding-top: 2rem;
          border-top: 1px solid rgba(220, 204, 226, 0.75);
          flex-wrap: wrap;
        }

        .btn-primary-direction {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          background: #700F63;
          color: #FFFFFF;
          padding: 0.9rem 1.8rem;
          border-radius: 9999px;
          font-family: var(--font-body);
          font-size: 0.95rem;
          font-weight: 600;
          text-decoration: none;
          transition: all 0.2s;
          box-shadow: 0 4px 14px rgba(112, 15, 99, 0.22);
        }

        .btn-primary-direction:hover {
          background: #590A4E;
          transform: translateY(-2px);
        }

        .btn-secondary-book {
          display: inline-flex;
          align-items: center;
          background: #FFFFFF;
          color: #700F63;
          border: 1px solid rgba(112, 15, 99, 0.35);
          padding: 0.9rem 1.8rem;
          border-radius: 9999px;
          font-family: var(--font-body);
          font-size: 0.95rem;
          font-weight: 600;
          text-decoration: none;
          transition: all 0.2s;
        }

        .btn-secondary-book:hover {
          border-color: #700F63;
          background: #F8F2F9;
          color: #4B1248;
          transform: translateY(-2px);
        }

        @media (max-width: 640px) {
          .branch-details-card {
            padding: 1.75rem;
          }
          .details-action-row {
            flex-direction: column;
            align-items: stretch;
          }
          .btn-primary-direction, .btn-secondary-book {
            justify-content: center;
          }
        }
      `}</style>
    </div>
  );
};

export default BranchDetailsPage;
