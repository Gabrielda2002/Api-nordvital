# Tareas backend 005 — Servicios por sede y colas prioritarias

**Estado:** Revisión de prioridad por turno y clasificación implementada y verificada localmente el 19 de noviembre de 2026. Migraciones y concurrencia real MySQL pendientes de entorno autorizado.

## Revisión vigente — Prioridad por turno y clasificación

Esta sección y la spec actualizada sustituyen las reglas de exclusividad de A–E que se conservan debajo como historial de la implementación anterior.

- [x] Retirar `isPriority` de entidad, administración, opciones y filtros operativos.
- [x] Restaurar prioritarios primero, FIFO por `createdAt`/`id`, manteniendo bloqueo transaccional.
- [x] Unificar posiciones, cobertura y eventos cruzando prioridades sin alterar servicios por sede ni TV.
- [x] Añadir clasificación requerida en emisión pública, persistencia enum nullable y respuesta del ticket.
- [x] Crear migraciones nuevas sin editar las aplicadas: retirar `is_priority` y añadir `classification`.
- [x] Adaptar pruebas existentes y Swagger; comprobar los tres valores y rechazos sin escritura.
- [x] Ejecutar `pnpm test`: 125 pruebas aprobadas, cero fallos.
- [x] Ejecutar `pnpm exec tsc --noEmit` y `pnpm build`: salida 0.
- [x] Consultar `pnpm m:show`: aplicadas 178 `AddSiteServicesAndModulePriority1794611078914` y 179 `AllowMinimalPatientRegistration1794927748837`; pendientes `RemoveModulePriority1795100000000` y `AddTurnoClassification1795100000001`.
- [ ] Ejecutar `up`/`down` y concurrencia con conexiones independientes en una base MySQL autorizada.

**Comprobación de ejecución:** Controllers y eventos ejercitados por los tests con persistencia simulada; frontend recorrido en navegador con API simulada. Esto no acredita concurrencia real ni DDL en MySQL.

**Límite de reversión:** Retirar clasificación exige coordinar formulario/API y preservar los valores guardados antes de su `down`. Restaurar exclusividad exige restaurar juntos módulo, despacho y cálculos; su `down` solo recrea `is_priority=false`, no los valores antiguos. Mantener asignaciones por sede y alta mínima de pacientes fuera de esa reversión.

**Despliegue pendiente:** Respaldar y aplicar ambas migraciones en orden solo con autorización; desplegar API y frontend coordinadamente. No reclasificar módulos ni reconfigurar servicios ya asignados.

## Historial — Implementación previa de exclusividad (sustituida)

La [spec](spec.md) y el [plan](plan.md) están aprobados. Ejecutar las unidades en orden; mantener pruebas y documentación con el comportamiento que verifican.

## A — Persistencia y administración

**Resultado:** El Administrador puede asignar servicios por sede y clasificar módulos. Cubre RF-1 a RF-5, RF-9 y RF-18.

- [x] Crear entidad y migración manual de la relación sede-servicio, con claves foráneas y unicidad por pareja; dejar las asignaciones inicialmente vacías.
- [x] Agregar el indicador booleano de módulo prioritario a entidad y migración, con valor inicial `false`; implementar reversión de ambos cambios de esquema.
- [x] Implementar en servicios de negocio la consulta y el reemplazo transaccional de asignaciones, validando sede, servicios activos y ausencia de duplicados.
- [x] Bloquear el retiro si hay sesiones activas que usan el servicio o turnos `PENDIENTE`, `LLAMADO` o `EN_ATENCION` de la sede, incluidos días anteriores; garantizar que un rechazo no produzca modificaciones parciales.
- [x] Coordinar el reemplazo con las operaciones que crean sesiones o turnos para evitar que una asignación se retire entre validación y escritura mediante bloqueo transaccional de la sede.
- [x] Exponer consulta y reemplazo de asignaciones al Administrador mediante rutas autenticadas; preservar la edición preexistente de autorización del router administrativo.
- [x] Extender creación, edición y consulta de módulos con el indicador de prioridad, validando el tipo del dato recibido y bloqueando cambios con sesiones activas.
- [x] Documentar los contratos administrativos en Swagger e incluir pruebas de asignación, retiro bloqueado, errores de IDs y clasificación de módulos.

## B — Servicios disponibles en emisión, sesiones y transferencia

**Dependencia:** A. **Resultado:** Solo se operan servicios habilitados para la sede correspondiente. Cubre RF-6 a RF-8, RF-10, RF-15 y RF-16.

