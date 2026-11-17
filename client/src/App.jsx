import React, { useEffect, Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { CartProvider } from './context/CartContext';
import SiteLayout from './components/layout/SiteLayout';
import LoadingSpinner from './components/common/LoadingSpinner';

// Lazy loaded page components
const HomePage = lazy(() => import('./pages/HomePage'));
const ServicesPage = lazy(() => import('./pages/ServicesPage'));
const FranchisePage = lazy(() => import('./pages/FranchisePage'));
const FranchiseBrochurePage = lazy(() => import('./pages/FranchiseBrochurePage'));
const BranchesPage = lazy(() => import('./pages/BranchesPage'));
const BranchDetailsPage = lazy(() => import('./pages/BranchDetailsPage'));
const ContactPage = lazy(() => import('./pages/ContactPage'));
const AdminPage = lazy(() => import('./pages/AdminPage'));

// Scroll to top helper (respects in-page hash anchors)
const ScrollToTop = () => {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    if (!hash) {
      window.scrollTo({
        top: 0,
        left: 0,
        behavior: 'smooth'
      });
    } else {
      // Instantly reset scroll to top on route change so hash scroll has clean origin
      window.scrollTo(0, 0);
    }
  }, [pathname]);

  return null;
};

export function App() {
  return (
    <CartProvider>
      <BrowserRouter>
        <ScrollToTop />
        <Suspense fallback={<LoadingSpinner text="Loading Laundry Waliiii..." />}>
          <Routes>
            <Route element={<SiteLayout />}>
              {/* 1. Home */}
              <Route path="/" element={<HomePage />} />
              <Route path="/home" element={<HomePage />} />

              {/* 2. Services (Includes Catalogue + Cart) */}
              <Route path="/services" element={<ServicesPage />} />

              {/* 3. Franchise */}
              <Route path="/franchise" element={<FranchisePage />} />
              <Route path="/franchise-brochure" element={<FranchiseBrochurePage />} />

              {/* 4. Branches & Studio */}
              <Route path="/branches" element={<BranchesPage />} />
              <Route path="/branches/:branchId" element={<BranchDetailsPage />} />

              {/* 5. Contact Us (Sole Mysore branch + Phone + WhatsApp + Form) */}
              <Route path="/contact" element={<ContactPage />} />

              {/* 6. Admin Panel (Protected Catalogue, Pricing & Order Snapshots) */}
              <Route path="/admin" element={<AdminPage />} />

              {/* Catch-all */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Route>
          </Routes>
        </Suspense>
      </BrowserRouter>
    </CartProvider>
  );
}

export default App;
