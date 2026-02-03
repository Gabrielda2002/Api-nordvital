# NordVital Inventory Agent

Agente automático para recopilar información de equipos de cómputo y enviarla a la API de NordVital.

## 📋 Características

- ✅ Detección automática de hardware (CPU, RAM, discos, GPU)
- ✅ Información del equipo (marca, modelo, serial, SO, red)
- ✅ Software instalado
- ✅ Accesorios externos (monitores, impresoras, dispositivos USB)
- ✅ Compilable a .exe (no requiere Node.js instalado)

## 🚀 Desarrollo

```bash
# Instalar dependencias
pnpm install

# Ejecutar en modo desarrollo
pnpm dev

# Compilar a JavaScript
pnpm build

# Ejecutar versión compilada
pnpm start
```

## 📦 Generar Ejecutable

```bash
# Compilar a .exe para Windows
pnpm build:exe

# El archivo estará en: build/inventory-agent.exe
```

## ⚙️ Configuración

El agente se conecta por defecto a `http://localhost:3000`. Para cambiar la URL:

```bash
# Variable de entorno
set API_URL=https://api.nordvital.com
inventory-agent.exe

# O modificar en src/api-client.ts
```

## 📤 Uso del Ejecutable

1. Copiar `inventory-agent.exe` al equipo destino
2. Ejecutar el archivo
3. El agente recopilará la información y la enviará automáticamente

### Ejecución Programada (Opcional)

Usar Task Scheduler de Windows para ejecutar automáticamente:

```powershell
$action = New-ScheduledTaskAction -Execute "C:\Path\To\inventory-agent.exe"
$trigger = New-ScheduledTaskTrigger -Weekly -At 9am
Register-ScheduledTask -TaskName "NordVital Inventory" -Action $action -Trigger $trigger
```

## 📊 Datos Recopilados

### Equipo
- Nombre del equipo
- Marca y modelo
- Serial
- Sistema operativo
- Dirección IP y MAC
- Tipo (Desktop/Laptop)

### Componentes
- Procesador (marca, modelo, cores, velocidad)
- Memoria RAM (capacidad, velocidad, slots)
- Discos duros (capacidad, tipo, interface)
- Tarjeta gráfica (modelo, VRAM)

### Software
- Aplicaciones instaladas importantes
- Versiones detectadas

### Accesorios
- Monitores externos
- Impresoras
- Dispositivos USB con serial

## 🔒 Seguridad

- No se almacenan credenciales
- Solo lectura de información del sistema
- Conexión HTTPS soportada
- Sin acceso a archivos personales

## 🛠️ Stack Tecnológico

- TypeScript
- systeminformation (detección de hardware)
- axios (comunicación con API)
- pkg (compilación a ejecutable)
