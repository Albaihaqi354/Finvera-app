const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api/v1';

function getToken() {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('finvera_token');
}

export function setToken(token) {
  if (typeof window !== 'undefined') {
    localStorage.setItem('finvera_token', token);
  }
}

export function removeToken() {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('finvera_token');
    localStorage.removeItem('finvera_user');
  }
}

async function fetchApi(endpoint, options = {}) {
  const token = getToken();
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  const data = await response.json();

  if (!response.ok) {
    if (response.status === 401) {
      removeToken();
      if (typeof window !== 'undefined' && window.location.pathname !== '/auth/signin') {
        window.location.href = '/auth/signin';
      }
    }
    throw new Error(data.message || data.error || 'Terjadi kesalahan API');
  }

  return data.data || data; // Return nested data field if it exists
}

export const api = {
  auth: {
    login: (credentials) => fetchApi('/auth/login', { method: 'POST', body: JSON.stringify(credentials) }),
    register: (userData) => fetchApi('/auth/register', { method: 'POST', body: JSON.stringify(userData) }),
    logout: () => fetchApi('/auth/logout', { method: 'POST' }),
  },
  presetCategories: {
    // Public endpoint — no auth required, called during signup
    getAll: () => fetchApi('/preset-categories'),
  },
  users: {
    getProfile: () => fetchApi('/users/me'),
    updateProfile: (data) => fetchApi('/users/me', { method: 'PUT', body: JSON.stringify(data) }),
  },
  accounts: {
    getAll: () => fetchApi('/accounts'),
    create: (data) => fetchApi('/accounts', { method: 'POST', body: JSON.stringify(data) }),
    update: (id, data) => fetchApi(`/accounts/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
    delete: (id) => fetchApi(`/accounts/${id}`, { method: 'DELETE' }),
  },
  categories: {
    getAll: () => fetchApi('/categories'),
    create: (data) => fetchApi('/categories', { method: 'POST', body: JSON.stringify(data) }),
    update: (id, data) => fetchApi(`/categories/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
    delete: (id) => fetchApi(`/categories/${id}`, { method: 'DELETE' }),
  },
  tags: {
    getAll: () => fetchApi('/tags'),
    create: (data) => fetchApi('/tags', { method: 'POST', body: JSON.stringify(data) }),
    update: (id, data) => fetchApi(`/tags/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
    delete: (id) => fetchApi(`/tags/${id}`, { method: 'DELETE' }),
  },
  transactions: {
    getAll: (params = {}) => {
      const query = new URLSearchParams({ limit: 1000, ...params }).toString()
      return fetchApi(`/transactions?${query}`)
    },
    create: (data) => fetchApi('/transactions', { method: 'POST', body: JSON.stringify(data) }),
    update: (id, data) => fetchApi(`/transactions/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
    delete: (id) => fetchApi(`/transactions/${id}`, { method: 'DELETE' }),
  },
  templates: {
    getAll: () => Promise.resolve([]), // TODO: Templates API
    create: (data) => Promise.resolve(data),
    update: (id, data) => Promise.resolve(data),
    delete: (id) => Promise.resolve(),
  },
  scheduled: {
    getAll: () => fetchApi('/scheduled'),
    create: (data) => fetchApi('/scheduled', { method: 'POST', body: JSON.stringify(data) }),
    update: (id, data) => fetchApi(`/scheduled/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
    delete: (id) => fetchApi(`/scheduled/${id}`, { method: 'DELETE' }),
  }
};
