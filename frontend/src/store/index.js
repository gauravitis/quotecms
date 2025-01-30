import create from 'zustand'
import { devtools } from 'zustand/middleware'

// Create API slice
const createApiSlice = (set) => ({
  loading: false,
  error: null,
  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error }),
  clearError: () => set({ error: null }),
})

// Create companies slice
const createCompaniesSlice = (set, get) => ({
  companies: [],
  setCompanies: (companies) => set({ companies }),
  fetchCompanies: async () => {
    const { setLoading, setError } = get()
    try {
      setLoading(true)
      const response = await fetch('http://localhost:5000/api/companies')
      const data = await response.json()
      if (data.success) {
        set({ companies: data.data })
      } else {
        throw new Error(data.error || 'Failed to fetch companies')
      }
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  },
  addCompany: async (companyData) => {
    const { setLoading, setError, fetchCompanies } = get()
    try {
      setLoading(true)
      const response = await fetch('http://localhost:5000/api/companies', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(companyData),
      })
      const data = await response.json()
      if (data.success) {
        await fetchCompanies()
      } else {
        throw new Error(data.error || 'Failed to add company')
      }
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  },
  updateCompany: async (companyId, companyData) => {
    const { setLoading, setError, fetchCompanies } = get()
    try {
      setLoading(true)
      const response = await fetch(`http://localhost:5000/api/companies/${companyId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(companyData),
      })
      const data = await response.json()
      if (data.success) {
        await fetchCompanies()
      } else {
        throw new Error(data.error || 'Failed to update company')
      }
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  },
  deleteCompany: async (companyId) => {
    const { setLoading, setError, fetchCompanies } = get()
    try {
      setLoading(true)
      const response = await fetch(`http://localhost:5000/api/companies/${companyId}`, {
        method: 'DELETE',
      })
      const data = await response.json()
      if (data.success) {
        await fetchCompanies()
      } else {
        throw new Error(data.error || 'Failed to delete company')
      }
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  },
})

// Create quotations slice
const createQuotationsSlice = (set, get) => ({
  quotations: [],
  setQuotations: (quotations) => set({ quotations }),
  fetchQuotations: async () => {
    const { setLoading, setError } = get()
    try {
      setLoading(true)
      const response = await fetch('http://localhost:5000/api/quotations')
      const data = await response.json()
      if (data.success) {
        set({ quotations: data.data })
      } else {
        throw new Error(data.error || 'Failed to fetch quotations')
      }
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  },
  deleteQuotation: async (quotationId) => {
    const { setLoading, setError, fetchQuotations } = get()
    try {
      setLoading(true)
      const response = await fetch(`http://localhost:5000/api/quotations/${quotationId}`, {
        method: 'DELETE',
      })
      const data = await response.json()
      if (data.success) {
        await fetchQuotations()
      } else {
        throw new Error(data.error || 'Failed to delete quotation')
      }
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  },
})

// Create the store
const useStore = create(
  devtools((set, get) => ({
    ...createApiSlice(set),
    ...createCompaniesSlice(set, get),
    ...createQuotationsSlice(set, get),
  }))
)

export default useStore 