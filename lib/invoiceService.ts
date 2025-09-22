import puppeteer from 'puppeteer'
import { supabase } from './supabase'

export interface InvoiceData {
  id: string
  transaction_id: string
  buyer_id: string
  seller_id: string
  amount: number
  commission_amount: number
  vat: number
  buyer_name: string
  buyer_email: string
  seller_name: string
  seller_email: string
  project_title: string
  project_description: string
  created_at: string
}

export class InvoiceService {
  private static async generateInvoiceHTML(invoiceData: InvoiceData, isClientInvoice: boolean = true): Promise<string> {
    const invoiceNumber = `INV-${invoiceData.id.slice(0, 8).toUpperCase()}`
    const invoiceDate = new Date(invoiceData.created_at).toLocaleDateString('es-ES')
    const dueDate = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString('es-ES')
    
    const totalAmount = invoiceData.amount + invoiceData.vat
    const netAmount = isClientInvoice ? invoiceData.amount : (invoiceData.amount - invoiceData.commission_amount)

    return `
      <!DOCTYPE html>
      <html lang="es">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Factura ${invoiceNumber}</title>
        <style>
          body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            margin: 0;
            padding: 20px;
            background-color: #f8f9fa;
          }
          .invoice-container {
            max-width: 800px;
            margin: 0 auto;
            background: white;
            padding: 40px;
            border-radius: 8px;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
          }
          .header {
            text-align: center;
            border-bottom: 3px solid #3b82f6;
            padding-bottom: 20px;
            margin-bottom: 30px;
          }
          .logo {
            font-size: 24px;
            font-weight: bold;
            color: #3b82f6;
            margin-bottom: 10px;
          }
          .invoice-title {
            font-size: 32px;
            color: #1f2937;
            margin: 0;
          }
          .invoice-details {
            display: flex;
            justify-content: space-between;
            margin-bottom: 30px;
          }
          .invoice-info, .client-info {
            flex: 1;
          }
          .invoice-info h3, .client-info h3 {
            color: #374151;
            margin-bottom: 15px;
            font-size: 18px;
          }
          .info-row {
            margin-bottom: 8px;
            color: #6b7280;
          }
          .project-details {
            background-color: #f3f4f6;
            padding: 20px;
            border-radius: 6px;
            margin-bottom: 30px;
          }
          .project-title {
            font-size: 20px;
            color: #1f2937;
            margin-bottom: 10px;
          }
          .project-description {
            color: #6b7280;
            line-height: 1.6;
          }
          .items-table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 30px;
          }
          .items-table th {
            background-color: #f9fafb;
            padding: 15px;
            text-align: left;
            border-bottom: 2px solid #e5e7eb;
            color: #374151;
            font-weight: 600;
          }
          .items-table td {
            padding: 15px;
            border-bottom: 1px solid #e5e7eb;
            color: #6b7280;
          }
          .total-section {
            text-align: right;
            margin-top: 20px;
          }
          .total-row {
            display: flex;
            justify-content: space-between;
            margin-bottom: 10px;
            font-size: 16px;
          }
          .total-row.grand-total {
            font-size: 20px;
            font-weight: bold;
            color: #1f2937;
            border-top: 2px solid #e5e7eb;
            padding-top: 10px;
          }
          .footer {
            margin-top: 40px;
            text-align: center;
            color: #9ca3af;
            font-size: 14px;
            border-top: 1px solid #e5e7eb;
            padding-top: 20px;
          }
        </style>
      </head>
      <body>
        <div class="invoice-container">
          <div class="header">
            <div class="logo">AutoMarket</div>
            <h1 class="invoice-title">${isClientInvoice ? 'Factura' : 'Recibo'}</h1>
          </div>
          
          <div class="invoice-details">
            <div class="invoice-info">
              <h3>Información de la Factura</h3>
              <div class="info-row"><strong>Número:</strong> ${invoiceNumber}</div>
              <div class="info-row"><strong>Fecha:</strong> ${invoiceDate}</div>
              <div class="info-row"><strong>Vencimiento:</strong> ${dueDate}</div>
            </div>
            <div class="client-info">
              <h3>${isClientInvoice ? 'Cliente' : 'Experto'}</h3>
              <div class="info-row"><strong>Nombre:</strong> ${isClientInvoice ? invoiceData.buyer_name : invoiceData.seller_name}</div>
              <div class="info-row"><strong>Email:</strong> ${isClientInvoice ? invoiceData.buyer_email : invoiceData.seller_email}</div>
            </div>
          </div>
          
          <div class="project-details">
            <div class="project-title">${invoiceData.project_title}</div>
            <div class="project-description">${invoiceData.project_description}</div>
          </div>
          
          <table class="items-table">
            <thead>
              <tr>
                <th>Descripción</th>
                <th>Cantidad</th>
                <th>Precio Unitario</th>
                <th>Total</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Servicio de ${isClientInvoice ? 'desarrollo' : 'ejecución'}</td>
                <td>1</td>
                <td>€${invoiceData.amount.toFixed(2)}</td>
                <td>€${invoiceData.amount.toFixed(2)}</td>
              </tr>
              ${invoiceData.vat > 0 ? `
                <tr>
                  <td>IVA (21%)</td>
                  <td>1</td>
                  <td>€${invoiceData.vat.toFixed(2)}</td>
                  <td>€${invoiceData.vat.toFixed(2)}</td>
                </tr>
              ` : ''}
              ${isClientInvoice && invoiceData.commission_amount > 0 ? `
                <tr>
                  <td>Comisión de plataforma</td>
                  <td>1</td>
                  <td>€${invoiceData.commission_amount.toFixed(2)}</td>
                  <td>€${invoiceData.commission_amount.toFixed(2)}</td>
                </tr>
              ` : ''}
            </tbody>
          </table>
          
          <div class="total-section">
            ${invoiceData.vat > 0 ? `
              <div class="total-row">
                <span>Subtotal:</span>
                <span>€${invoiceData.amount.toFixed(2)}</span>
              </div>
              <div class="total-row">
                <span>IVA:</span>
                <span>€${invoiceData.vat.toFixed(2)}</span>
              </div>
            ` : ''}
            ${isClientInvoice && invoiceData.commission_amount > 0 ? `
              <div class="total-row">
                <span>Comisión:</span>
                <span>€${invoiceData.commission_amount.toFixed(2)}</span>
              </div>
            ` : ''}
            <div class="total-row grand-total">
              <span>Total:</span>
              <span>€${totalAmount.toFixed(2)}</span>
            </div>
          </div>
          
          <div class="footer">
            <p>AutoMarket - Plataforma de servicios profesionales</p>
            <p>Esta factura ha sido generada automáticamente por el sistema</p>
          </div>
        </div>
      </body>
      </html>
    `
  }

