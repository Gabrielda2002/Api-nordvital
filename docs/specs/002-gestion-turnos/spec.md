# Spec: 002 - Sistema de Gestión de Turnos (Digiturno)

## 1. Contexto y Propósito

Nordvital IPS requiere modernizar y unificar su sistema de asignación y gestión de turnos para salas de atención presencial, reemplazando la solución heredada monolítica ("Digiturno 4.1.1" en Python/Flask con base de datos local y dependencias de escritorio) por un módulo nativo, centralizado y seguro dentro del ecosistema `api-nordvital` y la aplicación web unificada.

El sistema debe operar bajo una política institucional de cero papel (100% digital, sin impresoras térmicas ni drivers locales), permitiendo a los pacientes tomar su turno desde dispositivos móviles al escanear un código QR en la sede física con validación de proximidad geográfica, dar seguimiento en tiempo real a su estado y turno en pantalla, y permitir a los asesores gestionar las colas de manera dinámica según los servicios habilitados en cada ventanilla o módulo de atención.

---

## 2. Alcance

### Dentro del alcance
- Toma de turno pública y móvil mediante lectura de código QR asociado a la sede.
- Validación de presencia física en sede mediante geolocalización del navegador (radio permitido <= 150 metros).
- Identificación y registro básico del paciente (tipo y número de documento, nombre completo y teléfono móvil).
- Selección de servicio institucional disponible y clasificación de prioridad (General vs. Prioritario / Ley 1171).
- Generación y consulta de ticket digital seguro con token único, posición en cola y tiempo estimado de espera.
- Notificaciones y actualización de eventos en tiempo real mediante Socket.IO (salas segmentadas por sede y pantallas de sala).
- Panel de gestión para asesores autenticados con asignación dinámica de módulo y servicios atendidos.
- Máquina de estados formal del turno: `PENDIENTE`, `LLAMADO`, `EN_ATENCION`, `FINALIZADO`, `NO_ASISTIO`, `CANCELADO`, `TRANSFERIDO`.
- Acciones de atención: Llamar siguiente, Rellamar, Iniciar atención, Finalizar atención, Marcar no asistió, Transferir de servicio.
- Vista de pantalla de sala de espera (TV) sincronizada por Socket.IO con soporte de anuncio por voz (Web Speech API).
- Encuesta de satisfacción NPS post-atención (calificación de 1 a 5 estrellas con comentario opcional).
- Métricas operativas y registro de trazabilidad temporal de cada etapa del turno (`TurnoTracking`).

### Fuera de alcance
- Impresión física en papel térmico o integración con impresoras locales de tickets.
- Servicios o binarios de escritorio locales para Windows (WinSW, instaladores locales).
- Agendamiento de citas médicas programadas previas (módulo exclusivo de atención espontánea en sala).
- Facturación, copagos o integración con pasarelas de pago.
- Modificación de historias clínicas o módulos asistenciales externos.

---

## 3. Requisitos Funcionales (EARS)

- **RF-1**: EL SISTEMA mantendrá la secuencia numérica correlativa diaria de turnos por sede y tipo de servicio, reiniciando los contadores a las 00:00 horas de cada día.
- **RF-2**: CUANDO un paciente solicita la configuración de una sede mediante su slug público (`GET /turnos/sedes/:slug/config`), EL SISTEMA retornará los servicios activos, módulos operativos y las coordenadas geográficas de la sede.
- **RF-3**: SI la posición geográfica reportada por el dispositivo del paciente supera el radio de tolerancia configurado (150 metros) respecto a la sede, ENTONCES EL SISTEMA denegará la emisión del turno indicando que el paciente debe encontrarse físicamente en las instalaciones de la sede.
- **RF-4**: CUANDO un paciente envía su número y tipo de documento para verificación (`POST /turnos/pacientes/verificar`), EL SISTEMA buscará el registro existente del paciente retornando sus datos básicos si existe o solicitando su registro si es nuevo.
- **RF-5**: CUANDO un paciente confirma el servicio y su condición de atención (`POST /turnos/ticket`), EL SISTEMA generará un nuevo turno en estado `PENDIENTE`, asignará el código alfanumérico secuencial correspondiente y retornará un token de acceso seguro para consulta del ticket digital.
- **RF-6**: MIENTRAS un turno permanezca en estado `PENDIENTE`, EL SISTEMA recalculará en tiempo real la cantidad de turnos precedentes y el tiempo estimado de espera cuando se consulte el estado del ticket (`GET /turnos/ticket/:token`).
- **RF-7**: CUANDO un asesor autenticado inicia sesión en un módulo físico (`POST /turnos/atencion/sesion/iniciar`), EL SISTEMA registrará la sesión activa y vinculará los servicios que el asesor atenderá durante dicha jornada.
- **RF-8**: CUANDO un asesor solicita llamar al siguiente paciente (`POST /turnos/atencion/accion` con acción `LLAMAR`), EL SISTEMA seleccionará el turno más antiguo priorizando los turnos prioritarios sobre los generales dentro de los servicios asignados a la sesión del asesor, actualizará su estado a `LLAMADO` y registrará el evento de tracking.
- **RF-9**: CUANDO un turno pasa a estado `LLAMADO`, EL SISTEMA emitirá un evento en tiempo real vía Socket.IO a las salas de la sede (`sede_:id`) y de pantallas TV (`sede_:id:tv`) con el código del turno y el módulo asignado.
- **RF-10**: CUANDO el asesor solicita rellamar al paciente actual (`POST /turnos/atencion/accion` con acción `RELLAMAR`), EL SISTEMA retransmitirá el evento en tiempo real a las pantallas de sala incrementando el contador de llamados sin alterar el turno de la cola.
- **RF-11**: CUANDO el asesor confirma el inicio de la consulta (`POST /turnos/atencion/accion` con acción `INICIAR`), EL SISTEMA transicionará el estado a `EN_ATENCION` y registrará la marca de tiempo exacta de inicio.
- **RF-12**: SI el paciente no acude tras los llamados reglamentarios y el asesor selecciona marcar abandono (`POST /turnos/atencion/accion` con acción `NO_ASISTIO`), ENTONCES EL SISTEMA transicionará el estado a `NO_ASISTIO`, liberará el módulo y registrará la marca de tiempo de cierre.
- **RF-13**: CUANDO el asesor da por terminada la consulta (`POST /turnos/atencion/accion` con acción `FINALIZAR`), EL SISTEMA transicionará el estado a `FINALIZADO`, registrará el tiempo total de atención y habilitará el token del ticket para responder la encuesta NPS.
- **RF-14**: DONDE un paciente deba ser atendido por un servicio complementario, EL ASESOR podrá transferir el turno (`POST /turnos/atencion/accion` con acción `TRANSFERIR`), y EL SISTEMA moverá el turno a la cola del nuevo servicio manteniendo su identificador e historial de trazabilidad.
- **RF-15**: SI un paciente intenta responder la encuesta de satisfacción (`POST /turnos/ticket/:token/encuesta`) para un turno que no esté en estado `FINALIZADO` o que ya cuente con encuesta registrada, ENTONCES EL SISTEMA rechazará la solicitud devolviendo un código 400 Bad Request o 409 Conflict.
- **RF-16**: CUANDO un paciente envía una calificación válida de 1 a 5 estrellas junto con su comentario opcional, EL SISTEMA persistirá la encuesta vinculada al turno, módulo y asesor que prestó la atención.

