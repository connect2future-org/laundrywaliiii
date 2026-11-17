import React, { useState } from 'react';
import {
  Store,
  Building,
  Sparkles,
  Users,
  Clock,
  TrendingUp,
  Maximize2,
  ChevronDown,
  ChevronUp,
  Wrench,
  Check
} from 'lucide-react';

export const FRANCHISE_MODELS = [
  {
    id: 'express-kiosk',
    name: 'Express Kiosk',
    scaleSubtitle: 'Small Scale Franchise',
    badge: 'Fast Setup',
    icon: Store,
    investment: '₹14 Lakhs',
    space: '180 sq. ft. – 250 sq. ft. (minimum)',
    targetMarket: '3,50,000 Customers',
    roi: '12 Months',
    monthlyRevenue: '₹2 Lakhs approx (after 6 months)',
    monthlyProfit: '₹1.2 Lakhs approx (after 3 months+)',
    breakEven: '6 Months',
    marketDemand: 'High ROI – Highly demanded model with significant return on investment',
    manpower: [
      '01 All Rounder',
      '01 Delivery Boy',
      '01 Executive'
    ],
    equipments: [
      '10 kg Wet Cleaning: Imported – South Korea (LG Commercials)',
      '1 Water Extractor (10 kg): Imported – South Korea (LG Commercials)',
      '1 Dryer (10 kg): Imported – South Korea (LG Commercials)',
      '1 Water Extractor (8.5 kg) for delicate clothes',
      '8 Bottle Spotting kits – Imported from Germany',
      '1 Boiler 9 kW capacity',
      '1 Vacuum steam press table',
      '1 Fully digital AI based touch system',
      '5 Litre German based chemicals (1 month use)',
      'Packing table & spotting table with materials (1 month use)'
    ]
  },
  {
    id: 'standard-outlet',
    name: 'Standard Outlet',
    scaleSubtitle: 'Medium Scale Franchise',
    badge: 'Most Popular',
    isPopular: true,
    icon: Store,
    investment: '₹18 Lakhs',
    space: '180 sq. ft. – 250 sq. ft. (minimum)',
    targetMarket: '5,00,000 Customers',
    roi: '18 Months',
    monthlyRevenue: '₹3 Lakhs approx (after 6 months)',
    monthlyProfit: '₹1.6 Lakhs approx (after 3 months+)',
    breakEven: '6 Months',
    marketDemand: 'High ROI – Highly demanded model with significant return on investment',
    manpower: [
      '01 All Rounder',
      '01 Presser',
      '01 Delivery Boy',
      '01 Executive'
    ],
    equipments: [
      '15 kg Wet Cleaning: Imported – South Korea (LG Commercials)',
      '2 Water Extractor (10 kg): Imported – South Korea (LG Commercials)',
      '1 Dryer (15 kg): Imported – South Korea (LG Commercials)',
      '1 RO + Mineral Water Plant',
      '8 Bottle Spotting kits – Imported from Germany',
      '1 Boiler 9 kW capacity',
      '2 Vacuum steam press table',
      '1 Fully digital AI based touch system',
      '5 Litre German based chemicals (1 month use)',
      'Packing table with materials (1 month use)'
    ]
  },
  {
    id: 'premium-center',
    name: 'Premium Center',
    scaleSubtitle: 'Big Scale Franchise',
    badge: 'High Capacity',
    icon: Building,
    investment: '₹24 Lakhs',
    space: '180 sq. ft. – 250 sq. ft. (minimum)',
    targetMarket: '15,00,000 Customers',
    roi: '18 Months',
    monthlyRevenue: '₹4 Lakhs approx (after 6 months)',
    monthlyProfit: '₹2.3 Lakhs approx (after 3 months+)',
    breakEven: '6 Months',
    marketDemand: 'High ROI – Highly demanded model with significant return on investment',
    manpower: [
      '02 All Rounder',
      '02 Press Man',
      '02 Rider',
      '01 Executive'
    ],
    equipments: [
      '2 Wet Cleaning (15 kg): Imported – South Korea (LG Commercials)',
      '1 Water Extractor (10 kg): Imported – South Korea (LG Commercials)',
      '2 Dryer (10 kg): Imported – South Korea (LG Commercials)',
      '1 RO + Mineral Water Plant',
      '8 Bottle Spotting kits – Imported from Germany',
      '1 Boiler 9 kW capacity',
      '2 Vacuum steam press table',
      '1 Fully digital AI based touch system',
      '5 Litre German based chemicals (1 month use)',
      'Packaging table with material (1 month use)'
    ]
  }
];

