# Tareas backend: 003 - Contrato y cálculo de próximos turnos de TV

- [x] Añadir pruebas para cobertura completa, parcial y sin módulos activos.
- [x] Implementar detección de cobertura total de servicios por módulos activos.
- [x] Ajustar posición global solo con cobertura completa; mantener por servicio en los demás casos.
- [x] Añadir pruebas de conteo global/segmentado y capacidad de asesores existente.
- [x] Extender estado TV con hasta cinco turnos pendientes del día, ordenados y sin depender de sesiones activas.
- [x] Verificar que cada entrada próxima solo contenga ID y código.
- [x] Emitir `cola:actualizada` a la sala TV y probar destinatario y payload.
- [x] Actualizar Swagger y `docs/specs/002-gestion-turnos/frontend-handoff.md`.
- [x] Ejecutar pruebas, tipos y build; registrar resultados.

### Evidencia

- `node --require ts-node/register --require tsconfig-paths/register --test src/modules/turnos/__tests__/turno-queue.test.ts src/modules/turnos/__tests__/turno-realtime.test.ts`: 29 pruebas aprobadas.
- `pnpm test`: 69 pruebas aprobadas, cero fallos.
- `pnpm exec tsc --noEmit`: aprobado.
- `pnpm build`: aprobado.
- No se verificó contra una instancia MySQL/Socket.IO real.
