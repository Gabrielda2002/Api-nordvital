# Spec backend 005 — Servicios por sede y colas prioritarias

**Estado:** Aprobada por el usuario.

## Objetivo

Permitir que cada sede configure manualmente sus servicios y que cualquier módulo que atienda un servicio llame primero los turnos prioritarios. Conservar con cada nuevo turno público la clasificación del trámite elegida por el paciente.

## Alcance

- Administrar los servicios habilitados para turnos en cada sede.
- Exponer en la configuración pública de cada sede únicamente sus servicios habilitados y activos.
- Impedir la emisión de turnos cuando la sede no tenga servicios habilitados o el servicio solicitado no pertenezca a ella.
- Atender turnos generales y prioritarios desde los mismos módulos, sin tipo exclusivo de atención.
- Limitar la selección de servicios de una sesión a los habilitados para la sede del módulo.
- Despachar prioritarios antes que generales entre los servicios de la sesión y conservar FIFO dentro de cada prioridad.
- Guardar la clasificación Asignación de Citas, Confirmación de Citas o Trámites Administrativos con cada nuevo turno público, sin filtrar servicios por clasificación.
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
- **RF-9:** CUANDO un Administrador consulte, cree o actualice un módulo, EL SISTEMA gestionará el módulo sin un tipo exclusivo de prioridad.
- **RF-10:** CUANDO se inicie una sesión, EL SISTEMA aceptará únicamente servicios activos asignados a la sede del módulo seleccionado.
- **RF-11:** CUANDO un módulo solicite el siguiente turno, EL SISTEMA considerará turnos generales y prioritarios de los servicios de su sesión.
- **RF-12:** CUANDO existan turnos prioritarios elegibles, EL SISTEMA los despachará antes que los generales elegibles aunque hayan llegado después.
- **RF-13:** CUANDO varios módulos soliciten turnos simultáneamente, EL SISTEMA impedirá asignar un mismo turno a más de un módulo.
- **RF-14:** CUANDO dos turnos elegibles tengan la misma prioridad, EL SISTEMA despachará primero el de mayor antigüedad con desempate por su identificador.
- **RF-15:** SI no hay asesores activos para el servicio, ENTONCES EL SISTEMA permitirá emitir turnos y devolverá la espera estimada como no disponible.
- **RF-16:** SI se transfiere un turno a un servicio no asignado a su sede o inactivo, ENTONCES EL SISTEMA rechazará la transferencia sin cambiar el servicio ni el estado del turno.
- **RF-17:** CUANDO se actualicen servicios de sede, módulos o turnos, EL SISTEMA conservará la trazabilidad y notificaciones existentes que correspondan a la operación.
- **RF-18:** CUANDO se consulte o notifique la posición de un turno, EL SISTEMA contará los prioritarios primero y luego los generales según la cobertura de servicios existente.
- **RF-19:** CUANDO se emita un turno público, EL SISTEMA guardará la clasificación seleccionada entre Asignación de Citas, Confirmación de Citas y Trámites Administrativos.
- **RF-20:** SI falta una clasificación válida en una emisión pública, ENTONCES EL SISTEMA rechazará la solicitud antes de guardar el turno.
- **RF-21:** CUANDO se consulte un ticket, EL SISTEMA devolverá su clasificación guardada o su ausencia para turnos anteriores al cambio.
- **RF-22:** CUANDO se seleccione cualquiera de las tres clasificaciones, EL SISTEMA mantendrá los mismos servicios habilitados para la sede.

## Restricciones

- La prioridad del turno seguirá siendo la indicada al emitirlo; no dependerá del módulo ni de la clasificación del trámite.
- La configuración inicial de servicios por sede será manual y no copiará automáticamente el catálogo global.
- Los turnos históricos podrán carecer de clasificación; no se inferirá una clasificación para ellos.
- No se realizarán cambios en el frontend dentro de esta unidad backend.

## Fuera de alcance

- Reasignar automáticamente servicios o módulos existentes.
- Asignar manualmente un turno a un módulo específico.
- Cambiar el flujo de geolocalización, identificación del paciente o reglas de prioridad clínica.
- Implementar la interfaz de administración o modificar la interfaz pública; se abordará en la unidad frontend posterior.
