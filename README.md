# Laundry Walii — Frontend Application

> **Fresh Clothes. Happy People.**  
> Bengaluru’s Premier Scientific Fabric Care & Footwear Spa

---

## 1. Project Overview & Architecture

Laundry Walii is built using a modern client-server architecture designed for the MERN stack.

```
laundrywaliiii/
├── client/          # Complete React 19 + Vite Frontend Application
│   ├── public/
│   │   ├── images/
│   │   │   ├── laundry-walii-logo.png
│   │   │   ├── services/
│   │   │   ├── gallery/
│   │   │   └── banners/
│   │   └── favicon.svg
│   ├── src/
│   │   ├── assets/
│   │   ├── components/
│   │   │   ├── common/
│   │   │   ├── layout/
│   │   │   ├── home/
│   │   │   ├── services/
│   │   │   ├── cart/
│   │   │   ├── checkout/
│   │   │   ├── branches/
│   │   │   ├── contact/
│   │   │   └── franchise/
│   │   ├── pages/
│   │   │   ├── HomePage.jsx
│   │   │   ├── ServicesPage.jsx
│   │   │   ├── BranchesPage.jsx
│   │   │   ├── BranchDetailsPage.jsx
│   │   │   ├── ContactPage.jsx
│   │   │   ├── FranchisePage.jsx
│   │   │   └── FranchiseBrochurePage.jsx
│   │   ├── context/
│   │   │   └── CartContext.jsx
│   │   ├── hooks/
│   │   │   ├── useCart.js
│   │   │   └── useScrollReveal.js
│   │   ├── config/
│   │   │   ├── brand.js
│   │   │   ├── services.js
│   │   │   ├── branches.js
│   │   │   └── business.js
│   │   ├── services/
│   │   │   └── api.js
│   │   ├── utils/
│   │   │   ├── currency.js
│   │   │   ├── validators.js
│   │   │   └── formatters.js
│   │   ├── styles/
│   │   │   ├── variables.css
│   │   │   ├── typography.css
│   │   │   ├── cards.css
│   │   │   ├── buttons.css
│   │   │   ├── global.css
│   │   │   └── responsive.css
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── index.html
│   ├── package.json
│   └── vite.config.js
│
├── server/          # Independent Node.js, Express, ESM & Mongoose backend API (LaundryWalii DB)
├── README.md
└── .gitignore
```

---

## 2. Brand Identity & Visual Design

### Brand Colours
- **Deep Purple:** `#39004F`
- **Primary Pink:** `#E91E78` (Buttons: `#F51D78`)
- **Soft Pink:** `#FBE3EE`
- **Warm Cream:** `#FFF9EF`
- **Yellow Accent:** `#FFD36E`
- **Dark Text:** `#17121B`
- **Muted Text:** `#777783`
- **Light Border:** `#E8E8EC`

### Typography System
- **Display & Headings:** `Michroma`, sans-serif
- **Body & Interface:** `Gilroy` (with fallback to `Plus Jakarta Sans`, system sans-serif)

### Reusable Neumorphic & Modern Flat Surfaces
- `neu-card` — Soft raised neumorphic surface with `1.75rem` radius
- `card-modern-flat` — Crisp white cards with `#E8E8EC` border and subtle pink glow hover
- `card-feature-neu` — Elevated feature containers with pink icon badge transitions
- `card-form-container` — Generous padding with inset inputs
- `input-neu-inset` & `input-flat` — Modern inset and bordered inputs with pink focus rings
- `btn-pill-primary`, `btn-pill-secondary`, `btn-neu-raised`, `btn-glow-submit`, `btn-neu-icon`

---

## 3. Implemented Features & Routing

| Route | Page | Purpose |
|---|---|---|
| `/` or `/home` | `HomePage` | 10-section homepage with Hero, About, Why Choose Us, Services Preview, How It Works, Processing Pipeline, Gallery, Testimonials, Branches, and Promo CTA |
| `/services` | `ServicesPage` | Filterable service catalog with customization modals and direct basket integration |
| `/branches` | `BranchesPage` | Bengaluru studio directory, interactive location map, and pincode coverage check |
| `/branches/:branchId` | `BranchDetailsPage` | Dedicated branch detail view with store hours, manager info, amenities, and available services |
| `/contact` | `ContactPage` | Concierge contacts, verified contact form with validation, and flagship studio map |
| `/franchise` | `FranchisePage` | Partner opportunity, 3 investment models, launch roadmap, FAQs, and confidential enquiry form |
| `/franchise-brochure` | `FranchiseBrochurePage` | Dedicated prospectus page with 6-chapter syllabus and simulated PDF download |

### Interactive Customization Modals
- `CustomizeSidebar` — Scent, starch, packaging, stain treatment, and turnaround selection
- `DryCleaningModal` — Specific garment selector for suits, sarees, lehengas, and woolens
- `ShoeCleaningModal` — Footwear selector (sneakers, leather, suede) with addon treatments

### Cart & Multi-Step Checkout Experience
- Persistent shared state in `localStorage` under `laundry_walii_cart`
- Free delivery progress calculator (unlocked on orders ₹299+)
- 6-step multi-stage checkout modal:
  1. Customer Info (Name, Phone, Email with regex validation)
  2. Pickup Address (Autocomplete + House/Street/Pincode + Branch selection)
  3. Pickup Schedule (Date selector + 2-hour morning to evening slots)
  4. Order Summary (Itemized review + fee breakdown)
  5. Payment Selection (Cash/UPI upon delivery vs. Instant UPI)
  6. Confirmation Receipt (Unique generated Booking ID + pilot dispatch alert)

---

## 4. API Communication Layer

Located at `client/src/services/api.js`:
- Centralized Axios instance with environment variable support (`VITE_API_BASE_URL=http://localhost:5000/api`)
- Pre-configured request and response interceptors
- Graceful client-side mock resolution for orders, enquiries, and franchise leads while the backend server is in development

---

## 5. Development & Production Commands

All commands should be executed inside the `client` directory:

```bash
# Navigate to the client folder
cd client

# Install dependencies
npm install

# Start local development server
npm run dev

# Run production build
npm run build

# Preview production build locally
npm run preview
```
