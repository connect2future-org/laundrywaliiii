/**
 * Official Laundry Waliiii Service Catalogue Seed Data
 * Single source of truth for idempotent MongoDB seeding (`LaundryWalii.services`).
 * Prices are strictly in INR as specified in the verified catalogue.
 */
export const OFFICIAL_CATALOGUE_SEED = [
  {
    categorySlug: 'wash-fold',
    name: 'Wash & Fold',
    price: 69,
    pricingMethod: 'per_unit',
    pricingUnit: 'kg',
    description: 'Everyday hygienic individual-drum wash, tumble dry, and neat fold.',
    features: [
      'Individual-drum hygienic wash',
      'Gentle fabric-safe detergents',
      'Neatly folded & ready to wear'
    ],
    image: '/images/sakura/service-wash-fold.png',
    selectionMode: 'direct-unit',
    minQuantity: 1,
    quantityStep: 1,
    turnaroundHours: 48,
    sortOrder: 1,
    isAvailable: true,
    isCustomerVisible: true,
    isActive: true,
    items: null,
    addOns: []
  },
  {
    categorySlug: 'wash-iron',
    name: 'Wash & Iron',
    price: 99,
    pricingMethod: 'per_unit',
    pricingUnit: 'kg',
    description: 'Complete wash, conditioning, and crisp steam pressing for daily wear.',
    features: [
      'Hygienic wash & fabric conditioning',
      'Crisp steam pressing',
      'Minimum 1 kg booking'
    ],
    image: '/images/services/wash-and-iron.svg',
    selectionMode: 'direct-unit',
    minQuantity: 1,
    quantityStep: 1,
    turnaroundHours: 48,
    sortOrder: 2,
    isAvailable: true,
    isCustomerVisible: true,
    isActive: true,
    items: null,
    addOns: []
  },
  {
    categorySlug: 'dry-cleaning',
    name: 'Dry Cleaning',
    price: null,
    pricingMethod: 'itemized',
    pricingUnit: 'piece',
    description: 'Precision solvent care for delicate garments, ethnic wear, and household linens.',
    features: [
      'Garments & Household Linens',
      'Optional Stain Removal treatment',
      'Fixed-size carpet cleaning'
    ],
    image: '/images/sakura/service-dry-cleaning.png',
    selectionMode: 'item-selection',
    minQuantity: 1,
    quantityStep: 1,
    turnaroundHours: 72,
    sortOrder: 3,
    isAvailable: true,
    isCustomerVisible: true,
    isActive: true,
    addOns: [],
    items: [
      // Garments
      {
        itemCode: 'dc-tshirt',
        name: 'T-Shirt',
        subCategory: 'Garments',
        pricingMethod: 'variant',
        basePrice: 90,
        pricingUnit: 'piece',
        minQuantity: 1,
        quantityStep: 1,
        sortOrder: 1,
        variants: [
          { code: 'normal', name: 'Normal', variantType: 'treatment', price: 90, additionalCharge: 0, unit: 'piece', isDefault: true },
          { code: 'stain-removal', name: 'Stain Removal', variantType: 'treatment', price: 130, additionalCharge: 40, unit: 'piece' }
        ]
      },
      {
        itemCode: 'dc-shirt',
        name: 'Shirt',
        subCategory: 'Garments',
        pricingMethod: 'variant',
        basePrice: 90,
        pricingUnit: 'piece',
        minQuantity: 1,
        quantityStep: 1,
        sortOrder: 2,
        variants: [
          { code: 'normal', name: 'Normal', variantType: 'treatment', price: 90, additionalCharge: 0, unit: 'piece', isDefault: true },
          { code: 'stain-removal', name: 'Stain Removal', variantType: 'treatment', price: 130, additionalCharge: 40, unit: 'piece' }
        ]
      },
      {
        itemCode: 'dc-pant',
        name: 'Pant',
        subCategory: 'Garments',
        pricingMethod: 'variant',
        basePrice: 90,
        pricingUnit: 'piece',
        minQuantity: 1,
        quantityStep: 1,
        sortOrder: 3,
        variants: [
          { code: 'normal', name: 'Normal', variantType: 'treatment', price: 90, additionalCharge: 0, unit: 'piece', isDefault: true },
          { code: 'stain-removal', name: 'Stain Removal', variantType: 'treatment', price: 130, additionalCharge: 40, unit: 'piece' }
        ]
      },
      {
        itemCode: 'dc-churidar-top',
        name: 'Churidar Top',
        subCategory: 'Garments',
        pricingMethod: 'variant',
        basePrice: 110,
        pricingUnit: 'piece',
        sortOrder: 4,
        variants: [{ code: 'standard', name: 'Standard', variantType: 'standard', price: 110, additionalCharge: 0, unit: 'piece', isDefault: true }]
      },
      {
        itemCode: 'dc-churidar-bottom',
        name: 'Churidar Bottom',
        subCategory: 'Garments',
        pricingMethod: 'variant',
        basePrice: 90,
        pricingUnit: 'piece',
        sortOrder: 5,
        variants: [{ code: 'standard', name: 'Standard', variantType: 'standard', price: 90, additionalCharge: 0, unit: 'piece', isDefault: true }]
      },
      {
        itemCode: 'dc-saree',
        name: 'Saree',
        subCategory: 'Garments',
        pricingMethod: 'variant',
        basePrice: 300,
        pricingUnit: 'piece',
        sortOrder: 6,
        variants: [{ code: 'standard', name: 'Standard', variantType: 'standard', price: 300, additionalCharge: 0, unit: 'piece', isDefault: true }]
      },
      {
        itemCode: 'dc-blouse',
        name: 'Blouse',
        subCategory: 'Garments',
        pricingMethod: 'variant',
        basePrice: 90,
        pricingUnit: 'piece',
        sortOrder: 7,
        variants: [{ code: 'standard', name: 'Standard', variantType: 'standard', price: 90, additionalCharge: 0, unit: 'piece', isDefault: true }]
      },
      {
        itemCode: 'dc-lehenga',
        name: 'Lehenga',
        subCategory: 'Garments',
        pricingMethod: 'variant',
        basePrice: 430,
        pricingUnit: 'set',
        sortOrder: 8,
        variants: [{ code: 'standard', name: 'Standard', variantType: 'standard', price: 430, additionalCharge: 0, unit: 'set', isDefault: true }]
      },
      {
        itemCode: 'dc-kurta',
        name: 'Kurta',
        subCategory: 'Garments',
        pricingMethod: 'variant',
        basePrice: 280,
        pricingUnit: 'set',
        sortOrder: 9,
        variants: [{ code: 'standard', name: 'Standard', variantType: 'standard', price: 280, additionalCharge: 0, unit: 'set', isDefault: true }]
      },
      {
        itemCode: 'dc-dhoti',
        name: 'Dhoti',
        subCategory: 'Garments',
        pricingMethod: 'variant',
        basePrice: 180,
        pricingUnit: 'piece',
        sortOrder: 10,
        variants: [{ code: 'standard', name: 'Standard', variantType: 'standard', price: 180, additionalCharge: 0, unit: 'piece', isDefault: true }]
      },
      {
        itemCode: 'dc-blazer-two-piece',
        name: 'Blazer (Two Piece)',
        subCategory: 'Garments',
        pricingMethod: 'variant',
        basePrice: 230,
        pricingUnit: 'item',
        sortOrder: 11,
        variants: [{ code: 'standard', name: 'Standard', variantType: 'standard', price: 230, additionalCharge: 0, unit: 'item', isDefault: true }]
      },
      {
        itemCode: 'dc-jacket',
        name: 'Jacket',
        subCategory: 'Garments',
        pricingMethod: 'variant',
        basePrice: 180,
        pricingUnit: 'piece',
        sortOrder: 12,
        variants: [{ code: 'standard', name: 'Standard', variantType: 'standard', price: 180, additionalCharge: 0, unit: 'piece', isDefault: true }]
      },
      {
        itemCode: 'dc-pullover-sweater',
        name: 'Pullover / Sweater',
        subCategory: 'Garments',
        pricingMethod: 'variant',
        basePrice: 130,
        pricingUnit: 'piece',
        sortOrder: 13,
        variants: [{ code: 'standard', name: 'Standard', variantType: 'standard', price: 130, additionalCharge: 0, unit: 'piece', isDefault: true }]
      },
      // Household Linens
      {
        itemCode: 'dc-single-bedsheet',
        name: 'Single Bedsheet',
        subCategory: 'Household Linens',
        pricingMethod: 'variant',
        basePrice: 180,
        pricingUnit: 'piece',
        sortOrder: 14,
        variants: [{ code: 'standard', name: 'Standard', variantType: 'standard', price: 180, additionalCharge: 0, unit: 'piece', isDefault: true }]
      },
      {
        itemCode: 'dc-double-bedsheet',
        name: 'Double Bedsheet',
        subCategory: 'Household Linens',
        pricingMethod: 'variant',
        basePrice: 280,
        pricingUnit: 'piece',
        sortOrder: 15,
        variants: [{ code: 'standard', name: 'Standard', variantType: 'standard', price: 280, additionalCharge: 0, unit: 'piece', isDefault: true }]
      },
      {
        itemCode: 'dc-blanket-single',
        name: 'Blanket',
        subCategory: 'Household Linens',
        pricingMethod: 'variant',
        basePrice: 330,
        pricingUnit: 'piece',
        sortOrder: 16,
        variants: [{ code: 'single', name: 'Single', variantType: 'size', price: 330, additionalCharge: 0, unit: 'piece', isDefault: true }]
      },
      {
        itemCode: 'dc-blanket-queen',
        name: 'Blanket / Razai',
        subCategory: 'Household Linens',
        pricingMethod: 'variant',
        basePrice: 430,
        pricingUnit: 'piece',
        sortOrder: 17,
        variants: [{ code: 'queen', name: 'Queen', variantType: 'size', price: 430, additionalCharge: 0, unit: 'piece', isDefault: true }]
      },
      {
        itemCode: 'dc-blanket-king',
        name: 'Blanket / Razai',
        subCategory: 'Household Linens',
        pricingMethod: 'variant',
        basePrice: 530,
        pricingUnit: 'piece',
        sortOrder: 18,
        variants: [{ code: 'king', name: 'King', variantType: 'size', price: 530, additionalCharge: 0, unit: 'piece', isDefault: true }]
      },
      {
        itemCode: 'dc-carpet',
        name: 'Carpet',
        subCategory: 'Household Linens',
        pricingMethod: 'fixed_size',
        basePrice: 630,
        pricingUnit: 'fixed_size',
        sortOrder: 19,
        variants: [
          { code: '4x6-ft', name: '4 × 6 ft', variantType: 'size', price: 630, additionalCharge: 0, unit: 'fixed_size', isDefault: true },
          { code: '8x10-ft', name: '8 × 10 ft', variantType: 'size', price: 1030, additionalCharge: 0, unit: 'fixed_size' }
        ]
      }
    ]
  },
  {
    categorySlug: 'shoe-cleaning',
    name: 'Shoe Cleaning',
    price: null,
    pricingMethod: 'itemized',
    pricingUnit: 'pair',
    description: 'Deep cleaning and conditioning per pair for sneakers, formal shoes, and boots.',
    features: [
      'Normal & Premium care tiers',
      'Per-pair transparent pricing',
      'Safe material-specific cleaning'
    ],
    image: '/images/sakura/service-shoe-cleaning.png',
    selectionMode: 'item-selection',
    minQuantity: 1,
    quantityStep: 1,
    turnaroundHours: 72,
    sortOrder: 4,
    isAvailable: true,
    isCustomerVisible: true,
    isActive: true,
    addOns: [],
    items: [
      {
        itemCode: 'shoe-sports',
        name: 'Sports Shoes',
        subCategory: 'Footwear',
        pricingMethod: 'variant',
        basePrice: 159,
        pricingUnit: 'pair',
        sortOrder: 1,
        variants: [
          { code: 'normal', name: 'Normal', variantType: 'tier', price: 159, additionalCharge: 0, unit: 'pair', isDefault: true },
          { code: 'premium', name: 'Premium', variantType: 'tier', price: 220, additionalCharge: 61, unit: 'pair' }
        ]
      },
      {
        itemCode: 'shoe-casual',
        name: 'Casual Shoes',
        subCategory: 'Footwear',
        pricingMethod: 'variant',
        basePrice: 159,
        pricingUnit: 'pair',
        sortOrder: 2,
        variants: [
          { code: 'normal', name: 'Normal', variantType: 'tier', price: 159, additionalCharge: 0, unit: 'pair', isDefault: true },
          { code: 'premium', name: 'Premium', variantType: 'tier', price: 220, additionalCharge: 61, unit: 'pair' }
        ]
      },
      {
        itemCode: 'shoe-formal-leather',
        name: 'Formal / Leather Shoes',
        subCategory: 'Footwear',
        pricingMethod: 'variant',
        basePrice: 249,
        pricingUnit: 'pair',
        sortOrder: 3,
        variants: [
          { code: 'normal', name: 'Normal', variantType: 'tier', price: 249, additionalCharge: 0, unit: 'pair', isDefault: true },
          { code: 'premium', name: 'Premium', variantType: 'tier', price: 349, additionalCharge: 100, unit: 'pair' }
        ]
      },
      {
        itemCode: 'shoe-boots',
        name: 'Boots',
        subCategory: 'Footwear',
        pricingMethod: 'variant',
        basePrice: 159,
        pricingUnit: 'pair',
        sortOrder: 4,
        variants: [
          { code: 'normal', name: 'Normal', variantType: 'tier', price: 159, additionalCharge: 0, unit: 'pair', isDefault: true },
          { code: 'premium', name: 'Premium', variantType: 'tier', price: 220, additionalCharge: 61, unit: 'pair' }
        ]
      }
    ]
  },
  {
    categorySlug: 'customized-services',
    name: 'Customized Services',
    price: null,
    pricingMethod: 'itemized',
    pricingUnit: 'piece',
    description: 'Dedicated Wet Wash care for household bedsheets and blankets by size.',
    features: [
      'Wet Wash (separate from Dry Cleaning)',
      'Small & Big size options',
      'Gentle hygienic wash'
    ],
    image: '/images/services/customized-services.svg',
    selectionMode: 'item-selection',
    minQuantity: 1,
    quantityStep: 1,
    turnaroundHours: 48,
    sortOrder: 5,
    isAvailable: true,
    isCustomerVisible: true,
    isActive: true,
    addOns: [],
    items: [
      {
        itemCode: 'wet-bedsheet',
        name: 'Bedsheet',
        subCategory: 'Wet Wash',
        pricingMethod: 'variant',
        basePrice: 160,
        pricingUnit: 'piece',
        sortOrder: 1,
        variants: [
          { code: 'small', name: 'Small', variantType: 'size', price: 160, additionalCharge: 0, unit: 'piece', isDefault: true },
          { code: 'big', name: 'Big', variantType: 'size', price: 200, additionalCharge: 0, unit: 'piece' }
        ]
      },
      {
        itemCode: 'wet-blanket',
        name: 'Blanket',
        subCategory: 'Wet Wash',
        pricingMethod: 'variant',
        basePrice: 230,
        pricingUnit: 'piece',
        sortOrder: 2,
        variants: [
          { code: 'small', name: 'Small', variantType: 'size', price: 230, additionalCharge: 0, unit: 'piece', isDefault: true },
          { code: 'big', name: 'Big', variantType: 'size', price: 260, additionalCharge: 0, unit: 'piece' }
        ]
      }
    ]
  },
  {
    categorySlug: 'specialty-services',
    name: 'Specialty Services',
    price: null,
    pricingMethod: 'itemized',
    pricingUnit: 'piece',
    description: 'Independent specialist cleaning for soft toys and everyday bags.',
    features: [
      'Toy Cleaning & Bag Cleaning',
      'Hygienic deep sanitization',
      'Independent per-piece selection'
    ],
    image: '/images/sakura/service-wash-fold.png',
    selectionMode: 'item-selection',
    minQuantity: 1,
    quantityStep: 1,
    turnaroundHours: 72,
    sortOrder: 6,
    isAvailable: true,
    isCustomerVisible: true,
    isActive: true,
    addOns: [],
    items: [
      {
        itemCode: 'spec-toy-cleaning',
        name: 'Toy Cleaning',
        subCategory: 'Specialty',
        pricingMethod: 'per_unit',
        basePrice: 429,
        pricingUnit: 'piece',
        sortOrder: 1,
        variants: [
          { code: 'standard', name: 'Standard', variantType: 'standard', price: 429, additionalCharge: 0, unit: 'piece', isDefault: true }
        ]
      },
      {
        itemCode: 'spec-bag-cleaning',
        name: 'Bag Cleaning',
        subCategory: 'Specialty',
        pricingMethod: 'per_unit',
        basePrice: 229,
        pricingUnit: 'piece',
        sortOrder: 2,
        variants: [
          { code: 'standard', name: 'Standard', variantType: 'standard', price: 229, additionalCharge: 0, unit: 'piece', isDefault: true }
        ]
      }
    ]
  }
];

