import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { transferToExpert } from '@/lib/stripe'

export async function POST(request: NextRequest) {
  try {
    const { payment_id, project_id, expert_id } = await request.json()

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
      .eq('id', payment_id)
      .single()

    if (paymentError || !payment) {
      return NextResponse.json({ error: 'Pago no encontrado' }, { status: 404 })
    }

    // Verificar que el usuario sea el cliente que creó el pago
    if (payment.client_id !== user.id) {
      return NextResponse.json({ error: 'No autorizado para liberar este pago' }, { status: 403 })
    }

    // Verificar que el pago esté en estado 'paid'
    if (payment.status !== 'paid') {
      return NextResponse.json({ error: 'El pago debe estar confirmado para poder liberarlo' }, { status: 400 })
    }

    // Verificar que el proyecto esté completado
    const { data: project } = await supabase
      .from('projects')
      .select('status')
      .eq('id', project_id)
      .single()

    if (!project || project.status !== 'completado') {
      return NextResponse.json({ error: 'El proyecto debe estar completado para liberar el pago' }, { status: 400 })
    }

    // Obtener la cuenta de Stripe del experto
    const { data: expert } = await supabase
      .from('profiles')
      .select('stripe_account_id')
      .eq('id', expert_id)
      .single()

    if (!expert?.stripe_account_id) {
      return NextResponse.json({ error: 'El experto no tiene una cuenta de Stripe configurada' }, { status: 400 })
    }

    // Transferir el dinero al experto (menos comisión)
    const transferResult = await transferToExpert({
      amount: payment.expert_amount,
      currency: payment.currency,
      destination: expert.stripe_account_id,
      metadata: {
        payment_id: payment.id,
        project_id: payment.project_id,
        client_id: payment.client_id,
        expert_id: payment.expert_id,
      },
    })

    if (!transferResult.success) {
      return NextResponse.json(
        { error: 'Error al transferir el pago', details: transferResult.error },
        { status: 500 }
      )
    }

    // Actualizar el estado del pago en la base de datos
    const { error: updateError } = await supabase
      .from('payments')
      .update({ 
        status: 'released',
        stripe_transfer_id: transferResult.transfer.id,
        released_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .eq('id', payment.id)

    if (updateError) {
      console.error('Error updating payment status:', updateError)
      return NextResponse.json({ error: 'Error al actualizar el estado del pago' }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      message: 'Pago liberado exitosamente al experto',
      transfer: transferResult.transfer
    })

  } catch (error) {
    console.error('Error in release payment:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}

