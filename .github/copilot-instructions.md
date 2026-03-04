---
applyTo: "**"
---

# Instrucciones de Copilot — API NordVital

API REST para un sistema de gestión médica/hospitalaria construido con **Express.js v5 + TypeScript + TypeORM (Active Record) + MySQL**. Arquitectura por capas con separación clara de responsabilidades.

---

## Estructura del Proyecto

```
src/
├── app.ts                 # Configuración de Express, Socket.IO, cadena de middlewares
├── index.ts               # Punto de entrada: init DB, bootstrap de servicios, inicio del servidor
├── swagger-options.ts     # Definiciones de esquemas Swagger/OpenAPI
├── config/
│   └── environment.config.ts   # Configuración centralizada de entorno (clase EnvironmentConfig)
├── constants/
│   └── roles.ts           # Constantes ROLE_IDS y GLOBAL_FOLDER_ACCESS_ROLES
├── controllers/           # Funciones async handler (sin clases)
├── db/
│   └── conexion.ts        # TypeORM DataSource (MySQL)
├── entities/              # Entidades TypeORM (Active Record, class-validator)
├── middlewares/            # Auth, autorización, manejo de errores, multer, rate-limit
├── migrations/            # Migraciones TypeORM
├── routes/                # Módulos Express Router, comentarios Swagger JSDoc
├── services/              # Clases con métodos estáticos (Token, Push, Notification, Redis…)
├── templates/             # Plantillas de email/PDF (se copian en build)
├── types/                 # Tipos TypeScript personalizados
├── uploads/               # Archivos subidos por usuarios
└── utils/                 # Logger, errores custom, helper de validación, file manager
```

**Archivos clave en la raíz:**
- `express.d.ts` — Augmentación global de `Express.Request` con `user`, `parentFolderId`, `departmentUserId`, `hasGlobalFolderAccess`.
- `nodemon.json`, `tsconfig.json` — Configuración de desarrollo/build.

---

## Convenciones de Nombres (ESTRICTAS)

| Elemento               | Convención         | Ejemplo                              |
|-----------------------|--------------------|--------------------------------------|
| Archivos y carpetas    | `kebab-case`       | `area-dependencia.ts`, `token.service.ts` |
| Archivos de rutas      | `{nombre}.routes.ts` | `tickets.routes.ts`                  |
| Archivos de controlador | `{nombre}.controller.ts` | `tickets.controller.ts`          |
| Archivos de servicio   | `{nombre}.service.ts`| `token.service.ts`                   |
| Archivos de middleware | `{nombre}.middleware.ts` | `authenticate.middleware.ts`     |
| Archivos de entidad    | `kebab-case.ts`    | `seguimiento-equipos.ts`            |
| Clases y tipos         | `PascalCase`       | `Usuarios`, `TokenService`           |
| Variables y funciones  | `camelCase`        | `getAllTickets`, `radicacionData`     |
| Constantes             | `SCREAMING_SNAKE_CASE` | `ROLE_IDS`, `GLOBAL_FOLDER_ACCESS_ROLES` |
| Props de relación TypeORM | `{nombre}Relation`  | `rolesRelation`, `patientRelation`   |

**Reglas de idioma:**
- Todo el **código** (variables, funciones, clases, mensajes de error en código) DEBE estar en **inglés**.
- Nombres y descripciones de tareas en ClickUp y Notion → **español**.
- La documentación de instrucciones (como este archivo) se escribe en **español** para el equipo.
- Sin caracteres especiales, acentos ni espacios en nombres de archivos/carpetas.

---

## Patrones de Entidades (TypeORM Active Record)

Todas las entidades extienden `BaseEntity` y usan decoradores de `class-validator` para validación.

