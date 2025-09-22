---
name: 💳 Pagos
about: Reportar problemas con el sistema de pagos o sugerir mejoras
title: '[PAYMENTS] '
labels: ['payments', 'stripe', 'billing', 'good-first-issue']
assignees: ''
---

## 💳 Tipo de Problema de Pagos

**¿Qué tipo de problema de pagos has encontrado?**

- [ ] ❌ **Checkout fallando** o no completándose
- [ ] 🔄 **Webhooks** no procesando correctamente
- [ ] 💰 **Comisiones** calculándose incorrectamente
- [ ] 📊 **Transacciones** no registrándose
- [ ] 🧾 **Facturas** no generándose
- [ ] 🔒 **Pagos en escrow** no liberándose
- [ ] 📱 **Pagos móviles** problemáticos
- [ ] 🌐 **Pagos internacionales** fallando
- [ ] 🔐 **Autenticación Stripe** problemática
- [ ] 📧 **Notificaciones de pago** no enviándose
- [ ] 🎯 **Otro**: [especificar]

## 📍 Ubicación del Problema

**¿Dónde está el problema de pagos?**

- **Página**: [ej. /checkout, /payments, /dashboard]
- **Componente**: [ej. CheckoutForm, PaymentButton, InvoiceGenerator]
- **API endpoint**: [ej. /api/payments/checkout, /api/payments/webhook]
- **Servicio**: [ej. Stripe, Facturación, Comisiones]

## 🔍 Descripción del Problema

**Describe detalladamente el problema de pagos:**

### ¿Qué está pasando?
[Describe el comportamiento actual del sistema de pagos]

### ¿Qué debería pasar?
[Describe el comportamiento esperado]

### ¿Cuándo ocurre?
[¿Siempre, solo en ciertos pagos, solo en ciertos usuarios?]

## 📱 Información del Sistema

**Tu entorno de desarrollo:**

- **Sistema Operativo**: [ej. Windows 11, macOS 14, Ubuntu 22.04]
- **Navegador**: [ej. Chrome 120, Firefox 121, Safari 17]
- **Versión del navegador**: [ej. 120.0.6099.109]
- **Modo**: [ej. Desarrollo, Producción, Testing]

### Dependencias relevantes:
- **stripe**: [versión]
- **@stripe/stripe-js**: [versión]
- **Otras**: [especificar]

## 📊 Detalles del Problema

**Información específica del problema:**

### Proceso que falla:
```typescript
// Ejemplo del proceso de pago que falla
const { session } = await stripe.checkout.sessions.create({
  payment_method_types: ['card'],
  line_items: [{
    price_data: {
      currency: 'eur',
      product_data: {
        name: 'Servicio de Automatización',
      },
      unit_amount: 5000, // 50.00 EUR
    },
    quantity: 1,
  }],
  mode: 'payment',
  success_url: `${process.env.NEXT_PUBLIC_APP_URL}/success`,
  cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/cancel`,
})
```

### Error o output:
```
Error: Invalid API key provided
Error: This payment method is not supported
Error: Insufficient funds
```

### Stack trace:
```
at Object.<anonymous> (/path/to/file.ts:15:25)
at processTicksAndRejections (node:internal/process/task_queues:95:5)
```

## 🧪 Pasos para Reproducir

**¿Cómo puedo reproducir el problema?**

1. Ve a la página '...'
2. Intenta realizar el pago '...'
3. Observa el error

### Datos de prueba:
- **Monto**: [ej. 50.00 EUR]
- **Método de pago**: [ej. Tarjeta de crédito, PayPal]
- **Usuario**: [ej. Cliente existente, Nuevo cliente]

## 📸 Capturas de Pantalla

**Si es relevante, agrega capturas de pantalla:**

- **Error en UI**: [captura del error]
- **Error en consola**: [captura del error en consola]
- **Stripe Dashboard**: [captura del problema en Stripe]

## 🎯 Impacto y Prioridad

**¿Qué tan crítico es este problema?**

- [ ] 🚨 **Crítico** - Bloquea completamente los pagos
- [ ] ⚠️ **Alto** - Dificulta significativamente las transacciones
- [ ] 🔶 **Medio** - Inconveniente pero funcional
- [ ] 📝 **Bajo** - Mejora menor del proceso

### Áreas afectadas:
- [ ] **Ingresos** de la plataforma
- [ ] **Experiencia del cliente** al pagar
- [ ] **Pagos a expertos** por servicios
- [ ] **Facturación** y contabilidad
- [ ] **Otros**: [especificar]

## 💡 Solución Propuesta

**¿Tienes alguna idea de cómo solucionarlo?**

### Cambios sugeridos:
```typescript
// ❌ ANTES: Pago problemático
const { session } = await stripe.checkout.sessions.create({
  payment_method_types: ['card'],
  line_items: [{
    price_data: {
      currency: 'eur',
      product_data: {
        name: 'Servicio de Automatización',
      },
      unit_amount: 5000,
    },
    quantity: 1,
  }],
  mode: 'payment',
})