### Integración pública aprobada — 2026-11-10

- **RF-17**: CUANDO se consulte la configuración pública de una sede habilitada, EL SISTEMA incluirá los tipos de documento activos.
- **RF-18**: EL SISTEMA identificará al paciente por la combinación de tipo y número de documento.
- **RF-19**: SI el paciente ya existe, ENTONCES EL SISTEMA conservará sus datos durante la emisión del turno.
- **RF-20**: SI el paciente tiene un turno activo del día, ENTONCES EL SISTEMA rechazará una nueva emisión en cualquier sede o servicio con el ticket recuperable.
- **RF-21**: EL SISTEMA impedirá que solicitudes concurrentes de emisión creen dos turnos activos diarios para el mismo paciente.
- **RF-22**: EL SISTEMA excluirá los turnos de días anteriores de la validación de turno activo diario.
- **RF-23**: DONDE el entorno sea desarrollo, EL SISTEMA permitirá omitir la ubicación mediante una solicitud explícita.
- **RF-24**: DONDE el entorno no sea desarrollo, EL SISTEMA rechazará la omisión de ubicación.
- **RF-25**: CUANDO cambie una cola, EL SISTEMA actualizará posición y espera estimada de sus tickets pendientes del día.
- **RF-26**: CUANDO cambie la cantidad de sesiones activas de atención de un servicio, EL SISTEMA actualizará las estimaciones de sus tickets pendientes.
- **RF-27**: CUANDO un turno llamado pase a atención, EL SISTEMA notificará su estado a la TV de la sede.
- **RF-28**: CUANDO un turno deje de estar llamado o en atención, EL SISTEMA notificará su retiro a la TV de la sede.
- **RF-29**: MIENTRAS el turno esté pendiente o llamado, EL SISTEMA permitirá su cancelación pública mediante el token.
- **RF-30**: SI el turno tiene otro estado, ENTONCES EL SISTEMA rechazará la cancelación pública.

La confirmación visual de cancelación corresponde al frontend. El cambio de día
operativo se calcula en la zona `America/Bogota`, tanto para consultas como eventos.

**Bloqueo preexistente:** el alta mínima de un paciente nuevo requiere acordar
cómo completar los campos obligatorios del registro compartido (correo, dirección,
convenio, IPS primaria y estado). Esta corrección no inventa valores ni modifica
el esquema de pacientes.

---

## 4. Criterios de Aceptación y Verificación

1. **Generación de Ticket con Geolocalización**:
   - Paciente dentro del radio de 150m genera ticket digital con éxito (código 201 Created) y recibe código único y token de seguimiento.
   - Paciente fuera del radio de 150m recibe código 403 Forbidden con mensaje de rechazo por proximidad geográfica.
2. **Priorización de Atención**:
   - Al llamar siguiente, un turno `Prioritario` siempre es seleccionado antes que un turno `General`, sin importar que el general haya ingresado antes.
   - Entre turnos de la misma prioridad, se despacha en estricto orden FIFO (First-In, First-Out).
3. **Consistencia de la Máquina de Estados**:
   - Solo se permite la transición `PENDIENTE` -> `LLAMADO` -> `EN_ATENCION` -> `FINALIZADO`.
   - La acción `NO_ASISTIO` solo es válida desde el estado `LLAMADO`.
   - No se pueden ejecutar acciones sobre un turno ya `FINALIZADO` o `NO_ASISTIO`.
4. **Sincronización en Tiempo Real**:
   - Al ejecutar `LLAMAR` o `RELLAMAR`, las pantallas conectadas al canal Socket.IO reciben la carga del evento en menos de 500 ms con datos de turno, módulo y asesor.
5. **Trazabilidad y Encuesta**:
   - Cada transición de estado genera un registro inmutable en `turno_tracking` con timestamp y usuario responsable.
   - La encuesta solo permite registrarse una vez por turno completado.
