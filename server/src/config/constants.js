export const REQUIRED_DATABASE_NAME = 'LaundryWalii';

export const CORE_SERVICE_CATEGORIES = [
  { id: 'wash-fold', name: 'Wash & Fold' },
  { id: 'wash-iron', name: 'Wash & Iron' },
  { id: 'dry-cleaning', name: 'Dry Cleaning' },
  { id: 'shoe-cleaning', name: 'Shoe Cleaning' },
  { id: 'customized-services', name: 'Customized Services' }
];

export const PRICING_UNITS = ['kg', 'piece', 'set', 'item', 'fixed_size', 'pair', 'custom'];

export const ADMIN_ROLES = [
  'super_admin',
  'branch_manager',
  'operator',
  'delivery_pilot',
  'accountant'
];

export const ORDER_STATUSES = [
  'pending',
  'confirmed',
  'pickup_assigned',
  'picked_up',
  'processing',
  'washing',
  'ironing',
  'quality_check',
  'ready',
  'out_for_delivery',
  'delivered',
  'cancelled'
];

export const WALKIN_STATUSES = [
  'received',
  'processing',
  'ready',
  'completed',
  'cancelled'
];

export const PAYMENT_METHODS = ['cod', 'upi', 'card', 'netbanking', 'wallet'];

export const PAYMENT_STATUSES = [
  'pending',
  'initiated',
  'authorized',
  'captured',
  'failed',
  'refunded'
];

export const INVENTORY_CATEGORIES = [
  'detergent',
  'softener',
  'stain_remover',
  'solvent',
  'packaging',
  'hangers_tags',
  'shoe_care',
  'sanitizer',
  'other'
];

export const INVENTORY_TRANSACTION_TYPES = [
  'stock_in',
  'stock_out',
  'adjustment',
  'waste'
];

export const EXPENSE_CATEGORIES = [
  'rent',
  'utilities',
  'detergents_consumables',
  'equipment_maintenance',
  'staff_salaries',
  'logistics_fuel',
  'marketing',
  'packaging',
  'other'
];

export const REVIEW_STATUSES = ['pending', 'approved', 'rejected'];

export const ENQUIRY_STATUSES = ['new', 'contacted', 'in_progress', 'resolved', 'closed'];

export const FRANCHISE_LEAD_STATUSES = [
  'new',
  'contacted',
  'evaluating',
  'approved',
  'declined'
];

// Single confirmed physical business location (Mysore)
export const CONFIRMED_PRIMARY_BRANCH = {
  branchCode: 'LW-MYS-01',
  slug: 'mysore',
  name: 'Laundry Waliiii – Mysore',
  area: 'KD Road',
  city: 'Mysore',
  state: 'Karnataka',
  pincode: '570012',
  address: '#5 Dr Dejagav Circle, near Westside, Kuvempu Trust Building, KD Road, Mysore – 570012',
  landmark: 'Near Westside, Kuvempu Trust Building, Dr Dejagav Circle',
  phone: '9035999272',
  isFlagship: true,
  isActive: true,
  serviceablePincodes: ['570012', '570001', '570002', '570004', '570005', '570006', '570009', '570017', '570023']
};

