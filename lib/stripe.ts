import Stripe from 'stripe'

// Configuración de Stripe
export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16',
})

// Configuración de la comisión (5% por defecto)
export const COMMISSION_RATE = 0.05

// Función para calcular la comisión y el monto para el experto
export function calculatePaymentBreakdown(amount: number) {
  const commission = Math.round(amount * COMMISSION_RATE * 100) / 100
  const expertAmount = amount - commission
  
  return {
    commission,
    expertAmount,
    total: amount
  }
}

// Función para crear un Payment Intent (pago por adelantado)
export async function createPaymentIntent(data: {
  amount: number
  currency: string
  metadata: Record<string, string>
}) {
  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(data.amount * 100), // Stripe usa centavos
      currency: data.currency,
      metadata: data.metadata,
      capture_method: 'manual', // No capturamos automáticamente
      automatic_payment_methods: {
        enabled: true,
      },
    })

    return { success: true, paymentIntent }
  } catch (error) {
    console.error('Error creating payment intent:', error)
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' }
  }
}

// Función para capturar el pago (confirmar que el cliente pagó)
export async function capturePayment(paymentIntentId: string) {
  try {
    const paymentIntent = await stripe.paymentIntents.capture(paymentIntentId)
    return { success: true, paymentIntent }
  } catch (error) {
    console.error('Error capturing payment:', error)
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' }
  }
}

// Función para transferir dinero al experto (menos comisión)
export async function transferToExpert(data: {
  amount: number
  currency: string
  destination: string // Stripe account ID del experto
  metadata: Record<string, string>
}) {
  try {
    const transfer = await stripe.transfers.create({
      amount: Math.round(data.amount * 100), // Stripe usa centavos
      currency: data.currency,
      destination: data.destination,
      metadata: data.metadata,
    })

    return { success: true, transfer }
  } catch (error) {
    console.error('Error creating transfer:', error)
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' }
  }
}

// Función para reembolsar al cliente si es necesario
export async function refundPayment(paymentIntentId: string, amount?: number) {
  try {
    const refund = await stripe.refunds.create({
      payment_intent: paymentIntentId,
      amount: amount ? Math.round(amount * 100) : undefined,
    })

    return { success: true, refund }
  } catch (error) {
    console.error('Error creating refund:', error)
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' }
  }
}

