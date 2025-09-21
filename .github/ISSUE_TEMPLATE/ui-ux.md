---
name: 🎨 UI/UX
about: Reportar problemas de interfaz o sugerir mejoras de experiencia de usuario
title: '[UI/UX] '
labels: ['ui-ux', 'design', 'frontend', 'good-first-issue']
assignees: ''
---

## 🎨 Tipo de Problema de UI/UX

**¿Qué tipo de problema de UI/UX has encontrado?**

- [ ] 🎨 **Diseño visual** (colores, tipografía, espaciado)
- [ ] 📱 **Layout** (elementos mal posicionados, desbordamiento)
- [ ] 🖱️ **Interacciones** (hover, focus, click states)
- [ ] 📝 **Formularios** (validación, errores, feedback)
- [ ] 🧭 **Navegación** (menús, breadcrumbs, rutas)
- [ ] 📊 **Componentes** (botones, inputs, modales)
- [ ] 🌈 **Accesibilidad** (contraste, ARIA, navegación por teclado)
- [ ] 📱 **Responsive** (breakpoints, mobile-first)
- [ ] 🎭 **Animaciones** (transiciones, micro-interacciones)
- [ ] 📖 **Contenido** (texto, iconos, imágenes)
- [ ] 🎯 **Otro**: [especificar]

## 📍 Ubicación del Problema

**¿Dónde está el problema de UI/UX?**

- **URL de la página**: [ej. /dashboard, /projects/create, /conversations]
- **Componente específico**: [ej. Header, Navigation, Form, Modal]
- **Sección de la página**: [ej. Navegación, Contenido principal, Footer]
- **Estado del componente**: [ej. Loading, Error, Success, Empty]

## 🔍 Descripción del Problema

**Describe detalladamente el problema de UI/UX:**

### ¿Qué está pasando?
[Describe el comportamiento visual actual]

### ¿Qué debería pasar?
[Describe el comportamiento visual esperado]

### ¿Cuándo ocurre?
[¿Siempre, solo en ciertos estados, solo en ciertos dispositivos?]

## 📱 Información del Sistema

**Tu entorno de desarrollo:**

- **Sistema Operativo**: [ej. Windows 11, macOS 14, Ubuntu 22.04]
- **Navegador**: [ej. Chrome 120, Firefox 121, Safari 17]
- **Versión del navegador**: [ej. 120.0.6099.109]
- **Resolución de pantalla**: [ej. 1920x1080, 2560x1440]

### Herramientas de desarrollo:
- **Chrome DevTools**: [versión]
- **React DevTools**: [versión]
- **Otras**: [especificar]

## 📊 Detalles del Problema

**Información específica del problema:**

### Componente problemático:
```tsx
// Ejemplo del componente con problemas
function ProjectCard({ project }) {
  return (
    <div className="bg-white rounded-lg shadow p-4">
      <h3 className="text-lg font-semibold">{project.title}</h3>
      <p className="text-gray-600 mt-2">{project.description}</p>
      {/* Elementos que no se ven bien */}
    </div>
  )
}
```

### Problema específico:
[Describe exactamente qué está mal visualmente]

### Capturas de pantalla:
[Adjunta capturas del problema]

## 🧪 Pasos para Reproducir

**¿Cómo puedo reproducir el problema?**

1. Ve a la página '...'
2. Realiza la acción '...'
3. Observa el problema visual

### Estados específicos:
- **Estado del componente**: [ej. Loading, Error, Success]
- **Datos del componente**: [ej. Con muchos datos, sin datos]
- **Tamaño de pantalla**: [ej. Móvil, tablet, desktop]

## 📸 Capturas de Pantalla

**Capturas del problema:**

- **Problema visible**: [captura del problema]
- **Comparación**: [captura de cómo debería verse]
- **Diferentes estados**: [capturas en diferentes condiciones]

## 🎯 Impacto y Prioridad

**¿Qué tan crítico es este problema?**

- [ ] 🚨 **Crítico** - Bloquea completamente el uso
- [ ] ⚠️ **Alto** - Dificulta significativamente el uso
- [ ] 🔶 **Medio** - Inconveniente pero funcional
- [ ] 📝 **Bajo** - Mejora menor de la experiencia

### Usuarios afectados:
- [ ] **Todos los usuarios** de la plataforma
- [ ] **Usuarios móviles** específicamente
- [ ] **Usuarios con problemas de visión**
- [ ] **Usuarios con dispositivos específicos**
- [ ] **Otros**: [especificar]

## 💡 Solución Propuesta

**¿Tienes alguna idea de cómo solucionarlo?**

