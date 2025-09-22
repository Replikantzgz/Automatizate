'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { UserProfile } from '@/lib/supabase'

interface Payment {
  id: string
  amount: number
  status: string
  created_at: string
  project_title?: string
  expert_name?: string
  client_name?: string
}

interface PaymentHistoryProps {
  user: UserProfile
}

export default function PaymentHistory({ user }: PaymentHistoryProps) {
  const [payments, setPayments] = useState<Payment[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchPayments()
  }, [user])

  const fetchPayments = async () => {
    try {
      let query = supabase
        .from('transactions')
        .select(`
          *,
          projects!inner(title),
          profiles!transactions_expert_id_fkey(full_name)
        `)
        .order('created_at', { ascending: false })

      if (user.role === 'cliente') {
        query = query.eq('client_id', user.id)
      } else {
        query = query.eq('expert_id', user.id)
      }

      const { data, error } = await query

      if (error) {
        console.error('Error fetching payments:', error)
        return
      }

      const formattedPayments = data?.map(payment => ({
        id: payment.id,
        amount: payment.amount,
        status: payment.status,
        created_at: payment.created_at,
        project_title: payment.projects?.title,
        expert_name: user.role === 'cliente' ? payment.profiles?.full_name : undefined,
        client_name: user.role === 'experto' ? payment.profiles?.full_name : undefined
      })) || []

      setPayments(formattedPayments)
    } catch (error) {
      console.error('Error fetching payments:', error)
    } finally {
      setLoading(false)
    }
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: 'EUR'
    }).format(amount)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800'
      case 'pending':
        return 'bg-yellow-100 text-yellow-800'
      case 'failed':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'completed':
        return 'Completado'
      case 'pending':
        return 'Pendiente'
      case 'failed':
        return 'Fallido'
      default:
        return status
    }
  }

  if (loading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-1/4 mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/3"></div>
          </div>
        ))}
      </div>
    )
  }

  if (payments.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
        <div className="text-gray-400 mb-4">
          <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
          </svg>
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          {user.role === 'cliente' ? 'No hay pagos realizados' : 'No hay ingresos recibidos'}
        </h3>
        <p className="text-gray-500">
          {user.role === 'cliente' 
            ? 'Cuando realices pagos a expertos, aparecerán aquí.'
            : 'Cuando recibas pagos por proyectos, aparecerán aquí.'
          }
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {payments.map((payment) => (
        <div key={payment.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <div className="flex items-center space-x-3">
                <h3 className="text-lg font-medium text-gray-900">
                  {payment.project_title || 'Proyecto sin título'}
                </h3>
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(payment.status)}`}>
                  {getStatusText(payment.status)}
                </span>
              </div>
              <p className="text-sm text-gray-500 mt-1">
                {user.role === 'cliente' 
                  ? `Pagado a: ${payment.expert_name || 'Experto'}`
                  : `Recibido de: ${payment.client_name || 'Cliente'}`
                }
              </p>
              <p className="text-sm text-gray-500">
                {new Date(payment.created_at).toLocaleDateString('es-ES', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </p>
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold text-gray-900">
                {formatCurrency(payment.amount)}
              </p>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