```typescript
import { Entity, BaseEntity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn, UpdateDateColumn } from "typeorm";
import { IsNotEmpty, IsString, Length, IsOptional } from "class-validator";

@Entity("table_name_in_db")
export class EntityName extends BaseEntity {
  @PrimaryGeneratedColumn({ name: "db_column_name" })
  id: number;

  @Column({ name: "db_column" })
  @IsNotEmpty({ message: "Field name is required" })
  @IsString()
  @Length(1, 255)
  fieldName: string;

  @Column({ name: "nullable_column", nullable: true })
  @IsOptional()
  optionalField: string;

  // Las relaciones usan el sufijo "Relation"
  @ManyToOne(() => OtherEntity, (other) => other.reverseRelation)
  @JoinColumn({ name: "fk_column_in_db" })
  otherRelation: OtherEntity;

  @CreateDateColumn({ name: "created_at" })
  createdAt: Date;

  @UpdateDateColumn({ name: "updated_at" })
  updatedAt: Date;
}
```

**Reglas para entidades:**
- Siempre extender `BaseEntity` (patrón Active Record).
- Mapear nombres de columna DB explícitamente con `{ name: "column_name" }`.
- Nombres de propiedades en `camelCase` en inglés, nombres de columnas DB deben coincidir con el esquema existente.
- Los decoradores de class-validator van directamente sobre las propiedades de la entidad.
- Mensajes de validación en **inglés**.
- Usar `@CreateDateColumn` / `@UpdateDateColumn` para timestamps.
- Las propiedades de relación DEBEN usar el sufijo `{name}Relation`.

---

## Patrones de Controladores

Los controladores son **funciones async exportadas** (NO clases). Cada función recibe `(req: Request, res: Response, next: NextFunction)`.

```typescript
import { Request, Response, NextFunction } from "express";
import { EntityName } from "../entities/entity-name";
import { validateEntity } from "../utils/validation-helper";
import { NotFoundError } from "../utils/custom-errors";

export async function getAllItems(req: Request, res: Response, next: NextFunction) {
  try {
    const items = await EntityName.find();
    return res.json(items);
  } catch (error) {
    next(error);
  }
}

export async function getItemById(req: Request, res: Response, next: NextFunction) {
  try {
    const { id } = req.params;
    const item = await EntityName.findOneBy({ id: parseInt(id) });

    if (!item) {
      throw new NotFoundError("Item not found");
    }

    return res.json(item);
  } catch (error) {
    next(error);
  }
}

export async function createItem(req: Request, res: Response, next: NextFunction) {
  try {
    const item = Object.assign(new EntityName(), req.body);
    await validateEntity(item);
    await item.save();
    return res.status(201).json(item);
  } catch (error) {
    next(error);
  }
}
```

**Reglas de controladores:**
- SIEMPRE envolver el cuerpo en `try/catch` y llamar `next(error)` en el bloque catch.
- Usar `validateEntity()` de `src/utils/validation-helper.ts` para validar entidades antes de guardar.
- Usar errores custom (`NotFoundError`, `BadRequestError`, `ValidationError`, `UnauthorizedError`, `ForbiddenError`, `ConflictError`) de `src/utils/custom-errors.ts` — NO retornar `res.status(4xx).json(...)` directamente para errores.
- Para consultas complejas, usar TypeORM QueryBuilder:
  ```typescript
  const data = await EntityName.createQueryBuilder("alias")
    .leftJoinAndSelect("alias.someRelation", "rel")
    .where("alias.field = :value", { value })
    .orderBy("alias.id", "DESC")
    .getMany();
  ```
- Para operaciones multi-tabla, usar transacciones con QueryRunner:
  ```typescript
  const queryRunner = EntityName.getRepository().manager.connection.createQueryRunner();
  await queryRunner.connect();
  await queryRunner.startTransaction();
  try {
    // operaciones con queryRunner.manager
    await queryRunner.commitTransaction();
  } catch (error) {
    await queryRunner.rollbackTransaction();
    throw error;
  } finally {
    await queryRunner.release();
  }
  ```
- Acceder al usuario autenticado via `req.user` (contiene el payload JWT con `rol`, `id`, etc.).
- Usar `Logger` de `src/utils/logger-wrapper.ts` — NUNCA usar `console.log`.

---

## Patrones de Servicios

Los servicios son **clases con métodos estáticos** (nunca se instancian). Excepción: `RedisService` usa patrón Singleton.

```typescript
import Logger from "../utils/logger-wrapper";

export class MyService {
  static async doSomething(param: string): Promise<Result> {
    // lógica aquí
    Logger.info("Operation completed");
    return result;
  }
}
```

