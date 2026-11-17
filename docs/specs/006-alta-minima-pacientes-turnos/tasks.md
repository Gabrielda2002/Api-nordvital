# Tareas — Alta mínima de pacientes

- [x] Migración nullable con reversión protegida y pruebas sin conexión.
- [x] Modelo con tipos anulables y validación mínima exclusiva de turnos.
- [x] Alta transaccional con estado activo y campos pendientes nulos; preservar pacientes existentes.
- [x] Lecturas tolerantes a relaciones pendientes y edición completa del registro.
- [x] Pruebas del camino feliz, datos inválidos y obligatoriedad del registro/edición completos.
- [x] Ejecutar pruebas, tipos, build, diff-check y `pnpm m:show`; registrar resultados y límites.
- [x] Lecturas frontend tolerantes a `null`, sin cambiar la validación de los formularios.
- [x] Aplicar la migración en el entorno de desarrollo y verificar la emisión de un ticket para un documento no registrado.

## Evidencia

- Suite focalizada: `pnpm exec node --require ts-node/register --require tsconfig-paths/register --test src/modules/turnos/__tests__/turno-public.test.ts src/modules/patients/__tests__/minimal-patient.test.ts`: **33 pruebas aprobadas**.
- Suite completa `pnpm test`: **119 pruebas aprobadas**. `pnpm exec tsc --noEmit`, `pnpm build` y `git diff --check`: aprobados.
- Los controladores de registro/edición, la emisión, el reporte y los pasos de migración se ejercitan con dobles de persistencia.
- `pnpm m:show` (solo lectura): migración 178 de servicios por sede aplicada y `AllowMinimalPatientRegistration1794927748837` aplicada (`[X] 179`).
- Verificación manual del usuario: la emisión pública permite crear un ticket para un documento no registrado con el esquema migrado. La reversión `down` no se ejecutó; conserva el bloqueo por datos pendientes.
- No hay commits de estos cambios.

## Compatibilidad frontend

- Se ajustaron `src/models/IPacientes.ts`, `Patient/Pages/TablePatient.tsx`, `Patient/Components/ModalPatient.tsx`, `DemandInduce/Components/ModalCreateDI.tsx` y `Radicacion/Components/ModalRadicacion.tsx` para tolerar `null`: convenio pendiente se muestra como «Pendiente» y los formularios se prellenan con cadenas vacías.
- No se modificó ningún esquema Yup ni la obligatoriedad de los campos. Los flujos de registro, edición, radicación y demanda inducida siguen exigiendo el perfil completo.
- `npx tsc -b` y `pnpm build` del frontend: aprobados. ESLint focalizado: sin errores nuevos; `ModalRadicacion.tsx` conserva 3 errores preexistentes en `HEAD`. `pnpm lint` global sigue fallando por errores preexistentes del repositorio, ninguno aportado por estos archivos.
- El despliegue debe aplicar primero la migración y luego publicar API y frontend juntos para que ninguna lectura reciba relaciones nulas sin tolerancia.
