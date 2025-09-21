'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import { UserProfile } from '@/lib/supabase'

export default function ExpertoDashboard() {
  const [user, setUser] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

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

    if (profile.role !== 'experto') {
      router.push('/dashboard/cliente')
      return
    }

    setUser(profile)
    setLoading(false)
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
            Dashboard de Experto
          </h1>
          <p className="text-gray-600 mt-2">
            Bienvenido, {user?.full_name}. Encuentra proyectos de automatización.
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <div className="card">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Proyectos Aplicados</h3>
            <p className="text-3xl font-bold text-primary">0</p>
            <p className="text-sm text-gray-600">Candidaturas</p>
          </div>
          <div className="card">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Proyectos Completados</h3>
            <p className="text-3xl font-bold text-green-600">0</p>
            <p className="text-sm text-gray-600">Finalizados</p>
          </div>
          <div className="card">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Ingresos Totales</h3>
            <p className="text-3xl font-bold text-blue-600">€0</p>
            <p className="text-sm text-gray-600">Generados</p>
          </div>
        </div>

        {/* Actions */}
        <div className="card mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Acciones rápidas</h2>
          <div className="flex flex-wrap gap-4">
            <Link href="/projects" className="btn-primary">
              Explorar proyectos
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

        {/* Available Projects */}
        <div className="card">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900">Proyectos disponibles</h2>
            <Link href="/projects" className="text-primary hover:text-blue-700 text-sm font-medium">
              Ver todos →
            </Link>
          </div>
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
            <Link href="/projects" className="btn-primary">
              Explorar proyectos
            </Link>
          </div>
        </div>

        {/* Skills Section */}
        <div className="card mt-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Mis habilidades</h2>
          <div className="text-center py-8">
            <p className="text-gray-600 mb-4">
              Añade tus habilidades para que los clientes puedan encontrarte
            </p>
            <button className="btn-secondary">
              + Añadir habilidad
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
