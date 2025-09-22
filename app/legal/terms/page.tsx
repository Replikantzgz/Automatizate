export default function TermsPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Términos y Condiciones</h1>
          <p className="mt-2 text-gray-600">
            Última actualización: {new Date().toLocaleDateString('es-ES')}
          </p>
        </div>

        {/* Content */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
          <div className="prose prose-lg max-w-none">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">1. Aceptación de los Términos</h2>
            <p className="text-gray-700 mb-6">
              Al acceder y utilizar AutoMarket, aceptas estar sujeto a estos términos y condiciones. 
              Si no estás de acuerdo con alguna parte de estos términos, no debes utilizar nuestro servicio.
            </p>

            <h2 className="text-2xl font-semibold text-gray-900 mb-4">2. Descripción del Servicio</h2>
            <p className="text-gray-700 mb-6">
              AutoMarket es una plataforma que conecta clientes con expertos profesionales para la 
              realización de proyectos y servicios. Facilitamos la comunicación, gestión de pagos 
              y seguimiento de proyectos entre ambas partes.
            </p>

            <h2 className="text-2xl font-semibold text-gray-900 mb-4">3. Registro y Cuentas de Usuario</h2>
            <p className="text-gray-700 mb-6">
              Para utilizar nuestros servicios, debes crear una cuenta proporcionando información 
              precisa y actualizada. Eres responsable de mantener la confidencialidad de tu cuenta 
              y contraseña, así como de todas las actividades que ocurran bajo tu cuenta.
            </p>

            <h2 className="text-2xl font-semibold text-gray-900 mb-4">4. Roles de Usuario</h2>
            <div className="mb-6">
              <h3 className="text-xl font-medium text-gray-800 mb-3">4.1 Cliente</h3>
              <p className="text-gray-700 mb-4">
                Los clientes pueden publicar proyectos, recibir propuestas de expertos, 
                seleccionar expertos y gestionar pagos a través de la plataforma.
              </p>
              
              <h3 className="text-xl font-medium text-gray-800 mb-3">4.2 Experto</h3>
              <p className="text-gray-700 mb-4">
                Los expertos pueden ver proyectos disponibles, enviar propuestas, 
                ejecutar trabajos y recibir pagos por servicios prestados.
              </p>
            </div>

            <h2 className="text-2xl font-semibold text-gray-900 mb-4">5. Publicación de Proyectos</h2>
            <p className="text-gray-700 mb-6">
              Los clientes son responsables de proporcionar descripciones precisas de sus proyectos. 
              La información debe ser veraz, completa y no infringir derechos de terceros.
            </p>

            <h2 className="text-2xl font-semibold text-gray-900 mb-4">6. Propuestas y Contratos</h2>
            <p className="text-gray-700 mb-6">
              Los expertos pueden enviar propuestas para proyectos. Una vez aceptada una propuesta, 
              se crea un contrato entre las partes. Ambas partes deben cumplir con los términos 
              acordados en la propuesta.
            </p>

            <h2 className="text-2xl font-semibold text-gray-900 mb-4">7. Sistema de Pagos</h2>
            <p className="text-gray-700 mb-6">
              Los pagos se procesan a través de Stripe. La plataforma retiene una comisión 
              por cada transacción exitosa. Los pagos se liberan al experto una vez que el 
              cliente confirma la finalización del proyecto.
            </p>

            <h2 className="text-2xl font-semibold text-gray-900 mb-4">8. Calidad del Servicio</h2>
            <p className="text-gray-700 mb-6">
              Los expertos son responsables de la calidad de sus servicios. La plataforma 
              no garantiza la calidad del trabajo realizado, pero facilita la resolución 
              de disputas entre las partes.
            </p>

            <h2 className="text-2xl font-semibold text-gray-900 mb-4">9. Propiedad Intelectual</h2>
            <p className="text-gray-700 mb-6">
              Los derechos de propiedad intelectual de los proyectos y trabajos realizados 
              se rigen por los acuerdos entre cliente y experto. La plataforma no reclama 
              derechos sobre el contenido generado por los usuarios.
            </p>

            <h2 className="text-2xl font-semibold text-gray-900 mb-4">10. Limitación de Responsabilidad</h2>
            <p className="text-gray-700 mb-6">
              AutoMarket actúa como intermediario y no se hace responsable por los servicios 
              prestados por los expertos o por las disputas entre usuarios. Nuestra responsabilidad 
              se limita a facilitar la plataforma y el procesamiento de pagos.
            </p>

            <h2 className="text-2xl font-semibold text-gray-900 mb-4">11. Modificaciones</h2>
            <p className="text-gray-700 mb-6">
              Nos reservamos el derecho de modificar estos términos en cualquier momento. 
              Los cambios serán notificados a los usuarios y entrarán en vigor inmediatamente 
              después de su publicación.
            </p>

            <h2 className="text-2xl font-semibold text-gray-900 mb-4">12. Terminación</h2>
            <p className="text-gray-700 mb-6">
              Podemos terminar o suspender tu cuenta en cualquier momento por violación 
              de estos términos o por cualquier otra razón a nuestra discreción.
            </p>

            <h2 className="text-2xl font-semibold text-gray-900 mb-4">13. Ley Aplicable</h2>
            <p className="text-gray-700 mb-6">
              Estos términos se rigen por las leyes de España. Cualquier disputa será 
              resuelta en los tribunales competentes de Madrid.
            </p>

            <h2 className="text-2xl font-semibold text-gray-900 mb-4">14. Contacto</h2>
            <p className="text-gray-700 mb-6">
              Si tienes preguntas sobre estos términos, puedes contactarnos a través de 
              nuestro formulario de soporte o enviando un email a legal@automarket.com
            </p>
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



