# Tareas backend 004 — Gestión operativa de turnos

## Unidad A — Autorización y consulta de cola

- [x] Restringir las rutas de atención a Administrador y Radicador usando constantes de roles.
- [x] Exponer opciones de sesión (módulos activos y servicios activos) a los roles autorizados sin abrir las rutas administrativas a Radicador.
- [x] Extender el estado de sesión activa con la cola pendiente del día, filtrada por sede y servicios de sesión.
- [x] Devolver código, nombre, servicio, prioridad y tiempo de espera; excluir token y documento.
- [x] Ordenar la cola con el mismo criterio de despacho del siguiente turno.
- [x] Añadir pruebas para opciones, sesión ausente, filtros, orden y campos de respuesta.

## Unidad B — Reglas de acciones y sesión

- [x] Validar que las acciones afecten exclusivamente el turno activo asignado al usuario.
- [x] Validar destino de transferencia: servicio activo distinto del actual, dentro del contexto de la sede de la sesión.
- [x] Exigir y registrar motivo obligatorio al cancelar un turno llamado o en atención.
- [x] Impedir cerrar sesión mientras el usuario tenga un turno llamado o en atención.
- [x] Añadir pruebas de acciones válidas y errores de propiedad, transferencia, motivo y cierre.
- [x] Actualizar la documentación Swagger de las rutas y respuestas modificadas.

## Verificación

- [x] Ejecutar pruebas focalizadas y `pnpm test`.
- [x] Ejecutar `npx tsc --noEmit` y `pnpm build`.
- [x] Confirmar que no se requirió migración; no se ejecutó `pnpm m:show`.

### Evidencia

- `pnpm test`: 76 pruebas aprobadas.
- `npx tsc --noEmit` y `pnpm build`: aprobados.
- Sin cambios de esquema ni dependencias.
