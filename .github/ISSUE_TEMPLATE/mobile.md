---
name: 📱 Móvil
about: Reportar problemas en dispositivos móviles o sugerir mejoras
title: '[MOBILE] '
labels: ['mobile', 'responsive', 'ux', 'good-first-issue']
assignees: ''
---

## 📱 Tipo de Problema Móvil

**¿Qué tipo de problema móvil has encontrado?**

- [ ] 📱 **Responsive design** (layout se rompe en móvil)
- [ ] 🖱️ **Touch interactions** (botones no responden bien)
- [ ] 📏 **Tamaños de pantalla** (contenido se corta)
- [ ] 🔄 **Orientación** (portrait/landscape)
- [ ] 📱 **Dispositivos específicos** (iPhone, Android, tablet)
- [ ] 🎨 **UI/UX móvil** (elementos muy pequeños, espaciado)
- [ ] 📱 **Performance móvil** (lento en dispositivos antiguos)
- [ ] 🌐 **Navegación móvil** (menús, breadcrumbs)
- [ ] 📝 **Formularios móviles** (inputs, validación)
- [ ] 🖼️ **Imágenes móviles** (optimización, lazy loading)
- [ ] 🎯 **Otro**: [especificar]

## 📍 Ubicación del Problema

**¿Dónde está el problema móvil?**

- **URL de la página**: [ej. /dashboard, /projects/create, /conversations]
- **Componente específico**: [ej. Header, Navigation, Formulario, Tabla]
- **Sección de la página**: [ej. Navegación, Contenido principal, Footer]

## 🔍 Descripción del Problema

**Describe detalladamente el problema móvil:**

### ¿Qué está pasando?
[Describe el comportamiento actual en móvil]

### ¿Qué debería pasar?
[Describe el comportamiento esperado]

### ¿En qué dispositivos ocurre?
[¿Todos los móviles, solo ciertos tamaños, solo ciertos navegadores?]

## 📱 Información del Dispositivo

**Tu dispositivo de prueba:**

- **Tipo de dispositivo**: [ej. Smartphone, Tablet, Phablet]
- **Marca y modelo**: [ej. iPhone 15 Pro, Samsung Galaxy S24, iPad Air]
- **Sistema Operativo**: [ej. iOS 17.2, Android 14, iPadOS 17.2]
- **Navegador**: [ej. Safari, Chrome, Firefox, Samsung Internet]
- **Versión del navegador**: [ej. 17.2, 120.0.6099.109]

### Especificaciones técnicas:
- **Resolución de pantalla**: [ej. 1179 x 2556, 1920 x 1080]
- **Densidad de píxeles**: [ej. 460 ppi, 264 ppi]
- **Tamaño de pantalla**: [ej. 6.1", 10.9"]
- **Capacidades táctiles**: [ej. Multi-touch, Stylus support]

## 📊 Detalles del Problema

**Información específica del problema:**

### Comportamiento actual:
```html
<!-- Ejemplo del problema -->
<div class="header">
  <nav class="navigation">
    <!-- Menú que se corta en móvil -->
    <ul class="nav-items">
      <li>Dashboard</li>
      <li>Projects</li>
      <li>Messages</li>
      <!-- Más items que no caben -->
    </ul>
  </nav>
</div>
```

### Error o comportamiento inesperado:
[Describe exactamente qué está mal]

### Capturas de pantalla:
[Adjunta capturas del problema en móvil]

## 🧪 Pasos para Reproducir

**¿Cómo puedo reproducir el problema?**

1. Abre la página en un dispositivo móvil o simula móvil en DevTools
2. Navega a '...'
3. Realiza la acción '...'
4. Observa el problema

### Simulación en DevTools:
```bash
# Chrome DevTools
1. F12 → Toggle device toolbar
2. Selecciona dispositivo (ej. iPhone 12 Pro)
3. Refresca la página
4. Navega y observa el comportamiento
```

## 📸 Capturas de Pantalla

**Capturas del problema:**

- **Problema en móvil**: [captura del problema]
- **Comparación desktop**: [captura de cómo se ve en desktop]
- **Diferentes tamaños**: [capturas en diferentes breakpoints]

## 🎯 Impacto y Prioridad

**¿Qué tan crítico es este problema?**

- [ ] 🚨 **Crítico** - Bloquea completamente el uso en móvil
- [ ] ⚠️ **Alto** - Dificulta significativamente el uso
- [ ] 🔶 **Medio** - Inconveniente pero funcional
- [ ] 📝 **Bajo** - Mejora menor de la experiencia

