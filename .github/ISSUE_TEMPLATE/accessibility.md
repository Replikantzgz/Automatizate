---
name: ♿ Accesibilidad
about: Reportar problemas de accesibilidad o sugerir mejoras
title: '[A11Y] '
labels: ['accessibility', 'good-first-issue', 'ux']
assignees: ''
---

## ♿ Tipo de Problema de Accesibilidad

**¿Qué tipo de problema de accesibilidad has encontrado?**

- [ ] 🖱️ **Navegación por teclado** (Tab, Enter, Escape)
- [ ] 🗣️ **Lectores de pantalla** (NVDA, JAWS, VoiceOver)
- [ ] 🎨 **Contraste de colores** (texto difícil de leer)
- [ ] 📱 **Responsive design** (problemas en móviles)
- [ ] 🔍 **Zoom y escalado** (contenido se corta)
- [ ] 🎵 **Audio y video** (falta subtítulos, transcripciones)
- [ ] 🖼️ **Imágenes** (falta alt text, descripciones)
- [ ] 📝 **Formularios** (labels faltantes, validación)
- [ ] 🚫 **Focus visible** (no se ve dónde está el foco)
- [ ] 🌐 **Idioma** (falta atributo lang)
- [ ] 📊 **Estructura semántica** (headings, landmarks)
- [ ] 🎯 **Otro**: [especificar]

## 📍 Ubicación del Problema

**¿Dónde está el problema?**

- **URL de la página**: [ej. /dashboard, /projects/create]
- **Componente específico**: [ej. Header, Formulario de login, Tabla de proyectos]
- **Sección de la página**: [ej. Navegación, Contenido principal, Footer]

## 🔍 Descripción del Problema

**Describe detalladamente el problema de accesibilidad:**

### ¿Qué está pasando?
[Describe el comportamiento actual]

### ¿Qué debería pasar?
[Describe el comportamiento esperado]

### ¿Cómo afecta a los usuarios?
[Explica el impacto en usuarios con discapacidades]

## 🧪 Pasos para Reproducir

**¿Cómo puedo reproducir este problema?**

1. Ve a '...'
2. Haz clic en '...'
3. Intenta navegar con '...'
4. Ve el problema

### Con teclado:
- ¿Se puede navegar con Tab?
- ¿Se puede activar con Enter/Space?
- ¿Se puede cerrar con Escape?

### Con lector de pantalla:
- ¿Qué anuncia el lector?
- ¿Hay información faltante?
- ¿Hay información duplicada?

## 📱 Información del Sistema

**Tu entorno de prueba:**

- **Sistema Operativo**: [ej. Windows 10, macOS, Ubuntu]
- **Navegador**: [ej. Chrome, Firefox, Safari, Edge]
- **Versión del Navegador**: [ej. 22]
- **Herramientas de accesibilidad**:
  - [ ] **NVDA** (Windows)
  - [ ] **JAWS** (Windows)
  - [ ] **VoiceOver** (macOS/iOS)
  - [ ] **TalkBack** (Android)
  - [ ] **Otros**: [especificar]

## 📸 Capturas de Pantalla

**Si es relevante, agrega capturas de pantalla:**

- **Problema visible**: [captura del problema]
- **Comparación**: [antes/después si aplica]
- **Herramientas de desarrollo**: [captura de errores de accesibilidad]

## 🎯 Impacto y Prioridad

**¿Qué tan crítico es este problema?**

- [ ] 🚨 **Crítico** - Bloquea completamente el uso para algunos usuarios
- [ ] ⚠️ **Alto** - Dificulta significativamente el uso
- [ ] 🔶 **Medio** - Inconveniente pero no bloqueante
- [ ] 📝 **Bajo** - Mejora menor de la experiencia

### Usuarios afectados:
- [ ] **Usuarios ciegos** o con baja visión
- [ ] **Usuarios sordos** o con problemas auditivos
- [ ] **Usuarios con movilidad limitada**
- [ ] **Usuarios con problemas cognitivos**
- [ ] **Usuarios mayores**
- [ ] **Otros**: [especificar]

## 💡 Solución Propuesta

**¿Tienes alguna idea de cómo solucionarlo?**

### Cambios técnicos sugeridos:
```html
<!-- Ejemplo de mejora -->
<button aria-label="Cerrar modal" onclick="closeModal()">
  <span class="sr-only">Cerrar</span>
  <XIcon />
</button>
```

### Recursos de referencia:
- [Enlaces a guías de accesibilidad]
- [Ejemplos de implementación]
- [Herramientas de testing]

## 🧪 Testing de Accesibilidad

**¿Qué herramientas has usado para detectar el problema?**

- [ ] **axe DevTools** (Chrome/Firefox)
- [ ] **WAVE** (Web Accessibility Evaluation Tool)
- [ ] **Lighthouse** (Chrome DevTools)
- [ ] **NVDA** o **JAWS** (lectores de pantalla)
- [ ] **VoiceOver** (macOS/iOS)
- [ ] **Navegación por teclado** manual
- [ ] **Otros**: [especificar]

## 📚 Estándares de Accesibilidad

**¿Qué estándares se están violando?**

- [ ] **WCAG 2.1 AA** (Web Content Accessibility Guidelines)
- [ ] **Section 508** (Estados Unidos)
- [ ] **EN 301 549** (Europa)
- [ ] **Otros**: [especificar]

### Criterios específicos:
- **1.1.1**: Contenido no textual
- **1.3.1**: Información y relaciones
- **2.1.1**: Teclado
- **2.4.1**: Bypass de bloques
- **Otros**: [especificar]

## 🎉 Contribución

**¿Te gustaría implementar la solución tú mismo?**

- [ ] ✅ **Sí, puedo hacer el cambio**
- [ ] 🤔 **Tal vez, con algo de ayuda**
- [ ] ❌ **No, solo quiero reportarlo**

## 🔗 Issues Relacionados

**¿Hay otros issues relacionados con accesibilidad?**

- **Issues relacionados**: #[número]
- **PRs relacionados**: #[número]
- **Discusiones**: [enlace]

---

**¡Gracias por ayudar a hacer AutoMarket más accesible para todos! ♿✨**

## 📞 Recursos de Accesibilidad

- **WCAG Guidelines**: https://www.w3.org/WAI/WCAG21/quickref/
- **WebAIM**: https://webaim.org/
- **A11Y Project**: https://www.a11yproject.com/
- **MDN Accessibility**: https://developer.mozilla.org/en-US/docs/Web/Accessibility

