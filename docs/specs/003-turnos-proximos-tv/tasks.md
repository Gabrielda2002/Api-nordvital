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

### Extensión: historial reciente de llamados

- [x] Consultar los últimos cinco turnos distintos llamados en la sede y agregar `recentCalls` al estado de TV.
- [x] Documentar el campo en Swagger y verificar el contrato y los filtros con pruebas.
- [x] Ejecutar la suite y la verificación de tipos.

`pnpm test`: 131 pruebas aprobadas. `npx tsc --noEmit`: aprobado.
`pnpm m:show`: sin migraciones pendientes. Consulta de solo lectura en MySQL
para una sede sin historial: devolvió `[]`.

### Extensión: nombre de visualización

- [x] Incorporar el nombre abreviado a activos e historial; documentarlo en Swagger.
- [x] Verificar ambas listas, nombres cortos o ausentes y ausencia de datos adicionales.

`pnpm test`: 132 pruebas aprobadas, con consultas generadas por TypeORM y
resultados de prueba sin conexión a MySQL. `npx tsc --noEmit`: aprobado.
`pnpm m:show`: sin migraciones pendientes.
