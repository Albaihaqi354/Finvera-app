/**
 * ============================================================
 * FINVERA — Storage / API Abstraction Layer
 * ============================================================
 */

const KEYS = {
  ACCOUNTS: 'finvera_accounts',
  CATEGORIES: 'finvera_categories',
  TAGS: 'finvera_tags',
  TRANSACTIONS: 'finvera_transactions',
  TEMPLATES: 'finvera_templates',
  SCHEDULED: 'finvera_scheduled',
  BALANCE_VIS: 'finvera_balance_visible',
  CATEGORIES_VERSION: 'finvera_categories_version',
}

/** Bump when preset category list changes */
export const PRESET_CATEGORIES_VERSION = 2

function storage() {
  if (typeof window === 'undefined') return null
  return window.localStorage
}

function readJson(key) {
  const raw = storage()?.getItem(key)
  if (!raw) return null
  try {
    return JSON.parse(raw)
  } catch {
    return null
  }
}

function writeJson(key, data) {
  storage()?.setItem(key, JSON.stringify(data))
}

export const storageAPI = {
  accounts: {
    getAll: () => readJson(KEYS.ACCOUNTS),
    saveAll: (data) => writeJson(KEYS.ACCOUNTS, data),
  },

  categories: {
    getAll: () => readJson(KEYS.CATEGORIES),
    saveAll: (data) => writeJson(KEYS.CATEGORIES, data),
    getVersion: () => {
      const v = storage()?.getItem(KEYS.CATEGORIES_VERSION)
      return v ? parseInt(v, 10) : 0
    },
    saveVersion: (version) => storage()?.setItem(KEYS.CATEGORIES_VERSION, String(version)),
  },

  tags: {
    getAll: () => readJson(KEYS.TAGS),
    saveAll: (data) => writeJson(KEYS.TAGS, data),
  },

  transactions: {
    getAll: () => readJson(KEYS.TRANSACTIONS),
    saveAll: (data) => writeJson(KEYS.TRANSACTIONS, data),
  },

  templates: {
    getAll: () => readJson(KEYS.TEMPLATES),
    saveAll: (data) => writeJson(KEYS.TEMPLATES, data),
  },

  scheduled: {
    getAll: () => readJson(KEYS.SCHEDULED),
    saveAll: (data) => writeJson(KEYS.SCHEDULED, data),
  },

  preferences: {
    getBalanceVisible: () => {
      const val = storage()?.getItem(KEYS.BALANCE_VIS)
      return val === null ? null : val === 'true'
    },
    saveBalanceVisible: (val) => storage()?.setItem(KEYS.BALANCE_VIS, String(val)),
  },
}
