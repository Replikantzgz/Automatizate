'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { UserProfile } from '@/lib/supabase'
import PaymentHistory from '@/components/PaymentHistory'

export default function PagosPage() {
  const [user, setUser] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    checkUser()
  }, [])

  const checkUser = async () => {
    try {
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
        console.error('Error fetching user profile:', error)
        router.push('/login')
        return
      }

      setUser(profile)
      setLoading(false)
    } catch (error) {
      console.error('Error checking user:', error)
      router.push('/login')
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/3 mb-8"></div>
            <div className="space-y-4">
              <div className="h-64 bg-gray-200 rounded"></div>
              <div className="h-96 bg-gray-200 rounded"></div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            {user.role === 'cliente' ? 'Mis Pagos' : 'Mis Ingresos'}
          </h1>
          <p className="text-gray-600 mt-2">
            {user.role === 'cliente' 
              ? 'Historial de todos los pagos realizados a expertos'
              : 'Historial de todos los ingresos recibidos por proyectos'
            }
          </p>
        </div>

        <PaymentHistory user={user} />
      </div>
    </div>
  )
}

