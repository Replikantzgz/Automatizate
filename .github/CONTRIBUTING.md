# 🤝 Guía de Contribución para AutoMarket

¡Gracias por tu interés en contribuir a AutoMarket! 🚀

## 📋 Tabla de Contenidos

- [🎯 ¿Cómo Puedo Contribuir?](#-cómo-puedo-contribuir)
- [🐛 Reportar Bugs](#-reportar-bugs)
- [🚀 Solicitar Funcionalidades](#-solicitar-funcionalidades)
- [💻 Contribuir con Código](#-contribuir-con-código)
- [📚 Mejorar la Documentación](#-mejorar-la-documentación)
- [🧪 Tests](#-tests)
- [📝 Estándares de Código](#-estándares-de-código)
- [🔧 Configuración del Entorno](#-configuración-del-entorno)
- [📤 Proceso de Pull Request](#-proceso-de-pull-request)
- [🏷️ Convenciones de Commits](#-convenciones-de-commits)

## 🎯 ¿Cómo Puedo Contribuir?

### 🐛 Reportar Bugs

Si encuentras un bug:

1. **Busca en los issues existentes** para evitar duplicados
2. **Usa la plantilla de bug report** al crear un nuevo issue
3. **Proporciona información detallada** sobre el problema
4. **Incluye pasos para reproducir** el bug
5. **Adjunta capturas de pantalla** si es relevante

### 🚀 Solicitar Funcionalidades

Para nuevas funcionalidades:

1. **Verifica que no esté ya solicitada** en los issues
2. **Usa la plantilla de feature request**
3. **Explica el problema que resuelve**
4. **Describe cómo debería funcionar**
5. **Considera el impacto en usuarios existentes**

### 💻 Contribuir con Código

#### Requisitos Previos

- **Node.js 18+** y npm
- **Git** configurado
- **Conocimiento básico** de React, Next.js y TypeScript

#### Configuración Inicial

```bash
# Fork y clona el repositorio
git clone https://github.com/TU_USUARIO/Automatizate.git
cd Automatizate

# Instala dependencias
npm install

# Configura variables de entorno
cp .env.example .env.local
# Edita .env.local con tus credenciales

# Ejecuta en modo desarrollo
npm run dev
```

#### Estructura del Proyecto

```
app/                    # App Router de Next.js 14
├── api/               # API Routes
├── dashboard/         # Dashboards por rol
├── projects/          # Gestión de proyectos
├── conversations/     # Sistema de chat
├── invoices/          # Sistema de facturas
├── privacy/           # Configuración de privacidad
└── legal/             # Páginas legales

components/             # Componentes reutilizables
├── admin/             # Componentes del panel admin
├── ui/                # Componentes de UI
└── [otros]/           # Componentes específicos

lib/                   # Utilidades y servicios
├── supabase.ts        # Configuración de Supabase
├── stripe.ts          # Configuración de Stripe
├── notifications.ts   # Servicio de notificaciones
└── invoiceService.ts  # Servicio de facturas
```

### 📚 Mejorar la Documentación

La documentación es crucial:

- **README.md**: Descripción general del proyecto
- **READMEs específicos**: Funcionalidades individuales
- **Comentarios en código**: Explicar lógica compleja
- **Guías de usuario**: Tutoriales paso a paso

### 🧪 Tests

#### Ejecutar Tests

```bash
# Tests unitarios
npm test

# Tests de integración
npm run test:integration

# Tests end-to-end
npm run test:e2e

# Cobertura de tests
npm run test:coverage
```

#### Escribir Tests

- **Tests unitarios** para funciones individuales
- **Tests de integración** para APIs y servicios
- **Tests de componentes** para UI
- **Tests de base de datos** para operaciones CRUD

## 📝 Estándares de Código

### TypeScript

- **Usa tipos estrictos** siempre que sea posible
- **Evita `any`** - usa `unknown` o tipos específicos
- **Define interfaces** para objetos complejos
- **Usa enums** para valores constantes

### React/Next.js

- **Componentes funcionales** con hooks
- **Server Components** cuando sea posible
- **Client Components** solo cuando sea necesario
- **Manejo de estado** con useState/useReducer
- **Efectos secundarios** con useEffect

### Estilo de Código

- **Prettier** para formateo automático
- **ESLint** para reglas de calidad
- **Convenciones de nombres** consistentes
- **Comentarios** para lógica compleja

## 🔧 Configuración del Entorno

### Variables de Entorno

```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=tu_url_supabase
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu_clave_anonima

# Stripe
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=tu_clave_publica
STRIPE_SECRET_KEY=tu_clave_secreta

# Email
RESEND_API_KEY=tu_clave_resend
SENDGRID_API_KEY=tu_clave_sendgrid

# App
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### Base de Datos

1. **Crea un proyecto en Supabase**
2. **Ejecuta el script SQL** de `database_schema.sql`
3. **Configura las políticas RLS**
4. **Crea el bucket de storage** para documentos

## 📤 Proceso de Pull Request

### 1. Preparar tu Branch

```bash
# Crear y cambiar a nueva branch
git checkout -b feature/nombre-funcionalidad

# Hacer cambios y commits
git add .
git commit -m "feat: agregar nueva funcionalidad"

# Subir branch
git push origin feature/nombre-funcionalidad
```

### 2. Crear Pull Request

1. **Ve a GitHub** y crea un nuevo PR
2. **Usa la plantilla** de PR
3. **Describe los cambios** claramente
4. **Vincula issues** relacionados
5. **Adjunta capturas** si es necesario

### 3. Revisión y Merge

- **Los mantenedores revisarán** tu código
- **Responde a comentarios** constructivamente
- **Haz cambios** si es necesario
- **Una vez aprobado**, se hará merge

## 🏷️ Convenciones de Commits

Usamos [Conventional Commits](https://www.conventionalcommits.org/):

```
feat: agregar nueva funcionalidad
fix: corregir bug en autenticación
docs: actualizar README
style: formatear código
refactor: refactorizar servicio de notificaciones
test: agregar tests para dashboard
chore: actualizar dependencias
```

### Tipos de Commits

- **feat**: Nueva funcionalidad
- **fix**: Corrección de bugs
- **docs**: Cambios en documentación
- **style**: Cambios de formato
- **refactor**: Refactorización de código
- **test**: Agregar o modificar tests
- **chore**: Tareas de mantenimiento

## 🎉 Reconocimiento

Todas las contribuciones son valiosas:

- **Contribuidores** aparecen en el README
- **Mantenedores** pueden ser promovidos
- **Comunidad** crece con cada contribución

## 📞 Contacto

¿Tienes preguntas sobre contribuir?

- **Issues**: Para bugs y funcionalidades
- **Discussions**: Para preguntas generales
- **Discord**: Para chat en tiempo real
- **Email**: Para asuntos privados

---

**¡Juntos hacemos AutoMarket mejor cada día! 🚀✨**



