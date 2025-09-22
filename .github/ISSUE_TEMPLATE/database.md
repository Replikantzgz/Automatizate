---
name: 🗄️ Base de Datos
about: Reportar problemas con la base de datos o sugerir mejoras
title: '[DB] '
labels: ['database', 'supabase', 'sql', 'good-first-issue']
assignees: ''
---

## 🗄️ Tipo de Problema de Base de Datos

**¿Qué tipo de problema de base de datos has encontrado?**

- [ ] ❌ **Consultas lentas** o que no responden
- [ ] 🔐 **Problemas de autenticación** o permisos
- [ ] 📊 **Datos corruptos** o inconsistentes
- [ ] 🔄 **Sincronización** entre cliente y servidor
- [ ] 📈 **Escalabilidad** o límites de rendimiento
- [ ] 🗂️ **Estructura de tablas** o esquemas
- [ ] 🔍 **Búsquedas** o filtros problemáticos
- [ ] 📝 **Inserciones/actualizaciones** fallando
- [ ] 🗑️ **Eliminaciones** o soft deletes
- [ ] 🔗 **Relaciones** entre tablas
- [ ] 🎯 **Otro**: [especificar]

## 📍 Ubicación del Problema

**¿Dónde está el problema de base de datos?**

- **Tabla**: [ej. `profiles`, `projects`, `conversations`]
- **Operación**: [ej. SELECT, INSERT, UPDATE, DELETE]
- **API endpoint**: [ej. `/api/projects`, `/api/users`]
- **Componente**: [ej. Dashboard, ProjectList, UserProfile]

## 🔍 Descripción del Problema

**Describe detalladamente el problema de base de datos:**

### ¿Qué está pasando?
[Describe el comportamiento actual]

### ¿Qué debería pasar?
[Describe el comportamiento esperado]

### ¿Cuándo ocurre?
[¿Siempre, solo con ciertos datos, solo en ciertas condiciones?]

## 📱 Información del Sistema

**Tu entorno de desarrollo:**

- **Sistema Operativo**: [ej. Windows 11, macOS 14, Ubuntu 22.04]
- **Node.js**: [ej. 18.17.0, 20.9.0]
- **Supabase**: [versión del cliente]
- **Navegador**: [ej. Chrome 120, Firefox 121, Safari 17]

### Dependencias relevantes:
- **@supabase/supabase-js**: [versión]
- **@supabase/auth-helpers-nextjs**: [versión]
- **Otras**: [especificar]

## 📊 Detalles del Problema

**Información específica del problema:**

### Consulta problemática:
```typescript
// Ejemplo de la consulta que falla
const { data, error } = await supabase
  .from('projects')
  .select('*')
  .eq('status', 'abierto')
  .order('created_at', { ascending: false })
```

### Error o output:
```
Error: relation "projects" does not exist
Error: permission denied for table projects
Error: timeout expired
```

### Stack trace:
```
at Object.<anonymous> (/path/to/file.ts:15:25)
at processTicksAndRejections (node:internal/process/task_queues:95:5)
```

## 🧪 Pasos para Reproducir

**¿Cómo puedo reproducir el problema?**

1. Ve a la página '...'
2. Realiza la acción '...'
3. Observa el error en la consola o UI

### Comandos específicos:
```bash
# Comando que falla
npm run dev

# Comando que funciona (si hay alguno)
npm run build
```

## 📸 Capturas de Pantalla

**Si es relevante, agrega capturas de pantalla:**

- **Error en consola**: [captura del error]
- **Error en UI**: [captura del error en la interfaz]
- **Supabase Dashboard**: [captura del problema en Supabase]

## 🎯 Impacto y Prioridad

**¿Qué tan crítico es este problema?**

- [ ] 🚨 **Crítico** - Bloquea funcionalidades principales
- [ ] ⚠️ **Alto** - Dificulta el uso significativamente
- [ ] 🔶 **Medio** - Inconveniente pero funcional
- [ ] 📝 **Bajo** - Mejora menor de la experiencia

