# Plan técnico: 003 - Contrato y cálculo de próximos turnos de TV

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
