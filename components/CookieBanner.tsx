'use client'

import { useState, useEffect } from 'react'
import { X, Settings, Check, AlertCircle } from 'lucide-react'
import Link from 'next/link'

export default function CookieBanner() {
  const [isVisible, setIsVisible] = useState(false)
  const [showSettings, setShowSettings] = useState(false)
  const [preferences, setPreferences] = useState({
    necessary: true, // Siempre activo
    functional: false,
    analytics: false,
    marketing: false
  })

  useEffect(() => {
    // Verificar si ya se han aceptado las cookies
    const cookiesAccepted = localStorage.getItem('cookiesAccepted')
    if (!cookiesAccepted) {
      setIsVisible(true)
    }
  }, [])

  const handleAcceptAll = () => {
    setPreferences({
      necessary: true,
      functional: true,
      analytics: true,
      marketing: true
    })
    localStorage.setItem('cookiesAccepted', 'all')
    localStorage.setItem('cookiePreferences', JSON.stringify({
      necessary: true,
      functional: true,
      analytics: true,
      marketing: true
    }))
    setIsVisible(false)
  }

  const handleAcceptSelected = () => {
    localStorage.setItem('cookiesAccepted', 'selected')
    localStorage.setItem('cookiePreferences', JSON.stringify(preferences))
    setIsVisible(false)
  }

  const handleRejectAll = () => {
    setPreferences({
      necessary: true,
      functional: false,
      analytics: false,
      marketing: false
    })
    localStorage.setItem('cookiesAccepted', 'rejected')
    localStorage.setItem('cookiePreferences', JSON.stringify({
      necessary: true,
      functional: false,
      analytics: false,
      marketing: false
    }))
    setIsVisible(false)
  }

  const togglePreference = (type: keyof typeof preferences) => {
    if (type === 'necessary') return // No se puede desactivar
    setPreferences(prev => ({
      ...prev,
      [type]: !prev[type]
    }))
  }

  if (!isVisible) return null

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg z-50">
      <div className="max-w-7xl mx-auto px-4 py-4">
        {!showSettings ? (
          /* Banner Principal */
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <AlertCircle className="h-5 w-5 text-blue-600" />
                <h3 className="text-sm font-medium text-gray-900">
                  Utilizamos cookies para mejorar tu experiencia
                </h3>
              </div>
              <p className="text-sm text-gray-600">
                Utilizamos cookies técnicas necesarias para el funcionamiento del sitio, 
                así como cookies opcionales para análisis y personalización. 
                <Link href="/legal/cookies" className="text-blue-600 hover:text-blue-700 underline ml-1">
                  Más información
                </Link>
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
              <button
                onClick={() => setShowSettings(true)}
                className="inline-flex items-center px-3 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
              >
                <Settings className="h-4 w-4 mr-2" />
                Personalizar
              </button>
              <button
                onClick={handleAcceptAll}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
              >
                Aceptar todas
              </button>
            </div>
          </div>
        ) : (
          /* Panel de Configuración */
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium text-gray-900">
                Configuración de Cookies
              </h3>
              <button
                onClick={() => setShowSettings(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            
            <div className="space-y-3">
              {/* Cookies Necesarias */}
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="text-sm font-medium text-gray-900">Cookies Necesarias</h4>
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      Siempre activo
                    </span>
                  </div>
                  <p className="text-xs text-gray-600 mt-1">
                    Cookies esenciales para el funcionamiento básico del sitio
                  </p>
                </div>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    checked={preferences.necessary}
                    disabled
                    className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                </div>
              </div>

              {/* Cookies Funcionales */}
              <div className="flex items-center justify-between p-3 bg-white border border-gray-200 rounded-lg">
                <div>
                  <h4 className="text-sm font-medium text-gray-900">Cookies Funcionales</h4>
                  <p className="text-xs text-gray-600 mt-1">
                    Mejoran la funcionalidad y personalización
                  </p>
                </div>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    checked={preferences.functional}
                    onChange={() => togglePreference('functional')}
                    className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                </div>
              </div>

              {/* Cookies de Análisis */}
              <div className="flex items-center justify-between p-3 bg-white border border-gray-200 rounded-lg">
                <div>
                  <h4 className="text-sm font-medium text-gray-900">Cookies de Análisis</h4>
                  <p className="text-xs text-gray-600 mt-1">
                    Nos ayudan a entender cómo utilizas el sitio
                  </p>
                </div>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    checked={preferences.analytics}
                    onChange={() => togglePreference('analytics')}
                    className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                </div>
              </div>

              {/* Cookies de Marketing */}
              <div className="flex items-center justify-between p-3 bg-white border border-gray-200 rounded-lg">
                <div>
                  <h4 className="text-sm font-medium text-gray-900">Cookies de Marketing</h4>
                  <p className="text-xs text-gray-600 mt-1">
                    Utilizadas para mostrar contenido relevante
                  </p>
                </div>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    checked={preferences.marketing}
                    onChange={() => togglePreference('marketing')}
                    className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-2 pt-2">
              <button
                onClick={handleRejectAll}
                className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
              >
                Rechazar todas
              </button>
              <button
                onClick={handleAcceptSelected}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
              >
                <Check className="h-4 w-4 mr-2" />
                Guardar preferencias
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

