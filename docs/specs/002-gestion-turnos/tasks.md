# Tareas de Implementación: 002 - Sistema de Gestión de Turnos (Digiturno)

## Fase 1: Persistencia y Entidades TypeORM
- [x] **Tarea 1.1**: Crear migración manual TypeORM `src/migrations/1793892000000-CreateTurnosModuleTables.ts` con DDL para tablas `turno_sedes_config`, `turnos`, `turno_tracking`, `turnos_modulos`, `turnos_sesiones_atencion`, `turnos_sesiones_servicios`, `turnos_encuestas` e índices de búsqueda (`ticket_token`, `status`, `sede_id`, `created_at`).
- [x] **Tarea 1.2**: Crear entidades Active Record (`extends BaseEntity`) en `src/modules/turnos/entities/`:
  - `TurnoSedeConfig.ts`
  - `Turno.ts`
  - `TurnoTracking.ts`
  - `ModuloAtencion.ts`
  - `SesionAtencion.ts`
  - `SesionAtencionServicio.ts`
  - `TurnoEncuesta.ts`

## Fase 2: Servicios de Dominio y Pruebas Unitarias (TDD)
- [x] **Tarea 2.1**: Implementar `src/modules/turnos/services/turno-geo.service.ts` con cálculo matemático Haversine y validación de radio $\le 150\text{ m}$.
- [x] **Tarea 2.2**: Crear suite de pruebas unitarias `src/modules/turnos/__tests__/turno-geo.test.ts` (`node:test`, `node:assert`).
- [x] **Tarea 2.3**: Implementar `src/modules/turnos/services/turno-queue.service.ts` con secuencia correlativa diaria, ordenamiento FIFO con prioridad por Ley 1171 (`PRIORITARIO` antes de `GENERAL`), cálculo de tiempo estimado y turnos por delante.
- [x] **Tarea 2.4**: Crear suite de pruebas unitarias `src/modules/turnos/__tests__/turno-queue.test.ts` validando la máquina de estados y priorización.
- [x] **Tarea 2.5**: Implementar `src/modules/turnos/services/turno-socket.service.ts` para emisión tipada de eventos hacia salas `sede_${sedeId}` y `sede_${sedeId}_tv` mediante la instancia global `io`.

## Fase 3: Controladores, Rutas y Swagger
- [x] **Tarea 3.1**: Implementar `turnos-public.controller.ts` y `turnos-public.routes.ts` para endpoints públicos (`/turnos/sedes/:slug/config`, `/turnos/pacientes/verificar`, `/turnos/ticket`, `/turnos/ticket/:token`, `/turnos/ticket/:token/encuesta`, `/turnos/tv/:slug/estado`).
- [x] **Tarea 3.2**: Implementar `turnos-atencion.controller.ts` y `turnos-atencion.routes.ts` protegidos con autenticación para el flujo del asesor (iniciar/cerrar sesión en módulo y acciones de turno `LLAMAR`, `RELLAMAR`, `INICIAR`, `FINALIZAR`, `NO_ASISTIO`, `TRANSFERIR`).
- [x] **Tarea 3.3**: Implementar `turnos-admin.controller.ts` y `turnos-admin.routes.ts` protegidos con `ROLE_GROUPS.MANAGEMENT` y `ROLE_IDS.CALIDAD` para módulos, sedes y KPIs.
- [x] **Tarea 3.4**: Crear router principal `src/modules/turnos/routes/turnos.routes.ts` e importarlo directamente en `src/modules/index.ts` (sin barrel files).

## Fase 4: Verificación Integral y Calidad
- [x] **Tarea 4.1**: Validar consistencia de migración con `src/migrations/1793892000000-create-turnos-module.ts`.
- [x] **Tarea 4.2**: Ejecutar suite completa de pruebas unitarias (`pnpm test` / `node --test`).
- [x] **Tarea 4.3**: Ejecutar chequeo estático de tipos con `npx tsc --noEmit`.

## Fase 5: Correcciones de integración pública (2026-11-10)
- [x] **Tarea 5.1**: Unificar identidad y conservar pacientes existentes; emisión transaccional con exclusión de solicitudes simultáneas.
- [x] **Tarea 5.2**: Unificar día operativo de Colombia y omisión explícita de ubicación únicamente en desarrollo.
- [x] **Tarea 5.3**: Completar eventos de cola, sesiones y TV después de persistir.
- [x] **Tarea 5.4**: Proteger la cancelación pública frente a estados no permitidos y carreras con inicio de atención.
- [x] **Tarea 5.5**: Actualizar Swagger/contrato y añadir pruebas automatizadas de las correcciones.
- [x] **Tarea 5.6**: Registrar resultados de pruebas, tipos, build y consulta de migraciones.
- [ ] **Bloqueo externo**: Acordar alta mínima de pacientes sin datos ficticios ni cambios implícitos al modelo compartido.
- [ ] **Verificación de entorno aislado**: Probar concurrencia real con MySQL y clientes Socket.IO; no ejecutada contra registros de pacientes existentes.

### Evidencia de verificación (2026-11-10)

- Pruebas focalizadas: `node --require ts-node/register --require tsconfig-paths/register --test src/modules/turnos/__tests__/turno-public.test.ts src/modules/turnos/__tests__/turno-realtime.test.ts`: 24 pruebas aprobadas.
- Suite completa `pnpm test`: 64 pruebas aprobadas, cero fallos.
- Tipos `pnpm exec tsc --noEmit --incremental false`: aprobado.
- Compilación `pnpm build`: aprobada.
- Estado de migraciones `pnpm m:show`: consulta aprobada; migración de Turnos aplicada, sin pendientes listadas. No se ejecutaron migraciones ni DDL.
- `git diff --check`: aprobado (solo avisos de normalización CRLF).
- Simulación de controladores/eventos: emisión seguida de recálculo, cambio de estado de TV, conflicto de inicio, cambio/cierre de sesiones y cancelación. Sin iniciar servidor ni modificar datos.
- Concurrencia: prueba con dos emisiones simultáneas y bloqueo simulado; no equivale a una prueba de aislamiento real de MySQL.

Contrato para frontend: [frontend-handoff.md](frontend-handoff.md).
