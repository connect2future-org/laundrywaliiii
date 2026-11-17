import React, { useState } from 'react';
import { BRANCHES_DATA, PRIMARY_BRANCH } from '../config/branches';
import BranchCard from '../components/branches/BranchCard';
import BranchMap from '../components/branches/BranchMap';
import { CheckCircle2, MapPin } from 'lucide-react';

export const BranchesPage = () => {
  const [searchPincode, setSearchPincode] = useState('');
  const [searchResult, setSearchResult] = useState(null);

  const handlePincodeSearch = (e) => {
    e.preventDefault();
    const clean = searchPincode.trim();
    if (!clean) return;

    const matchedBranch = BRANCHES_DATA.find((b) => b.pincode === clean || b.area.toLowerCase().includes(clean.toLowerCase()));
    if (matchedBranch) {
      setSearchResult({
        serviceable: true,
        message: `PIN ${clean} is serviced directly by ${matchedBranch.name}. Doorstep pickup & delivery available!`,
        branch: matchedBranch
      });
    } else {
      setSearchResult({
        serviceable: true,
        message: `PIN ${clean} is within our Mysore service zone! Serviced from ${PRIMARY_BRANCH.name} (Call: ${PRIMARY_BRANCH.phone}).`,
        branch: PRIMARY_BRANCH
      });
    }
  };

  return (
    <div className="branches-page-root">
      {/* Hero Header */}
      <section className="branches-hero-section">
        <div className="container">
          <div className="branches-header-content">
            <div className="section-label-wrapper">
              <span className="label-line" />
              <span className="section-label-text">STUDIO PRESENCE</span>
              <span className="label-line" />
            </div>

            <h1 className="branches-main-heading">
              Our Mysore <em>Studio.</em>
            </h1>

            <p className="branches-subheading">
              Visit our primary physical studio at Kuvempu Trust Building on KD Road or schedule convenient doorstep pickup anywhere across Mysore.
            </p>

            {/* Pincode Search Bar */}
            <form onSubmit={handlePincodeSearch} className="pincode-search-form">
              <div className="search-pin-icon">
                <MapPin size={18} />
              </div>
              <input
                type="text"
                placeholder="Enter Mysore PIN code (e.g. 570012)..."
                value={searchPincode}
                onChange={(e) => setSearchPincode(e.target.value)}
                className="pincode-input"
              />
              <button type="submit" className="btn-pin-submit">
                <span>Check Coverage</span>
              </button>
            </form>

            {/* Search Result Banner */}
            {searchResult && (
              <div className="pincode-result-banner">
                <CheckCircle2 size={18} className="result-check-icon" />
                <span>{searchResult.message}</span>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Branch Card & Map */}
      <section className="branches-content-section">
        <div className="container" style={{ maxWidth: '860px' }}>
          <div className="branches-cards-stack">
            <BranchCard branch={PRIMARY_BRANCH} />
            <BranchMap />
          </div>
        </div>
      </section>

      <style>{`
        .branches-page-root {
          background-color: #FFFFFF;
          min-height: 100vh;
          position: relative;
          overflow: hidden;
          padding-bottom: 6rem;
        }

        .branches-hero-section {
          padding-top: calc(var(--header-height, 84px) + 2.5rem);
          padding-bottom: 4rem;
          background: #FFFFFF;
          position: relative;
          z-index: 2;
        }

        .branches-header-content {
          text-align: center;
          max-width: 720px;
          margin: 0 auto;
        }

        .section-label-wrapper {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 0.75rem;
          margin-bottom: 0.85rem;
        }

        .label-line {
          width: 24px;
          height: 2px;
          background-color: #700F63;
        }

        .section-label-text {
          font-family: var(--font-body);
          font-size: 0.8rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.12em;
          color: #171421;
        }

        .branches-main-heading {
          font-family: var(--font-heading);
          font-style: italic;
          font-size: clamp(2.3rem, 4.8vw, 3.6rem);
          font-weight: 700;
          color: #171421;
          line-height: 1.15;
          margin-bottom: 1rem;
        }

        .branches-main-heading em {
          font-family: var(--font-serif);
          font-style: italic;
          font-weight: 700;
          color: #700F63;
        }

        .branches-subheading {
          font-family: var(--font-body);
          font-size: 1.05rem;
          color: #45414D;
          line-height: 1.7;
          margin: 0 auto 2.25rem;
          max-width: 580px;
        }

        .pincode-search-form {
          max-width: 500px;
          margin: 0 auto;
          display: flex;
          align-items: center;
          gap: 0.5rem;
          background: #FFFFFF;
          padding: 6px;
          border-radius: 9999px;
          box-shadow: 0 6px 24px rgba(70, 18, 75, 0.05);
          border: 1px solid rgba(220, 204, 226, 0.75);
        }

        .search-pin-icon {
          display: flex;
          align-items: center;
          padding-left: 1rem;
          color: #700F63;
        }

        .pincode-input {
          border: none;
          outline: none;
          flex: 1;
          font-size: 0.94rem;
          font-family: var(--font-body);
          background: transparent;
          color: #171421;
        }

        .btn-pin-submit {
          padding: 0.7rem 1.6rem;
          font-size: 0.88rem;
          font-family: var(--font-body);
          font-weight: 600;
          background: #700F63;
          color: #FFFFFF;
          border: none;
          border-radius: 9999px;
          cursor: pointer;
          transition: all 0.2s;
          box-shadow: 0 4px 14px rgba(112, 15, 99, 0.22);
        }

        .btn-pin-submit:hover {
          background: #6D0062;
          transform: translateY(-1px);
        }

        .pincode-result-banner {
          max-width: 520px;
          margin: 1.25rem auto 0;
          padding: 0.85rem 1.25rem;
          background: #ECFDF5;
          border: 1px solid #A7F3D0;
          border-radius: 16px;
          color: #065F46;
          font-family: var(--font-body);
          font-size: 0.9rem;
          display: flex;
          align-items: center;
          gap: 0.65rem;
          text-align: left;
        }

        .result-check-icon {
          color: #10B981;
          flex-shrink: 0;
        }

        .branches-content-section {
          padding-top: 3rem;
          position: relative;
          z-index: 2;
        }

        .branches-cards-stack {
          display: flex;
          flex-direction: column;
          gap: 2.5rem;
        }

        @media (max-width: 768px) {
          .pincode-search-form {
            flex-direction: column;
            border-radius: 20px;
            padding: 10px;
          }
          .btn-pin-submit {
            width: 100%;
          }
        }
      `}</style>
    </div>
  );
};

export default BranchesPage;
