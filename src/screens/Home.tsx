import React, { useState, useRef } from 'react'
import Header from '../components/Header'
import Keypad from '../components/Keypad'
import Button from '../components/Button'
import { useCartStore, useProductStore } from '../store'
import { CartItem, Screen } from '../types'

export default function Home({ onNav }: { onNav: (s: Screen) => void }) {
  const [amount, setAmount] = useState('')
  const [showCamera, setShowCamera] = useState(false)
  const [scannedProduct, setScannedProduct] = useState<any>(null)
  const [scannedPrice, setScannedPrice] = useState<string>('')
  const [manualCode, setManualCode] = useState<string>('')
  const videoRef = useRef<HTMLVideoElement>(null)
  const [stream, setStream] = useState<MediaStream | null>(null)
  
  const cart = useCartStore()
  const products = useProductStore()
  const count = cart.items.reduce((s, i) => s + i.quantity, 0)
  const total = cart.total()
  
  const startCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment' }
      })
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream
        setStream(mediaStream)
        setShowCamera(true)
      }
    } catch (err) {
      alert('❌ No se pudo acceder a la cámara')
    }
  }
  
  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop())
      setStream(null)
    }
    setShowCamera(false)
    setScannedProduct(null)
    setScannedPrice('')
  }
  
  const handleManualScan = () => {
    if (!manualCode) return
    const product = products.findByBarcode(manualCode)
    if (product) {
      setScannedProduct(product)
      setScannedPrice(product.price.toString())
      setManualCode('')
    } else {
      alert('❌ Código no encontrado')
    }
  }
  
  const addScannedProduct = () => {
    if (!scannedProduct || !scannedPrice) return
    const price = parseFloat(scannedPrice)
    if (isNaN(price) || price <= 0) { alert('Precio inválido'); return }
    
    const item: CartItem = {
      id: scannedProduct.id,
      productId: scannedProduct.id,
      name: scannedProduct.name,
      price: price,
      quantity: 1
    }
    cart.add(item)
    alert(`✅ ${scannedProduct.name} - $${price}`)
    setScannedProduct(null)
    setScannedPrice('')
  }
  
  if (showCamera && scannedProduct) {
    return (
      <div className="min-h-screen bg-gray-50 pb-20">
        <Header count={count} onCart={() => onNav('cart')} />
        <main className="max-w-2xl mx-auto px-6 py-6 space-y-6">
          <div className="bg-green-50 border-2 border-green-300 rounded-lg p-6">
            <h3 className="font-semibold mb-4 text-green-900">✅ Producto Escaneado</h3>
            <div className="space-y-2">
              <p><span className="text-gray-700">Nombre:</span> <span className="font-semibold text-sm">{scannedProduct.name}</span></p>
              <p><span className="text-gray-700">Código:</span> <span className="font-mono text-sm">{scannedProduct.barcode}</span></p>
              <p><span className="text-gray-700">Precio Original:</span> <span className="font-semibold">${scannedProduct.price}</span></p>
            </div>
          </div>
          
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <h3 className="font-semibold mb-4">Modificar Precio (opcional)</h3>
            <input
              type="number"
              placeholder="Nuevo precio..."
              value={scannedPrice}
              onChange={e => setScannedPrice(e.target.value)}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg text-2xl font-bold focus:outline-none focus:border-blue-500 mb-4"
            />
            <p className="text-center text-3xl font-bold text-blue-600">${scannedPrice || scannedProduct.price}</p>
          </div>
          
          <div className="flex gap-2">
            <Button onClick={addScannedProduct} className="flex-1">Agregar</Button>
            <Button onClick={() => setScannedProduct(null)} variant="secondary">Otro</Button>
            <Button onClick={stopCamera} variant="danger">Cerrar</Button>
          </div>
        </main>
      </div>
    )
  }
  
  if (showCamera) {
    return (
      <div className="min-h-screen bg-black pb-20">
        <Header count={count} onCart={() => onNav('cart')} />
        <main className="max-w-2xl mx-auto px-6 py-6 space-y-6">
          <h2 className="text-2xl font-bold text-white">Escanear Código</h2>
          <video ref={videoRef} autoPlay playsInline className="w-full rounded-lg border-4 border-blue-500" />
          <div className="flex gap-3">
            <Button onClick={stopCamera} variant="secondary" className="flex-1">Cancelar</Button>
          </div>
        </main>
      </div>
    )
  }
  
  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <Header count={count} onCart={() => onNav('cart')} />
      <main className="max-w-4xl mx-auto px-6 py-6 space-y-6">
        
        <div className="bg-white border-2 border-gray-200 rounded-xl p-6 text-center">
          <p className="text-gray-600 text-sm mb-2">Total</p>
          <h2 className="text-5xl font-bold text-blue-600">${total.toFixed(2)}</h2>
        </div>

        <Button onClick={startCamera} className="w-full" size="lg">📱 Escanear Código</Button>

        <div className="bg-white border border-gray-200 rounded-xl p-6">
          <h3 className="font-semibold mb-4">Ingreso Manual de Código</h3>
          <div className="flex gap-3 mb-4">
            <input
              type="text"
              placeholder="0001-0534"
              value={manualCode}
              onChange={e => setManualCode(e.target.value.slice(0, 4))}
              onKeyPress={e => e.key === 'Enter' && handleManualScan()}
              maxLength={4}
              className="flex-1 px-4 py-2 border border-gray-200 rounded-lg text-xl font-bold focus:outline-none focus:border-blue-500"
            />
            <Button onClick={handleManualScan}>Buscar</Button>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-xl p-6">
          <h3 className="font-semibold mb-4">Ingreso Manual de Precio</h3>
          <div className="bg-gray-50 rounded p-4 text-center mb-4 border-2 border-gray-200">
            <p className="text-4xl font-bold">${amount || '0.00'}</p>
          </div>
          <Keypad 
            onKey={k => { if (k === '.' && amount.includes('.')) return; setAmount(amount + k) }} 
            onDel={() => setAmount(amount.slice(0, -1))} 
          />
          <Button 
            onClick={() => { 
              if (!amount) return
              const p = parseFloat(amount)
              if (isNaN(p) || p <= 0) return
              const item: CartItem = { 
                id: Date.now().toString(), 
                productId: Date.now().toString(), 
                name: 'Venta Manual', 
                price: p, 
                quantity: 1 
              }
              cart.add(item)
              setAmount('')
            }} 
            className="w-full mt-4"
          >
            Agregar al Carrito
          </Button>
        </div>
      </main>
    </div>
  )
}
