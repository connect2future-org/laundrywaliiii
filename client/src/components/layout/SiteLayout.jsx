import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';
import CartDrawer from '../cart/CartDrawer';
import CheckoutModal from '../checkout/CheckoutModal';

export const SiteLayout = () => {
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Header onOpenCheckout={() => setIsCheckoutOpen(true)} />

      <main style={{ flex: 1 }}>
        <Outlet context={{ openCheckout: () => setIsCheckoutOpen(true) }} />
      </main>

      <Footer />

      {/* Global Cart Drawer */}
      <CartDrawer onProceedToCheckout={() => setIsCheckoutOpen(true)} />

      {/* Global Multi-Step Checkout Modal */}
      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
      />
    </div>
  );
};

export default SiteLayout;

