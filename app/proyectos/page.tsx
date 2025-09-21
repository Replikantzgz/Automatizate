'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import { UserProfile, Project } from '@/lib/supabase'

export default function Proyectos() {
  const [user, setUser] = useState<UserProfile | null>(null)
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  const [projectsLoading, setProjectsLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    checkUser()
  }, [])

  useEffect(() => {
    if (user) {
      if (user.role === 'cliente') {
        fetchUserProjects()
      } else {
        fetchAllProjects()
      }
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

  const fetchUserProjects = async () => {
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
      console.error('Error fetching user projects:', error)
    } finally {
      setProjectsLoading(false)
    }
  }

  const fetchAllProjects = async () => {
    try {
      setProjectsLoading(true)
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .eq('status', 'abierto')
        .order('created_at', { ascending: false })

      if (error) throw error
      setProjects(data || [])
    } catch (error) {
      console.error('Error fetching all projects:', error)
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
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Proyectos
          </h1>
          <p className="text-gray-600 mt-2">
            {user?.role === 'cliente' 
              ? 'Gestiona tus proyectos de automatización' 
              : 'Explora proyectos disponibles de automatización'
            }
          </p>
        </div>

        {/* Role-specific content */}
        {user?.role === 'cliente' ? (
          <div className="space-y-8">
            {/* Create Project Button */}
            <div className="card">
              <div className="text-center py-8">
                <h3 className="text-lg font-medium text-gray-900 mb-4">
                  ¿Tienes un proyecto de automatización?
                </h3>
                <p className="text-gray-600 mb-6">
                  Crea un nuevo proyecto y encuentra al experto perfecto para implementarlo
                </p>
                <Link href="/projects/create" className="btn-primary text-lg px-8 py-3">
                  + Crear nuevo proyecto
                </Link>
              </div>
            </div>

            {/* My Projects */}
            <div className="card">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Mis proyectos</h2>
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
                  {projects.map((project) => (
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
        ) : (
          <div className="space-y-8">
            {/* Search and Filters */}
            <div className="card">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Buscar proyectos</h2>
              <div className="flex flex-col md:flex-row gap-4">
                <input
                  type="text"
                  placeholder="Buscar por palabras clave..."
                  className="input-field flex-1"
                />
                <select className="input-field md:w-48">
                  <option value="">Todas las categorías</option>
                  <option value="Facturación">Facturación</option>
                  <option value="RRHH">RRHH</option>
                  <option value="Ventas">Ventas</option>
                  <option value="Marketing">Marketing</option>
                  <option value="Operaciones">Operaciones</option>
                  <option value="Otros">Otros</option>
                </select>
                <button className="btn-primary">
                  Buscar
                </button>
              </div>
            </div>

            {/* Available Projects */}
            <div className="card">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Proyectos disponibles</h2>
              {projectsLoading ? (
                <div className="text-center py-12">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
                  <p className="text-gray-600 mt-2">Cargando proyectos...</p>
                </div>
              ) : projects.length === 0 ? (
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No hay proyectos disponibles</h3>
                  <p className="text-gray-600 mb-4">
                    Los clientes aún no han publicado proyectos de automatización
                  </p>
                  <p className="text-sm text-gray-500">
                    Vuelve más tarde o actualiza tu perfil para recibir notificaciones
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {projects.map((project) => (
                    <div key={project.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="font-medium text-gray-900">{project.title}</h3>
                            {getStatusBadge(project.status)}
                          </div>
                          <p className="text-gray-600 text-sm mb-2 line-clamp-2">
                            {project.description}
                          </p>
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
                          className="btn-primary text-sm px-4 py-2"
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
        )}
      </div>
    </div>
  )
}
