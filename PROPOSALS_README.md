# Sistema de Propuestas - AutoMarket

## Descripción General

Este sistema implementa un flujo completo de propuestas para conectar clientes con expertos en proyectos de automatización. Los expertos pueden enviar propuestas a proyectos abiertos, y los clientes pueden aceptar o rechazar estas propuestas, creando contratos automáticamente.

## Flujo de Propuestas

### 1. Exploración de Proyectos
- **Experto** navega por proyectos disponibles
- **Filtra** por categoría, presupuesto y estado
- **Selecciona** proyecto de interés

### 2. Envío de Propuesta
- **Experto** hace clic en "Enviar Propuesta"
- **Completa** formulario con:
  - Precio propuesto (EUR)
  - Días estimados para completar
  - Mensaje explicativo
- **Sistema** valida y guarda la propuesta

### 3. Revisión por Cliente
- **Cliente** ve propuestas en su dashboard
- **Revisa** precio, tiempo y mensaje
- **Decide** aceptar o rechazar

### 4. Aceptación y Contrato
- **Cliente** acepta propuesta
- **Sistema** crea contrato automáticamente
- **Proyecto** cambia a estado "en_proceso"
- **Otras propuestas** se rechazan automáticamente

### 5. Completado del Trabajo
- **Experto** trabaja en el proyecto
- **Cliente** marca como completado
- **Contrato** se actualiza a "completed"
- **Proyecto** cambia a estado "completado"

## Estructura de la Base de Datos

### Tabla `proposals`
```sql
- id: UUID (PK)
- project_id: UUID (FK a projects)
- expert_id: UUID (FK a profiles)
- price: DECIMAL (precio propuesto en EUR)
- estimated_days: INTEGER (días estimados)
- message: TEXT (mensaje explicativo)
- status: VARCHAR (sent, accepted, rejected)
- created_at: TIMESTAMP
- updated_at: TIMESTAMP
```

### Tabla `contracts`
```sql
- id: UUID (PK)
- project_id: UUID (FK a projects)
- client_id: UUID (FK a profiles)
- expert_id: UUID (FK a profiles)
- proposal_id: UUID (FK a proposals)
- agreed_price: DECIMAL (precio acordado)
- start_date: TIMESTAMP
- status: VARCHAR (active, completed, disputed)
- completed_at: TIMESTAMP
- created_at: TIMESTAMP
- updated_at: TIMESTAMP
```

## API Endpoints

### POST `/api/proposals/create`
- Crea una nueva propuesta
- Solo accesible para expertos
- Valida proyecto abierto y propuesta única
- Retorna propuesta creada

### POST `/api/proposals/update-status`
- Actualiza estado de propuesta (aceptar/rechazar)
- Solo accesible para clientes
- Crea contrato si es aceptada
- Actualiza estado del proyecto

### GET `/api/proposals/list`
- Obtiene lista de propuestas según rol
- Clientes ven propuestas de sus proyectos
- Expertos ven sus propias propuestas
- Incluye estadísticas

### POST `/api/contracts/complete`
- Marca contrato como completado
- Solo accesible para clientes
- Actualiza estado del proyecto
- Requiere contrato activo

## Componentes React

### ProposalForm
- Formulario para crear propuestas
- Validaciones de campos
- Integración con API
- Manejo de errores

### ProposalCard
- Muestra detalles de propuesta
- Acciones según rol y estado
- Integración con sistema de pagos
- Estados visuales claros

### ContractCard
- Muestra detalles del contrato
- Acciones para completar
- Información del proyecto
- Estados del contrato

## Páginas

### `/propuestas`
- Dashboard principal de propuestas
- Diferentes vistas para clientes y expertos
- Estadísticas y listado
- Información del sistema

### `/projects/[id]/proposal`
- Página para enviar propuesta
- Información del proyecto
- Formulario de propuesta
- Consejos para expertos

## Estados y Flujos

### Estados de Propuesta
- **sent**: Propuesta enviada, esperando respuesta
- **accepted**: Propuesta aceptada, contrato creado
- **rejected**: Propuesta rechazada, puede re-enviar

### Estados de Contrato
- **active**: Contrato activo, trabajo en progreso
- **completed**: Contrato completado, trabajo terminado
- **disputed**: Contrato en disputa, requiere atención

