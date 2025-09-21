import { supabase } from './supabase'
import { NotificationType, CreateNotificationData } from './supabase'

// Servicio de notificaciones
export class NotificationService {
  // Crear una nueva notificación
  static async create(data: CreateNotificationData) {
    try {
      const { data: notification, error } = await supabase
        .from('notifications')
        .insert([data])
        .select()
        .single()

      if (error) throw error

      // Enviar email en paralelo (no bloquear la respuesta)
      this.sendEmailNotification(data).catch(console.error)

      return notification
    } catch (error) {
      console.error('Error creating notification:', error)
      throw error
    }
  }

  // Obtener notificaciones de un usuario
  static async getUserNotifications(userId: string, limit = 50) {
    try {
      const { data, error } = await supabase
        .from('notifications')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(limit)

      if (error) throw error
      return data
    } catch (error) {
      console.error('Error fetching notifications:', error)
      throw error
    }
  }

  // Obtener notificaciones no leídas
  static async getUnreadNotifications(userId: string) {
    try {
      const { data, error } = await supabase
        .from('notifications')
        .select('*')
        .eq('user_id', userId)
        .eq('read', false)
        .order('created_at', { ascending: false })

      if (error) throw error
      return data
    } catch (error) {
      console.error('Error fetching unread notifications:', error)
      throw error
    }
  }

  // Marcar notificación como leída
  static async markAsRead(notificationId: string) {
    try {
      const { data, error } = await supabase
        .from('notifications')
        .update({ read: true })
        .eq('id', notificationId)
        .select()
        .single()

      if (error) throw error
      return data
    } catch (error) {
      console.error('Error marking notification as read:', error)
      throw error
    }
  }

  // Marcar todas las notificaciones como leídas
  static async markAllAsRead(userId: string) {
    try {
      const { error } = await supabase
        .from('notifications')
        .update({ read: true })
        .eq('user_id', userId)
        .eq('read', false)

      if (error) throw error
      return true
    } catch (error) {
      console.error('Error marking all notifications as read:', error)
      throw error
    }
  }

  // Contar notificaciones no leídas
  static async getUnreadCount(userId: string) {
    try {
      const { count, error } = await supabase
        .from('notifications')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', userId)
        .eq('read', false)

      if (error) throw error
      return count || 0
    } catch (error) {
      console.error('Error counting unread notifications:', error)
      return 0
    }
  }

  // Métodos específicos para cada tipo de notificación
  static async notifyNewMessage(conversationId: string, senderId: string, receiverId: string, projectTitle: string) {
    return this.create({
      user_id: receiverId,
      type: 'NEW_MESSAGE',
      payload: {
        conversation_id: conversationId,
        sender_id: senderId,
        project_title: projectTitle,
        action_url: `/conversations/${conversationId}`
      }
    })
  }

  static async notifyNewProposal(projectId: string, clientId: string, expertId: string, projectTitle: string) {
    return this.create({
      user_id: clientId,
      type: 'NEW_PROPOSAL',
      payload: {
        project_id: projectId,
        expert_id: expertId,
        project_title: projectTitle,
        action_url: `/propuestas`
      }
    })
  }

  static async notifyProposalAccepted(projectId: string, expertId: string, projectTitle: string) {
    return this.create({
      user_id: expertId,
      type: 'PROPOSAL_ACCEPTED',
      payload: {
        project_id: projectId,
        project_title: projectTitle,
        action_url: `/propuestas`
      }
    })
  }

  static async notifyPaymentRequired(projectId: string, clientId: string, projectTitle: string, amount: number) {
    return this.create({
      user_id: clientId,
      type: 'PAYMENT_REQUIRED',
      payload: {
        project_id: projectId,
        project_title: projectTitle,
        amount: amount,
        action_url: `/pagos`
      }
    })
  }

  static async notifyReviewRequest(projectId: string, clientId: string, projectTitle: string) {
    return this.create({
      user_id: clientId,
      type: 'REVIEW_REQUEST',
      payload: {
        project_id: projectId,
        project_title: projectTitle,
        action_url: `/propuestas`
      }
    })
  }

  // Enviar email de notificación
  private static async sendEmailNotification(data: CreateNotificationData) {
    try {
      const response = await fetch('/api/notifications/send-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        throw new Error(`Email API error: ${response.status}`)
      }

      return await response.json()
    } catch (error) {
      console.error('Error sending email notification:', error)
      // No lanzar error para no bloquear la funcionalidad principal
    }
  }
}

// Helper para obtener el texto de la notificación
export function getNotificationText(type: NotificationType, payload: Record<string, any>): string {
  switch (type) {
    case 'NEW_MESSAGE':
      return `Nuevo mensaje en el proyecto "${payload.project_title}"`
    case 'NEW_PROPOSAL':
      return `Nueva propuesta recibida para "${payload.project_title}"`
    case 'PROPOSAL_ACCEPTED':
      return `Tu propuesta para "${payload.project_title}" ha sido aceptada`
    case 'PAYMENT_REQUIRED':
      return `Pago requerido para "${payload.project_title}" - €${payload.amount}`
    case 'REVIEW_REQUEST':
      return `Solicitud de reseña para "${payload.project_title}"`
    default:
      return 'Nueva notificación'
  }
}

// Helper para obtener el icono de la notificación
export function getNotificationIcon(type: NotificationType): string {
  switch (type) {
    case 'NEW_MESSAGE':
      return '💬'
    case 'NEW_PROPOSAL':
      return '📝'
    case 'PROPOSAL_ACCEPTED':
      return '✅'
    case 'PAYMENT_REQUIRED':
      return '💳'
    case 'REVIEW_REQUEST':
      return '⭐'
    default:
      return '🔔'
  }
}

// Helper para obtener el color de la notificación
export function getNotificationColor(type: NotificationType): string {
  switch (type) {
    case 'NEW_MESSAGE':
      return 'text-blue-600 bg-blue-50'
    case 'NEW_PROPOSAL':
      return 'text-green-600 bg-green-50'
    case 'PROPOSAL_ACCEPTED':
      return 'text-purple-600 bg-purple-50'
    case 'PAYMENT_REQUIRED':
      return 'text-orange-600 bg-orange-50'
    case 'REVIEW_REQUEST':
      return 'text-yellow-600 bg-yellow-50'
    default:
      return 'text-gray-600 bg-gray-50'
  }
}

