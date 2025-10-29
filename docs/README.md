# 📚 Sistema de Documentación de Roles y Permisos

Este directorio contiene la documentación oficial sobre roles y permisos del sistema Nordvital.

## 📋 Archivos en este directorio

### 1. `QUICK_REFERENCE.md` ⚡ **¡EMPIEZA AQUÍ!**
**Para:** Todos - Primera consulta rápida

**Contenido:**
- Guía de decisión rápida "¿Qué rol asignar?"
- Permisos críticos resumidos
- Problemas comunes y soluciones
- Referencia de 1 página

**Cuándo usar:** Cuando necesites una respuesta rápida sin leer toda la documentación.

---

### 2. `DECISION_TREE.md` 🌳
**Para:** Asignación de roles paso a paso

**Contenido:**
- Árbol de decisión visual
- Flujo de preguntas para elegir rol
- Decisión por departamento
- Checklist de verificación

**Cuándo usar:** Cuando no estés seguro qué rol asignar a un usuario nuevo.

---

### 3. `ROLES_AND_PERMISSIONS.md` 📖 **DOCUMENTACIÓN COMPLETA**
**Para:** Coordinador de Sistemas, Asistente Administrativa, Personal de RRHH

**Contenido:**
- Listado completo de roles del sistema con sus IDs
- Matriz detallada de permisos por módulo
- Tablas visuales de qué puede hacer cada rol
- Notas importantes para asignación de roles
- Guía de uso en lenguaje no técnico

**Cuándo usar:**
- Al crear un nuevo usuario
- Al cambiar el rol de un usuario existente
- Para consultar qué permisos tiene un rol específico
- Para explicar a un usuario qué puede o no puede hacer

---

### 4. `PRINTABLE_MATRIX.md` 🖨️
**Para:** Consulta offline o impresión

**Contenido:**
- Matriz simplificada de roles y permisos
- Formato optimizado para imprimir
- Leyenda de roles
- Decisión rápida

**Cuándo usar:** Para tener referencia física o consultar sin computadora.

---

### 5. `SWAGGER_ROLES_GUIDE.md` 🔧
**Para:** Desarrolladores

**Contenido:**
- Convención para documentar roles en Swagger
- Templates reutilizables
- Ejemplos de documentación por tipo de acceso
- Códigos de respuesta estándar para autenticación/autorización

**Cuándo usar:**
- Al crear nuevos endpoints
- Al modificar permisos de endpoints existentes
- Para mantener consistencia en la documentación Swagger

---

## 🚀 Cómo usar esta documentación

### Para Personal Administrativo (Coordinador/Asistente):

**Flujo recomendado:**

```
1. QUICK_REFERENCE.md (consulta rápida)
   └─► ¿No encontraste la respuesta?
       └─► 2. DECISION_TREE.md (guía paso a paso)
           └─► ¿Necesitas más detalle?
               └─► 3. ROLES_AND_PERMISSIONS.md (documentación completa)
```

**Ejemplo de uso:**
```
Pregunta: "¿Puede un Radicador eliminar usuarios?"

Paso 1: Abrir QUICK_REFERENCE.md
Paso 2: Buscar "Permisos Críticos" → "Solo Administrador"
Paso 3: Ver que "Eliminar usuarios" es 🔴 solo Admin
Respuesta: ❌ NO, el Radicador NO puede eliminar usuarios
```

---

### Para Desarrolladores:

1. **Consultar `SWAGGER_ROLES_GUIDE.md`** para la convención
2. **Usar los templates** al documentar nuevos endpoints
3. **Actualizar `ROLES_AND_PERMISSIONS.md`** cuando:
   - Agregues nuevos endpoints
   - Modifiques permisos de roles
   - Crees nuevos roles

---

## 🔄 Mantenimiento

### Responsabilidades:

**Coordinador de Sistemas:**
- ✅ Consultar la documentación antes de asignar roles
- ✅ Reportar si un rol necesita más o menos permisos
- ✅ Validar que la documentación refleje la realidad del sistema
- ✅ Usar `PRINTABLE_MATRIX.md` como referencia rápida

**Asistente Administrativa:**
- ✅ Usar `QUICK_REFERENCE.md` para asignaciones comunes
- ✅ Consultar `DECISION_TREE.md` para casos nuevos
- ✅ Documentar razones de cambios de roles

