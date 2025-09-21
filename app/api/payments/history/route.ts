import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function GET(request: NextRequest) {
  try {
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

    // Obtener el perfil del usuario para determinar su rol
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single()

    if (!profile) {
      return NextResponse.json({ error: 'Perfil no encontrado' }, { status: 404 })
    }

    let paymentsQuery

    if (profile.role === 'cliente') {
      // Clientes ven pagos que han realizado
      paymentsQuery = supabase
        .from('payments')
        .select(`
          *,
          project:projects(title, category),
          expert:profiles!payments_expert_id_fkey(full_name, email)
        `)
        .eq('client_id', user.id)
        .order('created_at', { ascending: false })
    } else if (profile.role === 'experto') {
      // Expertos ven pagos que han recibido
      paymentsQuery = supabase
        .from('payments')
        .select(`
          *,
          project:projects(title, category),
          client:profiles!payments_client_id_fkey(full_name, email)
        `)
        .eq('expert_id', user.id)
        .order('created_at', { ascending: false })
    } else {
      return NextResponse.json({ error: 'Rol de usuario no válido' }, { status: 400 })
    }

    const { data: payments, error: paymentsError } = await paymentsQuery

    if (paymentsError) {
      console.error('Error fetching payments:', paymentsError)
      return NextResponse.json({ error: 'Error al obtener los pagos' }, { status: 500 })
    }

    // Calcular estadísticas
    const stats = {
      total_payments: payments.length,
      total_amount: payments.reduce((sum, p) => sum + p.amount, 0),
      total_commission: payments.reduce((sum, p) => sum + p.commission, 0),
      pending_amount: payments
        .filter(p => p.status === 'pending')
        .reduce((sum, p) => sum + p.amount, 0),
      paid_amount: payments
        .filter(p => p.status === 'paid')
        .reduce((sum, p) => sum + p.amount, 0),
      released_amount: payments
        .filter(p => p.status === 'released')
        .reduce((sum, p) => sum + p.expert_amount, 0),
    }

    return NextResponse.json({
      success: true,
      payments,
      stats
    })

  } catch (error) {
    console.error('Error in get payment history:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}

