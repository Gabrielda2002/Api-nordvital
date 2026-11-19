# Plan técnico backend 005 — Servicios por sede y colas prioritarias

**Estado:** Aprobado por el usuario; actualizado con la reversión de exclusividad y clasificación persistente.

## Alcance

Cambios exclusivos del backend en `api-nordvital`. El frontend se atenderá en una unidad posterior. La implementación requiere una migración manual porque TypeORM mantiene `synchronize: false`.

## Decisiones técnicas

1. Crear una relación explícita sede-servicio en una tabla de asociación propia, con claves foráneas a `headquarters` y `attention_services`, unicidad por pareja e índices de consulta. No asociarla a `turno_sedes_config`: la disponibilidad del servicio pertenece a la sede, aunque la configuración geográfica de turnos se administre por separado.
2. No precargar asociaciones para sedes existentes. La migración dejará la relación vacía; el Administrador hará la asignación inicial.
3. Retirar `isPriority` de `ModuloAtencion` y administración. Eliminar la columna `is_priority` mediante una migración nueva, sin modificar la migración histórica aplicada.
4. Implementar lectura y reemplazo completo de servicios asignados mediante rutas administrativas. El reemplazo validará IDs únicos, existentes y activos; la escritura y sus validaciones de retiro se harán dentro de una transacción.
5. Antes de retirar asociaciones, consultar sesiones activas que tengan esos servicios y cualquier turno sin resolver (`PENDIENTE`, `LLAMADO` o `EN_ATENCION`) de la sede, sin limitar la comprobación al día operativo. Si existe alguno, rechazar todo el reemplazo sin cambios parciales.
6. Filtrar `GET /turnos/sedes/:slug/config` por servicios asociados a la sede y activos. En emisión, validar de nuevo sede, asignación y estado activo; si no hay servicios disponibles, rechazar con un mensaje específico.
7. Devolver servicios por sede y disponibilidad de módulos sin tipo de prioridad. Validar al iniciar sesión que los servicios pertenezcan a la sede.
8. Despachar por sede, servicios de la sesión y rango operativo sin filtro de prioridad. Restaurar prioritarios primero, luego `createdAt` e `id`, con el mismo comparador en las posiciones.
9. Reclamar el siguiente turno bajo transacción y bloqueo pesimista de fila. Así varios módulos de una misma cola no podrán obtener el mismo turno. La actualización a `LLAMADO` y su asignación al asesor/módulo ocurrirán antes de confirmar la transacción; trazabilidad y eventos se emitirán después del commit.
10. Aplicar el mismo filtro de sede a la transferencia. El destino debe ser un servicio activo asociado a la sede del turno; la prioridad del turno se conserva al volver a `PENDIENTE`.
11. Calcular cola, cobertura, posición y espera cruzando prioridades. Contar asesores activos del servicio sin tipo exclusivo de módulo. Mantener cobertura entre servicios y el orden cronológico informativo de TV sin cambios.
12. Actualizar Swagger de rutas administrativas, opciones de atención, configuración pública, emisión y llamada del siguiente turno.
13. Añadir `TurnoClassification` con tres valores y columna enum nullable en `turnos`, obligatoria al emitir por API pública. Conservar null para turnos históricos y devolver clasificación al consultar el ticket.

## Migración

- Crear la tabla de asociación sede-servicio con claves foráneas, índice por sede y restricción única por sede/servicio.
- Conservar la migración histórica sede-servicios/prioridad. Agregar `1795100000000-remove-module-priority.ts` y `1795100000001-add-turno-classification.ts`.
- `up`: quitar `is_priority` y añadir `classification` nullable sin rellenar datos históricos.
- `down`: retirar clasificación y recrear `is_priority` con `false`. No recupera tipos antiguos eliminados ni clasificaciones nuevas; requiere respaldo y coordinación de versiones.
- No ejecutar migraciones sin autorización y entorno acordado. Desplegar API y frontend coordinados porque la clasificación es obligatoria en nuevas emisiones.

## Pruebas

- Relación sede-servicio: lectura, reemplazo, duplicados, IDs inexistentes/inactivos y rollback cuando haya sesión o turnos sin resolver.
- Configuración pública y emisión: servicios asignados únicamente, sede sin asignaciones y servicio activo pero no asignado.
- Administración y sesiones: crear/actualizar sin tipo; rechazar servicios ajenos a la sede al iniciar sesión.
- Despacho: prioritarios primero en cualquier módulo elegible, FIFO por prioridad y ausencia de reclamos duplicados.
- Transferencia: permitir destino asignado y activo; rechazar destino ajeno o inactivo sin mutar el turno.
- Colas y Socket.IO: posición cruzando prioridades y estimado según asesores activos del servicio.
- Clasificación: tres valores persistidos; ausencia y valores inválidos rechazados antes de guardar; respuesta de ticket con clasificación.
- Ejecutar pruebas focalizadas y `pnpm test`, `npx tsc --noEmit`, `pnpm build` y `pnpm m:show`.

## Riesgos y límites

- Como las asociaciones iniciales quedan vacías, ninguna sede podrá emitir turnos hasta que el Administrador configure al menos un servicio.
- La ausencia de asesores activos no bloquea emisión; la espera será `null`. Cualquier módulo del servicio puede llamar prioritarios y generales.
- El bloqueo de retiro puede impedir cambios administrativos hasta cerrar sesiones y resolver turnos de ese servicio.
- No modificar la edición preexistente de autorización en `src/modules/turnos/routes/turnos-admin.routes.ts`; no forma parte de esta unidad.
