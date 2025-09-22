'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { Download, FileText, Calendar, Euro } from 'lucide-react'

interface Invoice {
  id: string
  amount: number
  commission_amount: number
  vat: number
  pdf_url: string
  created_at: string
  transactions: {
    projects: {
      title: string
      description: string
    }
  }
}

export default function InvoicesPage() {
  const [invoices, setInvoices] = useState<Invoice[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()
  const supabase = createClientComponentClient()

  useEffect(() => {
    checkAuthAndFetchInvoices()
  }, [])

  const checkAuthAndFetchInvoices = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        router.push('/login')
        return
      }

      await fetchInvoices()
    } catch (error) {
      console.error('Error checking auth:', error)
      setError('Error de autenticación')
    }
  }

  const fetchInvoices = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/invoices/user')
      const data = await response.json()

      if (data.success) {
        setInvoices(data.invoices)
      } else {
        setError(data.error || 'Error obteniendo facturas')
      }
    } catch (error) {
      console.error('Error fetching invoices:', error)
      setError('Error obteniendo facturas')
    } finally {
      setLoading(false)
    }
  }

  const downloadInvoice = async (pdfUrl: string, invoiceNumber: string) => {
    try {
      const response = await fetch(pdfUrl)
      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `factura-${invoiceNumber}.pdf`
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)
    } catch (error) {
      console.error('Error downloading invoice:', error)
      alert('Error descargando la factura')
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: 'EUR'
    }).format(amount)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Cargando facturas...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Mis Facturas</h1>
          <p className="mt-2 text-gray-600">
            Gestiona y descarga todas tus facturas y recibos
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-md p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-red-800">{error}</p>
              </div>
            </div>
          </div>
        )}

        {/* Invoices List */}
        {invoices.length === 0 ? (
          <div className="text-center py-12">
            <FileText className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No hay facturas</h3>
            <p className="mt-1 text-sm text-gray-500">
              Aún no tienes facturas. Las facturas se generan automáticamente cuando se confirman los pagos.
            </p>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {invoices.map((invoice) => (
              <div key={invoice.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
                {/* Invoice Header */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center">
                    <FileText className="h-5 w-5 text-blue-600 mr-2" />
                    <span className="text-sm font-medium text-gray-900">
                      Factura #{invoice.id.slice(0, 8).toUpperCase()}
                    </span>
                  </div>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    Pagada
                  </span>
                </div>

                {/* Project Info */}
                <div className="mb-4">
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    {invoice.transactions.projects.title}
                  </h3>
                  <p className="text-sm text-gray-600 line-clamp-2">
                    {invoice.transactions.projects.description}
                  </p>
                </div>

                {/* Invoice Details */}
                <div className="space-y-2 mb-4">
                  <div className="flex items-center text-sm text-gray-600">
                    <Calendar className="h-4 w-4 mr-2" />
                    {formatDate(invoice.created_at)}
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <Euro className="h-4 w-4 mr-2" />
                    Total: {formatCurrency(invoice.amount + invoice.vat)}
                  </div>
                  {invoice.commission_amount > 0 && (
                    <div className="text-xs text-gray-500">
                      Comisión: {formatCurrency(invoice.commission_amount)}
                    </div>
                  )}
                </div>

                {/* Actions */}
                <div className="flex justify-end">
                  <button
                    onClick={() => downloadInvoice(invoice.pdf_url, invoice.id.slice(0, 8).toUpperCase())}
                    className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Descargar PDF
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Back Button */}
        <div className="mt-8">
          <button
            onClick={() => router.back()}
            className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
          >
            ← Volver
          </button>
        </div>
      </div>
    </div>
  )
}