### Áreas afectadas:
- [ ] **Autenticación** de usuarios
- [ ] **Gestión de proyectos** y propuestas
- [ ] **Sistema de chat** y mensajes
- [ ] **Pagos** y transacciones
- [ ] **Otros**: [especificar]

## 💡 Solución Propuesta

**¿Tienes alguna idea de cómo solucionarlo?**

### Cambios sugeridos:
```typescript
// ❌ ANTES: Consulta problemática
const { data, error } = await supabase
  .from('projects')
  .select('*')
  .eq('status', 'abierto')

// ✅ DESPUÉS: Consulta mejorada
const { data, error } = await supabase
  .from('projects')
  .select('id, title, description, status, created_at')
  .eq('status', 'abierto')
  .eq('is_active', true)
  .order('created_at', { ascending: false })
  .limit(50)
```

### Estrategias de optimización:
- [ ] **Índices** en columnas frecuentemente consultadas
- [ ] **Paginación** para resultados grandes
- [ ] **Selección específica** de columnas
- [ ] **Caching** de consultas frecuentes
- [ ] **Consultas preparadas** para operaciones repetitivas
- [ ] **Otros**: [especificar]

## 🔍 Análisis del Problema

**¿Qué crees que está causando el problema?**

### Posibles causas:
- [ ] **Tabla no existe** o nombre incorrecto
- **Permisos RLS** insuficientes
- [ ] **Índices faltantes** en columnas consultadas
- [ ] **Relaciones incorrectas** entre tablas
- [ ] **Timeout** en consultas complejas
- [ ] **Rate limiting** de Supabase
- [ ] **Otros**: [especificar]

## 🧪 Testing de Base de Datos

**¿Qué has intentado para debuggear?**

- [ ] **Verificar en Supabase Dashboard** que la tabla existe
- [ ] **Revisar políticas RLS** de la tabla
- [ ] **Ejecutar consultas directamente** en SQL Editor
- [ ] **Verificar permisos** del usuario autenticado
- [ ] **Revisar logs** de Supabase
- [ ] **Otros**: [especificar]

## 📚 Recursos de Referencia

**¿Qué recursos has consultado?**

- [ ] **Supabase documentation** oficial
- [ ] **PostgreSQL documentation** para consultas SQL
- [ ] **RLS policies** guides
- [ ] **Stack Overflow** o GitHub issues
- [ ] **Otros**: [especificar]

## 🎉 Contribución

**¿Te gustaría implementar la solución tú mismo?**

- [ ] ✅ **Sí, puedo arreglar el problema de BD**
- [ ] 🤔 **Tal vez, con algo de ayuda**
- [ ] ❌ **No, solo quiero reportarlo**

## 🔗 Issues Relacionados

**¿Hay otros issues relacionados con base de datos?**

- **Issues relacionados**: #[número]
- **PRs relacionados**: #[número]
- **Discusiones**: [enlace]

## 📋 Checklist de Base de Datos

**Antes de reportar, verifica:**

- [ ] **Tabla existe** en Supabase Dashboard
- [ ] **Políticas RLS** están configuradas correctamente
- [ ] **Usuario está autenticado** correctamente
- [ ] **Permisos** son suficientes para la operación
- [ ] **Conexión a Supabase** está funcionando

## 🔧 Configuración de Base de Datos

**¿Qué configuración de base de datos usas?**

- [ ] **Supabase** (PostgreSQL)
- [ ] **PostgreSQL local** para desarrollo
- [ ] **SQLite** para testing
- [ ] **Otros**: [especificar]

### Configuración específica:
```typescript
// Ejemplo de configuración de Supabase
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)
```

## 🗂️ Estructura de Tablas

**¿Qué tablas están involucradas?**

```sql
-- Ejemplo de estructura de tabla
CREATE TABLE projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'abierto',
  user_id UUID REFERENCES profiles(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

---

**¡Gracias por ayudar a mejorar la base de datos de AutoMarket! 🗄️✨**

## 📞 Recursos de Base de Datos

- **Supabase**: https://supabase.com/docs
- **PostgreSQL**: https://www.postgresql.org/docs/
- **RLS Policies**: https://supabase.com/docs/guides/auth/row-level-security
- **Performance**: https://supabase.com/docs/guides/database/performance



