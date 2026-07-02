const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api/v1';

// ── Token helpers ─────────────────────────────────────────────────────────────

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

// ── Core fetch wrapper ────────────────────────────────────────────────────────

const PUBLIC_ENDPOINTS = new Set(['/auth/login', '/auth/register', '/preset-categories']);

async function fetchApi(endpoint, options = {}) {
  const isPublic = PUBLIC_ENDPOINTS.has(endpoint);
  const token = isPublic ? null : getToken();

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

  // Parse response body
  let data = {};
  const raw = await response.text();
  if (raw) {
    try {
      data = JSON.parse(raw);
    } catch {
      data = { error: raw };
    }
  }

  if (!response.ok) {
    // 401 on a protected route → token expired or invalid
    const isAuthEndpointFailure = isPublic && (response.status === 401 || response.status === 400);
    if (response.status === 401 && !isAuthEndpointFailure) {
      removeToken();
      if (typeof window !== 'undefined') {
        const path = window.location.pathname;
        const onSignInPage = path === '/auth/signin' || path.startsWith('/auth/signin/');
        if (!onSignInPage) {
          window.location.href = '/auth/signin';
        }
      }
    }
    // Normalise error message — backend uses both `error` and `message` fields
    const errMsg = data?.error || data?.message || `Request failed with status ${response.status}`;
    throw new Error(errMsg);
  }

  // Backend wraps data in a `data` envelope — unwrap it
  return data?.data !== undefined ? data.data : data;
}

// ── API surface ───────────────────────────────────────────────────────────────

export const api = {
  auth: {
    login:    (credentials) => fetchApi('/auth/login',    { method: 'POST', body: JSON.stringify(credentials) }),
    register: (userData)    => fetchApi('/auth/register', { method: 'POST', body: JSON.stringify(userData) }),
    logout:   ()            => fetchApi('/auth/logout',   { method: 'POST' }),
  },

  presetCategories: {
    // Public — no auth required
    getAll: () => fetchApi('/preset-categories'),
  },

  users: {
    getProfile:    ()     => fetchApi('/users/me'),
    updateProfile: (data) => fetchApi('/users/me', { method: 'PUT', body: JSON.stringify(data) }),
  },

  accounts: {
    getAll:  ()         => fetchApi('/accounts'),
    create:  (data)     => fetchApi('/accounts',       { method: 'POST',   body: JSON.stringify(data) }),
    update:  (id, data) => fetchApi(`/accounts/${id}`, { method: 'PUT',    body: JSON.stringify(data) }),
    delete:  (id)       => fetchApi(`/accounts/${id}`, { method: 'DELETE' }),
  },

  categories: {
    getAll:  ()         => fetchApi('/categories'),
    create:  (data)     => fetchApi('/categories',       { method: 'POST',   body: JSON.stringify(data) }),
    update:  (id, data) => fetchApi(`/categories/${id}`, { method: 'PUT',    body: JSON.stringify(data) }),
    delete:  (id)       => fetchApi(`/categories/${id}`, { method: 'DELETE' }),
  },

  tags: {
    getAll:  ()         => fetchApi('/tags'),
    create:  (data)     => fetchApi('/tags',       { method: 'POST',   body: JSON.stringify(data) }),
    update:  (id, data) => fetchApi(`/tags/${id}`, { method: 'PUT',    body: JSON.stringify(data) }),
    delete:  (id)       => fetchApi(`/tags/${id}`, { method: 'DELETE' }),
  },

  transactions: {
    /**
     * Fetch transactions with server-side pagination.
     * Default page=1, limit=20 — no longer fetching 1000 records at once.
     * Pass { page, limit, type, accountId, search, startDate, endDate } to filter.
     */
    getAll: (params = {}) => {
      const defaults = { page: 1, limit: 20 };
      const query = new URLSearchParams({ ...defaults, ...params }).toString();
      return fetchApi(`/transactions?${query}`);
    },
    create:  (data)     => fetchApi('/transactions',       { method: 'POST',   body: JSON.stringify(data) }),
    update:  (id, data) => fetchApi(`/transactions/${id}`, { method: 'PUT',    body: JSON.stringify(data) }),
    delete:  (id)       => fetchApi(`/transactions/${id}`, { method: 'DELETE' }),
  },

  templates: {
    // TODO: Implement backend for templates
    getAll:  ()         => Promise.resolve([]),
    create:  (data)     => Promise.resolve(data),
    update:  (_id, data) => Promise.resolve(data),
    delete:  (_id)      => Promise.resolve(),
  },

  scheduled: {
    getAll:  ()         => fetchApi('/scheduled'),
    create:  (data)     => fetchApi('/scheduled',       { method: 'POST',   body: JSON.stringify(data) }),
    update:  (id, data) => fetchApi(`/scheduled/${id}`, { method: 'PUT',    body: JSON.stringify(data) }),
    delete:  (id)       => fetchApi(`/scheduled/${id}`, { method: 'DELETE' }),
  },
};
