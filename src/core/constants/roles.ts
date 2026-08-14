/**
 * Roles que tienen acceso global a todas las carpetas del sistema
 * independientemente del departamento al que pertenezcan
 */
export const GLOBAL_FOLDER_ACCESS_ROLES = [
  "Jefe",
  "Gerente",
  "Administrador",
  "Coordinador",
  "Coordinadora Enfermeria",
  "Calidad",
  "RRHH"
];

/**
 * IDs de roles del sistema, tal como están en la base de datos.
 * Usar siempre estas constantes en lugar de strings literales en las rutas.
 */
export const ROLE_IDS = {
  ADMINISTRADOR:              '1',
  GERENTE:                    '2',
  AUDITOR:                    '3',
  CALIDAD:                    '4',
  AUXILIAR:                   '5',
  COORDINADOR:                '6',
  RADICADOR:                  '10',
  SIAU:                       '11',
  CONTRATACION:               '12',
  MEDICO:                     '13',
  JEFE:                       '14',
  CIRUGIA:                    '15',
  PARAMEDICO:                 '16',
  SOPORTE:                    '17',
  RRHH:                       '18',
  ENFERMERIA:                 '19',
  COORDINADORA_ENFERMERIA:    '20',
  LIDER_ENFERMERIA:           '21',
  COORDINADOR_INFRAESTRUCTURA:'22',
  AUXILIAR_INFRAESTRUCTURA:   '23',
  COORDINADOR_SST:            '24',
  AUXILIAR_SST:               '25',
} as const;

/**
 * Grupos de roles predefinidos para usar como argumento de authorizeRoles().
 * Al crear un nuevo rol, solo hay que agregarlo en ROLE_IDS y en los grupos
 * que corresponda — las rutas que usen el grupo se actualizan automáticamente.
 */
