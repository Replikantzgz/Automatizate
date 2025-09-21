import { NextRequest, NextResponse } from 'next/server'
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { InvoiceService, InvoiceData } from '@/lib/invoiceService'

export async function POST(request: NextRequest) {
  try {
    const supabase = createRouteHandlerClient({ cookies })
    
    // Verificar autenticación
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }
    
    const { transaction_id } = await request.json()
    
    if (!transaction_id) {
      return NextResponse.json({ error: 'transaction_id es requerido' }, { status: 400 })
    }
    
    // Obtener datos de la transacción
    const { data: transaction, error: transactionError } = await supabase
      .from('transactions')
      .select(`
        *,
        projects (
          title,
          description,
          client_id,
          expert_id
        )
      `)
      .eq('id', transaction_id)
      .single()
    
    if (transactionError || !transaction) {
      return NextResponse.json({ error: 'Transacción no encontrada' }, { status: 404 })
    }
    
    // Verificar que la transacción esté pagada
    if (transaction.status !== 'paid') {
      return NextResponse.json({ error: 'La transacción debe estar pagada' }, { status: 400 })
    }
    
    // Obtener perfiles del cliente y experto
    const { data: clientProfile, error: clientError } = await supabase
      .from('profiles')
      .select('full_name, email')
      .eq('id', transaction.projects.client_id)
      .single()
    
    const { data: expertProfile, error: expertError } = await supabase
      .from('profiles')
      .select('full_name, email')
      .eq('id', transaction.projects.expert_id)
      .single()
    
    if (clientError || expertError || !clientProfile || !expertProfile) {
      return NextResponse.json({ error: 'Error obteniendo perfiles' }, { status: 500 })
    }
    
    // Verificar si ya existe una factura para esta transacción
    const { data: existingInvoice } = await supabase
      .from('invoices')
      .select('id')
      .eq('transaction_id', transaction_id)
      .single()
    
    if (existingInvoice) {
      return NextResponse.json({ error: 'Ya existe una factura para esta transacción' }, { status: 400 })
    }
    
    // Preparar datos para la factura
    const invoiceData: InvoiceData = {
      id: transaction_id,
      transaction_id,
      buyer_id: transaction.projects.client_id,
      seller_id: transaction.projects.expert_id,
      amount: transaction.amount,
      commission_amount: transaction.commission_amount || 0,
      vat: transaction.vat || 0,
      buyer_name: clientProfile.full_name,
      buyer_email: clientProfile.email,
      seller_name: expertProfile.full_name,
      seller_email: expertProfile.email,
      project_title: transaction.projects.title,
      project_description: transaction.projects.description,
      created_at: transaction.created_at
    }
    
    // Generar y almacenar la factura
    const result = await InvoiceService.generateAndStoreInvoice(invoiceData)
    
    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 500 })
    }
    
    return NextResponse.json({ 
      success: true, 
      message: 'Factura generada correctamente',
      pdfUrl: result.pdfUrl 
    })
    
  } catch (error) {
    console.error('Error generating invoice:', error)
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 })
  }
}

