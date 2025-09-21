'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { UserProfile } from '@/lib/supabase'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Search, Filter, Eye, Shield, UserCheck, UserX, Crown } from 'lucide-react'

interface ExtendedUserProfile extends UserProfile {
  projects_count?: number
  proposals_count?: number
  contracts_count?: number
}

export default function UsuariosPage() {
  const [users, setUsers] = useState<ExtendedUserProfile[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [roleFilter, setRoleFilter] = useState<string>('all')
  const [statusFilter, setStatusFilter] = useState<string>('all')

  useEffect(() => {
    fetchUsers()
  }, [])

  const fetchUsers = async () => {
    try {
      setLoading(true)
      
      // Obtener usuarios con estadísticas
      const { data: profiles, error } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error

      // Obtener estadísticas para cada usuario
      const usersWithStats = await Promise.all(
        profiles.map(async (user) => {
          const [projects, proposals, contracts] = await Promise.all([
            supabase.from('projects').select('id', { count: 'exact', head: true }).eq('user_id', user.id),
            supabase.from('proposals').select('id', { count: 'exact', head: true }).eq('expert_id', user.id),
            supabase.from('contracts').select('id', { count: 'exact', head: true }).eq('expert_id', user.id)
          ])

          return {
            ...user,
            projects_count: projects.count || 0,
            proposals_count: proposals.count || 0,
            contracts_count: contracts.count || 0
          }
        })
      )

      setUsers(usersWithStats)
    } catch (error) {
      console.error('Error fetching users:', error)
    } finally {
      setLoading(false)
    }
  }

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesRole = roleFilter === 'all' || user.role === roleFilter
    const matchesStatus = statusFilter === 'all' || 
                         (statusFilter === 'active' && user.role !== 'admin') ||
                         (statusFilter === 'admin' && user.role === 'admin')
    
    return matchesSearch && matchesRole && matchesStatus
  })

  const getRoleBadge = (role: string) => {
    const badges = {
      cliente: 'bg-blue-100 text-blue-800',
      experto: 'bg-green-100 text-green-800',
      admin: 'bg-purple-100 text-purple-800'
    }
    return badges[role as keyof typeof badges] || 'bg-gray-100 text-gray-800'
  }

  const getRoleIcon = (role: string) => {
    if (role === 'admin') return <Crown className="h-4 w-4" />
    if (role === 'experto') return <Shield className="h-4 w-4" />
    return <UserCheck className="h-4 w-4" />
  }

  const handleRoleChange = async (userId: string, newRole: string) => {
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ role: newRole })
        .eq('id', userId)

      if (error) throw error

      // Actualizar estado local
      setUsers(users.map(user => 
        user.id === userId ? { ...user, role: newRole as any } : user
      ))
    } catch (error) {
      console.error('Error updating user role:', error)
    }
  }

  const handleToggleStatus = async (userId: string, currentRole: string) => {
    try {
      // Solo permitir desactivar usuarios no-admin
      if (currentRole === 'admin') return

      const newRole = currentRole === 'cliente' ? 'experto' : 'cliente'
      await handleRoleChange(userId, newRole)
    } catch (error) {
      console.error('Error toggling user status:', error)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg">Cargando usuarios...</div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Gestión de Usuarios</h1>
        <p className="text-gray-600 mt-2">Administra usuarios, roles y permisos del sistema</p>
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
                  placeholder="Buscar por nombre o email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
            
            <div className="flex gap-2">
              <select
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">Todos los roles</option>
                <option value="cliente">Cliente</option>
                <option value="experto">Experto</option>
                <option value="admin">Admin</option>
              </select>
              
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">Todos los estados</option>
                <option value="active">Activos</option>
                <option value="admin">Administradores</option>
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tabla de usuarios */}
      <Card>
        <CardHeader>
          <CardTitle>Usuarios ({filteredUsers.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 font-medium text-gray-900">Usuario</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900">Rol</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900">Estadísticas</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900">Fecha de registro</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((user) => (
                  <tr key={user.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-4 px-4">
                      <div>
                        <div className="font-medium text-gray-900">{user.full_name}</div>
                        <div className="text-sm text-gray-500">{user.email}</div>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getRoleBadge(user.role)}`}>
                        {getRoleIcon(user.role)}
                        <span className="ml-1 capitalize">{user.role}</span>
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      <div className="text-sm text-gray-600">
                        <div>Proyectos: {user.projects_count}</div>
                        <div>Propuestas: {user.proposals_count}</div>
                        <div>Contratos: {user.contracts_count}</div>
                      </div>
                    </td>
                    <td className="py-4 px-4 text-sm text-gray-500">
                      {new Date(user.created_at).toLocaleDateString('es-ES')}
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleToggleStatus(user.id, user.role)}
                          disabled={user.role === 'admin'}
                          className={`px-3 py-1 text-xs rounded-md transition-colors ${
                            user.role === 'admin' 
                              ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                              : 'bg-blue-100 text-blue-700 hover:bg-blue-200'
                          }`}
                        >
                          {user.role === 'admin' ? 'No editable' : 'Cambiar rol'}
                        </button>
                        
                        {user.role !== 'admin' && (
                          <select
                            value={user.role}
                            onChange={(e) => handleRoleChange(user.id, e.target.value)}
                            className="px-2 py-1 text-xs border border-gray-300 rounded-md focus:ring-1 focus:ring-blue-500"
                          >
                            <option value="cliente">Cliente</option>
                            <option value="experto">Experto</option>
                          </select>
                        )}
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

