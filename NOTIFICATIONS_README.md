# Sistema de Notificaciones - AutoMarket

## Descripción General

Este sistema implementa notificaciones in-app y por email para mantener a los usuarios informados sobre eventos importantes en la plataforma. Las notificaciones se envían automáticamente cuando ocurren ciertos eventos y se pueden gestionar desde la interfaz de usuario.

## Características Principales

### 🔔 **Notificaciones In-App**
- **Campana en header** con badge de notificaciones no leídas
- **Dropdown** con las últimas 10 notificaciones
- **Página dedicada** `/notifications` para ver todas las notificaciones
- **Marcado como leído** individual o masivo
- **Filtros** entre todas y solo no leídas

### 📧 **Notificaciones por Email**
- **Emails transaccionales** automáticos
- **Soporte para Resend y SendGrid** como proveedores
- **Plantillas HTML** responsivas y profesionales
- **Fallback automático** entre proveedores
- **Envío asíncrono** (no bloquea la funcionalidad principal)

## Tipos de Notificaciones

### 1. **NEW_MESSAGE** 💬
- **Trigger**: Nuevo mensaje en conversación
- **Recibe**: Usuario que no envió el mensaje
- **Payload**: `conversation_id`, `sender_id`, `project_title`, `action_url`
- **Email**: "Nuevo mensaje en el proyecto [Título]"

### 2. **NEW_PROPOSAL** 📝
- **Trigger**: Cliente recibe nueva propuesta
- **Recibe**: Cliente del proyecto
- **Payload**: `project_id`, `expert_id`, `project_title`, `action_url`
- **Email**: "Nueva propuesta recibida para [Título]"

### 3. **PROPOSAL_ACCEPTED** ✅
- **Trigger**: Cliente acepta propuesta
- **Recibe**: Experto de la propuesta
- **Payload**: `project_id`, `project_title`, `action_url`
- **Email**: "Tu propuesta para [Título] ha sido aceptada"

### 4. **PAYMENT_REQUIRED** 💳
- **Trigger**: Cliente debe pagar tras aceptar propuesta
- **Recibe**: Cliente del proyecto
- **Payload**: `project_id`, `project_title`, `amount`, `action_url`
- **Email**: "Pago requerido para [Título] - €[Cantidad]"

### 5. **REVIEW_REQUEST** ⭐
- **Trigger**: Contrato completado
- **Recibe**: Cliente del proyecto
- **Payload**: `project_id`, `project_title`, `action_url`
- **Email**: "Solicitud de reseña para [Título]"

## Estructura de la Base de Datos

### Tabla `notifications`
```sql
CREATE TABLE notifications (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  type VARCHAR(50) NOT NULL CHECK (type IN ('NEW_MESSAGE', 'NEW_PROPOSAL', 'PROPOSAL_ACCEPTED', 'PAYMENT_REQUIRED', 'REVIEW_REQUEST')),
  payload JSONB NOT NULL DEFAULT '{}',
  read BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### Índices y Políticas
- **Índices**: `user_id`, `read`, `created_at`, `type`
- **RLS**: Usuarios solo ven sus propias notificaciones
- **Limpieza**: Función para eliminar notificaciones antiguas (>90 días)

## Arquitectura del Sistema

### 1. **Servicio de Notificaciones** (`lib/notifications.ts`)
```typescript
export class NotificationService {
  // Métodos principales
  static async create(data: CreateNotificationData)
  static async getUserNotifications(userId: string, limit = 50)
  static async getUnreadNotifications(userId: string)
  static async markAsRead(notificationId: string)
  static async markAllAsRead(userId: string)
  static async getUnreadCount(userId: string)
  
  // Métodos específicos por tipo
  static async notifyNewMessage(...)
  static async notifyNewProposal(...)
  static async notifyProposalAccepted(...)
  static async notifyPaymentRequired(...)
  static async notifyReviewRequest(...)
}
```

### 2. **API Routes**
- **`/api/notifications`**: CRUD de notificaciones
- **`/api/notifications/send-email`**: Envío de emails
- **Integración automática** en APIs existentes

### 3. **Componentes React**
- **`NotificationBell`**: Campana con dropdown en header
- **`NotificationsPage`**: Página completa de gestión

## Integración con Flujos Existentes

### Sistema de Mensajes
```typescript
// En app/api/conversations/[id]/messages/route.ts
await NotificationService.notifyNewMessage(
  conversationId,
  senderId,
  receiverId,
  projectTitle
)
```

### Sistema de Propuestas
```typescript
// En app/api/proposals/create/route.ts
await NotificationService.notifyNewProposal(
  projectId,
  clientId,
  expertId,
  projectTitle
)

// En app/api/proposals/update-status/route.ts
await NotificationService.notifyProposalAccepted(
  projectId,
  expertId,
  projectTitle
)
```

### Sistema de Pagos
```typescript
// En app/api/payments/confirm/route.ts
await NotificationService.notifyPaymentRequired(
  projectId,
  clientId,
  projectTitle,
  amount
)
```

### Sistema de Contratos
```typescript
// En app/api/contracts/complete/route.ts
await NotificationService.notifyReviewRequest(
  projectId,
  clientId,
  projectTitle
)
```

## Configuración de Email

### Variables de Entorno
```bash
# Resend (recomendado)
RESEND_API_KEY=your_resend_api_key_here

