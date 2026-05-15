export type Screen = 'home' | 'cart' | 'payment' | 'scanner' | 'inventory' | 'transactions'
export type PaymentMethod = 'cash' | 'card' | 'whatnot' | 'gift'

export interface Product {
  id: string
  name: string
  sku: string
  barcode: string
  price: number
  stock: number
  createdAt: string
}

export interface CartItem {
  id: string
  productId: string
  name: string
  price: number
  quantity: number
}

export interface Transaction {
  id: string
  items: CartItem[]
  subtotal: number
  tax: number
  total: number
  method: PaymentMethod
  cash?: number
  change?: number
  date: string
  time: string
}
