---
applyTo: "**"
---

# Instrucciones generales para el proyecto.

Esta es una API REST construida con **Express.js + TypeScript + TypeORM + MySQL** para un sistema de gestión médica/hospitalaria. El proyecto utiliza arquitectura por capas con separación clara de responsabilidades.

### Estructura Clave
- **src/entities/**: Entidades TypeORM con decoradores de validación class-validator
- **src/controllers/**: Lógica de negocio con patrones `async/await` y manejo de errores
- **src/services/**: Servicios especializados (`TokenService`, `PushService`, etc.)
- **src/routes/**: Definición de rutas modularizadas por dominio
- **src/middlewares/**: Middlewares personalizados para autenticación, logging, validación

## Patrones y Convenciones

### Entidades TypeORM
```typescript
// Patrón estándar: BaseEntity, decoradores class-validator, relaciones explícitas
@Entity()
export class Usuarios extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;
  
  @ManyToOne(() => Roles)
  @JoinColumn({ name: "rol" })
  rolRelation: Roles;
}
```

### Controladores
- Usar `NextFunction` para propagación de errores
- Validación con `class-validator` antes de operaciones DB
- Queries con QueryBuilder para casos complejos: `Usuarios.createQueryBuilder("usuario")`

### Autenticación
- JWT con refresh tokens (`TokenService.genereteAccessTocken()`)
- Cookies httpOnly para refresh tokens
- Middleware `auth.ts` para protección de rutas

### Base de Datos
- MySQL con timezone "-05:00"
- Migraciones: `npm run m:run`, `npm run m:revert`
- Entidades auto-descubiertas desde `src/entities/*`

## Comandos de Desarrollo

```bash
npm run dev          # Desarrollo con ts-node-dev
npm run build        # Compilación + copia de templates
npm run start        # Producción (requiere build previo)
npm run m:run        # Ejecutar migraciones pendientes
npm run m:revert     # Revertir la última migración
```

## Integraciones Clave

### Semantica General del Proyecto
- Usar para las constantes screaming_snake_case
- Usar para las variables y funciones camelCase
- Usar para las clases y tipos PascalCase
- Usar para los módulos y archivos kebab-case
- Usar para las funciones camelCase
- Mantener el codigo limpio, organizado y bien formateado
- Evitar los comentarios innecesarios
- Usar nombres descriptivos y significativos para variables, funciones y clases
- Usar espacios en blanco y sangrías consistentes
- Usa Ingles como lengua principal, evita el uso de otros idiomas en el código.
- No usar caracteres especiales o acentos en los nombres de archivos y carpetas.
- No usar espacios en los nombres de archivos y carpetas.

### Socket.IO
- Instancia global exportada desde `app.ts`: `export let io: SocketIOServer`
- Salas por funcionalidad: `socket.join(room)`
- CORS configurado para múltiples dominios

### Push Notifications
- `PushService.initialize()` en startup
- Suscripciones almacenadas en entidad `PushSubscription`

### Logging
- Winston con archivos diarios en `/logs/`
- Middleware personalizado `loggerMiddleware`
- Rate limiting con `express-rate-limit`

## Seguridad
- Helmet con `crossOriginResourcePolicy: false` para recursos estáticos
- CORS restrictivo con lista de orígenes permitidos
- Validación de entrada con `express-validator` + `class-validator`
- Cleanup automático de tokens revocados (`TokenCleanupJob`)

## Testing y Debug
- Sin test suite configurada (usar `console.log` para debug temporal)
- PM2 para producción
- Swagger UI disponible para documentación API

## Gestión de Tareas
- **Sistema de tareas:** Todas las tareas del proyecto se gestionan en Notion
- **Base de datos:** "Seguimiento de tareas" (https://www.notion.so/1c2e88ee9bde80c4aa11f50a91f3a858)
- **Responsable principal:** Gabriel Duarte (ID: 1bdd872b-594c-81f7-9e75-000297f4be7a)
- **Cuando el usuario mencione "tareas":** Usar automáticamente el MCP de Notion para crear, listar o actualizar tareas
- **Convención de nombres:** El título de la tarea debe incluir un prefijo según el tipo:
  - `feat:` para Feature
  - `fix:` para Bug
  - `refactor:` para Refactor
  - `maintenance:` para Maintenance
  - `document:` para Documentation
  - Ejemplo: "refactor: mejorar lógica de autenticación"
- **Estructura de tareas:**
  - Nombre de tarea (título con prefijo según tipo)
  - Descripción (detallada)
  - Estado: Sin empezar | En curso | Retrasada | Listo
  - Prioridad: Alta | Media | Baja
  - Nivel de esfuerzo: Pequeño | Media | Grande
  - Tipo Tarea: Feature | Bug | Refactor | Maintenance | Documentation
  - Módulo: Backend | Frontend | database | servidor (multi-select)
  - Tiempo Estimado (horas)
  - Responsable (persona)
  - Fecha límite (date)

Al trabajar en este proyecto, respeta estos patrones existentes y usa las utilidades ya implementadas en lugar de crear nuevas versiones.
