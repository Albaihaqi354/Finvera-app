/**
 * ============================================================
 * FINVERA — Storage / API Abstraction Layer
 * ============================================================
 * All data reads and writes go through this file.
 *
 * HOW TO INTEGRATE YOUR BACKEND:
 * When your backend is ready, replace the localStorage
 * implementations below with fetch() or axios calls.
 * No UI components (pages, providers) need to change at all.
 *
 * Example swap:
 *   BEFORE: return JSON.parse(localStorage.getItem(KEY) || 'null')
 *   AFTER:  const res = await fetch('/api/accounts'); return res.json()
 * ============================================================
 */

const KEYS = {
  ACCOUNTS:     'finvera_accounts',
  CATEGORIES:   'finvera_categories',
  TAGS:         'finvera_tags',
  TRANSACTIONS: 'finvera_transactions',
  BALANCE_VIS:  'finvera_balance_visible',
}

// ─── Accounts ────────────────────────────────────────────────
export const storageAPI = {
  accounts: {
    getAll: () => JSON.parse(localStorage.getItem(KEYS.ACCOUNTS) || 'null'),
    saveAll: (data) => localStorage.setItem(KEYS.ACCOUNTS, JSON.stringify(data)),
  },

  // ─── Categories ──────────────────────────────────────────
  categories: {
    getAll: () => JSON.parse(localStorage.getItem(KEYS.CATEGORIES) || 'null'),
    saveAll: (data) => localStorage.setItem(KEYS.CATEGORIES, JSON.stringify(data)),
  },

  // ─── Tags ────────────────────────────────────────────────
  tags: {
    getAll: () => JSON.parse(localStorage.getItem(KEYS.TAGS) || 'null'),
    saveAll: (data) => localStorage.setItem(KEYS.TAGS, JSON.stringify(data)),
  },

  // ─── Transactions ─────────────────────────────────────────
  transactions: {
    getAll: () => JSON.parse(localStorage.getItem(KEYS.TRANSACTIONS) || 'null'),
    saveAll: (data) => localStorage.setItem(KEYS.TRANSACTIONS, JSON.stringify(data)),
  },

  // ─── Preferences ─────────────────────────────────────────
  preferences: {
    getBalanceVisible: () => {
      const val = localStorage.getItem(KEYS.BALANCE_VIS)
      return val === null ? null : val === 'true'
    },
    saveBalanceVisible: (val) => localStorage.setItem(KEYS.BALANCE_VIS, String(val)),
  },
}
