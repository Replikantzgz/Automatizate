'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { 
  TrendingUp, 
  Users, 
  Briefcase, 
  DollarSign,
  BarChart3,
  Calendar,
  Target,
  Percent,
  CheckCircle
} from 'lucide-react'

interface ChartData {
  labels: string[]
  datasets: {
    label: string
    data: number[]
    backgroundColor: string[]
    borderColor: string[]
    borderWidth: number
  }[]
}

interface KPIData {
  projectsThisMonth: number
  proposalConversionRate: number
  monthlyGMV: number
  totalCommission: number
  activeUsers: number
  completedProjects: number
  averageProjectValue: number
  expertEarnings: number
}

export default function ReportesPage() {
  const [kpiData, setKpiData] = useState<KPIData>({
    projectsThisMonth: 0,
    proposalConversionRate: 0,
    monthlyGMV: 0,
    totalCommission: 0,
    activeUsers: 0,
    completedProjects: 0,
    averageProjectValue: 0,
    expertEarnings: 0
  })
  const [loading, setLoading] = useState(true)
  const [timeRange, setTimeRange] = useState<'month' | 'quarter' | 'year'>('month')

  useEffect(() => {
    fetchReportData()
  }, [timeRange])

  const fetchReportData = async () => {
    try {
      setLoading(true)
      
      const now = new Date()
      let startDate: Date
      
      switch (timeRange) {
        case 'month':
          startDate = new Date(now.getFullYear(), now.getMonth(), 1)
          break
        case 'quarter':
          const quarter = Math.floor(now.getMonth() / 3)
          startDate = new Date(now.getFullYear(), quarter * 3, 1)
          break
        case 'year':
          startDate = new Date(now.getFullYear(), 0, 1)
          break
      }

      // Obtener estadísticas generales
      const [
        { count: totalProjects },
        { count: totalProposals },
        { count: totalContracts },
        { count: totalUsers },
        { count: activeUsers },
        { count: completedProjects },
        { data: paymentsData },
        { data: projectsData }
      ] = await Promise.all([
        supabase.from('projects').select('*', { count: 'exact', head: true }),
        supabase.from('proposals').select('*', { count: 'exact', head: true }),
        supabase.from('contracts').select('*', { count: 'exact', head: true }),
        supabase.from('profiles').select('*', { count: 'exact', head: true }),
        supabase.from('profiles').select('*', { count: 'exact', head: true }).neq('role', 'admin'),
        supabase.from('projects').select('*', { count: 'exact', head: true }).eq('status', 'completado'),
        supabase.from('payments').select('amount, commission, expert_amount, status, created_at').gte('created_at', startDate.toISOString()),
        supabase.from('projects').select('budget, created_at').gte('created_at', startDate.toISOString())
      ])

      // Calcular KPIs
      const monthlyGMV = paymentsData?.reduce((sum, payment) => {
        if (payment.status === 'paid' || payment.status === 'released') {
          return sum + payment.amount
        }
        return sum
      }, 0) || 0

      const totalCommission = paymentsData?.reduce((sum, payment) => {
        if (payment.status === 'paid' || payment.status === 'released') {
          return sum + payment.commission
        }
        return sum
      }, 0) || 0

      const expertEarnings = paymentsData?.reduce((sum, payment) => {
        if (payment.status === 'paid' || payment.status === 'released') {
          return sum + payment.expert_amount
        }
        return sum
      }, 0) || 0

      const projectsThisMonth = projectsData?.length || 0
      const proposalConversionRate = totalProposals > 0 ? (totalContracts / totalProposals) * 100 : 0
      const averageProjectValue = projectsData && projectsData.length > 0 
        ? projectsData.reduce((sum, project) => sum + (project.budget || 0), 0) / projectsData.length
        : 0

      setKpiData({
        projectsThisMonth,
        proposalConversionRate,
        monthlyGMV,
        totalCommission,
        activeUsers: activeUsers || 0,
        completedProjects: completedProjects || 0,
        averageProjectValue,
        expertEarnings
      })

    } catch (error) {
      console.error('Error fetching report data:', error)
    } finally {
      setLoading(false)
    }
  }

  const generateMonthlyChartData = (): ChartData => {
    const months = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic']
    const currentMonth = new Date().getMonth()
    
    // Simular datos mensuales (en un caso real, estos vendrían de la base de datos)
    const monthlyData = months.map((_, index) => {
      if (index <= currentMonth) {
        return Math.floor(Math.random() * 100) + 20 // 20-120 proyectos por mes
      }
      return 0
    })

    return {
      labels: months,
      datasets: [{
        label: 'Proyectos',
        data: monthlyData,
        backgroundColor: 'rgba(59, 130, 246, 0.2)',
        borderColor: 'rgba(59, 130, 246, 1)',
        borderWidth: 2
      }]
    }
  }

  const generateConversionChartData = (): ChartData => {
    return {
      labels: ['Propuestas', 'Contratos', 'Completados'],
      datasets: [{
        label: 'Conversión',
        data: [100, kpiData.proposalConversionRate, (kpiData.completedProjects / Math.max(kpiData.projectsThisMonth, 1)) * 100],
        backgroundColor: [
          'rgba(59, 130, 246, 0.2)',
          'rgba(34, 197, 94, 0.2)',
          'rgba(168, 85, 247, 0.2)'
        ],
        borderColor: [
          'rgba(59, 130, 246, 1)',
          'rgba(34, 197, 94, 1)',
          'rgba(168, 85, 247, 1)'
        ],
        borderWidth: 2
      }]
    }
  }

  const SimpleBarChart = ({ data, title }: { data: ChartData, title: string }) => {
    const maxValue = Math.max(...data.datasets[0].data)
    
    return (
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
        <div className="space-y-2">
          {data.labels.map((label, index) => {
            const value = data.datasets[0].data[index]
            const percentage = maxValue > 0 ? (value / maxValue) * 100 : 0
            
            return (
              <div key={label} className="space-y-1">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">{label}</span>
                  <span className="font-medium text-gray-900">{value}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${percentage}%` }}
                  />
                </div>
              </div>
            )
          })}
        </div>
      </div>
    )
  }

  const SimpleLineChart = ({ data, title }: { data: ChartData, title: string }) => {
    const maxValue = Math.max(...data.datasets[0].data)
    const minValue = Math.min(...data.datasets[0].data)
    const range = maxValue - minValue
    
    return (
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
        <div className="relative h-32">
          <svg className="w-full h-full" viewBox={`0 0 ${data.labels.length * 40} 128`}>
            <polyline
              fill="none"
              stroke="rgb(59, 130, 246)"
              strokeWidth="2"
              points={data.datasets[0].data.map((value, index) => {
                const x = index * 40 + 20
                const y = 120 - ((value - minValue) / range) * 100
                return `${x},${y}`
              }).join(' ')}
            />
            {data.datasets[0].data.map((value, index) => {
              const x = index * 40 + 20
              const y = 120 - ((value - minValue) / range) * 100
              return (
                <circle
                  key={index}
                  cx={x}
                  cy={y}
                  r="3"
                  fill="rgb(59, 130, 246)"
                />
              )
            })}
          </svg>
          <div className="flex justify-between text-xs text-gray-500 mt-2">
            {data.labels.map((label, index) => (
              <span key={index} className="text-center flex-1">{label}</span>
            ))}
          </div>
        </div>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg">Cargando reportes...</div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Reportes y KPIs</h1>
        <p className="text-gray-600 mt-2">Análisis de rendimiento y métricas del negocio</p>
      </div>

      {/* Selector de período */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center gap-4">
            <span className="text-sm font-medium text-gray-700">Período:</span>
            <div className="flex gap-2">
              {(['month', 'quarter', 'year'] as const).map((period) => (
                <button
                  key={period}
                  onClick={() => setTimeRange(period)}
                  className={`px-3 py-1 text-sm rounded-md transition-colors ${
                    timeRange === period
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {period === 'month' ? 'Mes' : period === 'quarter' ? 'Trimestre' : 'Año'}
                </button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* KPIs principales */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Proyectos este {timeRange === 'month' ? 'mes' : timeRange === 'quarter' ? 'trimestre' : 'año'}</CardTitle>
            <Briefcase className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{kpiData.projectsThisMonth}</div>
            <p className="text-xs text-gray-500">Nuevos proyectos</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Tasa de Conversión</CardTitle>
            <Target className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{kpiData.proposalConversionRate.toFixed(1)}%</div>
            <p className="text-xs text-gray-500">Propuesta → Contrato</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">GMV {timeRange === 'month' ? 'Mensual' : timeRange === 'quarter' ? 'Trimestral' : 'Anual'}</CardTitle>
            <TrendingUp className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">€{kpiData.monthlyGMV.toLocaleString()}</div>
            <p className="text-xs text-gray-500">Volumen de transacciones</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Comisiones</CardTitle>
            <DollarSign className="h-4 w-4 text-emerald-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-emerald-600">€{kpiData.totalCommission.toLocaleString()}</div>
            <p className="text-xs text-gray-500">Ingresos de la plataforma</p>
          </CardContent>
        </Card>
      </div>

      {/* KPIs secundarios */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Usuarios Activos</CardTitle>
            <Users className="h-4 w-4 text-indigo-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-indigo-600">{kpiData.activeUsers}</div>
            <p className="text-xs text-gray-500">Total de usuarios</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Proyectos Completados</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{kpiData.completedProjects}</div>
            <p className="text-xs text-gray-500">Entregados exitosamente</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Valor Promedio</CardTitle>
            <Percent className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">€{kpiData.averageProjectValue.toFixed(0)}</div>
            <p className="text-xs text-gray-500">Por proyecto</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Ganancias Expertos</CardTitle>
            <DollarSign className="h-4 w-4 text-teal-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-teal-600">€{kpiData.expertEarnings.toLocaleString()}</div>
            <p className="text-xs text-gray-500">Pagos a expertos</p>
          </CardContent>
        </Card>
      </div>

      {/* Gráficos */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Proyectos por Mes</CardTitle>
          </CardHeader>
          <CardContent>
            <SimpleLineChart data={generateMonthlyChartData()} title="Evolución Mensual" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Funnel de Conversión</CardTitle>
          </CardHeader>
          <CardContent>
            <SimpleBarChart data={generateConversionChartData()} title="Tasa de Conversión" />
          </CardContent>
        </Card>
      </div>

      {/* Resumen ejecutivo */}
      <Card>
        <CardHeader>
          <CardTitle>Resumen Ejecutivo</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium text-gray-900 mb-2">Rendimiento del Período</h4>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>• Se crearon {kpiData.projectsThisMonth} nuevos proyectos</li>
                <li>• La tasa de conversión fue del {kpiData.proposalConversionRate.toFixed(1)}%</li>
                <li>• El GMV alcanzó €{kpiData.monthlyGMV.toLocaleString()}</li>
                <li>• Se generaron €{kpiData.totalCommission.toLocaleString()} en comisiones</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium text-gray-900 mb-2">Métricas de Usuarios</h4>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>• {kpiData.activeUsers} usuarios activos en la plataforma</li>
                <li>• {kpiData.completedProjects} proyectos completados exitosamente</li>
                <li>• Valor promedio por proyecto: €{kpiData.averageProjectValue.toFixed(0)}</li>
                <li>• Los expertos ganaron €{kpiData.expertEarnings.toLocaleString()}</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

