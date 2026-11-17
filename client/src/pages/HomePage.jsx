import Hero from '../components/home/Hero';
import WhyChooseUs from '../components/home/WhyChooseUs';
import CustomerExperiencesSection from '../components/home/CustomerExperiencesSection';
import FinalCTASection from '../components/home/FinalCTASection';

export const HomePage = () => {
  return (
    <div className="sakura-luxury-homepage">
      {/* SECTION 1 — HERO / LANDING PAGE */}
      <Hero />

      {/* SECTION 2 — WHY CHOOSE LAUNDRY WALIIII */}
      <WhyChooseUs />

      {/* SECTION 3 — CUSTOMER EXPERIENCES */}
      <CustomerExperiencesSection />

      {/* SECTION 4 — FINAL CALL TO ACTION */}
      <FinalCTASection />

      <style>{`
        .sakura-luxury-homepage {
          --homepage-background: #FAF7FC;
          --homepage-bg: #FAF7FC;
          background-color: #FAF7FC;
          width: 100%;
          overflow-x: hidden;
          position: relative;
        }
      `}</style>
    </div>
  );
};

export default HomePage;
