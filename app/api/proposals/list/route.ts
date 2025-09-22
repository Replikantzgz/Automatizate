import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const project_id = searchParams.get('project_id')

    // Validar que el usuario esté autenticado
    const authHeader = request.headers.get('authorization')
    if (!authHeader) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }

    const token = authHeader.replace('Bearer ', '')
    const { data: { user }, error: authError } = await supabase.auth.getUser(token)
    
    if (authError || !user) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }

    // Obtener el perfil del usuario para determinar su rol
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single()

    if (!profile) {
      return NextResponse.json({ error: 'Perfil no encontrado' }, { status: 404 })
    }

    let proposalsQuery

    if (profile.role === 'cliente') {
      // Clientes ven propuestas de sus proyectos
      proposalsQuery = supabase
        .from('proposals')
        .select(`
          *,
          project:projects(title, category, status),
          expert:profiles!proposals_expert_id_fkey(full_name, email, role)
        `)
        .eq('project.user_id', user.id)
        .order('created_at', { ascending: false })
    } else if (profile.role === 'experto') {
      // Expertos ven sus propias propuestas
      proposalsQuery = supabase
        .from('proposals')
        .select(`
          *,
          project:projects(title, category, status),
          expert:profiles!proposals_expert_id_fkey(full_name, email, role)
        `)
        .eq('expert_id', user.id)
        .order('created_at', { ascending: false })
    } else {
      return NextResponse.json({ error: 'Rol de usuario no válido' }, { status: 400 })
    }

    // Filtrar por proyecto si se especifica
    if (project_id) {
      proposalsQuery = proposalsQuery.eq('project_id', project_id)
    }

    const { data: proposals, error: proposalsError } = await proposalsQuery

    if (proposalsError) {
      console.error('Error fetching proposals:', proposalsError)
      return NextResponse.json({ error: 'Error al obtener las propuestas' }, { status: 500 })
    }

    // Calcular estadísticas
    const stats = {
      total_proposals: proposals.length,
      sent_proposals: proposals.filter(p => p.status === 'sent').length,
      accepted_proposals: proposals.filter(p => p.status === 'accepted').length,
      rejected_proposals: proposals.filter(p => p.status === 'rejected').length,
    }

    return NextResponse.json({
      success: true,
      proposals,
      stats
    })

  } catch (error) {
    console.error('Error in get proposals:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}



