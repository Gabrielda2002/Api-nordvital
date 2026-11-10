# Turnos públicos: contrato para frontend

Actualizado: 2026-11-10. Prefijo: `/api/v1/turnos`. Las rutas siguientes no
requieren sesión institucional. El día operativo es `America/Bogota`.

## Solicitar y recuperar un ticket

### Configuración

`GET /sedes/:slug/config` devuelve:

```json
{
  "headquarter": { "id": 1, "name": "Sede principal", "slug": "principal", "address": "Dirección" },
  "geo": { "latitude": 7.9, "longitude": -72.5, "geoRadiusMeters": 150 },
  "averageServiceMinutes": 10,
  "services": [{ "id": 2, "name": "Servicio" }],
  "documentTypes": [{ "id": 1, "name": "CC" }]
}
```

404: sede inexistente o deshabilitada.

### Identificación

`POST /pacientes/verificar`, cuerpo obligatorio:

```json
{ "documentNumber": "123456", "documentType": 1 }
```

200: `{ exists, patient, activeTurn }`.

- `patient`: `{ id, fullName, documentNumber, phoneNumber, documentTypeId, documentType }`, o `null`.
- `activeTurn`: `{ ticketToken, ticketCode, status, serviceName, headquarterName }`, o `null`.
- `documentType` del cuerpo es el ID numérico; el de `patient` es el nombre del tipo.
- Si hay turno activo del día en cualquier sede o servicio, abrir su ticket.
- Los datos del paciente existente son de solo lectura.
- 400: documento ausente o tipo inválido.

### Emisión

`POST /ticket`, cuerpo:

```json
{
  "slug": "principal",
  "serviceId": 2,
  "documentNumber": "123456",
  "documentTypeId": 1,
  "name": "Nombre del paciente",
  "phoneNumber": "3000000000",
  "priority": "GENERAL",
  "userLatitude": 7.9,
  "userLongitude": -72.5
}
```

Obligatorios: `slug`, `serviceId`, `documentNumber`, `documentTypeId`, `name`,
`phoneNumber` y coordenadas salvo excepción de desarrollo. `priority` es opcional,
`GENERAL` por defecto; la otra opción es `PRIORITARIO`. Nombre y teléfono no
actualizan a un paciente existente.

201 devuelve `{ token, ticketCode, priority, dailyNumber, status, aheadCount,
estimatedWaitMinutes, headquarter: { id, name }, service: { id, name }, createdAt }`.
**La emisión usa `token`; la consulta y recuperación usan `ticketToken`.**

409 devuelve `{ message, activeTicket: { ticketToken, ticketCode, status,
serviceName, headquarterName } }`: recuperar ese ticket, no repetir la emisión.
400: entrada inválida o coordenadas faltantes; 403: fuera del radio o intento de
omisión fuera de desarrollo; 404: sede/servicio inválido.

### Pruebas sin ubicación

Con backend iniciado con `NODE_ENV=development`, agregar `"skipGeolocation": true`
al cuerpo de emisión; se pueden omitir ambas coordenadas. Sin ese campo, se exige
ubicación y geocerca incluso en desarrollo. En producción, testing o staging,
`skipGeolocation: true` devuelve 403. El botón del frontend debe existir únicamente
cuando `import.meta.env.DEV` sea verdadero; nunca habilita la excepción del servidor
por sí mismo.

## Ticket, cancelación y encuesta

`GET /ticket/:token` devuelve `{ ticketCode, ticketToken, status, priority,
dailyNumber, callCount, headquarter: { id, name }, service: { id, name },
patient: { name, documentNumber }, modulo: { id, code, name } | null,
advisorName, aheadCount, estimatedWaitMinutes, calledAt, startedAt, finishedAt,
hasSurvey, createdAt }`. Fechas como cadenas JSON; marcas no registradas son
`null`. Token inexistente: 404.