# SendGrid (alternativa)
SENDGRID_API_KEY=your_sendgrid_api_key_here

# Configuración general
FROM_EMAIL=noreply@yourdomain.com
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### Proveedores Soportados

#### Resend
- **Ventajas**: API simple, buen deliverability, plantillas HTML
- **Configuración**: Solo requiere API key
- **Uso**: Primera opción por defecto

#### SendGrid
- **Ventajas**: Muy establecido, analytics avanzados
- **Configuración**: API key y configuración de sender
- **Uso**: Fallback si Resend falla

### Plantillas de Email
- **HTML responsivo** con CSS inline
- **Branding consistente** con AutoMarket
- **Botones de acción** directos
- **Fallback de texto** para clientes de email básicos

## UI/UX

### Campana de Notificaciones
- **Badge rojo** con contador de no leídas
- **Dropdown responsive** con scroll interno
- **Acciones rápidas** (marcar como leída)
- **Link directo** a página completa

### Página de Notificaciones
- **Filtros visuales** entre todas/no leídas
- **Acciones masivas** (marcar todas como leídas)
- **Estados visuales** claros (leída/no leída)
- **Información contextual** sobre cada notificación

### Estados Visuales
- **No leída**: Fondo azul claro, borde izquierdo azul
- **Leída**: Fondo blanco, hover con sombra
- **Iconos**: Diferentes por tipo de notificación
- **Colores**: Esquema consistente con la plataforma

## Funcionalidades Avanzadas

### Polling en Tiempo Real
- **Actualización automática** cada 30 segundos
- **Contador de no leídas** siempre actualizado
- **No bloquea** la interfaz de usuario

### Gestión de Estado
- **Estado local optimizado** para respuestas rápidas
- **Sincronización** con base de datos
- **Manejo de errores** graceful

### Performance
- **Lazy loading** de notificaciones
- **Paginación** para listas largas
- **Caché local** para reducir requests

## Seguridad

### Row Level Security (RLS)
```sql
-- Usuarios solo ven sus notificaciones
CREATE POLICY "Users can view own notifications" ON notifications
  FOR SELECT USING (auth.uid() = user_id);

-- Solo pueden actualizar sus propias notificaciones
CREATE POLICY "Users can update own notifications" ON notifications
  FOR UPDATE USING (auth.uid() = user_id);
```

### Validaciones
- **Autenticación requerida** en todas las APIs
- **Verificación de propiedad** antes de modificar
- **Sanitización** de datos de entrada

### Rate Limiting
- **Protección contra spam** en APIs de email
- **Límites por usuario** para notificaciones
- **Cooldown** entre notificaciones del mismo tipo

## Testing

### Casos de Prueba
- **Creación** de notificaciones por tipo
- **Envío de emails** con diferentes proveedores
- **Marcado como leído** individual y masivo
- **Filtros** y búsquedas
- **Integración** con flujos existentes

### Datos de Prueba
- **Usuarios**: Cliente y Experto
- **Proyectos**: Diferentes estados
- **Notificaciones**: Todos los tipos
- **Emails**: Diferentes proveedores

## Monitoreo y Logs

### Logs de Sistema
- **Creación** de notificaciones
- **Envío de emails** (éxito/fallo)
- **Errores** en APIs
- **Performance** de consultas

### Métricas
- **Tasa de entrega** de emails
- **Tiempo de respuesta** de APIs
- **Uso de notificaciones** por tipo
- **Engagement** de usuarios

## Próximos Pasos

### Mejoras Futuras
- **Notificaciones push** en navegador
- **Webhooks** para integraciones externas
- **Preferencias** de notificación por usuario
- **Plantillas personalizables** de email

### Escalabilidad
- **Queue system** para emails masivos
- **Caché distribuido** para notificaciones
- **CDN** para assets de email
- **Microservicios** para notificaciones

## Despliegue

### Requisitos
- **Base de datos** con RLS habilitado
- **Variables de entorno** configuradas
- **Proveedor de email** (Resend/SendGrid)
- **APIs** funcionando correctamente

### Checklist
- [ ] Tabla `notifications` creada en Supabase
- [ ] Variables de entorno configuradas
- [ ] APIs de notificación funcionando
- [ ] Componentes compilados correctamente
- [ ] Emails de prueba enviados
- [ ] RLS policies verificadas

## Troubleshooting

### Problemas Comunes

#### Emails no se envían
- Verificar API keys de email
- Revisar logs de la API `/api/notifications/send-email`
- Confirmar configuración de `FROM_EMAIL`

#### Notificaciones no aparecen
- Verificar RLS policies en Supabase
- Revisar logs de creación de notificaciones
- Confirmar que el usuario está autenticado

#### Performance lenta
- Verificar índices en base de datos
- Revisar polling interval (30s por defecto)
- Optimizar queries de notificaciones

### Logs Útiles
```bash
# Creación de notificaciones
console.log('Notification created:', notification)

# Envío de emails
console.log('Email sent via:', provider)

# Errores de API
console.error('API error:', error)
```

