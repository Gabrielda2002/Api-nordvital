# Análisis de Error Handling - API NordVital

## 🔴 Problema Crítico: Manejo de Errores Inconsistente

### 1️⃣ **Errores que NO se propagan correctamente**

#### ❌ Problema 1: Respuesta dentro de .catch()
**Archivo:** src/controllers/carpeta.controller.ts (líneas 88-94)

```typescript
// ❌ MAL - Error dentro de .catch() no se propaga
await fsPromises
  .mkdir(absoluteFolderPath, { recursive: true })
  .catch((err) => {
    return res
      .status(500)
      .json({ message: "Error creating folder", error: err.message });
  });

// El código CONTINÚA ejecutándose después del error!
// La carpeta no existe pero se guarda en BD de todas formas
```

**Por qué es malo:**
- El eturn dentro del .catch() NO detiene la ejecución de la función
- El código continúa y podría guardar la carpeta en BD aunque falló físicamente
- El error NO llega al middleware de error handling global
- No se loggea correctamente

**✅ SOLUCIÓN:**
```typescript
// Opción 1: Usar try-catch
try {
  await fsPromises.mkdir(absoluteFolderPath, { recursive: true });
} catch (err) {
  return res
    .status(500)
    .json({ message: "Error creating folder", error: err.message });
}

// Opción 2: Dejar que el error se propague
await fsPromises.mkdir(absoluteFolderPath, { recursive: true });
// Si falla, el catch del try principal lo manejará
```

---

#### ❌ Problema 2: res.status(500) dentro del try-catch
**Archivo:** src/controllers/servicio.controller.ts (línea 16)

```typescript
export async function getAllServicesBySede(req: Request, res: Response, next: NextFunction) {
  try {
    const { idSede } = req.params;
    const services = await Servicios.find({ where: { sede: parseInt(idSede) } });
    return res.json(services);
  } catch (error) {
    // ❌ MAL - Manejo manual del error 500
    return res.status(500).json({ message: error.message });
  }
}
```

**Por qué es malo:**
- Expone detalles técnicos del error al cliente (rror.message)
- No usa el error handler global
- No loggea el error correctamente
- No diferencia tipos de errores

**✅ SOLUCIÓN:**
```typescript
export async function getAllServicesBySede(req: Request, res: Response, next: NextFunction) {
  try {
    const { idSede } = req.params;
    const services = await Servicios.find({ where: { sede: parseInt(idSede) } });
    return res.json(services);
  } catch (error) {
    // ✅ BIEN - Propagar al middleware de error
    next(error);
  }
}
```

---

#### ❌ Problema 3: Múltiples respuestas dentro del try-catch
**Archivos:** rchivo.controller.ts, permission.controller.ts, soportes-secure.controller.ts

```typescript
// ❌ MAL - Respuesta específica dentro del try
try {
  const filePath = path.join(__dirname, "..", "uploads", file.path);
  res.download(filePath);
} catch (error) {
  res.status(500).json({ message: "Error al descargar el archivo" });
}
```

**Problemas:**
- No propaga el error original
- Pierde contexto del error real
- No loggea

---

### 2️⃣ **Errores bien manejados** ✅

**Archivo:** src/controllers/usuario.controller.ts (líneas 106-109)

```typescript
export async function createUsuario(req: Request, res: Response, next: NextFunction) {
  try {
    // ... lógica de negocio
    await usuario.save();
    return res.json(usuario);
  } catch (error) {
    // ✅ BIEN - Propaga al error handler
    next(error);
  }
}
```

**Archivo:** src/controllers/area.controller.ts (líneas 99-101)

```typescript
export async function createArea(req: Request, res: Response, next: NextFunction) {
  try {
    // ... lógica
    await newArea.save();
    return res.status(201).json(newArea);
  } catch (error) {
    next(error); // ✅ BIEN
  }
}
```

---

### 3️⃣ **Errores de validación vs Errores de sistema**

Actualmente TODO se maneja igual. Necesitamos diferenciar:

#### Errores de Validación (400)
- Datos incorrectos del usuario
- Validaciones de class-validator
- Business logic errors (usuario ya existe, etc.)

#### Errores de Sistema (500)
- Errores de base de datos
- Errores de file system
- Errores de servicios externos

**✅ SOLUCIÓN: Custom Error Classes**

```typescript
// src/utils/custom-errors.ts
export class ValidationError extends Error {
  statusCode = 400;
  constructor(message: string) {
    super(message);
    this.name = "ValidationError";
  }
}

export class NotFoundError extends Error {
  statusCode = 404;
  constructor(message: string) {
    super(message);
    this.name = "NotFoundError";
  }
}

export class ConflictError extends Error {
  statusCode = 409;
  constructor(message: string) {
    super(message);
    this.name = "ConflictError";
  }
}
```

**Uso en controladores:**
```typescript
export async function createUsuario(req: Request, res: Response, next: NextFunction) {
  try {
    const userExist = await Usuarios.findOne({ where: { dniNumber } });
    
    if (userExist) {
      // ✅ Lanzar error específico
      throw new ConflictError("El usuario ya existe");
    }
    
    const errors = await validate(usuario);
    if (errors.length > 0) {
      const messages = errors.map(e => Object.values(e.constraints || {}).join(", "));
      throw new ValidationError(messages.join("; "));
    }
    
    await usuario.save();
    return res.json(usuario);
  } catch (error) {
    next(error); // El error handler global diferencia por tipo
  }
}
```

**Error Handler mejorado:**
```typescript
// src/middlewares/error-handler.middleware.ts
export function errorHandler(error: any, req: Request, res: Response, next: NextFunction) {
  Logger.error('Error en request', error, {
    method: req.method,
    url: req.url,
    body: req.body,
  });

  if (res.headersSent) {
    return next(error);
  }

  // Determinar statusCode según tipo de error
  const statusCode = error.statusCode || 500;
  
  // En producción, no exponer detalles técnicos
  const message = config.server.isProduction && statusCode === 500
    ? "Internal Server Error"
    : error.message;

  res.status(statusCode).json({ 
    message,
    ...(config.server.isDevelopment && { stack: error.stack })
  });
}
```

---

## 📊 Resumen de Problemas Encontrados

| Archivo | Problema | Líneas Aprox |
|---------|----------|--------------|
| carpeta.controller.ts | Error en .catch() no propaga | 88-94 |
| servicio.controller.ts | res.status(500) manual | 16 |
| archivo.controller.ts | 4 casos de res.status(500) | 162, 197, 434, 454 |
| cv-public.controller.ts | 2 casos de res.status(500) | 55, 80 |
| permission.controller.ts | 2 casos de res.status(500) | 355, 374 |
| soportes-secure.controller.ts | 2 casos de res.status(500) | 102, 122 |
| pacientes-coosalud.controller.ts | 1 caso de res.status(500) | 510 |

**Total:** ~76 controladores, ~12 con problemas detectados (~16% tienen issues)

---

## 🛠️ Plan de Acción

1. **Crear clases de errores personalizados** (custom-errors.ts)
2. **Mejorar error-handler.middleware.ts** para diferenciar tipos
3. **Refactorizar controladores problemáticos** (empezar por los críticos)
4. **Crear utilidad de validación** para reducir boilerplate
5. **Documentar convenciones** de error handling

¿Comenzamos con el paso 1?
