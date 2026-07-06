"use client"
import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { api } from '@/lib/api/client'
import { CURRENCIES } from '@/lib/currency'

const DesktopContext = createContext()

function applyBalanceChange(accounts, accountId, delta) {
  return accounts.map(acc =>
    acc.id === accountId ? { ...acc, balance: (parseFloat(acc.balance) || 0) + delta } : acc
  )
}

export function DesktopProvider({ children }) {
  const [isBalanceVisible, setIsBalanceVisible] = useState(true)
  const [currency, setCurrencyState] = useState('IDR')
  const [accounts, setAccounts] = useState([])
  const [categories, setCategories] = useState([])
  const [tags, setTags] = useState([])
  const [transactions, setTransactions] = useState([])
  const [templates, setTemplates] = useState([])
  const [scheduled, setScheduled] = useState([])
  const [isLoaded, setIsLoaded] = useState(false)

  // Fetch all initial data
  const loadData = useCallback(async () => {
    try {
      const [
        accountsData,
        categoriesData,
        tagsData,
        transactionsData,
        scheduledData
      ] = await Promise.all([
        api.accounts.getAll().catch(() => []),
        api.categories.getAll().catch(() => []),
        api.tags.getAll().catch(() => []),
        api.transactions.getAll().catch(() => ({ data: [] })),
        api.scheduled.getAll().catch(() => [])
      ])

      setAccounts(Array.isArray(accountsData) ? accountsData : (accountsData.data || []))
      setCategories(Array.isArray(categoriesData) ? categoriesData : (categoriesData.data || []))
      setTags(Array.isArray(tagsData) ? tagsData : (tagsData.data || []))
      
      const txs = Array.isArray(transactionsData) ? transactionsData : (transactionsData.data || []);
      const normalizedTxs = txs.map(tx => ({
        ...tx,
        accountId: tx.account?.id || tx.accountId,
        targetAccountId: tx.targetAccount?.id || tx.targetAccountId,
        categoryId: tx.category?.id || tx.categoryId,
        tagIds: tx.tags?.map(t => t.id) || tx.tagIds || []
      }))
      setTransactions(normalizedTxs)
      
      const rawScheduled = Array.isArray(scheduledData) ? scheduledData : (scheduledData.data || [])
      const normalizedScheduled = rawScheduled.map(s => ({
        ...s,
        accountId:       s.account?.id  || s.accountId,
        targetAccountId: s.targetAccount?.id || s.targetAccountId,
        categoryId:      s.category?.id || s.categoryId,
      }))
      setScheduled(normalizedScheduled)
      
      const savedVisibility = localStorage.getItem('finvera_balance_visible')
      if (savedVisibility !== null) setIsBalanceVisible(savedVisibility === 'true')

      const savedCurrency = localStorage.getItem('finvera_currency')
      if (savedCurrency && CURRENCIES.find(c => c.code === savedCurrency)) {
        setCurrencyState(savedCurrency)
      }
      
      setIsLoaded(true)
    } catch (err) {
      console.error('Failed to load data from API:', err)
      setIsLoaded(true)
    }
  }, [])

  useEffect(() => {
    loadData()
  }, [loadData])

  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem('finvera_balance_visible', String(isBalanceVisible))
    }
  }, [isBalanceVisible, isLoaded])


  // ── Accounts ──────────────────────────────────────────────────────────────
  const addAccount = useCallback(async (account) => {
    try {
      const res = await api.accounts.create(account)
      // res is the complete account object from backend
      setAccounts(prev => [...prev, res])
      return res
    } catch (err) {
      console.error(err)
      throw err
    }
  }, [])

  const updateAccount = useCallback(async (id, updates) => {
    try {
      await api.accounts.update(id, updates)
      setAccounts(prev =>
        prev.map(acc => acc.id === id ? { ...acc, ...updates } : acc)
      )
    } catch (err) {
      console.error(err)
      throw err
    }
  }, [])

  const deleteAccount = useCallback(async (id) => {
    try {
      await api.accounts.delete(id)
      setAccounts(prev => prev.filter(a => a.id !== id))
      setTransactions(prev => prev.filter(t => t.accountId !== id && t.targetAccountId !== id))
    } catch (err) {
      console.error(err)
      throw err
    }
  }, [])

  // ── Categories ────────────────────────────────────────────────────────────
  const addCategory = useCallback(async (category) => {
    try {
      const res = await api.categories.create({ ...category, parent_id: category.parentId || undefined })
      setCategories(prev => [...prev, { ...category, ...res }])
      return res
    } catch (err) {
      console.error(err)
      throw err
    }
  }, [])

  const updateCategory = useCallback(async (id, updates) => {
    try {
      await api.categories.update(id, { ...updates, parent_id: updates.parentId || undefined })
      setCategories(prev => prev.map(c => c.id === id ? { ...c, ...updates } : c))
    } catch (err) {
      console.error(err)
      throw err
    }
  }, [])

  const deleteCategory = useCallback(async (id) => {
    try {
      await api.categories.delete(id)
      setCategories(prev => prev.filter(c => c.id !== id && c.parentId !== id))
      setTransactions(prev => prev.filter(t => t.categoryId !== id))
    } catch (err) {
      console.error(err)
      throw err
    }
  }, [])

  // ── Tags ──────────────────────────────────────────────────────────────────
  const addTag = useCallback(async (name, color) => {
    try {
      const res = await api.tags.create({ name, color: color || '#E6923F' })
      setTags(prev => [...prev, res])
      return res
    } catch (err) {
      console.error(err)
      throw err
    }
  }, [])

  const updateTag = useCallback(async (id, name, color) => {
    try {
      await api.tags.update(id, { name, color })
      setTags(prev => prev.map(t => t.id === id ? { ...t, name, ...(color ? { color } : {}) } : t))
    } catch (err) {
      console.error(err)
      throw err
    }
  }, [])

  const deleteTag = useCallback(async (id) => {
    try {
      await api.tags.delete(id)
      setTags(prev => prev.filter(t => t.id !== id))
      setTransactions(prev => prev.map(tx => ({
        ...tx,
        tagIds: (tx.tagIds || []).filter(tid => tid !== id)
      })))
    } catch (err) {
      console.error(err)
      throw err
    }
  }, [])

  // ── Transactions ──────────────────────────────────────────────────────────
  const addTransaction = useCallback(async (tx) => {
    try {
      // Backend expects account_id, category_id, etc. 
      // The API wrapper or component might pass camelCase.
      const payload = {
        type: tx.type,
        amount: parseFloat(tx.amount),
        account_id: tx.accountId || tx.account_id,
        target_account_id: tx.targetAccountId || tx.target_account_id,
        category_id: tx.categoryId || tx.category_id,
        date: tx.date,
        note: tx.note,
        tag_ids: tx.tagIds || tx.tag_ids || []
      }
      const res = await api.transactions.create(payload)
      const newTx = {
        ...res,
        accountId: res.account?.id || res.accountId,
        targetAccountId: res.targetAccount?.id || res.targetAccountId,
        categoryId: res.category?.id || res.categoryId,
        tagIds: res.tags?.map(t => t.id) || res.tagIds || []
      }
      setTransactions(prev => [newTx, ...prev])

      // Re-fetch accounts to get updated balances from server
      const accountsData = await api.accounts.getAll()
      setAccounts(Array.isArray(accountsData) ? accountsData : (accountsData.data || []))
      return newTx
    } catch (err) {
      console.error(err)
      throw err
    }
  }, [])

  const updateTransaction = useCallback(async (id, updates) => {
    try {
      const payload = {
        type: updates.type,
        amount: parseFloat(updates.amount),
        account_id: updates.accountId || updates.account_id,
        target_account_id: updates.targetAccountId || updates.target_account_id,
        category_id: updates.categoryId || updates.category_id,
        date: updates.date,
        note: updates.note,
        tag_ids: updates.tagIds || updates.tag_ids || []
      }
      const res = await api.transactions.update(id, payload)
      
      const newTx = {
        ...res,
        accountId: res.account?.id || res.accountId,
        targetAccountId: res.targetAccount?.id || res.targetAccountId,
        categoryId: res.category?.id || res.categoryId,
        tagIds: res.tags?.map(t => t.id) || res.tagIds || []
      }
      setTransactions(prev => prev.map(t => t.id === id ? newTx : t))
      
      // Re-fetch accounts to get updated balances from server
      const accountsData = await api.accounts.getAll()
      setAccounts(Array.isArray(accountsData) ? accountsData : (accountsData.data || []))
    } catch (err) {
      console.error(err)
      throw err
    }
  }, [])

  const deleteTransaction = useCallback(async (id) => {
    try {
      await api.transactions.delete(id)
      setTransactions(prev => prev.filter(t => t.id !== id))
      
      // Re-fetch accounts to get updated balances from server
      const accountsData = await api.accounts.getAll()
      setAccounts(Array.isArray(accountsData) ? accountsData : (accountsData.data || []))
    } catch (err) {
      console.error(err)
      throw err
    }
  }, [])

  const getTotalsForRange = useCallback((start, end) => {
    const filtered = transactions.filter(t => {
      const d = new Date(t.date)
      return d >= start && d <= end && t.type !== 'transfer'
    })
    const income = filtered.filter(t => t.type === 'income').reduce((s, t) => s + parseFloat(t.amount), 0)
    const expense = filtered.filter(t => t.type === 'expense').reduce((s, t) => s + parseFloat(t.amount), 0)
    return { income, expense }
  }, [transactions])

  // ── Templates (Mocked for now as backend doesn't have it fully yet) ─────────
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
  const addScheduled = useCallback(async (item) => {
    try {
      // Backend expects camelCase JSON fields matching CreateScheduledRequest struct tags
      const payload = {
        name:            item.name,
        type:            item.type,
        amount:          parseFloat(item.amount),
        accountId:       item.accountId,
        targetAccountId: item.targetAccountId || undefined,
        categoryId:      item.categoryId,
        frequency:       item.frequency,
        nextRun:         item.nextRun,
        note:            item.note || '',
        isActive:        item.isActive ?? true,
      }
      const res = await api.scheduled.create(payload)
      // Normalize nested objects from backend response
      const normalized = {
        ...res,
        accountId:       res.account?.id  || res.accountId,
        targetAccountId: res.targetAccount?.id || res.targetAccountId,
        categoryId:      res.category?.id || res.categoryId,
      }
      setScheduled(prev => [...prev, normalized])
      return normalized
    } catch (err) {
      console.error(err)
      throw err
    }
  }, [])

  const updateScheduled = useCallback(async (id, updates) => {
    try {
      // For toggleActive, updates may only contain isActive.
      // We need the full current item to build a valid payload.
      const current = scheduled.find(s => s.id === id)
      if (!current) throw new Error('Scheduled transaction not found')

      const merged = { ...current, ...updates }

      const payload = {
        name:            merged.name,
        type:            merged.type,
        amount:          parseFloat(merged.amount),
        accountId:       merged.accountId,
        targetAccountId: merged.targetAccountId || undefined,
        categoryId:      merged.categoryId,
        frequency:       merged.frequency,
        nextRun:         merged.nextRun,
        note:            merged.note || '',
        isActive:        merged.isActive ?? true,
      }
      await api.scheduled.update(id, payload)
      setScheduled(prev => prev.map(s => s.id === id ? { ...s, ...updates } : s))
    } catch (err) {
      console.error(err)
      throw err
    }
  }, [scheduled])

  const deleteScheduled = useCallback(async (id) => {
    try {
      await api.scheduled.delete(id)
      setScheduled(prev => prev.filter(s => s.id !== id))
    } catch (err) {
      console.error(err)
      throw err
    }
  }, [])

  const setCurrency = useCallback((code) => {
    if (!CURRENCIES.find(c => c.code === code)) return
    setCurrencyState(code)
    if (typeof window !== 'undefined') {
      localStorage.setItem('finvera_currency', code)
    }
  }, [])

  return (
    <DesktopContext.Provider value={{
      isBalanceVisible, setIsBalanceVisible,
      currency, setCurrency,
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
