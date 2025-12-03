# 🚀 Guía Rápida de Roles - Nordvital

> **Referencia rápida para asignación de roles**

## Permisos Genéricos
**Estos permisos los tiene absolutamente todos los usuarios:**

- **Actualizar datos en el perfil**
- **Cargar/eliminar una foto de perfil**
- **Ver eventos en calendario**
- **Consultar el panel de consultas**
- **Registrar Pausas Activas**
- **Crear ticket soporte al área de Sistemas**
- **Ver notificaciones**
- **Encuestas de satisfacción**
- **Ver comentarios del ticket**
- **Ver Carpetas del Sistema de calidad del departamento del usuario**
- **Crear/ver solicitudes de permiso**

## 🎯 Decisión Rápida: ¿Qué rol asignar?

### Por función principal:

| ¿Qué hará el usuario? | Rol a asignar | ID |
|----------------------|---------------|:--:|
| Administrar TODO el sistema | Administrador | 1 |
| Ver todos los modulos menos Usuarios | Gerente | 2 |
| Radicar, Auditar servicios y cirugias y reportes (radicado, cirugías y gestión auxiliar) | Auditor | 3 |
| Control total Sistema Gestión de Calidad | Calidad | 4 |
| (Por definir si es necesario) | Auxiliar | 5 |
| Gestionar inventarios (Inventario General), radicador, cartas de recobro y reportes (radicado, cirugías, pausas activas y biométricos) | Coordinador | 6 |
| Crear radicados y solicitudes cartas de recobro | Radicador | 10 |
| (Por definir si es necesario) | Siau | 11 |
| (Por definir si es necesario) | Contratación | 12 |
| Accesos genéricos | Médico | 13 |
| Reportes (radicado y cirugías) | Jefe | 14 |
| Gestionar cirugías, radicar y reportes de cirugías | Cirugía | 15 |
| (Definir si es necesario) | Paramédico | 16 |
| Gestionar tickets y de todo el inventario | Soporte | 17 |
| Solicitudes de permisos (chequear y autorizar vacaciones) y biométricos de entrada | RRHH | 18 |
| Gestionar demanda inducida y limitado a sus propios datos | Enfermería | 19 |
| Gestionar demanda inducida + crear metas + filtro responsable | Coordinadora Enfermería | 20 |
| Gestionar demanda inducida + crear metas y limitado datos de su sede | Líder Enfermería | 21 |

---

## ⚡ Permisos Críticos

### 🔴 Solo Administrador (ID: 1)
- ❌ Gestión completa de tablas de radicación
- ❌ Gestión completa de Usuarios
- ❌ Gestión completa de equipos
- ❌ Gestión completa de Dispositivos Red
- ❌ Gestión completa de celulares
- ❌ Gestión completa de Televisores
- ❌ Gestión de cargos y áreas

---

## 📊 Módulos Especializados

### Radicación
- **Crear:** Admin, Auditor, Radicador, Cirugía, Coordinador
- **Autorizar:** Solo Admin y Auditor
- **Eliminar:** Solo Admin

### Cartas de recobro
- **Crear Solicitudes:** Admin, Radicador, Coordinador
- **Autorizar:** Solo Admin y Coordinador
- **Eliminar:** Solo Admin

## Biométricos
- **Consultar tabla de registros:** Admin y RRHH
- **Eliminar y cargar:** Solo Admin

### Inventarios
- **Equipos:** Solo Admin y Soporte
- **Dispositivos Red:** Solo Admin y Soporte
- **Celulares:** Solo Admin y Soporte
- **Televisores:** Solo Admin y Soporte
- **General:** Admin, Soporte y Coordinador (gestión completa)
- **Consulta:** Calidad y Gerente (solo ver)

### Permisos
- **Crear solicitud:** Todos los usuarios
- **Aprobar (Jefe):** Jefe
- **Aprobar/visto (RRHH):** RRHH
- **Ver adjuntos:** Todos los usuarios
- **Ver "Mis Solicitudes":** Todos los usuarios

### Demanda Inducida y Metas
- **Exclusivo:** Enfermería, Coordinadora Enfermería, Líder Enfermería
- **Crear metas:** Solo Coordinadora y Líder
- **Datos globales DI:** Solo Coordinadora 
- **Datos sede actual:** Solo Lider Enfermeria
- **Eliminar metas:** Solo Admin

### Tickets de Soporte
- **Crear:** Todos
- **Gestionar:** Solo Admin y Soporte

### Gestión de Calidad
- **Ver:** Todos los usuarios
- **Crear/cargar:** Calidad y Admin
- **Eliminar:** Calidad y Admin
- **Editar:** Calidad y Admin
---

## 🔑 Acceso Global a Carpetas

Estos roles tienen acceso a **todas las carpetas** independiente del departamento:
- ✅ Administrador
- ✅ Gerente
- ✅ Jefe
- ✅ Coordinador
- ✅ Coordinadora Enfermería
- ✅ Calidad

---

## ⚠️ Reglas de Oro

1. **NUNCA** asignes Administrador sin autorización del Coordinador
3. **VERIFICA** que el rol asignado tenga sentido con las funciones del usuario
4. **DOCUMENTA** si cambias un rol de un usuario (por qué y cuándo)

---

## 🆘 SOS - Problemas Comunes

### "El usuario no puede crear radicados"
**Verificar:** ¿Tiene rol Radicador (10), Cirugía (15), Coordinador (6), Auditor (3) o Admin (1)?

### "No veo los inventarios"
**Verificar:** ¿Tienes rol Admin (1), Coordinador (6), Calidad (4) o Médico (13)?

### "No puedo aprobar permisos"
**Verificar:** 
- Permisos normales → Necesitas rol Jefe (14)
- Vacaciones → Necesitas rol RRHH (18)

### "No puedo crear tickets"
**Respuesta:** Todos los usuarios autenticados pueden crear tickets. Verifica tu sesión.

---

## 📖 Para más información

- Documentación completa: [`ROLES_AND_PERMISSIONS.md`](./ROLES_AND_PERMISSIONS.md)
- Guía para desarrolladores: [`SWAGGER_ROLES_GUIDE.md`](./SWAGGER_ROLES_GUIDE.md)
- Índice general: [`README.md`](./README.md)

---

**Versión:** 1.0.2
**Fecha:** 3 de diciembre de 2025
