const API_BASE = import.meta.env.VITE_API_URL || '/api';

interface RequestOptions extends RequestInit {
  data?: any;
}

export async function request<T>(endpoint: string, options: RequestOptions = {}): Promise<T> {
  const token = localStorage.getItem('sm_token') || localStorage.getItem('apex_token');
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...(options.headers || {})
  };

  if (token) {
    (headers as Record<string, string>)['Authorization'] = `Bearer ${token}`;
  }

  const config: RequestInit = {
    ...options,
    headers,
    body: options.data ? JSON.stringify(options.data) : options.body
  };

  const response = await fetch(`${API_BASE}${endpoint}`, config);
  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.message || `Request failed with status ${response.status}`);
  }

  return data as T;
}

export const api = {
  // Auth
  register: (data: any) => request<any>('/auth/register', { method: 'POST', data }),
  loginCustomer: (data: any) => request<any>('/auth/login', { method: 'POST', data }),
  loginAdmin: (data: any) => request<any>('/auth/admin/login', { method: 'POST', data }),
  forgotPassword: (email: string) => request<any>('/auth/forgot-password', { method: 'POST', data: { email } }),
  verifyOtp: (email: string, otp: string) => request<any>('/auth/verify-otp', { method: 'POST', data: { email, otp } }),
  resetPassword: (data: { email: string; otp: string; newPassword: string }) =>
    request<any>('/auth/reset-password', { method: 'POST', data }),
  getMe: () => request<any>('/auth/me', { method: 'GET' }),

  // Products
  getProducts: (params?: Record<string, string>) => {
    const qs = params ? '?' + new URLSearchParams(params).toString() : '';
    return request<any>(`/products${qs}`, { method: 'GET' });
  },
  getProductById: (id: string) => request<any>(`/products/${id}`, { method: 'GET' }),
  getCategories: () => request<any>('/products/categories', { method: 'GET' }),
  createProduct: (data: any) => request<any>('/products', { method: 'POST', data }),
  updateProduct: (id: string, data: any) => request<any>(`/products/${id}`, { method: 'PUT', data }),
  updateStock: (id: string, stock: number) => request<any>(`/products/${id}/stock`, { method: 'PATCH', data: { stock } }),
  deleteProduct: (id: string) => request<any>(`/products/${id}`, { method: 'DELETE' }),

  // Offers
  getActiveOffers: () => request<any>('/offers', { method: 'GET' }),
  getAllOffers: () => request<any>('/offers/all', { method: 'GET' }),
  createOffer: (data: any) => request<any>('/offers', { method: 'POST', data }),
  updateOffer: (id: string, data: any) => request<any>(`/offers/${id}`, { method: 'PUT', data }),
  deleteOffer: (id: string) => request<any>(`/offers/${id}`, { method: 'DELETE' }),

  // Orders
  createOrder: (data: any) => request<any>('/orders', { method: 'POST', data }),
  getMyOrders: () => request<any>('/orders/my-orders', { method: 'GET' }),
  getOrderById: (id: string) => request<any>(`/orders/${id}`, { method: 'GET' }),
  getAllOrders: () => request<any>('/orders', { method: 'GET' }),
  updateOrderStatus: (id: string, orderStatus: string) =>
    request<any>(`/orders/${id}/status`, { method: 'PATCH', data: { orderStatus } }),

  // Stats
  getAdminStats: () => request<any>('/stats/admin', { method: 'GET' }),

  // Store Settings
  getSettings: () => request<any>('/settings', { method: 'GET' }),
  updateSettings: (data: any) => request<any>('/settings', { method: 'PUT', data })
};
