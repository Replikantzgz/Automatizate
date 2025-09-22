---
name: 🔐 Autenticación
about: Reportar problemas con autenticación o sugerir mejoras
title: '[AUTH] '
labels: ['authentication', 'auth', 'security', 'good-first-issue']
assignees: ''
---

## 🔐 Tipo de Problema de Autenticación

**¿Qué tipo de problema de autenticación has encontrado?**

- [ ] ❌ **Login fallando** o no funcionando
- [ ] 🔄 **Registro** de usuarios problemático
- [ ] 🚪 **Logout** no funcionando correctamente
- [ ] 🔑 **Sesiones** expirando prematuramente
- [ ] 🔒 **Protección de rutas** no funcionando
- [ ] 👤 **Perfil de usuario** no se carga
- [ ] 🔄 **Refresh tokens** fallando
- [ ] 📧 **Verificación de email** problemática
- [ ] 🔒 **Recuperación de contraseña** no funciona
- [ ] 🎭 **Roles y permisos** incorrectos
- [ ] 🎯 **Otro**: [especificar]

## 📍 Ubicación del Problema

**¿Dónde está el problema de autenticación?**

- **Página**: [ej. /login, /register, /dashboard]
- **Componente**: [ej. LoginForm, RegisterForm, AuthGuard]
- **API endpoint**: [ej. /api/auth/login, /api/auth/register]
- **Middleware**: [ej. Auth middleware, Route protection]

## 🔍 Descripción del Problema

**Describe detalladamente el problema de autenticación:**

### ¿Qué está pasando?
[Describe el comportamiento actual]

### ¿Qué debería pasar?
[Describe el comportamiento esperado]

### ¿Cuándo ocurre?
[¿Siempre, solo en ciertos navegadores, solo en ciertos dispositivos?]

## 📱 Información del Sistema

**Tu entorno de desarrollo:**

- **Sistema Operativo**: [ej. Windows 11, macOS 14, Ubuntu 22.04]
- **Navegador**: [ej. Chrome 120, Firefox 121, Safari 17]
- **Versión del navegador**: [ej. 120.0.6099.109]
- **Modo**: [ej. Incógnito, Normal, Desarrollo]

### Dependencias relevantes:
- **@supabase/auth-helpers-nextjs**: [versión]
- **@supabase/supabase-js**: [versión]
- **Otras**: [especificar]

## 📊 Detalles del Problema

**Información específica del problema:**

### Acción que falla:
```typescript
// Ejemplo de la acción de autenticación que falla
const { data, error } = await supabase.auth.signInWithPassword({
  email: 'user@example.com',
  password: 'password123'
})
```

### Error o output:
```
Error: Invalid login credentials
Error: User not found
Error: Too many requests
```

### Stack trace:
```
at Object.<anonymous> (/path/to/file.ts:15:25)
at processTicksAndRejections (node:internal/process/task_queues:95:5)
```

## 🧪 Pasos para Reproducir

**¿Cómo puedo reproducir el problema?**

1. Ve a la página '...'
2. Intenta '...'
3. Observa el error

### Datos de prueba:
- **Email**: [ej. test@example.com]
- **Contraseña**: [ej. test123]
- **Usuario existente**: [¿Sí/No?]

## 📸 Capturas de Pantalla

**Si es relevante, agrega capturas de pantalla:**

- **Error en UI**: [captura del error]
- **Error en consola**: [captura del error en consola]
- **Estado de autenticación**: [captura del estado actual]

## 🎯 Impacto y Prioridad

**¿Qué tan crítico es este problema?**

- [ ] 🚨 **Crítico** - Bloquea completamente el acceso
- [ ] ⚠️ **Alto** - Dificulta significativamente el uso
- [ ] 🔶 **Medio** - Inconveniente pero funcional
- [ ] 📝 **Bajo** - Mejora menor de la experiencia

### Usuarios afectados:
- [ ] **Todos los usuarios** de la plataforma
- [ ] **Usuarios nuevos** (registro)
- [ ] **Usuarios existentes** (login)
- [ ] **Usuarios específicos** (roles, permisos)
- [ ] **Otros**: [especificar]

## 💡 Solución Propuesta

**¿Tienes alguna idea de cómo solucionarlo?**

