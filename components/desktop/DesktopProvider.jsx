"use client"
import { createContext, useContext, useState, useEffect, useCallback } from 'react'

const DesktopContext = createContext()

const DEFAULT_ACCOUNTS = [
  { id: 'acc1', name: 'Cash', balance: 500.00, type: 'asset', category: 'Cash', color: '#009E9E' },
  { id: 'acc2', name: 'Bank Account', balance: 3500.00, type: 'asset', category: 'Checking', color: '#E6923F' },
  { id: 'acc3', name: 'Credit Card', balance: -298.92, type: 'liability', category: 'Credit Card', color: '#F14C4C' }
]

const DEFAULT_CATEGORIES = [
  { id: 'cat1', name: 'Food & Dining', type: 'expense', icon: '🍔', parentId: null },
  { id: 'cat1a', name: 'Groceries', type: 'expense', icon: '🛒', parentId: 'cat1' },
  { id: 'cat2', name: 'Transportation', type: 'expense', icon: '🚗', parentId: null },
  { id: 'cat3', name: 'Salary', type: 'income', icon: '💰', parentId: null },
  { id: 'cat4', name: 'Shopping', type: 'expense', icon: '🛍️', parentId: null },
  { id: 'cat5', name: 'Internal Transfer', type: 'transfer', icon: '🔄', parentId: null }
]

const DEFAULT_TAGS = [
  { id: 'tag1', name: 'Vacation 2026' },
  { id: 'tag2', name: 'Business Trip' },
  { id: 'tag3', name: 'Tax Deductible' }
]

const DEFAULT_TRANSACTIONS = [
  { id: 'tx1', type: 'expense', amount: 45.00, accountId: 'acc2', categoryId: 'cat1', date: new Date().toISOString(), note: 'Lunch', tagIds: [] }
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
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    setAccounts(JSON.parse(localStorage.getItem('finvera_accounts') || 'null') || DEFAULT_ACCOUNTS)
    setCategories(JSON.parse(localStorage.getItem('finvera_categories') || 'null') || DEFAULT_CATEGORIES)
    setTags(JSON.parse(localStorage.getItem('finvera_tags') || 'null') || DEFAULT_TAGS)
    setTransactions(JSON.parse(localStorage.getItem('finvera_transactions') || 'null') || DEFAULT_TRANSACTIONS)
    const savedVisibility = localStorage.getItem('finvera_balance_visible')
    if (savedVisibility !== null) setIsBalanceVisible(savedVisibility === 'true')
    setIsLoaded(true)
  }, [])

  useEffect(() => {
    if (!isLoaded) return
    localStorage.setItem('finvera_accounts', JSON.stringify(accounts))
    localStorage.setItem('finvera_categories', JSON.stringify(categories))
    localStorage.setItem('finvera_tags', JSON.stringify(tags))
    localStorage.setItem('finvera_transactions', JSON.stringify(transactions))
    localStorage.setItem('finvera_balance_visible', String(isBalanceVisible))
  }, [accounts, categories, tags, transactions, isBalanceVisible, isLoaded])

  const addAccount = useCallback((account) => {
    const newAcc = { ...account, id: 'acc' + Date.now(), balance: parseFloat(account.balance) || 0 }
    setAccounts(prev => [...prev, newAcc])
  }, [])

  const deleteAccount = useCallback((id) => {
    setAccounts(prev => prev.filter(a => a.id !== id))
    setTransactions(prev => prev.filter(t => t.accountId !== id && t.targetAccountId !== id))
  }, [])

  const addCategory = useCallback((category) => {
    setCategories(prev => [...prev, { ...category, id: 'cat' + Date.now(), parentId: category.parentId || null }])
  }, [])

  const deleteCategory = useCallback((id) => {
    setCategories(prev => prev.filter(c => c.id !== id && c.parentId !== id))
    setTransactions(prev => prev.filter(t => t.categoryId !== id))
  }, [])

  const addTag = useCallback((name) => {
    setTags(prev => [...prev, { id: 'tag' + Date.now(), name }])
  }, [])

  const deleteTag = useCallback((id) => {
    setTags(prev => prev.filter(t => t.id !== id))
    setTransactions(prev => prev.map(tx => ({
      ...tx,
      tagIds: (tx.tagIds || []).filter(tid => tid !== id)
    })))
  }, [])

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

  return (
    <DesktopContext.Provider value={{
      isBalanceVisible, setIsBalanceVisible,
      accounts, setAccounts, addAccount, deleteAccount,
      categories, addCategory, deleteCategory,
      tags, addTag, deleteTag,
      transactions, addTransaction, deleteTransaction,
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
