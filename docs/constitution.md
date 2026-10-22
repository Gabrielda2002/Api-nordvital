# Constitución — api-nordvital

1. **Stack mínimo y cero code slop**: Express 5, TypeORM, MySQL. Prohibido agregar dependencias sin autorización, sobreingeniería, wrappers redundantes o código muerto.
2. **Spec antes que código**: Todo cambio no trivial requiere spec previa aprobada. No se escribe código sin spec.
3. **Lógica separada de interfaz**: Los controllers solo orquestan HTTP; la lógica de negocio reside en services/entidades. Un controller no define reglas de dominio.
4. **Tests obligatorios**: Toda funcionalidad nueva debe incluir tests automatizados para el camino feliz y al menos un caso de error.
5. **Persistencia por migración**: `synchronize: false` permanente. Cambios de esquema exclusivamente por migraciones manuales en `src/migrations/`.
6. **Idioma**: Código en inglés (identificadores, propiedades en `camelCase`, columnas en `snake_case`). Mensajes de respuesta de la API y documentación en español.
