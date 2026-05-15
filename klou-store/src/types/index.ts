export interface Product {
  id: string
  name: string
  price: number
  barcode?: string
  category?: string
  stock: number
  image?: string
}

export interface CartItem extends Product {
  quantity: number
}

export interface Transaction {
  id: string
  items: CartItem[]
  total: number
  paymentMethod: PaymentMethod
  timestamp: Date
  squarePaymentId?: string
}

export type PaymentMethod = 'cash' | 'card' | 'whatnot' | 'gift'

export type Screen = 'home' | 'cart' | 'payment' | 'scanner' | 'inventory' | 'transactions'
