'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import { UserProfile, Project, ProjectCategory } from '@/lib/supabase'

export default function ProjectsList() {
  const [user, setUser] = useState<UserProfile | null>(null)
  const [projects, setProjects] = useState<Project[]>([])
  const [filteredProjects, setFilteredProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  const [projectsLoading, setProjectsLoading] = useState(true)
  const router = useRouter()

  // Filtros
  const [filters, setFilters] = useState({
    category: '',
    minBudget: '',
    maxBudget: '',
    sortBy: 'recent' as 'recent' | 'oldest'
  })

  useEffect(() => {
    checkUser()
  }, [])

  useEffect(() => {
    if (user) {
      fetchProjects()
    }
  }, [user])

  useEffect(() => {
    applyFilters()
  }, [projects, filters])

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

    if (profile.role !== 'experto') {
      router.push('/dashboard/cliente')
      return
    }

    setUser(profile)
    setLoading(false)
  }

  const fetchProjects = async () => {
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
      console.error('Error fetching projects:', error)
    } finally {
      setProjectsLoading(false)
    }
  }

  const applyFilters = () => {
    let filtered = [...projects]

    // Filtro por categoría
    if (filters.category) {
      filtered = filtered.filter(project => project.category === filters.category)
    }

    // Filtro por presupuesto mínimo
    if (filters.minBudget) {
      filtered = filtered.filter(project => 
        project.budget && project.budget >= Number(filters.minBudget)
      )
    }

    // Filtro por presupuesto máximo
    if (filters.maxBudget) {
      filtered = filtered.filter(project => 
        project.budget && project.budget <= Number(filters.maxBudget)
      )
    }

    // Ordenamiento
    if (filters.sortBy === 'recent') {
      filtered.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    } else {
      filtered.sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime())
    }

    setFilteredProjects(filtered)
  }

  const handleFilterChange = (name: string, value: string) => {
    setFilters(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const clearFilters = () => {
    setFilters({
      category: '',
      minBudget: '',
      maxBudget: '',
      sortBy: 'recent'
    })
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'short',
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

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Proyectos de Automatización
          </h1>
          <p className="text-gray-600 mt-2">
            Explora proyectos disponibles y encuentra oportunidades que se ajusten a tus habilidades
          </p>
        </div>

        {/* Filtros */}
        <div className="card mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Filtros y búsqueda</h2>
          <div className="grid md:grid-cols-5 gap-4">
            {/* Categoría */}
            <div>
              <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
                Categoría
              </label>
              <select
                id="category"
                value={filters.category}
                onChange={(e) => handleFilterChange('category', e.target.value)}
                className="input-field"
              >
                <option value="">Todas las categorías</option>
                <option value="Facturación">Facturación</option>
                <option value="RRHH">RRHH</option>
                <option value="Ventas">Ventas</option>
                <option value="Marketing">Marketing</option>
                <option value="Operaciones">Operaciones</option>
                <option value="Otros">Otros</option>
              </select>
            </div>

            {/* Presupuesto mínimo */}
            <div>
              <label htmlFor="minBudget" className="block text-sm font-medium text-gray-700 mb-2">
                Presupuesto mínimo (€)
              </label>
              <input
                id="minBudget"
                type="number"
                value={filters.minBudget}
                onChange={(e) => handleFilterChange('minBudget', e.target.value)}
                className="input-field"
                placeholder="0"
                min="0"
              />
            </div>

            {/* Presupuesto máximo */}
            <div>
              <label htmlFor="maxBudget" className="block text-sm font-medium text-gray-700 mb-2">
                Presupuesto máximo (€)
              </label>
              <input
                id="maxBudget"
                type="number"
                value={filters.maxBudget}
                onChange={(e) => handleFilterChange('maxBudget', e.target.value)}
                className="input-field"
                placeholder="10000"
                min="0"
              />
            </div>

            {/* Ordenamiento */}
            <div>
              <label htmlFor="sortBy" className="block text-sm font-medium text-gray-700 mb-2">
                Ordenar por
              </label>
              <select
                id="sortBy"
                value={filters.sortBy}
                onChange={(e) => handleFilterChange('sortBy', e.target.value as 'recent' | 'oldest')}
                className="input-field"
              >
                <option value="recent">Más recientes</option>
                <option value="oldest">Más antiguos</option>
              </select>
            </div>

            {/* Botón limpiar */}
            <div className="flex items-end">
              <button
                onClick={clearFilters}
                className="btn-secondary w-full"
              >
                Limpiar filtros
              </button>
            </div>
          </div>
        </div>

        {/* Estadísticas */}
        <div className="mb-6">
          <div className="flex items-center justify-between">
            <p className="text-gray-600">
              Mostrando <span className="font-medium">{filteredProjects.length}</span> de{' '}
              <span className="font-medium">{projects.length}</span> proyectos disponibles
            </p>
            {filters.category || filters.minBudget || filters.maxBudget ? (
              <p className="text-sm text-primary">
                Filtros aplicados
              </p>
            ) : null}
          </div>
        </div>

        {/* Lista de proyectos */}
        {projectsLoading ? (
          <div className="text-center py-20">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary mx-auto"></div>
            <p className="text-gray-600 mt-4 text-lg">Cargando proyectos...</p>
          </div>
        ) : filteredProjects.length === 0 ? (
          <div className="card text-center py-20">
            <div className="w-20 h-20 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-medium text-gray-900 mb-2">
              {projects.length === 0 ? 'No hay proyectos disponibles' : 'No se encontraron proyectos'}
            </h3>
            <p className="text-gray-600 mb-4">
              {projects.length === 0 
                ? 'Los clientes aún no han publicado proyectos de automatización'
                : 'Intenta ajustar los filtros de búsqueda'
              }
            </p>
            {projects.length === 0 ? (
              <p className="text-sm text-gray-500">
                Vuelve más tarde o actualiza tu perfil para recibir notificaciones
              </p>
            ) : (
              <button
                onClick={clearFilters}
                className="btn-primary"
              >
                Limpiar filtros
              </button>
            )}
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProjects.map((project) => (
              <div key={project.id} className="card hover:shadow-lg transition-shadow duration-200">
                {/* Header de la tarjeta */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">{getCategoryIcon(project.category)}</span>
                    <span className="text-xs font-medium text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                      {project.category}
                    </span>
                  </div>
                  <span className="text-xs text-gray-500">
                    {formatDate(project.created_at)}
                  </span>
                </div>

                {/* Título */}
                <h3 className="text-lg font-semibold text-gray-900 mb-3 line-clamp-2">
                  {project.title}
                </h3>

                {/* Descripción */}
                <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                  {project.description}
                </p>

                {/* Información adicional */}
                <div className="space-y-2 mb-6">
                  {project.budget && (
                    <div className="flex items-center gap-2 text-sm">
                      <span className="text-gray-500">💰</span>
                      <span className="font-medium text-gray-900">
                        €{project.budget.toLocaleString()}
                      </span>
                    </div>
                  )}
                  {project.deadline && (
                    <div className="flex items-center gap-2 text-sm">
                      <span className="text-gray-500">📅</span>
                      <span className="text-gray-700">
                        Plazo: {new Date(project.deadline).toLocaleDateString('es-ES')}
                      </span>
                    </div>
                  )}
                </div>

                {/* Botón de acción */}
                <Link
                  href={`/projects/${project.id}`}
                  className="btn-primary w-full text-center"
                >
                  Ver detalles
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

