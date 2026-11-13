# Spec backend 004 — Gestión operativa de turnos

**Estado:** Borrador para aprobación.

## Objetivo

Proveer acceso autorizado y operaciones seguras para que Administrador y Radicador gestionen turnos desde una sesión activa de atención.

## Alcance

- Autorizar las rutas de atención únicamente para Administrador y Radicador.
- Proveer a esos roles las opciones operativas necesarias para iniciar sesión con un módulo y servicios activos.
- Devolver la sesión activa, el turno actual y la cola pendiente filtrada por sede y servicios de la sesión.
- Proteger las acciones para que solo afecten el turno activo del usuario.
- Validar transferencia a un servicio activo de la misma sede.
- Exigir motivo para cancelar el turno actual llamado o en atención.
- Impedir cerrar la sesión mientras haya un turno llamado o en atención.

## Criterios de aceptación (EARS)

- **RF-1:** CUANDO un usuario con rol Administrador o Radicador invoque una ruta de atención, EL SISTEMA permitirá continuar la autorización.
- **RF-2:** SI un usuario con otro rol invoca una ruta de atención, ENTONCES EL SISTEMA responderá con acceso denegado.
- **RF-3:** CUANDO un usuario autorizado consulte las opciones de sesión, EL SISTEMA devolverá módulos activos y servicios activos para iniciar atención.
- **RF-4:** CUANDO se consulte el estado actual de una sesión activa, EL SISTEMA devolverá los turnos pendientes del día operativo de la sede filtrados por los servicios asociados a esa sesión.
- **RF-5:** CUANDO se devuelva un turno pendiente, EL SISTEMA incluirá código, nombre del paciente, nombre del servicio, prioridad y tiempo de espera en minutos.
- **RF-6:** CUANDO se devuelva la cola, EL SISTEMA ordenará sus turnos con el mismo criterio de prioridad y antigüedad que usa el despacho del siguiente turno.
- **RF-7:** SI no hay sesión activa, ENTONCES EL SISTEMA no devolverá una cola de sesión y conservará el contrato de ausencia de sesión existente.
- **RF-8:** CUANDO un usuario ejecute una acción con un turno objetivo, EL SISTEMA verificará que ese turno sea su turno activo asignado antes de cambiar su estado.
- **RF-9:** CUANDO un usuario transfiera su turno activo, EL SISTEMA aceptará únicamente un servicio activo distinto del servicio actual dentro del contexto de sede de la sesión.
- **RF-10:** SI una transferencia apunta a un servicio inactivo, ENTONCES EL SISTEMA rechazará la operación sin modificar el turno.
- **RF-11:** CUANDO un usuario cancele su turno llamado o en atención, EL SISTEMA exigirá un motivo no vacío y lo guardará en la trazabilidad.
- **RF-12:** SI la cancelación no incluye un motivo, ENTONCES EL SISTEMA rechazará la operación sin cambiar el estado del turno.
- **RF-13:** SI el usuario intenta cerrar la sesión con un turno llamado o en atención, ENTONCES EL SISTEMA impedirá el cierre.
- **RF-14:** CUANDO una operación aceptada modifique el turno o la cola, EL SISTEMA conservará las notificaciones en tiempo real y la trazabilidad existentes.

## Restricciones

- Mantener la zona y el rango del día operativo existentes.
- Reutilizar la prioridad y orden FIFO implementados en `TurnoQueueService`.
- La consulta de cola solo expondrá los campos acordados; no incluirá documento del paciente ni token del ticket.
- No agregar cambios de esquema ni dependencias salvo que la implementación aprobada demuestre que son necesarios.

## Fuera de alcance

- Cambiar el algoritmo de priorización o despacho.
- Añadir selección manual de turnos para llamar.
- Cambiar las rutas o la operación pública de solicitud de turnos.
- Crear reportes nuevos.
