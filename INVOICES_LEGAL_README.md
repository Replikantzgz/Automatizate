# Sistema de Facturas PDF y Cumplimiento Legal - AutoMarket

## 📋 Resumen

Este documento describe la implementación del sistema de generación automática de facturas PDF y las funcionalidades de cumplimiento legal (GDPR) en AutoMarket.

## 🧾 Sistema de Facturas

### Características Principales

- **Generación automática**: Las facturas se crean automáticamente cuando se confirma un pago
- **Formato profesional**: Diseño limpio y profesional con branding de AutoMarket
- **Doble documento**: Factura para el cliente y recibo para el experto
- **Almacenamiento seguro**: PDFs almacenados en Supabase Storage
- **Descarga directa**: Acceso desde los dashboards de cliente y experto

### Estructura de la Base de Datos

```sql
-- Tabla de facturas
CREATE TABLE invoices (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  transaction_id UUID REFERENCES transactions(id) ON DELETE CASCADE,
  buyer_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  seller_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  amount DECIMAL(10,2) NOT NULL,
  commission_amount DECIMAL(10,2) DEFAULT 0,
  vat DECIMAL(10,2) DEFAULT 0,
  pdf_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### Flujo de Generación

1. **Confirmación de pago**: Cuando un cliente confirma un pago
2. **Llamada a la API**: Se llama automáticamente a `/api/invoices/generate`
3. **Generación de PDF**: Se crean facturas para cliente y experto
4. **Almacenamiento**: Los PDFs se suben a Supabase Storage
5. **Registro en BD**: Se crea el registro en la tabla `invoices`

### API Endpoints

#### Generar Factura
```http
POST /api/invoices/generate
Content-Type: application/json

{
  "transaction_id": "uuid-de-la-transaccion"
}
```

#### Obtener Facturas del Usuario
```http
GET /api/invoices/user
Authorization: Bearer <token>
```

### Componentes del Sistema

- **`InvoiceService`**: Servicio principal para generación y gestión de facturas
- **`/invoices`**: Página para visualizar y descargar facturas
- **Generación automática**: Integrada en el flujo de confirmación de pagos

## ⚖️ Cumplimiento Legal (GDPR)

### Páginas Legales Implementadas

#### 1. Términos y Condiciones (`/legal/terms`)
- Condiciones de uso de la plataforma
- Roles y responsabilidades de usuarios
- Sistema de pagos y comisiones
- Propiedad intelectual y limitaciones

#### 2. Política de Privacidad (`/legal/privacy`)
- Cumplimiento completo con GDPR
- Derechos de los usuarios
- Finalidad del tratamiento de datos
- Base legal del procesamiento
- Contacto del DPO

#### 3. Política de Cookies (`/legal/cookies`)
- Tipos de cookies utilizadas
- Gestión de preferencias
- Cookies de terceros (Stripe, Analytics)
- Configuración del navegador

### Funcionalidades GDPR

#### Exportación de Datos
```http
GET /api/gdpr/export
Authorization: Bearer <token>
```

**Incluye**:
- Perfil del usuario
- Proyectos creados
- Propuestas enviadas
- Contratos
- Transacciones
- Facturas
- Conversaciones y mensajes
- Notificaciones

#### Solicitud de Eliminación
```http
POST /api/gdpr/delete
Content-Type: application/json

{
  "reason": "Motivo de la eliminación",
  "confirmation": "ELIMINAR"
}
```

**Proceso**:
1. Anonimización de datos sensibles
2. Marcado de cuenta como eliminada
3. Conservación de datos financieros (obligación legal)
4. Cierre de sesión automático

### Banner de Cookies

- **Aparece automáticamente** en la primera visita
- **Configuración granular** de tipos de cookies
- **Persistencia** de preferencias en localStorage
- **Enlaces directos** a políticas legales

### Consentimiento de Privacidad

- **Checkbox obligatorio** en el registro
- **Enlaces a políticas** durante el registro
- **Almacenamiento** de consentimiento y fecha
- **Verificación** antes de crear cuenta

## 🔧 Implementación Técnica

### Dependencias Instaladas

```bash
npm install puppeteer @types/puppeteer
```

### Servicios Principales

#### InvoiceService
```typescript
class InvoiceService {
  // Genera HTML de factura
  private static async generateInvoiceHTML(invoiceData: InvoiceData, isClientInvoice: boolean): Promise<string>
  
  // Genera y almacena factura completa
  static async generateAndStoreInvoice(invoiceData: InvoiceData): Promise<{ success: boolean; pdfUrl?: string; error?: string }>
  
  // Genera PDF desde HTML
  private static async generatePDF(html: string): Promise<Buffer>
  
  // Obtiene facturas del usuario
  static async getInvoicesByUser(userId: string): Promise<any[]>
}
```

#### Generación de PDFs
- **Puppeteer**: Para renderizado HTML a PDF
- **Plantillas HTML**: Diseño responsive y profesional
- **CSS inline**: Compatibilidad garantizada
- **Formato A4**: Estándar internacional

### Estructura de Archivos

```
app/
├── api/
│   ├── invoices/
│   │   ├── generate/route.ts      # Generar facturas
│   │   └── user/route.ts          # Obtener facturas del usuario
│   └── gdpr/
│       ├── export/route.ts        # Exportar datos
│       └── delete/route.ts        # Solicitar eliminación
├── legal/
│   ├── terms/page.tsx             # Términos y condiciones
│   ├── privacy/page.tsx           # Política de privacidad
│   └── cookies/page.tsx           # Política de cookies
├── invoices/
│   └── page.tsx                   # Página de facturas
├── privacy/
│   └── page.tsx                   # Configuración de privacidad
└── layout.tsx                     # Layout con banner de cookies

