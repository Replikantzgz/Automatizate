'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { Download, Trash2, AlertTriangle, Shield, FileText, Eye, Lock } from 'lucide-react'

export default function PrivacyPage() {
  const [loading, setLoading] = useState(false)
  const [exportLoading, setExportLoading] = useState(false)
  const [deleteLoading, setDeleteLoading] = useState(false)
  const [deleteConfirmation, setDeleteConfirmation] = useState('')
  const [deleteReason, setDeleteReason] = useState('')
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)
  const router = useRouter()
  const supabase = createClientComponentClient()

  useEffect(() => {
    checkAuth()
  }, [])

  const checkAuth = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        router.push('/login')
        return
      }
    } catch (error) {
      console.error('Error checking auth:', error)
      router.push('/login')
    }
  }

  const handleExportData = async () => {
    try {
      setExportLoading(true)
      setMessage(null)
      
      const response = await fetch('/api/gdpr/export')
      
      if (response.ok) {
        const blob = await response.blob()
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `automarket-data-${new Date().toISOString().split('T')[0]}.json`
        document.body.appendChild(a)
        a.click()
        window.URL.revokeObjectURL(url)
        document.body.removeChild(a)
        
        setMessage({
          type: 'success',
          text: 'Datos exportados correctamente. El archivo se ha descargado.'
        })
      } else {
        const error = await response.json()
        setMessage({
          type: 'error',
          text: error.error || 'Error exportando datos'
        })
      }
    } catch (error) {
      console.error('Error exporting data:', error)
      setMessage({
        type: 'error',
        text: 'Error exportando datos'
      })
    } finally {
      setExportLoading(false)
    }
  }

  const handleDeleteRequest = async () => {
    if (deleteConfirmation !== 'ELIMINAR') {
      setMessage({
        type: 'error',
        text: 'Debes escribir "ELIMINAR" para confirmar la solicitud'
      })
      return
    }

    try {
      setDeleteLoading(true)
      setMessage(null)
      
      const response = await fetch('/api/gdpr/delete', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          reason: deleteReason,
          confirmation: deleteConfirmation
        })
      })
      
      const data = await response.json()
      
      if (response.ok) {
        setMessage({
          type: 'success',
          text: data.message
        })
        setShowDeleteModal(false)
        setDeleteConfirmation('')
        setDeleteReason('')
        
        // Redirigir al login después de un momento
        setTimeout(() => {
          router.push('/login')
        }, 3000)
      } else {
        setMessage({
          type: 'error',
          text: data.error || 'Error procesando la solicitud'
        })
      }
    } catch (error) {
      console.error('Error requesting deletion:', error)
      setMessage({
        type: 'error',
        text: 'Error procesando la solicitud'
      })
    } finally {
      setDeleteLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Configuración de Privacidad</h1>
          <p className="mt-2 text-gray-600">
            Gestiona tus datos personales y derechos GDPR
          </p>
        </div>

        {/* Message */}
        {message && (
          <div className={`mb-6 p-4 rounded-md ${
            message.type === 'success' 
              ? 'bg-green-50 border border-green-200 text-green-800' 
              : 'bg-red-50 border border-red-200 text-red-800'
          }`}>
            {message.text}
          </div>
        )}

        {/* Privacy Rights Section */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex items-center gap-3 mb-4">
            <Shield className="h-6 w-6 text-blue-600" />
            <h2 className="text-xl font-semibold text-gray-900">Tus Derechos GDPR</h2>
          </div>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-900">Derecho de Acceso</h3>
              <p className="text-gray-600 text-sm">
                Puedes solicitar una copia de todos los datos personales que tenemos sobre ti.
              </p>
              <button
                onClick={handleExportData}
                disabled={exportLoading}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors disabled:opacity-50"
              >
                {exportLoading ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                ) : (
                  <Download className="h-4 w-4 mr-2" />
                )}
                Exportar Mis Datos
              </button>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-900">Derecho de Supresión</h3>
              <p className="text-gray-600 text-sm">
                Puedes solicitar la eliminación de tu cuenta y datos personales.
              </p>
              <button
                onClick={() => setShowDeleteModal(true)}
                className="inline-flex items-center px-4 py-2 border border-red-300 text-sm font-medium rounded-md text-red-700 bg-white hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Solicitar Eliminación
              </button>
            </div>
          </div>
        </div>

        {/* Data Usage Section */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex items-center gap-3 mb-4">
            <Eye className="h-6 w-6 text-green-600" />
            <h2 className="text-xl font-semibold text-gray-900">Cómo Utilizamos Tus Datos</h2>
          </div>
          
          <div className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div className="p-4 bg-gray-50 rounded-lg">
                <h4 className="font-medium text-gray-900 mb-2">Datos de Perfil</h4>
                <p className="text-sm text-gray-600">
                  Nombre, biografía, habilidades y portfolio para conectar con otros usuarios.
                </p>
              </div>
              
              <div className="p-4 bg-gray-50 rounded-lg">
                <h4 className="font-medium text-gray-900 mb-2">Datos de Proyectos</h4>
                <p className="text-sm text-gray-600">
                  Información de proyectos para facilitar la conexión cliente-experto.
                </p>
              </div>
              
              <div className="p-4 bg-gray-50 rounded-lg">
                <h4 className="font-medium text-gray-900 mb-2">Datos de Comunicación</h4>
                <p className="text-sm text-gray-600">
                  Mensajes y notificaciones para facilitar la colaboración.
                </p>
              </div>
              
              <div className="p-4 bg-gray-50 rounded-lg">
                <h4 className="font-medium text-gray-900 mb-2">Datos Financieros</h4>
                <p className="text-sm text-gray-600">
                  Transacciones y facturas procesadas por Stripe para pagos seguros.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Legal Links Section */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex items-center gap-3 mb-4">
            <FileText className="h-6 w-6 text-purple-600" />
            <h2 className="text-xl font-semibold text-gray-900">Documentos Legales</h2>
          </div>
          
          <div className="grid md:grid-cols-3 gap-4">
            <a
              href="/legal/terms"
              className="p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-colors"
            >
              <h4 className="font-medium text-gray-900 mb-2">Términos y Condiciones</h4>
              <p className="text-sm text-gray-600">
                Condiciones de uso de la plataforma
              </p>
            </a>
            
            <a
              href="/legal/privacy"
              className="p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-colors"
            >
              <h4 className="font-medium text-gray-900 mb-2">Política de Privacidad</h4>
              <p className="text-sm text-gray-600">
                Cómo protegemos y utilizamos tus datos
              </p>
            </a>
            
            <a
              href="/legal/cookies"
              className="p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-colors"
            >
              <h4 className="font-medium text-gray-900 mb-2">Política de Cookies</h4>
              <p className="text-sm text-gray-600">
                Uso de cookies y tecnologías similares
              </p>
            </a>
          </div>
        </div>

        {/* Back Button */}
        <div className="text-center">
          <button
            onClick={() => router.back()}
            className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
          >
            ← Volver
          </button>
        </div>
      </div>

      {/* Delete Account Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <div className="flex items-center gap-3 mb-4">
                <AlertTriangle className="h-6 w-6 text-red-600" />
                <h3 className="text-lg font-medium text-gray-900">Eliminar Cuenta</h3>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Motivo de la eliminación (opcional)
                  </label>
                  <textarea
                    value={deleteReason}
                    onChange={(e) => setDeleteReason(e.target.value)}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="¿Por qué quieres eliminar tu cuenta?"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Confirmación
                  </label>
                  <input
                    type="text"
                    value={deleteConfirmation}
                    onChange={(e) => setDeleteConfirmation(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Escribe 'ELIMINAR' para confirmar"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Esta acción no se puede deshacer. Todos tus datos serán anonimizados.
                  </p>
                </div>
              </div>
              
              <div className="flex gap-3 mt-6">
                <button
                  onClick={() => setShowDeleteModal(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleDeleteRequest}
                  disabled={deleteLoading || deleteConfirmation !== 'ELIMINAR'}
                  className="flex-1 px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors disabled:opacity-50"
                >
                  {deleteLoading ? 'Procesando...' : 'Eliminar Cuenta'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

