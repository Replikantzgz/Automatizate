import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { NotificationService } from '@/lib/notifications'

export async function POST(request: NextRequest) {
  try {
    const { contract_id } = await request.json()

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
      return NextResponse.json({ error: 'Solo los clientes pueden completar contratos' }, { status: 403 })
    }

    // Obtener el contrato y verificar que pertenezca al cliente
    const { data: contract, error: contractError } = await supabase
      .from('contracts')
      .select(`
        *,
        project:projects(*)
      `)
      .eq('id', contract_id)
      .single()

    if (contractError || !contract) {
      return NextResponse.json({ error: 'Contrato no encontrado' }, { status: 404 })
    }

    if (contract.client_id !== user.id) {
      return NextResponse.json({ error: 'No autorizado para completar este contrato' }, { status: 403 })
    }

    if (contract.status !== 'active') {
      return NextResponse.json({ error: 'El contrato no está activo' }, { status: 400 })
    }

    // Actualizar el estado del contrato
    const { error: updateContractError } = await supabase
      .from('contracts')
      .update({ 
        status: 'completed',
        completed_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .eq('id', contract_id)

    if (updateContractError) {
      console.error('Error updating contract status:', updateContractError)
      return NextResponse.json({ error: 'Error al actualizar el contrato' }, { status: 500 })
    }

    // Actualizar el estado del proyecto
    const { error: updateProjectError } = await supabase
      .from('projects')
      .update({ 
        status: 'completado',
        updated_at: new Date().toISOString()
      })
      .eq('id', contract.project_id)

    if (updateProjectError) {
      console.error('Error updating project status:', updateProjectError)
      return NextResponse.json({ error: 'Error al actualizar el proyecto' }, { status: 500 })
    }

    // Enviar notificación de solicitud de reseña al cliente
    try {
      await NotificationService.notifyReviewRequest(
        contract.project_id,
        contract.client_id,
        contract.project?.title || 'Proyecto'
      )
    } catch (notificationError) {
      console.error('Error sending notification:', notificationError)
      // No fallar si la notificación falla
    }

    return NextResponse.json({
      success: true,
      message: 'Contrato marcado como completado exitosamente'
    })

  } catch (error) {
    console.error('Error in complete contract:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}
