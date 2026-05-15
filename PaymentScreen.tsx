import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { Product, CartItem, Transaction, PaymentMethod, Screen } from '../types'

interface StoreState {
  // Navigation
  currentScreen: Screen
  setScreen: (screen: Screen) => void

  // Products
  products: Product[]
  addProduct: (product: Product) => void
  updateProduct: (id: string, product: Partial<Product>) => void
  deleteProduct: (id: string) => void

  // Cart
  cart: CartItem[]
  addToCart: (product: Product) => void
  removeFromCart: (id: string) => void
  updateQuantity: (id: string, quantity: number) => void
  clearCart: () => void

  // Transactions
  transactions: Transaction[]
  addTransaction: (transaction: Transaction) => void

  // Computed
  cartTotal: () => number
  cartCount: () => number
}

const SAMPLE_PRODUCTS: Product[] = [
  { id: '1', name: 'Producto Demo 1', price: 9.99, barcode: '123456', category: 'General', stock: 50 },
  { id: '2', name: 'Producto Demo 2', price: 24.99, barcode: '234567', category: 'General', stock: 30 },
  { id: '3', name: 'Producto Demo 3', price: 4.99, barcode: '345678', category: 'General', stock: 100 },
  { id: '4', name: 'Producto Demo 4', price: 14.99, barcode: '456789', category: 'General', stock: 20 },
]

export const useStore = create<StoreState>()(
  persist(
    (set, get) => ({
      currentScreen: 'home',
      setScreen: (screen) => set({ currentScreen: screen }),

      products: SAMPLE_PRODUCTS,
      addProduct: (product) =>
        set((s) => ({ products: [...s.products, product] })),
      updateProduct: (id, updated) =>
        set((s) => ({
          products: s.products.map((p) => (p.id === id ? { ...p, ...updated } : p))
        })),
      deleteProduct: (id) =>
        set((s) => ({ products: s.products.filter((p) => p.id !== id) })),

      cart: [],
      addToCart: (product) =>
        set((s) => {
          const existing = s.cart.find((i) => i.id === product.id)
          if (existing) {
            return {
              cart: s.cart.map((i) =>
                i.id === product.id ? { ...i, quantity: i.quantity + 1 } : i
              )
            }
          }
          return { cart: [...s.cart, { ...product, quantity: 1 }] }
        }),
      removeFromCart: (id) =>
        set((s) => ({ cart: s.cart.filter((i) => i.id !== id) })),
      updateQuantity: (id, quantity) =>
        set((s) => ({
          cart: quantity <= 0
            ? s.cart.filter((i) => i.id !== id)
            : s.cart.map((i) => (i.id === id ? { ...i, quantity } : i))
        })),
      clearCart: () => set({ cart: [] }),

      transactions: [],
      addTransaction: (transaction) =>
        set((s) => ({ transactions: [transaction, ...s.transactions] })),

      cartTotal: () => get().cart.reduce((sum, i) => sum + i.price * i.quantity, 0),
      cartCount: () => get().cart.reduce((sum, i) => sum + i.quantity, 0),
    }),
    { name: 'klou-store-data' }
  )
)
