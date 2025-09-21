import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { capturePayment } from '@/lib/stripe'
import { NotificationService } from '@/lib/notifications'

export async function POST(request: NextRequest) {
  try {
    const { payment_intent_id } = await request.json()

    // Validar que el usuario esté autenticado
    const authHeader = request.headers.get('authorization')
    if (!authHeader) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }

    const token = authHeader.replace('Bearer ', '')
    const { data: { user }, error: authError } = await supabase.auth.getUser(token)
    
    if (authError || !user) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }

    // Buscar el pago en la base de datos
    const { data: payment, error: paymentError } = await supabase
      .from('payments')
      .select('*')
      .eq('stripe_payment_intent_id', payment_intent_id)
      .single()

    if (paymentError || !payment) {
      return NextResponse.json({ error: 'Pago no encontrado' }, { status: 404 })
    }

    // Verificar que el usuario sea el cliente que creó el pago
    if (payment.client_id !== user.id) {
      return NextResponse.json({ error: 'No autorizado para confirmar este pago' }, { status: 403 })
    }

    // Capturar el pago en Stripe
    const captureResult = await capturePayment(payment_intent_id)
    
    if (!captureResult.success) {
      return NextResponse.json(
        { error: 'Error al confirmar el pago', details: captureResult.error },
        { status: 500 }
      )
    }

    // Actualizar el estado del pago en la base de datos
    const { error: updateError } = await supabase
      .from('payments')
      .update({ 
        status: 'paid',
        updated_at: new Date().toISOString()
      })
      .eq('id', payment.id)

    if (updateError) {
      console.error('Error updating payment status:', updateError)
      return NextResponse.json({ error: 'Error al actualizar el estado del pago' }, { status: 500 })
    }

    // Actualizar el estado del proyecto a 'en_proceso'
    const { error: projectError } = await supabase
      .from('projects')
      .update({ 
        status: 'en_proceso',
        updated_at: new Date().toISOString()
      })
      .eq('id', payment.project_id)

    if (projectError) {
      console.error('Error updating project status:', projectError)
    }

    // Generar factura automáticamente
    try {
      const invoiceResponse = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/invoices/generate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          transaction_id: payment.id
        })
      })

      if (!invoiceResponse.ok) {
        console.error('Error generating invoice:', await invoiceResponse.text())
      } else {
        console.log('Invoice generated successfully')
      }
    } catch (invoiceError) {
      console.error('Error calling invoice generation API:', invoiceError)
      // No fallar si la generación de factura falla
    }

    // Enviar notificación de pago requerido al cliente
    try {
      await NotificationService.notifyPaymentRequired(
        payment.project_id,
        payment.client_id,
        payment.project?.title || 'Proyecto',
        payment.amount
      )
    } catch (notificationError) {
      console.error('Error sending notification:', notificationError)
      // No fallar si la notificación falla
    }

    return NextResponse.json({
      success: true,
      message: 'Pago confirmado exitosamente'
    })

  } catch (error) {
    console.error('Error in confirm payment:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}
