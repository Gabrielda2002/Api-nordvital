# Plan Técnico: 002 - Sistema de Gestión de Turnos (Digiturno)

## Correcciones de integración pública — 2026-11-10

Alcance autorizado: cerrar las dependencias revisadas con el frontend sin tocar
el frontend ni descartar cambios existentes. Sin nuevas dependencias ni DDL.

1. Extraer emisión a un servicio transaccional. Identificar por tipo y número,
   bloquear el paciente existente con `pessimistic_write`, comprobar el turno
   activo diario y persistir turno/tracking con el mismo EntityManager.
   Para identidades nuevas, bloquear el tipo de documento y volver a buscar al
   paciente antes de intentar crearlo; evita el hueco de bloquear una fila inexistente.
   Bloquear la configuración de sede antes de generar el correlativo.
2. Centralizar el día operativo `America/Bogota` para no depender de la zona del
   proceso. Usar el mismo rango en cola, consulta HTTP, numeración y recuperación.
3. Incorporar `skipGeolocation: true` exclusivamente con `isDevelopment`.
   Los demás casos exigen coordenadas y radio válido, incluido testing/staging.
4. Recalcular cola después de emisión, llamado, transferencia y cancelación;
   recalcular servicios afectados al iniciar, reemplazar o cerrar sesiones.
   Mantener eventos actuales y añadir `turno:actualizado` a sede y TV al iniciar
   atención. `turno:retirado` elimina un turno de la TV sin anunciarlo otra vez.
5. Cancelación pública mediante actualización condicional por estado; ante una
   carrera con inicio de atención, solo una transición puede ganar.
6. Probar caminos correctos, rechazo, concurrencia simulada, emisiones y limpieza.
   Verificar con `pnpm test`, `pnpm exec tsc --noEmit`, `pnpm build` y `pnpm m:show`.

Unidades de revisión: identidad/emisión con pruebas; ubicación/día operativo;
eventos con pruebas. Cada unidad conserva documentación y pruebas correspondientes.
No se crean commits ni PRs automáticamente. La concurrencia real MySQL requiere
un escenario aislado adicional; las pruebas simuladas no sustituyen esa evidencia.
Reversión: retirar únicamente los cambios de esta fase en servicios, controladores,
rutas y pruebas, sin eliminar la implementación previa ni tocar datos.

Bloqueo externo: el modelo Pacientes exige campos adicionales para el alta mínima;
no se relajan validaciones globales ni se fabrican valores en esta fase.

## 1. Enfoque Técnico

El objetivo es implementar el módulo de gestión de turnos centralizado y 100% digital en `src/modules/turnos/`, sustituyendo la aplicación heredada monolítica ("Digiturno 4.1.1"). La solución se integra sobre la arquitectura modular existente de `api-nordvital` (Express 5, TypeORM Active Record, Socket.IO, MySQL y TypeScript).

### Componentes del Módulo:

1. **Entidades TypeORM (`src/modules/turnos/entities/`):**
   - `TurnoSedeConfig.ts` (`turno_sedes_config`): Configuración de turnos por sede (`sedeId`, `slug` único, `latitude`, `longitude`, `geoRadiusMeters`, `isEnabled`, `averageServiceMinutes`).
   - `Turno.ts` (`turnos`): Núcleo del turno (`sedeId`, `serviceId`, `patientId`, `ticketToken`, `dailyNumber`, `ticketCode`, `priority` [GENERAL/PRIORITARIO], `status` [PENDIENTE, LLAMADO, EN_ATENCION, FINALIZADO, NO_ASISTIO, CANCELADO, TRANSFERIDO], `calledAt`, `startedAt`, `finishedAt`).
   - `TurnoTracking.ts` (`turno_tracking`): Trazabilidad inmutable de eventos (`turnoId`, `status`, `moduloId`, `userId`, `notes`, `createdAt`).
   - `ModuloAtencion.ts` (`turnos_modulos`): Ventanilla/módulo físico (`sedeId`, `code`, `name`, `isActive`).
   - `SesionAtencion.ts` (`turnos_sesiones_atencion`): Sesión activa del asesor (`userId`, `moduloId`, `sedeId`, `startedAt`, `endedAt`, `isActive`).
   - `SesionAtencionServicio.ts` (`turnos_sesiones_servicios`): Relación M:N dinámica entre la sesión del asesor y los servicios que atiende.
   - `TurnoEncuesta.ts` (`turnos_encuestas`): Encuesta NPS (1 a 5 estrellas, comentario opcional, relación 1:1 con `Turno`).

2. **Servicios de Dominio (`src/modules/turnos/services/`):**
   - `turno-queue.service.ts`: Despacho FIFO con prioridad de Ley (`PRIORITARIO` precede a `GENERAL`), reinicio de numeración diaria, estimación de espera y cálculo de turnos precedentes.
   - `turno-geo.service.ts`: Cálculo geodésico Haversine entre las coordenadas GPS del paciente y las coordenadas registradas de la sede con tolerancia $\le 150\text{ m}$.
   - `turno-socket.service.ts`: Difusión de eventos en tiempo real a las salas `sede_${sedeId}` y `sede_${sedeId}_tv` utilizando la instancia `io` exportada en `src/app.ts`.