export const ROLE_GROUPS = {
  /** Todos los roles del sistema */
  ALL: Object.values(ROLE_IDS),

  /** Solo administración general */
  MANAGEMENT: [
    ROLE_IDS.ADMINISTRADOR,
    ROLE_IDS.GERENTE,
  ],

  // RADICAR
  RADICACION: [
    ROLE_IDS.ADMINISTRADOR,
    ROLE_IDS.RADICADOR,
    ROLE_IDS.AUDITOR,
    ROLE_IDS.CIRUGIA,
    ROLE_IDS.COORDINADOR,
    ROLE_IDS.GERENTE,
  ],

  // Auditar y cirugias
  AUDIT: [
    ROLE_IDS.ADMINISTRADOR,
    ROLE_IDS.AUDITOR,
    ROLE_IDS.GERENTE
  ],

  /** Administración + RRHH */
  MANAGEMENT_HR: [
    ROLE_IDS.ADMINISTRADOR,
    ROLE_IDS.GERENTE,
    ROLE_IDS.RRHH,
  ],

  /** Gestión de documentos y carpetas (Calidad actúa como gestor documental) */
  DOCUMENT_MANAGERS: [
    ROLE_IDS.ADMINISTRADOR,
    ROLE_IDS.CALIDAD,
  ],

  /** Equipo de enfermería */
  NURSING: [
    ROLE_IDS.ENFERMERIA,
    ROLE_IDS.COORDINADORA_ENFERMERIA,
    ROLE_IDS.LIDER_ENFERMERIA,
  ],

  /** Equipo de infraestructura y soporte técnico */
  INFRA: [
    ROLE_IDS.SOPORTE,
    ROLE_IDS.COORDINADOR_INFRAESTRUCTURA,
    ROLE_IDS.AUXILIAR_INFRAESTRUCTURA,
  ],

  /** Administrador + Soporte técnico */
  ADMIN_SUPPORT: [
    ROLE_IDS.ADMINISTRADOR,
    ROLE_IDS.SOPORTE,
  ],

  /** Administrador + Cirugías únicamente */
  ADMIN_SURGERY: [
    ROLE_IDS.ADMINISTRADOR,
    ROLE_IDS.CIRUGIA,
  ],

  /** Administrador + Cirugías + Auditor */
  SURGERY_AUDIT: [
    ROLE_IDS.ADMINISTRADOR,
    ROLE_IDS.CIRUGIA,
    ROLE_IDS.AUDITOR,
  ],

  /** Gestores de inventario (Admin, Gerente, Soporte) */
  INVENTORY_MANAGERS: [
    ROLE_IDS.ADMINISTRADOR,
    ROLE_IDS.GERENTE,
    ROLE_IDS.SOPORTE,
  ],

  /** Visualizadores de inventario por sede (Admin, Gerente, Calidad, Soporte) */
  INVENTORY_VIEWERS: [
    ROLE_IDS.ADMINISTRADOR,
    ROLE_IDS.GERENTE,
    ROLE_IDS.CALIDAD,
    ROLE_IDS.SOPORTE,
  ],

  /** Catálogo de inventario (Admin, Coordinador, Calidad) */
  INVENTORY_CATALOG: [
    ROLE_IDS.ADMINISTRADOR,
    ROLE_IDS.COORDINADOR,
    ROLE_IDS.CALIDAD,
  ],

  /** Inventario completo — todos los gestores de inventario */
  INVENTORY_FULL: [
    ROLE_IDS.ADMINISTRADOR,
    ROLE_IDS.COORDINADOR,
    ROLE_IDS.CALIDAD,
    ROLE_IDS.GERENTE,
    ROLE_IDS.SOPORTE,
  ],

  /** Aprobadores de solicitudes de permisos/vacaciones (sin Gerente) */
  APPROVAL_MANAGERS: [
    ROLE_IDS.ADMINISTRADOR,
    ROLE_IDS.COORDINADOR,
    ROLE_IDS.COORDINADORA_ENFERMERIA,
    ROLE_IDS.RRHH,
  ],

  /** Aprobadores de solicitudes de permisos/vacaciones (con Gerente) */
  APPROVAL_MANAGERS_FULL: [
    ROLE_IDS.ADMINISTRADOR,
    ROLE_IDS.COORDINADOR,
    ROLE_IDS.COORDINADORA_ENFERMERIA,
    ROLE_IDS.RRHH,
    ROLE_IDS.GERENTE,
  ],

  /** Administrador + equipo de enfermería */
  ADMIN_NURSING: [
    ROLE_IDS.ADMINISTRADOR,
    ROLE_IDS.ENFERMERIA,
    ROLE_IDS.COORDINADORA_ENFERMERIA,
    ROLE_IDS.LIDER_ENFERMERIA,
  ],

  /** Administrador + Gerente + equipo de enfermería */
  ADMIN_NURSING_MANAGEMENT: [
    ROLE_IDS.ADMINISTRADOR,
    ROLE_IDS.GERENTE,
    ROLE_IDS.ENFERMERIA,
    ROLE_IDS.COORDINADORA_ENFERMERIA,
    ROLE_IDS.LIDER_ENFERMERIA,
  ],

  /** Infraestructura completa (Administrador + ambos roles de infra) */
  INFRA_MANAGEMENT: [
    ROLE_IDS.ADMINISTRADOR,
    ROLE_IDS.COORDINADOR_INFRAESTRUCTURA,
    ROLE_IDS.AUXILIAR_INFRAESTRUCTURA,
  ],

  /** Administración de infraestructura (Administrador + Coordinador infra) */
  INFRA_ADMIN: [
    ROLE_IDS.ADMINISTRADOR,
    ROLE_IDS.COORDINADOR_INFRAESTRUCTURA,
  ],

  /** SST completa (Administrador + ambos roles de SST) */
  SST_MANAGEMENT: [
    ROLE_IDS.ADMINISTRADOR,
    ROLE_IDS.COORDINADOR_SST,
    ROLE_IDS.AUXILIAR_SST,
  ],

  /** Administración de SST (Administrador + Coordinador SST) */
  SST_ADMIN: [
    ROLE_IDS.ADMINISTRADOR,
    ROLE_IDS.COORDINADOR_SST,
  ],

  /** Radicación + enfermería completa (sin Gerente) */
  RADICACION_NURSING: [
    ROLE_IDS.ADMINISTRADOR,
    ROLE_IDS.AUDITOR,
    ROLE_IDS.RADICADOR,
    ROLE_IDS.CIRUGIA,
    ROLE_IDS.COORDINADOR,
    ROLE_IDS.ENFERMERIA,
    ROLE_IDS.COORDINADORA_ENFERMERIA,
    ROLE_IDS.LIDER_ENFERMERIA,
  ],

  /** Gestores de reportes (Admin, Auditor, Coordinador, Jefe, Cirugía) */
  REPORT_MANAGERS: [
    ROLE_IDS.ADMINISTRADOR,
    ROLE_IDS.AUDITOR,
    ROLE_IDS.COORDINADOR,
    ROLE_IDS.JEFE,
    ROLE_IDS.CIRUGIA,
  ],

  COORDINADORES: [
    ROLE_IDS.ADMINISTRADOR,
    ROLE_IDS.CALIDAD,
    ROLE_IDS.COORDINADOR,
    ROLE_IDS.COORDINADOR_INFRAESTRUCTURA,
    ROLE_IDS.COORDINADOR_SST,
    ROLE_IDS.COORDINADORA_ENFERMERIA,
  ],

  SIAU: [
    ROLE_IDS.ADMINISTRADOR,
    ROLE_IDS.SIAU,
    ROLE_IDS.CALIDAD,
    ROLE_IDS.COORDINADOR,
    ROLE_IDS.COORDINADOR_INFRAESTRUCTURA,
    ROLE_IDS.COORDINADOR_SST,
    ROLE_IDS.COORDINADORA_ENFERMERIA,
  ],

  /** Colaboradores del módulo PQRSDF (Administración, SIAU, Calidad y Coordinadores) */
  PQRSDF_COLLABORATORS: [
    ROLE_IDS.ADMINISTRADOR,
    ROLE_IDS.SIAU,
    ROLE_IDS.CALIDAD,
    ROLE_IDS.COORDINADOR,
    ROLE_IDS.COORDINADOR_INFRAESTRUCTURA,
    ROLE_IDS.COORDINADOR_SST,
    ROLE_IDS.COORDINADORA_ENFERMERIA,
  ],

  SEARCH_PATIENTS: [
    ROLE_IDS.ADMINISTRADOR,
    ROLE_IDS.AUDITOR,
    ROLE_IDS.SIAU,
    ROLE_IDS.RADICADOR,
    ROLE_IDS.CALIDAD,
    ROLE_IDS.CIRUGIA,
    ROLE_IDS.COORDINADOR,
    ROLE_IDS.ENFERMERIA,
    ROLE_IDS.COORDINADORA_ENFERMERIA,
    ROLE_IDS.COORDINADOR_INFRAESTRUCTURA,
    ROLE_IDS.LIDER_ENFERMERIA,
    ROLE_IDS.COORDINADOR_SST,
  ]

} as const;
