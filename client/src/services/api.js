import axios from 'axios';

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || 'http://localhost:5001/api/v1';

export const ADMIN_TOKEN_STORAGE_KEY = 'laundry_walii_admin_token';

/**
 * Centralized Axios instance configured for Laundry Walii Node.js/Express backend.
 */
export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json'
  }
});

// Request interceptor (attach customer or admin token when present)
apiClient.interceptors.request.use(
  (config) => {
    const isAdminRoute =
      config.url?.includes('/admin') || config.useAdminAuth === true;
    const token = isAdminRoute
      ? localStorage.getItem(ADMIN_TOKEN_STORAGE_KEY)
      : localStorage.getItem('laundry_walii_token');

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor (central error handling & normalizer)
apiClient.interceptors.response.use(
  (response) => response.data,
  (error) => {
    const errorPayload = {
      message:
        error.response?.data?.message ||
        error.message ||
        'An unexpected network error occurred.',
      status: error.response?.status || 500,
      details: error.response?.data || null
    };
    return Promise.reject(errorPayload);
  }
);

export const branchesApi = {
  getAll: async () => {
    const res = await apiClient.get('/branches');
    return res.branches || [];
  },
  getById: async (slug) => {
    const res = await apiClient.get(`/branches/${slug}`);
    return res.branch;
  }
};

export const servicesApi = {
  getAll: async () => {
    const res = await apiClient.get('/services');
    return res.categories || [];
  },
  getCategories: async () => {
    const res = await apiClient.get('/services/categories');
    return res.categories || [];
  },
  getItems: async (params = {}) => {
    const res = await apiClient.get('/services/items', { params });
    return res.items || [];
  },
  getBySlug: async (slug) => {
    const res = await apiClient.get(`/services/${slug}`);
    return res.service;
  },
  getPricingSettings: async () => {
    const res = await apiClient.get('/services/settings/pricing');
    return res.settings;
  }
};

export const ordersApi = {
  quoteOrder: async (quotePayload) => {
    const res = await apiClient.post('/orders/quote', quotePayload);
    return res.quote;
  },
  createOrder: async (orderPayload) => {
    return apiClient.post('/orders', orderPayload);
  },
  getByBookingId: async (bookingId) => {
    return apiClient.get(`/orders/booking/${encodeURIComponent(bookingId)}`);
  }
};

export const contactApi = {
  submitEnquiry: async (enquiryData) => {
    return apiClient.post('/contact', enquiryData);
  }
};

export const franchiseApi = {
  submitLead: async (leadData) => {
    return apiClient.post('/franchise-leads', leadData);
  }
};

export const adminApi = {
  login: async (email, password) => {
    return apiClient.post('/auth/admin/login', { email, password });
  },
  getProfile: async () => {
    return apiClient.get('/admin/me', { useAdminAuth: true });
  },
  getDashboard: async () => {
    return apiClient.get('/admin/dashboard', { useAdminAuth: true });
  },
  getAllServices: async () => {
    const res = await apiClient.get('/services/admin/all', { useAdminAuth: true });
    return res.categories || [];
  },
  createCategory: async (payload) => {
    return apiClient.post('/services/admin/categories', payload, { useAdminAuth: true });
  },
  updateCategory: async (slug, payload) => {
    return apiClient.patch(`/services/admin/${encodeURIComponent(slug)}`, payload, {
      useAdminAuth: true
    });
  },
  addItem: async (slug, payload) => {
    return apiClient.post(`/services/admin/${encodeURIComponent(slug)}/items`, payload, {
      useAdminAuth: true
    });
  },
  updateItem: async (slug, itemId, payload) => {
    return apiClient.patch(
      `/services/admin/${encodeURIComponent(slug)}/items/${encodeURIComponent(itemId)}`,
      payload,
      { useAdminAuth: true }
    );
  },
  addVariant: async (slug, itemId, payload) => {
    return apiClient.post(
      `/services/admin/${encodeURIComponent(slug)}/items/${encodeURIComponent(itemId)}/variants`,
      payload,
      { useAdminAuth: true }
    );
  },
  updateVariant: async (slug, itemId, variantId, payload) => {
    return apiClient.patch(
      `/services/admin/${encodeURIComponent(slug)}/items/${encodeURIComponent(itemId)}/variants/${encodeURIComponent(variantId)}`,
      payload,
      { useAdminAuth: true }
    );
  },
  addAddOn: async (slug, payload) => {
    return apiClient.post(`/services/admin/${encodeURIComponent(slug)}/addons`, payload, {
      useAdminAuth: true
    });
  },
  updateAddOn: async (slug, addOnId, payload) => {
    return apiClient.patch(
      `/services/admin/${encodeURIComponent(slug)}/addons/${encodeURIComponent(addOnId)}`,
      payload,
      { useAdminAuth: true }
    );
  },
  listOrders: async (params = {}) => {
    return apiClient.get('/orders/admin/list', { params, useAdminAuth: true });
  },
  getOrderDetails: async (bookingId) => {
    return apiClient.get(`/orders/booking/${encodeURIComponent(bookingId)}`, {
      useAdminAuth: true
    });
  },
  getPricingSettings: async () => {
    const res = await apiClient.get('/admin/settings/pricing', { useAdminAuth: true });
    return res.settings;
  },
  updatePricingSettings: async (payload) => {
    return apiClient.patch('/admin/settings/pricing', payload, { useAdminAuth: true });
  },
  listEnquiries: async (params = {}) => {
    return apiClient.get('/admin/contact', { params, useAdminAuth: true });
  },
  updateEnquiry: async (id, payload) => {
    return apiClient.patch(`/admin/contact/${encodeURIComponent(id)}`, payload, {
      useAdminAuth: true
    });
  }
};

export default apiClient;
