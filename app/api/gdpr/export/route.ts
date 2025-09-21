import { NextRequest, NextResponse } from 'next/server'
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'

export async function GET(request: NextRequest) {
  try {
    const supabase = createRouteHandlerClient({ cookies })
    
    // Verificar autenticación
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }
    
    // Obtener perfil del usuario
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single()
    
    if (profileError) {
      return NextResponse.json({ error: 'Error obteniendo perfil' }, { status: 500 })
    }
    
    // Obtener proyectos del usuario
    const { data: projects, error: projectsError } = await supabase
      .from('projects')
      .select('*')
      .eq('client_id', user.id)
    
    if (projectsError) {
      console.error('Error obteniendo proyectos:', projectsError)
    }
    
    // Obtener propuestas del usuario (como experto)
    const { data: proposals, error: proposalsError } = await supabase
      .from('proposals')
      .select('*')
      .eq('expert_id', user.id)
    
    if (proposalsError) {
      console.error('Error obteniendo propuestas:', proposalsError)
    }
    
    // Obtener contratos del usuario
    const { data: contracts, error: contractsError } = await supabase
      .from('contracts')
      .select('*')
      .or(`client_id.eq.${user.id},expert_id.eq.${user.id}`)
    
    if (contractsError) {
      console.error('Error obteniendo contratos:', contractsError)
    }
    
    // Obtener transacciones del usuario
    const { data: transactions, error: transactionsError } = await supabase
      .from('transactions')
      .select('*')
      .or(`buyer_id.eq.${user.id},seller_id.eq.${user.id}`)
    
    if (transactionsError) {
      console.error('Error obteniendo transacciones:', transactionsError)
    }
    
    // Obtener facturas del usuario
    const { data: invoices, error: invoicesError } = await supabase
      .from('invoices')
      .select('*')
      .or(`buyer_id.eq.${user.id},seller_id.eq.${user.id}`)
    
    if (invoicesError) {
      console.error('Error obteniendo facturas:', invoicesError)
    }
    
    // Obtener conversaciones del usuario
    const { data: conversations, error: conversationsError } = await supabase
      .from('conversations')
      .select('*')
      .or(`client_id.eq.${user.id},expert_id.eq.${user.id}`)
    
    if (conversationsError) {
      console.error('Error obteniendo conversaciones:', conversationsError)
    }
    
    // Obtener mensajes del usuario
    const { data: messages, error: messagesError } = await supabase
      .from('messages')
      .select('*')
      .eq('sender_id', user.id)
    
    if (messagesError) {
      console.error('Error obteniendo mensajes:', messagesError)
    }
    
    // Obtener notificaciones del usuario
    const { data: notifications, error: notificationsError } = await supabase
      .from('notifications')
      .select('*')
      .eq('user_id', user.id)
    
    if (notificationsError) {
      console.error('Error obteniendo notificaciones:', notificationsError)
    }
    
    // Preparar datos para exportación
    const exportData = {
      export_date: new Date().toISOString(),
      user_id: user.id,
      email: user.email,
      profile: {
        ...profile,
        // Eliminar campos sensibles
        id: undefined,
        created_at: profile.created_at,
        updated_at: profile.updated_at
      },
      projects: projects || [],
      proposals: proposals || [],
      contracts: contracts || [],
      transactions: transactions || [],
      invoices: invoices || [],
      conversations: conversations || [],
      messages: messages || [],
      notifications: notifications || [],
      metadata: {
        total_projects: projects?.length || 0,
        total_proposals: proposals?.length || 0,
        total_contracts: contracts?.length || 0,
        total_transactions: transactions?.length || 0,
        total_invoices: invoices?.length || 0,
        total_conversations: conversations?.length || 0,
        total_messages: messages?.length || 0,
        total_notifications: notifications?.length || 0
      }
    }
    
    // Crear respuesta con headers para descarga
    const response = NextResponse.json(exportData)
    response.headers.set('Content-Disposition', `attachment; filename="automarket-data-${user.id}-${new Date().toISOString().split('T')[0]}.json"`)
    response.headers.set('Content-Type', 'application/json')
    
    return response
    
  } catch (error) {
    console.error('Error exporting user data:', error)
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 })
  }
}

