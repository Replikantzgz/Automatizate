---
name: 🌐 API
about: Reportar problemas con APIs o sugerir mejoras
title: '[API] '
labels: ['api', 'backend', 'endpoints', 'good-first-issue']
assignees: ''
---

## 🌐 Tipo de Problema de API

**¿Qué tipo de problema de API has encontrado?**

- [ ] ❌ **Endpoints fallando** o retornando errores
- [ ] 🔐 **Problemas de autenticación** o autorización
- [ ] 📊 **Respuestas incorrectas** o datos malformados
- [ ] 🐌 **APIs lentas** o que no responden
- [ ] 📝 **Validación de entrada** incorrecta
- [ ] 🔄 **Rate limiting** o throttling
- [ ] 📱 **CORS** o problemas de origen
- [ ] 🗄️ **Integración con base de datos** problemática
- [ ] 📧 **Webhooks** o notificaciones fallando
- [ ] 🎯 **Otro**: [especificar]

## 📍 Ubicación del Problema

**¿Dónde está el problema de API?**

- **Endpoint**: [ej. `/api/projects`, `/api/users`, `/api/payments`]
- **Método HTTP**: [ej. GET, POST, PUT, DELETE]
- **Archivo**: [ej. `app/api/projects/route.ts`]
- **Función**: [ej. `GET`, `POST`, `PUT`, `DELETE`]

## 🔍 Descripción del Problema

**Describe detalladamente el problema de API:**

### ¿Qué está pasando?
[Describe el comportamiento actual de la API]

### ¿Qué debería pasar?
[Describe el comportamiento esperado]

### ¿Cuándo ocurre?
[¿Siempre, solo con ciertos datos, solo en ciertas condiciones?]

## 📱 Información del Sistema

**Tu entorno de desarrollo:**

- **Sistema Operativo**: [ej. Windows 11, macOS 14, Ubuntu 22.04]
- **Node.js**: [ej. 18.17.0, 20.9.0]
- **Next.js**: [versión]
- **Navegador**: [ej. Chrome 120, Firefox 121, Safari 17]

### Dependencias relevantes:
- **@supabase/auth-helpers-nextjs**: [versión]
- **stripe**: [versión]
- **Otras**: [especificar]

## 📊 Detalles del Problema

**Información específica del problema:**

### Request que falla:
```typescript
// Ejemplo de la llamada a la API que falla
const response = await fetch('/api/projects', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    title: 'Mi Proyecto',
    description: 'Descripción del proyecto'
  })
})
```

### Error o output:
```json
{
  "error": "Internal Server Error",
  "message": "Something went wrong"
}
```

### Status code:
```
500 Internal Server Error
400 Bad Request
401 Unauthorized
403 Forbidden
```

## 🧪 Pasos para Reproducir

**¿Cómo puedo reproducir el problema?**

1. Ve a la página '...'
2. Realiza la acción '...'
3. Observa el error en la consola o UI

### Comandos específicos:
```bash
# Comando que falla
curl -X POST http://localhost:3000/api/projects \
  -H "Content-Type: application/json" \
  -d '{"title":"test","description":"test"}'

# Comando que funciona (si hay alguno)
curl -X GET http://localhost:3000/api/projects
```

## 📸 Capturas de Pantalla

**Si es relevante, agrega capturas de pantalla:**

- **Error en consola**: [captura del error]
- **Error en UI**: [captura del error en la interfaz]
- **Network tab**: [captura de la pestaña Network de DevTools]

## 🎯 Impacto y Prioridad

**¿Qué tan crítico es este problema?**

- [ ] 🚨 **Crítico** - Bloquea funcionalidades principales
- [ ] ⚠️ **Alto** - Dificulta el uso significativamente
- [ ] 🔶 **Medio** - Inconveniente pero funcional
- [ ] 📝 **Bajo** - Mejora menor de la experiencia

### Áreas afectadas:
- [ ] **Creación de proyectos** y propuestas
- [ ] **Sistema de pagos** y transacciones
- [ ] **Autenticación** y gestión de usuarios
- [ ] **Chat** y mensajería
- [ ] **Otros**: [especificar]

## 💡 Solución Propuesta

**¿Tienes alguna idea de cómo solucionarlo?**

