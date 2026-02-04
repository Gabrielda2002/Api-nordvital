# NordVital Inventory Agent

Agente automático para recopilar información de equipos de cómputo y enviarla a la API de NordVital.

## 📋 Características

- ✅ Detección automática de hardware (CPU, RAM, discos, GPU)
- ✅ Información del equipo (marca, modelo, serial, SO, red)
- ✅ Software instalado detectado automáticamente
- ✅ Input interactivo para datos administrativos (ubicación, inventario, garantía)
- ✅ Actualización automática de equipos existentes (match por MAC/Serial)
- ✅ Compilable a .exe (no requiere Node.js instalado)
- ❌ Accesorios NO se inventarían automáticamente (registro manual desde app)

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

El agente se conecta por defecto a `http://localhost:3600`. Para cambiar la URL:

```bash
# Copiar archivo de ejemplo
cp .env.example .env

# Editar .env
API_URL=https://api.nordvital.com
```

## 📤 Uso del Ejecutable

### Flujo de Ejecución:

1. **Ejecutar el agente**
   ```bash
   inventory-agent.exe
   ```

2. **Detección automática**
   - Recopila información del equipo (marca, modelo, serial, MAC, IP, SO)
   - Detecta componentes (CPU, RAM, discos, GPU)
   - Escanea software instalado

3. **Input de usuario** (consola interactiva)
   - Ubicación física del equipo
   - Número de inventario
   - Fecha de compra (opcional)
   - Estado de garantía
   - Candado físico (si/no)

4. **Envío a API**
   - Verifica si el equipo existe (por MAC o Serial)
   - Si existe → Actualiza datos técnicos
   - Si NO existe → Crea nuevo registro

5. **Confirmación**
   - Muestra resultado de la operación
   - Detalles del equipo guardado

### Ejecución Programada (Opcional)

Usar Task Scheduler de Windows para ejecutar automáticamente:

```powershell
$action = New-ScheduledTaskAction -Execute "C:\Path\To\inventory-agent.exe"
$trigger = New-ScheduledTaskTrigger -Weekly -At 9am
Register-ScheduledTask -TaskName "NordVital Inventory" -Action $action -Trigger $trigger
```

## 📊 Datos Recopilados

### 🤖 Automáticos (No requieren input)

#### Equipo
- Nombre del equipo (hostname)
- Marca y modelo
- Serial
- Sistema operativo
- Dirección IP y MAC
- Tipo (Desktop/Laptop)
- DHCP activo/inactivo

#### Componentes
- **CPU**: Marca, modelo, cores, velocidad
- **RAM**: Marca, capacidad, velocidad, tipo (DDR4, etc.)
- **Discos**: Marca, capacidad, tipo (SSD/HDD), interface (SATA/NVMe)
- **GPU**: Marca, modelo, VRAM (solo dedicadas)

#### Software
- Aplicaciones detectadas con versiones
- Sistema operativo completo

### 👤 Manuales (Input del usuario)

- Ubicación física del equipo
- Número de inventario
- Fecha de compra
- Estado de garantía (sí/no)
- Tiempo de garantía (ej: 12 meses)
- Candado físico (sí/no)
- Clave del candado (si aplica)

### ❌ NO Inventariados

- **Accesorios** (mouse, teclado, monitores externos)
  - Razón: Detección imprecisa y cambio frecuente
  - Registro: Manual desde la aplicación web

## 🔄 Actualización de Equipos

El agente identifica equipos existentes por:
1. **MAC Address** (principal)
2. **Serial Number** (alternativo)

**Al actualizar un equipo existente:**
- ✅ Actualiza: Hardware, SO, IP, componentes, software
- ❌ Mantiene: Ubicación, número inventario, usuario asignado
- ⚠️ Override: Solo si se proporciona explícitamente

**Flujo de actualización:**
```
Script detecta MAC → Busca en BD → Equipo existe
    ↓
Actualiza componentes (elimina antiguos + crea nuevos)
Actualiza software (elimina antiguo + crea nuevo)
Mantiene datos administrativos
```

## 🔒 Seguridad

- No se almacenan credenciales
- Solo lectura de información del sistema
- Endpoint sin autenticación (red interna)
- Sin acceso a archivos personales

## 🛠️ Stack Tecnológico

- TypeScript
- systeminformation (detección de hardware)
- axios (comunicación con API)
- readline (input interactivo nativo)
- pkg (compilación a ejecutable)

## 🐛 Troubleshooting

### No conecta con la API
```bash
# Verificar URL en .env o variable de entorno
echo %API_URL%

# Verificar que la API esté corriendo
curl http://localhost:3600/api/health
```

### Error de firewall
```powershell
# Agregar regla de firewall (como Admin)
New-NetFirewallRule -DisplayName "Node.js npm/pnpm" `
  -Direction Outbound `
  -Program "C:\Program Files\nodejs\node.exe" `
  -Action Allow
```

### El equipo se duplica
- Verificar que MAC y Serial sean correctos
- Si cambiaste la tarjeta de red, actualizar manualmente desde la app
