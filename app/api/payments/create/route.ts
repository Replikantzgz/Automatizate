import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { createPaymentIntent, calculatePaymentBreakdown } from '@/lib/stripe'
import { stripe } from '@/lib/stripe'

export async function POST(request: NextRequest) {
  try {
    const { project_id, expert_id, amount } = await request.json()

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

    // Verificar que el usuario sea un cliente
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single()

    if (profile?.role !== 'cliente') {
      return NextResponse.json({ error: 'Solo los clientes pueden crear pagos' }, { status: 403 })
    }

    // Verificar que el proyecto exista y pertenezca al cliente
    const { data: project } = await supabase
      .from('projects')
      .select('*')
      .eq('id', project_id)
      .eq('user_id', user.id)
      .single()

    if (!project) {
      return NextResponse.json({ error: 'Proyecto no encontrado' }, { status: 404 })
    }

    // Verificar que el experto exista
    const { data: expert } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', expert_id)
      .eq('role', 'experto')
      .single()

    if (!expert) {
      return NextResponse.json({ error: 'Experto no encontrado' }, { status: 404 })
    }

    // Calcular comisión y monto para el experto
    const breakdown = calculatePaymentBreakdown(amount)

    // Crear Payment Intent en Stripe
    const paymentIntentResult = await createPaymentIntent({
      amount,
      currency: 'eur',
      metadata: {
        project_id,
        client_id: user.id,
        expert_id,
        commission: breakdown.commission.toString(),
        expert_amount: breakdown.expertAmount.toString(),
      },
    })

    if (!paymentIntentResult.success) {
      return NextResponse.json(
        { error: 'Error al crear el pago', details: paymentIntentResult.error },
        { status: 500 }
      )
    }

    // Guardar el pago en la base de datos
    const { data: payment, error: dbError } = await supabase
      .from('payments')
      .insert({
        project_id,
        client_id: user.id,
        expert_id,
        amount,
        commission: breakdown.commission,
        expert_amount: breakdown.expertAmount,
        currency: 'eur',
        status: 'pending',
        stripe_payment_intent_id: paymentIntentResult.paymentIntent.id,
      })
      .select()
      .single()

    if (dbError) {
      console.error('Error saving payment to database:', dbError)
      return NextResponse.json({ error: 'Error al guardar el pago' }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      payment,
      client_secret: paymentIntentResult.paymentIntent.client_secret,
    })

  } catch (error) {
    console.error('Error in create payment:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}

