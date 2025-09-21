'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { UserProfile } from '@/lib/supabase'
import NotificationBell from './NotificationBell'

export default function Header() {
  const [user, setUser] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    checkUser()
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (session) {
        fetchUserProfile(session.user.id)
      } else {
        setUser(null)
      }
      setLoading(false)
    })

    return () => subscription.unsubscribe()
  }, [])

  const checkUser = async () => {
    const { data: { session } } = await supabase.auth.getSession()
    if (session) {
      fetchUserProfile(session.user.id)
    } else {
      setLoading(false)
    }
  }

  const fetchUserProfile = async (userId: string) => {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single()

    if (data && !error) {
      setUser(data)
    }
    setLoading(false)
  }

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.push('/')
  }

  if (loading) {
    return (
      <header className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="animate-pulse bg-gray-300 h-8 w-32 rounded"></div>
            <div className="animate-pulse bg-gray-300 h-8 w-48 rounded"></div>
          </div>
        </div>
      </header>
    )
  }

  return (
    <header className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center">
            <div className="w-8 h-8 bg-primary rounded-lg mr-2"></div>
            <span className="text-xl font-bold text-gray-900">AutoMarket</span>
          </Link>

          {/* Navigation */}
          <nav className="hidden md:flex space-x-8">
            <Link href="/" className="text-gray-700 hover:text-primary transition-colors">
              Inicio
            </Link>
            {user && (
              <Link 
                href={user.role === 'cliente' ? '/proyectos' : '/projects'} 
                className="text-gray-700 hover:text-primary transition-colors"
              >
                Proyectos
              </Link>
            )}
            {user && (
              <Link href="/conversations" className="text-gray-700 hover:text-primary transition-colors">
                Mensajes
              </Link>
            )}
            {user && (
              <Link href="/perfil" className="text-gray-700 hover:text-primary transition-colors">
                Perfil
              </Link>
            )}
            {user && (
              <Link href="/propuestas" className="text-gray-700 hover:text-primary transition-colors">
                Propuestas
              </Link>
            )}
            {user && (
              <Link href="/pagos" className="text-gray-700 hover:text-primary transition-colors">
                {user.role === 'cliente' ? 'Pagos' : 'Ingresos'}
              </Link>
            )}
          </nav>

                     {/* Auth Buttons */}
           <div className="flex items-center space-x-4">
             {user && <NotificationBell />}
             {user ? (
               <div className="flex items-center space-x-4">
                 <span className="text-sm text-gray-600">
                   {user.role === 'cliente' ? 'Cliente' : 'Experto'}
                 </span>
                 <button
                   onClick={handleSignOut}
                   className="btn-secondary"
                 >
                   Cerrar sesión
                 </button>
               </div>
             ) : (
               <div className="flex space-x-4">
                 <Link href="/login" className="btn-secondary">
                   Iniciar sesión
                 </Link>
                 <Link href="/register" className="btn-primary">
                   Registrarse
                 </Link>
               </div>
             )}
           </div>
        </div>
      </div>
    </header>
  )
}
