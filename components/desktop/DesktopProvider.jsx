"use client"
import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { storageAPI, PRESET_CATEGORIES_VERSION } from '@/lib/storage'
import { buildDefaultCategories, getDefaultExpenseCategoryId } from '@/lib/presetCategories'

const DesktopContext = createContext()

const DEFAULT_ACCOUNTS = [
  { id: 'acc1', name: 'Cash', balance: 500.00, type: 'asset', category: 'Cash', color: '#009E9E' },
  { id: 'acc2', name: 'Bank Account', balance: 3500.00, type: 'asset', category: 'Checking', color: '#E6923F' },
  { id: 'acc3', name: 'Credit Card', balance: -298.92, type: 'liability', category: 'Credit Card', color: '#F14C4C' }
]

const DEFAULT_CATEGORIES = buildDefaultCategories()

const DEFAULT_TAGS = [
  { id: 'tag1', name: 'Vacation 2026' },
  { id: 'tag2', name: 'Business Trip' },
  { id: 'tag3', name: 'Tax Deductible' }
]

const DEFAULT_TRANSACTIONS = [
  {
    id: 'tx1',
    type: 'expense',
    amount: 45.00,
    accountId: 'acc2',
    categoryId: getDefaultExpenseCategoryId(DEFAULT_CATEGORIES),
    date: new Date().toISOString(),
    note: 'Lunch',
    tagIds: []
  }
]

function applyBalanceChange(accounts, accountId, delta) {
  return accounts.map(acc =>
    acc.id === accountId ? { ...acc, balance: acc.balance + delta } : acc
  )
}

