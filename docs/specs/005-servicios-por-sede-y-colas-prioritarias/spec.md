# Spec backend 005 — Servicios por sede y colas prioritarias

**Estado:** Aprobada por el usuario.

## Objetivo

Permitir que cada sede configure manualmente sus servicios y separar la atención de turnos generales y prioritarios por tipo de módulo.

## Alcance

- Administrar los servicios habilitados para turnos en cada sede.
- Exponer en la configuración pública de cada sede únicamente sus servicios habilitados y activos.
- Impedir la emisión de turnos cuando la sede no tenga servicios habilitados o el servicio solicitado no pertenezca a ella.
- Permitir que los módulos se configuren para atender exclusivamente turnos generales o exclusivamente prioritarios.
- Impedir cambiar el tipo de un módulo mientras tenga una sesión activa.
- Permitir configurar uno o varios módulos prioritarios por sede, sin exigir que haya uno activo para emitir turnos.
- Limitar la selección de servicios de una sesión a los habilitados para la sede del módulo.
- Despachar únicamente turnos de la prioridad correspondiente al tipo de módulo, en orden FIFO dentro de cada cola.
- Validar que las transferencias se dirijan a servicios activos y habilitados en la sede del turno.
- Impedir retirar un servicio de una sede mientras haya una sesión activa que lo atienda o turnos sin resolver asociados a él.
- Mantener las asignaciones de servicios vacías al inicio; el Administrador configurará cada sede manualmente.

## Criterios de aceptación (EARS)

- **RF-1:** CUANDO un Administrador consulte la configuración de servicios de una sede, EL SISTEMA devolverá el catálogo activo y las asignaciones actuales de esa sede.
- **RF-2:** CUANDO un Administrador guarde las asignaciones de servicios de una sede, EL SISTEMA guardará únicamente servicios existentes y activos.
- **RF-3:** SI la solicitud de asignación incluye un servicio repetido, inexistente o inactivo, ENTONCES EL SISTEMA rechazará el cambio sin modificar las asignaciones actuales.
- **RF-4:** SI el Administrador intenta retirar un servicio utilizado por una sesión activa, ENTONCES EL SISTEMA rechazará el cambio sin modificar las asignaciones actuales.
- **RF-5:** SI el Administrador intenta retirar un servicio con turnos pendientes, llamados o en atención, ENTONCES EL SISTEMA rechazará el cambio sin modificar las asignaciones actuales.
- **RF-6:** CUANDO una sede no tenga servicios asignados, EL SISTEMA devolverá una lista vacía de servicios en su configuración pública.
- **RF-7:** SI un usuario solicita un turno para una sede sin servicios asignados, ENTONCES EL SISTEMA rechazará la emisión e informará que la sede no tiene servicios configurados.
- **RF-8:** SI un usuario solicita un servicio inactivo o no asignado a la sede, ENTONCES EL SISTEMA rechazará la emisión del turno.
- **RF-9:** CUANDO un Administrador consulte, cree o actualice un módulo, EL SISTEMA devolverá y persistirá si el módulo atiende turnos generales o prioritarios.
- **RF-10:** CUANDO se inicie una sesión, EL SISTEMA aceptará únicamente servicios activos asignados a la sede del módulo seleccionado.
- **RF-11:** CUANDO un módulo general solicite el siguiente turno, EL SISTEMA solo podrá despachar turnos generales.
- **RF-12:** CUANDO un módulo prioritario solicite el siguiente turno, EL SISTEMA solo podrá despachar turnos prioritarios.
- **RF-13:** CUANDO existan varios módulos prioritarios activos en una sede, EL SISTEMA permitirá que todos atiendan la cola prioritaria sin asignar el mismo turno a más de un módulo.
- **RF-14:** CUANDO haya turnos elegibles para un módulo, EL SISTEMA despachará primero el turno elegible con mayor antigüedad.
- **RF-15:** SI no hay módulos prioritarios configurados o con sesión activa, ENTONCES EL SISTEMA permitirá emitir turnos prioritarios y los mantendrá pendientes hasta que un módulo prioritario pueda atenderlos.
- **RF-16:** SI se transfiere un turno a un servicio no asignado a su sede o inactivo, ENTONCES EL SISTEMA rechazará la transferencia sin cambiar el servicio ni el estado del turno.
- **RF-17:** CUANDO se actualicen servicios de sede, módulos o turnos, EL SISTEMA conservará la trazabilidad y notificaciones existentes que correspondan a la operación.
- **RF-18:** SI un Administrador intenta cambiar el tipo de un módulo con una sesión activa, ENTONCES EL SISTEMA rechazará el cambio sin modificar el módulo.

## Restricciones

- La prioridad del turno seguirá siendo la indicada al emitirlo; el tipo de módulo determinará qué prioridad puede llamar.
- La configuración inicial de servicios por sede será manual y no copiará automáticamente el catálogo global.
- La ausencia de módulos prioritarios no bloqueará la emisión de turnos prioritarios.
- No se realizarán cambios en el frontend dentro de esta unidad backend.

## Fuera de alcance

- Reasignar automáticamente servicios o módulos existentes.
- Asignar manualmente un turno a un módulo específico.
- Cambiar el flujo de geolocalización, identificación del paciente o reglas de prioridad clínica.
- Implementar la interfaz de administración o modificar la interfaz pública; se abordará en la unidad frontend posterior.
