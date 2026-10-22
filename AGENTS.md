# AGENTS.md — api-nordvital

## Proyecto
API REST y servicios backend para Nordvital IPS. Arquitectura modular en capas basada en Express 5, TypeScript y TypeORM (Active Record) sobre MySQL, con integración de Redis para caché y Socket.IO para eventos en tiempo real.

## Comandos
- Ejecutar: `pnpm dev` (o `pnpm dev:fast`)
- Tests: `pnpm test`
- Lint/formato: `npx tsc --noEmit`
- Ver migraciones pendientes: `pnpm m:show`
- Ejecutar migraciones: `pnpm m:run`
- Revertir migración: `pnpm m:revert`
- Compilar: `pnpm build`

## Estilo y convenciones
- Lenguaje y entorno: TypeScript (Node.js 20+, target ES2016 con decoradores experimentales).
- Sin barrel files: Prohibido crear o usar barrel files (`index.ts` re-exportando). Los imports deben ser directos y explícitos al archivo que define el recurso.
- Entidades: Active Record (`extends BaseEntity`). Propiedades en `camelCase` en inglés. Columnas en base de datos en `snake_case` en inglés (`@Column({ name: "column_name" })`). Validaciones con `class-validator`.
- Módulos: Ubicados en `src/modules/<modulo>/` con subcarpetas `controllers/`, `entities/`, `routes/` (y opcionales `services/`, `utils/`, `descriptors/`).
- Rutas: Express Router documentado con Swagger JSDoc. Proteger con `authenticate` y `authorizeRoles(...)`.
- Roles: Usar siempre constantes de `@core/constants/roles.ts` (`ROLE_IDS`, `ROLE_GROUPS`), nunca cadenas o números mágicos.
- Errores y logs: Lanzar clases de `@core/utils/custom-errors.ts` y capturar con `next(error)`. Prohibido `console.log`, usar `Logger` de `@core/utils/logger-wrapper.ts`.
- Migraciones: Creación manual en `src/migrations/`.

## Reglas
- Lee docs/constitution.md y la spec activa antes de tocar código.
- Seguir el flujo SDD para cambios no triviales: Spec -> Plan -> Tasks -> Implementación -> Verificación.
- Límites:
  - Prohibido crear o usar barrel files (`index.ts`). Todo import debe ser directo al archivo específico.
  - No activar `synchronize: true` en TypeORM ni ejecutar DDL directo sin migración manual.
  - No agregar librerías a `package.json` sin autorización explícita.
  - No usar `console.log` para trazas de aplicación.
  - No leer directamente `process.env` en módulos; utilizar `EnvironmentConfig`.

## Al terminar cualquier tarea
- Verificación de tipos: `npx tsc --noEmit`
- Ejecutar suite de pruebas: `pnpm test`
- Si involucra base de datos, validar estado con `pnpm m:show`
