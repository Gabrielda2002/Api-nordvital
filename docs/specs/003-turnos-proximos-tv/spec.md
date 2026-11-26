# Spec: 003 - Contrato y cálculo de próximos turnos de TV

> Prevalece la revisión actual de la spec 005: `upcomingTurns` conserva su
> snapshot cronológico informativo. El despacho, posición y espera consideran
> prioritarios primero y FIFO dentro de cada prioridad, según la cobertura de
> servicios de la sede, sin exclusividad por módulo.

## 1. Contexto y propósito

La API de estado de TV actualmente expone turnos llamados o en atención, pero no
la cola de turnos pendientes. Además, la posición y espera se calculan por
servicio incluso cuando todos los módulos activos pueden atender todos los
servicios. Se requiere exponer el estado necesario para la pantalla y unificar
el conteo únicamente cuando la cobertura de atención lo permita.

## 2. Alcance

### Dentro del alcance

- Incluir en el estado público de TV hasta cinco turnos próximos pendientes,
  ordenados según prioridad y antigüedad.
- Exponer para cada próximo turno únicamente su identificador y código visible.
- Actualizar a los clientes de TV cuando cambie la cola de la sede.
- Calcular posición y espera sobre todos los servicios cuando todos los módulos
  activos atiendan todos los servicios activos.
- Conservar posición y espera por servicio cuando no se cumpla esa cobertura.

### Fuera de alcance

- Cambios en el algoritmo de despacho o las asignaciones de servicios.
- Cambios en la fórmula de espera, duración promedio o cálculo de capacidad.
- Cambios de base de datos, migraciones o dependencias.
- Presentación visual de los datos en la aplicación frontend.

## 3. Requisitos funcionales (EARS)

- **RF-1**: CUANDO se consulte el estado público de TV de una sede habilitada,
  EL SISTEMA incluirá hasta cinco turnos pendientes próximos ordenados por
  prioridad y antigüedad.
- **RF-2**: MIENTRAS un turno se incluya como próximo en el estado de TV, EL
  SISTEMA expondrá únicamente su identificador y código visible.
- **RF-3**: CUANDO cambie la cola de una sede, EL SISTEMA notificará a la sala de
  TV correspondiente para que pueda solicitar un estado actualizado.
- **RF-4**: SI todos los módulos activos de la sede atienden todos los servicios
  activos, ENTONCES EL SISTEMA calculará la posición considerando los turnos
  pendientes de todos esos servicios.
- **RF-5**: SI no todos los módulos activos de la sede atienden todos los
  servicios activos, ENTONCES EL SISTEMA conservará el cálculo de posición por
  servicio.
- **RF-6**: MIENTRAS se calcule la espera estimada, EL SISTEMA conservará la
  duración promedio y la capacidad de asesores aplicables al servicio del turno.
- **RF-7**: CUANDO existan menos de cinco turnos pendientes próximos, EL SISTEMA
  devolverá únicamente los turnos existentes.

## 4. Criterios de aceptación

1. El estado TV devuelve como máximo cinco turnos pendientes en orden de cola.
2. Los elementos próximos no contienen datos personales, de servicio, módulo ni
   asesor.
3. Una modificación de cola emite un evento a la sala Socket.IO de la TV de la sede.
4. Con cobertura completa, un ticket considera pendientes de otros servicios al
   calcular posición.
5. Sin cobertura completa, el cálculo de posición continúa limitado al servicio.
6. La espera conserva el cálculo configurado y el conteo de asesores del servicio.
7. El estado TV devuelve lista vacía o parcial cuando no hay cinco pendientes.

## 5. Dependencias y aclaraciones

- El día operativo vigente y la prioridad FIFO se mantienen.
- El cliente frontend consume el nuevo estado y la notificación según su spec
  propia: [spec frontend](../../../../front-app/radicar-app-frond/specs/002-turnos-proximos-tv/spec.md).

## 6. Historial reciente de llamados

- `GET /turnos/tv/{slug}/estado` añade `recentCalls` sin modificar los campos existentes.
- Devuelve hasta cinco turnos distintos llamados durante el día operativo
  (`America/Bogota`) en la sede consultada, del último llamado al más antiguo.
  Un rellamado actualiza la posición del turno sin duplicarlo. El estado actual
  del turno no lo excluye del historial.
- Cada entrada expone `ticketCode`, `moduloCode`, `moduloName`, `patientDisplayName` y `calledAt`
  (ISO 8601). El módulo corresponde al último llamado, no a la asignación actual.
  Si ya no está disponible, sus campos se devuelven como cadenas vacías.
- Sin llamados se devuelve `[]`. El frontend calcula «Llamado hace…» a partir de
  `calledAt`; el backend no devuelve una duración.

## 7. Nombre de visualización

- El estado público de TV incluye `patientDisplayName` en `activeTurns` y
  `recentCalls`, sin cambiar `upcomingTurns` ni los eventos de Socket.IO.
- Se separa el nombre registrado por espacios en blanco. Si tiene al menos
  tres palabras, se muestran la primera y la tercera; si tiene una o dos, se
  muestran las disponibles. Si no hay nombre, se devuelve `""`.
- Esta regla no identifica apellidos con certeza. La respuesta no incluye el
  campo original del paciente ni agrega documento o datos de contacto.