**Servicios existentes:**
| Servicio | Propósito |
|---------|---------|
| `TokenService` | Generación, almacenamiento y revocación de tokens JWT (access/refresh) |
| `PushService` | Notificaciones Web Push via `web-push` |
| `NotificationService` | Notificaciones in-app + Socket.IO + integración Push |
| `RedisService` | Conexión Redis (Singleton), tokens SSO |
| `TokenCleanupJob` | Cron job para limpiar refresh tokens revocados |
| `NotificationsCleanupJob` | Cron job para marcar notificaciones antiguas como leídas |
| `CVCleanupService` | Cron job para limpiar CVs y adjuntos antiguos |
| `VacationCheckJob` | Cron job para verificar vencimientos de vacaciones |
| `MoodleService` | Integración LMS con API de Moodle |
| `PermissionService` | Gestión de permisos/licencias de empleados |
| `VacationManagementService` | Gestión de saldos y solicitudes de vacaciones |
| `GoalProgramService` | Seguimiento de metas/programas |

---

## Patrones de Rutas

Cada archivo de ruta crea un `Router`, aplica la cadena de middlewares y exporta por defecto.

```typescript
import { Router } from "express";
import { authenticate } from "../middlewares/authenticate.middleware";
import { authorizeRoles } from "../middlewares/authorize-roles.middleware";
import { ROLE_IDS } from "../constants/roles";
import { getAllItems, createItem } from "../controllers/item.controller";

const router = Router();

/**
 * @swagger
 * /items:
 *   get:
 *     tags: [Items]
 *     ...
 */
router.get("/items", authenticate, authorizeRoles([ROLE_IDS.JEFE, ROLE_IDS.RADICADOR]), getAllItems);
router.post("/items", authenticate, authorizeRoles([ROLE_IDS.JEFE]), createItem);

export default router;
```

**Reglas de rutas:**
- Nomenclatura de archivos: `{dominio}.routes.ts` (ej., `tickets.routes.ts`).
- Orden de composición de middlewares: `authenticate → authorizeRoles([...]) → [opcionales: validarId, multer, getDepartmentUser] → handler`.
- Usar constantes `ROLE_IDS` de `src/constants/roles.ts` en lugar de strings/números mágicos para autorización por rol.
- Todas las rutas se importan en `src/routes/index.routes.ts` y se montan con `router.use()`.
- El prefijo global `/api/v1` se aplica en `app.ts`.
- Incluir comentarios Swagger JSDoc encima de cada definición de ruta.

---

## Referencia de Middlewares

| Middleware | Archivo | Propósito |
|------------|------|---------|
| `authenticate` | `authenticate.middleware.ts` | Verificación de token JWT, asigna `req.user` |
| `authorizeRoles` | `authorize-roles.middleware.ts` | Control de acceso por roles (factory function) |
| `errorHandler` | `error-handler.middleware.ts` | Manejador global de errores (lee `error.statusCode`) |
| `errorLoggerMiddleware` | `error-logger.middleware.ts` | Registra errores en logs antes de pasarlos al error handler |
| `loggerMiddleware` | `logger.middleware.ts` | Logging de peticiones HTTP con tiempo de respuesta |
| `sanitizeBody` | `sanitize-body.middleware.ts` | Aplica trim a todos los strings del body |
| `limiter` | `rate-limit.middleware.ts` | 250 peticiones/min por IP |
| `validarId` | `validate-type-id.middleware.ts` | Valida que `req.params.id` sea numérico |
| `getDepartmentUser` | `get-department-user.middleware.ts` | Carga info de departamento y acceso a carpetas |
| `multer-*` | `multer-*.middleware.ts` | Manejo de subida de archivos (configuraciones por dominio) |

---

## Manejo de Errores

Clases de error custom en `src/utils/custom-errors.ts`:

| Clase | Status Code | Uso |
|-------|-------------|-------|
| `ValidationError` | 400 | Fallos de validación de entidades |
| `BadRequestError` | 400 | Peticiones malformadas o inválidas |
| `UnauthorizedError` | 401 | Fallos de autenticación |
| `ForbiddenError` | 403 | Permisos insuficientes |
| `NotFoundError` | 404 | Recurso no encontrado |
| `ConflictError` | 409 | Datos duplicados/conflictivos |
| `InternalServerError` | 500 | Errores inesperados del servidor |