3. **Controladores y Rutas (`src/modules/turnos/controllers/` y `routes/`):**
   - **Rutas Públicas (`turnos-public.routes.ts`):**
     - `GET /turnos/sedes/:slug/config`: Configuración pública de sede y servicios activos.
     - `POST /turnos/pacientes/verificar`: Búsqueda o precarga de paciente por documento.
     - `POST /turnos/ticket`: Emisión de ticket digital con validación de geolocalización.
     - `GET /turnos/ticket/:token`: Consulta en vivo del estado del ticket para el celular del paciente.
     - `POST /turnos/ticket/:token/encuesta`: Registro de encuesta NPS post-atención.
     - `GET /turnos/tv/:slug/estado`: Estado inicial para pantallas de sala (turnos en llamado y atención).
   - **Rutas de Atención (`turnos-atencion.routes.ts`):**
     - Autenticadas con `authenticate` y autorización para roles de atención (SIAU, Auxiliares, Admisiones, etc.).
     - `POST /turnos/atencion/sesion/iniciar`: Login del asesor en módulo y selección de servicios.
     - `POST /turnos/atencion/sesion/cerrar`: Cierre de sesión y liberación de ventanilla.
     - `POST /turnos/atencion/accion`: Despacho de la máquina de estados (`LLAMAR`, `RELLAMAR`, `INICIAR`, `FINALIZAR`, `NO_ASISTIO`, `TRANSFERIR`).
     - `GET /turnos/atencion/estado-actual`: Turno actual atendido por el asesor.
   - **Rutas de Administración (`turnos-admin.routes.ts`):**
     - Autenticadas con `ROLE_GROUPS.MANAGEMENT` y Administrador (`ROLE_IDS.ADMINISTRADOR`).
     - CRUD de configuración de sedes y módulos de atención.
     - Reportes y KPIs de tiempos de espera, atención y satisfacción.
   - **Ruta Principal (`turnos.routes.ts`):**
     - Router integrador montado en `src/modules/index.ts` mediante importación directa (sin barrel file).

4. **Persistencia y Migración (`src/migrations/`):**
   - Migración manual TypeORM `CreateTurnosModuleTables<timestamp>.ts` creando las tablas con sus índices de alto rendimiento (`ticket_token`, `status`, `sede_id`, `created_at`).

---

## 2. Decisiones de Arquitectura

### Decisión 1: Tabla dedicada `turno_sedes_config` vs Alterar `headquarters`
- **Opción seleccionada:** Crear `turno_sedes_config` relacionada 1:1 con `headquarters`.
- **Alternativas consideradas:** Añadir columnas (`latitude`, `longitude`, `slug`) directamente a la tabla `headquarters`.
- **Razón:** La tabla `headquarters` es compartida por más de 15 módulos en producción. Crear una tabla de configuración satélite aisla el módulo de turnos, evita tocar esquemas core estables y encapsula parámetros propios de la operación (slug amigable para QR, radio de geofencing, tiempo promedio estimado).

### Decisión 2: Despacho FIFO con Prioridad Estricta (Ley 1171 de Colombia)
- **Opción seleccionada:** En la selección del siguiente turno, ordenar por: `priority = 'PRIORITARIO' DESC, created_at ASC`.
- **Alternativas consideradas:** Ponderación porcentual (ej. 2 prioritarios por cada 1 general).
- **Razón:** El marco regulatorio colombiano de salud y protección prioritaria exige atención preferencial sin dilaciones. Si hay pacientes prioritarios en cola para los servicios asignados al asesor, se atienden primero en estricto orden de llegada.

### Decisión 3: Validación Geodésica en Backend (Fórmula de Haversine)
- **Opción seleccionada:** Cálculo matemático puro en `turno-geo.service.ts` validando distancia euclidiana esférica entre la coordenada emitida por el dispositivo móvil y la sede ($\le 150\text{ m}$).
- **Alternativas consideradas:** Confiar únicamente en la validación del frontend o consultar APIs externas de mapas (Google Maps API).
- **Razón:** Validar en frontend es vulnerable a manipulación de requests. Usar APIs externas agrega latencia y costos recurrentes innecesarios, mientras que Haversine en backend es instantáneo, determinista y seguro.

### Decisión 4: Identificador Público Seguro (UUID v4 / Token) para Tickets
- **Opción seleccionada:** Generar un `ticketToken` UUID v4 aleatorio e indexado para la URL pública del ticket (`/turnos/ticket/:token`).
- **Alternativas consideradas:** Usar el `id` autoincremental de la base de datos o el código visible (`G-001`).
- **Razón:** Previene ataques de enumeración (IDOR) donde un usuario podría consultar datos de salud y nombres de otros pacientes simplemente cambiando el número en la URL.

