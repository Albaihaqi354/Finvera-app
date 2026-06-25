/**
 * Preset transaction categories — shared by signup flow and desktop defaults.
 * Matches the "Preset Categories" step on /auth/signup.
 * Each group can have a `children` array for sub-categories.
 */

export const PRESET_INCOME_CATEGORIES = [
  {
    name: 'Occupational Earnings',
    icon: '💼',
    colorClass: 'text-[#D68E5A] bg-[#D68E5A]/10',
    children: [
      { name: 'Salary Income', icon: '💼', colorClass: 'text-[#D68E5A] bg-[#D68E5A]/10' },
      { name: 'Bonus Income', icon: '🏆', colorClass: 'text-[#D68E5A] bg-[#D68E5A]/10' },
      { name: 'Overtime Pay', icon: '⏰', colorClass: 'text-[#D68E5A] bg-[#D68E5A]/10' },
      { name: 'Side Job Income', icon: '🔧', colorClass: 'text-[#D68E5A] bg-[#D68E5A]/10' },
      { name: 'Commission Income', icon: '📊', colorClass: 'text-[#D68E5A] bg-[#D68E5A]/10' },
    ],
  },
  {
    name: 'Finance & Investment',
    icon: '📈',
    colorClass: 'text-[#D68E5A] bg-[#D68E5A]/10',
    children: [
      { name: 'Interest Income', icon: '💹', colorClass: 'text-[#D68E5A] bg-[#D68E5A]/10' },
      { name: 'Dividend Income', icon: '📈', colorClass: 'text-[#D68E5A] bg-[#D68E5A]/10' },
      { name: 'Capital Gains', icon: '💰', colorClass: 'text-[#D68E5A] bg-[#D68E5A]/10' },
      { name: 'Rental Income', icon: '🏘️', colorClass: 'text-[#D68E5A] bg-[#D68E5A]/10' },
    ],
  },
  {
    name: 'Miscellaneous',
    icon: '📝',
    colorClass: 'text-[#D68E5A] bg-[#D68E5A]/10',
    children: [
      { name: 'Gift Received', icon: '🎁', colorClass: 'text-[#D68E5A] bg-[#D68E5A]/10' },
      { name: 'Lottery/Prize', icon: '🎰', colorClass: 'text-[#D68E5A] bg-[#D68E5A]/10' },
      { name: 'Refund', icon: '↩️', colorClass: 'text-[#D68E5A] bg-[#D68E5A]/10' },
      { name: 'Other Income', icon: '📝', colorClass: 'text-[#D68E5A] bg-[#D68E5A]/10' },
    ],
  },
]