### Cambios sugeridos:
```tsx
// ❌ ANTES: Componente problemático
<div className="bg-white rounded-lg shadow p-4">
  <h3 className="text-lg font-semibold">{project.title}</h3>
  <p className="text-gray-600 mt-2">{project.description}</p>
</div>

// ✅ DESPUÉS: Componente mejorado
<div className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow">
  <h3 className="text-xl font-bold text-gray-900 mb-3">{project.title}</h3>
  <p className="text-gray-700 leading-relaxed">{project.description}</p>
</div>
```

### Estrategias de mejora:
- [ ] **Consistencia visual** en colores y espaciado
- [ ] **Jerarquía visual** clara con tipografía
- [ ] **Estados interactivos** (hover, focus, active)
- [ ] **Feedback visual** para acciones del usuario
- [ ] **Espaciado consistente** usando sistema de diseño
- [ ] **Otros**: [especificar]

## 🔍 Análisis del Problema

**¿Qué crees que está causando el problema?**

### Posibles causas:
- [ ] **CSS inconsistente** o mal estructurado
- [ ] **Clases de Tailwind** incorrectas o faltantes
- [ ] **Estados del componente** no manejados
- [ ] **Responsive design** mal implementado
- [ ] **Accesibilidad** descuidada
- [ ] **Sistema de diseño** no seguido
- [ ] **Otros**: [especificar]

## 🧪 Testing de UI/UX

**¿Qué herramientas has usado para testing?**

- [ ] **Chrome DevTools** para inspeccionar elementos
- [ ] **React DevTools** para estado del componente
- [ ] **Lighthouse** para accesibilidad y performance
- [ ] **Diferentes navegadores** para consistencia
- [ ] **Diferentes dispositivos** para responsive
- [ ] **Otros**: [especificar]

## 📚 Recursos de Referencia

**¿Qué recursos has consultado?**

- [ ] **TailwindCSS documentation** oficial
- [ ] **Material Design** guidelines
- [ ] **Accessibility** guidelines (WCAG)
- [ ] **UI/UX best practices**
- [ ] **Otros**: [especificar]

## 🎉 Contribución

**¿Te gustaría implementar la solución tú mismo?**

- [ ] ✅ **Sí, puedo arreglar el problema de UI/UX**
- [ ] 🤔 **Tal vez, con algo de ayuda**
- [ ] ❌ **No, solo quiero reportarlo**

## 🔗 Issues Relacionados

**¿Hay otros issues relacionados con UI/UX?**

- **Issues relacionados**: #[número]
- **PRs relacionados**: #[número]
- **Discusiones**: [enlace]

## 📋 Checklist de UI/UX

**Antes de reportar, verifica:**

- [ ] **Problema reproduce** en múltiples navegadores
- [ ] **Problema reproduce** en diferentes tamaños de pantalla
- [ ] **Problema no es** solo en tu configuración específica
- [ ] **Problema no es** solo en tu navegador específico
- [ ] **Problema no es** solo en tu resolución específica

## 🔧 Configuración de Diseño

**¿Qué sistema de diseño usas?**

- [ ] **TailwindCSS** con configuración personalizada
- [ ] **Componentes reutilizables** con Storybook
- [ ] **Sistema de tokens** para colores y espaciado
- [ ] **Guía de estilo** documentada
- [ ] **Otros**: [especificar]

### Configuración específica:
```javascript
// Ejemplo de configuración de TailwindCSS
module.exports = {
  theme: {
    extend: {
      colors: {
        primary: '#3B82F6',
        secondary: '#6B7280',
      },
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
      }
    }
  }
}
```

## 🎨 Componentes de Diseño

**¿Qué componentes están involucrados?**

```tsx
// Ejemplo de componentes relacionados
- Button
- Input
- Card
- Modal
- Navigation
- Form
```

## 🌈 Accesibilidad

**¿Qué aspectos de accesibilidad están afectados?**

- [ ] **Contraste de colores** insuficiente
- [ ] **Navegación por teclado** problemática
- [ ] **Screen readers** no funcionan bien
- [ ] **Focus visible** no se ve
- [ ] **ARIA labels** faltantes o incorrectos
- [ ] **Otros**: [especificar]

---

**¡Gracias por ayudar a mejorar la experiencia visual de AutoMarket! 🎨✨**

## 📞 Recursos de UI/UX

- **TailwindCSS**: https://tailwindcss.com/docs
- **Material Design**: https://material.io/design
- **WCAG Guidelines**: https://www.w3.org/WAI/WCAG21/quickref/
- **UI/UX Best Practices**: https://www.nngroup.com/articles/

