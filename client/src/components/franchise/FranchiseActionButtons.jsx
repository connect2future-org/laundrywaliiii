import { MessageCircle, FileText } from 'lucide-react';
import { Link } from 'react-router-dom';
import { BRAND_CONFIG } from '../../config/brand';

export const FranchiseActionButtons = () => {
  const whatsappUrl = `https://wa.me/91${BRAND_CONFIG.contact.phone}?text=${encodeURIComponent(
    'Hello Laundry Walii Team, I am interested in exploring a franchise opportunity. Please share the details.'
  )}`;

  return (
    <div className="franchise-action-buttons-wrap">
      <div className="action-buttons-group">
        {/* Button 1: WhatsApp Franchise Desk */}
        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="btn-franchise-whatsapp"
          aria-label="Chat with Franchise Team on WhatsApp"
        >
          <MessageCircle size={18} strokeWidth={2.2} />
          <span>WhatsApp Inquiry (+91 {BRAND_CONFIG.contact.phone})</span>
        </a>

        {/* Button 2: Download Franchise Brochure */}
        <Link
          to="/franchise-brochure"
          className="btn-franchise-brochure"
          aria-label="View and Download Official Franchise Brochure"
        >
          <FileText size={18} strokeWidth={2} />
          <span>Download Franchise Brochure</span>
        </Link>
      </div>

      <style>{`
        .franchise-action-buttons-wrap {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 1.25rem;
          margin: 2.5rem auto 0 auto;
          max-width: 760px;
          text-align: center;
        }

        .action-buttons-group {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 1.25rem;
          flex-wrap: wrap;
          width: 100%;
        }

        .btn-franchise-whatsapp {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 0.65rem;
          background: #700F63;
          color: #FFFFFF;
          font-family: var(--font-body);
          font-size: 0.96rem;
          font-weight: 600;
          padding: 0.88rem 2.2rem;
          border-radius: 9999px;
          text-decoration: none;
          box-shadow: 0 4px 18px rgba(112, 15, 99, 0.25);
          transition: all 0.25s ease;
          border: 1px solid transparent;
        }

        .btn-franchise-whatsapp:hover {
          background: #590A4E;
          color: #FFFFFF;
          transform: translateY(-2px);
          box-shadow: 0 8px 24px rgba(112, 15, 99, 0.35);
        }

        .btn-franchise-brochure {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 0.65rem;
          background: #FFFFFF;
          color: #1A1320;
          font-family: var(--font-body);
          font-size: 0.96rem;
          font-weight: 600;
          padding: 0.88rem 2.2rem;
          border-radius: 9999px;
          border: 1px solid rgba(220, 204, 226, 0.85);
          text-decoration: none;
          box-shadow: 0 4px 16px rgba(45, 15, 55, 0.04);
          transition: all 0.25s ease;
        }

        .btn-franchise-brochure:hover {
          background: #FAF7FC;
          border-color: #700F63;
          color: #700F63;
          transform: translateY(-2px);
          box-shadow: 0 8px 20px rgba(112, 15, 99, 0.12);
        }

        @media (max-width: 640px) {
          .action-buttons-group {
            flex-direction: column;
            width: 100%;
            max-width: 320px;
            gap: 0.85rem;
          }

          .btn-franchise-whatsapp,
          .btn-franchise-brochure {
            width: 100%;
            padding: 0.82rem 1.4rem;
            font-size: 0.92rem;
          }
        }
      `}</style>
    </div>
  );
};

export default FranchiseActionButtons;
