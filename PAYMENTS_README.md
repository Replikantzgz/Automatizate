# Sistema de Pagos con Stripe - AutoMarket

## Descripción General

Este sistema implementa un marketplace de pagos con retención de fondos, donde los clientes pagan por adelantado, la plataforma retiene el dinero hasta que el trabajo esté completado, y luego libera el pago al experto menos una comisión del 5%.

## Flujo de Pagos

### 1. Creación del Pago
- **Cliente** selecciona un experto y un proyecto
- **Cliente** ingresa el monto a pagar
- **Sistema** calcula automáticamente la comisión (5%)
- **Stripe** crea un Payment Intent con `capture_method: 'manual'`
- **Pago** se guarda en estado `pending`

### 2. Confirmación del Pago
- **Cliente** completa el pago con su tarjeta
- **Stripe** confirma el pago exitoso
- **Sistema** captura el pago y cambia estado a `paid`
- **Proyecto** cambia a estado `en_proceso`
- **Dinero** queda retenido en la cuenta de Stripe

### 3. Liberación del Pago
- **Cliente** confirma que el trabajo está terminado
- **Sistema** verifica que el proyecto esté en estado `completado`
- **Stripe** transfiere el dinero al experto (menos comisión)
- **Pago** cambia a estado `released`
- **Experto** recibe el dinero en su cuenta bancaria

## Estructura de la Base de Datos

### Tabla `payments`
```sql
- id: UUID (PK)
- project_id: UUID (FK a projects)
- client_id: UUID (FK a profiles)
- expert_id: UUID (FK a profiles)
- amount: DECIMAL (monto total)
- commission: DECIMAL (comisión 5%)
- expert_amount: DECIMAL (monto para experto)
- currency: VARCHAR (EUR por defecto)
- status: VARCHAR (pending, paid, released, refunded, disputed)
- stripe_payment_intent_id: VARCHAR (ID de Stripe)
- stripe_transfer_id: VARCHAR (ID de transferencia)
- created_at: TIMESTAMP
- updated_at: TIMESTAMP
- released_at: TIMESTAMP
```

### Tabla `profiles` (nueva columna)
```sql
- stripe_account_id: VARCHAR (cuenta de Stripe del experto)
```

## Configuración de Stripe

### Variables de Entorno Requeridas
```bash
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_SECRET_KEY=sk_test_...
```

### Configuración de Stripe Connect
1. **Crear cuenta de Stripe** para la plataforma
2. **Habilitar Stripe Connect** para marketplace
3. **Configurar cuentas de expertos** para recibir transferencias
4. **Configurar webhooks** para eventos de pago

## API Endpoints

### POST `/api/payments/create`
- Crea un nuevo pago
- Solo accesible para clientes
- Valida proyecto y experto
- Retorna client_secret para Stripe

### POST `/api/payments/confirm`
- Confirma un pago exitoso
- Solo accesible para el cliente que creó el pago
- Cambia estado a `paid`
- Actualiza estado del proyecto

### POST `/api/payments/release`
- Libera el pago al experto
- Solo accesible para el cliente
- Requiere proyecto completado
- Transfiere dinero via Stripe Connect

### GET `/api/payments/history`
- Obtiene historial de pagos del usuario
- Diferentes vistas para clientes y expertos
- Incluye estadísticas y transacciones

## Componentes React

### PaymentForm
- Formulario para crear pagos
- Cálculo automático de comisión
- Integración con Stripe Elements
- Validaciones de seguridad

### PaymentHistory
- Historial de transacciones
- Estadísticas de pagos
- Diferentes vistas por rol
- Estados visuales claros

### PaymentRelease
- Liberación de pagos
- Confirmación requerida
- Validaciones de estado
- Información detallada

## Seguridad

### Row Level Security (RLS)
- **Clientes** solo ven sus propios pagos
- **Expertos** solo ven pagos de sus proyectos
- **Validación de roles** en todas las operaciones
- **Autenticación** requerida para todas las APIs

### Validaciones
- Solo **clientes** pueden crear pagos
- Solo **clientes** pueden liberar pagos
- Solo **expertos** pueden recibir pagos
- **Estados** del proyecto validados antes de liberar

## Comisiones

### Estructura de Comisiones
- **Comisión fija**: 5% del monto total
- **Cálculo automático**: `commission = amount * 0.05`
- **Monto para experto**: `expert_amount = amount - commission`
- **Retención**: Hasta confirmación del cliente

### Ejemplo de Cálculo
```
Monto del proyecto: €100.00
Comisión (5%): €5.00
Para el experto: €95.00
```

## Estados del Pago

### pending
- Pago creado pero no confirmado
- Cliente puede cancelar
- Dinero no retenido

### paid
- Pago confirmado y retenido
- Proyecto en proceso
- Cliente puede liberar cuando esté terminado

### released
- Pago liberado al experto
- Transferencia completada
- Comisión retenida por la plataforma

### refunded
- Pago reembolsado al cliente
- En caso de disputa o cancelación

### disputed
- Pago en disputa
- Requiere intervención manual

## Implementación en el Frontend

### Página de Pagos
- **Ruta**: `/pagos`
- **Acceso**: Solo usuarios autenticados
- **Contenido**: Historial y estadísticas según rol

### Integración en Proyectos
- **Botón de pago** en detalles del proyecto
- **Modal de confirmación** antes de liberar
- **Estados visuales** claros para cada situación

## Monedas Soportadas

### Moneda Principal
- **EUR** (Euro) por defecto
- Configurable por proyecto
- Conversión automática si es necesario

## Webhooks de Stripe

### Eventos Importantes
- `payment_intent.succeeded`: Pago exitoso
- `payment_intent.payment_failed`: Pago fallido
- `transfer.created`: Transferencia al experto
- `transfer.failed`: Fallo en transferencia

### Manejo de Errores
- **Reintentos automáticos** para transferencias fallidas
- **Notificaciones** al usuario en caso de error
- **Logs detallados** para debugging

## Testing

### Datos de Prueba
```bash
# Tarjeta de prueba exitosa
4242 4242 4242 4242

# Tarjeta de prueba fallida
4000 0000 0000 0002

# Códigos de seguridad
Cualquier código de 3 dígitos
```

### Modo de Prueba
- **Stripe Dashboard** en modo test
- **Cuentas de prueba** para expertos
- **Transferencias simuladas** sin dinero real

## Despliegue

### Requisitos de Producción
1. **Cuenta de Stripe** en modo live
2. **Certificados SSL** para webhooks
3. **Variables de entorno** configuradas
4. **Base de datos** con RLS habilitado
5. **Logs de auditoría** habilitados

### Monitoreo
- **Stripe Dashboard** para transacciones
- **Logs de aplicación** para errores
- **Métricas de pagos** para análisis
- **Alertas** para transacciones fallidas

## Soporte y Mantenimiento

### Tareas Regulares
- **Revisar logs** de transacciones
- **Monitorear webhooks** de Stripe
- **Actualizar comisiones** si es necesario
- **Revisar disputas** y reembolsos

### Contacto
- **Stripe Support** para problemas de pagos
- **Documentación oficial** de Stripe Connect
- **Comunidad** de desarrolladores de Stripe



