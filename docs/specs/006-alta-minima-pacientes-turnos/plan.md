# Plan de implementación — Alta mínima de pacientes

Implementar el alcance aprobado en la conversación, conservando la validación completa como comportamiento predeterminado.

1. Hacer anulables `patients.email`, `address`, `agreement_id` e `ips_primary_id` mediante migración manual; conservar los metadatos existentes. Antes de revertir, comprobar que no haya nulos.
2. Reflejar la nulabilidad en `Pacientes` y sus relaciones. Mantener sus validadores completos y hacer que las validaciones esenciales se apliquen siempre.
3. Usar un grupo de validación exclusivamente desde el alta de turnos. Construir allí explícitamente los cuatro nulos y `status: true`; no aceptar del cliente campos adicionales ni modificar pacientes existentes.
4. Corregir accesos a relaciones opcionales en consultas/reportes y comprobar que la edición completa pueda completar el registro.
5. Agregar pruebas del alta mínima, errores esenciales, validación completa, finalización del perfil y migración con reversión protegida. Ejecutar tipos, suite, build, diff y consulta de migraciones de solo lectura.
6. Alinear las lecturas frontend de pacientes para tolerar campos y relaciones nulas (`TablePatient`, `ModalPatient`, `ModalCreateDI`, `ModalRadicacion`), sin modificar reglas de validación ni campos obligatorios.

## Despliegue y reversión

Aplicar primero la migración en el entorno autorizado y después desplegar el código. No se ejecutará la migración durante esta tarea. Para volver al esquema anterior, detener altas mínimas y completar los cuatro campos en todos los pacientes pendientes antes de revertir.

## Límite de reversión

Retirar el grupo del alta en `turno-issuance.service.ts` y revertir el mapeo nullable y la migración solo tras completar los perfiles pendientes. Las comprobaciones nulas en reportes y frontend son compatibles con ambos esquemas.
