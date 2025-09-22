'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import { Contract, UserProfile } from '@/lib/supabase'

interface ContractCardProps {
  contract: Contract
  user: UserProfile
  onStatusUpdate?: () => void
}

export default function ContractCard({ contract, user, onStatusUpdate }: ContractCardProps) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-blue-100 text-blue-800'
      case 'completed':
        return 'bg-green-100 text-green-800'
      case 'disputed':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'active':
        return 'En Progreso'
      case 'completed':
        return 'Completado'
      case 'disputed':
        return 'En Disputa'
      default:
        return status
    }
  }

  const handleCompleteContract = async () => {
    setLoading(true)
    setError(null)

    try {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) {
        setError('No tienes sesión activa')
        setLoading(false)
        return
      }

      const response = await fetch('/api/contracts/complete', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({
          contract_id: contract.id
        }),
      })

      const result = await response.json()

      if (!result.success) {
        setError(result.error || 'Error al completar el contrato')
        setLoading(false)
        return
      }

      setLoading(false)
      onStatusUpdate?.()
    } catch (err) {
      console.error('Error completing contract:', err)
      setError('Error interno del servidor')
      setLoading(false)
    }
  }

  const isClient = user.role === 'cliente'
  const isExpert = user.role === 'experto'
  const canComplete = isClient && contract.status === 'active'

  return (
    <div className="card">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h4 className="text-lg font-semibold text-gray-900">
            Contrato - {contract.project?.title || 'Proyecto'}
          </h4>
          <p className="text-sm text-gray-500">
            {isClient 
              ? `Experto: ${contract.expert?.full_name || 'N/A'}`
              : `Cliente: ${contract.client?.full_name || 'N/A'}`
            }
          </p>
        </div>
        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(contract.status)}`}>
          {getStatusText(contract.status)}
        </span>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="text-center p-3 bg-gray-50 rounded-lg">
          <p className="text-2xl font-bold text-primary">€{contract.agreed_price.toFixed(2)}</p>
          <p className="text-sm text-gray-600">Precio acordado</p>
        </div>
        <div className="text-center p-3 bg-gray-50 rounded-lg">
          <p className="text-2xl font-bold text-blue-600">
            {contract.proposal?.estimated_days || 'N/A'}
          </p>
          <p className="text-sm text-gray-600">Días estimados</p>
        </div>
      </div>

      <div className="mb-4">
        <h5 className="text-sm font-medium text-gray-700 mb-2">Detalles del contrato:</h5>
        <div className="space-y-2 text-sm text-gray-600">
          <div className="flex justify-between">
            <span>Fecha de inicio:</span>
            <span>{new Date(contract.start_date).toLocaleDateString('es-ES')}</span>
          </div>
          <div className="flex justify-between">
            <span>Estado del proyecto:</span>
            <span className="capitalize">{contract.project?.status || 'N/A'}</span>
          </div>
          {contract.completed_at && (
            <div className="flex justify-between">
              <span>Fecha de finalización:</span>
              <span>{new Date(contract.completed_at).toLocaleDateString('es-ES')}</span>
            </div>
          )}
        </div>
      </div>

      {contract.proposal?.message && (
        <div className="mb-4">
          <h5 className="text-sm font-medium text-gray-700 mb-2">Propuesta original:</h5>
          <p className="text-gray-600 text-sm leading-relaxed">{contract.proposal.message}</p>
        </div>
      )}

      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-sm text-red-600">{error}</p>
        </div>
      )}

      {/* Acciones según el estado */}
      {canComplete && (
        <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <p className="text-sm text-yellow-800 mb-3">
            <strong>¿El trabajo está terminado?</strong> Marca este contrato como completado cuando estés satisfecho con el resultado.
          </p>
          <button
            onClick={handleCompleteContract}
            className="btn-primary w-full"
            disabled={loading}
          >
            {loading ? 'Procesando...' : 'Marcar como Completado'}
          </button>
        </div>
      )}

      {contract.status === 'completed' && (
        <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
          <p className="text-sm text-green-800">
            <strong>¡Contrato completado!</strong> El proyecto ha sido marcado como terminado exitosamente.
          </p>
        </div>
      )}

      {contract.status === 'disputed' && (
        <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-sm text-red-800">
            <strong>Contrato en disputa:</strong> Este contrato requiere atención especial. Contacta con soporte si necesitas ayuda.
          </p>
        </div>
      )}

      {/* Información adicional */}
      <div className="mt-4 text-xs text-gray-500">
        <p>Contrato ID: {contract.id}</p>
        <p>Creado el {new Date(contract.created_at).toLocaleDateString('es-ES')}</p>
      </div>
    </div>
  )
}