`POST /ticket/:token/cancelar`: sin cuerpo o `{ "reason": "Motivo opcional" }`.
Solo admite `PENDIENTE` o `LLAMADO`; 200 devuelve `{ message, ticketCode,
status: "CANCELADO" }`. 404: no existe; 409: estado no permitido o inicio de
atención que ganó la carrera. El frontend pide confirmación antes de enviarlo.

`POST /ticket/:token/encuesta`: `{ "rating": 5, "comment": "Comentario opcional" }`.
Rating obligatorio de 1 a 5; solo turno `FINALIZADO`, una respuesta por turno.
201: `{ message, rating }`; 400: turno no finalizado/calificación inválida;
404: token inexistente; 409: encuesta registrada.

## TV y eventos en vivo

`GET /tv/:slug/estado` devuelve `{ headquarter: { id, name, slug }, activeTurns }`.
Cada turno: `{ turnoId, ticketCode, priority, status, moduloCode, moduloName,
advisorName, serviceName, calledAt }`. Estados: `LLAMADO` o `EN_ATENCION`;
máximo 10 ordenados por último llamado. Sede inválida: 404.

Conectar Socket.IO al origen del backend, sin `/api/v1`, y enviar
`join` con el nombre de sala. El servidor actual no confirma la suscripción.

| Sala | Evento | Propósito |
|---|---|---|
| `ticket_${token}` | `ticket:llamado`, `ticket:rellamado` | Avisar al paciente del módulo asignado. |
| `ticket_${token}` | `ticket:actualizado` | Estado o posición/estimación actualizados. |
| `sede_${id}_tv` | `turno:llamado`, `turno:rellamado` | Destacar y anunciar por voz. |
| `sede_${id}_tv` | `turno:actualizado` | Actualizar a atención sin repetir el anuncio. |
| `sede_${id}_tv` | `turno:retirado` | Eliminar turno finalizado, ausente, transferido o cancelado. |
| `sede_${id}` | `cola:actualizada` | Métricas diarias de espera de toda la sede. |

- Llamado/rellamado: `{ turnoId, ticketCode, ticketToken, priority, moduloCode,
  moduloName, userName, serviceName, callCount, calledAt }`.
- Ticket actualizado: `{ turnoId, ticketToken, ticketCode, status, updatedAt }`,
  con `moduloCode`, `moduloName`, `aheadCount`, `estimatedWaitMinutes` opcionales.
  No sustituir campos ausentes por ceros o valores vacíos.
- TV actualizado/retirado: `{ turnoId, ticketCode, status, headquarterId,
  updatedAt }`, con `moduloCode`, `moduloName` opcionales.
- Cola: `{ headquarterId, pendingCount, priorityPendingCount, updatedAt }`;
  `lastCalledCode` es opcional.

Después de persistir, se recalculan tickets al emitir, llamar, transferir o cancelar,
y al iniciar/reemplazar/cerrar sesiones. La TV recibe cierres y comienzo de atención.
Una transferencia puede cambiar el servicio: consultar el ticket completo para
recuperar sus datos. Cargar HTTP al entrar, reconectar y volver a la pestaña;
reincorporarse a salas al reconectar. Los eventos no son un historial durable ni
eliminan por sí solos la ventana entre snapshot y suscripción. Conservar indicador
de desactualización hasta completar la sincronización y permitir reintento.
No depender de polling permanente (límite global: 250 solicitudes/minuto/IP).

## Pendiente que impide cerrar el alta pública

Un paciente nuevo requiere campos obligatorios adicionales en `Pacientes`:
correo, dirección, convenio, IPS primaria y estado. El alta mínima continúa
rechazando registros incompletos; no se inventan datos ni se modifica el esquema.
Resolver esta decisión antes de considerar listo el flujo de pacientes nuevos.

Pruebas automatizadas: 64 aprobadas, incluidas 24 nuevas. Tipos, build y consulta
de migraciones aprobados. Concurrencia y eventos probados con dobles de prueba;
pendiente verificación MySQL/Socket.IO real en entorno aislado.
