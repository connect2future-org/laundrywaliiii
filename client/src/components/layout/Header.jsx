import { useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { ShoppingBag, Menu, X } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import MobileNav from './MobileNav';

export const Header = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { itemCount, openCart } = useCart();
  const location = useLocation();
  const [prevPath, setPrevPath] = useState(location.pathname);

  if (prevPath !== location.pathname) {
    setPrevPath(location.pathname);
    setMobileMenuOpen(false);
  }

  const navLinks = [
    { to: '/', label: 'Home' },
    { to: '/services', label: 'Services' },
    { to: '/franchise', label: 'Franchise' },
    { to: '/contact', label: 'Contact Us' }
  ];

  return (
    <>
      <header className="site-header-wrapper">
        <div className="navbar-pill-container">
          {/* Official Brand Identity: Mascot Logo + Separately Styled "Laundry Waliiii" HTML Text */}
          <Link to="/" className="navbar-brand-link" aria-label="Laundry Waliiii Home">
            <img
              src="/images/laundry-wali-mascot.png"
              alt="Laundry Waliiii Mascot"
              className="navbar-mascot-img"
              width="48"
              height="48"
            />
            <span className="navbar-brand-text">
              <span className="brand-word-laundry">Laundry</span>
              <span className="brand-word-wali">Waliiii</span>
            </span>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="navbar-desktop-nav" aria-label="Main Navigation">
            {navLinks.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                end={link.to === '/'}
                className={({ isActive }) =>
                  isActive ? 'navbar-nav-item active' : 'navbar-nav-item'
                }
              >
                <span>{link.label}</span>
              </NavLink>
            ))}
          </nav>

          {/* Right Action Controls: Cart Button & Book Pickup Button */}
          <div className="navbar-right-actions">
            <button
              type="button"
              className="navbar-cart-btn"
              onClick={openCart}
              aria-label={`View cart with ${itemCount} items`}
            >
              <ShoppingBag size={18} strokeWidth={1.8} />
              {itemCount > 0 && <span className="navbar-cart-badge">{itemCount}</span>}
            </button>

            <Link to="/contact" className="navbar-book-btn">
              <span>Book Pickup</span>
            </Link>

            {/* Mobile Hamburger Button */}
            <button
              type="button"
              className="navbar-mobile-toggle"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle mobile menu"
            >
              {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Navigation Drawer */}
      <MobileNav
        isOpen={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
        navLinks={navLinks}
      />

      <style>{`
        .site-header-wrapper {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          width: 100%;
          z-index: 1000;
          padding: 0;
          background: rgba(249, 244, 252, 0.94);
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          border-bottom: 1px solid rgba(220, 204, 226, 0.65);
          box-shadow: 0 3px 18px rgba(70, 18, 75, 0.04);
          transition: all 0.25s ease;
        }

        .navbar-pill-container {
          width: 100%;
          max-width: 100%;
          margin: 0;
          background: transparent;
          border-radius: 0;
          border: none;
          box-shadow: none;
          display: grid;
          grid-template-columns: 1fr auto 1fr;
          align-items: center;
          padding: 0 clamp(1.25rem, 3.5vw, 3.5rem);
          height: 72px;
          box-sizing: border-box;
          transition: all 0.25s ease;
        }

        /* --------------------------------------------------------
           BRAND IDENTITY: MASCOT + SCRIPT "Laundry Waliiii"
           -------------------------------------------------------- */
        .navbar-brand-link {
          justify-self: start;
          display: inline-flex;
          align-items: center;
          gap: clamp(0.5rem, 0.9vw, 0.75rem);
          text-decoration: none;
          flex-shrink: 0;
          transition: transform 0.2s ease;
        }

        .navbar-brand-link:hover {
          transform: translateY(-1px);
        }

        .navbar-mascot-img {
          height: clamp(42px, 3.8vw, 50px);
          width: auto;
          aspect-ratio: auto;
          display: block;
          object-fit: contain;
          transition: transform 0.25s ease;
          flex-shrink: 0;
        }

        .navbar-brand-link:hover .navbar-mascot-img {
          transform: scale(1.05) rotate(-2deg);
        }

        .navbar-brand-text {
          display: inline-flex;
          align-items: baseline;
          gap: 0.28rem;
          font-family: 'Satisfy', 'Pacifico', 'Kaushan Script', cursive, sans-serif;
          font-size: clamp(1.5rem, 2.15vw, 1.95rem);
          line-height: 1;
          letter-spacing: -0.01em;
          user-select: none;
          white-space: nowrap;
          transform: translateY(-1px);
        }

        .brand-word-laundry {
          color: #38004D;
          font-weight: 700;
          display: inline-block;
          -webkit-text-stroke: 0.35px #38004D;
          text-shadow: 0 0.5px 0.5px rgba(56, 0, 77, 0.18);
        }

        .brand-word-wali {
          color: #E91E78;
          font-weight: 700;
          display: inline-block;
          -webkit-text-stroke: 0.35px #E91E78;
          text-shadow: 0 0.5px 0.5px rgba(233, 30, 120, 0.18);
        }

        /* --------------------------------------------------------
           DESKTOP NAVIGATION
           -------------------------------------------------------- */
        .navbar-desktop-nav {
          justify-self: center;
          display: flex;
          align-items: center;
          gap: clamp(1.5rem, 2.5vw, 2.6rem);
        }

        .navbar-nav-item {
          text-decoration: none;
          font-family: var(--font-body), 'DM Sans', sans-serif;
          font-size: 0.95rem;
          font-weight: 500;
          color: #221626;
          position: relative;
          padding: 0.4rem 0;
          transition: color 0.2s ease;
          letter-spacing: 0.01em;
        }

        .navbar-nav-item:hover {
          color: #700F63;
        }

        .navbar-nav-item.active {
          color: #700F63;
          font-weight: 600;
        }

        .navbar-nav-item.active::after {
          content: '';
          position: absolute;
          bottom: -3px;
          left: 0;
          right: 0;
          height: 2.5px;
          background: #700F63;
          border-radius: 2px;
        }

        /* --------------------------------------------------------
           RIGHT ACTIONS
           -------------------------------------------------------- */
        .navbar-right-actions {
          justify-self: end;
          display: flex;
          align-items: center;
          gap: 1rem;
        }

        .navbar-cart-btn {
          width: 42px;
          height: 42px;
          border-radius: 50%;
          border: 1px solid #EBDCEB;
          background: #F9F2F9;
          color: #700F63;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          position: relative;
          transition: all 0.2s ease;
        }

        .navbar-cart-btn:hover {
          background: #F2E4F2;
          border-color: rgba(112, 15, 99, 0.3);
          transform: translateY(-1px);
        }

        .navbar-cart-badge {
          position: absolute;
          top: -3px;
          right: -3px;
          background: #700F63;
          color: #FFFFFF;
          font-size: 0.68rem;
          font-weight: 700;
          width: 18px;
          height: 18px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          border: 2px solid #FFFFFF;
        }

        .navbar-book-btn {
          text-decoration: none;
          background: #700F63;
          color: #FFFFFF;
          font-family: var(--font-body), 'DM Sans', sans-serif;
          font-size: 0.92rem;
          font-weight: 600;
          padding: 0.65rem 1.75rem;
          border-radius: 9999px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          letter-spacing: 0.01em;
          box-shadow: 0 4px 14px rgba(112, 15, 99, 0.22);
          transition: all 0.25s ease;
        }

        .navbar-book-btn:hover {
          background: #5B0C50;
          transform: translateY(-1px);
          box-shadow: 0 6px 18px rgba(112, 15, 99, 0.3);
        }

        .navbar-mobile-toggle {
          display: none;
          width: 40px;
          height: 40px;
          border-radius: 50%;
          border: 1px solid #EEE9EF;
          background: #FFFFFF;
          color: #171421;
          align-items: center;
          justify-content: center;
          cursor: pointer;
        }

        /* --------------------------------------------------------
           RESPONSIVE BREAKPOINTS
           -------------------------------------------------------- */
        @media (max-width: 900px) {
          .navbar-pill-container {
            display: flex;
            justify-content: space-between;
            height: 64px;
            padding: 0.4rem clamp(0.75rem, 2.5vw, 1.25rem);
          }
          .navbar-desktop-nav,
          .navbar-book-btn {
            display: none;
          }
          .navbar-mobile-toggle {
            display: flex;
          }
          .navbar-mascot-img {
            height: 40px;
          }
          .navbar-brand-text {
            font-size: 1.45rem;
            gap: 0.25rem;
          }
        }

        @media (max-width: 420px) {
          .navbar-mascot-img {
            height: 36px;
          }
          .navbar-brand-text {
            font-size: 1.28rem;
          }
        }
      `}</style>
    </>
  );
};

export default Header;
