import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { NotificationService } from '@/lib/notifications'

export async function POST(request: NextRequest) {
  try {
    const { proposal_id, status } = await request.json()

    if (!['accepted', 'rejected'].includes(status)) {
      return NextResponse.json({ error: 'Estado no válido' }, { status: 400 })
    }

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
      return NextResponse.json({ error: 'Solo los clientes pueden actualizar propuestas' }, { status: 403 })
    }

    // Obtener la propuesta y verificar que pertenezca a un proyecto del cliente
    const { data: proposal, error: proposalError } = await supabase
      .from('proposals')
      .select(`
        *,
        project:projects(*)
      `)
      .eq('id', proposal_id)
      .single()

    if (proposalError || !proposal) {
      return NextResponse.json({ error: 'Propuesta no encontrada' }, { status: 404 })
    }

    if (proposal.project.user_id !== user.id) {
      return NextResponse.json({ error: 'No autorizado para actualizar esta propuesta' }, { status: 403 })
    }

    if (proposal.status !== 'sent') {
      return NextResponse.json({ error: 'La propuesta ya no puede ser actualizada' }, { status: 400 })
    }

    // Actualizar el estado de la propuesta
    const { error: updateError } = await supabase
      .from('proposals')
      .update({ 
        status,
        updated_at: new Date().toISOString()
      })
      .eq('id', proposal_id)

    if (updateError) {
      console.error('Error updating proposal status:', updateError)
      return NextResponse.json({ error: 'Error al actualizar la propuesta' }, { status: 500 })
    }

    // Si la propuesta es aceptada, crear contrato y actualizar proyecto
    if (status === 'accepted') {
      // Crear contrato
      const { error: contractError } = await supabase
        .from('contracts')
        .insert({
          project_id: proposal.project_id,
          client_id: user.id,
          expert_id: proposal.expert_id,
          proposal_id: proposal.id,
          agreed_price: proposal.price,
          start_date: new Date().toISOString(),
          status: 'active'
        })

      if (contractError) {
        console.error('Error creating contract:', contractError)
        return NextResponse.json({ error: 'Error al crear el contrato' }, { status: 500 })
      }

      // Actualizar estado del proyecto
      const { error: projectError } = await supabase
        .from('projects')
        .update({ 
          status: 'en_proceso',
          updated_at: new Date().toISOString()
        })
        .eq('id', proposal.project_id)

      if (projectError) {
        console.error('Error updating project status:', projectError)
      }

      // Rechazar todas las otras propuestas del proyecto
      const { error: rejectOthersError } = await supabase
        .from('proposals')
        .update({ 
          status: 'rejected',
          updated_at: new Date().toISOString()
        })
        .eq('project_id', proposal.project_id)
        .neq('id', proposal_id)
        .eq('status', 'sent')

      if (rejectOthersError) {
        console.error('Error rejecting other proposals:', rejectOthersError)
      }

      // Enviar notificación al experto
      try {
        await NotificationService.notifyProposalAccepted(
          proposal.project_id,
          proposal.expert_id,
          proposal.project.title
        )
      } catch (notificationError) {
        console.error('Error sending notification:', notificationError)
        // No fallar si la notificación falla
      }
    }

    return NextResponse.json({
      success: true,
      message: `Propuesta ${status === 'accepted' ? 'aceptada' : 'rechazada'} exitosamente`
    })

  } catch (error) {
    console.error('Error in update proposal status:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}