components/
├── CookieBanner.tsx               # Banner de cookies
└── Footer.tsx                     # Footer con enlaces legales

lib/
└── invoiceService.ts              # Servicio de facturas
```

## 🚀 Uso y Configuración

### Configuración del Entorno

```bash
# Variables de entorno requeridas
NEXT_PUBLIC_APP_URL=http://localhost:3000
SUPABASE_URL=your_supabase_url
SUPABASE_ANON_KEY=your_supabase_anon_key
```

### Bucket de Storage

Crear bucket `documents` en Supabase Storage:
```sql
-- Crear bucket para documentos
INSERT INTO storage.buckets (id, name, public) 
VALUES ('documents', 'documents', true);

-- Políticas de acceso
CREATE POLICY "Public Access" ON storage.objects 
FOR SELECT USING (bucket_id = 'documents');
```

### Generación Manual de Facturas

```typescript
import { InvoiceService } from '@/lib/invoiceService'

const result = await InvoiceService.generateAndStoreInvoice({
  id: 'transaction-id',
  transaction_id: 'transaction-id',
  buyer_id: 'client-id',
  seller_id: 'expert-id',
  amount: 1000.00,
  commission_amount: 100.00,
  vat: 210.00,
  buyer_name: 'Nombre Cliente',
  buyer_email: 'cliente@email.com',
  seller_name: 'Nombre Experto',
  seller_email: 'experto@email.com',
  project_title: 'Proyecto de Automatización',
  project_description: 'Descripción del proyecto',
  created_at: new Date().toISOString()
})
```

## 📱 Interfaz de Usuario

### Página de Facturas (`/invoices`)

- **Lista de facturas** con información detallada
- **Descarga directa** de PDFs
- **Filtros y búsqueda** (futuro)
- **Estado de pagos** visual
- **Información de proyectos** asociados

### Configuración de Privacidad (`/privacy`)

- **Exportación de datos** en formato JSON
- **Solicitud de eliminación** con confirmación
- **Información sobre uso** de datos
- **Enlaces a documentos** legales

### Banner de Cookies

- **Configuración granular** de preferencias
- **Persistencia** de elecciones del usuario
- **Información clara** sobre tipos de cookies
- **Enlaces directos** a políticas

## 🔒 Seguridad y Privacidad

### Políticas RLS (Row Level Security)

```sql
-- Usuarios solo ven sus propias facturas
CREATE POLICY "Users can view their own invoices" ON invoices
  FOR SELECT USING (
    auth.uid() = buyer_id OR 
    auth.uid() = seller_id
  );

-- Solo el sistema puede crear facturas
CREATE POLICY "Only system can create invoices" ON invoices
  FOR INSERT WITH CHECK (false);
```

### Protección de Datos

- **Anonimización** en lugar de eliminación física
- **Conservación** de datos financieros (obligación legal)
- **Auditoría** de solicitudes de eliminación
- **Verificación** de identidad antes de acciones sensibles

### Cumplimiento GDPR

- **Consentimiento explícito** en el registro
- **Derechos de acceso** y portabilidad
- **Derecho de supresión** con anonimización
- **Transparencia** en el uso de datos
- **Contacto del DPO** disponible

## 🧪 Testing y Validación

### Pruebas de Facturación

1. **Crear transacción** de prueba
2. **Confirmar pago** para trigger automático
3. **Verificar generación** de factura
4. **Descargar PDF** desde dashboard
5. **Validar contenido** y formato

### Pruebas GDPR

1. **Exportar datos** del usuario
2. **Verificar formato** JSON
3. **Solicitar eliminación** con confirmación
4. **Verificar anonimización** de datos
5. **Comprobar cierre** de sesión

## 📈 Métricas y Monitoreo

### KPIs de Facturación

- **Facturas generadas** por día/mes
- **Tasa de éxito** en generación
- **Tiempo promedio** de generación
- **Errores** en el proceso

### Métricas GDPR

- **Solicitudes de exportación** procesadas
- **Solicitudes de eliminación** recibidas
- **Tiempo de respuesta** a solicitudes
- **Tasa de cumplimiento** de derechos

## 🔮 Futuras Mejoras

### Sistema de Facturación

- **Plantillas personalizables** por empresa
- **Múltiples monedas** y formatos
- **Integración con contabilidad** externa
- **Facturación recurrente** para suscripciones

### Funcionalidades GDPR

- **Dashboard de cumplimiento** para admins
- **Auditoría automática** de solicitudes
- **Notificaciones** de cambios en políticas
- **Integración** con herramientas de cumplimiento

### Mejoras de UX

- **Previsualización** de facturas antes de descarga
- **Búsqueda avanzada** en facturas
- **Filtros por fecha** y estado
- **Exportación masiva** de facturas

## 📞 Soporte y Contacto

### Documentación Adicional

- `README.md` - Documentación general del proyecto
- `ADMIN_PANEL_README.md` - Panel de administración
- `NOTIFICATIONS_README.md` - Sistema de notificaciones

### Contacto Técnico

- **Email**: tech@automarket.com
- **Issues**: GitHub Issues del proyecto
- **Documentación**: Este README y archivos relacionados

---

**Nota**: Este sistema cumple con los requisitos legales españoles y europeos (GDPR) para el manejo de datos personales y la generación de facturas electrónicas.