export const PRESET_EXPENSE_CATEGORIES = [
  {
    name: 'Food & Drink',
    icon: '🍔',
    colorClass: 'text-orange-500 bg-orange-50',
    children: [
      { name: 'Restaurant/Dining', icon: '🍽️', colorClass: 'text-orange-500 bg-orange-50' },
      { name: 'Groceries', icon: '🛒', colorClass: 'text-orange-500 bg-orange-50' },
      { name: 'Coffee/Tea', icon: '☕', colorClass: 'text-orange-500 bg-orange-50' },
      { name: 'Beverages', icon: '🥤', colorClass: 'text-orange-500 bg-orange-50' },
      { name: 'Snacks', icon: '🍿', colorClass: 'text-orange-500 bg-orange-50' },
    ],
  },
  {
    name: 'Clothing & Appearance',
    icon: '👔',
    colorClass: 'text-purple-500 bg-purple-50',
    children: [
      { name: 'Clothing', icon: '👗', colorClass: 'text-purple-500 bg-purple-50' },
      { name: 'Shoes', icon: '👟', colorClass: 'text-purple-500 bg-purple-50' },
      { name: 'Accessories', icon: '👜', colorClass: 'text-purple-500 bg-purple-50' },
      { name: 'Laundry', icon: '🧺', colorClass: 'text-purple-500 bg-purple-50' },
      { name: 'Cosmetics', icon: '💄', colorClass: 'text-purple-500 bg-purple-50' },
    ],
  },
  {
    name: 'Housing & Houseware',
    icon: '🏠',
    colorClass: 'text-gray-600 bg-gray-100',
    children: [
      { name: 'Rent', icon: '🏠', colorClass: 'text-gray-600 bg-gray-100' },
      { name: 'Mortgage', icon: '🏦', colorClass: 'text-gray-600 bg-gray-100' },
      { name: 'Utilities', icon: '💡', colorClass: 'text-gray-600 bg-gray-100' },
      { name: 'Furniture', icon: '🪑', colorClass: 'text-gray-600 bg-gray-100' },
      { name: 'Home Appliances', icon: '📺', colorClass: 'text-gray-600 bg-gray-100' },
      { name: 'Repairs', icon: '🔨', colorClass: 'text-gray-600 bg-gray-100' },
    ],
  },
  {
    name: 'Transportation',
    icon: '🚗',
    colorClass: 'text-teal-500 bg-teal-50',
    children: [
      { name: 'Fuel', icon: '⛽', colorClass: 'text-teal-500 bg-teal-50' },
      { name: 'Public Transit', icon: '🚌', colorClass: 'text-teal-500 bg-teal-50' },
      { name: 'Taxi/Ride-hailing', icon: '🚕', colorClass: 'text-teal-500 bg-teal-50' },
      { name: 'Vehicle Maintenance', icon: '🔧', colorClass: 'text-teal-500 bg-teal-50' },
      { name: 'Parking/Toll', icon: '🅿️', colorClass: 'text-teal-500 bg-teal-50' },
    ],
  },
  {
    name: 'Communication',
    icon: '📱',
    colorClass: 'text-blue-500 bg-blue-50',
    children: [
      { name: 'Mobile Plan', icon: '📱', colorClass: 'text-blue-500 bg-blue-50' },
      { name: 'Internet', icon: '🌐', colorClass: 'text-blue-500 bg-blue-50' },
      { name: 'Cable TV', icon: '📺', colorClass: 'text-blue-500 bg-blue-50' },
      { name: 'Postage', icon: '📮', colorClass: 'text-blue-500 bg-blue-50' },
    ],
  },
  {
    name: 'Entertainment',
    icon: '🎬',
    colorClass: 'text-rose-500 bg-rose-50',
    children: [
      { name: 'Movies/Theater', icon: '🎬', colorClass: 'text-rose-500 bg-rose-50' },
      { name: 'Music', icon: '🎵', colorClass: 'text-rose-500 bg-rose-50' },
      { name: 'Games', icon: '🎮', colorClass: 'text-rose-500 bg-rose-50' },
      { name: 'Sports', icon: '⚽', colorClass: 'text-rose-500 bg-rose-50' },
      { name: 'Travel/Vacation', icon: '✈️', colorClass: 'text-rose-500 bg-rose-50' },
      { name: 'Hobbies', icon: '🎨', colorClass: 'text-rose-500 bg-rose-50' },
    ],
  },
  {
    name: 'Education & Studying',
    icon: '📚',
    colorClass: 'text-lime-500 bg-lime-50',
    children: [
      { name: 'Tuition', icon: '🏫', colorClass: 'text-lime-500 bg-lime-50' },
      { name: 'Books', icon: '📖', colorClass: 'text-lime-500 bg-lime-50' },
      { name: 'Online Courses', icon: '💻', colorClass: 'text-lime-500 bg-lime-50' },
      { name: 'Stationery', icon: '✏️', colorClass: 'text-lime-500 bg-lime-50' },
    ],
  },
  {
    name: 'Gifts & Donations',
    icon: '🎁',
    colorClass: 'text-green-500 bg-green-50',
    children: [
      { name: 'Gifts', icon: '🎁', colorClass: 'text-green-500 bg-green-50' },
      { name: 'Charity', icon: '❤️', colorClass: 'text-green-500 bg-green-50' },
      { name: 'Church/Religious', icon: '⛪', colorClass: 'text-green-500 bg-green-50' },
    ],
  },
  {
    name: 'Medical & Healthcare',
    icon: '🏥',
    colorClass: 'text-red-500 bg-red-50',
    children: [
      { name: 'Doctor Visit', icon: '🩺', colorClass: 'text-red-500 bg-red-50' },
      { name: 'Medicine', icon: '💊', colorClass: 'text-red-500 bg-red-50' },
      { name: 'Dental', icon: '🦷', colorClass: 'text-red-500 bg-red-50' },
      { name: 'Vision', icon: '👓', colorClass: 'text-red-500 bg-red-50' },
      { name: 'Insurance Premium', icon: '🛡️', colorClass: 'text-red-500 bg-red-50' },
    ],
  },
  {
    name: 'Finance & Insurance',
    icon: '💳',
    colorClass: 'text-amber-500 bg-amber-50',
    children: [
      { name: 'Bank Fees', icon: '🏦', colorClass: 'text-amber-500 bg-amber-50' },
      { name: 'Interest Payment', icon: '💸', colorClass: 'text-amber-500 bg-amber-50' },
      { name: 'Investment Fees', icon: '📊', colorClass: 'text-amber-500 bg-amber-50' },
      { name: 'Life Insurance', icon: '🛡️', colorClass: 'text-amber-500 bg-amber-50' },
    ],
  },
  {
    name: 'Miscellaneous',
    icon: '📌',
    colorClass: 'text-gray-500 bg-gray-50',
    children: [
      { name: 'Other Expenses', icon: '📌', colorClass: 'text-gray-500 bg-gray-50' },
    ],
  },
]

