# Plan técnico: 003 - Contrato y cálculo de próximos turnos de TV

> Revisión vigente de la spec 005: la antigüedad organiza la lista de TV
> únicamente como referencia visual, sin modificar su contrato. El despacho y
> las posiciones priorizan PRIORITARIO sobre GENERAL en cualquier módulo del
> servicio; sin asesores activos para ese servicio, el estimado es `null`.

## Alcance

Implementación exclusiva del backend. La interfaz y su presentación se
documentan en la spec frontend enlazada desde `spec.md`. No se requieren cambios
de esquema ni dependencias.

## Decisiones de implementación

1. Extender el snapshot público de TV con `upcomingTurns`, máximo cinco entradas
con `turnoId` y `ticketCode`. Consultar únicamente turnos pendientes del día
operativo y ordenar con `TurnoQueueService.compareQueueOrder`.
2. Incluir todos los turnos pendientes del día operativo de la sede, aunque no
   haya sesiones activas; respetar prioridad y antigüedad.
3. Emitir `cola:actualizada` tanto a la sala de la sede como a la sala TV. El
   evento funciona como invalidación y no lleva el snapshot de próximos turnos.
   Ante cambios de sesiones, recalcular las colas de todos los servicios para
   cubrir transiciones de cobertura completa a parcial y viceversa.
4. Detectar cobertura completa comparando los servicios activos de sede con los
servicios asignados a cada módulo activo. Solo con cobertura completa consultar
pendientes sin filtro de servicio para el cálculo de posición; en cualquier otro
caso conservar la consulta segmentada.
5. Mantener el conteo de asesores activos elegibles por servicio y la fórmula de
espera existentes. Con cobertura completa, cada servicio cuenta con la misma
capacidad total por las asignaciones que definen esa cobertura.
6. Actualizar Swagger y `frontend-handoff.md` con el nuevo campo, evento y regla.

## Pruebas

- Cobertura total y parcial de servicios, incluyendo sede sin módulos activos.
- Conteo global y segmentado de posición, respetando prioridad y FIFO.
- Snapshot TV con cero, menos de cinco y más de cinco pendientes, incluyendo sede sin sesiones activas.
- Forma pública mínima de cada entrada y emisión de invalidación a TV.
- Verificar `pnpm test`, `npx tsc --noEmit` y `pnpm build`.

## Reversión

Retirar la extensión del snapshot, la emisión a la sala TV y la condición de
cobertura; conservar intactos los contratos y eventos existentes.

## Extensión: historial reciente de llamados

Consultar `TurnoTracking` con estado `LLAMADO` en el mismo rango operativo
que usa el snapshot. Seleccionar el último registro de cada turno antes de
aplicar el límite de cinco. Desempatar por ID descendente. Obtener sede y
código del turno y recuperar el módulo desde el registro histórico.

Verificar el filtro de sede y día, el límite, el rellamado, la respuesta sin
historial y la preservación del error 404. No se modifican eventos, esquema ni
dependencias. Para revertir esta extensión, retirar únicamente `recentCalls`,
su servicio, documentación y pruebas.

## Extensión: nombre de visualización

Seleccionar solo el ID y el nombre del paciente en las consultas de activos e
historial. Aplicar la misma regla de abreviación en `TurnoTvService` antes de
responder. Verificar la salida de ambos listados, los espacios múltiples y los
nombres cortos o ausentes. No cambiar esquema ni eventos de Socket.IO.
