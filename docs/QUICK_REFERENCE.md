# 🚀 Guía Rápida de Roles - Nordvital

> **Referencia rápida para asignación de roles**

## 🎯 Decisión Rápida: ¿Qué rol asignar?

### Por función principal:

| ¿Qué hará el usuario? | Rol a asignar | ID |
|----------------------|---------------|:--:|
| Administrar TODO el sistema | Administrador | 1 |
| Gestionar usuarios y ver reportes | Gerente | 2 |
| Radicar, Auditar y y reporte radicados | Auditor | 3 |
| Ver inventarios (solo consulta) | Calidad | 4 |
| Usar el sistema básicamente (perfil) | Auxiliar | 5 |
| Gestionar inventarios y radicados | Coordinador | 6 |
| Crear y gestionar radicados | Radicador | 10 |
| Atender consultas (SIAU) | Siau | 11 |
| Gestión de contratación | Contratación | 12 |
| Ver inventarios de su sede | Médico | 13 |
| Aprobar permisos (primer nivel) | Jefe | 14 |
| Gestionar cirugías y radicados | Cirugía | 15 |
| Perfil básico | Paramédico | 16 |
| Gestionar tickets técnicos | Soporte | 17 |
| Aprobar permisos finales (vacaciones) | RRHH | 18 |
| Gestionar demanda inducida | Enfermería | 19 |
| Gestionar demanda inducida + metas | Coordinadora Enfermería | 20 |
| Gestionar demanda inducida + crear metas | Líder Enfermería | 21 |

---

## ⚡ Permisos Críticos

### 🔴 Solo Administrador (ID: 1)
- ❌ **Eliminar** usuarios
- ❌ **Eliminar** radicados
- ❌ **Eliminar** lugares de radicación
- ❌ Gestión completa de equipos
- ❌ Gestión completa de celulares
- ❌ Gestión completa de categorías
- ❌ Gestión completa de prioridades
- ❌ Gestión de cargos y áreas

### 🟡 Administrador + Gerente (IDs: 1, 2)
- Crear/editar/listar usuarios
- Gestionar lugares de radicación

### 🟢 Administrador + Auditor (IDs: 1, 3)
- Auditar radicados
- Autorizar servicios

---

## 📊 Módulos Especializados

### Radicación
- **Crear:** Admin, Auditor, Radicador, Cirugía, Coordinador
- **Autorizar:** Solo Admin y Auditor
- **Eliminar:** Solo Admin

### Inventarios
- **General:** Admin y Coordinador (gestión)
- **Consulta:** Calidad y Médico (solo ver)

### Permisos/Vacaciones
- **Crear solicitud:** Todos los usuarios
- **Aprobar (Jefe):** Jefe
- **Aprobar (RRHH):** RRHH
- **Ver adjuntos:** Admin, Gerente, Auditor, Jefe, RRHH

### Demanda Inducida y Metas
- **Exclusivo:** Enfermería, Coordinadora Enfermería, Líder Enfermería
- **Crear metas:** Solo Coordinadora y Líder
- **Eliminar metas:** Solo Admin y Coordinadora

### Tickets de Soporte
- **Crear:** Todos
- **Gestionar:** Solo Admin
- **Ver tabla:** Admin y Soporte

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
2. **SIEMPRE** consulta la documentación completa antes de crear roles personalizados
3. **VERIFICA** que el rol asignado tenga sentido con las funciones del usuario
4. **DOCUMENTA** si cambias un rol de un usuario (por qué y cuándo)

---

## 🆘 SOS - Problemas Comunes

### "El usuario no puede crear radicados"
**Verificar:** ¿Tiene rol Radicador (10), Cirugía (15), Coordinador (6), Auditor (3) o Admin (1)?

### "No puedo eliminar un usuario"
**Respuesta:** Solo Administrador puede eliminar. ¿Eres Admin?

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

**Versión:** 1.0  
**Fecha:** 28 de octubre de 2025
