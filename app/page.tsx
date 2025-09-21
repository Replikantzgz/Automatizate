import Link from 'next/link'

export default function Home() {
  return (
    <div className="bg-background">
      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            Conecta con expertos en{' '}
            <span className="text-primary">automatización</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            AutoMarket es la plataforma que conecta empresas y autónomos con profesionales 
            especializados en automatización de procesos empresariales.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/register" className="btn-primary text-lg px-8 py-3">
              Comenzar ahora
            </Link>
            <Link href="/login" className="btn-secondary text-lg px-8 py-3">
              Ya tengo cuenta
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-16">
            ¿Cómo funciona?
          </h2>
          <div className="grid md:grid-cols-2 gap-12">
            <div className="text-center">
              <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-white text-2xl font-bold">C</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                Para Clientes
              </h3>
              <p className="text-gray-600">
                Publica tus proyectos de automatización y encuentra al experto perfecto 
                para implementar soluciones eficientes.
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-white text-2xl font-bold">E</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                Para Expertos
              </h3>
              <p className="text-gray-600">
                Encuentra proyectos interesantes y ofrece tus servicios de automatización 
                a empresas que los necesitan.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">
            ¿Listo para empezar?
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            Únete a nuestra comunidad y transforma la forma en que trabajas.
          </p>
          <Link href="/register" className="btn-primary text-lg px-8 py-3">
            Crear cuenta gratuita
          </Link>
        </div>
      </section>
    </div>
  )
}