  static async generateAndStoreInvoice(invoiceData: InvoiceData): Promise<{ success: boolean; pdfUrl?: string; error?: string }> {
    try {
      // Generar factura para el cliente
      const clientInvoiceHTML = await this.generateInvoiceHTML(invoiceData, true)
      const clientPdfBuffer = await this.generatePDF(clientInvoiceHTML)
      
      // Generar recibo para el experto (opcional)
      const expertReceiptHTML = await this.generateInvoiceHTML(invoiceData, false)
      const expertPdfBuffer = await this.generatePDF(expertReceiptHTML)
      
      // Subir PDFs a Supabase Storage
      const clientPdfFileName = `invoices/client-${invoiceData.id}.pdf`
      const expertPdfFileName = `invoices/expert-${invoiceData.id}.pdf`
      
      const { data: clientUpload, error: clientError } = await supabase.storage
        .from('documents')
        .upload(clientPdfFileName, clientPdfBuffer, {
          contentType: 'application/pdf',
          cacheControl: '3600'
        })
      
      if (clientError) {
        console.error('Error uploading client invoice:', clientError)
        return { success: false, error: 'Error uploading client invoice' }
      }
      
      const { data: expertUpload, error: expertError } = await supabase.storage
        .from('documents')
        .upload(expertPdfFileName, expertPdfBuffer, {
          contentType: 'application/pdf',
          cacheControl: '3600'
        })
      
      if (expertError) {
        console.error('Error uploading expert receipt:', expertError)
        return { success: false, error: 'Error uploading expert receipt' }
      }
      
      // Obtener URLs públicas
      const { data: clientUrl } = supabase.storage
        .from('documents')
        .getPublicUrl(clientPdfFileName)
      
      const { data: expertUrl } = supabase.storage
        .from('documents')
        .getPublicUrl(expertPdfFileName)
      
      // Crear registros en la base de datos
      const { error: insertError } = await supabase
        .from('invoices')
        .insert([
          {
            transaction_id: invoiceData.transaction_id,
            buyer_id: invoiceData.buyer_id,
            seller_id: invoiceData.seller_id,
            amount: invoiceData.amount,
            commission_amount: invoiceData.commission_amount,
            vat: invoiceData.vat,
            pdf_url: clientUrl.publicUrl
          }
        ])
      
      if (insertError) {
        console.error('Error inserting invoice:', insertError)
        return { success: false, error: 'Error inserting invoice' }
      }
      
      return { 
        success: true, 
        pdfUrl: clientUrl.publicUrl 
      }
      
    } catch (error) {
      console.error('Error generating invoice:', error)
      return { success: false, error: 'Error generating invoice' }
    }
  }

  private static async generatePDF(html: string): Promise<Buffer> {
    const browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    })
    
    try {
      const page = await browser.newPage()
      await page.setContent(html, { waitUntil: 'networkidle0' })
      
      const pdfBuffer = await page.pdf({
        format: 'A4',
        printBackground: true,
        margin: {
          top: '20mm',
          right: '20mm',
          bottom: '20mm',
          left: '20mm'
        }
      })
      
      return Buffer.from(pdfBuffer)
    } finally {
      await browser.close()
    }
  }

  static async getInvoicesByUser(userId: string): Promise<any[]> {
    const { data, error } = await supabase
      .from('invoices')
      .select(`
        *,
        transactions (
          projects (
            title,
            description
          )
        )
      `)
      .or(`buyer_id.eq.${userId},seller_id.eq.${userId}`)
      .order('created_at', { ascending: false })
    
    if (error) {
      console.error('Error fetching invoices:', error)
      return []
    }
    
    return data || []
  }
}



