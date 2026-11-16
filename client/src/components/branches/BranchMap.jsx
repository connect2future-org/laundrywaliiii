import { MapPin, ExternalLink, Phone, Navigation } from 'lucide-react';
import { PRIMARY_BRANCH } from '../../config/branches';

export const BranchMap = () => {
  const branch = PRIMARY_BRANCH;

  return (
    <div className="branch-map-root">
      <div className="branch-map-header">
        <div>
          <span className="map-subheading">STUDIO LOCATOR & ROUTE</span>
          <h3 className="map-title">{branch.name}</h3>
        </div>

        <a
          href={branch.mapUrl}
          target="_blank"
          rel="noreferrer"
          className="btn-map-gmaps"
        >
          <span>Open in Google Maps</span>
          <ExternalLink size={14} />
        </a>
      </div>

      {/* Styled Minimal Location Display */}
      <div className="map-visual-board">
        {/* Central Map Marker Card */}
        <div className="map-center-card">
          <div className="map-pin-badge">
            <MapPin size={24} />
          </div>
          <div className="map-card-info">
            <h4 className="map-card-branch-name">{branch.name}</h4>
            <p className="map-card-address">{branch.address}</p>
          </div>
        </div>
      </div>

      {/* Access Notes */}
      <div className="map-access-notes">
        <div className="note-item">
          <Navigation size={18} className="note-icon" />
          <span>Landmark: Near Westside, Kuvempu Trust Building</span>
        </div>
        <div className="note-item">
          <Phone size={18} className="note-icon" />
          <span>Desk: <a href={`tel:+91${branch.phone}`} className="note-link">+91 {branch.phone}</a></span>
        </div>
      </div>

      <style>{`
        .branch-map-root {
          background: #FFFFFF;
          border: 1px solid #EEE9EF;
          border-radius: 28px;
          padding: 2.5rem;
          box-shadow: 0 6px 24px rgba(23, 20, 33, 0.045);
        }

        .branch-map-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 1rem;
          margin-bottom: 1.75rem;
        }

        .map-subheading {
          font-family: var(--font-body);
          font-size: 0.78rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.08em;
          color: #700F63;
          display: block;
          margin-bottom: 0.25rem;
        }

        .map-title {
          font-family: var(--font-heading);
          font-style: italic;
          font-size: 1.55rem;
          font-weight: 700;
          color: #171421;
          margin: 0;
        }

        .btn-map-gmaps {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.65rem 1.4rem;
          font-family: var(--font-body);
          font-size: 0.88rem;
          font-weight: 600;
          background: #700F63;
          color: #FFFFFF;
          border-radius: 9999px;
          text-decoration: none;
          transition: all 0.2s;
          box-shadow: 0 4px 14px rgba(112, 15, 99, 0.22);
        }

        .btn-map-gmaps:hover {
          background: #590A4E;
          transform: translateY(-2px);
        }

        .map-visual-board {
          height: 240px;
          width: 100%;
          background: #F6EEF8;
          border-radius: 20px;
          border: 1px solid rgba(220, 204, 226, 0.75);
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 1.5rem;
          position: relative;
          overflow: hidden;
        }

        .map-center-card {
          background: #FFFFFF;
          padding: 1.4rem 1.85rem;
          border-radius: 20px;
          border: 1px solid rgba(220, 204, 226, 0.75);
          box-shadow: 0 8px 24px rgba(70, 18, 75, 0.08);
          display: flex;
          align-items: center;
          gap: 1rem;
          max-width: 480px;
        }

        .map-pin-badge {
          width: 46px;
          height: 46px;
          border-radius: 50%;
          background: #700F63;
          color: #FFFFFF;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .map-card-branch-name {
          font-family: var(--font-heading);
          font-size: 1.1rem;
          font-weight: 700;
          color: #171421;
          margin: 0 0 0.25rem 0;
        }

        .map-card-address {
          font-family: var(--font-body);
          font-size: 0.88rem;
          color: #45414D;
          margin: 0;
          line-height: 1.5;
        }

        .map-access-notes {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
          gap: 1.25rem;
          margin-top: 1.75rem;
          font-family: var(--font-body);
          font-size: 0.92rem;
        }

        .note-item {
          display: flex;
          align-items: center;
          gap: 0.65rem;
          color: #45414D;
        }

        .note-icon {
          color: #700F63;
          flex-shrink: 0;
        }

        .note-link {
          color: #700F63;
          font-weight: 700;
          text-decoration: none;
        }

        @media (max-width: 640px) {
          .branch-map-root {
            padding: 1.6rem;
          }
          .map-center-card {
            flex-direction: column;
            text-align: center;
            padding: 1.2rem;
          }
        }
      `}</style>
    </div>
  );
};

export default BranchMap;