**Siempre lanzar errores custom y dejar que `next(error)` + el middleware `errorHandler` manejen la respuesta.** Nunca construir respuestas de error manuales con `res.status().json()` en controladores.

---

## Autenticación y Autorización

- **JWT** con access tokens (expiración 4h) + refresh tokens (expiración 7 días, almacenados en BD, cookies httpOnly).
- `TokenService.genereteAccessTocken()` genera access tokens (nota: typo legacy en el nombre del método, mantener tal cual).
- `TokenService.generateRefreshToken()` genera refresh tokens.
- El middleware `authenticate` extrae el Bearer token del header `Authorization`.
- `authorizeRoles(roles[])` middleware factory que verifica `req.user.rol` contra los IDs de rol permitidos.
- `req.user` está tipado como `JwtPayload & { rol: (string | number) }` (ver `express.d.ts`).

---

## Tiempo Real y Notificaciones

**Socket.IO:**
- Instancia global: `export let io: SocketIOServer` en `app.ts`.
- Acceso en servicios: `import { io } from "../app"`.
- Basado en salas: `io.to(roomName).emit(event, data)`.

**Push Notifications:**
- `PushService.initialize()` se llama al inicio.
- `PushService.sendNotification(subscription, payload)` para pushes individuales.
- `PushService.sendNotificationToUser(userId, payload)` para pushes dirigidos a un usuario.
- Las suscripciones se almacenan en la entidad `PushSubscription`.
- Limpieza automática de suscripciones expiradas (HTTP 410/404).

**NotificationService** combina:
- Creación de registro de notificación en BD.
- Emisión en tiempo real via Socket.IO.
- Envío de notificación Push.

---

## Base de Datos

- **MySQL** via driver `mysql2`, timezone `-05:00` (Colombia).
- **TypeORM 0.3.x** con patrón Active Record.
- `synchronize: false` — cambios de esquema solo via migraciones.
- Entidades auto-descubiertas desde `src/entities/*{.ts,.js}`.
- Configuración de conexión en `src/db/conexion.ts`, lee de `EnvironmentConfig`.

**Comandos de migración:**
```bash
pnpm m:run        # Ejecutar migraciones pendientes
pnpm m:revert     # Revertir última migración
pnpm m:gen        # Generar migración desde cambios en entidades
```

---

## Caché

- **Redis** via librería `ioredis`.
- `RedisService` (Singleton) en `src/services/redis.service.ts`.
- Usado para tokens SSO, caché de sesiones.
- Configuración de conexión: `config.redis.host`, `config.redis.port`.

---

## Configuración

`src/config/environment.config.ts` exporta el singleton `config` con propiedades agrupadas:

| Grupo | Propiedades Clave |
|-------|---------------|
| `config.database` | `host`, `port`, `username`, `password`, `database`, `timezone` |
| `config.jwt` | `secret`, `refreshSecret`, `accessTokenExpiry`, `refreshTokenExpiry` |
| `config.server` | `port`, `apiPrefix`, `isProduction`, `isDevelopment` |
| `config.push` | `vapidPublicKey`, `vapidPrivateKey` |
| `config.cors` | `allowedOrigins` |
| `config.redis` | `host`, `port`, `password`, `db` |
| `config.moodle` | `url`, `apiToken`, `ssoSecret` |
| `config.logger` | `level` |

Las variables de entorno requeridas lanzan error al inicio si faltan.

---

## Logging

- **Winston** con `DailyRotateFile` para rotación diaria de logs.
- Usar el import `Logger` de `src/utils/logger-wrapper.ts`:
  ```typescript
  import Logger from "../utils/logger-wrapper";
  Logger.info("message");
  Logger.error("message", error);
  Logger.warn("message");
  Logger.debug("message");
  ```
- Archivos de log en `/logs/`: `error-*.log`, `combined-*.log`, `api-*.log` (solo producción).
- Los datos sensibles (`password`, `token`, `authorization`) se filtran automáticamente de los logs.
- **NUNCA usar `console.log`** — siempre usar `Logger`.

