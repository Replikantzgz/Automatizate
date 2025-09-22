import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { NotificationService } from '@/lib/notifications'

// GET: Obtener mensajes de una conversación
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { data: { session }, error: authError } = await supabase.auth.getSession()
    
    if (authError || !session) {
      return NextResponse.json(
        { error: 'No autorizado' },
        { status: 401 }
      )
    }

    const conversationId = params.id
    const userId = session.user.id

    // Verificar que el usuario es parte de la conversación
    const { data: conversation, error: convError } = await supabase
      .from('conversations')
      .select('*')
      .eq('id', conversationId)
      .or(`client_id.eq.${userId},expert_id.eq.${userId}`)
      .single()

    if (convError || !conversation) {
      return NextResponse.json(
        { error: 'Conversación no encontrada' },
        { status: 404 }
      )
    }

    // Obtener mensajes
    const { data: messages, error: messagesError } = await supabase
      .from('messages')
      .select(`
        *,
        sender:profiles(id, full_name, email)
      `)
      .eq('conversation_id', conversationId)
      .order('created_at', { ascending: true })

    if (messagesError) {
      throw messagesError
    }

    return NextResponse.json({ 
      success: true, 
      data: messages 
    })

  } catch (error) {
    console.error('Error fetching messages:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}

// POST: Crear nuevo mensaje
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { data: { session }, error: authError } = await supabase.auth.getSession()
    
    if (authError || !session) {
      return NextResponse.json(
        { error: 'No autorizado' },
        { status: 401 }
      )
    }

    const conversationId = params.id
    const userId = session.user.id
    const { message_text } = await request.json()

    if (!message_text || message_text.trim().length === 0) {
      return NextResponse.json(
        { error: 'El mensaje no puede estar vacío' },
        { status: 400 }
      )
    }

    // Verificar que el usuario es parte de la conversación
    const { data: conversation, error: convError } = await supabase
      .from('conversations')
      .select('*, project:projects(title)')
      .eq('id', conversationId)
      .or(`client_id.eq.${userId},expert_id.eq.${userId}`)
      .single()

    if (convError || !conversation) {
      return NextResponse.json(
        { error: 'Conversación no encontrada' },
        { status: 404 }
      )
    }

    // Crear el mensaje
    const { data: message, error: messageError } = await supabase
      .from('messages')
      .insert([{
        conversation_id: conversationId,
        sender_id: userId,
        message_text: message_text.trim()
      }])
      .select(`
        *,
        sender:profiles(id, full_name, email)
      `)
      .single()

    if (messageError) {
      throw messageError
    }

    // Determinar quién debe recibir la notificación
    const receiverId = conversation.client_id === userId 
      ? conversation.expert_id 
      : conversation.client_id

    // Enviar notificación al otro usuario
    if (receiverId && conversation.project?.title) {
      try {
        await NotificationService.notifyNewMessage(
          conversationId,
          userId,
          receiverId,
          conversation.project.title
        )
      } catch (notificationError) {
        console.error('Error sending notification:', notificationError)
        // No fallar si la notificación falla
      }
    }

    return NextResponse.json({ 
      success: true, 
      data: message 
    })

  } catch (error) {
    console.error('Error creating message:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}