export const FranchisePlans = () => {
  // Toggle for expanded equipment view
  const [expandedEquipment, setExpandedEquipment] = useState({
    'express-kiosk': true,
    'standard-outlet': true,
    'premium-center': true
  });

  const toggleEquipment = (id) => {
    setExpandedEquipment((prev) => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  return (
    <section className="franchise-plans-section" id="franchise-models">
      <div className="container">
        {/* Section Header */}
        <div className="plans-header">
          <div className="section-label-wrapper">
            <span className="label-line" />
            <span className="section-label-text">BUSINESS ARCHITECTURES</span>
            <span className="label-line" />
          </div>

          <h2 className="plans-main-heading">
            Our Franchise <em>Models</em>
          </h2>

          <p className="plans-subheading">
            Explore our three verified franchise structures tailored to your investment budget, retail footprint, and territory scale.
          </p>
        </div>

        {/* 3-Column Grid on Desktop, Responsive on Tablet, Stacked on Mobile */}
        <div className="plans-three-col-grid">
          {FRANCHISE_MODELS.map((model) => {
            const Icon = model.icon;
            const isEquipOpen = !!expandedEquipment[model.id];

            return (
              <div
                key={model.id}
                className={`franchise-model-card ${model.isPopular ? 'popular-model' : ''}`}
              >
                {/* Popular Pill */}
                {model.badge && (
                  <div className="model-badge-wrap">
                    <span className="model-badge-pill">
                      <Sparkles size={12} />
                      <span>{model.badge}</span>
                    </span>
                  </div>
                )}

                {/* Card Header */}
                <div className="model-card-header">
                  <div className="model-icon-bubble">
                    <Icon size={26} />
                  </div>
                  <div>
                    <h3 className="model-name">{model.name}</h3>
                    <span className="model-scale-tag">{model.scaleSubtitle}</span>
                  </div>
                </div>

                {/* Investment Highlight */}
                <div className="model-investment-block">
                  <span className="investment-label">TOTAL CAPITAL INVESTMENT</span>
                  <div className="investment-amount">{model.investment}</div>
                </div>

                {/* Key Metrics Grid */}
                <div className="model-metrics-grid">
                  <div className="metric-cell">
                    <div className="metric-header">
                      <Maximize2 size={13} className="metric-icon" />
                      <span>Space Required</span>
                    </div>
                    <strong>{model.space}</strong>
                  </div>

                  <div className="metric-cell">
                    <div className="metric-header">
                      <Clock size={13} className="metric-icon" />
                      <span>Target ROI</span>
                    </div>
                    <strong>{model.roi} (Break Even: {model.breakEven})</strong>
                  </div>

                  <div className="metric-cell">
                    <div className="metric-header">
                      <TrendingUp size={13} className="metric-icon" />
                      <span>Monthly Revenue</span>
                    </div>
                    <strong>{model.monthlyRevenue}</strong>
                  </div>

                  <div className="metric-cell">
                    <div className="metric-header">
                      <Sparkles size={13} className="metric-icon" />
                      <span>Monthly Profit</span>
                    </div>
                    <strong>{model.monthlyProfit}</strong>
                  </div>

                  <div className="metric-cell">
                    <div className="metric-header">
                      <Users size={13} className="metric-icon" />
                      <span>Target Market Reach</span>
                    </div>
                    <strong>{model.targetMarket}</strong>
                  </div>

                  <div className="metric-cell">
                    <div className="metric-header">
                      <Users size={13} className="metric-icon" />
                      <span>Manpower Required</span>
                    </div>
                    <strong>{model.manpower.join(', ')}</strong>
                  </div>
                </div>

                {/* Commercial Equipments & Setup Checklist */}
                <div className="model-equipment-box">
                  <button
                    type="button"
                    className="equipment-toggle-btn"
                    onClick={() => toggleEquipment(model.id)}
                    aria-expanded={isEquipOpen}
                  >
                    <span className="equip-btn-title">
                      <Wrench size={14} />
                      <span>Equipments & Commercial Setup ({model.equipments.length})</span>
                    </span>
                    {isEquipOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                  </button>

                  {isEquipOpen && (
                    <ul className="equipment-items-list">
                      {model.equipments.map((equip, i) => (
                        <li key={i} className="equipment-item">
                          <Check size={13} className="equip-check-icon" />
                          <span>{equip}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>

                {/* Market Demand Banner */}
                <div className="model-demand-banner">
                  <span className="demand-badge">Market Demand</span>
                  <span className="demand-text">{model.marketDemand}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <style>{`
        .franchise-plans-section {
          padding: 5rem 0 5.5rem;
          background: #FAF7FC;
          position: relative;
          z-index: 2;
        }

        .plans-header {
          text-align: center;
          max-width: 760px;
          margin: 0 auto 3.5rem;
        }

        .section-label-wrapper {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 0.85rem;
          margin-bottom: 0.85rem;
        }

        .label-line {
          width: 36px;
          height: 1.5px;
          background-color: rgba(112, 15, 99, 0.38);
          border-radius: 2px;
        }

        .section-label-text {
          font-family: var(--font-body);
          font-size: 0.78rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.16em;
          color: #700F63;
        }

        .plans-main-heading {
          font-family: 'Playfair Display', Georgia, serif;
          font-style: italic;
          font-size: clamp(2.2rem, 3.8vw, 3rem);
          font-weight: 700;
          color: #1A1320;
          line-height: 1.2;
          margin: 0 0 0.85rem;
          letter-spacing: -0.015em;
        }

        .plans-main-heading em {
          color: #700F63;
        }

        .plans-subheading {
          font-family: var(--font-body);
          font-size: 1.02rem;
          color: #5C5564;
          line-height: 1.65;
          margin: 0;
        }

        /* 3-Column Grid */
        .plans-three-col-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 1.75rem;
          align-items: stretch;
        }

        .franchise-model-card {
          background: #FFFFFF;
          border-radius: 20px;
          border: 1px solid rgba(220, 204, 226, 0.7);
          box-shadow: 0 8px 30px rgba(45, 15, 55, 0.04);
          padding: 2.25rem 1.75rem 2rem;
          display: flex;
          flex-direction: column;
          position: relative;
          transition: transform 0.25s ease, box-shadow 0.25s ease;
        }

        .franchise-model-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 16px 40px rgba(112, 15, 99, 0.1);
          border-color: rgba(112, 15, 99, 0.25);
        }

        .franchise-model-card.popular-model {
          border: 2px solid #700F63;
          box-shadow: 0 12px 36px rgba(112, 15, 99, 0.12);
        }

        .model-badge-wrap {
          position: absolute;
          top: -14px;
          left: 50%;
          transform: translateX(-50%);
        }

        .model-badge-pill {
          display: inline-flex;
          align-items: center;
          gap: 0.35rem;
          background: #700F63;
          color: #FFFFFF;
          font-family: var(--font-body);
          font-size: 0.72rem;
          font-weight: 700;
          letter-spacing: 0.06em;
          text-transform: uppercase;
          padding: 0.3rem 0.95rem;
          border-radius: 9999px;
          box-shadow: 0 4px 12px rgba(112, 15, 99, 0.28);
        }

        .model-card-header {
          display: flex;
          align-items: center;
          gap: 1rem;
          margin-bottom: 1.5rem;
          padding-bottom: 1.25rem;
          border-bottom: 1px solid rgba(220, 204, 226, 0.5);
        }

        .model-icon-bubble {
          width: 52px;
          height: 52px;
          border-radius: 14px;
          background: #FAF2FB;
          color: #700F63;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          border: 1px solid rgba(112, 15, 99, 0.12);
        }

        .model-name {
          font-family: 'Playfair Display', Georgia, serif;
          font-size: 1.45rem;
          font-weight: 700;
          color: #1A1320;
          margin: 0 0 0.2rem 0;
          line-height: 1.2;
        }

        .model-scale-tag {
          font-family: var(--font-body);
          font-size: 0.78rem;
          font-weight: 600;
          color: #700F63;
          letter-spacing: 0.04em;
          text-transform: uppercase;
        }

        /* Investment Block */
        .model-investment-block {
          background: linear-gradient(135deg, #FAF4FC 0%, #F5EAF8 100%);
          border-radius: 12px;
          padding: 1.15rem 1.25rem;
          text-align: center;
          margin-bottom: 1.5rem;
          border: 1px solid rgba(112, 15, 99, 0.12);
        }

        .investment-label {
          display: block;
          font-family: var(--font-body);
          font-size: 0.7rem;
          font-weight: 700;
          letter-spacing: 0.08em;
          color: #5C5564;
          margin-bottom: 0.35rem;
        }

        .investment-amount {
          font-family: var(--font-heading);
          font-size: 2rem;
          font-weight: 800;
          color: #700F63;
          line-height: 1;
        }

        /* Key Metrics Grid */
        .model-metrics-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 0.75rem;
          margin-bottom: 1.5rem;
        }

        .metric-cell {
          background: #FAFAFC;
          border-radius: 10px;
          padding: 0.75rem 0.95rem;
          border: 1px solid #ECE7EF;
          display: flex;
          flex-direction: column;
          gap: 0.25rem;
        }

        .metric-header {
          display: flex;
          align-items: center;
          gap: 0.4rem;
          font-family: var(--font-body);
          font-size: 0.75rem;
          color: #756D7E;
          font-weight: 500;
        }

        .metric-icon {
          color: #700F63;
        }

        .metric-cell strong {
          font-family: var(--font-body);
          font-size: 0.88rem;
          color: #1A1320;
          font-weight: 600;
          line-height: 1.35;
        }

        /* Equipment Box */
        .model-equipment-box {
          margin-top: auto;
          background: #FAF7FC;
          border-radius: 12px;
          border: 1px solid rgba(220, 204, 226, 0.6);
          overflow: hidden;
          margin-bottom: 1.25rem;
        }

        .equipment-toggle-btn {
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0.75rem 0.95rem;
          background: transparent;
          border: none;
          cursor: pointer;
          font-family: var(--font-body);
          color: #38004D;
          font-weight: 600;
          font-size: 0.8rem;
          transition: background 0.2s ease;
        }

        .equipment-toggle-btn:hover {
          background: #F4EAF6;
        }

        .equip-btn-title {
          display: flex;
          align-items: center;
          gap: 0.45rem;
          color: #700F63;
        }

        .equipment-items-list {
          list-style: none;
          padding: 0.4rem 0.85rem 0.85rem;
          margin: 0;
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
          max-height: 240px;
          overflow-y: auto;
        }

        .equipment-item {
          display: flex;
          align-items: flex-start;
          gap: 0.5rem;
          font-family: var(--font-body);
          font-size: 0.76rem;
          color: #4A4252;
          line-height: 1.4;
        }

        .equip-check-icon {
          color: #700F63;
          flex-shrink: 0;
          margin-top: 2px;
        }

        /* Demand Banner */
        .model-demand-banner {
          background: #FDF3FB;
          border-radius: 8px;
          padding: 0.65rem 0.85rem;
          border: 1px solid rgba(112, 15, 99, 0.12);
          display: flex;
          flex-direction: column;
          gap: 0.2rem;
        }

        .demand-badge {
          font-family: var(--font-body);
          font-size: 0.68rem;
          font-weight: 700;
          text-transform: uppercase;
          color: #700F63;
          letter-spacing: 0.05em;
        }

        .demand-text {
          font-family: var(--font-body);
          font-size: 0.78rem;
          color: #4A3A4E;
          line-height: 1.35;
        }

        /* Responsive Breakpoints */
        @media (max-width: 1080px) {
          .plans-three-col-grid {
            grid-template-columns: 1fr;
            max-width: 680px;
            margin: 0 auto;
          }
        }
      `}</style>
    </section>
  );
};

export default FranchisePlans;