**Desarrolladores:**
- ✅ Actualizar `ROLES_AND_PERMISSIONS.md` al hacer cambios en permisos
- ✅ Seguir `SWAGGER_ROLES_GUIDE.md` al documentar endpoints
- ✅ Revisar la documentación al menos una vez al mes
- ✅ Notificar al equipo administrativo sobre cambios importantes

### Proceso de actualización:

```bash
# 1. Hacer cambios en el código (agregar/modificar endpoints)
git add src/routes/

# 2. Actualizar la documentación correspondiente
git add docs/ROLES_AND_PERMISSIONS.md
git add docs/SWAGGER_ROLES_GUIDE.md  # si aplica

# 3. Commit con descripción clara
git commit -m "feat: agregar endpoint X con acceso para rol Y

- Actualizada matriz de permisos
- Documentado en Swagger"

# 4. Push a develop
git push origin develop

# 5. Notificar al Coordinador de Sistemas
```

---

## 🎯 Casos de Uso Comunes

### Caso 1: Crear un nuevo usuario

```
1. Preguntar: ¿Qué va a hacer este usuario en el sistema?
2. Usar DECISION_TREE.md para seguir el flujo
3. Confirmar con QUICK_REFERENCE.md
4. Asignar el rol correspondiente
5. Verificar con el checklist final
```

**Ejemplo:**
- Nuevo empleado para crear radicados → Seguir árbol → Rol **Radicador (ID: 10)**
- Nuevo empleado de soporte técnico → Seguir árbol → Rol **Soporte (ID: 17)**
- Nuevo coordinador de área → Seguir árbol → Rol **Coordinador (ID: 6)**

---

### Caso 2: Un usuario reporta "No tengo permisos"

```
1. Identificar QUÉ está intentando hacer
2. Abrir QUICK_REFERENCE.md → "SOS - Problemas Comunes"
3. ¿Está en la lista? → Aplicar solución
4. ¿No está? → Consultar ROLES_AND_PERMISSIONS.md
5. Buscar la funcionalidad en la tabla correspondiente
6. Verificar si su rol actual tiene acceso
7. Tomar decisión:
   - ¿Es correcto que no tenga acceso? → Explicar al usuario
   - ¿Debería tener acceso? → Cambiar su rol o reportar al desarrollo
```

---

### Caso 3: Agregar un nuevo módulo/funcionalidad

```
Desarrollador debe:

1. Implementar el código
2. Definir qué roles tendrán acceso
3. Actualizar ROLES_AND_PERMISSIONS.md:
   - Agregar nueva sección de módulo
   - Crear tabla de permisos
   - Documentar cada funcionalidad
4. Actualizar QUICK_REFERENCE.md si es un permiso crítico
5. Documentar en Swagger siguiendo SWAGGER_ROLES_GUIDE.md
6. Actualizar PRINTABLE_MATRIX.md
7. Commit y push
8. Notificar al Coordinador de Sistemas sobre los cambios
```

---

## 📞 Contacto y Soporte

**Dudas sobre roles y permisos:**
- Coordinador de Sistemas
- Equipo de Desarrollo

**Sugerencias de mejora a la documentación:**
- Crear un issue en el repositorio
- Contactar al equipo de desarrollo

**Urgencias (usuario bloqueado):**
1. Verificar rol actual
2. Consultar QUICK_REFERENCE.md
3. Contactar Coordinador de Sistemas si el rol es incorrecto

---

## 📝 Historial de Cambios

| Fecha | Cambio | Responsable |
|-------|--------|-------------|
| 2025-10-28 | Creación de documentación inicial completa | Equipo de Desarrollo |
| | - Matriz de roles y permisos | |
| | - Guía rápida | |
| | - Árbol de decisión | |
| | - Matriz imprimible | |
| | - Guía Swagger | |

---

## 🔗 Enlaces Rápidos

- [⚡ Guía Rápida](./QUICK_REFERENCE.md) - Consulta de 5 minutos
- [🌳 Árbol de Decisión](./DECISION_TREE.md) - ¿Qué rol asignar?
- [📖 Documentación Completa](./ROLES_AND_PERMISSIONS.md) - Referencia total
- [🖨️ Matriz Imprimible](./PRINTABLE_MATRIX.md) - Para imprimir
- [🔧 Guía Swagger](./SWAGGER_ROLES_GUIDE.md) - Para desarrolladores

---

**Última actualización:** 28 de octubre de 2025  
**Versión:** 1.0
