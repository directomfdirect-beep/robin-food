/**
 * Robin Food API Client
 * Handles all communication with the backend Express API
 */

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3001/api/v1';

let accessToken = localStorage.getItem('rf_access_token');
let refreshToken = localStorage.getItem('rf_refresh_token');

function setTokens(access, refresh) {
  accessToken = access;
  refreshToken = refresh;
  if (access) localStorage.setItem('rf_access_token', access);
  else localStorage.removeItem('rf_access_token');
  if (refresh) localStorage.setItem('rf_refresh_token', refresh);
  else localStorage.removeItem('rf_refresh_token');
}

function getAccessToken() {
  return accessToken;
}

function clearTokens() {
  setTokens(null, null);
}

async function request(path, options = {}) {
  const url = `${API_BASE}${path}`;
  const headers = { 'Content-Type': 'application/json', ...options.headers };

  if (accessToken && !options.noAuth) {
    headers['Authorization'] = `Bearer ${accessToken}`;
  }

  const response = await fetch(url, { ...options, headers });

  if (response.status === 401 && refreshToken && !options._isRetry) {
    const refreshed = await tryRefreshToken();
    if (refreshed) {
      return request(path, { ...options, _isRetry: true });
    }
    clearTokens();
    window.dispatchEvent(new CustomEvent('rf:auth-expired'));
  }

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'Network error' }));
    throw new ApiError(error.error || 'Request failed', response.status, error.code);
  }

  if (response.status === 204) return null;
  return response.json();
}

async function tryRefreshToken() {
  try {
    const res = await fetch(`${API_BASE}/auth/refresh`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refreshToken }),
    });
    if (!res.ok) return false;
    const data = await res.json();
    setTokens(data.accessToken, data.refreshToken);
    return true;
  } catch {
    return false;
  }
}

class ApiError extends Error {
  constructor(message, status, code) {
    super(message);
    this.status = status;
    this.code = code;
  }
}

// ==========================================
// Auth
// ==========================================

export const auth = {
  sendOtp: (phone) =>
    request('/auth/send-otp', { method: 'POST', body: JSON.stringify({ phone }), noAuth: true }),

  verifyOtp: (phone, code) =>
    request('/auth/verify-otp', { method: 'POST', body: JSON.stringify({ phone, code }), noAuth: true })
      .then(data => { setTokens(data.accessToken, data.refreshToken); return data; }),

  logout: () =>
    request('/auth/logout', { method: 'POST', body: JSON.stringify({ refreshToken }) })
      .finally(() => clearTokens()),

  registerPush: (token, platform) =>
    request('/auth/register-push', { method: 'POST', body: JSON.stringify({ pushToken: token, platform }) }),
};

// ==========================================
// Catalog
// ==========================================

export const catalog = {
  getStores: (lat, lng, radius = 3) =>
    request(`/stores?lat=${lat}&lng=${lng}&radius=${radius}`),

  getStore: (id) =>
    request(`/stores/${id}`),

  getProducts: (storeId, { category, sort, cursor, limit = 20 } = {}) => {
    const params = new URLSearchParams({ limit });
    if (category) params.set('category', category);
    if (sort) params.set('sort', sort);
    if (cursor) params.set('cursor', cursor);
    return request(`/stores/${storeId}/products?${params}`);
  },

  getProduct: (id) =>
    request(`/products/${id}`),
};

// ==========================================
// Search
// ==========================================

export const search = {
  query: (q, type = 'all', limit = 20) =>
    request(`/search?q=${encodeURIComponent(q)}&type=${type}&limit=${limit}`),

  suggest: (q) =>
    request(`/search/suggest?q=${encodeURIComponent(q)}`),
};

// ==========================================
// Cart
// ==========================================

