---
name: 🔄 CI/CD
about: Reportar problemas con CI/CD o sugerir mejoras
title: '[CI/CD] '
labels: ['ci-cd', 'github-actions', 'deployment', 'good-first-issue']
assignees: ''
---

## 🔄 Tipo de Problema de CI/CD

**¿Qué tipo de problema de CI/CD has encontrado?**

- [ ] ❌ **Builds fallando** en GitHub Actions
- [ ] 🚀 **Deployments fallando** o no completándose
- [ ] 🐌 **Builds lentos** o que toman demasiado tiempo
- [ ] 🔧 **Configuración incorrecta** de workflows
- [ ] 🔐 **Problemas de secretos** o variables de entorno
- [ ] 📱 **Tests fallando** en CI pero pasando localmente
- [ ] 🌐 **Problemas de despliegue** en Vercel/Netlify
- [ ] 📊 **Métricas de CI/CD** incorrectas
- 🔄 **Otro**: [especificar]

## 📍 Ubicación del Problema

**¿Dónde está el problema de CI/CD?**

- **Workflow**: [ej. `deploy.yml`, `test.yml`]
- **Job específico**: [ej. `test-and-build`, `deploy-production`]
- **Step específico**: [ej. `Build project`, `Deploy to Vercel`]
- **Entorno**: [ej. Development, Staging, Production]

## 🔍 Descripción del Problema

**Describe detalladamente el problema de CI/CD:**

### ¿Qué está pasando?
[Describe el comportamiento actual del workflow]

### ¿Qué debería pasar?
[Describe el comportamiento esperado]

### ¿Cuándo ocurre?
[¿Siempre, solo en ciertos branches, solo en ciertos commits?]

## 📱 Información del Sistema

**Tu entorno de desarrollo:**

- **Sistema Operativo**: [ej. Windows 11, macOS 14, Ubuntu 22.04]
- **Node.js**: [ej. 18.17.0, 20.9.0]
- **Package Manager**: [ej. npm 9.6.7, yarn 1.22.19, pnpm 8.6.0]
- **Git**: [ej. 2.41.0]

### Dependencias relevantes:
- **Next.js**: [versión]
- **TypeScript**: [versión]
- **Otras**: [especificar]

## 📊 Detalles del Workflow

**Información específica del workflow:**

### Workflow que falla:
```yaml
# Ejemplo del workflow problemático
name: 🚀 Deploy AutoMarket
on:
  push:
    branches: [ main, develop ]
jobs:
  test-and-build:
    runs-on: ubuntu-latest
    steps:
      - name: 📥 Checkout code
        uses: actions/checkout@v4
      # ... más steps
```

### Error o output:
```
Error: Process completed with exit code 1
Error: The process '/usr/bin/docker' failed with exit code 1
```

### Logs completos:
[Adjunta los logs completos del workflow si es posible]

## 🧪 Pasos para Reproducir

**¿Cómo puedo reproducir el problema?**

1. Haz push a la rama '...'
2. Ve a Actions en GitHub
3. Observa el workflow fallando

### Comandos específicos:
```bash
# Comando que falla localmente (si aplica)
npm run build

# Comando que funciona (si hay alguno)
npm run dev
```

## 📸 Capturas de Pantalla

**Si es relevante, agrega capturas de pantalla:**

- **Error del workflow**: [captura del error en GitHub Actions]
- **Logs del workflow**: [captura de los logs de error]
- **Configuración del workflow**: [captura del archivo YAML]

## 🎯 Impacto y Prioridad

**¿Qué tan crítico es este problema?**

- [ ] 🚨 **Crítico** - Bloquea despliegues a producción
- [ ] ⚠️ **Alto** - Dificulta el desarrollo significativamente
- [ ] 🔶 **Medio** - Inconveniente pero manejable
- [ ] 📝 **Bajo** - Mejora menor del proceso

### Áreas afectadas:
- [ ] **Despliegues automáticos** a producción
- [ ] **Integración continua** y testing
- [ ] **Desarrollo colaborativo** del equipo
- [ ] **Calidad del código** y revisión
- [ ] **Otros**: [especificar]

