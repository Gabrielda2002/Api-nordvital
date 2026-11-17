# Alta mínima de pacientes desde turnos

**Estado:** Implementado. Backend y ajuste mínimo de compatibilidad en el frontend; la validación de los formularios no cambia.

## Objetivo

Emitir un turno para una persona nueva sin inventar correo, dirección, convenio ni IPS primaria. Estos datos quedarán pendientes de completar mediante los flujos habituales.

## Criterios de aceptación

- **RF-1:** Al emitir un turno para una identidad nueva, crear un paciente con tipo y número de documento, nombre, celular y estado activo; validar estos datos.
- **RF-2:** Guardar correo, dirección, convenio e IPS primaria como `null`, sin correos ficticios ni asociaciones a entidades reales por defecto.
- **RF-3:** Conservar la búsqueda por tipo y número de documento, la transacción y los bloqueos existentes; no modificar datos de pacientes ya registrados.
- **RF-4:** Mantener obligatorios los campos del registro y edición completos; permitir completar un registro mínimo con el formulario habitual.
- **RF-5:** Las lecturas y reportes backend deberán tolerar la ausencia de convenio e IPS, sin ocultar pacientes mediante joins internos ni fabricar datos.
- **RF-6:** La migración conservará pacientes, turnos y claves foráneas. La reversión se bloqueará mientras existan valores nulos, sin eliminar registros ni rellenarlos artificialmente.
- **RF-7:** Las vistas frontend de pacientes deberán tolerar `null` en correo, dirección, convenio e IPS, mostrando un valor pendiente o un campo vacío, sin relajar la obligatoriedad de los formularios.

## Fuera de alcance

Cambios en la obligatoriedad o estructura de los formularios frontend, nuevos controladores, dependencias, ejecución de migraciones, cambios de autenticación y valores predeterminados de catálogos. En frontend solo se admite tolerancia a `null` en las lecturas existentes.
