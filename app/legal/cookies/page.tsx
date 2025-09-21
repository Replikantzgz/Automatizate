export default function CookiesPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Política de Cookies</h1>
          <p className="mt-2 text-gray-600">
            Última actualización: {new Date().toLocaleDateString('es-ES')}
          </p>
        </div>

        {/* Content */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
          <div className="prose prose-lg max-w-none">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">1. ¿Qué son las Cookies?</h2>
            <p className="text-gray-700 mb-6">
              Las cookies son pequeños archivos de texto que se almacenan en tu dispositivo 
              (ordenador, tablet o móvil) cuando visitas un sitio web. Estas cookies 
              permiten que el sitio web recuerde tus acciones y preferencias durante un 
              período de tiempo, para que no tengas que volver a introducirlas cada vez 
              que visitas el sitio.
            </p>

            <h2 className="text-2xl font-semibold text-gray-900 mb-4">2. Tipos de Cookies que Utilizamos</h2>
            <div className="mb-6">
              <h3 className="text-xl font-medium text-gray-800 mb-3">2.1 Cookies Técnicas (Necesarias)</h3>
              <p className="text-gray-700 mb-4">
                Estas cookies son esenciales para el funcionamiento de AutoMarket y no se pueden desactivar:
              </p>
              <ul className="list-disc pl-6 text-gray-700 mb-4">
                <li><strong>Cookies de sesión:</strong> Mantienen tu sesión activa mientras navegas</li>
                <li><strong>Cookies de autenticación:</strong> Recuerdan que has iniciado sesión</li>
                <li><strong>Cookies de seguridad:</strong> Protegen contra ataques y fraudes</li>
                <li><strong>Cookies de preferencias:</strong> Almacenan configuraciones básicas</li>
              </ul>

              <h3 className="text-xl font-medium text-gray-800 mb-3">2.2 Cookies de Funcionalidad</h3>
              <p className="text-gray-700 mb-4">
                Mejoran tu experiencia recordando tus preferencias:
              </p>
              <ul className="list-disc pl-6 text-gray-700 mb-4">
                <li>Idioma preferido</li>
                <li>Configuración de notificaciones</li>
                <li>Preferencias de visualización</li>
                <li>Historial de búsquedas</li>
              </ul>

              <h3 className="text-xl font-medium text-gray-800 mb-3">2.3 Cookies de Análisis</h3>
              <p className="text-gray-700 mb-4">
                Nos ayudan a entender cómo utilizas la plataforma:
              </p>
              <ul className="list-disc pl-6 text-gray-700 mb-4">
                <li>Páginas más visitadas</li>
                <li>Tiempo de permanencia</li>
                <li>Rutas de navegación</li>
                <li>Errores y problemas técnicos</li>
              </ul>

              <h3 className="text-xl font-medium text-gray-800 mb-3">2.4 Cookies de Marketing</h3>
              <p className="text-gray-700 mb-4">
                Utilizadas para mostrar contenido relevante:
              </p>
              <ul className="list-disc pl-6 text-gray-700 mb-4">
                <li>Recomendaciones personalizadas</li>
                <li>Anuncios relevantes</li>
                <li>Contenido promocional</li>
                <li>Segmentación de audiencia</li>
              </ul>
            </div>

            <h2 className="text-2xl font-semibold text-gray-900 mb-4">3. Cookies de Terceros</h2>
            <div className="mb-6">
              <h3 className="text-xl font-medium text-gray-800 mb-3">3.1 Stripe</h3>
              <p className="text-gray-700 mb-4">
                Utilizamos Stripe para procesar pagos. Stripe puede establecer cookies 
                para garantizar la seguridad de las transacciones y mejorar la experiencia 
                de pago.
              </p>

              <h3 className="text-xl font-medium text-gray-800 mb-3">3.2 Google Analytics</h3>
              <p className="text-gray-700 mb-4">
                Utilizamos Google Analytics para analizar el tráfico del sitio y 
                mejorar nuestros servicios. Google puede establecer cookies para 
                recopilar información sobre el uso del sitio.
              </p>

              <h3 className="text-xl font-medium text-gray-800 mb-3">3.3 Redes Sociales</h3>
              <p className="text-gray-700 mb-4">
                Si utilizas funciones de redes sociales en nuestra plataforma, 
                estas pueden establecer cookies para recordar tus preferencias.
              </p>
            </div>

            <h2 className="text-2xl font-semibold text-gray-900 mb-4">4. Duración de las Cookies</h2>
            <div className="mb-6">
              <h3 className="text-xl font-medium text-gray-800 mb-3">4.1 Cookies de Sesión</h3>
              <p className="text-gray-700 mb-4">
                Se eliminan automáticamente cuando cierras el navegador o la pestaña.
              </p>

              <h3 className="text-xl font-medium text-gray-800 mb-3">4.2 Cookies Persistentes</h3>
              <p className="text-gray-700 mb-4">
                Permanecen en tu dispositivo durante un período específico o hasta que las elimines manualmente:
              </p>
              <ul className="list-disc pl-6 text-gray-700 mb-4">
                <li><strong>Cookies de autenticación:</strong> Hasta 30 días</li>
                <li><strong>Cookies de preferencias:</strong> Hasta 1 año</li>
                <li><strong>Cookies de análisis:</strong> Hasta 2 años</li>
                <li><strong>Cookies de marketing:</strong> Hasta 1 año</li>
              </ul>
            </div>

            <h2 className="text-2xl font-semibold text-gray-900 mb-4">5. Gestión de Cookies</h2>
            <div className="mb-6">
              <h3 className="text-xl font-medium text-gray-800 mb-3">5.1 Configuración del Navegador</h3>
              <p className="text-gray-700 mb-4">
                Puedes configurar tu navegador para rechazar todas las cookies o para 
                que te avise cuando se envíe una cookie. Sin embargo, si rechazas 
                las cookies, es posible que algunas partes de AutoMarket no funcionen correctamente.
              </p>

              <h3 className="text-xl font-medium text-gray-800 mb-3">5.2 Panel de Preferencias</h3>
              <p className="text-gray-700 mb-4">
                En la configuración de tu cuenta de AutoMarket, puedes gestionar 
                ciertas preferencias relacionadas con cookies y tecnologías similares.
              </p>

              <h3 className="text-xl font-medium text-gray-800 mb-3">5.3 Herramientas de Terceros</h3>
              <p className="text-gray-700 mb-4">
                Puedes utilizar herramientas como:
              </p>
              <ul className="list-disc pl-6 text-gray-700 mb-4">
                <li>AdBlock Plus</li>
                <li>Ghostery</li>
                <li>Privacy Badger</li>
                <li>Configuración de privacidad del navegador</li>
              </ul>
            </div>

            <h2 className="text-2xl font-semibold text-gray-900 mb-4">6. Cookies Específicas de AutoMarket</h2>
            <div className="mb-6">
              <table className="min-w-full border border-gray-200">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="px-4 py-2 text-left text-sm font-medium text-gray-900 border-b">Nombre</th>
                    <th className="px-4 py-2 text-left text-sm font-medium text-gray-900 border-b">Propósito</th>
                    <th className="px-4 py-2 text-left text-sm font-medium text-gray-900 border-b">Duración</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="px-4 py-2 text-sm text-gray-700 border-b">auth_token</td>
                    <td className="px-4 py-2 text-sm text-gray-700 border-b">Mantener sesión del usuario</td>
                    <td className="px-4 py-2 text-sm text-gray-700 border-b">30 días</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-2 text-sm text-gray-700 border-b">user_preferences</td>
                    <td className="px-4 py-2 text-sm text-gray-700 border-b">Almacenar preferencias del usuario</td>
                    <td className="px-4 py-2 text-sm text-gray-700 border-b">1 año</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-2 text-sm text-gray-700 border-b">notification_settings</td>
                    <td className="px-4 py-2 text-sm text-gray-700 border-b">Configuración de notificaciones</td>
                    <td className="px-4 py-2 text-sm text-gray-700 border-b">1 año</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-2 text-sm text-gray-700 border-b">search_history</td>
                    <td className="px-4 py-2 text-sm text-gray-700 border-b">Historial de búsquedas</td>
                    <td className="px-4 py-2 text-sm text-gray-700 border-b">6 meses</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <h2 className="text-2xl font-semibold text-gray-900 mb-4">7. Impacto de Desactivar Cookies</h2>
            <p className="text-gray-700 mb-6">
              Si decides desactivar ciertas cookies, es posible que experimentes:
            </p>
            <ul className="list-disc pl-6 text-gray-700 mb-6">
              <li>Necesidad de iniciar sesión cada vez que visites la plataforma</li>
              <li>Pérdida de preferencias y configuraciones personalizadas</li>
              <li>Funcionalidad limitada en ciertas características</li>
              <li>Experiencia de usuario menos personalizada</li>
            </ul>

            <h2 className="text-2xl font-semibold text-gray-900 mb-4">8. Actualizaciones de esta Política</h2>
            <p className="text-gray-700 mb-6">
              Esta política de cookies puede actualizarse ocasionalmente para reflejar 
              cambios en nuestras prácticas o por otras razones operativas, legales o reglamentarias. 
              Te notificaremos de cualquier cambio significativo.
            </p>

            <h2 className="text-2xl font-semibold text-gray-900 mb-4">9. Contacto</h2>
            <p className="text-gray-700 mb-6">
              Si tienes preguntas sobre nuestra política de cookies o quieres ejercer 
              tus derechos relacionados con el uso de cookies, contacta con nosotros:
            </p>
            <p className="text-gray-700 mb-6">
              <strong>Email:</strong> cookies@automarket.com<br />
              <strong>Asunto:</strong> Consulta sobre Política de Cookies
            </p>

            <div className="bg-blue-50 border border-blue-200 rounded-md p-4 mt-8">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-blue-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-blue-800">Información Importante</h3>
                  <p className="mt-1 text-sm text-blue-700">
                    Al continuar utilizando AutoMarket, aceptas el uso de cookies según 
                    esta política. Puedes cambiar tus preferencias en cualquier momento 
                    desde la configuración de tu cuenta o navegador.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Back Button */}
        <div className="mt-8 text-center">
          <a
            href="/"
            className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
          >
            ← Volver al inicio
          </a>
        </div>
      </div>
    </div>
  )
}

