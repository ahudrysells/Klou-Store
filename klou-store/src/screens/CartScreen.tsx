import { Trash2, Plus, Minus, ShoppingBag, ArrowRight } from 'lucide-react'
import { useStore } from '../store/useStore'

export default function CartScreen() {
  const { cart, removeFromCart, updateQuantity, clearCart, setScreen, cartTotal } = useStore()

  if (cart.length === 0) {
    return (
      <div className="flex flex-col h-full items-center justify-center text-gray-400 px-8">
        <ShoppingBag size={64} className="mb-4 opacity-30" />
        <h2 className="text-lg font-semibold text-gray-500">Carrito vacío</h2>
        <p className="text-sm text-center mt-1 mb-6">Agrega productos desde la pantalla de inicio</p>
        <button onClick={() => setScreen('home')}
          className="bg-blue-600 text-white px-6 py-2.5 rounded-xl font-medium hover:bg-blue-700 transition-colors">
          Ir al inicio
        </button>
      </div>
    )
  }

  return (
    <div className="flex flex-col h-full">
      <div className="bg-white px-4 pt-10 pb-4 border-b border-gray-100">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-bold text-gray-800">Carrito</h1>
          <button onClick={clearCart} className="text-red-400 text-sm font-medium hover:text-red-600">
            Vaciar
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-3 pb-4">
        {cart.map((item) => (
          <div key={item.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
            <div className="flex items-start justify-between mb-2">
              <p className="font-medium text-gray-800 flex-1 pr-2">{item.name}</p>
              <button onClick={() => removeFromCart(item.id)} className="text-red-400 hover:text-red-600">
                <Trash2 size={16} />
              </button>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3 bg-gray-100 rounded-xl px-2 py-1">
                <button onClick={() => updateQuantity(item.id, item.quantity - 1)}
                  className="w-7 h-7 flex items-center justify-center hover:bg-white rounded-lg transition-colors">
                  <Minus size={14} />
                </button>
                <span className="font-bold text-gray-800 w-6 text-center">{item.quantity}</span>
                <button onClick={() => updateQuantity(item.id, item.quantity + 1)}
                  className="w-7 h-7 flex items-center justify-center hover:bg-white rounded-lg transition-colors">
                  <Plus size={14} />
                </button>
              </div>
              <p className="font-bold text-blue-600">${(item.price * item.quantity).toFixed(2)}</p>
            </div>
            <p className="text-xs text-gray-400 mt-1">${item.price.toFixed(2)} c/u</p>
          </div>
        ))}
      </div>

      <div className="bg-white border-t border-gray-100 p-4 pb-20">
        <div className="flex justify-between items-center mb-4">
          <span className="text-gray-600 font-medium">Total</span>
          <span className="text-2xl font-bold text-gray-800">${cartTotal().toFixed(2)}</span>
        </div>
        <button onClick={() => setScreen('payment')}
          className="w-full bg-blue-600 text-white py-3.5 rounded-2xl font-semibold flex items-center justify-center gap-2 hover:bg-blue-700 transition-colors">
          Proceder al pago
          <ArrowRight size={18} />
        </button>
      </div>
    </div>
  )
}
