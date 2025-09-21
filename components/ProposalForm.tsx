'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import { Project, CreateProposalData } from '@/lib/supabase'

interface ProposalFormProps {
  project: Project
  onSuccess?: () => void
  onCancel?: () => void
}

export default function ProposalForm({ project, onSuccess, onCancel }: ProposalFormProps) {
  const [formData, setFormData] = useState<CreateProposalData>({
    project_id: project.id,
    price: project.budget || 0,
    estimated_days: 7,
    message: ''
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) {
        setError('No tienes sesión activa')
        setLoading(false)
        return
      }

      const response = await fetch('/api/proposals/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`,
        },
        body: JSON.stringify(formData),
      })

      const result = await response.json()

      if (!result.success) {
        setError(result.error || 'Error al crear la propuesta')
        setLoading(false)
        return
      }

      setLoading(false)
      onSuccess?.()
    } catch (err) {
      console.error('Error creating proposal:', err)
      setError('Error interno del servidor')
      setLoading(false)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: name === 'price' || name === 'estimated_days' ? parseFloat(value) || 0 : value
    }))
  }

  return (
    <div className="card max-w-md mx-auto">
      <h3 className="text-xl font-semibold mb-4">Enviar Propuesta</h3>
      
      <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
        <p className="text-sm text-blue-800">
          <strong>Proyecto:</strong> {project.title}
        </p>
        <p className="text-sm text-blue-700">
          <strong>Categoría:</strong> {project.category}
        </p>
        {project.budget && (
          <p className="text-sm text-blue-700">
            <strong>Presupuesto sugerido:</strong> €{project.budget.toFixed(2)}
          </p>
        )}
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-1">
            Precio propuesto (€)
          </label>
          <input
            type="number"
            id="price"
            name="price"
            value={formData.price}
            onChange={handleInputChange}
            min="1"
            step="0.01"
            className="input-field"
            required
          />
        </div>

        <div>
          <label htmlFor="estimated_days" className="block text-sm font-medium text-gray-700 mb-1">
            Días estimados para completar
          </label>
          <input
            type="number"
            id="estimated_days"
            name="estimated_days"
            value={formData.estimated_days}
            onChange={handleInputChange}
            min="1"
            className="input-field"
            required
          />
        </div>

        <div>
          <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
            Mensaje explicativo
          </label>
          <textarea
            id="message"
            name="message"
            value={formData.message}
            onChange={handleInputChange}
            rows={4}
            className="input-field"
            placeholder="Explica tu enfoque, experiencia y por qué eres la mejor opción para este proyecto..."
            required
          />
        </div>

        {error && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}

        <div className="flex space-x-3">
          <button
            type="button"
            onClick={onCancel}
            className="btn-secondary flex-1"
            disabled={loading}
          >
            Cancelar
          </button>
          <button
            type="submit"
            className="btn-primary flex-1"
            disabled={loading}
          >
            {loading ? 'Enviando...' : 'Enviar Propuesta'}
          </button>
        </div>
      </form>

      <div className="mt-4 text-xs text-gray-500">
        <p>• Tu propuesta será visible para el cliente</p>
        <p>• Solo puedes enviar una propuesta activa por proyecto</p>
        <p>• El cliente puede aceptar o rechazar tu propuesta</p>
        <p>• Si es aceptada, se creará un contrato automáticamente</p>
      </div>
    </div>
  )
}