## 💡 Solución Propuesta

**¿Tienes alguna idea de cómo solucionarlo?**

### Cambios sugeridos:
```yaml
# ❌ ANTES: Configuración problemática
- name: 🏗️ Build project
  run: npm run build
  env:
    NODE_ENV: production

# ✅ DESPUÉS: Configuración mejorada
- name: 🏗️ Build project
  run: npm run build
  env:
    NODE_ENV: production
    NEXT_TELEMETRY_DISABLED: 1
```

### Estrategias de CI/CD:
- [ ] **Caching** de dependencias y build artifacts
- [ ] **Matrix builds** para múltiples versiones
- [ ] **Conditional steps** basados en contexto
- [ ] **Parallel jobs** para mejor rendimiento
- [ ] **Rollback strategies** para deployments fallidos
- [ ] **Otros**: [especificar]

## 🔍 Análisis del Problema

**¿Qué crees que está causando el problema?**

### Posibles causas:
- [ ] **Variables de entorno** faltantes o incorrectas
- [ ] **Secretos de GitHub** expirados o incorrectos
- [ ] **Dependencias** incompatibles o faltantes
- [ ] **Configuración de Node.js** incorrecta
- [ ] **Permisos** insuficientes en el repositorio
- [ ] **Rate limiting** de servicios externos
- [ ] **Otros**: [especificar]

## 🧪 Testing del Workflow

**¿Qué has intentado para debuggear?**

- [ ] **Ejecutar workflow manualmente** desde GitHub
- [ ] **Verificar secretos** y variables de entorno
- [ ] **Comparar con workflows similares** que funcionan
- [ ] **Ejecutar comandos localmente** para replicar el error
- [ ] **Verificar permisos** del repositorio
- [ ] **Otros**: [especificar]

## 📚 Recursos de Referencia

**¿Qué recursos has consultado?**

- [ ] **GitHub Actions** documentation oficial
- [ ] **Next.js deployment** guides
- [ ] **Vercel/Netlify** deployment docs
- [ ] **Stack Overflow** o GitHub issues
- [ ] **Otros**: [especificar]

## 🎉 Contribución

**¿Te gustaría implementar la solución tú mismo?**

- [ ] ✅ **Sí, puedo arreglar el workflow**
- [ ] 🤔 **Tal vez, con algo de ayuda**
- [ ] ❌ **No, solo quiero reportarlo**

## 🔗 Issues Relacionados

**¿Hay otros issues relacionados con CI/CD?**

- **Issues relacionados**: #[número]
- **PRs relacionados**: #[número]
- **Discusiones**: [enlace]

## 📋 Checklist de CI/CD

**Antes de reportar, verifica:**

- [ ] **Workflow ejecuta** en GitHub Actions
- [ ] **Secretos están configurados** correctamente
- [ ] **Variables de entorno** están definidas
- [ ] **Permisos del repositorio** son correctos
- [ ] **Dependencias están actualizadas** localmente

## 🔧 Configuración del Workflow

**¿Qué servicios de CI/CD usas?**

- [ ] **GitHub Actions** (nativo)
- [ ] **Vercel** para despliegue automático
- [ ] **Netlify** para despliegue automático
- [ ] **Docker** para containerización
- [ ] **Otros**: [especificar]

### Configuración específica:
```yaml
# Ejemplo de configuración actual
deploy-production:
  needs: test-and-build
  runs-on: ubuntu-latest
  if: github.ref == 'refs/heads/main'
  environment: production
```

---

**¡Gracias por ayudar a mejorar el proceso de CI/CD de AutoMarket! 🔄🚀**

## 📞 Recursos de CI/CD

- **GitHub Actions**: https://docs.github.com/en/actions
- **Next.js Deployment**: https://nextjs.org/docs/deployment
- **Vercel**: https://vercel.com/docs
- **Netlify**: https://docs.netlify.com/

