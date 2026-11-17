# Plan técnico backend 005 — Servicios por sede y colas prioritarias

**Estado:** Aprobado por el usuario. Implementación pendiente de aprobación de tareas.

## Alcance

Cambios exclusivos del backend en `api-nordvital`. El frontend se atenderá en una unidad posterior. La implementación requiere una migración manual porque TypeORM mantiene `synchronize: false`.

## Decisiones técnicas

1. Crear una relación explícita sede-servicio en una tabla de asociación propia, con claves foráneas a `headquarters` y `attention_services`, unicidad por pareja e índices de consulta. No asociarla a `turno_sedes_config`: la disponibilidad del servicio pertenece a la sede, aunque la configuración geográfica de turnos se administre por separado.
2. No precargar asociaciones para sedes existentes. La migración dejará la relación vacía; el Administrador hará la asignación inicial.
3. Agregar a `ModuloAtencion` un indicador booleano persistido que identifique los módulos exclusivos para prioridad. El valor predeterminado será `false`, por lo que los módulos existentes quedan generales hasta que Administración cambie su clasificación. Bloquear el cambio de clasificación mientras el módulo tenga una sesión activa. No se exige cantidad mínima de módulos prioritarios para emitir turnos.
4. Implementar lectura y reemplazo completo de servicios asignados mediante rutas administrativas. El reemplazo validará IDs únicos, existentes y activos; la escritura y sus validaciones de retiro se harán dentro de una transacción.
5. Antes de retirar asociaciones, consultar sesiones activas que tengan esos servicios y cualquier turno sin resolver (`PENDIENTE`, `LLAMADO` o `EN_ATENCION`) de la sede, sin limitar la comprobación al día operativo. Si existe alguno, rechazar todo el reemplazo sin cambios parciales.
6. Filtrar `GET /turnos/sedes/:slug/config` por servicios asociados a la sede y activos. En emisión, validar de nuevo sede, asignación y estado activo; si no hay servicios disponibles, rechazar con un mensaje específico.
7. Extender las opciones de atención para devolver los servicios de la sede seleccionada y el tipo de cada módulo. Validar también en `iniciarSesion` que los servicios solicitados estén asignados a la sede del módulo.
8. Cambiar `TurnoQueueService.getNextInQueue` para filtrar por sede, servicios de la sesión, rango operativo y prioridad admitida por el módulo. El orden será FIFO por `createdAt` e `id`; se elimina la precedencia cruzada actual de prioritarios sobre generales.
9. Reclamar el siguiente turno bajo transacción y bloqueo pesimista de fila. Así varios módulos de una misma cola no podrán obtener el mismo turno. La actualización a `LLAMADO` y su asignación al asesor/módulo ocurrirán antes de confirmar la transacción; trazabilidad y eventos se emitirán después del commit.
10. Aplicar el mismo filtro de sede a la transferencia. El destino debe ser un servicio activo asociado a la sede del turno; la prioridad del turno se conserva al volver a `PENDIENTE`.
11. Adaptar cola de sesión, cálculos de espera, notificaciones de cola y eventos Socket.IO para separar los turnos generales de los prioritarios y contar solo sesiones de módulos compatibles. Mantener el comportamiento existente de cobertura entre servicios dentro de la misma prioridad.
12. Actualizar Swagger de rutas administrativas, opciones de atención, configuración pública, emisión y llamada del siguiente turno.

## Migración

- Crear la tabla de asociación sede-servicio con claves foráneas, índice por sede y restricción única por sede/servicio.
- Agregar el indicador de módulo prioritario con `false` para registros existentes.
- No insertar asociaciones ni cambiar la prioridad de módulos existentes automáticamente.
- Implementar `down` que retire la columna y la tabla creadas por esta migración, en orden seguro.

## Pruebas

- Relación sede-servicio: lectura, reemplazo, duplicados, IDs inexistentes/inactivos y rollback cuando haya sesión o turnos sin resolver.
- Configuración pública y emisión: servicios asignados únicamente, sede sin asignaciones y servicio activo pero no asignado.
- Administración y sesiones: crear/actualizar tipo de módulo; rechazar servicios ajenos a la sede al iniciar sesión.
- Despacho: módulo general solo llama generales; prioritario solo llama prioritarios; FIFO dentro de cada cola; varias sesiones concurrentes no reclaman el mismo turno.
- Transferencia: permitir destino asignado y activo; rechazar destino ajeno o inactivo sin mutar el turno.
- Colas y Socket.IO: posición y estimado de espera consideran únicamente prioridad y módulos elegibles.
- Ejecutar pruebas focalizadas y `pnpm test`, `npx tsc --noEmit`, `pnpm build` y `pnpm m:show`.

## Riesgos y límites

- Como las asociaciones iniciales quedan vacías, ninguna sede podrá emitir turnos hasta que el Administrador configure al menos un servicio.
- Si una sede no tiene módulo prioritario configurado o activo, sus turnos prioritarios permanecerán pendientes; no se desviarán a módulos generales.
- El bloqueo de retiro puede impedir cambios administrativos hasta cerrar sesiones y resolver turnos de ese servicio.
- No modificar la edición preexistente de autorización en `src/modules/turnos/routes/turnos-admin.routes.ts`; no forma parte de esta unidad.
