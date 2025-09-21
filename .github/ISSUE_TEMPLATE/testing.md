---
name: 🧪 Testing
about: Reportar problemas con tests o sugerir mejoras en testing
title: '[TEST] '
labels: ['testing', 'good-first-issue', 'quality']
assignees: ''
---

## 🧪 Tipo de Problema de Testing

**¿Qué tipo de problema de testing has encontrado?**

- [ ] ❌ **Tests fallando** (falsos positivos/negativos)
- [ ] 🐌 **Tests lentos** (toman demasiado tiempo)
- [ ] 🔄 **Tests flaky** (fallan intermitentemente)
- [ ] 📊 **Cobertura baja** de tests
- [ ] 🧩 **Tests faltantes** para funcionalidades
- [ ] 🔧 **Configuración** de testing incorrecta
- [ ] 📱 **Tests de integración** problemáticos
- [ ] 🌐 **Tests E2E** fallando
- [ ] 🗄️ **Tests de base de datos** problemáticos
- [ ] 🎨 **Tests de UI** inconsistentes
- [ ] 🎯 **Otro**: [especificar]

## 📍 Ubicación del Problema

**¿Dónde está el problema de testing?**

- **Archivo de test**: [ej. `__tests__/dashboard.test.tsx`]
- **Suite de tests**: [ej. Dashboard tests, Authentication tests]
- **Test específico**: [ej. "should render user stats correctly"]
- **Tipo de test**: [ej. Unit, Integration, E2E, Snapshot]

## 🔍 Descripción del Problema

**Describe detalladamente el problema de testing:**

### ¿Qué está pasando?
[Describe el comportamiento actual del test]

### ¿Qué debería pasar?
[Describe el comportamiento esperado]

### ¿Cuándo ocurre?
[¿Siempre, solo en CI/CD, solo localmente, intermitentemente?]

## 📱 Información del Sistema

**Tu entorno de testing:**

- **Sistema Operativo**: [ej. Windows 11, macOS 14, Ubuntu 22.04]
- **Node.js**: [ej. 18.17.0, 20.9.0]
- **Package Manager**: [ej. npm 9.6.7, yarn 1.22.19, pnpm 8.6.0]
- **Entorno**: [ej. Local development, CI/CD, Staging]

### Dependencias de testing:
- **Jest**: [versión]
- **React Testing Library**: [versión]
- **Cypress**: [versión]
- **Playwright**: [versión]
- **Otros**: [especificar]

## 📊 Detalles del Test

**Información específica del test:**

### Test que falla:
```typescript
// Ejemplo del test problemático
test('should display user profile', async () => {
  render(<UserProfile user={mockUser} />)
  expect(screen.getByText(mockUser.name)).toBeInTheDocument()
})
```

### Error o output:
```
Error: expect(element).toBeInTheDocument()
Expected element to be in document but it wasn't found
```

### Stack trace:
```
at Object.<anonymous> (/path/to/test.tsx:15:25)
at processTicksAndRejections (node:internal/process/task_queues:95:5)
```

## 🧪 Pasos para Reproducir

**¿Cómo puedo reproducir el problema?**

1. Ejecuta `npm test` o `npm run test:watch`
2. Ve al test específico '...'
3. Observa el fallo

### Comandos específicos:
```bash
# Comando que falla
npm test -- --testNamePattern="should display user profile"

# Comando que funciona (si hay alguno)
npm test -- --testNamePattern="should render correctly"
```

## 📸 Capturas de Pantalla

**Si es relevante, agrega capturas de pantalla:**

- **Error del test**: [captura del output del test]
- **UI del componente**: [captura del componente siendo testeado]
- **Herramientas de desarrollo**: [captura de React DevTools, etc.]

## 🎯 Impacto y Prioridad

**¿Qué tan crítico es este problema?**

