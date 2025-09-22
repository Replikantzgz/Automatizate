export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Política de Privacidad</h1>
          <p className="mt-2 text-gray-600">
            Última actualización: {new Date().toLocaleDateString('es-ES')}
          </p>
        </div>

        {/* Content */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
          <div className="prose prose-lg max-w-none">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">1. Información del Responsable</h2>
            <p className="text-gray-700 mb-6">
              <strong>AutoMarket</strong><br />
              Dirección: [Dirección de la empresa]<br />
              Email: privacy@automarket.com<br />
              Teléfono: [Número de teléfono]
            </p>

            <h2 className="text-2xl font-semibold text-gray-900 mb-4">2. Datos Personales que Recopilamos</h2>
            <div className="mb-6">
              <h3 className="text-xl font-medium text-gray-800 mb-3">2.1 Información de Registro</h3>
              <ul className="list-disc pl-6 text-gray-700 mb-4">
                <li>Nombre completo</li>
                <li>Dirección de email</li>
                <li>Contraseña (encriptada)</li>
                <li>Rol de usuario (Cliente o Experto)</li>
              </ul>

              <h3 className="text-xl font-medium text-gray-800 mb-3">2.2 Información del Perfil</h3>
              <ul className="list-disc pl-6 text-gray-700 mb-4">
                <li>Biografía y experiencia profesional</li>
                <li>Habilidades y especialidades</li>
                <li>Portfolio de trabajos</li>
                <li>Información de contacto adicional</li>
              </ul>

              <h3 className="text-xl font-medium text-gray-800 mb-3">2.3 Información de Proyectos</h3>
              <ul className="list-disc pl-6 text-gray-700 mb-4">
                <li>Título y descripción del proyecto</li>
                <li>Presupuesto y plazos</li>
                <li>Archivos adjuntos</li>
                <li>Comunicaciones entre usuarios</li>
              </ul>

              <h3 className="text-xl font-medium text-gray-800 mb-3">2.4 Información de Pagos</h3>
              <ul className="list-disc pl-6 text-gray-700 mb-4">
                <li>Datos de facturación</li>
                <li>Información de tarjetas de crédito (procesada por Stripe)</li>
                <li>Historial de transacciones</li>
                <li>Facturas y recibos</li>
              </ul>
            </div>

            <h2 className="text-2xl font-semibold text-gray-900 mb-4">3. Finalidad del Tratamiento</h2>
            <p className="text-gray-700 mb-6">
              Utilizamos tus datos personales para:
            </p>
            <ul className="list-disc pl-6 text-gray-700 mb-6">
              <li>Gestionar tu cuenta y perfil de usuario</li>
              <li>Conectar clientes con expertos</li>
              <li>Facilitar la comunicación entre usuarios</li>
              <li>Procesar pagos y generar facturas</li>
              <li>Proporcionar soporte técnico</li>
              <li>Enviar notificaciones importantes</li>
              <li>Mejorar nuestros servicios</li>
              <li>Cumplir con obligaciones legales</li>
            </ul>

            <h2 className="text-2xl font-semibold text-gray-900 mb-4">4. Base Legal del Tratamiento</h2>
            <div className="mb-6">
              <h3 className="text-xl font-medium text-gray-800 mb-3">4.1 Consentimiento</h3>
              <p className="text-gray-700 mb-4">
                Al registrarte en AutoMarket, das tu consentimiento explícito para el 
                tratamiento de tus datos personales según esta política.
              </p>

              <h3 className="text-xl font-medium text-gray-800 mb-3">4.2 Ejecución del Contrato</h3>
              <p className="text-gray-700 mb-4">
                El tratamiento es necesario para la ejecución del contrato de servicios 
                entre tú y AutoMarket.
              </p>

              <h3 className="text-xl font-medium text-gray-800 mb-3">4.3 Interés Legítimo</h3>
              <p className="text-gray-700 mb-4">
                Procesamos ciertos datos para nuestros intereses legítimos, como la 
                mejora de servicios y la seguridad de la plataforma.
              </p>
            </div>

            <h2 className="text-2xl font-semibold text-gray-900 mb-4">5. Compartir Datos con Terceros</h2>
            <p className="text-gray-700 mb-6">
              No vendemos, alquilamos ni compartimos tus datos personales con terceros, 
              excepto en los siguientes casos:
            </p>
            <ul className="list-disc pl-6 text-gray-700 mb-6">
              <li><strong>Proveedores de servicios:</strong> Stripe (pagos), proveedores de email</li>
              <li><strong>Usuarios de la plataforma:</strong> Información básica del perfil para conexiones</li>
              <li><strong>Autoridades legales:</strong> Cuando sea requerido por ley</li>
              <li><strong>Protección de derechos:</strong> Para proteger nuestros derechos y seguridad</li>
            </ul>

            <h2 className="text-2xl font-semibold text-gray-900 mb-4">6. Seguridad de los Datos</h2>
            <p className="text-gray-700 mb-6">
              Implementamos medidas técnicas y organizativas apropiadas para proteger 
              tus datos personales contra acceso no autorizado, alteración, divulgación 
              o destrucción.
            </p>

            <h2 className="text-2xl font-semibold text-gray-900 mb-4">7. Retención de Datos</h2>
            <p className="text-gray-700 mb-6">
              Conservamos tus datos personales durante el tiempo necesario para cumplir 
              con los fines descritos en esta política, o según lo requiera la ley. 
              Los datos se eliminan o anonimizan cuando ya no son necesarios.
            </p>

            <h2 className="text-2xl font-semibold text-gray-900 mb-4">8. Tus Derechos GDPR</h2>
            <div className="mb-6">
              <p className="text-gray-700 mb-4">
                Según el Reglamento General de Protección de Datos (GDPR), tienes los siguientes derechos:
              </p>
              <ul className="list-disc pl-6 text-gray-700 mb-4">
                <li><strong>Acceso:</strong> Solicitar información sobre qué datos tenemos sobre ti</li>
                <li><strong>Rectificación:</strong> Corregir datos inexactos o incompletos</li>
                <li><strong>Supresión:</strong> Solicitar la eliminación de tus datos</li>
                <li><strong>Portabilidad:</strong> Recibir tus datos en formato estructurado</li>
                <li><strong>Limitación:</strong> Restringir el procesamiento de tus datos</li>
                <li><strong>Oposición:</strong> Oponerte al procesamiento de tus datos</li>
                <li><strong>Retirada del consentimiento:</strong> Revocar el consentimiento dado</li>
              </ul>
            </div>

            <h2 className="text-2xl font-semibold text-gray-900 mb-4">9. Ejercer tus Derechos</h2>
            <p className="text-gray-700 mb-6">
              Para ejercer cualquiera de estos derechos, puedes:
            </p>
            <ul className="list-disc pl-6 text-gray-700 mb-6">
              <li>Contactarnos en privacy@automarket.com</li>
              <li>Usar nuestro formulario de solicitud en la configuración de tu cuenta</li>
              <li>Llamarnos al [número de teléfono]</li>
            </ul>

            <h2 className="text-2xl font-semibold text-gray-900 mb-4">10. Cookies y Tecnologías Similares</h2>
            <p className="text-gray-700 mb-6">
              Utilizamos cookies y tecnologías similares para mejorar tu experiencia, 
              analizar el uso de la plataforma y personalizar el contenido. Puedes 
              gestionar tus preferencias de cookies en la configuración de tu navegador.
            </p>

            <h2 className="text-2xl font-semibold text-gray-900 mb-4">11. Transferencias Internacionales</h2>
            <p className="text-gray-700 mb-6">
              Tus datos pueden ser transferidos y procesados en países fuera del Espacio 
              Económico Europeo. Garantizamos que estas transferencias cumplan con las 
              salvaguardas adecuadas según el GDPR.
            </p>

            <h2 className="text-2xl font-semibold text-gray-900 mb-4">12. Menores de Edad</h2>
            <p className="text-gray-700 mb-6">
              Nuestros servicios no están dirigidos a menores de 16 años. No recopilamos 
              intencionalmente datos personales de menores. Si eres menor de edad, 
              no utilices nuestros servicios.
            </p>

            <h2 className="text-2xl font-semibold text-gray-900 mb-4">13. Cambios en esta Política</h2>
            <p className="text-gray-700 mb-6">
              Podemos actualizar esta política de privacidad ocasionalmente. Te notificaremos 
              de cualquier cambio significativo por email o a través de la plataforma.
            </p>

            <h2 className="text-2xl font-semibold text-gray-900 mb-4">14. Autoridad de Control</h2>
            <p className="text-gray-700 mb-6">
              Si tienes alguna queja sobre el tratamiento de tus datos personales, 
              puedes contactar a la Agencia Española de Protección de Datos (AEPD) 
              o a la autoridad de control correspondiente en tu país.
            </p>

            <h2 className="text-2xl font-semibold text-gray-900 mb-4">15. Contacto</h2>
            <p className="text-gray-700 mb-6">
              Para cualquier pregunta sobre esta política de privacidad o el tratamiento 
              de tus datos personales, contacta con nuestro Delegado de Protección de Datos:
            </p>
            <p className="text-gray-700 mb-6">
              <strong>Email:</strong> dpo@automarket.com<br />
              <strong>Dirección:</strong> [Dirección del DPO]<br />
              <strong>Teléfono:</strong> [Teléfono del DPO]
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