export function DesktopProvider({ children }) {
  const [isBalanceVisible, setIsBalanceVisible] = useState(true)
  const [accounts, setAccounts] = useState([])
  const [categories, setCategories] = useState([])
  const [tags, setTags] = useState([])
  const [transactions, setTransactions] = useState([])
  const [templates, setTemplates] = useState([])
  const [scheduled, setScheduled] = useState([])
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    setAccounts(storageAPI.accounts.getAll() || DEFAULT_ACCOUNTS)

    const savedCategories = storageAPI.categories.getAll()
    const categoriesVersion = storageAPI.categories.getVersion()
    const categoriesMigrated = !savedCategories || categoriesVersion < PRESET_CATEGORIES_VERSION

    if (categoriesMigrated) {
      setCategories(DEFAULT_CATEGORIES)
      storageAPI.categories.saveAll(DEFAULT_CATEGORIES)
      storageAPI.categories.saveVersion(PRESET_CATEGORIES_VERSION)
    } else {
      setCategories(savedCategories)
    }

    const savedTx = storageAPI.transactions.getAll()
    const activeCategories = categoriesMigrated ? DEFAULT_CATEGORIES : (savedCategories || DEFAULT_CATEGORIES)
    const validCategoryIds = new Set(activeCategories.map(c => c.id))
    const defaultExpenseId = getDefaultExpenseCategoryId(activeCategories)

    if (savedTx?.length) {
      setTransactions(
        savedTx.map(tx => ({
          ...tx,
          categoryId: validCategoryIds.has(tx.categoryId) ? tx.categoryId : defaultExpenseId,
        }))
      )
    } else {
      setTransactions(DEFAULT_TRANSACTIONS)
    }

    setTags(storageAPI.tags.getAll() || DEFAULT_TAGS)
    setTemplates(storageAPI.templates.getAll() || [])
    
    let loadedScheduled = storageAPI.scheduled.getAll() || []
    


    setScheduled(loadedScheduled)

    const savedVisibility = storageAPI.preferences.getBalanceVisible()
    if (savedVisibility !== null) setIsBalanceVisible(savedVisibility)
    setIsLoaded(true)
  }, [])

  // ── Auto-process scheduled transactions ─────────────────────────────────────
  useEffect(() => {
    if (!isLoaded || scheduled.length === 0) return

    const now = new Date()
    let changesMade = false
    let currentTxs = [...transactions]
    let currentAccs = [...accounts]
    let currentScheds = [...scheduled]

    for (let i = 0; i < currentScheds.length; i++) {
      let sched = currentScheds[i]
      if (!sched.nextRun || !sched.isActive) continue

      let nextRunDate = new Date(sched.nextRun)
      
      // Process while nextRun is in the past or present
      while (nextRunDate <= now) {
        changesMade = true
        
        // 1. Create transaction
        const newTx = {
          id: 'tx_sch_' + Date.now() + Math.random().toString(36).substring(2, 9),
          type: sched.type,
          amount: sched.amount,
          accountId: sched.accountId,
          targetAccountId: sched.targetAccountId,
          categoryId: sched.categoryId,
          date: nextRunDate.toISOString(),
          note: sched.note || `Auto-scheduled: ${sched.name}`,
          tagIds: sched.tagIds || []
        }
        currentTxs = [newTx, ...currentTxs]

        // 2. Update account balances
        if (newTx.type === 'transfer' && newTx.targetAccountId) {
          currentAccs = applyBalanceChange(
            applyBalanceChange(currentAccs, newTx.accountId, -newTx.amount),
            newTx.targetAccountId,
            newTx.amount
          )
        } else {
          const change = newTx.type === 'expense' ? -newTx.amount : newTx.amount
          currentAccs = applyBalanceChange(currentAccs, newTx.accountId, change)
        }

        // 3. Advance nextRunDate
        if (sched.frequency === 'daily') nextRunDate.setDate(nextRunDate.getDate() + 1)
        else if (sched.frequency === 'weekly') nextRunDate.setDate(nextRunDate.getDate() + 7)
        else if (sched.frequency === 'monthly') nextRunDate.setMonth(nextRunDate.getMonth() + 1)
        else if (sched.frequency === 'yearly') nextRunDate.setFullYear(nextRunDate.getFullYear() + 1)
        else break // Fallback to prevent infinite loop
      }

      if (changesMade) {
        currentScheds[i] = { ...sched, nextRun: nextRunDate.toISOString() }
      }
    }

    if (changesMade) {
      setTransactions(currentTxs)
      setAccounts(currentAccs)
      setScheduled(currentScheds)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoaded])

  useEffect(() => {
    if (!isLoaded) return
    storageAPI.accounts.saveAll(accounts)
    storageAPI.categories.saveAll(categories)
    storageAPI.tags.saveAll(tags)
    storageAPI.transactions.saveAll(transactions)
    storageAPI.templates.saveAll(templates)
    storageAPI.scheduled.saveAll(scheduled)
    storageAPI.preferences.saveBalanceVisible(isBalanceVisible)
  }, [accounts, categories, tags, transactions, templates, scheduled, isBalanceVisible, isLoaded])

  // ── Accounts ──────────────────────────────────────────────────────────────
  const addAccount = useCallback((account) => {
    const newAcc = { ...account, id: 'acc' + Date.now(), balance: parseFloat(account.balance) || 0 }
    setAccounts(prev => [...prev, newAcc])
  }, [])

  const updateAccount = useCallback((id, updates) => {
    setAccounts(prev =>
      prev.map(acc => acc.id === id ? { ...acc, ...updates, balance: parseFloat(updates.balance ?? acc.balance) || 0 } : acc)
    )
  }, [])

  const deleteAccount = useCallback((id) => {
    setAccounts(prev => prev.filter(a => a.id !== id))
    setTransactions(prev => prev.filter(t => t.accountId !== id && t.targetAccountId !== id))
  }, [])

  // ── Categories ────────────────────────────────────────────────────────────
  const addCategory = useCallback((category) => {
    setCategories(prev => [...prev, { ...category, id: 'cat' + Date.now(), parentId: category.parentId || null }])
  }, [])

  const updateCategory = useCallback((id, updates) => {
    setCategories(prev =>
      prev.map(c => c.id === id ? { ...c, ...updates } : c)
    )
  }, [])

  const deleteCategory = useCallback((id) => {
    setCategories(prev => prev.filter(c => c.id !== id && c.parentId !== id))
    setTransactions(prev => prev.filter(t => t.categoryId !== id))
  }, [])

  // ── Tags ──────────────────────────────────────────────────────────────────
  const addTag = useCallback((name, color) => {
    setTags(prev => [...prev, { id: 'tag' + Date.now(), name, color: color || '#E6923F' }])
  }, [])

  const updateTag = useCallback((id, name, color) => {
    setTags(prev => prev.map(t => t.id === id ? { ...t, name, ...(color ? { color } : {}) } : t))
  }, [])

  const deleteTag = useCallback((id) => {
    setTags(prev => prev.filter(t => t.id !== id))
    setTransactions(prev => prev.map(tx => ({
      ...tx,
      tagIds: (tx.tagIds || []).filter(tid => tid !== id)
    })))
  }, [])

  // ── Transactions ──────────────────────────────────────────────────────────
  const addTransaction = useCallback((tx) => {
    const newTx = { ...tx, id: 'tx' + Date.now(), tagIds: tx.tagIds || [] }
    setTransactions(prev => [newTx, ...prev])

    if (tx.type === 'transfer' && tx.targetAccountId) {
      setAccounts(prev =>
        applyBalanceChange(
          applyBalanceChange(prev, tx.accountId, -tx.amount),
          tx.targetAccountId,
          tx.amount
        )
      )
      return
    }

    const change = tx.type === 'expense' ? -tx.amount : tx.amount
    setAccounts(prev => applyBalanceChange(prev, tx.accountId, change))
  }, [])

  const updateTransaction = useCallback((id, updates) => {
    setTransactions(prev => {
      const oldTx = prev.find(t => t.id === id)
      if (!oldTx) return prev

      // Revert old balance effect
      setAccounts(accs => {
        let reverted = accs
        if (oldTx.type === 'transfer' && oldTx.targetAccountId) {
          reverted = applyBalanceChange(applyBalanceChange(reverted, oldTx.accountId, oldTx.amount), oldTx.targetAccountId, -oldTx.amount)
        } else {
          const revert = oldTx.type === 'expense' ? oldTx.amount : -oldTx.amount
          reverted = applyBalanceChange(reverted, oldTx.accountId, revert)
        }

        // Apply new balance effect
        const newTx = { ...oldTx, ...updates, amount: parseFloat(updates.amount ?? oldTx.amount) }
        if (newTx.type === 'transfer' && newTx.targetAccountId) {
          return applyBalanceChange(applyBalanceChange(reverted, newTx.accountId, -newTx.amount), newTx.targetAccountId, newTx.amount)
        }
        const change = newTx.type === 'expense' ? -newTx.amount : newTx.amount
        return applyBalanceChange(reverted, newTx.accountId, change)
      })

      return prev.map(t => t.id === id
        ? { ...t, ...updates, amount: parseFloat(updates.amount ?? t.amount) }
        : t
      )
    })
  }, [])

  const deleteTransaction = useCallback((id) => {
    setTransactions(prev => {
      const tx = prev.find(t => t.id === id)
      if (!tx) return prev

      if (tx.type === 'transfer' && tx.targetAccountId) {
        setAccounts(accs =>
          applyBalanceChange(
            applyBalanceChange(accs, tx.accountId, tx.amount),
            tx.targetAccountId,
            -tx.amount
          )
        )
      } else {
        const change = tx.type === 'expense' ? tx.amount : -tx.amount
        setAccounts(accs => applyBalanceChange(accs, tx.accountId, change))
      }

      return prev.filter(t => t.id !== id)
    })
  }, [])

  const getTotalsForRange = useCallback((start, end) => {
    const filtered = transactions.filter(t => {
      const d = new Date(t.date)
      return d >= start && d <= end && t.type !== 'transfer'
    })
    const income = filtered.filter(t => t.type === 'income').reduce((s, t) => s + t.amount, 0)
    const expense = filtered.filter(t => t.type === 'expense').reduce((s, t) => s + t.amount, 0)
    return { income, expense }
  }, [transactions])

  // ── Templates ─────────────────────────────────────────────────────────────
  const addTemplate = useCallback((template) => {
    setTemplates(prev => [...prev, { ...template, id: 'tpl' + Date.now() }])
  }, [])

  const updateTemplate = useCallback((id, updates) => {
    setTemplates(prev => prev.map(t => t.id === id ? { ...t, ...updates } : t))
  }, [])

  const deleteTemplate = useCallback((id) => {
    setTemplates(prev => prev.filter(t => t.id !== id))
  }, [])

  // ── Scheduled ─────────────────────────────────────────────────────────────
  const addScheduled = useCallback((item) => {
    setScheduled(prev => [...prev, { ...item, id: 'sch' + Date.now() }])
  }, [])

  const updateScheduled = useCallback((id, updates) => {
    setScheduled(prev => prev.map(s => s.id === id ? { ...s, ...updates } : s))
  }, [])

  const deleteScheduled = useCallback((id) => {
    setScheduled(prev => prev.filter(s => s.id !== id))
  }, [])

  return (
    <DesktopContext.Provider value={{
      isBalanceVisible, setIsBalanceVisible,
      accounts, setAccounts, addAccount, updateAccount, deleteAccount,
      categories, addCategory, updateCategory, deleteCategory,
      tags, addTag, updateTag, deleteTag,
      transactions, addTransaction, updateTransaction, deleteTransaction,
      templates, addTemplate, updateTemplate, deleteTemplate,
      scheduled, addScheduled, updateScheduled, deleteScheduled,
      getTotalsForRange,
      isLoaded
    }}>
      {children}
    </DesktopContext.Provider>
  )
}

export function useDesktop() {
  return useContext(DesktopContext)
}