### Decisión 5: Reutilización de la Instancia Global `io` de Socket.IO
- **Opción seleccionada:** Importar la instancia `io` desde `src/app.ts` y segmentar las emisiones por salas (`sede_${sedeId}` y `sede_${sedeId}_tv`).
- **Alternativas consideradas:** Crear un servidor WebSocket o instancia Socket.IO aislada en un puerto separado.
- **Razón:** `src/app.ts` ya tiene configurado el servidor HTTP con Socket.IO, CORS y autenticación unificada. Segmentar por salas permite aislamiento por sede sin sobrecoste de infraestructura.

---

## 3. Cambios en Archivos

| Archivo | Acción | Descripción |
|---|---|---|
| `src/modules/turnos/entities/TurnoSedeConfig.ts` | Crear | Entidad de configuración geográfica y slug de sede para turnos. |
| `src/modules/turnos/entities/Turno.ts` | Crear | Entidad principal de turnos y estados de ciclo de vida. |
| `src/modules/turnos/entities/TurnoTracking.ts` | Crear | Entidad de auditoría inmutable de transiciones de estado. |
| `src/modules/turnos/entities/ModuloAtencion.ts` | Crear | Entidad de ventanillas físicas de atención. |
| `src/modules/turnos/entities/SesionAtencion.ts` | Crear | Entidad de sesión activa de asesor en módulo. |
| `src/modules/turnos/entities/SesionAtencionServicio.ts` | Crear | Relación M:N entre sesión de asesor y servicios atendidos. |
| `src/modules/turnos/entities/TurnoEncuesta.ts` | Crear | Entidad de satisfacción NPS del turno. |
| `src/modules/turnos/services/turno-geo.service.ts` | Crear | Servicio de validación de geofencing con fórmula de Haversine. |
| `src/modules/turnos/services/turno-queue.service.ts` | Crear | Lógica de encolamiento, correlativo diario y asignación con prioridad. |
| `src/modules/turnos/services/turno-socket.service.ts` | Crear | Servicio de emisión de eventos de turnos hacia salas de Socket.IO. |
| `src/modules/turnos/controllers/turnos-public.controller.ts` | Crear | Controlador de endpoints públicos (config, verificar paciente, ticket, encuesta, tv). |
| `src/modules/turnos/controllers/turnos-atencion.controller.ts` | Crear | Controlador del flujo del asesor (sesión y máquina de estados del turno). |
| `src/modules/turnos/controllers/turnos-admin.controller.ts` | Crear | Controlador administrativo (módulos, sedes, KPIs). |
| `src/modules/turnos/routes/turnos-public.routes.ts` | Crear | Rutas públicas documentadas con Swagger. |
| `src/modules/turnos/routes/turnos-atencion.routes.ts` | Crear | Rutas de atención con autenticación y Swagger. |
| `src/modules/turnos/routes/turnos-admin.routes.ts` | Crear | Rutas administrativas con control de roles. |
| `src/modules/turnos/routes/turnos.routes.ts` | Crear | Router maestro del módulo de turnos. |
| `src/modules/index.ts` | Modificar | Montar `turnosRoutes` bajo el prefijo correspondiente con import directo. |
| `src/migrations/1793892000000-CreateTurnosModuleTables.ts` | Crear | Migración manual DDL para todas las tablas del módulo. |
| `src/modules/turnos/__tests__/turno-geo.test.ts` | Crear | Pruebas unitarias de cálculo de distancia y tolerancia geográfica. |
| `src/modules/turnos/__tests__/turno-queue.test.ts` | Crear | Pruebas unitarias de prioridad FIFO y máquina de estados. |

---

## 4. Estrategia de Pruebas

Pruebas unitarias con el runner nativo `node:test` y `node:assert`:
1. **Validación Geográfica (`turno-geo.test.ts`):**
   - Coordenadas a menos de 150m de la sede retornan `isWithinRadius = true`.
   - Coordenadas a más de 150m retornan `isWithinRadius = false` y calculan distancia correcta.
   - Parámetros inválidos o coordenadas vacías lanzan error descriptivo.
2. **Prioridad y Máquina de Estados (`turno-queue.test.ts`):**
   - Si existen turnos generales anteriores a un turno prioritario, el prioritario es llamado primero.
   - Entre dos turnos con la misma prioridad, el más antiguo (FIFO) es llamado primero.
   - Transiciones permitidas: `PENDIENTE` $\rightarrow$ `LLAMADO` $\rightarrow$ `EN_ATENCION` $\rightarrow$ `FINALIZADO`.
   - Transición ilegal: Intentar finalizar o llamar un turno no existente o ya finalizado lanza `BadRequestError` o `ConflictError`.
   - Conteo de personas delante y cálculo de tiempo estimado.
