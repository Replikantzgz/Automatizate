---
name: ⚡ Rendimiento
about: Reportar problemas de rendimiento o sugerir optimizaciones
title: '[PERF] '
labels: ['performance', 'optimization', 'good-first-issue']
assignees: ''
---

## ⚡ Tipo de Problema de Rendimiento

**¿Qué tipo de problema de rendimiento has experimentado?**

- [ ] 🐌 **Carga lenta** de páginas o componentes
- [ ] 📱 **Rendimiento en móvil** (dispositivos lentos)
- [ ] 🔄 **Interacciones lentas** (clicks, scroll, etc.)
- [ ] 📊 **Bundle size** grande (archivos JavaScript/CSS)
- [ ] 🖼️ **Imágenes pesadas** o no optimizadas
- [ ] 🗄️ **Consultas de base de datos** lentas
- [ ] 🌐 **API calls** lentas o bloqueantes
- [ ] 💾 **Memory leaks** o uso excesivo de memoria
- [ ] 🎨 **Animaciones** o transiciones lentas
- [ ] 📝 **Renderizado** lento de listas grandes
- [ ] 🎯 **Otro**: [especificar]

## 📍 Ubicación del Problema

**¿Dónde está el problema de rendimiento?**

- **URL de la página**: [ej. /dashboard, /projects, /conversations]
- **Componente específico**: [ej. Lista de proyectos, Chat, Tabla de datos]
- **Acción específica**: [ej. Al cargar la página, Al hacer scroll, Al enviar mensaje]

## 🔍 Descripción del Problema

**Describe detalladamente el problema de rendimiento:**

### ¿Qué está pasando?
[Describe el comportamiento lento o problemático]

### ¿Cuánto tiempo toma?
[Especifica el tiempo de respuesta actual]

### ¿Cuándo ocurre?
[¿Siempre, solo en ciertas condiciones, solo en ciertos dispositivos?]

## 📱 Información del Sistema

**Tu entorno de prueba:**

- **Dispositivo**: [ej. Desktop, Laptop, Mobile, Tablet]
- **Sistema Operativo**: [ej. Windows 11, macOS 14, Ubuntu 22.04]
- **Navegador**: [ej. Chrome 120, Firefox 121, Safari 17]
- **Hardware**:
  - **CPU**: [ej. Intel i7, AMD Ryzen 5, Apple M1]
  - **RAM**: [ej. 8GB, 16GB, 32GB]
  - **Storage**: [ej. SSD, HDD, NVMe]
  - **Red**: [ej. WiFi 6, Ethernet 1Gbps, 4G/5G]

## 📊 Métricas de Rendimiento

**¿Qué métricas has observado?**

### Core Web Vitals:
- **LCP** (Largest Contentful Paint): [tiempo en segundos]
- **FID** (First Input Delay): [tiempo en milisegundos]
- **CLS** (Cumulative Layout Shift): [puntuación]

### Otras métricas:
- **TTFB** (Time to First Byte): [tiempo]
- **FCP** (First Contentful Paint): [tiempo]
- **TTI** (Time to Interactive): [tiempo]
- **Bundle size**: [tamaño en KB/MB]

### Herramientas usadas:
- [ ] **Lighthouse** (Chrome DevTools)
- [ ] **PageSpeed Insights**
- [ ] **WebPageTest**
- [ ] **Chrome DevTools Performance tab**
- [ ] **React DevTools Profiler**
- [ ] **Otros**: [especificar]

## 🧪 Pasos para Reproducir

**¿Cómo puedo reproducir el problema de rendimiento?**

1. Ve a '...'
2. Haz clic en '...'
3. Espera '...'
4. Observa el problema

### Condiciones específicas:
- **Datos**: [¿Con muchos proyectos, mensajes, usuarios?]
- **Red**: [¿Con conexión lenta, offline, etc.?]
- **Dispositivo**: [¿En móvil, desktop, etc.?]

## 📸 Capturas de Pantalla

**Si es relevante, agrega capturas de pantalla:**

