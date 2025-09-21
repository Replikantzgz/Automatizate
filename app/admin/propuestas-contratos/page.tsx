'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { Proposal, Contract, Project, UserProfile } from '@/lib/supabase'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Search, Filter, FileText, CheckCircle, Clock, XCircle, AlertTriangle, Lock } from 'lucide-react'

interface ProposalWithDetails extends Proposal {
  project?: Project
  expert?: UserProfile
  client?: UserProfile
}

interface ContractWithDetails extends Contract {
  project?: Project
  client?: UserProfile
  expert?: UserProfile
  proposal?: Proposal
}

export default function PropuestasContratosPage() {
  const [proposals, setProposals] = useState<ProposalWithDetails[]>([])
  const [contracts, setContracts] = useState<ContractWithDetails[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<'proposals' | 'contracts'>('proposals')
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      setLoading(true)
      
      // Obtener propuestas con detalles
      const { data: proposalsData, error: proposalsError } = await supabase
        .from('proposals')
        .select(`
          *,
          project:projects(title, status, budget),
          expert:profiles(full_name, email),
          client:profiles(full_name, email)
        `)
        .order('created_at', { ascending: false })

      if (proposalsError) throw proposalsError

      // Obtener contratos con detalles
      const { data: contractsData, error: contractsError } = await supabase
        .from('contracts')
        .select(`
          *,
          project:projects(title, status, budget),
          client:profiles(full_name, email),
          expert:profiles(full_name, email),
          proposal:proposals(price, estimated_days, message)
        `)
        .order('created_at', { ascending: false })

      if (contractsError) throw contractsError

      setProposals(proposalsData || [])
      setContracts(contractsData || [])
    } catch (error) {
      console.error('Error fetching data:', error)
    } finally {
      setLoading(false)
    }
  }

  const filteredProposals = proposals.filter(proposal => {
    const matchesSearch = proposal.project?.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         proposal.expert?.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         proposal.client?.full_name?.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === 'all' || proposal.status === statusFilter
    
    return matchesSearch && matchesStatus
  })

  const filteredContracts = contracts.filter(contract => {
    const matchesSearch = contract.project?.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         contract.expert?.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         contract.client?.full_name?.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === 'all' || contract.status === statusFilter
    
    return matchesSearch && matchesStatus
  })

  const getProposalStatusBadge = (status: string) => {
    const badges = {
      sent: 'bg-blue-100 text-blue-800',
      accepted: 'bg-green-100 text-green-800',
      rejected: 'bg-red-100 text-red-800'
    }
    return badges[status as keyof typeof badges] || 'bg-gray-100 text-gray-800'
  }

  const getContractStatusBadge = (status: string) => {
    const badges = {
      active: 'bg-green-100 text-green-800',
      completed: 'bg-gray-100 text-gray-800',
      disputed: 'bg-red-100 text-red-800'
    }
    return badges[status as keyof typeof badges] || 'bg-gray-100 text-gray-800'
  }

  const getStatusIcon = (status: string, type: 'proposal' | 'contract') => {
    if (type === 'proposal') {
      if (status === 'sent') return <Clock className="h-4 w-4" />
      if (status === 'accepted') return <CheckCircle className="h-4 w-4" />
      if (status === 'rejected') return <XCircle className="h-4 w-4" />
    } else {
      if (status === 'active') return <Clock className="h-4 w-4" />
      if (status === 'completed') return <CheckCircle className="h-4 w-4" />
      if (status === 'disputed') return <AlertTriangle className="h-4 w-4" />
    }
    return <Clock className="h-4 w-4" />
  }

  const handleForceCloseContract = async (contractId: string) => {
    try {
      const { error } = await supabase
        .from('contracts')
        .update({ 
          status: 'completed',
          completed_at: new Date().toISOString()
        })
        .eq('id', contractId)

      if (error) throw error

      // Actualizar estado local
      setContracts(contracts.map(contract => 
        contract.id === contractId 
          ? { ...contract, status: 'completed', completed_at: new Date().toISOString() }
          : contract
      ))

      // También actualizar el proyecto asociado
      const contract = contracts.find(c => c.id === contractId)
      if (contract?.project_id) {
        await supabase
          .from('projects')
          .update({ status: 'completado' })
          .eq('id', contract.project_id)
      }
    } catch (error) {
      console.error('Error forcing contract close:', error)
    }
  }

  const handleDeleteProposal = async (proposalId: string) => {
    try {
      const { error } = await supabase
        .from('proposals')
        .delete()
        .eq('id', proposalId)

      if (error) throw error

      // Actualizar estado local
      setProposals(proposals.filter(proposal => proposal.id !== proposalId))
    } catch (error) {
      console.error('Error deleting proposal:', error)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg">Cargando datos...</div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Propuestas y Contratos</h1>
        <p className="text-gray-600 mt-2">Gestiona el estado de propuestas y contratos del sistema</p>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab('proposals')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'proposals'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Propuestas ({proposals.length})
          </button>
          <button
            onClick={() => setActiveTab('contracts')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'contracts'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Contratos ({contracts.length})
          </button>
        </nav>
      </div>

      {/* Filtros */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <input
                  type="text"
                  placeholder="Buscar por proyecto, experto o cliente..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
            
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">Todos los estados</option>
              {activeTab === 'proposals' ? (
                <>
                  <option value="sent">Enviadas</option>
                  <option value="accepted">Aceptadas</option>
                  <option value="rejected">Rechazadas</option>
                </>
              ) : (
                <>
                  <option value="active">Activos</option>
                  <option value="completed">Completados</option>
                  <option value="disputed">Disputados</option>
                </>
              )}
            </select>
          </div>
        </CardContent>
      </Card>

      {/* Contenido de las tabs */}
      {activeTab === 'proposals' ? (
        <Card>
          <CardHeader>
            <CardTitle>Propuestas ({filteredProposals.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 font-medium text-gray-900">Proyecto</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-900">Experto</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-900">Cliente</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-900">Precio</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-900">Estado</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-900">Fecha</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-900">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredProposals.map((proposal) => (
                    <tr key={proposal.id} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-4 px-4">
                        <div>
                          <div className="font-medium text-gray-900">{proposal.project?.title}</div>
                          <div className="text-sm text-gray-500">
                            Presupuesto: €{proposal.project?.budget || 'No especificado'}
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <div>
                          <div className="font-medium text-gray-900">{proposal.expert?.full_name}</div>
                          <div className="text-sm text-gray-500">{proposal.expert?.email}</div>
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <div>
                          <div className="font-medium text-gray-900">{proposal.client?.full_name}</div>
                          <div className="text-sm text-gray-500">{proposal.client?.email}</div>
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <div className="text-lg font-semibold text-green-600">€{proposal.price}</div>
                        <div className="text-sm text-gray-500">{proposal.estimated_days} días</div>
                      </td>
                      <td className="py-4 px-4">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getProposalStatusBadge(proposal.status)}`}>
                          {getStatusIcon(proposal.status, 'proposal')}
                          <span className="ml-1 capitalize">{proposal.status}</span>
                        </span>
                      </td>
                      <td className="py-4 px-4 text-sm text-gray-500">
                        {new Date(proposal.created_at).toLocaleDateString('es-ES')}
                      </td>
                      <td className="py-4 px-4">
                        <button
                          onClick={() => handleDeleteProposal(proposal.id)}
                          className="px-3 py-1 text-xs bg-red-100 text-red-700 rounded-md hover:bg-red-200 transition-colors"
                        >
                          Eliminar
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>Contratos ({filteredContracts.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 font-medium text-gray-900">Proyecto</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-900">Experto</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-900">Cliente</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-900">Precio Acordado</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-900">Estado</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-900">Fecha Inicio</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-900">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredContracts.map((contract) => (
                    <tr key={contract.id} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-4 px-4">
                        <div>
                          <div className="font-medium text-gray-900">{contract.project?.title}</div>
                          <div className="text-sm text-gray-500">
                            Estado: {contract.project?.status}
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <div>
                          <div className="font-medium text-gray-900">{contract.expert?.full_name}</div>
                          <div className="text-sm text-gray-500">{contract.expert?.email}</div>
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <div>
                          <div className="font-medium text-gray-900">{contract.client?.full_name}</div>
                          <div className="text-sm text-gray-500">{contract.client?.email}</div>
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <div className="text-lg font-semibold text-green-600">€{contract.agreed_price}</div>
                        <div className="text-sm text-gray-500">
                          Original: €{contract.proposal?.price}
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getContractStatusBadge(contract.status)}`}>
                          {getStatusIcon(contract.status, 'contract')}
                          <span className="ml-1 capitalize">{contract.status}</span>
                        </span>
                      </td>
                      <td className="py-4 px-4 text-sm text-gray-500">
                        {new Date(contract.start_date).toLocaleDateString('es-ES')}
                      </td>
                      <td className="py-4 px-4">
                        {contract.status === 'active' && (
                          <button
                            onClick={() => handleForceCloseContract(contract.id)}
                            className="px-3 py-1 text-xs bg-orange-100 text-orange-700 rounded-md hover:bg-orange-200 transition-colors"
                            title="Forzar cierre del contrato"
                          >
                            <Lock className="h-3 w-3 inline mr-1" />
                            Forzar Cierre
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