export const cart = {
  get: () => request('/cart'),

  addItem: (offerId, storeId, quantity = 1) =>
    request('/cart/items', { method: 'POST', body: JSON.stringify({ offerId, storeId, quantity }) }),

  updateItem: (id, quantity) =>
    request(`/cart/items/${id}`, { method: 'PUT', body: JSON.stringify({ quantity }) }),

  removeItem: (id) =>
    request(`/cart/items/${id}`, { method: 'DELETE' }),

  clear: () =>
    request('/cart', { method: 'DELETE' }),

  checkout: (paymentProvider = 'tinkoff') =>
    request('/cart/checkout', { method: 'POST', body: JSON.stringify({ paymentProvider }) }),
};

// ==========================================
// Orders
// ==========================================

export const orders = {
  list: (status = 'all', cursor, limit = 20) => {
    const params = new URLSearchParams({ status, limit });
    if (cursor) params.set('cursor', cursor);
    return request(`/orders?${params}`);
  },

  get: (id) => request(`/orders/${id}`),

  cancel: (id) =>
    request(`/orders/${id}/cancel`, { method: 'POST' }),

  rate: (id, rating, comment) =>
    request(`/orders/${id}/rate`, { method: 'POST', body: JSON.stringify({ rating, comment }) }),

  markArrived: (id) =>
    request(`/orders/${id}/arrived`, { method: 'POST' }),

  getChat: (id) => request(`/orders/${id}/chat`),

  sendChat: (id, body) =>
    request(`/orders/${id}/chat`, { method: 'POST', body: JSON.stringify({ body }) }),

  markRead: (id) =>
    request(`/orders/${id}/chat/read`, { method: 'POST' }),
};

// ==========================================
// Profile
// ==========================================

export const profile = {
  get: () => request('/profile'),

  update: (fullName) =>
    request('/profile', { method: 'PUT', body: JSON.stringify({ fullName }) }),

  requestDeletion: (reason) =>
    request('/profile/delete', { method: 'POST', body: JSON.stringify({ reason }) }),

  cancelDeletion: () =>
    request('/profile/delete/cancel', { method: 'POST' }),
};

// ==========================================
// Favorites
// ==========================================

export const favorites = {
  list: (type = 'all') =>
    request(`/favorites?type=${type}`),

  add: (entityType, entityId) =>
    request('/favorites', { method: 'POST', body: JSON.stringify({ entityType, entityId }) }),

  remove: (id) =>
    request(`/favorites/${id}`, { method: 'DELETE' }),
};

// ==========================================
// Addresses
// ==========================================

export const addresses = {
  list: () => request('/addresses'),

  create: (data) =>
    request('/addresses', { method: 'POST', body: JSON.stringify(data) }),

  update: (id, data) =>
    request(`/addresses/${id}`, { method: 'PUT', body: JSON.stringify(data) }),

  remove: (id) =>
    request(`/addresses/${id}`, { method: 'DELETE' }),
};

// ==========================================
// Smart Alerts
// ==========================================

export const alerts = {
  list: () => request('/smart-alerts'),

  create: (data) =>
    request('/smart-alerts', { method: 'POST', body: JSON.stringify(data) }),

  update: (id, data) =>
    request(`/smart-alerts/${id}`, { method: 'PUT', body: JSON.stringify(data) }),

  remove: (id) =>
    request(`/smart-alerts/${id}`, { method: 'DELETE' }),

  history: (id) =>
    request(`/smart-alerts/${id}/history`),
};

// ==========================================
// WebSocket
// ==========================================

export function connectWebSocket(onMessage) {
  const wsUrl = (API_BASE.replace(/^http/, 'ws').replace('/api/v1', '')) + `/ws?token=${accessToken}`;
  const ws = new WebSocket(wsUrl);

  ws.onmessage = (event) => {
    try {
      const data = JSON.parse(event.data);
      onMessage(data);
    } catch (e) {}
  };

  ws.onclose = () => {
    setTimeout(() => {
      if (accessToken) connectWebSocket(onMessage);
    }, 3000);
  };

  return ws;
}

export { setTokens, getAccessToken, clearTokens, ApiError };
