'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import { UserProfile, Project } from '@/lib/supabase'
import ProposalForm from '@/components/ProposalForm'

export default function ProjectProposalPage() {
  const [user, setUser] = useState<UserProfile | null>(null)
  const [project, setProject] = useState<Project | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()
  const params = useParams()
  const projectId = params.id as string

  useEffect(() => {
    checkUser()
  }, [])

  useEffect(() => {
    if (user && projectId) {
      fetchProject()
    }
  }, [user, projectId])

  const checkUser = async () => {
    try {
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

      if (profile.role !== 'experto') {
        router.push('/dashboard/cliente')
        return
      }

      setUser(profile)
      setLoading(false)
    } catch (error) {
      console.error('Error checking user:', error)
      router.push('/login')
    }
  }

  const fetchProject = async () => {
    try {
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .eq('id', projectId)
        .eq('status', 'abierto')
        .single()

      if (error) {
        if (error.code === 'PGRST116') {
          setError('Proyecto no encontrado o no está abierto para propuestas')
        } else {
          setError('Error al cargar el proyecto: ' + error.message)
        }
        setLoading(false)
        return
      }

      setProject(data)
      setLoading(false)
    } catch (error: any) {
      setError('Error al cargar el proyecto: ' + error.message)
      setLoading(false)
    }
  }

  const handleProposalSuccess = () => {
    router.push(`/projects/${projectId}?proposal=success`)
  }

  const handleCancel = () => {
    router.push(`/projects/${projectId}`)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/3 mb-8"></div>
            <div className="space-y-4">
              <div className="h-64 bg-gray-200 rounded"></div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="card text-center">
            <div className="text-red-400 mb-4">
              <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Error</h2>
            <p className="text-gray-600 mb-4">{error}</p>
            <Link href="/projects" className="btn-primary">
              Volver a Proyectos
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
            <p className="text-gray-600 mb-4">El proyecto que buscas no existe o no está disponible para propuestas.</p>
            <Link href="/projects" className="btn-primary">
              Volver a Proyectos
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
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Enviar Propuesta
              </h1>
              <p className="text-gray-600">
                Proyecto: <span className="font-medium">{project.title}</span>
              </p>
            </div>
            <Link 
              href={`/projects/${projectId}`}
              className="btn-secondary"
            >
              ← Volver al Proyecto
            </Link>
          </div>
        </div>

        {/* Información del proyecto */}
        <div className="card mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Detalles del Proyecto</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-medium text-gray-700 mb-2">Descripción</h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                {project.description}
              </p>
            </div>
            <div className="space-y-3">
              <div>
                <span className="font-medium text-gray-700">Categoría:</span>
                <span className="ml-2 text-gray-600">{project.category}</span>
              </div>
              {project.budget && (
                <div>
                  <span className="font-medium text-gray-700">Presupuesto sugerido:</span>
                  <span className="ml-2 text-gray-600">€{project.budget.toFixed(2)}</span>
                </div>
              )}
              {project.deadline && (
                <div>
                  <span className="font-medium text-gray-700">Fecha límite:</span>
                  <span className="ml-2 text-gray-600">
                    {new Date(project.deadline).toLocaleDateString('es-ES')}
                  </span>
                </div>
              )}
              <div>
                <span className="font-medium text-gray-700">Estado:</span>
                <span className="ml-2 px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                  Abierto
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Formulario de propuesta */}
        <ProposalForm
          project={project}
          onSuccess={handleProposalSuccess}
          onCancel={handleCancel}
        />

        {/* Información adicional */}
        <div className="mt-8 p-6 bg-blue-50 border border-blue-200 rounded-lg">
          <h3 className="text-lg font-semibold text-blue-900 mb-3">
            Consejos para una propuesta exitosa
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-blue-800">
            <ul className="space-y-1">
              <li>• Sé específico sobre tu enfoque</li>
              <li>• Menciona experiencia relevante</li>
              <li>• Ofrece un precio competitivo</li>
            </ul>
            <ul className="space-y-1">
              <li>• Estima un tiempo realista</li>
              <li>• Incluye ejemplos de trabajo previo</li>
              <li>• Responde preguntas del cliente</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}