- [x] Reutilizar la consulta de asignaciones para devolver únicamente servicios activos de la sede en la configuración pública; devolver `services: []` cuando no haya disponibles.
- [x] Validar disponibilidad del servicio al emitir el turno y rechazar una sede sin servicios con un mensaje específico, sin persistir un turno inválido.
- [x] Permitir emitir prioritarios sin módulos prioritarios configurados o con sesión activa; conservar las demás validaciones de emisión.
- [x] Extender las opciones operativas con el tipo del módulo y los servicios disponibles por sede; documentar el contrato para su posterior consumo por frontend.
- [x] Validar al iniciar sesión que todos los servicios seleccionados estén activos y asignados a la sede del módulo, antes de reemplazar la sesión anterior.
- [x] Validar el destino de transferencia contra las asignaciones de la sede; conservar prioridad, trazabilidad y consistencia entre la relación `service` y `serviceId`.
- [x] Actualizar Swagger y pruebas de configuración vacía, servicios de otra sede, sesión inválida, emisión sin módulo prioritario y transferencia válida/inválida.

El endpoint de opciones conserva temporalmente `services` para clientes frontend existentes y expone `servicesByHeadquarter` para seleccionar servicios por sede. El backend rechaza las selecciones no asignadas; la interfaz nueva debe consumir la respuesta agrupada por sede.

## C — Despacho exclusivo y concurrente

**Dependencia:** B. **Resultado:** Cada módulo llama únicamente su clase de turno sin asignaciones duplicadas. Cubre RF-11 a RF-14 y RF-17.

- [x] Filtrar la cola operativa por sede, servicios de sesión, día operativo y prioridad admitida por el módulo.
- [x] Sustituir la precedencia cruzada de prioritarios sobre generales por FIFO (`createdAt`, desempate por `id`) dentro de cada cola elegible.
- [x] Hacer coincidir la cola y el conteo de `estado-actual` con los criterios de despacho.
- [x] Reclamar el siguiente turno dentro de una transacción con bloqueo de fila; actualizar estado, asesor y módulo antes del commit.
- [x] Serializar solicitudes simultáneas de la misma sesión y comprobar nuevamente que no tenga turno activo, además de proteger el reclamo entre módulos distintos.
- [x] Mantener la trazabilidad del llamado y emitir eventos solo después de confirmar la asignación; no anunciar una operación revertida.
- [x] Agregar pruebas de exclusividad, cola vacía sin recurrir a la otra prioridad, orden FIFO y llamados concurrentes de uno y varios módulos. Las pruebas concurrentes usan mocks; no sustituyen la verificación MySQL de E.

**Verificación C:** Suite focalizada `turno-queue` + `turno-realtime`: 52 pruebas aprobadas. Suite completa `pnpm test`: 101 aprobadas. `npx tsc --noEmit`, `pnpm build` y `git diff --check`: aprobados. Sin verificación concurrente MySQL; queda pendiente para E con una base de pruebas acordada.

## D — Posiciones, espera y tiempo real

**Dependencia:** C. **Resultado:** Las consultas y notificaciones reflejan las nuevas colas. Cubre RF-17 y la adaptación de reglas existentes del plan.

- [x] Calcular cobertura a partir de los servicios asignados a la sede y los módulos/sesiones de la misma clase de prioridad.
- [x] Adaptar posición y espera en emisión y consulta del ticket para excluir turnos y asesores de la prioridad opuesta; conservar cobertura entre servicios dentro de una misma prioridad.
- [x] Adaptar los recálculos de Socket.IO ante emisión, llamado, transferencia y cambios de sesiones/configuración, considerando las colas afectadas.
- [x] Revisar la consulta de próximos turnos de TV para que no reutilice la antigua precedencia global como orden de despacho entre colas independientes; conservar los campos públicos existentes.
- [x] Mantener totales por sede y total de prioritarios sin exponer datos adicionales del paciente.
- [x] Agregar pruebas de posiciones y eventos para ambas prioridades, cobertura completa/parcial y ausencia de sesiones compatibles.

**Contrato D:** `upcomingTurns` conserva sus campos y límite de cinco, pero su orden cronológico es solo una referencia visual; las colas general y prioritaria no comparten un orden de despacho global. `estimatedWaitMinutes` puede ser `null` cuando no haya asesores activos de la prioridad compatibles; la posición sigue disponible.

**Verificación D:** `pnpm test`: 102 pruebas aprobadas. `npx tsc --noEmit`, `pnpm build` y `git diff --check`: aprobados. Sin cambios de esquema ni dependencias.

## E — Verificación y entrega backend

**Dependencia:** A–D.

