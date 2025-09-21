'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import { UserProfile, Project } from '@/lib/supabase'

export default function ClienteDashboard() {
  const [user, setUser] = useState<UserProfile | null>(null)
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  const [projectsLoading, setProjectsLoading] = useState(true)
  const [showSuccessMessage, setShowSuccessMessage] = useState(false)
  const router = useRouter()
  const searchParams = useSearchParams()

  useEffect(() => {
    checkUser()
  }, [])

  useEffect(() => {
    if (searchParams.get('success') === 'project_created') {
      setShowSuccessMessage(true)
      // Limpiar el parámetro de la URL
      router.replace('/dashboard/cliente')
    }
  }, [searchParams, router])

  useEffect(() => {
    if (user) {
      fetchProjects()
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

    if (profile.role !== 'cliente') {
      router.push('/dashboard/experto')
      return
    }

    setUser(profile)
    setLoading(false)
  }

  const fetchProjects = async () => {
    try {
      setProjectsLoading(true)
      const { data: authData } = await supabase.auth.getSession()
      if (!authData.session?.user) return

      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .eq('user_id', authData.session.user.id)
        .order('created_at', { ascending: false })

      if (error) throw error
      setProjects(data || [])
    } catch (error) {
      console.error('Error fetching projects:', error)
    } finally {
      setProjectsLoading(false)
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
      month: 'short',
      day: 'numeric'
    })
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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Success Message */}
        {showSuccessMessage && (
          <div className="mb-8 bg-green-50 border border-green-200 text-green-800 px-4 py-3 rounded-lg">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span className="font-medium">¡Proyecto creado con éxito!</span>
              </div>
              <button
                onClick={() => setShowSuccessMessage(false)}
                className="text-green-600 hover:text-green-800"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>
        )}

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Dashboard de Cliente
          </h1>
          <p className="text-gray-600 mt-2">
            Bienvenido, {user?.full_name}. Gestiona tus proyectos de automatización.
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <div className="card">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Total Proyectos</h3>
            <p className="text-3xl font-bold text-primary">{projects.length}</p>
            <p className="text-sm text-gray-600">Creados</p>
          </div>
          <div className="card">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Proyectos Activos</h3>
            <p className="text-3xl font-bold text-green-600">
              {projects.filter(p => p.status === 'abierto' || p.status === 'en_proceso').length}
            </p>
            <p className="text-sm text-gray-600">En desarrollo</p>
          </div>
          <div className="card">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Completados</h3>
            <p className="text-3xl font-bold text-blue-600">
              {projects.filter(p => p.status === 'completado').length}
            </p>
            <p className="text-sm text-gray-600">Finalizados</p>
          </div>
          <div className="card">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Presupuesto Total</h3>
            <p className="text-3xl font-bold text-purple-600">
              €{projects.reduce((sum, p) => sum + (p.budget || 0), 0).toLocaleString()}
            </p>
            <p className="text-sm text-gray-600">Invertido</p>
          </div>
        </div>

        {/* Actions */}
        <div className="card mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Acciones rápidas</h2>
          <div className="flex flex-wrap gap-4">
            <Link href="/projects/create" className="btn-primary">
              + Crear nuevo proyecto
            </Link>
            <Link href="/proyectos" className="btn-secondary">
              Ver todos los proyectos
            </Link>
            <Link href="/conversations" className="btn-secondary">
              Ver mensajes
            </Link>
            <Link href="/invoices" className="btn-secondary">
              Ver facturas
            </Link>
          </div>
        </div>

        {/* Recent Projects */}
        <div className="card">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900">Mis proyectos</h2>
            {projects.length > 0 && (
              <Link href="/proyectos" className="text-primary hover:text-blue-700 text-sm font-medium">
                Ver todos →
              </Link>
            )}
          </div>

          {projectsLoading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
              <p className="text-gray-600 mt-2">Cargando proyectos...</p>
            </div>
          ) : projects.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No hay proyectos aún</h3>
              <p className="text-gray-600 mb-4">
                Comienza creando tu primer proyecto de automatización
              </p>
              <Link href="/projects/create" className="btn-primary">
                Crear primer proyecto
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {projects.slice(0, 5).map((project) => (
                <div key={project.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-medium text-gray-900">{project.title}</h3>
                        {getStatusBadge(project.status)}
                      </div>
                      <div className="flex items-center gap-4 text-sm text-gray-600">
                        <span>📁 {project.category}</span>
                        {project.budget && (
                          <span>💰 €{project.budget.toLocaleString()}</span>
                        )}
                        <span>📅 {formatDate(project.created_at)}</span>
                      </div>
                    </div>
                    <Link
                      href={`/projects/${project.id}`}
                      className="btn-secondary text-sm px-4 py-2"
                    >
                      Ver detalles
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
