import { NextRequest, NextResponse } from 'next/server'
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'

export async function POST(request: NextRequest) {
  try {
    const supabase = createRouteHandlerClient({ cookies })
    
    // Verificar autenticación
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }
    
    const { reason, confirmation } = await request.json()
    
    if (!confirmation || confirmation !== 'ELIMINAR') {
      return NextResponse.json({ 
        error: 'Debes escribir "ELIMINAR" para confirmar la solicitud' 
      }, { status: 400 })
    }
    
    // Crear solicitud de eliminación
    const { error: deletionRequestError } = await supabase
      .from('deletion_requests')
      .insert([
        {
          user_id: user.id,
          reason: reason || 'Solicitud del usuario',
          status: 'pending',
          requested_at: new Date().toISOString()
        }
      ])
    
    if (deletionRequestError) {
      // Si la tabla no existe, crear un registro en profiles
      console.log('Tabla deletion_requests no existe, marcando en profiles')
      
      const { error: updateError } = await supabase
        .from('profiles')
        .update({
          deletion_requested: true,
          deletion_requested_at: new Date().toISOString(),
          deletion_reason: reason || 'Solicitud del usuario'
        })
        .eq('id', user.id)
      
      if (updateError) {
        console.error('Error marcando solicitud de eliminación:', updateError)
        return NextResponse.json({ 
          error: 'Error procesando la solicitud de eliminación' 
        }, { status: 500 })
      }
    }
    
    // Anonimizar datos sensibles del perfil
    const { error: anonymizeError } = await supabase
      .from('profiles')
      .update({
        full_name: '[USUARIO ELIMINADO]',
        bio: '[PERFIL ELIMINADO]',
        skills: '[]',
        portfolio_url: null,
        phone: null,
        location: null,
        company: null,
        website: null,
        is_active: false,
        deleted_at: new Date().toISOString()
      })
      .eq('id', user.id)
    
    if (anonymizeError) {
      console.error('Error anonimizando perfil:', anonymizeError)
      return NextResponse.json({ 
        error: 'Error anonimizando datos del perfil' 
      }, { status: 500 })
    }
    
    // Anonimizar proyectos del usuario
    const { error: projectsError } = await supabase
      .from('projects')
      .update({
        title: '[PROYECTO ELIMINADO]',
        description: '[DESCRIPCIÓN ELIMINADA]',
        requirements: '[REQUISITOS ELIMINADOS]',
        attachments: '[]',
        deleted_at: new Date().toISOString()
      })
      .eq('client_id', user.id)
    
    if (projectsError) {
      console.error('Error anonimizando proyectos:', projectsError)
    }
    
    // Anonimizar propuestas del usuario
    const { error: proposalsError } = await supabase
      .from('proposals')
      .update({
        message: '[PROPUESTA ELIMINADA]',
        deleted_at: new Date().toISOString()
      })
      .eq('expert_id', user.id)
    
    if (proposalsError) {
      console.error('Error anonimizando propuestas:', proposalsError)
    }
    
    // Anonimizar mensajes del usuario
    const { error: messagesError } = await supabase
      .from('messages')
      .update({
        content: '[MENSAJE ELIMINADO]',
        deleted_at: new Date().toISOString()
      })
      .eq('sender_id', user.id)
    
    if (messagesError) {
      console.error('Error anonimizando mensajes:', messagesError)
    }
    
    // Anonimizar notificaciones del usuario
    const { error: notificationsError } = await supabase
      .from('notifications')
      .update({
        payload: '{}',
        deleted_at: new Date().toISOString()
      })
      .eq('user_id', user.id)
    
    if (notificationsError) {
      console.error('Error anonimizando notificaciones:', notificationsError)
    }
    
    // Desactivar la cuenta de autenticación
    const { error: authError } = await supabase.auth.admin.updateUserById(
      user.id,
      { user_metadata: { deleted: true, deleted_at: new Date().toISOString() } }
    )
    
    if (authError) {
      console.error('Error desactivando cuenta de auth:', authError)
    }
    
    // Cerrar sesión del usuario
    await supabase.auth.signOut()
    
    return NextResponse.json({ 
      success: true, 
      message: 'Solicitud de eliminación procesada correctamente. Tu cuenta ha sido desactivada y tus datos han sido anonimizados.',
      note: 'Los datos financieros y transaccionales se conservan por obligaciones legales durante el período requerido.'
    })
    
  } catch (error) {
    console.error('Error processing deletion request:', error)
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 })
  }
}



