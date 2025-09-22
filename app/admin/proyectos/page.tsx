'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { Project, UserProfile } from '@/lib/supabase'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Search, Filter, Eye, EyeOff, AlertTriangle, CheckCircle, Clock, XCircle } from 'lucide-react'

interface ProjectWithUser extends Project {
  user?: UserProfile
  proposals_count?: number
  is_hidden?: boolean
  is_blocked?: boolean
}

export default function ProyectosPage() {
  const [projects, setProjects] = useState<ProjectWithUser[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [categoryFilter, setCategoryFilter] = useState<string>('all')

  useEffect(() => {
    fetchProjects()
  }, [])

  const fetchProjects = async () => {
    try {
      setLoading(true)
      
      // Obtener proyectos con información del usuario y estadísticas
      const { data: projectsData, error } = await supabase
        .from('projects')
        .select(`
          *,
          user:profiles(full_name, email, role)
        `)
        .order('created_at', { ascending: false })

      if (error) throw error

      // Obtener estadísticas de propuestas para cada proyecto
      const projectsWithStats = await Promise.all(
        projectsData.map(async (project) => {
          const { count: proposalsCount } = await supabase
            .from('proposals')
            .select('id', { count: 'exact', head: true })
            .eq('project_id', project.id)

          return {
            ...project,
            proposals_count: proposalsCount || 0,
            is_hidden: false, // Por defecto no oculto
            is_blocked: false  // Por defecto no bloqueado
          }
        })
      )

      setProjects(projectsWithStats)
    } catch (error) {
      console.error('Error fetching projects:', error)
    } finally {
      setLoading(false)
    }
  }

  const filteredProjects = projects.filter(project => {
    const matchesSearch = project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         project.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         project.user?.full_name.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === 'all' || project.status === statusFilter
    const matchesCategory = categoryFilter === 'all' || project.category === categoryFilter
    
    return matchesSearch && matchesStatus && matchesCategory
  })

  const getStatusBadge = (status: string) => {
    const badges = {
      abierto: 'bg-green-100 text-green-800',
      en_proceso: 'bg-blue-100 text-blue-800',
      completado: 'bg-gray-100 text-gray-800',
      cancelado: 'bg-red-100 text-red-800'
    }
    return badges[status as keyof typeof badges] || 'bg-gray-100 text-gray-800'
  }

  const getStatusIcon = (status: string) => {
    if (status === 'abierto') return <CheckCircle className="h-4 w-4" />
    if (status === 'en_proceso') return <Clock className="h-4 w-4" />
    if (status === 'completado') return <CheckCircle className="h-4 w-4" />
    if (status === 'cancelado') return <XCircle className="h-4 w-4" />
    return <Clock className="h-4 w-4" />
  }

  const getCategoryBadge = (category: string) => {
    return 'bg-purple-100 text-purple-800'
  }

  const handleToggleVisibility = async (projectId: string, currentHidden: boolean) => {
    try {
      // Aquí implementarías la lógica para ocultar/mostrar proyectos
      // Por ahora solo actualizamos el estado local
      setProjects(projects.map(project => 
        project.id === projectId 
          ? { ...project, is_hidden: !currentHidden }
          : project
      ))
    } catch (error) {
      console.error('Error toggling project visibility:', error)
    }
  }

  const handleBlockProject = async (projectId: string, currentBlocked: boolean) => {
    try {
      // Aquí implementarías la lógica para bloquear/desbloquear proyectos
      // Por ahora solo actualizamos el estado local
      setProjects(projects.map(project => 
        project.id === projectId 
          ? { ...project, is_blocked: !currentBlocked }
          : project
      ))
    } catch (error) {
      console.error('Error blocking project:', error)
    }
  }

  const handleStatusChange = async (projectId: string, newStatus: string) => {
    try {
      const { error } = await supabase
        .from('projects')
        .update({ status: newStatus })
        .eq('id', projectId)

      if (error) throw error

      // Actualizar estado local
      setProjects(projects.map(project => 
        project.id === projectId 
          ? { ...project, status: newStatus as any }
          : project
      ))
    } catch (error) {
      console.error('Error updating project status:', error)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg">Cargando proyectos...</div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Gestión de Proyectos</h1>
        <p className="text-gray-600 mt-2">Modera proyectos y gestiona su estado en el sistema</p>
      </div>

      {/* Filtros y búsqueda */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <input
                  type="text"
                  placeholder="Buscar por título, descripción o cliente..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
            
            <div className="flex gap-2">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">Todos los estados</option>
                <option value="abierto">Abierto</option>
                <option value="en_proceso">En Proceso</option>
                <option value="completado">Completado</option>
                <option value="cancelado">Cancelado</option>
              </select>
              
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">Todas las categorías</option>
                <option value="Facturación">Facturación</option>
                <option value="RRHH">RRHH</option>
                <option value="Ventas">Ventas</option>
                <option value="Marketing">Marketing</option>
                <option value="Operaciones">Operaciones</option>
                <option value="Otros">Otros</option>
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tabla de proyectos */}
      <Card>
        <CardHeader>
          <CardTitle>Proyectos ({filteredProjects.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 font-medium text-gray-900">Proyecto</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900">Cliente</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900">Categoría</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900">Estado</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900">Propuestas</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900">Fecha</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {filteredProjects.map((project) => (
                  <tr key={project.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-4 px-4">
                      <div>
                        <div className="font-medium text-gray-900">{project.title}</div>
                        <div className="text-sm text-gray-500 line-clamp-2 max-w-xs">
                          {project.description}
                        </div>
                        {project.budget && (
                          <div className="text-sm text-green-600 font-medium">
                            Presupuesto: €{project.budget}
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <div>
                        <div className="font-medium text-gray-900">{project.user?.full_name}</div>
                        <div className="text-sm text-gray-500">{project.user?.email}</div>
                        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                          project.user?.role === 'cliente' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'
                        }`}>
                          {project.user?.role}
                        </span>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getCategoryBadge(project.category)}`}>
                        {project.category}
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusBadge(project.status)}`}>
                        {getStatusIcon(project.status)}
                        <span className="ml-1 capitalize">{project.status.replace('_', ' ')}</span>
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      <span className="text-sm text-gray-600">
                        {project.proposals_count} propuestas
                      </span>
                    </td>
                    <td className="py-4 px-4 text-sm text-gray-500">
                      {new Date(project.created_at).toLocaleDateString('es-ES')}
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex flex-col gap-2">
                        <select
                          value={project.status}
                          onChange={(e) => handleStatusChange(project.id, e.target.value)}
                          className="px-2 py-1 text-xs border border-gray-300 rounded-md focus:ring-1 focus:ring-blue-500"
                        >
                          <option value="abierto">Abierto</option>
                          <option value="en_proceso">En Proceso</option>
                          <option value="completado">Completado</option>
                          <option value="cancelado">Cancelado</option>
                        </select>
                        
                        <div className="flex gap-1">
                          <button
                            onClick={() => handleToggleVisibility(project.id, project.is_hidden || false)}
                            className={`px-2 py-1 text-xs rounded-md transition-colors ${
                              project.is_hidden 
                                ? 'bg-green-100 text-green-700 hover:bg-green-200' 
                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                            }`}
                            title={project.is_hidden ? 'Mostrar proyecto' : 'Ocultar proyecto'}
                          >
                            {project.is_hidden ? <Eye className="h-3 w-3" /> : <EyeOff className="h-3 w-3" />}
                          </button>
                          
                          <button
                            onClick={() => handleBlockProject(project.id, project.is_blocked || false)}
                            className={`px-2 py-1 text-xs rounded-md transition-colors ${
                              project.is_blocked 
                                ? 'bg-green-100 text-green-700 hover:bg-green-200' 
                                : 'bg-red-100 text-red-700 hover:bg-red-200'
                            }`}
                            title={project.is_blocked ? 'Desbloquear proyecto' : 'Bloquear proyecto'}
                          >
                            {project.is_blocked ? <CheckCircle className="h-3 w-3" /> : <AlertTriangle className="h-3 w-3" />}
                          </button>
                        </div>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}



