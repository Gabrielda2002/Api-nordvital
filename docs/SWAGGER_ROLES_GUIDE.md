# 🎨 Guía de Documentación Swagger - Roles y Permisos

## Cómo documentar roles en Swagger

Para mantener consistencia en la documentación de endpoints con restricción de roles, usa esta convención:

### Template estándar:

```yaml
/**
 * @swagger
 * /ruta/endpoint:
 *   metodo:
 *     tags:
 *       - Nombre del Módulo
 *     summary: Descripción breve de la funcionalidad
 *     description: |
 *       Descripción detallada (opcional)
 *       
 *       **Roles permitidos:**
 *       - Administrador (ID: 1)
 *       - Gerente (ID: 2)
 *       - Rol específico (ID: X)
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path/query/header
 *         name: nombreParametro
 *         required: true/false
 *         schema:
 *           type: tipo
 *         description: Descripción del parámetro
 *     responses:
 *       200:
 *         description: Respuesta exitosa
 *       401:
 *         description: No autorizado
 *       403:
 *         description: Sin permisos (rol no permitido)
 */
```

## Mapeo de IDs de Roles

```typescript
/**
 * @swagger
 * components:
 *   schemas:
 *     Roles:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *         name:
 *           type: string
 *       description: |
 *         Roles del sistema:
 *         - 1: Administrador
 *         - 2: Gerente
 *         - 3: Auditor
 *         - 4: Calidad
 *         - 5: Auxiliar
 *         - 6: Coordinador
 *         - 10: Radicador
 *         - 11: Siau
 *         - 12: Contratacion
 *         - 13: Médico
 *         - 14: Jefe
 *         - 15: Cirugía
 *         - 16: Paramédico
 *         - 17: Soporte
 *         - 18: RRHH
 *         - 19: Enfermería
 *         - 20: Coordinadora Enfermería
 *         - 21: Líder Enfermería
 */
```

## Ejemplos por tipo de acceso:

### 1. Solo Administrador
```yaml
/**
 * @swagger
 * /usuarios/{id}:
 *   delete:
 *     description: |
 *       **Roles permitidos:** Solo Administrador (ID: 1)
 */
```

### 2. Múltiples roles específicos
```yaml
/**
 * @swagger
 * /radicacion:
 *   get:
 *     description: |
 *       **Roles permitidos:**
 *       - Administrador (ID: 1)
 *       - Auditor (ID: 3)
 *       - Radicador (ID: 10)
 *       - Cirugía (ID: 15)
 */
```

### 3. Todos los usuarios autenticados
```yaml
/**
 * @swagger
 * /permisos/requests:
 *   post:
 *     description: |
 *       Cualquier usuario autenticado puede crear solicitudes de permiso.
 *       
 *       **Roles permitidos:** Todos los roles autenticados
 */
```

### 4. Sin autenticación (público)
```yaml
/**
 * @swagger
 * /auth/login:
 *   post:
 *     description: Endpoint público para autenticación
 *     security: []  # Sin seguridad
 */
```

## Respuestas estándar de autorización:

Siempre incluir estas respuestas en endpoints protegidos:

```yaml
 *     responses:
 *       200:
 *         description: Operación exitosa
 *       401:
 *         description: No autorizado - Token inválido o no proporcionado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "No autorizado"
 *       403:
 *         description: Prohibido - El usuario no tiene el rol requerido
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "No tiene permisos para acceder a este recurso"
```

## Código de colores para documentación:

- 🔴 **Crítico (Solo Admin):** DELETE endpoints, cambios de estado críticos
- 🟡 **Restringido:** POST, PUT con múltiples roles específicos
- 🟢 **Lectura:** GET endpoints para consulta
- 🔵 **Todos:** Endpoints disponibles para todos los usuarios autenticados

---

**Fecha:** 28 de octubre de 2025
