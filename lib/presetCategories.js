/**
 * Preset transaction categories — shared by signup flow and desktop defaults.
 * Matches the "Preset Categories" step on /auth/signup.
 */

export const PRESET_INCOME_CATEGORIES = [
  { name: 'Occupational Earnings', icon: '💼', colorClass: 'text-[#D68E5A] bg-[#D68E5A]/10' },
  { name: 'Finance & Investment', icon: '📈', colorClass: 'text-[#D68E5A] bg-[#D68E5A]/10' },
  { name: 'Miscellaneous', icon: '📝', colorClass: 'text-[#D68E5A] bg-[#D68E5A]/10' },
]

export const PRESET_EXPENSE_CATEGORIES = [
  { name: 'Food & Drink', icon: '🍔', colorClass: 'text-orange-500 bg-orange-50' },
  { name: 'Clothing & Appearance', icon: '👔', colorClass: 'text-purple-500 bg-purple-50' },
  { name: 'Housing & Houseware', icon: '🏠', colorClass: 'text-gray-600 bg-gray-100' },
  { name: 'Transportation', icon: '🚗', colorClass: 'text-teal-500 bg-teal-50' },
  { name: 'Communication', icon: '📱', colorClass: 'text-blue-500 bg-blue-50' },
  { name: 'Entertainment', icon: '🎬', colorClass: 'text-rose-500 bg-rose-50' },
  { name: 'Education & Studying', icon: '📚', colorClass: 'text-lime-500 bg-lime-50' },
  { name: 'Gifts & Donations', icon: '🎁', colorClass: 'text-green-500 bg-green-50' },
  { name: 'Medical & Healthcare', icon: '🏥', colorClass: 'text-red-500 bg-red-50' },
  { name: 'Finance & Insurance', icon: '💳', colorClass: 'text-amber-500 bg-amber-50' },
  { name: 'Miscellaneous', icon: '📌', colorClass: 'text-gray-500 bg-gray-50' },
]

export const PRESET_TRANSFER_CATEGORIES = [
  { name: 'General Transfer', icon: '🔄', colorClass: 'text-orange-500 bg-orange-50' },
  { name: 'Loan & Debt', icon: '📄', colorClass: 'text-amber-500 bg-amber-50' },
  { name: 'Miscellaneous', icon: '📌', colorClass: 'text-gray-500 bg-gray-50' },
]

/** Flat list for DesktopProvider / storage (id, type, parentId) */
export function buildDefaultCategories() {
  const income = PRESET_INCOME_CATEGORIES.map((c, i) => ({
    id: `inc_${i + 1}`,
    name: c.name,
    type: 'income',
    icon: c.icon,
    colorClass: c.colorClass,
    parentId: null,
  }))

  const expense = PRESET_EXPENSE_CATEGORIES.map((c, i) => ({
    id: `exp_${i + 1}`,
    name: c.name,
    type: 'expense',
    icon: c.icon,
    colorClass: c.colorClass,
    parentId: null,
  }))

  const transfer = PRESET_TRANSFER_CATEGORIES.map((c, i) => ({
    id: `trf_${i + 1}`,
    name: c.name,
    type: 'transfer',
    icon: c.icon,
    colorClass: c.colorClass,
    parentId: null,
  }))

  return [...income, ...expense, ...transfer]
}

/** First expense category id — for sample default transaction */
export function getDefaultExpenseCategoryId(categories) {
  return categories.find(c => c.type === 'expense')?.id || categories[0]?.id
}
