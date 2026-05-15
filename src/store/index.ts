import { create } from 'zustand'
import { CartItem, Product, Transaction } from '../types'

const TAX = 0.075

export const useCartStore = create<{
  items: CartItem[]
  add: (item: CartItem) => void
  remove: (id: string) => void
  update: (id: string, qty: number) => void
  clear: () => void
  total: () => number
}>((set, get) => ({
  items: [],
  add: (item) => set(s => {
    const e = s.items.find(i => i.productId === item.productId)
    return {
      items: e ? s.items.map(i => i.productId === item.productId ? { ...i, quantity: i.quantity + 1 } : i) : [...s.items, { ...item, quantity: 1 }]
    }
  }),
  remove: (id) => set(s => ({ items: s.items.filter(i => i.productId !== id) })),
  update: (id, qty) => set(s => ({ items: qty > 0 ? s.items.map(i => i.productId === id ? { ...i, quantity: qty } : i) : s.items.filter(i => i.productId !== id) })),
  clear: () => set({ items: [] }),
  total: () => get().items.reduce((s, i) => s + (i.price * i.quantity), 0)
}))

let productsCache: Product[] = []
let cacheLoaded = false

export const useProductStore = create<{
  products: Product[]
  loadProducts: () => Promise<void>
  findByBarcode: (barcode: string) => Product | undefined
  add: (p: Product) => void
  update: (id: string, p: Partial<Product>) => void
  delete: (id: string) => void
}>((set, get) => ({
  products: [],
  loadProducts: async () => {
    if (cacheLoaded) return
    try {
      const res = await fetch('/products.json')
      const data = await res.json()
      productsCache = data
      cacheLoaded = true
      set({ products: data })
    } catch (err) {
      console.error('Failed to load products:', err)
      productsCache = [
        { id: '1', name: 'DKNY Bra', sku: '0001', barcode: '0001', price: 10, stock: 25, createdAt: new Date().toISOString() },
        { id: '2', name: 'Short', sku: '0002', barcode: '0002', price: 10, stock: 18, createdAt: new Date().toISOString() },
        { id: '3', name: 'Swimsuit', sku: '0003', barcode: '0003', price: 10, stock: 12, createdAt: new Date().toISOString() }
      ]
      set({ products: productsCache })
    }
  },
  findByBarcode: (barcode: string) => get().products.find(p => p.barcode === barcode),
  add: (p) => set(s => ({ products: [...s.products, p] })),
  update: (id, p) => set(s => ({ products: s.products.map(x => x.id === id ? { ...x, ...p } : x) })),
  delete: (id) => set(s => ({ products: s.products.filter(x => x.id !== id) }))
}))

export const useTransactionStore = create<{
  transactions: Transaction[]
  add: (t: Transaction) => void
  today: () => Transaction[]
}>((set, get) => ({
  transactions: [],
  add: (t) => set(s => ({ transactions: [...s.transactions, t] })),
  today: () => {
    const now = new Date().toLocaleDateString()
    return get().transactions.filter(t => t.date === now)
  }
}))
