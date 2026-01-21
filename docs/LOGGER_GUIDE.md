# Guía de Uso del Logger

## ✅ Importación

```typescript
import Logger from '../utils/logger-wrapper';
```

## 📝 Métodos Disponibles

### `Logger.info(message, meta?)`
Para información general, inicios de procesos, configuraciones.

```typescript
Logger.info('Servidor iniciado correctamente');
Logger.info('Usuario autenticado', { userId: user.id, email: user.email });
```

### `Logger.error(message, error?, meta?)`
Para errores y excepciones. **Siempre usar para catch blocks**.

```typescript
Logger.error('Error al procesar solicitud', error);
Logger.error('Fallo en autenticación', error, { userId: 123 });
```

### `Logger.warn(message, meta?)`
Para advertencias, situaciones no ideales pero no críticas.

```typescript
Logger.warn('Token próximo a expirar', { userId: user.id });
Logger.warn('Límite de intentos alcanzado', { ip: req.ip });
```

### `Logger.debug(message, meta?)`
Para información de debugging (solo visible en desarrollo).

```typescript
Logger.debug('Valor de variable', { variable: value });
Logger.debug('Estado de transacción', { step: 3, data });
```

### `Logger.http(message, meta?)`
Para logs específicos de peticiones HTTP.

```typescript
Logger.http('Request recibido', { method: 'POST', url: '/api/users' });
```

## ❌ NO USAR

```typescript
console.log()    // ❌ Usar Logger.info() o Logger.debug()
console.error()  // ❌ Usar Logger.error()
console.warn()   // ❌ Usar Logger.warn()
```

## 🎯 Cuándo Usar Cada Nivel

| Nivel | Cuándo Usarlo |
|-------|---------------|
| **info** | Eventos importantes del ciclo de vida de la app |
| **error** | Errores que requieren atención inmediata |
| **warn** | Situaciones anormales que no son errores |
| **debug** | Información detallada para debugging |
| **http** | Logs de peticiones/respuestas HTTP |

## 🔒 Seguridad

El logger automáticamente **redacta campos sensibles**:
- `password`
- `token`
- `authorization`

No necesitas preocuparte por filtrar estos campos manualmente.

## 📁 Archivos de Log

Los logs se guardan en:
- `logs/error-{fecha}.log` - Solo errores
- `logs/combined-{fecha}.log` - Todos los niveles
- `logs/api-{fecha}.log` - Solo HTTP (producción)

Rotación automática diaria.

## 💡 Mejores Prácticas

1. **Incluir contexto relevante en `meta`**
   ```typescript
   Logger.error('Error actualizando usuario', error, { 
     userId: user.id, 
     action: 'update_profile' 
   });
   ```

2. **Mensajes descriptivos**
   ```typescript
   // ✅ Bien
   Logger.info('Usuario creado exitosamente', { userId: newUser.id });
   
   // ❌ Mal
   Logger.info('Ok');
   ```

3. **Loggear en puntos clave**
   - Inicio/fin de procesos importantes
   - Antes/después de operaciones críticas
   - Todos los catch blocks
   - Decisiones de negocio importantes

4. **No loggear en loops intensivos**
   ```typescript
   // ❌ Mal
   items.forEach(item => {
     Logger.debug('Procesando item', { item }); // Genera miles de logs
   });
   
   // ✅ Bien
   Logger.info(`Procesando ${items.length} items`);
   // ... proceso
   Logger.info('Items procesados exitosamente');
   ```

## 🚀 Migración de console.log a Logger

| Antes | Ahora |
|-------|-------|
| `console.log('mensaje')` | `Logger.info('mensaje')` |
| `console.error(error)` | `Logger.error('mensaje', error)` |
| `console.warn('aviso')` | `Logger.warn('aviso')` |
| `console.log(objeto)` | `Logger.debug('mensaje', objeto)` |

---

**Fecha de creación**: 2025-12-22
**Responsable**: Equipo Backend
