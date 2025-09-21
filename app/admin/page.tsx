import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { 
  Users, 
  Briefcase, 
  FileText, 
  DollarSign,
  TrendingUp,
  CheckCircle,
  Clock,
  AlertCircle
} from 'lucide-react'

export default async function AdminDashboard() {
  const supabase = createServerComponentClient({ cookies })

  // Obtener estadísticas generales
  const [
    { count: totalUsers },
    { count: totalProjects },
    { count: totalProposals },
    { count: totalContracts },
    { count: activeProjects },
    { count: completedProjects },
    { count: pendingPayments },
    { count: totalRevenue }
  ] = await Promise.all([
    supabase.from('profiles').select('*', { count: 'exact', head: true }),
    supabase.from('projects').select('*', { count: 'exact', head: true }),
    supabase.from('proposals').select('*', { count: 'exact', head: true }),
    supabase.from('contracts').select('*', { count: 'exact', head: true }),
    supabase.from('projects').select('*', { count: 'exact', head: true }).eq('status', 'en_proceso'),
    supabase.from('projects').select('*', { count: 'exact', head: true }).eq('status', 'completado'),
    supabase.from('payments').select('*', { count: 'exact', head: true }).eq('status', 'pending'),
    supabase.from('payments').select('amount', { count: 'exact', head: true }).eq('status', 'paid')
  ])

  const stats = [
    {
      title: 'Total Usuarios',
      value: totalUsers || 0,
      icon: Users,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100'
    },
    {
      title: 'Total Proyectos',
      value: totalProjects || 0,
      icon: Briefcase,
      color: 'text-green-600',
      bgColor: 'bg-green-100'
    },
    {
      title: 'Propuestas',
      value: totalProposals || 0,
      icon: FileText,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100'
    },
    {
      title: 'Contratos Activos',
      value: totalContracts || 0,
      icon: CheckCircle,
      color: 'text-emerald-600',
      bgColor: 'bg-emerald-100'
    },
    {
      title: 'Proyectos en Proceso',
      value: activeProjects || 0,
      icon: Clock,
      color: 'text-orange-600',
      bgColor: 'bg-orange-100'
    },
    {
      title: 'Proyectos Completados',
      value: completedProjects || 0,
      icon: CheckCircle,
      color: 'text-green-600',
      bgColor: 'bg-green-100'
    },
    {
      title: 'Pagos Pendientes',
      value: pendingPayments || 0,
      icon: AlertCircle,
      color: 'text-red-600',
      bgColor: 'bg-red-100'
    },
    {
      title: 'Ingresos Totales',
      value: `€${totalRevenue || 0}`,
      icon: DollarSign,
      color: 'text-emerald-600',
      bgColor: 'bg-emerald-100'
    }
  ]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Panel de Administración</h1>
        <p className="text-gray-600 mt-2">Bienvenido al panel de control de AutoMarket</p>
      </div>

      {/* Estadísticas generales */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <Card key={index} className="hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                {stat.title}
              </CardTitle>
              <div className={`p-2 rounded-full ${stat.bgColor}`}>
                <stat.icon className={`h-4 w-4 ${stat.color}`} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">
                {stat.value}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Acciones rápidas */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-blue-600" />
              Acciones Rápidas
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <span className="text-sm text-gray-600">Usuarios pendientes de verificación</span>
              <span className="text-sm font-medium text-blue-600">0</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <span className="text-sm text-gray-600">Proyectos reportados</span>
              <span className="text-sm font-medium text-red-600">0</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <span className="text-sm text-gray-600">Pagos por liberar</span>
              <span className="text-sm font-medium text-orange-600">0</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <DollarSign className="h-5 w-5 text-green-600" />
              Resumen Financiero
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <span className="text-sm text-gray-600">Comisiones este mes</span>
              <span className="text-sm font-medium text-green-600">€0</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <span className="text-sm text-gray-600">GMV mensual</span>
              <span className="text-sm font-medium text-blue-600">€0</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <span className="text-sm text-gray-600">Tasa de conversión</span>
              <span className="text-sm font-medium text-purple-600">0%</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

