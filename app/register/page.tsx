'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import { UserRole } from '@/lib/supabase'

export default function Register() {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    role: 'cliente' as UserRole
  })
  const [privacyConsent, setPrivacyConsent] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!privacyConsent) {
      setError('Debes aceptar la política de privacidad para continuar')
      return
    }
    
    setLoading(true)
    setError('')

    try {
      // Registrar usuario en Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
      })

      if (authError) throw authError

      if (authData.user) {
        // Crear perfil del usuario en la tabla profiles
        const { error: profileError } = await supabase
          .from('profiles')
          .insert([
            {
              id: authData.user.id,
              full_name: formData.fullName,
              email: formData.email,
              role: formData.role,
              privacy_consent: true,
              privacy_consent_date: new Date().toISOString()
            }
          ])

        if (profileError) throw profileError

        // Redirigir según el rol
        if (formData.role === 'cliente') {
          router.push('/dashboard/cliente')
        } else {
          router.push('/dashboard/experto')
        }
      }
    } catch (error: any) {
      setError(error.message || 'Error al registrar usuario')
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900">
            Crear cuenta
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Únete a AutoMarket y comienza tu viaje
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg">
              {error}
            </div>
          )}

          <div className="space-y-4">
            <div>
              <label htmlFor="fullName" className="block text-sm font-medium text-gray-700">
                Nombre completo
              </label>
              <input
                id="fullName"
                name="fullName"
                type="text"
                required
                value={formData.fullName}
                onChange={handleChange}
                className="input-field mt-1"
                placeholder="Tu nombre completo"
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                value={formData.email}
                onChange={handleChange}
                className="input-field mt-1"
                placeholder="tu@email.com"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Contraseña
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                value={formData.password}
                onChange={handleChange}
                className="input-field mt-1"
                placeholder="Mínimo 6 caracteres"
                minLength={6}
              />
            </div>

            <div>
              <label htmlFor="role" className="block text-sm font-medium text-gray-700">
                Rol
              </label>
              <select
                id="role"
                name="role"
                required
                value={formData.role}
                onChange={handleChange}
                className="input-field mt-1"
              >
                <option value="cliente">Cliente (Empresa/Autónomo)</option>
                <option value="experto">Experto (Profesional)</option>
              </select>
            </div>
          </div>

          {/* Privacy Consent Checkbox */}
          <div className="flex items-start">
            <div className="flex items-center h-5">
              <input
                id="privacy-consent"
                name="privacy-consent"
                type="checkbox"
                required
                checked={privacyConsent}
                onChange={(e) => setPrivacyConsent(e.target.checked)}
                className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
            </div>
            <div className="ml-3 text-sm">
              <label htmlFor="privacy-consent" className="text-gray-700">
                Acepto la{' '}
                <Link 
                  href="/legal/privacy" 
                  target="_blank"
                  className="text-blue-600 hover:text-blue-700 underline"
                >
                  política de privacidad
                </Link>
                {' '}y{' '}
                <Link 
                  href="/legal/terms" 
                  target="_blank"
                  className="text-blue-600 hover:text-blue-700 underline"
                >
                  términos y condiciones
                </Link>
                {' '}de AutoMarket
              </label>
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className="w-full btn-primary py-3 text-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Creando cuenta...' : 'Crear cuenta'}
            </button>
          </div>

          <div className="text-center">
            <p className="text-sm text-gray-600">
              ¿Ya tienes una cuenta?{' '}
              <Link href="/login" className="text-primary hover:text-blue-700 font-medium">
                Iniciar sesión
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  )
}
