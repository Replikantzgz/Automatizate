# AutoMarket - Marketplace de Automatización

AutoMarket es una plataforma web que conecta empresas y autónomos con profesionales especializados en automatización de procesos empresariales.

## 🚀 Características

- **Sistema de autenticación** con Supabase Auth
- **Dos roles de usuario**: Cliente (empresa/autónomo) y Experto (profesional)
- **Dashboard diferenciado** según el rol del usuario
- **Creación de proyectos** para usuarios Cliente
- **Exploración de proyectos** para usuarios Experto
- **Gestión completa de proyectos** con estados y categorías
- **Sistema de filtros avanzados** para expertos
- **Chat interno en tiempo real** entre Cliente y Experto
- **Sistema de propuestas y contratos** para conectar Cliente y Experto
- **Sistema de pagos integrado** con Stripe y comisiones
- **Sistema de notificaciones** in-app y por email
- **Panel de administración completo** con gestión de usuarios, proyectos y reportes
- **Sistema de facturas PDF automático** con almacenamiento seguro
- **Cumplimiento legal completo** con GDPR y páginas legales
- **Interfaz moderna y responsive** con TailwindCSS
- **Arquitectura escalable** con Next.js 14

## 🛠️ Tecnologías utilizadas

- **Frontend**: Next.js 14, React 18, TypeScript
- **Estilos**: TailwindCSS
- **Backend**: Supabase (Auth + Database)
- **Autenticación**: Supabase Auth
- **Base de datos**: PostgreSQL (Supabase)
- **Tiempo real**: Supabase Realtime
- **Pagos**: Stripe Checkout y Connect
- **Email**: Resend/SendGrid con fallback
- **PDFs**: Puppeteer para generación de facturas
- **Storage**: Supabase Storage para documentos

## 📋 Requisitos previos

- Node.js 18+ 
- npm o yarn
- Cuenta de Supabase
- Cuenta de Stripe (para pagos)
- Cuenta de Resend o SendGrid (para emails)

## 🚀 Instalación

1. **Clonar el repositorio**
   ```bash
   git clone <tu-repositorio>
   cd AutoMarket
   ```

2. **Instalar dependencias**
   ```bash
   npm install
   ```

