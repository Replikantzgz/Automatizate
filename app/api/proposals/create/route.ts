import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { NotificationService } from '@/lib/notifications'

export async function POST(request: NextRequest) {
  try {
    const { project_id, price, estimated_days, message } = await request.json()

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

    // Verificar que el usuario sea un experto
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single()

    if (profile?.role !== 'experto') {
      return NextResponse.json({ error: 'Solo los expertos pueden crear propuestas' }, { status: 403 })
    }

    // Verificar que el proyecto exista y esté abierto
    const { data: project } = await supabase
      .from('projects')
      .select('*')
      .eq('id', project_id)
      .eq('status', 'abierto')
      .single()

    if (!project) {
      return NextResponse.json({ error: 'Proyecto no encontrado o no está abierto' }, { status: 404 })
    }

    // Verificar que no haya una propuesta activa del mismo experto
    const { data: existingProposal } = await supabase
      .from('proposals')
      .select('id, status')
      .eq('project_id', project_id)
      .eq('expert_id', user.id)
      .not('status', 'eq', 'rejected')
      .single()

    if (existingProposal) {
      return NextResponse.json({ 
        error: 'Ya tienes una propuesta activa para este proyecto',
        proposal_id: existingProposal.id 
      }, { status: 400 })
    }

    // Crear la propuesta
    const { data: proposal, error: dbError } = await supabase
      .from('proposals')
      .insert({
        project_id,
        expert_id: user.id,
        price,
        estimated_days,
        message,
        status: 'sent'
      })
      .select(`
        *,
        project:projects(title, category),
        expert:profiles(full_name, email)
      `)
      .single()

    if (dbError) {
      console.error('Error saving proposal to database:', dbError)
      return NextResponse.json({ error: 'Error al guardar la propuesta' }, { status: 500 })
    }

    // Enviar notificación al cliente
    try {
      await NotificationService.notifyNewProposal(
        project_id,
        project.user_id,
        user.id,
        project.title
      )
    } catch (notificationError) {
      console.error('Error sending notification:', notificationError)
      // No fallar si la notificación falla
    }

    return NextResponse.json({
      success: true,
      proposal
    })

  } catch (error) {
    console.error('Error in create proposal:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}
