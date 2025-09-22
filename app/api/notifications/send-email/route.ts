import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { NotificationType } from '@/lib/supabase'

// Configuración de Resend (alternativa: SendGrid)
const RESEND_API_KEY = process.env.RESEND_API_KEY
const FROM_EMAIL = process.env.FROM_EMAIL || 'noreply@automarket.com'

// Tipo para el resultado de envío de email
type EmailResult = {
  success: true;
  data: any;
} | {
  success: false;
  error: string;
}

// Función para enviar email usando Resend
async function sendEmailWithResend(to: string, subject: string, html: string): Promise<EmailResult> {
  if (!RESEND_API_KEY) {
    console.warn('RESEND_API_KEY no configurada, saltando envío de email')
    return { success: false, error: 'API key no configurada' }
  }

  try {
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: FROM_EMAIL,
        to: [to],
        subject,
        html,
      }),
    })

    if (!response.ok) {
      const error = await response.text()
      throw new Error(`Resend API error: ${response.status} - ${error}`)
    }

    const result = await response.json()
    return { success: true, data: result }
  } catch (error) {
    console.error('Error sending email with Resend:', error)
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' }
  }
}

// Función para enviar email usando SendGrid (alternativa)
async function sendEmailWithSendGrid(to: string, subject: string, html: string): Promise<EmailResult> {
  const SENDGRID_API_KEY = process.env.SENDGRID_API_KEY
  
  if (!SENDGRID_API_KEY) {
    console.warn('SENDGRID_API_KEY no configurada, saltando envío de email')
    return { success: false, error: 'API key no configurada' }
  }

  try {
    const response = await fetch('https://api.sendgrid.com/v3/mail/send', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${SENDGRID_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        personalizations: [{ to: [{ email: to }] }],
        from: { email: FROM_EMAIL },
        subject,
        content: [{ type: 'text/html', value: html }],
      }),
    })

    if (!response.ok) {
      const error = await response.text()
      throw new Error(`SendGrid API error: ${response.status} - ${error}`)
    }

    return { success: true, data: { message: 'Email sent successfully' } }
  } catch (error) {
    console.error('Error sending email with SendGrid:', error)
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' }
  }
}

// Función para generar el HTML del email
function generateEmailHTML(type: NotificationType, payload: Record<string, any>): string {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
  
  let title = ''
  let message = ''
  let actionText = ''
  let actionUrl = ''

  switch (type) {
    case 'NEW_MESSAGE':
      title = 'Nuevo mensaje recibido'
      message = `Has recibido un nuevo mensaje en el proyecto "${payload.project_title}"`
      actionText = 'Ver conversación'
      actionUrl = `${baseUrl}${payload.action_url}`
      break
    case 'NEW_PROPOSAL':
      title = 'Nueva propuesta recibida'
      message = `Has recibido una nueva propuesta para el proyecto "${payload.project_title}"`
      actionText = 'Ver propuesta'
      actionUrl = `${baseUrl}${payload.action_url}`
      break
    case 'PROPOSAL_ACCEPTED':
      title = 'Propuesta aceptada'
      message = `¡Felicidades! Tu propuesta para "${payload.project_title}" ha sido aceptada`
      actionText = 'Ver detalles'
      actionUrl = `${baseUrl}${payload.action_url}`
      break
    case 'PAYMENT_REQUIRED':
      title = 'Pago requerido'
      message = `Se requiere un pago de €${payload.amount} para el proyecto "${payload.project_title}"`
      actionText = 'Realizar pago'
      actionUrl = `${baseUrl}${payload.action_url}`
      break
    case 'REVIEW_REQUEST':
      title = 'Solicitud de reseña'
      message = `El proyecto "${payload.project_title}" ha sido completado. Por favor, deja tu reseña`
      actionText = 'Dejar reseña'
      actionUrl = `${baseUrl}${payload.action_url}`
      break
    default:
      title = 'Nueva notificación'
      message = 'Tienes una nueva notificación en AutoMarket'
      actionText = 'Ver notificación'
      actionUrl = `${baseUrl}/notifications`
  }

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>${title}</title>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: #3B82F6; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
        .content { background: #f9fafb; padding: 30px; border-radius: 0 0 8px 8px; }
        .button { display: inline-block; background: #3B82F6; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin: 20px 0; }
        .footer { text-align: center; margin-top: 30px; color: #6b7280; font-size: 14px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>🔔 AutoMarket</h1>
        </div>
        <div class="content">
          <h2>${title}</h2>
          <p>${message}</p>
          <a href="${actionUrl}" class="button">${actionText}</a>
          <p style="margin-top: 20px; font-size: 14px; color: #6b7280;">
            Si el botón no funciona, copia y pega este enlace en tu navegador:<br>
            <a href="${actionUrl}" style="color: #3B82F6;">${actionUrl}</a>
          </p>
        </div>
        <div class="footer">
          <p>Este email fue enviado desde AutoMarket</p>
          <p>Si no quieres recibir más notificaciones, puedes desactivarlas en tu perfil</p>
        </div>
      </div>
    </body>
    </html>
  `
}

export async function POST(request: NextRequest) {
  try {
    const { user_id, type, payload } = await request.json()

    // Validar datos requeridos
    if (!user_id || !type || !payload) {
      return NextResponse.json(
        { error: 'Datos incompletos' },
        { status: 400 }
      )
    }

    // Obtener el email del usuario
    const { data: user, error: userError } = await supabase
      .from('profiles')
      .select('email')
      .eq('id', user_id)
      .single()

    if (userError || !user?.email) {
      return NextResponse.json(
        { error: 'Usuario no encontrado' },
        { status: 404 }
      )
    }

    // Generar contenido del email
    const subject = `AutoMarket - ${getNotificationSubject(type)}`
    const html = generateEmailHTML(type, payload)

    // Intentar enviar con Resend primero, luego SendGrid como fallback
    let emailResult = await sendEmailWithResend(user.email, subject, html)
    
    if (!emailResult.success) {
      console.log('Resend falló, intentando con SendGrid...')
      emailResult = await sendEmailWithSendGrid(user.email, subject, html)
    }

    if (emailResult.success) {
      return NextResponse.json({ 
        success: true, 
        message: 'Email enviado correctamente',
        provider: emailResult.data ? 'resend' : 'sendgrid'
      })
    } else {
      console.error('Error sending email:', emailResult.error)
      return NextResponse.json(
        { error: 'Error al enviar email', details: emailResult.error },
        { status: 500 }
      )
    }

  } catch (error) {
    console.error('Error in send-email API:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}

function getNotificationSubject(type: NotificationType): string {
  switch (type) {
    case 'NEW_MESSAGE':
      return 'Nuevo mensaje recibido'
    case 'NEW_PROPOSAL':
      return 'Nueva propuesta recibida'
    case 'PROPOSAL_ACCEPTED':
      return 'Propuesta aceptada'
    case 'PAYMENT_REQUIRED':
      return 'Pago requerido'
    case 'REVIEW_REQUEST':
      return 'Solicitud de reseña'
    default:
      return 'Nueva notificación'
  }
}



