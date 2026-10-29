# Spec: 001 - Descarga de Archivos PDF para Roles Calidad y Administrador

## 1. Contexto y Propósito

Actualmente, los archivos con formato PDF gestionados en el módulo de documentos están limitados a visualización en línea dentro de la aplicación para proteger la confidencialidad y control documental de la institución. Los archivos en otros formatos (por ejemplo, documentos ofimáticos) permiten la descarga para que los usuarios puedan abrirlos en sus aplicaciones locales.

Para optimizar las labores de auditoría y gestión documental, se requiere habilitar la descarga de archivos PDF exclusivamente para los roles con responsabilidades de supervisión y gestión técnica: **Administrador** y **Calidad**. Todos los demás roles deben mantener el acceso de visualización pero tener bloqueada la descarga de archivos PDF. Asimismo, se unifica todo el acceso a través del mecanismo seguro de tokens temporales, suprimiendo las vías de descarga directa sin token.

---

## 2. Alcance

### Dentro del alcance
- Habilitación de permisos de descarga para archivos PDF exclusivamente a usuarios con rol Administrador o Calidad.
- Bloqueo y respuesta de denegación (403 Forbidden) para solicitudes de descarga de PDF por parte de cualquier otro rol.
- Mantenimiento del flujo de visualización de PDF para todos los roles autorizados.
- Mantenimiento del flujo de descarga de archivos que no sean PDF para todos los roles autorizados.
- Unificación del mecanismo de entrega de archivos exclusivamente mediante tokens temporales.
- Supresión de la vía de descarga directa no asegurada.

### Fuera de alcance
- Modificación de los permisos o lógica de visualización en línea de documentos PDF.
- Modificación de permisos de descarga para archivos que no sean PDF.
- Descarga masiva o empaquetado comprimido (ZIP) de archivos PDF.
- Persistencia de registros de auditoría en tablas de base de datos para accesos o descargas.
- Cambios en interfaces visuales o componentes de frontend.

---

## 3. Requisitos Funcionales (EARS)

- **RF-1**: CUANDO un usuario autenticado con rol Administrador solicita la generación de acceso para descarga de un archivo con formato PDF, EL SISTEMA generará el token temporal de acceso con acción de descarga autorizada.
- **RF-2**: CUANDO un usuario autenticado con rol Calidad solicita la generación de acceso para descarga de un archivo con formato PDF, EL SISTEMA generará el token temporal de acceso con acción de descarga autorizada.
- **RF-3**: SI un usuario autenticado con un rol diferente a Administrador o Calidad solicita la generación de acceso para descarga de un archivo con formato PDF, ENTONCES EL SISTEMA denegará la solicitud devolviendo un código de respuesta 403 Forbidden con un mensaje que indique la falta de permisos para descargar archivos PDF.
- **RF-4**: CUANDO un usuario autenticado con cualquier rol autorizado solicita la generación de acceso para visualización en línea de un archivo con formato PDF, EL SISTEMA generará el token temporal de acceso con acción de visualización autorizada.
- **RF-5**: CUANDO un usuario autenticado con cualquier rol autorizado solicita la generación de acceso para descarga de un archivo cuyo formato sea diferente a PDF, EL SISTEMA generará el token temporal de acceso con acción de descarga autorizada.
- **RF-6**: SI un usuario presenta un token temporal de descarga válido en el canal de entrega segura, ENTONCES EL SISTEMA transferirá el contenido binario del archivo como archivo adjunto para forzar su guardado local.
- **RF-7**: SI un usuario presenta un token temporal de visualización válido en el canal de entrega segura, ENTONCES EL SISTEMA servirá el contenido binario de forma en línea para su consumo por el visor.
- **RF-8**: SI un usuario intenta acceder a la descarga de un documento a través del canal directo no asegurado anterior, ENTONCES EL SISTEMA responderá con un código 404 Not Found al haber sido retirado dicho canal.
- **RF-9**: SI el archivo solicitado no existe en el registro del sistema o en el almacenamiento físico, ENTONCES EL SISTEMA denegará la solicitud devolviendo un código de respuesta 404 Not Found.

---

## 4. Criterios de Aceptación y Verificación

1. Un usuario con rol Administrador solicita la descarga de un PDF y obtiene un token válido de descarga con código 200 OK.
2. Un usuario con rol Calidad solicita la descarga de un PDF y obtiene un token válido de descarga con código 200 OK.
3. Un usuario con rol distinto (ej. Auxiliar, Médico, Auditor) solicita la descarga de un PDF y recibe inmediatamente un código 403 Forbidden.
4. Cualquier usuario autorizado puede solicitar la visualización de un PDF y recibe un token de visualización con código 200 OK.
5. Cualquier usuario autorizado puede solicitar la descarga de un documento no-PDF (ej. Word, Excel) y recibe un token de descarga con código 200 OK.
6. La ruta anterior de descarga directa (`GET /download-file/:id`) deja de estar disponible y responde 404 Not Found.

