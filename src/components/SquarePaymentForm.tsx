import React, { useEffect, useRef, useState } from 'react'
import Button from './Button'

declare global {
  interface Window {
    Square: any
  }
}

interface SquarePaymentFormProps {
  amount: number
  onSuccess: () => void
  onError: (error: string) => void
  onProcessing: (processing: boolean) => void
}

export default function SquarePaymentForm({ amount, onSuccess, onError, onProcessing }: SquarePaymentFormProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [payments, setPayments] = useState<any>(null)
  const [cardContainer, setCardContainer] = useState<any>(null)

  useEffect(() => {
    const initializeSquare = async () => {
      try {
        if (!window.Square) {
          throw new Error('Square.js no cargó')
        }

        const payments = window.Square.payments('sandbox-sq0idb-WHHZzCfLTyQHj2Onf1DvdQ')
        setPayments(payments)

        const card = await payments.card()
        card.attach('#sq-card-container')
        setCardContainer(card)
      } catch (err: any) {
        onError('Error iniciando Square: ' + err.message)
      }
    }

    initializeSquare()

    return () => {
      if (cardContainer) {
        cardContainer.destroy()
      }
    }
  }, [])

  const handlePayment = async () => {
    if (!payments || !cardContainer) {
      onError('Square no está inicializado')
      return
    }

    onProcessing(true)

    try {
      // Obtener token
      const { token } = await cardContainer.tokenize()

      if (!token) {
        throw new Error('No se pudo obtener el token')
      }

      // Enviar al servidor
      const response = await fetch('/api/payment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sourceId: token,
          amount: Math.round(amount * 100), // Convertir a centavos
          currency: 'USD',
          idempotencyKey: crypto.getRandomValues(new Uint8Array(16)).toString()
        })
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Error en el pago')
      }

      onSuccess()
    } catch (err: any) {
      onError('Error: ' + err.message)
    } finally {
      onProcessing(false)
    }
  }

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6 space-y-4">
      <h3 className="font-semibold mb-4">Información de la Tarjeta</h3>
      <div id="sq-card-container" ref={containerRef} className="border border-gray-300 rounded p-4 mb-4"></div>
      <Button onClick={handlePayment} className="w-full">
        Pagar ${amount.toFixed(2)}
      </Button>
    </div>
  )
}