- [ ] 🚨 **Crítico** - Bloquea el desarrollo o CI/CD
- [ ] ⚠️ **Alto** - Dificulta el desarrollo significativamente
- [ ] 🔶 **Medio** - Inconveniente pero manejable
- [ ] 📝 **Bajo** - Mejora menor de la calidad

### Áreas afectadas:
- [ ] **Desarrollo local** de funcionalidades
- [ ] **CI/CD pipeline** y despliegues
- [ ] **Calidad del código** y refactoring
- [ ] **Regresión** de funcionalidades existentes
- [ ] **Otros**: [especificar]

## 💡 Solución Propuesta

**¿Tienes alguna idea de cómo solucionarlo?**

### Cambios sugeridos:
```typescript
// ❌ ANTES: Test problemático
test('should display user profile', async () => {
  render(<UserProfile user={mockUser} />)
  expect(screen.getByText(mockUser.name)).toBeInTheDocument()
})

// ✅ DESPUÉS: Test mejorado
test('should display user profile', async () => {
  render(<UserProfile user={mockUser} />)
  await waitFor(() => {
    expect(screen.getByText(mockUser.name)).toBeInTheDocument()
  })
})
```

### Estrategias de testing:
- [ ] **Mocking** de dependencias externas
- [ ] **Setup/teardown** apropiado
- [ ] **Async testing** con waitFor
- [ ] **Custom renderers** para providers
- [ ] **Test data factories** para mocks consistentes
- [ ] **Otros**: [especificar]

## 🔍 Análisis del Problema

**¿Qué crees que está causando el problema?**

### Posibles causas:
- [ ] **Timing issues** en tests asíncronos
- [ ] **Mocks incorrectos** o incompletos
- [ ] **Estado compartido** entre tests
- [ ] **Dependencias externas** no mockeadas
- [ ] **Configuración** de testing incorrecta
- [ ] **Race conditions** en tests
- [ ] **Otros**: [especificar]

## 🧪 Testing del Testing

**¿Qué has intentado para debuggear?**

- [ ] **Ejecutar test individual** con `--testNamePattern`
- [ ] **Debug con console.log** o debugger
- [ ] **Verificar mocks** y test data
- [ ] **Comparar con tests similares** que funcionan
- [ ] **Ejecutar en modo verbose** con `--verbose`
- [ ] **Usar React Testing Library debug()**
- [ ] **Otros**: [especificar]

## 📚 Recursos de Referencia

**¿Qué recursos has consultado?**

- [ ] **Jest documentation** oficial
- [ ] **React Testing Library** guides
- [ ] **Testing best practices** de Next.js
- [ ] **Stack Overflow** o GitHub issues
- [ ] **Otros**: [especificar]

## 🎉 Contribución

**¿Te gustaría implementar la solución tú mismo?**

- [ ] ✅ **Sí, puedo arreglar el test**
- [ ] 🤔 **Tal vez, con algo de ayuda**
- [ ] ❌ **No, solo quiero reportarlo**

## 🔗 Issues Relacionados

**¿Hay otros issues relacionados con testing?**

- **Issues relacionados**: #[número]
- **PRs relacionados**: #[número]
- **Discusiones**: [enlace]

## 📋 Checklist de Testing

**Antes de reportar, verifica:**

- [ ] **Test ejecuta localmente** con `npm test`
- [ ] **Dependencias están actualizadas** (`npm install`)
- [ ] **Node.js es compatible** con el proyecto
- [ ] **Variables de entorno** están configuradas
- [ ] **Base de datos de test** está disponible (si aplica)

---

**¡Gracias por ayudar a mejorar la calidad de AutoMarket! 🧪✨**

## 📞 Recursos de Testing

- **Jest**: https://jestjs.io/docs/getting-started
- **React Testing Library**: https://testing-library.com/docs/react-testing-library/intro/
- **Next.js Testing**: https://nextjs.org/docs/testing
- **Testing Best Practices**: https://kentcdodds.com/blog/common-mistakes-with-react-testing-library