3. **Configurar variables de entorno**
   
   Crea un archivo `.env.local` en la raíz del proyecto:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=tu_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=tu_supabase_anon_key
   NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=tu_stripe_publishable_key
   STRIPE_SECRET_KEY=tu_stripe_secret_key
   STRIPE_WEBHOOK_SECRET=tu_stripe_webhook_secret
   RESEND_API_KEY=tu_resend_api_key
   SENDGRID_API_KEY=tu_sendgrid_api_key
   NEXT_PUBLIC_APP_URL=http://localhost:3000
   ```

4. **Configurar Supabase**
   
   Ejecuta el script SQL completo en `database_schema.sql` que incluye:
   - Tablas de perfiles, proyectos, conversaciones, mensajes
   - Tablas de propuestas, contratos, transacciones
   - Tablas de notificaciones, facturas
   - Políticas RLS para seguridad
   - Índices para rendimiento

5. **Configurar Supabase Storage**
   
   Crea un bucket `documents` para almacenar facturas PDF:
   ```sql
   INSERT INTO storage.buckets (id, name, public) 
   VALUES ('documents', 'documents', true);
   ```

6. **Ejecutar la aplicación**
   ```bash
   npm run dev
   ```

## 📁 Estructura del Proyecto

```
AutoMarket/
├── app/                    # App Router de Next.js 14
│   ├── admin/             # Panel de administración
│   │   ├── layout.tsx     # Layout protegido para admins
│   │   ├── page.tsx       # Dashboard principal del admin
│   │   ├── usuarios/      # Gestión de usuarios
│   │   ├── proyectos/     # Gestión de proyectos
│   │   ├── propuestas-contratos/ # Gestión de propuestas y contratos
│   │   ├── transacciones/ # Gestión de transacciones
│   │   ├── reportes/      # Reportes y KPIs
│   │   └── configuracion/ # Configuración del sistema
│   ├── api/               # API Routes
│   │   ├── auth/          # Endpoints de autenticación
│   │   ├── projects/      # Gestión de proyectos
│   │   ├── proposals/     # Sistema de propuestas
│   │   ├── contracts/     # Gestión de contratos
│   │   ├── payments/      # Sistema de pagos
│   │   ├── conversations/ # Chat y mensajes
│   │   ├── notifications/ # Sistema de notificaciones
│   │   ├── invoices/      # Generación de facturas
│   │   └── gdpr/          # Cumplimiento GDPR
│   ├── dashboard/         # Dashboards por rol
│   │   ├── cliente/       # Dashboard para clientes
│   │   └── experto/       # Dashboard para expertos
│   ├── projects/          # Gestión de proyectos
│   ├── conversations/     # Sistema de chat
│   ├── notifications/     # Centro de notificaciones
│   ├── invoices/          # Página de facturas
│   ├── privacy/           # Configuración de privacidad
│   ├── legal/             # Páginas legales
│   │   ├── terms/         # Términos y condiciones
│   │   ├── privacy/       # Política de privacidad
│   │   └── cookies/       # Política de cookies
│   ├── auth/              # Autenticación
│   │   ├── login/         # Inicio de sesión
│   │   └── register/      # Registro
│   └── page.tsx           # Página principal
├── components/             # Componentes reutilizables
│   ├── admin/             # Componentes del panel admin
│   │   └── AdminSidebar.tsx # Navegación lateral del admin
│   ├── ui/                # Componentes de UI reutilizables
│   │   └── card.tsx       # Componente Card
│   ├── Header.tsx         # Header con navegación
│   ├── Footer.tsx         # Footer con enlaces legales
│   └── CookieBanner.tsx   # Banner de cookies GDPR
├── lib/                    # Utilidades y configuración
│   ├── supabase.ts        # Configuración de Supabase
│   ├── stripe.ts          # Configuración de Stripe
│   ├── notifications.ts   # Servicio de notificaciones
│   ├── invoiceService.ts  # Servicio de generación de facturas
│   └── utils.ts           # Utilidades para componentes
├── public/                 # Archivos estáticos
├── .env.example           # Ejemplo de variables de entorno
├── package.json           # Dependencias del proyecto
├── tailwind.config.js     # Configuración de TailwindCSS
├── tsconfig.json          # Configuración de TypeScript
├── database_schema.sql    # Esquema completo de la base de datos
├── README.md              # Este archivo
├── ADMIN_PANEL_README.md  # Documentación del panel admin
├── NOTIFICATIONS_README.md # Documentación del sistema de notificaciones
└── INVOICES_LEGAL_README.md # Documentación de facturas y GDPR
```

## ✨ Funcionalidades Implementadas

### 🔐 Sistema de Autenticación
- **Registro** con roles Cliente/Experto
- **Login** seguro con Supabase Auth
- **Protección de rutas** por rol de usuario
- **Sesiones persistentes** con refresh automático

### 📊 Dashboards por Rol
- **Dashboard Cliente**: Gestión de proyectos, propuestas recibidas, pagos
- **Dashboard Experto**: Exploración de proyectos, propuestas enviadas, ingresos
- **Estadísticas en tiempo real** y métricas de rendimiento

### 🚀 Gestión de Proyectos
- **Creación de proyectos** con categorías y presupuestos
- **Sistema de filtros** avanzado para expertos
- **Estados de proyecto** (abierto, en proceso, completado, cancelado)
- **Adjuntos y archivos** para proyectos

### 💬 Sistema de Comunicación
- **Chat interno** en tiempo real con Supabase Realtime
- **Conversaciones** organizadas por proyecto
- **Notificaciones** push para nuevos mensajes
- **Historial completo** de comunicaciones

### 💰 Sistema de Pagos
- **Integración Stripe** para procesamiento seguro
- **Sistema de comisiones** configurable
- **Pagos por adelantado** con retención en escrow
- **Liberación automática** al completar proyectos

### 📋 Sistema de Propuestas
- **Envío de propuestas** por expertos
- **Evaluación y selección** por clientes
- **Creación automática** de contratos
- **Seguimiento de estado** de propuestas

### 📄 Generación de Facturas
- **Facturas PDF automáticas** al confirmar pagos
- **Diseño profesional** con branding de AutoMarket
- **Almacenamiento seguro** en Supabase Storage
- **Descarga directa** desde dashboards

### ⚖️ Cumplimiento Legal (GDPR)
- **Páginas legales completas** (términos, privacidad, cookies)
- **Consentimiento explícito** en el registro
- **Exportación de datos** en formato JSON
- **Solicitud de eliminación** con anonimización
- **Banner de cookies** configurable

### 🔔 Sistema de Notificaciones
- **Notificaciones in-app** en tiempo real
- **Emails transaccionales** con Resend/SendGrid
- **Tipos de notificación**: mensajes, propuestas, pagos, reviews
- **Centro de notificaciones** dedicado

### 🛡️ Panel de Administración
- **Acceso restringido** solo para usuarios admin
- **Gestión de usuarios** y roles
- **Moderación de proyectos** y contenido
- **Reportes y KPIs** del sistema
- **Configuración global** de la plataforma

## 🔒 Seguridad

- **Row Level Security (RLS)** en todas las tablas
- **Autenticación JWT** con Supabase
- **Validación de roles** en todas las rutas
- **Protección CSRF** en formularios
- **Sanitización de datos** en inputs
- **Políticas de acceso** granulares

## 📱 Responsive Design

- **Mobile-first** approach
- **TailwindCSS** para estilos consistentes
- **Componentes reutilizables** y accesibles
- **Navegación intuitiva** en todos los dispositivos
- **Iconografía moderna** con Lucide React

## 🚀 Despliegue

### Vercel (Recomendado)
```bash
npm run build
vercel --prod
```

### Docker
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

## 📊 Monitoreo y Analytics

- **Logs estructurados** para debugging
- **Métricas de rendimiento** con Next.js Analytics
- **Monitoreo de errores** en producción
- **KPIs del negocio** en panel admin

## 🔮 Roadmap

### Próximas Funcionalidades
- [ ] Sistema de reviews y ratings
- [ ] Integración con herramientas de automatización
- [ ] API REST pública para integraciones
- [ ] Sistema de suscripciones premium
- [ ] Marketplace de plantillas de automatización
- [ ] Integración con CRMs y ERPs
- [ ] Sistema de certificaciones para expertos
- [ ] Múltiples idiomas y localización

### Mejoras Técnicas
- [ ] Cache distribuido con Redis
- [ ] CDN para archivos estáticos
- [ ] Tests automatizados (Jest, Cypress)
- [ ] CI/CD pipeline completo
- [ ] Monitoreo con Sentry
- [ ] Backup automático de base de datos

## 🤝 Contribución

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo `LICENSE` para más detalles.

## 📞 Soporte

- **Documentación**: Consulta los READMEs específicos en cada carpeta
- **Issues**: Reporta bugs o solicita features en GitHub Issues
- **Email**: soporte@automarket.com
- **Discord**: [Servidor de la comunidad](https://discord.gg/automarket)

## 🙏 Agradecimientos

- **Supabase** por la infraestructura backend
- **Stripe** por el sistema de pagos
- **Vercel** por la plataforma de despliegue
- **TailwindCSS** por el framework de estilos
- **Next.js** por el framework de React

---

**AutoMarket** - Conectando el futuro de la automatización empresarial 🚀