---

## Librerías Principales

| Librería | Versión | Propósito |
|---------|---------|---------|
| `express` | **v5.x** | Framework HTTP (v5 tiene manejo nativo de errores async) |
| `typeorm` | 0.3.x | ORM (Active Record) |
| `mysql2` | - | Driver MySQL |
| `class-validator` | - | Validación de entidades basada en decoradores |
| `jsonwebtoken` | - | Tokens JWT |
| `bcrypt` | - | Hashing de contraseñas |
| `socket.io` | 4.x | Comunicación WebSocket en tiempo real |
| `web-push` | - | Notificaciones Push (Web Push Protocol) |
| `ioredis` | - | Cliente Redis |
| `multer` | 2.x | Subida de archivos |
| `exceljs` | - | Generación de reportes Excel |
| `pdf-lib` | - | Generación/manipulación de PDFs |
| `date-fns` / `date-fns-tz` | - | Manejo de fechas con soporte de timezone |
| `node-cron` | - | Jobs programados en background |
| `swagger-jsdoc` / `swagger-ui-express` | - | Documentación de API (solo dev) |
| `helmet` | - | Headers de seguridad |
| `express-rate-limit` | - | Rate limiting |

**Nota:** Express v5 maneja errores async automáticamente (las promesas rechazadas en route handlers se propagan al middleware de errores). El patrón `try/catch + next(error)` se sigue usando para control explícito.

---

## Comandos de Desarrollo

```bash
pnpm dev          # Desarrollo con ts-node-dev + hot reload
pnpm dev:fast     # Desarrollo con --transpile-only (más rápido, sin type checking)
pnpm build        # Compilación tsc + copia templates a dist/
pnpm start        # Producción (ejecuta dist/index.js, requiere build previo)
pnpm m:run        # Ejecutar migraciones TypeORM pendientes
pnpm m:revert     # Revertir última migración
pnpm m:gen        # Generar migración desde diff de entidades
```

---

## Checklist de Seguridad

- `helmet` con `crossOriginResourcePolicy: false` para recursos estáticos.
- CORS restringido a orígenes permitidos en `config.cors.allowedOrigins`.
- Validación de entrada: `class-validator` en entidades + middleware `sanitizeBody` (trim de strings).
- Rate limiting: 250 req/min por IP global, rate-limit separado para uploads.
- Refresh tokens JWT en cookies httpOnly, limpieza automática via `TokenCleanupJob`.
- `trust proxy: 1` habilitado para configuraciones de reverse proxy.

---

## Swagger/OpenAPI

- Esquemas definidos manualmente en `src/swagger-options.ts`.
- Anotaciones JSDoc inline en archivos de rutas usando el tag `@swagger`.
- UI disponible en `/api-docs` solo en entornos que no sean producción.
- Al crear nuevos endpoints, agregar comentarios Swagger JSDoc siguiendo los patrones existentes.

---

## Estándares de Calidad de Código

1. **No `console.log`** — usar `Logger` de utils.
2. **No strings mágicos** para roles — usar `ROLE_IDS` de `src/constants/roles.ts`.
3. **Siempre validar** entidades con `validateEntity()` antes de `.save()`.
4. **Siempre usar errores custom** — nunca retornar `res.status(4xx).json()` directamente para errores en controladores.
5. **Siempre usar `next(error)`** en bloques catch — dejar que el middleware errorHandler formatee la respuesta.
6. **Mantener el código limpio** — sin comentarios innecesarios, nombres descriptivos, indentación consistente.
7. **Inglés en todo el código** — nombres de variables, funciones, clases, mensajes de error, comentarios en código.
8. **Nomenclatura de relaciones** — siempre agregar sufijo `Relation` (ej., `categoryRelation`, `userRelation`).
9. **Nomenclatura de archivos** — estrictamente `kebab-case` para todos los archivos con sufijos apropiados (`.controller.ts`, `.service.ts`, `.routes.ts`, `.middleware.ts`).
10. **No tolerar inconsistencias** — al modificar código existente, corregir inconsistencias de nomenclatura/patrones que se encuentren en el código cercano.