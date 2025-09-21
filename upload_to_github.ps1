# Script para subir AutoMarket a GitHub y renombrar la carpeta local
# Ejecutar como administrador en PowerShell

Write-Host "🚀 Iniciando proceso de subida a GitHub..." -ForegroundColor Green

# Verificar si Git está disponible
try {
    git --version | Out-Null
    Write-Host "✅ Git está disponible" -ForegroundColor Green
} catch {
    Write-Host "❌ Git no está disponible. Por favor, reinicia PowerShell después de instalar Git." -ForegroundColor Red
    Write-Host "💡 Alternativa: Abre una nueva ventana de PowerShell como administrador" -ForegroundColor Yellow
    exit 1
}

# Configurar Git (reemplaza con tus datos)
Write-Host "📝 Configurando Git..." -ForegroundColor Blue
git config --global user.name "Tu Nombre"
git config --global user.email "tu.email@ejemplo.com"

# Inicializar repositorio Git
Write-Host "📁 Inicializando repositorio Git..." -ForegroundColor Blue
git init

# Agregar todos los archivos
Write-Host "📦 Agregando archivos al repositorio..." -ForegroundColor Blue
git add .

# Primer commit
Write-Host "💾 Creando primer commit..." -ForegroundColor Blue
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

# Crear repositorio en GitHub (requiere token de acceso personal)
Write-Host "🌐 Creando repositorio en GitHub..." -ForegroundColor Blue
Write-Host "💡 IMPORTANTE: Debes crear manualmente el repositorio 'Automatizate' en GitHub" -ForegroundColor Yellow
Write-Host "🔗 Ve a: https://github.com/new" -ForegroundColor Cyan
Write-Host "📝 Nombre del repositorio: Automatizate" -ForegroundColor Cyan
Write-Host "📝 Descripción: Plataforma de automatización empresarial que conecta clientes con expertos" -ForegroundColor Cyan
Write-Host "🔒 Visibilidad: Público o Privado según prefieras" -ForegroundColor Cyan

# Esperar confirmación del usuario
Read-Host "Presiona Enter cuando hayas creado el repositorio en GitHub"

# Agregar remote origin (reemplaza USERNAME con tu nombre de usuario de GitHub)
$username = Read-Host "Ingresa tu nombre de usuario de GitHub"
git remote add origin "https://github.com/$username/Automatizate.git"

# Subir al repositorio
Write-Host "⬆️ Subiendo código a GitHub..." -ForegroundColor Blue
git branch -M main
git push -u origin main

Write-Host "✅ ¡Código subido exitosamente a GitHub!" -ForegroundColor Green

# Renombrar carpeta local
Write-Host "🔄 Renombrando carpeta local..." -ForegroundColor Blue
$currentPath = Get-Location
$parentPath = Split-Path $currentPath -Parent
$newPath = Join-Path $parentPath "Automatizate"

Write-Host "📍 Ruta actual: $currentPath" -ForegroundColor Cyan
Write-Host "📍 Nueva ruta: $newPath" -ForegroundColor Cyan

# Verificar si la nueva carpeta ya existe
if (Test-Path $newPath) {
    Write-Host "⚠️ La carpeta 'Automatizate' ya existe en el directorio padre" -ForegroundColor Yellow
    Write-Host "💡 Por favor, elimínala manualmente o elige otro nombre" -ForegroundColor Yellow
} else {
    # Mover a la nueva ubicación
    Write-Host "🚚 Moviendo proyecto a nueva ubicación..." -ForegroundColor Blue
    Move-Item $currentPath $newPath
    
    Write-Host "✅ ¡Carpeta renombrada exitosamente!" -ForegroundColor Green
    Write-Host "📍 Nueva ubicación: $newPath" -ForegroundColor Cyan
    Write-Host "💡 Cierra esta terminal y abre una nueva en la nueva ubicación" -ForegroundColor Yellow
}

Write-Host "🎉 ¡Proceso completado!" -ForegroundColor Green
Write-Host "📚 Recuerda actualizar tu README.md con la nueva información del repositorio" -ForegroundColor Blue

