'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { Payment, Project, UserProfile } from '@/lib/supabase'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Search, Filter, Download, DollarSign, CheckCircle, Clock, AlertTriangle, TrendingUp } from 'lucide-react'

interface PaymentWithDetails extends Payment {
  project?: Project
  client?: UserProfile
  expert?: UserProfile
}

export default function TransaccionesPage() {
  const [payments, setPayments] = useState<PaymentWithDetails[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [dateFilter, setDateFilter] = useState<string>('all')

  useEffect(() => {
    fetchPayments()
  }, [])

  const fetchPayments = async () => {
    try {
      setLoading(true)
      
      // Obtener pagos con detalles
      const { data: paymentsData, error } = await supabase
        .from('payments')
        .select(`
          *,
          project:projects(title, status),
          client:profiles(full_name, email),
          expert:profiles(full_name, email)
        `)
        .order('created_at', { ascending: false })

      if (error) throw error

      setPayments(paymentsData || [])
    } catch (error) {
      console.error('Error fetching payments:', error)
    } finally {
      setLoading(false)
    }
  }

  const filteredPayments = payments.filter(payment => {
    const matchesSearch = payment.project?.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         payment.client?.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         payment.expert?.full_name?.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === 'all' || payment.status === statusFilter
    const matchesDate = dateFilter === 'all' || 
                       (dateFilter === 'this_month' && isThisMonth(payment.created_at)) ||
                       (dateFilter === 'last_month' && isLastMonth(payment.created_at)) ||
                       (dateFilter === 'this_year' && isThisYear(payment.created_at))
    
    return matchesSearch && matchesStatus && matchesDate
  })

  const isThisMonth = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    return date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear()
  }

  const isLastMonth = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1)
    return date.getMonth() === lastMonth.getMonth() && date.getFullYear() === lastMonth.getFullYear()
  }

  const isThisYear = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    return date.getFullYear() === now.getFullYear()
  }

  const getStatusBadge = (status: string) => {
    const badges = {
      pending: 'bg-yellow-100 text-yellow-800',
      paid: 'bg-green-100 text-green-800',
      released: 'bg-blue-100 text-blue-800',
      refunded: 'bg-red-100 text-red-800',
      disputed: 'bg-orange-100 text-orange-800'
    }
    return badges[status as keyof typeof badges] || 'bg-gray-100 text-gray-800'
  }

  const getStatusIcon = (status: string) => {
    if (status === 'pending') return <Clock className="h-4 w-4" />
    if (status === 'paid') return <CheckCircle className="h-4 w-4" />
    if (status === 'released') return <DollarSign className="h-4 w-4" />
    if (status === 'refunded') return <AlertTriangle className="h-4 w-4" />
    if (status === 'disputed') return <AlertTriangle className="h-4 w-4" />
    return <Clock className="h-4 w-4" />
  }

  const calculateTotals = () => {
    const totals = filteredPayments.reduce((acc, payment) => {
      if (payment.status === 'paid' || payment.status === 'released') {
        acc.totalAmount += payment.amount
        acc.totalCommission += payment.commission
        acc.totalExpertAmount += payment.expert_amount
      }
      return acc
    }, { totalAmount: 0, totalCommission: 0, totalExpertAmount: 0 })

    return totals
  }

  const exportToCSV = () => {
    const headers = ['Fecha', 'Proyecto', 'Cliente', 'Experto', 'Importe', 'Comisión', 'Pago Experto', 'Estado', 'ID Stripe']
    
    const csvContent = [
      headers.join(','),
      ...filteredPayments.map(payment => [
        new Date(payment.created_at).toLocaleDateString('es-ES'),
        payment.project?.title || 'N/A',
        payment.client?.full_name || 'N/A',
        payment.expert?.full_name || 'N/A',
        payment.amount,
        payment.commission,
        payment.expert_amount,
        payment.status,
        payment.stripe_payment_intent_id
      ].join(','))
    ].join('\n')

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    const url = URL.createObjectURL(blob)
    link.setAttribute('href', url)
    link.setAttribute('download', `transacciones_${new Date().toISOString().split('T')[0]}.csv`)
    link.style.visibility = 'hidden'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const { totalAmount, totalCommission, totalExpertAmount } = calculateTotals()

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg">Cargando transacciones...</div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Gestión de Transacciones</h1>
        <p className="text-gray-600 mt-2">Visualiza pagos, comisiones y exporta datos financieros</p>
      </div>

      {/* Resumen financiero */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Total Ingresos</CardTitle>
            <DollarSign className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">€{totalAmount.toFixed(2)}</div>
            <p className="text-xs text-gray-500">Pagos confirmados y liberados</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Total Comisiones</CardTitle>
            <TrendingUp className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">€{totalCommission.toFixed(2)}</div>
            <p className="text-xs text-gray-500">Ingresos de la plataforma</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Pagos a Expertos</CardTitle>
            <CheckCircle className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">€{totalExpertAmount.toFixed(2)}</div>
            <p className="text-xs text-gray-500">Transferido a expertos</p>
          </CardContent>
        </Card>
      </div>

      {/* Filtros y exportación */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="flex flex-col md:flex-row gap-4 flex-1">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <input
                    type="text"
                    placeholder="Buscar por proyecto, cliente o experto..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
              
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">Todos los estados</option>
                <option value="pending">Pendiente</option>
                <option value="paid">Pagado</option>
                <option value="released">Liberado</option>
                <option value="refunded">Reembolsado</option>
                <option value="disputed">Disputado</option>
              </select>
              
              <select
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">Todas las fechas</option>
                <option value="this_month">Este mes</option>
                <option value="last_month">Mes pasado</option>
                <option value="this_year">Este año</option>
              </select>
            </div>
            
            <button
              onClick={exportToCSV}
              className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors flex items-center gap-2"
            >
              <Download className="h-4 w-4" />
              Exportar CSV
            </button>
          </div>
        </CardContent>
      </Card>

      {/* Tabla de transacciones */}
      <Card>
        <CardHeader>
          <CardTitle>Transacciones ({filteredPayments.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 font-medium text-gray-900">Fecha</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900">Proyecto</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900">Cliente</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900">Experto</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900">Importe</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900">Comisión</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900">Pago Experto</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900">Estado</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900">ID Stripe</th>
                </tr>
              </thead>
              <tbody>
                {filteredPayments.map((payment) => (
                  <tr key={payment.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-4 px-4 text-sm text-gray-500">
                      {new Date(payment.created_at).toLocaleDateString('es-ES')}
                      <br />
                      <span className="text-xs text-gray-400">
                        {new Date(payment.created_at).toLocaleTimeString('es-ES')}
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      <div>
                        <div className="font-medium text-gray-900">{payment.project?.title}</div>
                        <div className="text-sm text-gray-500">
                          Estado: {payment.project?.status}
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <div>
                        <div className="font-medium text-gray-900">{payment.client?.full_name}</div>
                        <div className="text-sm text-gray-500">{payment.client?.email}</div>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <div>
                        <div className="font-medium text-gray-900">{payment.expert?.full_name}</div>
                        <div className="text-sm text-gray-500">{payment.expert?.email}</div>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <div className="text-lg font-semibold text-green-600">€{payment.amount}</div>
                      <div className="text-sm text-gray-500">{payment.currency}</div>
                    </td>
                    <td className="py-4 px-4">
                      <div className="text-sm font-medium text-blue-600">€{payment.commission}</div>
                      <div className="text-xs text-gray-500">
                        {((payment.commission / payment.amount) * 100).toFixed(1)}%
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <div className="text-sm font-medium text-purple-600">€{payment.expert_amount}</div>
                    </td>
                    <td className="py-4 px-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusBadge(payment.status)}`}>
                        {getStatusIcon(payment.status)}
                        <span className="ml-1 capitalize">{payment.status}</span>
                      </span>
                      {payment.released_at && (
                        <div className="text-xs text-gray-500 mt-1">
                          Liberado: {new Date(payment.released_at).toLocaleDateString('es-ES')}
                        </div>
                      )}
                    </td>
                    <td className="py-4 px-4">
                      <div className="text-xs font-mono text-gray-600 break-all max-w-32">
                        {payment.stripe_payment_intent_id}
                      </div>
                      {payment.stripe_transfer_id && (
                        <div className="text-xs font-mono text-gray-500 break-all max-w-32 mt-1">
                          Transfer: {payment.stripe_transfer_id}
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

