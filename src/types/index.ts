export type PaymentMethod = 'cash' | 'whatnot' | 'card' | 'gift';
export type Screen = 'home' | 'cart' | 'payment' | 'scanner' | 'inventory' | 'transactions';

export interface Product {
  id: string;
  name: string;
  sku: string;
  barcode: string;
  price: number;
  stock: number;
  photo?: string;
  createdAt: string;
}

export interface CartItem {
  id: string;
  productId: string;
  name: string;
  price: number;
  quantity: number;
  subtotal: number;
}

export interface Transaction {
  id: string;
  items: CartItem[];
  subtotal: number;
  tax: number;
  total: number;
  paymentMethod: PaymentMethod;
  cashReceived?: number;
  change?: number;
  date: string;
  timestamp: number;
}
