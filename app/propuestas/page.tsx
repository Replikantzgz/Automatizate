'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { UserProfile, Proposal, Contract } from '@/lib/supabase'
import ProposalCard from '@/components/ProposalCard'
import ContractCard from '@/components/ContractCard'

export default function PropuestasPage() {
  const [user, setUser] = useState<UserProfile | null>(null)
  const [proposals, setProposals] = useState<Proposal[]>([])
  const [contracts, setContracts] = useState<Contract[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
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
      await fetchData()
      setLoading(false)
    } catch (error) {
      console.error('Error checking user:', error)
      router.push('/login')
    }
  }

  const fetchData = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) return

      // Obtener propuestas
      const proposalsResponse = await fetch('/api/proposals/list', {
        headers: {
          'Authorization': `Bearer ${session.access_token}`,
        },
      })

      if (proposalsResponse.ok) {
        const proposalsResult = await proposalsResponse.json()
        setProposals(proposalsResult.proposals || [])
      }

      // Obtener contratos (si es necesario)
      // Aquí podrías agregar una API para contratos si quieres mostrarlos también

    } catch (err) {
      console.error('Error fetching data:', err)
      setError('Error al obtener los datos')
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
              <div className="h-64 bg-gray-200 rounded"></div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  const isClient = user.role === 'cliente'
  const isExpert = user.role === 'experto'

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            {isClient ? 'Propuestas Recibidas' : 'Mis Propuestas'}
          </h1>
          <p className="text-gray-600 mt-2">
            {isClient 
              ? 'Gestiona las propuestas de expertos para tus proyectos'
              : 'Revisa el estado de las propuestas que has enviado'
            }
          </p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-600">{error}</p>
            <button
              onClick={fetchData}
              className="mt-2 btn-primary"
            >
              Reintentar
            </button>
          </div>
        )}

        {/* Estadísticas */}
        {proposals.length > 0 && (
          <div className="mb-8 grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="card text-center">
              <h3 className="text-lg font-semibold text-gray-700 mb-2">Total</h3>
              <p className="text-2xl font-bold text-primary">{proposals.length}</p>
            </div>
            <div className="card text-center">
              <h3 className="text-lg font-semibold text-gray-700 mb-2">Enviadas</h3>
              <p className="text-2xl font-bold text-gray-600">
                {proposals.filter(p => p.status === 'sent').length}
              </p>
            </div>
            <div className="card text-center">
              <h3 className="text-lg font-semibold text-gray-700 mb-2">Aceptadas</h3>
              <p className="text-2xl font-bold text-green-600">
                {proposals.filter(p => p.status === 'accepted').length}
              </p>
            </div>
            <div className="card text-center">
              <h3 className="text-lg font-semibold text-gray-700 mb-2">Rechazadas</h3>
              <p className="text-2xl font-bold text-red-600">
                {proposals.filter(p => p.status === 'rejected').length}
              </p>
            </div>
          </div>
        )}

        {/* Lista de propuestas */}
        {proposals.length === 0 ? (
          <div className="card text-center py-12">
            <div className="text-gray-400 mb-4">
              <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {isClient ? 'No hay propuestas aún' : 'No has enviado propuestas'}
            </h3>
            <p className="text-gray-500 mb-4">
              {isClient 
                ? 'Los expertos podrán enviar propuestas a tus proyectos cuando los publiques.'
                : 'Explora los proyectos disponibles y envía propuestas para comenzar a trabajar.'
              }
            </p>
            {isExpert && (
              <button
                onClick={() => router.push('/projects')}
                className="btn-primary"
              >
                Ver Proyectos
              </button>
            )}
          </div>
        ) : (
          <div className="space-y-6">
            {proposals.map((proposal) => (
              <ProposalCard
                key={proposal.id}
                proposal={proposal}
                user={user}
                onStatusUpdate={fetchData}
              />
            ))}
          </div>
        )}

        {/* Información adicional */}
        <div className="mt-12 p-6 bg-gray-50 rounded-lg">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            ¿Cómo funciona el sistema de propuestas?
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium text-gray-800 mb-2">Para Expertos:</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Explora proyectos abiertos en tu categoría</li>
                <li>• Envía propuestas con precio y tiempo estimado</li>
                <li>• Incluye un mensaje explicativo de tu enfoque</li>
                <li>• Espera la respuesta del cliente</li>
                <li>• Si es aceptada, comienza a trabajar</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium text-gray-800 mb-2">Para Clientes:</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Recibe propuestas de expertos calificados</li>
                <li>• Revisa precios, tiempos y mensajes</li>
                <li>• Acepta la propuesta que mejor se ajuste</li>
                <li>• Realiza el pago para comenzar el trabajo</li>
                <li>• Marca como completado cuando estés satisfecho</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}



