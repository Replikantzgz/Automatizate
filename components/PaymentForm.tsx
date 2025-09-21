'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { loadStripe } from '@stripe/stripe-js'
import { supabase } from '@/lib/supabase'
import { Payment, Project, UserProfile } from '@/lib/supabase'

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!)

interface PaymentFormProps {
  project: Project
  expert: UserProfile
  onSuccess?: () => void
  onCancel?: () => void
}

export default function PaymentForm({ project, expert, onSuccess, onCancel }: PaymentFormProps) {
  const [amount, setAmount] = useState(project.budget || 0)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [payment, setPayment] = useState<Payment | null>(null)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      // Obtener el token de sesión
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) {
        setError('No tienes sesión activa')
        setLoading(false)
        return
      }

      // Crear el pago
      const response = await fetch('/api/payments/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({
          project_id: project.id,
          expert_id: expert.id,
          amount: amount,
        }),
      })

      const result = await response.json()

      if (!result.success) {
        setError(result.error || 'Error al crear el pago')
        setLoading(false)
        return
      }

      setPayment(result.payment)

      // Redirigir a Stripe Checkout
      const stripe = await stripePromise
      if (!stripe) {
        setError('Error al cargar Stripe')
        setLoading(false)
        return
      }

      const { error: stripeError } = await stripe.confirmCardPayment(result.client_secret, {
        payment_method: {
          card: {
            // Aquí podrías integrar Stripe Elements para un formulario más seguro
          },
        },
      })

      if (stripeError) {
        setError(stripeError.message || 'Error en el pago')
        setLoading(false)
        return
      }

      // Confirmar el pago en nuestra API
      const confirmResponse = await fetch('/api/payments/confirm', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({
          payment_intent_id: result.payment.stripe_payment_intent_id,
        }),
      })

      const confirmResult = await confirmResponse.json()

      if (!confirmResult.success) {
        setError(confirmResult.error || 'Error al confirmar el pago')
        setLoading(false)
        return
      }

      // Éxito
      setLoading(false)
      onSuccess?.()
      router.push('/proyectos?payment=success')

    } catch (err) {
      console.error('Error in payment:', err)
      setError('Error interno del servidor')
      setLoading(false)
    }
  }

  const commission = Math.round(amount * 0.05 * 100) / 100
  const expertAmount = amount - commission

  return (
    <div className="card max-w-md mx-auto">
      <h3 className="text-xl font-semibold mb-4">Pagar al Experto</h3>
      
      <div className="mb-4 p-3 bg-gray-50 rounded-lg">
        <p className="text-sm text-gray-600 mb-2">Resumen del pago:</p>
        <div className="space-y-1 text-sm">
          <div className="flex justify-between">
            <span>Monto del proyecto:</span>
            <span className="font-medium">€{amount.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-gray-600">
            <span>Comisión (5%):</span>
            <span>-€{commission.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-gray-600">
            <span>Para el experto:</span>
            <span>€{expertAmount.toFixed(2)}</span>
          </div>
          <hr className="my-2" />
          <div className="flex justify-between font-semibold">
            <span>Total a pagar:</span>
            <span>€{amount.toFixed(2)}</span>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="amount" className="block text-sm font-medium text-gray-700 mb-1">
            Monto (€)
          </label>
          <input
            type="number"
            id="amount"
            value={amount}
            onChange={(e) => setAmount(parseFloat(e.target.value) || 0)}
            min="1"
            step="0.01"
            className="input-field"
            required
          />
        </div>

        {error && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}

        <div className="flex space-x-3">
          <button
            type="button"
            onClick={onCancel}
            className="btn-secondary flex-1"
            disabled={loading}
          >
            Cancelar
          </button>
          <button
            type="submit"
            className="btn-primary flex-1"
            disabled={loading}
          >
            {loading ? 'Procesando...' : 'Pagar €' + amount.toFixed(2)}
          </button>
        </div>
      </form>

      <div className="mt-4 text-xs text-gray-500">
        <p>• El pago se retiene hasta que confirmes que el trabajo está terminado</p>
        <p>• La comisión del 5% se aplica automáticamente</p>
        <p>• Puedes cancelar el pago antes de la confirmación</p>
      </div>
    </div>
  )
}