### Cambios sugeridos:
```typescript
// ❌ ANTES: API problemática
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    // Procesar sin validación
    const result = await processProject(body)
    return NextResponse.json(result)
  } catch (error) {
    return NextResponse.json({ error: 'Something went wrong' }, { status: 500 })
  }
}

// ✅ DESPUÉS: API mejorada
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Validar entrada
    const validatedData = projectSchema.parse(body)
    
    // Procesar con validación
    const result = await processProject(validatedData)
    
    return NextResponse.json({ success: true, data: result })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ 
        error: 'Validation failed', 
        details: error.errors 
      }, { status: 400 })
    }
    
    console.error('API Error:', error)
    return NextResponse.json({ 
      error: 'Internal server error' 
    }, { status: 500 })
  }
}
```

### Estrategias de mejora:
- [ ] **Validación de entrada** con Zod o similar
- [ ] **Manejo de errores** estructurado
- [ ] **Logging** detallado para debugging
- [ ] **Rate limiting** para prevenir abuso
- [ ] **Caching** para respuestas frecuentes
- [ ] **Otros**: [especificar]

## 🔍 Análisis del Problema

**¿Qué crees que está causando el problema?**

### Posibles causas:
- [ ] **Validación de entrada** insuficiente
- [ ] **Manejo de errores** incorrecto
- [ ] **Autenticación** fallando
- [ ] **Base de datos** no disponible
- [ ] **Variables de entorno** faltantes
- [ ] **Dependencias externas** fallando
- [ ] **Otros**: [especificar]

## 🧪 Testing de API

**¿Qué has intentado para debuggear?**

- [ ] **Probar endpoint** con Postman o similar
- [ ] **Verificar logs** del servidor
- [ ] **Revisar variables de entorno**
- [ ] **Probar con diferentes datos** de entrada
- [ ] **Verificar autenticación** del usuario
- [ ] **Otros**: [especificar]

## 📚 Recursos de Referencia

**¿Qué recursos has consultado?**

- [ ] **Next.js API Routes** documentation
- [ ] **HTTP status codes** reference
- [ ] **REST API** best practices
- [ ] **Stack Overflow** o GitHub issues
- [ ] **Otros**: [especificar]

## 🎉 Contribución

**¿Te gustaría implementar la solución tú mismo?**

- [ ] ✅ **Sí, puedo arreglar la API**
- [ ] 🤔 **Tal vez, con algo de ayuda**
- [ ] ❌ **No, solo quiero reportarlo**

## 🔗 Issues Relacionados

**¿Hay otros issues relacionados con APIs?**

- **Issues relacionados**: #[número]
- **PRs relacionados**: #[número]
- **Discusiones**: [enlace]

## 📋 Checklist de API

**Antes de reportar, verifica:**

- [ ] **Endpoint responde** a requests básicos
- [ ] **Variables de entorno** están configuradas
- [ ] **Usuario está autenticado** (si es requerido)
- [ ] **Datos de entrada** son válidos
- [ ] **Base de datos** está disponible

## 🔧 Configuración de API

**¿Qué configuración de API usas?**

- [ ] **Next.js API Routes** (nativo)
- [ ] **Middleware** personalizado
- [ ] **Rate limiting** implementado
- [ ] **CORS** configurado
- [ ] **Otros**: [especificar]

### Configuración específica:
```typescript
// Ejemplo de configuración de API
export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  // Implementación
}
```

## 📝 Esquemas de Validación

**¿Qué esquemas de validación usas?**

```typescript
// Ejemplo de esquema de validación
import { z } from 'zod'

const projectSchema = z.object({
  title: z.string().min(1).max(100),
  description: z.string().min(10).max(1000),
  budget: z.number().min(0).optional(),
  deadline: z.string().datetime().optional()
})
```

---

**¡Gracias por ayudar a mejorar las APIs de AutoMarket! 🌐✨**

## 📞 Recursos de API

- **Next.js API Routes**: https://nextjs.org/docs/app/building-your-application/routing/route-handlers
- **HTTP Status Codes**: https://developer.mozilla.org/en-US/docs/Web/HTTP/Status
- **REST API Best Practices**: https://restfulapi.net/
- **API Testing**: https://www.postman.com/



