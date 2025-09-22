'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import { Proposal, UserProfile } from '@/lib/supabase'
import PaymentForm from './PaymentForm'

interface ProposalCardProps {
  proposal: Proposal
  user: UserProfile
  onStatusUpdate?: () => void
}

export default function ProposalCard({ proposal, user, onStatusUpdate }: ProposalCardProps) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [showPaymentForm, setShowPaymentForm] = useState(false)

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'sent':
        return 'bg-gray-100 text-gray-800'
      case 'accepted':
        return 'bg-green-100 text-green-800'
      case 'rejected':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'sent':
        return 'Enviada'
      case 'accepted':
        return 'Aceptada'
      case 'rejected':
        return 'Rechazada'
      default:
        return status
    }
  }

  const handleStatusUpdate = async (newStatus: 'accepted' | 'rejected') => {
    setLoading(true)
    setError(null)

    try {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) {
        setError('No tienes sesión activa')
        setLoading(false)
        return
      }

      const response = await fetch('/api/proposals/update-status', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({
          proposal_id: proposal.id,
          status: newStatus
        }),
      })

      const result = await response.json()

      if (!result.success) {
        setError(result.error || 'Error al actualizar la propuesta')
        setLoading(false)
        return
      }

      setLoading(false)
      onStatusUpdate?.()
    } catch (err) {
      console.error('Error updating proposal status:', err)
      setError('Error interno del servidor')
      setLoading(false)
    }
  }

  const isClient = user.role === 'cliente'
  const isExpert = user.role === 'experto'
  const canUpdateStatus = isClient && proposal.status === 'sent'
  const showPaymentCTA = isClient && proposal.status === 'accepted'

  return (
    <div className="card">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h4 className="text-lg font-semibold text-gray-900">
            Propuesta de {proposal.expert?.full_name || 'Experto'}
          </h4>
          <p className="text-sm text-gray-500">
            {proposal.expert?.email || 'Email no disponible'}
          </p>
        </div>
        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(proposal.status)}`}>
          {getStatusText(proposal.status)}
        </span>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="text-center p-3 bg-gray-50 rounded-lg">
          <p className="text-2xl font-bold text-primary">€{proposal.price.toFixed(2)}</p>
          <p className="text-sm text-gray-600">Precio propuesto</p>
        </div>
        <div className="text-center p-3 bg-gray-50 rounded-lg">
          <p className="text-2xl font-bold text-blue-600">{proposal.estimated_days}</p>
          <p className="text-sm text-gray-600">Días estimados</p>
        </div>
      </div>

      <div className="mb-4">
        <h5 className="text-sm font-medium text-gray-700 mb-2">Mensaje del experto:</h5>
        <p className="text-gray-600 text-sm leading-relaxed">{proposal.message}</p>
      </div>

      <div className="text-xs text-gray-500 mb-4">
        <p>Enviada el {new Date(proposal.created_at).toLocaleDateString('es-ES')}</p>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-sm text-red-600">{error}</p>
        </div>
      )}

      {/* Acciones según el rol y estado */}
      {canUpdateStatus && (
        <div className="flex space-x-3">
          <button
            onClick={() => handleStatusUpdate('rejected')}
            className="btn-secondary flex-1"
            disabled={loading}
          >
            {loading ? 'Procesando...' : 'Rechazar'}
          </button>
          <button
            onClick={() => handleStatusUpdate('accepted')}
            className="btn-primary flex-1"
            disabled={loading}
          >
            {loading ? 'Procesando...' : 'Aceptar'}
          </button>
        </div>
      )}

      {showPaymentCTA && (
        <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-sm text-blue-800 mb-3">
            <strong>¡Excelente!</strong> Has aceptado esta propuesta. Ahora es momento de realizar el pago para comenzar el trabajo.
          </p>
          <button
            onClick={() => setShowPaymentForm(true)}
            className="btn-primary w-full"
          >
            Pagar Ahora
          </button>
        </div>
      )}

      {/* Formulario de pago */}
      {showPaymentForm && (
        <div className="mt-4">
          <PaymentForm
            project={proposal.project!}
            expert={proposal.expert!}
            onSuccess={() => {
              setShowPaymentForm(false)
              onStatusUpdate?.()
            }}
            onCancel={() => setShowPaymentForm(false)}
          />
        </div>
      )}

      {/* Información adicional para expertos */}
      {isExpert && proposal.status === 'rejected' && (
        <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
          <p className="text-sm text-yellow-800">
            <strong>Propuesta rechazada:</strong> Puedes enviar una nueva propuesta para este proyecto si lo deseas.
          </p>
        </div>
      )}

      {isExpert && proposal.status === 'accepted' && (
        <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
          <p className="text-sm text-green-800">
            <strong>¡Propuesta aceptada!</strong> El cliente ha aceptado tu propuesta. Comienza a trabajar en el proyecto.
          </p>
        </div>
      )}
    </div>
  )
}



