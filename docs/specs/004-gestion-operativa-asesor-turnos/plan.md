# Plan técnico backend 004 — Gestión operativa de turnos

## Alcance

Cambios exclusivos del backend en `api-nordvital`. No documentar aquí tareas ni archivos del frontend.

## Decisiones técnicas propuestas

1. Aplicar `authorizeRoles(ROLE_IDS.ADMINISTRADOR, ROLE_IDS.RADICADOR)` al router de atención, manteniendo `authenticate`.
2. Añadir una ruta autenticada/autorizada de opciones operativas que devuelva módulos activos y servicios activos para iniciar sesión. No reutilizar rutas administrativas cuyo grupo de autorización excluye Radicador.
3. Extender `GET /turnos/atencion/estado-actual` con `pendingQueue`, consultada desde la sesión activa, sede, servicios asociados y rango de `TurnoDayService`. Ordenar mediante `TurnoQueueService.compareQueueOrder`.
4. Proyectar únicamente `ticketCode`, nombre del paciente, nombre del servicio, prioridad y minutos de espera transcurridos. No exponer identificador interno, token ni documento.
5. Verificar la propiedad del turno activo del usuario antes de ejecutar acciones, sin permitir que `turnoId` habilite operar sobre turnos de otros usuarios.
6. Para `TRANSFERIR`, validar que el servicio de destino exista, esté activo y sea distinto del actual; dado que `ServicioAtencion` es un catálogo global sin relación de sede, la pertenencia a sede se determina por la sede de la sesión activa.
7. Para `CANCELAR`, limitar la acción al turno activo llamado o en atención y exigir `notes` no vacío; guardar el motivo en `TurnoTracking` y conservar eventos y recálculo de cola.
8. En `cerrarSesion`, bloquear el cierre tanto para estado `LLAMADO` como `EN_ATENCION`.
9. Añadir pruebas de servicios/controlador para autorización, opciones de sesión, filtrado y orden de cola, privacidad de campos, turno ajeno, transferencia inválida, cancelación sin motivo y cierre bloqueado.
10. Actualizar Swagger. No se anticipa migración ni dependencia nueva.

## Verificación

- Ejecutar pruebas focalizadas y `pnpm test`.
- Ejecutar `npx tsc --noEmit` y `pnpm build`.
- Ejecutar `pnpm m:show` si la implementación termina requiriendo una migración.
- Usar pruebas controladas; no ejecutar cambios de datos de producción.

## Riesgos a revisar antes de implementar

- `ServicioAtencion` no tiene vínculo con sede. La transferencia a «servicio activo de la misma sede» se puede validar con el contexto de sede de la sesión, pero el catálogo activo es global.
- Las rutas de atención actualmente solo aplican autenticación.
- El cierre actual valida el estado `EN_ATENCION`, pero debe incluir `LLAMADO`.