### Cambios sugeridos:
```typescript
// ❌ ANTES: Autenticación problemática
const { data, error } = await supabase.auth.signInWithPassword({
  email,
  password
})

if (error) {
  setError('Login failed')
}

// ✅ DESPUÉS: Autenticación mejorada
try {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password
  })

  if (error) {
    if (error.message.includes('Invalid login credentials')) {
      setError('Email o contraseña incorrectos')
    } else if (error.message.includes('Too many requests')) {
      setError('Demasiados intentos. Intenta más tarde')
    } else {
      setError('Error de autenticación. Intenta de nuevo')
    }
    return
  }

  // Login exitoso
  router.push('/dashboard')
} catch (error) {
  console.error('Auth error:', error)
  setError('Error inesperado. Intenta de nuevo')
}
```

### Estrategias de mejora:
- [ ] **Manejo de errores** estructurado
- [ ] **Validación de entrada** antes de enviar
- [ ] **Rate limiting** para prevenir ataques
- [ ] **Logging** detallado para debugging
- [ ] **Fallback strategies** para errores
- [ ] **Otros**: [especificar]

## 🔍 Análisis del Problema

**¿Qué crees que está causando el problema?**

### Posibles causas:
- [ ] **Credenciales incorrectas** del usuario
- [ ] **Configuración de Supabase** incorrecta
- [ ] **Variables de entorno** faltantes
- [ ] **Políticas de RLS** muy restrictivas
- [ ] **Rate limiting** de Supabase
- [ ] **Problemas de red** o conectividad
- [ ] **Otros**: [especificar]

## 🧪 Testing de Autenticación

**¿Qué has intentado para debuggear?**

- [ ] **Verificar credenciales** del usuario
- [ ] **Revisar variables de entorno** de Supabase
- [ ] **Probar en modo incógnito** del navegador
- [ ] **Verificar políticas RLS** en Supabase
- [ ] **Revisar logs** de Supabase
- [ ] **Otros**: [especificar]

## 📚 Recursos de Referencia

**¿Qué recursos has consultado?**

- [ ] **Supabase Auth documentation** oficial
- [ ] **Next.js Auth helpers** documentation
- [ ] **Authentication best practices**
- [ ] **Stack Overflow** o GitHub issues
- [ ] **Otros**: [especificar]

## 🎉 Contribución

**¿Te gustaría implementar la solución tú mismo?**

- [ ] ✅ **Sí, puedo arreglar el problema de auth**
- [ ] 🤔 **Tal vez, con algo de ayuda**
- [ ] ❌ **No, solo quiero reportarlo**

## 🔗 Issues Relacionados

**¿Hay otros issues relacionados con autenticación?**

- **Issues relacionados**: #[número]
- **PRs relacionados**: #[número]
- **Discusiones**: [enlace]

## 📋 Checklist de Autenticación

**Antes de reportar, verifica:**

- [ ] **Credenciales** son correctas
- [ ] **Variables de entorno** están configuradas
- [ ] **Supabase** está funcionando
- [ ] **Usuario existe** en la base de datos
- [ ] **Políticas RLS** no son muy restrictivas

## 🔧 Configuración de Autenticación

**¿Qué configuración de autenticación usas?**

- [ ] **Supabase Auth** (nativo)
- [ ] **Next.js Auth helpers** para integración
- [ ] **Middleware** para protección de rutas
- [ ] **Context** para estado de autenticación
- [ ] **Otros**: [especificar]

### Configuración específica:
```typescript
// Ejemplo de configuración de Supabase
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

// Ejemplo de middleware de autenticación
export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  
  if (pathname.startsWith('/dashboard')) {
    // Verificar autenticación
  }
}
```

## 🔒 Seguridad

**¿Qué aspectos de seguridad están afectados?**

- [ ] **Contraseñas** no se validan correctamente
- [ ] **Sesiones** no expiran apropiadamente
- [ ] **Tokens** se almacenan de forma insegura
- [ ] **Rate limiting** no está implementado
- [ ] **Logs de seguridad** no se generan
- [ ] **Otros**: [especificar]

## 👥 Roles y Permisos

**¿Qué roles de usuario están involucrados?**

- [ ] **Cliente** - Usuario que contrata servicios
- [ ] **Experto** - Usuario que ofrece servicios
- [ ] **Admin** - Usuario con permisos administrativos
- [ ] **Moderador** - Usuario con permisos de moderación
- [ ] **Otros**: [especificar]

---

**¡Gracias por ayudar a mejorar la seguridad de AutoMarket! 🔐✨**

## 📞 Recursos de Autenticación

- **Supabase Auth**: https://supabase.com/docs/guides/auth
- **Next.js Auth Helpers**: https://supabase.com/docs/guides/auth/auth-helpers/nextjs
- **Authentication Best Practices**: https://owasp.org/www-project-top-ten/
- **Security Guidelines**: https://supabase.com/docs/guides/security



