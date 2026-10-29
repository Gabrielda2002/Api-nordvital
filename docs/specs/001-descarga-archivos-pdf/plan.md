# Plan Técnico: 001 - Descarga de Archivos PDF para Roles Calidad y Administrador

## 1. Enfoque Técnico

El objetivo es restringir la descarga de archivos PDF a los roles `ADMINISTRADOR` (1) y `CALIDAD` (4), manteniendo la visualización (`VIEW`) para todos los roles autorizados y la descarga (`DOWNLOAD`) para los formatos no-PDF.

Para cumplir con la Constitución del proyecto (cero duplicidad, punto único de verdad, seguridad por diseño):
1. **Punto único de autorización:** La lógica de validación se implementa en `generateFileAccessToken` dentro de `src/modules/documents/controllers/archivo.controller.ts`.
2. **Evaluación de condiciones:**
   - Si `actionType === 'DOWNLOAD'` y el archivo es un PDF (`file.mimeType === 'application/pdf'` o extensión `.pdf`):
     - El rol del usuario autenticado (`req.user.rol`) debe coincidir con `ROLE_IDS.ADMINISTRADOR` o `ROLE_IDS.CALIDAD` de `@core/constants/roles.ts`.
     - Si no coincide: rechazar con HTTP `403 Forbidden` y mensaje `{ message: "No tiene permisos para descargar archivos PDF" }`.
3. **Depuración de código muerto:**
   - Eliminar el endpoint `GET /download-file/:id` de `src/modules/documents/routes/archivos.routes.ts` y su bloque Swagger.
   - Eliminar la función obsoleta `downloadFile` de `src/modules/documents/controllers/archivo.controller.ts`.
4. **Pruebas automatizadas:**
   - Crear suite de pruebas unitarias para la lógica de autorización de tokens de archivo usando el test runner nativo de Node.js (`node:test` y `node:assert`).

---

## 2. Decisiones de Arquitectura

### Decisión 1: Centralización en el generador de tokens vs Middleware separado
- **Opción seleccionada:** Validar la regla de negocio directamente al generar el token temporal (`generateFileAccessToken`).
- **Alternativas consideradas:** Crear un middleware específico para Express en la ruta de generación de token.
- **Razón:** El middleware de Express solo tiene acceso a `req.params.id`, lo que obligaría a consultar la base de datos para obtener el tipo de archivo (`Archivos.findOne`), repitiendo la consulta que `generateFileAccessToken` ya realiza. Validar dentro del controller o delegar a una función de validación pura evita consultas redundantes.

### Decisión 2: Criterio de identificación de archivo PDF
- **Opción seleccionada:** Doble verificación: `file.mimeType?.toLowerCase() === 'application/pdf'` O terminación de nombre `file.name?.toLowerCase().endsWith('.pdf')`.
- **Razón:** Protege contra inconsistencias en la base de datos donde el tipo MIME haya sido registrado genérico (ej. `application/octet-stream`) pero el archivo sea físicamente un PDF, o viceversa.

### Decisión 3: Eliminación directa de `GET /download-file/:id`
- **Opción seleccionada:** Retirar la ruta y su controlador completamente.
- **Razón:** El frontend ya migró al uso de tokens temporales. Dejar la ruta abierta crearía una vulnerabilidad de bypass de autorización y código muerto en el backend.

---

## 3. Cambios en Archivos

| Archivo | Acción | Descripción |
|---|---|---|
| `src/modules/documents/controllers/archivo.controller.ts` | Modificar | Agregar validación de rol para descargas de PDF en `generateFileAccessToken`. Eliminar `downloadFile`. |
| `src/modules/documents/routes/archivos.routes.ts` | Modificar | Remover ruta `GET /download-file/:id` y su importación. |
| `src/modules/documents/__tests__/archivo-access.test.ts` | Crear | Pruebas automatizadas de la regla de acceso (casos felices y de error). |

---

## 4. Estrategia de Pruebas

Se implementará un archivo de prueba `src/modules/documents/__tests__/archivo-access.test.ts` ejecutado mediante `node --test` verificando:
1. Rol Administrador ('1') solicitando `DOWNLOAD` de PDF -> Permitido (200).
2. Rol Calidad ('4') solicitando `DOWNLOAD` de PDF -> Permitido (200).
3. Rol Médico ('13') o Auxiliar ('5') solicitando `DOWNLOAD` de PDF -> Bloqueado (403).
4. Rol Auxiliar ('5') solicitando `VIEW` de PDF -> Permitido (200).
5. Rol Auxiliar ('5') solicitando `DOWNLOAD` de documento Word/Excel -> Permitido (200).

