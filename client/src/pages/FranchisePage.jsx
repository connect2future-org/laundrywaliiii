import React, { useState } from 'react';
import FranchiseIntro from '../components/franchise/FranchiseIntro';
import FranchisePlans from '../components/franchise/FranchisePlans';
import FranchiseIncludes from '../components/franchise/FranchiseIncludes';
import FranchiseActionButtons from '../components/franchise/FranchiseActionButtons';
import FranchiseBrochureModal from '../components/franchise/FranchiseBrochureModal';

export const FranchisePage = () => {
  const [isBrochureModalOpen, setIsBrochureModalOpen] = useState(false);

  const handleOpenBrochureModal = () => {
    setIsBrochureModalOpen(true);
  };

  const handleCloseBrochureModal = () => {
    setIsBrochureModalOpen(false);
  };

  const handleScrollToModels = () => {
    const el = document.getElementById('franchise-models');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="franchise-page-root">
      {/* 1. FRANCHISE HERO SECTION */}
      <FranchiseIntro
        onBrochureClick={handleOpenBrochureModal}
        onExploreClick={handleScrollToModels}
      />

      {/* 2. OUR FRANCHISE MODELS – THREE-COLUMN LAYOUT */}
      <FranchisePlans />

      {/* 3. WHAT'S INCLUDED WITH EVERY FRANCHISE */}
      <FranchiseIncludes />

      {/* 4. FINAL FRANCHISE ACTION SECTION – TWO BUTTONS ONLY */}
      <FranchiseActionButtons
        onBrochureClick={handleOpenBrochureModal}
      />

      {/* 5. BROCHURE DOWNLOAD MODAL (LEAD CAPTURE -> DOWNLOAD OFFICIAL PDF) */}
      <FranchiseBrochureModal
        isOpen={isBrochureModalOpen}
        onClose={handleCloseBrochureModal}
      />

      <style>{`
        .franchise-page-root {
          background-color: #FAF7FC;
          min-height: 100vh;
          position: relative;
          overflow: hidden;
        }
      `}</style>
    </div>
  );
};

export default FranchisePage;
