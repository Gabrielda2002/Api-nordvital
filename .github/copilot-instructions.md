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

### Estructura de Tareas (Sintaxis unificada Notion/ClickUp)

#### **Campos obligatorios:**
- **Nombre de tarea:** Título con prefijo según tipo (feat:, fix:, refactor:, etc.)
- **Descripción:** Descripción detallada de la tarea
- **Estado:** 
  - Notion: Sin empezar | En curso | Retrasada | Listo
  - ClickUp: EN ESPERA | PENDIENTE | EN PROCESO | COMPLETADO | EN REVISION | ACEPTADO
- **Prioridad:**
  - Notion: Alta | Media | Baja
  - ClickUp: Baja | Normal | Alta | Urgente
- **Responsable:** Gabriel Duarte (por defecto)
- **Fecha límite:** Fecha en formato YYYY-MM-DD

#### **Campos opcionales:**
- **Tiempo Estimado:** Duración en horas
- **Tags/Etiquetas:** Tags relevantes para la tarea
- **Fecha de inicio:** Fecha en formato YYYY-MM-DD

#### **Campos específicos de Notion (no en ClickUp):**
- **Nivel de esfuerzo:** Pequeño | Media | Grande
- **Tipo Tarea:** Feature | Bug | Refactor | Maintenance | Documentation
- **Módulo:** Backend | Frontend | database | servidor (multi-select)

### Separación de Tareas
- **Principio de Responsabilidad Única:** Cada tarea debe tener UN solo propósito claro
- **Cuándo separar en múltiples tareas:**
  - Cuando los cambios combinan diferentes tipos (ej: fix + refactor)
  - Cuando afectan diferentes capas o módulos independientes (ej: frontend + backend)
  - Cuando una parte puede completarse independientemente de la otra
  - Cuando el tiempo estimado total supera las 2 horas
  - Cuando los cambios tienen diferentes niveles de prioridad
- **Criterios de separación:**
  - **fix + refactor:** SIEMPRE separar. El fix soluciona un problema, el refactor mejora el código
  - **feat + refactor:** Separar si el refactor no es esencial para la feature
  - **múltiples features:** Separar cada feature en su propia tarea
  - **cambios en múltiples módulos:** Separar por módulo si son independientes
- **Ejemplo de separación correcta:**
  - ❌ MAL: "fix: mejorar visualización de títulos y refactorizar modelo de datos"
  - ✅ BIEN: 
    - Tarea 1: "fix: mejorar visualización de títulos largos en tarjetas"
    - Tarea 2: "refactor: migrar nomenclatura del modelo a inglés"
- **Acción al detectar múltiples responsabilidades:** 
  - Analizar los cambios realizados con get_changed_files
  - Identificar diferentes tipos de cambios (fix, refactor, feat)
  - Crear una tarea separada para cada tipo de cambio
  - Documentar claramente qué archivos y cambios corresponden a cada tarea
  - Mantener tareas enfocadas y con estimaciones realistas (< 2 horas cada una)

Al trabajar en este proyecto, respeta estos patrones existentes y usa las utilidades ya implementadas en lugar de crear nuevas versiones.
