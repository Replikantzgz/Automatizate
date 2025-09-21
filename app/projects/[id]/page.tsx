'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import { UserProfile, Project, Conversation } from '@/lib/supabase'

export default function ProjectDetail() {
  const [user, setUser] = useState<UserProfile | null>(null)
  const [project, setProject] = useState<Project | null>(null)
  const [clientProfile, setClientProfile] = useState<UserProfile | null>(null)
  const [existingConversation, setExistingConversation] = useState<Conversation | null>(null)
  const [loading, setLoading] = useState(true)
  const [creatingConversation, setCreatingConversation] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()
  const params = useParams()
  const projectId = params.id as string

  useEffect(() => {
    checkUser()
  }, [])

  useEffect(() => {
    if (user && projectId) {
      fetchProject()
      if (user.role === 'experto') {
        checkExistingConversation()
      }
    }
  }, [user, projectId])

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

  const fetchProject = async () => {
    try {
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .eq('id', projectId)
        .single()

      if (error) throw error
      setProject(data)

      // Obtener perfil del cliente
      if (data.user_id) {
        const { data: clientData, error: clientError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', data.user_id)
          .single()

        if (!clientError && clientData) {
          setClientProfile(clientData)
        }
      }
    } catch (error: any) {
      setError('Error al cargar el proyecto: ' + error.message)
    }
  }

  const checkExistingConversation = async () => {
    try {
      const { data, error } = await supabase
        .from('conversations')
        .select('*')
        .eq('project_id', projectId)
        .eq('expert_id', user?.id)
        .single()

      if (!error && data) {
        setExistingConversation(data)
      }
    } catch (error) {
      // No hay conversación existente
    }
  }

  const createConversation = async () => {
    if (!user || !project || !clientProfile) return

    setCreatingConversation(true)
    try {
      const { data, error } = await supabase
        .from('conversations')
        .insert([{
          project_id: projectId,
          client_id: project.user_id,
          expert_id: user.id
        }])
        .select()
        .single()

      if (error) throw error

      // Redirigir a la conversación
      router.push(`/conversations/${data.id}`)
    } catch (error: any) {
      console.error('Error creating conversation:', error)
      setError('Error al crear la conversación: ' + error.message)
    } finally {
      setCreatingConversation(false)
    }
  }

  const handleContactClient = () => {
    if (existingConversation) {
      // Redirigir a la conversación existente
      router.push(`/conversations/${existingConversation.id}`)
    } else {
      // Crear nueva conversación
      createConversation()
    }
  }

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      abierto: { color: 'bg-green-100 text-green-800', text: 'Abierto' },
      en_proceso: { color: 'bg-blue-100 text-blue-800', text: 'En Proceso' },
      completado: { color: 'bg-gray-100 text-gray-800', text: 'Completado' },
      cancelado: { color: 'bg-red-100 text-red-800', text: 'Cancelado' }
    }

    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.abierto
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.color}`}>
        {config.text}
      </span>
    )
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const getCategoryIcon = (category: string) => {
    const icons = {
      'Facturación': '📊',
      'RRHH': '👥',
      'Ventas': '💰',
      'Marketing': '📢',
      'Operaciones': '⚙️',
      'Otros': '📁'
    }
    return icons[category as keyof typeof icons] || '📁'
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="card text-center">
            <div className="text-red-600 mb-4">
              <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.34 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Error</h2>
            <p className="text-gray-600 mb-4">{error}</p>
            <Link href={user?.role === 'cliente' ? '/dashboard/cliente' : '/projects'} className="btn-primary">
              Volver
            </Link>
          </div>
        </div>
      </div>
    )
  }

  if (!project) {
    return (
      <div className="min-h-screen bg-background py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="card text-center">
            <div className="text-gray-400 mb-4">
              <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Proyecto no encontrado</h2>
            <p className="text-gray-600 mb-4">El proyecto que buscas no existe o ha sido eliminado.</p>
            <Link href={user?.role === 'cliente' ? '/dashboard/cliente' : '/projects'} className="btn-primary">
              Volver
            </Link>
          </div>
        </div>
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
              <div className="flex items-center gap-3 mb-2">
                <span className="text-3xl">{getCategoryIcon(project.category)}</span>
                <h1 className="text-3xl font-bold text-gray-900">
                  {project.title}
                </h1>
              </div>
              <div className="flex items-center gap-4 mt-2">
                {getStatusBadge(project.status)}
                <span className="text-gray-600">
                  Publicado el {formatDate(project.created_at)}
                </span>
              </div>
            </div>
            <Link 
              href={user?.role === 'cliente' ? '/dashboard/cliente' : '/projects'} 
              className="btn-secondary"
            >
              ← Volver
            </Link>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Description */}
            <div className="card">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Descripción del proyecto</h2>
              <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">
                {project.description}
              </p>
            </div>

            {/* Project Actions */}
            <div className="card">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Acciones del proyecto</h2>
              <div className="flex flex-wrap gap-4">
                {user?.role === 'cliente' && project.user_id === user.id && (
                  <>
                    <button className="btn-primary">
                      Editar proyecto
                    </button>
                    <button className="btn-secondary">
                      Cambiar estado
                    </button>
                    <button className="btn-secondary text-red-600 hover:bg-red-50">
                      Cancelar proyecto
                    </button>
                  </>
                )}
                {user?.role === 'experto' && project.status === 'abierto' && (
                  <div className="flex gap-3">
                    <button 
                      onClick={handleContactClient}
                      disabled={creatingConversation}
                      className="btn-secondary disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {creatingConversation ? (
                        <div className="flex items-center space-x-2">
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-600"></div>
                          <span>Creando conversación...</span>
                        </div>
                      ) : existingConversation ? (
                        'Ver conversación'
                      ) : (
                        'Contactar cliente'
                      )}
                    </button>
                    <Link href={`/projects/${project.id}/proposal`} className="btn-primary">
                      Enviar Propuesta
                    </Link>
                  </div>
                )}
                {user?.role === 'experto' && project.status !== 'abierto' && (
                  <button className="btn-secondary" disabled>
                    Proyecto no disponible
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Project Info */}
            <div className="card">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Información del proyecto</h3>
              <div className="space-y-4">
                <div>
                  <span className="text-sm font-medium text-gray-600">Categoría:</span>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-xl">{getCategoryIcon(project.category)}</span>
                    <p className="text-gray-900">{project.category}</p>
                  </div>
                </div>
                
                {project.budget && (
                  <div>
                    <span className="text-sm font-medium text-gray-600">Presupuesto:</span>
                    <p className="text-gray-900 text-lg font-semibold">€{project.budget.toLocaleString()}</p>
                  </div>
                )}
                
                {project.deadline && (
                  <div>
                    <span className="text-sm font-medium text-gray-600">Plazo:</span>
                    <p className="text-gray-900">{formatDate(project.deadline)}</p>
                  </div>
                )}
                
                <div>
                  <span className="text-sm font-medium text-gray-600">Estado:</span>
                  <div className="mt-1">
                    {getStatusBadge(project.status)}
                  </div>
                </div>
              </div>
            </div>

            {/* Client Info */}
            <div className="card">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Cliente</h3>
              {clientProfile ? (
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center">
                      <span className="text-white font-semibold text-lg">
                        {clientProfile.full_name?.charAt(0) || 'C'}
                      </span>
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{clientProfile.full_name}</p>
                      <p className="text-sm text-gray-600">{clientProfile.email}</p>
                    </div>
                  </div>
                  <div className="pt-2 border-t border-gray-200">
                    <p className="text-xs text-gray-500">
                      Miembro desde {formatDate(clientProfile.created_at)}
                    </p>
                  </div>
                </div>
              ) : (
                <div className="text-center py-4">
                  <p className="text-gray-500 text-sm">Información del cliente no disponible</p>
                </div>
              )}
            </div>

            {/* Quick Stats */}
            <div className="card">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Estadísticas</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Aplicaciones:</span>
                  <span className="font-medium text-gray-900">0</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Vistas:</span>
                  <span className="font-medium text-gray-900">0</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Días activo:</span>
                  <span className="font-medium text-gray-900">
                    {Math.ceil((Date.now() - new Date(project.created_at).getTime()) / (1000 * 60 * 60 * 24))}
                  </span>
                </div>
              </div>
            </div>

            {/* Additional Actions for Experts */}
            {user?.role === 'experto' && project.status === 'abierto' && (
              <div className="card bg-blue-50 border-blue-200">
                <h3 className="text-lg font-semibold text-blue-900 mb-3">¿Te interesa este proyecto?</h3>
                <p className="text-blue-700 text-sm mb-4">
                  {existingConversation 
                    ? 'Ya tienes una conversación activa con este cliente. Haz clic para continuar.'
                    : 'Contacta al cliente para discutir los detalles y presentar tu propuesta.'
                  }
                </p>
                <button 
                  onClick={handleContactClient}
                  disabled={creatingConversation}
                  className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {creatingConversation ? (
                    <div className="flex items-center justify-center space-x-2">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      <span>Creando conversación...</span>
                    </div>
                  ) : existingConversation ? (
                    'Ver conversación'
                  ) : (
                    'Iniciar conversación'
                  )}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
