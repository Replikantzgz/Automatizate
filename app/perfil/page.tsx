'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { UserProfile } from '@/lib/supabase'

export default function Perfil() {
  const [user, setUser] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState('')
  const router = useRouter()

  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    role: 'cliente' as UserProfile['role']
  })

  useEffect(() => {
    checkUser()
  }, [])

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
    setFormData({
      full_name: profile.full_name,
      email: profile.email,
      role: profile.role
    })
    setLoading(false)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setMessage('')

    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          full_name: formData.full_name,
        })
        .eq('id', user?.id)

      if (error) throw error

      setMessage('Perfil actualizado correctamente')
      setUser({ ...user!, full_name: formData.full_name })
    } catch (error: any) {
      setMessage('Error al actualizar perfil: ' + error.message)
    } finally {
      setSaving(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
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
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Mi Perfil
          </h1>
          <p className="text-gray-600 mt-2">
            Gestiona tu información personal y preferencias
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {/* Profile Info */}
          <div className="md:col-span-2">
            <div className="card">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">
                Información personal
              </h2>

              <form onSubmit={handleSubmit} className="space-y-6">
                {message && (
                  <div className={`px-4 py-3 rounded-lg ${
                    message.includes('Error') 
                      ? 'bg-red-50 border border-red-200 text-red-600' 
                      : 'bg-green-50 border border-green-200 text-green-600'
                  }`}>
                    {message}
                  </div>
                )}

                <div>
                  <label htmlFor="full_name" className="block text-sm font-medium text-gray-700 mb-2">
                    Nombre completo
                  </label>
                  <input
                    id="full_name"
                    name="full_name"
                    type="text"
                    required
                    value={formData.full_name}
                    onChange={handleChange}
                    className="input-field"
                    placeholder="Tu nombre completo"
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                    Email
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    disabled
                    value={formData.email}
                    className="input-field bg-gray-50 cursor-not-allowed"
                    placeholder="tu@email.com"
                  />
                  <p className="text-sm text-gray-500 mt-1">
                    El email no se puede modificar por seguridad
                  </p>
                </div>

                <div>
                  <label htmlFor="role" className="block text-sm font-medium text-gray-700 mb-2">
                    Rol
                  </label>
                  <select
                    id="role"
                    name="role"
                    disabled
                    value={formData.role}
                    className="input-field bg-gray-50 cursor-not-allowed"
                  >
                    <option value="cliente">Cliente (Empresa/Autónomo)</option>
                    <option value="experto">Experto (Profesional)</option>
                  </select>
                  <p className="text-sm text-gray-500 mt-1">
                    El rol no se puede modificar después del registro
                  </p>
                </div>

                <div className="pt-4">
                  <button
                    type="submit"
                    disabled={saving}
                    className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {saving ? 'Guardando...' : 'Guardar cambios'}
                  </button>
                </div>
              </form>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Account Status */}
            <div className="card">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Estado de la cuenta</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Estado:</span>
                  <span className="text-green-600 font-medium">Activa</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Rol:</span>
                  <span className="text-primary font-medium capitalize">
                    {user?.role}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Miembro desde:</span>
                  <span className="text-gray-900">
                    {new Date(user?.created_at || '').toLocaleDateString('es-ES')}
                  </span>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="card">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Acciones rápidas</h3>
              <div className="space-y-3">
                <button className="w-full btn-secondary text-left">
                  Cambiar contraseña
                </button>
                <button className="w-full btn-secondary text-left">
                  Configuración de notificaciones
                </button>
                <button className="w-full btn-secondary text-left">
                  Exportar datos
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

