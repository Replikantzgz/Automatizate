'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import { UserProfile, Notification } from '@/lib/supabase'
import { getNotificationText, getNotificationIcon, getNotificationColor } from '@/lib/notifications'

export default function NotificationsPage() {
  const [user, setUser] = useState<UserProfile | null>(null)
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [loading, setLoading] = useState(true)
  const [markingAll, setMarkingAll] = useState(false)
  const [filter, setFilter] = useState<'all' | 'unread'>('all')
  const router = useRouter()

  useEffect(() => {
    checkUser()
  }, [])

  useEffect(() => {
    if (user) {
      fetchNotifications()
    }
  }, [user, filter])

  const checkUser = async () => {
    const { data: { session } } = await supabase.auth.getSession()
    if (!session) {
      router.push('/login')
      return
    }

    const { data: profile, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', session.user.id)
      .single()

    if (error || !profile) {
      router.push('/login')
      return
    }

    setUser(profile)
    setLoading(false)
  }

  const fetchNotifications = async () => {
    try {
      const url = filter === 'unread' 
        ? '/api/notifications?unread=true' 
        : '/api/notifications'
      
      const response = await fetch(url)
      if (response.ok) {
        const data = await response.json()
        setNotifications(data.data || [])
      }
    } catch (error) {
      console.error('Error fetching notifications:', error)
    }
  }

  const markAsRead = async (notificationId: string) => {
    try {
      const response = await fetch('/api/notifications', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ notification_id: notificationId }),
      })

      if (response.ok) {
        setNotifications(prev => 
          prev.map(n => 
            n.id === notificationId ? { ...n, read: true } : n
          )
        )
      }
    } catch (error) {
      console.error('Error marking notification as read:', error)
    }
  }

  const markAllAsRead = async () => {
    try {
      setMarkingAll(true)
      const response = await fetch('/api/notifications', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ mark_all: true }),
      })

      if (response.ok) {
        setNotifications(prev => prev.map(n => ({ ...n, read: true })))
        if (filter === 'unread') {
          setNotifications([])
        }
      }
    } catch (error) {
      console.error('Error marking all notifications as read:', error)
    } finally {
      setMarkingAll(false)
    }
  }

  const deleteNotification = async (notificationId: string) => {
    try {
      const response = await fetch('/api/notifications', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ notification_id: notificationId }),
      })

      if (response.ok) {
        setNotifications(prev => prev.filter(n => n.id !== notificationId))
      }
    } catch (error) {
      console.error('Error deleting notification:', error)
    }
  }

  const formatTimeAgo = (dateString: string) => {
    const now = new Date()
    const date = new Date(dateString)
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60))

    if (diffInMinutes < 1) return 'Ahora'
    if (diffInMinutes < 60) return `Hace ${diffInMinutes} min`
    if (diffInMinutes < 1440) return `Hace ${Math.floor(diffInMinutes / 60)}h`
    return `Hace ${Math.floor(diffInMinutes / 1440)}d`
  }

  const getUnreadCount = () => notifications.filter(n => !n.read).length

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Notificaciones
              </h1>
              <p className="text-gray-600">
                Gestiona todas tus notificaciones en un solo lugar
              </p>
            </div>
            <Link href="/" className="btn-secondary">
              ← Volver al Inicio
            </Link>
          </div>
        </div>

        {/* Filtros y acciones */}
        <div className="card mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setFilter('all')}
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    filter === 'all'
                      ? 'bg-primary text-white'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                  }`}
                >
                  Todas ({notifications.length})
                </button>
                <button
                  onClick={() => setFilter('unread')}
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    filter === 'unread'
                      ? 'bg-primary text-white'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                  }`}
                >
                  No leídas ({getUnreadCount()})
                </button>
              </div>
            </div>

            {getUnreadCount() > 0 && (
              <button
                onClick={markAllAsRead}
                disabled={markingAll}
                className="btn-secondary disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {markingAll ? 'Marcando...' : 'Marcar todas como leídas'}
              </button>
            )}
          </div>
        </div>

        {/* Lista de notificaciones */}
        <div className="space-y-4">
          {notifications.length === 0 ? (
            <div className="card text-center py-12">
              <div className="text-gray-400 mb-4">
                <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                {filter === 'unread' ? 'No tienes notificaciones sin leer' : 'No tienes notificaciones'}
              </h3>
              <p className="text-gray-600 mb-4">
                {filter === 'unread' 
                  ? '¡Perfecto! Has leído todas tus notificaciones.'
                  : 'Cuando recibas notificaciones, aparecerán aquí.'
                }
              </p>
              {filter === 'unread' && (
                <button
                  onClick={() => setFilter('all')}
                  className="btn-primary"
                >
                  Ver todas las notificaciones
                </button>
              )}
            </div>
          ) : (
            notifications.map((notification) => (
              <div
                key={notification.id}
                className={`card transition-all duration-200 ${
                  !notification.read 
                    ? 'border-l-4 border-l-blue-500 bg-blue-50' 
                    : 'hover:shadow-md'
                }`}
              >
                <div className="flex items-start space-x-4">
                  {/* Icono de la notificación */}
                  <div className={`flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center text-2xl ${getNotificationColor(notification.type)}`}>
                    {getNotificationIcon(notification.type)}
                  </div>

                  {/* Contenido de la notificación */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between">
                      <div>
                        <p className={`text-base ${!notification.read ? 'font-semibold text-gray-900' : 'text-gray-700'}`}>
                          {getNotificationText(notification.type, notification.payload)}
                        </p>
                        <p className="text-sm text-gray-500 mt-1">
                          {formatTimeAgo(notification.created_at)}
                        </p>
                      </div>

                      {/* Acciones */}
                      <div className="flex items-center space-x-2 ml-4">
                        {!notification.read && (
                          <button
                            onClick={() => markAsRead(notification.id)}
                            className="text-sm text-blue-600 hover:text-blue-800 font-medium"
                          >
                            Marcar como leída
                          </button>
                        )}
                        <button
                          onClick={() => deleteNotification(notification.id)}
                          className="text-sm text-red-600 hover:text-red-800 font-medium"
                        >
                          Eliminar
                        </button>
                      </div>
                    </div>

                    {/* Botón de acción si hay URL en el payload */}
                    {notification.payload.action_url && (
                      <div className="mt-3">
                        <Link
                          href={notification.payload.action_url}
                          className="inline-flex items-center text-sm text-blue-600 hover:text-blue-800 font-medium"
                        >
                          Ver detalles
                          <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                        </Link>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Información adicional */}
        <div className="mt-8 p-6 bg-blue-50 border border-blue-200 rounded-lg">
          <h3 className="text-lg font-semibold text-blue-900 mb-3">
            ¿Cómo funcionan las notificaciones?
          </h3>
          <div className="grid md:grid-cols-2 gap-4 text-sm text-blue-800">
            <div>
              <h4 className="font-medium mb-2">Tipos de notificaciones:</h4>
              <ul className="space-y-1">
                <li>• <strong>Nuevos mensajes</strong> en conversaciones</li>
                <li>• <strong>Nuevas propuestas</strong> para tus proyectos</li>
                <li>• <strong>Propuestas aceptadas</strong> por clientes</li>
                <li>• <strong>Pagos requeridos</strong> para proyectos</li>
                <li>• <strong>Solicitudes de reseña</strong> al completar</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium mb-2">Configuración:</h4>
              <ul className="space-y-1">
                <li>• Las notificaciones se envían por email</li>
                <li>• Puedes marcarlas como leídas individualmente</li>
                <li>• Opción de marcar todas como leídas</li>
                <li>• Filtro entre todas y solo no leídas</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}