- **Problema visible**: [captura del problema]
- **Herramientas de desarrollo**: [captura de métricas de rendimiento]
- **Timeline de rendimiento**: [captura de Chrome DevTools Performance]

## 🎯 Impacto y Prioridad

**¿Qué tan crítico es este problema?**

- [ ] 🚨 **Crítico** - Bloquea completamente el uso
- [ ] ⚠️ **Alto** - Dificulta significativamente el uso
- [ ] 🔶 **Medio** - Inconveniente pero funcional
- [ ] 📝 **Bajo** - Mejora menor de la experiencia

### Usuarios afectados:
- [ ] **Todos los usuarios** en todas las condiciones
- [ ] **Usuarios con conexión lenta**
- [ ] **Usuarios en dispositivos antiguos**
- [ ] **Usuarios con muchos datos**
- [ ] **Otros**: [especificar]

## 💡 Solución Propuesta

**¿Tienes alguna idea de cómo optimizarlo?**

### Optimizaciones sugeridas:
```typescript
// Ejemplo de optimización
// ❌ ANTES: Renderizar todos los items
const items = projects.map(project => <ProjectCard key={project.id} project={project} />)

// ✅ DESPUÉS: Virtualización para listas grandes
const VirtualizedList = () => {
  const [visibleItems, setVisibleItems] = useState([])
  // Implementar virtualización
}
```

### Técnicas de optimización:
- [ ] **Lazy loading** de componentes
- [ ] **Code splitting** y dynamic imports
- [ ] **Memoización** con React.memo, useMemo, useCallback
- [ ] **Virtualización** para listas grandes
- [ ] **Debouncing/throttling** para eventos
- [ ] **Optimización de imágenes** (WebP, lazy loading)
- [ ] **Bundle analysis** y tree shaking
- [ ] **Otros**: [especificar]

## 🔍 Análisis del Problema

**¿Qué crees que está causando el problema?**

### Posibles causas:
- [ ] **Demasiadas re-renderizaciones** de componentes
- [ ] **Consultas N+1** en la base de datos
- [ ] **Bundle size** excesivo
- [ ] **Imágenes no optimizadas**
- [ ] **Lógica bloqueante** en el hilo principal
- [ ] **Memory leaks** o garbage collection
- [ ] **Network requests** innecesarios
- [ ] **Otros**: [especificar]

## 🧪 Testing de Rendimiento

**¿Qué tests has ejecutado?**

- [ ] **Lighthouse audit** completo
- [ ] **Performance profiling** en Chrome DevTools
- [ ] **Bundle analysis** con webpack-bundle-analyzer
- [ ] **Memory profiling** para detectar leaks
- [ ] **Network throttling** para simular conexiones lentas
- [ ] **Device throttling** para simular dispositivos lentos
- [ ] **Otros**: [especificar]

## 📚 Recursos de Referencia

**¿Qué recursos has consultado?**

- [ ] **Next.js Performance** documentation
- [ ] **React Performance** best practices
- [ ] **Web Performance** guidelines
- [ ] **Case studies** de optimización
- [ ] **Otros**: [especificar]

## 🎉 Contribución

**¿Te gustaría implementar la optimización tú mismo?**

- [ ] ✅ **Sí, puedo hacer la optimización**
- [ ] 🤔 **Tal vez, con algo de ayuda**
- [ ] ❌ **No, solo quiero reportarlo**

## 🔗 Issues Relacionados

**¿Hay otros issues relacionados con rendimiento?**

- **Issues relacionados**: #[número]
- **PRs relacionados**: #[número]
- **Discusiones**: [enlace]

---

**¡Gracias por ayudar a hacer AutoMarket más rápido y eficiente! ⚡🚀**

## 📞 Recursos de Rendimiento

- **Next.js Performance**: https://nextjs.org/docs/advanced-features/measuring-performance
- **React Performance**: https://react.dev/learn/render-and-commit
- **Web Performance**: https://web.dev/performance/
- **Lighthouse**: https://developers.google.com/web/tools/lighthouse



