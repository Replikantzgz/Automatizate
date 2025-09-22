import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { NotificationService } from '@/lib/notifications'

// GET: Obtener notificaciones del usuario
export async function GET(request: NextRequest) {
  try {
    // Verificar autenticación
    const { data: { session }, error: authError } = await supabase.auth.getSession()
    
    if (authError || !session) {
      return NextResponse.json(
        { error: 'No autorizado' },
        { status: 401 }
      )
    }

    const userId = session.user.id
    const searchParams = request.nextUrl.searchParams
    const limit = parseInt(searchParams.get('limit') || '50')
    const unreadOnly = searchParams.get('unread') === 'true'

    let notifications

    if (unreadOnly) {
      notifications = await NotificationService.getUnreadNotifications(userId)
    } else {
      notifications = await NotificationService.getUserNotifications(userId, limit)
    }

    return NextResponse.json({ 
      success: true, 
      data: notifications,
      count: notifications.length
    })

  } catch (error) {
    console.error('Error fetching notifications:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}

// POST: Marcar notificación como leída
export async function POST(request: NextRequest) {
  try {
    const { data: { session }, error: authError } = await supabase.auth.getSession()
    
    if (authError || !session) {
      return NextResponse.json(
        { error: 'No autorizado' },
        { status: 401 }
      )
    }

    const { notification_id, mark_all } = await request.json()
    const userId = session.user.id

    if (mark_all) {
      // Marcar todas como leídas
      await NotificationService.markAllAsRead(userId)
      return NextResponse.json({ 
        success: true, 
        message: 'Todas las notificaciones marcadas como leídas' 
      })
    } else if (notification_id) {
      // Marcar una específica como leída
      const notification = await NotificationService.markAsRead(notification_id)
      return NextResponse.json({ 
        success: true, 
        data: notification,
        message: 'Notificación marcada como leída' 
      })
    } else {
      return NextResponse.json(
        { error: 'Se requiere notification_id o mark_all' },
        { status: 400 }
      )
    }

  } catch (error) {
    console.error('Error updating notification:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}

// DELETE: Eliminar notificación (opcional)
export async function DELETE(request: NextRequest) {
  try {
    const { data: { session }, error: authError } = await supabase.auth.getSession()
    
    if (authError || !session) {
      return NextResponse.json(
        { error: 'No autorizado' },
        { status: 401 }
      )
    }

    const { notification_id } = await request.json()
    const userId = session.user.id

    if (!notification_id) {
      return NextResponse.json(
        { error: 'Se requiere notification_id' },
        { status: 400 }
      )
    }

    // Verificar que la notificación pertenece al usuario
    const { data: notification, error: fetchError } = await supabase
      .from('notifications')
      .select('id')
      .eq('id', notification_id)
      .eq('user_id', userId)
      .single()

    if (fetchError || !notification) {
      return NextResponse.json(
        { error: 'Notificación no encontrada' },
        { status: 404 }
      )
    }

    // Eliminar la notificación
    const { error: deleteError } = await supabase
      .from('notifications')
      .delete()
      .eq('id', notification_id)

    if (deleteError) {
      throw deleteError
    }

    return NextResponse.json({ 
      success: true, 
      message: 'Notificación eliminada' 
    })

  } catch (error) {
    console.error('Error deleting notification:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}