### Usuarios afectados:
- [ ] **Usuarios móviles** exclusivamente
- [ ] **Usuarios con tablets** y dispositivos híbridos
- [ ] **Usuarios con pantallas pequeñas** en desktop
- [ ] **Usuarios con problemas de visión** que usan zoom
- [ ] **Otros**: [especificar]

## 💡 Solución Propuesta

**¿Tienes alguna idea de cómo solucionarlo?**

### Cambios sugeridos:
```css
/* ❌ ANTES: CSS problemático */
.nav-items {
  display: flex;
  gap: 20px;
}

/* ✅ DESPUÉS: CSS responsive */
.nav-items {
  display: flex;
  gap: 20px;
}

@media (max-width: 768px) {
  .nav-items {
    flex-direction: column;
    gap: 10px;
  }
}
```

### Estrategias de responsive design:
- [ ] **Mobile-first approach** en CSS
- [ ] **Breakpoints consistentes** (sm, md, lg, xl)
- [ ] **Flexbox/Grid** para layouts adaptativos
- [ ] **Touch-friendly targets** (mínimo 44x44px)
- [ ] **Progressive enhancement** para funcionalidades
- [ ] **Otros**: [especificar]

## 🔍 Análisis del Problema

**¿Qué crees que está causando el problema?**

### Posibles causas:
- [ ] **CSS no responsive** o breakpoints incorrectos
- [ ] **Layouts fijos** en lugar de fluidos
- [ ] **Tamaños de fuente** no escalables
- [ ] **Elementos táctiles** muy pequeños
- [ ] **JavaScript** que no considera viewport móvil
- [ ] **Imágenes** no optimizadas para móvil
- [ ] **Otros**: [especificar]

## 🧪 Testing Móvil

**¿Qué herramientas has usado para testing?**

- [ ] **Chrome DevTools** device simulation
- [ ] **Firefox Responsive Design Mode**
- [ ] **Safari Web Inspector** (iOS)
- [ ] **Dispositivos físicos** reales
- [ ] **BrowserStack** o similar
- [ ] **Lighthouse mobile** audit
- [ ] **Otros**: [especificar]

## 📚 Recursos de Referencia

**¿Qué recursos has consultado?**

- [ ] **Mobile Web Best Practices** de Google
- [ ] **Responsive Design** guidelines
- [ ] **Touch Gesture** documentation
- [ ] **Mobile Performance** optimization
- [ ] **Otros**: [especificar]

## 🎉 Contribución

**¿Te gustaría implementar la solución tú mismo?**

- [ ] ✅ **Sí, puedo arreglar el responsive design**
- [ ] 🤔 **Tal vez, con algo de ayuda**
- [ ] ❌ **No, solo quiero reportarlo**

## 🔗 Issues Relacionados

**¿Hay otros issues relacionados con móvil?**

- **Issues relacionados**: #[número]
- **PRs relacionados**: #[número]
- **Discusiones**: [enlace]

## 📋 Checklist de Móvil

**Antes de reportar, verifica:**

- [ ] **Problema reproduce** en múltiples dispositivos
- [ ] **Problema reproduce** en diferentes navegadores móviles
- [ ] **Problema reproduce** en modo portrait y landscape
- [ ] **Problema no es** solo en tu dispositivo específico
- [ ] **Problema no es** solo en tu navegador específico

## 🔧 Configuración de Testing

**¿Qué herramientas de testing móvil usas?**

- [ ] **Chrome DevTools** device simulation
- [ ] **Dispositivos físicos** reales
- [ ] **BrowserStack** o similar
- [ ] **Lighthouse mobile** audit
- [ ] **Otros**: [especificar]

### Configuración específica:
```javascript
// Ejemplo de configuración de viewport
<meta name="viewport" content="width=device-width, initial-scale=1.0">
```

---

**¡Gracias por ayudar a hacer AutoMarket más accesible en móvil! 📱✨**

## 📞 Recursos de Móvil

- **Mobile Web Best Practices**: https://developers.google.com/web/fundamentals/design-and-ux/principles
- **Responsive Design**: https://developer.mozilla.org/en-US/docs/Learn/CSS/CSS_layout/Responsive_Design
- **Touch Gestures**: https://developer.mozilla.org/en-US/docs/Web/API/Touch_events
- **Mobile Performance**: https://web.dev/mobile/



