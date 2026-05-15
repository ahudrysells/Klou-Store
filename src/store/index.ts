import { create } from 'zustand';
import { CartItem, Product, Transaction } from '../types';

const TAX_RATE = 0.075;
const MOCK_PRODUCTS: Product[] = [
  { id: '1', name: 'DKNY Seamless Bra', sku: '0001', barcode: '0001', price: 10.0, stock: 25, createdAt: new Date().toISOString() },
  { id: '2', name: 'Room Service Short', sku: '0002', barcode: '0002', price: 10.0, stock: 18, createdAt: new Date().toISOString() },
  { id: '3', name: 'DKNY Swimsuit', sku: '0003', barcode: '0003', price: 10.0, stock: 12, createdAt: new Date().toISOString() },
  { id: '4', name: 'GV Amanda Capri', sku: '0004', barcode: '0004', price: 10.0, stock: 30, createdAt: new Date().toISOString() },
  { id: '5', name: 'LE Quilted Set', sku: '0005', barcode: '0005', price: 10.0, stock: 15, createdAt: new Date().toISOString() },
];

interface CartStore {
  items: CartItem[];
  addItem: (item: CartItem) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  getTotals: () => { subtotal: number; tax: number; total: number };
}

interface ProductStore {
  products: Product[];
  addProduct: (product: Product) => void;
  updateProduct: (id: string, product: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
  getProductByBarcode: (barcode: string) => Product | undefined;
}

interface TransactionStore {
  transactions: Transaction[];
  addTransaction: (transaction: Transaction) => void;
  getTodayTransactions: () => Transaction[];
  getTotalSales: () => number;
}

export const useCartStore = create<CartStore>((set, get) => ({
  items: [],
  addItem: (item: CartItem) => {
    set((state) => {
      const existing = state.items.find((i) => i.productId === item.productId);
      if (existing) {
        return {
          items: state.items.map((i) =>
            i.productId === item.productId
              ? { ...i, quantity: i.quantity + item.quantity, subtotal: (i.quantity + item.quantity) * i.price }
              : i
          ),
        };
      }
      return { items: [...state.items, item] };
    });
  },
  removeItem: (productId: string) => {
    set((state) => ({ items: state.items.filter((i) => i.productId !== productId) }));
  },
  updateQuantity: (productId: string, quantity: number) => {
    set((state) => ({
      items: state.items
        .map((i) => (i.productId === productId ? { ...i, quantity: Math.max(1, quantity), subtotal: Math.max(1, quantity) * i.price } : i))
        .filter((i) => i.quantity > 0),
    }));
  },
  clearCart: () => set({ items: [] }),
  getTotals: () => {
    const state = get();
    const subtotal = state.items.reduce((sum, item) => sum + item.subtotal, 0);
    const tax = subtotal * TAX_RATE;
    const total = subtotal + tax;
    return { subtotal, tax, total };
  },
}));

export const useProductStore = create<ProductStore>((set, get) => ({
  products: MOCK_PRODUCTS,
  addProduct: (product: Product) => set((state) => ({ products: [...state.products, product] })),
  updateProduct: (id: string, updates: Partial<Product>) => {
    set((state) => ({ products: state.products.map((p) => (p.id === id ? { ...p, ...updates } : p)) }));
  },
  deleteProduct: (id: string) => set((state) => ({ products: state.products.filter((p) => p.id !== id) })),
  getProductByBarcode: (barcode: string) => get().products.find((p) => p.barcode === barcode),
}));

export const useTransactionStore = create<TransactionStore>((set, get) => ({
  transactions: [],
  addTransaction: (transaction: Transaction) => set((state) => ({ transactions: [...state.transactions, transaction] })),
  getTodayTransactions: () => {
    const today = new Date().toLocaleDateString();
    return get().transactions.filter((t) => t.date === today);
  },
  getTotalSales: () => get().transactions.reduce((sum, t) => sum + t.total, 0),
}));