- [x] Incluir las nuevas pruebas en el comando existente si se crean archivos que no estén enumerados en `pnpm test`; el script incluye las pruebas de turnos nuevas.
- [x] Ejecutar pruebas focalizadas, `pnpm test`, `npx tsc --noEmit` y `pnpm build`; registrar resultados exactos.
- [x] Consultar `pnpm m:show` y registrar el estado o el impedimento de conexión; no ejecutar migraciones contra un entorno no acordado.
- [ ] Verificar `up`/`down` en una base MySQL de pruebas acordada, comprobando asignaciones vacías y clasificación general inicial sin borrar turnos existentes.
- [ ] Verificar concurrencia con conexiones independientes en MySQL: dos módulos no reciben el mismo turno y dos llamadas simultáneas de una sesión no dejan dos turnos activos; un mock por sí solo no acredita este criterio.
- [x] Documentar contratos API, orden de migración/configuración inicial y resultados de verificación para la etapa frontend posterior.
- [x] Revisar el diff final y confirmar ausencia de dependencias nuevas y modificaciones ajenas al alcance; se preservaron los cambios staged previos, incluido el ajuste preexistente de autorización.

**Verificación E local:** Suite focalizada de turnos: 89 pruebas aprobadas. `pnpm test`: 102 aprobadas. `npx tsc --noEmit`, `pnpm build` y `git diff --check`: aprobados. No se agregaron dependencias; el único cambio a `package.json` enumera los archivos de prueba existentes.

**Estado MySQL:** `pnpm m:show` conectó y reportó aplicada la migración previa `176 CreateTurnosModule1793892000000`; `AddSiteServicesAndModulePriority1794590000000` aparece pendiente. No se ejecutó `up` ni `down`, porque todavía no se acordó una base de pruebas; la verificación independiente de concurrencia también queda pendiente.

**Orden de despliegue/configuración:** En el entorno autorizado, ejecutar la migración 005 una sola vez; después, asignar manualmente al menos un servicio a cada sede desde administración y clasificar los módulos (los existentes quedan generales por defecto). Las sedes sin servicios asignados no podrán emitir turnos; las colas prioritarias permanecerán pendientes hasta que haya un módulo prioritario activo.

**Corrección de contrato (E):** Los indicadores booleanos de `turnos_modulos`, `turnos_sedes_config` y `turnos_sesiones_atencion` se declaran como columna `boolean`, no `tinyint`. Con `tinyint`, TypeORM hidrataba `0`/`1` y la API respondía `isPriority: 0`, que el frontend rechaza por tipo; además `validateEntity` fallaba con «must be a boolean value» al editar un módulo o guardar la configuración de sede. En MySQL `boolean` es `tinyint(1)`, por lo que no requiere migración adicional. Prueba de regresión: `src/modules/turnos/__tests__/turno-boolean-flags.test.ts` verifica la hidratación real con el driver y la validación de entidades cargadas.

**Verificación posterior a la corrección:** `pnpm test`: 104 pruebas aprobadas. `npx tsc --noEmit` y `pnpm build`: aprobados. Frontend: ESLint de Turnos y modelos sin diagnósticos y `pnpm build` aprobado.

## Unidades de revisión y reversión

Se prevé superar 400 líneas modificadas en total. Preparar entregas encadenadas A → B → C → D, con pruebas y Swagger en cada unidad; E verifica el conjunto. Si una unidad excede 400 líneas, dividirla por comportamiento completo antes de preparar su PR. No publicar unidades intermedias como funcionalidad terminada.

Registrar por unidad el comando de prueba focalizada, su resultado exacto y la comprobación de ejecución. Las pruebas MySQL pendientes deben quedar identificadas como pendientes, nunca como aprobadas por mocks.

- **A:** Reversión de administración y esquema nuevo; retirar primero los consumidores B–D. El `down` elimina asignaciones y clasificación configuradas, por lo que requiere preservar esos datos antes de aplicarlo.
- **B:** Reversión de filtrado y validaciones por sede, conservando el esquema de A.
- **C:** Reversión conjunta de despacho y cola operativa; D depende de esta separación y debe revertirse antes.
- **D:** Reversión de posiciones y eventos adaptados, sin borrar turnos ni asignaciones.

## Decisiones que deben resolverse antes de modificar comportamientos adicionales

- Cambio de clasificación de un módulo con sesión o turno activo: acordar la política antes de introducir restricciones o cambiar una atención en curso.
- Presentación del orden combinado de próximos turnos en TV y del estimado sin asesores compatibles: documentar el contrato propuesto sin atribuir un orden global a colas independientes ni presentar una espera garantizada.
