import React from 'react';

export const WaterFoamDivider = () => {
  return (
    <div className="water-foam-divider-wrapper" aria-hidden="true">
      <div className="water-foam-img-wrap">
        <img
          src="/images/sakura/foam-divider-hero.png"
          alt=""
          className="water-foam-img"
          loading="lazy"
        />
      </div>

      <style>{`
        .water-foam-divider-wrapper {
          width: 100%;
          position: relative;
          z-index: 10;
          margin-top: -30px;
          margin-bottom: -1px;
          overflow: hidden;
          line-height: 0;
          background: transparent;
        }

        .water-foam-img-wrap {
          width: 100%;
          display: flex;
          justify-content: center;
        }

        .water-foam-img {
          width: 100%;
          min-width: 1000px;
          max-height: 95px;
          object-fit: fill;
          display: block;
        }

        @media (max-width: 768px) {
          .water-foam-divider-wrapper {
            margin-top: -20px;
          }
          .water-foam-img {
            min-width: 650px;
            max-height: 60px;
          }
        }
      `}</style>
    </div>
  );
};

export default WaterFoamDivider;

