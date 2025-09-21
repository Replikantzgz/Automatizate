# 📚 Instrucciones para Subir AutoMarket a GitHub

## 🎯 Objetivo
Subir tu proyecto AutoMarket a un repositorio de GitHub llamado "Automatizate" y renombrar la carpeta local de "AutoMarket" a "Automatizate".

## 📋 Prerrequisitos
- ✅ Git instalado (ya completado)
- ✅ Cuenta de GitHub
- ✅ Token de acceso personal de GitHub (opcional, para autenticación)

## 🚀 Pasos para Subir a GitHub

### 1. Reiniciar PowerShell
Después de instalar Git, **cierra y vuelve a abrir PowerShell** para que reconozca el comando `git`.

### 2. Crear Repositorio en GitHub
1. Ve a [GitHub New Repository](https://github.com/new)
2. **Repository name**: `Automatizate`
3. **Description**: `Plataforma de automatización empresarial que conecta clientes con expertos`
4. **Visibility**: Público o Privado (según prefieras)
5. **NO** marques "Add a README file" (ya tienes uno)
6. Haz clic en "Create repository"

### 3. Configurar Git Localmente
```powershell
# Configurar tu identidad
git config --global user.name "Tu Nombre Real"
git config --global user.email "tu.email@ejemplo.com"

# Verificar configuración
git config --list
```

### 4. Inicializar Repositorio Git
```powershell
# Navegar a tu proyecto (si no estás ahí)
cd "C:\Users\Pc\AutoMarket"

# Inicializar Git
git init

# Verificar estado
git status
```

### 5. Agregar Archivos al Repositorio
```powershell
# Agregar todos los archivos
git add .

# Verificar archivos agregados
git status
```

### 6. Crear Primer Commit
```powershell
git commit -m "🎉 Commit inicial: AutoMarket - Plataforma de automatización empresarial

✨ Funcionalidades implementadas:
- Sistema de autenticación completo
- Dashboards por rol (Cliente/Experto)
- Gestión de proyectos y propuestas
- Sistema de pagos con Stripe
- Chat interno en tiempo real
- Generación automática de facturas PDF
- Cumplimiento GDPR completo
- Panel de administración
- Sistema de notificaciones
- Interfaz moderna con TailwindCSS

🚀 Tecnologías: Next.js 14, Supabase, Stripe, TypeScript"
```

### 7. Conectar con GitHub
```powershell
# Agregar remote origin (reemplaza USERNAME con tu nombre de usuario)
git remote add origin https://github.com/USERNAME/Automatizate.git

# Verificar remote
git remote -v
```

### 8. Subir Código a GitHub
```powershell
# Cambiar a rama main
git branch -M main

# Subir código
git push -u origin main
```

## 🔄 Renombrar Carpeta Local

### Opción 1: Usando PowerShell (Recomendado)
```powershell
# Navegar al directorio padre
cd "C:\Users\Pc"

# Renombrar carpeta
Rename-Item "AutoMarket" "Automatizate"

# Verificar cambio
ls
```

### Opción 2: Usando Explorador de Windows
1. Abre el Explorador de Windows
2. Ve a `C:\Users\Pc\`
3. Haz clic derecho en la carpeta "AutoMarket"
4. Selecciona "Cambiar nombre"
5. Escribe "Automatizate"
6. Presiona Enter

## ✅ Verificación Final

### 1. Verificar en GitHub
- Ve a tu repositorio: `https://github.com/USERNAME/Automatizate`
- Confirma que todos los archivos estén subidos
- Verifica que el README.md se muestre correctamente

### 2. Verificar Localmente
```powershell
# Navegar a la nueva carpeta
cd "C:\Users\Pc\Automatizate"

# Verificar que Git siga funcionando
git status

# Verificar que todos los archivos estén ahí
ls
```

## 🚨 Solución de Problemas

### Error: "git no se reconoce"
- **Solución**: Reinicia PowerShell después de instalar Git
- **Alternativa**: Usa la ruta completa: `"C:\Program Files\Git\bin\git.exe"`

### Error: "Authentication failed"
- **Solución**: Usa tu nombre de usuario y contraseña de GitHub
- **Alternativa**: Configura un token de acceso personal

### Error: "Remote origin already exists"
- **Solución**: Elimina el remote y agrégalo de nuevo:
```powershell
git remote remove origin
git remote add origin https://github.com/USERNAME/Automatizate.git
```

## 📚 Recursos Adicionales

- [GitHub Docs](https://docs.github.com/)
- [Git Handbook](https://guides.github.com/introduction/git-handbook/)
- [GitHub CLI](https://cli.github.com/) (alternativa a comandos Git)

## 🎉 ¡Listo!

Una vez completados estos pasos, tendrás:
- ✅ Tu proyecto subido a GitHub en el repositorio "Automatizate"
- ✅ Tu carpeta local renombrada de "AutoMarket" a "Automatizate"
- ✅ Un historial de Git completo con tu primer commit
- ✅ Un repositorio listo para colaboración y desarrollo

## 💡 Próximos Pasos Recomendados

1. **Configurar GitHub Pages** para mostrar tu proyecto
2. **Crear Issues** para planificar nuevas funcionalidades
3. **Configurar GitHub Actions** para CI/CD
4. **Invitar colaboradores** si planeas trabajar en equipo
5. **Crear Releases** para versiones estables

---

**¡Felicidades! Tu proyecto AutoMarket ahora está en GitHub como "Automatizate" 🚀**
