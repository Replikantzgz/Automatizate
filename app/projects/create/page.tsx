'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { UserProfile, CreateProjectData, ProjectCategory } from '@/lib/supabase'

export default function CreateProject() {
  const [user, setUser] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()

  const [formData, setFormData] = useState<CreateProjectData>({
    title: '',
    description: '',
    category: 'Facturación',
    budget: undefined,
    deadline: undefined
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

    if (profile.role !== 'cliente') {
      router.push('/dashboard/experto')
      return
    }

    setUser(profile)
    setLoading(false)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    setError('')

    try {
      const { data: authData } = await supabase.auth.getSession()
      if (!authData.session?.user) throw new Error('Usuario no autenticado')

      const projectData = {
        ...formData,
        user_id: authData.session.user.id,
        status: 'abierto' as const
      }

      const { error: projectError } = await supabase
        .from('projects')
        .insert([projectData])

      if (projectError) throw projectError

      // Redirigir al dashboard con mensaje de éxito
      router.push('/dashboard/cliente?success=project_created')
    } catch (error: any) {
      setError(error.message || 'Error al crear el proyecto')
    } finally {
      setSubmitting(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target
    
    if (type === 'number') {
      setFormData({
        ...formData,
        [name]: value === '' ? undefined : Number(value)
      })
    } else {
      setFormData({
        ...formData,
        [name]: value
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
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Crear nuevo proyecto
          </h1>
          <p className="text-gray-600 mt-2">
            Describe tu proyecto de automatización para encontrar al experto perfecto
          </p>
        </div>

        {/* Form */}
        <div className="card">
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg">
                {error}
              </div>
            )}

            {/* Título */}
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                Título del proyecto *
              </label>
              <input
                id="title"
                name="title"
                type="text"
                required
                value={formData.title}
                onChange={handleChange}
                className="input-field"
                placeholder="Ej: Automatización de facturación mensual"
                maxLength={100}
              />
            </div>

            {/* Descripción */}
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                Descripción detallada *
              </label>
              <textarea
                id="description"
                name="description"
                required
                value={formData.description}
                onChange={handleChange}
                rows={6}
                className="input-field resize-none"
                placeholder="Describe en detalle qué necesitas automatizar, el contexto del proyecto, y cualquier requisito específico..."
                maxLength={1000}
              />
              <p className="text-sm text-gray-500 mt-1">
                {formData.description.length}/1000 caracteres
              </p>
            </div>

            {/* Categoría */}
            <div>
              <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
                Categoría *
              </label>
              <select
                id="category"
                name="category"
                required
                value={formData.category}
                onChange={handleChange}
                className="input-field"
              >
                <option value="Facturación">Facturación</option>
                <option value="RRHH">RRHH</option>
                <option value="Ventas">Ventas</option>
                <option value="Marketing">Marketing</option>
                <option value="Operaciones">Operaciones</option>
                <option value="Otros">Otros</option>
              </select>
            </div>

            {/* Presupuesto */}
            <div>
              <label htmlFor="budget" className="block text-sm font-medium text-gray-700 mb-2">
                Presupuesto estimado (opcional)
              </label>
              <div className="relative">
                <input
                  id="budget"
                  name="budget"
                  type="number"
                  value={formData.budget || ''}
                  onChange={handleChange}
                  className="input-field pl-8"
                  placeholder="0"
                  min="0"
                  step="100"
                />
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                  €
                </span>
              </div>
              <p className="text-sm text-gray-500 mt-1">
                Deja vacío si prefieres discutir el presupuesto con los expertos
              </p>
            </div>

            {/* Plazo */}
            <div>
              <label htmlFor="deadline" className="block text-sm font-medium text-gray-700 mb-2">
                Plazo deseado (opcional)
              </label>
              <input
                id="deadline"
                name="deadline"
                type="date"
                value={formData.deadline || ''}
                onChange={handleChange}
                className="input-field"
                min={new Date().toISOString().split('T')[0]}
              />
              <p className="text-sm text-gray-500 mt-1">
                Fecha límite para completar el proyecto
              </p>
            </div>

            {/* Submit Button */}
            <div className="pt-4">
              <button
                type="submit"
                disabled={submitting}
                className="w-full btn-primary py-3 text-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {submitting ? 'Creando proyecto...' : 'Crear proyecto'}
              </button>
            </div>
          </form>
        </div>

        {/* Help Text */}
        <div className="text-center mt-6">
          <p className="text-sm text-gray-600">
            ¿Necesitas ayuda?{' '}
            <a href="#" className="text-primary hover:text-blue-700 font-medium">
              Consulta nuestra guía
            </a>
          </p>
        </div>
      </div>
    </div>
  )
}