// ✅ DESPUÉS: Pago mejorado
try {
  const { session } = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    line_items: [{
      price_data: {
        currency: 'eur',
        product_data: {
          name: 'Servicio de Automatización',
        },
        unit_amount: 5000,
      },
      quantity: 1,
    }],
    mode: 'payment',
    success_url: `${process.env.NEXT_PUBLIC_APP_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/cancel`,
    metadata: {
      project_id: projectId,
      user_id: userId,
    },
  })

  return { success: true, sessionId: session.id }
} catch (error) {
  console.error('Stripe error:', error)
  return { success: false, error: error.message }
}
```

### Estrategias de mejora:
- [ ] **Manejo de errores** estructurado
- [ ] **Validación de datos** antes de enviar a Stripe
- [ ] **Logging detallado** para debugging
- [ ] **Fallback strategies** para errores
- [ ] **Retry logic** para fallos temporales
- [ ] **Otros**: [especificar]

## 🔍 Análisis del Problema

**¿Qué crees que está causando el problema?**

### Posibles causas:
- [ ] **API keys de Stripe** incorrectas o expiradas
- [ ] **Configuración de webhooks** incorrecta
- [ ] **Variables de entorno** faltantes
- [ ] **Permisos de Stripe** insuficientes
- [ ] **Problemas de red** o conectividad
- [ ] **Datos de pago** malformados
- [ ] **Otros**: [especificar]

## 🧪 Testing de Pagos

**¿Qué has intentado para debuggear?**

- [ ] **Verificar API keys** de Stripe
- [ ] **Revisar webhooks** en Stripe Dashboard
- [ ] **Probar con tarjetas de prueba** de Stripe
- [ ] **Verificar logs** del servidor
- [ ] **Revisar variables de entorno**
- [ ] **Otros**: [especificar]

## 📚 Recursos de Referencia

**¿Qué recursos has consultado?**

- [ ] **Stripe documentation** oficial
- [ ] **Stripe testing** guides
- [ ] **Webhook handling** best practices
- [ ] **Stack Overflow** o GitHub issues
- [ ] **Otros**: [especificar]

## 🎉 Contribución

**¿Te gustaría implementar la solución tú mismo?**

- [ ] ✅ **Sí, puedo arreglar el problema de pagos**
- [ ] 🤔 **Tal vez, con algo de ayuda**
- [ ] ❌ **No, solo quiero reportarlo**

## 🔗 Issues Relacionados

**¿Hay otros issues relacionados con pagos?**

- **Issues relacionados**: #[número]
- **PRs relacionados**: #[número]
- **Discusiones**: [enlace]

## 📋 Checklist de Pagos

**Antes de reportar, verifica:**

- [ ] **API keys de Stripe** están configuradas
- [ ] **Webhooks** están configurados correctamente
- [ ] **Variables de entorno** están definidas
- [ ] **Tarjetas de prueba** funcionan
- [ ] **Stripe Dashboard** muestra la actividad

## 🔧 Configuración de Pagos

**¿Qué configuración de pagos usas?**

- [ ] **Stripe Checkout** para procesamiento
- [ ] **Stripe Connect** para pagos a expertos
- [ ] **Webhooks** para notificaciones
- [ ] **Comisiones automáticas** implementadas
- [ ] **Otros**: [especificar]

### Configuración específica:
```typescript
// Ejemplo de configuración de Stripe
import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16',
})

// Ejemplo de configuración de webhook
export async function POST(request: NextRequest) {
  const body = await request.text()
  const signature = request.headers.get('stripe-signature')!

  try {
    const event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    )
    // Procesar evento
  } catch (error) {
    console.error('Webhook error:', error)
    return NextResponse.json({ error: 'Webhook error' }, { status: 400 })
  }
}
```

## 💰 Tipos de Pago

**¿Qué tipos de pago están involucrados?**

- [ ] **Pagos únicos** por proyectos
- [ ] **Pagos recurrentes** por suscripciones
- [ ] **Pagos en escrow** con liberación automática
- [ ] **Transferencias** a expertos
- [ ] **Reembolsos** y disputas
- [ ] **Otros**: [especificar]

## 🔒 Seguridad

**¿Qué aspectos de seguridad están afectados?**

- [ ] **Datos de tarjetas** no se procesan de forma segura
- [ ] **Webhooks** no se verifican correctamente
- [ ] **API keys** se exponen en el cliente
- [ ] **Validación de pagos** insuficiente
- [ ] **Logs de seguridad** no se generan
- [ ] **Otros**: [especificar]

---

**¡Gracias por ayudar a mejorar el sistema de pagos de AutoMarket! 💳✨**

## 📞 Recursos de Pagos

- **Stripe**: https://stripe.com/docs
- **Stripe Testing**: https://stripe.com/docs/testing
- **Webhooks**: https://stripe.com/docs/webhooks
- **Security**: https://stripe.com/docs/security



