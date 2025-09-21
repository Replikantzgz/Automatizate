'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import { UserProfile, ConversationWithLastMessage } from '@/lib/supabase'

export default function ConversationsList() {
  const [user, setUser] = useState<UserProfile | null>(null)
  const [conversations, setConversations] = useState<ConversationWithLastMessage[]>([])
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    checkUser()
  }, [])

  useEffect(() => {
    if (user) {
      fetchConversations()
    }
  }, [user])

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

  const fetchConversations = async () => {
    try {
      const { data, error } = await supabase
        .from('conversations')
        .select(`
          *,
          project:projects(*),
          client:profiles!conversations_client_id_fkey(*),
          expert:profiles!conversations_expert_id_fkey(*),
          last_message:messages(
            id,
            message_text,
            created_at,
            sender:profiles(*)
          )
        `)
        .or(`client_id.eq.${user?.id},expert_id.eq.${user?.id}`)
        .order('created_at', { ascending: false })

      if (error) throw error

      // Procesar las conversaciones para obtener el último mensaje
      const processedConversations = data?.map(conv => {
        const lastMessage = conv.last_message?.[0]
        return {
          ...conv,
          last_message: lastMessage
        }
      }) || []

      setConversations(processedConversations)
    } catch (error) {
      console.error('Error fetching conversations:', error)
    }
  }

  const getOtherUser = (conversation: ConversationWithLastMessage) => {
    if (!user) return null
    return user.id === conversation.client_id ? conversation.expert : conversation.client
  }

  const formatTime = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60)

    if (diffInHours < 24) {
      return date.toLocaleTimeString('es-ES', {
        hour: '2-digit',
        minute: '2-digit'
      })
    } else if (diffInHours < 48) {
      return 'Ayer'
    } else {
      return date.toLocaleDateString('es-ES', {
        day: '2-digit',
        month: '2-digit'
      })
    }
  }

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
          <h1 className="text-3xl font-bold text-gray-900">
            Mensajes
          </h1>
          <p className="text-gray-600 mt-2">
            Gestiona tus conversaciones sobre proyectos de automatización
          </p>
        </div>

        {/* Conversations List */}
        {conversations.length === 0 ? (
          <div className="card text-center py-20">
            <div className="w-20 h-20 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
            </div>
            <h3 className="text-xl font-medium text-gray-900 mb-2">No hay conversaciones</h3>
            <p className="text-gray-600 mb-4">
              {user?.role === 'cliente' 
                ? 'Los expertos se pondrán en contacto contigo cuando se interesen en tus proyectos'
                : 'Contacta a los clientes desde la página de proyectos para iniciar conversaciones'
              }
            </p>
            <Link 
              href={user?.role === 'cliente' ? '/proyectos' : '/projects'} 
              className="btn-primary"
            >
              {user?.role === 'cliente' ? 'Ver mis proyectos' : 'Explorar proyectos'}
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {conversations.map((conversation) => {
              const otherUser = getOtherUser(conversation)
              const lastMessage = conversation.last_message
              
              return (
                <Link
                  key={conversation.id}
                  href={`/conversations/${conversation.id}`}
                  className="card hover:shadow-lg transition-shadow duration-200 cursor-pointer"
                >
                  <div className="flex items-center space-x-4">
                    {/* Avatar */}
                    <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-white font-semibold text-lg">
                        {otherUser?.full_name?.charAt(0) || 'U'}
                      </span>
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <h3 className="text-lg font-semibold text-gray-900 truncate">
                          {otherUser?.full_name}
                        </h3>
                        {lastMessage && (
                          <span className="text-xs text-gray-500">
                            {formatTime(lastMessage.created_at)}
                          </span>
                        )}
                      </div>
                      
                      <p className="text-sm text-gray-600 mb-1 truncate">
                        {conversation.project?.title}
                      </p>
                      
                      {lastMessage ? (
                        <div className="flex items-center space-x-2">
                          <span className="text-xs text-gray-500">
                            {lastMessage.sender?.id === user?.id ? 'Tú: ' : ''}
                          </span>
                          <p className="text-sm text-gray-700 truncate">
                            {lastMessage.message_text}
                          </p>
                        </div>
                      ) : (
                        <p className="text-sm text-gray-500 italic">
                          Sin mensajes aún
                        </p>
                      )}
                    </div>

                    {/* Arrow */}
                    <div className="text-gray-400">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </div>
                </Link>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}