export const PRESET_TRANSFER_CATEGORIES = [
  {
    name: 'General Transfer',
    icon: '🔄',
    colorClass: 'text-orange-500 bg-orange-50',
    children: [
      { name: 'Bank Transfer', icon: '🏦', colorClass: 'text-orange-500 bg-orange-50' },
      { name: 'Savings Deposit', icon: '💰', colorClass: 'text-orange-500 bg-orange-50' },
      { name: 'Savings Withdrawal', icon: '💵', colorClass: 'text-orange-500 bg-orange-50' },
    ],
  },
  {
    name: 'Loan & Debt',
    icon: '📄',
    colorClass: 'text-amber-500 bg-amber-50',
    children: [
      { name: 'Loan Payment', icon: '📄', colorClass: 'text-amber-500 bg-amber-50' },
      { name: 'Credit Card Payment', icon: '💳', colorClass: 'text-amber-500 bg-amber-50' },
      { name: 'Borrow Money', icon: '🤝', colorClass: 'text-amber-500 bg-amber-50' },
    ],
  },
  {
    name: 'Miscellaneous',
    icon: '📌',
    colorClass: 'text-gray-500 bg-gray-50',
    children: [
      { name: 'Other Transfer', icon: '📌', colorClass: 'text-gray-500 bg-gray-50' },
    ],
  },
]

/** Flat list for DesktopProvider / storage (id, type, parentId) */
export function buildDefaultCategories() {
  const result = []

  const allGroups = [
    ...PRESET_INCOME_CATEGORIES.map((g, i) => ({ ...g, type: 'income', id: `inc_${i + 1}` })),
    ...PRESET_EXPENSE_CATEGORIES.map((g, i) => ({ ...g, type: 'expense', id: `exp_${i + 1}` })),
    ...PRESET_TRANSFER_CATEGORIES.map((g, i) => ({ ...g, type: 'transfer', id: `trf_${i + 1}` })),
  ]

  allGroups.forEach((group) => {
    result.push({
      id: group.id,
      name: group.name,
      type: group.type,
      icon: group.icon,
      colorClass: group.colorClass,
      parentId: null,
    })
    if (group.children) {
      group.children.forEach((child, j) => {
        result.push({
          id: `${group.id}_sub_${j + 1}`,
          name: child.name,
          type: group.type,
          icon: child.icon,
          colorClass: child.colorClass,
          parentId: group.id,
        })
      })
    }
  })

  return result
}

/** First expense category id — for sample default transaction */
export function getDefaultExpenseCategoryId(categories) {
  return categories.find(c => c.type === 'expense')?.id || categories[0]?.id
}
