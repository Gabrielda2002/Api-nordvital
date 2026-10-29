# Tareas de Implementación: 001 - Descarga de Archivos PDF para Roles Calidad y Administrador

## Fase 1: Pruebas Automatizadas (TDD / Verificación)
- [x] **Tarea 1.1**: Crear suite de pruebas `src/modules/documents/__tests__/archivo-access.test.ts` con casos para Administrador (1), Calidad (4), roles no autorizados (403), visualización VIEW (200), y descargas no-PDF (200).

## Fase 2: Implementación en Controlador y Rutas
- [x] **Tarea 2.1**: Incorporar regla de restricción de descarga de PDF en `generateFileAccessToken` (`src/modules/documents/controllers/archivo.controller.ts`), validando contra constantes de `ROLE_IDS.ADMINISTRADOR` y `ROLE_IDS.CALIDAD`.
- [x] **Tarea 2.2**: Eliminar función en desuso `downloadFile` de `src/modules/documents/controllers/archivo.controller.ts`.
- [x] **Tarea 2.3**: Remover ruta `GET /download-file/:id`, su anotación Swagger y su importación en `src/modules/documents/routes/archivos.routes.ts`.

## Fase 3: Validación y Verificación
- [x] **Tarea 3.1**: Ejecutar suite de pruebas con `pnpm test` (o `node --test`).
- [x] **Tarea 3.2**: Ejecutar chequeo de tipos estático con `npx tsc --noEmit`.