### Estados de Proyecto
- **abierto**: Acepta propuestas
- **en_proceso**: Propuesta aceptada, trabajo en curso
- **completado**: Trabajo terminado

## Validaciones y Seguridad

### Row Level Security (RLS)
- **Expertos** solo ven sus propuestas
- **Clientes** solo ven propuestas de sus proyectos
- **Validación de roles** en todas las operaciones
- **Autenticación** requerida para todas las APIs

### Validaciones de Negocio
- Solo **expertos** pueden crear propuestas
- Solo **clientes** pueden aceptar/rechazar
- Solo **un experto activo** por proyecto
- **Proyectos abiertos** solo para propuestas

### Restricciones de Propuestas
- **Una propuesta activa** por experto por proyecto
- **Re-envío permitido** si fue rechazada
- **Validación de campos** obligatorios
- **Verificación de estado** del proyecto

## Integración con Sistema de Pagos

### Flujo de Pago
1. **Cliente acepta propuesta**
2. **Se crea contrato automáticamente**
3. **CTA "Pagar ahora" aparece**
4. **Cliente completa pago**
5. **Dinero se retiene hasta completar**
6. **Cliente libera pago al experto**

### Estados de Pago
- **pending**: Pago creado pero no confirmado
- **paid**: Pago confirmado y retenido
- **released**: Pago liberado al experto

## UI/UX

### Diseño de Tarjetas
- **Propuestas**: Información clara y accesible
- **Estados**: Colores diferenciados por estado
- **Acciones**: Botones principales en azul
- **Responsive**: Adaptable a diferentes dispositivos

### Navegación
- **Header**: Enlace "Propuestas" para todos los usuarios
- **Breadcrumbs**: Navegación clara entre páginas
- **Botones**: Acciones contextuales según estado
- **Feedback**: Mensajes de éxito y error claros

### Estados Visuales
- **sent**: Gris (neutral)
- **accepted**: Verde (positivo)
- **rejected**: Rojo (negativo)
- **active**: Azul (en progreso)
- **completed**: Verde (terminado)

## Funcionalidades Destacadas

### Para Expertos
- **Explorar proyectos** abiertos
- **Enviar propuestas** personalizadas
- **Seguir estado** de propuestas
- **Re-enviar** si son rechazadas
- **Ver contratos** activos

### Para Clientes
- **Recibir propuestas** de expertos
- **Comparar opciones** (precio, tiempo, mensaje)
- **Aceptar/rechazar** propuestas
- **Gestionar contratos** activos
- **Marcar como completado** cuando estén satisfechos

### Automatizaciones
- **Creación automática** de contratos
- **Actualización de estados** de proyectos
- **Rechazo automático** de otras propuestas
- **Integración** con sistema de pagos
- **Notificaciones** de cambios de estado

## Próximos Pasos

### Mejoras Futuras
- **Sistema de notificaciones** en tiempo real
- **Calificaciones y reviews** post-proyecto
- **Sistema de disputas** automatizado
- **Métricas avanzadas** para expertos
- **Integración con calendario** para fechas

### Escalabilidad
- **Webhooks** para integraciones externas
- **API rate limiting** para protección
- **Caché** para consultas frecuentes
- **Logs de auditoría** completos
- **Backup automático** de datos

## Testing

### Casos de Prueba
- **Creación de propuestas** por expertos
- **Aceptación/rechazo** por clientes
- **Validaciones** de campos
- **Restricciones** de seguridad
- **Flujos completos** de propuesta a contrato

### Datos de Prueba
- **Usuarios**: Cliente y Experto
- **Proyectos**: Diferentes estados y categorías
- **Propuestas**: Varios precios y mensajes
- **Contratos**: Diferentes estados

## Despliegue

### Requisitos
- **Base de datos** con RLS habilitado
- **Variables de entorno** configuradas
- **APIs** funcionando correctamente
- **Componentes** compilados
- **Rutas** configuradas en Next.js

### Monitoreo
- **Logs de propuestas** y contratos
- **Métricas de conversión** (propuestas → contratos)
- **Tiempo promedio** de respuesta
- **Errores** en creación/actualización
- **Performance** de consultas a base de datos

