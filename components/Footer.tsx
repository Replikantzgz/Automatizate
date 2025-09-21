export default function Footer() {
  return (
    <footer className="bg-white border-t border-gray-200 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid md:grid-cols-3 gap-8">
          {/* Company Info */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">AutoMarket</h3>
            <p className="text-gray-600 text-sm">
              Conectando clientes con expertos en automatización
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Enlaces rápidos</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="/projects" className="text-gray-600 hover:text-gray-900 transition-colors">
                  Explorar proyectos
                </a>
              </li>
              <li>
                <a href="/projects/create" className="text-gray-600 hover:text-gray-900 transition-colors">
                  Crear proyecto
                </a>
              </li>
              <li>
                <a href="/conversations" className="text-gray-600 hover:text-gray-900 transition-colors">
                  Mensajes
                </a>
              </li>
            </ul>
          </div>

          {/* Legal Links */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Legal</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="/legal/terms" className="text-gray-600 hover:text-gray-900 transition-colors">
                  Términos y condiciones
                </a>
              </li>
              <li>
                <a href="/legal/privacy" className="text-gray-600 hover:text-gray-900 transition-colors">
                  Política de privacidad
                </a>
              </li>
              <li>
                <a href="/legal/cookies" className="text-gray-600 hover:text-gray-900 transition-colors">
                  Política de cookies
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-200 mt-8 pt-8 text-center">
          <p className="text-gray-600 text-sm">
            © 2024 AutoMarket. Todos los derechos reservados.
          </p>
        </div>
      </div>
    </footer>
  )
}
