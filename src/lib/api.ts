import axios from 'axios';

const BASE_URL = (process.env.NEXT_PUBLIC_API_URL || 'https://eloria-backend.vercel.app').replace(/\/$/, '');

const api = axios.create({
  baseURL: BASE_URL,
  headers: { 'Content-Type': 'application/json' },
});

// Automatically attach JWT token to every request and prevent 304 CORS cache issues
api.interceptors.request.use((config) => {
  config.headers['Cache-Control'] = 'no-cache, no-store, must-revalidate';
  config.headers['Pragma'] = 'no-cache';
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('eloria_admin_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

// Redirect to login on 401
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 && typeof window !== 'undefined') {
      const path = window.location.pathname;
      if (path.startsWith('/admin/dashboard')) {
        localStorage.removeItem('eloria_admin_token');
        window.location.href = '/admin/login';
      }
    }
    return Promise.reject(error);
  }
);

// ─── Public API ───────────────────────────────────────────────
export const publicApi = {
  getProducts: (params?: Record<string, string>) =>
    api.get('/api/products', { params }),
  getProductById: (id: string) =>
    api.get(`/api/products/${id}`),
  createOrder: (data: any) =>
    api.post('/api/orders', data),
  subscribeNewsletter: (email: string) =>
    api.post('/api/newsletter', { email }),
  submitContact: (data: any) =>
    api.post('/api/contact', data),
  getCategories: () =>
    api.get('/api/categories'),
  getDeals: () =>
    api.get('/api/deals/public'),
  getBundles: () =>
    api.get('/api/bundles/public'),
};

// ─── Admin API ────────────────────────────────────────────────
export const adminApi = {
  // Auth
  login: (email: string, password: string) =>
    api.post('/api/auth/login', { email, password }),

  // Dashboard & Analytics
  getDashboardStats: () =>
    api.get('/api/admin/dashboard/stats'),
  getAnalytics: () =>
    api.get('/api/admin/analytics'),

  // Products
  getProducts: (params?: Record<string, string>) =>
    api.get('/api/admin/products', { params }),
  createProduct: (data: any) =>
    api.post('/api/admin/products', data),
  updateProduct: (id: string, data: any) =>
    api.put(`/api/admin/products/${id}`, data),
  deleteProduct: (id: string) =>
    api.delete(`/api/admin/products/${id}`),
  uploadImages: async (files: FileList | File[]) => {
    const formData = new FormData();
    Array.from(files).forEach(file => formData.append('images', file));
    const token = typeof window !== 'undefined' ? localStorage.getItem('eloria_admin_token') : null;
    const res = await fetch(`${BASE_URL}/api/admin/products/upload`, {
      method: 'POST',
      headers: {
        ...(token ? { Authorization: `Bearer ${token}` } : {})
      },
      body: formData
    });
    if (!res.ok) {
      const errData = await res.json().catch(() => ({}));
      throw new Error(errData.error || errData.message || 'Upload failed');
    }
    const json = await res.json();
    const urls = json.urls || json.data?.urls || [];
    return {
      data: {
        urls,
        data: { urls }
      }
    };
  },

  // Orders
  getOrders: () =>
    api.get('/api/admin/orders'),
  updateOrderStatus: (id: string, status: string) =>
    api.put(`/api/admin/orders/${id}/status`, { status }),
  deleteOrder: (id: string) =>
    api.delete(`/api/admin/orders/${id}`),

  // Customers
  getCustomers: () =>
    api.get('/api/admin/customers'),
  deleteCustomer: (id: string) =>
    api.delete(`/api/admin/customers/${id}`),

  // Discounts
  getDiscounts: () =>
    api.get('/api/admin/discounts'),
  createDiscount: (data: any) =>
    api.post('/api/admin/discounts', data),
  deleteDiscount: (id: string) =>
    api.delete(`/api/admin/discounts/${id}`),

  // Deals
  getDeals: () =>
    api.get('/api/admin/deals'),
  createDeal: (data: any) =>
    api.post('/api/admin/deals', data),
  updateDeal: (id: string, data: any) =>
    api.put(`/api/admin/deals/${id}`, data),
  deleteDeal: (id: string) =>
    api.delete(`/api/admin/deals/${id}`),

  // Bundles
  getBundles: () =>
    api.get('/api/admin/bundles'),
  createBundle: (data: any) =>
    api.post('/api/admin/bundles', data),
  updateBundle: (id: string, data: any) =>
    api.put(`/api/admin/bundles/${id}`, data),
  deleteBundle: (id: string) =>
    api.delete(`/api/admin/bundles/${id}`),

  // Inventory
  getInventory: () =>
    api.get('/api/admin/inventory'),
  updateInventory: (id: string, availableStock: number) =>
    api.put(`/api/admin/inventory/${id}`, { availableStock }),

  // Categories
  getCategories: () =>
    api.get('/api/admin/categories'),
  createCategory: (data: any) =>
    api.post('/api/admin/categories', data),
  updateCategory: (id: string, data: any) =>
    api.put(`/api/admin/categories/${id}`, data),
  deleteCategory: (id: string) =>
    api.delete(`/api/admin/categories/${id}`),
};

// ─── PKR Formatter ────────────────────────────────────────────
export const formatPKR = (amount: any): string => {
  const num = typeof amount === 'number' && !isNaN(amount) ? amount : (Number(amount) || 0);
  return 'Rs ' + Math.round(num).toLocaleString('en-PK');
};

export default api;
